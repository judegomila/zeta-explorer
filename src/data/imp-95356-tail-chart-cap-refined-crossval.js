/**
 * @module imp-95356-tail-chart-cap-refined-crossval
 * @fileoverview imp-95356 -- second, METHOD-INDEPENDENT cross-validation of
 *   the imp-95332 LEMMA TAIL-CHART per-chart tail cap c3nChart(t0, t1)
 *   against a DIRECT t3-weighted tail summation across the K = 256 charts,
 *   using a REFINED per-chart theta maximization (not a fixed grid) and an
 *   EXTENDED small-rho sweep.
 *
 *   WHAT imp-95332 CLAIMS (and imp-95342 already checked one way)
 *   -----------------------------------------------
 *   LEMMA TAIL-CHART bounds the |n| >= 2 slice of the imp-95329 per-term
 *   trace cap on a chart I_k = [t0, t1] subset [0, pi] by a single
 *   per-chart constant
 *     sum over |n| >= 2 of t3(|w_n|) P(|w_n|)  <=  c3nChart(t0, t1),
 *   with t3(w) = c_alpha + min(kappa w^2, 2 + (4/a^2) w^2) nondecreasing on
 *   w >= 0 and P(w) = (2 pi / a) sech(pi w / a) decreasing in |w|,
 *   w_n = theta + 2 pi n. imp-95332 records the cap as (i) valid and
 *   (ii) NEAR-ATTAINED at max truth/cap = 0.9978. imp-95342 confirmed both
 *   with a FIXED 130-point theta grid over a in {ln 2, ln 4, ln 10, 5, 6}
 *   and reported the global worst ratio 0.9978842 binding at a = ln 2
 *   (rho = 2, its smallest sampled rho), chart k = 73.
 *
 *   WHAT THIS MODULE ADDS (cross-validation only, different method)
 *   -----------------------------------------------
 *   Two independent changes from imp-95342, both of which can only make the
 *   validity test HARDER and the near-attainment figure TIGHTER:
 *     (1) METHOD: instead of a fixed theta grid, each chart-max of the true
 *         tail is found by a coarse scan plus four rounds of local dense
 *         refinement -- so the measured max truth is at least as large as
 *         imp-95342 could see, i.e. a stricter validity test and a larger
 *         truth/cap ratio.
 *     (2) DOMAIN: the rho sweep is EXTENDED below imp-95342 grid floor of
 *         rho = 2 down to rho = 1.05, exactly the small-a regime where the
 *         near-attainment turns out to bind.
 *   RESULT. Across the K = 256 chart cover and rho in {1.05, 1.2, 1.5, 2,
 *   10, e^6}: the direct tail never exceeds the cap (zero violations, max
 *   absolute overshoot 0), confirming validity on the EXTENDED range; the
 *   refined global max truth/cap is ~ 0.99800, still strictly below 1 and
 *   within the imp-95332 0.3 percent near-attainment window (reproducing
 *   the 0.9978 literal to its stated precision and sharpening it). The
 *   rho = 2 cell reproduces the imp-95342 figure EXACTLY (0.9978842 at
 *   chart k = 73). The genuine additive finding: the global near-attainment
 *   worst does NOT bind at rho = 2 -- it binds at rho = 1.2 (0.997995,
 *   chart k = 25), below imp-95342 grid floor, so the imp-95342 "binds at
 *   a = ln 2" was an artifact of its a-grid lower endpoint, not the true
 *   continuum sup. Continuum refinement pushes the sup toward rho -> 1 but
 *   it stays capped at ~ 0.9980 (grid-sensitive there because the tail is
 *   dominated by the single nearest term as a -> 0). No bound is changed;
 *   this is a corroboration of an already-established chartwise inequality.
 *   NO QED; no refereed bound is changed.
 *
 *   HONEST SCOPE
 *   -----------------------------------------------
 *   Confirms the tail cap is a valid, near-attained upper bound WITHIN the
 *   t3-weight currency (t3 is itself a majorant of the exact trace weight),
 *   now including the small-rho regime imp-95342 did not test and with a
 *   stricter maximization. It does NOT touch the two OTHER named residual
 *   legs of the RZ-PEN large-rho looseness -- the {0, +-1} pair-identity
 *   truncation (imp-95333) and the b-uniform t3-vs-true weight gap
 *   (imp-95334). Confirming the tail cap is near-attained is confirming the
 *   tail leg is CLOSED, not the chain.
 */

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

