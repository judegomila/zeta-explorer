/**
 * @fileoverview route-6-sparse-verification-2026-10-07 — roadmap route 6 (batch 2): which sparse set of local RH windows can stand
 * in for contiguous verification in Lemma-B band arguments? One run plus one adversarial internal referee pass (not refuted, minor);
 * the referee corrections are applied below.
 *
 * Outcome (framework- and catalogue-relative): RH must be verified contiguously up to a head; above it, ONE local window (wider than
 * the far-field distance D_K = 921–1639 in x, right wall ≥ x_{**}(τ)) replaces all contiguous verification up to x_{**}/2 — about
 * 1.73e12 ordinate units (≈ 5.45e6 core-hours) for τ = 0.145 on the base stack. The existing 7.8e12 window is that window for the
 * recorded sub-0.145 targets. No new Λ value; no window run was needed.
 *
 * PROVED (written, unrefereed, framework-relative):
 *  - Theorem S (sufficiency): Theorem B' (lemma-B-two-band.md §6.2) holds with the window width 7252 replaced by D_K; width enters
 *    only Lemma C (Far) and Lemma B.2 (Sep). Referee confirmed against §§2, 5, 6.
 *  - Lemma G (greedy consumer optimal for a fixed catalogue, grid and start). Referee correction: the written proof uses the
 *    exact-exponential map; the consumer's truncated series (A18), 2^-96 ceiling and degree-11 log need a monotonicity line (it
 *    holds: cδ ≤ 5e-5, the log sum has derivative (1 − z^11)/(1 + z) > 0) that is not yet written.
 *  - Theorem N (necessity), CORRECTED by the referee: the contiguous head must reach x_*(τ) = inf{x : U(x, q_MTY(x)) ≤ τ}; with
 *    exactly one window [x_L, x_R], x_R ≥ x_{**}(τ) = inf{x : U(x, 1) ≤ τ}, the head must reach x_*'(τ; x_L) = inf{x : U(x, q_MTY(x_L)) ≤ τ}
 *    ≥ x_*. Several windows can only close x_*' − x_*, worth at most U(x_f, q_MTY(x_L)) − G(x_f) in Λ. The original "head x_*, then
 *    exactly one window" was false in general.
 * CERTIFIED: Lemma H2 far-field distance in exact rationals: D_K = 1639 (h ∈ [1/2, 5/2]) and 921 (h ∈ [63/100, 11/5], contains every
 *  height of the certified runs; needs check E7 tightened); binding kernel r = 113/200, λ = 2, ρ = 1/5 (referee re-ran: ALL_PASS).
 *  Lemma G hypothesis on XW26 + sharp tables: 0 violations over 244,416 (cell, q) points. New 2.2X base-stack floor tables
 *  (floor height 1.32e13 ≤ 2.2X): U(start 1) = 145059783532577/10^15; U(start q_MTY(1.56e13) + 2e-6) = 143674020919001/10^15;
 *  referee: U(start q_MTY(x_f)) = 17958227056841/(1.25·10^14). U2 reproduced exactly with tmp/routes-b2-r6-pylib.
 * CONDITIONAL: every value uses the existing ledger ((F), (K), (W), window premises, [MTY], RH-head). The 7.8e12 window is checked
 *  independently of FLINT's Turing step (zeta_rs unaudited); the 1.65X window still relies on the Gram-block step (open gap), so the
 *  three-band 0.144951726247781 needs it too. 1.55X necessity (0.145101483155418 > 0.145) was computed with the 1.55X stack alone,
 *  not the union catalogue Theorem N requires — not yet established.
 * MEASURED: base-stack grid (start 1 / bounded band) decreasing with height; the window start buys 0.001382–0.001437 in Λ. Referee
 *  correction: 1.654X (base) and ≈ 1.59X (full) are x_*' for the existing 2.6X window, not Theorem N's x_*; base x_* ≈ 1.646X
 *  (heuristic, q-slope 0.0597). Base-stack saving τ = 0.145: x_*' = 1.6537X, x_{**} = 2.2290X → 1.7258e12 units = 5.448e6 core-hours.
 * HEURISTIC: full-stack saving 1.66–1.78e12 units = 5.25–5.62e6 core-hours (referee recomputation; the reported 1.64–1.73e12 was
 *  off); like-for-like grid saving ≈ 1.8e12; the mixed-stack 2.10e12 (6.63e6 core-hours) figure is dropped. Extra windows worth at
 *  most ≈ 2.42e-5 at 1.6X (linear extrapolation of one secant; regraded from measured). One minimal window costs under ≈ 10 CPU-min.
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; RH open; NO QED. Import-free. ROUTE_6_ASSERTIONS recompute exact values, the savings and
 * core-hour arithmetic, the D_K-to-ordinate conversion, the window-start effect and the greedy-check count.
 */

