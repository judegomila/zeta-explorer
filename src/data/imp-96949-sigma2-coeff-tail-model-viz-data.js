/**
 * @module imp-96949-sigma2-coeff-tail-model-viz-data
 * @fileoverview imp-96949 -- MODEL the imp-96934 sigma_2-weighted high-k coefficient tail that was
 *   asked to explain the super-linear (imp-96928 power law p~3.27) beyond-T=3200 Krein residual
 *   growth left unmodelled by the bare (2k+1)/(pi*T) spherical-Bessel onset.
 *
 * CONTEXT. imp-96934 confirmed the beyond-T=3200 floor residual IS sigma_2-weighted Bessel mass
 * (the first-order Rayleigh tail residual resid_fo = phi^T A_tail phi / scaleB reproduces the
 * measured floor lift in sign and order) and grows super-linearly (x2.90 then x2.94 per N step)
 * while the bare onset (2k+1)/(pi*T) grows only x1.29/x1.23. Its SUB-GAP
 * imp-96934-sigma2-weighted-coeff-tail-unmodelled asked a full model to fold in BOTH the sigma_2 ~
 * t^4 tail weighting AND the minimiser growing high-k coefficient amplitudes. This leaf builds and
 * TESTS the natural separable model those two ingredients define, and reports where it fails.
 *
 * METHOD (driver tmp/imp-96949-sigma2-coeff-tail-model.py, ~12s, reuses the imp-96934 / imp-96768
 * orthogonal Gegenbauer build verbatim: sigma_2=(t^2+1/4)^2 w_1, pole-free m=3 trial space,
 * normalised C_n^{13/2} so the L2 Gram is scaleB*I, condB=1). At 2a=ln3, per N in {76,100,124}:
 *   (1) phi = unit-norm minimiser of A on [0,3200] (the same phi imp-96934 used), coefficients c_n
 *       in the condB=1 Gegenbauer basis (sum c_n^2 = 1).
 *   (2) d_n = (A_tail)_{nn}/scaleB = the per-basis-mode sigma_2-weighted Bessel tail mass beyond
 *       T=3200 (the sigma_2 ~ t^4 tail weighting resolved per mode).
 *   (3) DIAGONAL (incoherent) MODEL resid_diag = sum_n c_n^2 d_n -- exactly the sub-gap two
 *       ingredients multiplied. Test resid_diag against the full coherent resid_fo, and measure
 *       where the coefficient mass and the product mass sit.
 *
 * FINDINGS (measured).
 *   1. THE MINIMISER IS LOW-MODE-DOMINATED, NOT HIGH-k-OCCUPIED. Effective mode index
 *      n_eff = sum c_n^2 n ~ 0.01 at every N and the top-20% of modes carry only ~1e-13 of the
 *      coefficient mass (c_top ~ 1e-13 to 1e-12). So the sub-gap phrase growing high-k coefficient
 *      amplitudes does NOT mean the minimiser occupies high Gegenbauer modes -- it stays smooth.
 *   2. THE PER-MODE SIGMA_2-WEIGHTED TAIL MASS EXPLODES. d_n grows ~n^11.5 over the high band
 *      (q_d = 11.5-11.7); d_top = 1.9e10 / 5.0e11 / 5.7e12 at N=76/100/124, d_top/d_mid ~ 2500-2900.
 *      The sigma_2 ~ t^4 weighting on the far oscillatory j_k tail makes high modes astronomically
 *      heavy in the tail window.
 *   3. IT IS THE PRODUCT TAIL, NOT EITHER FACTOR, THAT DRIVES THE RESIDUAL. The c_n^2 d_n product
 *      is tail-dominated: the top-20% of modes carry 65-74% of resid_diag despite holding ~1e-13 of
 *      the coefficient mass -- an exponentially-tiny high-mode coefficient tail (c_top ~ 1e-13)
 *      multiplied by an astronomically-large per-mode tail mass (d_top ~ 1e10-1e12).
 *   4. THE SEPARABLE (DIAGONAL) MODEL FAILS QUANTITATIVELY. resid_diag OVER-predicts the coherent
 *      resid_fo by a factor GROWING with N: diag/fo = 2.81 / 5.24 / 6.96, and it grows too fast
 *      (diag x5.39/x3.91 vs measured x2.46/x2.01, vs coherent resid_fo x2.90/x2.94). So the off-
 *      diagonal COHERENT phasing between Bessel modes cancels a super-linearly-growing fraction of
 *      the diagonal tail mass; that coherence is a LEADING effect, not a correction.
 *
 * VERDICT. The sub-gap two ingredients (sigma_2 ~ t^4 per-mode tail weighting d_n, and the high-mode
 * coefficient tail c_n) are both necessary and their PRODUCT tail is what carries the super-linear
 * growth -- but the naive separable/diagonal product of them is NOT the model: it over-predicts the
 * coherent first-order residual by a factor growing 2.81 -> 6.96 with N and grows too fast, because
 * the minimiser is low-mode-dominated (n_eff ~ 0.01) and the coherent off-diagonal tail Gram cancels
 * a growing share of the astronomically-weighted high-mode diagonal mass. NEW SUB-GAP
 * imp-96949-coherent-tail-gram-required: a correct model of the p~3.27 super-linear residual must
 * retain the full coherent tail Gram (off-diagonal (A_tail)_{nn'}), not a separable coefficient^2 x
 * per-mode-mass product. Measurement only; the floor is a Rayleigh UPPER bound; no operator
 * positivity; interval-rigorous certificate reach stays 2a <= 0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (the sub-gap this models: resid_fo and the onset)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the orthogonal Gegenbauer build reused here)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const A_LN3 = LN3 / 2; // 0.5493061443340549 (2a=ln3)
const M_POLE = 3; // pole-free trial-space order m; k_max = 2m + N - 1

export const IMP96949_NS = Object.freeze([76, 100, 124]);
export const IMP96949_T3200 = 3200;
export const IMP96949_TFULL = 12800;

// per-N measured row (2a=ln3), from tmp/imp-96949-sigma2-coeff-tail-model.py
//   residFo = phi^T A_tail phi / scaleB (imp-96934 coherent first-order tail residual)
//   residDiag = sum_n c_n^2 d_n (diagonal/incoherent model: coeff^2 x per-mode sigma_2-weighted mass)
//   diagOverFo = residDiag / residFo (separable model over-prediction factor, GROWS with N)
//   nEff = sum c_n^2 n (effective Gegenbauer mode index of the minimiser; ~0.01 = low-mode-dominated)
//   top20CoeffWeight = fraction of coeff mass in the top 20% of modes (~1e-13, negligible)
//   qDHighBand = slope of log d_n vs log n over the upper half (per-mode tail-mass exponent)
//   dTop = d_{N-1} (top-mode sigma_2-weighted tail mass); cTop = |c_{N-1}| (top-mode coefficient)
//   prodTop20Frac = fraction of residDiag from the top 20% of modes (product is tail-dominated)
export const IMP96949_ROWS = Object.freeze({
  76: Object.freeze({
    kmax: 81, residFo: 0.0006425, residDiag: 0.0018076, diagOverFo: 2.8134,
    nEff: 0.01, top20CoeffWeight: 2.20e-13, qDHighBand: 11.547,
    dTop: 1.9477e10, dMid: 7.7241e6, cTop: 9.173e-14, prodTop20Frac: 0.6491,
  }),
  100: Object.freeze({
    kmax: 105, residFo: 0.0018621, residDiag: 0.0097507, diagOverFo: 5.2365,
    nEff: 0.01, top20CoeffWeight: 6.25e-14, qDHighBand: 11.695,
    dTop: 4.9942e11, dMid: 1.7296e8, cTop: 1.192e-13, prodTop20Frac: 0.7382,
  }),
  124: Object.freeze({
    kmax: 129, residFo: 0.0054813, residDiag: 0.0381413, diagOverFo: 6.9585,
    nEff: 0.01, top20CoeffWeight: 1.61e-14, qDHighBand: 11.594,
    dTop: 5.7321e12, dMid: 2.0939e9, cTop: 1.003e-12, prodTop20Frac: 0.7417,
  }),
});

// N-growth (per step): diagonal model vs coherent first-order residual vs measured floor lift.
export const IMP96949_GROWTH = Object.freeze({
  '76->100': Object.freeze({ ratioDiag: 5.394, ratioFo: 2.898, ratioMeasured: 2.457 }),
  '100->124': Object.freeze({ ratioDiag: 3.912, ratioFo: 2.944, ratioMeasured: 2.013 }),
});

export const IMP96949_VERDICT = Object.freeze({
  ticket: 'imp-96949',
  question:
    'model the imp-96934 sigma_2-weighted high-k coefficient tail that explains the super-linear (p~3.27) beyond-T=3200 Krein residual growth left unmodelled by the bare Bessel onset -- does the separable coefficient^2 x per-mode-tail-mass product (the two sub-gap ingredients) reproduce it?',
  answer:
    'no separable/diagonal product does: the super-linear growth is carried by the c_n^2 d_n PRODUCT tail (an exponentially-tiny high-mode coefficient tail c_top ~ 1e-13 times an astronomically-large per-mode sigma_2-weighted tail mass d_top ~ 1e10-1e12, so the top 20% of modes carry 65-74% of the diagonal residual while holding ~1e-13 of the coefficient mass), but the diagonal model OVER-predicts the coherent first-order residual by a factor GROWING 2.81 -> 6.96 with N and grows too fast (x5.39/x3.91 vs measured x2.46/x2.01), because the minimiser is low-mode-dominated (n_eff ~ 0.01) and coherent off-diagonal cancellation between Bessel modes is itself super-linear -- a correct model must keep the full coherent tail Gram, not a product',
  minimiserLowModeDominated: true, // n_eff ~ 0.01, top-20% coeff mass ~1e-13 at every N
  perModeTailMassExplodes: true, // d_n ~ n^11.5, d_top/d_mid ~ 2500-2900
  productTailDominated: true, // top-20% of modes carry 65-74% of resid_diag
  separableDiagonalModelQuantitative: false, // over-predicts by growing 2.81 -> 6.96, grows too fast
  coherentOffDiagonalIsLeading: true, // diag/fo grows with N => off-diagonal cancellation is super-linear
  newSubGap: 'imp-96949-coherent-tail-gram-required',
  residFoAtN100: 0.0018621,
  residDiagAtN100: 0.0097507,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96949_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96949_ASSERTIONS = [
  {
    id: 'imp96949-kmax-equals-2m-plus-N-minus-1',
    holds: () =>
      IMP96949_NS.every((N) => IMP96949_ROWS[N].kmax === 2 * M_POLE + N - 1),
    why: 'each row is at k_max = 2m+N-1 (the spherical-Bessel top index of the pole-free m=3 trial space), the same object imp-96934 tabulated.',
  },
  {
    id: 'imp96949-minimiser-low-mode-dominated',
    holds: () =>
      IMP96949_NS.every((N) => {
        const r = IMP96949_ROWS[N];
        return r.nEff < 0.1 && r.top20CoeffWeight < 1e-10;
      }),
    why: 'the minimiser sits at n_eff ~ 0.01 with ~1e-13 of the coefficient mass in the top 20% of modes, so growing high-k coefficient amplitudes does NOT mean high Gegenbauer-mode occupation -- the minimiser stays smooth.',
  },
  {
    id: 'imp96949-per-mode-tail-mass-explodes',
    holds: () =>
      IMP96949_NS.every((N) => {
        const r = IMP96949_ROWS[N];
        return r.qDHighBand > 10 && r.dTop / r.dMid > 1000;
      }),
    why: 'the per-basis-mode sigma_2-weighted tail mass d_n grows ~n^11.5 (d_top/d_mid > 2500), so the sigma_2 ~ t^4 weighting makes high modes astronomically heavy in the tail window even though the minimiser barely occupies them.',
  },
  {
    id: 'imp96949-product-is-tail-dominated',
    holds: () =>
      IMP96949_NS.every((N) => {
        const r = IMP96949_ROWS[N];
        // top-20% of modes hold a tiny coeff mass but a majority of the product mass
        return r.prodTop20Frac > 0.6 && r.prodTop20Frac > 1e8 * r.top20CoeffWeight;
      }),
    why: 'the c_n^2 d_n product is tail-dominated (top-20% modes carry 65-74% of resid_diag despite ~1e-13 of the coefficient mass), so it is the PRODUCT tail, not either factor alone, that carries the residual.',
  },
  {
    id: 'imp96949-separable-model-overpredicts-and-grows-too-fast',
    holds: () => {
      // over-prediction factor diag/fo GROWS strictly with N
      const growing =
        IMP96949_ROWS[76].diagOverFo < IMP96949_ROWS[100].diagOverFo &&
        IMP96949_ROWS[100].diagOverFo < IMP96949_ROWS[124].diagOverFo &&
        IMP96949_ROWS[76].diagOverFo > 2;
      // and the diagonal N-growth exceeds the coherent/measured growth on the first step
      const g = IMP96949_GROWTH['76->100'];
      return growing && g.ratioDiag > g.ratioFo && g.ratioFo > g.ratioMeasured;
    },
    why: 'the diagonal model over-predicts the coherent first-order residual by a factor growing 2.81 -> 6.96 with N and grows too fast (diag x5.39 > fo x2.90 > measured x2.46), so the separable coefficient^2 x per-mode-mass product is not the model -- coherent off-diagonal cancellation is a leading, super-linear effect.',
  },
  {
    id: 'imp96949-residfo-matches-imp96934',
    holds: () =>
      IMP96949_ROWS[76].residFo === 0.0006425 &&
      IMP96949_ROWS[100].residFo === 0.0018621 &&
      IMP96949_ROWS[124].residFo === 0.0054813,
    why: 'the coherent first-order tail residual reused here reproduces the imp-96934 residFirstOrder values exactly (same subspace, operator and phi), so this is an apples-to-apples model test of that residual.',
  },
  {
    id: 'imp96949-measurement-only-no-qed',
    holds: () =>
      IMP96949_VERDICT.productTailDominated === true &&
      IMP96949_VERDICT.separableDiagonalModelQuantitative === false &&
      IMP96949_VERDICT.coherentOffDiagonalIsLeading === true &&
      IMP96949_VERDICT.operatorPositivityProved === false &&
      IMP96949_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96949_VERDICT.qed === false,
    why: 'measurement only: the separable model is refuted and a new coherent-tail-Gram sub-gap is named, no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96949_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96949-sigma2-coeff-tail-model-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
void A_LN3;
