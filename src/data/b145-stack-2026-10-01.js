/**
 * @fileoverview b145-stack-2026-10-01 — Track B: every certified lever stacked on the regenerated Raymond chain (Track A floors,
 * height-grid re-optimisation via a multi-height consumer, ten two-height kernels, and a two-band comparison with a walled local
 * RH window, “Lemma B”), at PT height and at seven larger floor heights. One internal adversarial referee pass (minor, not refuted;
 * both 1.7X values reproduced exactly from archived tables).
 *
 * Referee corrections applied:
 *  - H2 domain: the original H2.json covers h ∈ [2/3, 12/5] only; the grid sets reach h = 0.645 (PLAN×0.94). Closed by a rerun with
 *    B_max = 5/2 (h ≥ √(2/5) = 0.632): all 13 catalogue kernels, the sharp law and the 10 two-height kernels pass exact Bernstein
 *    positivity (tmp/b145-refB-out/H2_BMAX52.json). At 1.7X the band replay never selects h < 0.695.
 *  - Λ·ln T labels: full PT certified stack 0.148796921571845 → 4.2749; full PT band stack 0.147273668782792 → 4.2311; Track A + grid
 *    → 4.2786; needed at PT height 4.1658. “4.239” is band U1 without two-height kernels; “4.280–4.282” is Track A + grid without them.
 *  - Lemma B write-up must cite de Bruijn’s strip theorem (cross-band neighbours have b ≤ 1, no zero leaves the window through
 *    |y| = 1), state that band-1 zeros stay real from U1 to max(U1, U2) (same walled-window argument on (x_w, x_L)), and flag the
 *    real-stays-real step inside the window as Raymond’s AF §2 argument transplanted to two walls (unrefereed).
 *  - RH-window gluing: consecutive chunks share exact endpoints (e.g. 7800000002630.3659385); disjointness rests on those being
 *    sign-certified nonzeros of Z (Gram points, per the pilot referee). Part of the unrefereed FLINT window premise.
 *  - Two-height low tables use shifts r ∈ {29/50, …, 19/25} outside Raymond’s catalogue; joint_pairs is generic in r (r·h < 2
 *    enforced), but Raymond’s joint-pair lemma for arbitrary shifts belongs to the G0 referee item.
 *  - Minimum heights are certified only at grid points (2.3X without band, 1.7X with band); 2.23X / 1.65X are log-linear
 *    interpolations (measured), not bounds.
 *  - Consistency note (this synthesis): Track C referee C’s statement “a pair of walls does not substitute for H1” concerns walls
 *    WITHOUT verified RH between them. Lemma B adds a FLINT-isolated RH window between the walls, which removes near-field higher
 *    zeros; cross-band pairs are ≥ 7252 apart where H2 is certified.
 *
 * PROVED: nothing unconditional. New short arguments (i) multi-height consumer, (ii) two-height coupling, (iii) Lemma B, (iv) far-field
 *  identities: one internal referee pass, conditional inputs. CERTIFIED: exact rational comparisons, 6 new finite-head walls (both lanes),
 *  H2 far-field certificates (24 kernels), 10 two-height kernels (exact Bernstein), q_MTY(x_L) arb bound, local RH window (conditional on
 *  FLINT 3.6.0’s Platt/Turing lemmas). CONDITIONAL: every Λ value below. MEASURED: grid gains, crossings, Λ·ln T. HEURISTIC:
 *  zero-conditioned layer; PT-scaled prices.
 * Verdict: Λ < 0.145 NOT reached at PT height (best 0.147273668782792). Below 0.145 needs verified RH to T* ≥ 5.10e12. PT Lambda <= 0.2
 *  stands. RH open. NO QED.
 * Files: tmp/b145-B-{lib,ccp,run,consume,consume-mh,stack,band,h2,h2-mh,mhk-cert,mhk-table,design,plans,vpath,final}.py,
 *  tmp/b145-B-out/{RESULT,H2,H2_MH}.json, kernels/MH1..MH10.json, walls/; referee tmp/b145-refB-*; archive /tmp/b145-B-archive/.
 * Import-free. ASSERTIONS recompute rationals, band = max(U1, U2), minimum certified heights, T* and PT ratios, N0 at each wall,
 * Λ·ln T, q_MTY(x_L), window index count and ordinate cover, the far-field d^-4 / d^-6 coefficients, the two-height self-term
 * condition, and the RH-extension core-hours at the measured FLINT rate.
 */

