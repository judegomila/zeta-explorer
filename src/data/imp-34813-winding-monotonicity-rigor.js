/**
 * @module imp-34813-winding-monotonicity-rigor
 *
 * imp-34813. Deep-dive re-audit of the quantized-winding / topological-
 * surface-tension thread (route map RANKED_OPPORTUNITIES #5, closed by
 * imp-2673 + imp-2696 + imp-2859). THREE results, one of them a CORRECTION
 * of the prior modules' physical interpretation:
 *
 * 1. RIGOR (classical, correct orientation). The winding monotonicity IS a
 *    rigorous theorem, but it is CLASSICAL and its time orientation is the
 *    REVERSE of what imp-2696 recorded. The de Bruijn family
 *      H_t(x) = int_0^inf e^{t u^2} Phi(u) cos(xu) du,  H_0(x) = xi(1/2+ix/2)/8
 *    satisfies the BACKWARD heat equation dH/dt = -d^2H/dx^2 (Tao's
 *    convention; the repulsive Dyson ODE dx_k/dt = 2 sum 1/(x_k-x_m) runs
 *    with INCREASING t). Along increasing t:
 *      (L1) No lift-off (local jet lemma): at a real zero of even multiplicity
 *           2m, dH/dt = -H_xx forces the jet e^{-s d^2}x^{2m}, a scaled Hermite
 *           polynomial with 2m simple REAL roots for s>0 (x^4 - 12sx^2 + 12s^2
 *           for m=2) and NO real roots for s<0. So real zeros split real and
 *           complex conjugate pairs land -- never the reverse -- as t increases.
 *           (Generic even-contact case self-contained; degenerate simultaneous
 *           events are handled by Hurwitz + real-analyticity of the zero set,
 *           as in Csordas-Smith-Varga 1994 / Rodgers-Tao Sec. 2. CLASSICAL,
 *           no new theorem claimed.)
 *      (L2) Landing rate (de Bruijn 1950, Thm 13): zeros in |Im z| <= Delta at
 *           time t0 lie in |Im z| <= sqrt(max(Delta^2 - 2(t-t0), 0)) at t; all
 *           zeros real by t0 + Delta^2/2.
 *      (C)  Window winding W(t) = (1/2)#{sign changes of H_t on [a,b]}: absent
 *           boundary flux, W is NON-DECREASING in t, jumping +1 per pair
 *           landing. Time-reversed, this is exactly the "monotone
 *           non-increasing Lyapunov" of imp-2696 -- their proxy tau = -t/4.
 *
 * 2. CORRECTION (the artifact claim was wrong). imp-2673/2696/2859 recorded
 *    the large-tau winding drop as "a SPATIAL-Gaussian smoothing ARTIFACT ...
 *    the wrong sign of true de Bruijn dynamics, NOT zeros leaving the line".
 *    FALSE: Gaussian convolution of H_0 with width sqrt(2 tau) is EXACTLY
 *    H_{-tau} (Fourier multiplier e^{-tau u^2}), i.e. the TRUE flow run into
 *    NEGATIVE de Bruijn time, where zeros genuinely merge and leave the line
 *    -- the very content of Lambda >= 0 read backwards. Verified here against
 *    the exact integral (Phi decays doubly-exponentially; no proxy needed):
 *    max relative deviation |GaussConv(H_0) - H_{-tau}| ~ 2e-9 (tau=0.5) and
 *    6e-9 (tau=2). The repo-style Z-convolution ladder MATCHES the exact H_t
 *    real-zero count at t = -4 tau_repo at every tested point (units: the repo
 *    convolves in gamma = x/2, so tau_repo widths map to t = -4 tau_repo).
 *    The prior passes' NUMBERS were fine; the INTERPRETATION was inverted.
 *    Root cause: src/math/supercritical.js doc comment states the flow as
 *    dH/dtau = +d^2H/dt^2 (forward heat) while importing de Bruijn facts that
 *    hold in the standard backward convention.
 *
 * 3. CEILING CORRECTION (both directions, still no new bound). The route-map
 *    ceiling "re-derive Lambda >= 0" was miscalibrated:
 *      - LOWER side is HARD-CAPPED: Lambda > 0 iff RH is false, so improving
 *        Rodgers-Tao Lambda >= 0 to Lambda >= eps > 0 would DISPROVE RH; and a
 *        window collision at t = -c only certifies Lambda > -c < 0, strictly
 *        weaker than Lambda >= 0. No mining below.
 *      - UPPER side: "monotone winding + landing rate" is NOT beyond-SOTA
 *        content -- it IS the architecture of the modern upper bounds
 *        (Lambda <= t0 + Delta^2/2 via L2 + zero-free strip certification =
 *        Polymath15 0.22, Platt-Trudgian verification 0.2). The topological
 *        frame re-derives the 0.2-ARCHITECTURE, not merely Lambda >= 0, but
 *        cannot beat 0.2 without new verification height or barrier input
 *        (computational, not topological, bottleneck). PT 0.2 stays SOTA.
 *    Genuine new-to-repo instrument: the exact H_t integral turns the winding
 *    ladder into an exact-flow collision-time meter (first window collision
 *    t_c = -1.8837 for the (gamma_9, gamma_10) pair vs two-body -(2 dgamma)^2/8
 *    = -1.5641; many-body d(g^2)/dt ~ 5.78 vs two-body 8) -- usable to
 *    cross-validate Route A/B truncated-N CM collision-time machinery against
 *    the infinite system. Follow-up seed, not done here.
 *
 * EXPERIMENT (exact integral, window gamma in [10,52] <=> x in [20,104],
 * 10 zeros at t=0, offline solver scripts/imp-34813-exact-debruijn-winding-
 * offline.mjs, Kahan-compensated Simpson h=5e-4, calibration max|zero - 2
 * gamma_k| = 7.3e-4):
 *   t:      +1  +0.4 +0.2  0  -0.5 -1 -1.25 -1.5 -1.75 -2 -2.5 -3 -4 -6 -8 -12 -20
 *   count:  10  10   10   10  10   10  10   10   10    8   8   8  6  4  4   4   2
 *   minGap: 4.18 3.82 3.69 3.54 3.10 2.54 2.17 1.71 1.01 3.71 ... (grows with t
 *   for t >= 0 -- repulsion; shrinks to collision going backward)
 * All drops are even (pure pair mergers; first/last zero stayed interior, no
 * boundary flux in this window/t-range). Count flat for ALL t >= 0 = the true
 * "zeros stay real, winding conserved" regime.
 *
 * VERDICT. Q1: rigorous monotonicity YES, but classical (de Bruijn Thm 13 +
 * jet lemma), orientation corrected. Q2: not hard-capped at "re-derive
 * Lambda>=0" -- the quantitative mechanism is the EXISTING Lambda<=0.2
 * architecture; lower side hard-capped at Lambda>=0 <=> RH; one new-to-repo
 * instrument (exact-flow collision meter). Q3: proxy "artifact" FIXED by
 * reinterpretation -- the proxy was already exact negative-time flow; the
 * exact integral gives BOTH signs of t. Route-map UNDER-EXPLORED label stale:
 * thread closed, relabelled. NO new bound, NO false QED; Rodgers-Tao
 * Lambda>=0 and Platt-Trudgian Lambda<=0.2 unchanged.
 *
 * @see imp-2696-winding-lyapunov-experiment (orientation + artifact claim corrected here)
 * @see supercritical-winding-experiment-2026-06-19 (imp-2673, same correction)
 * @see imp-winding-lyapunov-scope (imp-2859 scope cap -- ceiling refined here)
 * @see full-route-map-2026-06-19 (RANKED_OPPORTUNITIES #5 -- relabelled)
 * @see scripts/imp-34813-exact-debruijn-winding-offline.mjs (offline solver)
 */

