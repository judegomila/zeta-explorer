# Native Triangle binding for general real-weight mollifiers

**Scope.** Finite lane of the project's Λ ≤ 0.1758354 computer-assisted candidate
(t0 = 1583/10000, y0² = 87677/2500000), legs A1 (N = 690988..1000000) and
A2 (N = 1000001..1300000). These legs use the 287-entry LP-optimized mollifier
`src/mollifier_p17_t0_15830.txt` (sha256 `a05f16ef…8a5c`) through the producer
`src/lemma_sweep_genmoll.c` (sha256 `561d59bf…4677`) in `mtype 7`, compiled with
`-DTRIANGLE_WEIGHT`. Leg D (N = 1300001..6000000) uses the Euler mollifier over
{2,3} (`mtype 3`) and is covered by the sealed `NATIVE_BINDING.md`. That note is
written against the sealed producer `src/lemma_sweep_p235711.c` (sha256
`580d0b51…`, `~/dbn-lambda-sweep-clean/`), while leg D ran `lemma_sweep_genmoll.c`.
`diff` of the two files shows exactly three changes: `MAXD` 32 → 600, the `mtype`
range check 1..6 → 1..7, and the added `mtype 7` loader branch. The `mtype 3` path
is byte-identical, so the sealed correspondence carries over to leg D.

**Grade.** Prose proof plus fail-closed exact/interval checks (below). Not
refereed, not in Lean. It closes the item "general-real-weight native binding
not written" listed in the 2026-09-28 composition audit
(`src/data/dag3-audit01758-2026-09-28.js`). It does not change any number. The
candidate stays computer-assisted, unreviewed and unpublished; Platt–Trudgian
Λ ≤ 0.2 is the accepted benchmark. No QED.

Package paths below are relative to `~/dbn-lambda-01758354-candidate/`; sealed
base paths are relative to `~/dbn-lambda-sweep-clean/` (identical copy in
`~/dbn-lambda-audit-review/`).

---

## 0. What the existing argument uses

The sealed `NATIVE_BINDING.md` proves: if the producer's stored Triangle value
L_N is positive, then |f_t(x+iy)| ≥ L_N throughout window N, in the normalized
additive-error units of Polymath15 Theorem 1.3 (arXiv:1904.12438v2). It is
written for the Euler mollifier E(s) = Π_{p∈P}(1 − b_t(p)p^{−s}) = Σ_{d|D} λ_d d^{−s}.

Reading the proof line by line, the Euler product structure is never used.
The properties of the weights that the proof actually consumes are:

| step in `NATIVE_BINDING.md` | property of (λ_d) used |
|---|---|
| exact convolution E·A = Σ B_{N,n} n^{−s*} | finite support in positive integers |
| conjugate convolution conj(E)·C_0 = Σ conj(A_{N,n}) n^{−conj(s*)} | nothing (b_m and (n/d)^y are real; only \|A_{N,n}\| is used later) |
| "B_{N,1} = A_{N,1} = 1" (the literal 1 in 1 − g_N) | 1 in the support and λ_1 = 1 |
| mollifier bound \|E\| ≤ M_N = Σ\|λ_d\| d^{−σ_N} | finite support (triangle inequality) |
| M_N > 0 | some λ_d ≠ 0 (implied by λ_1 = 1) |
| E ≠ 0 at s* | derived from Q_N > 0; no property of λ needed |
| κ-correction C_N, window freeze, error units | independent of the mollifier |

Multiplicativity, the sign pattern λ_d = Π_{p|d}(−b_t(p)), the t-dependence of
the Euler weights, and the choice D = Π p are not used. The general statement
below therefore holds under (H2)–(H3). (H1), real weights, is automatic for the
producer (it stores rational weights as real Arb balls) and is stated only for
convenience; the lemma does not need it (Section 3, corrected after referee
review 2026-09-28). Section 3 shows (H3) cannot be dropped. Section 4 lists the extra conditions (C1)–(C6) that the
`mtype 7` producer's table loader needs so that it computes the quantity the
lemma is about. Section 5 checks all of them on the actual file.