const T_PT = 3.0001753e12;
const rat = (s) => { const [a, b] = String(s).split('/').map(Number); return a / (b ?? 1); };
const isqrtN0 = (X) => Math.floor(Math.sqrt((X - 4) / (4 * Math.PI)));
const qMTY = (x) => (1 - 2 / (5.558691 * Math.log(x / 2))) ** 2;
const K = (y, d, b) => (2 * y * (d * d + y * y - b * b)) / ((d * d + (y - b) ** 2) * (d * d + (y + b) ** 2));
const FLINT_RATE = 88.0; // height units per core-second (b145-verification-pilot)

export const B145_STACK = Object.freeze({
  id: 'b145-stack-2026-10-01',
  date: '2026-10-01',
  title: 'Track B: stacked certified levers — Λ ≤ 0.147274 at PT height; < 0.145 from RH to 5.10e12 (band) or 6.90e12 (no band)',
  status:
    'CONDITIONAL (Raymond chain G0; Track A lemmas; new arguments (i)–(iii) with one internal referee pass; FLINT local RH window; MTY) '
    + '+ CERTIFIED numerics + MEASURED crossings. One internal referee pass (minor, not refuted). No bound below 0.2 is proved. NO QED.',
  headline:
    'At PT height the full stack gives 18409208597849/125000000000000 = 0.147273668782792 (0.00227 above 0.145). Below 0.145: '
    + '0.144867568901016 with the band at floor height 1.7X (needs RH to 5.10e12) and 0.144853511841549 without the band at 2.3X '
    + '(needs RH to 6.90e12). Neither height is verified.',

  ptHeight: Object.freeze({
    raymond: '18674384228461/125000000000000',
    trackA: '74481734750429/500000000000000',
    trackA_grid: '37231482257787/250000000000000',
    trackA_MH: '148833823319829/1000000000000000',
    trackA_grid_MH: '29759384314369/200000000000000',
    band_trackA: '29511133454807/200000000000000',
    band_trackA_grid: '73702549945973/500000000000000',
    band_trackA_grid_MH: '18409208597849/125000000000000',
  }),

  // Exact outputs per floor height (no two-height kernels above PT). band = max(U1, U2), U2 = 2.6X certified stack (start 1.000002).
  rows: Object.freeze([
    { tag: 'X1', k: 1, X: 6000000185827, wall: null, N0: 690988, raymond: '18674384228461/125000000000000', cert: '37231482257787/250000000000000', U1: '73702549945973/500000000000000' },
    { tag: 'X160', k: 1.6, X: 9600000000863, wall: '9600000000863.7598', N0: 874038, raymond: '9196054668239/62500000000000', cert: '73295432971621/500000000000000', U1: '72576822043981/500000000000000' },
    { tag: 'X170', k: 1.7, X: 10200000023546, wall: '10200000023546.2402', N0: 900938, raymond: '146857569360519/1000000000000000', cert: '36574237494309/250000000000000', U1: '18108446112627/125000000000000' },
    { tag: 'X175', k: 1.75, X: 10500000005045, wall: '10500000005045.5352', N0: 914091, raymond: '18340627899261/125000000000000', cert: '146155678163053/1000000000000000', U1: '144732237251407/1000000000000000' },
    { tag: 'XW20', k: 2, X: 12000000012637, wall: '12000000012637.7051', N0: 977205, raymond: '146117526666441/1000000000000000', cert: '72743288675323/500000000000000', U1: '144073461349513/1000000000000000' },
    { tag: 'X215', k: 2.15, X: 12900000012884, wall: '12900000012884.5645', N0: 1013187, raymond: '72896962562543/500000000000000', cert: '9073021970583/62500000000000', U1: '8986211107371/62500000000000' },
    { tag: 'X230', k: 2.3, X: 13800000005228, wall: '13800000005228.4492', N0: 1047935, raymond: '1454957419371/10000000000000', cert: '144853511841549/1000000000000000', U1: '143471912830333/1000000000000000' },
    { tag: 'XW26', k: 2.6, X: 15600000009475, wall: '15600000009475.44', N0: 1114185, raymond: '144960215684847/1000000000000000', cert: '36063660805739/250000000000000', U1: '142814564577411/1000000000000000' },
  ]),
  U2: '36063660805739/250000000000000',

  window: Object.freeze({
    xL: '15600000002223.2344', xR: '15600000009475.44', NxL: 1114185,
    firstIndex: 33328427938874, lastIndex: 33328427960538, zeros: 21665,
    ordinates: [7800000000999.7362994, 7800000005888.015133],
    source: 'FLINT 3.6.0 Platt isolation + Turing anchors via the Track D chain; rerun 62 CPU s; agrees with Track D’s logged run',
  }),
  bandStartPT: Object.freeze({ qMTYupper: 0.97590603, q0: '195181606067939/200000000000000' }),

  kernels: Object.freeze({
    twoHeight: 'κ ∈ {21/10, 12/5, 11/4, 31/10}, r ∈ {29/50, …, 19/25}, w ∈ {1/50, 3/100, 9/200}, λ = 2, ρ ∈ [17/100, 21/50]; exact Bernstein 4–116 leaves',
    selfTermRule: 'pair self term f(V) = 2(1+a−V)/((1+a−V)² + 4aV), a = r²; f(V) ≤ f(0) ⟺ V(V + 3a − 1) ≥ 0, so 3r² ≥ 1 suffices',
    farField: 'λ = 2: d^-4 coefficient of 2K_y − (2y/h)·avg K_h(d ± a) is 4y(h² − y² − 3a²); at a² = (h² − y²)/3 the d^-6 coefficient is (16/9)y(h² − y²)(4h² − y²) > 0; independent of b',
  }),

  gains: Object.freeze({
    gridByHeight: Object.freeze([[1, -0.0000375], [1.6, -0.000170], [1.7, -0.000191], [1.75, -0.000202], [2, -0.000276], [2.15, -0.000278], [2.3, -0.000299], [2.6, -0.000372]]),
    trackAByHeight: Object.freeze([[1, -0.000432], [1.6, -0.000376], [1.75, -0.000368], [2, -0.000355], [2.3, -0.000343], [2.6, -0.000334]]),
    twoHeightPT: -0.000129646,
    bandRange: [-0.00143, -0.00141],
  }),

  heuristic: Object.freeze({
    zeroConditioned: Object.freeze([[1, 0.147981, 0.146596], [1.6, 0.145619, 0.144202], [1.75, 0.145190, 0.143786], [2, 0.144525, 0.143121], [2.6, 0.143324, null]]),
    crossingsInterpolated: { certNoBand: 2.227, band: 1.653 },
    est16XwithMHandP094: 'within about 2e-5 of 0.145 (not run)',
  }),

  verdict:
    'Λ < 0.145 is NOT reached at PT height: the full stack gives Λ ≤ 0.147273668782792, conditional on Raymond’s chain (G0), Track A’s '
    + 'lemmas, the multi-height consumer, two-height coupling and Lemma B (one internal referee pass each), the FLINT local RH window and MTY. '
    + 'Below 0.145 is reached only at larger verified heights: 0.144867568901016 (band, RH to 5.10e12) and 0.144853511841549 (no band, RH to '
    + '6.90e12); neither height is verified. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const B = B145_STACK;
const band = (r) => Math.max(rat(r.U1), rat(B.U2));
const Tstar = (r) => (rat(r.wall) + 1) / 2;

export const B145_STACK_ASSERTIONS = Object.freeze([
  {
    id: 'b145-stack-pt-height',
    holds: () => {
      const p = B.ptHeight, v = (k) => rat(p[k]);
      return Math.abs(v('band_trackA_grid_MH') - 0.147273668782792) < 1e-15 && Math.abs(v('trackA_grid_MH') - 0.148796921571845) < 1e-15
        && v('raymond') > v('trackA') && v('trackA') > v('trackA_grid') && v('trackA_grid') > v('trackA_grid_MH')
        && v('trackA') > v('trackA_MH') && v('band_trackA') > v('band_trackA_grid') && v('band_trackA_grid') > v('band_trackA_grid_MH')
        && v('band_trackA_grid_MH') - 0.145 > 0.00227 && v('band_trackA_grid_MH') - 0.145 < 0.00228;
    },
    why: 'Each lever lowers the exact PT-height output; best 0.147273668782792 is 0.00227 above 0.145.',
  },
  {
    id: 'b145-stack-heights-and-walls',
    holds: () => B.rows.every((r) => isqrtN0(r.X) === r.N0 && (!r.wall || (rat(r.wall) > r.X && rat(r.wall) - r.X < 1 && Math.abs(Tstar(r) / T_PT - r.k) < 2e-4)))
      && Math.abs(Tstar(B.rows[2]) - 5100000011773.62) < 0.01 && Math.abs(Tstar(B.rows[6]) - 6900000002614.725) < 0.01,
    why: 'N0 = isqrt((X − 4)/4π) at every floor height; each wall within 1 above its floor; T* = (x_w + 1)/2 = k × T_PT; 1.7X → 5.10e12, 2.3X → 6.90e12.',
  },
  {
    id: 'b145-stack-monotone-and-below',
    holds: () => B.rows.every((r, i) => rat(r.cert) < rat(r.raymond) && rat(r.U1) < rat(r.cert)
        && (i === 0 || (rat(r.cert) < rat(B.rows[i - 1].cert) && rat(r.U1) < rat(B.rows[i - 1].U1))))
      && rat(B.U2) === rat(B.rows[7].cert),
    why: 'Stack below Raymond and band U1 below stack at every height; both decrease with X; U2 = 2.6X certified stack.',
  },
  {
    id: 'b145-stack-minimum-certified-heights',
    holds: () => {
      const certFirst = B.rows.find((r) => rat(r.cert) < 0.145), bandFirst = B.rows.find((r) => band(r) < 0.145);
      return certFirst.tag === 'X230' && bandFirst.tag === 'X170' && rat(B.rows[5].cert) > 0.145 && band(B.rows[1]) > 0.145
        && Math.abs(band(B.rows[2]) - 0.144867568901016) < 1e-15 && Math.abs(0.145 - band(B.rows[2]) - 1.324e-4) < 1e-6
        && Math.abs(0.145 - rat(B.rows[6].cert) - 1.465e-4) < 1e-6 && band(B.rows[4]) === rat(B.U2);
    },
    why: 'First certified height below 0.145: 2.3X without band (2.15X fails at 0.145168), 1.7X with band (1.6X fails at 0.145154); margins 1.465e-4 / 1.324e-4; from 2X the band value is U2 = 0.144255.',
  },
  {
    id: 'b145-stack-lambda-log',
    holds: () => {
      const L = Math.log(T_PT), p = B.ptHeight;
      return Math.abs(rat(p.trackA_grid_MH) * L - 4.2749) < 2e-4 && Math.abs(rat(p.band_trackA_grid_MH) * L - 4.2311) < 2e-4
        && Math.abs(rat(p.trackA_grid) * L - 4.2786) < 2e-4 && Math.abs(0.145 * L - 4.1658) < 2e-4
        && B.rows.slice(1).every((r) => { const c = rat(r.cert) * Math.log(Tstar(r)); return c > 4.279 && c < 4.283; });
    },
    why: 'Λ·ln T: 4.2749 (PT stack), 4.2311 (PT band), 4.2786 (Track A + grid), 4.1658 needed; 4.280–4.282 at every larger height.',
  },
  {
    id: 'b145-stack-band-start-and-window',
    holds: () => {
      const xL = rat(B.window.xL), xR = rat(B.window.xR), w = B.window;
      return Math.abs(qMTY(xL) - 0.97590603034) < 1e-10 && rat(B.bandStartPT.q0) > qMTY(xL) && rat(B.bandStartPT.q0) - qMTY(xL) < 2.1e-6
        && w.lastIndex - w.firstIndex + 1 === w.zeros && w.ordinates[0] <= xL / 2 && w.ordinates[1] >= xR / 2
        && xR - xL > 7252 && xR - xL < 7253 && isqrtN0(xL) === w.NxL && xR / 2 > 2.59 * T_PT;
    },
    why: 'q_MTY(x_L) = 0.9759060303 < q0; 21,665 consecutive indices; ordinates cover [x_L/2, x_R/2] = [7800000001111.6, 7800000004737.7]; width 7252.2.',
  },
  {
    id: 'b145-stack-farfield-and-selfterm',
    holds: () => {
      let ok = true;
      for (const [h, y, b] of [[1.3, 0.5, 0.3], [2.0, 0.6, 0.6], [0.8, 0.3, 0.1]]) {
        const a = Math.sqrt((h * h - y * y) / 3), d = 200;
        const g = (aa) => 2 * K(y, d, b) - (2 * y / h) * (K(h, d - aa, b) + K(h, d + aa, b)) / 2;
        const c6 = (16 / 9) * y * (h * h - y * y) * (4 * h * h - y * y);
        ok = ok && Math.abs(g(0.4 * a) * d ** 4 / (4 * y * (h * h - y * y - 3 * (0.4 * a) ** 2)) - 1) < 1e-3
          && Math.abs(g(a) * d ** 6 / c6 - 1) < 2e-3 && g(a) > 0;
      }
      for (const r of [29 / 50, 3 / 5, 19 / 25]) {
        const aa = r * r, f = (V) => (2 * (1 + aa - V)) / ((1 + aa - V) ** 2 + 4 * aa * V);
        ok = ok && 3 * aa >= 1 && [0.01, 0.05, 0.1, 0.2].every((V) => f(V) <= f(0));
      }
      return ok;
    },
    why: 'Far-field: d^-4 coefficient 4y(h² − y² − 3a²), sharp-law d^-6 coefficient (16/9)y(h² − y²)(4h² − y²) > 0 (numerical at d = 200); two-height pair self term decreasing for 3r² ≥ 1.',
  },
  {
    id: 'b145-stack-rh-extension-cost',
    holds: () => {
      const ch = (T) => (T - T_PT) / FLINT_RATE / 3600;
      return Math.abs(ch(5100000011773.62) / 6.63e6 - 1) < 0.01 && Math.abs(ch(6900000002614.725) / 1.231e7 - 1) < 0.01
        && ch(5100000011773.62) < ch(6.0e12) && ch(6.0e12) < ch(6900000002614.725);
    },
    why: 'At the measured FLINT rate 88 units/core-s: RH to 5.10e12 ≈ 6.63e6 core-hours, to 6.90e12 ≈ 1.23e7 (Track B’s PT-scaled 5.5–7.2e6 / 1.03–1.34e7).',
  },
  {
    id: 'b145-stack-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(B.verdict) && /NO QED/.test(B.verdict) && /NOT reached at PT height/.test(B.verdict)
      && /neither height is verified/.test(B.verdict) && /NO QED/.test(B.status),
    why: 'Sub-0.145 values are conditional on unverified RH height and unrefereed (externally) arguments; no bound below 0.2 proved.',
  },
]);

export default B145_STACK;
