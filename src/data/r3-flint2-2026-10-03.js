/**
 * @fileoverview r3-flint2-2026-10-03 — second audit of FLINT 3.6.0 Platt/Turing (formalization/rh-verification-campaign/FLINT_AUDIT_2.md,
 * flint_audit_2/) and a re-certification of the 7.8e12 local RH window by a route that uses neither the Platt lemmas nor the Gram-block
 * criterion ("Route 2": Riemann–Siegel signs at every interval endpoint + Trudgian 2011 Thm 2.2 direct integral + parity).
 * One adversarial internal referee pass (tmp/r3-ref-flint2-*: unpatched public entry point, other chunking, prec 192, own Turing code,
 * mpmath cross-check of 604 RS signs): not refuted, minor; the window certificate independently reproduced.
 *
 * Referee corrections applied (also appended to FLINT_AUDIT_2.md in this synthesis):
 *  - The quoted Turing points (e.g. 7800000001111.4228515625) are 2^-10 renderings; tests ran at 128–131-bit dyadic endpoints. N also holds at
 *    the decimals (referee Z = +1.9707 / −76.795).
 *  - A.8, A.9, A.11 and the S-table binning stay single-reader (not used by Route 2).
 *  - The Gram-block gap also defeats Brent 1979's own final step (4 blocks over 5 Gram intervals at 3.26e7: 3.4542 < 3.6821); the sawtooth bound
 *    is attained exactly, so ≥ 10 unit blocks per side are needed and suffice at 7.8e12. PT21 uses Platt 2017's direct-integral form; its
 *    exposure is probably nil but NOT verified.
 *  - A.3 symmetrisation needs Im ψ(a + ib) < π/2 for a ≥ 1/2 (true: decreasing in a, (π/2)tanh(πb) at a = 1/2).
 *
 * PROVED (single reader + one referee): A.3 as printed is a factor π low (corrected C_true ≤ π((1+σ²/t0²)/2)^{(σ−1)/4} C_FLINT); A.6 Γ-ratio
 *  step for odd σ ≥ 5 (R_σ(0) = 2π/(σΓ(σ/2)²) = 32/45, 128/1575; fails at σ = 3, 8/3); A.5 needs B ≥ 2h√k; wrap patch valid; block-criterion
 *  GAP (explicit configuration with N(g_n) = n + 3 satisfying Trudgian's integral bound).
 * CERTIFIED: exactly 16,071 zeros with ordinate in (T1, T2] ⊇ [x_L/2, x_R/2], all simple and on the line; 21,665 in the original range;
 *  N(3000175332800) = 12,363,153,437,138. Trust base: FLINT acb_dirichlet_zeta_rs (Arias de Reyna Thm 4.2, unaudited), Arb, Trudgian Thm 2.2.
 * CONDITIONAL: every window or anchor certified only through FLINT's own Turing logic (1.65X window, other pilot anchors) rests on the GAP.
 * Verdict: see `verdict`. Import-free. ASSERTIONS recompute the A.3 correction factors, R_σ(0) by the Γ product, the A.5 margin, FLINT's
 *  Turing bound at 7.8e12, Trudgian's integral bound, the block-only requirement, and the zero counts.
 */

// Γ(σ/2)² for odd σ via Γ(1/2) = √π and Γ(x+1) = xΓ(x)
const gammaHalfOddSq = (s) => { let g = Math.sqrt(Math.PI); for (let x = 0.5; x < s / 2 - 1e-12; x += 1) g *= x; return g * g; };
const A3fac = (s, t0) => Math.PI * ((1 + (s * s) / (t0 * t0)) / 2) ** ((s - 1) / 4);

export const R3_FLINT2 = Object.freeze({
  id: 'r3-flint2-2026-10-03',
  date: '2026-10-03',
  title: 'FLINT 3.6.0 second audit: Gram-block Turing criterion GAP; 7.8e12 window re-certified by RS signs + direct-integral Turing test',
  status: 'CERTIFIED window by Route 2 (single-reader audit + one independent referee rerun; FLINT zeta_rs unaudited); new GAP in the Gram-block criterion. NO QED.',
  doc: 'formalization/rh-verification-campaign/FLINT_AUDIT_2.md',

  a3: Object.freeze({
    counterexamples: [[3, 100, 1.973434], [5, 1000, 1.220016], [7, 1e6, 1.110695], [7, 7.8e12, 1.11072]],
    pilot: { sigma: 25, t0: 7.8e12, ratio: 0.049087 },
    guard: { sigma: 9, t0: 27, factor: 0.9696 },
  }),
  a6: Object.freeze({ R0: { 3: 8 / 3, 5: 32 / 45, 7: 128 / 1575 } }),
  a5: Object.freeze({ h: 117.7396, k: 41, B: 4096 }),
  turing: Object.freeze({
    t: 7.8e12, flintBound: 6, trudgianA: 2.067, trudgianB: 0.059, trudgianBound: 3.8184,
    blockNeed: 16.92, minUnitBlocksPerSide: 10,
    config: { K6: 2.5101, K9: 3.5255, K10: 3.8639, sawtoothK10: 3.8357 },
    brent: { at1e10: [3.2991, 4.335], at326e7: [3.4542, 3.6821] },
  }),
  window: Object.freeze({
    first: 33328427939370, last: 33328427955440, count: 16071, xLhalf: 7800000001111.6172, xRhalf: 7800000004737.72,
    original: { below: 33328427938873, top: 33328427960538, count: 21665 },
    rsIntervals: 21785, rsEndpoints: 26394, refRsIntervals: 21801, refMpmathSigns: 604,
    margins: { T1H5: [3.511, 3.558], T2H5: [3.031, 3.569] },
  }),
  handoff: Object.freeze({ T: 3000175332800, N: 12363153437138, marginsH10: [12.375, 11.909] }),
  trustBase: Object.freeze(['FLINT acb_dirichlet_zeta_rs (Arias de Reyna 2011 Thm 4.2) — unaudited', 'Arb ball arithmetic', 'Trudgian 2011 Thm 2.2 (published)']),

  verdict:
    'The 7.8e12 window that Lemma B uses (RH-win) is certified by Route 2 — RS signs at every interval endpoint plus Trudgian Thm 2.2 and parity — '
    + 'and independently reproduced: exactly 16,071 zeros in (T1, T2] ⊇ [x_L/2, x_R/2], all simple and on the line. FLINT’s Platt grid bounds are sound at '
    + 'the pilot parameters with the wrap patch and the π-corrected A.3; its Gram-block Turing criterion (Brent Thm 3.2 / Trudgian Cor 2.3) does not follow '
    + 'from the integral bound (≥ 10 unit blocks per side needed at 7.8e12, FLINT uses 6), so anchors certified only by FLINT’s own logic, including '
    + 'the 1.65X window, are not certified. Internal audit, no external referee. PT Lambda <= 0.2 stands. RH open. NO QED.',
  nextStep: 'Lehman 1970 Thm 4 + external referee for §3.3; re-certify the 1.65X window by Route 2; audit or independently re-implement zeta_rs; check PT21’s Turing step against the GAP.',
});

