/**
 * @fileoverview r4-wol-adapt-2026-10-04 — WOL-C angle 3: adaptive branch-and-bound with the near box centred at θ_S = 0 (Φ peaks there),
 * Taylor-model engine tmp/r3-outer-c/r3core4.c plus optional label truncation (tmp/r4-woladapt-c/r4core_t.c). One adversarial internal
 * referee pass (tmp/r4-ref-wol-adapt-*): not refuted, minor.
 *
 * Referee corrections applied:
 *  - Central-box attribution: for P13 cell 141 the r3 excess 0.033 is box-size growth of the (u_2, u_3) second-order model (centred NL = 2:
 *    0.0334 at half-width 0.05, 0.0056 at 0.02, 0.0032 at 0.01, 0.0019 at a point), not relaxation of q = 5; relaxation dominates from P17 on.
 *  - 139|1|sharp: the claimant run (margin 0.022171) came from a driver version no longer on disk; an independent referee certificate (no
 *    truncation, prec 192, grid 1024, 2162 leaves, exact cover) gives margin 0.009945, which the synthesis consumes.
 *  - 52|1|r_49_100: referee re-certificate margin 0.002869 < claimant 0.003616 (consumed by the synthesis).
 *  - E6-altlog: one redundancy flag on the final band run (arb slack +4.1e-17 for the primary bound); robust form 147157850303695/10^15.
 *  - Scope: the small claimant margins (tol 0.004) are supported by exact cover of all 164 leaf lists, re-evaluation of 71 leaves (recorded
 *    ≥ re-evaluated in all), 3522-point r2 cross-check (0 violations) and 13 independent re-certifications; r3core4.c still unaudited line by line.
 *  - Operational incident (self-reported, partly corroborated): an over-broad pkill at ~09:33 on 2026-10-02 sent SIGTERM to other jobs.
 *
 * CERTIFIED (in-session, one referee pass): WOL-C for 164 band-path entries (all P7/P11/P13, P17 cells 139, 142–145) + 5 r3 S = {2,3,5}.
 * CONDITIONAL: the route-P value below (shared inputs + r3core4.c). Import-free. ASSERTIONS recompute counts, the admission-shift formula
 * for the referee margins, the cover-cost ladder and the value ordering.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const lt = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d < c * b; };
const eq = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return a * d === c * b; };
// Lemma 1 admission shift (outer-lemma-weak.md): 0.0023 − m(1+1e-12), rounded down to the 1e-13 grid, minus 1e-13
export const admissionShift = (m) => `${Math.floor((0.0023 - m * (1 + 1e-12)) * 1e13) - 1}/10000000000000`;

export const R4_WOL_ADAPT = Object.freeze({
  id: 'r4-wol-adapt-2026-10-04',
  date: '2026-10-04',
  title: 'WOL-C angle 3 (adaptive branch-and-bound, centred near box): 164 band-path entries certified; route P 0.1471579',
  status: 'PARTIAL: WOL-C certified for 164 of 630 band-path entries (P7 15, P11 70, P13 74, P17 5); 466 uncertified. One internal referee pass (minor). NO QED.',
  certifiedByPrefix: Object.freeze({ P7: 15, P11: 70, P13: 74, P17: 5 }),
  uncertified: Object.freeze({ P17: 17, P19: 34, P23: 39, P29: 8, P31: 5, P47: 363 }),
  marginRange: [0.00228, 0.004],
  refereeRecert: Object.freeze([
    { entry: '139|1|sharp@r2-refF-out/corrected_m0023/adapt/batch_P17_0of1.json', claimant: 0.02217050587883035, referee: 0.009944925475814936, shift: '-1911231369/250000000000' },
    { entry: '52|1|r_49_100@r2-refF-out/corrected_m0023/adapt/batch_P13_0of1.json', claimant: 0.003615875332075136, referee: 0.00286892410282491, shift: '-568924103/1000000000000' },
  ]),
  refereeRecertCount: 13,
  nearBoxP47: Object.freeze({ c401: { NL7: 0.0189, NL8: 0.0104 }, c500: { NL3: 0.777, NL5: 0.067, NL6: 0.025, NL7: 0.0133 } }),
  farCover: Object.freeze({ base: 128, perExtraAngle: 16, halfWidth: 0.2 }),
  values: Object.freeze({
    mixed: { exact: '73578925151847/500000000000000', dec: '0.147157850303694' },
    robust: { exact: '147157850303695/1000000000000000', dec: '0.147157850303695' },
    uniform0223: { exact: '147229645385289/1000000000000000', dec: '0.147229645385289' },
  }),
  verdict: 'WOL-C certified for 164 band-path entries by the centred branch-and-bound; route P 0.147157850303694 (robust 0.147157850303695), '
    + 'below the b145 PT value. The near box is certifiable at P47 with 6–8 boxed primes; the far cover (~128·16^(NL−2) boxes) is the obstruction. '
    + 'Conditional on the shared inputs and on r3core4.c (no line-by-line audit). PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const A = R4_WOL_ADAPT;
export const R4_WOL_ADAPT_ASSERTIONS = Object.freeze([
  {
    id: 'r4-woladapt-counts',
    holds: () => { const c = Object.values(A.certifiedByPrefix).reduce((s, x) => s + x, 0), u = Object.values(A.uncertified).reduce((s, x) => s + x, 0); return c === 164 && c + u === 630; },
    why: '164 certified + 466 uncertified = 630 band-path entries.',
  },
  {
    id: 'r4-woladapt-admission-shift-live',
    holds: () => A.refereeRecert.every((r) => eq(admissionShift(r.referee), r.shift) && r.referee < r.claimant && r.referee <= 0.0223 / (1 + 1e-12)),
    why: 'The Lemma-1 shift of each referee margin, recomputed here, equals the shift the synthesis admits; both referee margins are smaller than the claimant ones.',
  },
  {
    id: 'r4-woladapt-far-cover-cost',
    holds: () => { const n = (NL) => A.farCover.base * A.farCover.perExtraAngle ** (NL - 2); return n(6) > 8e6 && n(8) > 2e9 && n(3) === 2048; },
    why: 'Far cover ≈ 128·16^(NL−2) boxes: ~8e6 at NL = 6 and ~2e9 at NL = 8 (needed for P47) — out of reach by box covering.',
  },
  {
    id: 'r4-woladapt-ordering',
    holds: () => lt(A.values.mixed.exact, A.values.robust.exact) && lt(A.values.robust.exact, A.values.uniform0223.exact)
      && lt(A.values.uniform0223.exact, '18409208597849/125000000000000'),
    why: 'mixed < robust (+1e-15) < uniform-0.0223 sensitivity < b145 PT 0.147273668782792.',
  },
  { id: 'r4-woladapt-honest', holds: () => /NO QED/.test(A.status) && /PT Lambda <= 0\.2 stands/.test(A.verdict) && /r3core4\.c/.test(A.verdict), why: 'Engine trust base named; no QED.' },
]);

export default R4_WOL_ADAPT;
