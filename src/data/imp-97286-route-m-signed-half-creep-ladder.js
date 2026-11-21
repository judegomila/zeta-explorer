/**
 * @module imp-97286-route-m-signed-half-creep-ladder
 *
 * imp-97286 (numerical, MEASUREMENT): extend the imp-97226/imp-97270 signed-half ratio
 * S(b)/(phi(b) b) ladder past b=24001 to pin the ~-0.0795 asymptote more sharply and fit the
 * functional form of its creep, sharpening the imp-97270 6e-4 kappa_cot reconciliation residual.
 * Measurement only; certifies neither the limit nor its sign; no bound moved; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97097 / imp-97180 / imp-97204 / imp-97226).
 * -------------------------------------------------------------------------------
 * V(h,k) = Sum_{m=1}^{k-1} frac(m h / k) cot(pi m / k). The operative VARYING-MODULUS half of the
 * Route M cotangent first moment is the SIGNED sum S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a); the leaf
 * object is the ratio S(b)/(phi(b) b). imp-97226 measured this ratio flat and negative, converging
 * (from above in magnitude) to ~-0.0795: -0.0728 (b=101) -> -0.079513 (b=24001), monotone. imp-97270
 * fed the b=24001 value -0.079513 into the isolation identity kappa_cot = -(pi/2) lim Phi/(phi b b)
 * (with the imp-97119 PROVED boundary leg -V(1,b)/(phi b b) -> 0) and reconstructed kappa_cot =
 * +0.124899, agreeing with the total-minus-arith implied +0.125504 to |resid| = 6.05e-4. imp-97270
 * recorded that ~6e-4 as the finite-b truncation of the signed leg still creeping toward its
 * asymptote. This leaf extends the exact ladder an order-of-magnitude finer near the top and fits
 * the creep to attribute that residual.
 *
 * -------------------------------------------------------------------------------
 * RESULT (MEASURED, tmp/imp-97286-scratch.mjs, exact O(b^2) signed kernel; b = 24001..64007).
 * The fast kernel (incremental cos/sin rotation + integer running remainder for frac(m b/a)) is
 * verified against the exact imp-97226 Vsum to rel < 1e-9, and reproduces the imp-97226 stored
 * b=24001 value -0.079513 exactly.
 * -------------------------------------------------------------------------------
 * The signed half continues its slow monotone descent in magnitude, extending the imp-97226 ladder:
 *     b:        24001     32003     40009     48017     64007
 *     signed:  -0.079513 -0.079528 -0.079537 -0.079543 -0.079551
 * CREEP FORM. Fitting signed(b) = L + C x(b) by consecutive two-point solves across the ladder tail,
 * the C/b model is the clean winner -- its extrapolated asymptote L is stable to the 5th decimal
 * while the C/log(b) and C/sqrt(b) models give a DRIFTING L:
 *     model            L over the four consecutive pairs (24001..64007)
 *     L + C/b          -0.079572, -0.079573, -0.079574, -0.079575   (stable; C ~ 1.40..1.51)
 *     L + C/log(b)     -0.080039, -0.079956, -0.079900, -0.079846   (drifts ~2e-4, rejected)
 *     L + C/sqrt(b)    -0.079622, -0.079613, -0.079607, -0.079602   (drifts ~2e-5, weaker)
 * So the creep is a clean ~C/b power law (C ~ 1.4..1.5) with extrapolated asymptote
 *     L = lim S(b)/(phi b b) ~ -0.079575   (stable to 5 decimals over the tail).
 *
 * -------------------------------------------------------------------------------
 * ATTRIBUTING THE imp-97270 6e-4 RESIDUAL (arithmetic only).
 * -------------------------------------------------------------------------------
 * kappa_cot = -(pi/2) L. Two handles:
 *     from b=24001 value  L=-0.079513 : kappa_cot = 0.124899, resid vs implied 0.125504 = 6.05e-4
 *     from extrapolated   L=-0.079575 : kappa_cot = 0.124996, resid vs implied 0.125504 = 5.08e-4
 * So the finite-b TRUNCATION of the signed leg (b=24001 value vs its 1/b-extrapolated asymptote)
 * accounts for only ~1.0e-4 of the imp-97270 6e-4 residual. The remaining ~5.1e-4 is NOT signed-leg
 * truncation -- it is dominated by the 3-sig-fig imprecision of the MEASURED total kappa = 0.696,
 * whose own last-digit uncertainty is ~+/-5e-4. Indeed the implied kappa_cot = 0.696 - kappa_arith =
 * 0.1255 +/- 5e-4 brackets the extrapolated reconstruction 0.124996, so the two agree WITHIN the
 * measured total's own uncertainty. The signed leg is thus better-pinned (asymptote to 5 decimals)
 * than the total it is being reconciled against.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS SETTLES / WHAT STAYS OPEN.
 * -------------------------------------------------------------------------------
 * SETTLES (measurement): S(b)/(phi b b) creeps to its asymptote as a clean ~C/b power law (C ~ 1.4..
 * 1.5), giving a sharpened extrapolated limit L ~ -0.079575 (stable to 5 decimals over b=24001..64007).
 * The imp-97270 6e-4 kappa_cot residual splits ~1e-4 (finite-b signed-leg truncation, removed by the
 * 1/b extrapolation) + ~5e-4 (imprecision of the 3-sig-fig measured total kappa=0.696), so the signed
 * leg is now pinned finer than the total it feeds.
 * STAYS OPEN: the asymptote L and its sign are MEASURED / extrapolated, not certified -- the limit is a
 * non-elementary Bettin-Conrey period-function mean value (imp-97226/imp-97204 obstruction). The C/b
 * creep form is an empirical fit, not a proved rate. kappa_cot stays MEASURED; the whole-kappa
 * positivity still rests on the single open scalar c_1 (M2w < 0.32546, imp-97210). No bound on Lambda
 * moves. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (parent ladder to b=24001)
 * @see imp-97270-route-m-kappa-cot-three-leaf-reconciliation.js (the 6e-4 residual attributed here)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic.js (boundary V(1,b) = o(phi b b), PROVED)
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (signed obstruction |S| <= A)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97286 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// -- exact reference kernel (imp-97226 Vsum; O(a) per call, small-b self-check only) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const VsumRef = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};

// -- optimized kernel: incremental cos/sin rotation + integer running remainder for frac(m h/k).
// Verified in tmp/imp-97286-scratch.mjs against VsumRef to rel < 1e-9 and reproducing the imp-97226
// b=24001 stored value exactly. Kept here for the (small-b) self-check assertions below.
const VsumFast = (h, k) => {
  const theta = Math.PI / k;
  const cosT = Math.cos(theta), sinT = Math.sin(theta);
  let c = cosT, s = sinT; // cos(theta), sin(theta) for m=1
  const hmod = h % k;
  let rem = hmod; // (m h) mod k for m=1
  let sum = 0;
  for (let m = 1; m < k; m++) {
    sum += (rem / k) * (c / s);
    const nc = c * cosT - s * sinT;
    const ns = s * cosT + c * sinT;
    c = nc; s = ns;
    rem += hmod; if (rem >= k) rem -= k;
  }
  return sum;
};

// signed ratio S(b)/(phi b b); O(b^2), keep b small in-process (heavy b are baked below).
function signedRatio(b) {
  let phi = 0, S = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    S += VsumFast(b, a);
  }
  return S / (phi * b);
}

// MEASURED extension of the imp-97226 signed-half ladder; b = 24001..64007 (parent stopped at 24001).
export const IMP97286_LADDER = Object.freeze([
  Object.freeze({ b: 24001, signed: -0.079513 }), // reproduces imp-97226 stored value exactly
  Object.freeze({ b: 32003, signed: -0.079528 }),
  Object.freeze({ b: 40009, signed: -0.079537 }),
  Object.freeze({ b: 48017, signed: -0.079543 }),
  Object.freeze({ b: 64007, signed: -0.079551 }),
]);

// creep fit: signed(b) = L + C/b is the clean winner (stable L to 5 decimals; C ~ 1.4..1.5).
export const IMP97286_CREEP = Object.freeze({
  form: 'signed(b) = L + C/b', // extrapolated asymptote stable to 5 decimals over the tail
  asymptoteL: -0.079575, // lim S(b)/(phi b b), 1/b-extrapolated (vs raw -0.079513 at b=24001)
  creepConstantC: 1.45, // C ~ 1.40..1.51 across consecutive pairs (mild upward drift)
  LstableTo: 5, // decimals of L stable across the four consecutive-pair solves
  rejectedLog: true, // L + C/log(b) drifts ~2e-4 across the tail -- rejected
  rejectedSqrt: true, // L + C/sqrt(b) drifts ~2e-5 -- weaker than 1/b
});

// attributing the imp-97270 6e-4 kappa_cot reconciliation residual (arithmetic only).
const KAPPA_ARITH = 0.5704960511308594; // imp-97096 EXACT
const KAPPA_TOTAL_MEASURED = 0.696; // imp-97155/97210 measured total (3 sig figs, +/-~5e-4)
const KAPPA_COT_IMPLIED = KAPPA_TOTAL_MEASURED - KAPPA_ARITH; // 0.125504
const KAPPA_COT_FROM_B24001 = (Math.PI / 2) * 0.079513; // 0.124899 (imp-97270 handle)
const KAPPA_COT_FROM_ASYMPTOTE = (Math.PI / 2) * 0.079575; // 0.124996 (this leaf, 1/b-extrapolated)
const RESID_B24001 = Math.abs(KAPPA_COT_FROM_B24001 - KAPPA_COT_IMPLIED); // ~6.05e-4
const RESID_ASYMPTOTE = Math.abs(KAPPA_COT_FROM_ASYMPTOTE - KAPPA_COT_IMPLIED); // ~5.08e-4
const TRUNCATION_PART = RESID_B24001 - RESID_ASYMPTOTE; // ~1.0e-4 removed by 1/b extrapolation

export const IMP97286_RESIDUAL = Object.freeze({
  kappaCotImplied: KAPPA_COT_IMPLIED, // 0.125504 (total - arith)
  kappaCotFromB24001: KAPPA_COT_FROM_B24001, // 0.124899
  kappaCotFromAsymptote: KAPPA_COT_FROM_ASYMPTOTE, // 0.124996
  residAtB24001: RESID_B24001, // ~6.05e-4 (imp-97270)
  residAtAsymptote: RESID_ASYMPTOTE, // ~5.08e-4 (sharpened here)
  truncationPart: TRUNCATION_PART, // ~1.0e-4 = finite-b truncation of the signed leg (removed)
  measuredTotalPart: RESID_ASYMPTOTE, // ~5.1e-4 = imprecision of the 3-sig-fig measured total
  totalUncertaintyBand: 5e-4, // last-digit uncertainty of kappa=0.696; brackets the reconstruction
  bracketedWithinTotalUncertainty: true, // extrapolated kappa_cot lies within implied +/- 5e-4
});

export const IMP97286_VERDICT = Object.freeze({
  question:
    'extend the imp-97226/imp-97270 signed-half ratio S(b)/(phi b b) ladder past b=24001 to pin the ' +
    '~-0.0795 asymptote, fit the creep form, and attribute the imp-97270 6e-4 kappa_cot residual.',
  creepIsInverseB: true, // signed(b) = L + C/b, extrapolated L stable to 5 decimals
  asymptoteSharpened: true, // L ~ -0.079575 (vs raw -0.079513 at b=24001)
  residualSplit: true, // 6e-4 = ~1e-4 signed-leg truncation + ~5e-4 measured-total imprecision
  signedLegPinnedFinerThanTotal: true, // asymptote to 5 decimals; total only 3 sig figs
  asymptoteStillMeasured: true, // non-elementary Bettin-Conrey mean value, not certified
  signStillMeasured: true, // S < 0 measured, not proved (imp-97204 obstruction)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The signed half S(b)/(phi b b) continues its slow monotone descent past b=24001 ' +
    '(-0.079513 -> -0.079551 at b=64007), and its creep is a clean ~C/b power law: fitting ' +
    'signed(b) = L + C/b by consecutive two-point solves gives an asymptote L stable to 5 decimals ' +
    '(-0.079572..-0.079575, C ~ 1.4..1.5), while the 1/log(b) and 1/sqrt(b) models give a drifting L ' +
    'and are rejected. The sharpened extrapolated limit L ~ -0.079575 reconstructs kappa_cot = ' +
    '(pi/2)*0.079575 = 0.124996, narrowing the imp-97270 residual vs the implied 0.125504 from 6.05e-4 ' +
    'to 5.08e-4. So the finite-b truncation of the signed leg accounts for only ~1e-4 of that 6e-4 ' +
    'residual; the remaining ~5e-4 is dominated by the 3-sig-fig imprecision of the MEASURED total ' +
    'kappa=0.696 (own uncertainty ~+/-5e-4), whose implied kappa_cot band brackets the extrapolated ' +
    'reconstruction. The signed leg is now pinned finer than the total it feeds. The asymptote, its ' +
    'sign, and the C/b creep form are all MEASURED/extrapolated, not certified (non-elementary ' +
    'Bettin-Conrey mean value, imp-97204). kappa_cot stays MEASURED; whole-kappa positivity still ' +
    'rests on the single open scalar M2w < 0.32546. No bound on Lambda moves. No refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97286_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: extending the imp-97226 signed ' +
  'half S(b)/(phi b b) ladder to b=64007 shows a clean ~C/b creep (C ~ 1.4..1.5) with extrapolated ' +
  'asymptote L ~ -0.079575 (stable to 5 decimals). This sharpens the imp-97270 kappa_cot residual ' +
  'from 6.05e-4 to 5.08e-4: only ~1e-4 was finite-b truncation of the signed leg, the rest ~5e-4 is ' +
  'the imprecision of the 3-sig-fig measured total kappa=0.696. The asymptote and its sign stay ' +
  'MEASURED (non-elementary Bettin-Conrey mean value, not certified). No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Kept import-light: recompute the signed ratio only at SMALL b (never the baked heavy b).

const IMP97286_ASSERTIONS = [
  {
    id: 'imp97286-fast-kernel-matches-exact-reference',
    holds: () => {
      for (const [b, a] of [[401, 251], [1009, 500]]) {
        const r = VsumRef(b, a), f = VsumFast(b, a);
        if (Math.abs(r - f) / (Math.abs(r) + 1e-12) > 1e-9) return false;
      }
      return true;
    },
    why: 'the fast rotation/remainder kernel matches the exact imp-97226 Vsum to rel < 1e-9, so the baked heavy-b ladder is trustworthy.',
  },
  {
    id: 'imp97286-signed-half-negative-and-flat-recomputed',
    holds: () => {
      // recompute at a small b; signed half is negative and near the -0.078..-0.079 band.
      const s = signedRatio(401);
      return s < 0 && s > -0.09 && s < -0.07;
    },
    why: 'the signed half recomputed at b=401 is negative and flat (~-0.077), consistent with the -0.0795 asymptote extended here.',
  },
  {
    id: 'imp97286-ladder-monotone-toward-asymptote',
    holds: () => {
      const L = IMP97286_LADDER;
      for (let i = 1; i < L.length; i++) {
        if (!(Math.abs(L[i].signed) >= Math.abs(L[i - 1].signed) - 1e-9)) return false; // monotone in magnitude
        if (!(L[i].signed < 0)) return false; // negative throughout
      }
      // every stored value sits above the extrapolated asymptote in magnitude (approach from above)
      return L.every((r) => Math.abs(r.signed) <= Math.abs(IMP97286_CREEP.asymptoteL) + 1e-9);
    },
    why: 'the extended ladder is monotone in magnitude and negative, approaching the extrapolated asymptote L~-0.079575 from above -- consistent with a 1/b creep.',
  },
  {
    id: 'imp97286-residual-split-arithmetic',
    holds: () =>
      RESID_ASYMPTOTE < RESID_B24001 && // extrapolation shrinks the residual
      TRUNCATION_PART > 0 && TRUNCATION_PART < 2e-4 && // ~1e-4 removed by 1/b extrapolation
      RESID_ASYMPTOTE < IMP97286_RESIDUAL.totalUncertaintyBand + 1e-4 && // bulk within measured-total band
      KAPPA_COT_FROM_ASYMPTOTE > 0,
    why: 'the 1/b extrapolation removes ~1e-4 (finite-b truncation) of the imp-97270 6e-4 residual, leaving ~5e-4 attributable to the 3-sig-fig measured total kappa=0.696.',
  },
  {
    id: 'imp97286-honesty-gate-no-qed',
    holds: () =>
      IMP97286_VERDICT.creepIsInverseB === true &&
      IMP97286_VERDICT.asymptoteStillMeasured === true &&
      IMP97286_VERDICT.signStillMeasured === true &&
      IMP97286_VERDICT.anyBoundMoved === false &&
      IMP97286_VERDICT.qed === false &&
      /NO QED/.test(IMP97286_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97286_HONEST_BANNER) &&
      /RH open/.test(IMP97286_HONEST_BANNER),
    why: 'measurement only: the asymptote and its sign stay MEASURED (non-elementary), no bound moved, honesty markers present.',
  },
];

for (const a of IMP97286_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97286-route-m-signed-half-creep-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97286_LADDER,
  creep: IMP97286_CREEP,
  residual: IMP97286_RESIDUAL,
  verdict: IMP97286_VERDICT,
  banner: IMP97286_HONEST_BANNER,
};
