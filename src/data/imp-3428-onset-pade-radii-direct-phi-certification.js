/**
 * @module imp-3428-onset-pade-radii-direct-phi-certification
 * @fileoverview imp-3428 -- CERTIFY the imp-3383 higher-Pade accuracy-radii ladder
 *   (T3, P11, T4, P21, P12, P22 at 1% and 0.1% relative error) by an INDEPENDENT
 *   direct finite-eps evaluation of phi = G/F, confirming the reported radii, the
 *   [2/1]-beats-T4 crossover, and the [2/2] gain against phi ITSELF.
 *
 *   WHAT imp-3383 DID, AND THE HONEST CORRECTION.
 *   ---------------------------------------------
 *   The ticket premise is that imp-3383 computed its radii "from the reconstructions,
 *   not benchmarked against a direct evaluation of phi." Reading imp-3383 shows this
 *   is NOT quite right: its relErr already benchmarks each reconstruction against
 *       S_TRUE(eps) = phi(s0+eps) eps^2 / C   [direct finite-eps evaluation of phi],
 *   so its radii are ALREADY direct-phi radii. What imp-3383 did NOT do is (a) guard
 *   S_TRUE against catastrophic floating-point cancellation near the s0 double pole,
 *   nor (b) reproduce the bisection radii by an independent fine explicit eps-grid
 *   scan. This module supplies both, CERTIFYING (not correcting) the ladder.
 *
 *   ROUTE A -- CANCELLATION-SAFE DIRECT PHI.
 *   imp-3383 uses F(s0+eps) = cosh(s0+eps) - sqrt2 - (s0+eps) + arcsinh1, which loses
 *   digits near eps=0 because cosh(s0+eps) -> sqrt2. Expanding about s0 (cosh s0=sqrt2,
 *   sinh s0=1, e^{-s0}=sqrt2-1) gives the algebraically-equal but cancellation-SAFE
 *       F(s0+eps) = sqrt2*(cosh(eps)-1) + (sinh(eps)-eps),   cosh(eps)-1 = 2 sinh^2(eps/2),
 *       G(s0+eps) = G0 - (sqrt2-1)*expm1(-eps),               G0 = 1-arcsinh1.
 *   Over the whole radii window [0.01,1.5] the two evaluations of S(eps) agree to
 *   ~1.3e-12, so the imp-3383 direct-phi benchmark is NOT corrupted by cancellation in
 *   the range where the radii live -- the direct-phi radii are trustworthy.
 *
 *   ROUTE B -- FINE EXPLICIT eps-GRID RADII (independent of bisection).
 *   Walking eps on a uniform 1e-5 grid and recording the first crossing of each tolerance
 *   against the SAFE direct phi reproduces every imp-3383 anchor to ~5 digits:
 *       T3  1% 0.27057  0.1% 0.11463    P11 1% 0.27341  0.1% 0.10936
 *       T4  1% 0.59577  0.1% 0.31652    P21 1% 0.72393  0.1% 0.36603
 *       P12 1% 0.64773  0.1% 0.31067    P22 1% 1.36630  0.1% 0.77953
 *   The [2/1]-beats-T4 crossover is CONFIRMED against phi itself (P21 1% 0.72393 >
 *   T4 1% 0.59577, ~+21.5%), as is the [2/2] jump to ~1.366. So the imp-3383 ladder
 *   stands as reported, now certified by two independent direct-phi routes.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION ONLY, NO QED, RH-EQUIVALENT. This re-measures accuracy radii of a
 *   rational reconstruction of the imp-3064 degree-0 scalar onset signature against a
 *   direct evaluation of phi; it neither proves nor weakens RH. The off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is
 *   untouched. No refereed bound is changed.
 *
 *   @see imp-3383-onset-third-order-higher-pade.js (the ladder being certified)
 *   @see imp-3325-onset-pade-resummation.js (the [1/1] Pade)
 *   @see imp-3422-onset-coefficient-certification.js (A3/A4 certification)
 *
 *   Ticket: imp-3428 (accuracy, medium).
 */

const ASINH1 = Math.asinh(1);   // s0: sinh(s0)=1, cosh(s0)=sqrt(2), e^{-s0}=sqrt2-1
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;
const C = SQRT2 * (1 - ASINH1);  // phi ~ C/(s-s0)^2
const G0 = 1 - ASINH1;           // G(s0)

// Onset-signature coefficients (imp-3155/imp-3222/imp-3383 closed forms).
const A1 = (SQRT2 - 1) / G0 - SQRT2 / 6;                 // ~+3.25605
const A2 = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;         // ~-2.59666
const A3 = (2 * SQRT2 + 1) / (36 * G0) + 11 * SQRT2 / 1080;               // ~+0.91088
const A4 = (SQRT2 - 1) / G0 * (-1 / 36 - 19 * SQRT2 / 1080) - 7 / 6480;   // ~-0.18495

// -- ROUTE A: two evaluations of the direct onset signature S(eps) ------------
// imp-3383 direct route (loses digits near the s0 double pole).
const F_RAW = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;
const G_RAW = (s) => SQRT2 - ASINH1 - Math.exp(-s);
const S_DIRECT = (eps) => (G_RAW(S0 + eps) / F_RAW(S0 + eps)) * eps * eps / C;

