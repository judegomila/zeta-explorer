# The vortex-trapping blocker: exact reduction

1 November 2026. Analysis of the open hypothesis in PRs #16, #18 and #19. Not an RH proof, not a new bound, no novelty claim.

## Setting

As in PR #16: `H_t(z) = ∫_0^∞ e^{tu²} Φ(u) cos(zu) du`, so `∂_t H = -∂_z² H` and `H_0(z) = ξ(1/2 + iz/2)/8`. The vortex field of PRs #18 and #19 is the real-parameter map

`G(t,x) = H_t(x) + i H_t'(x)`,  `t, x ∈ ℝ`.

`G(t,x) = 0` exactly when `x` is a real zero of `H_t` of multiplicity at least 2. PR #19 §1 (not refereed) states that each such point is isolated with Brouwer index `-floor(m/2) ≤ -1`, where `m ≥ 2` is the multiplicity. Isolation also follows from [P15, Proposition 3.1(ii)]; the index value is checked here by hand only for `m = 2` (`h = x² - 2t`, Jacobian determinant `-4`, index `-1`). The arguments below need only that the index is nonzero.

Published inputs used below. Full references and how each was checked are in "Sources" at the end.

- (K1) Newman [N76]: there is `Λ` with `-∞ < Λ ≤ 1/2` such that `H_t` has only real zeros if and only if `t ≥ Λ`; RH is `Λ ≤ 0`. de Bruijn [dB50, Theorem 13]: if every zero of `H_{t0}` has `|Im z| ≤ y0`, then every zero of `H_t`, `t > t0`, has `|Im z|² ≤ max(y0² - 2(t - t0), 0)`. With `t0 = 0`, `y0 = 1` this gives the strip `|Im z|² ≤ max(1 - 2t, 0)` and `Λ ≤ 1/2`. Csordas–Smith–Varga [CSV94]: for `t > Λ` all zeros of `H_t` are real and simple (equivalently, a multiple zero of `H_{t0}` forces `t0 ≤ Λ`). Rodgers–Tao [RT20, Theorem 1]: `Λ ≥ 0`. Platt–Trudgian [PT21, Corollary 2]: `Λ ≤ 0.2`.
- (K2) Polymath15 [P15, Theorem 1.5(i)–(ii)], refining Ki–Kim–Lee [KKL09]: there is an absolute constant `C` such that for `0 < t ≤ 1/2` every zero of `H_t` with `Re z ≥ exp(C/t)` is real, and simple. Simplicity is not stated in the theorem; it follows from its proof in §9: the proof of (i) places such a zero within `O(x^{-ct}/log x)` of some `x_n`, hence inside the disk `|z - x_n| ≤ c/log x_n` of part (ii) once `C` is large, and part (ii) shows by the argument principle (winding exactly once) that this disk contains exactly one zero counted with multiplicity. Part (ii) is indexed by `n ≥ exp(C/t)` rather than by `Re z ≥ exp(C/t)`, so this step needs a short bridging argument that is not written out here. The simplicity clause is therefore not relied on: Theorems A and B, Corollary C and the remarks use only the reality part of (K2), and take simplicity from Csordas–Smith–Varga. By evenness the same holds for `Re z ≤ -exp(C/t)`. Put `x0(t) = exp(C/t)`; it decreases in `t`. The paper does not give a numerical value of `C`. The numbers this project uses for `x0` come from its own Route 20 measurement (`t·log(x0(t)/4π) ≈ 5.3–5.8` on `[0.1, 0.2]`), not from [P15], and are not refereed.
- (K3) Hurwitz's theorem for the locally uniform limit `H_t → H_s`. It applies because no `H_s` vanishes identically: `H_s(0) = ∫_0^∞ e^{su²}Φ(u) du > 0` by positivity of `Φ` [P15, §3]. For the same reason every zero of every `H_s` has finite multiplicity.

Together, the strip in (K1) and (K2) confine every nonreal zero of `H_t`, `t ∈ [t1, 1/2]`, to the compact set `|Re z| ≤ x0(t1)`, `|Im z| ≤ 1`.

## Theorem A: the global blocker is RH

The following are equivalent:

1. RH.
2. `G` has no zero on `(0, 1/2] × ℝ`.
3. For every Jordan box `B ⊂ (0, 1/2] × ℝ` with `G ≠ 0` on `∂B`, the winding of `G` around `∂B` is 0.

*Proof.*
- (1)⇒(2): RH is `Λ ≤ 0` (K1). So every `t > 0` has `t > Λ`, and by Csordas–Smith–Varga the zeros of `H_t` are real and simple; there is no real multiple zero. (Rodgers–Tao then gives `Λ = 0`; it is not needed here.)
- (2)⇒(3): no zero inside, so the winding is 0.
- (3)⇒(2): suppose `G(t0, a) = 0`. Then `t0 < 1/2`, because `Λ ≤ 0.2 < 1/2` (K1) and Csordas–Smith–Varga make the zeros of `H_{1/2}` simple. By (K3) `a` has finite multiplicity `m ≥ 2`. By PR #19 §1 the zero is isolated with index `-floor(m/2) ≤ -1`. (Isolation alone also follows from [P15, Proposition 3.1(ii)]: near `(t0, a)`, for `t ≠ t0` the zeros are the `m` distinct points `a + 2^{1/2}(t-t0)^{1/2}λ_j + O(|t-t0|)`.) A small box around `(t0, a)` inside `(0, 1/2) × ℝ` has `G ≠ 0` on its boundary and winding `-floor(m/2) ≠ 0`.
- (2)⇒(1): let `E` be the set of `t ∈ (0, 1/2]` for which all zeros of `H_t` are real. `1/2 ∈ E` by (K1).
  - `E` is closed in `(0, 1/2]`: let `t_n ∈ E`, `t_n → s ∈ (0, 1/2]`. If `H_s` had a nonreal zero `z*`, Hurwitz (K3) would give zeros of `H_{t_n}` converging to `z*`, hence nonreal for large `n`, a contradiction.
  - `E` is open: take `t1 ∈ E`. Its zeros are real, so by (2) they are simple. Fix `R > x0(t1/2)` with `H_{t1} ≠ 0` on `Re z = ±R`; `H_{t1}` is also nonzero on `Im z = ±1`, since its zeros are real. On the compact rectangle `|Re z| ≤ R`, `|Im z| ≤ 1`, which contains every zero with `|Re z| ≤ R` by the strip in (K1), Hurwitz gives exactly one zero of `H_t` near each of the finitely many simple real zeros of `H_{t1}` there, and no other zeros, for `t` near `t1`. Conjugation symmetry forces each of those zeros to be real. For `|Re z| > R`, every zero is real when `t ≥ t1/2`, by (K2) and the monotonicity of `x0`.
  - So `E = (0, 1/2]`. Letting `t → 0` and applying (K3), every zero of `H_0` is real, which is RH.

