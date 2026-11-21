/**
 * @fileoverview route-10-lean-core-raymond-chain-2026-10-14 — roadmap route 10 (batch 9, group A, tool): Lean 4 core of Raymond's chain (G0).
 * One worker run plus one adversarial internal referee pass (not refuted; severity minor: the referee's own re-build was load-gated at
 * report time, Lemma R carries a second hypothesis, the start-substitution reading of AF §2/§11 is still open, name trap, fragile package).
 * Corrections applied below. The referee's runner (tmp/routes-b9-ref10-lean/run.sh) was resumed at record time (load ≈ 17) and completed:
 * the Lean claims are CONFIRMED by the referee re-build.
 *
 * PROVED (Lean 4.34.1, Mathlib d13f23b7, package formalization/lean/raymond-core; no sorry; #print axioms = [propext, Classical.choice,
 *  Quot.sound] for every main theorem; referee re-build 2026-10-07 23:28: lake build, from-scratch re-elaboration of CG/LemmaR/Substitution,
 *  independent statement file Stmt.lean with rfl unfoldings of Phi, H, Lambda, riemannXi, cn, and check-instance78.sh all exit 0, 18/18
 *  axiom lines standard):
 *  - Lemma CG covering identity (RaymondCore.CG.covering_identity) over any finite index set with real weights (ordered half-edge atoms
 *    exp(t a_p a_q/4) − 1; equivalent to the paper's unordered edges exp(t a_p a_q/2) − 1 since 1 + r_pq = (1 + r'_pq)(1 + r'_qp)).
 *  - Corollary CG1 (Cg_nonneg_mono) for every squarefree g; Cg_eq_D links Raymond's Möbius sum over Nat.divisors to the abstract sum.
 *  - Corollary CG2 = G0-a (cn_nonneg_mono): 0 ≤ c_n(t') ≤ c_n(t) for every n ≥ 1, 0 ≤ t' ≤ t, c_n(t) = Σ_{d|(n,30)} μ(d)β_d(t)b_t(n/d).
 *    No hypotheses: G0-a upgrades from a written, unrefereed proof to a Lean theorem.
 *  - Substitution lemma (substitution, substitution', Lambda_le_of_zeroFree): ζ(s) ≠ 0 for Re s > θ ≥ 1/2 ⇒ every zero of the standard
 *    (Polymath-normalised) H_t, t ≥ 0, has Im(z)² ≤ max((2θ−1)² − 2t, 0); Λ ≤ (2θ−1)²/2. The unclamped form is false for t > (2θ−1)²/2.
 *    Built on LeanCert DBN (H_0 = ξ(1/2 + iz/2)/8, H_forward_strip) and Mathlib's functional equation. θ = 1: Λ ≤ 1/2 from Mathlib alone.
 *  - θ = 7/8 instance (RaymondCoreOAI/Instance78.lean): Im(z)² ≤ max(9/16 − 2t, 0), Λ ≤ 9/32, importing the PROVED
 *    OAI.NumberTheory.DirichletL.Nonvanishing (openai/math family 003; Lean-checked, not peer-reviewed).
 * CONDITIONAL (Lean theorem with explicit hypotheses):
 *  - Lemma R (reBeta_bound, lemmaR_sharp, lemmaR, epsR_lt, lemmaR_paper) is conditional on the AF (4.6) Stirling-type bounds AND on
 *    HasDerivAt Φ (Re β_t) on the closed interval (Φ' = Re β_t); the paper assumes only that Φ is continuous. Log-term constant a²/8 proved
 *    (paper a²/4); ε_R < 1e-10 for X ≥ 6e12, 0 < a < 2, x ≥ X − 2 + a, 0 ≤ t ≤ 41/250 (analytic bound ≈ 4.40e-12; paper direct 4.29e-12).
 *  - The substitution lemma is fully proved as a statement about the standard H_t; whether it is exactly the input Raymond's chain uses
 *    (q0 = (2θ−1)² + 2e-6 and the AF §11 strict-entry check) is still an OPEN referee item (openai-math-integration-2026-10-08.js).
 *  - Λ ≤ 9/32 is above PT's 0.2: the half-plane alone moves nothing; it enters only as q0 = 9/16. The conditional route-P values (0.1177…,
 *    0.11609…) still depend on G0-c (main-paper Lemmas 2–3, Theorem 4/4′), G0-d/G0-d′ (AF §§2–12, OP1–OP4, envelopes, strict entry,
 *    X-transfer), the decreasing-barrier iteration and its ball-arithmetic certificate — none formalised.
 * MEASURED: 40 LeanCert DBN modules built sequentially, no failures, ≈ 25 min wall; per-process footprint ≈ 140 MB (RSS ≈ 5.9 GB, mostly
 *  memory-mapped Mathlib .olean). Referee re-build: lake build 29.7 s wall, re-elaboration 5.8–14.6 s per file, peak RSS 5.93 GB.
 * HEURISTIC: none.
 * Trust notes: (i) name trap — /tmp/qrh-verify/lean/ComparatorChallenges/QuasiRiemannHypothesis.lean declares the same name
 *  OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re with a sorry proof; importing it would silently pull in sorryAx (#print axioms catches it).
 *  (ii) fragility — most raymond-core/.lake/packages entries are symlinks into /tmp/qrh-verify/lean (not a git repository, so no pinned OAI
 *  commit); lake-manifest.json is excluded by formalization/lean/.gitignore.
 *
 * Verdict: Lean infrastructure; no Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_10_ASSERTIONS recompute
 * live: the ε_R bounds, the Λ ≤ (2θ−1)²/2 ladder and the clamp, the ordered/unordered pair-atom identity, and c_n(t) ≥ 0 nondecreasing for
 * n ≤ 3000 on a t-grid (Lemma CG / G0-a), plus the referee re-build record.
 */

