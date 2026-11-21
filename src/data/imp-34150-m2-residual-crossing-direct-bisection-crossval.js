/**
 * @module imp-34150-m2-residual-crossing-direct-bisection-crossval
 *
 * imp-34150 (accuracy, frontier-direction): imp-34023 read the M2-residual zero crossing kEnd* ~ 21.281
 * off the F4 = resid(hi)/resid(lo) SIGN FLIP, and imp-34087 inherited the same root via the relative-
 * cancellation ratio C(kEnd) = (|A|+|B|)/|resid| = 1/|resid|. Both identify the crossing THROUGH a derived
 * ratio (F4, or the reciprocal residual). This module cross-validates the ceiling from a SECOND, fully
 * independent code path: with the identical inherited imp-3406/imp-33810 sub-terms (head fixed at k=6) it
 * rebuilds resid(kEnd) = pEcoll*(1-sigma) - pSigma DIRECTLY as a continuous function of the fit boundary
 * kEnd -- never forming F4, never forming C -- and bisects (and independently secant-solves) for
 * resid(kEnd*) = 0, then reports whether the raw-residual root reproduces 21.281 and to how many digits.
 *
 * THE INDEPENDENT DIRECT-RESIDUAL ROOT
 * ------------------------------------
 *   Bisecting the raw residual on a distinct bracket kEnd in [21, 22] (200 iterations) lands on kEnd* =
 *   21.2809474250. A completely separate secant iteration seeded at (21.0, 21.5) -- a different numerical
 *   scheme with no bracket at all -- converges to kEnd* = 21.2809474224, agreeing with the bisection root
 *   to ~2.6e-9 (well below any reporting precision). So the crossing is a genuine zero of the underlying
 *   M2 residual, robust to the root-finder, NOT an artifact of the F4 or C=1/|resid| reciprocal.
 *
 * REPRODUCTION OF THE INHERITED CEILING (to all published digits)
 * ---------------------------------------------------------------
 *   The independent root 21.28094743 rounds to 21.28095 -- reproducing imp-34087 exactly at its published
 *   5 decimal places -- and to 21.281, reproducing imp-34023 exactly at its published 3 decimal places.
 *   The absolute gaps are |root - 21.28095| ~ 2.6e-6 and |root - 21.281| ~ 5.3e-5, both inside the last
 *   place of the respective published value. Measured as matching significant figures, the direct root
 *   agrees with the imp-34087 ceiling to ~7 significant figures (relative gap ~1.2e-7). The raw residual
 *   itself passes cleanly through zero there: resid(21) ~ +8.72e-8, resid(21.28) ~ +2.46e-10,
 *   resid(21.29) ~ -2.34e-9, a monotone sign change straddling the root.
 *
 * The punchline: an independent direct bisection (and an independent secant) of the raw M2 residual
 * resid(kEnd) = pEcoll*(1-sigma) - pSigma -- formed WITHOUT the F4 ratio or the C=1/|resid| reciprocal that
 * imp-34023/imp-34087 used -- lands on kEnd* = 21.28094743, reproducing the inherited 21.281 / 21.28095
 * ceiling to all published digits (~7 significant figures). The crossing is a real zero of the surrogate
 * residual, cross-validated across two independent code paths and two root-finders.
 *
 * NUMERICAL / CROSS-VALIDATION ONLY. A second-code-path bisection of an inherited surrogate residual, NOT
 * an RH bound. Reuses the imp-33773/imp-33810 sub-terms verbatim; the inherited imp-3220/imp-3406 component
 * model is NOT a rigorous asymptotic; the crossing is descriptive within that model only; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F4 sign-flip crossing ~21.281 cross-validated here)
 * @see imp-34087-f4-surrogate-cancellation-digit-loss (the C=1/|resid| reciprocal crossing ~21.28095 cross-validated here)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34087 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34023/imp-34087 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
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
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// THE INDEPENDENT SECOND CODE PATH: build the imp-33773 M2 residual DIRECTLY as a function of the fit
// boundary kEnd (head fixed at k=6). No F4 = resid(hi)/resid(lo) ratio (imp-34023) and no relative-
// cancellation reciprocal C = (|A|+|B|)/|resid| (imp-34087) is formed -- just resid = A - B.
function residDirect(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  return pEcoll * (1 - s) - pSigma; // A - B, A = pEcoll*(1-sigma), B = pSigma
}

// Root-finder 1: plain bisection on a distinct bracket (imp-34023 used [20,22]/80 it, imp-34087 [20,22]/
// 100 it; here [21,22]/200 it). resid decreases through zero, so root = last sign change.
function bisectRoot(loK, hiK, iters) {
  if (residDirect(loK) <= 0 || residDirect(hiK) >= 0) return NaN;
  let lo = loK;
  let hi = hiK;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (residDirect(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Root-finder 2: secant iteration (NO bracket) -- a structurally different scheme to confirm the root is
// not a bisection artifact.
function secantRoot(x0, x1, iters) {
  let f0 = residDirect(x0);
  let f1 = residDirect(x1);
  for (let i = 0; i < iters; i++) {
    const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
    x0 = x1;
    f0 = f1;
    x1 = x2;
    f1 = residDirect(x1);
    if (Math.abs(x1 - x0) < 1e-13) break;
  }
  return x1;
}

const ROOT_BISECT = bisectRoot(21, 22, 200); // ~21.2809474250
const ROOT_SECANT = secantRoot(21.0, 21.5, 100); // ~21.2809474224
const ROOTFINDER_AGREEMENT = Math.abs(ROOT_BISECT - ROOT_SECANT); // ~2.6e-9

// The published inherited ceilings (literals -- NOT imported, to keep this a truly independent path).
const IMP34023_CEILING = 21.281; // imp-34023 F4 sign-flip crossing (3 dp published)
const IMP34087_CEILING = 21.28095; // imp-34087 C=1/|resid| crossing (5 dp published)

// Reproduction metrics against the inherited ceilings.
const ABS_GAP_VS_34023 = Math.abs(ROOT_BISECT - IMP34023_CEILING); // ~5.3e-5
const ABS_GAP_VS_34087 = Math.abs(ROOT_BISECT - IMP34087_CEILING); // ~2.6e-6
const SIG_FIGS_VS_34087 = -Math.log10(ABS_GAP_VS_34087 / IMP34087_CEILING); // ~6.9 sig figs
const REPRODUCES_34087_AT_5DP = +ROOT_BISECT.toFixed(5) === IMP34087_CEILING; // 21.28095
const REPRODUCES_34023_AT_3DP = +ROOT_BISECT.toFixed(3) === IMP34023_CEILING; // 21.281

// A short raw-residual sign-change table straddling the root (evidence the crossing is a clean zero).
const RESID_STRADDLE = [21.0, 21.26, 21.28, ROOT_BISECT, 21.29, 21.4].map((kEnd) => ({
  kEnd: +kEnd.toFixed(6),
  resid: +residDirect(kEnd).toExponential(4),
}));

export const IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL = {
  id: 'imp-34150',
  proofSection: 'S-frontier',
  question:
    'imp-34023 and imp-34087 both located the M2-residual zero crossing kEnd* ~ 21.281 THROUGH derived ' +
    'ratios (the F4 = resid(hi)/resid(lo) sign flip, and the relative cancellation C = (|A|+|B|)/|resid| ' +
    '= 1/|resid|). Cross-validate the crossing from a second, independent code path: with the identical ' +
    'inherited imp-3406/imp-33810 sub-terms (head fixed at k=6) build resid(kEnd) = pEcoll*(1-sigma) - ' +
    'pSigma DIRECTLY as a function of continuous kEnd and bisect for resid(kEnd*) = 0, reporting whether ' +
    'the independent root reproduces 21.281 and to how many digits. Cross-validation/measurement only; ' +
    'component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The root kEnd* of the raw imp-33773 M2 residual resid(kEnd) = pEcoll*(1-sigma) - pSigma (head fixed ' +
    'at k=6), located by (1) direct bisection on the bracket kEnd in [21, 22] (200 iterations) and (2) an ' +
    'independent secant iteration seeded at (21.0, 21.5), neither forming the F4 ratio nor the C=1/|resid| ' +
    'reciprocal; plus the reproduction gaps against the inherited imp-34023 (21.281) and imp-34087 ' +
    '(21.28095) ceilings.',
  directBisectionRoot: +ROOT_BISECT.toFixed(8), // ~21.28094743
  secantRoot: +ROOT_SECANT.toFixed(8), // ~21.28094742
  rootFinderAgreement: +ROOTFINDER_AGREEMENT.toExponential(3), // ~2.6e-9 (bisection vs secant)
  inheritedCeilings: { imp34023: IMP34023_CEILING, imp34087: IMP34087_CEILING },
  reproduction: {
    absGap_vs_imp34023: +ABS_GAP_VS_34023.toExponential(4), // ~5.3e-5 (inside its 3rd dp)
    absGap_vs_imp34087: +ABS_GAP_VS_34087.toExponential(4), // ~2.6e-6 (inside its 5th dp)
    significantFigures_vs_imp34087: +SIG_FIGS_VS_34087.toFixed(3), // ~6.9
    reproduces_imp34087_at_5dp: REPRODUCES_34087_AT_5DP, // true (rounds to 21.28095)
    reproduces_imp34023_at_3dp: REPRODUCES_34023_AT_3DP, // true (rounds to 21.281)
  },
  residStraddle: RESID_STRADDLE, // {kEnd, resid} monotone sign change through the root
  finding: {
    A_independent_root_reproduces_the_ceiling:
      'A direct bisection of the raw M2 residual resid(kEnd) = pEcoll*(1-sigma) - pSigma -- formed WITHOUT ' +
      'the F4 ratio (imp-34023) or the C=1/|resid| reciprocal (imp-34087) -- lands on kEnd* = 21.28094743, ' +
      'reproducing the inherited 21.28095 (imp-34087) at all 5 published decimals and 21.281 (imp-34023) ' +
      'at all 3 published decimals; the relative gap ~1.2e-7 is ~7 significant figures of agreement.',
    B_robust_to_the_root_finder:
      'An independent secant iteration (no bracket) seeded at (21.0, 21.5) converges to kEnd* = ' +
      '21.28094742, agreeing with the bisection root to ~2.6e-9 -- the crossing is a genuine zero of the ' +
      'surrogate residual, not an artifact of one root-finding scheme or one derived ratio.',
    C_clean_monotone_zero:
      'The raw residual passes cleanly through zero: resid(21) ~ +8.72e-8, resid(21.28) ~ +2.46e-10, ' +
      'resid(21.29) ~ -2.34e-9, a monotone sign change straddling the located root.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-VALIDATION (frontier-direction, NOT rigorous). Rebuilding the imp-33773 M2 residual ' +
    'resid(kEnd) = pEcoll*(1-sigma) - pSigma DIRECTLY from the identical inherited imp-3406/imp-33810 ' +
    'sub-terms (head fixed at k=6) -- forming neither the imp-34023 F4 = resid(hi)/resid(lo) ratio nor the ' +
    'imp-34087 relative-cancellation reciprocal C = (|A|+|B|)/|resid| -- and bisecting for resid(kEnd*) = ' +
    '0 on the bracket [21, 22] lands on kEnd* = 21.28094743. An independent secant iteration (no bracket) ' +
    'converges to 21.28094742, agreeing to ~2.6e-9. The independent root reproduces the inherited ceiling ' +
    'to all published digits: it rounds to 21.28095 (imp-34087, 5 dp) and to 21.281 (imp-34023, 3 dp), a ' +
    'relative agreement of ~7 significant figures. So the M2-residual zero crossing is a genuine zero of ' +
    'the raw surrogate residual, cross-validated across two independent code paths and two root-finders, ' +
    'NOT an artifact of the F4 or C=1/|resid| derivation. The inherited imp-3220/imp-3406 component model ' +
    'is NOT a rigorous asymptotic; the crossing is descriptive within that model only; changes no bound; ' +
    'establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34023 (the F4 sign-flip crossing ~21.281 cross-validated here); imp-34087 (the C=1/|resid| ' +
    'crossing ~21.28095 cross-validated here); imp-33810 (the quarter-decade rungs); imp-33773 (the M2 ' +
    'residual whose zero this locates); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL_ASSERTIONS = [
  {
    // (A) The independent direct-residual bisection reproduces the inherited ceiling to all published digits.
    id: 'imp34150-direct-root-reproduces-inherited-ceiling',
    description: 'direct bisection of raw resid(kEnd) lands on ~21.28095, rounding to imp-34087 (5dp) and imp-34023 (3dp)',
    holds: () =>
      Number.isFinite(ROOT_BISECT) &&
      ROOT_BISECT > 21.27 &&
      ROOT_BISECT < 21.29 &&
      REPRODUCES_34087_AT_5DP === true &&
      REPRODUCES_34023_AT_3DP === true &&
      SIG_FIGS_VS_34087 > 6,
  },
  {
    // (B) A structurally different root-finder (secant, no bracket) confirms the same root.
    id: 'imp34150-secant-confirms-bisection-root',
    description: 'independent secant root agrees with the bisection root to < 1e-7 (root-finder-independent)',
    holds: () =>
      Number.isFinite(ROOT_SECANT) &&
      ROOTFINDER_AGREEMENT < 1e-7 &&
      Math.abs(+ROOT_SECANT.toFixed(5) - IMP34087_CEILING) < 1e-9,
  },
  {
    // (C) The raw residual passes cleanly and monotonically through zero across the located root.
    id: 'imp34150-clean-monotone-sign-change',
    description: 'resid(21) > 0, resid(21.29) < 0, and resid is monotone decreasing across the straddle table',
    holds: () => {
      if (!(residDirect(21) > 0 && residDirect(21.29) < 0)) return false;
      const vals = [21.0, 21.26, 21.28, 21.29, 21.4].map(residDirect);
      return vals.every((v, i) => i === 0 || v < vals[i - 1]);
    },
  },
  {
    // Independence self-check: residDirect forms neither F4 (a ratio of two resids) nor C (a reciprocal);
    // it is exactly the difference A - B of the two cancelling exponent terms.
    id: 'imp34150-direct-path-is-raw-difference',
    description: 'residDirect(kEnd) equals A - B with A = pEcoll*(1-sigma), B = pSigma (no F4 ratio, no C reciprocal)',
    holds: () => {
      const kEnd = 18;
      const lo = Math.pow(10, kEnd);
      const hi = Math.pow(10, kEnd + 1);
      const pSigma = olsSigmaExponent(lo, hi);
      const pEcoll = ecollExponentMag(lo, hi);
      const s = parts(hi).sigma;
      const AminusB = pEcoll * (1 - s) - pSigma;
      return Math.abs(residDirect(kEnd) - AminusB) < 1e-15;
    },
  },
  {
    // Honesty gate: numerical/cross-validation only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34150-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL.verdict),
  },
];

for (const a of IMP34150_M2_RESIDUAL_CROSSING_DIRECT_BISECTION_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34150-m2-residual-crossing-direct-bisection-crossval assertion failed: ${a.id}`);
  }
}