**Consequence.** "Zero winding for an exhaustive family of boxes" (the open hypothesis of PR #19), "strict `D_t(x) > 0` for all `x` and all `0 < t ≤ 1/2`" (PR #16 §6) and "a uniform lower bound on `S` as `a0 → 0`" (PR #16 §3) are each RH, not a weaker sufficient condition. Each implies (2), hence RH. The converses hold as well. Under RH, for `t > 0` the zeros of `H_t` are real, simple and nonzero, and `H_t` is even of order 1 [P15, §3], so `H_t(z) = H_t(0) ∏_k (1 - z²/x_k²)` over the positive zeros `x_k`. Then at real `x` with `H_t(x) ≠ 0`, `D_t(x)/H_t(x)² = -(H_t'/H_t)'(x) = Σ_k [(x-x_k)^{-2} + (x+x_k)^{-2}] > 0`, and at a zero `D_t = H_t'² > 0`. For `S`, under RH the choice `L = S` satisfies PR #16's inequality (3), by its identity (2) with `u = a0`. Since each is equivalent to RH, a finite family of certificates can discharge one of them only by proving RH. This project's flow-blindness no-go (`/flow-blindness-no-go`, internal, not refereed) argues that no soft or flow-stable input will do so.

## Theorem B: the slab version is a de Bruijn–Newman bound

For `0 < t1 ≤ 1/2`: `G ≠ 0` on `[t1, 1/2] × ℝ` if and only if `Λ < t1`.

*Proof.* If `Λ < t1`, then every `t ∈ [t1, 1/2]` has `t > Λ`, and Csordas–Smith–Varga (K1) makes the zeros of `H_t` real and simple, so `G ≠ 0`. Conversely, if `G ≠ 0` on `[t1, 1/2] × ℝ`, the open-and-closed argument of Theorem A, (2)⇒(1), restricted to `[t1, 1/2]` shows that all zeros of `H_t` are real for `t ∈ [t1, 1/2]`, so `Λ ≤ t1`. If `Λ = t1`, Remark C.1 below (with `L = t1`; its proof uses only `Λ = L > 0`) gives a zero of `G` on `{t1} × ℝ`, a contradiction. So `Λ < t1`.

The endpoint matters: `Λ ≤ t1` alone does not give `G ≠ 0` at `t = t1`.

By (K1) with Platt–Trudgian and Csordas–Smith–Varga, `G ≠ 0` for `t > 0.2`, so only `t ≤ 0.2` matters. By (K2), only `|x| < x0(t1)` matters. So each slab reduces to a compact region (explicit only once `C` in (K2) is computed), but its size is that of a Newman-bound proof. With this project's Route 20 values (not a published constant), `x0(0.15) ≈ 1.5e17`, far above the verified height `≈ 6e12` in these units (`x = 2γ`; Platt–Trudgian verify RH for `0 < γ ≤ 3.0e12` [PT21, Theorem 1]). A single box over that region needs `G` evaluated along its long edges, which costs as much as verifying the zeros directly. That is why Polymath15 does not use boxes: [P15, Theorem 1.2] combines RH verification at `t = 0` up to height `X/2` (hypothesis (i)), a zero-free region beyond `x = X + √(1 - y0²)` at the final time `t0` (hypothesis (ii)), and a narrow barrier `X ≤ x ≤ X + √(1 - y0²)` for `0 ≤ t ≤ t0` (hypothesis (iii)), with conclusion `Λ ≤ t0 + y0²/2`. Here `X` is of the order of the verified height, not of `x0(t)`.

## Corollary C: the vortex slab theorem

Let `L < 1/2` be a number for which `Λ ≤ L` is accepted. The levels in use, with their status:

| `L` | Source | Status |
|---|---|---|
| `0.2` | Platt–Trudgian [PT21, Corollary 2]: RH to height `3.0e12` fed into row 2 of Table 1 of [P15] | Peer-reviewed (Bull. London Math. Soc. 2021). Unconditional. The only peer-reviewed level in this list. |
| `0.1787854` | this project, computer-assisted | Candidate. Not refereed. |
| `0.1758354` | this project, computer-assisted | Candidate. Not refereed. |
| `0.116091` | this project | Not refereed. Depends on two unrefereed results: the openai/math 7/8 half-plane result and Raymond, Zenodo DOI 10.5281/zenodo.22867547. |

For `L = 0.2` the statements below are theorems. For the other three they are conditional on the listed bound; this note does not check those bounds.

**Corollary C.** Assume `Λ ≤ L < 1/2`. Then:

1. `G` has no zero on `(L, 1/2] × ℝ`. Equivalently, for every `t ∈ (L, 1/2]` every real zero of `H_t` is simple.
2. Let `B` be a closed Jordan domain (a compact set bounded by a Jordan curve `∂B`) with `B ⊂ (L, 1/2] × ℝ`. Then `G ≠ 0` on `∂B` and the winding number of `G` around `∂B` is 0.
3. For every `t1` with `L < t1 ≤ 1/2`, every hypothesis of the conditional continuation in PR #19 (`LOCAL_COLLISION_INDEX.md`, §6), restricted to the slab `[t1, 1/2]`, holds, and so does its conclusion: all zeros of `H_t` are real (and simple) for every `t ∈ [t1, 1/2]`. In detail:
   - (anchor) `H_{1/2}` has only real, simple zeros;
   - (confinement) for `t ∈ [t1, 1/2]` the set of nonreal zeros of `H_t` is empty, so it lies in any compact set;
   - (boundary certificates) for every `X > 0` the rectangle `Q = (t1, 1/2) × (0, X)` admits a boundary approximation `P` with `|G - P| < |P|` on `∂Q` and `wind(P, 0) = 0`, namely `P = G`;
   - (no collisions) `G ≠ 0` on `[t1, 1/2] × ℝ`.

*Proof.*

1. Take `(t, x)` with `L < t ≤ 1/2`. Then `Λ ≤ L < t`, so the second part of Theorem B, applied with `t1 = t`, gives `G ≠ 0` on `[t, 1/2] × ℝ`, in particular `G(t, x) ≠ 0`. (Unwinding Theorem B: `t > Λ`, so by Csordas–Smith–Varga in (K1) all zeros of `H_t` are real and simple; hence `H_t(x) = 0` forces `H_t'(x) ≠ 0`.) The equivalence with simplicity is the remark after the definition of `G`.
2. `B` is compact and contained in `(L, 1/2] × ℝ`, so by part 1 `G` is continuous and nonzero on all of `B`, in particular on `∂B`. By the Schoenflies theorem `B` is homeomorphic to a closed disk, so the loop `∂B` is contractible inside `B`. Its image under `G` is then contractible in `ℂ \ {0}`, and its winding number is 0. (Equivalently, in PR #19's finite-region formula `wind = -Σ floor(m/2)` the sum is empty.)
3. Fix `t1 ∈ (L, 1/2]`. Every `t ∈ [t1, 1/2]` satisfies `t > Λ`.
   - Anchor: `1/2 > L ≥ Λ`, so by (K1) `H_{1/2}` has only real, simple zeros.
   - Confinement: `t ≥ Λ`, so by Newman's characterization in (K1) `H_t` has no nonreal zero.
   - Boundary certificates: the closure of `Q` lies in `[t1, 1/2] × [0, X] ⊂ (L, 1/2] × ℝ`. By part 1, `G ≠ 0` on `∂Q`, so `P = G` gives `|G - P| = 0 < |P|`. Applying part 2 to the closed rectangle `Q̄` gives `wind(P, 0) = 0`. Since `X` is arbitrary, the rectangles cover the slab in `x > 0`; evenness of `H_t` covers `x < 0`.
   - No collisions: part 1.
   - Conclusion: by Newman's characterization, `t ≥ Λ` already gives that all zeros of `H_t` are real, and Csordas–Smith–Varga gives simplicity. The open-and-closed argument of PR #19 §6 reaches the same conclusion from the hypotheses just verified. ∎

**Remark C.1 (the endpoint `t = L` is not included, and cannot be in general).** If `Λ = L > 0`, then `G` has a zero on `{L} × ℝ`. Proof: pick `t_n ↑ L`, `t_n ≥ L/2`, and a nonreal zero `z_n` of `H_{t_n}` (exists since `t_n < Λ`). By (K1) `|Im z_n| ≤ 1`, and by (K2) `|Re z_n| < x0(L/2)`. Pass to a convergent subsequence `z_n → z*`. By (K3) `H_L(z*) = 0`, and `z*` is real because `L ≥ Λ`. For large `n` a small disk around `z*` contains the two distinct zeros `z_n` and `conj(z_n)` of `H_{t_n}`, so by Hurwitz `z*` has multiplicity at least 2, that is `G(L, z*) = 0`. So part 1 is sharp unless `Λ < L` is known.

**Remark C.2 (what Corollary C does not give).** It says nothing about `(0, L] × ℝ`. `G` has a zero there if and only if `Λ > 0`: a zero at time `t` is a multiple zero of `H_t`, so `t ≤ Λ` by Csordas–Smith–Varga; conversely, if `Λ > 0`, Remark C.1 with `Λ` in place of `L` gives a zero at time `Λ ≤ L`. By Newman's characterization in (K1), `Λ > 0` is the failure of RH. This is Theorem A again. The certificate `P = G` in part 3 is an existence statement that uses the Newman bound as input. It is not a finite-precision computation, and it does not lower `L`. Excluding collisions by boxes on a strip `[L', L] × ℝ` with `0 < L' < L` is, by part 1 and the sharpened Theorem B (`G ≠ 0` on `[L', 1/2] × ℝ` if and only if `Λ < L'`), the same task as proving the Newman bound `Λ < L'`.

## What this means for the vortex proof

- **Settled by published results: the confinement and anchor hypotheses** of PR #19's conditional continuation.
  - The strip in (K1) with (K2) gives uniform compact confinement of nonreal zeros on every slab `[t1, 1/2]`, `t1 > 0`, with no Newman bound used.
  - (K1) with Platt–Trudgian gives a simple all-real anchor at any `t > 0.2`.
- **Equivalent to a Λ bound: the remaining boundary estimate** on a slab `[t1, 1/2]`: by Theorem B it holds if and only if `Λ < t1`.
  - It is available today for `t1 > 0.2`, from Platt–Trudgian (Corollary C with `L = 0.2`).
  - Below that it holds exactly as far as the project's Newman-bound candidates hold (Corollary C with `L` from the table):
    - `0.1787854` and `0.1758354` (computer-assisted candidates, not refereed);
    - `0.116091` (depends on two unrefereed results: the openai/math 7/8 half-plane result and Raymond, Zenodo DOI 10.5281/zenodo.22867547).
  - The vortex statement "no collisions on `(L, 1/2]`" is therefore Corollary C, a consequence of those bounds, and does not need to be re-proved by boxes.
- **Equivalent to RH: the global estimate** (`t1 → 0`), by Theorem A. It should be recorded as such rather than as an open technical lemma.
- **PR #18's finite boxes** remain useful as local checks; this note does not re-audit them. PR #18 certifies `G ≠ 0` (no real multiple zero of `H_t`) on `[0, 1/2] × [200, 220]`, with boundary winding 0; it does not locate zeros or exclude nonreal zeros. Its part with `t > 0.2` follows from Corollary C with `L = 0.2`, and its `t = 0` edge from the known simplicity of the zeros of `ζ` at heights 100–110. The part `0 < t ≤ 0.2` is not covered by Corollary C, and is a finite check by a different method that does not move any Newman bound.

## Status

Proof sketch written for review; not refereed, not formalized. Two internal referee passes (1 November 2026, by the same project, not independent) checked Theorem A and Theorem B/Corollary C against the arXiv texts of [P15] and [PT21] and against PRs #16, #18 and #19; their corrections are included. Theorem numbers for [dB50], [N76] and [CSV94] were checked only through citations in other papers. The equivalence (1)⇔(2) and Corollary C are classical in substance (Newman, de Bruijn, Csordas–Smith–Varga, Ki–Kim–Lee, Polymath15). The new part is only their packaging against the vortex-field hypotheses of PRs #16, #18 and #19. No RH claim and no new Newman bound.

## Sources

Checked on 1 November 2026. "Read" means the statement was read in the paper's own text (arXiv PDF); "secondary" means the theorem number comes from another paper's citation because the original was not accessible here.

- [dB50] N. C. de Bruijn, The roots of trigonometric integrals, Duke Math. J. 17 (1950), no. 3, 197–226, doi:10.1215/S0012-7094-50-01720-0 (journal, volume, issue checked on Crossref; pages as printed in [P15] and [RT20]). Theorem 13 (strip contraction, hence `Λ ≤ 1/2`): secondary, as restated in [P15, Theorem 3.2] ("Proof. See [5, Theorem 13]").
- [N76] C. M. Newman, Fourier transforms with only real zeros, Proc. Amer. Math. Soc. 61 (1976), no. 2, 245–251, doi:10.1090/S0002-9939-1976-0434982-5 (Crossref; [P15] and [RT20] print the pages as 246–251). Existence of `Λ` with "only real zeros iff `t ≥ Λ`": secondary, as stated in the introductions of [P15] and [RT20].
- [CSV94] G. Csordas, W. Smith, R. S. Varga, Lehmer pairs of zeros, the de Bruijn–Newman constant Λ, and the Riemann hypothesis, Constr. Approx. 10 (1994), no. 1, 107–129, doi:10.1007/BF01205170 (metadata checked on Crossref). Simplicity of zeros for `t > Λ`: secondary. [RT20, §2 and §3] cite it as [CSV94, Corollary 1] ("For any Λ < t ≤ 0, the zeroes of H_t are all real and simple"); Andrade–Chang–Miller (arXiv:1310.3477, Lemma 1.5) cite the contrapositive as [CSV94, Theorem 2.2] ("If Ξ_{t0} has a zero of order at least 2, then t0 ≤ Λ"); [P15, §3] cites the zero-velocity ODE for `t > Λ` as [CSV94, Lemma 2.4], "in the case t > Λ (in which all zeroes are real and simple)". The [RT20] quotation is restricted to `t ≤ 0`; the [P15] and Andrade–Chang–Miller forms cover all `t > Λ`, which is what Theorem B and Corollary C use. The same fact also follows from [P15, Proposition 3.1(ii)] (read): a real zero of multiplicity `m ≥ 2` of `H_t` splits into nonreal zeros at times just below `t`, which is impossible if `t > Λ`. The original was paywalled; these numbers are not checked against it. The statement itself does not rest on these numbers. [P15, §3] (read) says that for `t > Λ` "all zeroes are real and simple". It also follows from [P15, Proposition 3.1(ii)] (read) with Newman: a zero of `H_{t0}` of order `m ≥ 2` at a real point `a` splits, for `t < t0` near `t0`, into the zeros `a + 2^{1/2}(t-t0)^{1/2}λ_j + O(|t-t0|)` with `λ_j` the distinct real roots of `He_m`. At least one `λ_j ≠ 0`, so `H_t` has a nonreal zero for such `t`, and `t0 ≤ Λ`.
- [KKL09] H. Ki, Y.-O. Kim, J. Lee, On the de Bruijn–Newman constant, Adv. Math. 222 (2009), no. 1, 281–306, doi:10.1016/j.aim.2009.04.003 (metadata checked on Crossref; [P15] and [RT20] print the volume as 22). Main result (for every `t > 0` all but finitely many zeros of `H_t` are real and simple; hence `Λ < 1/2`): read in the authors' 2007 Hokkaido workshop abstract, not in the paper. Theorem numbers: [P15] cites "[10, Theorems 1.3, 1.4]" for the zero-distribution results with non-uniform, ineffective constants; [RT20] cites Theorem 1.4. Secondary.
- [RT20] B. Rodgers, T. Tao, The de Bruijn–Newman constant is non-negative, Forum Math. Pi 8 (2020), e6, doi:10.1017/fmp.2020.6, arXiv:1801.05914. Theorem 1 (`Λ ≥ 0`): read.
- [P15] D. H. J. Polymath, Effective approximation of heat flow evolution of the Riemann ξ function, and a new upper bound for the de Bruijn–Newman constant, Res. Math. Sci. 6 (2019), no. 3, Paper No. 31, doi:10.1007/s40687-019-0193-1, arXiv:1904.12438. Read (arXiv v2): Theorem 1.1 (`Λ ≤ 0.22`), Theorem 1.2 (barrier criterion, hypotheses (i)–(iii)), Theorem 1.5 (zeros with `Re z ≥ exp(C/t)` are real; one zero per disk around `x_n`; `C` an unspecified absolute constant, proved in §9), Proposition 3.1 (dynamics of a single zero, Hermite splitting at a multiple zero; this is the "Proposition 3.1" cited in PR #16), Theorem 3.2 (de Bruijn strip bound). PR #16's citation of Theorem 1.5 is the correct number; its description "absolute exponential cutoff" should be read as `exp(C/t)` with `C` absolute but not computed.
- [PT21] D. J. Platt, T. S. Trudgian, The Riemann hypothesis is true up to 3·10^12, Bull. London Math. Soc. 53 (2021), no. 3, 792–797, doi:10.1112/blms.12460, arXiv:2004.09765. Read (arXiv v1): Theorem 1 (RH up to height 3 000 175 332 800), Corollary 2 (`Λ ≤ 0.2`, from row 2 of Table 1 of [P15], which needs height above 2.51·10^12). Numbering checked in the arXiv version only.
- Raymond, D. J., Correlated translated probes and the bound Λ < 0.149396 for the de Bruijn–Newman constant, Zenodo, 21 September 2026, doi:10.5281/zenodo.22867547 (DOI resolves; record metadata checked). Not refereed. Used only in the status of `L = 0.116091`.
