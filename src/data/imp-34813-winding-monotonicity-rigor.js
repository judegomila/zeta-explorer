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
 *        (computational, not topological, bottleneck). No refereed bound is changed.
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
 * @see scripts/imp-34816-conv-identity-scaling-offline.mjs (imp-34816 conv-identity error scaling)
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
  multiPairCollisionCensus: {
    // imp-34815. Section C measured the exact first-collision t_c for the tightest
    // pair only. Section H extends it to every window count-drop (10->8->6->4->2),
    // bisecting each collision time and comparing to the two-body prediction
    // t_2b = -(gap_x)^2/8 (gap_x = 2 dgamma at t=0). Offline solver section H of
    // scripts/imp-34813-exact-debruijn-winding-offline.mjs.
    // CLEAN subset -- the two tightest, well-separated collisions whose merging
    // pair sits in an unreorganized part of the window (t=0 proximity match reliable):
    clean: [
      { drop: '10->8', tExact: -1.8782, mergeX: 99.259, gapX: 3.5383, tTwoBody: -1.5649, retard: 1.2002 },
      { drop: '8->6', tExact: -3.9548, mergeX: 66.140, gapX: 5.0204, tTwoBody: -3.1505, retard: 1.2553 },
    ],
    retardGrowsWithSpacing: true, // 1.200 (gap 3.54) -> 1.255 (gap 5.02): wider pairs retard MORE
    // Later rungs are NOT per-pair-attributable by this meter and are reported as a caveat,
    // not a measurement: the 8->6 and 6->4 events cluster within ~0.08 in t (the tc+0.08
    // probe cannot separate them; both localize to x~66), the 4->2 match falls on a
    // reorganized region (apparent retard 0.85 < 1 is a mis-attribution artifact, not
    // physical acceleration), and the count->1 rung is ODD (a zero exits the window through
    // the x-boundary at t < -20, not a conjugate-pair merge).
    subGap:
      'Robust per-pair attribution of the exact-flow collision census BEYOND the first two window collisions is OPEN: it needs zero-trajectory continuation (following each real zero forward from t=0) rather than t=0 midpoint-proximity matching, plus a widened window to eliminate boundary flux. Only the two tightest well-separated pairs are cleanly measured here.',
    verdict:
      'The two tightest window pairs both collide LATER (|t_c| larger) than their isolated two-body prediction, by a retardation factor 1.20 and 1.26 that GROWS mildly with pair spacing -- confirming and extending the imp-34813 tightest-pair 5.78-vs-8 slope finding to a second pair. Measurement only; changes no bound; NO QED; no refereed bound is changed.',
  },
  continuationAttribution: {
    // imp-34841. Closes the multiPairCollisionCensus SUB-GAP: replaces section H's
    // t=0 midpoint-proximity matching (clean for only the two tightest well-separated
    // pairs) with ORDER-CONTINUATION -- follow each labelled t=0 zero forward along
    // decreasing t, recomputing the FULL sorted real-zero list on the exact grid at
    // each step, and attribute every count drop to the adjacent-label pair picked by
    // the order-preserving displacement match (drop 2 = conjugate-pair merge, drop 1 =
    // boundary exit, a step dropping >2 is SUBDIVIDED to isolate clustered events).
    // Real simple zeros keep their left-to-right order, so attribution is unambiguous
    // with NO proximity guess. Offline solver section I of
    // scripts/imp-34813-exact-debruijn-winding-offline.mjs.
    method:
      'order-continuation on the exact grid (grid-detect + Newton polish per step, order-preserving displacement match on each count drop); an earlier independent-Newton-from-previous prototype was REJECTED -- it mis-tracks near collisions (H_x -> 0 destabilizes the solve, giving label-order inversions and zeros walking past the window edge)',
    window: [20, 104],
    tcResolutionInT: 0.05, // coarse BASE_DT bracket; the value-add is ATTRIBUTION, not a sharper t_c than section C/H bisection
    // Every window merger now attributed to a SPECIFIC labelled pair (4 total vs section H's 2 clean):
    merges: [
      { pair: 'gamma_9,gamma_10', tc: -1.925, gapX: 3.5374, tTwoBody: -1.5641, retard: 1.2307 },
      { pair: 'gamma_4,gamma_5', tc: -4.025, gapX: 5.0204, tTwoBody: -3.1505, retard: 1.2776 },
      { pair: 'gamma_7,gamma_8', tc: -4.075, gapX: 4.8167, tTwoBody: -2.9001, retard: 1.4051 }, // NEW: the x~66 cluster section H could not separate from 8->6
      { pair: 'gamma_2,gamma_3', tc: -12.525, gapX: 7.9776, tTwoBody: -7.9553, retard: 1.5744 }, // NEW: corrects section H 4->2 mis-attribution (its apparent retard 0.85 < 1 was a wrong-pair artifact)
    ],
    boundaryExit: { pair: 'gamma_6', tc: -34.925 }, // the count->1 rung is a boundary exit, NOT a merge; corrects section H's spurious retard 6.28
    survivor: 'gamma_1',
    additionalMergesBeyondSectionH: 2, // 4 cleanly attributed vs section H's 2-clean subset
    retardLadder: [1.2307, 1.2776, 1.4051, 1.5744], // MONOTONE-increasing with collision depth: extends imp-34815 "retard grows with spacing" from 2 to all 4 pairs
    boundaryFluxSensitivity: {
      // Ticket hypothesis was that a WIDENED window eliminates boundary flux. REFUTED:
      widenedWindow: [12, 112],
      seedZeros: 11,
      inflowStopsAtT: -3.6, // a zero migrates IN from x>112, count INCREASES -> order-continuation halts (attributes only gamma_9,gamma_10 before the in-flux)
      finding:
        'widening does NOT eliminate boundary flux -- it introduces boundary IN-flux (a zero enters from x>112) as early as t~-3.6, well before most merges, halting order-continuation. The BASE window [20,104] is the cleaner instrument: its sole boundary event is a DEEP exit (gamma_6 at t~-34.9), leaving all four interior merges cleanly attributable.',
    },
    verdict:
      'Order-continuation cleanly attributes ALL FOUR base-window conjugate-pair mergers to specific labelled pairs (2 more than section H proximity matching), with a retardation ladder 1.23 -> 1.28 -> 1.41 -> 1.57 that stays > 1 and grows MONOTONICALLY with collision depth -- and it correctly reads the count->1 rung as a boundary EXIT of gamma_6, dissolving the section-H spurious retard 0.85 (4->2 mis-attribution) and 6.28 (boundary-as-merge) artifacts. Widening the window does not clean up the flux; it merely trades a deep exit for an early in-flux. Cross-validation instrument only; changes no bound; NO QED; no refereed bound is changed.',
  },
  thm13LandingBound: {
    // imp-34866. The imp-34813 (L2) de Bruijn 1950 Thm 13 landing bound (zeros in
    // |Im z| <= Delta at t0 are all REAL by t0 + Delta^2/2) had never been COMPARED
    // to the exact-flow measured collision (landing) time. This measures both sides
    // on the exact H_t integral (no proxy): t_land by real-zero-count bisection, and
    // Delta(t0) = max |Im z| over the window by complex-plane Newton on H_{t0}(z)
    // (H(z)=int w(u)cos(zu)du, H'(z)=-int w(u)u sin(zu)du; validated by the scale-free
    // residual |H(z)| / sum|w cosh|, ~1e-17 at a genuine zero). Offline solver
    // scripts/imp-34866-thm13-landing-bound-offline.mjs.
    tLand: -1.87842, // exact all-real (last-pair = tightest gamma_9,gamma_10 landing) time; consistent with firstCollision.tExact/continuation -1.925
    // WINDOW-WIDE bound (Delta = max |Im z| over ALL complex pairs at t0), CLEAN rows
    // (complex-zero census complete: pair count = (10 - realCount)/2, no boundary drift):
    window: [
      { t0: -2.5, nPairs: 1, delta: 1.1450, bound: -1.8445, gap: 0.0339 },
      { t0: -3.0, nPairs: 1, delta: 1.5837, bound: -1.7459, gap: 0.1325 },
      { t0: -4.0, nPairs: 2, delta: 2.2916, bound: -1.3743, gap: 0.5041 },
      { t0: -6.0, nPairs: 3, delta: 3.5419, bound: 0.2724, gap: 2.1509 },
    ],
    // SINGLE-PAIR bound tracking ONLY the shallowest (last-to-land) gamma_9,gamma_10
    // pair (complex zero near x ~ 99), whose imaginary part alone governs its landing:
    singlePair: [
      { t0: -2.1, z: '99.514 + 0.6757i', delta: 0.6757, bound: -1.8717, gap: 0.0067 },
      { t0: -2.5, z: '99.850 + 1.1530i', delta: 1.1530, bound: -1.8353, gap: 0.0431 },
      { t0: -3.0, z: '100.272 + 1.5901i', delta: 1.5901, bound: -1.7358, gap: 0.1426 },
      { t0: -4.0, z: '101.132 + 2.2924i', delta: 2.2924, bound: -1.3724, gap: 0.5061 },
    ],
    boundaryArtifact: {
      // The t0 = -8 window row reads found/expected = 2/3 pairs and an apparent
      // gap -0.46 < 0. NOT a Thm 13 violation: the OLDEST complex pair (gamma_9,
      // gamma_10, off the line since t~-1.9) has drifted in Re z PAST the x = 104
      // window edge, so it is dropped from the window max and the census is
      // INCOMPLETE. This is the imp-34813 continuationAttribution boundary-flux
      // phenomenon seen in the COMPLEX plane; the row is flagged INCOMPLETE, not
      // counted as a bound comparison.
      t0: -8, found: 2, expected: 3, note: 'oldest pair drifted past x=104; window Delta incomplete; NOT a Thm 13 failure',
    },
    subGap:
      'A trustworthy full-window max-|Im z| census at DEEP t0 (t0 <~ -8) is OPEN: the oldest complex pairs drift out of the fixed x-window and grid-seeded complex Newton stalls at the ~1e-17 quadrature roundoff floor (positions good to ~1e-2 only). A boundary-tracking window (following each pair in Re z) or an argument-principle zero count on a widening contour is needed to certify the deep-t0 window Delta; only t0 in [-6, -2.1] is cleanly measured here.',
    verdict:
      'The exact-flow last-pair landing time t_land = -1.878 satisfies the de Bruijn Thm 13 bound t0 + Delta^2/2 on every CLEAN reference time (gap >= 0 throughout). The WINDOW-WIDE bound is dominated by the single DEEPEST complex pair, so its slack grows steeply with |t0| (gap 0.034 at t0=-2.5 to 2.151 at t0=-6 -- at t0=-6 the classical bound only certifies all-real by t~+0.27, 2.15 later than the true -1.878). The SINGLE-PAIR bound for the shallowest (last-to-land) pair nearly SATURATES just below landing (gap 0.0067 at t0=-2.1, confirming near-isolated rate-2 landing) and its gap grows with depth as the many-body imaginary part exceeds the isolated rate-2 curve -- the same retardation the imp-34813 5.78-vs-8 slope records, now read on the imaginary axis. Measurement only; classical (de Bruijn 1950 Thm 13); establishes no new theorem; changes no bound; NO QED; no refereed bound is changed.',
  },
  convIdentity: {
    relErrTau05: 1.982e-9,
    relErrTau2: 6.085e-9,
    meaning: 'GaussianConv_{sqrt(2 tau)}(H_0) = H_{-tau} to ~1e-9: the imp-2673/2696 proxy computed the TRUE flow in negative de Bruijn time',
  },
  convIdentityScaling: {
    // imp-34816. Separates the recorded ~1e-9 conv-identity relErr into three
    // channels: discrete-convolution step h (Q), 6-sigma kernel-tail cut (T),
    // ext-grid edge cut (E). Offline solver imp-34816-conv-identity-scaling-offline.mjs
    // (reproduced the two recorded points EXACTLY: 1.982e-9 at tau=0.5, 6.085e-9 at tau=2).
    // (Q) step-h sweep at tau=2, 8-sigma kernel, interior x-band [40,84]:
    hSweepTau2: { h: [0.02, 0.01, 0.005, 0.0025], relErr: [2.735e-13, 2.761e-13, 2.762e-13, 2.769e-13] },
    hFloorRatio: 1.0, // successive-h relErr ratio; O(h^2) would give 4.0 -- so NOT an h-floor
    // (tau) sweep at fixed fine h=0.005, 8-sigma kernel, interior band:
    tauSweep: { tau: [0.25, 0.5, 1, 2, 4], relErr: [4.747e-13, 3.531e-13, 3.821e-13, 2.762e-13, 6.070e-13] },
    tauLogLogSlopeRange: [-0.468, 1.136], // brackets 0 -- no monotone tau-growth, sits at roundoff floor
    // (T) kernel-span sweep at tau=2, h=0.005, interior band -- the DOMINANT channel:
    spanSweep: { spanSigma: [4, 5, 6, 8, 10], relErr: [3.268e-4, 3.369e-6, 1.220e-8, 2.762e-13, 2.686e-13] },
    roundoffFloor: 3e-13,
    verdict:
      'NEITHER a Simpson step-h quadrature floor (relErr flat at ~2.76e-13 across h=0.02..0.0025, ratio ~1.0 not 4.0) NOR a genuine de Bruijn flow-identity tau-growth (at an 8-sigma kernel relErr sits at the ~3e-13 roundoff floor for all tau in [0.25,4], log-log slope brackets 0). The recorded ~1e-9..1e-8 numbers and their mild tau=0.5->2 rise are ENTIRELY the 6-sigma Gaussian-kernel TRUNCATION channel: relErr collapses 3.3e-4 -> 3.4e-6 -> 1.2e-8 -> 2.8e-13 as the kernel widens 4 -> 5 -> 6 -> 8 sigma. Proxy fidelity is NOT tau-limited: widening the convolution kernel to 8-sigma restores full double precision at every tau, confirming GaussConv = H_{-tau} exact to machine roundoff. Measurement only; no bound changed; NO QED.',
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
  routeMapAction: 'RANKED_OPPORTUNITIES #5 / originalIdeas winding row relabelled from UNDER-EXPLORED to closed (DEAD-END-FORNOW with corrected interpretation)',
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
    id: 'wmr-conv-identity-error-is-kernel-truncation-not-h-floor-not-tau-growth',
    description: 'imp-34816: the conv-identity relErr is dominated by the 6-sigma kernel-truncation channel, NOT a step-h quadrature floor (flat in h, ratio ~1 not 4) and NOT genuine tau-growth (at 8-sigma it sits at the ~3e-13 roundoff floor for all tau, so the identity is exact to machine precision)',
    holds: () => {
      const s = WINDING_MONOTONICITY_RIGOR.convIdentityScaling;
      // step-h flat: max/min over the h-sweep within a small factor of 1 (no O(h^2) decay)
      const maxH = Math.max(...s.hSweepTau2.relErr), minH = Math.min(...s.hSweepTau2.relErr);
      const hFlat = maxH / minH < 1.1;
      // 8-sigma tau-sweep all at the roundoff floor (no tau-growth beyond it)
      const tauFloored = s.tauSweep.relErr.every((r) => r < s.roundoffFloor * 3);
      // truncation channel dominant: 6-sigma error >> 8-sigma error by many orders
      const idx6 = s.spanSweep.spanSigma.indexOf(6), idx8 = s.spanSweep.spanSigma.indexOf(8);
      const truncDominates = s.spanSweep.relErr[idx6] / s.spanSweep.relErr[idx8] > 1e3;
      return hFlat && tauFloored && truncDominates &&
        /NEITHER a Simpson step-h/.test(s.verdict) && /NO QED/.test(s.verdict);
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
    id: 'wmr-multi-pair-census-clean-subset-retards-and-grows',
    description: 'imp-34815: the exact collision census cleanly resolves the two tightest well-separated window pairs; both collide LATER than their two-body prediction (retard > 1) and the retardation GROWS with pair spacing (1.200 at gap 3.54 -> 1.255 at gap 5.02), with the later rungs honestly flagged as not per-pair-attributable (SUB-GAP)',
    holds: () => {
      const mc = WINDING_MONOTONICITY_RIGOR.multiPairCollisionCensus;
      const c = mc.clean;
      const allRetard = c.every((r) => r.retard > 1 && r.retard < 1.5 && r.tExact < r.tTwoBody);
      const consistentTwoBody = c.every((r) => Math.abs(-(r.gapX * r.gapX) / 8 - r.tTwoBody) < 1e-3);
      const grows = c.length >= 2 && c[1].gapX > c[0].gapX && c[1].retard > c[0].retard;
      return allRetard && consistentTwoBody && grows && mc.retardGrowsWithSpacing === true &&
        /OPEN/.test(mc.subGap) && /NO QED/.test(mc.verdict) && /refereed bound is changed/i.test(mc.verdict);
    },
  },
  {
    id: 'wmr-continuation-attribution-adds-merges-and-fixes-boundary-rung',
    description: 'imp-34841: order-continuation attributes all 4 base-window pair mergers (2 more than section H proximity matching), each retarded (retard > 1) with a MONOTONE-increasing ladder in collision depth, correctly reads the count->1 rung as a gamma_6 boundary exit (not the mis-attributed retard 6.28 merge), and shows a widened window does NOT eliminate boundary flux (it introduces in-flux far shallower than the base-window deep exit)',
    holds: () => {
      const ca = WINDING_MONOTONICITY_RIGOR.continuationAttribution;
      const r = ca.retardLadder;
      const allRetard = ca.merges.length === 4 && ca.merges.every((m) => m.retard > 1);
      const monotone = r.length === 4 && r.every((v, i) => i === 0 || v > r[i - 1]);
      const twoBodyOk = ca.merges.every((m) => Math.abs(-(m.gapX * m.gapX) / 8 - m.tTwoBody) < 2e-3);
      const addsTwo = ca.additionalMergesBeyondSectionH === 2;
      const boundaryFixed = ca.boundaryExit.pair === 'gamma_6' && ca.boundaryExit.tc < -30;
      // widening is NOT cleaner: its in-flux halt sits far shallower (less negative) than the base deep exit
      const widenNotClean = ca.boundaryFluxSensitivity.inflowStopsAtT > ca.boundaryExit.tc;
      return allRetard && monotone && twoBodyOk && addsTwo && boundaryFixed && widenNotClean &&
        /NO QED/.test(ca.verdict) && /refereed bound is changed/i.test(ca.verdict);
    },
  },
  {
    id: 'wmr-thm13-landing-bound-valid-and-single-pair-saturates',
    description: 'imp-34866: the exact last-pair landing time t_land = -1.878 satisfies the de Bruijn Thm 13 bound t0 + Delta^2/2 on every clean reference time (gap >= 0); the window-wide bound slack grows monotonically with |t0| (deepest-pair dominated), while the single-pair (shallowest, last-to-land) bound nearly SATURATES just below landing (gap < 0.02) and its gap also grows with depth (many-body imaginary part exceeds the isolated rate-2 curve)',
    holds: () => {
      const b = WINDING_MONOTONICITY_RIGOR.thm13LandingBound;
      const tLand = b.tLand;
      const landInWindow = tLand < -1.75 && tLand > -2.0; // between the count-10 and count-8 ladder rungs
      // every clean window row: bound is a VALID upper bound on the all-real time, with positive slack
      const winValid = b.window.every((r) => r.gap > 0 && r.bound >= tLand - 1e-6 &&
        Math.abs(r.bound - (r.t0 + (r.delta * r.delta) / 2)) < 5e-3);
      // window slack grows monotonically as t0 deepens (deepest-pair-dominated conservativeness)
      const winGrows = b.window.every((r, i) => i === 0 || (r.t0 < b.window[i - 1].t0 && r.gap > b.window[i - 1].gap));
      // single-pair bound: valid, near-saturates closest to landing, grows with depth
      const sp = b.singlePair;
      const spValid = sp.every((r) => r.gap >= 0 && r.bound >= tLand - 1e-6);
      const spSaturates = sp[0].gap < 0.02 && sp[0].t0 < tLand; // t0=-2.1 just below (more negative than) landing
      const spGrows = sp.every((r, i) => i === 0 || (r.t0 < sp[i - 1].t0 && r.gap > sp[i - 1].gap));
      // boundary artifact honestly flagged as incomplete census, not a Thm 13 failure
      const artifactFlagged = b.boundaryArtifact.found < b.boundaryArtifact.expected &&
        /NOT a Thm 13 failure/.test(b.boundaryArtifact.note);
      return landInWindow && winValid && winGrows && spValid && spSaturates && spGrows && artifactFlagged &&
        /OPEN/.test(b.subGap) && /NO QED/.test(b.verdict) && /refereed bound is changed/i.test(b.verdict);
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
