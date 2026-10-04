# FLINT 3.6.0 Platt / Turing implementation: code-and-paper audit

Status: code-and-paper audit by one reader, with numerical spot checks. No external referee. Nothing spent, nothing
launched. This document does not move any bound. PT Lambda <= 0.2 stands. RH open. NO QED.

Grades: **proved** = a written argument checked here; **certified** = interval arithmetic, trust base stated;
**conditional** = depends on a named unproved item; **measured** = a run on this machine; **heuristic** = an estimate.

## 0. Scope and sources

Audited code: the path used by `pilot/chain.c` (single thread, prec 128, A = 8, B = 4096):

`_acb_dirichlet_platt_isolate_local_hardy_z_zeros` → `platt_ctx_init` → `acb_dirichlet_platt_multieval`
(`platt_multieval.c`: `platt_g_table`, `_platt_smk`, `do_convolutions`, `_acb_dirichlet_platt_multieval`,
`remove_gaussian_window`) → `acb_dirichlet_platt_lemma_{32,A5,A7,A9,A11,B1,B2}`, `acb_dirichlet_platt_c_bound`,
`acb_dirichlet_platt_beta`; interpolation `acb_dirichlet_platt_ws_interpolation_precomp` (`platt_ws_interpolation.c`),
`acb_dirichlet_platt_bound_C3`, `acb_dirichlet_platt_i_bound` (`platt_i_bound.c`); Turing logic `_isolate_zeros`,
`create_initial_double_superblock`, `count_up_separated_zeros` (`platt_local_hardy_z_zeros.c`);
`acb_dirichlet_turing_method_bound` (`turing_method_bound.c`); `acb_dirichlet_gram_point` (`gram_point.c`).
`platt_multieval_threaded.c` is not used by the pilot (threads = 1); it threads only the S-table and calls the same
`_acb_dirichlet_platt_multieval`, so the error accounting below applies to it unchanged.

Source: `flint-3.6.0.tar.gz` from the GitHub v3.6.0 release, sha256
`b95e2c7792f5eea4a1c8d2d42c4098434756832e57a094b295eb5dfdc9b4c36b`. The four files the pilot copied into
`tmp/b145-D-pilot/` (`platt_local_hardy_z_zeros.c`, `platt_multieval.c`, `platt_multieval_threaded.c`,
`turing_method_bound.c`) are byte-identical to the tarball. The installed library is Homebrew `flint 3.6.0`
(`/opt/homebrew/Cellar/flint/3.6.0`).

References compared against:

* [Pla17] D. J. Platt, *Isolating some non-trivial zeros of zeta*, Math. Comp. 86 (2017) 2449–2467, doi:10.1090/mcom/3198 (Lemmas 3.2, 3.3, A.1–A.11, B.1, B.2, C.1–C.3; Theorems 4.3, 4.4).
* [Tru11] T. Trudgian, *Improvements to Turing's method*, Math. Comp. 80 (2011) 2259–2279, arXiv:0903.1885 (Theorem 2.1, Theorem 2.2, Corollary 2.3).
* [Bre79] R. P. Brent, *On the zeros of the Riemann zeta function in the critical strip*, Math. Comp. 33 (1979) 1361–1372 (definition of Rosser's rule, Theorem 3.2).
* [Leh70] R. S. Lehman, Proc. LMS 20 (1970) 303–320 (constants a = 1.7, b = 0.114).
* [Ari12] J. Arias de Reyna, *Programs for Riemann's zeta function*, CWI (2012) 102–112 (anchor variant of Turing's method).
* [PT15] D. J. Platt, T. Trudgian, *An improved explicit bound on |ζ(1/2+it)|*, J. Number Theory 147 (2015) 842–851.
* [HPY22] G. Hiary, D. Patel, A. Yang, *An improved explicit estimate for ζ(1/2+it)*, arXiv:2207.02366 (J. Number Theory, 2024).
* [PT21] D. J. Platt, T. Trudgian, *The Riemann hypothesis is true up to 3·10^12*, Bull. LMS 53 (2021), arXiv:2004.09765.
* [Boo06] A. R. Booker, *Artin's conjecture, Turing's method, and the Riemann hypothesis*, Exp. Math. 15 (2006) (source of the aliasing scheme Platt windows).
* FLINT documentation `doc/source/acb_dirichlet.rst` (sections "Hardy Z-function", "Riemann zeta function zeros (Platt's method)").

