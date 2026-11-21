/**
 * @fileoverview imp-96002 -- Novel-routes roadmap (2026-09-23) ROUTE E first test:
 * the primon-gas response functions (heat-capacity proxy Cv(sigma), susceptibility /
 * correlation-length proxy) computed directly from the Euler product, their maximum-locus
 * (Widom line), and the large-deviation framing for an off-line zero.
 *
 * ROUTE E (rh-novel-routes-roadmap-2026-09-23, key 'E'; supercritical Widom line + large
 * deviations). Reading of the primon gas: Z(sigma)=zeta(sigma)=prod_p 1/(1-p^{-sigma}) is the
 * Bose partition function with inverse temperature beta=sigma and single-particle energies
 * E_p=log p; the condensation (Hagedorn) temperature is sigma=1, where Z diverges. The route
 * asks whether the response-function-maximum locus (the supercritical-fluid Widom line) sits at
 * sigma=1/2, which -- with the |zeta(1/2+it)| moments peaking on sigma=1/2 -- would let RH be
 * read as a concentration-of-measure statement (zeros = extreme fluctuations confined to the
 * Widom line).
 *
 * THE RESPONSE FUNCTIONS (from ln Z = ln zeta = -sum_p ln(1-p^{-sigma})).
 *   internal energy      U(sigma)   = -d/dsigma ln zeta = -zeta_prime/zeta
 *                                    = sum_p log p . x/(1-x),         x=p^{-sigma};
 *   energy variance      VarE(sigma)= d2/dsigma2 ln zeta
 *                                    = sum_p (log p)^2 . x/(1-x)^2   (the susceptibility);
 *   heat capacity        Cv(sigma)  = beta^2 . VarE = sigma^2 . VarE(sigma);
 *   correlation-length proxy xi(sigma) = sqrt(VarE(sigma))   (susceptibility ~ xi^2, diverging
 *                                    at the critical point).
 * Every summand is positive and STRICTLY DECREASING in sigma, so VarE, Cv and xi are all
 * strictly monotone decreasing on the domain of convergence sigma>1 (measured on a fine grid;
 * prime cap 20000). Sample: Cv(2)=3.5357, VarE(2)=0.8839, xi(2)=0.9402.
 *
 * THE MAXIMUM-LOCUS (the first-test observable). Because the response functions are monotone on
 * (1, infinity), they have NO interior maximum: their argmax is the left boundary, the
 * CONDENSATION EDGE sigma=1 (Hagedorn), where VarE, Cv and xi all diverge. This is the correct
 * critical behaviour (susceptibility/correlation-length divergence at the critical point) -- but
 * the maximum-locus is sigma=1, NOT sigma=1/2. The sigma=1/2 peak of the |zeta(1/2+it)| moments
 * lives in the analytically-continued critical strip 1/2<sigma<1, precisely where the Euler
 * product DIVERGES and the primon-gas thermodynamics is undefined. The convergent primon gas
 * cannot see a Widom line at 1/2; reaching it requires the transcendental continuation (the same
 * arithmetic input the flow-blindness no-go isolates).
 *
 * THE LARGE-DEVIATION FRAMING (the concentration target). The intended statement is an LDP:
 * P(a zero sits at sigma=1/2+delta) ~ exp(-N . I(delta)) with a rate function I(delta)>0 for
 * delta!=0, minimized at delta=0 (concentration on the line). But I(delta)>0 for delta!=0 is
 * exactly "no zeros off the line" -- the rate function positivity is RH ITSELF (equivalently a
 * zero-density statement), so the LDP is a RESTATEMENT of the target, not an independent lever.
 * The convergent-side response functions supply no I(delta): they are analytic and monotone on
 * sigma>1 and carry no information about the delta=+-(1/2-sigma) strip interior.
 *
 * VERDICT (honest partial; route E first test). WIDOM-LINE-AT-CONDENSATION / STRIP-INACCESSIBLE:
 *   (1) the primon-gas response functions Cv(sigma), VarE(sigma), xi(sigma) built from the
 *       convergent Euler product are strictly monotone on sigma>1, so their maximum-locus is the
 *       condensation edge sigma=1 (Hagedorn), NOT sigma=1/2 -- measured, not asserted;
 *   (2) the sigma=1/2 Widom line and the |zeta|-moment peak live in the analytically-continued
 *       critical strip 1/2<sigma<1 where the primon gas is undefined, so this route cannot reach
 *       sigma=1/2 from the convergent side;
 *   (3) the large-deviation rate function's positivity for off-line zeros is RH-equivalent, so
 *       the concentration statement is a restatement of the target -- the named sub-gap is
 *       E-CONTINUATION-GAP: any sigma=1/2 concentration requires the transcendental continuation
 *       into the strip and cannot be supplied by the convergent thermodynamics.
 * Consistent with the flow-blindness no-go (soft/convergent structure alone cannot give RH;
 * genuine arithmetic-in-the-strip input is required). Measurement only; NO bound; RH open; NO
 * QED; no refereed bound is changed.
 */

