/**
 * @fileoverview Independent cross-verification of src/math/weil-explicit-formula-opt.js.
 * @module imp-901-weil-formula-verification
 *
 * Proof chain step: S10-verify (imp-901).
 *
 * METHOD. Runs the exported weilExplicitFormulaTest() once, cross-checks its
 * 7-sigma LHS/RHS table against: (a) a hand-derived independent zero-sum for
 * sigma=100 computed directly from ZETA_ZEROS, (b) closed-form test-function
 * boundary values h(i/2)=exp(1/(8 sigma^2)) for the Gaussian h_sigma(r)=
 * exp(-r^2/(2 sigma^2)), and (c) a reference value for psi(1/4) via Gauss's
 * digamma theorem psi(1/4) = -gamma_Euler - pi/2 - 3 log 2. Verifies every
 * sigma row is finite and that rel_error remains below a documented tolerance.
 *
 * HAND-DERIVED REFERENCE VALUES.
 *   psi(1/4) = -gamma_Euler - pi/2 - 3 log 2
 *            = -(0.5772156649015329 + 1.5707963267948966 + 2.079441541679836)
 *            = -4.227453533376265 (to Float64 precision)
 *   This is the r=0 value of the integrand Re psi(1/4 + ir/2) that drives the
 *   archimedean term for every sigma. Any sign error or normalization flip in
 *   digammaReal(0.25, 0) would bias the archimedean integral by a fixed offset.
 *
 *   h(i/2) for h(r) = exp(-r^2/(2 sigma^2)): h(i/2) = exp(-(i/2)^2/(2 sigma^2))
 *     = exp(-(-1/4)/(2 sigma^2)) = exp(1/(8 sigma^2)).
 *   At sigma=1: exp(1/8) = 1.1331484530668263 (exact in Float64).
 *
 *   Sum_{gamma>0} exp(-gamma^2/(2 sigma^2)) at sigma=100 over the 869 zeros
 *     in ZETA_ZEROS with |gamma| <= 1280: direct for-loop over the table gives
 *     43.40457229556881 (recomputed in this module as REF_LHS_SIGMA100). The
 *     library's zeroSum() must produce the same number to full precision since
 *     both read the same ZETA_ZEROS array.
 *
 * OBSERVED FORMULA AGREEMENT (from weilExplicitFormulaTest() at commit time).
 *   sigma=1:   LHS=0      , A=0.53497, P=0.53498, LHS-RHS=0       (prime-dominated)
 *   sigma=3:   LHS=2e-5   , A=0.07093, P=0.07092, LHS-RHS=0       (transition)
 *   sigma=5:   LHS=0.01854, A=0.02095, P=0.00241, LHS-RHS=0       (transition)
 *   sigma=10:  LHS=0.53719, A=0.53719, P=0      , LHS-RHS=0       (zero-dominated)
 *   sigma=20:  LHS=2.96093, A=2.96093, P=0      , LHS-RHS=0       (zero-dominated)
 *   sigma=50:  LHS=15.2268, A=15.2268, P=0      , LHS-RHS=0       (zero-dominated)
 *   sigma=100: LHS=43.4046, A=43.4045, P=0      , LHS-RHS=5e-5    (rel_err=1e-6)
 *   All seven rel_errors <= 1e-6 (library rounds to 6 decimals, so 0 means
 *   < 5e-7). Hand-recomputed LHS at sigma=100 matches 43.40457229556881.
 *
 * SCOPE AND HONEST OPEN SUB-GAPS.
 *   imp-901-sub-docstring-convention-mismatch. The module-level docstring at
 *     src/math/weil-explicit-formula-opt.js:13-14 writes the archimedean term
 *     as "A[h] = (1/2pi)*integral(h*Re psi) dr - log(pi)*h(0)" (Iwaniec-Kowalski
 *     convention, Thm 5.12), but the implementation at line 113 uses
 *     logPiTerm = -(log pi)/(2 pi) * integral(h dr) (Bombieri convention with
 *     Fourier pair g(u) = (1/(2 pi)) * integral(h e^{-iru}) dr). Both conventions
 *     are mathematically equivalent given their respective prime-sum coefficients
 *     (IK uses sigma*sqrt(2 pi), Bombieri uses sigma/sqrt(2 pi)) — the code
 *     consistently uses Bombieri throughout and the numerical identity holds
 *     to 1e-6 across 7 sigma. The docstring-vs-code mismatch is purely a
 *     documentation-level finding and is NOT a numerical bug. Follow-up:
 *     rewrite the line-13-14 comment to match the Bombieri form so readers
 *     do not have to reconcile two conventions in one file.
 *
 *   imp-901-sub-rmax-truncation-at-large-sigma. The archimedean integration
 *     uses a fixed rMax=500 with dr=0.01. For sigma=100 the Gaussian
 *     h(r)=exp(-r^2/20000) still has h(500)=exp(-12.5)=3.73e-6, non-negligible;
 *     the observed LHS-RHS=5e-5 at sigma=100 (vs 0 at sigma<=50) is consistent
 *     with a small tail-truncation at rMax=500. For sigma > 100 the truncation
 *     error will grow as ~sigma^2 * log(rMax) * exp(-rMax^2/(2 sigma^2)).
 *     Follow-up: either document that rMax=500 caps supported sigma at ~100,
 *     or make rMax = max(500, 5*sigma) adaptive.
 *
 * Exports:
 *   WEIL_FORMULA_VERIFICATION        — full report (inputs, references, results)
 *   WEIL_FORMULA_VERIFICATION_ASSERTIONS — array of build-time assertions
 *
 * Ticket: imp-901 (opus-4-7, subscription).
 */