const { abs, exp, log, PI, max, sqrt } = Math;

export const ROUTE_10 = Object.freeze({
  id: 'route-10-lean-core-raymond-chain-2026-10-14',
  route: 10,
  date: '2026-10-14',
  title: 'Route 10: Lemma CG (G0-a), Lemma R (conditional on AF (4.6) and Φ\' = Re β_t) and the start substitution as Lean 4 theorems',
  status: 'partial',
  headline: 'Lemma CG / G0-a and the substitution lemma (half-plane Re s > θ ⇒ Im(z)² ≤ max((2θ−1)² − 2t, 0) for the standard H_t; '
    + 'θ = 7/8 via the openai/math theorem) are Lean 4 theorems with no sorry and only the three standard axioms; Lemma R is a Lean theorem '
    + 'conditional on AF (4.6) and Φ\' = Re β_t. Referee re-build confirmed (18/18 axiom lines standard). No new Λ bound.',
  statusNote: "'partial': the C_g identity, G0-a and Lemma R's analytic core are formalised; G0-c, G0-d/G0-d', the barrier iteration and its certificate are not.",
  lean: Object.freeze({
    version: 'Lean 4.34.1', mathlib: 'd13f23b7', package: 'formalization/lean/raymond-core', sorry: 0,
    axioms: Object.freeze(['propext', 'Classical.choice', 'Quot.sound']),
    theoremsWorker: Object.freeze({ raymondCore: 14, instance78: 2 }),
    refereeRebuild: Object.freeze({ completed: '2026-10-07 23:28', stagesExit0: 6, stages: 6, axiomLines: 18, standardAxiomLines: 18,
      split: Object.freeze({ raymondCore: 13, leanCertDBN: 3, instance78: 2 }), log: 'tmp/routes-b9-ref10-lean/run.log' }),
  }),
  lemmaR: Object.freeze({ X: 6e12, aMax: 2, tMax: 41 / 250, epsBound: 1e-10, crude: 4.40e-12, paperDirect: 4.29e-12, logBoundUsed: 31,
    logTermProved: 'a²/(8(x−a))', logTermPaper: 'a²/(4(x−a))' }),
  substitution: Object.freeze({ lambdaTheta78: 9 / 32, lambdaTheta1: 1 / 2, q0Theta78: 9 / 16 }),
  refereeKilled: Object.freeze([
    'Lean-checked status was UNCONFIRMED at report time (referee runner load-gated, load 40–50); resumed at record time and completed: all 6 stages exit 0, 18/18 axiom lines standard — now CONFIRMED',
    'headline "Lemma R modulo AF (4.6)" omits the second hypothesis Φ\' = Re β_t (HasDerivAt on the closed interval; the paper assumes only continuity)',
    '"start substitution fully proved with no gaps" is right for the lemma about the standard H_t but does not close the open referee item on the start-substitution reading of AF §2/§11 (q0 = (2θ−1)² + 2e-6, strict entry)',
    'name trap: ComparatorChallenges/QuasiRiemannHypothesis.lean declares the same OAI name with sorry; Instance78 imports the proved module',
    'fragile package: .lake/packages symlinked into /tmp/qrh-verify/lean (not a git repo; no pinned OAI commit)',
  ]),
  nextStep: '(1) Formalise AF (4.6) (Stirling bounds for α = (log M_t)\' on ξ ≥ X − 4 from Mathlib Gamma/digamma) and Φ\' = Re β_t to make Lemma R '
    + 'unconditional; (2) main-paper Lemma 2 (surplus identity) and Lemma 3 (paired phases), algebraic; (3) state Theorem 4′ with (OP), Lemma CG '
    + 'and Lemma R as inputs; referee the start-substitution reading of AF §2/§11. If /tmp is cleared, rebuild via the README `lake exe cache get` fallback.',
  files: Object.freeze(['formalization/lean/raymond-core/README.md', 'formalization/lean/raymond-core/RaymondCore/CG.lean',
    'formalization/lean/raymond-core/RaymondCore/LemmaR.lean', 'formalization/lean/raymond-core/RaymondCore/Substitution.lean',
    'formalization/lean/raymond-core/RaymondCoreOAI/Instance78.lean', 'formalization/lean/raymond-core/scripts/AxiomsCheck.lean',
    'formalization/lean/raymond-core/scripts/check-instance78.sh', 'formalization/lean/raymond-core/axioms-output.txt',
    'tmp/routes-b9-r10-lean/{build-deps,build-main,axioms,inst78}.log', 'tmp/routes-b9-ref10-lean/{run.sh,run.log,Stmt.lean}']),
  verdict: 'Lean infrastructure for Raymond\'s chain. Lemma CG / G0-a is a Lean theorem for every n ≥ 1 and t ≥ 0 with no hypotheses. Lemma R\'s '
    + 'analytic core and its numerical claim are Lean theorems conditional on AF (4.6) and Φ\' = Re β_t. The substitution lemma is fully proved as a '
    + 'statement about the standard H_t (θ = 7/8 rests only on the openai/math Lean theorem, not peer-reviewed); whether it is the input Raymond\'s '
    + 'chain uses (q0 and the AF §11 strict-entry check) is still an open referee item. Referee re-build confirmed. The barrier chain from q0 to '
    + '0.1177 is not formalised and Λ ≤ 9/32 is above 0.2, so no Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_10;
const bt = (t, x) => exp((t * log(x) ** 2) / 4);
const PR = [2, 3, 5];
const cn = (n, t) => { // Σ_{d | (n,30)} μ(d) β_d(t) b_t(n/d)
  let s = 0;
  for (let m = 0; m < 8; m += 1) {
    const ps = PR.filter((_, i) => (m >> i) & 1); const d = ps.reduce((a, b) => a * b, 1);
    if (n % d !== 0) continue;
    s += (ps.length % 2 ? -1 : 1) * ps.reduce((a, p) => a * bt(t, p), 1) * bt(t, n / d);
  }
  return s;
};

export const ROUTE_10_ASSERTIONS = Object.freeze([
  {
    id: 'r10-epsR-live',
    holds: () => { const { X, tMax } = R.lemmaR; const B1 = 10 + tMax * (R.lemmaR.logBoundUsed / 2 + 1); const crude = (2 * B1 + 1) / (X - 2);
      const L = log((X - 2) / (4 * PI)); const direct = (2 * (10 + tMax * (L / 2 + 1)) + 4 / 4) / (X - 2);
      return abs(crude - R.lemmaR.crude) < 0.01e-12 && abs(direct - R.lemmaR.paperDirect) < 0.01e-12 && crude < R.lemmaR.epsBound
        && log(X - 2) <= R.lemmaR.logBoundUsed && 2 ** 2 / 8 < 2 ** 2 / 4; },
    why: 'ε_R: crude (2B1 + 1)/(X − 2), B1 = 10 + (41/250)(31/2 + 1) = 12.706 ⇒ 4.40e-12; direct a = 2, L = log((X−2)/4π): 4.29e-12; both < 1e-10; log(6e12 − 2) ≤ 31; the proved a²/8 term is half the paper\'s a²/4.',
  },
  {
    id: 'r10-substitution-ladder-and-clamp',
    holds: () => { const lam = (th) => (2 * th - 1) ** 2 / 2; const bound = (th, t) => max((2 * th - 1) ** 2 - 2 * t, 0);
      return abs(lam(7 / 8) - R.substitution.lambdaTheta78) < 1e-15 && abs(lam(1) - R.substitution.lambdaTheta1) < 1e-15 && abs((2 * 7 / 8 - 1) ** 2 - R.substitution.q0Theta78) < 1e-15
        && lam(7 / 8) > 0.2 && bound(7 / 8, 0.3) === 0 && (2 * 7 / 8 - 1) ** 2 - 2 * 0.3 < 0 && bound(7 / 8, 0.1) > 0; },
    why: 'Λ ≤ (2θ − 1)²/2: θ = 7/8 → 9/32 = 0.28125 > 0.2 (no PT improvement), θ = 1 → 1/2; q0 = 9/16; for t > 9/32 the unclamped bound is negative (false, real zeros exist), so the max(·, 0) form is the correct statement.',
  },
  {
    id: 'r10-pair-atoms-ordered-vs-unordered',
    holds: () => [[log(2), log(3), 0.16], [log(5), log(7), 0.07], [log(11), log(13), 0.2]].every(([ap, aq, t]) => {
      const rOrd = exp((t * ap * aq) / 4) - 1; const rUn = exp((t * ap * aq) / 2) - 1; return abs((1 + rOrd) * (1 + rOrd) - (1 + rUn)) < 1e-14; }),
    why: 'Ordered half-edge atoms exp(t a_p a_q/4) − 1 reproduce the paper\'s unordered edge weight exp(t a_p a_q/2) − 1 via 1 + r_pq = (1 + r\'_pq)(1 + r\'_qp).',
  },
  {
    id: 'r10-cg-g0a-live',
    holds: () => { const ts = [0, 0.02, 0.05, 0.1, 0.15, 41 / 250, 0.2];
      for (let n = 1; n <= 3000; n += 1) { let prev = -1e-12;
        for (const t of ts) { const c = cn(n, t); if (c < -1e-12 * bt(t, n) || c < prev - 1e-9 * bt(t, n)) return false; prev = c; } }
      return cn(1, 0) === 1 && cn(2, 0) === 0 && cn(7, 0.1) === bt(0.1, 7); },
    why: 'Lemma CG / G0-a: c_n(t) = Σ_{d|(n,30)} μ(d)β_d(t)b_t(n/d) ≥ 0 and nondecreasing in t for every n ≤ 3000 on a 7-point t-grid up to 0.2 (Lean proves it for all n ≥ 1, t ≥ 0); c_n(0) = [gcd(n,30) = 1].',
  },
  {
    id: 'r10-referee-rebuild-and-scope',
    holds: () => { const rb = R.lean.refereeRebuild; return rb.stagesExit0 === rb.stages && rb.axiomLines === rb.standardAxiomLines
        && Object.values(rb.split).reduce((a, b) => a + b, 0) === rb.axiomLines && R.lean.sorry === 0 && R.lean.axioms.length === 3
        && R.status === 'partial' && /Φ' = Re β_t/.test(R.verdict) && /open referee item/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
        && /NO QED/.test(R.verdict) && R.refereeKilled.length === 5 && sqrt(9 / 16) === 0.75; },
    why: 'Referee re-build: 6/6 stages exit 0, 18/18 axiom lines [propext, Classical.choice, Quot.sound]; Lemma R conditional on AF (4.6) and Φ\' = Re β_t; AF §2/§11 reading open; no Λ change; no QED.',
  },
]);

export default ROUTE_10;
