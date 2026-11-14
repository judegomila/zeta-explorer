# Research Sessions — ZPO Explorer / RH Attack Journal

Coarse-grained journal of work sessions on the Riemann Hypothesis Λ bound attack. One entry per session. For per-commit detail see `IMPROVEMENTS.md`. For the live task list see `src/data/improvement-queue.js`.

---

## 2026-04-10 — Session: Engine rewiring + B2(a) statistical closure

**Engine state at start:** auto-improve.sh running category-rotation prompt (ignoring the queue). 9 pending queue items (all proof, stale references to work already shipped in `229133e PATH C HYBRID`). MAX_RUNS=100 hit and exited mid-session. 876 total runs prior.

**Engine state at end:** running PID 1833, MAX_RUNS bumped to 1000. Queue now drives engine selection in `critical → high → medium` order via updated `IMPROVE_PROMPT`. Cron monitor `d76fd47f` fires every ~10min to re-check and re-seed.

**Headline Λ value at start:** `Λ = 0.0066 ± 0.01` from Path C Hybrid (commit 229133e, 2458 zeros, fit `|t_c| = 0.0066 + 4.91/N` with R²=0.943). **Error bar exceeds central value** — cannot claim Λ > 0.

**Headline Λ value at end:** **same headline** (0.0066 ± 0.01), but with a much richer understanding of what that number actually is and what it would take to upgrade it to an RH statement.

**Seeded (this session, in chronological order):**
- **Phase 5** imp-314, 315, 316, 317 — Λ error budget audit, extend Dyson to N=5000, Λ→RH bridge theorem, Guth-Maynard tail certification (all completed by engine)
- **Phase 6** imp-318, 319, 320, 321, 322 — verified-computing Dyson integration, Λ≤0 attack note enumerating 4 blockers B1–B4, cross-validation table, push to PT-scale 10^10, analytic monotonicity proof of `B(t)` (all completed by engine)
- **Phase 7** imp-323, 324, 325, 326, 327 — attack each of B1–B4 plus exact Λ≤0 ⟺ RH height mapping (all completed by engine)
- **Phase 8** imp-328, 329, 330, 331, 332 — five independent B2 closure angles (imp-328 analytic is the main line; imp-329/331/332 tighten B2(a) statistically via more points, WLS, log-spaced data; imp-330 reconciles the â=0.0029 vs headline=0.0066 gap)

**Shipped (engine commits this session, substantive data/ files):**
- `src/data/lambda-error-budget.js` (imp-314)
- `src/data/dyson-scaling-N5000.js` (imp-315)
- `src/data/bridge-lambda-rh.js` (imp-316)
- `src/data/guth-maynard-tail-bound.js` (imp-317)
- `src/data/interval-dyson-collision.js` (imp-318)
- `src/data/lambda-zero-attack.js` (imp-319, the B1–B4 blocker enumeration)
- `src/data/lambda-cross-validation.js` (imp-320)
- `src/data/lambda-pt-scale-extrapolation.js` (imp-321)
- `src/data/dyson-monotonicity-proof.js` (imp-322)
- `src/data/lambda-intercept-confidence.js` (imp-323, the load-bearing B2(a) verdict)
- `src/data/dyson-slope-analytic-bound.js` (imp-324)
- `src/data/dyson-collision-lower-bound.js` (imp-325)
- GM tail tightening (imp-326)
- `src/data/lambda-rh-height-mapping.js` (imp-327)
- B2(a) 8-point projection, WLS re-fit, OLS/headline reconciliation, log-spaced ladder (imp-329, 330, 331, 332)

**Key finding from imp-323 (the verdict that drives Phase 8):** OLS on the 5-point Path C baseline gives `â ≈ 0.0029`, smaller than the headline 0.0066. The one-sided 95% CI on `a` contains 0 but the upper bound is strictly positive, so **B2(a) statistical angle is consistent with Λ ≤ 0 but does not prove it**. imp-323 explicitly flags:

> Angle (b) — analytic bound on `a` from the Dyson ODE — remains the only path to a theorem-grade closure.

**Current main-line blocker (load-bearing for the entire RH-at-finite-height claim):**

**B2(b) — derive an a-priori analytic upper bound on the fit intercept `a` from the Dyson evolution equation, not from least-squares.** This is tracked as `imp-328` and remains pending at session end. Every other pending ticket either supports this one (by shrinking errors) or is a parallel alternate route.

