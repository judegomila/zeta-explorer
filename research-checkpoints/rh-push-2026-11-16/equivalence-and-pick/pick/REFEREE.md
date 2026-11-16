# Referee report: NEXT_STAGE.md + k_node_certificate.py

Date: 2026-11-16. Adversarial read-only review. Files read: NEXT_STAGE.md,
k_node_certificate.py, cert_K{7,8,10,12}.log, sympy_identities.py,
get_zeros.py, PR #50 (refs/pr/50, fetched read-only). The certificate was
re-run once for K=7 from a copy in /tmp/pickref/.

## Summary verdicts

| Item | Verdict |
|---|---|
| (1) Splitting identity and sign logic | HOLDS for PSD; **GAP for strict PD when K >= 8** (fix is one line) |
| (2) Dobsch–Donoghue use, range (0, oo) | HOLDS |
| (3) Tail bound (Trudgian S(t), summation, uniformity) | HOLDS |
| (4) Arb certificate and logs | HOLDS, with two cosmetic rigor nits (non-binding) |
| (5) Hidden RH assumption | HOLDS (none found) |

Net: the K <= 7 theorem is supported as written. For 8 <= K <= 12 the
argument as written proves P is PSD, not PD. The fix below gives PD
without changing any certificate number.

## (1) Identity and sign logic

- Identity (1), P(x,y) = j[x^2,y^2] - xy h[x^2,y^2], is PR #50 eq. (29)
  (theta_fourth_pick_schwarzian_20261109.md line ~424). I checked it by
  hand. sympy_identities.py also checks it. On the diagonal both sides
  equal h(u) = L(x)/x, since j' - u h' = h.
- P = Loew_j + X Loew_{-h} X with X = diag(x_i) > 0. This is correct.
- (1/(u+c))[u,v] = -1/((u+c)(v+c)) gives Loew_{h_7} = -2 Σ c_n c_n^T,
  so Loew_{-h} = Loew_f + Σ c_n c_n^T with f = -h + h_7/2. The sign is
  correct.
- Which part needs which condition: j must be K-monotone, and f
  (not -h) must be K-monotone. This is correctly assigned.
- **GAP (strictness, K >= 8).** Σ_{n<=7} c_n c_n^T is a sum of seven
  rank-one terms, so on K nodes its rank is at most 7. The note's claim
  that this "nonsingular Cauchy-type Gram matrix ... is positive definite"
  is true only for K <= 7. For K = 8..12 the chain yields P ⪰ 0, not
  P ≻ 0. Dobsch–Donoghue/Loewner give only PSD for Loew_f and Loew_j.
  The separate "Strictness holds because ... P(0)=0" remark is about
  strict positivity of the Hankel form at each u. It does not transfer
  to strict Loewner positivity.
  - **Fix:** use h_K = 2 Σ_{n<=K} 1/(u+γ_n^2) with K distinct real zeros.
    Then Σ_{n<=K} c_n c_n^T = C C^T, where C_{in} = 1/(u_i + γ_n^2) is a
    K×K Cauchy matrix, which is nonsingular for distinct u_i and distinct
    γ_n^2. The certificate already uses only c_λ >= 1/2 on chosen zeros
    and c_λ <= 1 on tail zeros (`condH = 1/(2 LH^2)`,
    `rH = TAIL*rmax*2*LH^2`), so no number changes.
  - NEXT_STAGE.md must state h_K, not h_7.

## (2) Dobsch–Donoghue

- The statement is in the standard form: for f ∈ C^{2K-1}(I), with I an
  open interval, f is K-monotone iff [f^{(i+k-1)}(u)/(i+k-1)!]_{i,k=1..K}
  ⪰ 0 for every u ∈ I. The condition is non-strict. Heinävaara (PAMS
  2018) gives a complete proof.
- f and j are real-analytic on (0, oo), because Re(u+λ) > 0 there.
- The conclusion is used on I = (0, oo).
- Coverage: region L includes the cell (0,1], so u → 0+ is covered.
  Region H covers [1e7, oo) uniformly. No endpoint value is needed,
  because the interval is open and nodes x_i > 0 give u_i ∈ (0, oo).
- Loewner (Bhatia V.3.4) is correctly invoked.
- Spectral forms: I re-derived both by hand from
  f^{(m)}/m! = -Σ 2c_λ(-1)^m (u+λ)^{-m-1} and
  j^{(m)}/m! = Σ 2λ(-1)^{m-1}(u+λ)^{-m-1}. The congruences
  y_i = (-1)^i u^i v_i and y_i = (-1)^i u^{i-1/2} v_i give exactly
  2Σ c_λ Re P(ζ)^2 and 2Σ Re ζ(1-ζ)Q(ζ)^2.
