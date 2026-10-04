/**
 * @fileoverview r3-cg-2026-10-03 — Lemma CG (c_n(t) ≥ 0 and nondecreasing for every n ≥ 1, t ≥ 0, via the covering form of the
 * squarefree-g | 30 Möbius sums) and Theorem 4′ (Raymond's joint-pair lemma for any shift interval I ⊂ (0,2) and the Track A
 * families, as an implication from the one-point input (OP) + Lemma CG + Lemma R). Documents: formalization/paper/cg-monotonicity.md,
 * formalization/paper/joint-pair-arbitrary-shift.md; verifiers verify_cg_monotonicity.py (PASS, 53 s), verify_joint_pair_shifts.py (PASS, 17 s).
 * One adversarial internal referee pass (tmp/r3-ref-cg-*: sympy identities, python-flint 96/320 bit, system FLINT 3.6.0 C at 200/512 bit,
 * independent 320-bit recomputation of every table Route P reads): not refuted, minor.
 *
 * Referee corrections applied:
 *  - Lemma R restated for every x ≥ X − 2 + a (x − a ≥ X − 2, inside AF (4.6)); ε_R ≤ 4.2897e-12 at X_PT, 2.689e-12 (1.6X), 2.608e-12 (1.65X),
 *    1.660e-12 (2.6X). The sketch is complete and is now labelled a proof (joint-pair-arbitrary-shift.md, this synthesis).
 *  - Route P provenance: 0.1448843462793 = r2-floor-consume-shift.py --const −0.02 on corrected_m0023 (build_sets/integrate of r2-floor-consume.py);
 *    Raymond catalogue kernels + sharp law only, U2 from catalogue XW26 tables: Route P uses no two-height kernel and no out-of-catalogue ratio.
 *  - Raymond's Theorem 4 is already stated for arbitrary displacement a; Theorem 4′ adds shift intervals I and the Track A head/tail/reflected
 *    families. The arbitrary-shift G0 item reduces to G0-c + G0-d.
 *  - Entries at 1.6X/1.65X/2.6X also need G0-d′ (X-transfer of AF §§4–9). Main §8/§11 are covered by AF §11/§12 (internal SOUND).
 *  - verify_cg_monotonicity.py docstring: u ∈ [g, (1+3e6)g] (fixed in this synthesis).
 *
 * PROVED (written; one internal referee pass + exact computer algebra): Lemma CG and CG1–CG6 (G0-a CLOSED, internal), Theorem 4′ as an
 *  implication, Lemma R (corrected domain). CERTIFIED: arb/FLINT checks of the identity, term signs, increments, bin rules; independent
 *  recomputation of stored joint-floor entries (stored ≤ independent). CONDITIONAL: (OP) = AF §§6–9 (G0-d), X-transfer (G0-d′).
 * Verdict: see `verdict`. Import-free. ASSERTIONS enumerate |Cov(P)| (1, 1, 5, 45), check the Möbius = covering identity and
 *  monotonicity live on random data, show the t → 0 cancellation that the covering form avoids, recompute ε_R at four heights,
 *  N0 = ⌊√((X − 4)/4π)⌋ at X_PT and the max r·h < 2.
 */

const popc = (x) => { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; };
const pairsOf = (m) => { const P = []; for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) P.push([i, j]); return P; };
const covers = (m) => {
  const P = pairsOf(m), out = [];
  for (let T = 0; T < 1 << m; T++) for (let E = 0; E < 1 << P.length; E++) {
    let V = T; P.forEach(([i, j], k) => { if (E >> k & 1) V |= (1 << i) | (1 << j); });
    if (V === (1 << m) - 1) out.push([T, E]);
  }
  return out;
};
// X_p = e^{t l_p l_u/2} − 1, Y_pq = e^{t l_p l_q/2} − 1; Möbius side with plain products, covering side with expm1 terms
const forms = (lp, lu, t) => {
  const m = lp.length, P = pairsOf(m);
  const Xe = lp.map((l) => Math.expm1((t * l * lu) / 2)), Ye = P.map(([i, j]) => Math.expm1((t * lp[i] * lp[j]) / 2));
  let mob = 0;
  for (let S = 0; S < 1 << m; S++) {
    let v = 1; for (let i = 0; i < m; i++) if (S >> i & 1) v *= Math.exp((t * lp[i] * lu) / 2);
    P.forEach(([i, j]) => { if ((S >> i & 1) && (S >> j & 1)) v *= Math.exp((t * lp[i] * lp[j]) / 2); });
    mob += (m - popc(S)) % 2 ? -v : v;
  }
  let cov = 0;
  for (const [T, E] of covers(m)) {
    let v = 1; for (let i = 0; i < m; i++) if (T >> i & 1) v *= Xe[i];
    P.forEach((_, k) => { if (E >> k & 1) v *= Ye[k]; });
    cov += v;
  }
  return [mob, cov];
};
const lcg = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const Lx = (x) => Math.log(x / (4 * Math.PI));
const epsR = (X, a, t) => { const x = X - 2 + a; return (a * (10 + t * (Lx(x - a) / 2 + 1))) / (x - a) + (a * a) / (4 * (x - a)); };

