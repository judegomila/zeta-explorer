/**
 * @module imp-3599-flow-gap-nextorder-correction
 *
 * imp-3599 (numerical, frontier-direction): imp-3580 root-solved BOTH the sigma=1/2 half-decay
 * N_half and the E_coll=E_trunc crossover N_x across the imp-3443 half-to-double E_trunc floor grid
 * and found the flow-gap 1 - N_half/N_x tracks the LEADING law gap ~ 2 E_flow(N_x)/E_trunc within a
 * sqrt/log linearization, but with an UNEXPLAINED residual of ~0.01-0.03 percentage points
 * (measured vs law: 0.228 vs 0.218, 0.316 vs 0.302, 0.398 vs 0.380, 0.549 vs 0.522, 0.687 vs 0.653).
 * This module DERIVES the next-order O((E_flow/E_trunc)^2) correction -- including the sqrt(N)
 * log-drift term coming from the slowly-varying L=log T0 in the numerator of E_coll -- and MEASURES
 * whether it closes that residual across f in {0.5..2}. Same sub-terms as imp-3580; only the model
 * for the gap is refined. No re-derivation of any sub-term, no fresh floor grid.
 *
 * THE SET-UP (identical sub-terms to imp-3220 / imp-3406 / imp-3556 / imp-3580)
 * ---------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(L / N),   L = log T0(N),   T0 = effectiveHeightForN(N)
 *     E_flow(N) = C_F * (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398 pinned)
 *     N_x    : E_coll(N_x)    = E_trunc                     (crossover, odds ratio x=1)
 *     N_half : E_coll(N_half) = E_trunc + E_flow(N_half)    (sigma=1/2, since sigma=x/(1+x))
 *     gap = 1 - N_half/N_x,   E_trunc = f * 3.06e-5,  f in {0.5, 0.75, 1.0, 1.5, 2.0}
 *
 * (A) THE EXACT GAP IDENTITY (no linearization -- the correct object imp-3580 linearized)
 * -------------------------------------------------------------------------------------
 * Divide the two root conditions. Since E_coll(N_x)=E_trunc, the ratio at the two roots is
 *     E_coll(N_half)/E_coll(N_x) = (E_trunc + E_flow(N_half))/E_trunc = 1 + eta,   eta = E_flow(N_half)/E_trunc.
 * But from the closed form E_coll = C_C sqrt(L/N),
 *     E_coll(N_half)/E_coll(N_x) = sqrt( (L_half/L_x) * (N_x/N_half) ),   L_half=L(N_half), L_x=L(N_x).
 * Squaring and solving gives the EXACT (given the model forms) gap identity
 *     N_half/N_x = (L_half / L_x) / (1 + eta)^2,
 *     gap = 1 - (L_half / L_x) / (1 + eta)^2.
 * This reproduces the imp-3580 root-solved gaps to machine precision (~1e-14) at every floor -- it
 * is algebraically the same object, just written in closed form. imp-3580 dropped the L_half/L_x
 * log-ratio (set to 1) and expanded (1+eta)^-2 ~ 1-2eta with eta ~ E_flow(N_x)/E_trunc: that is the
 * leading law gap ~ 2 E_flow(N_x)/E_trunc.
 *
 * (B) THE NEXT-ORDER CORRECTION (perturbative, N_x quantities only)
 * ----------------------------------------------------------------
 * Write eps = E_flow(N_x)/E_trunc (the leading small parameter) and Du = ln(N_half/N_x). To leading
 * order Du ~ -2 eps. Let the local log-log slopes at N_x be
 *     lambda = d ln L / d ln N |_x   (the sqrt(N) log-drift: L=log T0 slowly rising),
 *     mu     = d ln E_flow / d ln N |_x   (E_flow ~ (log T0)/T0 falling).
 * Then L_half/L_x = 1 + lambda*Du + O(Du^2) = 1 - 2 lambda eps + ..., and
 * eta = E_flow(N_half)/E_trunc = eps(1 + mu*Du) = eps(1 - 2 mu eps) + ... Substituting into the exact
 * identity and expanding to O(eps^2):
 *     gap = 2 eps (1 + lambda)  -  (4 mu + 4 lambda + 3) eps^2  +  O(eps^3).
 * The DOMINANT next-order term is the log-drift piece 2 lambda eps (lambda ~ 0.043..0.048 ~ 1/L over
 * the grid, since L=log T0 ~ 21..23), which RAISES the gap above the leading law -- exactly the sign
 * and magnitude of the imp-3580 residual. The quadratic bracket (4 mu + 4 lambda + 3) eps^2 is a much
 * smaller downward correction (eps ~ 1e-3), with mu ~ -0.85 (E_flow falls almost like 1/T0).
 *
 * (C) MEASUREMENT: the next-order model closes ~95% of the imp-3580 residual
 * -------------------------------------------------------------------------
 * Re-root-solving BOTH crossings per floor (400-iter bisection in ln N, residual < 1e-9, reproducing
 * imp-3580 to the last digit) and computing lambda, mu at N_x by central finite difference in ln N:
 *   f=0.5   gap=0.22832%  leading=0.21849%  resid0=0.00983pp  ->  nextOrder=0.22787%  resid1=0.00045pp
 *   f=0.75  gap=0.31643%  leading=0.30230%  resid0=0.01413pp  ->  nextOrder=0.31575%  resid1=0.00068pp
 *   f=1.0   gap=0.39811%  leading=0.37985%  resid0=0.01826pp  ->  nextOrder=0.39719%  resid1=0.00092pp
 *   f=1.5   gap=0.54863%  leading=0.52245%  resid0=0.02618pp  ->  nextOrder=0.54722%  resid1=0.00141pp
 *   f=2.0   gap=0.68729%  leading=0.65352%  resid0=0.03376pp  ->  nextOrder=0.68536%  resid1=0.00192pp
 * The exact identity (A) matches the root-solved gap to ~1e-14 at every floor; the perturbative
 * next-order model (B) shrinks the leading-law residual by ~20x (0.00983 -> 0.00045, 0.03376 ->
 * 0.00192 pp), i.e. it closes ~94-95% of the ~0.01-0.03pp residual, uniformly across the grid.
 *
 * HONEST SUB-GAP (imp-3599-nextorder-residual-tail)
 * -------------------------------------------------
 * The next-order model does NOT close the residual to zero: a ~5% tail (resid1 ~ 4.5e-4..1.9e-3 pp)
 * survives, from the neglected O(eps^3) term, the second-derivative curvature (1/2) s (Du)^2 in the
 * slope expansion, and the finite-difference evaluation of lambda, mu. The EXACT identity (A) is
 * complete; the perturbative CLOSED expansion (B) is truncated at O(eps^2). Pushing to O(eps^3) is
 * the named sub-gap.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) EXACT identity: gap = 1 - (L_half/L_x)/(1+eta)^2 reproduces the imp-3580 root-solved gap to
 *        ~1e-14 at every half-to-double floor node -- the correct closed object the leading law
 *        approximated.
 *   (F2) The leading law gap ~ 2 E_flow(N_x)/E_trunc under-predicts by a residual growing
 *        monotonically 0.00983 -> 0.03376 pp with the floor (reproducing imp-3580s measured-vs-law).
 *   (F3) The next-order model gap ~ 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2, dominated by the
 *        log-drift term 2 lambda eps (lambda ~ 1/L ~ 0.043..0.048), closes ~94-95% of that residual
 *        (resid shrinks ~20x to ~5e-4..1.9e-3 pp) uniformly across f in {0.5..2}. The remaining ~5%
 *        is the honest O(eps^3)/curvature sub-gap imp-3599-nextorder-residual-tail.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3580-sigma-crossover-floor-invariance (the leading gap ~ 2 E_flow/E_trunc law and residual)
 * @see imp-3556-sigma-threshold-crossings-rootsolve (baseline half-decay <=> crossover certification)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3443-nmax-etrunc-sensitivity (half-to-double E_trunc floor grid 0.5x .. 2x)
 * @see imp-398 (E_flow C_F pinned prefactor); imp-2631 (E_trunc fixed-strip floor 3.06e-5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556/imp-3580)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3580 exactly

// EXACT imp-3580 sub-terms (no re-derivation); only E_trunc is a parameter.
function parts(N, eTrunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3580).
function argmaxSigmaLnN(loN, hiN, eTrunc) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (parts(Math.exp(m1), eTrunc).sigma < parts(Math.exp(m2), eTrunc).sigma) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N_half: post-peak crossing where sigma first drops below 1/2 (400-iter bisection in ln N).
function crossHalf(eTrunc) {
  const nMax = argmaxSigmaLnN(1e4, 1e9, eTrunc);
  let a = Math.log(nMax);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc).sigma > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// N_x: the imp-3444 crossover where E_coll(N) = E_trunc (odds ratio x = 1 there).
function crossCollEqTrunc(eTrunc) {
  let a = Math.log(1e6);
  let b = Math.log(1e15);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc).E_coll > eTrunc) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Local log-log slopes at N (central finite difference in ln N, step 1e-5):
//   lambda = d lnL/d lnN  (the sqrt(N) log-drift), mu = d lnE_flow/d lnN.
function slopes(N, eTrunc) {
  const h = 1e-5;
  const u = Math.log(N);
  const pp = parts(Math.exp(u + h), eTrunc);
  const pm = parts(Math.exp(u - h), eTrunc);
  const lambda = (Math.log(pp.L) - Math.log(pm.L)) / (2 * h);
  const mu = (Math.log(pp.E_flow) - Math.log(pm.E_flow)) / (2 * h);
  return { lambda, mu };
}

// (A)+(B)+(C) Re-root-solve both crossings and build the exact + next-order gap models per floor.
const FACTORS = [0.5, 0.75, 1.0, 1.5, 2.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_half = crossHalf(eTrunc);
  const N_x = crossCollEqTrunc(eTrunc);
  const pH = parts(N_half, eTrunc);
  const pX = parts(N_x, eTrunc);
  const eta = pH.E_flow / eTrunc; // E_flow at N_half
  const eps = pX.E_flow / eTrunc; // E_flow at N_x (the leading small parameter)
  const { lambda, mu } = slopes(N_x, eTrunc);

  const gap = 1 - N_half / N_x; // root-solved (measured) gap
  const gapLeading = 2 * eps; // imp-3580 leading law
  const gapExact = 1 - (pH.L / pX.L) / ((1 + eta) * (1 + eta)); // (A) exact identity
  const gapNextOrder = 2 * eps * (1 + lambda) - (4 * mu + 4 * lambda + 3) * eps * eps; // (B)

  const resid0 = Math.abs(gap - gapLeading);
  const resid1 = Math.abs(gap - gapNextOrder);
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_half: +N_half.toExponential(6),
    N_x: +N_x.toExponential(6),
    lambda: +lambda.toFixed(6), // log-drift slope ~ 1/L
    mu: +mu.toFixed(6), // E_flow falls ~ 1/T0
    gap_pct: +(gap * 100).toFixed(5),
    leading_pct: +(gapLeading * 100).toFixed(5), // imp-3580 law
    nextorder_pct: +(gapNextOrder * 100).toFixed(5),
    exact_pct: +(gapExact * 100).toFixed(5),
    exact_abs_err: +Math.abs(gap - gapExact).toExponential(2), // (A) reproduces root-solve
    resid_leading_pp: +(resid0 * 100).toFixed(5), // ~0.01-0.03 pp (imp-3580)
    resid_nextorder_pp: +(resid1 * 100).toFixed(5), // ~5e-4-1.9e-3 pp
    closure_fraction: +(1 - resid1 / resid0).toFixed(4), // fraction of residual closed
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const MAX_EXACT_ERR = Math.max(...GRID.map((r) => r.exact_abs_err));
const MIN_CLOSURE = Math.min(...GRID.map((r) => r.closure_fraction));
const RESID0S = GRID.map((r) => r.resid_leading_pp);
const RESID0_MIN = Math.min(...RESID0S);
const RESID0_MAX = Math.max(...RESID0S);

export const IMP3599_FLOW_GAP_NEXTORDER_CORRECTION = {
  id: 'imp-3599',
  proofSection: 'S-frontier',
  question:
    'Derive the next-order O((E_flow/E_trunc)^2) correction (with the sqrt(N) log-drift term) to the ' +
    'imp-3580 gap ~ 2 E_flow(N_x)/E_trunc law and measure whether it closes the ~0.01-0.03 pp ' +
    'residual between the linearized law and the root-solved N_half/N_x gap across the half-to-double ' +
    'E_trunc floor grid. Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  quantity:
    'gap = 1 - N_half/N_x with N_half (sigma=1/2), N_x (E_coll=E_trunc) root-solved per floor; ' +
    'exact identity gap = 1 - (L_half/L_x)/(1+eta)^2 and next-order gap = 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2',
  floorGrid: GRID,
  baselineNode: BASELINE, // f=1.0 reproduces imp-3580 gap 0.398% and its 0.018pp leading-law residual
  exactIdentity: 'gap = 1 - (L_half/L_x)/(1+eta)^2, eta=E_flow(N_half)/E_trunc; reproduces root-solve to ~1e-14',
  nextOrderModel: 'gap = 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2, eps=E_flow(N_x)/E_trunc, lambda=d lnL/d lnN, mu=d lnE_flow/d lnN',
  maxExactAbsErr: MAX_EXACT_ERR, // (A) closed identity vs root-solved gap, machine level
  minClosureFraction: MIN_CLOSURE, // (C) worst-floor fraction of the leading-law residual closed
  leadingResidualBandPp: { min: +RESID0_MIN.toFixed(5), max: +RESID0_MAX.toFixed(5) },
  subGap: 'imp-3599-nextorder-residual-tail',
  finding: {
    F1_exact_identity_reproduces_rootsolve:
      'EXACT identity gap = 1 - (L_half/L_x)/(1+eta)^2 reproduces the imp-3580 root-solved gap to ' +
      '~1e-14 at every half-to-double floor node -- the correct closed object the leading law approximated.',
    F2_leading_law_underpredicts:
      'The leading law gap ~ 2 E_flow(N_x)/E_trunc under-predicts by a residual growing monotonically ' +
      '0.00983 -> 0.03376 pp with the floor, reproducing the imp-3580 measured-vs-law gap.',
    F3_nextorder_closes_95pct:
      'The next-order model gap ~ 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2, dominated by the log-drift ' +
      'term 2 lambda eps (lambda ~ 1/L ~ 0.043..0.048), closes ~94-95% of that residual (resid shrinks ' +
      '~20x to ~5e-4..1.9e-3 pp) uniformly across f in {0.5..2}. The remaining ~5% is the honest ' +
      'O(eps^3)/curvature sub-gap imp-3599-nextorder-residual-tail.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). Dividing the two imp-3580 root ' +
    'conditions gives the EXACT gap identity gap = 1 - (L_half/L_x)/(1+eta)^2 (eta=E_flow(N_half)/E_trunc), ' +
    'which reproduces the root-solved N_half/N_x gap to ~1e-14 at every half-to-double floor node -- the ' +
    'closed object the imp-3580 leading law gap ~ 2 E_flow(N_x)/E_trunc approximated by dropping the ' +
    'L_half/L_x log-ratio and linearizing (1+eta)^-2. Expanding the identity to O(eps^2) with the local ' +
    'log-log slopes lambda=d lnL/d lnN (the sqrt(N) log-drift of L=log T0) and mu=d lnE_flow/d lnN at ' +
    'N_x gives the next-order model gap = 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2, whose dominant ' +
    'correction 2 lambda eps (lambda ~ 1/L ~ 0.043..0.048) is exactly the sign and magnitude of the ' +
    'imp-3580 residual. Re-root-solving both crossings per floor (400-iter bisection, residual <1e-9, ' +
    'reproducing imp-3580 to the last digit) shows the next-order model shrinks the ~0.01-0.03pp ' +
    'leading-law residual by ~20x (0.00983 -> 0.00045, 0.03376 -> 0.00192 pp), closing ~94-95% of it ' +
    'uniformly across f in {0.5..2}. HONEST SUB-GAP imp-3599-nextorder-residual-tail: a ~5% tail ' +
    'survives from the neglected O(eps^3) term, the slope-expansion curvature, and the finite-difference ' +
    'evaluation of lambda, mu -- the exact identity is complete, the closed perturbative expansion is ' +
    'truncated at O(eps^2). Derivation/measurement only; no positivity, no bridge closure, no RH claim, ' +
    'NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3580 (leading gap ~ 2 E_flow/E_trunc law and its measured residual); imp-3556 (baseline ' +
    'half-decay <=> crossover certification); imp-3444 (E_coll=E_trunc crossover N ~ 3.280e9); ' +
    'imp-3443 (half-to-double E_trunc floor grid 0.5x..2x); imp-3220 (U-shaped sigma(N) exact ' +
    'sub-terms); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip floor 3.06e-5); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3599_FLOW_GAP_NEXTORDER_CORRECTION_ASSERTIONS = [
  {
    // (F1) The EXACT identity gap = 1 - (L_half/L_x)/(1+eta)^2 reproduces the root-solved gap to
    // machine level at every floor -- it is the same object written closed.
    id: 'imp3599-exact-identity-reproduces-rootsolve',
    description: 'gap = 1 - (L_half/L_x)/(1+eta)^2 matches the root-solved gap to <1e-9 at every floor',
    holds: () => MAX_EXACT_ERR < 1e-9,
  },
  {
    // (F2) The leading law under-predicts by a residual growing monotonically with the floor, in
    // the ~0.01-0.03 pp band the ticket names (reproducing imp-3580).
    id: 'imp3599-leading-residual-in-band-and-monotone',
    description: 'leading-law residual grows monotonically across the grid, band [0.005, 0.05] pp',
    holds: () => {
      for (let i = 1; i < GRID.length; i++) {
        if (!(GRID[i].resid_leading_pp > GRID[i - 1].resid_leading_pp)) return false;
      }
      return RESID0_MIN > 0.005 && RESID0_MAX < 0.05;
    },
  },
  {
    // (F3) The next-order model closes at least 90% of the leading-law residual at EVERY floor
    // (measured ~94-95%).
    id: 'imp3599-nextorder-closes-90pct-of-residual',
    description: 'next-order model closes >=90% of the leading-law residual at every floor node',
    holds: () => MIN_CLOSURE >= 0.9 && GRID.every((r) => r.resid_nextorder_pp < 0.1 * r.resid_leading_pp + 1e-12),
  },
  {
    // (F3) The dominant next-order term is the log-drift 2 lambda eps: lambda sits in the ~1/L band
    // (L=log T0 ~ 21..23 over the grid) and is positive, raising the gap above the leading law.
    id: 'imp3599-logdrift-lambda-in-1overL-band',
    description: 'log-drift slope lambda in (0.04, 0.05) at every floor (~ 1/L, positive)',
    holds: () => GRID.every((r) => r.lambda > 0.04 && r.lambda < 0.05),
  },
  {
    // (F2) The baseline f=1.0 node reproduces imp-3580: gap 0.398% and the 0.018pp leading residual.
    id: 'imp3599-baseline-reproduces-imp3580',
    description: 'f=1.0 node reproduces imp-3580 gap 0.398% with leading-law residual ~0.018 pp',
    holds: () =>
      Math.abs(BASELINE.gap_pct - 0.39811) < 1e-3 &&
      Math.abs(BASELINE.leading_pct - 0.37985) < 1e-3 &&
      Math.abs(BASELINE.resid_leading_pp - 0.01826) < 5e-4,
  },
  {
    // Honesty gate: measurement/derivation only, named sub-gap, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3599-honesty-gate-no-qed',
    description: 'Measurement/derivation only: named sub-gap, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3599_FLOW_GAP_NEXTORDER_CORRECTION.isRigorous === false &&
      IMP3599_FLOW_GAP_NEXTORDER_CORRECTION.subGap === 'imp-3599-nextorder-residual-tail' &&
      /NO QED/.test(IMP3599_FLOW_GAP_NEXTORDER_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP3599_FLOW_GAP_NEXTORDER_CORRECTION.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3599_FLOW_GAP_NEXTORDER_CORRECTION.verdict),
  },
];

for (const a of IMP3599_FLOW_GAP_NEXTORDER_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3599-flow-gap-nextorder-correction assertion failed: ${a.id}`);
  }
}
