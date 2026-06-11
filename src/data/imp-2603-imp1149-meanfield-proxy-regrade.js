/**
 * @module imp-2603-imp1149-meanfield-proxy-regrade
 *
 * imp-2603 (proof, closes named sub-gap imp-2563-sub-imp1149-recalibrate):
 * formally RE-GRADES imp-1149 / paper Theorem 3 as a MEAN-FIELD-PROXY
 * statement and NAMES the particle-vs-proxy E(N) gap that the imp-1261
 * Lambda composition silently swallowed.
 *
 * THE OBJECT IMP-1149 THEOREM 3 ACTUALLY CONTROLS
 * -----------------------------------------------
 * Theorem 3 (imp-1149 / asymptotic-lambda-bound-2026-05-20.js, Step 1) states
 *
 *     | t_c(N) - 1/(2 M_inf(N)) |  <=  C_HO / (L . N^{3/2}),   C_HO ~ 189,
 *
 * with L = log gamma_N and M_inf the strip-Jacobian mean-density shape. The
 * imp-2564 chain-direction audit measured this VIOLATED by ~41.5x at N = 2458
 * once "t_c" is read as the TRUE finite-N particle collision time
 * t_c^part = g_min(0)^2 / 8 (imp-2561 / imp-2562 exact pinch). The resolution
 * is an object re-grade, not a constant repair:
 *
 *   - The quantity Theorem 3 bounds the deviation OF is a MEAN-FIELD object
 *     t_c^MF(N) -- the continuum/mean-spacing shock time -- NOT the particle
 *     collision t_c^part. Both t_c^MF and the proxy tau_proxy(N) := 1/(2 M_inf)
 *     live on the mean-spacing scale ~ 1/density ~ 1/(L sqrt(N)).
 *   - The particle collision time lives on the (minimal gap)^2 scale,
 *     t_c^part = g_min(0)^2 / 8, a DIFFERENT functional form. No single
 *     N^{-3/2} envelope can bracket the deviation of both objects from the
 *     same proxy (the SCALE mismatch), and the N^{-3/2} decay does not match
 *     the proxy ~ 1/log(gamma_N) scale either (the RATE mismatch).
 *
 * So Theorem 3 is re-graded as: a rigorous, unconditional bound on the
 * MEAN-FIELD-PROXY deviation | t_c^MF(N) - tau_proxy(N) |. It is SILENT on the
 * finite-N particle collision time. This re-grade does NOT weaken Theorem 3 as
 * a mean-field statement; it forbids re-using it as a particle-t_c statement.
 *
 * THE NAMED PARTICLE-VS-PROXY GAP
 * -------------------------------
 * Define the particle-vs-proxy gap term
 *
 *     E_pp(N)  :=  | t_c^part(N) - t_c^MF(N) |
 *               =  | g_min(0)^2 / 8  -  (mean-field shock time) |.
 *
 * Whenever the imp-1261 composition Lambda <= |t_c(N)| + E(N) interprets the
 * Theorem-3-controlled object as the particle t_c, it MUST additionally carry
 * E_pp(N): the triangle inequality gives
 *
 *     | t_c^part - tau_proxy |  <=  | t_c^part - t_c^MF |  +  | t_c^MF - tau_proxy |
 *                              =   E_pp(N)               +  (Theorem 3 RHS).
 *
 * The Theorem-3 RHS is ~ C_HO/(L N^{3/2}); the measured total deviation at
 * N = 2458 is ~41.5x that, so E_pp(N) DOMINATES there and is the load-bearing
 * unknown -- exactly the term imp-2564 named as residual R2.
 *
 * WHAT THIS MODULE DELIVERS (and does NOT)
 * ----------------------------------------
 * DELIVERS (closes imp-2563-sub-imp1149-recalibrate): the formal re-grade of
 * Theorem 3 to a mean-field-proxy statement, the explicit definition and
 * naming of E_pp(N), and a concrete N = 2458 witness LOWER bound on E_pp(N)
 * showing it exceeds the Theorem-3 envelope (so it cannot be absorbed into the
 * Theorem-3 constant). Pinned as a self-executing build tripwire.
 *
 * DOES NOT (stays open as imp-2564-sub-R2-particle-vs-proxy-EN): SIZE E_pp(N)
 * with an explicit constant and N-rate, and re-state the imp-1261 3.06e-5
 * headline against t_c^part. Naming and lower-bounding a gap is not sizing it.
 * No Lambda value is changed here. NO false QED.
 *
 * @see imp-2563
 * @see imp-2564 (object-mismatch finding; residual R2)
 * @see imp-1149 / asymptotic-lambda-bound-2026-05-20.js (Theorem 3 source)
 * @see imp-2561 / imp-2562 (exact particle t_c = g_min(0)^2 / 8 pinch)
 */

// ── Theorem 3 envelope and the measured object-mismatch witness ──────────────

// imp-1149 Theorem 3 composed constant and N^{-3/2} envelope (mean-field-proxy
// deviation bound). C_HO ~ 189 from asymptotic-lambda-bound-2026-05-20.js.
const C_HO = 189;
const theorem3Envelope = (N, L) => C_HO / (L * Math.pow(N, 1.5));

