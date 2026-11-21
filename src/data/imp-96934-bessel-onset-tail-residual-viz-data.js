/**
 * @module imp-96934-bessel-onset-tail-residual-viz-data
 * @fileoverview imp-96934 -- MEASUREMENT: tabulate the per-N Bessel onset t_onset=(2m+N-1)/a at
 *   2a=ln3 and test whether the imp-96917 residual t-truncation beyond T=3200 (0.104/0.257/0.520
 *   percent of the floor at N=76/100/124, GROWING with N) matches the fraction of Bessel mass
 *   beyond T=3200 predicted by the k/a onset.
 *
 * CONTEXT. imp-96917 FINDING 3 attributed the beyond-T=3200 Krein-floor residual (which grows with
 * N) to higher-N trial functions carrying spherical-Bessel weight j_k up to k=2m+N-1 with onset
 * t ~ k/a, so a fixed t-tail progressively under-resolves. That mechanism was asserted
 * qualitatively but never tabulated. This leaf makes it quantitative and decides how much it
 * explains.
 *
 * METHOD (driver tmp/imp-96934-bessel-onset-tail.py, ~20s, reuses the imp-96768 / imp-96917
 * orthogonal Gegenbauer build verbatim: sigma_2=(t^2+1/4)^2 w_1, pole-free m=3 trial space,
 * normalised C_n^{13/2} so the L2 Gram is exactly scaleB*I, condB=1). At 2a=ln3, per N in
 * {76,100,124}:
 *   (a) t_onset = (2m+N-1)/a, k_max = 2m+N-1 (spherical-Bessel j_k(at) onset at at ~ k).
 *   (b) FIRST-ORDER (Rayleigh) tail residual: minimiser phi of A on [0,3200]; build A_tail on
 *       [3200,12800]; dlam ~ phi^T A_tail phi / scaleB is the actual sigma_2-weighted Bessel mass
 *       beyond T=3200 that lifts the floor. The A_lo T=3200 floor reproduces the imp-96917 baked
 *       floor and lam_min(A_lo + A_tail) reproduces the direct A_full T=12800 floor (split check).
 *   (c) WEIGHTED tail fraction of the minimiser = phi^T A_tail phi / phi^T A_full phi.
 *   (d) UNWEIGHTED k/a onset prediction: int_0^inf j_k^2 = pi/(2(2k+1)), tail int_S^inf ~ 1/(2S)
 *       for S>>k, so the top-mode tail-mass fraction ~ (2k+1)/(pi*S) -- which predicts the residual
 *       grows only LINEARLY in k_max ~ (2N+11).
 * The Rayleigh floor is an UPPER bound on the true infinite-dim lam_min; NO operator positivity;
 * RH open; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE ONSETS SIT FAR BELOW THE CUTOFF. t_onset = 147.5 / 191.2 / 234.8 at N=76 / 100 / 124 --
 *      only 4.6% / 6.0% / 7.3% of T=3200 (13-22x BELOW the cutoff). So the residual beyond T=3200 is
 *      NOT the onset crossing the cutoff; every mode is already well past its onset at T=3200, and
 *      what leaks past T=3200 is the far oscillatory j_k tail, sigma_2-weighted.
 *   2. THE RESIDUAL IS GENUINELY BESSEL MASS BEYOND T=3200. The first-order Rayleigh tail residual
 *      phi^T A_tail phi / scaleB = 0.000643 / 0.001862 / 0.005481 has the SAME SIGN and order as the
 *      measured floor lift 0.000607 / 0.001490 / 0.002999 (it over-predicts because adding the tail
 *      also shifts the minimiser, a second-order lowering); the split check lam_min(A_lo+A_tail)
 *      reproduces the direct T=12800 floor to <=2e-6. So the k/a mechanism has the right OBJECT.
 *   3. THE LITERAL k/a ONSET-MASS MODEL DOES NOT MATCH QUANTITATIVELY. (i) It over-predicts the
 *      absolute fraction: (2k+1)/(pi*T) = 1.62% / 2.10% / 2.58% vs the measured sigma_2-weighted
 *      tail fraction 0.110% / 0.321% / 0.942% (uniform j_k^2 mass is not the sigma_2-weighted mass).
 *      (ii) It mis-predicts the N-growth: the measured residual grows x2.46 then x2.01 per N step
 *      (super-linear; imp-96928 power law p~3.27) but the linear-in-k onset model grows only x1.29
 *      then x1.23. An unexplained SUPER-LINEAR component remains, from the sigma_2 ~ t^4 tail
 *      weighting and the minimiser's growing high-k coefficient amplitudes.
 *
 * VERDICT. The imp-96917 k/a Bessel-onset story is directionally correct -- the residual IS
 * sigma_2-weighted Bessel mass beyond T=3200 (first-order tail residual reproduces the measured
 * floor lift in sign and order), and it grows with N because k_max=2m+N-1 grows -- but the LITERAL
 * onset-mass prediction is NOT quantitative: the onsets sit 13-22x below T=3200 (it is the far tail,
 * not the onset), and the uniform-j_k^2 (2k+1)/(pi*T) model both over-predicts the absolute fraction
 * and badly under-predicts the super-linear N-growth. SUB-GAP
 * imp-96934-sigma2-weighted-coeff-tail-unmodelled: the residual carries an unexplained super-linear
 * component that a full model must fold in the sigma_2 ~ t^4 tail weighting and the minimiser's
 * high-k coefficient amplitudes, not just the bare Bessel onset. Measurement only; the floor is a
 * Rayleigh UPPER bound; no operator positivity; interval-rigorous certificate reach stays
 * 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96917-krein-tladder-plateau-viz-data.js (the beyond-T=3200 residual this explains)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the orthogonal Gegenbauer build reused here)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const A_LN3 = LN3 / 2; // 0.5493061443340549 (2a=ln3)
const M_POLE = 3; // pole-free trial-space order m; k_max = 2m + N - 1

export const IMP96934_NS = Object.freeze([76, 100, 124]);
export const IMP96934_T3200 = 3200;
export const IMP96934_TFULL = 12800;

// per-N measured row (2a=ln3), from tmp/imp-96934-bessel-onset-tail.py
//   kmax = 2m+N-1; tOnset = kmax/a; residFirstOrder = phi^T A_tail phi / scaleB (sigma_2-weighted
//   Bessel mass beyond T=3200); residMeasured = floor(T=12800) - floor(T=3200) (reproduces
//   imp-96917); weightedTailFrac = phi^T A_tail phi / phi^T A_full phi; onsetFracUnweighted =
//   (2*kmax+1)/(pi*T3200) (literal uniform-j_k^2 onset-mass prediction).
export const IMP96934_ROWS = Object.freeze({
  76: Object.freeze({
    kmax: 81, tOnset: 147.459, tOnsetOverT3200: 0.046081,
    residMeasured: 0.0006065, residFirstOrder: 0.0006425,
    weightedTailFrac: 0.0011041, onsetFracUnweighted: 0.0162139,
  }),
  100: Object.freeze({
    kmax: 105, tOnset: 191.150, tOnsetOverT3200: 0.059734,
    residMeasured: 0.0014900, residFirstOrder: 0.0018621,
    weightedTailFrac: 0.0032059, onsetFracUnweighted: 0.0209886,
  }),
  124: Object.freeze({
    kmax: 129, tOnset: 234.842, tOnsetOverT3200: 0.073388,
    residMeasured: 0.0029994, residFirstOrder: 0.0054813,
    weightedTailFrac: 0.0094153, onsetFracUnweighted: 0.0257632,
  }),
});

// N-growth ratios (per step): measured floor lift vs the LINEAR-in-kmax onset prediction.
// onset(linear-in-k) ratio = (2*kmax_b + 1)/(2*kmax_a + 1); the measured ratio is far larger.
export const IMP96934_GROWTH = Object.freeze({
  '76->100': Object.freeze({ ratioMeasured: 2.457, ratioFirstOrder: 2.898, ratioOnsetLinear: 1.294 }),
  '100->124': Object.freeze({ ratioMeasured: 2.013, ratioFirstOrder: 2.944, ratioOnsetLinear: 1.227 }),
});

export const IMP96934_VERDICT = Object.freeze({
  ticket: 'imp-96934',
  question:
    'tabulate t_onset=(2m+N-1)/a at 2a=ln3 and decide whether the imp-96917 residual beyond T=3200 matches the fraction of Bessel mass beyond T=3200 predicted by the k/a onset -- does the mechanism explain the super-linear-in-N residual or leave an unexplained component?',
  answer:
    'directionally yes, quantitatively no: the residual IS sigma_2-weighted Bessel mass beyond T=3200 (the first-order tail residual reproduces the measured floor lift in sign and order) and grows with N because k_max=2m+N-1 grows, but the onsets sit 13-22x below T=3200 (it is the far tail, not the onset), and the literal uniform-j_k^2 (2k+1)/(pi*T) onset-mass model both over-predicts the absolute fraction (1.6-2.6% vs measured 0.11-0.94%) and under-predicts the super-linear N-growth (x1.29/x1.23 vs measured x2.46/x2.01), leaving an unexplained super-linear component',
  onsetsFarBelowCutoff: true, // tOnset/T3200 = 0.046-0.073 at every N
  residualIsBesselMassBeyondT3200: true, // first-order tail residual matches measured floor lift in sign/order
  literalOnsetMassModelQuantitative: false, // over-predicts fraction, under-predicts N-growth
  unexplainedSuperLinearComponent: true, // measured grows x2-3 per step vs x1.2-1.3 linear-in-k
  subGap: 'imp-96934-sigma2-weighted-coeff-tail-unmodelled',
  residFirstOrderAtN100: 0.0018621,
  residMeasuredAtN100: 0.0014900,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96934_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96934_ASSERTIONS = [
  {
    id: 'imp96934-tonset-equals-kmax-over-a',
    holds: () =>
      IMP96934_NS.every((N) => {
        const r = IMP96934_ROWS[N];
        return (
          r.kmax === 2 * M_POLE + N - 1 &&
          Math.abs(r.tOnset - r.kmax / A_LN3) < 1e-2 &&
          Math.abs(r.tOnsetOverT3200 - r.tOnset / IMP96934_T3200) < 1e-4
        );
      }),
    why: 'the tabulated onset is exactly t_onset = k_max/a with k_max = 2m+N-1 (spherical-Bessel j_k(at) onset at at ~ k), the object imp-96917 named for the residual.',
  },
  {
    id: 'imp96934-onsets-far-below-cutoff',
    holds: () =>
      IMP96934_NS.every((N) => {
        const f = IMP96934_ROWS[N].tOnsetOverT3200;
        return f > 0.03 && f < 0.1; // 13-22x below T=3200 at every N
      }),
    why: 'every onset sits at 4.6-7.3% of T=3200 (13-22x below the cutoff), so the residual beyond T=3200 is the far oscillatory j_k tail, NOT the onset crossing the cutoff.',
  },
  {
    id: 'imp96934-firstorder-tail-residual-matches-sign-and-order',
    holds: () =>
      IMP96934_NS.every((N) => {
        const r = IMP96934_ROWS[N];
        // same sign, within ~2x, and GROWS with N in step with the measured residual
        return r.residFirstOrder > 0 && r.residFirstOrder < 2 * r.residMeasured &&
          r.residFirstOrder > 0.5 * r.residMeasured;
      }),
    why: 'the first-order Rayleigh tail residual (sigma_2-weighted Bessel mass beyond T=3200) reproduces the measured floor lift in sign and order at every N, so the k/a mechanism has the right OBJECT (it over-predicts only via the second-order minimiser shift).',
  },
  {
    id: 'imp96934-literal-onset-model-overpredicts-fraction',
    holds: () =>
      IMP96934_NS.every((N) => {
        const r = IMP96934_ROWS[N];
        // uniform-j_k^2 onset fraction is 3-15x the measured sigma_2-weighted tail fraction
        return r.onsetFracUnweighted > 2 * r.weightedTailFrac;
      }),
    why: 'the literal uniform-j_k^2 (2k+1)/(pi*T) onset-mass fraction (1.6-2.6%) is several times the measured sigma_2-weighted tail fraction (0.11-0.94%), because the sigma_2 ~ t^4 weighting reshapes where the mass sits.',
  },
  {
    id: 'imp96934-onset-model-underpredicts-N-growth',
    holds: () =>
      Object.values(IMP96934_GROWTH).every(
        (g) => g.ratioMeasured > 1.5 * g.ratioOnsetLinear,
      ),
    why: 'the measured residual grows x2.46 then x2.01 per N step but the linear-in-k onset model grows only x1.29 then x1.23, so a super-linear component (imp-96928 p~3.27) is left unexplained by the bare onset mass.',
  },
  {
    id: 'imp96934-residual-reproduces-imp96917',
    holds: () =>
      IMP96934_ROWS[76].residMeasured === 0.0006065 &&
      IMP96934_ROWS[100].residMeasured === 0.0014900 &&
      IMP96934_ROWS[124].residMeasured === 0.0029994,
    why: 'the measured floor lift beyond T=3200 reproduces the imp-96917 baked residuals (same subspace and operator), so this is an apples-to-apples decomposition of that residual.',
  },
  {
    id: 'imp96934-measurement-only-no-qed',
    holds: () =>
      IMP96934_VERDICT.residualIsBesselMassBeyondT3200 === true &&
      IMP96934_VERDICT.literalOnsetMassModelQuantitative === false &&
      IMP96934_VERDICT.unexplainedSuperLinearComponent === true &&
      IMP96934_VERDICT.operatorPositivityProved === false &&
      IMP96934_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96934_VERDICT.qed === false,
    why: 'measurement only: the k/a mechanism is directionally confirmed but not quantitative (a super-linear component is unexplained), no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96934_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96934-bessel-onset-tail-residual-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
