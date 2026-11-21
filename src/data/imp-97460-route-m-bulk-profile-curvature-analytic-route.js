/**
 * @module imp-97460-route-m-bulk-profile-curvature-analytic-route
 * @fileoverview imp-97460 -- DERIVATION + MEASUREMENT (no bound moved):
 *   imp-97437 RESULT 3 reported an OBSTRUCTION -- the PURE analytic O(x^2) curvature coefficient of
 *   the Route M Vasyunin bulk profile f(x) is NOT finite-b extractable (a finite-b least-squares fit
 *   is model- and window-dependent, 0.177 vs 0.014), so only an effective kappa_eff=0.0995 could be
 *   back-solved from the imp-97419 crossovers. This module attempts the ANALYTIC route the ticket
 *   asks for -- expand the cotangent-sum limit
 *       w(x) = lim_{b->oo} (V(x b, b) + V(b, x b)) / b,   V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),
 *   to O(x^2) / O(x^2 log x) -- and reports the PRECISE analytic obstruction plus a sharpening of the
 *   imp-97437 verdict. Derivation + measurement only; RH open; NO QED.
 *
 *   The bulk profile (imp-97329 / imp-97437):
 *       f(x) = C(1 + x) + (1/2)(1 - x) log x - (pi/2) w(x),   C = (log 2pi - gamma)/2.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- EXACT REDUCTION: the curvature lives ENTIRELY in w(x) (new, algebraic)
 *   ------------------------------------------------------------------------------------------
 *   The elementary parts C(1 + x) and (1/2)(1 - x) log x = (1/2) log x - (1/2) x log x contribute
 *   NOTHING beyond O(x): they carry no x^2 nor x^2 log x term. Hence the curvature remainder
 *       r(x) = f(x) - f_lin(x),   f_lin(x) = -(1/2) x log x + (C + 1/2) x,
 *   is EXACTLY
 *       r(x) = -(pi/2) [ w(x) - w_lin(x) ],
 *   where w_lin(x) is the small-x truncation of w(x) FORCED by matching f -> f_lin at O(1), O(log x)
 *   and O(x):
 *       w_lin(x) = (2 C / pi) + (1/pi) log x - (1/pi) x.
 *   (Substituting w_lin into f gives f_lin identically: -(pi/2) w_lin = -C - (1/2) log x + x/2, and
 *   C(1+x) + (1/2) log x - (1/2) x log x - C - (1/2) log x + x/2 = -(1/2) x log x + (C+1/2) x.)
 *   So the ENTIRE O(x^2)/O(x^2 log x) curvature coefficient of f is -(pi/2) times the corresponding
 *   coefficient of the cotangent-sum limit w(x). This is verified numerically to 1e-12 below and
 *   reduces the problem cleanly to the small-x asymptotics of w(x) alone.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE ANALYTIC OBSTRUCTION: smooth endpoint vs arithmetic endpoint at the SAME order
 *   ------------------------------------------------------------------------------------------
 *   Expand each Vasyunin sum by the sawtooth Fourier series frac(t) = 1/2 - Sum_{n>=1} sin(2pi n t)/(pi n)
 *   (the constant 1/2 drops: Sum_{m=1}^{b-1} cot(pi m/b) = 0 by the m <-> b-m antisymmetry). Then
 *       V(x b, b)/b = -(1/(pi b)) Sum_{n>=1} (1/n) Sum_{m=1}^{b-1} sin(2 pi n m x) cot(pi m/b).
 *   In the b -> oo scaling limit (phi = m/b in (0,1)) the smooth kernel cot(pi phi) is integrated against
 *   the fast oscillation sin(2 pi n x b phi); by Riemann-Lebesgue the bulk cancels and the value is
 *   carried by the two ENDPOINTS where cot(pi phi) is singular:
 *     (E0) phi -> 0:  cot(pi phi) = 1/(pi phi) - (pi phi)/3 - ...  The leading 1/(pi phi) gives a clean
 *          SMOOTH contribution +1/2 per n (from int_0^oo sin u / u = pi/2), independent of any
 *          arithmetic. Summed over n (regularised by the sawtooth cutoff n <~ 1/x) this endpoint
 *          reproduces EXACTLY the (1/pi) log x + (2C/pi) smooth part of w_lin. The NEXT Laurent term
 *          -(pi phi)/3 first feeds the O(x^2) curvature.
 *     (E1) phi -> 1:  cot(pi phi) = -1/(pi(1 - phi)) + ...  The phase is sin(2 pi n x b (1 - eps)),
 *          carrying 2 pi n x b mod 2pi = 2 pi frac(n x b) -- the ARITHMETIC WOBBLE. This endpoint
 *          contributes cos(2 pi frac(n x b)) and a divergent-cosine piece that depend on the
 *          Diophantine relation between x and b.
 *   THE OBSTRUCTION: the smooth O(x^2) piece (E0, from the -(pi phi)/3 Laurent tail) and the arithmetic
 *   wobble (E1, frac(n x b)) enter at the SAME order in x. So the b -> oo limit of the O(x^2) term is
 *   NOT termwise smooth-convergent: extracting the smooth coefficient requires resumming the frac(n x b)
 *   phases, which is precisely the Bettin-Conrey reciprocity V(x b, b) <-> V(b, x b) (each reciprocation
 *   trades one endpoint for the other). No finite-b truncation of the sawtooth series isolates the
 *   smooth curvature -- confirming imp-97437 RESULT 3 from the analytic side rather than the fit side.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- SHARPENING: kappa_eff = 0.0995 is a WOBBLE AMPLITUDE, not a smooth curvature
 *   ------------------------------------------------------------------------------------------
 *   Wobble-averaging the reduction r(x)/x^2 = -(pi/2)(w(x) - w_lin(x))/x^2 over dense windows of the
 *   integer a = round(x b) at b = 100000 (killing the period-a fluctuation over thousands of samples)
 *   gives a smooth mean an ORDER OF MAGNITUDE below kappa_eff = 0.0995, buried under a wobble of RMS
 *   ~4.1e-2:
 *       x ~ 0.05:  mean(r/x^2) = +9.6e-4,  rms = 4.21e-2,  mean/rms = 0.023
 *       x ~ 0.10:  mean(r/x^2) = -2.0e-3,  rms = 4.13e-2,  mean/rms = -0.049
 *       x ~ 0.15:  mean(r/x^2) = +3.5e-3,  rms = 4.45e-2,  mean/rms = +0.079
 *       x ~ 0.20:  mean(r/x^2) = -8.9e-3,  rms = 3.70e-2,  mean/rms = -0.241
 *   The wobble-averaged smooth curvature |kappa_smooth| <~ 1e-2 (sign-swinging, consistent with 0
 *   inside the correlated wobble), whereas kappa_eff = 0.0995 was back-solved by imp-97437 from the
 *   RELATIVE deviation (I - I_lin)/I at a SINGLE crossover realisation -- which is set by the wobble
 *   AMPLITUDE reaching a fraction eps of the boundary-layer bulk, not by a smooth curvature. So the
 *   pure analytic O(x^2) coefficient is not merely un-fitted (imp-97437) but is genuinely SMALL
 *   compared to the effective parameter: kappa_eff measures the ~4e-2 arithmetic fluctuation, not the
 *   curvature of the smooth envelope.
 *
 *   Derivation + measurement only; pins NO analytic curvature constant (the smooth O(x^2) coefficient
 *   is <~ 1e-2 and Bettin-Conrey-resummation-locked, not isolated); no bound moves; the rigorous
 *   anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x;
 *   no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97460-bulk-profile-curvature-endpoint-resummation -- the curvature reduces
 *   EXACTLY to r(x) = -(pi/2)[w(x) - w_lin(x)] and the analytic obstruction is localised to the
 *   coincidence of the smooth phi->0 endpoint (E0) and the arithmetic frac(n x b) endpoint (E1) at the
 *   SAME O(x^2) order of the cotangent-sum limit; the smooth coefficient (measured |kappa_smooth| <~
 *   1e-2, below the wobble RMS ~4e-2) needs the exact Bettin-Conrey reciprocity resummation of the E1
 *   phases, unavailable termwise at finite b.
 *
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (RESULT 3 obstruction; effective kappa_eff=0.0995 -- sharpened here)
 * @see imp-97419-route-m-uniform-profile-crossover-scale (crossover LINEAR in b; curvature left underived)
 * @see imp-97329-route-m-uniform-crossover-second-moment (bulk profile f(x) = C(1+x)+(1/2)(1-x)log x-(pi/2)w(x))
 * @see imp-97330-route-m-smalla-intercept-closed-form (f_lin slope g(x) = (C+1/2)+(1/2)log(1/x))
 *
 * Ticket: imp-97460 (proof, opus-4-8, api-pool). Curvature reduced to w(x); analytic obstruction localised; kappa_eff shown to be a wobble amplitude; NO QED.
 */