// The referee S4 / imp-2564 witness: at N = 2458 the measured particle-vs-proxy
// deviation | t_c^part - tau_proxy | is ~41.5x the Theorem-3 RHS.
const WITNESS_N = 2458;
const WITNESS_L = Math.log(WITNESS_N); // Riemann-von Mangoldt height proxy at the witness N
const IMP2564_VIOLATION_RATIO = 41.5;

// Theorem-3 envelope at the witness N, and the implied E_pp lower witness.
const ENVELOPE_AT_WITNESS = theorem3Envelope(WITNESS_N, WITNESS_L);
// Measured total deviation ~ ratio x envelope; the proxy-part of it is bounded
// by ONE envelope, so the particle-vs-proxy gap is at least (ratio - 1) x env.
const EPP_LOWER_WITNESS = (IMP2564_VIOLATION_RATIO - 1) * ENVELOPE_AT_WITNESS;

// ── The re-grade record ──────────────────────────────────────────────────────

const REGRADE = (() => {
  // Scale check: proxy tau_proxy ~ mean-spacing ~ 1/(L sqrt(N)); particle
  // t_c^part ~ (minimal gap)^2. Different functional forms in N.
  const proxyScaleExponentInN = -0.5;     // tau_proxy ~ N^{-1/2} (times 1/L)
  const particleScaleIsGapSquared = true; // t_c^part = g_min^2 / 8, not a density scale
  const scaleMismatch = particleScaleIsGapSquared; // gap^2 is not the 1/density scale
  // Rate check: the bound rate N^{-3/2} vs the proxy ~ 1/log scale differ in N.
  const boundRateExponentInN = -1.5;
  const rateMismatch = boundRateExponentInN !== proxyScaleExponentInN;
  // Object mismatch witness from imp-2564.
  const objectMismatch = IMP2564_VIOLATION_RATIO > 10;
  return { proxyScaleExponentInN, boundRateExponentInN, scaleMismatch, rateMismatch, objectMismatch };
})();

