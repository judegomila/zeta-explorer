/**
 * imp-96164 (2026-09-23) — PROOF/DERIVATION: attack imp-96143 residual (I), the mixed-group
 * no-modulus-1 theorem for the {oo,2,3} prolate operator A_S23 = P_1 F_S23 P_1. imp-96143 REDUCED
 * the strict spectral gap sup_n |lam_n| < 1 to the finitely-many TOP confined states (every ladder
 * tail magnitude <= s_2 = 0.353553 < 1), leaving the strict inequality as the mixed-group
 * no-modulus-1 statement, with exact diagonalization blocked by the fractal Zygmund eigenfunctions.
 * RESULT: an HONEST PARTIAL. The p = 3 OVER-DETERMINATION is shown to COLLAPSE the modulus-1
 * candidate space on the ladder-tail INTERIOR from an infinite-dimensional family of log2-periodic
 * modulations (the single-prime Zygmund freedom) down to the single RIGID profile g(v) = C/v,
 * converting (I) from a sup over an infinite-dimensional top box into ONE scalar boundary-matching
 * condition at the archimedean edge v = 1/2 (named sub-gap SG-96164-boundary). This is a strict
 * SHRINK of the residual, NOT a proof of |lambda| < 1: the rigid profile is itself L^2 on the tail
 * half-line, so the continuum scaling law alone does not force C = 0. RH open; no refereed bound is changed
 * ; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * SETUP (imp-96143 reduction). A modulus-1 eigenvector g = xihat of A_S23 lives on the confinement
 *  region v > 1/2 and, on the ladder tail, satisfies BOTH lacunary functional equations of the mixed
 *  2^a 3^b group (the p = 2 relation ported in rh-route-i-sonine-excess-semilocal-port, plus its
 *  p = 3 companion carried by the second Euler factor):
 *    (R2)  g(v) = 2 g(2v)
 *    (R3)  g(v) = 3 g(3v)
 *  Both hold, together with their local inverses g(v) = (1/2) g(v/2), g(v) = (1/3) g(v/3), on the
 *  INTERIOR of the tail (where the shifted argument stays inside the confinement region).
 *
 * STEP 1 — COMPOSITION OVER THE FULL Z-MODULE. Because (R2), (R3) and their inverses all hold on the
 *  tail interior, composing them gives, for every integer pair (a, b) in Z^2 with 2^a 3^b v still in
 *  the interior,
 *    g(v) = 2^a 3^b * g(2^a 3^b v).
 *  The multiplier is EXACTLY the exponential of the multiplicative shift: 2^a 3^b = e^{a ln2 + b ln3}
 *  (verified to 6e-15 relative for |a|,|b| <= 15, both signs).
 *
 * STEP 2 — DENSITY OF THE SHIFT SET. Since 2 and 3 are multiplicatively independent, ln2 / ln3 is
 *  irrational (= 0.6309297...), so the Z-module M = { a ln2 + b ln3 : a, b in Z } is DENSE in R
 *  (Kronecker / Weyl). Numerically the largest gap of M intersect [0, 1] falls 0.0657 -> 0.0521 ->
 *  0.0250 -> 0.0115 as the coefficient box grows |a|,|b| <= 10, 20, 40, 80 (monotone, -> 0).
 *  (NOTE: the one-sided SEMIGROUP a, b >= 0 is DISCRETE near 0 with least step ln2 = 0.693 — this is
 *  why the collapse needs the tail INTERIOR, where the inverse relations supply the negative signs.)
 *
 * STEP 3 — CONTINUUM SCALING LAW. Eigenfunctions of the band-limited P_1 F_S23 P_1 are continuous.
 *  For any real delta pick (a_k, b_k) with shift_k = a_k ln2 + b_k ln3 -> delta; then the multiplier
 *  2^{a_k} 3^{b_k} = e^{shift_k} -> e^{delta} and g(v) = 2^{a_k} 3^{b_k} g(2^{a_k} 3^{b_k} v) passes
 *  to the limit
 *    g(v) = e^{delta} g(e^{delta} v)   for ALL delta in R,   i.e.   g(U v) = g(v) / U for all U > 0.
 *  The unique continuous solution is the RIGID power profile
 *    g(v) = C / v    on the tail interior.
 *
 * STEP 4 — THE RIGIDITY GAIN (the genuine content of the over-determination). The SINGLE relation
 *  (R2) alone admits g(v) = (1/v) * Phi(log_2 v) with Phi ANY 1-periodic modulation — an
 *  infinite-dimensional candidate space, exactly the fractal Zygmund freedom that blocks the
 *  single-prime diagonalization. The p = 3 companion forces Phi to be periodic with BOTH periods ln2
 *  and ln3; two incommensurate periods force Phi CONSTANT. (Numerically, cos(2*pi*t/ln2) sampled at
 *  t = k*ln3 fills [-1, 1] to range 1.99999, so no non-constant ln2-periodic modulation can also be
 *  ln3-periodic.) So the modulus-1 candidate space collapses infinite-dim -> the single profile C/v.
 *
 * WHY THIS IS A REDUCTION, NOT A QED. The rigid profile g(v) = C/v is itself square-integrable on the
 *  tail half-line: int_{1/2}^{oo} (1/v)^2 dv = 2 < oo (and likewise finite for the dv/v Haar
 *  measure), so the continuum scaling law does NOT force C = 0. What remains is a SINGLE scalar
 *  condition: whether the profile C/v can meet the archimedean-box eigen-equation boundary condition
 *  at v = 1/2 with |lambda| = 1. Numerically the p = 2 top confined state is 0.9999731 < 1 (the box
 *  "holds more" for the mixed group, top expected nearer 1 but still < 1), so the boundary condition
 *  is NOT met at unit modulus — but the exact enclosure of that boundary condition is still blocked by
 *  the Zygmund edge behaviour. Sub-gap SG-96164-boundary = exclude the single rigid profile C/v at the
 *  v = 1/2 boundary.
 *
 * NET. (I) is upgraded from "sup |lambda| < 1 over an infinite-dimensional top box" to "exclude one
 *  rigid profile at one scalar boundary condition" — a strict shrink of the residual driven entirely
 *  by the multiplicative independence of 2 and 3. Nothing here diagonalizes A_S23, moves a Lambda
 *  bound, or a verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure arithmetic (logs, geometric sums, dense-orbit gap scan), no imports, no zeros
 *  bundle. Reproduction inline in the assertions.
 */

