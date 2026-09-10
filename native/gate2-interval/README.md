# W1-CERT — Gate-2 window-1 interval certifier (Arb)

HONESTY: measurement != certificate. The imp-95205 pilot sups
(Sigma|D_j| = 0.2437541384450471, |E97| = 0.1934424506064475, margins
12.8% / 30.8% vs Rex = 0.2796881955526244) are dd SAMPLES — the zoom
raised them 2.2%, so the continuum sup exceeds any sample. This lane
builds the CERTIFIED continuum sup for window 1 only. Nothing here
promotes any Lambda bound (G3 gate certification != Lambda change).
NO QED. Platt–Trudgian Lambda <= 0.2 stays the benchmark.

## Target (frozen, fail-closed)

N = 690988, t0 = 24727519/200000000, y = 1809/10000 (exact rationals),
q0 = N^2 − t0/16, x(u) = 4π(q0 + u), u ∈ [0, 2N+1] CLOSED (covers the
seam point and both half-open conventions). For BOTH seam charts
M ∈ {690988, 690989}, under the LOCKED convention of
`native/gate2-lane-a/main.c` (bnHasT0=1, bnOnBoth=1, frozenChart=1,
real gamma_at; amplitudes x-independent):

- **(C1)** certified sup over W of Σ_{j=1..25} |D_j^{(M)}(x)| < 0.27968819555261474
- **(C2)** certified sup over W of |E97^{(M)}(x)| < 0.27968819555261474

(eq-20 downward-rounded literal, strictly < Rex = 0.2796881955526244146123,
so passing it implies the Rex inequality).

Scope honesty: locked convention only (does NOT reproduce the paper
anchor literal 0.2141254901198318 — BLOCKED-ON-CONVENTION, see
`../gate2-lane-a/README.md`); window 1 only (54,109,011 windows remain);
a pilot cell failure is a stop signal for independent defect radii, NOT
disproof of the recombined gate (G3 semantics) — |E97| certification
continues independently of a pilot cell failure. The carrier term
(5/2)(7403)(rho17 + rho*) belongs to the GLOBAL gate, not this window
pilot: recorded, not consumed.

## Method (this phase: centered-form certifier skeleton)

Under the locked convention the amplitudes are x-independent, so every
metric obeys |f(x) − f(xc)| <= L·|x − xc| with L a rigorous x-UNIFORM
triangle-inequality ledger computed once per chart in Arb (per-term
d/dx magnitude <= amplitude · nu_n, nu_n = ln(n)/2; A97 products via
the (value, derivative) mass recurrence). A cell [ulo, uhi] certifies a
metric iff

    ubound(f(center ball)) + ubound(L)·ubound(halfwidth_x) < lbound(threshold)

