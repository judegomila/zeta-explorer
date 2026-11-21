/**
 * @fileoverview r2-height-reduction-2026-10-02 — minimum verified RH height for Λ < 0.145 on the b145 stack (Track A floors, no
 * outer lemma), with the multi-height consumer, two-height kernels on three height sets, a clamped 0.91 set and local RH windows as band
 * separators. Floor heights 1.5X–1.65X (X = PT floor height 6000000185827). One internal adversarial referee pass (minor, not refuted;
 * all headline values replayed exactly).
 *
 * Referee corrections applied (tmp/r2-refH-*):
 *  - The contiguity requirement (“RH must be verified contiguously on [0, (x_w + 1)/2]”) was labelled proved. It is a framework-relative
 *    argument (unrefereed): inside the Raymond barrier/band framework every unverified zero needs a band whose floors sit at X ≤ its
 *    abscissa and whose start dominates it, plus the MEASURED values U(X, q_MTY) > 0.145 for X ≤ 1.55X. U was computed with the full stack
 *    at 1.55X only, with the base stack at 1.5X, and not at all below 1.5X. Monotonicity in X is a measured trend, not a bound.
 *  - 1.55X “best window” used a band-1 start q_MTY(x_w(1.6X)) for a window with no certified partner wall. Best admissible start
 *    (window just above x_w(1.55X), q0 = 243870851223021/2.5e14): 72550741577709/5e14 = 0.145101483155418; still fails, by 1.015e-4.
 *  - r2-height-consume2.py runs with start_check = (q0 > 1), so no strict-entry check against q_MTY is made for starts below 1. Referee
 *    recomputation: q0 − (2 + r0 q0)·1e-8 > q_MTY_upper holds in all four runs (q0 − q_MTY = 2.0e-6, r0 = 10.33–10.35). The check passes;
 *    it belongs inside the consumer.
 *  - 1.65X window seam: in the original run chunk 4 ends at 4950000008613.3991 and chunk 5 begins at 4950000008613.6285 (no shared endpoint);
 *    contiguity there rested on consecutive Turing-certified indices only. The wrap-fixed rerun in r2-flint-audit-2026-10-02 overlaps the
 *    seam (chunk 4 now reaches 4950000008631.5198) and its doubly certified indices agree.
 *  - “Minimum” is relative to the 0.05 grid. Linear interpolation of U(1.55X) = 0.145101483 and U(1.6X) = 0.144974388 puts the crossing near
 *    1.59X (measured interpolation, no wall certified there).
 *  - The chained (three-band) Lemma B needs a written statement for a middle band with band neighbours on both sides (H2 is symmetric in d;
 *    no obstruction found).
 *
 * PROVED: nothing. CERTIFIED: four new finite-head walls (both lanes) at 1.45X/1.5X/1.55X/1.65X plus the 1.65X window partner wall;
 *  1.65X local RH window (42,383 zeros, FLINT, wrap-fixed rerun); exact rational consumer outputs. CONDITIONAL: every Λ value (RH to T*,
 *  G0, Track A lemmas, multi-height consumer, two-height coupling incl. Raymond’s joint-pair lemma for arbitrary shifts, Lemma B incl.
 *  BB1/BB2, FLINT, MTY). MEASURED: band values per height, lever gains, wall-clock. HEURISTIC: 1.45X/1.5X full-stack estimates, prices.
 * Verdict: Λ < 0.145 needs verified RH to T* = 4.80e12 (1.6×PT, 5.68e6 core-hours) on this route; nothing beyond PT is verified.
 *  No refereed bound is changed. RH open. NO QED.
 * Files: tmp/r2-height-{run,augment,walls}.sh, tmp/r2-height-{plans,consume,consume2,wallcheck,collect}.py, tmp/r2-height-out/
 *  (RESULT.json, c2_X160_full_band26.json, c2_X160_full_band165.json, walls/, window165/), referee tmp/r2-refH-*, /tmp/b145-B-archive/.
 * Import-free. ASSERTIONS recompute T*, core-hours and dollar ranges, margins, the 1.59X interpolation, q_MTY at each band start and the
 * ceil(q_MTY + 2e-6) starts, window index counts and ordinate cover, and the lever-gain bookkeeping.
 */

const T_PT = 3.0001753e12;
const FLINT_RATE = 88.0;
const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };
const qMTY = (x) => (1 - 2 / (5.558691 * Math.log(x / 2))) ** 2;
const coreHours = (T) => (T - T_PT) / FLINT_RATE / 3600;