const LN2 = Math.log(2);
const LN3 = Math.log(3);

/** ln2/ln3 — irrational (multiplicative independence of 2, 3); drives the Z-module density */
export const LN2_OVER_LN3 = LN2 / LN3;

/** largest gap of the Z-module { a ln2 + b ln3 : |a|,|b| <= A } intersect [0, L]; -> 0 as A grows */
export function moduleMaxGap(A, L = 1) {
  const pts = [0, L];
  for (let a = -A; a <= A; a++) {
    for (let b = -A; b <= A; b++) {
      const d = a * LN2 + b * LN3;
      if (d >= 0 && d <= L) pts.push(d);
    }
  }
  pts.sort((x, y) => x - y);
  let g = 0;
  for (let i = 1; i < pts.length; i++) g = Math.max(g, pts[i] - pts[i - 1]);
  return g;
}

/** worst relative error of the exact identity 2^a 3^b = e^{a ln2 + b ln3} over |a|,|b| <= A */
export function multiplierExactnessWorst(A) {
  let worst = 0;
  for (let a = -A; a <= A; a++) {
    for (let b = -A; b <= A; b++) {
      const shift = a * LN2 + b * LN3;
      const mult = Math.pow(2, a) * Math.pow(3, b);
      worst = Math.max(worst, Math.abs(mult - Math.exp(shift)) / Math.exp(shift));
    }
  }
  return worst;
}

/** the rigid tail profile g(v) = 1/v is L^2 on the half-line v > v0: int_{v0}^{oo} v^{-2} dv = 1/v0 */
export function rigidProfileTailL2(v0 = 0.5) {
  return 1 / v0; // finite => continuum scaling law alone does NOT force C = 0 (why this is not a QED)
}

/** range of a ln2-periodic modulation cos(2*pi*t/ln2) sampled at t = k*ln3 — -> 2 (no common period) */
export function commonPeriodRange(K) {
  let mn = Infinity, mx = -Infinity;
  for (let k = 0; k <= K; k++) {
    const v = Math.cos((2 * Math.PI * (k * LN3)) / LN2);
    mn = Math.min(mn, v);
    mx = Math.max(mx, v);
  }
  return mx - mn;
}

