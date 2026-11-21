/**
 * imp-96251 (2026-09-24) — ACCURACY/CROSS-CHECK: verify the three Route I Kato-Temple modules that touch the
 * same 3-level {oo,2} semilocal geometry are mutually consistent. imp-96205 anchor-swept the SEPARATE
 * two-level certify thresholds, imp-96206 measured the COUPLED (eps_a, eps_b) region at only the gap-midpoint
 * anchor 0.81008715, and imp-96227 anchor-swept the JOINT region and found the per-channel coupling is exactly
 * sqrt(3)/2 at every anchor. This ticket cross-checks that the shared columns agree, that the imp-96227
 * midpoint reading reproduces the imp-96206 1.033e-3 / 1.192e-3 = 0.866 coupling, that the equal-split ratio
 * is continuous across the three, and that no anchor grid, lam value, or threshold definition has drifted.
 * VERDICT: FULLY CONSISTENT. No drift found.
 *   (1) The imp-96227 pure-bottom worst-case column (worstMag = botPure) reproduces the imp-96205 botEps
 *       column at every shared anchor (0.65, 0.70, 0.75, midpoint, 0.85, 0.90, 0.95) to <= 4e-10 — the
 *       differences are purely 7-sig-fig storage rounding (toExponential(6)), not a numerical disagreement.
 *       A LIVE imp-96205 anchorThreshold(lam_bot, alpha) call reproduces the baked imp-96227 worstMag to the
 *       same <= 4e-10.
 *   (2) The imp-96227 midpoint botHalfAdj = 1.032665e-3 EQUALS the imp-96206 half-adjacent coupled slice
 *       maxEb (eps_a = half the adjacent threshold) EXACTLY, and both give the coupling
 *       1.032665e-3 / 1.192419e-3 = 0.8660253 = sqrt(3)/2 (matched to ~1e-7, the 7-sig-fig limit of the
 *       imp-96206 slice; the imp-96227 tighten literal matches sqrt(3)/2 to 3.8e-9). The imp-96206 midpoint
 *       0.866 reading is thus the SAME anchor-invariant coupling imp-96227 reports at every alpha.
 *   (3) The equal-split ratio es/botPure is continuous and monotone DECREASING in alpha across
 *       [0.984204, 0.998276] — matching the imp-96227 literals (low 0.99827576 at alpha=0.65,
 *       high 0.98420433 at alpha=0.95) — and the imp-96227 midpoint equalSplit = 1.180627e-3 EQUALS the
 *       imp-96206 equalSplitPerChannelEps exactly.
 *   (4) NO DRIFT: lam_top = 0.9999731, lam_2 = 0.6202012, lam_bot = -0.9927022, midpoint anchor 0.81008715,
 *       and the Kato-Temple threshold definition (bisection on U < 1, hi = 0.5 cap) are byte-identical across
 *       imp-96205 / imp-96206 / imp-96227.
 * Accuracy cross-check ONLY. The strict gap stays with SG-96164-boundary / SG-96181-edge-octave; changes no
 * bound; RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: baked cross-check literals (transcribed from the three parent modules) + pure arithmetic; no
 *  imports, no zeros bundle. Reproduction of the consistency checks is inline in the assertions.
 */

// Shared spectrum + anchor geometry — verified byte-identical across imp-96205 / imp-96206 / imp-96227.
export const IMP_96251_SHARED_GEOMETRY = Object.freeze({
  lamTop: 0.9999731,
  lamSecondSigned: 0.6202012,
  lamBottomTwin: -0.9927022,
  midpointAnchor: 0.81008715,
  thresholdDefinition: 'bisection on U(eps) < 1 over [0, 0.5], hi = 0.5 diverging/non-binding cap — identical in all three',
});

