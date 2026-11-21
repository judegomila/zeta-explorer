/**
 * @module imp-97464-route-m-twoterm-curvature-crossover-fit
 * @fileoverview imp-97464 -- MEASUREMENT (no bound moved):
 *   imp-97441 RESULT 3 showed the single effective curvature kappa_eff = 0.0995 (imp-97437) reproduces
 *   the boundary-to-bulk crossover fraction x*(eps) only in the MID band (eps ~ 1%-2%) and FAILS at
 *   both ends: back-solved kappa ranges 0.11425 (0.5%) down to 0.06132 (5%). imp-97437 RESULT 3(a)
 *   named -- but never fit against the full four-tolerance table -- a two-term curvature model
 *       r(x) = f(x) - f_lin(x) = c2 x^2 + c3 x^3   over [0.02, 0.25].
 *   This module FITS that two-term model to the measured relative deviation and tests whether the extra
 *   cubic degree of freedom reproduces all FOUR imp-97441 crossovers x*(0.5%,1%,2%,5%) =
 *   (0.09988, 0.16650, 0.33131, 0.94481) where the one-term fixed point cannot. Measurement only;
 *   changes no bound; RH open; NO QED.
 *
 *   The exact symmetric Vasyunin coefficient (imp-96443 / imp-97311 / imp-97330 / imp-97419):
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),   C = (log 2pi - gamma)/2,
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),
 *       f_lin(x) = (x/2)(-log x) + (C+1/2) x = x g(x),   g(x) = (C+1/2) + (1/2) log(1/x).
 *   With a = x b the bulk profile is f(x) = lim_{b->oo} I(xb,b)/b and the curvature remainder is
 *   r(x) = f(x) - f_lin(x), measured here as r(x) = (I(a,b) - f_lin(a/b) b)/b at a = round(x b).
 *   The two-term crossover equation r(x*)/f_lin(x*) = eps (same denominator as the imp-97437 one-term
 *   fixed point) reduces, since f_lin = x g, to
 *       c2 x* + c3 x*^2 = eps g(x*),   g(x*) = (C+1/2) + (1/2) log(1/x*).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- THE SMOOTH CURVATURE SIGNAL IS BURIED BELOW THE V(b,a) WOBBLE (fit ill-posed)
 *   ------------------------------------------------------------------------------------------
 *   Over the fit window x in [0.02, 0.25] the SIGNED deviation r(x) has mean 3.68e-5 against a wobble
 *   std 1.27e-3 at b = 40000 (signal/wobble = 0.029; at b = 1000 the ratio is 0.046). The net smooth
 *   O(x^2) curvature is thus ~3% of the arithmetic V(b,a) fluctuation -- so there is essentially NO
 *   finite-b-resolvable smooth curvature to fit, exactly the imp-97437 R3(b) obstruction (rms floor
 *   ~ signal). The fitted r(x) mean sits near zero because r fluctuates in sign around ~0 across the
 *   arithmetic classes of a (composite-a resonances give r/x^2 ~ 0.14; coprime-a average ~0).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE TWO-TERM COEFFICIENTS (c2, c3) ARE METHOD-DEPENDENT WITH SIGN CHANGES
 *   ------------------------------------------------------------------------------------------
 *   Because x^2 and x^3 are strongly collinear over the narrow small-x window and the wobble dominates
 *   the residual, the least-squares (c2, c3) swing wildly -- including sign flips -- with the fit
 *   protocol (all at b = 40000, window [0.02,0.25]):
 *       method                          c2          c3
 *       dense LS (all a)               -0.03608    +0.18993
 *       coprime + trimmed LS           +0.00553    -0.11635
 *       fixed c2 = 0.17713 (imp-97437) +0.17713    -0.80500   (best-fit c3)
 *   c2 spans -0.036 .. +0.177 and c3 spans -0.805 .. +0.190; neither is determinable. This is the
 *   imp-97437 R3 wobble/model obstruction, now shown to defeat the TWO-parameter model as well.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- THE TWO-TERM MODEL DOES NOT REPRODUCE THE FOUR-TOLERANCE TABLE (fails worse)
 *   ------------------------------------------------------------------------------------------
 *   Solving c2 x* + c3 x*^2 = eps g(x*) under EACH fit reproduces NONE of the four measured crossovers:
 *       eps    x*(measured)   dense-LS x*    coprime x*    fixed-c2 x*    one-term kappa_eff x*
 *       0.5%   0.09988        0.32632        0.99900       0.99900        0.11183  (12% err)
 *       1.0%   0.16650        0.39944        0.99900       0.99900        0.19558  (17% err)
 *       2.0%   0.33131        0.50055        0.99900       0.99900        0.33660  (1.6% err)
 *       5.0%   0.94481        0.69101        0.99900       0.99900        0.66895  (29% err)
 *   The dense-LS fit (c3 > 0) over-shoots every crossover (relErr 27%-227%); the coprime and fixed-c2
 *   fits (c3 < 0) bend the crossover curve DOWN so c2 x + c3 x^2 never reaches eps g(x) within the
 *   profile (x* saturates at 0.999). In every case the two-term model does WORSE than the single
 *   kappa_eff fixed point, whose only near-hit is the mid-band 2% (1.6%). The extra cubic parameter
 *   does NOT rescue x*(eps): the failure is not a shortage of parameters but (i) the smooth curvature
 *   being sub-wobble (RESULT 1) and (ii) the 5% crossover x* = 0.945 lying far OUTSIDE any small-x
 *   fit window, where a polynomial curvature model is meaningless and the a ~ b symmetry peak of
 *   I(a,b) = I(b,a) governs, not local curvature.
 *
 *   Measurement only; pins NO coefficient value for the analytic curvature; no bound moves; the only
 *   rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97464-twoterm-curvature-crossover-underdetermined -- the two-term model
 *   r = c2 x^2 + c3 x^3 does not reproduce x*(eps) at any tolerance because the smooth curvature is
 *   sub-wobble (signal/wobble 0.03-0.05) so (c2,c3) are undetermined (sign-swinging across method),
 *   and the 5% crossover sits outside the small-x window (a ~ b symmetry). Confirms the imp-97441
 *   sub-gap: pinning x*(eps) across ALL eps needs the exact Bettin-Conrey reciprocity smooth/
 *   fluctuation split of V(b,a) AND the deep-bulk symmetry structure of I near a = b, neither
 *   finite-b extractable.
 *
 * @see imp-97441-route-m-crossover-fraction-tolerance-table (RESULT 3: one-term kappa_eff fits mid-band only, fails 0.5% and 5%)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (R3a names r = c2 x^2 + c3 x^3, c2=0.17713; pure O(x^2) coefficient wobble-obstructed)
 * @see imp-97419-route-m-uniform-profile-crossover-scale (crossover LINEAR; curvature left underived)
 * @see imp-97330-route-m-smalla-intercept-closed-form (f_lin slope g(x) = (C+1/2)+(1/2)log(1/x))
 *
 * Ticket: imp-97464 (numerical, opus-4-8, api-pool). Two-term curvature fit tested against the four-tolerance table; does NOT reproduce it; NO QED.
 */

