/**
 * @module imp-95638-deficit-invariant-fartail-limit
 *
 * imp-95638 (numerical/derivation): imp-95614 X4 measured the far-tail deficit
 * invariant D(N) = (1/2 - p(N)) * ln N settling near ~0.508 across N = 1e24..1e300
 * and noted only that it "decreases slowly toward 1/2 * lim(ln N / ln T0)" without
 * deriving the limiting constant. This module derives the exact leading asymptotic
 * of D(N) in closed form from the inherited imp-3406 component model and compares it
 * to the measured ~0.508 plateau and to the ticket target 1/2 * lim(ln N / ln T0).
 *
 * THE MODEL (identical to imp-3406 / imp-95602 / imp-95614 -- no fresh term)
 * -------------------------------------------------------------------------
 *   sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *   T0     : Riemann-von Mangoldt inverse of N,  x = ln N = u + ln(u-1),  u = ln(T0/2pi)
 *   L      = ln T0 = u + ln(2pi)
 *   E_coll = C_C_PINNED * sqrt(L / N)   (dominant local decay, GUE-conditional C_H)
 *   E_flow = C_F (L / T0) Gronwall,  C_F = (u+1)/2pi   (imp-398)
 *   E_trunc = 3.06e-5                   (N-independent fixed strip, imp-2631)
 *   p(N)   = -d ln sigma / d ln N       (pointwise local decay exponent)
 *
 * THE DERIVATION (closed form)
 * ----------------------------
 * In the far tail both E_coll = C_C sqrt(L/N) -> 0 and E_flow ~ L/T0 -> 0, while
 * E_trunc = 3.06e-5 is a fixed floor, so the denominator is dominated by E_trunc and
 * the E_flow/E_coll denominator-weight corrections in
 *     p = -(d ln E_coll/dx) + (E_coll d ln E_coll/dx + E_flow d ln E_flow/dx)/E(N)
 * are exponentially small (order E_coll/E_trunc = O(sqrt(L/N))). Hence to all orders
 * that survive the far tail,
 *     p(N) -> -d ln E_coll / dx = 1/2 - (1/2)(u-1)/(u L),
 * using d ln E_coll/dx = (1/2)(du/dx)/L - 1/2 and du/dx = (u-1)/u (implicit
 * differentiation of x = u + ln(u-1)). Therefore
 *     1/2 - p(N) = (1/2)(u-1)/(u L) + O(sqrt(L/N)),
 * and multiplying by ln N = x gives the EXACT leading form of the invariant:
 *
 *     D(N) = (1/2 - p) ln N = (1/2) * (u-1)/u * (ln N / ln T0) + o(1).      [LEADING]
 *
 * Since (u-1)/u -> 1 and ln N / ln T0 = x/L -> 1 as u -> infinity (N -> infinity),
 *
 *     lim_{N->inf} D(N) = 1/2 * lim (ln N / ln T0) = 1/2 * 1 = 1/2.        [LIMIT]
 *
 * So the ticket's conjectured target 1/2 * lim(ln N/ln T0) is CORRECT and equals
 * exactly 1/2; the measured ~0.508 plateau is NOT a distinct constant but the slowly
 * decaying finite-N head. Expanding (u-1)/u * x/L for large u (x = u + ln(u-1),
 * L = u + ln 2pi) gives the explicit finite-N excess
 *
 *     D(N) = 1/2 + (ln(u/2pi) - 1)/(2u) + O((ln u / u)^2),                 [EXCESS]
 *
 * a positive O(ln u / u) correction that decays monotonically -- accounting for the
 * observed drift 0.5094 (1e24) -> 0.5085 (1e44) -> 0.5056 (1e100) -> 0.5027 (1e300).
 *
 * NUMERICAL CONFIRMATION (see assertions): the LEADING form reproduces the full-model
 * D(N) to ~2e-6 across N = 1e24..1e300, and both -> 1/2 while ln N/ln T0 -> 1.
 *
 * DERIVATION/MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-95614-sigma-exponent-ramp-crosscheck (X4, the measured ~0.508 plateau)
 * @see imp-95602-sigma-exponent-ramp-past-1e12 (single log-space evaluator)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2 from below)
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise local exponent p(N))
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-95602)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3406/imp-95602/imp-95614 exactly
const HALF = 0.5;

// Inversion of x = u + ln(u-1), x = ln N, by contraction fixed point (imp-95614 (a)).
function uFromLnN(x) {
  let u = x;
  for (let i = 0; i < 400; i++) {
    const un = x - Math.log(u - 1);
    if (Math.abs(un - u) < 1e-15 * Math.max(1, u)) return un;
    u = un;
  }
  return u;
}

// Full-model closed-form p(x) = -d ln sigma / d ln N (imp-95614 (b), same sub-terms).
function pAnalytic(x) {
  const u = uFromLnN(x);
  const L = u + Math.log(TWO_PI); // ln T0
  const dudx = (u - 1) / u;
  const C_F = (u + 1) / TWO_PI;
  const lnEcoll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * x;
  const lnEflow = Math.log(C_F) + Math.log(L) - L + Math.log(GRONWALL);
  const Ecoll = Math.exp(lnEcoll);
  const Eflow = Math.exp(lnEflow);
  const EN = E_TRUNC + Eflow + Ecoll;
  const dlnEcoll = 0.5 * dudx / L - 0.5;
  const dlnEflow = dudx * (1 / (u + 1) - 1) + dudx / L;
  const dlnSigma = dlnEcoll - (Ecoll * dlnEcoll + Eflow * dlnEflow) / EN;
  return -dlnSigma;
}

// D(N) = (1/2 - p) ln N from the full model.
function deficitModel(log10N) {
  const x = log10N * Math.LN10;
  return (HALF - pAnalytic(x)) * x;
}

// [LEADING] closed form D(N) = (1/2)(u-1)/u (ln N / ln T0).
function deficitLeading(log10N) {
  const x = log10N * Math.LN10;
  const u = uFromLnN(x);
  const L = u + Math.log(TWO_PI);
  return HALF * ((u - 1) / u) * (x / L);
}

// [EXCESS] explicit finite-N form D(N) = 1/2 + (ln(u/2pi) - 1)/(2u).
function deficitExcess(log10N) {
  const x = log10N * Math.LN10;
  const u = uFromLnN(x);
  return HALF + (Math.log(u / TWO_PI) - 1) / (2 * u);
}

const lnNoverLnT0 = (log10N) => {
  const x = log10N * Math.LN10;
  const u = uFromLnN(x);
  return x / (u + Math.log(TWO_PI));
};

const SAMPLES = [24, 44, 100, 300, 1000, 5000].map((d) => ({
  log10N: d,
  model: +deficitModel(d).toFixed(6),
  leading: +deficitLeading(d).toFixed(6),
  excess: +deficitExcess(d).toFixed(6),
  lnNoverLnT0: +lnNoverLnT0(d).toFixed(6),
}));

// Deep-tail limit probe (approach to 1/2) far past the measured window.
const DEEP = [1e5, 1e7, 1e10].map((d) => ({
  log10N: d,
  model: +deficitModel(d).toFixed(9),
  lnNoverLnT0: +lnNoverLnT0(d).toFixed(9),
}));

const MAX_LEADING_ERR = Math.max(
  ...[24, 44, 100, 300, 1000, 5000].map((d) => Math.abs(deficitModel(d) - deficitLeading(d)))
);

export const IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT = {
  id: 'imp-95638',
  proofSection: 'S-frontier',
  question:
    'What is the exact leading far-tail asymptotic, in closed form, of the imp-95614 deficit ' +
    'invariant D(N) = (1/2 - p(N)) ln N (measured ~0.508), and does it equal the conjectured ' +
    '1/2 * lim(ln N / ln T0)? Derivation/measurement only; inherited imp-3406 model, NOT ' +
    'rigorous; conditional-share diagnostic, NOT an RH bound; no QED.',
  method:
    'From the inherited imp-3406 component model with E_trunc a fixed floor and E_coll, E_flow -> 0, ' +
    'the denominator-weight corrections to p are O(sqrt(ln T0 / N)) and vanish, so p -> ' +
    '-d ln E_coll/dx = 1/2 - (1/2)(u-1)/(u ln T0) with du/dx = (u-1)/u from x = u + ln(u-1). ' +
    'Multiplying 1/2 - p by ln N gives the leading form; expanding in u gives the finite-N excess.',
  closedFormLeading: 'D(N) = (1/2) * (u-1)/u * (ln N / ln T0),  u = ln(T0/2pi)',
  closedFormExcess: 'D(N) = 1/2 + (ln(u/2pi) - 1)/(2u) + O((ln u / u)^2)',
  limit: HALF,
  ticketTargetEquals: '1/2 * lim(ln N / ln T0) = 1/2 * 1 = 1/2',
  samples: SAMPLES,
  deepTail: DEEP,
  maxLeadingError: +MAX_LEADING_ERR.toExponential(3), // ~2e-6 over 1e24..1e300
  finding: {
    F1_leading_closed_form:
      'D(N) = (1/2)(u-1)/u (ln N / ln T0) is the exact leading asymptotic; it reproduces the ' +
      'full-model D(N) to ~2e-6 across N = 1e24..1e300, the E_flow/E_coll denominator-weight ' +
      'corrections being O(sqrt(ln T0 / N)) in the far tail.',
    F2_limit_is_one_half:
      'Since (u-1)/u -> 1 and ln N / ln T0 -> 1 as N -> infinity, D(N) -> 1/2 exactly; the ' +
      'ticket-conjectured 1/2 * lim(ln N / ln T0) is correct and equals 1/2.',
    F3_plateau_is_finite_N_head:
      'The measured ~0.508 is NOT a distinct constant but the finite-N excess (ln(u/2pi)-1)/(2u), ' +
      'a positive O(ln u / u) term that decays monotonically: it predicts 0.5107 (1e24), 0.5090 ' +
      '(1e44), 0.5057 (1e100), 0.5027 (1e300), tracking the measured 0.5094/0.5085/0.5056/0.5027 ' +
      'and continuing to 0.5000 by ~1e7.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (measurement, NOT rigorous). The far-tail deficit invariant D(N) = (1/2 - p) ln N ' +
    'has exact leading closed form (1/2)(u-1)/u (ln N / ln T0) with u = ln(T0/2pi); it tends to ' +
    'exactly 1/2 as N -> infinity, so the conjectured 1/2 * lim(ln N / ln T0) is confirmed and ' +
    'equals 1/2, and the measured ~0.508 plateau is the slowly-decaying finite-N excess ' +
    '1/2 + (ln(u/2pi)-1)/(2u), not a separate constant. The leading form matches the full model ' +
    'to ~2e-6 across 1e24..1e300. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95614 X4 (measured ~0.508 plateau); imp-95602 (single log-space evaluator); imp-3463 ' +
    '(far-tail exponent -> 1/2); imp-3529 (pointwise local exponent p(N)); imp-3406 (component ' +
    'model); imp-398 (E_flow Gronwall); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE).',
};

export const IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT_ASSERTIONS = [
  {
    // F1: leading closed form reproduces the full model across the measured window.
    id: 'imp95638-leading-matches-model',
    description: 'leading D(N) = (1/2)(u-1)/u (ln N/ln T0) matches the full-model D(N) to ~2e-6 over 1e24..1e300',
    holds: () =>
      [24, 44, 100, 300, 1000, 5000].every((d) => Math.abs(deficitModel(d) - deficitLeading(d)) < 3e-6),
  },
  {
    // F2: the invariant tends to exactly 1/2, and ln N/ln T0 tends to 1, in the deep tail.
    id: 'imp95638-limit-is-one-half',
    description: 'deep-tail D(N) -> 1/2 and ln N/ln T0 -> 1 (both within 5e-5 by 1e10)',
    holds: () => {
      const deepest = DEEP[DEEP.length - 1];
      return Math.abs(deepest.model - HALF) < 5e-5 && Math.abs(deepest.lnNoverLnT0 - 1) < 5e-5;
    },
  },
  {
    // F3: the measured ~0.508 plateau is reproduced by the excess form and is monotone decreasing.
    id: 'imp95638-excess-tracks-measured-plateau',
    description: 'excess form 1/2 + (ln(u/2pi)-1)/(2u) stays in (0.502,0.512) over 1e24..1e300 and decreases monotonically',
    holds: () => {
      const window = SAMPLES.filter((s) => s.log10N <= 300);
      const inRange = window.every((s) => s.excess > 0.502 && s.excess < 0.512);
      let monotone = true;
      for (let i = 1; i < window.length; i++) {
        if (window[i].excess >= window[i - 1].excess) monotone = false;
      }
      return inRange && monotone;
    },
  },
  {
    // imp-95654: the EXCESS closed form reproduces the imp-95614 measured plateau
    // (0.5094/0.5085/0.5056/0.5027 at 1e24/1e44/1e100/1e300) within 1.5e-3.
    // Measurement cross-check only; the discrepancy is largest (~1.32e-3) at 1e24 and
    // shrinks to ~3e-6 by 1e300 as the O((ln u/u)^2) tail decays. No bound, no QED.
    id: 'imp95638-excess-matches-measured-plateau',
    description: 'excess D(N) = 1/2 + (ln(u/2pi)-1)/(2u) matches the imp-95614 measured plateau 0.5094/0.5085/0.5056/0.5027 to within 1.5e-3 over 1e24..1e300',
    holds: () => {
      const measured = { 24: 0.5094, 44: 0.5085, 100: 0.5056, 300: 0.5027 };
      return [24, 44, 100, 300].every((d) => Math.abs(deficitExcess(d) - measured[d]) < 1.5e-3);
    },
  },
  {
    // Honesty gate: derivation/measurement only, limit = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp95638-honesty-gate-no-qed',
    description: 'derivation only: far-tail limit = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT.isRigorous === false &&
      IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT.limit === 0.5 &&
      /NO QED/.test(IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT.verdict),
  },
];

for (const a of IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95638-deficit-invariant-fartail-limit assertion failed: ${a.id}`);
  }
}
