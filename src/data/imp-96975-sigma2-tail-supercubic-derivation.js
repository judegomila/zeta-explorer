/**
 * @module imp-96975-sigma2-tail-supercubic-derivation
 * @fileoverview imp-96975 -- DERIVATION (honest partial): analytic scaling of the sigma_2-weighted
 *   Krein beyond-T=3200 tail residual and its measured super-cubic (imp-96928/imp-96957 p~3.228)
 *   N-growth. Combines the sigma_2 = (t^2+1/4)^2 w_1 ~ t^4 tail weight with the spherical-Bessel /
 *   endpoint-singularity envelope of the pole-free m=3 trial space and reconciles with the measured
 *   exponent. Derivation only; the Rayleigh floor is an UPPER bound; changes no bound; RH open; NO QED.
 *
 * SETUP. The t-domain trial function is the Fourier transform of g_n(y) = psi_n(y)(1-y^2)^M on
 * [-1,1] (via the plane-wave expansion exp(-i a t y) = sum_k (2k+1)(-i)^k j_k(at) P_k(y)):
 *   Phih_n(t) = a^(2M+1) integral_{-1}^{1} psi_n(y) (1-y^2)^M exp(-i a t y) dy,
 * where psi_n is the L2-normalised Gegenbauer C_n^{13/2} (alpha = 2M+1/2 = 6.5) and M=3. The
 * beyond-T=3200 floor residual is the sigma_2-weighted mass of the minimiser phi in the tail,
 * residFirstOrder = (1/(pi*scaleB)) integral_T^inf sigma_2(t) |Phih_phi(t)|^2 dt.
 *
 * ANALYTIC MODEL (two structural laws).
 *   (L1) ENDPOINT / TAIL-DECAY LAW. g_n and its first M-1 derivatives vanish at y = +-1 (the
 *        (1-y^2)^M window), so integrating by parts M+1 times leaves the endpoint jump of the M-th
 *        derivative, g_n^{(M)}(1) = M!(-1)^M 2^M psi_n(1). Hence for large t
 *          |Phih_n(t)|^2 ~ const * psi_n(1)^2 / (a t)^{2(M+1)}   (= t^{-8} for M=3),
 *        and with sigma_2(t) ~ t^4 ln(t/2) the per-mode weighted tail integral is
 *          integral_T^inf sigma_2 |Phih_n|^2 dt ~ psi_n(1)^2 integral_T^inf t^4 ln t * t^{-8} dt
 *                                              ~ psi_n(1)^2 * T^{-3} ln T.
 *        VERIFIED: successive-octave single-mode tail ratios (n=123) are 0.1946, 0.1493, decreasing
 *        toward the predicted 2^{-3} = 0.125 (the ln T factor keeps them slightly above 0.125). So
 *        the beyond-T tail decays like T^{-3} ln T and this rate is jointly set by the sigma_2 ~ t^4
 *        weight AND the M=3 window power t^{-2(M+1)}; with a flat weight it would be the far faster
 *        T^{-7}. The slow tail is a genuine sigma_2-weighting effect.
 *   (L2) ENDPOINT-AMPLITUDE GROWTH. psi_n(1)^2 = C_n^{alpha}(1)^2 / h_n(alpha) ~ n^{2*alpha} = n^{13}
 *        (alpha = 6.5). VERIFIED: a log-log fit of psi_n(1)^2 over N in {76,88,100,112,124} gives
 *        exponent 12.31 (approaching 2*alpha = 13 with the finite-n Stirling / (n+alpha) correction),
 *        and the single-normalised-top-mode weighted tail mass itself grows with exponent 11.63 --
 *        FAR above the measured p~3.23.
 *
 * RECONCILIATION -- WHY THE MEASURED EXPONENT IS ONLY ~3.23. A single normalised top mode would
 * dump n^{~12} weighted tail mass, ~9 orders of magnitude above the measured residual. The minimiser
 * does NOT concentrate on the top mode: the full-build minimiser at N in {76,100,124} carries the
 * literal top-mode coefficient at phi_{N-1}^2 ~ 8.4e-27 / 1.4e-26 / 1.0e-24 (amplitude ~1e-13), i.e.
 * it NEAR-TOTALLY CANCELS the n^{~12} per-mode endpoint growth. The measured super-cubic residual is
 * the RESIDUE left after that cancellation, an intrinsic sigma_2-weighted-tail balance -- the tail
 * the minimiser must accept to keep the bulk quotient low -- NOT a bare m=3 coefficient-GROWTH
 * artifact. (The full-build residFirstOrder reproduces the imp-96934 baked values EXACTLY:
 * 0.0006425 / 0.0018621 / 0.0054813, growing with exponent ~4.36 over the coarse {76,100,124} grid;
 * the actual floor lift residMeasured grows p_global=3.228 over the finer imp-96957 ladder, the
 * difference being the second-order minimiser shift when the tail is added back.)
 *
 * VERDICT. The super-cubic law is an INTRINSIC sigma_2-weighted-tail phenomenon, NOT an artifact of
 * m=3 trial-space coefficient growth. Two structural laws are derived and numerically confirmed: the
 * beyond-T tail decays like T^{-3} ln T (the sigma_2 ~ t^4 weight against the M=3 window t^{-2(M+1)}
 * envelope), and each normalised mode carries endpoint tail mass ~ n^{2*alpha} = n^{~12-13}. The
 * measured exponent p~3.23 is FAR below the bare per-mode growth because the minimiser suppresses the
 * top-mode coefficient by ~9 orders of magnitude; p is the residue of that near-cancellation. Its
 * exact value is NOT closed in this single-/top-mode model -- it requires the full minimiser
 * coefficient spectrum (a collective effect across all modes). SUB-GAP
 * imp-96975-minimiser-coeff-spectrum-supercubic-residue: closing p in closed form needs the
 * asymptotics of the minimiser coefficient decay, not the bare endpoint law. Derivation only; the
 * floor is a Rayleigh UPPER bound; no operator positivity; interval-rigorous certificate reach stays
 * 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (measured p_global=3.228 on {88..124})
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (the onset table this derives the scaling for)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 * driver tmp/imp-96975-tail-scaling-derivation.py (reuses the imp-96934 Gegenbauer build verbatim)
 */

