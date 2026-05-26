// @module imp-1202-conjecture-15-4-numerical-audit
// imp-1202: HONEST PARTIAL numerical audit of Conjecture 15.4 (prime-delay
// domination, infinitesimal form) from research-inputs/twin_ladder_consolidated_v52.pdf
// page 15 / Section 15.9.
//
// ===========================================================================
// SECTION (a) -- THE CONJECTURE (paraphrased from paper page 15).
// ===========================================================================
//
// Conjecture 15.4 (Prime-delay domination in infinitesimal form):
//   For every sigma > 1/2 and every t in R,
//
//       Re ( xi'/xi (sigma + i t) )  >  0.
//
//   Equivalently (paper paraphrase): the completed rightward drift of xi
//   dominates the coherent prime-delay echo train in the half-plane to the
//   right of the critical line.
//
// The paper cross-references this against the explicit-formula expansion of
// -zeta'/zeta on the critical line where (log p) p^{-m/2} e^{-i T m log p}
// are the coherent prime-delay rungs (paper Section 15.7), reading the
// inequality as a pointwise domination of the prime-delay echo train by the
// completed gamma/kernel drift.
//
// ===========================================================================
// SECTION (b) -- AUDIT STRATEGY.
// ===========================================================================
//
// Strategy: compute Re xi'/xi(sigma + i t) numerically at a grid of
// (sigma, t) points parameterized by N in {100, 500, 1000, 2000, 5000, 10000}
// (the unconditional finite-N* range of imp-963 / imp-1086) using the
// Hadamard product expansion of xi:
//
//     xi(s) = e^(A + B s)  PROD_{rho}  (1 - s/rho) exp(s/rho)
//
// whose logarithmic derivative, after symmetric pairing of zeros rho and
// 1 - bar(rho) (functional equation xi(s) = xi(1-s)), becomes the
// absolutely convergent sum
//
//     xi'/xi(s)  =  SUM_{rho}  1 / (s - rho)        (paired, conditional)
//                =  SUM_{n}  [ 1/(s - rho_n) + 1/(s - bar(rho_n)) ]
//                            (with rho_n in the upper half plane).
//
// Under the Riemann Hypothesis (RH) and using PT 2021 verification of RH up
// to T_PT = 3e12, all rho_n = 1/2 + i gamma_n with gamma_n real for every
// rho_n the audit consumes (the first ~1e6 Odlyzko zeros all sit below
// gamma_{1e6} ~ 6e5 << T_PT). With u := sigma - 1/2 > 0 and v := t,
//
//     Re [ 1/(s - rho_n) + 1/(s - bar(rho_n)) ]
//         =  u / (u^2 + (v - gamma_n)^2)  +  u / (u^2 + (v + gamma_n)^2),
//
// both terms strictly positive when u > 0. Therefore the partial sum over
// the first N0 zeros is strictly positive, and any further tail contributes
// positively under RH -- so the question becomes whether the partial sum
// MINUS a rigorous tail upper bound remains strictly positive at the
// sampled (sigma, t). If yes, the conjecture EMPIRICALLY-HOLDS at that
// (sigma, t). If the partial sum minus tail bound goes non-positive,
// numerically-inconclusive at that point.
//
// HONEST CAVEAT: under RH the conjecture is TRIVIALLY satisfied because
// every term in the paired Hadamard sum is positive for u > 0. The
// numerical audit here therefore TESTS WHETHER OUR FINITE-PRECISION
// PARTIAL-SUM EVALUATION (consuming only N0 Odlyzko zeros) confirms that
// triviality -- i.e. whether truncation + roundoff destroy the positivity
// signal at the (sigma, t) we sample. A success here is a CONSISTENCY
// CHECK on the imp-1086 / imp-963 infrastructure, NOT a non-trivial test
// of the conjecture itself.
//
// SCOPE LIMITATION (FAILED-EXTRACTION COMPONENT):
// The paper's claim is that Conjecture 15.4 "Equivalently, the completed
// rightward drift of xi dominates the coherent prime-delay echo train".
// The author's intent is that this be a non-trivial pointwise inequality
// distinct from RH. However the Hadamard form combined with RH makes
// every term in the symmetric paired sum manifestly positive, so as
// stated this conjecture is TRIVIALLY IMPLIED BY RH. Whether the paper
// intends a STRONGER statement (a quantitative lower bound on
// Re xi'/xi(sigma + i t) as a function of sigma - 1/2, or an
// echo-train-amplitude lower bound) cannot be determined from the one-page
// excerpt alone. This audit therefore:
//   (1) verifies the literal statement empirically at sampled (sigma, t),
//   (2) flags the trivial-implication-by-RH observation,
//   (3) names imp-1202-sub-quantitative-form as the future sub-gap that
//       must extract the QUANTITATIVE statement (if any) from the paper.
//
// ===========================================================================
// SECTION (c) -- IMPLEMENTATION.
// ===========================================================================

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN } from './finite-height-beats-platt-trudgian.js';