// Cancellation-safe route (algebraically identical, stable at small eps).
const coshm1 = (x) => { const t = Math.sinh(x / 2); return 2 * t * t; };  // cosh(x)-1
const F_SAFE = (eps) => SQRT2 * coshm1(eps) + (Math.sinh(eps) - eps);
const G_SAFE = (eps) => G0 - (SQRT2 - 1) * Math.expm1(-eps);
const S_SAFE = (eps) => (G_SAFE(eps) / F_SAFE(eps)) * eps * eps / C;

// Largest relative discrepancy between the two direct-phi evaluations on the radii window.
const maxDirectVsSafe = (() => {
  let m = 0;
  for (let e = 0.01; e <= 1.5 + 1e-12; e += 0.01) {
    const r = Math.abs(S_DIRECT(e) - S_SAFE(e)) / Math.abs(S_SAFE(e));
    if (r > m) m = r;
  }
  return m;
})();

// -- The six reconstructions (same closed forms as imp-3383) ------------------
const T3 = (e) => 1 + A1 * e + A2 * e * e;
const T4 = (e) => 1 + A1 * e + A2 * e * e + A3 * e * e * e;
const C11 = -A2 / A1, B11 = A1 + C11;
const P11 = (e) => (1 + B11 * e) / (1 + C11 * e);
const Q1_21 = -A3 / A2, P1_21 = A1 + Q1_21, P2_21 = A2 + A1 * Q1_21;
const P21 = (e) => (1 + P1_21 * e + P2_21 * e * e) / (1 + Q1_21 * e);
const Q1_12 = (A1 * A2 - A3) / (A2 - A1 * A1), Q2_12 = -(A2 + A1 * Q1_12), P1_12 = A1 + Q1_12;
const P12 = (e) => (1 + P1_12 * e) / (1 + Q1_12 * e + Q2_12 * e * e);
const DET_22 = A2 * A2 - A1 * A3;
const Q1_22 = (-A2 * A3 + A1 * A4) / DET_22, Q2_22 = (-A2 * A4 + A3 * A3) / DET_22;
const P1_22 = A1 + Q1_22, P2_22 = A2 + A1 * Q1_22 + Q2_22;
const P22 = (e) => (1 + P1_22 * e + P2_22 * e * e) / (1 + Q1_22 * e + Q2_22 * e * e);

// -- ROUTE B: fine explicit eps-grid radius vs the SAFE direct phi ------------
const relSafe = (fn, e) => Math.abs(fn(e) - S_SAFE(e)) / Math.abs(S_SAFE(e));
const GRID_STEP = 1e-5;
const gridRadius = (fn, tol) => {
  for (let e = GRID_STEP; e <= 3; e += GRID_STEP) {
    if (relSafe(fn, e) >= tol) return e - GRID_STEP;
  }
  return 3;
};

const R = Object.freeze({
  T3: { p1: gridRadius(T3, 0.01), p01: gridRadius(T3, 0.001) },
  P11: { p1: gridRadius(P11, 0.01), p01: gridRadius(P11, 0.001) },
  T4: { p1: gridRadius(T4, 0.01), p01: gridRadius(T4, 0.001) },
  P21: { p1: gridRadius(P21, 0.01), p01: gridRadius(P21, 0.001) },
  P12: { p1: gridRadius(P12, 0.01), p01: gridRadius(P12, 0.001) },
  P22: { p1: gridRadius(P22, 0.01), p01: gridRadius(P22, 0.001) },
});

// imp-3383 published anchors (the values being certified).
const IMP3383_ANCHORS = Object.freeze({
  T3: { p1: 0.27058, p01: 0.11463 }, P11: { p1: 0.27342, p01: 0.10937 },
  T4: { p1: 0.59578, p01: 0.31653 }, P21: { p1: 0.72394, p01: 0.36604 },
  P12: { p1: 0.64774, p01: 0.31068 }, P22: { p1: 1.36630, p01: 0.77953 },
});