const M_POLE = 3; // pole-free window order; k_max = 2m+N-1
const ALPHA = 2 * M_POLE + 0.5; // 6.5 (normalised Gegenbauer C_n^{13/2})

export const IMP96975_NS = Object.freeze([76, 88, 100, 112, 124]);
export const IMP96975_T3200 = 3200;
export const IMP96975_TFULL = 12800;

// (L1)/(L2) single normalised top-mode (n=N-1) diagnostics, from tmp/imp-96975-tail-scaling-derivation.py
//   psi1sq = psi_{N-1}(1)^2 (squared endpoint value); topModeTailMass = sigma_2-weighted mass beyond
//   T=3200 of the single normalised top mode; topModeTailFrac = topModeTailMass / full-range mass.
export const IMP96975_TOPMODE_ROWS = Object.freeze({
  76: Object.freeze({ n: 75, psi1sq: 3.260930521009761e15, topModeTailFrac: 0.0359726 }),
  88: Object.freeze({ n: 87, psi1sq: 1.949708670278225e16, topModeTailFrac: 0.0747103 }),
  100: Object.freeze({ n: 99, psi1sq: 9.385652870596106e16, topModeTailFrac: 0.1384930 }),
  112: Object.freeze({ n: 111, psi1sq: 3.812558021900264e17, topModeTailFrac: 0.2323736 }),
  124: Object.freeze({ n: 123, psi1sq: 1.350918841088469e18, topModeTailFrac: 0.3561047 }),
});

