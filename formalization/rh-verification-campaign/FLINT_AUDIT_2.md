# FLINT 3.6.0 Platt / Turing chain: second independent audit (7.8e12 window)

Status: second code-and-paper audit by one reader, with interval-arithmetic checks and three reruns of the 7.8e12
window. Not an external review. Nothing spent, nothing sent outside this machine. This document does not move any
bound. PT Lambda <= 0.2 stands. RH open. NO QED.

Grades: **proved** = argument written and checked here; **certified** = interval/ball arithmetic, trust base stated;
**conditional** = depends on a named unproved item; **measured** = a run on this machine; **heuristic** = an estimate.

## 0. Scope, independence, provenance

* Read before the verdicts below were fixed: the data modules named in the task (`r2-structured-floor`,
  `r2-height-reduction`, `r2-lemma-b-status`, `r2-flint-audit`, `r2-second-referee`, the `b145-*` modules),
  `formalization/paper/lemma-B-two-band.md`, `PLAN.md`, the FLINT source, and the primary papers. `r2-flint-audit`
  summarises the first audit's headline findings, so those items were known in summary form; each was re-derived
  from the paper and the source, and every numerical check below uses code written for this audit.
  `FLINT_AUDIT.md` was read only after §1–§6 were fixed; the comparison is in §7.
* Papers used (local copies in `/private/tmp/flintsrc/`): [Pla17] Platt, Math. Comp. 86 (2017) 2449–2467 (journal
  version); [PT21] Platt–Trudgian, arXiv:2004.09765v1; [Tru11] Trudgian, Math. Comp. 80 (2011), arXiv:0903.1885v3;
  [Tru14] Trudgian, Turing II, arXiv:1406.3416; [Bre79] Brent, Math. Comp. 33 (1979) 1361–1372 (scan);
  [HPY22] Hiary–Patel–Yang, arXiv:2207.02366; [PY23] arXiv:2302.13444.
  Not available offline: Lehman (1970), Booker (2006), Arias de Reyna (2012). FLINT does not use Booker's form of
  Turing's method; the direct-integral check of §3.4 is the form of [Pla17] §4.1.
* Source: `flint-3.6.0.tar.gz`, sha256 `b95e2c7792f5eea4a1c8d2d42c4098434756832e57a094b295eb5dfdc9b4c36b`, equal to
  Homebrew's `stable_checksum` and to the checksum in the installed bottle's `sbom.spdx.json`. Extracted afresh to
  `/tmp/flintaudit2/flint-3.6.0` (identical to the first auditor's tree).
* Build used for the reruns: own copies of `platt_multieval.c` (with and without the wrap patch),
  `platt_multieval_threaded.c` and `platt_local_hardy_z_zeros.c`, compiled with `-include rename.h` (prefix `a2_` on
  all ten exported Platt symbols) so the locally built units, not the dylib's, are executed (checked with `nm`; the
  patched unit has two call sites of `acb_dirichlet_platt_lemma_A7`, the unpatched one has one). All lemma
  functions, Gram points, Turing bound and interpolation come from the installed 3.6.0 library.