export const R3_CG = Object.freeze({
  id: 'r3-cg-2026-10-03',
  date: '2026-10-03',
  title: 'Lemma CG (c_n ≥ 0 nondecreasing for every n) and Theorem 4′ (joint pairs at arbitrary shift intervals, given (OP))',
  status: 'PROVED as written (Lemma CG; Theorem 4′ as an implication from (OP)); one internal referee pass + exact computer algebra; no external reader. NO QED.',
  docs: ['formalization/paper/cg-monotonicity.md', 'formalization/paper/joint-pair-arbitrary-shift.md'],

  covSizes: Object.freeze([1, 1, 5, 45]),
  g0: Object.freeze([
    { id: 'G0-a', what: 'c_n(t) ≥ 0 nondecreasing (main §6 / AF I §6)', status: 'CLOSED (Lemma CG, written, internal referee + computer algebra)' },
    { id: 'G0-b', what: 'joint-pair lemma at shifts outside the catalogue', status: 'REDUCED to G0-c + G0-d (Theorem 4′)' },
    { id: 'G0-c', what: 'independent reading of main Lemmas 2–4 / Theorem 4′', status: 'OPEN (internal second pass only; no non-project reader)' },
    { id: 'G0-d', what: 'AF Part I §§6–9 = one-point input (OP)', status: 'OPEN (self-review; (8.1)–(8.3) closed forms, §7 block enclosures, E_ℓ cap, exceptional-pair enumeration not re-derived)' },
    { id: 'G0-d′', what: 'X-transfer of AF §§4–9 to 1.6X/1.65X/2.6X', status: 'OPEN (numerical premises regenerated; written argument not refereed; Route P needs it for U2 at 2.6X)' },
    { id: 'G0-e', what: 'external referee of the whole chain', status: 'OPEN' },
  ]),
  lemmaR: Object.freeze({ XPT: 6000000185827, tMax: 41 / 250, a: 2, eps: { PT: 4.2897e-12, '1.6X': 2.689e-12, '1.65X': 2.608e-12, '2.6X': 1.66e-12 }, allowance: 1e-9 }),
  N0: Object.freeze({ X1: 690988, '1.6X': 874038, '1.65X': 887590, '2.6X': 1114185 }),
  maxRH: Object.freeze({ r: 19 / 25, h: 109 / 50, routeP: 1.308 }),
  certifiedCounts: Object.freeze({ identityN1024: 623616, termsNonneg: 2114448, increments: 620160, allNle1114185: 4456740, refFlintOverlaps: 14484405, refIncrements: 13370220, baseEntries: 238, headGains: 648, refRoutePEntries: 440, refRoutePGains: 14520 }),
  twoHeightUsedBy: Object.freeze(['Route H (1.6X)', 'b145 PT value 0.147273668782792']),

  verdict:
    'Lemma CG proves c_n(t) ≥ 0 and nondecreasing for every n ≥ 1 and t ≥ 0 (G0-a closed, internal grade), and licenses Track A bin bounds, '
    + 'eq. (11), the D_C upper-time enclosure, the AF (6.3) head cancellation and the max(0, ·) clamp. Theorem 4′ gives the joint-pair floor for '
    + 'every shift interval I ⊂ (0,2) given (OP) at both probe points; the arbitrary-shift item adds no hypothesis beyond G0-c + G0-d. Open in G0: '
    + 'G0-c, G0-d, G0-d′, G0-e. Route P uses no two-height kernel. No Λ value moves. PT Lambda <= 0.2 stands. RH open. NO QED.',
  nextStep: 'Non-project reader for Theorem 4′ (G0-c); independent pass on AF I §§6–9 starting with (8.1)–(8.3), §7 blocks, E_ℓ cap, exceptional pairs (G0-d); written X-transfer at 2.6X (G0-d′).',
});

const C = R3_CG;