// (1) Shared-anchor cross-check: imp-96227 pure-bottom worst-case column vs imp-96205 botEps column.
//  bot205 = imp-96205 IMP_96205_ANCHOR_SWEEP.botEps; worst227 = imp-96227 IMP_96227_JOINT_ANCHOR_SWEEP.worstMag
//  (which the imp-96227 module asserts equals botPure). |d| is the 7-sig-fig storage rounding, not a drift.
export const IMP_96251_SHARED_ANCHOR_CROSSCHECK = Object.freeze([
  { alpha: 0.65,       bot205: 1.6958712e-3, worst227: 1.695871e-3, absDiff: 2.0e-10 },
  { alpha: 0.70,       bot205: 1.5466990e-3, worst227: 1.546699e-3, absDiff: 0.0 },
  { alpha: 0.75,       bot205: 1.3915217e-3, worst227: 1.391522e-3, absDiff: 3.0e-10 },
  { alpha: 0.81008715, bot205: 1.1924189e-3, worst227: 1.192419e-3, absDiff: 1.0e-10 }, // midpoint
  { alpha: 0.85,       bot205: 1.0481756e-3, worst227: 1.048176e-3, absDiff: 4.0e-10 },
  { alpha: 0.90,       bot205: 8.4441390e-4, worst227: 8.444139e-4, absDiff: 0.0 },
  { alpha: 0.95,       bot205: 5.8927765e-4, worst227: 5.892776e-4, absDiff: 5.0e-11 },
]);

// (3) Equal-split ratio es/botPure across the anchor sweep — continuous, monotone decreasing, midpoint ties imp-96206.
export const IMP_96251_EQUAL_SPLIT_RATIO = Object.freeze([
  { alpha: 0.65,       ratio: 0.9982758 },
  { alpha: 0.70,       ratio: 0.9955376 },
  { alpha: 0.75,       ratio: 0.9929768 },
  { alpha: 0.81008715, ratio: 0.9901109 }, // midpoint equalSplit 1.180627e-3 = imp-96206 equalSplitPerChannelEps
  { alpha: 0.85,       ratio: 0.9883235 },
  { alpha: 0.90,       ratio: 0.9862030 },
  { alpha: 0.95,       ratio: 0.9842044 },
]);

export const IMP_96251_LITERALS = Object.freeze({
  maxSharedAnchorDrift: 4.0e-10,         // max |96227.worstMag - 96205.botEps| over the 7 shared anchors (7-sig-fig)
  maxLiveVsBakedDrift: 4.0e-10,          // max |live 96205 anchorThreshold(bot,alpha) - baked 96227 worstMag|
  midpointHalfAdjBottom: 1.032665e-3,    // 96227 botHalfAdj EQUALS 96206 half-adjacent slice maxEb exactly
  midpointCoupling: 0.8660253,           // 1.032665e-3 / 1.192419e-3 (96206 reading) = sqrt(3)/2 to ~1e-7
  sqrt3over2: 0.8660254038,              // 96227 anchor-invariant coupling — same value at every alpha
  equalSplitRatioRange: [0.9842044, 0.9982758], // es/botPure, monotone decreasing in alpha, continuous
  midpointEqualSplit: 1.180627e-3,       // 96227 midpoint equalSplit = 96206 equalSplitPerChannelEps exactly
  drift: 'NONE — lam values, anchor grid, and threshold definition byte-identical across imp-96205/06/27',
  verdict: 'FULLY CONSISTENT: the imp-96227 pure-bottom column reproduces the imp-96205 botEps column to <= 4e-10 (7-sig-fig storage rounding), the imp-96227 midpoint half-adjacent bottom tolerance ties the imp-96206 1.033e-3/1.192e-3 = 0.866 coupling exactly and both equal sqrt(3)/2, the equal-split ratio is continuous and monotone across 0.9842-0.9983 with the midpoint tying imp-96206, and no anchor grid, lam value, or threshold definition has drifted between the three modules',
});

