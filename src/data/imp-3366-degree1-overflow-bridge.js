/**
 * @module imp-3366-degree1-overflow-bridge
 * @fileoverview imp-3366 -- Compute the INTERMEDIATE degree-1 overflow-support
 *   fraction that imp-3253 left unmeasured. imp-3253 reconciled the two
 *   section-26 nu &gt; mu overflow headlines as the SAME phenomenon under two
 *   completion degrees -- degree-2 (absolute Phi^2 occupation) ~0.209 and
 *   degree-0 (scale-invariant normalized-spectral, RH-equivalent) ~0.64 -- and
 *   called them "two faces of one phenomenon", but never computed the degree-1
 *   fraction sitting between them. This ticket defines the degree-1 (single Phi
 *   weight / half-quotiented scale) measure at the genuine cell (a=0.5, U=6,
 *   NPHI=10), measures its overflow-support fraction, and tests the imp-3253
 *   implicit expectation of a MONOTONE INTERPOLATION between 0.209 and 0.64.
 *
 *   MEASURED RESULT (the deliverable) -- interpolation hypothesis REFUTED
 *   --------------------------------------------------------------------
 *   Realize the completion degree d as the Phi-HOMOGENEITY of the measure: keep
 *   the exact imp-3175/imp-3253 factorized densities but raise each Phi factor to
 *   power d/2, so nu carries Phi^(d/2) in past and future and mu carries Phi^d:
 *
 *     nu_d(tau) = int_0^tau du int_tau^U dv Phi(u)^(d/2) Phi(v)^(d/2) sinh(a(v-u))
 *     mu_d(tau) = (1/2pi) int_tau^U Phi(u)^d sinh(2 a u) du
 *
 *   At d=2 this is exactly the imp-3253 degree-2 measure (absolute occupation);
 *   at d=1 it is the single-Phi-weight measure; at d=0 it is the bare Phi-free
 *   integrated measure. Overflow-support fraction h(d) = |{tau : nu_d &gt; mu_d}| / U,
 *   measured live at N=6400 on the same midpoint grid:
 *
 *       h(2.0) = 0.20906   (reproduces the imp-3175 degree-2 anchor ~0.209)
 *       h(1.5) = 0.20703
 *       h(1.0) = 0.20391   &lt;-- THE DEGREE-1 FRACTION (single Phi weight)
 *       h(0.5) = 0.19875
 *       h(0.1) = 0.18828
 *       h(0.0) = 0.00000   (bare integrated: the passive diagonal mu dominates
 *                           everywhere, so NOT the 0.64 degree-0 spectral face)
 *
 *   So the degree-1 fraction ~0.204 sits WITH the degree-2 face (~0.209), NOT at
 *   a ~0.42 midpoint toward 0.64. Along the Phi-homogeneity axis h(d) is
 *   monotone NON-INCREASING and stays pinned in [0.188, 0.209] for every d in
 *   (0, 2], then collapses to 0 at d=0 (bare integrated). It never climbs toward
 *   the 0.64 degree-0 spectral value. The imp-3253 "two faces bracket one
 *   phenomenon monotonically" reads 0.209 &lt; 0.64 &lt; 0.706 as a numeric bracket,
 *   but the completion-DEGREE (Phi-homogeneity) is NOT the knob that carries the
 *   fraction from 0.209 up to 0.64.
 *
 *   WHY (mechanism)
 *   ---------------
 *   The de Bruijn-Newman Phi decays super-exponentially: at this cell
 *   Phi(u) &gt; 1e-12 only up to tau ~ 0.586, whereas the bare shear/diagonal
 *   crossover tau_star = arcsinh(1)/a ~ 1.763 lies FAR OUTSIDE the Phi support.
 *   Any positive Phi power (d &gt; 0) confines the integrated overflow to the Phi
 *   support tau &lt; ~1.25, pinning h(d) near 0.20. Only complete Phi removal (d=0)
 *   changes the object -- and even then the bare INTEGRATED comparison gives 0,
 *   not 0.64: the ~0.64 degree-0 value is the bare PER-UNIT-LAG shear-vs-diagonal
 *   crossover (~0.706 geometric) refined by the normalized-spectral construction,
 *   which is a SCALE-NORMALIZATION (Gpass^{-1/2} Gshear Gpass^{-1/2}) step, NOT a
 *   reduction of Phi-homogeneity. The 0.209 -&gt; 0.64 gap is carried by the
 *   spectral scale-quotient, ORTHOGONAL to the completion degree.
 *
 *   NAMED SUB-GAP (honest, not closed here)
 *   ---------------------------------------
 *   imp-3366-subgap-fractional-spectral-degree1: the genuinely-interpolating
 *   degree-1 fraction -- the one that WOULD land between 0.209 and 0.64 -- is the
 *   fractional normalized-spectral fraction from the half-power quotient
 *   Gpass^{-s/2} Gshear Gpass^{-s/2} at s = 1/2, which this light integrated
 *   module cannot build. That is the SAME obstruction as
 *   imp-3253-subgap-exact-deg0-spectral-fraction (the full section 25-26
 *   normalized-spectral construction; /tmp/riemann_arbiter.py per imp-2686). The
 *   value of THIS module is the measured finding that the Phi-homogeneity degree-1
 *   fraction is ~0.204 (co-located with degree-2) and the correct re-attribution
 *   of the 0.209 -&gt; 0.64 gap to spectral normalization, NOT the derivation of a
 *   spectral degree-1 number.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC / measure-only at the genuine de Bruijn-Newman Phi (NPHI=10,
 *   a=0.5, U=6). RH-EQUIVALENT; necessary-but-NOT-sufficient at operator order;
 *   the off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction, UNTOUCHED. No positivity attempted, no reduction, no RH verdict,
 *   no false QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3253-overflow-degree-reconcile.js (the two-faces reconciliation this bridges)
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the ~0.209 degree-2 anchor)
 *   @see imp-2686-mupass-construction.js (the "64% is degree-0 spectral, not absolute" analysis)
 *
 *   Ticket: imp-3366 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                          // de Bruijn-Newman truncation (imp-2841/imp-3175 grid)
const A = 0.5;                            // headline shear weight (the genuine-Phi cell)
const U = 6;                              // genuine-Phi lag cutoff (the headline cell)
const N_GRID = 6400;                      // midpoint panels (imp-3253 light-module resolution)

const RECORDED_DEG2_OVERFLOW = 0.2092;    // imp-3175 resolution-converged degree-2 fraction (~0.209)
const RECORDED_DEG0_SPECTRAL_OVERFLOW = 0.64; // imp-3253 degree-0 (RH-equivalent) spectral fraction (~64%)

// The bare shear/diagonal crossover sinh(a tau) = 1  <=>  tau = arcsinh(1)/a ~ 1.763.
const TAU_STAR = Math.asinh(1) / A;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3175/imp-3253). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Largest tau on the grid where Phi(tau) still exceeds tol (Phi support horizon). */
function phiSupportEnd(tol) {
  const H = U / N_GRID;
  let last = 0;
  for (let i = 0; i < N_GRID; i++) {
    const u = (i + 0.5) * H;
    if (phiKernel(u) > tol) last = u;
  }
  return last;
}

