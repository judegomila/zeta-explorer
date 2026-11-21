/**
 * @fileoverview route-40-lean-wol-band-barrier-2026-10-14 — roadmap route 40 (batch 9, group H, tool): machine-checking lemmas behind the
 * weak outer lemma (WOL-C, wol-pd-lemmas.md) and the band barriers BB1/BB2 (lemma-B-two-band.md Theorem BB). Planned as Aristotle runs; done
 * in-house in Lean because the batch forbids sending anything off the machine (Aristotle jobs J1–J5 prepared, 0 submitted; CLI not on PATH;
 * project memory flags the key as compromised). One worker run plus one adversarial internal referee pass with a full independent rebuild
 * (not refuted; severity MAJOR: L1 dl_identity was vacuous, the headline overclaimed). Corrections applied below, including the Lean fix.
 *
 * PROVED (Lean 4.34.1, Mathlib d13f23b7, prebuilt tree /tmp/qrh-verify/lean; 7 files in formalization/lean/Route40/; after the referee fix
 *  81 declarations, all [propext, Classical.choice, Quot.sound], 0 sorry — record-time audit tmp/routes-b9-record/r40-axiom-audit.out):
 *  FRAGMENTS of L1–L5, not the lemmas in full:
 *  - L1: dw_identity (Lemma 1.1(b) first identity). dl_identity AS SUBMITTED WAS VACUOUS (hv : ∀ d e, v(de) = v d + v e over all of ℕ gives
 *    v 2 = 0 from d = 0, contradicting hvpos 2; referee proved False in Lean) and v : ℕ → ℚ excluded v = log. REPLACED at record time by the
 *    referee's corrected version (ℝ-algebra, v : ℕ → ℝ, additivity for nonzero arguments; non-vacuity log_ok: v = Real.log satisfies the
 *    hypotheses); recompiled clean.
 *  - L2 (new proof route): derivation D = ·log n is Leibniz for Dirichlet convolution; β(t) unique solution of β * G_t = D G_t
 *    (G_t(n) = exp(t log²n/4)); β(0) = von Mangoldt; 4 dβ_n/dt = log²(n) β_n + 2 Σ_{de=n} β_d (log e) β_e; hence β_n(t) ≥ 0 and nondecreasing
 *    on [0, ∞). Lemma 2.1 (twist commutes with convolution), Lemma 2.3(b) (truncated log-derivative coefficients exist, non-vacuously, equal
 *    n^{−(1+h)/2 − tL/4} β_n(t) ≥ 0).
 *  - L3: Lemma 3.1, inequality (3.2), the one-term mixed split, Lemma 3.3(a) grid maxima (+ (g²/8) Σ k²|M_k|) and 3.3(b).
 *  - L4: pieces of Lemma 4.3 (|1 + Σα_k ζ^k| ≥ 1 − Σ|α_k| on the closed disc; minimum-modulus step; |c_1| ≥ Π m_q − δ_0; conjugation),
 *    Lemma 4.4 weak duality (+ probe), scalar monotonicity of β, V, dV, hi from Lemma 4.1.
 *  - L5: the recursion step of 5.3(a) (|ψ_k| ≤ C_K), 5.3(c) head-subtracted tail, (log m) m^{−δ} ≤ (log X) X^{−δ} for m ≥ X ≥ e^{1/δ}.
 *  - BB core: A_{2j+1}(x) ≤ e^{−x} ≤ A_{2j}(x) for all x ≥ 0 (A17 ≤ e^{−x} ≤ A18); barrier formula solves B' = −2 − cB; substep enclosures
 *    (B-ii), (B-iv); scalar first_contact; Lemma C algebra (a)–(e); E2 self-pair caps (sharp h K_h(a, y) = 6/(4 − y²/h²)); H2 leading
 *    coefficients μ1 = 4 − 2λ, μ3 = 4(h² − y² − 3a²) at λ = 2, sharp law μ3 = 0, μ5 = (16/9)(h² − y²)(4h² − y²); tail Σ_{n≥N} n x^{n−1} ≤
 *    N x^{N−1}/(1 − x)².
 *  - BB set logic (first_contact_set): Steps 2–5 for zero sets Z(t) — pure order/topology logic; closedness, a margin-η Hurwitz hypothesis
 *    and the contact exclusion hcontact (all analytic content of Steps 4–5) are named hypotheses.
 * NOT FORMALISED: Lemma 1.2; l_r = Λ_r; the (2.4) time enclosures; the separable sup bound (3.3); (4.1) in full; Lemma 4.2; 4.3(a)/(b) as
 *  assembled statements; Corollary 4.5; Lemmas 5.1, 5.2(a)–(f), 5.3(b), 5.3(d), 5.4; the ‖1/F‖_δ bound of 5.3(a); Theorem 6.1; strict
 *  positivity / analyticity in 2.3(a).
 * CONDITIONAL: WOL-C is NOT proved (a finite numerical statement per route-P entry, K^sup(E) ≤ K0*(E) + 0.0223/(1 + 1e-12), over 630 entries);
 *  route-P 0.1448843462793 and the certified-only 0.146808080767225 stay conditional. BB1/BB2 NOT proved: (F), (K), (W), (S), RH-head/RH-win,
 *  Hurwitz (F4), P15-3.1, backward Hermite splitting, Hadamard probe identity, full H2 far field, E1–E8 remain paper or named hypotheses.
 * MEASURED: each file 10–25 s; peak footprint ≈ 0.93–1.17 GB (RSS ≈ 5.8 GB mostly mmapped .olean); referee audit 14.5 s.
 * HEURISTIC: the heat-equation route (4β' = D²β + 2β*Dβ, triangular since β_1 = 0) may simplify wol-pd §2 and possibly Lemma CG (untested).
 *
 * Verdict: partial; no Λ change. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_40_ASSERTIONS recompute live: β_n(t) from the
 * Dirichlet-ring recursion (β(0) = Λ, β ≥ 0, monotone, heat equation by finite differences, n ≤ 300), A17 ≤ e^{−x} ≤ A18, the tail bound,
 * the H2/E2 coefficient identities, the vacuity of the original L1 hypotheses and the admissibility of log under the fix.
 */

