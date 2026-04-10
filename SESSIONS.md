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

<!-- Append new session entries ABOVE this line -->
