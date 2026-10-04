/**
 * @fileoverview b145-floor-2026-10-01 — Track A: a larger certified surplus selection in Raymond’s joint source floor
 * (Zenodo 22867547 chain, regenerated locally on 2026-09-30) at PT height. One internal adversarial referee pass (minor,
 * not refuted; four precision/independence reruns and Raymond’s own deposited consumer).
 *
 * Referee corrections applied:
 *  - Lemma R and the C_g monotonicity lemma are new inputs to a conditional result, not unconditional proofs. Grade:
 *    “new lemma, refereed once internally; part of a conditional result”. The referee re-derived both (C_g: every cover term
 *    is a product of (e^{t·lp·lw/2} − 1) and (e^{t·lp·lq/2} − 1), nonnegative and nondecreasing in w and t; Lemma R:
 *    |γ(x,t,0)| = 1, d/dx arg γ = Re β_t((1+ix)/2) = L/2 + O(12.5/x), numerical deviation ≤ 4.0e-14 against the 1e-9 allowance).
 *  - The headline 0.148963469500858 uses Raymond’s 128-substep Final_Comparison scheme (his published 0.149395073827688 uses
 *    the same). His deposited 4-substep assemble_joint.integrate on the same tables gives 0.148966747317379 (primary) and
 *    0.148966747319452 (alternate); both are below 0.149.
 *  - The free-label relaxation values at t = 0.075 are ascent values (lower bounds on that relaxation’s maximum). The referee’s
 *    bracket [0.636, 0.7495] at r = 1/2 uses the reasoning that Track A’s certificate applies to the relaxation; that upper end
 *    is reasoning, not a checked theorem.
 *  - The t = 0 torus-model zero fact needs the polygon condition (no single amplitude exceeds the sum of the others, constant 1
 *    included); it holds since every a_j < 1.
 *  - Correction to s145-zero-conditioned-floor-2026-09-30: “the barrier must stay above model torus zeros” is NOT a valid
 *    necessary condition. Raymond’s own certified barrier fails it (y = 0.4766 at t = 0.0875 vs model zero 0.4887; 0.4030 vs
 *    0.4041 at t = 0.1), and the t = 0 model has zeros above the strip |y| ≤ 1, so the model’s zeros are not bounded by the
 *    barrier. The rejection of the re-optimised-height path that relied on that test is withdrawn; its kernel-domain clamp
 *    correction stands.
 *
 * PROVED: nothing unconditional. CERTIFIED (python-flint arb 128 bit; reruns at 192 and 320 bit bit-identical): head (H),
 *  product-tail (T) and reflected (R) surplus gains on all 608 cells × 9 finite pair classes × 11 modes; exact rational
 *  comparison output below. CONDITIONAL: Λ ≤ 74481734750429/5e14 given Raymond’s analytic chain (G0), Lemma R, C_g lemma,
 *  PT Theorem 1 and the regenerated wall/probe floors at X = 6000000185827. MEASURED: binding pair class, window sensitivity,
 *  uniform-shift requirement, free-label relaxation. HEURISTIC: Track-A ceiling ≈ 0.1485 at the fixed schedule.
 * Verdict: Track A cannot reach 0.145 at PT height. PT Lambda <= 0.2 stands. RH open. NO QED.
 * Files: tmp/b145-A-{gains,basepairs,assemble,path,spotcheck}.py, tmp/b145-A-out/{RESULT,PATH}.json, tmp/b145-A-scout/,
 *  referee tmp/b145-refA-*.py + tmp/b145-refA-out/; large artifacts /tmp/b145-A-archive/ (outside the repo).
 * Import-free. ASSERTIONS recompute the rationals, the ablation order, ΔΛ, the 4- vs 128-substep gap, the uniform-shift
 * crossing, Λ·ln T, the cover-term sign, and the barrier-vs-model-zero counterexample.
 */

const T_PT = 3.0001753e12;
const rat = (s) => { const [a, b] = s.split('/').map(Number); return a / (b ?? 1); };
const lerpX = (x0, y0, x1, y1, y) => x0 + ((y0 - y) / (y0 - y1)) * (x1 - x0);