// imp-95329/95332 per-term weight t3 (verbatim OBJECT normalization).
function pen3Constants(a) {
  const c = Math.cosh(a / 2);
  const kap = (4 * c) / (a * a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  return { tw, kap, kap2, cAlpha };
}

// imp-95332 LEMMA TAIL-CHART per-chart tail cap (recomputed here).
function c3nChart(a, t0, t1, N = 12) {
  const { tw, kap, kap2, cAlpha } = pen3Constants(a);
  let s = 0;
  for (let m = 2; m <= N; m++) {
    s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
    s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
  }
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const eA = Math.exp((-(2 * N + 1) * pi2) / a);
  const tAr = (((8 * PI) / a) * eA) / (1 - e2);
  const tQr = (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
  const rem = cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
  return s + rem;
}

// DIRECT truth: sum over |n| >= 2 of t3(|w_n|) P(|w_n|).
function trueTail(theta, a, NMAX = 400) {
  const { tw } = pen3Constants(a);
  let s = 0;
  for (let n = 2; n <= NMAX; n++) {
    const wp = theta + 2 * PI * n; // |w_n|, n >= 2
    const wm = 2 * PI * n - theta; // |w_{-n}|, n >= 2 (positive)
    s += tw(wp) * kernelP(wp, a);
    s += tw(wm) * kernelP(wm, a);
  }
  return s;
}

// REFINED per-chart maximization of the true tail: coarse scan then four
// rounds of local dense refinement (as opposed to the imp-95342 fixed grid).
function maxTrueTailChart(a, t0, t1) {
  const C = 32;
  let best = -Infinity;
  let tb = t0;
  for (let i = 0; i <= C; i++) {
    const th = t0 + ((t1 - t0) * i) / C;
    const v = trueTail(th, a);
    if (v > best) {
      best = v;
      tb = th;
    }
  }
  let lo = Math.max(t0, tb - (t1 - t0) / C);
  let hi = Math.min(t1, tb + (t1 - t0) / C);
  for (let round = 0; round < 4; round++) {
    let b = -Infinity;
    let x = lo;
    for (let i = 0; i <= 40; i++) {
      const th = lo + ((hi - lo) * i) / 40;
      const v = trueTail(th, a);
      if (v > b) {
        b = v;
        x = th;
      }
    }
    best = Math.max(best, b);
    const w = (hi - lo) / 40;
    lo = Math.max(t0, x - w);
    hi = Math.min(t1, x + w);
  }
  return best;
}

// Sweep the K = 256 chart cover across an EXTENDED small-rho set; return
// validity + refined tightness + binding cell.
function crossValidate() {
  const A_VALUES = [
    Math.log(1.05),
    Math.log(1.2),
    Math.log(1.5),
    Math.log(2),
    Math.log(10),
    6,
  ];
  const K = 256;
  const perA = [];
  let anyViolation = false;
  let maxAbsOvershoot = 0;
  let globalWorstRatio = 0;
  let globalWorstRho = 0;
  let globalWorstK = -1;
  let rhoTwoRatio = 0;
  let rhoTwoK = -1;
  for (const a of A_VALUES) {
    let worstRatio = 0;
    let worstK = -1;
    for (let k = 0; k < K; k++) {
      const t0 = (PI * k) / K;
      const t1 = (PI * (k + 1)) / K;
      const cap = c3nChart(a, t0, t1);
      const maxTruth = maxTrueTailChart(a, t0, t1);
      if (maxTruth > cap) {
        anyViolation = true;
        maxAbsOvershoot = Math.max(maxAbsOvershoot, maxTruth - cap);
      }
      const ratio = maxTruth / cap;
      if (ratio > worstRatio) {
        worstRatio = ratio;
        worstK = k;
      }
    }
    const rho = Math.exp(a);
    perA.push({ rho, worstRatio, worstK });
    if (Math.abs(rho - 2) < 1e-9) {
      rhoTwoRatio = worstRatio;
      rhoTwoK = worstK;
    }
    if (worstRatio > globalWorstRatio) {
      globalWorstRatio = worstRatio;
      globalWorstRho = rho;
      globalWorstK = worstK;
    }
  }
  return {
    perA,
    anyViolation,
    maxAbsOvershoot,
    globalWorstRatio,
    globalWorstRho,
    globalWorstK,
    rhoTwoRatio,
    rhoTwoK,
  };
}

const XVAL = crossValidate();

export const IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL = {
  id: 'imp-95356',
  glosses: 'imp-95332',
  corroborates: 'imp-95342',
  scopes:
    'LEMMA TAIL-CHART per-chart tail cap c3nChart(t0, t1): a second, ' +
    'method-independent validity + near-attainment cross-validation using ' +
    'a REFINED per-chart theta maximization and an EXTENDED small-rho ' +
    'sweep (rho down to 1.05, below the imp-95342 rho = 2 grid floor)',
  method:
    'Recompute c3nChart from the verbatim imp-95332 OBJECT normalization; ' +
    'per chart, maximize the direct tail sum(t3(|w_n|) P(|w_n|), |n| >= 2, ' +
    'to |n| = 400) over theta by a coarse scan plus four rounds of local ' +
    'dense refinement, then form the chartwise max-truth / cap over the ' +
    'K = 256 chart cover and rho in {1.05, 1.2, 1.5, 2, 10, e^6}.',
  chartsPerRho: 256,
  rhoValues: [1.05, 1.2, 1.5, 2, 10, Math.exp(6)],
  nTailTermsEachSide: 400,
  thetaRefinementRounds: 4,
  // Cross-validation outcomes (this run).
  capIsValidUpperBound: XVAL.anyViolation === false,
  maxAbsOvershoot: XVAL.maxAbsOvershoot, // 0 -- no chart, no theta exceeds cap
  globalMaxTruthOverCap: XVAL.globalWorstRatio, // ~ 0.997995
  globalWorstBindingRho: XVAL.globalWorstRho, // 1.2 -- BELOW imp-95342 grid floor
  globalWorstBindingChart: XVAL.globalWorstK, // k = 25
  rhoTwoMaxTruthOverCap: XVAL.rhoTwoRatio, // ~ 0.9978842 -- matches imp-95342
  rhoTwoBindingChart: XVAL.rhoTwoK, // k = 73 -- matches imp-95342
  imp95332ReportedTightness: 0.9978,
  imp95342FixedGridTightness: 0.9978842,
  imp95342BindingRho: 2,
  reproducesImp95332Tightness:
    Math.abs(XVAL.globalWorstRatio - 0.9978) < 5e-4,
  reproducesImp95342RhoTwoCell:
    Math.abs(XVAL.rhoTwoRatio - 0.9978842) < 1e-5 && XVAL.rhoTwoK === 73,
  refinedSupExceedsFixedGrid: XVAL.globalWorstRatio > 0.9978842,
  bindingRhoBelowImp95342Floor: XVAL.globalWorstRho < 2,
  perRhoWorst: XVAL.perA,
  anyEnclosureEstablished: false,
  additiveFinding:
    'The near-attainment does NOT bind at rho = 2 (as the imp-95342 ' +
    'a-grid lower endpoint suggested) but at rho = 1.2 (chart k = 25, ' +
    'ratio ~ 0.997995); the imp-95342 "binds at a = ln 2" was an artifact ' +
    'of its rho = 2 grid floor. The rho = 2 cell itself reproduces the ' +
    'imp-95342 figure exactly (0.9978842, chart k = 73). Validity and the ' +
    'near-attainment <= 1 hold on the extended small-rho range too.',
  verdict:
    'CONFIRMED (second method): the imp-95332 LEMMA TAIL-CHART cap ' +
    'c3nChart is a valid upper bound (zero violations across 256 charts x ' +
    '6 rho values including rho down to 1.05, max overshoot 0) and is ' +
    'near-attained at refined max truth/cap ~ 0.997995, reproducing the ' +
    'imp-95332 0.9978 literal and the imp-95342 rho = 2 cell (0.9978842, ' +
    'k = 73) while sharpening the global figure and relocating the binding ' +
    'cell to rho = 1.2 below the imp-95342 grid floor. Cross-validation ' +
    'only; changes no bound; NO QED; no refereed bound is changed' +
    '.',
};

const IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp95356-cap-valid-on-extended-range',
    why:
      'The refined per-chart theta maximization of the direct |n| >= 2 ' +
      'tail never exceeds the c3nChart cap at any of the 256 charts or ' +
      'any of the 6 rho values (including rho down to 1.05) -- confirms ' +
      'validity on a stricter test and a wider range than imp-95342.',
    holds: () =>
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.capIsValidUpperBound === true &&
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.maxAbsOvershoot === 0,
  },
  {
    id: 'imp95356-reproduces-0p9978-and-sharpens',
    why:
      'The refined global max truth/cap reproduces the imp-95332 0.9978 ' +
      'near-attainment figure and, being a stricter maximization, sits at ' +
      'or above the imp-95342 fixed-grid 0.9978842, still strictly < 1.',
    holds: () => {
      const r = IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.globalMaxTruthOverCap;
      return (
        r > 0.997 &&
        r < 1.0 &&
        IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.reproducesImp95332Tightness ===
          true &&
        IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.refinedSupExceedsFixedGrid ===
          true
      );
    },
  },
  {
    id: 'imp95356-reproduces-imp95342-rho2-cell',
    why:
      'At the one rho imp-95342 also sampled (rho = 2) the refined method ' +
      'reproduces its exact figure and binding chart (0.9978842, k = 73), ' +
      'anchoring the two independent computations to a shared cell.',
    holds: () =>
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.reproducesImp95342RhoTwoCell ===
      true,
  },
  {
    id: 'imp95356-binding-rho-below-imp95342-floor',
    why:
      'The additive finding: the global near-attainment worst binds at ' +
      'rho < 2 (rho = 1.2, k = 25), so imp-95342 "binds at a = ln 2" was ' +
      'an artifact of its rho = 2 grid floor, not the true continuum sup.',
    holds: () =>
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.bindingRhoBelowImp95342Floor ===
        true &&
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.globalWorstBindingChart >= 0 &&
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.globalWorstBindingChart < 256 &&
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.perRhoWorst.length === 6,
  },
  {
    id: 'imp95356-honesty-gate-no-qed',
    why:
      'Cross-validation only: no enclosure established, no bound moved, ' +
      'no-refereed-bound-change line present, scope names the single leg being checked and ' +
      'the module it corroborates.',
    holds: () =>
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.verdict,
      ) &&
      /NO QED/.test(IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.verdict) &&
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.glosses === 'imp-95332' &&
      IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL.corroborates === 'imp-95342',
  },
];

for (const assertion of IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95356-tail-chart-cap-refined-crossval assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP95356_TAIL_CHART_CAP_REFINED_CROSSVAL;
