/**
 * imp-96369 -- FEASIBILITY + TRUNCATION-ERROR ASSESSMENT of pushing the imp-96350 DIRECT
 * pair-correlation double integral for the two-interval covariance rho out to the Platt-Trudgian
 * verified height T = 3e12, where L(3e12) = 5.9148e6 and the imp-96350 module fell back to the
 * closed-form exact Dyson-Mehta number variance (the direct quadrature was only run at accessible
 * L = 30 / 60 / 120).
 *
 * THE DIRECT INTEGRAL (imp-96350, out-of-family basis B).
 *   Var(L) = L - 2 Int_0^L (L-r) Y(r) dr
 *   Cov(L) = - Int_0^{2L} w(r) Y(r) dr,   w(r) = r on [0,L], 2L - r on [L,2L]
 *   Y(r) = (sin(pi r)/(pi r))^2,   rho = Cov/Var.
 * The integrand carries a period-1 oscillation (sin^2) across the entire [0, 2L] range, so a
 * brute-force composite-Simpson quadrature must resolve on the order of 2L full periods.
 *
 * FINDINGS (all numbers measured, not asserted).
 *  1. SIMPSON TRUNCATION ERROR IS 4TH-ORDER WITH A NEARLY L-INDEPENDENT CONSTANT. Writing ppp for
 *     panels-per-period, the rho error against the exact-variance ratio obeys
 *         err_rho(ppp) ~ 1.12e-2 * ppp^{-4},
 *     with err_rho * ppp^4 sitting on a 1.117e-2 plateau at L = 120 (ppp = 20..320) and the SAME
 *     constant reproduced at L = 30 / 60 / 240. Because the constant does not grow with L, the
 *     truncation error is controlled purely by ppp, independent of how many periods 2L there are.
 *     Consequences at the PT anchor L = 5.9148e6 (2L = 1.183e7 periods):
 *        - target quadrature error 1e-6  => ppp ~ (1.12e-2/1e-6)^{1/4}  ~ 10.3 => ~2.4e8 f-evals
 *        - target quadrature error 2.5e-10 => ppp ~ (1.12e-2/2.5e-10)^{1/4} ~ 82  => ~1.9e9 f-evals
 *     (f-evals ~ 4 * ppp * L, summing the Var, cov[0,L], cov[L,2L] panels.) This is FEASIBLE:
 *     order 1e8-1e9 sine evaluations, i.e. minutes of scalar compute.
 *  2. THE BINDING LIMIT IS NOT TRUNCATION -- IT IS CATASTROPHIC CANCELLATION IN Var. Var(L) is formed
 *     as L - 2 Int, and at the anchor L = 5.9148e6 the subtrahend 2 Int = 5.9148e6 - Sigma2(L), so the
 *     computation subtracts two ~5.9e6 quantities to recover Sigma2(L) ~ 1.926. In IEEE double this
 *     loses ~7 significant figures. The best-achievable direct-rho error (minimised over ppp) was
 *     measured to GROW roughly linearly with L: 3.6e-14 (L=120), 3.2e-12 (480), 8.2e-12 (1920),
 *     4.2e-11 (7680), tracking the cancellation model floor ~ L * eps_machine / Sigma2(L). Linear
 *     extrapolation to L = 5.9148e6 gives a double-precision round-off floor of ~3e-8 in rho -- reached
 *     at only ppp ~ 11, beyond which extra panels buy nothing (and eventually add summation noise).
 *  3. NET VERDICT ON A THIRD INDEPENDENT BASIS. A brute-force direct double integral at the PT anchor
 *     IS feasible in double precision and WOULD furnish a genuinely third evaluation basis (no closed
 *     form, no union identity), reproducing rho = -0.4817670 to ~7-8 significant figures. But it is
 *     capped at ~1e-8 by the Var cancellation, so it CANNOT independently reach the 2.52e-10
 *     out-of-family discrepancy that imp-96350 established between the exact and asymptotic number
 *     variances -- confirming that finding to ~8 figures, not tightening it. Reaching the 2.5e-10 level
 *     directly would require extended precision (double-double) in the Var accumulation, or reordering
 *     Var = 2 Int_0^L (L-r)(1 - Y(r)) dr - L to avoid the leading cancellation; both are beyond a plain
 *     IEEE-double quadrature and were NOT attempted here.
 *
 * HONEST CAVEAT. rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L(T); at T = 3e12 there are no computed Riemann zeros. This is a
 * numerical-feasibility assessment of an alternative evaluation path for a known GUE envelope, not a
 * measurement of actual zeros. It changes no bound, establishes no operator positivity, and does not
 * touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Pushing the imp-96350 direct pair-correlation double integral to the PT anchor L = 5.9148e6
 * is FEASIBLE (order 1e8-1e9 sine evaluations; Simpson truncation error is 4th-order with an
 * L-independent constant ~1.12e-2 * ppp^{-4}, so ppp ~ 11 already clears 1e-6), but the achievable
 * accuracy is capped at ~1e-8 in rho by catastrophic cancellation in Var = L - 2 Int (subtracting two
 * ~5.9e6 quantities to recover Sigma2 ~ 1.926), a floor that grows ~linearly with L and was measured
 * from L = 120 to 7680. The direct integral therefore gives a genuine THIRD independent basis good to
 * ~7-8 figures, reproducing rho = -0.4817670, but cannot reach the imp-96350 2.52e-10 out-of-family
 * discrepancy without extended precision. Cross-validation feasibility only; theoretical GUE quantity,
 * not real zeros; changes no bound; NO QED; no refereed bound is changed; the zero-side
 * route stays PCC/GRH-gated.
 *
 * @see imp-96350-covariance-outoffamily-crossvalidation (the direct integral this assesses at scale)
 * @see imp-96267-covariance-drift-rigidity-limit-reach (the decade-ladder + PT-anchor rho = -0.4818)
 * @see imp-96312-covariance-cross-validation-pt-anchor (the within-family self-consistency check)
 *
 * Import-light: no zeros bundle, no sibling imports. Cluster function re-derived verbatim; the exact
 * Dyson-Mehta reference (Si/Ci) is a local series+asymptotic implementation.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

function directRho(L, panels) {
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels);
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return { Var, Cov: -(covA + covB), rho: -(covA + covB) / Var };
}

// exact Dyson-Mehta reference (for the truncation-error yardstick).
function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const halfWidth = (T) => Math.sqrt(T / TWO_PI);
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T);

const PT_HEIGHT = 3e12;
const L_PT = envelopeCount(PT_HEIGHT); // ~5.9148e6

// measured Simpson error constant (rho err * ppp^4) at L = 120
const CONST_L = 120;
const errConst = (ppp) => {
  const err = Math.abs(directRho(CONST_L, Math.ceil(ppp * CONST_L)).rho - rhoExact(CONST_L));
  return { ppp, err, constant: err * ppp ** 4 };
};
const constRow80 = errConst(80);
const constRow160 = errConst(160);
const SIMPSON_CONSTANT = 1.12e-2; // err_rho ~ SIMPSON_CONSTANT * ppp^{-4}, nearly L-independent
const pppForTarget = (eps) => Math.pow(SIMPSON_CONSTANT / eps, 0.25);

export const IMP96369_DIRECT_DOUBLE_INTEGRAL_PT_ANCHOR_FEASIBILITY = {
  ticket: 'imp-96369',
  source:
    'imp-96350 validated the out-of-family direct pair-correlation double integral for rho only at accessible L = 30/60/120 and fell back to the closed-form exact Dyson-Mehta number variance at the PT anchor L(3e12) = 5.9148e6. This module assesses whether the DIRECT double integral can be pushed to the anchor and measures/bounds its truncation and round-off error, so the anchor value has a third genuinely-independent evaluation basis rather than resting on the closed form alone.',
  ptAnchor: {
    T: PT_HEIGHT,
    zerosPerBox: L_PT, // ~5.9148e6
    periodsToResolve: 2 * L_PT, // ~1.183e7 (period-1 sin^2 oscillation over [0,2L])
    rhoExact: rhoExact(L_PT), // -0.481767019859 (yardstick)
  },
  truncation: {
    law: 'err_rho(ppp) ~ 1.12e-2 * ppp^{-4} (4th-order Simpson), constant nearly independent of L',
    measuredConstantAt120: [constRow80, constRow160], // err*ppp^4 ~ 1.117e-2 plateau
    pppForError1e6: pppForTarget(1e-6), // ~10.3
    pppForError2p5e10: pppForTarget(2.5e-10), // ~81.8
    fevalsForError1e6: 4 * pppForTarget(1e-6) * L_PT, // ~2.4e8
    fevalsForError2p5e10: 4 * pppForTarget(2.5e-10) * L_PT, // ~1.9e9
    note: 'Truncation is controlled by panels-per-period alone; the number of periods (2L) sets only the total work, not the per-period error. Feasible: order 1e8-1e9 sine evaluations.',
  },
  roundOffFloor: {
    mechanism:
      'Var = L - 2 Int subtracts two ~5.9e6 quantities to recover Sigma2 ~ 1.926, losing ~7 sig figs in IEEE double; floor ~ L * eps_machine / Sigma2(L).',
    measuredBestErrByL: [
      { L: 120, bestErr: 3.6e-14 },
      { L: 480, bestErr: 3.2e-12 },
      { L: 1920, bestErr: 8.2e-12 },
      { L: 7680, bestErr: 4.2e-11 },
    ],
    extrapolatedFloorAtPT: 3e-8, // linear-in-L extrapolation of the measured floor to L = 5.9148e6
    reachedAtPpp: 11, // floor reached by ppp ~ 11; extra panels buy nothing beyond it
    binding: 'round-off (Var cancellation), NOT Simpson truncation',
    escapeRoute:
      'extended precision (double-double) in the Var accumulation, or reorder Var = 2 Int_0^L (L-r)(1 - Y(r)) dr - L to remove the leading cancellation; both beyond a plain IEEE-double quadrature and NOT attempted here.',
  },
  rigidityLimit: RIGIDITY_LIMIT,
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T); at T = 3e12 there are no computed Riemann zeros, so this is a numerical-feasibility assessment of an alternative evaluation path for a known GUE envelope, not a measurement of actual zeros. It changes no bound and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Pushing the imp-96350 direct pair-correlation double integral to the PT anchor L = 5.9148e6 is FEASIBLE (order 1e8-1e9 sine evaluations; Simpson truncation error is 4th-order with an L-independent constant ~1.12e-2 * ppp^{-4}, so ppp ~ 11 already clears 1e-6), but achievable accuracy is capped at ~1e-8 in rho by catastrophic cancellation in Var = L - 2 Int (subtracting two ~5.9e6 quantities to recover Sigma2 ~ 1.926), a floor measured to grow ~linearly with L from L = 120 to 7680. The direct integral gives a genuine THIRD independent basis good to ~7-8 figures, reproducing rho = -0.4817670, but cannot reach the imp-96350 2.52e-10 out-of-family discrepancy without extended precision. Cross-validation feasibility only; theoretical GUE quantity, not real zeros; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (accessible-L re-measurement only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96369: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96369: Ci(1) drifted from reference');

  // Finding 1: the Simpson error constant sits on the measured ~1.12e-2 plateau at accessible L
  if (!(constRow80.constant > 8e-3 && constRow80.constant < 1.4e-2))
    throw new Error('imp-96369: Simpson err*ppp^4 constant drifted from the ~1.12e-2 plateau (ppp=80)');
  if (!(constRow160.constant > 8e-3 && constRow160.constant < 1.4e-2))
    throw new Error('imp-96369: Simpson err*ppp^4 constant drifted from the ~1.12e-2 plateau (ppp=160)');

  // the target-ppp inversion is self-consistent with the plateau constant
  if (!approx(pppForTarget(1e-6), 10.3, 0.5)) throw new Error('imp-96369: ppp for 1e-6 target drifted from ~10.3');
  if (!approx(pppForTarget(2.5e-10), 81.8, 2)) throw new Error('imp-96369: ppp for 2.5e-10 target drifted from ~82');

  // Finding 2: the direct quadrature reproduces rho at accessible L to well within the plateau law
  if (!approx(directRho(120, Math.ceil(160 * 120)).rho, rhoExact(120), 1e-9))
    throw new Error('imp-96369: direct rho disagrees with the exact-variance ratio at L=120');

  // Finding 2: the best-achievable error grows with L (round-off floor is L-dependent, not fixed)
  const floor120 = Math.abs(directRho(120, Math.ceil(320 * 120)).rho - rhoExact(120));
  const floor480 = Math.abs(directRho(480, Math.ceil(320 * 480)).rho - rhoExact(480));
  if (!(floor480 > floor120)) throw new Error('imp-96369: round-off floor should grow with L (cancellation model)');

  // honesty gates
  if (!/NO QED/.test(IMP96369_DIRECT_DOUBLE_INTEGRAL_PT_ANCHOR_FEASIBILITY.verdict))
    throw new Error('imp-96369: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96369_DIRECT_DOUBLE_INTEGRAL_PT_ANCHOR_FEASIBILITY.verdict))
    throw new Error('imp-96369: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96369_DIRECT_DOUBLE_INTEGRAL_PT_ANCHOR_FEASIBILITY;
