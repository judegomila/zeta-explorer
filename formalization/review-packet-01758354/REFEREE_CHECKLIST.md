# Referee checklist — Λ ≤ 0.1758354 candidate

Questions keyed to the chain in `README.md` §3. For each item, record: answer (yes / no /
unclear), the file and line checked, and any defect with severity (fatal / bound-changing /
repairable / cosmetic). A "no" on any item marked **[load-bearing]** blocks the bound.

## A. Criterion and exact row (steps 1–2, 10)

1. **[load-bearing]** Does the transcription of Polymath15 Theorem 1.2 in `BASE/PROOF_NOTE.md` §2
   match arXiv:1904.12438v2 exactly (regions, open/closed endpoints, preconditions on X, t0, y0)?
2. Is t0 + y0²/2 = 879177/5000000 with 0 < t0 ≤ 1/2 and 0 < y0² < 1 − 2t0? (exact)
3. **[load-bearing]** Is the height input correct: Platt–Trudgian Theorem 1 verifies RH to
   T = 3000175332800, and hypothesis (i) needs T ≥ X/2 = 3000000092913.5 under the normalization
   x = 2T? Is the T = 0 endpoint handled?
4. Is the assembly (hypotheses (i), (ii), (iii) → Λ ≤ t0 + y0²/2) complete, with no region of
   (ii) or (iii) left uncovered (finite lane from x_690988, tail from N* = 6e6, overlap at N*)?

## B. Barrier, hypothesis (iii) (step 3)

5. **[load-bearing]** Does the region of (iii) at t0 = 1583/10000 lie inside
   [X, X+1] × [0.1809, 1] × [0, 129/800]? (Check y ≥ √(y0² + 2(t0 − t)) ≥ y0 > 0.1809,
   y ≤ √(1 − 2t) ≤ 1, x ≤ X + √(1 − y0²) < X + 1, t ∈ [0, t0].)
6. **[load-bearing]** Is the base 883-prism certificate sound: accepted-prism predicate, derivative
   majorants (`BASE/DERIVATIVE_BOX_LEMMA.md`, Lemma 8.4), stored-sum provenance, closed coverage
   to t = 0.16125 ≥ 129/800?
7. Sign-off: B_t ≠ 0 on R, and the t → 0 limit argument for Theorem 1.3 on the closed box
   (`BASE/BARRIER_CERTIFICATE.md`, "Effective approximation, including t = 0").

## C. Effective approximation and window freeze (steps 4–5)

8. **[load-bearing]** Is ε_cap = e_A + e_B + e_C0 ≤ 2.668232e-7 valid uniformly on the whole
   finite lane (N ≥ 690988, all x in each window, y ∈ [y0, √(1 − 2t0)], t = t0)? Check the
   N-monotonicity gate used to extend from N = 690988 upward and the y-range of the enclosure.
9. Is the 10.50 constant a correct consequence of Proposition 6.6(vi) (`BASE/ERROR_CONSTANT_WELD.md`),
   and are the e_A + e_B bounds carrying the |γ| N^{|κ|} factor?
10. **[load-bearing]** Does the window-freeze theorem (`BASE/WINDOW_FREEZE_THEOREM.md`, written at
    t0 = 129/800) hold at t0 = 1583/10000, y_max² = 3417/5000, i.e. are g_N, σ_N, k_N valid on every
    window N ≥ 690988? Is x_690988 < X correctly certified (epscap log, margin 5.377e6)?

## D. Gate 1, finite lane (step 6)

11. **[load-bearing]** Native binding, general weights
    (`REPO/formalization/paper/native-binding-general-weights.md`): is the lemma
    "L_N > 0 ⇒ |f_t| ≥ L_N on window N" correct under (H2)–(H3)? Is the frozen-weight
    (sawtooth) reduction L12_N ≤ L_N correct? Are conditions (C1)–(C6) on the `mtype 7` loader
    met by `PKG/src/lemma_sweep_genmoll.c` and the mollifier file?