---

## 1. Setting

Fix a window N, a real t in the certified t-box (for the 0.1758354 lane this is
the single point t = 15830/100000), a height y ∈ (0,1], and x with
x_N ≤ x < x_{N+1}, x_N = 4π(N² − t/16). Polymath15 Theorem 1.3 writes

  H_t(x+iy)/B_t(x+iy) = f_t(x+iy) + O_≤(e_A + e_B + e_{C,0}),
  f_t = A + γ C_κ,
  A = Σ_{m=1}^{N} b_m m^{−s*},  C_κ = Σ_{m=1}^{N} m^y b_m m^{−conj(s*) − κ},

with b_m = b_m^t = exp((t/4) ln² m) > 0, b_1 = 1. The frozen window constants
(inherited `WINDOW_FREEZE_THEOREM.md`; independent of the mollifier) give, for
every x in the window,

  |γ| ≤ g_N,  Re s* ≥ σ_N,  |κ| ≤ k_N,

with g_N, σ_N, k_N the producer's `modgamma`, `sigma`, `modK` at x_N.

**Mollifier.** Let S be a finite set of positive integers and (λ_d)_{d∈S} weights with

- **(H1)** λ_d ∈ ℝ for every d ∈ S (convenience only; see Step 2 and Section 3);
- **(H2)** S ⊂ ℤ_{≥1}, |S| < ∞;
- **(H3)** 1 ∈ S and λ_1 = 1.

Put E(s) = Σ_{d∈S} λ_d d^{−s}, D_max = max S, and for n ≥ 1

  B_{N,n} = Σ_{d∈S, d|n, n/d ≤ N} λ_d b_{n/d},
  A_{N,n} = Σ_{d∈S, d|n, n/d ≤ N} λ_d b_{n/d} (n/d)^y.

Both vanish for n > D_max N. Define

  M_N = Σ_{d∈S} |λ_d| d^{−σ_N},
  C_N = Σ_{m=2}^{N} b_m (m^{k_N} − 1) m^{y − σ_N},
  Q_N = 1 − g_N − Σ_{n=2}^{D_max N} (|B_{N,n}| + g_N |A_{N,n}|) n^{−σ_N},
  L_N = Q_N / M_N − g_N C_N.

## 2. Lemma and proof

**Lemma (native Triangle binding, general weights).** Under (H2)–(H3) (with or
without (H1)),
if L_N > 0 then |f_t(x+iy)| ≥ L_N for every x in window N.

*Proof.*

**Step 1 (n = 1 coefficients).** The only positive integer dividing 1 is 1, and
1 ∈ S by (H3). So B_{N,1} = λ_1 b_1 = 1 and A_{N,1} = λ_1 b_1 · 1^y = 1.

**Step 2 (exact convolutions).** Every term of E(s*)·A(s*) is
λ_d b_m (dm)^{−s*} with d ∈ S, 1 ≤ m ≤ N. Grouping by n = dm (a finite
rearrangement, by (H2)) gives

  E(s*) A = Σ_{n=1}^{D_max N} B_{N,n} n^{−s*}.

In general conj(E(s*)) = Σ_{d∈S} conj(λ_d) d^{−conj(s*)}. Grouping
conj(λ_d) d^{−conj(s*)} · m^y b_m m^{−conj(s*)} by n = dm in the same way, and using
that b_m and (n/d)^y are real, gives

  conj(E(s*)) C_0 = Σ_{n=1}^{D_max N} conj(A_{N,n}) n^{−conj(s*)}.

Under (H1) conj(A_{N,n}) = A_{N,n}. Step 3 uses only |conj(A_{N,n})| = |A_{N,n}|
and conj(A_{N,1}) = 1, so real weights are not needed.

**Step 3 (triangle bounds).** Using Step 1, |n^{−s}| = n^{−Re s} ≤ n^{−σ_N} for n ≥ 1,
and Re conj(s*) = Re s*:

  |E A| ≥ 1 − Σ_{n≥2} |B_{N,n}| n^{−σ_N},
  |conj(E) C_0| ≤ 1 + Σ_{n≥2} |A_{N,n}| n^{−σ_N}.

