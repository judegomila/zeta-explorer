/**
 * @module imp-2861-c-t-explicit-pinning
 *
 * imp-2861 (medium, proof, S7): explicit certified upper bound for the truncation
 * constant C_T in
 *
 *     E_trunc(N) = C_T . T0(N)^{-kappa_T} . log T0(N)
 *
 * plus an outward-rounded interval certificate and an N* = 1e4 negligibility check.
 *
 * BACKGROUND -- where C_T sits
 * ----------------------------
 * C_T is the last E_trunc placeholder. imp-2625 / imp-2698 (polymath15-constant-C-T,
 * imp-2713 GAP-E-TRUNC-C-T) classify it MINOR-OPEN: "proven O(1) but not a certified
 * small explicit value". The blocking lemma is an EFFECTIVE Ingham / Heath-Brown 1979
 * zero-density constant (the implicit constant A and polylog power B in
 * N(sigma,T) <= A . T^{e_I(sigma)} . (log T)^B) certified UNIFORMLY down to the thin
 * strip sigma = 1/2 + 1/log T0; the imp-1324 Kadiri audit gives only O(1) there
 * (conservative edge A ~ 6, B up to 5 at sigma = 3/4), not a small explicit value.
 *
 * THE EXPLICIT CLEAN-COUNT UPPER BOUND (Polymath15 Lemma 3.3 + Ingham 1940)
 * ------------------------------------------------------------------------
 * imp-397 (polymath15-constant-C-T.js) derives, from Polymath15 Lemma 3.3 (each
 * off-line zero rho_j with Im rho_j > T0 contributes at most 2/Im rho_j) integrated
 * against the BARE Ingham 1940 count exponent (i.e. assuming the CLEAN count
 * A = 1, B = 0), the closed form for the formula carrying the explicit log T0 factor
 *
 *     C_T(L) = (3L - 6) / (2L),     L = log T0,
 *
 * which is increasing in L (d C_T / dL = 3 / L^2 > 0) and approaches 3/2 from below.
 * Hence the explicit, citable, CLEAN-COUNT upper bound
 *
 *     C_T(N) < 3/2 = 1.5     for all finite N.
 *
 * This module pins that explicit value as an OUTWARD-ROUNDED INTERVAL certificate
 * (mirroring imp-2709-kappa-t-interval-certificate.js), at the surviving finite
 * beat height N* = 1e4 (T0 = gamma_N approx 9.879e3, L approx 9.198), and confirms
 * E_trunc stays NEGLIGIBLE (< 1% of E(N)) even at the conservative ceiling 3/2.
 *
 * Build assertions then lock:
 *   (A) the outward-rounded bracket of C_T(N*) = (3L-6)/(2L) over the N* = 1e4 strip
 *       is finite, positive, tight (width < 1e-12) and lies strictly below 3/2;
 *   (B) the universal clean-count ceiling 3/2 is an exact rational enclosure that
 *       brackets the per-strip value from above;
 *   (C) E_trunc_pt(C_T = 3/2) = (3/2) . E_trunc_pt(C_T = 1) stays < 1% of the
 *       committed E(N) approx 0.0129087 at N* = 1e4 (imp-2643): the term is
 *       negligibility-dominated, so even a generous C_T does not move the verdict.
 *
 * HONEST SCOPE -- NO FALSE DISCHARGE
 * ----------------------------------
 * The 3/2 bound is EXPLICIT but CONDITIONAL on the clean count A = 1, B = 0. The
 * literature does NOT certify A = 1, B = 0 uniformly down to the thin strip
 * sigma = 1/2 + 1/log T0 (imp-1324: only O(1), edge A ~ 6 / B up to 5 at sigma = 3/4).
 * So this is NOT a discharge of the effective-constant lemma: GAP-E-TRUNC-C-T stays
 * MINOR-OPEN. What this certificate DELIVERS is sharper than the bare "O(1)" label:
 * E_trunc is negligible (< 1% of E(N)) for EVERY C_T below a tolerance ceiling
 * C_T_TOL = 0.01 . E(N) / E_trunc_pt(1) approx 4.16, and the explicit clean-count
 * bound 3/2 sits comfortably inside that tolerance. The residual is purely whether
 * the effective Ingham constant stays under ~4.16 at the thin strip -- a wide
 * margin, but not a certified value, so no QED. No committed Lambda value changes.
 *
 * @see polymath15-constant-C-T (imp-397: the clean-count closed form C_T = (3L-6)/(2L) < 3/2)
 * @see imp-2625-etrunc-constant-pinning (C_T MINOR-OPEN; effective-constant blocking lemma named)
 * @see imp-2709-kappa-t-interval-certificate (sibling outward-rounded interval, same Interval pattern)
 * @see imp-2643-honest-assembled-EN (the committed E(N) approx 0.0129087 ledger at N* = 1e4)
 * @see imp-2713-en-named-gap-registry (GAP-E-TRUNC-C-T classified MINOR-OPEN)
 * @see interval-arithmetic (imp-068 Interval class, outward-rounded log/div/mul/sub)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// ── The surviving finite beat height (matches imp-2643) ───────────────────────
const N_STAR = 1e4;
const T0_FLOAT = effectiveHeightForN(N_STAR); // gamma_N approx 9.879e3 (RvM inverse, a float)

// Committed E(N) ledger at N* = 1e4 (imp-2643-honest-assembled-EN.js, single source
// of truth). Carried as literals here to keep this certificate decoupled from the
// E_coll / C_H import chain -- mirrors imp-2709 hardcoding the 0.136823 clearance.
const E_N_COMMITTED = 0.0129087;   // E_trunc + E_flow + E_coll at N* = 1e4
const E_TRUNC_PT_AT_CT1 = 3.1e-5;  // E_trunc_pt at the C_T = 1 central reading (sigma_opt = 0.75)
const ONE_PERCENT_OF_EN = 0.01 * E_N_COMMITTED; // 1.29087e-4 = the negligibility bar

// ── Outward-rounded interval for C_T(N*) = (3L-6)/(2L), L = log T0 ────────────
// T0 is a float from the RvM inverse, so we wrap it with fromFloat (a one-ULP
// outward enclosure of the float); the rest is the Interval class outward log/chain.
const T0_INTERVAL = Interval.fromFloat(T0_FLOAT);
const L_INTERVAL = T0_INTERVAL.log();                                  // [log_lo, log_hi]
const CT_NUM = Interval.exact(3).mul(L_INTERVAL).sub(Interval.exact(6)); // 3L - 6
const CT_DEN = Interval.exact(2).mul(L_INTERVAL);                        // 2L
const CT_STRIP_INTERVAL = CT_NUM.div(CT_DEN);                            // (3L-6)/(2L)

const CT_STRIP_LO = CT_STRIP_INTERVAL.lo;
const CT_STRIP_HI = CT_STRIP_INTERVAL.hi;
const CT_STRIP_WIDTH = CT_STRIP_INTERVAL.width;

// ── The explicit universal clean-count ceiling C_T < 3/2 (exact rational) ─────
// C_T(L) increases to 3/2 from below, so 3/2 is the supremum over all finite N.
const CT_CEILING_INTERVAL = Interval.exact(3).div(Interval.exact(2));   // 1.5, machine-exact
const CT_CEILING = 1.5;

// ── E_trunc negligibility at the conservative ceiling 3/2 ─────────────────────
// E_trunc scales linearly in C_T, so E_trunc_pt(3/2) = (3/2) . E_trunc_pt(1).
const E_TRUNC_AT_CEILING = CT_CEILING * E_TRUNC_PT_AT_CT1;              // 4.65e-5
const E_TRUNC_CEILING_SHARE = E_TRUNC_AT_CEILING / E_N_COMMITTED;       // ~0.36%

// The largest C_T for which E_trunc stays < 1% of E(N): the negligibility tolerance.
const CT_TOLERANCE_FOR_1PCT = ONE_PERCENT_OF_EN / E_TRUNC_PT_AT_CT1;    // ~4.164

export const IMP2861_C_T_EXPLICIT_PINNING = {
  id: 'imp-2861',
  proofSection: 'S7',
  verdict: 'EXPLICIT-CLEAN-COUNT BOUND + INTERVAL CERT; GAP-E-TRUNC-C-T STAYS MINOR-OPEN',
  question:
    'Pin an explicit certified upper bound on C_T from the Polymath15 Lemma 3.3 / Ingham 1940 ' +
    'constants, as an outward-rounded interval, and check E_trunc stays negligible at N* = 1e4 -- ' +
    'WITHOUT a false discharge of the effective-constant residual.',
  formula: 'E_trunc(N) = C_T . T0(N)^{-kappa_T} . log T0(N)',

  strip: {
    N_star: N_STAR,
    T0_float: +T0_FLOAT.toFixed(4),       // 9878.8034
    logT0_lo: L_INTERVAL.lo,
    logT0_hi: L_INTERVAL.hi,
  },

  // ---- (A) per-strip outward-rounded bracket of (3L-6)/(2L) ----
  ctStripInterval: {
    lo: CT_STRIP_LO,
    hi: CT_STRIP_HI,
    width: CT_STRIP_WIDTH,
    midReadable: +CT_STRIP_INTERVAL.mid.toFixed(6), // 1.173847
    belowCeiling: CT_STRIP_HI < CT_CEILING,
    note:
      'Outward-rounded enclosure of the clean-count closed form C_T(L) = (3L-6)/(2L) ' +
      'at the N* = 1e4 strip (T0 = gamma_N, L = log T0); a genuine machine bracket, ' +
      'not a rounded literal. Sits strictly below the universal ceiling 3/2.',
  },

  // ---- (B) explicit universal clean-count ceiling ----
  ctCeiling: {
    value: CT_CEILING,                              // 1.5
    lo: CT_CEILING_INTERVAL.lo,
    hi: CT_CEILING_INTERVAL.hi,
    derivation:
      'Polymath15 Lemma 3.3 factor-2 per off-line zero, integrated against the BARE ' +
      'Ingham 1940 count exponent (clean count A = 1, B = 0): C_T(L) = (3L-6)/(2L) is ' +
      'increasing (d C_T / dL = 3/L^2 > 0) and approaches 3/2 from below, so C_T < 3/2 ' +
      'for all finite N.',
    conditionalOn:
      'the CLEAN count A = 1, B = 0. The literature does NOT certify this uniformly down ' +
      'to the thin strip sigma = 1/2 + 1/log T0 (imp-1324: only O(1), edge A ~ 6 / B up ' +
      'to 5 at sigma = 3/4), so 3/2 is an explicit CONDITIONAL bound, not unconditional.',
  },

  // ---- (C) negligibility of E_trunc at N* = 1e4 ----
  negligibility: {
    E_N_committed: E_N_COMMITTED,                   // 0.0129087 (imp-2643)
    E_trunc_pt_at_CT1: E_TRUNC_PT_AT_CT1,           // 3.1e-5
    E_trunc_pt_at_ceiling: +E_TRUNC_AT_CEILING.toExponential(4), // 4.65e-5
    shareAtCeiling: +E_TRUNC_CEILING_SHARE.toFixed(5),           // ~0.00360
    onePercentBar: +ONE_PERCENT_OF_EN.toExponential(4),          // 1.2909e-4
    clearsAtCeiling: E_TRUNC_AT_CEILING < ONE_PERCENT_OF_EN,
    toleranceCeiling_CT: +CT_TOLERANCE_FOR_1PCT.toFixed(4),      // 4.1641
    note:
      'E_trunc scales linearly in C_T, so it stays < 1% of E(N) for EVERY C_T below ' +
      'C_T_TOL approx 4.16. The explicit clean-count bound 3/2 sits well inside this ' +
      'tolerance; the term is negligibility-dominated at N* = 1e4.',
  },

  honestScope: {
    delivered:
      'an explicit clean-count upper bound C_T < 3/2 (Polymath15 Lemma 3.3 + Ingham 1940) ' +
      'pinned as an outward-rounded interval at N* = 1e4, plus the negligibility tolerance ' +
      'C_T_TOL approx 4.16 under which E_trunc < 1% of E(N).',
    notDelivered:
      'NO certified small explicit C_T uniformly to the thin strip: the effective Ingham / ' +
      'Heath-Brown constant (A, B) blocking lemma is untouched, so GAP-E-TRUNC-C-T stays ' +
      'MINOR-OPEN. The 3/2 bound is conditional on the clean count A = 1, B = 0.',
    gapStatus: 'GAP-E-TRUNC-C-T: MINOR-OPEN (unchanged)',
    changesLambdaValue: false,
  },

  verdict_long:
    'C_T EXPLICIT CLEAN-COUNT BOUND INTERVAL-CERTIFIED. (3L-6)/(2L) in [' +
    CT_STRIP_LO.toFixed(12) + ', ' + CT_STRIP_HI.toFixed(12) + '] (outward-rounded, width ' +
    CT_STRIP_WIDTH.toExponential(2) + ') at N* = 1e4, strictly below the universal clean-count ' +
    'ceiling 3/2. At the ceiling 3/2, E_trunc_pt = ' + E_TRUNC_AT_CEILING.toExponential(3) +
    ' = ' + (100 * E_TRUNC_CEILING_SHARE).toFixed(2) + '% of E(N) approx 0.0129 -- negligible, ' +
    'and stays < 1% for all C_T below ' + CT_TOLERANCE_FOR_1PCT.toFixed(2) + '. But the effective ' +
    'Ingham constant (A, B) is only O(1) at the thin strip, NOT certified, so the explicit 3/2 is ' +
    'CONDITIONAL on the clean count and GAP-E-TRUNC-C-T stays MINOR-OPEN. No false discharge; no ' +
    'Lambda value changes.',

  citation:
    'polymath15-constant-C-T.js (imp-397 clean-count C_T = (3L-6)/(2L) < 3/2); ' +
    'imp-2625-etrunc-constant-pinning.js (C_T MINOR-OPEN, effective-constant blocking lemma); ' +
    'imp-2643-honest-assembled-EN.js (E(N) approx 0.0129087 at N* = 1e4); ' +
    'imp-2709-kappa-t-interval-certificate.js (sibling outward-rounded interval); ' +
    'interval-arithmetic.js (imp-068 outward-rounded log/div/mul/sub)',
};

export const IMP2861_C_T_EXPLICIT_PINNING_ASSERTIONS = [
  {
    id: 'imp2861-ct-strip-bracket-tight-finite-below-ceiling',
    description:
      'The outward-rounded bracket of C_T(N*) = (3L-6)/(2L) at N* = 1e4 is finite, positive, ' +
      'tight (width < 1e-12) and lies strictly below the universal clean-count ceiling 3/2.',
    holds: () =>
      Number.isFinite(CT_STRIP_WIDTH) && CT_STRIP_WIDTH > 0 && CT_STRIP_WIDTH < 1e-12 &&
      CT_STRIP_LO > 0 && CT_STRIP_HI < CT_CEILING,
  },
  {
    id: 'imp2861-ceiling-is-exact-rational-enclosure',
    description:
      'The universal clean-count ceiling 3/2 is a machine-exact rational enclosure that ' +
      'brackets the per-strip value from above.',
    holds: () =>
      CT_CEILING_INTERVAL.contains(1.5) &&
      CT_CEILING_INTERVAL.lo <= 1.5 && CT_CEILING_INTERVAL.hi >= 1.5 &&
      CT_STRIP_HI < CT_CEILING_INTERVAL.hi,
  },
  {
    id: 'imp2861-etrunc-negligible-at-ceiling',
    description:
      'E_trunc_pt(C_T = 3/2) = (3/2) . E_trunc_pt(1) stays < 1% of the committed E(N) approx ' +
      '0.0129087 at N* = 1e4: the term is negligibility-dominated.',
    holds: () =>
      Math.abs(E_TRUNC_AT_CEILING - 4.65e-5) < 1e-7 &&
      E_TRUNC_AT_CEILING < ONE_PERCENT_OF_EN &&
      E_TRUNC_CEILING_SHARE < 0.01,
  },
  {
    id: 'imp2861-tolerance-ceiling-above-clean-count-bound',
    description:
      'The negligibility tolerance C_T_TOL = 0.01 . E(N) / E_trunc_pt(1) approx 4.16 sits ' +
      'strictly above the explicit clean-count bound 3/2, so E_trunc < 1% of E(N) holds with margin.',
    holds: () =>
      Math.abs(CT_TOLERANCE_FOR_1PCT - 4.1641) < 1e-3 &&
      CT_TOLERANCE_FOR_1PCT > CT_CEILING &&
      CT_CEILING * E_TRUNC_PT_AT_CT1 < ONE_PERCENT_OF_EN,
  },
  {
    id: 'imp2861-honest-no-false-discharge',
    description:
      'GAP-E-TRUNC-C-T stays MINOR-OPEN: the 3/2 bound is conditional on the clean count, the ' +
      'effective-constant residual is untouched, and no committed Lambda value changes.',
    holds: () =>
      IMP2861_C_T_EXPLICIT_PINNING.honestScope.gapStatus.indexOf('MINOR-OPEN') >= 0 &&
      IMP2861_C_T_EXPLICIT_PINNING.honestScope.changesLambdaValue === false &&
      typeof IMP2861_C_T_EXPLICIT_PINNING.ctCeiling.conditionalOn === 'string' &&
      IMP2861_C_T_EXPLICIT_PINNING.ctCeiling.conditionalOn.length > 0,
  },
];

// Self-validate on import so the certificate is checked wherever it is loaded.
for (const a of IMP2861_C_T_EXPLICIT_PINNING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2861-c-t-explicit-pinning assertion failed: ' + a.id);
  }
}