export const B145_FLOOR = Object.freeze({
  id: 'b145-floor-2026-10-01',
  date: '2026-10-01',
  title: 'Track A: larger certified surplus selection in the joint source floor — Λ ≤ 0.148963 conditional, PT height',
  status:
    'CONDITIONAL (Raymond chain G0 + two new lemmas refereed once internally) + CERTIFIED numerics + MEASURED sensitivity. '
    + 'One internal referee pass (minor, not refuted). No bound below 0.2 is proved. NO QED.',
  headline:
    'Adding three disjoint families of constant-label surplus pairs (head labels 1025..N0, Euler product-tail labels, reflected labels) '
    + 'to Raymond’s certified joint floor lowers the exact comparison output at PT height from 0.149395073827688 to 0.148963469500858 '
    + '(ΔΛ = −0.000431604). Reaching 0.145 at Raymond’s schedule needs about +0.266 of floor in every cell, more than the gap to the '
    + 'Kronecker torus at early cells.',

  ablation: Object.freeze([
    { step: 'Raymond base', U: '18674384228461/125000000000000', Uf: 0.149395073827688, lastRow: 597 },
    { step: '+head', U: '1193547369487/8000000000000', Uf: 0.149193421185875, lastRow: 596 },
    { step: '+head+tail', U: '37282756082987/250000000000000', Uf: 0.149131024331948, lastRow: 596 },
    { step: '+head+tail+reflected', U: '74481734750429/500000000000000', Uf: 0.148963469500858, lastRow: 595 },
  ]),
  consumer4substep: Object.freeze({ base: '74699079867361/500000000000000', trackA: 0.148966747317379, trackAalt: 0.148966747319452 }),

  lemmas: Object.freeze([
    { id: 'Lemma R', grade: 'new lemma, refereed once internally; conditional input',
      statement: 'reflected label (d,n): phase change between probes x ± a is a(L(x) + log d − log n) with error < 1e-10 (a < 2); from d/dx arg γ(x,t,0) = Re β_t((1+ix)/2) = L/2 + O(12.5/x), AF eq. (4.6)',
      check: 'mpmath 50 digits: deviation ≤ 4.0e-14 over t ∈ [0, 0.152], a ≤ 1.99, x ∈ [X − 2, 2.2X]' },
    { id: 'C_g monotonicity', grade: 'new lemma, refereed once internally; conditional input',
      statement: 'C_g(u) = Σ_{d|g} μ(d) β_d b(u/d) is nondecreasing for u ≥ g; hence c_n ≥ C_{gcd(n,30)}(n1) on each head bin',
      check: '4000-point grid at 5 times; 0 violations in 3000 random (t, L) points; per-label float64 rebuild never below the certified gain' },
  ]),

  gainsCell300: Object.freeze({ pair: '(0,0)', r12: { head: 0.013483, tail: 0.012796, reflected: 0.024980 },
    perLabelFloat: { head: 0.013640, tail: 0.012927, reflected: 0.025111 }, sharp: { head: 0.0099, tail: 0.0115, reflected: 0.0148 } }),
  jointGain: Object.freeze({ cell0: { r12: 0.0117, sharp: 0.0070 }, cell300: { r12: 0.0513, r35: 0.0454, sharp: 0.0362 }, cell600: { r12: 0.0672, sharp: 0.0419 } }),

  sensitivity: Object.freeze({
    bindingPairClass: { cls: '(0,0)', count: 6504, of: 6688 },
    perWindowPlus002: Object.freeze([-5.6e-5, -5.9e-5, -6.0e-5, -6.3e-5, -5.3e-5, -2.4e-5]),
    uniformShift: Object.freeze([[0.1, 0.147433], [0.2, 0.145947], [0.265, 0.145003], [0.27, 0.144931], [0.28, 0.144787], [0.3, 0.144501]]),
    kroneckerReplayFixedSchedule: 0.14615,
    t0Cost: { raymond: 0.469, kronecker: 0.377 },
  }),

  costsT0075: Object.freeze({
    kronecker: 0.5335,
    raymondCertified: { r12: 0.8008, r35: 0.7937, r920: 0.8073 },
    trackACertified: { r12: 0.7495, r35: 0.7483, sharp: 0.7714 },
    freeLabelAscentLower: { r12: 0.6361, r35: 0.6218, r920: 0.6721 },
    note: 'free-label values are ascent values = LOWER bounds on that relaxation’s maximum; no proved upper bound exists from ascent',
  }),

  barrierVsModelZero: Object.freeze([
    { t: 0.0875, raymond: 0.4766, trackA: 0.4752, modelZero: 0.4887 },
    { t: 0.1, raymond: 0.4030, trackA: 0.4012, modelZero: 0.4041 },
  ]),

  heuristicCeiling: Object.freeze({ floatModel3Primes: 0.14884, withAllIncrements: 0.1485,
    increments: 'second-order head–head pairs (−0.0002), 4 Euler primes (−0.00015), narrower sharp-mode displacement and finer sub-rows (−0.0001 each)' }),

  verdict:
    'Λ ≤ 74481734750429/500000000000000 = 0.148963469500858 at PT height, CONDITIONAL on Raymond’s analytic chain (G0 open externally), '
    + 'Lemma R and the C_g lemma (one internal referee pass each), PT Theorem 1 and the regenerated floors. Track A tops out near 0.1485 at '
    + 'the fixed schedule; 0.145 at PT height would need certified floors within about 0.05 of the Kronecker torus. The “barrier above model '
    + 'zeros” criterion is withdrawn. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const A = B145_FLOOR;

export const B145_FLOOR_ASSERTIONS = Object.freeze([
  {
    id: 'b145-floor-rationals-and-ablation',
    holds: () => A.ablation.every((r, i, a) => Math.abs(rat(r.U) - r.Uf) < 1e-15 && (i === 0 || r.Uf < a[i - 1].Uf))
      && Math.abs(rat(A.ablation[3].U) - rat(A.ablation[0].U) + 0.000431604326830) < 1e-15 && rat(A.ablation[3].U) > 0.145,
    why: 'Each exact output parses to its decimal; base > +head > +head+tail > +reflected; ΔΛ = −0.000431604326830; still above 0.145.',
  },
  {
    id: 'b145-floor-substep-schemes',
    holds: () => {
      const d = A.consumer4substep.trackA - rat(A.ablation[3].U);
      return d > 0 && d < 4e-6 && A.consumer4substep.trackA < 0.149 && rat(A.consumer4substep.base) > rat(A.ablation[0].U);
    },
    why: 'Raymond’s deposited 4-substep consumer gives 0.148966747 (3.3e-6 above the 128-substep value) and 0.149398 on base tables.',
  },
  {
    id: 'b145-floor-uniform-shift-crossing',
    holds: () => {
      const s = A.sensitivity.uniformShift;
      const mono = s.every(([, u], i) => i === 0 || u < s[i - 1][1]);
      const k = s.findIndex(([, u]) => u < 0.145);
      const x = lerpX(s[k - 1][0], s[k - 1][1], s[k][0], s[k][1], 0.145);
      return mono && x > 0.264 && x < 0.267 && A.sensitivity.t0Cost.raymond - 0.266 < A.sensitivity.t0Cost.kronecker;
    },
    why: 'U(shift) decreasing; 0.145 crossed at ≈ +0.265; at t = 0 the shifted cost 0.469 − 0.266 = 0.203 would sit below Kronecker 0.377.',
  },
  {
    id: 'b145-floor-lambda-log-constant',
    holds: () => {
      const c = A.ablation[3].Uf * Math.log(T_PT), need = 0.145 * Math.log(T_PT);
      return Math.abs(c - 4.2797) < 1e-3 && Math.abs(need - 4.1658) < 1e-3;
    },
    why: 'Λ·ln T = 4.2797 for Track A at PT height vs 4.1658 needed for 0.145.',
  },
  {
    id: 'b145-floor-cover-term-sign',
    holds: () => {
      let ok = true;
      for (const t of [0, 0.0375, 0.075, 0.12, 0.152]) for (const lp of [Math.log(2), Math.log(3), Math.log(5)])
        for (let w = 1; w <= 50; w += 0.5) {
          const f = (ww) => Math.exp((t * lp * Math.log(ww)) / 2) - 1;
          ok = ok && f(w) >= 0 && f(w + 0.5) >= f(w);
        }
      return ok;
    },
    why: 'Each factor (e^{t·lp·lw/2} − 1) of a C_g cover term is ≥ 0 and nondecreasing in w ≥ 1 for t ≥ 0 (the monotonicity mechanism).',
  },
  {
    id: 'b145-floor-model-zero-criterion-invalid',
    holds: () => A.barrierVsModelZero.every((r) => r.raymond < r.modelZero && r.trackA < r.raymond)
      && A.costsT0075.freeLabelAscentLower.r12 < A.costsT0075.trackACertified.r12
      && A.costsT0075.freeLabelAscentLower.r12 - A.costsT0075.kronecker > 0.09,
    why: 'Raymond’s own certified barrier lies below a model torus zero at t = 0.0875 and 0.1, so that test cannot be a necessary condition; free-label ascent ≥ 0.636 sits 0.10 above Kronecker.',
  },
  {
    id: 'b145-floor-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(A.verdict) && /NO QED/.test(A.verdict) && /NO QED/.test(A.status)
      && A.lemmas.every((l) => /refereed once internally/.test(l.grade)) && /LOWER bounds/.test(A.costsT0075.note),
    why: 'New lemmas graded as refereed-once conditional inputs; ascent values labelled lower bounds; no bound below 0.2 proved.',
  },
]);

export default B145_FLOOR;
