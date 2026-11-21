/**
 * @module imp-97138-richer-family-tail-edge-viz-data
 * @fileoverview imp-97138 -- chart-ready record of the RICHER-DESIGN-FAMILY test of the
 *   imp-97099 frozen tail-edge guard residual at 2a=1.00. imp-97099 established that the
 *   imp-97055 KMAX=5 cutting-plane at 2a=1.00, FINEH=3e-5 GENUINELY STALLS at a negative
 *   fixed point (worst guarded residual frozen at -0.0043937 at t=37.809 over the last ~60
 *   of 111 rounds), and attributed the limit to the point-selection/guard ITERATION at the
 *   tail-edge dip, NOT arithmetic precision; imp-97090 called for a RICHER design family.
 *
 *   This bakes the MEASURED outcomes of running the identical EXACT pole-free Toeplitz form
 *   sigma_2(t)=(t^2+1/4)^2 w_1(t) + second-order between-grid guard + cutting-plane with a
 *   PARAMETRISED atom family (higher polynomial degree KMAX and an alternate both-cos-and-sin
 *   trig basis), transcribed verbatim from the tmp run logs. VERDICT: none of the richer
 *   families clears the frozen guard -- the negative fixed point PERSISTS and in fact
 *   WORSENS. Higher polynomial degree (KMAX=7) settles at a similar-or-worse negative
 *   residual (and oscillates in a much wider band at 3e-5), and the alternate trig basis is
 *   also worse. This is a MEASUREMENT only: the certified interval-rigorous reach stays
 *   EXACTLY 2a<=0.96; no operator positivity is established; no bound moves; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97099 (parent: frozen negative fixed point -0.0043937 at t=37.809, KMAX=5, 3e-5)
 * @see imp-97090 (parent: structural tail-edge dip needs a richer design family)
 * @see imp-97055 (source solver: windowed/edge-weighted kmax=5 cutting-plane)
 */

// KMAX=5 baseline reproduced at FINEH=3e-5: the imp-97099 frozen fixed point. The worst
// guarded residual settles at -0.004394 at t=37.809 and holds flat across rounds 50/55/60/65
// (transcribed from tmp/imp-97138-kmax5.log; matches the imp-97099 -0.0043937 value).
export const IMP97138_BASELINE = Object.freeze({
  family: 'STD', kmax: 5, basis: 'parity', fineh: 3e-5,
  frozenWorst: -0.004394, frozenAt: 37.809, cleared: false, flag: 'measured',
  note: 'imp-97099 frozen negative fixed point reproduced (flat at r50/r55/r60/r65)',
});

// Richer-family outcomes. Each row = one design family driven by the identical guard +
// cutting-plane at 2a=1.00. finalWorst is the last-round worst guarded residual; a residual
// >= 0 would be a guard-clearing certificate. NONE reach >= 0.
export const IMP97138_FAMILY_ROWS = Object.freeze([
  // KMAX=5 parity, FINEH=1e-4, 45 rounds -- baseline at the coarser imp-97055 grid.
  Object.freeze({ family: 'STD', kmax: 5, basis: 'parity', fineh: 1e-4, rounds: 45,
    finalWorst: -0.007665, finalAt: 37.809, cleared: false, flag: 'measured' }),
  // KMAX=7 parity (higher polynomial degree), FINEH=1e-4, 45 rounds -- WORSE than KMAX=5.
  Object.freeze({ family: 'STD', kmax: 7, basis: 'parity', fineh: 1e-4, rounds: 45,
    finalWorst: -0.019873, finalAt: 33.707, cleared: false, flag: 'measured' }),
  // KMAX=5 alternate both-cos-and-sin (half) trig basis, FINEH=1e-4 -- also WORSE.
  Object.freeze({ family: 'DUAL', kmax: 5, basis: 'both', fineh: 1e-4, rounds: 8,
    finalWorst: -0.012995, finalAt: 30.768, cleared: false, flag: 'measured' }),
]);

// KMAX=7 at FINEH=3e-5 does not even settle to a clean fixed point: it oscillates between
// guard-satisfying rounds (worst ~ -0.018 to -0.044) and guard-blowup rounds (worst ~ -4.1
// to -4.35, minF < 0), through round 35 -- a strictly worse and less-stable trajectory than
// the KMAX=5 flat -0.004394. Transcribed from tmp/imp-97138-kmax7.log (partial run, r0..r35).
export const IMP97138_KMAX7_3E5_BAND = Object.freeze({
  family: 'STD', kmax: 7, basis: 'parity', fineh: 3e-5, roundsObserved: 35,
  bandLo: -4.352, bandHi: -0.01826, cleared: false, settled: false, flag: 'measured-partial',
  note: 'oscillates; never approaches the guard, strictly worse than the KMAX=5 fixed point',
});

// Chart-ready worst-residual comparison bars (more-negative = further from a certificate).
export const IMP97138_COMPARISON_BARS = Object.freeze([
  Object.freeze({ key: 'k5', label: 'KMAX=5 parity (baseline)', value: -0.004394, cleared: false, color: '#4ade80' }),
  Object.freeze({ key: 'k7', label: 'KMAX=7 parity (richer degree)', value: -0.019873, cleared: false, color: '#f87171' }),
  Object.freeze({ key: 'dual5', label: 'KMAX=5 both-trig (richer basis)', value: -0.012995, cleared: false, color: '#fb923c' }),
]);

export const IMP97138_VERDICT = Object.freeze({
  ticket: 'imp-97138',
  sourceTickets: ['imp-97099', 'imp-97090', 'imp-97055'],
  twoA: 1.0,
  baselineFrozenWorst: -0.004394,
  richerFamilyClearedGuard: false,
  anyBoundMoved: false,
  certifiedReachTwoA: 0.96,
  note:
    'a richer design family does NOT clear the imp-97099 frozen tail-edge guard residual at ' +
    '2a=1.00: higher polynomial degree (KMAX=7) settles WORSE (-0.019873 vs -0.007665 at 1e-4, ' +
    'and oscillates in a [-4.35, -0.018] band at 3e-5), and the alternate both-cos-and-sin trig ' +
    'basis is also worse (-0.012995). The negative fixed point PERSISTS across every enrichment ' +
    'tried, so degree/basis richness alone does not resolve the structural tail-edge dip. ' +
    'Measurement only; certified interval-rigorous reach stays EXACTLY 2a<=0.96; no operator ' +
    'positivity; no bound moves; no refereed bound is changed; RH open; NO QED.',
});

export default IMP97138_VERDICT;
