# Independent audit — Λ ≤ 0.1787854 candidate (2026-07-28)

Adversarial AI review of the sealed computer-assisted proof candidate
`dbn-lambda-01787854-candidate-audit` (commit `2e9976c`), which claims an **unconditional**
de Bruijn–Newman upper bound `Λ ≤ 0.1787854` via **Polymath15 Theorem 1.2** (the barrier
criterion) instantiated at the verified-height edge (`X/2 < T_PT = 3 000 175 332 800`).

> **Status: unreviewed computer-assisted proof candidate.** Not an established theorem, not
> peer reviewed, not a proof of RH. Platt–Trudgian `Λ ≤ 0.2` remains the accepted, peer-reviewed
> SOTA. This audit is an AI adversarial review + AI-driven recompute — **not** human expert peer
> review.

## Verdict — no fatal or bound-invalidating defect found

A four-referee adversarial pass (one per hypothesis + cross-cutting), each grounding findings
in file:line and defaulting skeptical, found no defect that breaks the bound:

| Leg | Verdict | Confidence |
|---|---|---|
| Assembly / seal / circularity | coherent; fail-closed; no hidden premise; seal 362/362 OK | — |
| Hyp (i) verified height + Polymath15 Thm 1.2 transcription | **established** (checked vs primary PDFs) | ~0.97 |
| Hyp (iii) closed-barrier winding + t=0 endpoint | **established** (computer-assisted) | ~0.88 |
| Hyp (ii) finite corpus + all-N tail + Dini transfer | **established** modulo cited theorems | ~0.85 |

**Why it survives where the earlier `Λ ≤ 3.06×10⁻⁵` claim was retracted:** this is the
*provable* side of the obstruction seam — the genuine Polymath15 barrier method pushed to the
verified-height limit, with **no GUE / pair-correlation, no C_H (RH-equivalent) modulus, no RH
beyond finite height.** (The retracted 3.06×10⁻⁵ route rested on the RH-hard collision meter.)

## Independent recompile — DISCHARGED (report §7 item 1)

All three heavy computational lanes were rebuilt **fresh from source** and reproduced the
certified bounds:

- **Barrier** — recompiled the 4 C producers (native Homebrew FLINT 3.6.0, a different toolchain
  than the sealed linux/FLINT-3.0.1 lane); regenerated all **7,688** coefficient components + the
  **883-prism** certificate; every prism inequality independently recomputed → `ALL PASS`.
- **Tail** — standalone Arb tail rebuilt at **256- and 512-bit** → `PASS`.
- **Full sweep** — all **3,149,013** finite rows regenerated in the **exact pinned container**
  (image `bedf7303…`, FLINT 3.0.1) matching the sealed corpus line-for-line → `PASS`.

Trust on the computation therefore rises from *"the printed enclosures satisfy the gates"* to
*"a fresh build from source regenerates the certified bounds."*

## One coverage gap found and closed

The thinnest load-bearing inequality — the **Dini y-transfer** (numerator y-monotonicity, worst
ratio `0.99999860767275095`) — was proven out-of-band but **not gated** by the sealed assembly.
A fail-closed log-auditor now gates it (`verifiers/verify_triangle_y_dini_logs.py`, wired as P16);
the full assembly re-runs green.

## Lean 4 formalization (this repo)

`formalization/lean-mathlib-probe/BarrierAnalyticSkeleton.lean` machine-checks (sorry-free,
axioms `[propext, Classical.choice, Quot.sound]`) the **reduction logic** of the two prose-only
analytic steps: the t=0 endpoint extension and `B_t ≠ 0` (so the winding argument counts `H_t`
zeros). Two candidate-specific hypotheses remain as named inputs (the true `H_t` continuity to
t=0; `M₀ ≠ 0` on the rectangle) — this shrinks but does not eliminate the human-review surface.

## Residual to acceptance — human analytic sign-off only

No computational check remains outstanding. What a human number theorist must still verify:
1. `B_t ≠ 0` on the rectangle `R` (the numerical certificate supplies the bound; the analytic fact needs the real Ξ).
2. The `t>0 → t=0` limiting extension of Polymath Lemma 8.4 / Thm 1.3 (dominated convergence).
3. The Dini y-transfer derivation (the thinnest margin; least self-checking step).
4. Documentary: cite Platt–Trudgian's **precise** height `3 000 175 332 800`, not the round `3×10¹²`
   (with the round figure, hypothesis (i) fails by ~93,000).

If those close, it would be a genuine **unconditional** improvement on Platt–Trudgian (0.2 → 0.179).

## Artifacts

- Full referee report + Dini gating fix + recompile record + Lean copy:
  private repo `dbn-lambda-01787854-candidate-audit`, PR #5
  (branch `review/dini-gating-and-referee-report`; the sealed v3 release tag is untouched).
- Lean formalization: `formalization/lean-mathlib-probe/BarrierAnalyticSkeleton.lean` (this repo).
- In-app: `/newman-lambda-01787854-candidate` (candidate package), `/lambda-timeline` (evidence-graded ledger).