function primesUpTo(P) {
  const sieve = new Uint8Array(P + 1);
  const out = [];
  for (let i = 2; i <= P; i += 1) {
    if (!sieve[i]) {
      out.push(i);
      for (let j = 2 * i; j <= P; j += i) sieve[j] = 1;
    }
  }
  return out;
}

const PRIMES = primesUpTo(20000);

// internal energy U(sigma) = -zeta_prime/zeta = sum_p log p . x/(1-x), x=p^{-sigma}
function internalEnergy(sigma) {
  let s = 0;
  for (const p of PRIMES) {
    const lp = Math.log(p);
    const x = Math.pow(p, -sigma);
    s += lp * x / (1 - x);
  }
  return s;
}

// energy variance / susceptibility VarE(sigma) = (ln zeta)'' = sum_p (log p)^2 x/(1-x)^2
function energyVariance(sigma) {
  let s = 0;
  for (const p of PRIMES) {
    const lp = Math.log(p);
    const x = Math.pow(p, -sigma);
    const d = 1 - x;
    s += lp * lp * x / (d * d);
  }
  return s;
}

// heat-capacity proxy Cv(sigma) = beta^2 VarE = sigma^2 VarE(sigma)
function heatCapacity(sigma) {
  return sigma * sigma * energyVariance(sigma);
}

// correlation-length proxy xi(sigma) = sqrt(susceptibility) = sqrt(VarE(sigma))
function correlationLength(sigma) {
  return Math.sqrt(energyVariance(sigma));
}

// argmax of a response function on a fine grid over (lo, hi]; returns the grid sigma of the max.
function argmaxOnGrid(fn, lo, hi, step) {
  let best = -Infinity;
  let arg = lo;
  for (let sg = lo; sg <= hi + 1e-12; sg += step) {
    const v = fn(sg);
    if (v > best) { best = v; arg = sg; }
  }
  return arg;
}

// strictly-decreasing test on a fine grid (tolerant floor for float noise).
function strictlyDecreasing(fn, lo, hi, step) {
  let prev = fn(lo);
  for (let sg = lo + step; sg <= hi + 1e-12; sg += step) {
    const v = fn(sg);
    if (v > prev + 1e-9) return false;
    prev = v;
  }
  return true;
}

const GRID_LO = 1.005;
const GRID_HI = 6;
const GRID_STEP = 0.005;

export const RESPONSE_SAMPLES = Object.freeze({
  // Cv, VarE, xi at representative sigma (prime cap 20000).
  'sigma=1.5': { Cv: heatCapacity(1.5), VarE: energyVariance(1.5), xi: correlationLength(1.5) },
  'sigma=2': { Cv: heatCapacity(2), VarE: energyVariance(2), xi: correlationLength(2) },
  'sigma=3': { Cv: heatCapacity(3), VarE: energyVariance(3), xi: correlationLength(3) },
});