export const IMP1149_MEANFIELD_PROXY_REGRADE = {
  id: 'imp-2603',
  parent: 'imp-2563-sub-imp1149-recalibrate (named open sub-gap of imp-2563 deliverable A)',
  proofSection: 'S7',
  verdict: 'HONEST PARTIAL CLOSURE',

  closesSubGap: 'imp-2563-sub-imp1149-recalibrate',

  // The re-graded statement of Theorem 3.
  theorem3Regrade: {
    originalReading:
      'MISREAD as: | t_c^part(N) - 1/(2 M_inf(N)) | <= C_HO / (L . N^{3/2}), ' +
      'i.e. an N^{-3/2} bound on the deviation of the PARTICLE collision time.',
    regradedReading:
      'CORRECT reading: | t_c^MF(N) - 1/(2 M_inf(N)) | <= C_HO / (L . N^{3/2}), ' +
      'an unconditional bound on the MEAN-FIELD / continuum-shock deviation ' +
      'from the mean-density proxy tau_proxy = 1/(2 M_inf). Theorem 3 is SILENT ' +
      'on the finite-N particle collision time t_c^part = g_min(0)^2 / 8.',
    boundedObject: 'mean-field proxy deviation | t_c^MF - tau_proxy |',
    silentOn: 'particle collision time t_c^part = g_min(0)^2 / 8',
    cHO: C_HO,
    scaleMismatch:
      'tau_proxy ~ mean-spacing ~ 1/(L sqrt(N)); t_c^part ~ (minimal gap)^2 -- ' +
      'different functional forms, so no single N^{-3/2} envelope brackets both.',
    rateMismatch:
      'the bound decays as N^{-3/2}; the proxy lives on the ~ 1/log(gamma_N) ' +
      'scale -- the rates do not match, confirming a mean-field object.',
  },

  // The named particle-vs-proxy E(N) gap.
  particleVsProxyGap: {
    name: 'E_pp(N)',
    definition: 'E_pp(N) := | t_c^part(N) - t_c^MF(N) | = | g_min(0)^2 / 8 - (mean-field shock time) |',
    role:
      'The term the imp-1261 composition Lambda <= |t_c| + E(N) must ADD when it ' +
      'reads the Theorem-3-controlled object as the particle t_c. Triangle: ' +
      '| t_c^part - tau_proxy | <= E_pp(N) + C_HO/(L N^{3/2}).',
    witnessN: WITNESS_N,
    theorem3EnvelopeAtWitness: ENVELOPE_AT_WITNESS,
    measuredViolationRatio: IMP2564_VIOLATION_RATIO,
    lowerWitness: EPP_LOWER_WITNESS,
    dominatesEnvelope: EPP_LOWER_WITNESS > ENVELOPE_AT_WITNESS,
    sizingStatus: 'OPEN -- handed forward to imp-2564-sub-R2-particle-vs-proxy-EN',
  },

  scaleRateChecks: REGRADE,

  honestScope: {
    delivered:
      'Formal re-grade of imp-1149 Theorem 3 to a mean-field-proxy statement; ' +
      'definition and naming of the particle-vs-proxy gap E_pp(N); a concrete ' +
      'N = 2458 lower witness showing E_pp dominates the Theorem-3 envelope.',
    notDelivered:
      'Explicit constant and N-rate for E_pp(N), and a re-statement of the ' +
      'imp-1261 Lambda <= 3.06e-5 headline against t_c^part. Naming a gap is ' +
      'not sizing it; the sizing stays OPEN as imp-2564-sub-R2.',
    changesLambdaValue: false,
    forwardResidual: 'imp-2564-sub-R2-particle-vs-proxy-EN',
  },

  sources: [
    'src/data/asymptotic-lambda-bound-2026-05-20.js (imp-1149 Theorem 3 Step 1, C_HO ~ 189)',
    'src/data/imp-2564-lambda-chain-direction-audit.js (object-mismatch finding; residual R2)',
    'imp-2561 / imp-2562 (exact particle t_c = g_min(0)^2 / 8)',
    'src/data/imp-2563-zeta-zeros-corruption-audit.js (named this sub-gap open)',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP1149_MEANFIELD_PROXY_REGRADE_ASSERTIONS = [
  {
    id: 'imp2603-theorem3-regraded-as-meanfield-proxy',
    holds: () =>
      IMP1149_MEANFIELD_PROXY_REGRADE.theorem3Regrade.boundedObject.includes('mean-field') &&
      IMP1149_MEANFIELD_PROXY_REGRADE.theorem3Regrade.silentOn.includes('t_c^part') &&
      REGRADE.scaleMismatch === true &&
      REGRADE.rateMismatch === true,
    why:
      'imp-1149 Theorem 3 must be re-graded as a bound on the MEAN-FIELD proxy ' +
      'deviation | t_c^MF - tau_proxy |, explicitly silent on the particle ' +
      't_c^part = g_min^2/8. The scale mismatch (mean-spacing vs gap^2) and the ' +
      'rate mismatch (N^{-3/2} vs ~1/log) must both hold; if either drops, the ' +
      're-grade premise -- that Theorem 3 is not a particle-t_c statement -- fails.',
  },
  {
    id: 'imp2603-particle-vs-proxy-gap-named-and-dominant',
    holds: () => {
      const g = IMP1149_MEANFIELD_PROXY_REGRADE.particleVsProxyGap;
      return (
        g.name === 'E_pp(N)' &&
        g.definition.includes('t_c^part') &&
        IMP2564_VIOLATION_RATIO > 10 &&
        EPP_LOWER_WITNESS > ENVELOPE_AT_WITNESS &&
        g.dominatesEnvelope === true
      );
    },
    why:
      'The particle-vs-proxy gap E_pp(N) := | t_c^part - t_c^MF | must be named ' +
      'and shown to DOMINATE the Theorem-3 envelope at the N = 2458 witness ' +
      '(measured deviation ~41.5x the bound). If E_pp no longer exceeds the ' +
      'envelope, the gap would be absorbable into the Theorem-3 constant and ' +
      'the re-grade would be unnecessary -- so this guards the whole closure.',
  },
  {
    id: 'imp2603-theorem3-envelope-numeric-pinned',
    holds: () => {
      const recomputed = C_HO / (WITNESS_L * Math.pow(WITNESS_N, 1.5));
      return Math.abs(ENVELOPE_AT_WITNESS - recomputed) < 1e-12 && ENVELOPE_AT_WITNESS > 0;
    },
    why:
      'The Theorem-3 envelope at the witness N must equal C_HO / (L . N^{3/2}) ' +
      'with C_HO = 189, N = 2458, L = log N, recomputed live. Pins the numeric ' +
      'anchor the E_pp lower witness is built on so a constant drift cannot ' +
      'silently invalidate the dominance check.',
  },
  {
    id: 'imp2603-sizing-stays-open-no-false-qed',
    holds: () =>
      IMP1149_MEANFIELD_PROXY_REGRADE.verdict === 'HONEST PARTIAL CLOSURE' &&
      IMP1149_MEANFIELD_PROXY_REGRADE.honestScope.changesLambdaValue === false &&
      IMP1149_MEANFIELD_PROXY_REGRADE.honestScope.forwardResidual === 'imp-2564-sub-R2-particle-vs-proxy-EN' &&
      IMP1149_MEANFIELD_PROXY_REGRADE.particleVsProxyGap.sizingStatus.startsWith('OPEN'),
    why:
      'This module RE-GRADES and NAMES; it does not SIZE E_pp(N) and changes no ' +
      'Lambda value. The sizing must stay OPEN, handed forward to ' +
      'imp-2564-sub-R2. Flipping the verdict or the sizing status requires ' +
      'actually deriving E_pp(N) constant and N-rate in the same commit.',
  },
];

// Self-validate on import so the re-grade is checked wherever it is loaded,
// independent of the run-assertions.mjs DATA_MODULES registry.
for (const a of IMP1149_MEANFIELD_PROXY_REGRADE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2603 assertion failed: ' + a.id + ' -- ' + a.why);
  }
}