export const R2_HEIGHT_REDUCTION = Object.freeze({
  id: 'r2-height-reduction-2026-10-02',
  date: '2026-10-02',
  title: 'Height reduction: Λ < 0.145 from verified RH to 4.80e12 (1.6×PT) instead of 5.10e12 (1.7×PT)',
  status:
    'CONDITIONAL (RH to 4.80e12 not verified; G0; Track A lemmas; multi-height consumer; two-height coupling; Lemma B incl. BB1/BB2 unproved; '
    + 'FLINT; MTY) + CERTIFIED walls and window + MEASURED height trend. One internal referee pass (minor, not refuted). NO QED.',
  headline:
    'At floor height 1.6X the full stack gives 144974387559643/10^15 = 0.144974387559643 (two-band, margin 2.56e-5) or 0.144951726247781 '
    + '(three-band with the 1.65X window, margin 4.83e-5), IF RH holds to T* = 4800000000432.38. Cost 5.681e6 core-hours at 88 units/core-s, '
    + '14.3% below the 1.7X contract. 1.55X fails (0.145101483155418).',

  walls: Object.freeze({
    X145: '8700000008520.5850', X150: '9000000007188.6094', X155: '9300000002195.7109', X160: '9600000000863.7598',
    X165: '9900000003031.5801', X165partner: '9900000018622.2559', X170: '10200000023546.2402',
    xL26: '15600000002223.2344', xR26: '15600000009475.44',
  }),
  exact: Object.freeze({
    X160_band26: '144974387559643/1000000000000000',
    X160_band165: '144951726247781/1000000000000000',
    X165_band2: '144912451862679/1000000000000000',
    X155_best: '72550741577709/500000000000000',
    X155_quotedPreFix: '14510309443269/100000000000000',
    X150_base: '145329479825537/1000000000000000',
    X160_base: '14505498020899/100000000000000',
    X170_band: '18108446112627/125000000000000',
    U2: '36063660805739/250000000000000',
    ptReproduced: '18409208597849/125000000000000',
  }),
  starts: Object.freeze([
    { at: 'x_L(2.6X)', x: '15600000002223.2344', qUpper: 0.97590603034, q0: '195181606067939/200000000000000' },
    { at: 'x_L(1.65X window)', x: '9900000003031.5801', qUpper: 0.97553352248, q0: null },
    { at: 'x_w(1.6X)', x: '9600000000863.7598', qUpper: 0.97550789864, q0: null },
    { at: 'x_w(1.55X)', x: '9300000002195.7109', qUpper: 0.97548140489, q0: '243870851223021/250000000000000' },
  ]),
  baseByHeight: Object.freeze([[1.5, 0.145355], [1.55, 0.145202], [1.6, 0.145055], [1.65, 0.144912]]),
  leverGains16: Object.freeze({ mhPLAN: -7.9e-5, mh097: -5.9e-5, mh094: -1.6e-5, set091: -5.9e-6, window165: -2.27e-5 }),
  window165: Object.freeze({ firstIndex: 20792484253745, lastIndex: 20792484296127, zeros: 42383, chunks: 6, cpu_s: 103.0, isolated: [4950000000499.687, 4950000010221.324] }),
  windowCost: 'about 1e2 CPU-seconds per local window plus about 20 s per wall; worth at most about 2.4e-5 in Λ (band separator only)',
  priceRange: [0.02, 0.05],

  verdict:
    'On the Track A route (no outer lemma) the verified height needed for Λ < 0.145 drops from 1.7×PT to 1.6×PT: RH to 4.80e12, 5.68e6 core-hours '
    + '($0.114M–0.284M per physical core-hour at $0.02–0.05, before the unmeasured hardware factor and up to ×2 for vCPU pricing). Best conditional '
    + 'value 0.144951726247781 (three-band) or 0.144974387559643 (two-band); margins 4.8e-5 / 2.6e-5. 1.55X fails by 1.015e-4. Local windows '
    + 'separate bands only. No RH height beyond PT is verified. No refereed bound is changed. RH open. NO QED.',
});

const H = R2_HEIGHT_REDUCTION;
const X = H.exact;
const Tstar = (w) => (rat(w) + 1) / 2;