const big = (s) => { if (Array.isArray(s)) return s; const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = big(x), [c, d] = big(y); return [a * d - c * b, b * d]; };
const num = (x) => { const [a, b] = big(x); return Number(a) / Number(b); };
const exact15 = (s) => { const [a, b] = big(s); const n = a * 10n ** 15n; return n % b === 0n ? n / b : null; };

const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });

const X = 6000000185827; // PT head wall x_f
const UNITS_PER_CORE_S = 88; // contiguous verification cost: 1/88 core-s per γ-unit

export const ROUTE_6 = Object.freeze({
  id: 'route-6-sparse-verification-2026-10-07',
  route: 6,
  date: '2026-10-07',
  title: 'Route 6: one local RH window replaces ≈ 1.7e12 ordinate units of contiguous verification; the head cannot be replaced (framework-relative)',
  status: 'done',
  headline: 'Inside the Lemma-B band framework (and for the current floor catalogue), RH must be verified contiguously up to a head; above it one local '
    + 'window wider than 921–1639 in x, with right wall ≥ x_{**}(τ), replaces all contiguous verification up to x_{**}/2 — about 1.73e12 ordinate units '
    + '(5.45e6 core-hours) for τ = 0.145 on the base stack. The existing 7.8e12 window serves; no Λ value is proved.',

  values: Object.freeze({
    u220one: V('145059783532577/1000000000000000', '0.145059783532577', 'CERTIFIED', 'U(2.2X, start 1), base stack'),
    u220mty: V('143674020919001/1000000000000000', '0.143674020919001', 'CERTIFIED', 'U(2.2X, start q_MTY(1.56e13) + 2e-6), base stack'),
    u220mty0: V('17958227056841/125000000000000', '0.143665816454728', 'CERTIFIED (referee run)', 'U(2.2X, start q_MTY(x_f)) = G at 2.2X'),
    u2: V('36063660805739/250000000000000', '0.144254643222956', 'CERTIFIED', 'U2 reproduced with the repaired toolchain'),
    nonGreedyRandom: V('146797574423308/1000000000000000', '0.146797574423308', 'MEASURED (referee)', 'random admissible policy, R6X220 tables'),
    nonGreedySecond: V('145341318524537/1000000000000000', '0.145341318524537', 'MEASURED (referee)', 'second-best policy, R6X220 tables'),
  }),
  farField: Object.freeze({ DK_wide: 1639, DK_narrow: 921, hWide: [0.5, 2.5], hNarrow: [0.63, 2.2], usedHeights: [0.6336, 2.18], previousWidth: 7252,
    binding: '(r 113/200, λ 2, ρ 1/5)', nextLargest: [600, 342] }),
  greedyCheck: Object.freeze({ cells: 608, qValues: 402, points: 244416, violations: 0 }),
  baseGridStart1: Object.freeze([[1.6, 0.146591], [1.7, 0.146297], [1.75, 0.146156], [2.15, 0.145168], [2.2, 0.145060], [2.3, 0.144854]]),
  baseGridBand: Object.freeze([[1.6, 0.145154], [1.7, 0.144868], [1.75, 0.144732], [2.15, 0.143779], [2.2, 0.143674], [2.3, 0.143472]]),
  heads: Object.freeze({ xStarPrimeBase: 1.6537, xStarBaseHeuristic: 1.646, xStarStarBase: 2.2290, xStarPrimeFull: [1.5839, 1.5916], xStarStarFull: [2.1456, 2.1777] }),
  savings: Object.freeze({ baseUnits: 1.7258e12, baseCoreHours: 5.448e6, fullUnits: [1.66e12, 1.78e12], fullCoreHours: [5.25e6, 5.62e6],
    likeForLikeGrid: 1.8e12, droppedMixedStack: 2.10e12 }),
  windowStartEffect: [0.001382, 0.001437],
  extraWindowsHeuristic: Object.freeze({ slope: 0.0608, maxValue: 2.42e-5, realizedBy165: 2.27e-5 }),
  newWindowsRun: 0,

  refereeKilled: Object.freeze([
    'Theorem N conflated two heads: with one window the head must reach x_*\' (start q_MTY(x_L)) ≥ x_* (start q_MTY(x_f)); "head x_*, then exactly one window" is false in general',
    'reported x_* (1.654X base, 1.584–1.590X full) are x_*\' for the 2.6X window; base x_* ≈ 1.646X (heuristic)',
    'grid-only saving 2.10e12 (6.63e6 core-h) compared a full-stack head with a base-stack tail; like-for-like ≈ 1.8e12',
    'full-stack heuristic saving recomputes to 1.66–1.78e12 (5.25–5.62e6 core-h), not 1.64–1.73e12',
    '"extra windows worth ≤ 2.42e-5" is a one-secant extrapolation (heuristic), not measured',
    '1.55X necessity used the 1.55X stack alone, not the union catalogue Theorem N needs',
    'Lemma G proof omits the truncated-series / ceiling / degree-11 log monotonicity step (true, unwritten)',
  ]),
  nextStep: '(1) Full-stack floor tables (two-height, 0.94, 0.91 sets) at ≈ 2.15X and 2.2X to measure full-stack x_{**} directly. (2) Internal referee on '
    + 'corrected Theorem N and Lemma G (with the truncated-series step); add the E7\' height check for D_K = 921. (3) Re-certify the 1.65X window by '
    + 'Route 2 (tmp/routes-b2-r5-route2.py) so 0.144951726247781 no longer rests on the Gram-block gap. (4) Move r3-bb replay inputs out of /tmp '
    + '(path change needs approval).',
  environment: 'macOS /tmp cleaner damaged /tmp/s145venv, /tmp/rhvenv and most of /tmp/b145-B-archive; worked around with tmp/routes-b2-r6-pylib (python3.14, python-flint 0.9.0); new 2.2X tables copied to tmp/routes-b2-r6-out/archive. The run briefly exceeded the 2-worker limit (disclosed).',
  files: Object.freeze(['tmp/routes-b2-r6-consume.py', 'tmp/routes-b2-r6-greedy-check.py', 'tmp/routes-b2-r6-savings.py', 'tmp/routes-b2-r6-out/savings.json',
    'tmp/routes-b2-r6-out/H2_dmin_h05_25.json', 'tmp/routes-b2-r6-out/H2_dmin_h063_22.json', 'tmp/routes-b2-r6-out/archive/', 'tmp/routes-b2-ref6-out/']),
  verdict: 'Inside the Lemma-B band framework and for the current catalogue (unrefereed, Theorem N corrected by the referee): the contiguous head cannot be '
    + 'replaced by windows; with one window it must reach x_*\', and above it one window wider than D_K = 921–1639 with right wall ≥ x_{**} replaces '
    + 'contiguous verification up to x_{**}/2 — ≈ 1.73e12 ordinate units (5.45e6 core-hours) at τ = 0.145, base stack; full stack 1.66–1.78e12 (heuristic). '
    + 'Extra windows are worth at most ≈ 2.4e-5 (heuristic). The existing 7.8e12 window serves for the recorded sub-0.145 targets. No new Λ bound. '
    + 'No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_6;
const v = (k) => R.values[k].exact;

export const ROUTE_6_ASSERTIONS = Object.freeze([
  {
    id: 'r6-values-exact',
    holds: () => Object.values(R.values).every((x) => { const n = exact15(x.exact); return n !== null && Math.abs(Number(n) / 1e15 - Number(x.dec)) < 1e-16; }),
    why: 'Every stated decimal is the exact value of its rational.',
  },
  {
    id: 'r6-window-start-effect',
    holds: () => { const d = num(sub(v('u220one'), v('u220mty'))); const g = num(sub(v('u220mty'), v('u220mty0')));
      return d >= R.windowStartEffect[0] && d <= R.windowStartEffect[1] && g > 8.2e-6 && g < 8.21e-6 && lt(v('u220mty0'), v('u220mty'))
        && R.baseGridStart1.every(([h, u], i) => Math.abs(u - R.baseGridBand[i][1] - 0.00141) < 3.5e-5 && R.baseGridBand[i][0] === h); },
    why: 'At 2.2X the window start buys 0.0013858 (inside 0.001382–0.001437 over the grid); Theorem N\'s start q_MTY(x_f) is 8.2e-6 lower than the window start.',
  },
  {
    id: 'r6-grid-monotone',
    holds: () => [R.baseGridStart1, R.baseGridBand].every((g) => g.every(([h, u], i) => i === 0 || (h > g[i - 1][0] && u < g[i - 1][1])))
      && R.baseGridStart1.find(([h]) => h === 2.2)[1] > 0.145 && R.baseGridStart1.find(([h]) => h === 2.3)[1] < 0.145,
    why: 'Both base-stack curves decrease with floor height on the measured grid; start-1 first passes 0.145 between 2.2X and 2.3X.',
  },
  {
    id: 'r6-greedy-optimal',
    holds: () => R.greedyCheck.cells * R.greedyCheck.qValues === R.greedyCheck.points && R.greedyCheck.violations === 0
      && lt(v('u220one'), v('nonGreedySecond')) && lt(v('nonGreedySecond'), v('nonGreedyRandom')),
    why: '608 × 402 = 244,416 points with 0 violations; referee: non-greedy policies on the same tables give larger U (as Lemma G predicts).',
  },
  {
    id: 'r6-farfield-conversion',
    holds: () => { const f = R.farField; return f.DK_narrow < f.DK_wide && f.DK_wide < f.previousWidth && f.hNarrow[0] <= f.usedHeights[0]
      && f.usedHeights[1] <= f.hNarrow[1] && f.hWide[0] <= f.hNarrow[0] && Math.round(f.DK_narrow / 2) === 461 && Math.round(f.DK_wide / 2) === 820
      && f.nextLargest.every((d) => d < f.DK_narrow); },
    why: 'D_K = 921 (narrow h range, contains all used heights) and 1639 (wide) are below the 7252 used so far; in γ-units ≈ 461 and 820.',
  },
  {
    id: 'r6-savings-arith',
    holds: () => { const h = R.heads, s = R.savings; const units = ((h.xStarStarBase - h.xStarPrimeBase) / 2) * X;
      const coreH = (u) => u / UNITS_PER_CORE_S / 3600;
      const fullLo = ((h.xStarStarFull[0] - h.xStarPrimeFull[1]) / 2) * X, fullHi = ((h.xStarStarFull[1] - h.xStarPrimeFull[0]) / 2) * X;
      return Math.abs(units - s.baseUnits) / s.baseUnits < 1e-3 && Math.abs(coreH(units) - s.baseCoreHours) / s.baseCoreHours < 2e-3
        && Math.abs(fullLo - s.fullUnits[0]) / s.fullUnits[0] < 3e-3 && Math.abs(fullHi - s.fullUnits[1]) / s.fullUnits[1] < 3e-3
        && Math.abs(coreH(fullLo) - s.fullCoreHours[0]) / s.fullCoreHours[0] < 3e-3 && Math.abs(coreH(fullHi) - s.fullCoreHours[1]) / s.fullCoreHours[1] < 3e-3
        && Math.abs(((2.2 - 1.6) / 2) * X - s.likeForLikeGrid) < 1e9 && Math.abs(((2.3 - 1.6) / 2) * X - s.droppedMixedStack) < 1e9; },
    why: 'Saving = (x_{**} − x_*\')/2 · X: base 1.7258e12 units = 5.448e6 core-h at 88 units/core-s; full-stack heuristic 1.66–1.78e12 = 5.25–5.62e6 core-h (referee figures).',
  },
  {
    id: 'r6-heads-ordering',
    holds: () => { const h = R.heads; return h.xStarBaseHeuristic < h.xStarPrimeBase && h.xStarPrimeBase < h.xStarStarBase
      && h.xStarPrimeFull[1] < h.xStarPrimeBase && h.xStarStarFull[1] < h.xStarStarBase && h.xStarStarBase / h.xStarPrimeBase > 1.34 && h.xStarStarBase / h.xStarPrimeBase < 1.36; },
    why: 'x_* ≤ x_*\' < x_{**}; ratio x_{**}/x_*\' ≈ 1.35 (the head-height value of one window); the full stack lowers both heads.',
  },
  {
    id: 'r6-extra-windows-bound',
    holds: () => { const e = R.extraWindowsHeuristic; return e.realizedBy165 < e.maxValue && e.maxValue - e.realizedBy165 < 2e-6 && e.maxValue / e.slope < 5e-4; },
    why: 'Extra windows at 1.6X: at most ≈ 2.42e-5 (heuristic), 2.27e-5 already realised by the 1.65X window, leaving ≤ 1.6e-6.',
  },
  {
    id: 'r6-honest-scope',
    holds: () => R.status === 'done' && R.newWindowsRun === 0 && /framework/.test(R.verdict) && /No new Λ bound/.test(R.verdict)
      && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 7,
    why: 'Framework- and catalogue-relative; no Λ bound; seven referee corrections recorded; no QED.',
  },
]);

export default ROUTE_6;