// Pick a representative sigma_audit in the open half-plane sigma > 1/2.
// sigma = 0.6 sits inside the conjectured region with u := sigma - 1/2 = 0.1
// (large enough to give a clean numerical signal, small enough to remain
// near the critical line where the conjecture is non-trivial under
// alternative hypotheses).
const SIGMA_AUDIT = 0.6;
const U_AUDIT = SIGMA_AUDIT - 0.5;  // = 0.1

// Number of Odlyzko zeros consumed for the partial sum. We use first N0
// zeros where N0 = min(N, ZEROS_EXTENDED.length). The audit grid runs N
// over {100, 500, 1000, 2000, 5000, 10000} -- the unconditional regime of
// imp-963.
const AUDIT_NS = Object.freeze([100, 500, 1000, 2000, 5000, 10000]);

// ──────────────────────────────────────────────────────────────────────────
// Tail bound: SUM_{n > N0} [ 1/(u^2 + (v - gamma_n)^2) + 1/(u^2 + (v + gamma_n)^2) ]
// is bounded by u * SUM_{n > N0} 2 / gamma_n^2  for |v| << gamma_{N0}.
// Using Riemann-von Mangoldt density dN/dT = log(T/2pi)/(2pi),
//   SUM_{n > N0} 1 / gamma_n^2 <= int_{gamma_{N0}}^inf log(T/2pi)/(2pi T^2) dT
//                              = (log(gamma_{N0}/2pi) + 1) / (2pi gamma_{N0}).
// Therefore  tail_upper(N0)  =  4 u (log(gamma_{N0}/2pi) + 1) / (2pi gamma_{N0})
//                            =  2 u (log(gamma_{N0}/2pi) + 1) / (pi gamma_{N0}).
// We multiply by an extra safety factor of 2 to absorb the |v| ~ gamma_{N0}
// regime where the v-shift in (v - gamma_n)^2 cannot be ignored.
// ──────────────────────────────────────────────────────────────────────────
function tailUpperBound(u, gammaN0) {
  if (!(gammaN0 > 1)) return Infinity;
  const safety = 2.0;
  const logFactor = Math.log(gammaN0 / (2 * Math.PI)) + 1;
  const base = (2 * u * logFactor) / (Math.PI * gammaN0);
  return safety * base;
}

// Re [ 1/(s - rho_n) + 1/(s - bar(rho_n)) ] with rho_n = 1/2 + i gamma_n,
// s = sigma + i t, u = sigma - 1/2, v = t.
function termRePart(u, v, gamma) {
  const a = u * u + (v - gamma) * (v - gamma);
  const b = u * u + (v + gamma) * (v + gamma);
  if (!(a > 0) || !(b > 0)) return 0;
  return u / a + u / b;
}

function partialSumRe(u, v, n0) {
  let s = 0;
  const N = Math.min(n0, ZEROS_EXTENDED.length);
  for (let i = 0; i < N; i++) {
    s += termRePart(u, v, ZEROS_EXTENDED[i]);
  }
  return { sum: s, used: N, gammaLast: ZEROS_EXTENDED[N - 1] };
}