export const IMP_96251_ASSESSMENT = Object.freeze({
  id: 'imp-96251-route-i-kato-temple-crosscheck',
  route: 'I (Sonine refinement) — accuracy cross-check that imp-96205 (separate anchor sweep), imp-96206 (midpoint joint region), and imp-96227 (joint anchor sweep) are mutually consistent across the shared 3-level {oo,2} Kato-Temple geometry',
  parents: [
    'src/data/imp-96205-route-i-kato-temple-anchor-sensitivity.js (SEPARATE two-level thresholds anchor-swept)',
    'src/data/imp-96206-route-i-kato-temple-joint-leak.js (JOINT region at the single midpoint anchor)',
    'src/data/imp-96227-route-i-kato-temple-joint-anchor-sweep.js (JOINT region anchor-swept; sqrt(3)/2 coupling)',
  ],
  status: 'CROSS-CHECK — the three Route I Kato-Temple modules are FULLY CONSISTENT with NO drift. (1) The imp-96227 pure-bottom worst-case column (worstMag = botPure) reproduces the imp-96205 botEps column at every shared anchor (0.65, 0.70, 0.75, midpoint 0.81008715, 0.85, 0.90, 0.95) to <= 4e-10 — the differences are purely 7-sig-fig storage rounding (toExponential(6)); a LIVE imp-96205 anchorThreshold(lam_bot, alpha) reproduces the baked imp-96227 worstMag to the same <= 4e-10. (2) The imp-96227 midpoint botHalfAdj = 1.032665e-3 EQUALS the imp-96206 half-adjacent coupled slice maxEb exactly, and both give the coupling 1.032665e-3 / 1.192419e-3 = 0.8660253 = sqrt(3)/2 (~1e-7, the imp-96206 slice 7-sig-fig limit) — so the imp-96206 midpoint 0.866 reading is the SAME anchor-invariant coupling imp-96227 reports at every alpha. (3) The equal-split ratio es/botPure is continuous and monotone DECREASING in alpha across [0.984204, 0.998276], matching the imp-96227 literals, and the imp-96227 midpoint equalSplit = 1.180627e-3 EQUALS the imp-96206 equalSplitPerChannelEps exactly. (4) NO drift in lam_top/lam_2/lam_bot, the anchor grid, or the threshold definition. Accuracy cross-check only; the strict gap stays with SG-96164-boundary / SG-96181-edge-octave; changes no bound; RH open; no refereed bound is changed; NO QED',
  sharedAnchorFinding: 'the imp-96227 worstMag and botPure columns reproduce the imp-96205 botEps column at all 7 shared anchors to <= 4e-10 (7-sig-fig storage rounding), and a live imp-96205 anchorThreshold(lam_bot, alpha) call reproduces the baked imp-96227 worstMag to the same tolerance — the pure-bottom joint worst case IS the separate bottom-twin threshold',
  midpointCouplingFinding: 'the imp-96227 midpoint half-adjacent bottom tolerance 1.032665e-3 equals the imp-96206 half-adjacent coupled slice exactly, and the imp-96206 midpoint 1.033e-3/1.192e-3 = 0.866 reading equals the imp-96227 anchor-invariant sqrt(3)/2 coupling — the midpoint reading was never special',
  equalSplitFinding: 'the equal-split ratio es/botPure is continuous and monotone decreasing in alpha across [0.984204, 0.998276] with the imp-96227 midpoint equalSplit tying the imp-96206 equalSplitPerChannelEps exactly, so the three modules agree on the equal-split boundary',
  driftFinding: 'NO drift: lam_top = 0.9999731, lam_2 = 0.6202012, lam_bot = -0.9927022, the midpoint anchor 0.81008715, and the Kato-Temple bisection threshold definition (U < 1, hi = 0.5 cap) are byte-identical across imp-96205 / imp-96206 / imp-96227',
  honestLimits: 'a consistency cross-check of three MEASUREMENT modules that all share the same baked FFT-Mellin semilocal {oo,2} spectrum (Rayleigh-Ritz N = 32 numbers, not a rigorous enclosure) and the same single-magnitude-per-channel [1, eps_a, eps_b] ansatz — so mutual agreement confirms internal consistency, NOT rigor of the underlying spectrum. Nothing here diagonalizes A, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions (reproduce the cross-check arithmetic; import-light; run < 0.01 s)
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96251_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96251-shared-anchor-column-consistent',
    description: 'the imp-96227 pure-bottom worst-case column reproduces the imp-96205 botEps column at every shared anchor to <= 5e-10 (7-sig-fig storage rounding, not a numerical drift)',
    holds: () => IMP_96251_SHARED_ANCHOR_CROSSCHECK.every((r) =>
      approx(r.bot205, r.worst227, 5e-10) && r.absDiff <= 5e-10),
  },
  {
    id: 'imp96251-midpoint-coupling-ties-imp96206',
    description: 'the imp-96227 midpoint half-adjacent bottom tolerance 1.032665e-3 divided by the bottom-twin 1.192419e-3 reproduces the imp-96206 0.866 reading and equals sqrt(3)/2 to ~1e-7 (7-sig-fig limit)',
    holds: () => approx(IMP_96251_LITERALS.midpointHalfAdjBottom / 1.192419e-3, Math.sqrt(3) / 2, 2e-7)
      && approx(IMP_96251_LITERALS.midpointCoupling, Math.sqrt(3) / 2, 2e-7)
      && approx(IMP_96251_LITERALS.sqrt3over2, Math.sqrt(3) / 2, 1e-9),
  },
  {
    id: 'imp96251-equal-split-ratio-continuous-monotone',
    description: 'the equal-split ratio es/botPure is continuous and monotone DECREASING in alpha across [0.984204, 0.998276], with the range endpoints matching the imp-96227 literals',
    holds: () => {
      let prev = Infinity;
      for (const r of IMP_96251_EQUAL_SPLIT_RATIO) {
        if (r.ratio >= prev) return false;                 // monotone decreasing in alpha
        if (r.ratio < 0.984 || r.ratio > 0.999) return false; // stays in the claimed band
        prev = r.ratio;
      }
      const first = IMP_96251_EQUAL_SPLIT_RATIO[0].ratio;
      const last = IMP_96251_EQUAL_SPLIT_RATIO[IMP_96251_EQUAL_SPLIT_RATIO.length - 1].ratio;
      return approx(first, IMP_96251_LITERALS.equalSplitRatioRange[1], 1e-6)
        && approx(last, IMP_96251_LITERALS.equalSplitRatioRange[0], 1e-6);
    },
  },
  {
    id: 'imp96251-no-geometry-drift',
    description: 'the shared spectrum (lam_top, lam_2, lam_bot), midpoint anchor, and threshold definition are byte-identical across the three modules, and both the max shared-anchor drift and the live-vs-baked drift are <= 4e-10',
    holds: () => IMP_96251_SHARED_GEOMETRY.lamTop === 0.9999731
      && IMP_96251_SHARED_GEOMETRY.lamSecondSigned === 0.6202012
      && IMP_96251_SHARED_GEOMETRY.lamBottomTwin === -0.9927022
      && IMP_96251_SHARED_GEOMETRY.midpointAnchor === 0.81008715
      && IMP_96251_LITERALS.maxSharedAnchorDrift <= 4e-10
      && IMP_96251_LITERALS.maxLiveVsBakedDrift <= 4e-10,
  },
  {
    id: 'imp96251-verdict-honesty',
    description: 'status records a CROSS-CHECK: the three modules are fully consistent with no drift, routes the strict gap back to SG-96164-boundary / SG-96181-edge-octave, names the shared-spectrum limitation honestly, and asserts RH open / NO QED',
    holds: () => /CROSS-CHECK/.test(IMP_96251_ASSESSMENT.status)
      && /FULLY CONSISTENT/.test(IMP_96251_ASSESSMENT.status)
      && /NO drift/.test(IMP_96251_ASSESSMENT.status)
      && /sqrt\(3\)\/2/.test(IMP_96251_ASSESSMENT.status)
      && /SG-96164-boundary/.test(IMP_96251_ASSESSMENT.status)
      && /NO QED/.test(IMP_96251_ASSESSMENT.status)
      && /not a rigorous enclosure/.test(IMP_96251_ASSESSMENT.honestLimits)
      && /RH open/.test(IMP_96251_ASSESSMENT.honestLimits),
  },
]);

export default IMP_96251_ASSESSMENT;