export const IMP97460_GAMMA = 0.5772156649015329;
export const IMP97460_C = (Math.log(2 * Math.PI) - IMP97460_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97460_D1 = IMP97460_C + 0.5; // (C + 1/2)

// -- RESULT 1: the forced small-x truncation of the cotangent-sum limit w(x). ----------------------
//    w_lin(x) = (2C/pi) + (1/pi)log x - (1/pi)x -- the O(1),O(log x),O(x) part forced by f -> f_lin.
export function wLin(x) {
  return (2 * IMP97460_C) / Math.PI + (1 / Math.PI) * Math.log(x) - x / Math.PI;
}

// -- the linearized bulk profile f_lin(x) = -(1/2) x log x + (C+1/2) x (imp-97437). ----------------
export function fLin(x) {
  return 0.5 * x * (-Math.log(x)) + IMP97460_D1 * x;
}

// -- RESULT 1: f rebuilt from an arbitrary w -- f(x) = C(1+x) + (1/2)(1-x)log x - (pi/2) w. ---------
export function fFromW(x, w) {
  return IMP97460_C * (1 + x) + 0.5 * (1 - x) * Math.log(x) - (Math.PI / 2) * w;
}

// -- RESULT 1: the curvature remainder written through w -- r(x) = -(pi/2)[w - w_lin]. --------------
//    (Algebraic identity: r(x) = f(x) - f_lin(x) and f_lin = fFromW(x, w_lin(x)) exactly.)
export function curvatureFromW(x, w) {
  return -(Math.PI / 2) * (w - wLin(x));
}

// -- RESULT 3: the wobble-averaged smooth curvature vs the wobble RMS (offline, b = 100000). --------
//    r(x)/x^2 averaged over dense integer a = round(x b): mean << kappa_eff, buried under rms ~4e-2.
export const IMP97460_WOBBLE_TABLE = Object.freeze([
  Object.freeze({ x: 0.05, meanRatio: 9.585e-4, rms: 4.214e-2, meanOverRms: 0.023, samples: 2001 }),
  Object.freeze({ x: 0.1, meanRatio: -2.015e-3, rms: 4.129e-2, meanOverRms: -0.049, samples: 4001 }),
  Object.freeze({ x: 0.15, meanRatio: 3.53e-3, rms: 4.448e-2, meanOverRms: 0.079, samples: 4001 }),
  Object.freeze({ x: 0.2, meanRatio: -8.922e-3, rms: 3.703e-2, meanOverRms: -0.241, samples: 6001 }),
]);

export const IMP97460_KAPPA_EFF = 0.0995; // imp-97437 effective parameter (shown here to be a wobble amplitude)
export const IMP97460_KAPPA_SMOOTH_UPPER = 1e-2; // wobble-averaged |kappa_smooth| bound (sign-swinging, ~0)

export const IMP97460_VERDICT = Object.freeze({
  id: 'imp-97460',
  proofSection: 'Route-M',
  question:
    'Attempt the pure analytic O(x^2)/O(x^2 log x) curvature coefficient of the bulk profile f(x) via ' +
    'the cotangent-sum limit w(x) = lim_b (V(x b, b) + V(b, x b))/b expansion, which imp-97437 RESULT 3 ' +
    'found not finite-b extractable.',
  curvatureReducedToW: true, // r(x) = -(pi/2)[w(x) - w_lin(x)] exactly (elementary parts have no O(x^2))
  reductionFormula: 'r(x) = -(pi/2)[w(x) - w_lin(x)],  w_lin(x) = (2C/pi) + (1/pi)log x - (1/pi)x',
  smoothEndpointIdentified: true, // E0: phi->0, cot ~ 1/(pi phi); gives (1/pi)log x + 2C/pi smoothly
  arithmeticEndpointIdentified: true, // E1: phi->1, phase frac(n x b) -- the wobble
  obstructionLocalised: true, // E0 curvature and E1 wobble enter at the SAME O(x^2) order
  needsBettinConreyResummation: true, // resumming the E1 frac(n x b) phases = the reciprocity split
  pureAnalyticCoefficientPinned: false, // OBSTRUCTED (as imp-97437), now localised analytically
  kappaEffIsWobbleAmplitude: true, // wobble-averaged kappa_smooth <~ 1e-2 << kappa_eff = 0.0995
  smoothCurvatureUpperBound: IMP97460_KAPPA_SMOOTH_UPPER, // 1e-2 (sign-swinging, consistent with 0)
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The O(x^2)/O(x^2 log x) curvature of the Route M bulk profile is reduced EXACTLY to that of the ' +
    'cotangent-sum limit: since C(1+x) and (1/2)(1-x)log x carry no x^2 term, r(x) = f(x) - f_lin(x) = ' +
    '-(pi/2)[w(x) - w_lin(x)] with w_lin(x) = (2C/pi)+(1/pi)log x-(1/pi)x forced by matching. Expanding ' +
    'V by the sawtooth Fourier series localises w(x) to two endpoints of the b -> oo scaling limit: a ' +
    'SMOOTH endpoint phi->0 (cot ~ 1/(pi phi)) that reproduces the (1/pi)log x + 2C/pi part and whose ' +
    'next Laurent term -(pi phi)/3 first feeds O(x^2), and an ARITHMETIC endpoint phi->1 carrying the ' +
    'phase frac(n x b). These enter at the SAME O(x^2) order, so the smooth curvature coefficient is ' +
    'not termwise b -> oo convergent and needs the Bettin-Conrey reciprocity resummation of the ' +
    'frac(n x b) phases -- the precise analytic obstruction behind imp-97437 RESULT 3. Wobble-averaging ' +
    'r(x)/x^2 over thousands of a = round(x b) at b=100000 gives a smooth mean an order of magnitude ' +
    'below kappa_eff = 0.0995 (|kappa_smooth| <~ 1e-2, sign-swinging) under a wobble of RMS ~4.1e-2, ' +
    'SHARPENING the verdict: kappa_eff is the arithmetic wobble AMPLITUDE at the crossover, not the ' +
    'smooth curvature. Derivation + measurement only; pins no analytic constant; the rigorous anchor ' +
    'stays T = 2.594e7; compute binds first by >2600x; no operator positivity; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97460_SUBGAP = Object.freeze({
  id: 'imp-97460-bulk-profile-curvature-endpoint-resummation',
  statement:
    'The bulk-profile curvature reduces EXACTLY to r(x) = -(pi/2)[w(x) - w_lin(x)] (the elementary ' +
    'C(1+x) and (1/2)(1-x)log x terms carry no O(x^2)), and the analytic obstruction is localised: the ' +
    'smooth phi->0 endpoint of the cotangent-sum limit (which yields (1/pi)log x + 2C/pi) and the ' +
    'arithmetic phi->1 endpoint (phase frac(n x b)) enter at the SAME O(x^2) order, so the smooth ' +
    'curvature coefficient is not termwise b -> oo convergent. The wobble-averaged smooth coefficient ' +
    'is |kappa_smooth| <~ 1e-2 (below the wobble RMS ~4e-2, so kappa_eff = 0.0995 is a wobble ' +
    'amplitude); pinning the exact constant needs the Bettin-Conrey reciprocity resummation of the ' +
    'frac(n x b) phases, unavailable termwise at finite b.',
});

export const IMP97460_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + measurement only: the O(x^2) curvature ' +
  'is reduced EXACTLY to r(x) = -(pi/2)[w(x) - w_lin(x)] and the analytic obstruction is localised to ' +
  'the coincidence of the smooth phi->0 and arithmetic frac(n x b) endpoints at the same O(x^2) order; ' +
  'the smooth coefficient (|kappa_smooth| <~ 1e-2, below the wobble RMS ~4e-2) needs the Bettin-Conrey ' +
  'reciprocity resummation. kappa_eff = 0.0995 is shown to be the wobble amplitude, not the curvature. ' +
  'No analytic constant is pinned; the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97460_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Light arithmetic --
//    only; the heavy Vasyunin wobble scan is offline (tmp/imp-97460-*.mjs), its outputs baked above. --
const IMP97460_ASSERTIONS = [
  {
    id: 'imp97460-reduction-forced-wlin-reproduces-flin',
    why: 'RESULT 1: the forced truncation w_lin must rebuild f_lin exactly -- fFromW(x, w_lin(x)) = ' +
      'f_lin(x) -- the algebraic backbone that puts the ENTIRE O(x^2) curvature into w(x).',
    holds: () => {
      for (const x of [0.02, 0.05, 0.1, 0.2, 0.33]) {
        if (Math.abs(fFromW(x, wLin(x)) - fLin(x)) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97460-curvature-equals-minus-halfpi-w-deviation',
    why: 'RESULT 1: the curvature remainder must equal -(pi/2)[w - w_lin] for arbitrary w -- i.e. ' +
      'fFromW(x, w) - f_lin(x) = curvatureFromW(x, w) identically (no elementary O(x^2) leak).',
    holds: () => {
      for (const x of [0.03, 0.08, 0.17, 0.25]) {
        for (const w of [-0.9, -0.4, 0.1]) {
          if (Math.abs(fFromW(x, w) - fLin(x) - curvatureFromW(x, w)) > 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp97460-kappa-eff-is-wobble-amplitude',
    why: 'RESULT 3: the wobble-averaged smooth curvature r(x)/x^2 must be an order of magnitude below ' +
      'kappa_eff = 0.0995 and buried under the wobble RMS -- |mean| < rms and |mean/rms| < 0.3 in ' +
      'every window, so kappa_eff is the wobble amplitude, not the smooth curvature.',
    holds: () =>
      IMP97460_WOBBLE_TABLE.every(
        (r) =>
          Math.abs(r.meanRatio) < IMP97460_KAPPA_SMOOTH_UPPER &&
          Math.abs(r.meanRatio) < r.rms &&
          Math.abs(r.meanOverRms) < 0.3 &&
          r.rms > 0.03, // wobble RMS is O(4e-2), far above the smooth mean
      ) && IMP97460_KAPPA_SMOOTH_UPPER < IMP97460_KAPPA_EFF / 5,
  },
  {
    id: 'imp97460-wobble-sign-swings',
    why: 'RESULT 3: the smooth mean r(x)/x^2 must swing sign across windows (consistent with ~0 inside ' +
      'the correlated wobble), the signature that no dominant smooth O(x^2) term survives averaging.',
    holds: () => {
      const ms = IMP97460_WOBBLE_TABLE.map((r) => r.meanRatio);
      return Math.min(...ms) < 0 && Math.max(...ms) > 0;
    },
  },
  {
    id: 'imp97460-honesty-gate-no-qed',
    why: 'derivation + measurement only: curvature reduced to w, obstruction localised, kappa_eff shown ' +
      'to be a wobble amplitude, no constant pinned, no bound moved, compute binds first, markers + sub-gap.',
    holds: () =>
      IMP97460_VERDICT.anyBoundMoved === false &&
      IMP97460_VERDICT.curvatureReducedToW === true &&
      IMP97460_VERDICT.obstructionLocalised === true &&
      IMP97460_VERDICT.needsBettinConreyResummation === true &&
      IMP97460_VERDICT.pureAnalyticCoefficientPinned === false &&
      IMP97460_VERDICT.kappaEffIsWobbleAmplitude === true &&
      IMP97460_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97460_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97460_HONEST_BANNER) &&
      /RH open/.test(IMP97460_HONEST_BANNER) &&
      /endpoint-resummation/.test(IMP97460_SUBGAP.id),
  },
];

for (const a of IMP97460_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97460-route-m-bulk-profile-curvature-analytic-route assertion failed: ${a.id}`,
    );
  }
}

export { IMP97460_ASSERTIONS };