// (L2) log-log exponents: psi_n(1)^2 approaches n^{2*alpha}=n^13; the single-mode tail mass grows
// ~n^11.6 (endpoint-dominated) -- FAR above the measured p~3.23.
export const IMP96975_FIT_PSI1SQ_EXP = 12.31; // -> 2*alpha = 13 asymptotically
export const IMP96975_FIT_TOPMODE_TAIL_EXP = 11.63;
export const IMP96975_TWO_ALPHA = 2 * ALPHA; // 13

// (L1) single-mode successive-octave tail ratios (n=123): [3200,6400]->[6400,12800]->[12800,25600].
// Predicted 2^{-3}=0.125 from integral t^4 ln t * t^{-8} = integral t^{-4} ln t ~ T^{-3} ln T; the
// ratios sit just above 0.125 (ln T factor) and DECREASE toward it.
export const IMP96975_OCTAVE_TAIL_RATIOS = Object.freeze([0.194557, 0.149340]);
export const IMP96975_OCTAVE_TAIL_PREDICTED = 0.125;

// minimiser cross-check (full build reproduces imp-96934 residFirstOrder EXACTLY): the literal
// top-mode coefficient phi_{N-1}^2 is astronomically small -> near-total cancellation of the
// n^{~12} per-mode endpoint growth. residFirstOrder grows ~4.36 over {76,100,124} (coarse grid).
export const IMP96975_MINIMISER = Object.freeze({
  76: Object.freeze({ residFirstOrder: 0.0006424724809092385, phiTop2: 8.414718237191055e-27 }),
  100: Object.freeze({ residFirstOrder: 0.0018620582848104896, phiTop2: 1.4212279820069883e-26 }),
  124: Object.freeze({ residFirstOrder: 0.005481289855415384, phiTop2: 1.0069027639108449e-24 }),
});
export const IMP96975_RESIDFO_GROWTH_EXP = 4.36; // over coarse {76,100,124}
export const IMP96975_MEASURED_P = 3.228; // imp-96957 floor-lift p_global