- Termwise differentiation is valid, since Σ|u+λ|^{-2} converges.

## (3) Tail bound

- Trudgian (2014) gives |S(t)| <= 0.112 log t + 0.278 log log t + 2.510
  for t >= e. The constants are as cited.
- N = θ/π + 1 + S. Partial summation gives Σ_{γ>T} γ^{-2} <=
  ∫ θ'/(π t^2) + E(T)/T^2 + 2∫E t^{-3}. The code's form
  (E(T)-1)/T^2 + 2∫(1+E)t^{-3} is algebraically identical.
- I recomputed I1 and I3: E <= 0.39 log t + 2.51 (log log <= log), and
  the integrals are correct.
- θ' bounds: θ'(t) = ½ log(t/2π) + O(t^{-2}), so the stated
  ±(1/(6t) + ...) and -2/(3t) bounds are valid and conservative.
- S_T <= 1.4797e-12, which matches (log(T/2π)+1)/(2πT).
- Arguments of ζ: |ψ| <= tan|ψ| = 2|β'|γ/(u+γ^2-β'^2) <= γ/(γ^2-¼),
  uniformly in u.
- Bounds on |ζ|: u/(u+γ^2+½) <= |ζ| <= u/(u+γ^2-¼), from
  |u+λ|^2 <= (u+γ^2)^2 + γ^2.
- Lemma T constants: Markov on [0,1] gives ‖G'‖ <= 2n^2‖G‖ and
  ‖G''‖ <= 4 n^2(n^2-1)/3 ‖G‖, which yields n^2 + (2/3)n^2(n^2-1). The
  terms with k >= 3 are <= ψ^2 (2n^2 ψ)/90 ≪ ψ^2 for n <= 24 and
  ψ < 3.4e-13, so the "+1" is ample.
- Uniformity: ρ_max is taken at the cell's upper u, where
  (u+γ_1^2)/(u+T^2) is increasing. In region H, ρ <= 1.
- Lemma W: the count N(t(1+δ)) - N(t) > 0 follows from the θ increment
  minus 2E. At t_min ≈ 593–660 (all logs), lhs ≈ 13 > rhs ≈ 7.5. The
  lhs grows like t log t and the rhs like log t.

## (4) Arb certificate

- Lebesgue bounds: [0,1] is covered by 1500 closed balls, and their
  radii round up, so the cover has no gaps.
- Node positions are balls hulled over the cell endpoints, using
  monotonicity of t_m(u). Interval evaluation with repeated variables is
  inclusion-monotone, so the bound is valid over all node positions in
  the balls. Overlapping nodes are asserted against.
- Cells are contiguous, run from 0 to 1e7, and the last cell is clipped
  at 1e7. Region H starts at 1e7. Node choice uses floats, but only for
  selection; this is harmless.
- No sampled points enter any inequality.
- Nit a: `lebesgue_upper` updates the running max by comparing
  `float(s.upper())`. Double rounding could keep a value 1 ulp below the
  true max. This is irrelevant at the observed margins (>= 35×), but is
  not strictly rigorous. Use an arb `max` or `s.upper() > best`.
- Nit b: `get_zeros.py` stores enclosure endpoints as
  `lower().str(30, radius=False)`, which rounds to nearest. The stored
  lower bound can therefore sit slightly above the true lower endpoint.
  `hull` adds only 1e-30, while for γ ~ 1.8e4, 30 significant digits
  means ~5e-26 granularity. I spot-checked γ_1: the true value
  14.1347251417346937904572519835624… lies inside. This is non-binding
  (node intervals are ~10^20× wider than this), but the fix is to widen
  by 1e-20.
- Cosmetic: the note says "815 geometric cells plus [0,1]". The logs show
  815 cells in total, including [0,1]. `node_interval` is dead code.
- Logs: every table number in NEXT_STAGE.md matches cert_K7/8/10/12.log.
  Each log has 815 cells, no FAIL lines, and ends in ALL PASS.
- Re-run (/tmp/pickref/rerun_K7.log, one process, 68 s): identical
  output to cert_K7.log except the timings. Region L worst rH = 1.021e-21
  and rJ = 4.997e-22; region H ratios are 7.909e-6 and 2.432e-5; the run
  ends in ALL PASS.
- K = 9 and 11 are not run directly. They follow by principal submatrix
  from K = 10 and 12, subject to item (1).

## (5) RH

None assumed. The proof uses only:

- PT: all zeros with 0 < γ <= 3e12 are on the line.
- The open strip, |β'| < ½, which is used for every tail zero.
- No real zeros of ξ in (0,1), which is classical.
- The genus-0 Hadamard product in x^2.

Off-line tail zeros, including chosen window zeros above T, are handled
explicitly through ρ-intervals and the ψ^2 error.