export const IMP3428_ONSET_PADE_RADII_DIRECT_PHI_CERTIFICATION = Object.freeze({
  id: 'imp-3428-onset-pade-radii-direct-phi-certification',
  ticket: 'imp-3428',
  certifies: 'imp-3383-onset-third-order-higher-pade.js',

  summary:
    'CERTIFIES the imp-3383 higher-Pade accuracy-radii ladder by an INDEPENDENT direct finite-eps ' +
    'evaluation of phi=G/F. Honest correction: imp-3383 already benchmarked its radii against a ' +
    'direct phi (its S_TRUE), so this certifies rather than corrects. Route A shows a ' +
    'cancellation-SAFE phi (expm1/sinh^2(eps/2) forms) agrees with the imp-3383 direct evaluation to ' +
    '~1.3e-12 across the radii window, so the direct-phi benchmark is not spoiled by cancellation ' +
    'near the s0 double pole. Route B reproduces every anchor to ~5 digits by a fine explicit ' +
    'eps-grid scan (independent of imp-3383 bisection) and confirms the [2/1]>T4 crossover ' +
    '(0.72393 vs 0.59577, ~+21.5%) and the [2/2] jump to ~1.366 against phi ITSELF. ' +
    'CERTIFICATION only, no QED, RH-EQUIVALENT; the imp-3066 operator step is untouched.',

  routeA_cancellationSafePhi: Object.freeze({
    note: 'Two algebraically-identical evaluations of S(eps)=phi(s0+eps) eps^2/C: the imp-3383 ' +
          'direct form (F=cosh(s0+eps)-sqrt2-(s0+eps)+arcsinh1) vs a cancellation-safe form ' +
          '(F=sqrt2*(cosh eps-1)+(sinh eps-eps), G=G0-(sqrt2-1)expm1(-eps)).',
    maxRelDiffOnRadiiWindow: maxDirectVsSafe,   // ~1.3e-12 on [0.01,1.5]
    conclusion: 'direct-phi benchmark is trustworthy in the radii range',
  }),

  routeB_fineGridRadii: Object.freeze({
    note: 'First-breach eps on a uniform 1e-5 grid, benchmarked against the SAFE direct phi ' +
          '(independent of the imp-3383 bisection).',
    gridStep: GRID_STEP,
    radii: R,
    anchors: IMP3383_ANCHORS,
  }),

  crossover: Object.freeze({
    pade21Beats4TermPolynomialAt1pct: R.P21.p1 > R.T4.p1,
    pade21OverT4At1pct: R.P21.p1 / R.T4.p1,     // ~1.215
    pade22ReachesAbove1: R.P22.p1 > 1,
    statement:
      'The [2/1] Pade 1% direct-phi radius (0.72393) exceeds its SAME-order 4-term polynomial ' +
      '(0.59577) by ~21.5%, and the [2/2] reaches ~1.366 -- both crossovers CONFIRMED against a ' +
      'direct evaluation of phi, certifying the imp-3383 ladder.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isCertificationOnly: true,
    correctsImp3383: false,
    operatorStepUntouched:
      'Re-measures Pade accuracy radii of a rational reconstruction of the imp-3064 degree-0 scalar ' +
      'onset signature against a direct evaluation of phi; the off-diagonal endpoint-Hankel operator ' +
      'step (imp-3066) remains the lone obstruction and is NOT addressed.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3428_ONSET_PADE_RADII_DIRECT_PHI_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp3428-cancellation-safe-phi-matches-direct',
    why: 'The cancellation-safe evaluation of the onset signature must agree with the imp-3383 ' +
         'direct form to ~1e-10 across the whole radii window [0.01,1.5]; a larger gap would mean ' +
         'the imp-3383 direct-phi benchmark was silently corrupted by cancellation near the pole.',
    holds: () => maxDirectVsSafe < 1e-10,
  },
  {
    id: 'imp3428-fine-grid-radii-reproduce-imp3383-anchors',
    why: 'A fine explicit eps-grid scan against the SAFE direct phi (independent of the imp-3383 ' +
         'bisection) must reproduce all six 1% and 0.1% radius anchors to within the 1e-5 grid ' +
         'resolution; a drift would flag a mis-transcribed reconstruction or anchor.',
    holds: () => {
      for (const k of ['T3', 'P11', 'T4', 'P21', 'P12', 'P22']) {
        if (Math.abs(R[k].p1 - IMP3383_ANCHORS[k].p1) > 2e-5) return false;
        if (Math.abs(R[k].p01 - IMP3383_ANCHORS[k].p01) > 2e-5) return false;
      }
      return true;
    },
  },
  {
    id: 'imp3428-pade21-beats-same-order-polynomial-against-phi',
    why: 'The headline crossover must survive direct-phi certification: the [2/1] Pade 1% radius ' +
         '(~0.724) must exceed its SAME-order 4-term polynomial (~0.596) by at least 15%, measured ' +
         'on the fine grid against phi itself.',
    holds: () => R.P21.p1 > 1.15 * R.T4.p1,
  },
  {
    id: 'imp3428-pade22-reaches-above-one',
    why: 'The [2/2] gain must certify: its 1% direct-phi radius (~1.366) must exceed 1, well past ' +
         'every lower-order comparator, confirming the imp-3383 [2/2] jump.',
    holds: () => R.P22.p1 > 1 && R.P22.p1 > R.P21.p1,
  },
  {
    id: 'imp3428-honest-rh-equivalent-certification-only',
    why: 'Mandatory honesty: this is a certification/accuracy-radius re-measurement, RH-EQUIVALENT, ' +
         'not a proof, not a reduction below RH, leaves the operator step untouched, and no refereed bound is changed' +
         '. If any flip, the module over-claims.',
    holds: () => {
      const c = IMP3428_ONSET_PADE_RADII_DIRECT_PHI_CERTIFICATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isCertificationOnly === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3428_ONSET_PADE_RADII_DIRECT_PHI_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3428-onset-pade-radii-direct-phi-certification assertion failed: ${a.id}`);
}

export default IMP3428_ONSET_PADE_RADII_DIRECT_PHI_CERTIFICATION;