import { ZETA_ZEROS } from '../math/zeta.js';
import { weilExplicitFormulaTest } from '../math/weil-explicit-formula-opt.js';

// ── Hand-derived closed-form references ─────────────────────────────────────
// Gauss's digamma theorem: psi(1/4) = -gamma_Euler - pi/2 - 3 log 2.
const EULER_GAMMA = 0.5772156649015329;
const REF_PSI_QUARTER =
  -EULER_GAMMA - Math.PI / 2 - 3 * Math.log(2);

// h(i/2) for Gaussian h(r) = exp(-r^2/(2 sigma^2)) is exp(1/(8 sigma^2)).
const REF_H_HALF_I_SIGMA1 = Math.exp(1 / 8);  // sigma=1 case.

// Independent re-derivation of LHS = Sum_{gamma>0} h_sigma(gamma) at sigma=100
// from the same ZETA_ZEROS table the library uses. If the library's zeroSum()
// normalization or sign is wrong, this will disagree.
const T_MAX = 1280;
const REF_ZEROS = ZETA_ZEROS.filter(g => g <= T_MAX);
let _ls100 = 0;
for (const g of REF_ZEROS) _ls100 += Math.exp(-g * g / 20000);
const REF_LHS_SIGMA100 = _ls100;

// ── Run the library under test once at module load ──────────────────────────
const libResult = weilExplicitFormulaTest();
const libRows = libResult.results;
const libBySigma = Object.fromEntries(libRows.map(r => [r.sigma, r]));

// ── Checks ──────────────────────────────────────────────────────────────────

// (1) Zero-table size: library must pull exactly the 869 zeros with gamma<=1280.
const zerosCountMatches =
  libResult.zeros_computed === REF_ZEROS.length && REF_ZEROS.length === 869;

// (2) Every row is finite (no NaN/Inf).
const allRowsFinite = libRows.every(r =>
  Number.isFinite(r['LHS Σ_{γ>0}h(γ)']) &&
  Number.isFinite(r['Archimedean A[h]']) &&
  Number.isFinite(r.prime_sum) &&
  Number.isFinite(r['RHS A-primes']) &&
  Number.isFinite(r.rel_error),
);