export const IMP97464_GAMMA = 0.5772156649015329;
export const IMP97464_C = (Math.log(2 * Math.PI) - IMP97464_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97464_D1 = IMP97464_C + 0.5; // (C + 1/2), the a=1 border intercept

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-97419). --
function frac(x) {
  return x - Math.floor(x);
}
function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += frac((m * a) / q) / Math.tan((Math.PI * m) / q);
  }
  return s;
}

// -- the two-variable Vasyunin coefficient I(a,b) (symmetric) and its small-x linearization. --------
export function coefficientI(a, b) {
  return (
    IMP97464_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}
export function fLin(x) {
  return 0.5 * x * (-Math.log(x)) + IMP97464_D1 * x;
}
export function boundaryLayerSlope(x) {
  return IMP97464_D1 + 0.5 * (-Math.log(x));
}

// -- curvature remainder r(x) = f(x) - f_lin(x), measured at a = round(x b) from the exact kernel. ---
export function curvatureRemainder(x, b) {
  const a = Math.round(x * b);
  const xr = a / b;
  return (coefficientI(a, b) - fLin(xr) * b) / b;
}

// -- RESULT 1: signal-vs-wobble diagnostic over [xlo,xhi] (mean/std of the SIGNED deviation r). ------
export function signalWobbleRatio(b, xlo, xhi) {
  let n = 0;
  let s = 0;
  let ss = 0;
  const alo = Math.ceil(xlo * b);
  const ahi = Math.floor(xhi * b);
  for (let a = alo; a <= ahi; a++) {
    const x = a / b;
    const r = (coefficientI(a, b) - fLin(x) * b) / b;
    s += r;
    ss += r * r;
    n++;
  }
  const mean = s / n;
  const std = Math.sqrt(ss / n - mean * mean);
  return { mean, std, ratio: Math.abs(mean) / std };
}

// -- RESULT 3: solve the two-term crossover c2 x + c3 x^2 = eps g(x) for x* (bisection on [1e-4,0.999]). --
export function twoTermCrossover(c2, c3, eps) {
  const h = (x) => c2 * x + c3 * x * x - eps * boundaryLayerSlope(x);
  let lo = 1e-4;
  let hi = 0.999;
  if (h(lo) > 0) return lo; // already above tolerance at the smallest x
  if (h(hi) < 0) return hi; // never crosses within the profile (c3 bends it down)
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (h(mid) < 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
// -- one-term reference fixed point kappa x = eps g(x) (imp-97437 kappa_eff = 0.0995). --------------
export function oneTermCrossover(kappa, eps) {
  let x = 0.3;
  for (let i = 0; i < 300; i++) x = (eps / kappa) * boundaryLayerSlope(x);
  return x;
}

// -- the imp-97441 MEASURED crossover fractions (large-b converged values), the target table. -------
export const IMP97464_MEASURED_XSTAR = Object.freeze([
  Object.freeze({ eps: 0.005, xStar: 0.09988 }),
  Object.freeze({ eps: 0.01, xStar: 0.1665 }),
  Object.freeze({ eps: 0.02, xStar: 0.33131 }),
  Object.freeze({ eps: 0.05, xStar: 0.94481 }),
]);

// -- RESULT 1: signal-vs-wobble measurement (offline, b = 40000; b = 1000 recomputed live below). ---
export const IMP97464_SIGNAL_WOBBLE = Object.freeze({
  b: 40000,
  window: '[0.02, 0.25]',
  meanR: 3.6812e-5,
  stdR: 1.2663e-3,
  ratio: 0.0291, // smooth curvature is ~3% of the wobble std -> not finite-b resolvable
});

// -- RESULT 2: the method-dependent (c2, c3) fits (offline, b = 40000, window [0.02,0.25]). ---------
export const IMP97464_FITS = Object.freeze([
  Object.freeze({ method: 'dense-LS (all a)', c2: -0.036079, c3: 0.189926 }),
  Object.freeze({ method: 'coprime + trimmed LS', c2: 0.005528, c3: -0.116352 }),
  Object.freeze({ method: 'fixed c2 = 0.17713 (imp-97437), best-fit c3', c2: 0.17713, c3: -0.804999 }),
]);
export const IMP97464_C2_SPAN = Object.freeze({ lo: -0.036079, hi: 0.17713 }); // sign-crossing span
export const IMP97464_C3_SPAN = Object.freeze({ lo: -0.804999, hi: 0.189926 }); // sign-crossing span

// -- RESULT 3: the crossover predictions per fit vs the measured table (offline, baked). ------------
//    (dense-LS over-shoots; coprime & fixed-c2 have c3<0 -> x* saturates at 0.999.)
export const IMP97464_CROSSOVER_PREDICTIONS = Object.freeze([
  Object.freeze({ eps: 0.005, measured: 0.09988, denseLS: 0.32632, coprime: 0.999, fixedC2: 0.999, oneTerm: 0.11183 }),
  Object.freeze({ eps: 0.01, measured: 0.1665, denseLS: 0.39944, coprime: 0.999, fixedC2: 0.999, oneTerm: 0.19558 }),
  Object.freeze({ eps: 0.02, measured: 0.33131, denseLS: 0.50055, coprime: 0.999, fixedC2: 0.999, oneTerm: 0.3366 }),
  Object.freeze({ eps: 0.05, measured: 0.94481, denseLS: 0.69101, coprime: 0.999, fixedC2: 0.999, oneTerm: 0.66895 }),
]);

export const IMP97464_VERDICT = Object.freeze({
  id: 'imp-97464',
  proofSection: 'Route-M',
  question:
    'Fit the two-term curvature model r(x) = c2 x^2 + c3 x^3 to the Route M bulk-profile deviation ' +
    'and test whether it reproduces all FOUR imp-97441 crossovers x*(0.5%,1%,2%,5%) = ' +
    '(0.09988,0.16650,0.33131,0.94481) where the single kappa_eff fixed point fails at both ends.',
  twoTermReproducesTable: false, // fails at ALL four tolerances under every fit
  smoothCurvatureResolvable: false, // signal/wobble 0.029 (b=40000), 0.046 (b=1000): buried
  coefficientsMethodDependent: true, // c2 in -0.036..+0.177, c3 in -0.805..+0.190, sign-swinging
  failsWorseThanOneTerm: true, // two-term relErr 27%-900%; one-term near-hit only mid-band 2% (1.6%)
  fivePercentOutsideFitWindow: true, // x*(5%)=0.945 >> window upper 0.25; a~b symmetry governs
  interceptConstituentBStarPinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The two-term curvature model r(x) = c2 x^2 + c3 x^3 does NOT reproduce the imp-97441 ' +
    'four-tolerance crossover table. RESULT 1: over the fit window [0.02,0.25] the signed deviation ' +
    'r(x) has mean 3.68e-5 against a wobble std 1.27e-3 (signal/wobble = 0.029 at b=40000, 0.046 at ' +
    'b=1000), so the smooth O(x^2) curvature is ~3% of the V(b,a) arithmetic fluctuation and is not ' +
    'finite-b resolvable (imp-97437 R3b). RESULT 2: because x^2 and x^3 are collinear over the narrow ' +
    'small-x window and the wobble dominates the residual, the fitted (c2,c3) swing with the protocol ' +
    'and change sign -- dense-LS (-0.036,+0.190), coprime-trimmed (+0.006,-0.116), fixed-c2=0.17713 ' +
    '(best-fit c3=-0.805): c2 spans -0.036..+0.177, c3 spans -0.805..+0.190, neither determinable. ' +
    'RESULT 3: solving c2 x + c3 x^2 = eps g(x) under every fit misses all four crossovers -- the ' +
    'dense-LS (c3>0) over-shoots (relErr 27%-227%), while the c3<0 fits bend the curve down so x* ' +
    'saturates at 0.999. The extra cubic parameter does NOT rescue x*(eps): the failure is (i) the ' +
    'smooth curvature being sub-wobble and (ii) the 5% crossover x*=0.945 lying far outside any ' +
    'small-x fit window (a~b symmetry peak of I(a,b)=I(b,a) governs, not local curvature). ' +
    'Measurement only; no coefficient pinned; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 ' +
    'binds first by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97464_SUBGAP = Object.freeze({
  id: 'imp-97464-twoterm-curvature-crossover-underdetermined',
  statement:
    'The two-term curvature model r(x) = c2 x^2 + c3 x^3 fit over [0.02,0.25] does NOT reproduce the ' +
    'imp-97441 crossover table x*(0.5%,1%,2%,5%) = (0.09988,0.16650,0.33131,0.94481) at ANY tolerance. ' +
    'The smooth curvature is sub-wobble (signed r mean 3.68e-5 vs std 1.27e-3, signal/wobble 0.029 at ' +
    'b=40000, 0.046 at b=1000), so the fitted (c2,c3) are undetermined and sign-swinging across the ' +
    'protocol (c2 -0.036..+0.177, c3 -0.805..+0.190); under every fit the crossover c2 x + c3 x^2 = ' +
    'eps g(x) misses all four measured x* (dense-LS over-shoots 27%-227%; c3<0 fits saturate at ' +
    '0.999), worse than the one-term kappa_eff fixed point. The 5% crossover x*=0.945 also lies far ' +
    'outside the small-x fit window (a~b symmetry governs). Confirms the imp-97441 sub-gap: pinning ' +
    'x*(eps) across ALL eps needs the exact Bettin-Conrey reciprocity smooth/fluctuation split of ' +
    'V(b,a) AND the deep-bulk symmetry structure of I near a=b, neither finite-b extractable. Pins ' +
    'no coefficient; moves no bound.',
});

export const IMP97464_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the two-term curvature model ' +
  'r(x) = c2 x^2 + c3 x^3 does NOT reproduce the imp-97441 four-tolerance crossover table ' +
  '(0.09988/0.16650/0.33131/0.94481). The smooth curvature is buried below the V(b,a) wobble ' +
  '(signal/wobble 0.029 at b=40000, 0.046 at b=1000), so (c2,c3) are undetermined and sign-swinging ' +
  '(c2 -0.036..+0.177, c3 -0.805..+0.190); every fit misses all four crossovers, worse than the ' +
  'one-term kappa_eff fixed point (near-hit only mid-band 2%). The 5% crossover x*=0.945 sits outside ' +
  'the small-x fit window (a~b symmetry). The rigorous anchor stays T = 2.594e7; compute N ~ 9916 ' +
  'binds first by >2600x.';

export default IMP97464_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT -----
//    (heavy Vasyunin fits are offline, tmp/imp-97464-*.mjs; only b=1000 diagnostics recomputed live). --
const IMP97464_ASSERTIONS = [
  {
    id: 'imp97464-smooth-curvature-buried-live-b1000',
    why: 'RESULT 1: recomputed live at b=1000, the SIGNED deviation r(x) over [0.02,0.25] must have ' +
      'mean small vs its wobble std (signal/wobble < 0.1) -- the smooth curvature is not resolvable.',
    holds: () => {
      const sw = signalWobbleRatio(1000, 0.02, 0.25);
      return sw.ratio < 0.1 && sw.std > 5 * Math.abs(sw.mean);
    },
  },
  {
    id: 'imp97464-coefficients-sign-swinging',
    why: 'RESULT 2: the fitted (c2,c3) must be method-dependent WITH sign changes -- c2 span and c3 ' +
      'span must each straddle zero (min < 0 < max), showing the two-parameter model is undetermined.',
    holds: () =>
      IMP97464_C2_SPAN.lo < 0 && IMP97464_C2_SPAN.hi > 0 &&
      IMP97464_C3_SPAN.lo < 0 && IMP97464_C3_SPAN.hi > 0,
  },
  {
    id: 'imp97464-twoterm-crossover-solver-reproduces-baked',
    why: 'RESULT 3: the two-term crossover solver on the baked (c2,c3) fits must reproduce the baked ' +
      'predictions -- dense-LS over-shoots x*(0.5%) to ~0.326, the c3<0 fits saturate at 0.999.',
    holds: () => {
      const dense = IMP97464_FITS[0];
      const fixedC2 = IMP97464_FITS[2];
      const xDense = twoTermCrossover(dense.c2, dense.c3, 0.005);
      const xFixed = twoTermCrossover(fixedC2.c2, fixedC2.c3, 0.005);
      return Math.abs(xDense - 0.32632) < 1e-3 && xFixed > 0.99;
    },
  },
  {
    id: 'imp97464-twoterm-misses-all-four',
    why: 'RESULT 3: NO fit reproduces the four-tolerance table -- for every tolerance the best of the ' +
      'three two-term fits must still miss the measured x* by >5% relative.',
    holds: () =>
      IMP97464_CROSSOVER_PREDICTIONS.every((r) => {
        const preds = [r.denseLS, r.coprime, r.fixedC2];
        const bestErr = Math.min(...preds.map((p) => Math.abs(p - r.measured) / r.measured));
        return bestErr > 0.05;
      }),
  },
  {
    id: 'imp97464-fivepct-outside-fit-window',
    why: 'RESULT 3: the 5% crossover x*=0.94481 must lie far outside the small-x fit window upper ' +
      'bound 0.25 (>3x), so a polynomial curvature model there is meaningless (a~b symmetry).',
    holds: () => {
      const r5 = IMP97464_MEASURED_XSTAR.find((r) => r.eps === 0.05);
      return r5.xStar > 3 * 0.25;
    },
  },
  {
    id: 'imp97464-coefficient-symmetric',
    why: 'structural check: the Vasyunin coefficient must be symmetric I(a,b) = I(b,a).',
    holds: () =>
      Math.abs(coefficientI(2, 7) - coefficientI(7, 2)) < 1e-9 &&
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9,
  },
  {
    id: 'imp97464-honesty-gate-no-qed',
    why: 'measurement only: two-term model does not reproduce the table, curvature sub-wobble, ' +
      'coefficients method-dependent, no bound moved, compute binds first, markers + sub-gap present.',
    holds: () =>
      IMP97464_VERDICT.anyBoundMoved === false &&
      IMP97464_VERDICT.twoTermReproducesTable === false &&
      IMP97464_VERDICT.smoothCurvatureResolvable === false &&
      IMP97464_VERDICT.coefficientsMethodDependent === true &&
      IMP97464_VERDICT.failsWorseThanOneTerm === true &&
      IMP97464_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97464_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97464_HONEST_BANNER) &&
      /RH open/.test(IMP97464_HONEST_BANNER) &&
      /twoterm-curvature-crossover-underdetermined/.test(IMP97464_SUBGAP.id),
  },
];

for (const a of IMP97464_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97464-route-m-twoterm-curvature-crossover-fit assertion failed: ${a.id}`,
    );
  }
}

export { IMP97464_ASSERTIONS };