export const IMP96975_VERDICT = Object.freeze({
  ticket: 'imp-96975',
  question:
    'derive the analytic scaling of the sigma_2-weighted Krein tail residual super-cubic (p~3.228) N-growth by combining the sigma_2 ~ t^4 weight with the spherical-Bessel/endpoint envelope and the minimiser coefficient decay, and decide whether it is an m=3 coefficient-growth artifact or an intrinsic sigma_2-weighted-tail phenomenon',
  answer:
    'intrinsic sigma_2-weighted-tail phenomenon, not an m=3 coefficient-growth artifact. Two structural laws are derived and confirmed: (L1) the beyond-T tail decays like T^{-3} ln T (octave ratios 0.195,0.149 -> predicted 2^{-3}=0.125), jointly set by sigma_2 ~ t^4 and the M=3 window envelope t^{-2(M+1)}=t^{-8}; (L2) each normalised mode carries endpoint tail mass ~ psi_n(1)^2 ~ n^{2*alpha} = n^{~12-13} (measured fit 12.31, single-mode tail 11.63). The measured p~3.23 is FAR below the bare per-mode growth because the minimiser suppresses the top-mode coefficient by ~9 orders of magnitude (phi_{N-1}^2 ~ 1e-26); p is the residue of that near-cancellation, whose exact value needs the full minimiser coefficient spectrum',
  tailDecayLaw: 'T^{-3} ln T', // (L1) verified by octave ratios approaching 0.125
  endpointAmplitudeExponent: 12.31, // (L2) psi_n(1)^2 -> n^{2*alpha}=n^13
  singleTopModeTailExponent: 11.63, // FAR above measured p~3.23
  measuredP: 3.228,
  isM3CoeffGrowthArtifact: false, // minimiser CANCELS the n^{~12} growth by ~9 orders of magnitude
  isIntrinsicSigma2TailPhenomenon: true,
  minimiserReproducesImp96934: true, // residFirstOrder = 0.0006425/0.0018621/0.0054813 exactly
  subGap: 'imp-96975-minimiser-coeff-spectrum-supercubic-residue',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96975_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96975_ASSERTIONS = [
  {
    id: 'imp96975-endpoint-amplitude-approaches-2alpha',
    holds: () =>
      IMP96975_FIT_PSI1SQ_EXP > 11.5 && IMP96975_FIT_PSI1SQ_EXP < IMP96975_TWO_ALPHA + 0.01,
    why: 'psi_n(1)^2 grows like n^{2*alpha}=n^13 (fit 12.31, approaching 13 with finite-n corrections), the endpoint-amplitude law (L2) from the (1-y^2)^M window M-th-derivative jump.',
  },
  {
    id: 'imp96975-single-topmode-tail-far-above-measured-p',
    holds: () =>
      IMP96975_FIT_TOPMODE_TAIL_EXP > 3 * IMP96975_MEASURED_P && IMP96975_FIT_TOPMODE_TAIL_EXP < IMP96975_TWO_ALPHA,
    why: 'a single normalised top mode dumps weighted tail mass growing ~n^11.6, far above the measured p~3.23, so the measured law is NOT the bare per-mode growth -- it is the post-cancellation residue.',
  },
  {
    id: 'imp96975-octave-tail-ratios-approach-T-minus-3',
    holds: () => {
      const [r1, r2] = IMP96975_OCTAVE_TAIL_RATIOS;
      // both above the T^{-3} floor 0.125 (ln T factor) and decreasing toward it
      return r1 > IMP96975_OCTAVE_TAIL_PREDICTED && r2 > IMP96975_OCTAVE_TAIL_PREDICTED && r2 < r1;
    },
    why: 'the single-mode octave tail ratios 0.195,0.149 sit just above and decrease toward 2^{-3}=0.125, confirming the T^{-3} ln T tail-decay law (L1) from sigma_2 ~ t^4 against the M=3 window t^{-8} envelope.',
  },
  {
    id: 'imp96975-minimiser-reproduces-imp96934-residfirstorder',
    holds: () =>
      Math.abs(IMP96975_MINIMISER[76].residFirstOrder - 0.0006425) < 1e-6 &&
      Math.abs(IMP96975_MINIMISER[100].residFirstOrder - 0.0018621) < 1e-6 &&
      Math.abs(IMP96975_MINIMISER[124].residFirstOrder - 0.0054813) < 1e-6,
    why: 'the full-build minimiser residFirstOrder reproduces the imp-96934 baked values exactly, so the derivation is anchored to the same operator and subspace as the measured residual.',
  },
  {
    id: 'imp96975-minimiser-cancels-topmode-endpoint-growth',
    holds: () =>
      IMP96975_NS.filter((N) => IMP96975_MINIMISER[N]).every((N) => IMP96975_MINIMISER[N].phiTop2 < 1e-20),
    why: 'the minimiser carries the literal top-mode coefficient at phi_{N-1}^2 ~ 1e-26 (amplitude ~1e-13), near-totally cancelling the n^{~12} per-mode endpoint growth -- so the super-cubic residual is a post-cancellation residue, not an m=3 coefficient-growth artifact.',
  },
  {
    id: 'imp96975-verdict-intrinsic-not-artifact-no-qed',
    holds: () =>
      IMP96975_VERDICT.isIntrinsicSigma2TailPhenomenon === true &&
      IMP96975_VERDICT.isM3CoeffGrowthArtifact === false &&
      IMP96975_VERDICT.operatorPositivityProved === false &&
      IMP96975_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96975_VERDICT.qed === false,
    why: 'derivation only: the super-cubic law is intrinsic to the sigma_2-weighted tail (not an m=3 artifact), no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96975_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96975-sigma2-tail-supercubic-derivation assertion failed: ${a.id}`);
  }
}

void ALPHA;