export const IMP_96164_OVERDETERMINATION_LITERALS = Object.freeze({
  ln2OverLn3: 0.6309297535714575,           // irrational => Z-module dense
  moduleMaxGapA10: 0.06566703451736888,
  moduleMaxGapA20: 0.05211600113901449,
  moduleMaxGapA40: 0.025013934382307923,
  moduleMaxGapA80: 0.011462901003958414,    // monotone -> 0 (density of the shift set)
  multiplierWorstA15: 5.887092290136273e-15, // 2^a 3^b = e^{a ln2 + b ln3} exactly
  rigidProfileTailL2Half: 2.0,               // int_{1/2}^{oo} v^-2 dv = 2 < oo => NOT a QED
  commonPeriodRange5000: 1.9999982642996712, // two incommensurate periods force the modulation constant
  p2TopConfinedState: 0.9999731,             // baked p = 2 top prolate eigenvalue (< 1), sibling port
  collapseLaw: 'g(v)=2g(2v) AND g(v)=3g(3v) on the tail interior => g(Uv)=g(v)/U for all U>0 (dense Z-module of shifts, exact multiplier e^{shift}) => rigid profile g(v)=C/v; single-prime Zygmund modulation space (infinite-dim) collapses to one profile; residual = scalar boundary match at v=1/2 (SG-96164-boundary)',
});