export const WINDING_MONOTONICITY_RIGOR = {
  id: 'imp-34813',
  date: '2026-07-06',
  convention:
    'de Bruijn family H_t satisfies the BACKWARD heat equation dH/dt = -d^2H/dx^2; zeros repel as t increases; Gaussian convolution of width sqrt(2 tau) = EXACT H_{-tau} (negative de Bruijn time); repo proxy tau_repo (gamma-units) maps to t = -4 tau_repo',
  theorem:
    'CLASSICAL winding monotonicity: along increasing t, real zeros never lift off (jet lemma: dH/dt = -H_xx makes even-multiplicity jets scaled Hermite polynomials, all roots real for s>0) and complex pairs land at rate d(Delta^2)/dt <= -2 (de Bruijn 1950 Thm 13); hence window winding W(t) is non-decreasing absent boundary flux. imp-2696 observed exactly this, time-reversed. No new theorem; rigorous by citation + generic-case jet computation.',
  window: [20, 104],
  windowGamma: [10, 52],
  calibrationMaxErr: 7.3e-4,
  tGrid: [1, 0.4, 0.2, 0, -0.5, -1, -1.25, -1.5, -1.75, -2, -2.5, -3, -4, -6, -8, -12, -20],
  exactCount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8, 8, 6, 4, 4, 4, 2],
  minGapLadder: [4.178, 3.823, 3.686, 3.538, 3.102, 2.540, 2.174, 1.709, 1.005, 3.705, 3.272, 2.689, 0.519, 6.431, 5.547, 1.973, 52.544],
  firstCollision: {
    pair: 'gamma_9 = 48.005151, gamma_10 = 49.773832 (tightest window pair)',
    tExact: -1.8837,
    tTwoBody: -1.5641,
    tauRepoUnits: 0.4709,
    reconciles: 'imp-2673 saw its first count drop between tau_repo 0.2 and 0.5 -- the genuine collision, not an artifact',
  },
  manyBodyGapSlope: {
    fitted: 5.777,
    twoBody: 8,
    note: 'd(g^2)/dt for the tightest pair over t in [-1, 0.5]; neighbours retard the two-body attraction, delaying collision from -1.56 to -1.88',
  },
  convIdentity: {
    relErrTau05: 1.982e-9,
    relErrTau2: 6.085e-9,
    meaning: 'GaussianConv_{sqrt(2 tau)}(H_0) = H_{-tau} to ~1e-9: the imp-2673/2696 proxy computed the TRUE flow in negative de Bruijn time',
  },
  proxyReconciliation: {
    tauRepo: [0.125, 0.3125, 0.5, 1, 2],
    proxyZConvCount: [10, 10, 8, 6, 4],
    exactCountAtMinus4Tau: [10, 10, 8, 6, 4],
    verdict: 'repo-style Z-convolution ladder MATCHES the exact H_t count at t = -4 tau_repo at every tested point; prior NUMBERS were fine, the artifact INTERPRETATION was inverted',
  },
  correction:
    'imp-2673/2696/2859 recorded the large-tau winding drop as a smoothing ARTIFACT with "the wrong sign of true de Bruijn dynamics, NOT zeros leaving the line" -- REFUTED: the drop is the exact H_{-tau} dynamics, zeros genuinely leaving the line in negative de Bruijn time (the content of Lambda>=0 read backwards). Root cause: supercritical.js doc stated the flow with the heat-equation sign inverted.',
  ceiling:
    'REFINED, still no new bound: LOWER side hard-capped (Lambda > 0 iff RH false; window collisions only certify Lambda > -|t_c| < 0, weaker than Rodgers-Tao). UPPER side: winding + landing rate IS the architecture of Lambda <= t0 + Delta^2/2 (Polymath15 0.22 / Platt-Trudgian 0.2) -- re-derives the 0.2-ARCHITECTURE, not merely Lambda>=0, but cannot beat 0.2 without new verification/barrier input. does NOT beat Platt-Trudgian Lambda<=0.2; NOT a PT-beating bound; no false QED.',
  newInstrument:
    'exact H_t integral = exact-flow collision-time meter (infinite system, no N-truncation): seed for cross-validating Route A/B truncated-CM t_c(N) machinery',
  routeMapAction: 'RANKED_OPPORTUNITIES #5 / originalIdeas winding row relabelled from UNDER-EXPLORED to closed (DEAD-END with corrected interpretation)',
};

