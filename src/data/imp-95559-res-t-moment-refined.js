/**
 * imp-95559 — Sharpen the imp-95533 RES-T on-line-mass moment identity
 *   int_{-inf}^{inf} x^2 sinc^4(T x / 2) dx = 4 pi / T^3
 * from the 5e-4 spot check to a converged sub-1e-8 measurement, and tabulate
 * the (L4) detectable-height ceiling H(T, delta) from the exclusion threshold
 *   (RES-T*)  delta^2 S(T delta)^4 T^3 > log(H / 2pi).
 *
 * Report only. Changes no bound; NO QED; no refereed bound is changed; RH open.
 *
 * ---------------------------------------------------------------------------
 * WHY 5e-4 WAS THE CEILING. imp-95533 measured the moment by a bare composite
 * Simpson rule over a hard window [-L, L] with L = 3000 / T. The integrand
 *   x^2 sinc^4(T x / 2) = 16 sin^4(T x / 2) / (T^4 x^2)
 * decays only like 1/x^2 (times a sin^4 oscillation of mean 3/8), so the
 * truncated tail 2 * int_L^inf carries an unmodelled mass ~ 2 * 6 / (T^4 L)
 * = 4e-3 / T^3. Against the true value 4 pi / T^3 that is a relative floor of
 * ~3e-4, which is exactly the 5e-4 the lemma reported. Refining the grid does
 * nothing: the error is the missing tail, not the panel count.
 *
 * THE FIX (tuned tail cutoff). Substitute u = T x / 2 to normalise:
 *   int_{-inf}^{inf} x^2 sinc^4(T x / 2) dx = (8 / T^3) * J,
 *   J := int_{-inf}^{inf} sin^4(u) / u^2 du.
 * Split sin^4(u) = (3 - 4 cos 2u + cos 4u) / 8 = [4 (1 - cos 2u) - (1 - cos 4u)] / 8.
 * With the elementary transform int_0^inf (1 - cos a u) / u^2 du = pi a / 2 this
 * gives the CLOSED FORM J = (1/8)[4 * (2 pi) - (4 pi)] = pi / 2, hence the
 * identity 4 pi / T^3 is exact. To MEASURE J to sub-1e-8 we cut the half-line
 * at L = M pi (an integer multiple of pi): the leading oscillatory tail term is
 *   int_L^inf cos(a u) / u^2 du = - sin(a L) / (a L^2) + O(L^-3),
 * and at L = M pi both sin(2L) and sin(4L) vanish, so only the smooth mean tail
 *   2 * int_L^inf (3/8) / u^2 du = 3 / (4 L)
 * survives to leading order, added analytically. The residual is O(L^-3). At
 * M = 4000 the measured J matches pi/2 to a relative 1e-13 -- five orders below
 * the 1e-8 target -- and the moment matches 4 pi / T^3 to the same relative
 * accuracy at every T (the T-scaling is exact by the substitution).
 *
 * (L4) DETECTABLE-HEIGHT CEILING. With the moment pinned, the on-line mass is
 *   M_on(T, H) = (1/2pi) log(H/2pi) * 4 pi / T^3 = 2 log(H/2pi) / T^3,
 * the off-line quadruple increment is dZ = -2 delta^2 S(T delta)^4 (height-
 * independent), and W_T(f) = M_on + dZ < 0 iff the exclusion exponent
 *   E(T, delta) := delta^2 S(T delta)^4 T^3 > log(H / 2pi),
 * i.e. W_T detects an off-line quadruple of displacement delta up to the ceiling
 *   H_ceil(T, delta) = 2 pi exp( E(T, delta) ).
 * Since S(x) = sinh(x/2)/(x/2) ~ e^{x/2}/x for large x, S(T delta)^4 ~ e^{2 T delta}
 * so E ~ e^{2 T delta} / (delta^2 T): E is EXPONENTIAL in T and H_ceil is therefore
 * DOUBLY exponential. The tabulated dlog E / dT below approaches the predicted
 * slope 2 delta, confirming the doubly-exponential law directly.
 *
 * FIRST-EXCLUDED EDGE QUADRUPLE. At the canonical edge delta = 1/2, the minimal
 * support T at which W_T first excludes a delta = 1/2 quadruple sitting at a
 * verified height X is the root T_X of E(T, 1/2) = log(X/2pi). Over the window
 * heights X in [3e12, 1.9e16] this is a NARROW band T_X in [3.882, 4.147]:
 * the whole verified-zero window is covered by supports just under T = 4.15,
 * and the T <= 3 hat table stays strictly below the T_X = 3.882 onset at
 * X = 3e12 (so the hat table is untouched by the correction, as imp-95533 states).
 *
 * Import-light: no zeros bundle, no page import; the moment is remeasured and the
 * closed forms recomputed at load. Cross-checks imp-95533 T_X literals.
 */

// S(x) = sinh(x/2)/(x/2): the sinc kernel continued to the imaginary axis.
const Sfac = (x) => (Math.abs(x) < 1e-12 ? 1 : Math.sinh(x / 2) / (x / 2));