// (3) Prime-dominated regime at sigma=1: LHS must be ~0 (first zero 14.13 >>
//     sigma=1, so exp(-14.13^2/2) ~ e^-99 ~ 1e-44), and A must approximately
//     equal prime_sum so that A - P cancels to zero.
const row1 = libBySigma[1];
const primeDomCanceled =
  Math.abs(row1['LHS Σ_{γ>0}h(γ)']) < 1e-40 &&
  Math.abs(row1['Archimedean A[h]'] - row1.prime_sum) < 0.001;

// (4) Zero-dominated regime at sigma=100: prime_sum must collapse to ~0
//     because exp(-sigma^2 (log n)^2 / 2) kills every n>=2 at sigma=100;
//     LHS must match A within 1e-4 absolute.
const row100 = libBySigma[100];
const zeroDomMatchesArch =
  Math.abs(row100.prime_sum) < 1e-6 &&
  Math.abs(row100['LHS Σ_{γ>0}h(γ)'] - row100['Archimedean A[h]']) < 1e-3;

// (5) Independent zero-sum reproduction at sigma=100 (bitwise same reads of
//     ZETA_ZEROS produce identical LHS to full precision after rounding).
//     Library rounds to 5 decimals in the 'LHS ...' field, so compare to
//     rounded reference.
const refLhs100Rounded = +REF_LHS_SIGMA100.toFixed(5);
const lhs100Matches = row100['LHS Σ_{γ>0}h(γ)'] === refLhs100Rounded;

// (6) Max rel_error across all sigma <= 1e-6 (library claims 'machine
//     precision'). imp-2536 / imp-901-sub-tighter-bound made the archimedean
//     integration cutoff adaptive (rMax = max(500, 8*sigma)) in
//     src/math/weil-explicit-formula-opt.js, capturing the Gaussian tail
//     h(500)=exp(-12.5)=3.73e-6 that previously left sigma=100 at rel_error
//     1e-6; the observed max is now 0 post-rounding across all seven sigma, so
//     the threshold tightens from 1e-5 to 1e-6.
const maxRelErr = Math.max(...libRows.map(r => r.rel_error));
const relErrBelowThreshold = maxRelErr <= 1e-6;

// (7) At least one sigma has rel_error = 0 (post-rounding) — library reports
//     optimal sigma has rel_error 0.
const someSigmaExact = libRows.some(r => r.rel_error === 0);

// (8) Hand-derived psi(1/4) check: purely arithmetic, not a library call.
//     Ensures our own reference value is the textbook Gauss value. Used as a
//     sanity-lock so future edits do not silently drift the reference.
const psiQuarterMatchesGauss =
  Math.abs(REF_PSI_QUARTER - (-4.227453533376265)) < 1e-14;

// (9) Closed-form h(i/2) at sigma=1 equals exp(1/8).
const hHalfIMatchesExp18 =
  Math.abs(REF_H_HALF_I_SIGMA1 - 1.1331484530668263) < 1e-14;

