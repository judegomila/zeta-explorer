/**
 * @fileoverview route-24-mean-field-local-counts-2026-10-11 — roadmap route 24 (batch 6): mean-field (mirror) descent with a local zero
 * count at t > 0 taken from the Polymath15 effective approximation. One run plus one adversarial internal referee pass (not refuted;
 * severity minor); the referee corrections are applied below.
 *
 * PROVED (elementary): (a) S_t(x, η) = −Im(H_t′/H_t)(x + iη) = −∂_x arg H_t(x + iη) is the Poisson(η)-smoothed zero count (the B2 /
 *  wide-Poisson input of rh-bridge-mirror-descent); (b) any x-uniform lower bound q on S_t(·, η) near x = X satisfies q ≤ L/4 + o(1) =
 *  (1/2) ln N (every zero with |Im| < η contributes total x-mass π; standard N_t(T) asymptotic); at the seam X = 6e12, L/4 = 6.7229;
 *  (c) −Im(B_t′/B_t)(x + iη) = (1/2) Re ψ_t((1 + η − ix)/2) = L/4 + O(t/x + 1/x²), so the approximation's loss is entirely in −Im(G′/G).
 * CERTIFIED (Arb 128-bit, exact sum over n ≤ N = 690988 at x = X; a statement about the triangle method, NOT about H_t): R(y, t) =
 *  1 − D((1+y)/2) − e^{0.02y − yL/2}(1 + D((1−y)/2)) < 0 at the de Bruijn ceiling y = √(1−2t) for t = 0.02, 0.04, …, 0.13, 0.137 (upper
 *  bounds −7.17 … −0.00231). R is increasing in y (D_B and γD_A decrease in y since n ≤ N < x/4π; stated by the referee), so on these t the
 *  P15 triangle criterion at x = X controls arg H_t only above de Bruijn's ceiling: no zero-free strip, no local count for the zeros the
 *  descent must move. Values between grid points are float only.
 * CONDITIONAL: if P15 Thm 1.3 is formally extended to 1 < y ≤ 4 (unproved), plus B1's residuals, B2 as stated, binding height x = X and a
 *  barrier at y0 ≈ 0.066, the q_t(η) envelope gives Λ ≈ 0.192 — an independent reproduction of mirror-descent C3 (0.1906; referee 0.1910;
 *  closed there as "not a lever"), not a new result. Within P15's stated range η ≤ 1 there is no gain at all (Λ = 0.5; Y(0.1314) = 0.857),
 *  because η ≥ √5·Y with Y ≥ 0.857 needs η > 1.
 * MEASURED (float64): triangle control reaches the ceiling at t_c = 0.13720 (X), 0.12341 (6e13), 0.11216 (6e14); Y_dom(0.13) = 0.935 vs
 *  ceiling 0.860; q_{0.1}(2) = 5.88, q_{0.1}(3) = 6.49, q_{0.13}(1) = −7.4, q_{0.15}(1) = 4.08 against L/4 = 6.723. Ideal B2 channel
 *  (q = L/4 at every η, A4/B2 single-width implication η ≥ √5·y with constant 2y/η): p(0.165) = 1.7462, descent 1 → 0.165 takes 0.13631 >
 *  t0 = 0.1314, Λ_inf = 0.14824 (continuous η; 0.14884 on the η grid); 0.13786 at ln N = 14.597, 0.11128 at 18.509.
 * HEURISTIC: "counting with the argument principle does no better" (vertical sides cross the uncontrolled band, O(L) per side by
 *  Backlund/Jensen) — moved from proved by the referee; |Im G′/G| ≤ |G′|/|G| is crude but better cancellation only moves toward the ideal
 *  ceiling; pointwise counts at every x in [X, x0(t)] would be a verified-height problem in disguise.
 *
 * Ceiling statement (referee-corrected): under the A4/B2 single-width wide-Poisson implication, any x-uniform input q ≤ L/4 gives Λ ≥ 0.14824
 * at the seam X = 6e12 (descent 0.13631 > 0.1314). The U = 0.145 lane needs q = 6.991 = 1.040 × L/4, which becomes the mean once the binding
 * height reaches ≈ 1.75e13. This is a ceiling of the B2 lemma at the current seam (the usual O(1/log X) height effect), not of
 * argument-control information in general (several-width kernel dominations are not covered). Frontier for comparison: collect6 route P
 * alone 0.145535458600488, joint 0.145276368594868 (round-7 certified 0.145694083872924).
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_24_ASSERTIONS recompute live: N = ⌊√(X/4π)⌋ and L/4,
 * the de Bruijn ceilings, p_req, the B2 envelope (η-optimised p(Y), Simpson descent times, Λ_inf at three heights, the η ≤ 1 time), the q
 * needed to close the lane and its binding height, and the sign pattern of the stored Arb R values.
 */