12. Leg D: is the three-change diff argument (MAXD 32 → 600, mtype range, mtype 7 branch) enough to
    carry `SWEEP/NATIVE_BINDING.md` (written against `lemma_sweep_p235711.c`) to the leg-D build?
13. Does the producer compute L12 with correct directed rounding (lower endpoint, floor truncation)?
    The gate cannot detect a flipped rounding direction inside the producer.
14. Are the lane logs tied to the stated parameters (t = t0 singleton, y² = y0², 256 bit, K = 14,
    hw = 0.005, P17-287 on A1/A2, Euler {2,3} on D)? The full logs do not echo y², precision or the
    mollifier hash; the binding-row replays do. Is replaying 3 rows per leg adequate evidence, or is
    an independent full-lane replay required?
15. Is the finite lane at the single height y = y0 the right input for the y-transfer, i.e. is the
    logged L12 the same functional (direct-Triangle mass) that Theorem C transfers?

## E. Gate 4, y-transfer (step 7)

16. **[load-bearing]** Sign-off on Lemmas B1–B4 and Theorems B, C
    (`PKG/provenance/Y_TRANSFER_GENMOLL_THEOREM.md` §4–5): realizable active sets (B1), gap pruning
    (B2), per-summand derivative bound (B3), one-sided q (B4), two-branch box gate (B), excision
    budget L_N(y) ≥ L_N(y0) − B uniformly in N (C).
17. Do the Lean files (`YTransferReduction.lean`, `DiniGate.lean`, `ExpSumDeriv.lean`) state what the
    prose says they state? Which hypotheses in them are discharged only by the verifier?
18. **[load-bearing]** Does `verify_ydini_genmoll.c` implement the §6 Arb checklist of the theorem
    note: profile count 20,546, sector/window enumeration, strict `arb_lt` decisions, conservative
    `cnt` via `arb_floor`, mass bound, sanity cap, excision accounting summed globally?
19. Is it acceptable that the ydini logs record no source/binary hash (link to source `748aff57…`
    by timestamp and counter reproduction), and that the two full runs differ by 5.4e-9 in B?

## F. Gate 2, tail (step 9)

20. **[load-bearing]** Does `BASE/TAIL_LEMMA.md` (written at t0 = 129/800, N* = 3840000) apply at
    t0 = 1583/10000, N* = 6000000 with the P17-287 mollifier, and does
    `REPO/tmp/lambda01758/verify_tail_genmoll_01758354.c` check every premise it needs
    (SC1–SC3, GN-TR, GN-AB, GN-error, YM, Delta and eC0 monotonicity gates)?
21. Is the tail y-uniform over [y0, √(1 − 2t0)] (y-box plus YM monotonicity above the lower box,
    y-top 8266802/10⁷ ≥ √(1 − 2t0))?
22. Are the decisive tests D < 1 and flow > err > 0 decided with the correct rounding direction
    (upper for D and err, lower for flow)?

## G. Assembly and reproducibility (step 10)

23. Does `scripts/lambda-01758354-gate.mjs` read each number from the right log line, and are the
    baked literals in the audit module rounded in the safe direction?
24. Run: `node scripts/lambda-01758354-gate.mjs --verbose --rerun-tail` (or the staged tarball),
    `tools/verify_manifest.sh`, the package and base `SHA256SUMS`. Do all pass on the referee's
    machine? (The staged tarball has so far been run only on the preparing machine.)
25. Optional recomputation: tail (seconds), binding-row replays (~18 min), barrier replay, full
    lane (hours), full ydini (0.5–1 h on 8–16 threads). Which of these did the referee rerun?
26. Should the package be re-sealed with the GATE 4 patch, the parameter-locked tail verifier, the
    ε_cap computation and the assembly gate before any public release?

## H. Scope of claims

27. Do the package README / PROOF_NOTE and the site state the grade correctly (computer-assisted
    candidate, unreviewed; Lean covers the y-transfer reduction and Lemma B3 only; PT Λ ≤ 0.2 is the
    accepted bound)? List any overstatement found.