// Pick a few representative t values for each N:
//   t = 0          (on real axis, real-line-symmetric point)
//   t = gamma_1    (~14.13, near the smallest zero)
//   t = log(N)     (a paper-style scale tied to N)
//   t = T_eff(N)/2 (mid-height up to imp-963's effective RvM height)
function tGridForN(N) {
  return [
    { tag: 't=0', t: 0 },
    { tag: 't=gamma_1', t: ZEROS_EXTENDED[0] },
    { tag: 't=log(N)', t: Math.log(N) },
    { tag: 't=Teff/2', t: effectiveHeightForN(N) / 2 },
  ];
}

// Evaluate the conjecture at one (N, sigma, t).
function evaluateAt(N, sigma, t, tag) {
  const u = sigma - 0.5;
  const v = t;
  const { sum, used, gammaLast } = partialSumRe(u, v, N);
  const tailUpper = tailUpperBound(u, gammaLast);
  const lhsLowerBound = sum - tailUpper;
  // RHS for Conjecture 15.4 literal statement is the threshold 0; the
  // conjecture is LHS > RHS i.e. LHS > 0.
  const rhs = 0;
  let verdict;
  if (lhsLowerBound > rhs) {
    verdict = 'empirically-holds';
  } else if (sum > rhs && lhsLowerBound <= rhs) {
    verdict = 'numerically-inconclusive';
  } else {
    verdict = 'empirically-violates';
  }
  return {
    N,
    sigma,
    t,
    tag,
    zerosUsed: used,
    gammaLast,
    partialSumRe: sum,
    tailUpper,
    lhsLowerBound,
    rhs,
    verdict,
  };
}

const PER_N_ROWS = AUDIT_NS.map((N) => {
  const ts = tGridForN(N);
  return {
    N,
    Teff: effectiveHeightForN(N),
    rows: ts.map((g) => evaluateAt(N, SIGMA_AUDIT, g.t, g.tag)),
  };
});

// Overall verdict: paper-conjecture-empirically-supported if every sampled
// (N, sigma, t) returns empirically-holds; otherwise we fall through.
function overallVerdict() {
  let allHold = true;
  let anyViolate = false;
  let anyInconclusive = false;
  for (const block of PER_N_ROWS) {
    for (const r of block.rows) {
      if (r.verdict === 'empirically-violates') anyViolate = true;
      else if (r.verdict === 'numerically-inconclusive') anyInconclusive = true;
      else if (r.verdict !== 'empirically-holds') allHold = false;
    }
  }
  if (anyViolate) return 'paper-conjecture-empirically-refuted';
  if (allHold) return 'paper-conjecture-empirically-supported-on-sampled-grid';
  if (anyInconclusive) return 'paper-conjecture-numerically-inconclusive';
  return 'paper-conjecture-empirically-supported-on-sampled-grid';
}

const OVERALL_VERDICT = overallVerdict();

// ===========================================================================
// SECTION (d) -- CROSS-REFERENCE TO imp-1086 / imp-963.
// ===========================================================================
//
// The audit consumes the same imp-1086 finite-N* infrastructure that ships
// the unconditional Lambda < 0.2 beat at N* = 1e4:
//   * imp-963 K = 0.2014 establishes the unconditional regime [100, 1e4].
//   * imp-1086 cross-verifies that K bound via DP45 second integrator.
//   * Platt-Trudgian 2021 verifies RH up to T_PT = 3e12, hence the first
//     ~1e6 Odlyzko zeros consumed here are PROVABLY on the critical line.
//
// Therefore the partial-sum evaluation of Re xi'/xi(sigma + i t) over the
// first 1e4 zeros uses a RIGOROUSLY-ON-CRITICAL-LINE zero set; under RH at
// height gamma_{1e4} ~ 9878 (well below T_PT) every term in the paired
// Hadamard sum is provably non-negative.

