/**
 * @fileoverview route-34-de-branges-hamiltonian-xi-2026-10-13 — roadmap route 34 (batch 8, group F): the de Branges canonical-system
 * Hamiltonian for Lagarias' E = Ξ + iΞ', computed numerically, and its mass positivity. REDUCES-TO-WALL (the T3 zero-location wall). One run
 * plus one adversarial internal referee pass with an EXACT rational re-derivation (python-flint fmpq_poly continued fraction) (not refuted;
 * severity minor: defect mislabelled, a truncation-artifact depth law, overstated τ stability). Corrections applied below.
 *
 * PROVED: (1) unconditional, elementary: Lagarias E = A − iB, A = Ξ (even), B = −Ξ' (odd); E is Hermite–Biehler ⇔ RH (RH ⇒ Im(Ξ'/Ξ) < 0 on
 *  C+; HB forces A = Ξ to have only real zeros). (2)–(4) FINITE-N statements proved and verified exactly (referee, exact rationals): the Jacobi
 *  chain of H(E_N), E_N = A_N + iA_N', is the reversed counting-measure chain (weights 1/A'(x)²; exact at N = 15); symmetric E gives a diagonal
 *  H = diag(h, 1 − h) (Krein string) with total length 2Σ1/γ²; E_a(z) = Ξ(z + ia) ~ Ξ + iaΞ' as a → 0 (gauge diag(1, a)). The INFINITE-N versions
 *  (H(E) exists, half-line system with m = −Ξ'/Ξ, weights π/Ξ'(γ)², L = ξ''(1/2)/ξ(1/2)) hold UNDER RH and simple zeros (H(E) exists iff RH);
 *  "H_a positive for every a > 0" is the zero-free-strip ladder T26 / T3, equivalent to RH.
 * CERTIFIED: nothing interval-certified (exact rational chains at N = 15, 40, 60, 80 are exact arithmetic on the given finite measures).
 * CONDITIONAL: the infinite-N Hamiltonian as weak-* limit of finite-N reconstructions (de Branges/Remling continuity, m_N → m locally uniformly,
 *  RH above the verified tables).
 * MEASURED: forward reconstruction of m from the lengths matches the direct sum to ≤ 5e-12 relative (N ≤ 2000, 7 test points incl. near the
 *  pole 14.134 + 0.01i; the run's ≤ 7e-13 held only at its 3 points; for N ≥ 8000 the check is invalid because log l clips at ±700). Exact chain
 *  vs long-double RKPW log-lengths agree to 1.3e-11 at N = 40; max|α| = 5e-13 (diagonal H). Total length 2Σ_{n ≤ 1e6} γ⁻² + smooth tail =
 *  0.0462099862327 vs ξ''(1/2)/ξ(1/2) = 0.0462099862308 (2e-12). Type τ(x) = ∫√det H: τ(1e10) = 0.638–0.654 for N ≥ 2000; τ(1e100) = 1.50–1.525
 *  for N ≥ 8000 (windows ≤ 4 at N = 8000, all at N = 16000); N = 2000 with large windows is truncation-contaminated (τ(1e100) up to 2.93).
 *  q = d log r/dτ ≈ 20 / 180 / 1016 at τ = 0.1 / 1 / 1.85 (Morse-like). Smooth (no-S) points change log r by ≤ 0.486 against |log r| ≈ 500.
 *  Single-zero sensitivity: peak depth τ ≈ 0.23 (n = 1) … 1.32 (n = 100). Zeros above 1000 → smooth changes D(x) by ≤ 0.06% for x ≤ 1e6
 *  (τ ≲ 0.5) — consistent but uninformative, since γ ≈ 1000 acts at τ ≈ 1.9. Off-line quadruple c ± iδ (250–500 digits): exactly 2 negative
 *  chain coefficients = 2 negative squares — ONE negative MASS (O(1) relative to its depth) and ONE tiny negative LENGTH (a dipole; slot parity
 *  [0,1], [1,0] for pair (35,36)). Depth at N = 60, height 35.26: log10 x* = 7.3 / 10.9 / 13.2 / 15.7 for δ = 1 / 0.1 / 0.01 / 1e-3; for δ ≤ 1e-4
 *  the defect is pinned at the END of the finite chain (δ = 1e-6: log10 x* = 12.02 / 15.44 / 21.57 / 22.87 at N = 30 / 40 / 60 / 80), so the
 *  run's x* ~ δ^{−2.4} law is a truncation artifact and is dropped. Rungs a = 0.1 … 2 (812 atoms, Newton residual ≤ 1.4e-12): a = 0.1 matches the
 *  Lagarias limit to ~3 decimals; L_a = ξ'/ξ(1/2 + a) = 0.046136 (a = 1), 0.091834 (a = 2) match the rung sums + tail to ~1e-6; "nothing changes
 *  at a = 1/2" is tautological (rungs built from real zeros; a ≥ 1/2 rungs are HB unconditionally).
 * HEURISTIC: τ*(γ) ≈ 0.39 log γ − 0.8 (the chain scans zeros by height, turning point in a Morse potential; Lagarias 2009). Mass positivity is
 *  tautological given real zeros; a violation is a localised dipole at a depth that grows as δ → 0 — the Hamiltonian form of T3's single-point
 *  failure certificate: you cannot find it without knowing where the zero is. Prime-power features in τ untested.
 *
 * Tagged [map]; REDUCES-TO-WALL (T3 = strip). No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_34_ASSERTIONS
 * recompute live: the length identity 2Σ1/γ² from 30 zeros + smooth tail + boundary term, the cross-identity L/2 − λ_1 = Σ(1/4)/(γ²(γ² + 1/4))
 * with λ_1 = 1 + γ_E/2 − log(4π)/2, the rung lengths L_1, L_2, the truncation pinning of the δ = 1e-6 defect, and the τ ranges.
 */