**Step 4 (κ-correction).** For complex κ and m ≥ 1,
|m^{−κ} − 1| = |e^{−κ ln m} − 1| ≤ e^{|κ| ln m} − 1 ≤ m^{k_N} − 1 (the power series
of e^z − 1 has nonnegative coefficients). The m = 1 term of C_κ − C_0 is 0, so

  |C_κ − C_0| ≤ Σ_{m=2}^{N} m^y b_m (m^{k_N} − 1) m^{−Re s*} ≤ C_N,

and |conj(E)| = |E| gives |conj(E)(C_κ − C_0)| ≤ |E| C_N.

**Step 5 (combine).** |E f_t| = |E A + γ E C_κ| and |E C_κ| = |conj(E) C_κ|, so

  |E| |f_t| ≥ |E A| − g_N |conj(E) C_0| − g_N |conj(E)(C_κ − C_0)|
       ≥ Q_N − g_N |E| C_N.

**Step 6 (division).** L_N > 0 with M_N > 0 (by (H3), M_N ≥ λ_1 · 1^{−σ_N} = 1)
and g_N C_N ≥ 0 gives Q_N > 0. If E(s*) = 0, Step 5 would read 0 ≥ Q_N > 0; so
E(s*) ≠ 0. Dividing Step 5 by |E| > 0:

  |f_t| ≥ Q_N/|E| − g_N C_N.

By (H2), |E(s*)| ≤ Σ |λ_d| d^{−Re s*} ≤ M_N, and Q_N > 0, so Q_N/|E| ≥ Q_N/M_N.
Hence |f_t| ≥ L_N. ∎

**Frozen-weight form.** The logged sweep value uses the sawtooth Triangle weight
W(n;N) = |B_{N,n}| + g(N_ref)|A_{N,n}|, N_ref = max(n/d_min, N_start), where d_min
is the smallest d ∈ S with d | n and n ≤ dN. Then n/d_min ≤ N and N_start ≤ N, so
N_ref ≤ N. g(·) is strictly decreasing for y > 0, so g(N_ref) ≥ g_N and
W(n;N) ≥ |B_{N,n}| + g_N|A_{N,n}|. Replacing the summand by W can only lower Q_N,
so lsaw_N ≤ L_N, and the logged L12 (floor of the lower Arb-ball endpoint of
lsaw_N) satisfies L12_N ≤ L_N. None of this depends on the weights beyond the
existence of d_min, which holds for every active n.

**Corollary.** For the 0.1758354 lane, legs A1/A2: every row with L12_N > 0
certifies |f_t| ≥ L12_N on window N at the logged (t, y). Because (H1)–(H3) and
Steps 1–6 are pointwise in y, the same lemma applies at every y at which the
y-transfer (`verify_ydini_genmoll.c`, Theorems A/B/C) certifies the Triangle
floor, with the same fixed weights.

## 3. Which hypotheses are necessary

- **(H1) real weights: not necessary (correction).** An earlier draft of this note
  said (H1) cannot be dropped. That is wrong. For complex λ_d the conjugate
  identity of Step 2 carries conj(A_{N,n}), and |conj(A_{N,n})| = |A_{N,n}|, so Q_N,
  M_N and the producer formula are unchanged and the Lemma holds for any complex
  weights with λ_1 = 1. Referee check (2026-09-28): adversarial minimization of
  |f_t| − L_N over 249 random complex-weight cases with L_N > 0 found no violation
  (smallest slack 1.8 × 10⁻⁴). This is not load-bearing: the actual weights are
  real rationals and the producer stores them as real Arb balls.
- **(H3) λ_1 = 1.** The producer's numerator is the literal `1 − modgamma − Ssum`.
  Take S = {1}, λ_1 = 1/2, N = 1: then f_t = 1 + γ with |γ| ≤ g, while the
  formula gives L = (1 − g)/(1/2) = 2(1 − g). For g = 0.2 this is 1.6 > 1.2 ≥ |f_t|.
  (Mathematically (H3) can be weakened to 1 ∈ S, |λ_1| ≥ 1: the numerator becomes
  |λ_1|(1 − g_N) − Σ ≥ 1 − g_N − Σ once g_N < 1, which Q_N > 0 forces. The actual
  file has λ_1 = 1 exactly, so this is not needed.)

