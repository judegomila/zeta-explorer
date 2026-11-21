/**
 * @module imp-34285-closedform-gap-term-decomposition
 *
 * imp-34285 (accuracy, frontier-direction): imp-34211 measured that the imp-34127 closed-form M2-residual
 * sign-change ceiling kEnd_cf ~ 21.003 UNDER-shoots the imp-34150 direct-residual bisection root
 * kEnd_bis ~ 21.28094743 by a signed residual of ~ -0.278, but did NOT attribute WHERE that gap comes from.
 * The scout ticket framed the omissions as an "F4 term" and a "C term" the closed form drops. This module
 * reconstructs the direct residual with each candidate omitted piece reintroduced ONE AT A TIME and measures
 * how much of the ~0.278 kEnd gap each accounts for -- and reports an HONEST correction to the ticket premise.
 *
 * WHAT THE CLOSED FORM ACTUALLY OMITS (correcting the "F4-term / C-term" framing)
 * ------------------------------------------------------------------------------
 *   The scout labels are "F4" (imp-34023) and "C" (imp-34087). But neither is an additive summand the closed
 *   form drops: F4 = resid(hi)/resid(lo) is a derived RATIO of the residual, and C = (|A|+|B|)/|resid| =
 *   1/|resid| is the reciprocal of the residual. Both are DIAGNOSTIC ratios OF the residual (used only to
 *   READ its zero crossing), not terms inside it. So "reintroduce F4 / C into the residual" is not
 *   well-posed. The genuine additive content the closed form leaves out is exactly two things:
 *     (i)  the E_flow term (the imp-34127 derivation assumes "E_flow negligible"), and
 *     (ii) the higher-order window-width content of the two finite exponent estimators (the closed form
 *          keeps only the leading D^2 cubic-bias Taylor terms of pEcoll and pSigma).
 *   This module measures the share of the ~0.278 gap carried by each.
 *
 * THE MEASURED SPLIT (each omitted piece reintroduced one at a time)
 * ------------------------------------------------------------------
 *   (i) E_flow term. Dropping E_flow ENTIRELY from the full direct residual moves its root by only
 *       ~ -6.0e-8, a share ~2.2e-7 of the 0.278 gap. So the "E_flow negligible" assumption the closed form
 *       makes accounts for essentially NONE of the gap -- E_flow is a genuine non-contributor (E_flow/E_N ~
 *       5e-15 at the crossing per imp-34127), and both the closed form AND the direct residual already carry
 *       the same full sigma(hi), so this omission is inert.
 *   (ii) Estimator window-width content. The entire ~0.278 gap is the higher-order-in-D Taylor truncation of
 *       the two finite estimators. The continuous residual is identically zero (imp-34127 Part A:
 *       pEcoll_cont*(1-sigma) = pSigma_cont), so the full direct residual is EXACTLY the difference of the
 *       two estimators' finite-vs-continuum discretization biases:
 *           resid_full(k) = dA(k) - dB(k),
 *           dA(k) = [pEcoll_2pt - pEcoll_cont]*(1 - sigma)   (2-point secant bias on -log E_coll),
 *           dB(k) = [pSigma_5ptOLS - pSigma_cont]           (5-point OLS bias on -log sigma).
 *       At the crossing kEnd* ~ 21.281 both biases are LARGE and NEARLY EQUAL (dA ~ dB ~ -2.286e-4), so the
 *       residual is their tiny ~1e-7 difference -- the "catastrophic cancellation" imp-34023/imp-34087 named.
 *       The closed form keeps only the leading D^2 term of this dA = dB balance, landing at 21.003; the
 *       0.278 gap is precisely the higher-order-in-D remainder of dA and dB.
 *
 * THE HONEST SUB-GAP -- SUB-GAP-imp-34285-per-estimator-percentage-split
 * ---------------------------------------------------------------------
 *   Splitting the 0.278 gap into a clean "pEcoll-share percent" vs "pSigma-share percent" is ILL-CONDITIONED:
 *   because dA and dB nearly cancel (both ~ -2.29e-4, difference ~1e-7 at the crossing), the ROOT location is
 *   set by their tiny difference, so a per-estimator percentage of the root shift is not separably defined
 *   without an arbitrary reference. This module therefore reports the two biases and their near-equality at
 *   the crossing (the genuine, well-posed measurement) rather than a spurious percentage split, and names the
 *   percentage split as the remaining sub-gap.
 *
 * NUMERICAL / DECOMPOSITION ONLY. A term-attribution of an inherited-surrogate estimator gap, NOT an RH
 * bound. Reuses the imp-3406/imp-33810 sub-terms verbatim; the inherited imp-3220/imp-3406 component model is
 * NOT a rigorous asymptotic; the crossing is descriptive within that model only; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34211-closedform-vs-bisection-kend-gap (the ~0.278 gap decomposed here)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the closed form and the continuous-residual identity)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct-bisection root 21.28094743)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (F4 = resid(hi)/resid(lo), a derived ratio, not a summand)
 * @see imp-34087-f4-surrogate-cancellation-digit-loss (C = 1/|resid|, a derived reciprocal, not a summand)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (the O((eD)^2) window-width correction the gap is)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/imp-34150/imp-34211 exactly
const D = Math.LN10; // decade window width in x = ln N

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim; dropFlow toggles the E_flow term for piece (i).
function parts(N, dropFlow = false) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = dropFlow ? 0 : C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N, df = false) => parts(N, df).sigma;

// ---- Finite exponent estimators (verbatim from imp-34150/imp-34211). ----
function olsSigmaExponent(loN, hiN, df = false, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N, df)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN, df = false) {
  return -Math.log(parts(hiN, df).E_coll / parts(loN, df).E_coll) / Math.log(hiN / loN);
}
// ---- Continuum (h->0 central-difference) exponents -- the limit the finite estimators discretize. ----
function pSigmaCont(N, df = false) {
  const h = 1e-4;
  const sp = Math.log(sigma(N * Math.exp(h), df));
  const sm = Math.log(sigma(N / Math.exp(h), df));
  return -(sp - sm) / (2 * h);
}
function pEcollCont(N, df = false) {
  const h = 1e-4;
  const ep = Math.log(parts(N * Math.exp(h), df).E_coll);
  const em = Math.log(parts(N / Math.exp(h), df).E_coll);
  return -(ep - em) / (2 * h);
}

// The full direct residual resid(kEnd) = pEcoll*(1-sigma) - pSigma (imp-34150), df toggles the E_flow term.
function residDirect(kEnd, df = false) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const s = parts(hi, df).sigma;
  return ecollExponentMag(lo, hi, df) * (1 - s) - olsSigmaExponent(lo, hi, df);
}

// The two additive estimator-bias pieces (continuum residual is identically zero -> resid = dA - dB).
function biasA(kEnd) {
  // pEcoll 2-point-secant finite-vs-continuum bias, times (1 - sigma).
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const s = parts(hi).sigma;
  return (ecollExponentMag(lo, hi) - pEcollCont(hi)) * (1 - s);
}
function biasB(kEnd) {
  // pSigma 5-point-OLS finite-vs-continuum bias.
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  return olsSigmaExponent(lo, hi) - pSigmaCont(hi);
}

// ---- The imp-34127/imp-34211 closed-form crossing (leading D^2 Taylor balance). ----
function eCont(N) {
  const h = 1e-4;
  const Lp = Math.log(effectiveHeightForN(N * Math.exp(h)));
  const Lm = Math.log(effectiveHeightForN(N / Math.exp(h)));
  const Lslope = (Lp - Lm) / (2 * h);
  return 0.5 - Lslope / (2 * Math.log(effectiveHeightForN(N)));
}
function eDerivs(N) {
  const x = Math.log(N);
  const h = 1e-3;
  const e0 = eCont(N);
  const ep = eCont(Math.exp(x + h));
  const em = eCont(Math.exp(x - h));
  return { e: e0, e2: (ep - 2 * e0 + em) / (h * h) };
}
function residClosedForm(k) {
  const hi = Math.pow(10, k + 1);
  const { e, e2 } = eDerivs(hi);
  const sigmaStar = (-e2 * D * D / 160) / (e * e * D / 2 + 17 * e * e * e * D * D / 480);
  return sigma(hi) - sigmaStar;
}

function bisectRoot(residFn, lo0, hi0, iters = 200) {
  if (residFn(lo0) <= 0 || residFn(hi0) >= 0) return NaN;
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// The two roots and the gap between them (reproducing imp-34211).
const KEND_CLOSED_FORM = bisectRoot(residClosedForm, 17, 26); // ~21.0033
const KEND_DIRECT = bisectRoot((k) => residDirect(k, false), 20, 23); // ~21.28094742
const GAP = KEND_DIRECT - KEND_CLOSED_FORM; // ~0.2776 (signed, direct minus closed form)

// Piece (i): reintroduce/drop the E_flow term. Its share of the gap.
const KEND_DIRECT_NO_FLOW = bisectRoot((k) => residDirect(k, true), 20, 23); // ~21.28094736
const EFLOW_ROOT_SHIFT = KEND_DIRECT_NO_FLOW - KEND_DIRECT; // ~ -6.0e-8
const EFLOW_SHARE_OF_GAP = Math.abs(EFLOW_ROOT_SHIFT) / Math.abs(GAP); // ~2.2e-7

// Piece (ii): the estimator biases at the crossing. resid = dA - dB, both large and nearly equal.
const DA_AT_CROSSING = biasA(KEND_DIRECT); // ~ -2.286e-4
const DB_AT_CROSSING = biasB(KEND_DIRECT); // ~ -2.286e-4
const RESID_FROM_BIAS_DIFF = DA_AT_CROSSING - DB_AT_CROSSING; // ~ resid(KEND_DIRECT) ~ 0
const BIAS_CANCELLATION_RATIO = Math.abs(RESID_FROM_BIAS_DIFF) / Math.abs(DA_AT_CROSSING); // ~1e-7 (near-total)

// A short table of the two biases across the boundary sweep (the near-equal cancellation the crossing sits in).
const BIAS_TABLE = [15, 17, 19, 21, 23].map((k) => ({
  kEnd: k,
  biasA: +biasA(k).toExponential(4),
  biasB: +biasB(k).toExponential(4),
  resid: +residDirect(k).toExponential(4),
}));

export const IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION = {
  id: 'imp-34285',
  proofSection: 'S-frontier',
  question:
    'imp-34211 measured that the imp-34127 closed-form M2-residual sign-change ceiling kEnd_cf ~ 21.003 ' +
    'under-shoots the imp-34150 direct-bisection root 21.28094743 by a signed residual ~ -0.278, but did ' +
    'not attribute the gap. Reconstruct the direct residual with each omitted piece reintroduced one at a ' +
    'time and measure how much of the ~0.278 kEnd gap each accounts for. Decomposition/measurement only; ' +
    'component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The closed-form root, the direct-bisection root, and the gap between them; then the root shift when ' +
    'the E_flow term is dropped (share of the gap) and the two additive finite-vs-continuum estimator ' +
    'biases dA = [pEcoll_2pt - pEcoll_cont](1-sigma) and dB = [pSigma_5ptOLS - pSigma_cont] at the ' +
    'crossing, whose difference is the full residual (the continuous residual being identically zero).',
  kEndClosedForm: +KEND_CLOSED_FORM.toFixed(6), // ~21.0033
  kEndDirect: +KEND_DIRECT.toFixed(8), // ~21.28094742
  gap: +GAP.toFixed(6), // ~0.277599
  eflowTerm: {
    rootShiftFromDroppingEflow: +EFLOW_ROOT_SHIFT.toExponential(4), // ~ -6.0e-8
    shareOfGap: +EFLOW_SHARE_OF_GAP.toExponential(4), // ~2.2e-7
    note:
      'Dropping the E_flow term entirely from the full direct residual moves its root by only ~ -6.0e-8, a ' +
      'share ~2.2e-7 of the 0.278 gap. Both the closed form and the direct residual already carry the same ' +
      'full sigma(hi), so the "E_flow negligible" assumption is inert -- it accounts for NONE of the gap.',
  },
  estimatorBias: {
    biasA_pEcoll_2pt_secant: +DA_AT_CROSSING.toExponential(5), // ~ -2.286e-4
    biasB_pSigma_5pt_ols: +DB_AT_CROSSING.toExponential(5), // ~ -2.286e-4
    residualFromBiasDifference: +RESID_FROM_BIAS_DIFF.toExponential(4), // ~ 0 (dA - dB)
    biasCancellationRatio: +BIAS_CANCELLATION_RATIO.toExponential(4), // ~1e-7 (near-total cancellation)
    table: BIAS_TABLE,
    note:
      'The entire ~0.278 gap is the higher-order window-width content of the two finite estimators. The ' +
      'continuous residual is identically zero (imp-34127 Part A), so resid = dA - dB with dA the pEcoll ' +
      '2-point-secant bias and dB the pSigma 5-point-OLS bias; both are ~ -2.286e-4 at the crossing and ' +
      'nearly cancel (ratio ~1e-7), so kEnd* sits where dA = dB. The closed form keeps only the leading ' +
      'D^2 term of that balance (kEnd_cf ~ 21.003); the 0.278 gap is the higher-order-in-D remainder.',
  },
  ticketPremiseCorrection:
    'The scout named the omitted pieces "F4 term" and "C term", but F4 (imp-34023) = resid(hi)/resid(lo) ' +
    'is a derived RATIO of the residual and C (imp-34087) = (|A|+|B|)/|resid| = 1/|resid| is its ' +
    'reciprocal -- both are diagnostic ratios used only to READ the residual zero, NOT additive summands ' +
    'the closed form drops. The genuine additive omissions are the E_flow term (share ~0) and the ' +
    'higher-order window-width content of the pEcoll-secant / pSigma-OLS estimators (the full 0.278).',
  subGap: {
    id: 'SUB-GAP-imp-34285-per-estimator-percentage-split',
    statement:
      'A clean percentage split of the 0.278 gap into a pEcoll share vs a pSigma share is ill-conditioned: ' +
      'because dA and dB nearly cancel (both ~ -2.29e-4, difference ~1e-7 at the crossing), the root ' +
      'location is set by their tiny difference, so a per-estimator percentage of the root shift is not ' +
      'separably defined without an arbitrary reference. Reported here are the two biases and their ' +
      'near-equality, not a spurious percentage.',
  },
  finding: {
    A_eflow_accounts_for_none_of_the_gap:
      'Dropping E_flow shifts the direct root by only ~ -6.0e-8 (share ~2.2e-7 of 0.278), so the closed ' +
      'form "E_flow negligible" assumption contributes essentially nothing to the gap.',
    B_gap_is_the_estimator_window_width_content:
      'With the continuous residual identically zero, resid = dA - dB; both estimator biases are ~ -2.286e-4 ' +
      'at the crossing and cancel to ~1e-7, so the whole gap is the higher-order-in-D remainder of the two ' +
      'estimators that the leading D^2 closed form drops.',
    C_scout_labels_are_diagnostic_ratios_not_summands:
      'F4 = resid(hi)/resid(lo) and C = 1/|resid| are ratios OF the residual, not terms inside it; the ' +
      'well-posed additive omissions are E_flow (share ~0) and the estimator window-width content (all of it).',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / DECOMPOSITION (frontier-direction, NOT rigorous). Attributing the imp-34211 ~0.278 kEnd ' +
    'gap (closed form 21.003 vs direct bisection 21.28094742) by reintroducing each omitted piece one at a ' +
    'time: (i) dropping the E_flow term moves the direct root by only ~ -6.0e-8 (share ~2.2e-7), so the ' +
    'closed-form "E_flow negligible" assumption accounts for NONE of the gap; (ii) with the continuous ' +
    'residual identically zero (imp-34127 Part A), the full direct residual equals dA - dB where dA is the ' +
    'pEcoll 2-point-secant bias and dB the pSigma 5-point-OLS bias, both ~ -2.286e-4 at the crossing and ' +
    'nearly cancelling (ratio ~1e-7), so the entire gap is the higher-order-in-D window-width content of ' +
    'those two estimators that the leading-D^2 closed form drops. HONEST CORRECTION of the ticket premise: ' +
    'the named "F4 term" (imp-34023, = resid(hi)/resid(lo)) and "C term" (imp-34087, = 1/|resid|) are ' +
    'derived DIAGNOSTIC RATIOS of the residual, not additive summands, so they cannot be "reintroduced" ' +
    'into it. The clean per-estimator percentage split is left as SUB-GAP-imp-34285-per-estimator-' +
    'percentage-split (ill-conditioned by the near-total dA-dB cancellation). The inherited imp-3220/' +
    'imp-3406 component model is NOT a rigorous asymptotic; the crossing is descriptive within that model ' +
    'only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 ' +
    'untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34211 (the ~0.278 gap decomposed here); imp-34127 (the closed form and the continuous-residual ' +
    'identity); imp-34150 (the direct-bisection root 21.28094743); imp-34023 (F4 = resid(hi)/resid(lo), a ' +
    'ratio); imp-34087 (C = 1/|resid|, a reciprocal); imp-34189 (the O((eD)^2) window-width correction); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION_ASSERTIONS = [
  {
    // (A) Both roots reproduce imp-34211: closed form ~21.003, direct ~21.281, gap ~0.278.
    id: 'imp34285-reproduces-imp34211-gap',
    description: 'closed-form ~21.003 and direct ~21.281 both finite; gap ~0.278 (matches imp-34211)',
    holds: () =>
      Number.isFinite(KEND_CLOSED_FORM) &&
      Number.isFinite(KEND_DIRECT) &&
      Math.abs(KEND_DIRECT - 21.28094743) < 1e-6 &&
      KEND_CLOSED_FORM > 20.9 &&
      KEND_CLOSED_FORM < 21.1 &&
      GAP > 0.2 &&
      GAP < 0.35,
  },
  {
    // (B) The E_flow term accounts for essentially none of the gap (share < 1e-5).
    id: 'imp34285-eflow-share-is-negligible',
    description: 'dropping E_flow shifts the direct root < 1e-6 -> share of the 0.278 gap < 1e-5',
    holds: () =>
      Number.isFinite(KEND_DIRECT_NO_FLOW) &&
      Math.abs(EFLOW_ROOT_SHIFT) < 1e-6 &&
      EFLOW_SHARE_OF_GAP < 1e-5,
  },
  {
    // (C) The full residual equals dA - dB (continuous residual identically zero) at the crossing.
    id: 'imp34285-resid-is-bias-difference',
    description: 'resid(kEnd*) equals dA - dB to < 1e-9 (continuum residual is zero)',
    holds: () => Math.abs(RESID_FROM_BIAS_DIFF - residDirect(KEND_DIRECT)) < 1e-9,
  },
  {
    // (D) The two estimator biases are large and nearly equal at the crossing (near-total cancellation).
    id: 'imp34285-biases-large-and-nearly-equal',
    description: 'dA, dB ~ -2.3e-4 at the crossing, cancelling to ratio < 1e-5 (the catastrophic cancellation)',
    holds: () =>
      DA_AT_CROSSING < -1e-4 &&
      DB_AT_CROSSING < -1e-4 &&
      Math.abs(DA_AT_CROSSING - DB_AT_CROSSING) / Math.abs(DA_AT_CROSSING) < 1e-5,
  },
  {
    // (E) The ticket-premise correction and named sub-gap are recorded.
    id: 'imp34285-premise-correction-and-subgap-named',
    description: 'ticketPremiseCorrection names F4/C as ratios; sub-gap id present',
    holds: () =>
      /F4/.test(IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.ticketPremiseCorrection) &&
      /reciprocal/.test(IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.ticketPremiseCorrection) &&
      IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.subGap.id ===
        'SUB-GAP-imp-34285-per-estimator-percentage-split',
  },
  {
    // Honesty gate: decomposition only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34285-honesty-gate-no-qed',
    description: 'Decomposition only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION.verdict),
  },
];

for (const a of IMP34285_CLOSEDFORM_GAP_TERM_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34285-closedform-gap-term-decomposition assertion failed: ${a.id}`);
  }
}