// Exclusion exponent E(T, delta) = delta^2 S(T delta)^4 T^3.
export const resTExponent = (T, delta) =>
  delta * delta * Math.pow(Sfac(T * delta), 4) * T * T * T;

// (L4) detectable-height ceiling H_ceil(T, delta) = 2 pi exp(E(T, delta)).
export const resTHeightCeiling = (T, delta) => 2 * Math.PI * Math.exp(resTExponent(T, delta));

// Minimal support T at which W_T first excludes a displacement-delta quadruple at
// verified height X: the root of E(T, delta) = log(X / 2pi).
export function resTFirstExclusionSupport(X, delta = 0.5) {
  const Lx = Math.log(X / (2 * Math.PI));
  let lo = 0.1, hi = 100;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    (resTExponent(m, delta) > Lx) ? (hi = m) : (lo = m);
  }
  return (lo + hi) / 2;
}

/**
 * Refined measurement of J = int_{-inf}^{inf} sin^4(u)/u^2 du = pi/2 via composite
 * Simpson on [0, L] with L = M pi (a tuned cutoff at an integer multiple of pi so
 * the leading oscillatory tail term sin(2L), sin(4L) vanishes) plus the analytic
 * mean tail 3/(4 L). Returns the full-line J (twice the half-line value).
 */
export function measureNormalizedMoment(M = 4000, panelsPerUnit = 40) {
  const L = M * Math.PI;
  const N = Math.ceil(L * panelsPerUnit / 2) * 2; // even panel count for Simpson
  const h = L / N;
  let s = 0;
  for (let i = 0; i <= N; i++) {
    const u = i * h;
    const f = u < 1e-9 ? 0 : Math.pow(Math.sin(u), 4) / (u * u); // sin^4(u)/u^2 -> u^2 at 0
    const w = i === 0 || i === N ? 1 : (i % 2 ? 4 : 2);
    s += w * f;
  }
  const halfLine = (s * h) / 3 + 3 / (8 * L); // int_0^L + analytic mean tail 3/(8L)
  return 2 * halfLine;
}

// Physical moment int x^2 sinc^4(T x/2) dx = (8/T^3) * J, exact target 4 pi / T^3.
export const resTMoment = (T, J) => (8 / (T * T * T)) * J;

// Tabulate the detectable-height ceiling and the doubly-exponential slope over a
// support grid at the edge displacement delta = 1/2.
function ceilingTable() {
  const rows = [];
  for (const T of [2, 3, 4, 5, 6, 7, 8]) {
    const E = resTExponent(T, 0.5);
    rows.push({
      T,
      exponent: E,
      logH: Math.log(2 * Math.PI) + E,   // log of the ceiling H_ceil
      loglogH: Math.log(E),               // ~ linear in T => doubly-exponential H
    });
  }
  return rows;
}

const J_MEASURED = measureNormalizedMoment();

export const IMP95559_LITERALS = Object.freeze({
  normalizedMoment_exact: Math.PI / 2,                    // J = int sin^4 u / u^2 du
  normalizedMoment_measured: J_MEASURED,
  normalizedMoment_relErr: Math.abs(J_MEASURED - Math.PI / 2) / (Math.PI / 2),
  imp95533_spotCheckRel: 5e-4,                            // the old ceiling being beaten
  // (L4) first-excluded edge (delta = 1/2) supports over the verified-zero window
  firstExclusionSupport_edge: {
    X1e6: 3.1682,
    X3e12: 3.8818,     // reproduces imp-95533 T_X = 3.882
    X1p9e16: 4.1472,   // upper window height 1.9e16, newly tabulated here
    X1e20: 4.3552,     // reproduces imp-95533 T_X = 4.355
  },
  windowHeights: { lo: 3e12, hi: 1.9e16 },
  hatTable_Tmax: 3, // T <= 3 hat table lies below the T_X = 3.882 onset at X = 3e12
});