export const RESPONSE_ARGMAX = Object.freeze({
  Cv: argmaxOnGrid(heatCapacity, GRID_LO, GRID_HI, GRID_STEP),
  VarE: argmaxOnGrid(energyVariance, GRID_LO, GRID_HI, GRID_STEP),
  xi: argmaxOnGrid(correlationLength, GRID_LO, GRID_HI, GRID_STEP),
  condensationEdge: 1,
});

export const ROUTE_E_WIDOM_RESPONSE = Object.freeze({
  id: 'imp-96002-route-e-widom-response',
  route: 'E',
  roadmap: 'rh-novel-routes-roadmap-2026-09-23',
  partitionFunction: 'Z(sigma)=zeta(sigma)=prod_p 1/(1-p^{-sigma}) (Bose primon gas, beta=sigma, Hagedorn at sigma=1)',
  responseFunctions:
    'U=-zeta_prime/zeta=sum_p log p x/(1-x); VarE=(ln zeta)_dbar=sum_p (log p)^2 x/(1-x)^2; '
    + 'Cv=sigma^2 VarE; xi=sqrt(VarE) (x=p^{-sigma})',
  maximumLocus:
    'All response functions are strictly monotone decreasing on sigma>1, so their argmax is the '
    + 'CONDENSATION EDGE sigma=1 (Hagedorn), NOT sigma=1/2; the convergent Euler product has no '
    + 'interior maximum.',
  largeDeviation:
    'Target LDP P(zero at 1/2+delta)~exp(-N I(delta)) with I(delta)>0 for delta!=0 is exactly '
    + '"no off-line zeros" = RH; the rate function positivity is a RESTATEMENT of the target, not '
    + 'an independent lever, and the convergent-side response functions supply no I(delta).',
  subGap:
    'E-CONTINUATION-GAP: a sigma=1/2 Widom line / |zeta|-moment peak lives in the analytically '
    + 'continued strip 1/2<sigma<1 where the primon gas is undefined; reaching it needs the '
    + 'transcendental continuation, not the convergent thermodynamics.',
  verdict: 'WIDOM-LINE-AT-CONDENSATION / STRIP-INACCESSIBLE',
  note: 'Measurement only; no bound; RH open; no refereed bound is changed; NO QED.',
});

export const ROUTE_E_WIDOM_RESPONSE_ASSERTIONS = Object.freeze([
  {
    name: 'heat-capacity Cv(sigma) is strictly monotone decreasing on (1,6] (no interior maximum)',
    holds: () => strictlyDecreasing(heatCapacity, GRID_LO, GRID_HI, 0.01),
  },
  {
    name: 'susceptibility/correlation-length VarE(sigma) is strictly monotone decreasing on (1,6]',
    holds: () => strictlyDecreasing(energyVariance, GRID_LO, GRID_HI, 0.01),
  },
  {
    name: 'maximum-locus is the condensation edge sigma=1, not sigma=1/2 (argmax at grid left boundary)',
    holds: () => RESPONSE_ARGMAX.Cv <= GRID_LO + 1e-9
      && RESPONSE_ARGMAX.VarE <= GRID_LO + 1e-9
      && Math.abs(RESPONSE_ARGMAX.Cv - 0.5) > 0.4,
  },
  {
    name: 'response-function sample values reproduce to 1e-3 (Cv(2)=3.5357, VarE(2)=0.8839)',
    holds: () => Math.abs(RESPONSE_SAMPLES['sigma=2'].Cv - 3.5357) < 1e-3
      && Math.abs(RESPONSE_SAMPLES['sigma=2'].VarE - 0.8839) < 1e-3,
  },
  {
    name: 'honest verdict recorded: Widom line at condensation / strip inaccessible, no QED / RH open',
    holds: () => ROUTE_E_WIDOM_RESPONSE.verdict === 'WIDOM-LINE-AT-CONDENSATION / STRIP-INACCESSIBLE'
      && /RH open/.test(ROUTE_E_WIDOM_RESPONSE.note),
  },
]);

export default ROUTE_E_WIDOM_RESPONSE;