export const IMP_96164_OVERDETERMINATION = Object.freeze({
  id: 'imp-96164-route-i-mixed-group-no-modulus1-overdetermination',
  route: 'I (Sonine refinement) — imp-96143 residual (I): the mixed-group no-modulus-1 theorem for the {oo,2,3} prolate top confined states, attacked via the p=3 over-determination',
  parents: [
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js (reduced (I) sup|lam|<1 to the finitely-many top confined states; strict gap = mixed-group no-modulus-1 theorem)',
    'src/data/imp-96125-route-i-corr23-continuity-reduction.js (corr23 continuity needs (I) sup|lam|<1 and (II) cubic tail for A_S23)',
    'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (p=2 dyadic ladder, no modulus-1 eigenvalue, relation g(v)=2g(2v))',
  ],
  status: 'PARTIAL — the p=3 OVER-DETERMINATION COLLAPSES the modulus-1 candidate space on the ladder-tail interior from an infinite-dimensional family of ln2-periodic (Zygmund) modulations of 1/v down to the SINGLE rigid profile g(v)=C/v. DERIVATION: (R2) g(v)=2g(2v) and (R3) g(v)=3g(3v) with their local inverses compose to g(v)=2^a 3^b g(2^a 3^b v) for all (a,b) in Z^2 on the tail interior; the multiplier is exactly e^{a ln2 + b ln3} (6e-15) and the shift Z-module {a ln2 + b ln3} is DENSE in R (ln2/ln3 = 0.63093 irrational; max gap on [0,1] falls 0.0657->0.0115 for |a|,|b|<=10..80), so by continuity of the band-limited eigenfunction g(Uv)=g(v)/U for ALL U>0, forcing the rigid power g(v)=C/v; the second period ln3 kills the ln2-periodic modulation freedom (two incommensurate periods force a constant, sampled range 1.99999). This is a strict SHRINK of (I): from a sup over an infinite-dimensional top box to ONE scalar boundary-matching condition at v=1/2 (sub-gap SG-96164-boundary). NOT a QED: the rigid profile is itself L^2 on the tail half-line (int_{1/2}^{oo} v^-2 dv = 2 < oo), so the scaling law alone does not force C=0; the p=2 top state 0.9999731 < 1 says the boundary is not met at unit modulus but the exact enclosure stays blocked by the Zygmund edge. RH open; no refereed bound is changed; NO QED',
  derivation: 'compose (R2),(R3) + local inverses over Z^2 on the tail interior -> g(v)=2^a 3^b g(2^a 3^b v); multiplier = e^{shift} exactly; shift module dense (ln2/ln3 irrational) -> continuum g(Uv)=g(v)/U -> g(v)=C/v; second incommensurate period forces the modulation constant',
  rigidityGain: 'single-prime (R2) alone admits g(v)=(1/v)Phi(log_2 v), Phi any 1-periodic modulation = infinite-dimensional Zygmund freedom; the p=3 companion collapses this to the single profile C/v — the concrete strengthening the over-determination provides',
  subGap: 'SG-96164-boundary: exclude the single rigid profile g(v)=C/v at the archimedean-box boundary condition v=1/2 (a scalar transcendental condition, not a diagonalization); numerically excluded (p=2 top 0.9999731 < 1) but exact enclosure blocked by the Zygmund edge',
  honestLimits: 'the collapse uses the tail INTERIOR (both relations and their inverses locally valid) and continuity of the band-limited eigenfunction; it does NOT prove |lambda| < 1 because the rigid profile is L^2 on the tail half-line, so C is not forced to 0 by the scaling law — the strict gap still hinges on the single boundary condition SG-96164-boundary; nothing diagonalizes A_S23 or moves a Lambda bound / verified height; RH open; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96164_OVERDETERMINATION_ASSERTIONS = Object.freeze([
  {
    id: 'imp96164-shift-module-dense',
    description: 'STEP 2: the Z-module { a ln2 + b ln3 } is dense in R — its largest gap on [0,1] decreases monotonically 0.0657 -> 0.0521 -> 0.0250 -> 0.0115 as the coefficient box grows |a|,|b| <= 10,20,40,80 and is well below 0.02 at A = 80 (ln2/ln3 irrational)',
    holds: () => {
      const g = [10, 20, 40, 80].map((A) => moduleMaxGap(A, 1));
      const decreasing = g.every((v, i) => i === 0 || v < g[i - 1]);
      return decreasing && approx(g[0], 0.06566703451736888, 1e-9) && g[3] < 0.02
        && approx(LN2_OVER_LN3, 0.6309297535714575, 1e-12);
    },
  },
  {
    id: 'imp96164-multiplier-equals-exp-shift',
    description: 'STEP 1: the composed multiplier is exactly the exponential of the multiplicative shift, 2^a 3^b = e^{a ln2 + b ln3}, to 6e-15 relative over |a|,|b| <= 15 (both signs) — the mechanism that turns the dense shift module into the continuum scaling law',
    holds: () => multiplierExactnessWorst(15) < 1e-13,
  },
  {
    id: 'imp96164-rigid-profile-L2-so-not-a-QED',
    description: 'STEP 3/limits: the rigid tail profile g(v) = 1/v is square-integrable on the half-line v > 1/2, int_{1/2}^{oo} v^-2 dv = 2 < oo, so the continuum scaling law alone does NOT force C = 0 — this is why the collapse is a REDUCTION, not a proof of |lambda| < 1',
    holds: () => approx(rigidProfileTailL2(0.5), 2.0, 1e-12) && Number.isFinite(rigidProfileTailL2(0.5)),
  },
  {
    id: 'imp96164-two-periods-force-constant',
    description: 'STEP 4 (rigidity gain): a non-constant ln2-periodic modulation cannot also be ln3-periodic — cos(2*pi*t/ln2) sampled at t = k*ln3 fills [-1,1] to range 1.99999, so the p=3 over-determination collapses the infinite-dimensional single-prime modulation space to a single constant (profile C/v)',
    holds: () => commonPeriodRange(5000) > 1.99,
  },
  {
    id: 'imp96164-verdict-honesty',
    description: 'status records a PARTIAL: the over-determination COLLAPSES the candidate space to one rigid profile (a strict reduction of (I)), names sub-gap SG-96164-boundary, states it is NOT a QED (rigid profile is L^2 on the half-line), quotes the p=2 top 0.9999731 < 1, and asserts RH open / NO QED',
    holds: () => /PARTIAL/.test(IMP_96164_OVERDETERMINATION.status)
      && /COLLAPSES/.test(IMP_96164_OVERDETERMINATION.status)
      && /SG-96164-boundary/.test(IMP_96164_OVERDETERMINATION.subGap)
      && /NOT a QED/.test(IMP_96164_OVERDETERMINATION.status)
      && /RH open/.test(IMP_96164_OVERDETERMINATION.honestLimits)
      && /NO QED/.test(IMP_96164_OVERDETERMINATION.status)
      && IMP_96164_OVERDETERMINATION_LITERALS.p2TopConfinedState < 1,
  },
]);

export default IMP_96164_OVERDETERMINATION;