export const R2_HEIGHT_REDUCTION_ASSERTIONS = Object.freeze([
  {
    id: 'r2-height-tstar-and-cost',
    holds: () => {
      const T16 = Tstar(H.walls.X160), T17 = Tstar(H.walls.X170), c16 = coreHours(T16), c17 = coreHours(T17);
      return Math.abs(T16 - 4800000000432.38) < 0.01 && Math.abs(T16 / T_PT - 1.59991) < 1e-5 && Math.abs(c16 / 5.681e6 - 1) < 1e-3
        && Math.abs(c17 / 6.628e6 - 1) < 1e-3 && Math.abs(1 - c16 / c17 - 0.143) < 1e-3 && Math.abs(c17 - c16 - 9.47e5) < 2e3
        && Math.abs(c16 * H.priceRange[0] / 1.136e5 - 1) < 2e-3 && Math.abs(c16 * H.priceRange[1] / 2.84e5 - 1) < 2e-3
        && [['X155', 5.208e6], ['X150', 4.734e6], ['X145', 4.261e6]].every(([k, v]) => Math.abs(coreHours(Tstar(H.walls[k])) / v - 1) < 1e-3);
    },
    why: 'T* = (x_w + 1)/2 = 4800000000432.38 (1.59991×PT); (T* − T_PT)/88/3600 = 5.681e6 core-hours vs 6.628e6 at 1.7X (−14.3%); $0.114M–0.284M.',
  },
  {
    id: 'r2-height-margins-and-fail',
    holds: () => {
      const b26 = rat(X.X160_band26), b165 = Math.max(rat(X.X160_band165), rat(X.X165_band2), rat(X.U2));
      return b26 < 0.145 && Math.abs(0.145 - b26 - 2.561e-5) < 1e-8 && Math.abs(b165 - rat(X.X160_band165)) < 1e-18
        && Math.abs(0.145 - b165 - 4.827e-5) < 1e-8 && rat(X.X165_band2) < rat(X.X160_band165)
        && rat(X.X155_best) > 0.145 && Math.abs(rat(X.X155_best) - 0.145 - 1.015e-4) < 1e-7 && rat(X.X155_best) < rat(X.X155_quotedPreFix)
        && rat(X.X150_base) > 0.145 && rat(X.X160_base) > 0.145
        && rat(X.X170_band) < rat(X.X160_band26);
    },
    why: 'Three-band max(U1, U2(1.65X), U3 = 2.6X stack) = U1; margins 2.56e-5 / 4.83e-5; 1.55X fails by 1.015e-4 even at the best admissible start; 1.7X stays below 1.6X.',
  },
  {
    id: 'r2-height-interpolated-crossing',
    holds: () => {
      const u155 = rat(X.X155_best), u16 = rat(X.X160_band26);
      const k = 1.55 + 0.05 * (u155 - 0.145) / (u155 - u16);
      const b = H.baseByHeight, steps = b.slice(1).map(([, v], i) => b[i][1] - v);
      return k > 1.589 && k < 1.591 && steps.every((s) => s > 1.4e-4 && s < 1.6e-4) && coreHours(k * T_PT) > 5.5e6 && coreHours(k * T_PT) < 5.65e6;
    },
    why: 'Crossing near 1.59X by linear interpolation (≈ 5.59e6 core-hours, no wall there: measured, not a bound); base-stack values fall ≈ 1.45e-4 per 0.05 step.',
  },
  {
    id: 'r2-height-band-starts',
    holds: () => H.starts.every((s) => Math.abs(qMTY(rat(s.x)) - s.qUpper) < 2e-10
        && (!s.q0 || (rat(s.q0) > qMTY(rat(s.x)) + 1.99e-6 && rat(s.q0) - qMTY(rat(s.x)) < 2.01e-6 && rat(s.q0) - (2 + 10.35 * rat(s.q0)) * 1e-8 > s.qUpper)))
      && H.starts.every((s, i) => i === 0 || s.qUpper < H.starts[i - 1].qUpper),
    why: 'q_MTY recomputed at each band start; q0 = ceil(q_MTY + 2e-6); strict entry q0 − (2 + r0 q0)·1e-8 > q_MTY at r0 = 10.35; q_MTY increasing in x.',
  },
  {
    id: 'r2-height-window-165',
    holds: () => {
      const w = H.window165, xL = rat(H.walls.X165), xR = rat(H.walls.X165partner);
      return w.lastIndex - w.firstIndex + 1 === w.zeros && w.isolated[0] <= xL / 2 && w.isolated[1] >= xR / 2
        && Math.abs(xR - xL - 15590.68) < 0.01 && xR - xL > 7252 && rat(H.walls.xR26) - rat(H.walls.xL26) > 7252
        && rat(H.walls.X165) <= xR && rat(H.walls.X160) < xL;
    },
    why: '42,383 consecutive indices isolate [x_L/2, x_R/2] = [4950000001515.79, 4950000009311.13]; widths 15590.68 and 7252.2 exceed D_W = 7252; band-2 floor height ≤ x_R(window 1).',
  },
  {
    id: 'r2-height-lever-bookkeeping',
    holds: () => {
      const g = H.leverGains16, base = H.baseByHeight[2][1];
      const est = base + g.mh097 + g.mh094 + g.set091; // PLAN kernels already in the base value
      return Math.abs(est - rat(X.X160_band26)) < 3e-6 && Math.abs(rat(X.X160_band165) - rat(X.X160_band26) + 2.266e-5) < 1e-7
        && Math.abs(rat(X.ptReproduced) - 0.147273668782792) < 1e-15;
    },
    why: 'Base 1.6X (incl. PLAN kernels) plus the 0.97/0.94 kernels and 0.91 set reproduce 0.144974 to 3e-6; the 1.65X window is worth −2.27e-5; the driver reproduces the b145 PT value.',
  },
  {
    id: 'r2-height-honest-scope',
    holds: () => /refereed bound is changed/i.test(H.verdict) && /NO QED/.test(H.verdict) && /No RH height beyond PT is verified/.test(H.verdict)
      && /not verified/.test(H.status),
    why: 'Every sub-0.145 value here assumes RH to 4.80e12, which is not verified.',
  },
]);

export default R2_HEIGHT_REDUCTION;