## 4. Producer correspondence for `mtype 7`

Lemma quantities ↔ `src/lemma_sweep_genmoll.c`:

| lemma | producer |
|---|---|
| b_m | `bt_eval` (exp((t/4) ln² m)) |
| λ_d, ln d | `mtype 7` loader: `ms.moll[nd] = num/den` (outward-rounded ball containing the exact rational), `ms.lnd[nd] = log d` |
| B_{N,n}, A_{N,n} | `bA0` (same `ms->moll[i]` in both sums; truncation `n <= d*Ncut`) |
| W(n;N) | `Wcompute`, `#ifdef TRIANGLE_WEIGHT` branch |
| M_N | `modmoll` loop, Σ \|moll_i\| e^{−σ ln d_i} |
| g_N C_N | naive `corr` (mode n) or amortized `corr` with the [1, e^{k ln N}] bracket (mode t), inherited |
| Q_N/M_N − g_N C_N | `lbound = (1 - modgamma - Ssum)/modmoll - corr` |

The Euler branches (`mtype` 2–6) build their tables in code. `mtype 7` reads a
table from `MOLL_FILE` and does **not** validate it. The following conditions
are what the producer's enumeration and amortization need so that `Ssum`
encloses Σ_{n≥2} W(n;N) n^{−σ_N} over the full active set
{dm : d ∈ S, 1 ≤ m ≤ N}:

- **(C1) entry 0 is d = 1 with weight 1.** The activity filter for n > N is
  `for(int i=1;i<ms.nd;i++)` (three occurrences); it skips index 0 because
  d = 1 is never active for n > N. If entry 0 were some d_0 > 1, the n = d_0 m > N
  not divisible by any other active d would be dropped from `Ssum` (unsound).
  Entry 0 = (1, λ_1 = 1) is also (H3).
- **(C2) the last entry is max S.** `D = ms.dvec[ms.nd-1]` sets the enumeration
  bound n ≤ D·N and the Taylor-remainder log L = ln(D·N) (which needs ln n ≤ L for
  every active n). If the last entry were not the maximum, active terms would be
  missed and the remainder would be too small (unsound).
- **(C3) the d are distinct.** At the step N−1 → N the active set changes exactly
  at n = dN, d ∈ S. Divisor d is active for n at cutoff N iff n/d ≤ N, so its
  status changes between N−1 and N iff n/d = N. For any other d′ ∈ S with d′ | dN:
  if d′ < d then dN/d′ > N, so d′ is inactive at both cutoffs; if d′ > d then
  dN/d′ is an integer < N, hence ≤ N−1, so d′ is active at both cutoffs.
  The producer adds W(dN;N) − W(dN;N−1) once per table entry. A repeated d would
  add the same delta twice; deltas can be negative, so this is unsound.
- **(C4) arithmetic range.** d ≥ 1, entry count ≤ MAXD = 600, den ≠ 0, |num| and
  den fit in 64-bit signed integers, and D·N_end fits in 64-bit unsigned
  (`ulong n = dd*Np`, `D*N`).
- **(C5) no silently skipped lines.** The loader skips lines beginning with
  `#`, `\n`, `\r` and any line `sscanf` cannot read as three integers, and
  `fgets` uses a 256-byte buffer. If every other line parses strictly and is
  shorter than 255 bytes, the loaded table equals the file.
- **(C6) the same table in every gate.** Sweep legs A1/A2, the tail verifier and
  the y-transfer verifier must read the same file, so that the y-transfer
  anchor is the functional the sweep certified. The evidence for (C6) is stated
  in Section 5; it is **not** `run_all.sh` (see there).

(C1)–(C3) are automatic for the Euler branches (the table is built in code and
its last entry is the full product D), which is why `NATIVE_BINDING.md` did not
state them.