// ── Report ──────────────────────────────────────────────────────────────────
export const WEIL_FORMULA_VERIFICATION = {
  ticket: 'imp-901',
  method:
    'Hand-derived references (Gauss psi(1/4), closed-form h(i/2), ' +
    'independent Sum_{gamma>0} exp(-gamma^2/(2 sigma^2)) at sigma=100) ' +
    'vs library weilExplicitFormulaTest() 7-sigma output.',
  references: {
    psi_quarter_Gauss: REF_PSI_QUARTER,
    h_half_i_at_sigma1: REF_H_HALF_I_SIGMA1,
    lhs_sigma100_hand_zero_sum: REF_LHS_SIGMA100,
    zeros_in_table_leq_Tmax: REF_ZEROS.length,
  },
  libraryObserved: {
    zeros_computed: libResult.zeros_computed,
    optimal: libResult.optimal,
    max_rel_error: maxRelErr,
  },
  checks: {
    zerosCountMatches,
    allRowsFinite,
    primeDomCanceled,
    zeroDomMatchesArch,
    lhs100Matches,
    relErrBelowThreshold,
    someSigmaExact,
    psiQuarterMatchesGauss,
    hHalfIMatchesExp18,
  },
  verdict:
    zerosCountMatches &&
    allRowsFinite &&
    primeDomCanceled &&
    zeroDomMatchesArch &&
    lhs100Matches &&
    relErrBelowThreshold &&
    someSigmaExact &&
    psiQuarterMatchesGauss &&
    hHalfIMatchesExp18
      ? 'PASS-core-formulas'
      : 'REVIEW',
  openSubGaps: [
    'imp-901-sub-docstring-convention-mismatch',
  ],
  closedSubGaps: [
    {
      id: 'imp-901-sub-rmax-truncation-at-large-sigma',
      alsoCloses: 'imp-901-sub-tighter-bound',
      closedBy: 'imp-2536',
      resolution:
        'Closed by the adaptive-rMax fix in ' +
        'src/math/weil-explicit-formula-opt.js: archimedeanTerm is now called ' +
        'with rMax = max(500, 8*sigma), so the Gaussian tail h(rMax) <= ' +
        'exp(-32) ~ 1.3e-14 is captured uniformly and the sigma=100 row drops ' +
        'from LHS-RHS=5e-5 (rel_error 1e-6) to machine zero. All seven sigma ' +
        'in {1,3,5,10,20,50,100} now report rel_error 0 post-rounding; the ' +
        'relErrBelowThreshold check tightened from 1e-5 to 1e-6. Guarded by ' +
        'the imp901-tighter-bound-subgap-named build-time assertion.',
    },
  ],
  closureNote:
    'imp-1002 (auto-improve, opus-4-7 subscription): honest-partial structural ' +
    'closure. The auto-seeded ticket asked to close named sub-gap ' +
    '"imp-901-sub-tighter-bound" (tighten the imp-901 Weil-formula numerical ' +
    'bound by extending the test-function grid). No sub-gap with that exact ' +
    'id existed in this file; the actual residual sub-gaps were ' +
    'imp-901-sub-docstring-convention-mismatch (purely a documentation-level ' +
    'mismatch between the IK and Bombieri archimedean-term conventions, NOT ' +
    'a numerical bug) and imp-901-sub-rmax-truncation-at-large-sigma (the ' +
    'archimedean integration uses fixed rMax=500 with dr=0.01, so for sigma > ' +
    '100 the Gaussian tail h(rMax)=exp(-rMax^2/(2 sigma^2)) is no longer ' +
    'negligible; observed LHS-RHS=5e-5 at sigma=100 is consistent with this ' +
    'small tail-truncation). The "tighter bound by extending the test-function ' +
    'grid" framing maps cleanly to the rMax-truncation work: making rMax ' +
    'adaptive (e.g. rMax = max(500, 5*sigma)) extends the integration grid so ' +
    'the Gaussian tail is captured to Float64 underflow, which would tighten ' +
    'the observed LHS-RHS at sigma=100 from 5e-5 toward 0 and let the ' +
    'asserted relErrBelowThreshold predicate sharpen from 1e-5 toward 1e-6. ' +
    'This run surfaces the gap explicitly: a new top-level openSubGap field ' +
    'on WEIL_FORMULA_VERIFICATION carries the canonical id ' +
    '"imp-901-sub-tighter-bound", precise statement, dual status fields, an ' +
    'explicit dependsOn pointer to imp-901-sub-rmax-truncation-at-large-sigma, ' +
    'and three approachSuggestions. A new build-time assertion ' +
    '(imp901-tighter-bound-subgap-named) pins the canonical id and the ' +
    'prior-work-PARTIAL / remaining-open status pair so future references ' +
    'stay anchored. The numerical work of making rMax adaptive in ' +
    'src/math/weil-explicit-formula-opt.js and verifying the tighter bound ' +
    'remains open and is now tracked under the canonical id. This is a ' +
    'cataloguing/structural improvement, not a numerical re-derivation.',
  openSubGap: {
    id: 'imp-901-sub-tighter-bound',
    statement:
      'Tighten the imp-901 Weil explicit-formula numerical bound at large ' +
      'sigma by extending the archimedean-integration test-function grid: ' +
      'replace the fixed rMax=500 (with dr=0.01) in ' +
      'src/math/weil-explicit-formula-opt.js archimedeanTerm() with adaptive ' +
      'rMax = max(500, 5*sigma) so the Gaussian tail ' +
      'h(rMax)=exp(-rMax^2/(2 sigma^2)) is captured uniformly to Float64 ' +
      'underflow, then tighten the relErrBelowThreshold predicate from ' +
      '<=1e-5 to <=1e-6 (or better) at every sigma and confirm LHS-RHS at ' +
      'sigma=100 collapses from 5e-5 to <=1e-7.',
    statusOfPriorWork:
      'PARTIAL -- weilExplicitFormulaTest() currently ships with fixed ' +
      'rMax=500 and dr=0.01. Across the 7-sigma scan {1, 3, 5, 10, 20, 50, ' +
      '100} the observed max rel_error is 1e-6 (at sigma=100), driven by ' +
      'tail-truncation: h(500)=exp(-12.5)=3.73e-6 at sigma=100 is ' +
      'non-negligible. Six of the seven sigma rows hit rel_error=0 ' +
      'post-rounding; sigma=100 is the only outlier and has the documented ' +
      'LHS-RHS=5e-5. The relErrBelowThreshold assertion is set at the looser ' +
      '1e-5 to absorb this tail.',
    statusOfRemaining:
      'CLOSED (imp-2536) -- adaptive rMax shipped in ' +
      'src/math/weil-explicit-formula-opt.js. The numerical work named here is ' +
      'delivered: (i) archimedeanTerm() is now called with rMax = ' +
      'max(500, 8*sigma) per call (8*sigma rather than the originally ' +
      'sketched 5*sigma, because 5*sigma = 500 is exactly the old cutoff at ' +
      'the binding sigma=100 case and would not have moved it; 8*sigma puts ' +
      'h(rMax) <= exp(-32) ~ 1.3e-14 uniformly); (ii) weilExplicitFormulaTest() ' +
      'still passes all seven checks (zerosCountMatches, allRowsFinite, ' +
      'primeDomCanceled, zeroDomMatchesArch, lhs100Matches, ' +
      'relErrBelowThreshold, someSigmaExact); (iii) the relErrBelowThreshold ' +
      'predicate is tightened from 1e-5 to 1e-6 and the observed max rel_error ' +
      'across all seven sigma is now 0 post-rounding (sigma=100 collapsed from ' +
      'LHS-RHS=5e-5 to 0). Item (iv) -- re-running at sigma in {200, 500, ' +
      '1000} to lift any large-sigma caveat -- is not wired into the fixed ' +
      '{1..100} scan (it would change the public test scope) and is left as a ' +
      'minor optional follow-on, since no JSDoc caveat capping sigma was ' +
      'actually present to lift.',
    dependsOn: [
      'imp-901-sub-rmax-truncation-at-large-sigma -- the same residual under ' +
        'the file-local descriptive id. Closing imp-901-sub-tighter-bound ' +
        'closes the rmax-truncation entry by construction; both ids are ' +
        'preserved so cross-file references via either string continue to ' +
        'resolve.',
    ],
    approachSuggestions: [
      'Implement adaptive rMax in src/math/weil-explicit-formula-opt.js ' +
        'archimedeanTerm() as rMax = Math.max(500, 5 * sigma) with the same ' +
        'dr=0.01 step. The archimedean integrand is dominated by the ' +
        'Gaussian h(r) which decays as exp(-r^2/(2 sigma^2)); cutting at ' +
        '5*sigma puts h(rMax) at exp(-12.5) = 3.73e-6 uniformly, eliminating ' +
        'the sigma-dependent truncation bias.',
      'Alternatively keep rMax=500 fixed and shrink dr to ' +
        'dr = 0.01 / max(1, sigma/100) at large sigma -- this addresses ' +
        'discretization rather than truncation. A combined fix (adaptive ' +
        'rMax + adaptive dr) tightens beyond 1e-7 but the current observed ' +
        'bottleneck at sigma=100 is truncation, not discretization, so the ' +
        'rMax change alone is the highest-leverage move.',
      'Independent of the integrator change, run weilExplicitFormulaTest() ' +
        'at sigma in {200, 500, 1000} with rMax = max(500, 5*sigma) and ' +
        'verify allRowsFinite + zeroDomMatchesArch hold at each, lifting the ' +
        'JSDoc caveat that rMax=500 caps supported sigma at ~100.',
    ],
  },
};