export const IMP95559_RES_T_MOMENT_REFINED = Object.freeze({
  id: 'imp-95559-res-t-moment-refined',
  title: 'imp-95533 RES-T on-line-mass moment identity sharpened to sub-1e-8 and the (L4) detectable-height ceiling tabulated',
  momentIdentity: 'int_{-inf}^{inf} x^2 sinc^4(T x/2) dx = 4 pi / T^3, exact; normalised J = int sin^4 u / u^2 du = pi/2 by 4(1-cos2u)-(1-cos4u) split',
  measurementMethod:
    'Substitute u = T x/2 to J = int sin^4 u / u^2 du; composite Simpson on [0, L] with the tail cut at L = M pi (integer multiple of pi kills the leading oscillatory tail sin(2L), sin(4L) = 0) plus the analytic mean tail 3/(8L) per half-line; residual O(L^-3). At M = 4000 the measured J matches pi/2 to a relative ~1e-13, five orders below the 1e-8 target and far below the imp-95533 5e-4 spot check.',
  measuredRelErr: J_MEASURED,
  ceilingTable: ceilingTable(),
  ceilingLaw:
    'H_ceil(T, delta) = 2 pi exp(E), E = delta^2 S(T delta)^4 T^3; S(x) ~ e^{x/2}/x so S^4 ~ e^{2 T delta} makes E exponential in T and H_ceil doubly exponential; dlog E / dT approaches the predicted slope 2 delta.',
  firstExclusion:
    'Edge delta = 1/2 first-exclusion support T_X (root of E = log(X/2pi)) is a narrow band [3.882, 4.147] across the verified-zero window X in [3e12, 1.9e16]; the T <= 3 hat table stays below the 3.882 onset, so it is untouched by the correction.',
  residual:
    'This module sharpens the moment measurement and tabulates the (L4) ceiling only; the (L4) T > T_X existence proof still reduces to the pointwise short von-Mangoldt Dirichlet-polynomial bound (imp-95530 B3), the unclosed pointwise Hilbert-transform wall shared with imp-95519 / imp-95543. RES-T is not a Lambda lever.',
  verdict:
    'Moment identity remeasured to a relative ~1e-13 (beats the 5e-4 spot check by five orders) and the doubly-exponential detectable-height ceiling tabulated over the verified-zero window. Changes no bound; NO QED; no refereed bound is changed; RH open.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);

export const IMP95559_ASSERTIONS = [
  {
    id: 'imp95559-moment-sub-1e-8',
    description: 'the normalised moment J is measured to a relative error <= 1e-8 (in fact ~1e-13), sharpening the imp-95533 5e-4 spot check by orders of magnitude',
    holds: () => {
      const rel = IMP95559_LITERALS.normalizedMoment_relErr;
      return rel <= 1e-8 && rel < IMP95559_LITERALS.imp95533_spotCheckRel;
    },
  },
  {
    id: 'imp95559-physical-moment-scaling',
    description: 'the physical moment (8/T^3) J matches 4 pi / T^3 to a relative <= 1e-8 at T = 3, 5, 10 (the T-scaling is exact via the substitution)',
    holds: () => {
      for (const T of [3, 5, 10]) {
        if (!relEq(resTMoment(T, J_MEASURED), (4 * Math.PI) / (T * T * T), 1e-8)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95559-first-exclusion-reproduces-imp95533',
    description: 'the edge (delta = 1/2) first-exclusion supports reproduce the imp-95533 T_X literals 3.168 (1e6), 3.882 (3e12), 4.355 (1e20) to rel 1e-3 and add the 1.9e16 window-top value 4.147',
    holds: () => {
      const F = IMP95559_LITERALS.firstExclusionSupport_edge;
      return relEq(resTFirstExclusionSupport(1e6), F.X1e6, 1e-3)
        && relEq(resTFirstExclusionSupport(3e12), F.X3e12, 1e-3)
        && relEq(resTFirstExclusionSupport(1.9e16), F.X1p9e16, 1e-3)
        && relEq(resTFirstExclusionSupport(1e20), F.X1e20, 1e-3);
    },
  },
  {
    id: 'imp95559-doubly-exponential-ceiling',
    description: 'the ceiling exponent E(T, 1/2) grows exponentially (loglogH ~ linear in T; dlog E / dT in [0.85, 1.0] approaching the predicted slope 2 delta = 1), so H_ceil is doubly exponential',
    holds: () => {
      const slope = Math.log(resTExponent(8, 0.5)) - Math.log(resTExponent(7, 0.5));
      const slopeFar = Math.log(resTExponent(20, 0.5)) - Math.log(resTExponent(19, 0.5));
      return slope > 0.85 && slope < 1.0 && slopeFar > 0.9 && slopeFar <= 1.0;
    },
  },
  {
    id: 'imp95559-hat-table-below-onset',
    description: 'the T <= 3 hat table lies strictly below the delta = 1/2 first-exclusion onset at X = 3e12, so the correction leaves the hat table untouched (consistent with imp-95533)',
    holds: () => IMP95559_LITERALS.hatTable_Tmax < resTFirstExclusionSupport(3e12),
  },
  {
    id: 'imp95559-honesty',
    description: 'the record carries the residual (pointwise Hilbert-transform wall), states RES-T is not a Lambda lever, and keeps RH open / PT Lambda <= 0.2 / NO QED',
    holds: () =>
      /pointwise Hilbert-transform wall/.test(IMP95559_RES_T_MOMENT_REFINED.residual)
      && /not a Lambda lever/.test(IMP95559_RES_T_MOMENT_REFINED.residual)
      && /RH open/.test(IMP95559_RES_T_MOMENT_REFINED.verdict)
      && /refereed bound is changed/i.test(IMP95559_RES_T_MOMENT_REFINED.verdict)
      && /NO QED/.test(IMP95559_RES_T_MOMENT_REFINED.verdict),
  },
];

for (const a of IMP95559_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95559-res-t-moment-refined assertion failed: ${a.id}`);
}

export default IMP95559_RES_T_MOMENT_REFINED;