const { abs, exp, log, sqrt } = Math;

export const ROUTE_40 = Object.freeze({
  id: 'route-40-lean-wol-band-barrier-2026-10-14',
  route: 40,
  date: '2026-10-14',
  title: 'Route 40: Lean fragments of the WOL-C lemmas L1–L5 and the logical/algebraic core of Theorem BB (Aristotle jobs prepared, not submitted)',
  status: 'partial',
  headline: 'Lean checks FRAGMENTS of L1–L5 behind WOL-C (dw/dl identities after a referee fix, β_n(t) ≥ 0 and monotone via a new heat-equation '
    + 'proof, Lemmas 3.1/3.3, pieces of 4.3/4.4, steps of 5.3) and the logical/algebraic core of Theorem BB (Taylor enclosures, first contact, '
    + 'Lemma C, H2 coefficients). WOL-C and BB1/BB2 are not proved. The submitted dl_identity was vacuous; replaced. 5 Aristotle jobs prepared, 0 submitted.',
  lean: Object.freeze({ files: 7, lines: 1637, declarationsWorker: 80, declarationsAfterFix: 81, sorry: 0, axioms: Object.freeze(['propext', 'Classical.choice', 'Quot.sound']),
    fixedFile: 'formalization/lean/Route40/WolPdL1.lean', refereeFixSource: 'tmp/routes-b9-ref40-lean/L1fix.lean', vacuityProof: 'tmp/routes-b9-ref40-lean/Vacuity.lean' }),
  aristotle: Object.freeze({ prepared: 5, submitted: 0, jobs: Object.freeze(['J1 tail functional mono', 'J2 Neumann inverse weighted', 'J3 label log identity (open)', 'J4 H2 far field', 'J5 zero-set first contact (not superseded)']) }),
  wolc: Object.freeze({ entries: 630, slack: 0.0223, routeP: 0.1448843462793, certifiedOnly: 0.146808080767225 }),
  refereeKilled: Object.freeze([
    'MAJOR: L1 dl_identity was vacuous — hv over all of ℕ forces v 2 = 0 (d = 0), contradicting hvpos 2 (False proved in Lean); also v : ℕ → ℚ excluded v = log; fixed by the referee\'s ℝ-valued, nonzero-argument version with log_ok (applied, recompiled)',
    'headline overclaimed "Lean checks L1 to L5": only fragments; Lemma 1.2, 4.1 in full, 4.2, 4.5, 5.1, 5.2, 5.3(b)/(d), 5.4 and Theorem 6.1 have no formal counterpart',
    'Aristotle README said the J3 dl half was proved in-house (false: vacuous) and J5 superseded (wrong: in-house assumes a stronger margin-η Hurwitz hypothesis); README corrected',
    'first_contact_set puts all analytic content of Steps 4–5 into hcontact: BB Steps 2–5 are logic only',
  ]),
  nextStep: '(1) Referee the statement match of aTrunc / lemma_2_3_b exponents (§0.1) and first_contact_set hypotheses (Steps 2–5); (2) if the user approves '
    + 'spending and rotates the Aristotle key, submit J4 (H2 far field) and J2 first; (3) in-house: Lemma 4.2 (J1), Lemma 5.2(c), then a Theorem 6.1 '
    + 'skeleton with the r4 enclosures and J ≤ Φ_E as named hypotheses, turning "WOL-C follows from the certified engine output" into a Lean-checked implication.',
  files: Object.freeze(['formalization/lean/Route40/{WolPdL1,WolPdL2,WolPdL3,WolPdL3Grid,WolPdL4L5,BandBarrier,BandBarrierSet}.lean',
    'tmp/routes-b9-r40-lean/{check.sh,make_audit.py,AxiomAudit.lean,axiom-audit.out}', 'tmp/routes-b9-r40-aristotle/{README.md,J1..J5}.lean',
    'tmp/routes-b9-ref40-lean/{Vacuity.lean,L1fix.lean,AxiomAudit.lean,axiom-audit.out}', 'tmp/routes-b9-record/{make_audit_r40.py,R40AxiomAudit.lean,r40-axiom-audit.out}']),
  verdict: 'Partial. Lean kernel-checks fragments of the structural lemmas behind WOL-C (L1 identities after the referee\'s fix of a vacuous '
    + 'hypothesis set, L2 log-positivity via a new heat-equation proof, L3 grid maxima, pieces of L4, steps of L5) and the logical/algebraic core '
    + 'of Theorem BB. WOL-C (a per-entry numerical statement) and BB1/BB2 (analytic and computational inputs) are not proved; nothing was sent to '
    + 'Aristotle. No Λ value changes. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_40;
const NMAX = 300;
const vonMangoldt = (n) => { for (let p = 2; p <= n; p += 1) { if (n % p === 0) { let m = n; while (m % p === 0) m /= p; return m === 1 ? log(p) : 0; } } return 0; };
const betaAll = (t) => { // b(n) = log n · G(n) − Σ_{d | n, d < n} b(d) G(n/d),  G(n) = exp(t log² n / 4)
  const G = (n) => exp((t * log(n) ** 2) / 4); const b = new Float64Array(NMAX + 1);
  for (let n = 2; n <= NMAX; n += 1) { let s = log(n) * G(n); for (let d = 2; d < n; d += 1) if (n % d === 0) s -= b[d] * G(n / d); b[n] = s; }
  return b; };
const taylor = (k, x) => { let s = 0; let term = 1; for (let i = 0; i <= k; i += 1) { s += term; term *= -x / (i + 1); } return s; };

export const ROUTE_40_ASSERTIONS = Object.freeze([
  {
    id: 'r40-beta-zero-is-von-mangoldt',
    holds: () => { const b0 = betaAll(0); for (let n = 2; n <= NMAX; n += 1) if (abs(b0[n] - vonMangoldt(n)) > 1e-12) return false; return true; },
    why: 'β(0) solves β * 1 = log (Dirichlet ring), i.e. β(0) = Λ (von Mangoldt), for every n ≤ 300 (Lean: b_zero_eq_vonMangoldt).',
  },
  {
    id: 'r40-beta-nonneg-monotone',
    holds: () => { const ts = [0, 0.05, 0.1, 0.15, 0.2, 0.3]; const B = ts.map(betaAll);
      for (let n = 2; n <= NMAX; n += 1) for (let i = 0; i < ts.length; i += 1) { if (B[i][n] < -1e-9) return false; if (i && B[i][n] < B[i - 1][n] - 1e-9) return false; }
      return B[5][6] > 0 && B[0][6] === 0; },
    why: 'β_n(t) ≥ 0 and nondecreasing in t on [0, 0.3] for n ≤ 300 (Lean: b_nonneg, b_monotoneOn); β_6(0) = 0 but β_6(t) > 0 for t > 0.',
  },
  {
    id: 'r40-heat-equation-fd',
    holds: () => { const t = 0.12; const h = 1e-5; const bp = betaAll(t + h); const bm = betaAll(t - h); const b = betaAll(t);
      for (let n = 2; n <= 120; n += 1) { let conv = 0; for (let d = 2; d < n; d += 1) if (n % d === 0) conv += b[d] * log(n / d) * b[n / d];
        const lhs = (4 * (bp[n] - bm[n])) / (2 * h); const rhs = log(n) ** 2 * b[n] + 2 * conv;
        if (abs(lhs - rhs) > 1e-5 * (1 + abs(rhs))) return false; }
      return true; },
    why: '4 dβ_n/dt = log²(n) β_n + 2 Σ_{de=n} β_d (log e) β_e at t = 0.12 by central differences, n ≤ 120 (Lean: hasDerivAt_b; triangular since β_1 = 0).',
  },
  {
    id: 'r40-bb-taylor-and-tail',
    holds: () => { for (let k = 0; k <= 400; k += 1) { const x = k * 0.02; const e = exp(-x); if (!(taylor(17, x) <= e + 1e-15 && e <= taylor(18, x) + 1e-15)) return false; }
      return [[0.3, 10], [0.6, 25], [0.9, 50]].every(([x, N]) => { let s = 0; for (let n = N; n < N + 4000; n += 1) s += n * x ** (n - 1); return s <= (N * x ** (N - 1)) / (1 - x) ** 2; }); },
    why: 'A17(x) ≤ e^{−x} ≤ A18(x) on [0, 8] (Lean: all x ≥ 0, A_{2j+1} ≤ e^{−x} ≤ A_{2j}); Σ_{n≥N} n x^{n−1} ≤ N x^{N−1}/(1 − x)² at three (x, N).',
  },
  {
    id: 'r40-h2-e2-coefficients',
    holds: () => { const hK = (h, y) => 6 / (4 - (y * y) / (h * h)); const mu1 = (lam) => 4 - 2 * lam; const mu3 = (h, y, a) => 4 * (h * h - y * y - 3 * a * a);
      const mu5 = (h, y) => (16 / 9) * (h * h - y * y) * (4 * h * h - y * y);
      return hK(1, 0) === 1.5 && mu1(2) === 0 && abs(mu3(1, 0.5, 0.2) - 4 * (1 - 0.25 - 0.12)) < 1e-15 && mu5(1, 0) > 0 && abs(mu5(1, 1)) < 1e-15 && mu5(1, 0.5) === (16 / 9) * 0.75 * 3.75; },
    why: 'E2 sharp self-pair cap h K_h(0) = 6/4 = 1.5; H2 coefficients μ1 = 4 − 2λ (0 at λ = 2), μ3 = 4(h² − y² − 3a²), μ5 = (16/9)(h² − y²)(4h² − y²).',
  },
  {
    id: 'r40-l1-vacuity-and-fix',
    holds: () => { // original hv at (d, e) = (0, 2): v(0) = v(0) + v(2) holds iff v(2) = 0, which contradicts hvpos 2 for every admissible v (e.g. log 2 ≠ 0)
      const hv02 = (v0, v2) => v0 === v0 + v2; const vacuous = [[1, 0.5], [3.25, log(2)], [-2, 0.125]].every(([v0, v2]) => !hv02(v0, v2)) && hv02(1.5, 0);
      const logOk = [[2, 3], [4, 5], [7, 11], [12, 18]].every(([d, e]) => abs(log(d * e) - log(d) - log(e)) < 1e-12) && [2, 3, 10, 97].every((r) => log(r) > 0);
      return vacuous && log(2) !== 0 && logOk && R.lean.declarationsAfterFix === R.lean.declarationsWorker + 1 && R.lean.sorry === 0; },
    why: 'Original hv (all d, e ∈ ℕ) at d = 0, e = 2 forces v(2) = 0, contradicting hvpos 2, so the submitted dl_identity was vacuous; under the fix (nonzero arguments, ℝ-valued) v = log is admissible (log_ok); 80 + 1 declarations after the fix, 0 sorry.',
  },
  {
    id: 'r40-honest-scope',
    holds: () => R.status === 'partial' && R.aristotle.submitted === 0 && /not proved/.test(R.verdict) && /fragments/.test(R.verdict)
      && R.wolc.entries === 630 && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 4 && sqrt(4) === 2,
    why: 'Fragments only; WOL-C and BB1/BB2 unproved; nothing submitted externally; no Λ change; no QED.',
  },
]);

export default ROUTE_40;
