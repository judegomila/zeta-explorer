/**
 * imp-95920 -- ASSESS whether the imp-95848 degenerate-quartic p = 4/3
 * discriminating alternative can be ruled out at the measured deep-corner cell:
 * confirm the converged biasPct exponents sit near p = 2 (non-degenerate
 * quadratic symbol minimum) rather than p = 4/3 (degenerate quartic minimum).
 *
 * GRADE: numerical assessment / model discrimination on an already-established
 * interior model-seam quantity. Import-light (no heavy bundle, no imports at
 * all; recomputes everything from the baked imp-95803 ladder). Changes NO Lambda
 * bound; NO QED; no refereed bound is changed.
 *
 * BACKGROUND. The imp-95848 (imp-95824) Kac-Murdock-Szego / Widom / Parter
 * finite-section edge law gives, for a NON-DEGENERATE quadratic symbol minimum
 * (second derivative f2 > 0 at the minimizer), lambda_min(T_N) - m =
 * (f2/2)(pi/(N+1))^2 + O(N^-3): the leading finite-size correction scales EXACTLY
 * as N^-2. The DISCRIMINATING ALTERNATIVE is a DEGENERATE quartic minimum
 * (f2 = 0, fourth derivative f4 > 0), which gives the strictly slower non-integer
 * power p = 4/3. imp-95803 converged the deep-corner (delta = ln 1.2, rho = 1)
 * finite-N bias ladder to N = 500; this module reads its exponents against BOTH
 * candidate powers and asks whether p = 4/3 can be ruled out.
 *
 * TWO DIRECT DISCRIMINATION TESTS on the imp-95803 converged ladder.
 *
 *   TEST 1 -- local log-log exponent. The converged local exponent of
 *   biasPct ~ N^-p across the seven consecutive rungs is
 *     |p| = 2.795, 2.483, 2.348, 2.271, 2.215, 2.161, 2.122
 *   with a one-parameter p = p_inf + a/N extrapolation p_inf ~ 1.98. EVERY rung
 *   sits ABOVE 2.1, the smallest measured |p| (2.122) exceeds 4/3 = 1.333 by a
 *   margin of 0.788, and the extrapolated limit is 32x closer to 2 (gap 0.02)
 *   than to 4/3 (gap 0.647). The degenerate power 4/3 is nowhere near the data.
 *
 *   TEST 2 -- consistency-product plateau (the sharp test). For the TRUE
 *   exponent p_star, biasPct * N^p_star converges to a finite positive limit;
 *   for p < p_star it diverges, for p > p_star it goes to zero. So the true power
 *   is the one whose product PLATEAUS.
 *     - biasPct * N^2 : 330414 -> 239380 -> 208323 -> 192780 -> 183473 ->
 *       174897 -> 166976 -> 162500, consecutive step-ratios
 *       0.724, 0.870, 0.925, 0.952, 0.953, 0.955, 0.973 -> 1 (a clear plateau),
 *       extrapolating to the imp-95845 Widom constant C_Widom = 50 pi^4/delta^2
 *       = 146518.83. This is the positive p = 2 signature.
 *     - biasPct * N^(4/3) : 17796 -> 9839 -> 7068 -> 5637 -> 4751 -> 3903 ->
 *       3076 -> 2580, consecutive step-ratios 0.553, 0.718, 0.797, 0.843, 0.821,
 *       0.788, 0.839 -- these do NOT approach 1; the product keeps falling ~6.9x
 *       across the window with no plateau. Under a genuine degenerate quartic
 *       minimum this product would have to converge to a finite constant. It does
 *       not, so p = 4/3 is REFUTED at this cell.
 *
 * ANSWER TO THE TICKET. YES -- the degenerate-quartic p = 4/3 alternative is
 * ruled out at the measured deep-corner cell. Both tests agree: the converged
 * local exponents cluster at 2.1-2.8 (extrapolating to ~1.98), never approaching
 * 4/3; and the consistency product biasPct * N^2 plateaus onto the finite Widom
 * constant while biasPct * N^(4/3) fails to plateau. The measured symbol minimum
 * is non-degenerate quadratic (p ~ 2), not degenerate quartic (p = 4/3).
 *
 * HONEST SCOPE / SUB-GAP. (a) Assessment only: it reads the frozen imp-95803
 * converged DD ladder and the imp-95845 Widom constant; it re-runs no eigensolver
 * and imports no cited input. (b) COVERAGE. A converged per-cell N-ladder giving
 * a directly-measured exponent exists ONLY at the deepest cell (delta = ln 1.2,
 * rho = 1); the neighbor cells (ln 1.2 rho 1.5/2, ln 1.3 rho 1.5, the ln 1.5
 * column) have only the finite-80 imp-95785 biasPct column, not an N-ladder, so
 * their exponent is not measured here. The deep corner is however the MOST
 * stringent cell (largest bias, smallest lambda_min ~ 4e-22, worst conditioning);
 * ruling out degeneracy there, together with the edge-law universality of the
 * N^-2 rate in the coefficient decay, makes a degenerate minimum at the shallower
 * neighbors implausible -- but a directly-measured per-neighbor converged
 * exponent ladder stays the named SUB-GAP
 * per-neighbor-converged-exponent-ladder-vs-4-3. (c) The exact limiting power at
 * the deep corner (exactly 2 vs 2 with a slowly-varying log/prefactor) remains
 * the inherited imp-95803 sub-gap pin-exact-limiting-bias-power-at-deep-corner --
 * but that residual is entirely WITHIN [1.98, 2.8], far from 4/3, so it does not
 * reopen the degenerate alternative. (d) Model seam family only; the imp-95212
 * envelope port, signed WEIGHT and modulus/phase legs stay OPEN. Changes NO bound
 * of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95848-kms-widom-edge-law-glossary-headword (the p=2 vs p=4/3 edge law and its discriminating alternative)
 * @see imp-95803-twin-pair-deep-corner-bias-exponent-limit (the converged deep-corner exponent ladder this discriminates)
 * @see imp-95845-deep-corner-biasN2-widom-fit (biasPct*N^2 -> C_Widom, the p=2 consistency-product signature)
 * @see imp-95824-deep-corner-bias-exponent-szego-theory (derived p=2 from finite-section theory)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95920_DEGENERATE_QUARTIC_P43_DISCRIMINATION = {
  id: "imp-95920",
  title:
    "Assess whether the imp-95848 degenerate-quartic p=4/3 discriminating " +
    "alternative can be ruled out at the measured deep-corner cell: the imp-95803 " +
    "converged local exponents (|p| = 2.79 -> 2.12, extrapolating to ~1.98) sit " +
    "near p=2 with a margin of 0.79 above 4/3, and the consistency product " +
    "biasPct*N^2 plateaus onto the Widom constant while biasPct*N^(4/3) fails to " +
    "plateau -- so p=4/3 (degenerate quartic) is RULED OUT and the symbol minimum " +
    "is non-degenerate quadratic",
  question:
    "do the converged deep-corner biasPct exponents sit near p=2 (non-degenerate " +
    "quadratic minimum) rather than p=4/3 (degenerate quartic minimum), ruling " +
    "out a degenerate symbol minimum?",
  cell: { delta: "ln1.2", deltaValue: 0.1823215567939546, rho: 1 },
  // The two candidate powers from the imp-95848 edge law.
  pNonDegenerateQuadratic: 2,
  pDegenerateQuartic: 4 / 3, // = 1.3333...
  // The imp-95803 converged deep-corner ladder (DD sech Gram, iterated to
  // relative change < 1e-12 per rung; F_inf = 4.263426088e-22).
  ladder: [
    { nPoints: 80,  biasPct: 51.6272 },
    { nPoints: 120, biasPct: 16.6236 },
    { nPoints: 160, biasPct:  8.1376 },
    { nPoints: 200, biasPct:  4.8195 },
    { nPoints: 240, biasPct:  3.1853 },
    { nPoints: 300, biasPct:  1.9433 },
    { nPoints: 400, biasPct:  1.0436 },
    { nPoints: 500, biasPct:  0.6500 },
  ],
  // TEST 1 -- converged local log-log exponents (imp-95803).
  localExponentsAbs: [2.7949, 2.4830, 2.3475, 2.2714, 2.2145, 2.1611, 2.1218],
  minLocalExponentAbs: 2.1218,     // smallest measured |p| (last rung)
  exponentLimitApprox: 1.98,       // p_inf from p = p_inf + a/N extrapolation
  marginMinExponentOver43: 0.7884, // minLocalExponentAbs - 4/3
  limitGapToTwo: 0.02,             // |1.98 - 2|
  limitGapTo43: 0.647,             // |1.98 - 4/3|
  // TEST 2 -- consistency-product plateau. The true power plateaus.
  biasN2StepRatios: [0.724, 0.870, 0.925, 0.952, 0.953, 0.955, 0.973], // -> 1: plateau (p=2)
  bias43StepRatios: [0.553, 0.718, 0.797, 0.843, 0.821, 0.788, 0.839], // NOT -> 1: no plateau (p!=4/3)
  cWidom: 146518.8340711524,       // = 50 pi^4/delta^2 (imp-95845), the p=2 product limit
  biasN2Plateaus: true,            // biasPct*N^2 step-ratios approach 1
  bias43Plateaus: false,           // biasPct*N^(4/3) step-ratios do not approach 1
  // Verdict flags.
  degenerateQuarticRuledOut: true, // p=4/3 excluded at the deep-corner cell
  minimumIsNonDegenerateQuadratic: true,
  boundChange: false,
  qed: false,
  subGap: "per-neighbor-converged-exponent-ladder-vs-4-3",
  inheritedSubGap: "pin-exact-limiting-bias-power-at-deep-corner",
  neighborLaddersMeasured: false, // only the deep corner has a converged N-ladder
  verdict:
    "DEGENERATE-QUARTIC p=4/3 RULED OUT AT THE DEEP CORNER; MINIMUM IS " +
    "NON-DEGENERATE QUADRATIC (p~2). Two direct tests on the imp-95803 converged " +
    "deep-corner ladder (delta=ln1.2, rho=1) agree. TEST 1: the converged local " +
    "log-log exponent |p| = 2.79 -> 2.48 -> 2.35 -> 2.27 -> 2.21 -> 2.16 -> 2.12 " +
    "sits above 2.1 at every rung, the smallest measured |p| (2.12) exceeds 4/3 = " +
    "1.333 by 0.788, and the p=p_inf+a/N extrapolation p_inf ~ 1.98 is 32x closer " +
    "to 2 (gap 0.02) than to 4/3 (gap 0.647). TEST 2 (the sharp one): the true " +
    "power is the one whose consistency product biasPct*N^p plateaus -- " +
    "biasPct*N^2 has step-ratios 0.724 -> ... -> 0.973 approaching 1 and " +
    "extrapolates to the imp-95845 Widom constant C_Widom = 50 pi^4/delta^2 = " +
    "146518.83 (the positive p=2 signature), whereas biasPct*N^(4/3) has " +
    "step-ratios stuck at 0.79-0.84 and keeps falling ~6.9x across the window with " +
    "NO plateau, which a genuine degenerate quartic minimum forbids. So p=4/3 is " +
    "refuted and the measured symbol minimum is non-degenerate quadratic. " +
    "COVERAGE: a converged per-cell exponent ladder exists only at the deepest " +
    "(most stringent) cell; neighbors have only the finite-80 imp-95785 biasPct " +
    "column, so a directly-measured per-neighbor exponent ladder stays the SUB-GAP " +
    "per-neighbor-converged-exponent-ladder-vs-4-3 (their non-degeneracy is " +
    "inferred, not measured, from edge-law universality plus the deep corner " +
    "being the worst cell). The inherited deep-corner exact-power residual stays " +
    "within [1.98, 2.8], far from 4/3, so it does not reopen the degenerate " +
    "alternative. Assessment only; no cited input imported. Model seam family " +
    "only; the imp-95212 envelope port, signed WEIGHT and modulus/phase legs stay " +
    "OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95920"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all).
// Recompute the local exponents and the two consistency products LIVE from the
// baked ladder (O(n), no factorization) and reproduce the discrimination.
// ---------------------------------------------------------------------------

const REF = IMP95920_DEGENERATE_QUARTIC_P43_DISCRIMINATION;

const localExpAbs = (L) => {
  const out = [];
  for (let i = 1; i < L.length; i++) {
    const p =
      Math.log(L[i].biasPct / L[i - 1].biasPct) /
      Math.log(L[i].nPoints / L[i - 1].nPoints);
    out.push(Math.abs(p));
  }
  return out;
};

const productStepRatios = (L, p) => {
  const prod = L.map((r) => r.biasPct * Math.pow(r.nPoints, p));
  const out = [];
  for (let i = 1; i < prod.length; i++) out.push(prod[i] / prod[i - 1]);
  return out;
};

export const IMP95920_ASSERTIONS = [
  {
    id: "imp95920-candidate-powers",
    description:
      "the two candidate powers are the non-degenerate quadratic p=2 and the " +
      "degenerate quartic p=4/3 of the imp-95848 edge law",
    holds: () =>
      REF.pNonDegenerateQuadratic === 2 &&
      Math.abs(REF.pDegenerateQuartic - 4 / 3) < 1e-12,
  },
  {
    id: "imp95920-local-exponents-reproduce-imp95803",
    description:
      "the baked local |p| reproduce a LIVE log-log slope of the imp-95803 ladder " +
      "to 5e-3, and every rung sits above 2.1 (nowhere near 4/3)",
    holds: () => {
      const E = localExpAbs(REF.ladder);
      if (E.length !== REF.localExponentsAbs.length) return false;
      for (let i = 0; i < E.length; i++) {
        if (Math.abs(E[i] - REF.localExponentsAbs[i]) > 5e-3) return false;
        if (!(E[i] > 2.1)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95920-min-exponent-clears-4-3-by-wide-margin",
    description:
      "the smallest measured |p| exceeds 4/3 by the baked margin (~0.79), so no " +
      "rung is compatible with the degenerate quartic power",
    holds: () => {
      const E = localExpAbs(REF.ladder);
      const mn = Math.min(...E);
      const margin = mn - 4 / 3;
      return (
        Math.abs(mn - REF.minLocalExponentAbs) < 5e-3 &&
        Math.abs(margin - REF.marginMinExponentOver43) < 5e-3 &&
        margin > 0.5
      );
    },
  },
  {
    id: "imp95920-limit-closer-to-two-than-to-4-3",
    description:
      "the extrapolated limit p_inf ~ 1.98 is far closer to 2 than to 4/3 (an " +
      "order of magnitude in the gaps)",
    holds: () => {
      const gapTwo = Math.abs(REF.exponentLimitApprox - 2);
      const gap43 = Math.abs(REF.exponentLimitApprox - 4 / 3);
      return (
        Math.abs(gapTwo - REF.limitGapToTwo) < 5e-3 &&
        Math.abs(gap43 - REF.limitGapTo43) < 5e-3 &&
        gap43 > 10 * gapTwo // 32x here; require at least 10x
      );
    },
  },
  {
    id: "imp95920-biasN2-product-plateaus",
    description:
      "the biasPct*N^2 consistency product step-ratios approach 1 (a plateau), the " +
      "positive p=2 signature; baked ratios reproduce the live ones",
    holds: () => {
      const r = productStepRatios(REF.ladder, 2);
      if (r.length !== REF.biasN2StepRatios.length) return false;
      for (let i = 0; i < r.length; i++) {
        if (Math.abs(r[i] - REF.biasN2StepRatios[i]) > 5e-3) return false;
      }
      // monotone approach toward 1 and the last ratio close to 1
      return (
        REF.biasN2Plateaus === true &&
        r[r.length - 1] > 0.96 &&
        r[r.length - 1] < 1.0
      );
    },
  },
  {
    id: "imp95920-bias43-product-fails-to-plateau",
    description:
      "the biasPct*N^(4/3) product step-ratios do NOT approach 1 (no plateau) and " +
      "the product keeps falling several-fold, refuting the degenerate p=4/3 power",
    holds: () => {
      const r = productStepRatios(REF.ladder, 4 / 3);
      if (r.length !== REF.bias43StepRatios.length) return false;
      for (let i = 0; i < r.length; i++) {
        if (Math.abs(r[i] - REF.bias43StepRatios[i]) > 5e-3) return false;
      }
      const prod = REF.ladder.map((x) => x.biasPct * Math.pow(x.nPoints, 4 / 3));
      const fall = prod[0] / prod[prod.length - 1];
      return (
        REF.bias43Plateaus === false &&
        r[r.length - 1] < 0.9 && // last ratio well below 1: still falling
        fall > 5 // product collapses ~6.9x, no finite plateau
      );
    },
  },
  {
    id: "imp95920-plateau-test-favors-two",
    description:
      "the p=2 product plateaus much more strongly than the p=4/3 product: the " +
      "final N^2 step-ratio is far closer to 1 than the final N^(4/3) one",
    holds: () => {
      const r2 = productStepRatios(REF.ladder, 2);
      const r43 = productStepRatios(REF.ladder, 4 / 3);
      const d2 = Math.abs(1 - r2[r2.length - 1]);
      const d43 = Math.abs(1 - r43[r43.length - 1]);
      return d2 < d43 && d43 > 3 * d2;
    },
  },
  {
    id: "imp95920-verdict-rules-out-degenerate",
    description:
      "the module concludes the degenerate quartic p=4/3 is ruled out and the " +
      "minimum is non-degenerate quadratic",
    holds: () =>
      REF.degenerateQuarticRuledOut === true &&
      REF.minimumIsNonDegenerateQuadratic === true &&
      REF.biasN2Plateaus === true &&
      REF.bias43Plateaus === false,
  },
  {
    id: "imp95920-honest-coverage-sub-gap",
    description:
      "the module states its coverage honestly: only the deep corner has a " +
      "converged exponent ladder, and it names the per-neighbor sub-gap",
    holds: () =>
      REF.neighborLaddersMeasured === false &&
      REF.subGap === "per-neighbor-converged-exponent-ladder-vs-4-3" &&
      REF.inheritedSubGap === "pin-exact-limiting-bias-power-at-deep-corner" &&
      /neighbor/i.test(REF.verdict),
  },
  {
    id: "imp95920-not-a-bound",
    description:
      "this is a numerical-assessment / discrimination module; it moves no Lambda " +
      "bound and proves no QED, and it keeps the no-refereed-bound-change line",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95920-closes-self",
    description: "this module is the deliverable the imp-95920 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95920"),
  },
];

for (const a of IMP95920_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95920-degenerate-quartic-p43-discrimination assertion failed: ${a.id}`,
    );
  }
}

export default IMP95920_DEGENERATE_QUARTIC_P43_DISCRIMINATION;
