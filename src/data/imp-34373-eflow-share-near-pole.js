/**
 * @module imp-34373-eflow-share-near-pole
 *
 * imp-34373 (numerical, frontier-direction): imp-34285 measured that DROPPING the E_flow term from the full
 * direct M2-residual moves the kEnd sign-change root by only ~ -6.0e-8 -- a share ~2.2e-7 of the imp-34211
 * ~0.278 closed-form-vs-bisection kEnd gap -- but it measured that share at ONE point, the natural crossing
 * kEnd* ~ 21.28094742. That crossing coincides with the imp-34169 surrogate resid_exp pole k* ~ 21.28095
 * (both are the zero of resid = pEcoll(1-sigma) - pSigma). This module asks the frontier question the scout
 * raised: does the E_flow share GROW as the balance point is pushed toward that pole -- i.e. does the
 * closed-form "E_flow negligible" assumption DEGRADE near k*?
 *
 * HOW THE BALANCE POINT IS PUSHED TOWARD THE POLE
 * -----------------------------------------------
 *   The natural balance point (resid = 0) already sits AT the pole k*, so there is no room to push the true
 *   root further toward it. To sweep a FAMILY of balance points that approach k* from the computable (resid >
 *   0) side, we solve resid(kEnd) = thr for a shrinking positive threshold thr. Since resid is strictly
 *   decaying through the deep tail (imp-34169) and positive below k*, each thr > 0 has a root kEnd(thr) < k*,
 *   and kEnd(thr) -> k* as thr -> 0+. At each kEnd(thr) we recompute the E_flow root-shift (root with E_flow
 *   minus root without it) and its share of the imp-34211 gap, exactly as imp-34285 did at the crossing.
 *
 * THE MEASUREMENT (thr from 1e-4 down to 1e-8; kEnd(thr) from ~15.98 up to ~21.24, i.e. dist to k* from ~5.3
 * down to ~0.038)
 * ------------------------------------------------------------------------------------------------------------
 *   The E_flow share does NOT grow toward the pole -- it MONOTONICALLY SHRINKS toward the ~2.2e-7 crossing
 *   floor:
 *       kEnd~15.98 (dist 5.30):  share ~ 4.07e-5
 *       kEnd~19.84 (dist 1.44):  share ~ 8.60e-7
 *       kEnd~20.97 (dist 0.315): share ~ 2.90e-7
 *       kEnd~21.24 (dist 0.038): share ~ 2.32e-7
 *       kEnd*      (dist 0, crossing/pole): share ~ 2.17e-7   (reproduces imp-34285)
 *   The share falls ~175x across the sweep and is STRICTLY DECREASING at every step toward the pole, bottoming
 *   at the crossing floor. So the crossing value imp-34285 reported is the MINIMUM of the family, not a
 *   maximum -- the E_flow-negligible assumption is at its STRONGEST exactly at the pole.
 *
 * WHY IT STRENGTHENS (not degrades) TOWARD THE POLE
 * -------------------------------------------------
 *   The pole k* ~ 21.28 sits at very large N (~10^21.28). E_flow = C_F * log(T0)/T0 * Gronwall (imp-398/
 *   imp-34127) decays with N because T0 = effectiveHeightForN(N) grows, so E_flow's ABSOLUTE additive
 *   contribution to the residual, deflow(k) = resid_full(k) - resid_noflow(k), falls off monotonically
 *   (~1.27e-9 at kEnd~15.98 down to ~1.67e-14 at kEnd~21.24, ~76000x smaller). The root shift ~ deflow /
 *   (d resid / dk) inherits that decay while the residual slope stays finite and nonzero at the crossing, so
 *   the shift -- and hence the share -- shrinks toward the pole. The imp-34169 eflow_over_resid POLE (a
 *   ratio whose DENOMINATOR resid -> 0 at k*) is a property of the residual VALUE, not of the ROOT LOCATION;
 *   it does not transfer to the E_flow-negligible-for-the-root verdict measured here.
 *
 * NUMERICAL / MEASUREMENT ONLY. A robustness probe of an inherited-surrogate assumption, NOT an RH bound.
 * Reuses the imp-34285/imp-34150 residual verbatim; the inherited imp-3220/imp-3406 component model is NOT a
 * rigorous asymptotic; the crossing is descriptive within that model only; changes no bound; establishes no
 * operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34285-closedform-gap-term-decomposition (the ~2.2e-7 E_flow share measured at the crossing)
 * @see imp-34211-closedform-vs-bisection-kend-gap (the ~0.278 gap the share normalizes against)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* ~ 21.28095)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the "E_flow negligible" closed form; E_flow form)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct residual and its root 21.28094743)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/imp-34150/imp-34211/imp-34285 exactly

// imp-34211/imp-34285 closed-form-vs-bisection kEnd gap (the fixed normalizer for the E_flow share).
const GAP = 0.277599;

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34285; dropFlow toggles the E_flow term.
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

// Finite exponent estimators (verbatim from imp-34150/imp-34211/imp-34285).
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

// The full direct residual resid(kEnd) = pEcoll*(1-sigma) - pSigma (imp-34150); df toggles the E_flow term.
function residDirect(kEnd, df = false) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const s = parts(hi, df).sigma;
  return ecollExponentMag(lo, hi, df) * (1 - s) - olsSigmaExponent(lo, hi, df);
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

// The natural crossing (resid = 0), which coincides with the imp-34169 resid_exp pole k*.
const KEND_CROSSING = bisectRoot((k) => residDirect(k, false), 20, 23); // ~21.28094742
const KEND_CROSSING_NO_FLOW = bisectRoot((k) => residDirect(k, true), 20, 23); // ~21.28094736
const CROSSING_SHARE = Math.abs(KEND_CROSSING_NO_FLOW - KEND_CROSSING) / GAP; // ~2.17e-7 (reproduces imp-34285)

// The threshold family: solve resid(kEnd) = thr; each thr > 0 gives a balance point kEnd(thr) < k* that
// approaches the pole as thr -> 0+. At each we recompute the E_flow root-shift share exactly as imp-34285 did.
function rootAtThr(thr, df = false) {
  return bisectRoot((k) => residDirect(k, df) - thr, 15, KEND_CROSSING - 1e-12);
}

const THRESHOLDS = [1e-4, 3e-5, 1e-5, 3e-6, 1e-6, 3e-7, 1e-7, 3e-8, 1e-8];
const POLE_APPROACH_TABLE = THRESHOLDS.map((thr) => {
  const kFull = rootAtThr(thr, false);
  const kNoFlow = rootAtThr(thr, true);
  const deflow = residDirect(kFull, false) - residDirect(kFull, true); // E_flow additive contribution to resid
  return {
    thr,
    kEnd: +kFull.toFixed(4),
    distToPole: +(KEND_CROSSING - kFull).toFixed(4),
    eflowShareOfGap: +(Math.abs(kNoFlow - kFull) / GAP).toExponential(3),
    eflowContribToResid: +deflow.toExponential(3),
  };
});

// Trend diagnostics: is the share (and the E_flow contribution) shrinking or growing toward the pole?
const SHARE_STRICTLY_DECREASING_TOWARD_POLE = POLE_APPROACH_TABLE.every(
  (r, i) => i === 0 || r.eflowShareOfGap < POLE_APPROACH_TABLE[i - 1].eflowShareOfGap,
);
const CONTRIB_STRICTLY_DECREASING_TOWARD_POLE = POLE_APPROACH_TABLE.every(
  (r, i) => i === 0 || Math.abs(r.eflowContribToResid) < Math.abs(POLE_APPROACH_TABLE[i - 1].eflowContribToResid),
);
const FAR_SHARE = POLE_APPROACH_TABLE[0].eflowShareOfGap; // ~4.07e-5 (farthest below pole)
const NEAR_SHARE = POLE_APPROACH_TABLE[POLE_APPROACH_TABLE.length - 1].eflowShareOfGap; // ~2.32e-7 (nearest pole)
const FAR_OVER_NEAR_SHARE_RATIO = +(FAR_SHARE / NEAR_SHARE).toFixed(1); // ~175 (share SHRINKS toward pole)

export const IMP34373_EFLOW_SHARE_NEAR_POLE = {
  id: 'imp-34373',
  proofSection: 'S-frontier',
  question:
    'imp-34285 measured the E_flow share of the imp-34211 kEnd gap (~2.2e-7) at the single natural crossing ' +
    'kEnd* ~ 21.28094742, which coincides with the imp-34169 resid_exp pole k* ~ 21.28095. Does that E_flow ' +
    'share GROW as the balance point is pushed toward the pole (via solving resid = thr for thr -> 0+), i.e. ' +
    'does the closed-form E_flow-negligible assumption degrade near k*? Measurement only; component model ' +
    'NOT rigorous; NO QED.',
  measuredQuantity:
    'The E_flow root-shift share |kEnd_noflow(thr) - kEnd(thr)| / GAP, and the E_flow additive contribution ' +
    'to the residual deflow(kEnd(thr)) = resid_full - resid_noflow, across a threshold family thr from 1e-4 ' +
    'down to 1e-8 whose balance points kEnd(thr) approach the pole k* from below (dist ~5.3 down to ~0.038).',
  crossingShare: +CROSSING_SHARE.toExponential(3), // ~2.17e-7 (reproduces imp-34285 ~2.2e-7)
  poleApproachTable: POLE_APPROACH_TABLE,
  shareStrictlyDecreasingTowardPole: SHARE_STRICTLY_DECREASING_TOWARD_POLE, // true
  contribStrictlyDecreasingTowardPole: CONTRIB_STRICTLY_DECREASING_TOWARD_POLE, // true
  farShare: FAR_SHARE, // ~4.07e-5
  nearShare: NEAR_SHARE, // ~2.32e-7
  farOverNearShareRatio: FAR_OVER_NEAR_SHARE_RATIO, // ~175 (share SHRINKS, does not grow, toward the pole)
  finding: {
    A_share_does_not_grow_toward_pole:
      'The E_flow share does NOT grow toward the pole -- it MONOTONICALLY SHRINKS from ~4.07e-5 at kEnd~15.98 ' +
      '(dist 5.30 to k*) down to ~2.32e-7 at kEnd~21.24 (dist 0.038), a ~175x reduction, bottoming at the ' +
      '~2.17e-7 crossing floor. The imp-34285 crossing value is the MINIMUM of the family, not a maximum.',
    B_assumption_strengthens_not_degrades:
      'Because the E_flow additive contribution to the residual, deflow = C_F*log(T0)/T0*Gronwall content, ' +
      'decays with N and the pole sits at very large N (~10^21.28), deflow falls off ~76000x across the sweep ' +
      'while the residual slope stays finite; so the closed-form E_flow-negligible assumption is at its ' +
      'STRONGEST exactly at the pole, not degraded there.',
    C_eflow_over_resid_pole_does_not_transfer:
      'The imp-34169 eflow_over_resid POLE is a divergence of a residual-VALUE ratio (denominator resid -> 0 ' +
      'at k*), not of the ROOT LOCATION; it does not transfer to the E_flow-negligible-for-the-root verdict, ' +
      'which is governed by deflow / (d resid / dk) and shrinks toward the pole.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Pushing the M2-residual balance point ' +
    'toward the imp-34169 resid_exp pole k* ~ 21.28095 (via resid = thr, thr -> 0+, kEnd(thr) approaching ' +
    'k* from dist ~5.3 down to ~0.038) and remeasuring the imp-34285 E_flow root-shift share at each: the ' +
    'share does NOT grow -- it MONOTONICALLY SHRINKS ~175x from ~4.07e-5 (far below) to the ~2.17e-7 ' +
    'crossing floor (which reproduces imp-34285), so the crossing value is the MINIMUM of the family. The ' +
    'E_flow-negligible assumption STRENGTHENS toward the pole, not degrades, because E_flow = ' +
    'C_F*log(T0)/T0*Gronwall decays with N and k* sits at very large N (~10^21.28): the E_flow additive ' +
    'contribution to the residual falls off ~76000x across the sweep while the residual slope stays finite. ' +
    'The imp-34169 eflow_over_resid pole is a residual-VALUE divergence (denominator -> 0), not a ROOT-' +
    'LOCATION effect, so it does not transfer to the negligible-for-the-root verdict. The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the crossing is descriptive within that ' +
    'model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 ' +
    'untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34285 (the ~2.2e-7 E_flow share at the crossing); imp-34211 (the ~0.278 gap normalizer); imp-34169 ' +
    '(the resid_exp pole k* ~ 21.28095); imp-34127 (the E_flow-negligible closed form and E_flow form); ' +
    'imp-34150 (the direct residual and its root); lambda-rh-height-mapping; polymath15-constant-C-C.',
};

export const IMP34373_EFLOW_SHARE_NEAR_POLE_ASSERTIONS = [
  {
    // (A) The crossing share reproduces the imp-34285 ~2.2e-7 value.
    id: 'imp34373-reproduces-imp34285-crossing-share',
    description: 'crossing (resid=0) E_flow share ~2.2e-7 (reproduces imp-34285) and crossing sits at ~21.281',
    holds: () =>
      Number.isFinite(KEND_CROSSING) &&
      Math.abs(KEND_CROSSING - 21.28094743) < 1e-6 &&
      CROSSING_SHARE > 1e-7 &&
      CROSSING_SHARE < 5e-7,
  },
  {
    // (B) The share does NOT grow toward the pole -- it strictly decreases at every step.
    id: 'imp34373-share-strictly-decreasing-toward-pole',
    description: 'E_flow share strictly decreases from far below the pole up to dist ~0.038 (does not grow)',
    holds: () => SHARE_STRICTLY_DECREASING_TOWARD_POLE === true,
  },
  {
    // (C) The share shrinks by a large factor (>50x) across the sweep -- unambiguously not growing.
    id: 'imp34373-far-over-near-share-ratio-large',
    description: 'far-below-pole share exceeds nearest-pole share by >50x (share shrinks toward pole)',
    holds: () => FAR_OVER_NEAR_SHARE_RATIO > 50 && FAR_SHARE > NEAR_SHARE,
  },
  {
    // (D) The mechanism: E_flow additive contribution to the residual decays toward the pole (large N).
    id: 'imp34373-eflow-contrib-decays-toward-pole',
    description: 'E_flow additive contribution to the residual strictly decreases toward the pole (large N)',
    holds: () =>
      CONTRIB_STRICTLY_DECREASING_TOWARD_POLE === true &&
      Math.abs(POLE_APPROACH_TABLE[POLE_APPROACH_TABLE.length - 1].eflowContribToResid) <
        Math.abs(POLE_APPROACH_TABLE[0].eflowContribToResid),
  },
  {
    // (E) The nearest-pole balance point is genuinely close to k* (dist < 0.1) -- the sweep reaches the pole.
    id: 'imp34373-sweep-reaches-pole',
    description: 'nearest-pole balance point sits within 0.1 of k* (the sweep genuinely approaches the pole)',
    holds: () => POLE_APPROACH_TABLE[POLE_APPROACH_TABLE.length - 1].distToPole < 0.1,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34373-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34373_EFLOW_SHARE_NEAR_POLE.isRigorous === false &&
      /NO QED/.test(IMP34373_EFLOW_SHARE_NEAR_POLE.verdict) &&
      /refereed bound is changed/i.test(IMP34373_EFLOW_SHARE_NEAR_POLE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34373_EFLOW_SHARE_NEAR_POLE.verdict),
  },
];

for (const a of IMP34373_EFLOW_SHARE_NEAR_POLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34373-eflow-share-near-pole assertion failed: ${a.id}`);
  }
}