export const R3_CG_ASSERTIONS = Object.freeze([
  {
    id: 'r3-cg-cov-sizes',
    holds: () => [0, 1, 2, 3].every((m) => covers(m).length === C.covSizes[m]),
    why: '|Cov(P)| = 1, 1, 5, 45 for |P| = 0..3 (vertex sets T plus edge sets E covering P), enumerated live.',
  },
  {
    id: 'r3-cg-identity-monotone',
    holds: () => {
      const rnd = lcg(20261003), L = [Math.log(2), Math.log(3), Math.log(5)];
      for (let k = 0; k < 30; k++) {
        const m = 1 + (k % 3), lp = L.slice(0, m), g = Math.exp(lp.reduce((s, x) => s + x, 0));
        const lu = Math.log(g * (1 + 50 * rnd())), t = 0.01 + 0.2 * rnd();
        const [mob, cov] = forms(lp, lu, t), [, cov2] = forms(lp, lu + 0.3, t), [, cov3] = forms(lp, lu, t + 0.02);
        if (!(Math.abs(mob - cov) <= 1e-10 * Math.max(1, Math.abs(cov)) && cov > 0 && cov2 >= cov && cov3 >= cov)) return false;
      }
      return true;
    },
    why: 'Möbius sum = covering sum, every covering term ≥ 0 for t ≥ 0, u ≥ g; nondecreasing in log u and in t (CG1), 30 live random cases.',
  },
  {
    id: 'r3-cg-cancellation-demo',
    holds: () => {
      const L = [Math.log(2), Math.log(3), Math.log(5)], lu = Math.log(210 / 30);
      const [mob, cov] = forms(L, Math.log(30) + lu, 1e-30);
      return cov > 0 && cov < 1e-50 && Math.abs(mob) < 1e-12 && !(mob > 0 && Math.abs(mob - cov) < 1e-3 * cov);
    },
    why: 'At t = 1e-30 the Möbius form loses the sign to cancellation (float result unrelated to the ~1e-60 value); the covering form stays positive.',
  },
  {
    id: 'r3-cg-lemmaR-domain',
    holds: () => {
      const R = C.lemmaR, X = R.XPT;
      const e = { PT: epsR(X, R.a, R.tMax), '1.6X': epsR(1.6 * X, R.a, R.tMax), '1.65X': epsR(1.65 * X, R.a, R.tMax), '2.6X': epsR(2.6 * X, R.a, R.tMax) };
      return Object.keys(e).every((k) => Math.abs(e[k] / R.eps[k] - 1) < 2e-3) && e.PT < 4.3e-12 && e.PT < R.allowance / 200;
    },
    why: 'ε_R = a(10 + t(L(x−a)/2+1))/(x−a) + a²/(4(x−a)) at x = X − 2 + a (the corrected domain edge), four heights; far below EPS_REFL = 1e-9.',
  },
  {
    id: 'r3-cg-domain',
    holds: () => {
      const N0 = (X) => Math.floor(Math.sqrt((X - 4) / (4 * Math.PI))), X = C.lemmaR.XPT;
      return N0(X) === C.N0.X1 && N0(1.6 * X) === C.N0['1.6X'] && N0(1.65 * X) === C.N0['1.65X'] && N0(2.6 * X) === C.N0['2.6X']
        && C.maxRH.r * C.maxRH.h < 2 && Math.abs(C.maxRH.r * C.maxRH.h - 1.6568) < 1e-12 && C.maxRH.routeP < C.maxRH.r * C.maxRH.h && N0(X) >= 1025;
    },
    why: '(Dom): N0 = ⌊√((X−4)/4π)⌋ ≥ 1025 at all four floor heights; max r·h = 1.6568 < 2 over all tables (1.308 on Route P tables).',
  },
  {
    id: 'r3-cg-g0-bookkeeping',
    holds: () => C.g0.filter((x) => /^OPEN/.test(x.status)).map((x) => x.id).join(',') === 'G0-c,G0-d,G0-d′,G0-e'
      && /CLOSED/.test(C.g0[0].status) && /REDUCED/.test(C.g0[1].status) && !C.twoHeightUsedBy.some((x) => /Route P/.test(x)),
    why: 'G0-a closed, G0-b reduced; G0-c/d/d′/e open; the two-height coupling is not a Route P input.',
  },
  {
    id: 'r3-cg-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(C.verdict) && /NO QED/.test(C.verdict) && /No Λ value moves/.test(C.verdict),
    why: 'No bound moves; RH open.',
  },
]);

export default R3_CG;