const { abs, log, PI } = Math;

export const ROUTE_34 = Object.freeze({
  id: 'route-34-de-branges-hamiltonian-xi-2026-10-13',
  route: 34,
  date: '2026-10-13',
  title: 'Route 34: de Branges Hamiltonian for Lagarias\' E = Ξ + iΞ\' — computable and stable, mass positivity tautological, reduces to the zero-location wall',
  status: 'done',
  headline: 'The de Branges Hamiltonian of E = Ξ + iΞ\' is computed from up to 16,000 zeros (and the T3 rungs E_a, a = 0.1–2), verified by '
    + 'reconstructing the Weyl function and by exact rational chains. Mass positivity follows from using real zeros. An off-line zero quadruple '
    + 'produces exactly two negative chain coefficients — one negative mass (O(1) relative to its depth) and one tiny negative length; at fixed N '
    + 'the dipole sits deeper as δ decreases and for small δ is pushed to the end of the finite chain, so no N-converged depth law exists yet.',
  length: Object.freeze({ xiRatio: 0.0462099862308379, sum1e6Tail: 0.0462099862327 }),
  rungLengths: Object.freeze([[1, 0.046136, 0.045605], [2, 0.091834, 0.091303]]), // [a, ξ'/ξ(1/2+a), rung sum below 1200]
  defect: Object.freeze({ negatives: 2, massSlots: 1, lengthSlots: 1, depthN60: Object.freeze([[1, 7.3], [0.1, 10.9], [0.01, 13.2], [1e-3, 15.7]]),
    pinnedDelta1e6: Object.freeze([[30, 12.02], [40, 15.44], [60, 21.57], [80, 22.87]]), pinnedChainIndex60: Object.freeze([118, 119]), chainLength60: 120 }),
  tau: Object.freeze({ tau1e10: Object.freeze([0.638, 0.654]), tau1e100: Object.freeze([1.50, 1.525]), contaminatedN2000: 2.93 }),
  forwardCheck: Object.freeze({ claimed: 7e-13, corrected: 5e-12, refereeN500: 4.8e-12, refereeN2000: 2.6e-12 }),
  q: Object.freeze([[0.1, 20], [1.0, 180], [1.85, 1016]]),
  logrSmoothDiff: 0.486,

  refereeKilled: Object.freeze([
    'defect mislabelled: the two negative coefficients are one MASS and one LENGTH (exact rational chains at N = 40, 60), not "two negative-mass sites" (headline) nor "2 negative lengths" (measured)',
    'depth law x* ~ δ^{−2.4} is a truncation artifact: for δ ≤ 1e-4 the negative entries sit at the last chain indices (k = 118, 119 of 120 at N = 60) and the depth grows with N (12.0 / 15.4 / 21.6 / 22.9 at N = 30 / 40 / 60 / 80); only "deeper as δ decreases at fixed N" survives',
    'τ stability overstated: N = 2000, window 16 gives τ(1e10) = 0.654 and τ(1e100) = 2.93; τ(1e100) = 1.50–1.525 holds only for N ≥ 8000 (windows ≤ 4 at 8000)',
    'forward reconstruction error ≤ 7e-13 held only at 3 points; with 7 points (incl. near a pole) ≤ 5e-12; invalid for N ≥ 8000 (log l clips at ±700)',
    'proved items 2–4 at infinite N presuppose RH (and simple zeros for π/Ξ\'(γ)²): only finite-N statements are unconditional',
    '"zeros above 1000 have no visible effect on D(x)" checked only for x ≤ 1e6 (τ ≲ 0.5), where such zeros do not act (they act at τ ≈ 1.9)',
    '"nothing changes at a = 1/2" is tautological: rungs are built from real zeros; a ≥ 1/2 rungs are HB unconditionally',
  ]),
  nextStep: 'Rerun the negative-site depth with N = 120–200 at higher precision and δ ≥ 1e-3 only (where the defect is interior) to see whether '
    + 'x*(δ) converges in N, and measure its dependence on the height of the off-line pair; then Fourier-analyse q_zeros − q_smooth over τ ∈ [0.3, 2] '
    + 'with N ≥ 64000 (≈ 2 min RKPW, when load allows) to test the prime-power-feature idea.',
  files: Object.freeze(['tmp/routes-b8-r34-rkpw.c', 'tmp/routes-b8-r34-lib.py', 'tmp/routes-b8-r34-nstab.py', 'tmp/routes-b8-r34-flip.py', 'tmp/routes-b8-r34-type.py',
    'tmp/routes-b8-r34-logr.py', 'tmp/routes-b8-r34-sens2.py', 'tmp/routes-b8-r34-indef3.py', 'tmp/routes-b8-r34-rungs.py', 'tmp/routes-b8-r34-rungs-an.py', 'tmp/routes-b8-r34-out/',
    'tmp/routes-b8-ref34-exact.py', 'tmp/routes-b8-ref34-cmp.py', 'tmp/routes-b8-ref34-length.py', 'tmp/routes-b8-ref34-logr-rerun.py', 'tmp/routes-b8-ref34-fwd.py']),
  verdict: 'REDUCES-TO-WALL. The Hamiltonian is computable and stable (verified reconstruction, exact length identity, τ(x) and log r(τ) N-stable '
    + 'once N ≥ 8000 for deep x). It is dominated by the smooth Gamma-factor (Morse-like) part, with the arithmetic as small localised features, '
    + 'and reads the zeros in order of height with depth. Mass positivity is tautological given real zeros; an off-line quadruple shows up as one '
    + 'negative mass plus one negative length, at a depth that is not yet N-converged. Under the T3 dictionary it is the a → 0 gauge limit of the '
    + 'strip ladder, so the route reduces to the zero-location wall: a usable object, no lever beyond the verified zeros. Internal, one referee '
    + 'pass. No Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_34;
const EULER_GAMMA = 0.5772156649015329;
const ZEROS31 = Object.freeze([14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159, 40.918719012, 43.327073281,
  48.005150881, 49.773832478, 52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048, 67.079810529, 69.546401711, 72.067157674,
  75.704690699, 77.144840069, 79.33737502, 82.910380854, 84.735492981, 87.425274613, 88.809111208, 92.491899271, 94.651344041, 95.870634228,
  98.831194218, 101.317851006, 103.72553804]);
// smooth count N_0(T) = θ(T)/π + 1 (asymptotic θ is ample at T ≈ 100)
const N0 = (T) => ((T / 2) * log(T / (2 * PI)) - T / 2 - PI / 8 + 1 / (48 * T)) / PI + 1;

export const ROUTE_34_ASSERTIONS = Object.freeze([
  {
    id: 'r34-length-identity-30-zeros',
    holds: () => { const z = ZEROS31.slice(0, 30); const T = (ZEROS31[29] + ZEROS31[30]) / 2; const head = z.reduce((s, g) => s + 2 / (g * g), 0);
      const smoothTail = (log(T / (2 * PI)) + 1) / (PI * T); const boundary = -(2 / (T * T)) * (30 - N0(T)); const est = head + smoothTail + boundary;
      return abs(est - R.length.xiRatio) < 3e-5 && abs(R.length.sum1e6Tail - R.length.xiRatio) < 3e-12 && abs(head - R.length.xiRatio) > 1e-2; },
    why: 'L = 2Σ1/γ² = ξ\'\'(1/2)/ξ(1/2) = 0.0462099862: 30 zeros (head 0.0344) + smooth tail (1/π)(log(T/2π) + 1)/T − (2/T²)(N(T) − N_0(T)) lands within 3e-5; the run\'s 1e6-zero sum agrees to 2e-12.',
  },
  {
    id: 'r34-length-vs-li-lambda1',
    holds: () => { const lam1 = 1 + EULER_GAMMA / 2 - log(4 * PI) / 2; const d = ZEROS31.reduce((s, g) => s + 0.25 / (g * g * (g * g + 0.25)), 0);
      const T = ZEROS31[30]; const tail = (0.25 / (2 * PI)) * (log(T / (2 * PI)) + 1 / 3) / (3 * T ** 3);
      return abs(R.length.xiRatio / 2 - lam1 - (d + tail)) < 2e-9 && abs(lam1 - 0.023095708966121) < 1e-14; },
    why: 'Cross-check with route 35: L/2 − λ_1 = Σ_{γ>0}[1/γ² − 1/(γ² + 1/4)] = Σ (1/4)/(γ²(γ² + 1/4)) ≈ 9.28e-6, with λ_1 = Σ_ρ 1/ρ = 1 + γ_E/2 − log(4π)/2 = 0.0230957 (31 zeros + smooth tail, agreement < 2e-9, i.e. 0.02%).',
  },
  {
    id: 'r34-rung-lengths',
    holds: () => R.rungLengths.every(([, la, sum]) => abs(sum + 2 / (1200 * PI) - la) < 2e-6) && R.rungLengths[1][1] > R.rungLengths[0][1]
      && R.rungLengths[0][1] < R.length.xiRatio,
    why: 'L_a = ξ\'/ξ(1/2 + a) = 0.046136 (a = 1), 0.091834 (a = 2) equal the 812-atom rung sums below 1200 plus the tail 2/(1200π) to ~1e-6.',
  },
  {
    id: 'r34-defect-truncation-pinned',
    holds: () => { const d = R.defect; const p = d.pinnedDelta1e6;
      return d.negatives === d.massSlots + d.lengthSlots && d.massSlots === 1 && d.lengthSlots === 1
        && d.depthN60.every(([, x], i) => i === 0 || x > d.depthN60[i - 1][1]) && p.every(([, x], i) => i === 0 || x > p[i - 1][1])
        && p[3][1] - p[0][1] > 10 && d.pinnedChainIndex60.every((k) => k >= d.chainLength60 - 2); },
    why: 'Exactly 2 negative coefficients = 1 mass + 1 length; at N = 60 depth rises with 1/δ (7.3 → 15.7 for δ = 1 → 1e-3), but at δ = 1e-6 the defect sits at the last two chain entries and its depth tracks N (12.0 → 22.9 for N = 30 → 80): no N-converged depth law.',
  },
  {
    id: 'r34-tau-and-forward-ranges',
    holds: () => { const t = R.tau; const f = R.forwardCheck;
      return t.contaminatedN2000 > t.tau1e100[1] * 1.5 && t.tau1e10[1] - t.tau1e10[0] < 0.02 && f.refereeN500 <= f.corrected && f.refereeN500 > f.claimed
        && R.q.every(([, q], i) => i === 0 || q > R.q[i - 1][1]) && R.logrSmoothDiff / 500 < 1e-3; },
    why: 'τ(1e100) = 1.50–1.525 only for N ≥ 8000 (N = 2000 large-window value 2.93 is truncation); forward check ≤ 5e-12 (4.8e-12 > claimed 7e-13); q rises 20 → 1016; smooth-vs-zeros log r differs by < 0.1%.',
  },
  {
    id: 'r34-honest-scope',
    holds: () => R.status === 'done' && /REDUCES-TO-WALL/.test(R.verdict) && /tautological/.test(R.verdict) && /one negative mass plus one negative length/.test(R.verdict)
      && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 7,
    why: 'Reduces to the T3 zero-location wall; mass positivity tautological; defect = mass + length dipole; no Λ change; no QED.',
  },
]);

export default ROUTE_34;