**Open questions at session end:**
1. Does the 1/N ansatz `|t_c| = a + b/N` have a quadratic correction `+ c/N²` that would change `â` when fit with three parameters? (no ticket yet)
2. Can the B2(a) angles be pooled (OLS baseline + projected 8-point + WLS + log-spaced ladder) into a single Bayesian posterior on `a` that is tighter than any individual fit? (no ticket yet)
3. Does the Tao-Rodgers unconditional `Λ ≥ 0` interact with our upper bounds in a way that gives a direct analytic attack independent of B1–B4? (no ticket yet)
4. If `imp-328` succeeds, what exact RH statement does the resulting `Λ ≤ 0` establish — at what effective height `T*` from `lambda-rh-height-mapping.js`? (imp-327 answers for N=2458; not yet re-run for the PT-scale data from imp-321)

**Meta observations worth remembering:**
- The engine completes ~10 tickets per hour at 60s cadence, mostly substantive — queue consumption is the primary bottleneck, not Claude inference time.
- Critical RH tickets consistently take 2–3× longer than random category-rotation improvements (expected — they touch math, not UI).
- The engine is good at the `pending → completed + real code` loop, but does not re-seed itself when the queue drains. A cron monitor is required.
- `improvement-queue.js` is 4300+ lines. Future sessions should consider pagination or archive pruning (tracked as imp-312, pending medium).

---

## 2026-11-14 — Session: Zero channels, coupling, and Newton guidance

**Request:** Make the proposed zero “wires” concrete in the renderer and log the mathematics in Zeta Explorer. Renderer: `judegomila/zeta-view`; research repository: `judegomila/mathexplorer`.

**Delivered:** A [three-view laboratory](https://zeta-view.vercel.app/experiments/zero-channels.html) for moving zero channels, inverse-gap coupling, and continuous Newton guidance. View, family, time, selected branch, direction, radius, and probe settings persist in shareable URLs. The actual theta trajectories use the analytic heat family; the three-root coupling graph is a labeled local diagnostic. Newton guidance moves test points through a fixed field and preserves explicit failure states. The renderer implementation is pinned at `ee749ce5ea91bc336896d3ab87ac4faca1401cc3`.

**Research package:** [`research/rh/zero-channels`](research/rh/zero-channels/README.md) contains the derivations, executable certificate generator/verifier, compact numerical input, saved bounds, replay output, dependency versions, and source hashes.

**Certified finite results:**

- Exact quartet: four disjoint moving disks, each containing exactly one simple zero for every `tau` in `[-0.13, 0]`. Radius `0.01`; 130 complete time cells; 520 branch-cell comparisons; exact rational arithmetic. Minimum strict Taylor–Rouché margin `0.020444320768133732`; minimum disk clearance `0.07010952625620315`.
- Actual theta: one fixed disk centered at `1/2 + 14.134725141734693 i`, radius `0.35`, containing exactly one simple zero for every `tau` in `[-0.05, 0.05]`. Arb interval arithmetic plus explicit omitted-term and integration-tail bounds. Initial boundary floor `0.000355319999999998`, uniform perturbation at most `0.00029`, final strict margin `0.000065319999999998`. Reflection pins the unique zero to the critical line.

**What the comparison establishes:** Moving quartet channels remain valid past the old fixed-disk failure near `tau=-0.08175425`, but stop before the actual collision near `tau=-0.13406958`. Inverse-gap coupling damps relative perturbations in increasing heat time and amplifies them when that direction is reversed. Its translation mode does not choose absolute targets. Newton paths locally reach existing simple zeros, including off-line zeros; they do not relocate those zeros.

**Verification:** 26 focused renderer tests pass (10 mathematical, six UI/URL/worker, 10 existing research-panel tests). The saved rational and actual-theta certificates were independently recomputed. Six certificate controls pass, including rejection of forged bounds and an unsupported enlargement of the theta interval. The packaged compact dataset retains all 723 frames and 2,169 root records from the previous numerical comparison. Production browser checks passed for all three views, shared settings, Back/reload, certificate transitions, probe playback, and both app entry links; a screenshot is included in the package.

**Claim boundary:** The other two tracked theta branches and the wider heat trajectories remain numerical candidates. This session establishes no all-height coverage, no new global bound on the de Bruijn–Newman constant, and no proof of RH. It leaves the repository's existing global research status unchanged.

**Next mathematical work:** Certify additional moving theta channels with whole-time bounds and explicit disjointness, then control omitted infinite-root contributions before extending any collective coupling claim.

---

<!-- Append new session entries ABOVE this line -->