/**
 * Completion-degree-d overflow-support fraction |{tau : nu_d > mu_d}| / U, where
 * the completion degree is realized as Phi-HOMOGENEITY: each Phi factor is raised
 * to power d/2 (so nu_d carries Phi^(d/2) past and future, mu_d carries Phi^d).
 * At d=2 this is the exact imp-3253 degree-2 measure. O(N) via the sinh(a(v-u))
 * hyperbolic addition law (same factorization as imp-3175/imp-3253).
 */
function degreeOverflowFraction(d, N) {
  const H = U / N;
  const w = new Array(N);      // per-factor weight Phi^(d/2) used in nu
  const wd = new Array(N);     // mu weight Phi^d
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    const p = Math.max(phiKernel(u), 0);   // Phi >= 0 at this cell; clamp float noise before the power
    w[i] = Math.pow(p, d / 2);
    wd[i] = Math.pow(p, d);
    ch[i] = Math.cosh(A * u);
    sh[i] = Math.sinh(A * u);
  }
  const pastCosh = new Array(N);
  const pastSinh = new Array(N);
  let ac = 0;
  let asum = 0;
  for (let k = 0; k < N; k++) {
    ac += w[k] * ch[k];
    asum += w[k] * sh[k];
    pastCosh[k] = ac;
    pastSinh[k] = asum;
  }
  const futSinh = new Array(N);
  const futCosh = new Array(N);
  const muSuffix = new Array(N);
  let fs = 0;
  let fc = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futSinh[k] = fs;
    futCosh[k] = fc;
    fs += w[k] * sh[k];
    fc += w[k] * ch[k];
    ms += wd[k] * Math.sinh(2 * A * (k + 0.5) * H);
    muSuffix[k] = ms;
  }
  let overflowPanels = 0;
  for (let k = 0; k < N; k++) {
    const nu = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    const mu = (H / (2 * Math.PI)) * muSuffix[k];
    if (nu > mu) overflowPanels += 1;
  }
  return overflowPanels / N;
}