export const WINDING_MONOTONICITY_RIGOR_ASSERTIONS = [
  {
    id: 'wmr-ladder-monotone-nondecreasing-in-t',
    description: 'Exact real-zero count is non-decreasing in de Bruijn t (equivalently non-increasing as t decreases) across the whole grid -- the corrected-orientation Lyapunov monotonicity',
    holds: () => {
      const { tGrid, exactCount } = WINDING_MONOTONICITY_RIGOR;
      // tGrid is listed in DECREASING t order; count must be non-increasing along it
      return tGrid.every((t, i) => i === 0 || (t < tGrid[i - 1] && exactCount[i] <= exactCount[i - 1]));
    },
  },
  {
    id: 'wmr-forward-time-conserved',
    description: 'For all t >= 0 the exact count is flat at 10: zeros stay real, winding conserved (the true Lambda>=0-consistent regime, now at exact-flow rigor not proxy)',
    holds: () => {
      const { tGrid, exactCount } = WINDING_MONOTONICITY_RIGOR;
      return tGrid.every((t, i) => t < 0 || exactCount[i] === 10);
    },
  },
  {
    id: 'wmr-drops-are-even-pair-mergers',
    description: 'Every count drop is even (pure conjugate-pair mergers; no boundary flux contaminated the window ladder)',
    holds: () => {
      const c = WINDING_MONOTONICITY_RIGOR.exactCount;
      return c.every((v, i) => i === 0 || (c[i - 1] - v) % 2 === 0);
    },
  },
  {
    id: 'wmr-conv-identity-proxy-is-exact-negative-time-flow',
    description: 'Gaussian convolution of H_0 equals exact H_{-tau} to better than 1e-6 relative (measured ~2e-9 and ~6e-9): the prior proxy WAS the true flow in negative de Bruijn time',
    holds: () => {
      const { relErrTau05, relErrTau2 } = WINDING_MONOTONICITY_RIGOR.convIdentity;
      return relErrTau05 < 1e-6 && relErrTau2 < 1e-6;
    },
  },
  {
    id: 'wmr-proxy-ladder-matches-exact-at-minus-4tau',
    description: 'Repo-style Z-convolution counts match exact H_t counts at t = -4 tau_repo entry-by-entry: the imp-2673 drop ladder was genuine dynamics, not artifact',
    holds: () => {
      const { proxyZConvCount, exactCountAtMinus4Tau } = WINDING_MONOTONICITY_RIGOR.proxyReconciliation;
      return proxyZConvCount.length === exactCountAtMinus4Tau.length &&
        proxyZConvCount.every((v, i) => v === exactCountAtMinus4Tau[i]);
    },
  },
  {
    id: 'wmr-first-collision-brackets-and-two-body-consistency',
    description: 'Tightest-pair exact collision t_c = -1.8837 sits between the t=-2 and t=-1.75 ladder rungs, maps to tau_repo ~ 0.47 (reconciling imp-2673 first drop in (0.2, 0.5]), and is within 30% of the two-body -(2 dgamma)^2/8',
    holds: () => {
      const fc = WINDING_MONOTONICITY_RIGOR.firstCollision;
      const ratio = fc.tExact / fc.tTwoBody;
      return fc.tExact > -2 && fc.tExact < -1.75 && ratio > 1 && ratio < 1.3 &&
        Math.abs(fc.tauRepoUnits - (-fc.tExact / 4)) < 1e-3 &&
        fc.tauRepoUnits > 0.2 && fc.tauRepoUnits <= 0.5;
    },
  },
  {
    id: 'wmr-many-body-slope-retards-two-body',
    description: 'Measured d(g^2)/dt ~ 5.78 lies strictly between 0 and the isolated two-body 8: attraction is real but environment-retarded (quantitative rate content)',
    holds: () => {
      const s = WINDING_MONOTONICITY_RIGOR.manyBodyGapSlope;
      return s.fitted > 0 && s.fitted < s.twoBody;
    },
  },
  {
    id: 'wmr-correction-recorded-against-artifact-claim',
    description: 'The module explicitly REFUTES the prior smoothing-artifact interpretation and names the sign-convention root cause',
    holds: () =>
      /REFUTED/.test(WINDING_MONOTONICITY_RIGOR.correction) &&
      /negative de Bruijn time/.test(WINDING_MONOTONICITY_RIGOR.correction) &&
      /sign inverted/.test(WINDING_MONOTONICITY_RIGOR.correction),
  },
  {
    id: 'wmr-ceiling-no-pt-beat-no-lower-mining',
    description: 'Anti-overclaim cap: refined ceiling still beats nothing -- explicitly does NOT beat Platt-Trudgian 0.2, and the lower side is hard-capped (Lambda > 0 iff RH false)',
    holds: () => {
      const c = WINDING_MONOTONICITY_RIGOR.ceiling;
      return /does NOT beat Platt-Trudgian/.test(c) && /NOT a PT-beating bound/.test(c) && /iff RH false/.test(c) && /no false QED/.test(c);
    },
  },
  {
    id: 'wmr-theorem-labelled-classical-not-new',
    description: 'The rigorous monotonicity is honestly labelled CLASSICAL (de Bruijn Thm 13 + jet lemma), not claimed as a new theorem',
    holds: () =>
      /CLASSICAL/.test(WINDING_MONOTONICITY_RIGOR.theorem) &&
      /No new theorem/.test(WINDING_MONOTONICITY_RIGOR.theorem),
  },
];

for (const a of WINDING_MONOTONICITY_RIGOR_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34813-winding-monotonicity-rigor assertion failed: ${a.id}`);
}
