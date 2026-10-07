/**
 * @fileoverview route-5-many-bands-2026-10-07 — roadmap route 5 (batch 2): split the route-P band argument into more bands
 * (multi-band Lemma B with extra walls and RH windows). One run plus one adversarial internal referee pass (not refuted, minor);
 * the referee corrections are applied below.
 *
 * Outcome: 4 bands lower the PT-height value from 0.145694083872924 to 0.145620383931826 (−7.37e-5); 3 bands, using only walls
 * and windows that already existed, give 0.145632847457923 (−6.12e-5). Both are certified relative to the shared ledger and
 * confirmed by the referee re-run. Band 1 (route-P floors) binds; with the current band-1 floors no layout goes below
 * 0.145566855004312 (measured/structural). Λ < 0.145 is NOT certified.
 *
 * PROVED (written, unrefereed): multi-band Lemma B with line walls (Theorem B'_m, lemma-B-two-band.md §6.2 at PT height; window
 *  width > 7252; hypotheses checked for m = 2, 3). Correction to the route-2 estimate: slabs instead of line walls cost
 *  (t_f + f²/2) − U ≈ c f⁴/8, not f²/2 (the barrier falls from f² to 0 in (1/c) log(1 + c f²/2)).
 * WRITTEN PROOF SKETCH, UNREFEREED (referee correction: moved out of "proved"): slab-wall variant Theorem B''_m with Lemma B.4
 *  (first contact at height f gives Im ż < 0; slab keeps zeros at x-distance ≥ 1). Referee found no error, provided each cell
 *  starts at a slab's right edge X_k + 1.
 * CERTIFIED (exact consumer, E1–E8, unchanged r3-bb-replay; relative to the ledger; referee re-ran band 1, band 2, the wall and both windows):
 *  - band 1 by right wall a1: 1.56e13 → 0.145694083872924 (reproduces r7); 9900000003031.5801 → 0.145632847457923; 9000000007188.6094 →
 *    72810191965913/(5·10^14) (only the redundant E6-altlog fails, by 1.5e-16; r7 robust convention).
 *  - new line wall WALLQ_9000000017721.9609 (lanes A 256 bit, B 384 bit; t ∈ [0, 41/250], y ∈ [0, 1], N = 846284).
 *  - RH in W1 by Route 2 (RS signs + Turing in direct-integral form, no Platt lemmas): 22,882 zeros; RH in W2 (9.9e12) upgraded to
 *    Route 2: 33,987 zeros. Referee re-implemented the checks (closed-form Stirling θ, own Turing sums): identical counts and margins.
 *  - band 2 (X150 Track A + two-height floors, regenerated archive): 29066518885033/(2·10^14), 0 failures; reproduces both recorded
 *    consume_X150 values exactly.
 * CONDITIONAL: 4-band Λ ≤ 0.145620383931826 and 3-band Λ ≤ 0.145632847457923 rest on the shared route-P ledger (G0-c, AF gaps,
 *  Lemma B written, producer layer, RH-head), the recorded X165mid and U2 replays of 2026-10-01 (tables deleted from /tmp; both ≥ 7.1e-4
 *  below band 1), the (F) grade of the X150 floors, and RH in W1/W2 via Route 2 (FLINT acb_dirichlet_hardy_z unaudited; Trudgian 2011
 *  Thm 2.2). Under Polymath Thm 1.2, 0.1758354 and 0.1787854 are unchanged.
 * MEASURED: dU/dq0 = 0.154–0.164 (6 replays, monotone); band-1 ceiling 0.145566855004312 at a1 = 6000350665601 (referee correction:
 *  measured/structural, holds only with the CURRENT band-1 floors and needs U monotone in q0, which is measured, not proved — better
 *  band-1 floors go below it). Hypothetical: the 125 missing P47 floors at target with 3 bands give 0.144986019620486 < 0.145.
 *  Slab-ending cost matches c f⁴/8 (c ≈ 21.9) within 1% for f ≤ 0.03 (computed with the A17 lower bound; ≈ 1e-15 off strict).
 * HEURISTIC: 4–5 bands at best ≈ 0.145612–0.145613 (≈ 7e-6 more, needs Track A floors and a window at ≈ 8.5e12). Slabs never beat
 *  line walls here (line wall ≈ 25 s, no ending cost; slab producer hard-wired to X = 6000000185827).
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; RH open; NO QED. Import-free. ROUTE_5_ASSERTIONS recompute the exact values and changes,
 * the band maxima, the slab-cost law, the window geometry (widths > 7252, T-margins) and the zero counts from the density.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const eq = (x, y) => cmp(x, y) === 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };
const maxR = (xs) => xs.reduce((m, x) => (lt(m, x) ? x : m));

const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });
const E15 = (dec) => `${dec.replace('0.', '').replace(/^0+/, '')}/1000000000000000`;

export const ROUTE_5 = Object.freeze({
  id: 'route-5-many-bands-2026-10-07',
  route: 5,
  date: '2026-10-07',
  title: 'Route 5: four bands give 0.145620383931826 at PT height (−7.37e-5); band 1 binds; Λ < 0.145 not certified',
  status: 'done',
  headline: 'Splitting the route-P band into 4 bands lowers the PT-height value from 0.145694083872924 to 0.145620383931826 (−7.37e-5); '
    + '3 bands with existing walls and windows give 0.145632847457923. Certified relative to the shared ledger, confirmed by one internal '
    + 'referee re-run. With the current band-1 floors no layout goes below 0.145566855004312 (measured). Λ < 0.145 is not certified.',

  values: Object.freeze({
    baseline: V('36423520968231/250000000000000', '0.145694083872924', 'CERTIFIED', 'route-P r7 (band 1 at a1 = 1.56e13)'),
    band1At99: V('145632847457923/1000000000000000', '0.145632847457923', 'CERTIFIED', 'band 1, a1 = 9900000003031.5801 (= 3-band value)'),
    band1At90: V('72810191965913/500000000000000', '0.145620383931826', 'CERTIFIED', 'band 1, a1 = 9000000007188.6094, robust (= 4-band value)'),
    x150: V('29066518885033/200000000000000', '0.145332594425165', 'CERTIFIED', 'band 2: X150 floors from q_MTY(9900000003031.5801)'),
    x165mid: V(E15('0.144912451862679'), '0.144912451862679', 'CERTIFIED (recorded 2026-10-01, not re-run)', 'band X165mid'),
    u2: V('36063660805739/250000000000000', '0.144254643222956', 'CERTIFIED (recorded)', 'last band U2 (2.6X)'),
    ceiling: V('18195856875539/125000000000000', '0.145566855004312', 'MEASURED', 'band 1 at a1 = 6000350665601 (current floors)'),
    scen3Missing: V(E15('0.144986019620486'), '0.144986019620486', 'MEASURED', 'hypothetical: 125 missing at target, 3 bands'),
    scen4Missing: V(E15('0.144979970316526'), '0.144979970316526', 'MEASURED', 'hypothetical: 125 missing at target, band 1 only at a1 = 9.0e12 (the 4-band layout value is the X150 band 0.145332594425165; label corrected 2026-10-08)'),
    scen3All: V(E15('0.144966349654964'), '0.144966349654964', 'MEASURED', 'hypothetical: missing + incomplete at target, 3 bands'),
    scen4All: V(E15('0.144960445207309'), '0.144960445207309', 'MEASURED', 'hypothetical: missing + incomplete at target, band 1 only at a1 = 9.0e12 (the 4-band layout value is the X150 band 0.145332594425165; label corrected 2026-10-08)'),
    hyp84: V(E15('0.145611216984015'), '0.145611216984015', 'MEASURED', 'hypothetical band 1 at a1 = 8.4e12'),
    hyp75: V(E15('0.145596162954189'), '0.145596162954189', 'MEASURED', 'hypothetical band 1 at a1 = 7.5e12'),
  }),
  deltas: Object.freeze({ fourBand: '-36849970549/500000000000000', threeBand: '-61236415001/1000000000000000' }),
  layouts: Object.freeze({ threeBand: Object.freeze(['band1At99', 'x165mid', 'u2']), fourBand: Object.freeze(['band1At90', 'x150', 'x165mid', 'u2']) }),
  a1: Object.freeze({ r7: 1.56e13, w99: 9900000003031.5801, w90: 9000000007188.6094, h84: 8.4e12, h75: 7.5e12, ptLimit: 6000350665601, ptT: 3000175332800 }),
  windows: Object.freeze({
    W1: Object.freeze({ xL: 9000000007188.6094, xR: 9000000017721.9609, T1: 4500000003593.878, T2: 4500000008861.012, zeros: 22882, signs: 23751, turingMin: 2.32 }),
    W2: Object.freeze({ xL: 9900000003031.5801, xR: 9900000018622.26, marginL: 0.197, marginR: 0.377, zeros: 33987, signs: 34859, turingMin: 2.24 }),
  }),
  slab: Object.freeze({ c: 21.9, costs: Object.freeze([[0.01, 2.74e-8], [0.022, 6.40e-7], [0.025, 1.066e-6], [0.03, 2.21e-6], [0.05, 1.75e-5]]) }),
  sensitivity: Object.freeze({ dUdq0: [0.154, 0.164], replays: 6 }),

  refereeKilled: Object.freeze([
    'headline "even with ideal walls, windows and floors the method cannot go below 0.145566855004312" — false: the 125 missing floors at target give band 1 = 0.144986; the ceiling holds only with the current band-1 floors',
    '"structural ceiling" filed as proved — it is one replay at a hypothetical wall plus measured (not proved) monotonicity in q0; regraded measured/structural',
    'Theorem B\'\'_m / Lemma B.4 filed as proved — a written proof sketch, unrefereed',
    'slab costs called exact upper bounds — the crossing substep uses the A17 lower bound (≈ 1e-15 effect, no digit changes)',
  ]),
  nextStep: '(1) Internal referee on the Route-2 driver (right-endpoint signs, lower Turing test with b_{j−1}), Lemma B.4 / Theorem B\'\', and re-replay '
    + 'X165mid and U2 after regenerating their tables (tmp/routes-b2-r5-floors.sh; X165 at 9900000003031, N0 = 887590). (2) Feed the 3-band layout '
    + 'into route 1: the 125 missing P47 floors at target would then suffice for a value below 0.145 (measured 0.144986), without the 13 incomplete '
    + 'floors. (3) Optional ≈ 7e-6: Track A floors, a wall and a Route-2 window at ≈ 8.5e12.',
  files: Object.freeze(['tmp/routes-b2-r5-bands.py', 'tmp/routes-b2-r5-route2.py', 'tmp/routes-b2-r5-out/summary.json', 'tmp/routes-b2-r5-out/route2_W090.json',
    'tmp/routes-b2-r5-out/route2_W099.json', 'tmp/routes-b2-r5-out/walls/', 'tmp/routes-b2-r5-out/archive', 'tmp/routes-b2-ref5-out/']),
  verdict: 'More bands lower the route-P value at PT height relative to the ledger: 4 bands 0.145620383931826 (−7.37e-5), 3 bands 0.145632847457923 '
    + '(−6.12e-5); single implementation, one internal referee re-run. Band 1 binds and depends only on its right wall; with the current band-1 floors '
    + 'no layout goes below 0.145566855004312 (measured). Slab walls cost ≈ c f⁴/8 but line walls do the same job cheaply. Λ < 0.145 is not certified; '
    + 'with 3 bands the 125 missing P47 floors at target alone would suffice (measured 0.144986). PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_5;
const v = (k) => R.values[k].exact;
const slabCost = (f, c) => f * f / 2 - Math.log1p(c * f * f / 2) / c;
const density = (T) => Math.log(T / (2 * Math.PI)) / (2 * Math.PI);

export const ROUTE_5_ASSERTIONS = Object.freeze([
  {
    id: 'r5-values-exact',
    holds: () => Object.values(R.values).every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational.',
  },
  {
    id: 'r5-layout-maxima',
    holds: () => eq(maxR(R.layouts.fourBand.map(v)), v('band1At90')) && eq(maxR(R.layouts.threeBand.map(v)), v('band1At99'))
      && eq(sub(v('band1At90'), v('baseline')), R.deltas.fourBand) && eq(sub(v('band1At99'), v('baseline')), R.deltas.threeBand)
      && lt('145/1000', v('band1At90')),
    why: 'Λ = max over bands: band 1 binds in both layouts; changes −7.3699941098e-5 (4 bands) and −6.1236415001e-5 (3 bands); still above 0.145.',
  },
  {
    id: 'r5-band1-monotone-in-wall',
    holds: () => { const seq = ['baseline', 'band1At99', 'band1At90', 'hyp84', 'hyp75', 'ceiling']; const a = R.a1;
      const walls = [a.r7, a.w99, a.w90, a.h84, a.h75, a.ptLimit];
      return seq.every((k, i) => i === 0 || (lt(v(k), v(seq[i - 1])) && walls[i] < walls[i - 1])) && a.ptLimit === 2 * a.ptT + 1; },
    why: 'Band 1 decreases as its right wall moves down (measured at 6 walls); the lowest admissible wall is just above 2·3000175332800.',
  },
  {
    id: 'r5-ceiling-qualified',
    holds: () => lt(v('scen3Missing'), v('ceiling')) && lt(v('scen3Missing'), '145/1000') && lt('145/1000', v('ceiling'))
      && lt(v('scen4Missing'), v('scen3Missing')) && lt(v('scen4All'), v('scen3All')) && lt(v('scen3All'), v('scen3Missing'))
      && /current band-1 floors/.test(R.refereeKilled[0]),
    why: 'Referee correction: better band-1 floors (125 missing at target) give 0.144986 < 0.145 < the "ceiling" 0.145567, so the ceiling is floor-relative.',
  },
  {
    id: 'r5-slab-cost-law',
    holds: () => R.slab.costs.filter(([f]) => f <= 0.03).every(([f, cost]) => Math.abs(slabCost(f, R.slab.c) - cost) / cost < 0.005
        && Math.abs(R.slab.c * f ** 4 / 8 - cost) / cost < 0.01)
      && R.slab.costs.every(([f, cost]) => Math.abs(slabCost(f, R.slab.c) - cost) / cost < 0.05 && cost < (f * f) / 2 / 70),
    why: 'Slab ending cost f²/2 − (1/c)log(1 + c f²/2) ≈ c f⁴/8 (constant c ≈ 21.9: within 1% for f ≤ 0.03, 4% at f = 0.05) — ≥ 70× below route 2\'s f²/2 estimate.',
  },
  {
    id: 'r5-window-geometry',
    holds: () => { const W1 = R.windows.W1, W2 = R.windows.W2; const w1 = W1.xR - W1.xL, w2 = W2.xR - W2.xL;
      return Math.abs(w1 - 10533.35) < 0.01 && Math.abs(w2 - 15590.68) < 0.01 && w1 > 7252 && w2 > 7252
        && Math.abs(W1.xL / 2 - W1.T1 - 0.427) < 0.001 && Math.abs(W1.T2 - W1.xR / 2 - 0.031) < 0.001; },
    why: 'Window widths 10533.35 and 15590.68 exceed 7252 (Lemma H2); W1 ordinate range covers [x_L/2, x_R/2] with margins 0.427 and 0.031.',
  },
  {
    id: 'r5-zero-counts-density',
    holds: () => { const W1 = R.windows.W1, W2 = R.windows.W2;
      const n1 = (W1.T2 - W1.T1) * density((W1.T1 + W1.T2) / 2);
      const n2 = ((W2.xR - W2.xL) / 2 + W2.marginL + W2.marginR) * density((W2.xL + W2.xR) / 4);
      return Math.abs(n1 - W1.zeros) / W1.zeros < 5e-4 && Math.abs(n2 - W2.zeros) / W2.zeros < 5e-4
        && W1.signs > W1.zeros && W2.signs > W2.zeros && W1.turingMin > 2 && W2.turingMin > 2; },
    why: 'Certified zero counts 22,882 and 33,987 agree with log(T/2π)/(2π) × window length to < 0.05%; Turing margins > 2 at H = 5.',
  },
  {
    id: 'r5-sensitivity',
    holds: () => { const s = Number(R.values.band1At99.dec) - Number(R.values.band1At90.dec); const perLn = s / Math.log(R.a1.w99 / R.a1.w90);
      return perLn > 1.2e-4 && perLn < 1.45e-4 && R.sensitivity.dUdq0[0] < R.sensitivity.dUdq0[1]; },
    why: 'Band 1 moves ≈ 1.3e-4 per unit of ln(a1) between 9.0e12 and 9.9e12, consistent with dU/dq0 ≈ 0.154–0.164.',
  },
  {
    id: 'r5-honest-scope',
    holds: () => R.status === 'done' && /not certified/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict)
      && R.values.ceiling.grade === 'MEASURED' && /sketch/.test(R.refereeKilled[2]),
    why: 'Λ < 0.145 not certified; ceiling graded measured; slab theorem graded as a sketch; no QED.',
  },
]);

export default ROUTE_5;