const F = R3_FLINT2;

export const R3_FLINT2_ASSERTIONS = Object.freeze([
  {
    id: 'r3-flint2-a3-factor',
    holds: () => Math.abs(A3fac(F.a3.guard.sigma, F.a3.guard.t0) - F.a3.guard.factor) < 1e-4 && A3fac(9, 27) < 1 && A3fac(9, 18) > 1
      && Math.abs(A3fac(25, 7.8e12) - Math.PI / 64) < 1e-12 && Math.abs(A3fac(25, 7.8e12) - F.a3.pilot.ratio) < 1e-4
      && F.a3.counterexamples.every(([s, t0, r]) => r > 1 && r <= A3fac(s, t0) + 1e-3),
    why: 'Correction factor π((1+σ²/t0²)/2)^{(σ−1)/4}: ≤ 1 at σ = 9, t0 = 27 (not at t0 = 18), π/64 at the pilot σ = 25; measured ratios > 1 at σ = 3, 5, 7 stay below it.',
  },
  {
    id: 'r3-flint2-a6-gamma-ratio',
    holds: () => [3, 5, 7].every((s) => Math.abs((2 * Math.PI) / (s * gammaHalfOddSq(s)) - F.a6.R0[s]) < 1e-14) && F.a6.R0[3] > 1 && F.a6.R0[5] < 1,
    why: 'R_σ(0) = 2π/(σΓ(σ/2)²) = 8/3, 32/45, 128/1575 for σ = 3, 5, 7: the A.6 step fails at σ = 3, holds from σ = 5.',
  },
  {
    id: 'r3-flint2-a5-margin',
    holds: () => { const v = 2 * F.a5.h * Math.sqrt(F.a5.k - 1); return Math.abs(v - 1489.3) < 0.05 && v <= F.a5.B && F.a5.h * Math.sqrt(F.a5.k) < F.a5.B; },
    why: 'A.5 needs B ≥ 2h√(K−1) = 1489.3; the pilot B = 4096 satisfies it.',
  },
  {
    id: 'r3-flint2-turing-arithmetic',
    holds: () => {
      const T = F.turing, L = Math.log(T.t), fb = 0.0031 * L * L + 0.11 * L, tb = T.trudgianA + T.trudgianB * L;
      return Math.ceil(fb) === T.flintBound && Math.abs(tb - T.trudgianBound) < 1e-4 && T.config.K6 < tb && T.config.K9 < tb && T.config.K10 > tb
        && T.config.sawtoothK10 > tb && Math.abs(1.71 + 0.114 * Math.log(1e10) - T.brent.at1e10[1]) < 1e-3 && T.brent.at1e10[0] < T.brent.at1e10[1]
        && T.brent.at326e7[0] < T.brent.at326e7[1] && Math.ceil(T.blockNeed - 2) === 15 && T.minUnitBlocksPerSide > T.flintBound;
    },
    why: 'FLINT uses 6 blocks (0.0031L² + 0.11L = 5.997); a 6-block configuration has max ∫S = 2.51 < 3.818 (Trudgian), so 6 blocks do not certify; K + (p−n)/2 ≥ 15 needed.',
  },
  {
    id: 'r3-flint2-window-counts',
    holds: () => {
      const W = F.window;
      return W.last - W.first + 1 === W.count && W.original.top - W.original.below === W.original.count
        && W.first > W.original.below && W.last <= W.original.top && W.rsIntervals >= W.original.count && W.refRsIntervals >= W.rsIntervals
        && W.margins.T1H5.every((m) => m > 0) && W.margins.T2H5.every((m) => m > 0) && F.handoff.marginsH10.every((m) => m > 0);
    },
    why: '16,071 = 955440 − 939370 + 1 zeros in the window, nested in the 21,665-zero original range; Turing margins positive at both ends.',
  },
  {
    id: 'r3-flint2-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(F.verdict) && /NO QED/.test(F.verdict) && F.trustBase.some((x) => /unaudited/.test(x)) && /no external referee/.test(F.verdict),
    why: 'Window certificate rests on unaudited zeta_rs; internal audit only.',
  },
]);

export default R3_FLINT2;