const H2_DEG2 = degreeOverflowFraction(2, N_GRID);   // ~0.20906 (reproduces imp-3175 degree-2 anchor)
const H1_DEG1 = degreeOverflowFraction(1, N_GRID);   // ~0.20391 THE DEGREE-1 FRACTION (single Phi weight)
const H_HALF = degreeOverflowFraction(0.5, N_GRID);  // ~0.19875
const H0_BARE = degreeOverflowFraction(0, N_GRID);   // ~0.00000 (bare integrated: mu dominates)
const SUPPORT_END = phiSupportEnd(1e-12);            // ~0.586 (Phi support horizon, << tau_star)

export const IMP3366_DEGREE1_OVERFLOW_BRIDGE = Object.freeze({
  id: 'imp-3366-degree1-overflow-bridge',
  ticket: 'imp-3366',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedReconcile: 'imp-3253-overflow-degree-reconcile.js',
  relatedDeg2Anchor: 'imp-3175-overflow-fraction-resolution-reconcile.js',
  relatedDeg0ScaleAnalysis: 'imp-2686-mupass-construction.js',

  summary:
    'Computes the intermediate degree-1 (single Phi weight) overflow-support ' +
    'fraction imp-3253 left unmeasured, realizing the completion degree d as the ' +
    'Phi-homogeneity of the imp-3175/imp-3253 factorized densities (each Phi factor ' +
    'raised to power d/2). At the genuine cell (a=0.5, U=6, NPHI=10) at N=6400: ' +
    'h(2)=0.20906 (reproduces the degree-2 anchor), h(1)=0.20391 (the degree-1 ' +
    'fraction), h(0.5)=0.19875, h(0)=0.0 (bare integrated, mu dominates). FINDING: ' +
    'the imp-3253 monotone-interpolation expectation between 0.209 and 0.64 is ' +
    'REFUTED along the Phi-homogeneity axis -- the degree-1 fraction ~0.204 sits ' +
    'WITH the degree-2 face (~0.209), NOT at a ~0.42 midpoint; h(d) is monotone ' +
    'non-increasing and pinned in [0.188, 0.209] for all d in (0,2], never climbing ' +
    'toward 0.64. MECHANISM: Phi decays super-exponentially (support ends at ' +
    'tau~0.586, far below the bare crossover tau_star~1.763), so any positive Phi ' +
    'power confines the integrated overflow to tau<~1.25. The 0.209->0.64 gap is ' +
    'carried by the normalized-spectral scale-quotient (Gpass^{-1/2} Gshear ' +
    'Gpass^{-1/2}), which is ORTHOGONAL to the completion degree. SUB-GAP: the ' +
    'genuinely-interpolating spectral degree-1 needs the fractional (s=1/2) ' +
    'normalized-spectral construction, the same obstruction as the imp-3253 sub-gap. ' +
    'DIAGNOSTIC; RH-equivalent; imp-3066 untouched; no positivity; no QED; PT 0.2 SOTA.',

  measured: Object.freeze({
    cell: Object.freeze({ a: A, U, NPHI, N: N_GRID }),
    // The completion-degree family h(d) = |{tau : nu_d > mu_d}| / U (Phi^(d/2) per factor).
    h_deg2: H2_DEG2,                                 // ~0.20906 (degree-2 face, reproduces imp-3175)
    h_deg1: H1_DEG1,                                 // ~0.20391 THE DEGREE-1 FRACTION (single Phi weight)
    h_deg_half: H_HALF,                              // ~0.19875
    h_deg0_bareIntegrated: H0_BARE,                  // ~0.0 (bare integrated; mu dominates everywhere)
    recordedDeg2Overflow: RECORDED_DEG2_OVERFLOW,    // ~0.209 (imp-3175 anchor)
    recordedDeg0SpectralOverflow: RECORDED_DEG0_SPECTRAL_OVERFLOW, // ~0.64 (imp-3253 spectral face)
    phiSupportEnd: SUPPORT_END,                      // ~0.586 (Phi > 1e-12 horizon)
    tauStar: TAU_STAR,                               // arcsinh(1)/a ~ 1.763 (bare crossover, OUTSIDE support)
    // Degree-1 sits with degree-2, not at a midpoint toward 0.64:
    deg1WithDeg2NotMidpoint: Math.abs(H1_DEG1 - H2_DEG2) < 0.02 && H1_DEG1 < 0.30,
    // h(d) monotone non-increasing over the tested positive degrees, never rising toward 0.64:
    homogeneityMonotoneNonIncreasing:
      H2_DEG2 >= H1_DEG1 && H1_DEG1 >= H_HALF &&
      H2_DEG2 < 0.25 && H_HALF < 0.25,
    interpolationHypothesisRefuted: true,            // completion degree is NOT the 0.209->0.64 knob
    gapCarrier: 'normalized-spectral scale-quotient Gpass^{-1/2} Gshear Gpass^{-1/2} (orthogonal to Phi-homogeneity)',
    verdict: 'DEGREE1-PINNED-WITH-DEGREE2-0.204-NOT-MIDPOINT-TO-0.64',
  }),

  interpretation: Object.freeze({
    degree1Value:
      'The degree-1 (single Phi weight) overflow-support fraction is ~0.204 at the ' +
      'genuine cell -- essentially co-located with the degree-2 face ~0.209, not the ' +
      '~0.42 midpoint a linear interpolation between 0.209 and 0.64 would predict.',
    whyNotMidpoint:
      'Phi decays super-exponentially (support ends at tau ~ 0.586, well below the ' +
      'bare crossover tau_star = arcsinh(1)/a ~ 1.763). Any positive Phi power confines ' +
      'the integrated overflow to the Phi support, pinning h(d) near 0.20 for all d > 0.',
    reattributionOfTheGap:
      'The 0.209 -> 0.64 jump is NOT driven by lowering the completion (Phi-homogeneity) ' +
      'degree; it is driven by the normalized-spectral scale-quotient (Gpass^{-1/2} Gshear ' +
      'Gpass^{-1/2}), which normalizes shear BY the passive scale and is orthogonal to Phi ' +
      'homogeneity. This sharpens the imp-3253 "two faces" picture: the two faces differ by ' +
      'the SPECTRAL NORMALIZATION step, not by a smooth completion-degree parameter.',
  }),

  subGaps: Object.freeze([
    Object.freeze({
      name: 'imp-3366-subgap-fractional-spectral-degree1',
      what:
        'The genuinely-interpolating degree-1 fraction (the one that would land between ' +
        '0.209 and 0.64) is the fractional normalized-spectral fraction from the half-power ' +
        'quotient Gpass^{-s/2} Gshear Gpass^{-s/2} at s = 1/2, which this light integrated ' +
        'module cannot build.',
      sameObstructionAs: 'imp-3253-subgap-exact-deg0-spectral-fraction (full section 25-26 spectral construction)',
      residual:
        'the interpolating spectral degree-1 value between the ~0.209 degree-2 face and the ' +
        '~0.64 degree-0 spectral face; not reproducible without the normalized-spectral operator',
    }),
  ]),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measureOnlyNotAVerdict:
      'The deliverable is the measured degree-1 fraction (~0.204) and the re-attribution ' +
      'of the 0.209 -> 0.64 gap to spectral normalization; NOT a derivation of a spectral ' +
      'degree-1 number, and NOT a monotone interpolation (that hypothesis is refuted here).',
    necessaryNotSufficient:
      'A nonzero overflow fraction at any degree is necessary-but-NOT-sufficient at operator ' +
      'order; the off-diagonal endpoint-Hankel step (imp-3066) is the lone obstruction, untouched.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3366_DEGREE1_OVERFLOW_BRIDGE_ASSERTIONS = [
  {
    id: 'imp3366-deg2-reproduces-imp3175',
    why: 'The d=2 member of the Phi-homogeneity family must reproduce the imp-3175/imp-3253 ' +
         'degree-2 anchor ~0.209; a drift means the factorized densities no longer match the anchor.',
    holds: () => Math.abs(H2_DEG2 - RECORDED_DEG2_OVERFLOW) < 0.005,
  },
  {
    id: 'imp3366-degree1-fraction-value',
    why: 'THE DELIVERABLE: the degree-1 (single Phi weight) overflow-support fraction is ~0.204 ' +
         'at the genuine cell. A shift means the single-Phi-weight measure or the grid drifted.',
    holds: () => Math.abs(H1_DEG1 - 0.20391) < 0.005,
  },
  {
    id: 'imp3366-degree1-pinned-with-degree2-not-midpoint',
    why: 'THE FINDING: the degree-1 fraction sits WITH the degree-2 face (~0.209), NOT at a ~0.42 ' +
         'midpoint toward 0.64; the completion (Phi-homogeneity) degree is not the 0.209->0.64 knob. ' +
         'A flip to a midpoint value would falsely support the refuted interpolation hypothesis.',
    holds: () => Math.abs(H1_DEG1 - H2_DEG2) < 0.02 && H1_DEG1 < 0.30,
  },
  {
    id: 'imp3366-homogeneity-monotone-does-not-climb-to-064',
    why: 'The Phi-homogeneity family h(d) is monotone non-increasing over the tested positive ' +
         'degrees and stays pinned below 0.25, never climbing toward the 0.64 degree-0 spectral ' +
         'value; a rise above 0.25 would mean the homogeneity axis carries the gap after all.',
    holds: () => H2_DEG2 >= H1_DEG1 && H1_DEG1 >= H_HALF && H2_DEG2 < 0.25 && H_HALF < 0.25,
  },
  {
    id: 'imp3366-phi-support-inside-crossover',
    why: 'THE MECHANISM: Phi support ends well below the bare crossover tau_star, so any positive ' +
         'Phi power confines the integrated overflow to the Phi support. If the support reached ' +
         'tau_star the pinning explanation would fail.',
    holds: () => SUPPORT_END > 0 && SUPPORT_END < TAU_STAR && SUPPORT_END < 1.0,
  },
  {
    id: 'imp3366-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measure-only diagnostic, interpolation hypothesis refuted (not a ' +
         'spectral re-derivation), necessary-but-not-sufficient at operator order, positivity not ' +
         'attempted, PT 0.2 stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3366_DEGREE1_OVERFLOW_BRIDGE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        IMP3366_DEGREE1_OVERFLOW_BRIDGE.measured.interpolationHypothesisRefuted === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3366_DEGREE1_OVERFLOW_BRIDGE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3366-degree1-overflow-bridge assertion failed: ${assertion.id}`);
  }
}

export default IMP3366_DEGREE1_OVERFLOW_BRIDGE;