## 5. Verification on the actual weights

`formalization/paper/verify_native_binding_general_weights.py` (run with mpmath
1.4.1; 41/41 PASS, ~3 s, fail-closed exit code):

- **A (exact integers, Python `Fraction`).** sha256 of the file = `a05f16ef…8a5c`,
  and `tmp/moll_0.15830.txt` (the y-transfer default path) is byte-identical;
  all 287 non-comment lines match `^\s*int\s+int\s+int\s*$` strictly; max line
  length 71; 287 ≤ 600; all d ≥ 1; d strictly ascending (distinct), last entry
  D = 1000 = max S; entry 0 = (1, 1000000, 1000000), so λ_1 = 1 exactly; all
  den = 10⁶ > 0; no 64-bit overflow, 1000 · 1300000 < 2⁶⁴; weights are exact
  rationals. Σ|λ_d| = 1228013/15625 = 78.592832 exactly (information only).
  Support is 17-smooth (information only; not used).
- **B (source contract).** producer sha256 = `561d59bf…4677` (matches the package
  `SHA256SUMS`); the loader, `bA0`, TRIANGLE weight, `D = ms.dvec[ms.nd-1]`, the
  three `i=1` filters, the once-per-entry activation patch, L = ln(D·N), the
  `modmoll` loop, the final four operations, the identity override for
  `mtype 7`, and n ≥ 2 summation all present in the stated order.
- **C (80-digit consistency test, actual 287 weights; weak).** For N ∈ {2,3,5,8},
  σ ∈ {5,7} (large σ so that Q_N > 0 at small N; the lemma holds for any σ ≤ Re s*),
  t = 15830/10⁵, y = √(350708/10⁷), 12 random (s, γ, κ) each with complex γ, κ
  and |Im s| ≤ 10⁶: both convolution identities hold to 3.2 × 10⁻⁸⁰;
  |f_t| ≥ L_N ≥ L_saw and |E| ≤ M_N in all 96 cases (minimum slack 7.5 × 10⁻³);
  the λ_1 = 1/2 example of §3 violates the producer formula as predicted.
  Referee assessment: this section is a weak test. At σ ∈ {5,7} the n ≥ 2 terms
  are tiny (L ≈ 0.92–0.95, |f| ≈ 1); g_ref = 0.05 > g_bound = 0.04 makes
  L_saw ≤ L true by construction; it never runs the producer and does not test
  production σ (≈ 1.2–1.7), the N_ref rule or the activation-patch scheme.
- **D (producer versus independent computation; referee, 2026-09-28).** The
  producer was rebuilt from the pinned source with `-DTRIANGLE_WEIGHT` and run with
  `mtype 7` on the actual file; its stored L_N was compared with an independent
  mpmath computation of the Lemma's L_N and L_saw that reuses no producer code
  (`native-binding-refcheck/indep.py`, `saw.py`; outputs `cn.txt`, `ct.txt`,
  `py.txt`). Mode `n` at N = 50, 400, 2000: agreement to 4.6 × 10⁻²⁰. Mode `t` over
  N = 300..330 (N_start = 300, ≈ 30 activation steps across all 287 d): the
  independent L_saw lies inside the producer's Arb ball at every N, and
  L_saw ≤ L_N everywhere. This checks that the producer computes the Lemma's
  quantity with these weights, including the (C3) patch bookkeeping. (L is
  negative at these small N; that does not affect the comparison.) Complex-weight
  search: `native-binding-refcheck/cplx.py`.

**Evidence for (C6) (restated after referee review).** An earlier draft cited
`run_all.sh`. That argument is wrong: GATE 4 runs `"$BIN/ydini" 256` with no
mollifier argument, and the verifier opens `tmp/moll_0.15830.txt`, else
`moll_0.15830.txt`, relative to the caller's working directory; the symlinks the
script makes in `src/` and `bin/` are never read. Run from the package root, GATE 4
fails closed (file not found); run elsewhere, it reads whatever file is there if it
passes the loader's structural checks. The actual evidence is:

- **Sweeps A1/A2.** The binding-row replays
  `tmp/lambda01758/replay_{A1,A2,D}.log` (2026-09-28; `replay_binding_rows.sh`)
  record the command line (`MOLL_FILE=tmp/moll_0.15830.txt`, t = 15830/10⁵,
  y² = 350708/10⁷, `mtype` 7/7/3, 256 bit, K = 14, hw = 0.005, mode t), the producer
  sha256 `561d59bf…4677` and the mollifier sha256 `a05f16ef…8a5c`, and reproduce the
  lane logs' first three rows of each leg bit-for-bit (the gate
  `scripts/lambda-01758354-gate.mjs` checks this). A perturbation of y² by 10⁻⁷
  moves L12 by ≈ 10⁻⁶, and `mtype 2` gives UNCERT (referee), so the replay pins
  these parameters. The `MOLL general nd=287 D=1000` header alone is weak evidence.
- **Tail.** The parameter-locked verifier compiles the table in
  (`tmp/lambda01758/moll_p17_287.h`); the gate compares the header arrays with
  `tmp/moll_0.15830.txt` entry by entry.
- **y-transfer.** The run whose B is used (B_max, 2026-09-22) logged
  `mollifier: tmp/moll_0.15830.txt`; that file has sha256 `a05f16ef…8a5c` today and
  its mtime (Jul 31) predates both runs. The 2026-08-02 run logged a relative
  `moll_0.15830.txt`; its ndiv, λ_2 and λ_1000 match, but that is not
  hash-established. The gate uses max(B) over both runs, so the used B is covered
  by the hash-established run. The y-transfer loader fails closed on count ≠ 287,
  d_0 ≠ 1 or λ_1 ≠ 1, non-ascending d, d ∉ [1,1000], den ≤ 0 and non-17-smooth d.
- **Packaging fix (open).** `run_all.sh` GATE 4 should pass the path:
  `"$BIN/ydini" 256 "$MOLL"` (the verifier takes a non-numeric argument as the
  mollifier path). Not applied, because the package is sealed by `SHA256SUMS`.

## 6. Proved / checked / inherited

- **Proved (this note, prose):** the Lemma under (H2)–(H3) ((H1) not needed); the
  frozen-weight domination L12_N ≤ lsaw_N ≤ L_N for any weights; necessity of (H3);
  the activation-set identity behind (C3); leg D's producer path equals the sealed
  one (diff above).
- **Checked (exact integer / 80-digit, script above; referee producer comparison
  in 5D):** (H1)–(H3) and (C1)–(C5) for the actual file; the source contract;
  (C6) on the evidence listed in Section 5 (hash-pinned replays, compiled-in tail
  table, hash-established y-transfer run).
- **Inherited, not re-proved here:** Polymath15 Theorem 1.3 and Proposition 6.6
  as cited; the window-freeze directions (`WINDOW_FREEZE_THEOREM.md`); the
  patch-amortized Taylor scheme and the `corr` bracket (sealed-audit verified;
  weight-independent once (C1)–(C3) hold); Arb inclusion isotonicity; the
  y-transfer Theorems A/B/C; the tail lemma (`TAIL_LEMMA.md` is already stated
  for general real weights with λ_1 = 1 — the base tail mollifier P1113 is not
  an Euler product).
- **Open:** human/referee sign-off on this note; the full-lane sweep logs do not
  echo the mollifier hash or y² (the replays do, for the binding rows); the
  `run_all.sh` GATE 4 path fix above; no Lean statement.
  The package tail verifier (`verifiers/verify_tail_genmoll.c`) reports two
  format false alarms on this file: "P1113 has lambda_1 = 1" compares the literals
  num = 1, den = 1 (the file has `1000000 1000000`), and "sum|lambda| = 9918746/10⁶"
  is the P1113 normalization (this file sums to 78592832/10⁶). The
  parameter-locked verifier `tmp/lambda01758/verify_tail_genmoll_01758354.c`
  checks num = den and 78592832/10⁶; both PASS.