Pilot parameters (FLINT's built-in fit for n ∈ [1e7, 2e17), reproduced by `flint_audit/bounds.c`):

| height | J | K | σ_grid | σ_interp | h | H | ℓ_J = log(J√π)/2π |
|---|---|---|---|---|---|---|---|
| 3.0002e12 | 953,187 | 42 | 1965 | 25 | 115.633 | 1.4503 | 2.2823 |
| 5.1e12 | 1,238,855 | 42 | 1963 | 25 | 116.794 | 1.4653 | 2.3240 |
| 7.8e12 | 1,528,218 | 41 | 1961 | 25 | 117.740 | 1.4774 | 2.3574 |

## 1. Verdict table

| item | FLINT function | reference | verdict | pilot impact |
|---|---|---|---|---|
| L3.1 DFT pair, scaling 1/A, 1/B | `_acb_dirichlet_platt_multieval` | Pla17 L3.1 | SOUND | none |
| L3.2 pole term 2π^{5/4}e^{1/(8h²)−t0²/(2h²)−πx} | `platt_lemma_32` | Pla17 L3.2 | SOUND (residue re-derived; π^{5/4} from the π^{−it/2} normalisation) | none (10^{−1.46e20}) |
| L3.3 Taylor/convolution, step (5) | `do_convolutions` | Pla17 §3 steps (4)–(5) | **GAP**: convolution reads table indices q ∈ (N/2, N) as u = q/B > A/2, but those entries hold the aliased representative u = q/B − A ∈ (−A/2, ℓ_J − A/2]; no lemma bounds the difference (§2.1) | closed for the 21,665-zero window and the PT hand-off by a patched rerun (§2.1); other pilot windows conditional |
| A.1 incomplete-Γ integral | used in A.3, A.5, A.11, C.3 | Pla17 A.1 | SOUND | none |
| A.2 Stirling bound for Γ((σ+it)/2)e^{πt/4} | (inside A.3) | Pla17 A.2 | SOUND; slack factor 2^{(σ−1)/4} vs the intermediate bound | none |
| A.3 C(σ,t0,h,k) | `platt_c_bound` | Pla17 A.3 | **ERROR** in the printed statement: both terms are a factor π below what the proof gives; FLINT implements the printed form; counterexamples at σ = 3, 5 (§2.2) | none in the pilot: valid for σ ≥ 25 and t0 ≫ σ (true C ≤ 0.0491 × FLINT C at σ = 25) |
| A.4 \|Γ((1/2+ix)/2)\|e^{πx/4} < 4 | (inside A.5, A.10) | Pla17 A.4 | SOUND (max 3.9164 ± 0.058, interval-checked on [−20, 60]; tails analytic) | none |
| A.5 aliasing of g samples | `platt_lemma_A5` | Pla17 A.5 | formula SOUND; **GAP** in hypothesis: code checks B > h√k, the proof needs B ≥ 2h√k (decrease of t^k e^{−t²/2h²} on t ≥ B/2) | none: B = 4096, while 2h√(K−1) ≤ 1496 |
| A.6 bound for \|G^{(k)}(u)\| | (inside A.7) | Pla17 A.6 | **GAP**: the step \|Γ(−σ/2+iy)\| < \|Γ(σ/2+iy)\| "for t ∈ R" is false for σ = 3 near y = 0 (ratio 2.667); holds numerically for σ ≥ 5 (max ratio at y = 0: 0.711 at σ = 5) | none: σ_grid ≈ 1963 |
| A.7 aliasing of G^{(k)} | `platt_lemma_A7` | Pla17 A.7 | SOUND given A.3, A.6 (formula and two-tail majorisation re-derived) | none (10^{−9098}) |
| A.8 / A.9 aliasing of F | `platt_lemma_A9` | Pla17 A.8, A.9 | SOUND given A.3 | none (10^{−9761}) |
| A.10 \|f(t)\| ≤ 3(t+t0)^β e^{−t²/2h²} | `platt_beta` | Pla17 A.10 | SOUND with citation replacement: [PT15]'s 0.732 t^{1/6} log t depends on the Cheng–Graham Kusmin–Landau lemma whose constant [HPY22] shows is wrong by a factor 2; [HPY22] proves 0.618 t^{1/6} log t (t ≥ 3), which implies the bound used | none |
| A.11 aliasing of f samples | `platt_lemma_A11` | Pla17 A.11 | SOUND (hypotheses βh²/t0 ≤ B/2 ≤ t0, t0 > e^e are checked in code) | none (10^{−63.8}) |
| B.1 Dirichlet tail j > J | `platt_lemma_B1` | Pla17 B.1 | SOUND given A.3 | none (10^{−64.9}) |
| B.2 Taylor tail k ≥ K, × (2√J − 1) | `platt_lemma_B2` | Pla17 B.2 | SOUND (integral remainder, valid for complex G; duplication formula checked) | none (10^{−63.9}) |
| Gaussian window removal ×e^{t²/2h²} | `remove_gaussian_window` | Pla17 (3.1) | SOUND (exact multiplier in ball arithmetic) | sets the usable width: ×10^{11.5} at \|t\| = 840, ×10^{68} at 2048 |
| Weiss / Brown sampling error 4∫_{A/2}^∞\|Ŵ\| | `platt_i_bound` | Pla17 Th 4.4, C.1 | SOUND given A.3 at σ_interp = 25 | none (10^{−64.7}) |
| C.2, C.3 truncation to ±Ns support points | `platt_bound_C3` | Pla17 C.2, C.3 | SOUND; FLINT's bound is A times smaller than the printed C.3, and the smaller bound is the correct one (printed proof uses sinc(Ns/A) where the sampling series has sinc(Ns)) | none (10^{−62.7}) |
| interpolation at a ball argument (Gram points) | `ws_interpolation_precomp` | — | SOUND: dt0 is a ball, error bounds evaluated on the ball, uncertain support sets are unioned | none |
| Gram point enclosure | `acb_dirichlet_gram_point` | Brent arXiv:1609.03682 (47) | SOUND (code read: rigorous initial enclosure, then interval Newton) | none |
| Turing block bound | `turing_method_bound` | Tru11 Cor 2.3, Bre79 Th 3.2 | SOUND (§3.1) | b = 6 at 3e12–7.8e12 |
| anchor logic (Arias de Reyna variant) | `_isolate_zeros`, `create_initial_double_superblock` | Bre79 Th 3.2 applied on both sides | SOUND (§3.2) | none |
| index assignment | `count_up_separated_zeros` | — | SOUND; robustness note: code tests "sign changes ≥ zn", not "= zn" | none |
| chunk gluing, shared endpoints | `chain.c`, `assemble_check.py` | PLAN.md gluing lemma | SOUND (§4) | window: endpoints are g_{n_last−1}, N(g) = n_last |

Count: 3 GAP (L3.3 wrap, A.5 hypothesis, A.6 Γ-ratio), 1 ERROR (A.3 statement, inherited by `platt_c_bound`),
1 citation replacement (A.10). None of them changes a certified output of the pilot at the parameters used; the L3.3
gap is the only one that needs new code or a new lemma to close in general.

## 2. Findings in detail

### 2.1 Step (5) wrap-around: GAP (paper and code)

Lemma 3.3 writes F(x) = Σ_k Σ_m G^{(k)}(x + u_m) S_m^{(k)}/k!, u_m = m/B. FLINT computes, for each output index
i ∈ [0, N/2] (x = i/B), the correlation out(i) = Σ_m S_k(m) T_k(i + m) with zero padding to 2N
(`do_convolutions`; verified by tracing the index reversal `S'(r) = S(−r mod 2N)`). The bins m run up to
m_J = round(B ℓ_J) ≈ 9348–9656, so i + m runs up to N/2 + m_J ≈ 26,000 < N = 32,768.

The table row T_k is the DFT of the g(n/A; k) samples. By Lemma 3.1 its entry q encloses
G̃^{(k)}(q) = Σ_l G^{(k)}(q/B + lA), and Lemma A.7 (stated for m ∈ [0, N/2]) bounds the aliases relative to the
representative of q in [−N/2, N/2]. For q ∈ (N/2, N) that representative is u = q/B − A, not q/B. The convolution
needs G^{(k)}(q/B) with q/B ∈ (A/2, A/2 + ℓ_J]. The difference contains the term G^{(k)}(q/B − A) with
q/B − A ∈ (−4, ℓ_J − 4] = (−4, −1.64] at the pilot heights. Neither [Pla17] nor FLINT bounds it. Lemma A.6 does not
help: on that range its left-shift bound is C·e^{(2σ+1)²/8h² − (2σ+1)π|u|}, which is astronomically large at
σ = σ_grid because C ≈ 10^{12107}, and A.6 discards the smallness of |Γ(−σ/2 + iy)| by replacing it with
|Γ(σ/2 + iy)|.

The same structure is in [Pla17] with his parameters (A ≈ 5.98, ℓ_J ≈ 1.93: the wrap occurs for x > A/2 − ℓ_J ≈ 1.06).

* **Size (heuristic).** G is the Fourier transform of a Gaussian-windowed chirp whose instantaneous frequency is
  log((t+t0)/2)/(4π) ≈ 2.23. Its mass sits at u ≈ +2.23 with Gaussian width 1/(2πh) ≈ 0.0014, so
  |G(u)| ≈ e^{−10^6} on (−4, −1.64]. A left shift to Re s = −σ' that keeps the true size of |Γ(−σ'/2 + iy)|
  (≈ √(2π) y^{−(σ'+1)/2} after the e^{πy/2} factor, y ≈ t0/2) gives an order-of-magnitude bound of
  10^{104} at σ' = 3, k = 41, falling by about 16.7 decimal orders per step σ' → σ' + 2. The scale to compare
  is the main-lobe size of row k = 41, about 10^{119}, with existing A.5-propagated radii of about 10^{105}.
  This lemma ("A.6′") is sketched here and is not written or certified.
* **Closing it without a new lemma (certified, measured).** For u ≥ A/2 the right-shift part of A.6 alone gives
  |G^{(k)}(u)| ≤ C·e^{(2σ−1)²/8h² − (2σ−1)πu}, which is at most the A.7 bound for every u ≥ A/2, because that bound
  is decreasing in u. Overwriting the table entries q ∈ (N/2, N) with 0 ± A7_k/k! makes step (5) rigorous using
  only A.3 (valid in this regime) and the right shift. Patch: `flint_audit/platt_multieval_wrapfix.patch`
  (18 lines, `#ifdef WRAP_FIX`). Results:
  * Window chunk 0 (T = 7800000001780, n = 33328427938874). The original code finds 7227 zeros and the patched code
    finds 7247. All 7227 common indices have intersecting isolating intervals. Only intercalated split points move,
    because the split point is the midpoint of a ball whose radius shrank. CPU time was 16.6 s and 17.2 s.
  * All three window chunks rerun with the patch: 21,665 consecutive indices 33,328,427,938,874 … 33,328,427,960,538,
    contiguous, monotone and disjoint. The 24 indices certified by two chunks are consistent.
  * PT hand-off chunk (T = 3000175332379, n = 12363153431998): both versions give zero 12,363,153,437,138 in
    [3000175332799.8600, …799.9768] and zero …139 in [3000175332800.2104, …800.3843]. No interval straddles
    3,000,175,332,800, so N(3,000,175,332,800) = 12,363,153,437,138 is reproduced by the patched code.
  * The patch shrinks radii and widens the usable part of the 7.8e12 grid by about 4.5 units of 1631 (0.3%).
* **Additional guard needed.** Entries with i + m ≥ N would read the zero padding without any error term. This does
  not occur when m_J < N/2, i.e. ℓ_J < A/2. The pilot has ℓ_J ≤ 2.36 < 4. The campaign driver should assert this.

### 2.2 Lemma A.3 (`acb_dirichlet_platt_c_bound`): ERROR in the printed statement, harmless at pilot parameters

The proof of A.3 bounds the t ∈ [0, σ + 1/2] part by 2^{(4k+7−σ)/4}π^{(2k+1)/2}·∫…. The next displayed line, and
the statement, carry π^{(2k−1)/2}. The t ≥ σ + 1/2 part is displayed with π^{(2k+1)/2} in the proof and stated with
π^{(2k−1)/2}. So both stated terms are a factor π smaller than what the proof gives. FLINT implements the statement:
`Xa` has π^k and `Xb` has π^{k−1/2}.

Direct quadrature of the defining integral (`flint_audit/ctest.py`, mpmath 30 digits) against FLINT's value:

| σ | t0 | h | k | C (quadrature) | FLINT `c_bound` | ratio |
|---|---|---|---|---|---|---|
| 3 | 20 | 2 | 0 | 125.82 | 74.31 | **1.693** |
| 3 | 100 | 2 | 0 | 628.35 | 318.40 | **1.973** |
| 3 | 1000 | 5 | 2 | 2.3100e7 | 1.9841e7 | **1.164** |
| 5 | 1000 | 5 | 0 | 7.8542e6 | 6.4378e6 | **1.220** |
| 7 | 1000 | 5 | 0 | 3.9274e9 | 4.1046e9 | 0.957 |
| 25 | 1e4 | 1.45 | 0 | 2.2243e45 | 4.6722e46 | 0.0476 |
| 25 | 1e6 | 1.45 | 0 | 2.2243e69 | 4.5326e70 | 0.0491 |

So `acb_dirichlet_platt_c_bound` is not an upper bound at σ = 3 or 5. A corrected statement follows from the
intermediate form of A.2, |Γ((σ+iT)/2)|e^{πT/4} < 2^{1−σ/2}√π(σ²+T²)^{(σ−1)/4}e^{(1+2√2)/(6T)}, with T ≥ t0:

  C_true ≤ π·((1 + σ²/t0²)/2)^{(σ−1)/4} · C_FLINT.

At σ_interp = 25 and t0 ≥ 1e10 this factor is π/64 = 0.0491, which matches the quadrature column. At
σ_grid ≈ 1963 it is about 10^{−147}. Every use in the pilot (A.7, A.9, B.1 at σ_grid; the C.1 I-bound at
σ_interp) therefore remains a valid upper bound. The library function accepts any odd σ ≥ 3, so a user-tuned σ ≤ 7
gives a non-rigorous enclosure. Fix: multiply by π, or require σ ≥ 9 together with t0 ≥ 2σ.

### 2.3 Lemma A.5 hypothesis: GAP, satisfied

The proof majorises the tail Σ_{w≥2} b((2w−1)B/2) by an integral. This needs b(t) = 4(2πt)^k e^{−t²/2h²} to be
decreasing on [B/2, ∞), i.e. B/2 ≥ h√k. The paper states B > h√k, and `_platt_lemma_A5_constraint` checks that.
Pilot: B = 4096 against 2h√(K−1) = 1481 / 1496 / 1489. The formula itself matches the paper and was re-derived.
Fix: check B ≥ 2h√k.

### 2.4 Lemma A.6 Γ-ratio step: GAP, satisfied

|Γ(−a+iy)|/|Γ(a+iy)| = π/(cosh(πy)|a+iy||Γ(a+iy)|²) for half-integer a. At y = 0 this equals 2.667 for σ = 3,
0.711 for σ = 5, 0.081 for σ = 7, and 1.3e−17 for σ = 25. The grid max over y ∈ [0, 40] is at y = 0 in each case
(`flint_audit/gam.py`). So the claim fails for σ = 3. The failure region (|t + t0| = O(1)) carries a Gaussian factor
e^{−t0²/2h²}, which makes the numerical effect nil. The written step still needs σ ≥ 5 plus a proof for all y, or a
separate bound near y = 0. FLINT accepts σ = 3. The pilot uses σ ≈ 1963.

### 2.5 Lemma A.10 input: citation replacement

[Pla17] A.10 uses [PT15] |ζ(1/2+it)| ≤ 0.732 t^{1/6} log t. [HPY22] reports that all published explicit
subconvexity bounds before it used Cheng–Graham's Kusmin–Landau constant 1/π instead of the correct 2/π. With the
correction, Hiary's 0.63 becomes 0.77. [HPY22] then proves 0.618 t^{1/6} log t for t ≥ 3. Since 0.618 < 0.732,
A.10, A.11 and C.2 hold with [HPY22] cited in place of [PT15]. The factor 3 ≥ 4 × 0.732 stays valid. For t + t0 < 3
(left tail only) the Gaussian factor e^{−(t0−3)²/2h²} and |ζ(1/2+iT)| ≤ 1.5 on |T| ≤ 3 cover the bound.

### 2.6 Items re-derived and found to match

* L3.2: the residue of f(t)e(−tx) at s = 1 has modulus 2π·π^{1/4}·e^{(1/4 − t0²)/(2h²)}·e^{−πx}, which equals FLINT's
  `(t0² − 1/4)/(2h²)` form.
* A.5: 8(πB)^k[e^{−B²/8h²} + 2^{(3k−1)/2}(h/B)^{k+1}Γ((k+1)/2, B²/8h²)], via the substitution u = (2w−1)B/2.
* A.7 and A.9: two-tail majorisation (the m = N/2 case majorises every m by the termwise inequalities
  lA ± m/B ≥ (2l−1)A/2). The factors 1 + 1/(Aπ(2σ−1)) and 1 + 1/(Aπ) come from ∫_1^∞ e^{−c(2n−1)} dn = e^{−c}/(2c).
  The bounds are applied to all N entries, which is valid because the argument depends only on |u|.
* A.11: split at t = t0, Lemma A.1 with κ = 0 and κ = β, both tails. The decrease condition t(t + t0) ≥ βh² at
  t = B/2 is implied by the checked βh²/t0 ≤ B/2.
* B.1: right shift, Σ_{j>J} j^{−σ} ≤ J^{1−σ}/(σ−1).
* B.2: 8∫_0^∞(2πtξ)^K e^{−t²/2h²}dt/K! with the duplication formula gives 2^{(K+5)/2}π^{K+1/2}h^{K+1}ξ^K/Γ((K+2)/2).
* C.1: A.8 with H, integrated over [A/2, ∞), ×4.
* C.3: X + Y + Z with prefactor 6/(πNs). The printed 6A/(πNs) comes from sinc(Ns/A). The sampling series in
  Theorem 4.3 with 2B = A has sinc(A(n/A − t0)), whose value at distance Ns/A is at most 1/(πNs). FLINT's tighter
  form (arb PR #269) is correct.
* S-table: bins use exact `arb_get_unique_fmpz` boundaries. ℓ_j ∈ [m/B − 1/2B, m/B + 1/2B) matches ξ = 1/(2B).
  The out-of-range bin throws.
* Error magnitudes at 3e12 (log10 of the radius added; `flint_audit/bounds.c`): A.5 max_k 101.3 (absolute, on
  g(t;k) samples that include (2πt)^k ≈ 10^{168}), A.7 −9098.5, L3.2 −1.46e20, B.1 −64.9, (2√J−1)·B.2 −63.9,
  A.9 −9760.8, A.11 −63.8, I-bound −64.7, C3 −62.7. At 7.8e12: A.11 −61.3, B.2 term −61.6, C3 −60.3. All are far below
  the 128-bit rounding radii that set the usable width.

## 3. Turing's method

### 3.1 `acb_dirichlet_turing_method_bound`

FLINT returns ⌈min(0.0061L² + 0.08L, 0.0031L² + 0.11L)⌉ with L an upper bound for log g_p. It uses `arb_get_mag`
for the upper bound of g_p, then `mag_log` (upper bound) and `mag_get_fmpz` (ceiling, per `mag.rst`).

* [Bre79] Th 3.2, with Lehman's (a, b) = (1.7, 0.114): b/6π = 0.006048 ≤ 0.0061 and
  (a − b log 2π)/6π = 0.07907 ≤ 0.08. Rosser's rule in [Bre79] means "Z has at least k zeros in the block", which
  matches FLINT's test `count_sign_changes(u, v) >= zn`.
* [Tru11] Cor 2.3 comes from Th 2.1 with Th 2.2 (a, b) = (2.067, 0.059), valid for t2 > t1 > 168π.
  b/6π = 0.0031300, which Cor 2.3 rounds down to 0.0031; (a − b log 2π)/6π = 0.10390, rounded up to 0.11. The rounded
  formula is at least the exact one whenever 0.0000300L² ≤ 0.0061L, i.e. L ≤ 203 (g_p ≤ e^{203}). Pilot L ≈ 28.7–29.7.
* Values: FLINT returns b = 6 at 3e12, 5.1e12 and 7.8e12. The exact Trudgian form gives 5.57 / 5.72 / 5.84 and the
  Lehman form gives 7.26 / 7.49 / 7.68. SOUND.
* Not used and not needed: [Tru14] (Turing II, Dirichlet/Dedekind) and [Boo06]'s general-L form.

### 3.2 Anchor logic (`create_initial_double_superblock`, `_isolate_zeros`)

* An anchor x is the centre of 2b consecutive good blocks. b blocks after x, with union [g_x, g_e), give
  N(g_x) ≤ x + 1 with K = b ≥ bound(g_e). b blocks before x give N(g_x) ≥ x + 1 with b ≥ bound(g_x).
* In the initial superblock, b is evaluated at the forward end q ≥ e, and the bound is monotone in g. In the main
  loop, b is recomputed at the forward node v and y is the b-th good node before v. Both directions of [Bre79] Th 3.2
  therefore apply, and N(g_x) = x + 1 exactly.
* Between anchors x < y, exactly y − x zeros exist with multiplicity, counting off-line zeros. FLINT exhibits ≥ y − x
  certified sign changes. Hence there are exactly y − x sign changes, each interval holds one simple zero on the line,
  and there are no off-line zeros in (g_x, g_y].
* Gram nodes are stored at the midpoint of the g_n ball. The enclosure covers the whole ball, so no on-line zero lies
  between the midpoint and g_n, and off-line zeros there fall inside one anchor segment. SOUND.
* `count_up_separated_zeros` starts at N = x + 1 and labels a zero only when N equals the requested index. If the
  requested zero lies before the first anchor, the chunk returns 0 (FAIL). It never returns a wrong index. SOUND.
* Robustness: the code loops "while sign changes < zn" and never asserts equality. A count above zn is impossible if
  every bound is correct; asserting `== zn` would turn an implementation error into a hard failure. Recommended
  for the campaign build.
* Imprecise evaluations either throw (`zz_node_sgn`) or stop the chunk (`intercalate` returns 0). No path returns an
  unverified sign.

## 4. Chunk gluing and the shared endpoints in the 21,665-zero window

`tmp/b145-B-out/walls/chain_window_rerun.jsonl`, 3 chunks, prec 128:

| chunk | n_first | n_last | t_first_lo | t_last_hi | θ(t_last_hi)/π |
|---|---|---|---|---|---|
| 0 | 33328427938874 | 33328427946100 | 7800000000999.7362994 | 7800000002630.3659385 | 33328427946099.00000006 |
| 1 | 33328427946101 | 33328427953306 | 7800000002630.3659385 | 7800000004256.2573428 | 33328427953304.99999992 |
| 2 | 33328427953307 | 33328427960538 | 7800000004256.2573428 | 7800000005888.0151330 | 33328427960537.00000002 |

* Each shared endpoint, t_last_hi(c) = t_first_lo(c+1), is the Gram point g_{n_last(c) − 1}. The residual 6e−8 in
  θ/π is the 20-digit print rounding. Consistent with anchoring, N(g_{n_last−1}) = n_last: the last zero of chunk c lies
  below the Gram point and zero n_last + 1 lies above it. The first and last window endpoints are g_{…38872} and
  g_{…60537}, again with N(g_n) = n + 1.
* Each chunk certifies f(g) ≠ 0 on its own grid, so both isolating intervals are open at g. Gluing does not rely on
  the endpoint coincidence. It relies on exact indices: chunk c+1 is asked for index n_last(c) + 1 and certifies that
  exact index or returns FAIL. The gluing lemma in PLAN.md is SOUND (proved, elementary).
* After a retry at prec + 64 the Gram midpoint can differ in the last bits, so the two intervals may overlap or leave
  a 1e−30 gap. Neither affects index-based gluing.
* Coverage: the window statement needs every zero with ordinate in [x_L/2, x_R/2] = [7800000001111.6, 7800000004737.7]
  to be simple and on the line. The certified range [γ_{…38874}, γ_{…60538}] ⊇ [7800000001000.0, 7800000005887.8]
  contains it.
* The window was reproduced with the wrap-fixed multieval (§2.1): 21,665 contiguous indices, consistent.

## 5. Consequences for the pilot claims (b145-verification-pilot, PLAN.md §6)

* **Proved:** the gluing lemma; the Turing anchor argument given [Bre79] Th 3.2 and [Tru11] Th 2.2; the
  re-derivations listed in §2.6.
* **Certified** (Arb ball arithmetic correct; the [Pla17] lemmas as patched here; [HPY22]; [Tru11]; [Bre79]):
  * the 21,665-zero window at 7.8e12 (indices 33,328,427,938,874 … 33,328,427,960,538), rerun with the wrap-fixed code;
  * N(3,000,175,332,800) = 12,363,153,437,138, rerun with the wrap-fixed code.
* **Conditional:** every other pilot window (≈ 5e5 units at 1e10 … 7.8e12) was run with the unpatched code. Its
  enclosures depend additionally on the unwritten Lemma A.6′ (§2.1). Heuristically that lemma holds with a margin of
  hundreds of decimal orders. Rerunning with the patch removes the dependence.
* **Measured:** patched vs original timings and counts (§2.1); bound magnitudes (§2.6); C quadrature (§2.2).
* **Heuristic:** the e^{−10^6} size of the wrapped entries, and the A.6′ order-of-magnitude.
* The ERROR in A.3 and the A.5 / A.6 hypothesis gaps do not affect any pilot output, because σ_grid ≈ 1963,
  σ_interp = 25, B = 4096 and t0 ≥ 1e10.

## 6. Required before any campaign spend

1. Build the campaign binary with the wrap fix, or with an equivalent written Lemma A.6′, and assert m_J < N/2
   (ℓ_J < A/2) per grid.
2. Patch `acb_dirichlet_platt_c_bound` (×π), or assert σ ≥ 9 and t0 ≥ 2σ for every σ passed (σ_grid, σ_interp).
3. Assert B ≥ 2h√(K−1) (A.5) and σ_grid ≥ 5 (A.6).
4. Assert `count_sign_changes(x, y) == zn` before labelling zeros.
5. Cite [HPY22] for the ζ(1/2+it) bound behind A.10/A.11/C.2.
6. Get an independent referee for this audit, in particular §2.1 and §2.2. Report the A.3 and step-(5) items
   upstream to FLINT and to the author of [Pla17]. This is not done here: nothing was sent outside this machine.
7. Re-time the patched build on the target instance. Locally the patch costs +3% CPU on one chunk and gives +0.3%
   usable width.

## 7. Reproduce

Files are in `flint_audit/`:

* `bounds.c`: parameters, all bound magnitudes, the Turing bound, and the A.3 slack.
* `cb.c` + `ctest.py`: Lemma A.3 against quadrature.
* `gam.py`: the A.6 Γ-ratio and the sup bound 4.
* `sup4.c`: interval check of the bound 4.
* `gram.py`: shared endpoints as Gram points.
* `platt_multieval_wrapfix.patch` + `wrapfix_driver.c`: the patched multieval and a one-chunk driver.

```sh
cc -O2 -o bounds bounds.c -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm && ./bounds
cc -O2 -o cb cb.c -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm && /tmp/rhvenv/bin/python ctest.py
cc -O2 -o sup4 sup4.c -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm && ./sup4
/tmp/rhvenv/bin/python gam.py ; /tmp/rhvenv/bin/python gram.py
# wrap fix: copy platt_multieval.c and platt_local_hardy_z_zeros.c from the 3.6.0 tarball, apply the patch,
# compile both with -DWRAP_FIX and symbol renames
#   (-Dacb_dirichlet_platt_multieval=aud_platt_multieval, -D_acb_dirichlet_platt_isolate_local_hardy_z_zeros=aud_isolate, ...)
# then link wrapfix_driver.c:   ./drv_fix 7800000001780 33328427938874
```

PT Lambda <= 0.2 stands. RH open. NO QED.