const { PI, abs, sqrt, log, exp, floor, max } = Math;

export const ROUTE_24 = Object.freeze({
  id: 'route-24-mean-field-local-counts-2026-10-11',
  route: 24,
  date: '2026-10-11',
  title: 'Route 24: mean-field descent with t > 0 local counts — no rigorous gain; B2 channel ceiling Λ ≈ 0.148 at the current seam',
  status: 'done',
  headline: 'At X = 6e12 and t ≤ 0.137 the P15 triangle method controls arg H_t only above de Bruijn\'s ceiling √(1−2t) (Arb on a grid; a '
    + 'statement about the method), so it supplies no local count for the zeros the descent moves. Its usable output, the Poisson-smoothed count '
    + 'at height η, is capped by its mean L/4; under the B2 single-width lemma even q = L/4 gives only Λ ≈ 0.148 at the current seam, above '
    + 'the internal 0.145535 (route P alone, collect6).',

  seam: Object.freeze({ X: 6e12, N: 690988, Lover4: 6.7229, t0: 0.1314, y0: 0.165, pReq: 4.3743 }),
  arbR: Object.freeze([[0.02, -7.17], [0.04, -4.02], [0.06, -2.27], [0.08, -1.25], [0.10, -0.629], [0.12, -0.234], [0.13, -0.0887], [0.137, -0.00231]]),
  DB: Object.freeze({ t002: 7.69, t0137: 0.9955 }),
  tc: Object.freeze({ X: 0.13720, X6e13: 0.12341, X6e14: 0.11216, rAt01372: 4e-6 }),
  yDom: Object.freeze({ t013: 0.935, t015: 0.715, t020: 0.26, t02163: 0.185, ceiling013: 0.860 }),
  q: Object.freeze({ t01eta2: 5.88, t01eta3: 6.49, t013eta1: -7.4, t015eta1: 4.08 }),
  b2Ideal: Object.freeze({ p0165: 1.7462, eta0165: 0.673, T1to0165: 0.13631, LambdaInf: 0.14824, LambdaGrid: 0.14884,
    lnN14597: 0.13786, lnN18509: 0.11128, etaLe1T: 0.44438, qNeeded: 6.991, qNeededRatio: 1.0399, bindingHeightForLane: 1.75e13 }),
  formalExtension: Object.freeze({ Lambda: 0.19217, at: Object.freeze([0.19, 0.066]), priorC3: 0.1906, priorC3Referee: 0.1910, grade: 'conditional, not new' }),
  withinP15: Object.freeze({ Lambda: 0.5, Y01314: 0.857 }),
  frontier: Object.freeze({ round7: 0.145694083872924, collect6RouteP: 0.145535458600488, joint: 0.145276368594868 }),

  refereeKilled: Object.freeze([
    'mislabelled: "the argument principle does no better (O(L) per vertical side)" is a Backlund/Jensen-type sketch — moved to heuristic',
    'overstated ceiling: Λ ≈ 0.148 is a ceiling of the specific A4/B2 single-width implication (η ≥ √5·y, constant 2y/η), not of argument control in general; the mirror-descent nextStep "prove 2y/η is forced" is not settled',
    'height-dependent margin: the ideal B2 channel closes the U = 0.145 lane at q = 6.991 = 1.040 × L/4, i.e. binding height ≈ 1.75e13 (≈ 2.9X) — the usual O(1/log X) effect; "do not re-attempt" holds at the current seam only',
    'not new: the formal-extension Λ ≈ 0.192 reproduces mirror-descent C3 (0.1906, referee 0.1910, "not a lever")',
    'q_grid |G′| bound: fixed-N Cauchy estimate across N-jump abscissae and the 0.1 slack in |γ′| ≤ |γ|(L/2 + 0.1) are asserted, not derived (both ample, confined to measured)',
    'stale citation: "0.145694 certified" is round 7; collect6 route P alone is 0.145535458600488 (joint 0.145276368594868 correct)',
    'unstated step: monotonicity of R in y (needed for "nothing below the ceiling") holds analytically (n ≤ N < x/4π) — now stated',
  ]),
  nextStep: '(1) Record in the mirror-descent module: the B2 single-width channel has a ceiling Λ ≈ 0.148 at the current seam X = 6e12 (q ≤ L/4), '
    + 'which drops below 0.145 only once the binding height reaches ≈ 1.75e13; (2) record t_c = 0.1372 at X as the earliest time the P15 triangle '
    + 'method says anything below de Bruijn\'s ceiling; (3) the open lever is a different kernel domination (several Poisson widths) or a proof that '
    + 'the 2y/η loss is forced; no further compute on route 24.',
  files: Object.freeze(['tmp/routes-b6-r24-meanfield/explore_ydom.py', 'tmp/routes-b6-r24-meanfield/ceiling_cross.py', 'tmp/routes-b6-r24-meanfield/arb_ceiling_check.py',
    'tmp/routes-b6-r24-meanfield/arb_ceiling_check.json', 'tmp/routes-b6-r24-meanfield/q_grid.py', 'tmp/routes-b6-r24-meanfield/q_grid.json', 'tmp/routes-b6-r24-meanfield/descent.py',
    'tmp/routes-b6-r24-meanfield/b2_ceiling.py', 'tmp/routes-b6-ref24-floatR.py', 'tmp/routes-b6-ref24-b2ceil.py', 'tmp/routes-b6-ref24-qspot.py', 'tmp/routes-b6-ref24/']),
  verdict: 'Route 24 is closed as a map; no bound moves. The P15 triangle control at x = X reaches below de Bruijn\'s ceiling only for t ≥ t_c = '
    + '0.13720 (Arb-confirmed on a grid as a statement about the method). Local counts from argument control at height η are Poisson-smoothed '
    + 'counts capped by the mean L/4; under the A4/B2 single-width lemma that caps the channel at Λ ≈ 0.148 at the current seam (a ceiling of the '
    + 'lemma, not of argument control in general; it falls below 0.145 at binding height ≈ 1.75e13). Within P15\'s range η ≤ 1: Λ = 0.5 (no gain); '
    + 'the formal η ≤ 4 extension reproduces mirror-descent C3 (≈ 0.19). No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_24;
// B2 single-width wide-Poisson rate (A4): p(Y) = max_{η ≥ √5 Y} (2Y/η)(q − 2η/(η² − Y²)), clipped at 0
const pB2 = (Y, q, emax = 60) => { const lo = sqrt(5) * Y; if (emax <= lo) return 0; const f = (e) => ((2 * Y) / e) * (q - (2 * e) / (e * e - Y * Y));
  const n = 400; let best = -Infinity; let bi = 0; const es = [];
  for (let i = 0; i <= n; i += 1) { const e = lo * (1 + 1e-9) * (emax / lo) ** (i / n); es.push(e); const v = f(e); if (v > best) { best = v; bi = i; } }
  let a = es[max(bi - 1, 0)]; let b = es[Math.min(bi + 1, n)];
  for (let k = 0; k < 80; k += 1) { const m1 = a + (b - a) * 0.382; const m2 = a + (b - a) * 0.618; if (f(m1) > f(m2)) b = m2; else a = m1; }
  return max(0, best, f((a + b) / 2)); };
const descentT = (y0, q, emax = 60, n = 2000) => { const h = (1 - y0) / n; let s = 0;
  for (let i = 0; i <= n; i += 1) { const Y = y0 + i * h; const g = Y > 0 ? 1 / (1 / Y + pB2(Y, q, emax)) : 0; s += g * (i === 0 || i === n ? 1 : (i % 2 ? 4 : 2)); }
  return (s * h) / 3; };
const descentConst = (p, y0) => (1 / p - y0 / p) - (log(1 + p) - log(1 + p * y0)) / (p * p);

export const ROUTE_24_ASSERTIONS = Object.freeze([
  {
    id: 'r24-seam-N-and-mean',
    holds: () => { const N = floor(sqrt(R.seam.X / (4 * PI))); return N === R.seam.N && abs(log(N) / 2 - R.seam.Lover4) < 1e-4 && abs(log(R.seam.X / (4 * PI)) / 4 - R.seam.Lover4) < 1e-4; },
    why: 'N = ⌊√(X/4π)⌋ = 690988 at X = 6e12; L/4 = (1/2) ln N = (1/4) ln(X/4π) = 6.7229 = π × zero density (mean ceiling on any x-uniform q).',
  },
  {
    id: 'r24-de-bruijn-ceiling',
    holds: () => abs(sqrt(1 - 2 * 0.13) - R.yDom.ceiling013) < 5e-4 && R.yDom.t013 > R.yDom.ceiling013 && sqrt(1 - 2 * R.tc.X) > R.yDom.t02163
      && R.arbR.every(([, r]) => r < 0) && R.arbR.every(([, r], i, a) => i === 0 || r > a[i - 1][1]) && R.tc.rAt01372 > 0 && R.tc.X > 0.137,
    why: 'Ceiling √(1−2t) = 0.860 at t = 0.13 < Y_dom = 0.935; stored Arb upper bounds of R at the ceiling are negative on t ≤ 0.137 and increase toward 0; R = +4e-6 at 0.1372 (crossing t_c = 0.13720).',
  },
  {
    id: 'r24-p-req',
    holds: () => { let lo = 1; let hi = 10; for (let k = 0; k < 80; k += 1) { const m = (lo + hi) / 2; if (descentConst(m, R.seam.y0) > R.seam.t0) lo = m; else hi = m; }
      return abs(lo - R.seam.pReq) < 1e-3; },
    why: 'Constant rate needed for 1 → 0.165 by t0 = 0.1314: ∫ Y/(1 + pY) dY = t0 gives p_req = 4.3743.',
  },
  {
    id: 'r24-b2-ideal-ceiling',
    holds: () => { const q = R.seam.Lover4; const b = R.b2Ideal;
      return abs(pB2(R.seam.y0, q) - b.p0165) < 1e-3 && abs(descentT(R.seam.y0, q) - b.T1to0165) < 2e-5 && abs(descentT(0, q) - b.LambdaInf) < 2e-5
        && abs(descentT(0, 14.597 / 2) - b.lnN14597) < 2e-5 && abs(descentT(0, 18.509 / 2) - b.lnN18509) < 2e-5
        && descentT(R.seam.y0, q) > R.seam.t0 && b.LambdaInf > R.frontier.collect6RouteP && b.p0165 < R.seam.pReq; },
    why: 'η-optimised B2 rate with q = L/4: p(0.165) = 1.7462 (< p_req 4.3743); descent 1 → 0.165 = 0.13631 > t0; Λ_inf = T(1 → 0) = 0.14824 > 0.145535 (collect6); 0.13786 / 0.11128 at ln N = 14.597 / 18.509.',
  },
  {
    id: 'r24-eta-le-1-no-gain',
    holds: () => abs(descentT(R.seam.y0, R.seam.Lover4, 1) - R.b2Ideal.etaLe1T) < 3e-4 && sqrt(5) * R.withinP15.Y01314 > 1 && R.withinP15.Lambda === 0.5,
    why: 'Restricting η ≤ 1 (P15\'s stated range) the ideal descent already takes 0.444 ≫ t0; with the realistic loss Y stays at 0.857 and √5·0.857 > 1, so B2 is unusable (Λ = 0.5).',
  },
  {
    id: 'r24-lane-q-and-height',
    holds: () => { let lo = R.seam.Lover4; let hi = 10; for (let i = 0; i < 30; i += 1) { const m = (lo + hi) / 2; if (descentT(R.seam.y0, m, 60, 400) > R.seam.t0) lo = m; else hi = m; }
      const Xb = 4 * PI * exp(2 * hi) ** 2; return abs(hi - R.b2Ideal.qNeeded) < 2e-3 && abs(hi / R.seam.Lover4 - R.b2Ideal.qNeededRatio) < 5e-4 && abs(Xb / R.b2Ideal.bindingHeightForLane - 1) < 0.02; },
    why: 'q needed to close the U = 0.145 lane under B2: 6.991 = 1.040 × L/4, the mean at ln N = 13.98, i.e. binding height 4π N² ≈ 1.75e13 (≈ 2.9X): an O(1/log X) height effect, not a height-independent obstruction.',
  },
  {
    id: 'r24-formal-extension-is-c3',
    holds: () => abs(R.formalExtension.Lambda - R.formalExtension.priorC3Referee) < 0.003 && R.formalExtension.Lambda < 0.2 && R.formalExtension.Lambda > R.frontier.round7
      && /not new/.test(R.formalExtension.grade) && R.frontier.joint < R.frontier.collect6RouteP && R.frontier.collect6RouteP < R.frontier.round7,
    why: 'Formal η ≤ 4 envelope 0.19217 ≈ mirror-descent C3 0.1906/0.1910 (not new; above every internal frontier value); frontier cited as collect6 0.145535 / joint 0.145276, not the stale round-7 0.145694.',
  },
  {
    id: 'r24-honest-scope',
    holds: () => R.status === 'done' && /not of argument control in general/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && /no bound moves/.test(R.verdict) && R.refereeKilled.length === 7,
    why: 'Ceiling scoped to the B2 lemma at the current seam; method statement not an H_t theorem; no Λ change; no QED.',
  },
]);

export default ROUTE_24;