under strict arf comparison (outward rounding everywhere). Adaptive
bisection; cells that cannot certify at max depth, and all cells left
when `--budget-cells` is exhausted, are RECORDED, never skipped
(fail-closed). The eq-(13) telescope identity Σ_j D_j = E97 is checked
at EVERY evaluation: the difference ball must contain 0 or the run
aborts (mirror of the pilot's 8e-14 dd gate). The promotion flag stays
false unless the run covered the full closed window on both charts and
every cell certified both metrics (G5 semantics).

Measured rigorous Lipschitz ledger (128 bits):
sigmaB(690988) = 1.421657993000163 (matches the design check-script
exactly), Lip(pilot) <= 84.769080 (design crude: 84.77),
Lip(E97) <= 91.492276 (design crude: 93.12 — ours slightly tighter).

## Status 2026-09-10 (build + validation + dry-run phase; NO full run)

- **Build**: clean compile, clang -O2 against FLINT/Arb 3.x
  (`/opt/homebrew`), zero warnings. `selfcheck` ALL PASS (ln-table
  splitting vs direct log, class table, 6 point evals with telescope
  gate, enclosure radii ~1e-33 at 128 bits — no ball blowup at window-1
  point cells; the FR-1 kill-test at larger N remains open for the
  family campaign, not this window).
- **Validation vs the dd evaluator** (`validate_against_dd.py`, seed
  95205; 17 random points + the two pilot witnesses + the seam; 20
  points, 1040 containment checks: |E97|, pilot, and all 50 defect
  components each): **0 failures**. Max |dd − mid|: 6.2e-16 on |E97|,
  2.3e-14 on the pilot, 2.2e-14 on defects — consistent with the
  imp-95205 mpmath audit (1.3e-16 / 1.7e-14 / 1.3e-14). Containment is
  checked in the ball inflated by DD_TOL = 1e-12 (the dd lane's own
  documented error allowance; Arb radii ~1e-33 are far below dd error,
  so strict-ball containment of a dd value is not the right test — the
  ball encloses the TRUE value, dd carries ~1e-14 error).
- **Dry-run at 128 bits** (512 samples/side, 6 threads, nice):
  first-order adaptive cell estimate **5.573e9 cells/side (pilot-
  limited; E97 alone 3.602e9), 1.115e10 total**, zero infeasible
  samples (every sampled center has positive slack). Max sampled point
  ubounds: pilot 0.20800, |E97| 0.16479 (below the true window sups —
  the pilot's zoomed witnesses sit between samples, as expected). Max
  ball radius 2.6e-33, max telescope radius 4.4e-33. Per-eval cost
  1.27 CPU-s (direct O(N) = 6.9e5 arb_sin_cos per eval), so a DIRECT
  certify run would be ~1.6e5 CPU-days (~2.7e4 wall-days at 6 threads):
  **excluded**, exactly as the design predicted. At the design's tiered
  per-cell cost (~1e3 ball-ops after tier-P/B/S collapse), 1.115e10
  cells ≈ 1.1e13 ball-ops — inside the design's 1–4e13 budget and below
  the 8e13 planner stop-gate, so the tiered build (next phase) proceeds.

## Envelope pivot (imp-95210, 2026-09-10): REFUTED

The proposed pivot from phase-resolving to ENVELOPE-SCALE subdivision
(certify the pilot via slowly-varying |D_j| moduli) was measured with
`envprobe.c` (dd, 49,152 evals on fine 0.004-q-unit scans, both charts;
cross-validated vs eval_fast to 2.9e-14, telescope 3.0e-15, 0
containment violations on the exact alias decomposition
q_p G_j − H_j = o_j + mm_j + rr_j) and fails on two independent counts:

1. **Slack obstruction**: the finest modulus-triangle envelope
   Σ_j |A_<j|(|o_j|+|mm_j|+|rr_j|) has sampled sup **0.34417 > Rex**
   (73/24,576 exceedance witnesses per chart); the pilot (0.24376)
   passes only through the joint mm+rr phase cancellation. Every split
   that separates the broadband pieces exceeds Rex (coarser triangles
   are worse: U2 0.583, static masses 8.04); the one sub-Rex split
   (|o_j| + |mm_j + rr_j| joint, ~0.266) varies at phase scale.
2. **Scale obstruction**: the pilot modulus moves 1% of Rex within
   9.5e-4 q-units — 78x FINER than one fastest-phase turn; |D_25|
   (p=2) moves 75% of Rex per turn (broadband mm/rr pieces). Only the
   narrowband alias/overhang piece is envelope-scale (|o_j| ≤ 3e-3,
   d/du ≤ 0.003) and it is the small one.

Byproduct kept: the alias-decomposed ledger gives a RIGOROUS
Lip(pilot) ≤ 44.476/x vs the current 84.769 (1.906x fewer cells; adopt
in the tiered build). Even the non-certifiable true-derivative scale
(0.2345/x measured) would give 3.1e7 cells = 453 CPU-days at direct
O(N) evaluation. Frozen record:
`src/data/imp-95210-window1-pilot-certificate.js`. The tier-P/B/S
batching below remains the only live path.

## Tier-P/B/S certifier (imp-95213, 2026-09-10): BUILT + SLICE-VALIDATED

`tier_cert.c` (includes this file; `eval_from_class_sums` is the shared
assembly stage, so the tiered evaluator reproduces the exact locked
semantics + per-eval telescope gate). Architecture:

- **Tier B**: rigorous degree-D Taylor panel models of all 52 class-sum
  series (one O(N) Arb pass per panel; exact Lagrange remainder from the
  per-class masses Σ|amp|ν^{D+1}, computed once per chart in Arb; at
  D = 80 the panel half-width is hX = 3.1392 x-units at total remainder
  ≤ 1e-14). Cells inside a panel cost ~4.3e3 ball-ops (arb_dot Horner +
  25 prime sin_cos + assembly) instead of ~7e5 arb_sin_cos. Cell
  criterion uses the ADOPTED alias-decomposed ledger, re-derived in Arb:
  Lip(pilot) ≤ 44.476493/x (side 0; matches the envprobe doubles to
  1e-8) vs the direct 84.769; Lip(E97) ≤ 91.492 unchanged.
- **Tier P**: direct O(N) `eval_point` fallback at max depth / min
  width, with the |E97|-direct target retry (G3 semantics). Never fired
  on the validated slice.
- **Tier S**: both seam charts over the closed range (structural), plus
  the derotated overhang ledger carried as an Arb diagnostic:
  lip2Derot ≤ 39.8115 (only 1.12x below the joint ledger) while the
  split-target static overhang penalty 2·Σ supA·amp·mTail = 2·0.6765
  exceeds Rex — so the per-cell o_j split is priced OFF the critical
  path (frozen verdict, matches Finding 1 of imp-95210).

Validation: 30 seeded points (seed 95213, witnesses + seam included,
deliberately off-center panels): direct-Arb-ball containment 30/30, dd
cross-validation via `tier_validate_dd.py` (gate2 `point`), max Taylor
radius ~1.3e-14 = the remainder budget, telescope gate ≤ 3.3e-14 at
every evaluation. Degree sensitivity (micro-slice, full-window
CPU-days at measured rate): D=40 → 574, D=80 → 403, D=112 → 389.

Slice + price: see `tier-slice-main-95213.json` and the frozen record
`src/data/imp-95213-tier-certifier-build.js`.

## Next phase (not this program run)

1. Frequency-bin second level (panel chirp recurrence u_p = 5, B = 256
   bins with the Lemma-A remainder, subpanel collapse with Lemma B) to
   amortize the per-panel O(N) pass — the remaining ~10-100x between the
   measured single-level Taylor rate and the design's 1.1e13 ball-op
   budget; the full run is a separate decision.
2. Replay at 160/192 bits + independent 256-bit audits (G5) with
   checkpointing; ball radii ARE the paper's r_s (max radius goes in
   the ledger).
3. Keep the `conv_t`-style convention switch when porting: gamma is
   real/frozen here, but a future directed-complex-gamma (polymath)
   rerun must not require re-architecting the algebra layer.

## Usage

    make                    # build
    make selfcheck          # internal checks (fast)
    make validate           # 20-point dd containment validation
    make dryrun             # coarse-pass cell estimate at 128 bits
    ./cert_window point W SIDE [prec]
    ./cert_window validate FILE [prec]        # FILE: "w side" per line
    ./cert_window dryrun [samples] [prec] [threads]
    ./cert_window certify [--budget-cells B] [--max-depth D] [--threads T]
                          [--prec P] [--out FILE] [--side 0|1|both]
                          [--u-lo A] [--u-hi B]

    make tier_cert          # imp-95213 tiered certifier
    make tier-selfcheck     # ledger cross-check + panel containment
    make tier-validate      # 30-point internal + dd cross-validation
    ./tier_cert slice --u-lo A --u-hi B [--side 0|1|both]
                [--metric pilot|e97|both] [--threads T] [--prec P]
                [--degree D] [--budget-cells B] [--out FILE]

CPU etiquette: run under `nice` with <= 6 threads while the machine is
shared (see the Makefile targets).

Sources: `../gate2-lane-a/main.c` (validated dd evaluator),
`src/data/imp-95205-g3-first-window-pilot.js` (pilot record),
`src/data/imp-95012-gate2-frozen-spec.js` (frozen row + window),
paper `research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf`
§12.1 gates G4/G5.