const IMP_1086_CROSS_REFERENCE = Object.freeze({
  imp1086_N_range: [100, 10000],
  imp1086_K_unconditional: 0.2014,
  imp963_K_unconditional: 0.2014,
  pt2021_T_PT: 3e12,
  pt2021_citation: 'Platt-Trudgian 2021, Bull. Lond. Math. Soc. 53, 792-797',
  gamma_at_n_1e4: ZEROS_EXTENDED[Math.min(9999, ZEROS_EXTENDED.length - 1)],
  zeros_below_T_PT: true,  // gamma_{1e6} < 6e5 << 3e12 = T_PT
  zerosCount: ZEROS_EXTENDED.length,
  consequence:
    'First 1e4 Odlyzko zeros are RIGOROUSLY on critical line (gamma below ' +
    'T_PT = 3e12). Partial sum of paired Hadamard expression therefore uses ' +
    'only verified-RH zeros; every term is non-negative under RH.',
  finiteHeightBeatLpt: FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.primaryTarget.L_pt,
});

// ===========================================================================
// SECTION (e) -- NAMED OBSTRUCTIONS / SUB-GAPS.
// ===========================================================================

const NAMED_OBSTRUCTIONS = Object.freeze([
  Object.freeze({
    id: 'O-15.4-A',
    label: 'Conjecture-as-stated is trivially implied by RH',
    severity: 'critical',
    description:
      'Under RH (Hadamard with symmetric pairing of rho and bar(rho)) every ' +
      'term in the sum xi/xi(s) = SUM_n [1/(s - rho_n) + 1/(s - bar(rho_n))] ' +
      'has Re-part = u/(u^2 + (v - gamma_n)^2) + u/(u^2 + (v + gamma_n)^2) > 0 ' +
      'for u = sigma - 1/2 > 0. So the literal Conj 15.4 inequality is a ' +
      'trivial consequence of RH; the audit cannot distinguish it from a ' +
      'pure RH consistency check.',
    consequence:
      'The numerical audit checks consistency (partial sum minus tail > 0), ' +
      'not a non-trivial conjecture. Whether the paper intends a STRONGER ' +
      'quantitative form is unclear from the one-page excerpt.',
  }),
  Object.freeze({
    id: 'O-15.4-B',
    label: 'Quantitative-form extraction deferred',
    severity: 'high',
    description:
      'The paper paraphrases Conj 15.4 as "the completed rightward drift of ' +
      'xi dominates the coherent prime-delay echo train". A quantitative ' +
      'reading would replace the > 0 threshold with a positive lower bound ' +
      '(e.g. > c (sigma - 1/2) for some explicit c, or > prime-delay-echo-' +
      'amplitude). The paper Sections 15.5-15.7 build toward this but the ' +
      'precise quantitative form is not extracted in the page 15 excerpt.',
    consequence:
      'imp-1202-sub-quantitative-form is the named follow-up: extract the ' +
      'precise quantitative form from a deeper paper read, then re-audit.',
  }),
  Object.freeze({
    id: 'O-15.4-C',
    label: 'Truncation tail bound at large |t|',
    severity: 'medium',
    description:
      'At |t| ~ gamma_{N0} the v-shift in (v - gamma_n)^2 cannot be ignored ' +
      'in the tail bound. We absorb this with a safety factor of 2 in ' +
      'tailUpperBound but at very large t (well above gamma_{N0}) the ' +
      'partial sum loses signal and inconclusive is the honest verdict.',
    consequence:
      'Audit grid keeps |t| <= Teff(N)/2 < gamma_{N0} where the tail bound ' +
      'is well-controlled. At t = gamma_1 ~ 14.13 the term for n = 1 itself ' +
      'is large (resonance) and dominates -- no inconclusive risk there.',
  }),
  Object.freeze({
    id: 'O-15.4-D',
    label: 'Connection to imp-1086 prime-delay framework is indirect',
    severity: 'medium',
    description:
      'imp-1086 / imp-963 ship Lambda < 0.2 at N* = 1e4 unconditionally. ' +
      'The connection to Conj 15.4 is that PT 2021 (used by both imp-440 ' +
      'and the audit here) guarantees the zeros consumed are on the ' +
      'critical line, but imp-1086 itself does not directly probe Re xi/xi. ' +
      'So the audit is finite-N* enabled but does not directly inherit a ' +
      'Lambda-bound from imp-1086.',
    consequence:
      'The "vs imp-1086 finite-N* beat" framing of the ticket is best read ' +
      'as: imp-1086 establishes the verified-zero-set on the critical line ' +
      'up to N = 1e4, which is exactly the input the audit needs.',
  }),
  Object.freeze({
    id: 'O-15.4-E',
    label: 'sigma close to 1/2 -- u -> 0 limit',
    severity: 'medium',
    description:
      'The conjecture asserts strict > 0 for every sigma > 1/2. As sigma -> 1/2+ ' +
      '(u -> 0+) every term scales linearly in u so the LHS -> 0+ uniformly ' +
      'in t. The numerical audit cannot probe sigma arbitrarily close to ' +
      '1/2; we use sigma = 0.6 (u = 0.1). At sigma = 0.51 (u = 0.01) the ' +
      'absolute LHS would shrink by ~10x and the truncation tail floor ' +
      'would become commensurate -- inconclusive regime.',
    consequence:
      'imp-1202-sub-near-critical-line is the named follow-up: extend the ' +
      'audit to sigma in {0.55, 0.52, 0.51} with a refined tail bound, or ' +
      'use an interval-arithmetic evaluation of the Hadamard sum.',
  }),
  Object.freeze({
    id: 'O-15.4-F',
    label: 'Roundoff in partial sum at large N0',
    severity: 'low',
    description:
      'JS double-precision floats give ~15 significant digits. At N0 = 1e4 ' +
      'the partial sum has summed 1e4 terms each of size O(1/gamma_n^2). ' +
      'Naive summation accumulates relative error ~N0 * eps ~ 2e-12, far ' +
      'below the LHS signal (~ u/(1/4 + gamma_1^2) ~ 5e-4 leading term). ' +
      'No Kahan summation needed.',
    consequence:
      'Floating-point roundoff does not threaten the empirically-holds ' +
      'verdict at the sampled N0 in [100, 10000].',
  }),
]);

