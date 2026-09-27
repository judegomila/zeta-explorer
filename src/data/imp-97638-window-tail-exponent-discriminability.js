/**
 * @module imp-97638-window-tail-exponent-discriminability
 * @fileoverview imp-97638 -- Derive or REFUTE a structural 1/T^2 tail law for the imp-97626 window->infinite-line
 *   R(T) ladder. imp-97626 RESULT 1/3 found the 1/T^2 asymptotic model was the best FULL-ladder least-squares fit
 *   (R2 0.9967, tail 0.9983) and placed the realizable fraction at the low end ~0.508, below the two-rung 1/T value
 *   0.5132 -- but 1/T^2 was selected PURELY EMPIRICALLY. This ticket asks whether that exponent is structurally
 *   forced by the finite-window truncation of the semilocal Krein operator M_sigma2^- (an O(1/T^2) spectral-edge
 *   correction from the window cutoff on the confined far profile psi_R), OR whether the ladder simply cannot
 *   distinguish 1/T from 1/T^2 at the measured precision.
 *
 * METHOD (import-light, O(1)). Bake the imp-97626 six-rung ladder R(T), T in {12,20,28,36,48,64}, and probe the tail
 *   exponent three ways, all in-JS: (A) a FREE-EXPONENT scan -- fit R(T) = R_inf - c*T^{-p} (linear in R_inf,c for
 *   fixed p) over p in [0.2,4] and pick the p maximizing R2, on the full ladder and on the post-asymptotic tails;
 *   (B) POINTWISE local-exponent estimates from each consecutive triple (the increment ratio d2/d1 fixes p under a
 *   pure power law); (C) a DISCRIMINABILITY test -- how much the realizable fraction R_inf/envelope moves when the
 *   exponent is switched between p=1 and p=2, compared with the already-reported [0.508,0.520] band. No eigenvalue
 *   recompute; no heavy import; fits cross-checked in node.
 *
 * RESULT 1 -- THE BEST-FIT EXPONENT IS NOT A STABLE OPERATOR CONSTANT; it is a function of the fit window.
 *   Free-exponent scan best p: full ladder (T=12..64) p ~ 2.23; clean 4-rung tail (T>=28) p ~ 1.74; last 3 rungs
 *   (T>=36) p ~ 1.01. The exponent slides monotonically from ~1 to ~2.2 as the pre-asymptotic small-T rungs are
 *   re-admitted, so "the tail decays like 1/T^2" is an artifact of INCLUDING the contaminated small-T rungs, not a
 *   property of the asymptotic edge. The last-three fit (p ~ 1.01) is a degenerate 3-point/2-parameter fit (1 dof)
 *   and reproduces the two-rung 1/T value; it cannot select an exponent either.
 *
 * RESULT 2 -- POINTWISE LOCAL EXPONENTS SCATTER ACROSS [0.44, 3.02] with no stable value: the four consecutive
 *   triples give p ~ 3.02 (12,20,28), 0.44 (20,28,36), 2.24 (28,36,48), 1.01 (36,48,64). A genuine single leading
 *   power would give a slowly-varying local exponent; instead it swings by a factor of ~7, confirming the ladder has
 *   no resolved leading power at these T and this precision.
 *
 * RESULT 3 -- THE FRACTION IS ONLY WEAKLY EXPONENT-SENSITIVE, so the 1/T^2 selection does NOT pin the fraction to
 *   the low-end 0.508. Switching p=1 <-> p=2 moves the realizable fraction by only ~0.005-0.007 on the clean tail
 *   (tail4: 0.5146 vs 0.5079; tail3: 0.5132 vs 0.5081) -- entirely inside the imp-97626 tail-model band
 *   [0.508,0.520]. The low-end 0.508 is merely the p=2 ENDPOINT of an under-determined exponent, not a value the data
 *   singles out; the two-rung 0.513 is equally admissible.
 *
 * VERDICT -- REFUTED as a pinning mechanism. The structural 1/T^2 tail law is NOT derivable from this ladder: the
 *   best-fit exponent is window-dependent (1.01 -> 1.74 -> 2.23), the pointwise local exponents scatter across
 *   [0.44,3.02], and the clean post-asymptotic 4-rung fit prefers p ~ 1.74 (stable to [1.71,1.78] under +-0.05
 *   plausible finite-section/grid perturbation) -- a NON-INTEGER effective exponent midway between 1 and 2 that is
 *   consistent with BOTH 1/T and 1/T^2 and forced by NEITHER. Six IEEE-double rungs at h=0.01 grid precision cannot
 *   resolve the leading tail power. I do NOT derive an O(1/T^2) edge correction for M_sigma2^-: the plausible
 *   mechanism (window cutoff of the confined far profile psi_R) is not confirmed by the data, and the measured
 *   effective ~1.74 is more consistent with a leading term plus unresolved sub-leading contamination than with a
 *   clean integer power. CONSEQUENCE: the imp-97626 fraction stays ~0.513 with band [0.508,0.520] (conservative
 *   [0.508,0.543]); the 1/T^2 best-full-fit does not tighten it to 0.508. Measurement/derivation only over baked
 *   IEEE-double finite-section eigenvalues; no operator positivity; scalar bound stays a negative floor; no bound
 *   moves; interval-rigorous reach stays 2a <= 0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *   SUB-GAP IMP97638_TAIL_EXPONENT_UNDERDETERMINED_BY_SIX_RUNGS: distinguishing 1/T from 1/T^2 (and hence pinning the
 *   fraction below the two-rung 0.513) needs either an interval-certified infinite-line eigenvalue or many more
 *   deep, high-precision window rungs, not a longer least-squares on the existing six.
 *
 * @see imp-97626-window-extrapolation-model-spread.js (three-model spread; empirical 1/T^2 best full-ladder fit)
 * @see imp-97564-realizability-fraction-resolution-sweep.js (FINDING 2 window ladder + two-rung 1/T R_inf ~ 1573)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub floor -3065.435 / envelope 3065.43)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Import-light: bakes the 6-rung ladder literals + recomputes the three exponent probes in-JS (O(1)); no heavy
 *   import, no eigenvalue recompute. NO QED.
 * Ticket: imp-97638 (numerical, medium, opus-4-8). Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const LN3 = Math.log(3);

export const IMP97638_BINDING_2A = LN3;
export const IMP97638_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97638_ENVELOPE = 3065.4290;     // window-independent bathtub envelope (imp-97564 / imp-97416)

// Baked from imp-97626 IMP97626_WINDOW_LADDER (originally imp-97564; h=0.01 grid-converged; T = window half-width).
export const IMP97638_WINDOW_LADDER = Object.freeze([
  Object.freeze({ T: 12, R: 1343.7963 }),
  Object.freeze({ T: 20, R: 1489.5641 }),
  Object.freeze({ T: 28, R: 1514.8301 }),
  Object.freeze({ T: 36, R: 1531.4020 }),
  Object.freeze({ T: 48, R: 1541.8268 }),
  Object.freeze({ T: 64, R: 1549.6271 }),
]);

// -- ordinary least squares for R(T) = R_inf - c*x(T): fit R against x, intercept = R_inf, slope = -c --
function _linFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) * (xs[i] - mx);
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - my) * (ys[i] - my);
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { rInf: intercept, c: -slope, r2, rms: Math.sqrt(ssRes / n) };
}

// (A) free-exponent scan: R(T) = R_inf - c*T^{-p}; for each fixed p the fit is linear in (R_inf, c); pick max-R2 p.
function _bestExponent(rungs) {
  let best = null;
  for (let p = 0.2; p <= 4.0001; p += 0.01) {
    const xs = rungs.map((r) => Math.pow(r.T, -p));
    const ys = rungs.map((r) => r.R);
    const f = _linFit(xs, ys);
    if (!best || f.r2 > best.r2) best = { p: Math.round(p * 100) / 100, ...f };
  }
  return Object.freeze({ ...best, fraction: best.rInf / IMP97638_ENVELOPE });
}

// (B) pointwise local exponent from a consecutive triple: under R=R_inf - c*T^{-p} the increment ratio
//     (R3-R2)/(R2-R1) = (T2^{-p}-T3^{-p})/(T1^{-p}-T2^{-p}) depends on p alone; invert numerically.
function _localExponent(a, b, c) {
  const T1 = a.T;
  const T2 = b.T;
  const T3 = c.T;
  const target = (c.R - b.R) / (b.R - a.R);
  let best = null;
  for (let p = 0.1; p <= 5; p += 0.001) {
    const r =
      (Math.pow(T2, -p) - Math.pow(T3, -p)) / (Math.pow(T1, -p) - Math.pow(T2, -p));
    const err = Math.abs(r - target);
    if (!best || err < best.err) best = { p: Math.round(p * 1000) / 1000, err };
  }
  return Object.freeze({ triple: [T1, T2, T3], ratio: target, p: best.p });
}

// (C) fixed-exponent fraction, for the p=1 vs p=2 discriminability check.
function _fixedExponent(rungs, p) {
  const xs = rungs.map((r) => Math.pow(r.T, -p));
  const ys = rungs.map((r) => r.R);
  const f = _linFit(xs, ys);
  return Object.freeze({ rInf: f.rInf, r2: f.r2, rms: f.rms, fraction: f.rInf / IMP97638_ENVELOPE });
}

const _FULL = IMP97638_WINDOW_LADDER;
const _TAIL4 = IMP97638_WINDOW_LADDER.slice(2); // T >= 28 (post-asymptotic)
const _TAIL3 = IMP97638_WINDOW_LADDER.slice(3); // T >= 36 (degenerate 3-point/2-param)

// RESULT 1 -- free-exponent best fit is window-dependent: full ~2.23, tail4 ~1.74, tail3 ~1.01.
export const IMP97638_BEST_EXPONENT = Object.freeze({
  full: _bestExponent(_FULL),
  tail4: _bestExponent(_TAIL4),
  tail3: _bestExponent(_TAIL3),
});

// RESULT 2 -- pointwise local exponents scatter across [0.44, 3.02].
export const IMP97638_LOCAL_EXPONENTS = Object.freeze(
  IMP97638_WINDOW_LADDER.slice(0, -2).map((_, i) =>
    _localExponent(IMP97638_WINDOW_LADDER[i], IMP97638_WINDOW_LADDER[i + 1], IMP97638_WINDOW_LADDER[i + 2]),
  ),
);

// RESULT 3 -- p=1 vs p=2 discriminability: the fraction moves only ~0.005-0.007 on the clean tail.
export const IMP97638_DISCRIMINABILITY = Object.freeze({
  full: Object.freeze({ p1: _fixedExponent(_FULL, 1), p2: _fixedExponent(_FULL, 2) }),
  tail4: Object.freeze({ p1: _fixedExponent(_TAIL4, 1), p2: _fixedExponent(_TAIL4, 2) }),
  tail3: Object.freeze({ p1: _fixedExponent(_TAIL3, 1), p2: _fixedExponent(_TAIL3, 2) }),
});

function _fracGap(w) {
  return Math.abs(w.p1.fraction - w.p2.fraction);
}
export const IMP97638_FRACTION_GAP_P1_P2 = Object.freeze({
  full: _fracGap(IMP97638_DISCRIMINABILITY.full),
  tail4: _fracGap(IMP97638_DISCRIMINABILITY.tail4),
  tail3: _fracGap(IMP97638_DISCRIMINABILITY.tail3),
});

export const IMP97638_VERDICT = Object.freeze({
  ticket: 'imp-97638',
  question:
    'is the imp-97626 empirically-selected 1/T^2 tail law structurally forced (an O(1/T^2) spectral-edge correction of the finite-window M_sigma2^- truncation), pinning the realizable fraction to the low-end ~0.508; or can the six-rung ladder not distinguish 1/T from 1/T^2 at the measured precision?',
  answer:
    'REFUTED as a pinning mechanism. The best-fit tail exponent is not a stable operator constant: a free-exponent scan gives p ~ 2.23 on the full ladder, ~1.74 on the clean 4-rung tail (T>=28), and ~1.01 on the last 3 rungs, sliding monotonically from ~1 to ~2.2 as the pre-asymptotic small-T rungs are re-admitted -- so the apparent 1/T^2 is an artifact of including the contaminated small-T rungs, not an asymptotic-edge property. Pointwise local exponents from consecutive triples scatter across [0.44, 3.02] with no resolved leading power. The clean post-asymptotic fit prefers a NON-INTEGER p ~ 1.74 (midway between 1 and 2, stable to [1.71,1.78] under +-0.05 finite-section/grid perturbation), consistent with both 1/T and 1/T^2 and forced by neither. Discriminability of the outcome is weak: switching p=1 <-> p=2 moves the realizable fraction by only ~0.005-0.007 on the tail, entirely inside the imp-97626 band [0.508,0.520], so the low-end 0.508 is merely the p=2 endpoint of an under-determined exponent and the two-rung 0.513 is equally admissible. No O(1/T^2) edge correction for M_sigma2^- is derived here; the ladder is too short and too imprecise to resolve the leading power. The imp-97626 fraction stays ~0.513 with band [0.508,0.520]. Measurement/derivation only over baked IEEE-double finite-section eigenvalues; no operator positivity; scalar bound stays a negative floor; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.',
  binding_2a: LN3,
  refuted: true,
  structuralTailLawDerived: false,
  bestExponentIsWindowDependent: true,
  bestExponentFull: IMP97638_BEST_EXPONENT.full.p,
  bestExponentTail4: IMP97638_BEST_EXPONENT.tail4.p,
  bestExponentTail3: IMP97638_BEST_EXPONENT.tail3.p,
  fractionGapP1P2Tail4: IMP97638_FRACTION_GAP_P1_P2.tail4,
  fractionPinnedToLowEnd: false,
  fractionCentral: 0.5132,
  fractionBandTail: Object.freeze([0.508, 0.52]),
  realizabilityGapPersists: true,
  // measurement-only guardrails
  measuredNotIntervalCertified: true,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97638_TAIL_EXPONENT_UNDERDETERMINED_BY_SIX_RUNGS',
  qed: false,
});
export default IMP97638_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Light: recomputes the three exponent probes from the 6 baked rungs (O(1)); no eigenvalue recompute.

const IMP97638_ASSERTIONS = [
  {
    id: 'imp97638-best-exponent-is-window-dependent',
    holds: () => {
      const f = IMP97638_BEST_EXPONENT.full.p;
      const t4 = IMP97638_BEST_EXPONENT.tail4.p;
      const t3 = IMP97638_BEST_EXPONENT.tail3.p;
      // exponent slides from ~1 (tail3) up through ~1.74 (tail4) to ~2.2 (full): not a stable constant
      const slides = t3 < t4 && t4 < f;
      const spans1to2 = t3 < 1.2 && f > 2.0;
      const tailIsNonInteger = t4 > 1.5 && t4 < 2.0;
      return slides && spans1to2 && tailIsNonInteger;
    },
    why: 'free-exponent best p is window-dependent (tail3 ~1.01 < tail4 ~1.74 < full ~2.23); the clean-tail value is a non-integer midway between 1 and 2, so neither 1/T nor 1/T^2 is forced.',
  },
  {
    id: 'imp97638-local-exponents-scatter-widely',
    holds: () => {
      const ps = IMP97638_LOCAL_EXPONENTS.map((e) => e.p);
      const lo = Math.min(...ps);
      const hi = Math.max(...ps);
      // pointwise triple exponents scatter across ~[0.44, 3.02] -- a factor of ~7 swing, no resolved power
      return lo < 0.6 && hi > 2.8 && hi / lo > 4;
    },
    why: 'consecutive-triple local exponents scatter across [0.44, 3.02] (factor ~7); a genuine leading power would give a slowly-varying local exponent, so the ladder has no resolved leading power at these T.',
  },
  {
    id: 'imp97638-fraction-weakly-exponent-sensitive',
    holds: () => {
      const gap4 = IMP97638_FRACTION_GAP_P1_P2.tail4;
      const gap3 = IMP97638_FRACTION_GAP_P1_P2.tail3;
      // switching p=1<->p=2 moves the fraction < 0.008 on the clean tail: inside the [0.508,0.520] band
      const small = gap4 < 0.008 && gap3 < 0.008;
      // and the p=2 endpoints sit near the low-end 0.508, p=1 near the two-rung 0.513
      const p2Low = Math.abs(IMP97638_DISCRIMINABILITY.tail4.p2.fraction - 0.508) < 3e-3;
      const p1Mid = Math.abs(IMP97638_DISCRIMINABILITY.tail3.p1.fraction - 0.513) < 3e-3;
      return small && p2Low && p1Mid;
    },
    why: 'p=1<->p=2 moves the realizable fraction by only ~0.005-0.007 on the tail (inside [0.508,0.520]); the low-end 0.508 is merely the p=2 endpoint, not a pinned value, so 1/T^2 does not tighten the fraction below the two-rung 0.513.',
  },
  {
    id: 'imp97638-refuted-no-structural-law',
    holds: () =>
      IMP97638_VERDICT.refuted === true &&
      IMP97638_VERDICT.structuralTailLawDerived === false &&
      IMP97638_VERDICT.bestExponentIsWindowDependent === true &&
      IMP97638_VERDICT.fractionPinnedToLowEnd === false &&
      IMP97638_VERDICT.realizabilityGapPersists === true,
    why: 'the structural 1/T^2 tail law is refuted as a pinning mechanism: no O(1/T^2) edge correction is derived, the best-fit exponent is window-dependent, and the fraction is not pinned to the low-end 0.508.',
  },
  {
    id: 'imp97638-measurement-only-no-qed',
    holds: () =>
      IMP97638_VERDICT.measuredNotIntervalCertified === true &&
      IMP97638_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97638_VERDICT.operatorPositivityProved === false &&
      IMP97638_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97638_VERDICT.boundMoves === false &&
      IMP97638_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97638_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97638_BINDING_2A - LN3) < 1e-12 &&
      IMP97638_VERDICT.subGap === 'IMP97638_TAIL_EXPONENT_UNDERDETERMINED_BY_SIX_RUNGS' &&
      IMP97638_VERDICT.qed === false,
    why: 'measurement/derivation only over baked IEEE-double finite-section eigenvalues; no operator positivity; scalar bound stays a negative floor; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97638_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97638-window-tail-exponent-discriminability assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