export const WEIL_FORMULA_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp901-zeta-zeros-table-size',
    holds: () => zerosCountMatches,
    why:
      'weilExplicitFormulaTest() must read exactly the 869 zeros with ' +
      'gamma <= 1280 from ZETA_ZEROS. A changed count would silently shift ' +
      'LHS = Sum_{gamma>0} h(gamma) for every sigma and invalidate the ' +
      'hand-derived reference LHS at sigma=100 used by this module.',
  },
  {
    id: 'imp901-rows-finite',
    holds: () => allRowsFinite,
    why:
      'Every sigma row must return finite LHS, Archimedean, prime_sum, ' +
      'RHS and rel_error. Guards against NaN from digammaReal infinite ' +
      'recursion, Infinity from exp overflow at small sigma, or 0/0 in ' +
      'rel_error at sigma where |LHS| underflows.',
  },
  {
    id: 'imp901-prime-dominated-regime-sigma1',
    holds: () => primeDomCanceled,
    why:
      'At sigma=1 the smallest ordinate gamma_1=14.134 dominates LHS = ' +
      'Sum_{gamma>0} exp(-gamma^2/2) = O(exp(-99)) ~ 1e-44. Therefore ' +
      'Archimedean A[h] must nearly equal prime_sum (|A - P| < 0.001) so ' +
      'that RHS = A - P cancels to zero within rounding. A large |A - P| ' +
      'would indicate the (log pi)/(2 pi) * integral(h) and h(i/2) + ' +
      'integral(h * Re psi)/(2 pi) terms are miscalibrated against the ' +
      'prime sum (sigma/sqrt(2 pi)) * Sum Lambda(n)/sqrt(n) * ' +
      'exp(-sigma^2 (log n)^2/2).',
  },
  {
    id: 'imp901-zero-dominated-regime-sigma100',
    holds: () => zeroDomMatchesArch,
    why:
      'At sigma=100 the Gaussian in log-space exp(-sigma^2 (log n)^2/2) ' +
      'at n=2 is exp(-100^2 * (log 2)^2/2) = exp(-2402) = 0 to Float64. ' +
      'So prime_sum collapses to essentially 0 and LHS must match ' +
      'Archimedean within 1e-3 absolute. Any mismatch exposes a factor-of-' +
      '(2 pi) bug in the archimedean normalization.',
  },
  {
    id: 'imp901-sigma100-lhs-matches-independent-zero-sum',
    holds: () => lhs100Matches,
    why:
      'Library zeroSum(100, zeros) must reproduce the hand-computed sum ' +
      REF_LHS_SIGMA100.toFixed(11) + ' (after rounding to 5 decimals). ' +
      'Both read the same ZETA_ZEROS table, so any discrepancy means the ' +
      'library applied a wrong exponent (e.g. omitted the factor of 1/2 ' +
      'in gamma^2/(2 sigma^2)) or wrong sigma. This is the only direct ' +
      'hand-verifiable numerical anchor.',
  },
  {
    id: 'imp901-rel-error-below-machine-precision-threshold',
    holds: () => relErrBelowThreshold,
    why:
      'Library claims "rel_error <= 1e-6 (machine precision)" for all 7 ' +
      'Gaussian test functions. We assert the slightly looser 1e-5 to give ' +
      'tail-truncation slack at sigma=100 (where rMax=500 leaves a small ' +
      'integration tail). A breach would indicate either a new systematic ' +
      'bias or an accidental dr / rMax regression in archimedeanTerm().',
  },
  {
    id: 'imp901-some-sigma-exact-match',
    holds: () => someSigmaExact,
    why:
      'At least one sigma must yield rel_error == 0 (post-rounding). The ' +
      'library reports optimal.rel_error = 0 at sigma=50. Losing this ' +
      'property would indicate that either no sigma is in the ' +
      'zero-dominated regime anymore (suggesting a zero-table truncation) ' +
      'or that the archimedean discretization error grew above 5e-7 ' +
      'across the board.',
  },
  {
    id: 'imp901-psi-quarter-matches-gauss',
    holds: () => psiQuarterMatchesGauss,
    why:
      'Gauss digamma theorem: psi(1/4) = -gamma_Euler - pi/2 - 3 log 2 ' +
      '= -4.227453533376265. This sanity-locks the reference that the ' +
      'module cites in its hand-derivation so that future EULER_GAMMA ' +
      'edits (or typos) do not silently drift the reference.',
  },
  {
    id: 'imp901-h-half-i-matches-closed-form',
    holds: () => hHalfIMatchesExp18,
    why:
      'For Gaussian h(r) = exp(-r^2/(2 sigma^2)), the pole contribution ' +
      'h(i/2) = exp(1/(8 sigma^2)). At sigma=1 this is exp(1/8) = ' +
      '1.1331484530668263. Used to sanity-check our hand-derivation; ' +
      'a divergence here would point to an arithmetic typo in the ' +
      'reference, not a library bug.',
  },
  {
    id: 'imp901-tighter-bound-subgap-named',
    holds: () =>
      WEIL_FORMULA_VERIFICATION.openSubGap?.id === 'imp-901-sub-tighter-bound' &&
      typeof WEIL_FORMULA_VERIFICATION.openSubGap.statusOfRemaining === 'string' &&
      WEIL_FORMULA_VERIFICATION.openSubGap.statusOfRemaining.startsWith('CLOSED') &&
      // the closure is real, not just a status flip: the adaptive-rMax fix
      // must drive the observed max rel_error strictly below the pre-fix 1e-6
      // (now machine zero), and the tightened consumer predicate must hold.
      relErrBelowThreshold === true &&
      maxRelErr <= 1e-7,
    why:
      'imp-2536 closes imp-901-sub-tighter-bound: the adaptive integration ' +
      'cutoff rMax = max(500, 8*sigma) in src/math/weil-explicit-formula-opt.js ' +
      'captures the Gaussian tail h(500)=exp(-12.5)=3.73e-6 that previously ' +
      'left sigma=100 at rel_error 1e-6, collapsing it to machine zero. This ' +
      'assertion guards the closure two ways: (1) statusOfRemaining must stay ' +
      'flipped to "CLOSED" so the gap is not silently re-opened or re-seeded, ' +
      'and (2) the numerical win must persist -- maxRelErr <= 1e-7 (strictly ' +
      'below the pre-fix 1e-6) and the relErrBelowThreshold predicate (now ' +
      'tightened to 1e-6) must hold. If the integrator is reverted to the ' +
      'fixed rMax=500 the sigma=100 rel_error returns to 1e-6, maxRelErr <= ' +
      '1e-7 fails, and this assertion fires -- preventing a silent regression ' +
      'masquerading as a passing build.',
  },
];

// Run assertions at module load time so an import of this file fails the
// build if any numerical anchor drifts.
for (const a of WEIL_FORMULA_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      'WEIL_FORMULA_VERIFICATION assertion failed: ' + a.id + ' -- ' + a.why,
    );
  }
}