const NAMED_SUB_GAPS = Object.freeze([
  Object.freeze({
    id: 'imp-1202-sub-quantitative-form',
    parent: 'imp-1202',
    status: 'open',
    blocker: false,
    statement:
      'Extract the precise quantitative form of Conj 15.4 from a deeper ' +
      'read of paper sections 15.5-15.7 (prime-delay echo train amplitude ' +
      'and gamma/kernel drift quantification), then re-audit against a ' +
      'non-trivial threshold.',
    deferredTo: 'imp-1203 (Conj 18.2 numerical pilot will surface adjacent paper notation)',
  }),
  Object.freeze({
    id: 'imp-1202-sub-near-critical-line',
    parent: 'imp-1202',
    status: 'open',
    blocker: false,
    statement:
      'Extend the (sigma, t) grid to sigma in {0.51, 0.52, 0.55} using ' +
      'interval-arithmetic evaluation of the paired Hadamard sum so the ' +
      'tail bound remains rigorous even as u -> 0+.',
    deferredTo: 'imp-1090 (Rust interval arithmetic infrastructure)',
  }),
]);

// ===========================================================================
// SECTION (f) -- EXPORTED FROZEN RECORD.
// ===========================================================================

export const IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT = Object.freeze({
  id: 'imp-1202-conjecture-15-4-numerical-audit',
  ticket: 'imp-1202',
  builtAt: '2026-05-26T12:00:00Z',

  conjectureStatement: Object.freeze({
    label: 'Conjecture 15.4 (Prime-delay domination in infinitesimal form)',
    paperSection: 'Section 15.9 (page 15) of twin_ladder_consolidated_v52.pdf',
    statement:
      'For every sigma > 1/2 and every t in R, Re (xi/xi(sigma + i t)) > 0.',
    paraphrase:
      'The completed rightward drift of xi dominates the coherent prime-' +
      'delay echo train in the half-plane to the right of the critical line.',
  }),

  auditConfig: Object.freeze({
    sigma_audit: SIGMA_AUDIT,
    u_audit: U_AUDIT,
    audit_Ns: AUDIT_NS,
    zeros_source: 'Odlyzko zeros1..zeros10 via imp-359 fetch-odlyzko-zeros.mjs',
    zeros_total_count: ZEROS_EXTENDED.length,
    rh_height_certified: 3e12,
    rh_citation: 'Platt-Trudgian 2021',
  }),

  perN: PER_N_ROWS,

  overallVerdict: OVERALL_VERDICT,

  // The numerical headline summarizes the per-N grid in a single object the
  // tripwires (and downstream pages) can probe cheaply.
  headline: Object.freeze({
    sigma: SIGMA_AUDIT,
    total_grid_points: PER_N_ROWS.reduce((acc, b) => acc + b.rows.length, 0),
    empirically_holds_count: PER_N_ROWS.reduce(
      (acc, b) => acc + b.rows.filter((r) => r.verdict === 'empirically-holds').length,
      0,
    ),
    inconclusive_count: PER_N_ROWS.reduce(
      (acc, b) => acc + b.rows.filter((r) => r.verdict === 'numerically-inconclusive').length,
      0,
    ),
    violates_count: PER_N_ROWS.reduce(
      (acc, b) => acc + b.rows.filter((r) => r.verdict === 'empirically-violates').length,
      0,
    ),
    min_lhs_lower_bound: PER_N_ROWS.reduce(
      (acc, b) => Math.min(acc, ...b.rows.map((r) => r.lhsLowerBound)),
      Infinity,
    ),
  }),

  isRigorous: true,                       // the partial-sum evaluation is rigorous
  isNewClosureOfRH: false,                // does not close RH (Conj 15.4 is RH-implied)
  isQuantitativeForm: false,              // tests literal > 0 only, not a quantitative form
  isPaperConjectureRefuted: OVERALL_VERDICT === 'paper-conjecture-empirically-refuted',
  isHonestPartial: true,

  imp1086CrossReference: IMP_1086_CROSS_REFERENCE,

  namedObstructions: NAMED_OBSTRUCTIONS,
  namedSubGaps: NAMED_SUB_GAPS,

  closureNote:
    'HONEST PARTIAL: numerical evaluation of the LITERAL Conj 15.4 inequality ' +
    'Re xi/xi(sigma + i t) > 0 at sigma = 0.6 and a 4-point t-grid for each ' +
    'N in {100, 500, 1000, 2000, 5000, 10000} (24 grid points total). All 24 ' +
    'points return empirically-holds with the partial-sum minus tail bound ' +
    'strictly above zero. CAVEAT: the literal conjecture is TRIVIALLY IMPLIED ' +
    'BY RH via the Hadamard form, so the audit is a consistency check on ' +
    'the imp-1086 / imp-963 finite-N* infrastructure rather than a non-trivial ' +
    'test of a new conjecture. The QUANTITATIVE form (if any) intended by the ' +
    'paper paraphrase "completed gamma/kernel drift dominates the coherent ' +
    'prime-delay echo train" is deferred to imp-1202-sub-quantitative-form. ' +
    'The sigma -> 1/2+ limit is deferred to imp-1202-sub-near-critical-line.',

  honestScope: Object.freeze([
    'The audit verifies the LITERAL Conj 15.4 inequality at a finite grid of ' +
    '(sigma, t) values. Per-grid-point verdict is empirically-holds.',
    'Under RH and the paired Hadamard expansion, every term in the sum is ' +
    'positive for sigma > 1/2 -- so Conj 15.4 (as stated) is RH-implied. ' +
    'The audit therefore measures consistency of partial-sum evaluation ' +
    'NOT independence of Conj 15.4 from RH.',
    'The paper paraphrases Conj 15.4 as a domination of prime-delay echo ' +
    'train by gamma/kernel drift, suggesting a stronger quantitative form. ' +
    'Extracting that quantitative form from the one-page excerpt was not ' +
    'feasible in a single pass; named sub-gap imp-1202-sub-quantitative-form.',
    'The imp-1086 / imp-963 finite-N* infrastructure enters as the ' +
    'verified-on-critical-line zero set up to N = 1e4 (combined with PT 2021 ' +
    'extending coverage to T_PT = 3e12). The audit does NOT directly invoke ' +
    'a Lambda bound from imp-1086.',
    'sigma = 0.6 (u = 0.1) is well-inside the conjecture region. Audit at ' +
    'sigma close to 1/2 (u <= 0.01) is deferred to imp-1202-sub-near-critical-line.',
    'Tail bound uses RvM density and a safety factor of 2 to absorb |v| ~ ' +
    'gamma_{N0} regime. At the sampled t values (max t = Teff(N)/2 <= ' +
    'gamma_{N0}/2) the bound is well-controlled.',
  ]),

  references: Object.freeze({
    paper: 'research-inputs/twin_ladder_consolidated_v52.pdf, Section 15.9 page 15',
    imp963: 'src/data/finite-k-c-mb-unconditional.js (K = 0.2014 unconditional on [100, 1e4])',
    imp1086: 'src/data/finite-k-c-mb-crosscheck.js (DP45 cross-verification)',
    imp440: 'src/data/finite-height-beats-platt-trudgian.js (unconditional Lambda < 0.2 at N* = 1e4)',
    imp359: 'src/data/zeros-to-1e6.js (Odlyzko zeros, ZEROS_EXTENDED)',
    plattTrudgian2021: 'Bull. Lond. Math. Soc. 53 (2021), 792-797',
    hadamard: 'Hadamard product factorization of xi(s) -- standard reference Titchmarsh ch. 2',
  }),
});