Pilot parameters at 7.8e12 (FLINT's fit for n ∈ [1e7, 2e17), reproduced by `chain2.c`): A = 8, B = 4096,
N = 32768, K = 41, J = 1,528,218, σ_grid = 1961, σ_interp = 25, h = 117.7396, H = 1.47744, N_s,max = 200.
Derived: m_J = ⌊B log(J√π)/2π + 1/2⌋ = 9656, first nonzero S-bin m = 373.

## 1. Verdicts

| item | FLINT | reference | verdict (this audit) |
|---|---|---|---|
| L3.1 DFT pair, 1/A and A scalings | `_acb_dirichlet_platt_multieval` | Pla17 L3.1 | SOUND (re-derived from Poisson summation) |
| L3.2 pole term | `platt_lemma_32` | Pla17 L3.2 | SOUND (residue modulus 2π^{5/4}e^{1/8h²−t0²/2h²−πx}; FLINT adds it as a radius) |
| L3.3 convolution, step (5) | `do_convolutions` | Pla17 §3 | **GAP** (wrap-around, §2.7); closed by the 18-line patch (verified) |
| A.1, A.2 | inside A.3 | Pla17 | SOUND |
| A.3 C(σ,t0,h,k) | `platt_c_bound` | Pla17 A.3 | **ERROR** in the printed statement (both terms a factor π low), inherited by FLINT; rigorous counterexamples at σ = 3, 5, **7**; valid as coded when π((1+σ²/t0²)/2)^{(σ−1)/4} ≤ 1, e.g. σ ≥ 9 and t0 ≥ 3σ (§2.2). Pilot σ = 25 and 1961: valid. |
| A.4 sup \|Γ(1/4+ix/2)\|e^{πx/4} < 4 | inside A.5, A.10, B.2 | Pla17 A.4 | SOUND: sup ∈ [3.91633, 3.91699] at x ≈ 0.213 (certified) |
| A.5 | `platt_lemma_A5` | Pla17 A.5 | formula SOUND; **GAP** in hypothesis: proof needs B ≥ 2h√k, code checks B > h√k; pilot 4096 ≥ 1489.4 |
| A.6 | inside A.7 | Pla17 A.6 | **GAP** at σ = 3 (Γ-ratio 8/3); **proved here for every odd σ ≥ 5 and all real y** (§2.5). Pilot σ = 1961. |
| A.7, A.8, A.9 | `platt_lemma_A7`, `_A9` | Pla17 | SOUND given A.3, A.6 (A.7 proof has (σ+1)² where the statement has (2σ+1)²; the statement and code use the larger) |
| A.10, A.11, C.2 | `platt_beta`, `platt_lemma_A11` | Pla17 + HPY22 | SOUND with [HPY22] Thm 1.1 (0.618 t^{1/6} log t, t ≥ 3) in place of [PT15] 0.732; typo e^{πt/4} → e^{π(t+t0)/4} in A.10's proof; left tail needs the one-line extension of A.10 to t < 0 |
| B.1, B.2 | `platt_lemma_B1`, `_B2` | Pla17 | SOUND (B.2 via the integral form of the Taylor remainder and the duplication formula) |
| C.1 I-bound, Weiss/Brown 4∫_{A/2}^∞\|Ŵ\| | `platt_i_bound` | Pla17 C.1, Th 4.4 | SOUND given A.3 at σ_interp = 25 |
| C.3 | `platt_bound_C3` | Pla17 C.3 | FLINT's bound 6(X+Y+Z)/(πN_s) is A times smaller than printed and is the correct one (printed C.3 carries a superfluous factor A; its X has h for H, code uses H) |
| Gram points | `acb_dirichlet_gram_point` | — | SOUND (Lambert-W start, interval Newton with containment check) |
| Turing block bound arithmetic | `turing_method_bound` | Bre79 Th 3.2, Tru11 Cor 2.3 | matches the published formulas with outward rounding; Cor 2.3's rounding is valid for log g ≤ 202.84; b = 6 at 7.8e12 (5.9971) |
| **Gram-block criterion itself** | anchor logic | Bre79 Th 3.2 / Tru11 Th 2.1, Cor 2.3 | **GAP (new)**: not derivable from the integral bound with the published constants; explicit counterexample configuration; sharp block-only criterion needs ≥ 10 unit blocks per side at 7.8e12, FLINT uses 6 (§3.3) |
| anchor logic as code | `_isolate_zeros`, `create_initial_double_superblock`, `count_up_separated_zeros` | — | applies the published criterion correctly (bound at the far end, parity offset N = gram + 1, labels only matching indices); inherits the GAP above |
| 7.8e12 window | — | — | **certified independently of the Platt lemmas and of the block criterion**: direct-integral Turing ([Tru11] Th 2.2) at both ends + Riemann–Siegel signs at 26,394 interval endpoints (21,785 intervals); exactly 16,071 zeros in [x_L/2, x_R/2] and 21,665 in the original range, all simple and on the line (§3.4, §4) |

## 2. Grid stage (Platt 2017 Lemmas 3.2, A.3–A.11, B.1, B.2, C.1–C.3)

### 2.1 Lemmas 3.1, 3.2 and the scalings

The g-table entry i = n + N/2 holds g(n/A; k) = Γ((1/2+i(n/A+t0))/2)e^{π(n/A+t0)/4 − (n/A)²/2h²}(−2πin/A)^k; A.5 is
added; halves are swapped so row index j holds g̃ at n ≡ j (mod N); the DFT divided by A gives G̃^{(k)}(m) (from
f̃(n) = B^{−1}Σ_m e(mn/N)F̃(m)); the inverse DFT (FLINT includes 1/N) times A gives f̃(n) = B^{−1}Σ… . Rows are divided
by k! after A.7 is added. The pole residue at s = 1 has modulus 2π·π^{1/4}·e^{(1/4−t0²)/2h²}·e^{−πx}, equal to
`platt_lemma_32`. The real part is taken after the last DFT (f is real), then multiplied by e^{t²/2h²}.

### 2.2 Lemma A.3: ERROR in the printed statement (FLINT inherits it)

Proof check. After the symmetrisation ∫_{−∞}^{∞} ≤ 2∫_0^∞ (valid: G_p(x) = |Γ((σ+ix)/2)|e^{πx/4} is increasing in x,
since d/dx log G_p = π/4 − Im ψ((σ+ix)/2)/2 and Im ψ(a+ib) = Σ_n b/((n+a)²+b²) < π/2 for a ≥ 1/2, b > 0), Lemma A.2
contributes √π, so the first displayed bound carries 2^{k+1}π^k·√π = 2^{(4k+7−σ)/4}π^{(2k+1)/2}. The next line of the
proof and the statement carry π^{(2k−1)/2}. The t ≥ σ+1/2 part is displayed with π^{(2k+1)/2} and stated with
π^{(2k−1)/2}. Both stated terms are a factor π low. `platt_c_bound.c` implements the statement exactly
(`Xa` = 2^{(6k+5−σ)/4}π^k(σ+1/2)^k h, `Xb` = 2^{(6k+7−σ)/4}π^{k−1/2}, polynomial X(t0), factor e^{(1+√8)/6t0},
(σ+1/2+t0)^{(σ−1)/2}).

Correction (proved). The intermediate form of A.2, G_p(x) < 2^{1−σ/2}√π(σ²+x²)^{(σ−1)/4}e^{(1+2√2)/6x}, loses
((σ²+x²)/2x²)^{(σ−1)/4} ≤ ((1+σ²/t0²)/2)^{(σ−1)/4} when replaced by 2^{(3−σ)/4}√π x^{(σ−1)/2} for x ≥ t0. Hence

  C_true ≤ π·((1 + σ²/t0²)/2)^{(σ−1)/4}·C_FLINT.

Certified enclosures (`ctrue2.py`: monotone factors evaluated at exact cell endpoints in Arb, Riemann sums on
[−16h, 16h], rigorous tail bound; independent of FLINT's code path) of C_true/C_FLINT:

| σ | t0 | h | k | C_true / C_FLINT | correction factor |
|---|---|---|---|---|---|
| 3 | 100 | 2 | 0 | **[1.9728, 1.9741]** | 2.2224 |
| 5 | 1000 | 5 | 0 | **[1.2196, 1.2204]** | 1.5708 |
| 3 | 50 | 3 | 2 | **[1.1489, 1.1506]** | 2.2254 |
| 7 | 1e6 | 1 | 0 | **[1.11034, 1.11105]** | 1.11072 |
| 7 | 7.8e12 | 1.4777 | 0 | **[1.10895, 1.11249]** | 1.11072 |
| 7 | 500 | 4 | 1 | [0.78391, 0.78459] | 1.1110 |
| 9 | 1000 | 3 | 0 | [0.75443, 0.75492] | 0.7855 |
| 9 | 7.8e12 | 1.4777 | 0 | [0.78414, 0.78665] | 0.7854 |
| 9 | 18 | 1 | 0 | [0.15990, 0.16003] | 1.2272 |
| 25 | 1e4 | 1.478 | 0 | [0.047592, 0.047623] | 0.04911 |
| 25 | 7.8e12 | 1.4777 | 0 | [0.049009, 0.049166] | 0.04911 |
| 1961 | 7.8e12 | 117.75 | 0 | e^{[−338.499, −338.496]} | e^{−338.497} |
| 1961 | 7.8e12 | 117.75 | 40 | e^{[−352.3, −295.4]} | e^{−338.497} |

* `acb_dirichlet_platt_c_bound` is not an upper bound at σ = 3, 5 or 7. For k = 0, small h and large t0 the ratio
  tends to π·2^{−(σ−1)/4}, so σ = 7 fails by 11% (rows 4–5); σ ≥ 9 holds there.
* The correction factor is ≤ 1 for σ ≥ 9 and t0 ≥ 3σ (at σ = 9, t0 = 27: 0.9696). The guard "σ ≥ 9 and t0 ≥ 2σ"
  is not implied by the factor at σ = 9 (1.2272 at t0 = 18), although the measured ratio there is 0.160.
* Pilot: σ_interp = 25 gives C_true ≤ 0.0492·C_FLINT; σ_grid = 1961 gives e^{−338}. Every pilot use (A.7, A.9, B.1 at
  σ_grid, the C.1 I-bound at σ_interp) is a valid upper bound.

### 2.3 Lemma A.4

sup_x |Γ(1/4+ix/2)|e^{πx/4}: for x ≤ 0 it is ≤ Γ(1/4) = 3.6256 (|Γ(a+iy)| ≤ Γ(a)); for x ≥ 2 Stirling with
|R_1(z)| ≤ sec²(arg z/2)/(12|z|) < 1/(6|z|) gives ≤ 2.961; on [0, 2] interval cells (`a4sup.py`, 20,000 cells) give
sup ∈ [3.91633, 3.91699], attained near x = 0.213. The constant 4 is valid (certified).

### 2.4 Lemma A.5: hypothesis GAP, satisfied

The majorisation of Σ_{l≥2} by ∫_1^∞ needs t^k e^{−t²/2h²} decreasing on [B/2, ∞), i.e. B ≥ 2h√k; the paper states
and `_platt_lemma_A5_constraint` checks B > h√k. The formula 8(πB)^k[e^{−B²/8h²} + 2^{(3k−1)/2}(h/B)^{k+1}
Γ((k+1)/2, B²/8h²)] re-derives. Pilot: 2h√(K−1) = 1489.4 ≤ 4096.

### 2.5 Lemma A.6: Γ-ratio step, proof for odd σ ≥ 5

For odd σ the reflection formula gives
R_σ(x) := |Γ((−σ+ix)/2)|/|Γ((σ+ix)/2)| = 2π/(cosh(πx/2)·√(σ²+x²)·|Γ((σ+ix)/2)|²).
With |Γ(a+ib)|² = Γ(a)²Π_{n≥0}(1 + b²/(n+a)²)^{−1} and cosh(πx/2) = Π_{n≥0}(1 + x²/(2n+1)²),
cosh(πx/2)|Γ((σ+ix)/2)|²/Γ(σ/2)² = Π_{n≥0}(1 + x²/(2n+1)²)/(1 + x²/(2n+σ)²), each factor ≥ 1 and increasing in |x|
for σ ≥ 1. So sup_x R_σ(x) = R_σ(0) = 2π/(σΓ(σ/2)²): 8/3 (σ = 3), 32/45 = 0.711 (σ = 5), 128/1575 = 0.081 (σ = 7),
decreasing in σ. The step "|Γ(−σ/2+iy)| < |Γ(σ/2+iy)| for all y" is **proved** for every odd σ ≥ 5 and false for
σ = 3. FLINT accepts σ = 3 (`c_precomp` requires odd σ ≥ 3), so a guard σ_grid ≥ 5 is needed in general.

### 2.6 Lemmas A.7–A.11, B.1, B.2 (re-derived; match the code)

* A.7: two tails, |m/B + lA| ≥ (2|l|−1)A/2 for m ∈ [0, N/2]; Σ_{n≥1}e^{−cπA(2n−1)/2} ≤ e^{−cπA/2}(1 + 1/(cπA)).
* A.8/A.9: right shift to Re s = σ with |ζ(s)| ≤ ζ(σ), pole term 2π^{5/4}e^{1/8h²−t0²/2h²−π|x|}; A.9 applied to all N
  entries is valid by F(−x) = conj F(x).
* A.10/A.11: (t+t0)^{1/6}log(t+t0) ≤ (t+t0)^β for t ≥ 0, t0 > e^e; 4 × 0.618 ≤ 3 with [HPY22]; tail split at t0;
  hypotheses βh²/t0 ≤ B/2 ≤ t0, t0 > e^e are checked in code.
* B.1: Σ_{j>J}j^{−σ} ≤ J^{1−σ}/(σ−1) after the right shift. B.2: sup|G^{(K)}|ξ^K/K! with ∫|g(t;K)| ≤ 8∫_0^∞(2πt)^K
  e^{−t²/2h²}dt, times Σ_{j≤J}j^{−1/2} ≤ 2√J − 1. S-bins: δ_j = log(j√π)/2π − m/B ∈ [−1/2B, 1/2B) with exact
  `arb_get_unique_fmpz` boundaries; the threaded S-table splits j-ranges and adds the shared boundary bins
  (`startvec`/`stopvec`), so it computes the same table.

### 2.7 Step (5) wrap-around: GAP, closed by the patch

Index map (traced in `do_convolutions`): after the length-2N zero padding and the reversal S′(r) = S(−r mod 2N),
out(i) = Σ_{m=0}^{N−1−i} S_k(m)·T_k(i+m) for i ∈ [0, N/2], i.e. G^{(k)}(x + u_m) is read from table index q = i + m.
With S_k(m) = 0 for m ∉ [373, 9656], q runs up to N/2 + m_J = 26040 < N.

* Table entry q encloses G̃^{(k)}(q) = Σ_l G^{(k)}(q/B + lA). A.7 bounds the aliases only for q ≤ N/2. For
  q ∈ (N/2, N/2 + m_J] the entry contains G^{(k)}(q/B − A) with q/B − A ∈ (−3.99976, −1.642578]; no lemma bounds it.
* Printed A.6 cannot close it: its bound at |u| = 1.6426, σ = 1961, k = 40 is
  C_FLINT·e^{(2σ+1)²/8h² − (2σ−1)π|u|} = e^{29147.9 + 138.8 − 20233.6} = e^{9053}.
* Silent-truncation hazard: if m_J ≥ N/2, terms with i + m ≥ N are dropped with no error term. Guard m_J < N/2
  (pilot 9656 < 16384).

The patch (`flint_audit/platt_multieval_wrapfix.patch`) applies cleanly to a pristine copy, adds exactly 18 lines
under `#ifdef WRAP_FIX`, and sets table entries q ∈ [N/2+1, N−1] to 0 ± A7_k/k! after the k! division. Proof of
validity: the convolution needs G^{(k)}(q/B)/k! with q/B > A/2; the right-shift part of A.6 (no Γ-ratio step) gives
|G^{(k)}(u)| ≤ C·e^{(2σ−1)²/8h² − (2σ−1)πu} for u ≥ 0, which for u ≥ A/2 is below the A.7 bound (C at σ_grid is valid
by §2.2). q = N/2 is covered by A.7 itself. The threaded path calls the same function. **Proved.**

Measured (`make_probe.py`, `meprobe.c`, `grid_compare.py`, grid T = 7800000001583, prec 128):

| row k | max \|entry\|, q ≤ N/2 | max radius, q ≤ N/2 | max \|entry\|, q > N/2 | max radius, q > N/2 |
|---|---|---|---|---|
| 0 | 0.5264 | 2.164e−25 | 3.062e−25 | 2.164e−25 |
| 20 | 3.407e47 | 1.286e23 | 1.819e23 | 1.286e23 |
| 40 | 1.194e90 | 4.518e65 | 6.392e65 | 4.518e65 |

The unpatched wrapped entries are rounding noise (|entry| ≤ 1.42 × radius); the gap is a rigor gap with no
numerical effect. Patched vs unpatched grid values on |t − T| ≤ 900: 14,400/14,400 balls overlap, and every patched
radius is ≤ 0.579 of the unpatched one. Patched radius profile: 2.6e−18 at t = T (value 6.0e−3), 3.6e−12 at
|t−T| = 600, 3.2e−5 at 900, 2.6e−2 at 1000 (unusable).

A lemma A.6′ that keeps the true size of |Γ((−σ+ix)/2)| (reflection formula plus a Stirling lower bound for
|Γ((σ+ix)/2)|, |R_1| < 1/(6|z|)) gives |G^{(k)}(u)| ≲ t0^{−(σ+1)/2}e^{(2σ+1)²/8h² − (2σ+1)π|u|}(…) for u < 0, far
below the entry radii; this would make unpatched runs rigorous. Sketch only; not needed for the window (§4).

### 2.8 Interpolation (Appendix C)

`_interpolation_helper_raw` evaluates Σ_n W(T+n/A)·sinc(n − A(t0−T)) over the 2N_s nearest nodes, with
W = F·e^{−(t−t0)²/2H²}; omitted terms have |n − A(t0−T)| ≥ N_s. C.3: |sinc| ≤ 1/(πN_s) on the tail and
Σ_{d>N_s}φ(d) ≤ φ(N_s) + ∫_{N_s}^∞φ give (6/(πN_s))(X+Y+Z) — FLINT's form; the printed 6A/(πN_s) is a factor A
looser. C.1 = A.8 with H, integrated over [A/2, ∞), times 4 (Brown's 2∫_{|x|>B}|F| for real f). Ball arguments
(Gram points) are handled by evaluating every term and both bounds on the ball and unioning uncertain support sets.

### 2.9 Gram points

`gram_point_initial` (θ(t) = (t/2)log(t/2π) − t/2 − π/8 + ε, |ε| ≤ 1/8t, f′ = 1/(1+W) < 1/2) then interval Newton
with |θ″| ≤ 1/x and an inclusion check; inclusion of the Newton image proves a root in the ball. SOUND.

## 3. Turing stage

### 3.1 `acb_dirichlet_turing_method_bound`

Returns ⌈min(0.0061L² + 0.08L, 0.0031L² + 0.11L)⌉ with L an upper bound of log g_p (`arb_get_mag`, `mag_log` upper,
`mag_get_fmpz` = ARF_RND_UP = ceiling). Exact constants: Lehman (a, b) = (1.7, 0.114) gives (b/6π, (a − b log 2π)/6π)
= (0.0060479, 0.0790725), both rounded up in [Bre79]; [Tru11] Th 2.2 (2.067, 0.059) gives (0.0031300, 0.1039051), and
Cor 2.3's (0.0031, 0.11) dominates the exact form only for L ≤ 202.84. At 7.8e12: L = 29.6851, Cor 2.3 = 5.99711,
Brent = 7.75018, b = 6; b becomes 7 at g ≈ 7.877e12. [Tru11] Th 2.2 uses θ = 1/4, K = 2.53 (Lehman's Riemann–Siegel
bound), not a subconvex bound, so the [HPY22] Kusmin–Landau correction does not touch it.

### 3.2 Anchor logic as coded

An anchor is the b-th good Gram node of a run of ≥ 2b consecutive good Gram blocks (Rosser's rule tested as
"sign changes ≥ Gram intervals"). The upper side uses exactly b blocks after the anchor with b computed at their far
end; the lower side uses ≥ b blocks before it; labels start at N = gram + 1 and only matching indices are returned.
This is a faithful application of [Bre79] Th 3.2 / [Tru11] Cor 2.3 on both sides. The validity of the anchors is
therefore exactly the validity of that criterion.

### 3.3 The Gram-block criterion does not follow from the integral bound (new finding)

Sawtooth bound (proved). Let g_n be good with N(g_n) ≥ n + 2. Parity (sign Z(t) = (−1)^{N(t)−1}, from
N = θ/π + 1 + S and πS = arg ζ) forces N(g_n) ≥ n + 3, so S(g_a) ≥ 2 at every block start a. In a Rosser block of
length k (good–bad…bad–good) the sign pattern forces one zero in each of the k − 2 interior Gram intervals and an even
number in the first and last; placing every zero as late as allowed and using θ convex gives
∫_block S ≥ (1 + k/2)·Δ_min. Hence ∫_{g_n}^{g_p} S ≥ (K + (p−n)/2)Δ_min. Since S(t) ≥ S(g_p) − (θ(t) − θ(g_p))/π for
t ≥ g_p, ∫_{g_p}^{g_{p+2}} S ≥ 2Δ_min. So the block-only criterion that follows from |∫S| ≤ a + b log t2 is

  (K + (p−n)/2 + 2)·Δ_min > a + b log g_{p+2}   ⇒   N(g_n) ≤ n + 1,

and its mirror (blocks before g_p, interval [g_{n−2}, g_p]) for N(g_p) ≥ p + 1 (there θ convex is used through the
tangent instead of the chord, which changes the spacing factor by a relative ~1e−14 at this height). At 7.8e12,
(a + b log g)/Δ = 3.81842/0.225630 = 16.92, so K + (p−n)/2 ≥ 15 is needed: at least 10 unit blocks per side.

Explicit configuration (`block_criterion.py`, mpmath 40 digits, exact Gram points): background zeros at Gram-interval
midpoints (S has mean 0), three zeros in [g_{n−1}, g_n) (S rises by 2), K unit Rosser blocks after g_n with each zero
just before the next Gram point, two zero-free Gram intervals, background again. Then g_n, …, g_p are good, every block
satisfies Rosser's rule, and N(g_n) = n + 3.

| height | integral bound used | K unit blocks | criterion requires | max_{t1<t2} ∫S | max(−∫S) | bound a + b log t |
|---|---|---|---|---|---|---|
| 7.8e12 | [Tru11] Th 2.2 (2.067, 0.059) | 6 | 6 (Cor 2.3, FLINT) | 2.5101 | 0.0282 | 3.8184 |
| 7.8e12 | same | 9 | — | 3.5255 | 0.0282 | 3.8184 |
| 7.8e12 | same | 10 | — | **3.8639** (excluded) | 0.0282 | 3.8184 |
| 1e10 | Lehman/[Bre79] Th 3.1 (1.71, 0.114) | 6 | 6 ([Bre79] (3.2)) | 3.2991 | 0.0371 | 4.3350 |
| 3.26e7 | same | 4 | 4 (used in [Bre79] §4) | 3.3018 | 0.0508 | 3.6821 |

For K ≤ 9 at 7.8e12 the configuration satisfies |∫_{t1}^{t2} S| ≤ 2.067 + 0.059 log t2 on every subinterval while
N(g_n) = n + 3. So [Tru11] Cor 2.3 (and [Bre79] Th 3.2 at 1e10) cannot be derived from the integral bound by any
argument that uses only Rosser-block data and parity. [Bre79] p. 1365 derives Th 3.2 from Lehman's Theorem 4 with the
hypothesis K + (p−n)/2 > 0.152y + 0.0091y², y = log(g_p/2π), i.e. (A log g_p + B)y/(4π); the sawtooth argument
gives (A log g_p + B)y/(2π) (before the +2 term). The configuration satisfies that hypothesis at 1e10 (9 > 7.31) and
violates the conclusion. Lehman (1970) was not available, so the step where the factor 2 enters is not located.
**Status: GAP in the published criterion (strong evidence of an error by a factor ≈ 2 in the block count), not
refereed.** Consequence: FLINT's anchors at 7.8e12 (6 blocks per side) are not certified by the code's own logic.
Platt (2017) §4.1 uses the integral form directly (I_comp vs I_max) and is not affected by this item.

### 3.4 Direct-integral certification at the window ends (no block criterion)

Method (`direct_turing.py`). For a point T with certified sign of Z and dumped isolating intervals [a_i, b_i]:
(i) if N(T) ≥ c + 2, then N(t) ≥ c + 2 + #{i > c : b_i ≤ t} on [T, T+H]; (ii) if N(T) ≤ c − 2, then
N(t) ≤ c − 2 − #{i ≤ c : a_i > t} on [T−H, T]; ∫θ is enclosed by the midpoint/trapezoid sums (θ convex,
θ″ = −Im ψ′(1/4+it/2)/4 > 0), θ from Arb `lgamma`; [Tru11] Th 2.2 refutes (i) and (ii) when the margins below are
positive; parity from the Riemann–Siegel sign of Z(T) then gives N(T) = c. "No parity" tests c ± 1 instead.

| T | claimed N(T) | sign Z(T) (RS) | H = 5: margins | H = 10: margins | H = 10, no parity |
|---|---|---|---|---|---|
| T1 = 7800000001111.4228515625 (b of …939369; x_L/2 − T1 = 0.1943) | 33,328,427,939,369 | +1 (2.1315) | 3.511 / 3.558 | 11.252 / 11.363 | 1.252 / 1.363 |
| T2 = 7800000004737.7519531250 (b of …955440; T2 − x_R/2 = 0.0320) | 33,328,427,955,440 | −1 (−76.83) | 3.031 / 3.569 | 11.171 / 11.719 | 1.171 / 1.719 |
| 7800000000999.7363281250 (below original first zero …874) | 33,328,427,938,873 | +1 | — | 12.556 / 11.717 | 2.556 / 1.717 |
| 7800000005888.0146484375 (above original last zero …538) | 33,328,427,960,538 | −1 | — | 12.318 / 12.562 | 2.318 / 2.562 |
| PT hand-off 3000175332800 | 12,363,153,437,138 | −1 (−2.572) | — | 12.375 / 11.909 | 2.375 / 1.909 |

(margins: refute N ≥ c+2 / refute N ≤ c−2; the data for the first four rows are V1 and V3 of §4, identical results;
the hand-off row uses a separate patched chunk, T = 3000175333020.)

## 4. Rerun of the 7.8e12 window with different chunking

Driver `chain2.c` (FLINT heuristic parameters, at most MAXZ zeros per chunk, next grid centre BACK above the last
zero, every interval dumped as exact dyadic endpoints). Original pilot: 3 chunks, centres 7800000001780 / …3410 /
…5036, indices …38874–…60538.

| run | code | threads | prec | MAXZ / BACK | chunks (centres) | indices | CPU |
|---|---|---|---|---|---|---|---|
| V1 | patched | 1 | 128 | 2500 / 520 | 10 (7800000001020 … 7800000006096) | 33,328,427,936,658 – …61,657 (25,000) | 165.3 s |
| V2 | unpatched | 1 | 128 | 2500 / 520 | same as V1 | same as V1 | 160.8 s |
| V3 | patched | 4 | 160 | 4000 / 650 | 7 (7800000001150 … 7800000006564) | 33,328,427,936,658 – …64,657 (28,000) | 172.3 s |

* Every run: consecutive indices, every interval proper, monotone and disjoint across all seams (V1: 19,726 shared
  endpoints), all chunks OK at the first attempt.
* For every common index the V1/V2/V3 intervals intersect (0 disagreements in 25,000 × 3 pairs); 18,482 of 25,000
  V1/V2 intervals are bit-identical (only intercalated split points move).
* The original indices …38874–…60538 (21,665 zeros) are all present; the V1 intervals of …38874 and …60538 contain
  γ = 7800000000999.91541557 and 7800000005887.92044395 from `lemma-B-two-band.md`; the original glue points
  (Gram points 7800000002630.36594 and 7800000004256.25734) separate …46100|…46101 and …53306|…53307.
* Cover: V1 spans [7800000000499.8216, 7800000006140.4954] ⊃ [x_L/2, x_R/2] = [7800000001111.6172, 7800000004737.72].
* Riemann–Siegel re-check (`zsign.c`, `rs_check.py`): `acb_dirichlet_hardy_z` (FLINT's `zeta_rs`, error bound of
  Arias de Reyna 2011 Thm 4.2; disjoint from the Platt grid and the audited lemmas) at 26,394 distinct endpoints
  (19,506 for the intervals …939370–…955440 and T1, then 6,888 more): every sign determined; all 21,785 intervals
  …38814–…60598 (the original range …38874–…60538 plus 60 zeros on each side, which covers the H = 10 integrals of
  §3.4) show a sign change, and sign Z(b_i) = (−1)^{i−1} for every one. Hand-off neighbourhood ±20: 170/170 confirmed.
  About 0.15 s per point, 4 workers.
* Count. Z(x_L/2) = +72.80 and Z(x_R/2) = −70.64 (RS). Interval …939369 ⊂ (T1 − 0.12, T1], …939370 starts at
  7800000001111.648 > x_L/2, and the zero of …955440 lies in (7800000004737.526, x_R/2). With §3.4:
  **the window [x_L/2, x_R/2] contains exactly 16,071 zeros, indices 33,328,427,939,370 … 33,328,427,955,440, each
  simple and on the critical line**, and the original range (7800000000999.7363281250, 7800000005888.0146484375]
  contains exactly the 21,665 zeros …38874–…60538, each simple and on the line (both statements by Route 2, §5).

## 5. What (RH-win) rests on after this audit

Route 1 (as coded in the pilot): FLINT's Platt grid with the patched step (5) and the corrected reading of A.3 at
σ = 25, 1961 + the Gram-block criterion. The last item is the GAP of §3.3.

Route 2 (this audit, §3.4 + §4): Riemann–Siegel signs from `acb_dirichlet_hardy_z` at every interval endpoint and at
T1, T2, x_L/2, x_R/2 + [Tru11] Th 2.2 in direct-integral form + parity + Arb's `lgamma` for θ. The Platt pipeline is
used only to propose the points. Route 2 does not use the Platt lemmas, the wrap patch, Lemma A.3, or the block
criterion. Its trust base: Arb ball arithmetic, FLINT's Riemann–Siegel implementation and Arias de Reyna's bound (not
audited here), [Tru11] Th 2.2 (published, its constants re-derived in [Tru11] §2.3 from θ = 1/4, K = 2.53).

## 6. Grades

* **Proved (here, single reader):** A.3 is a factor π low in both terms, and C_true ≤ π((1+σ²/t0²)/2)^{(σ−1)/4}C_FLINT;
  the A.6 Γ-ratio bound for all odd σ ≥ 5 and all y; A.5 needs B ≥ 2h√k; C.3 holds with 6/(πN_s); the wrap gap and the
  validity of the 18-line patch; the sawtooth block criterion (K + (p−n)/2 + 2)Δ_min > a + b log g_{p+2} and its
  mirror; that the configuration of §3.3 satisfies the integral bound with N(g_n) = n + 3 (explicit, checked to 40
  digits).
* **Certified:** A.3 counterexamples at σ = 3, 5, 7 and validity at σ = 25, 1961 (Arb enclosures); A.4 sup ≤ 3.91699;
  the 7.8e12 window via Route 2 (exactly 16,071 zeros in [x_L/2, x_R/2]; exactly 21,665 zeros …38874–…60538 between
  7800000000999.7363281250 and 7800000005888.0146484375; all simple, on the line); N(3000175332800) =
  12,363,153,437,138 via Route 2 (RS signs on ±20, direct integral, matches [PT21]).
* **Conditional:** Route 1 for any window, on the Gram-block criterion (GAP §3.3); unpatched pilot windows, also on
  A.6′ (sketch); Route 2, on FLINT's `zeta_rs` (unaudited); every Λ value, on the items listed in
  `r2-second-referee-2026-10-02` (unchanged by this audit except the FLINT premise, which now has Route 2 for the
  7.8e12 window).
* **Measured:** reruns V1–V3 (indices, agreement, CPU), wrapped-entry sizes, patched/unpatched radius ratios, RS
  timings.
* **Heuristic:** that real zeta data never exhibit the adversarial configuration of §3.3 (it is excluded here for the
  window by direct computation, not by this heuristic); the A.6′ order of magnitude.

## 7. Comparison with FLINT_AUDIT.md (read after §1–§6)

Agree (independently re-derived): A.3 ERROR with the same correction factor (the two published counterexamples
reproduce: 1.973, 1.220); A.5 hypothesis GAP; A.6 failure at σ = 3; [HPY22] replacing [PT15]; C.3 tighter form
correct; step-(5) wrap GAP, the u-range (−4, −1.64], the failure of printed A.6 on it, the 18-line patch and its
validity; the m_J < N/2 guard; A.7–A.11, B.1, B.2, C.1, Gram points, gluing lemma SOUND; the "≥ zn" robustness note;
the parameter table at 7.8e12; window endpoints as Gram points with N(g) = n + 1.

Differences:
1. **Turing block criterion.** FLINT_AUDIT §3.1 grades `turing_method_bound` SOUND by checking its arithmetic against
   [Tru11] Cor 2.3 and [Bre79] Th 3.2. This audit agrees on the arithmetic but finds the criterion itself unsupported
   (§3.3): with 6 blocks per side the anchors are not implied by the integral bound. The first audit's "Proved: the
   Turing anchor argument given [Bre79] Th 3.2 and [Tru11] Th 2.2" does not hold, because Cor 2.3 does not follow from
   Th 2.2. Its certified window and hand-off claims are re-established here by Route 2 instead.
2. **A.6.** FLINT_AUDIT §2.4: numerical for σ ≥ 5 on y ∈ [0, 40], "needs a proof for all y". Here: proved for all y.
3. **A.3 at σ = 7 and the guard.** FLINT_AUDIT's table has σ = 7 at 0.957 (t0 = 1000, h = 5); certified enclosures
   here show σ = 7 failing by 11% at small h and large t0. Its guard "σ ≥ 9 and t0 ≥ 2σ" is not implied by the
   correction factor at σ = 9; σ ≥ 9 and t0 ≥ 3σ is.
4. **Cor 2.3 range.** L ≤ 202.84 with exact constants (FLINT_AUDIT: 203; `r2-flint-audit` assertion: 203.3 from
   constants rounded to 4 digits). Immaterial at L = 29.7.
5. **Wrap size.** FLINT_AUDIT: heuristic e^{−10^6}. Here: measured that the unpatched wrapped entries are rounding
   noise at the 1.4 × radius level and that the patch lowers grid radii to ≤ 0.58 of the unpatched values.
6. **Window basis and count.** FLINT_AUDIT certifies the 21,665-zero range on the patched lemmas + block criterion.
   Here the same range, and the exact count 16,071 inside [x_L/2, x_R/2], are certified by Route 2, which uses neither.
7. Not re-checked here: FLINT_AUDIT's chunk-0 count (7227 unpatched vs 7247 patched with uncapped chunks), the 1.65X
   window rerun, and `bounds.c` magnitudes at 3e12 and 5.1e12.

## 8. Required before any campaign spend (updates FLINT_AUDIT §6)

1. Wrap fix (or a written A.6′); assert m_J < N/2 per grid.
2. `platt_c_bound` × π, or assert σ ≥ 9 and t0 ≥ 3σ for σ_grid and σ_interp.
3. Assert B ≥ 2h√(K−1) and σ_grid ≥ 5; assert sign changes == Gram intervals before labelling.
4. Cite [HPY22] for A.10/A.11/C.2.
5. **New:** do not rely on `turing_method_bound` alone. Either require (K + (p−n)/2 + 2)Δ_min > a + b log g on each
   side of an anchor (about 10 unit blocks per side at 7.8e12), or run the direct-integral check of §3.4 at every job
   boundary on the job's own intervals (cost: one θ quadrature and one RS sign per boundary). Recheck the pilot's other
   anchored claims the same way.
6. **New:** obtain Lehman (1970) Theorem 4 and locate the factor 2 against [Bre79] (3.5) before any upstream report
   (FLINT, [Tru11], [Bre79] users). Nothing was sent.
7. Independent referee of §3.3 (the configuration is checkable in minutes with `block_criterion.py`).

## 9. Reproduce

Scripts: `flint_audit_2/` (this directory). Run outputs: `tmp/flint-audit-2/` (logs, gzip'd exact intervals, RS signs,
`SHA256SUMS`). The scripts were run from `/tmp/flintaudit2/{build,lemmas,turing,runs}`; python-flint 0.9.0 is in
`/tmp/flintvenv`, mpmath in `/tmp/rhvenv`.

```sh
# patched/unpatched drivers (copy the three platt_*.c units + acb_dirichlet/impl.h from the 3.6.0 tarball, apply the patch to platt_multieval_fix.c)
./build.sh
./chain2_fix  7800000000500 7800000006100 33328427936658 1 128 2500 520 V1_fix_t1_p128_m2500_b520
./chain2_orig 7800000000500 7800000006100 33328427936658 1 128 2500 520 V2_orig_t1_p128_m2500_b520
./chain2_fix  7800000000500 7800000006100 33328427936658 4 160 4000 650 V3_fix_t4_p160_m4000_b650
python check_runs.py                                  # agreement, cover, window indices
python direct_turing.py V1_fix_t1_p128_m2500_b520     # §3.4 (needs ./zsign)
python rs_check.py                                    # §4 RS confirmation (zs_*.out, zsB_*.out from ./zsign 128 < pts*_*.txt)
python ctrue2.py ; python a4sup.py                    # §2.2, §2.3 (needs ./cb2)
python block_criterion.py                             # §3.1 constants, §3.3 configuration
```

PT Lambda <= 0.2 stands. RH open. NO QED.

## Referee corrections (r3 synthesis, 2026-10-03)

One adversarial internal referee pass (independent code, unpatched public entry point, prec 192, own Turing code; tmp/r3-ref-flint2-*). Not refuted, minor.

1. Turing points. The decimals 7800000001111.4228515625, 7800000004737.7519531250, 7800000000999.7363281250 and 7800000005888.0146484375 are 2^-10 renderings; the tests ran at 128–131-bit dyadic interval endpoints (e.g. b_939369). The N values also hold at the quoted decimals (referee RS signs: Z = +1.9707 and −76.795 at T1, T2). x_L/2 − T1 = 0.1939 at the certified dyadic.
2. Re-derivation scope. The referee re-derived Lemma 3.2 residue, A.5, A.7, B.1, B.2, C.1, C.3 and the Gram-point logic, not A.8, A.9, A.11 or the S-table binning. Those stay single-reader. Route 2 uses none of them.
3. Scope of §3.3. The Gram-block gap also defeats Brent 1979's own final step (4 blocks over 5 Gram intervals at 3.26e7: max ∫S = 3.4542 < 3.6821), so the error is in Brent Thm 3.2 itself. The sawtooth bound is attained exactly with extra zeros at the right ends of Gram intervals (K = 6: 2.4819 = 11Δ; K = 10: 3.8357 > 3.8184): at least 10 unit blocks per side are needed and suffice. [PT21] uses Platt 2017's direct-integral form (§4.1); its exposure to the gap is probably nil but NOT verified.
4. A.3 symmetrisation: G_p(x) = |Γ((s+ix)/2)|e^{πx/4} is increasing because Im ψ(a+ib) decreases in a for b > 0 and equals (π/2)tanh(πb) at a = 1/2.
5. Tight A.3 ratios (Arb adaptive integration): 1.973434, 1.220016, 1.149727, 1.110695, 1.110720, 0.754671, 0.159960, 0.047607, 0.049087; log ratios −338.4974 (σ = 1961, k = 0), −352.2830 (k = 40).
6. Ledger wording for the 7.8e12 premise: certified by Route 2 (RS signs at every interval endpoint + Trudgian 2011 Thm 2.2 + parity), independently reproduced by a referee rerun; Platt lemmas and Gram-block criterion not used; FLINT zeta_rs unaudited; PT21 exposure to the Gram-block gap not determined.