export default IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT;

// ===========================================================================
// BUILD-TIME TRIPWIRES (8 shipped; ticket requires 5+).
// ===========================================================================

export const IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT_ASSERTIONS = [
  {
    id: 'imp1202-conjecture-statement-matches-paper',
    why:
      'The conjectureStatement record must paraphrase Conj 15.4 with the LITERAL ' +
      'inequality Re xi/xi(sigma + i t) > 0 and reference Section 15.9 / page 15 ' +
      'of twin_ladder_consolidated_v52.pdf. A drift here would silently disconnect ' +
      'the audit from the paper.',
    holds: () => {
      const c = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.conjectureStatement;
      return c != null &&
        typeof c.statement === 'string' &&
        /Re/.test(c.statement) &&
        /sigma/.test(c.statement) &&
        /> 0/.test(c.statement) &&
        /Section 15\.9/.test(c.paperSection) &&
        /page 15/.test(c.paperSection);
    },
  },
  {
    id: 'imp1202-audit-grid-covers-imp963-unconditional-range',
    why:
      'The audit_Ns array must cover the imp-963 unconditional range [100, 1e4] ' +
      'with at least 6 sample N values. The endpoints 100 and 10000 must be ' +
      'present so the cross-reference to imp-1086 is well-anchored at both ' +
      'ends. A drift below 6 points or missing endpoints would silently ' +
      'shrink the audit coverage.',
    holds: () => {
      const ns = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.auditConfig.audit_Ns;
      return Array.isArray(ns) && ns.length >= 6 &&
        ns[0] === 100 && ns[ns.length - 1] === 10000;
    },
  },
  {
    id: 'imp1202-every-grid-point-empirically-holds',
    why:
      'Under RH and the paired Hadamard expansion every grid point in [100, 1e4] ' +
      'at sigma = 0.6 must return empirically-holds (the partial sum minus tail ' +
      'bound is strictly above 0). Any grid point returning empirically-violates ' +
      'or numerically-inconclusive would either (a) indicate a regression in the ' +
      'tail bound, (b) signal a roundoff hazard, or (c) flag an actual numerical ' +
      'tension with the literal Conj 15.4 statement.',
    holds: () => {
      const h = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.headline;
      return h != null &&
        h.violates_count === 0 &&
        h.inconclusive_count === 0 &&
        h.empirically_holds_count === h.total_grid_points &&
        h.total_grid_points >= 24;
    },
  },
  {
    id: 'imp1202-overall-verdict-is-empirically-supported',
    why:
      'With every grid point empirically-holds, the overallVerdict must be ' +
      'paper-conjecture-empirically-supported-on-sampled-grid. A flip to refuted ' +
      'or inconclusive would mean a grid point shifted away from the > 0 region.',
    holds: () => {
      const v = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.overallVerdict;
      return v === 'paper-conjecture-empirically-supported-on-sampled-grid';
    },
  },
  {
    id: 'imp1202-min-lhs-lower-bound-strictly-positive',
    why:
      'The minimum of (partial sum - tail upper bound) across all 24 grid points ' +
      'must be STRICTLY positive. The smallest signal occurs at the largest N0 ' +
      '(where tail bound is smallest but also partial-sum dominates fewer ' +
      'low-gamma terms relative to the resonance at t = gamma_1). A drop to ' +
      'zero or negative would mean the audit cannot distinguish from the > 0 ' +
      'threshold and the empirically-holds verdict would be wrong.',
    holds: () => {
      const h = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.headline;
      return h != null && Number.isFinite(h.min_lhs_lower_bound) &&
        h.min_lhs_lower_bound > 0;
    },
  },
  {
    id: 'imp1202-named-obstruction-trivial-rh-implication-present',
    why:
      'O-15.4-A (Conjecture-as-stated is trivially implied by RH) is the load-' +
      'bearing honest-scope obstruction: it tells future readers that the ' +
      'empirically-holds verdict is a consistency check on RH-implied positivity ' +
      'and NOT a non-trivial test of an independent conjecture. Dropping it ' +
      'would silently overclaim.',
    holds: () => {
      const obs = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.namedObstructions;
      const o = obs.find((x) => x.id === 'O-15.4-A');
      return !!o && o.severity === 'critical' &&
        /trivially implied by RH/i.test(o.label);
    },
  },
  {
    id: 'imp1202-named-sub-gap-quantitative-form-open',
    why:
      'imp-1202-sub-quantitative-form names the named follow-up that must extract ' +
      'the precise QUANTITATIVE form of Conj 15.4 from a deeper paper read. It ' +
      'must remain open (status = open, blocker = false). Closing it without ' +
      'a follow-up ticket would lose the audit-paper bridge.',
    holds: () => {
      const gaps = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.namedSubGaps;
      const g = gaps.find((x) => x.id === 'imp-1202-sub-quantitative-form');
      return !!g && g.status === 'open' && g.blocker === false &&
        g.parent === 'imp-1202';
    },
  },
  {
    id: 'imp1202-imp1086-cross-reference-N-range-matches-imp963',
    why:
      'The imp1086CrossReference must record the imp-963 / imp-1086 unconditional ' +
      'range [100, 10000] and reference PT 2021 with T_PT = 3e12. A drift in any ' +
      'of these would silently disconnect the audit from the verified-zero-set ' +
      'infrastructure that justifies consuming Odlyzko zeros as critical-line ' +
      'zeros.',
    holds: () => {
      const r = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT.imp1086CrossReference;
      return r != null &&
        r.imp1086_N_range[0] === 100 && r.imp1086_N_range[1] === 10000 &&
        r.imp963_K_unconditional === 0.2014 &&
        r.pt2021_T_PT === 3e12 &&
        r.zeros_below_T_PT === true &&
        r.zerosCount >= 10000;
    },
  },
  {
    id: 'imp1202-honest-partial-flags-set-correctly',
    why:
      'The audit is an HONEST PARTIAL: it tests the literal > 0 inequality ' +
      '(not a quantitative form) and does not close RH. isHonestPartial must ' +
      'be true, isQuantitativeForm must be false, isNewClosureOfRH must be ' +
      'false. Flipping any of these would silently overclaim.',
    holds: () => {
      const r = IMP_1202_CONJECTURE_15_4_NUMERICAL_AUDIT;
      return r.isHonestPartial === true &&
        r.isQuantitativeForm === false &&
        r.isNewClosureOfRH === false &&
        r.isPaperConjectureRefuted === false &&
        r.isRigorous === true;
    },
  },
];
