# Math Explorer — A Computational Attack on the de Bruijn–Newman Constant Λ

[![status](https://img.shields.io/badge/status-active-brightgreen)]() [![commits](https://img.shields.io/badge/commits-2374%2B-blue)]() [![paper](https://img.shields.io/badge/paper-v1%20ready-orange)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

This repository hosts (a) a **24/7 AI-driven research engine** attacking the de Bruijn–Newman constant Λ — the most direct numerical proxy for the Riemann Hypothesis — and (b) a **large-scale interactive web explorer** documenting the attack as it happens, in public.

> **Result in this repository (v1, finite-N regime):** A rigorous unconditional improvement of the Platt–Trudgian 2021 bound on the de Bruijn–Newman constant Λ in the finite-height regime, with an asymptotic candidate (`Λ ≤ 7.98e-4`, ≈ 250× tighter than `Λ ≤ 0.2`) currently composed but blocked behind one named research-grade gap.

**Author:** Jude Gomila · **Paper PDF:** `paper/main.pdf` (also at `/papers` in the live app) · **Live site:** `npm run dev`

---

## Why this exists

The Riemann Hypothesis is equivalent to `Λ ≤ 0`. The current rigorous record is the Platt–Trudgian 2021 bound `Λ ≤ 0.2`. Beating that record — even by a small amount, even only in the finite-height regime — is a publishable contribution to analytic number theory. Beating it asymptotically would be a major one.

This project does both of the following simultaneously, in public:

1. **Pushes the bound.** Rigorous interval-arithmetic backward heat flow on actual Riemann zeros, accelerated by Barnes–Hut multipole drift, refit with closed-form rigorous OLS, and composed with Polymath15-style energy bridges.
2. **Visualizes the entire attack.** 65 interactive pages, 80+ exploration journal entries, a 33-node insight DAG, and a live improvement queue so a reader can follow the proof attempt as it evolves.

The framing of the visualization side — the **Zero-Point Oscillator (ZPO) twin-ladder model** — reinterprets ζ(s) as a cascade of prime harmonic oscillators coupled by a lossless bridge, giving every classical RH attack route (Hilbert–Polya, Darlington, Weil positivity, Nyman–Beurling, Li criterion) a single geometric home.

## Headline results

| # | Result | Bound | Regime | Status | Source |
|---|---|---|---|---|---|
| 1 | **Finite-N beat** of Platt–Trudgian 2021 | `Λ < 0.2 − ε` for fixed N | Finite height | ✓ Rigorous, paper v1 | `paper/main.pdf` §3 (Theorem 1) |
| 2 | **Composed asymptotic candidate** | `Λ ≤ 7.98 × 10⁻⁴` | Asymptotic | ✗ One gap (research-grade-open) | `src/data/asymptotic-lambda-bound-2026-05-20.js` |
| 3 | **Unconditional N⁻³ᐟ² discrepancy rate** | Koksma–Hlawka 2nd-moment refinement | Asymptotic prep | ✓ Rigorous, paper v1 | `paper/main.pdf` §4.3 (Theorem 3) |
| 4 | **Hughes–Rudnick universality empirical cross-check** | slope `−0.881`, R² `0.984` | ESY linear-statistics observable | ✓ Empirical (Proposition, not Conjecture) | `paper/main.pdf` §4.5 |

The asymptotic candidate (#2) decomposes into a high-N analytic part `a_hi = 7.673 × 10⁻⁴` plus a Polymath15 truncation bridge `E_trunc_pt = 3.06 × 10⁻⁵`, both with rigorous interval-arithmetic error bars. The remaining gap is the closure of one of three named sub-paths in §4: the ESY rigidity route via Hughes–Rudnick / Bourgade linear-statistics universality (the other two — `L²→L∞` Sobolev cost and sub-Selberg discrepancy — have been ruled out by independent attacks).

## The 24/7 research engine

The project is driven by a multi-engine autonomous-improvement harness powered by Claude Code:

| Engine | Model | Role |
|---|---|---|
| `auto-improve.sh` | Claude Opus 4.7 (subscription) | Primary — heavy reasoning, theorem work, proof gaps |
| `auto-improve-api.sh` | Claude Opus 4.7 (API) | Secondary — parallel high-reasoning lane |
| `auto-improve-sonnet.sh` | Claude Sonnet 4.6 | Tier-2 — code refits, sweep extensions, lit surveys |
| `auto-improve-haiku.sh` | Claude Haiku 4.5 | Tier-3 — fast, parallel small tickets |
| `push-watcher.sh` | — | Daemon (60s poll) — push unpushed commits to GitHub |

Together these execute against a **1,146-ticket improvement queue** with priority and category routing. State at time of writing:

- **1,079 tickets completed** · 40 partial · 12 superseded · 9 pending
- **317 critical / 318 high / 335 medium / 176 low** priority
- **2,374 commits** to `main` to date
- **4,316 KB improvement log** (`src/data/improvements.js`)

Two additional infrastructure layers extend throughput further:

- **Worktree-isolated subagent fanout** (`scripts/dispatch-subagent-worktree.mjs`) — parallel Claude subagents on isolated git worktrees, merged via `git merge --no-ff`
- **Cloud-burst AWS launcher** (`scripts/cloud-sweep.sh`) — EC2 spot instances for compute-heavy Rust sweeps, with self-terminate on completion

## Rigorous compute stack

The numerical claims that feed Theorem 1 and the §4.5 empirical work are **machine-checkable** via:

- **Rust + `inari` interval arithmetic** (`rust/interval-rk4/`, 27 files, 6,313 LOC)
  - Verner 8(7) embedded RK pair (`rk4.rs`), Dormand-Prince 4(5) sub-stepping, classical RK4
  - **Barnes–Hut multipole drift** (`rk4_interval_step_bh_multipole`) — `O(N log N)` zero-pair interaction with rigorous error envelope (`θ` parameter)
  - Measured speedup: **854× at N=10⁵** over dense `O(N²)` reference
  - Used for both forward backward-heat-flow checks and the imp-1136 production sweep
- **Lean 4 formalization scaffolding** (`lean/`, 9 source files) — composition sanity checks (imp-441) and selected lemma ports
- **Vite SSR assertion sweep** (`scripts/run-assertions.mjs`) — build-time tripwires guarding every published numeric claim. CI fails if any tripwire fires.

## The live web explorer

```bash
npm install
npm run dev        # http://localhost:3002
npm run build      # → dist/
```

**65 pages**, **177 data modules**, **80+ exploration journal entries**, **33-node insight DAG**. Highlights:

- `/lambda` — live de Bruijn–Newman bound timeline (1950 → today, with our improvements)
- `/papers` — release-ordered downloads (v1 ready, v2 / v3 planned with blockers listed)
- `/improvement-queue` — every queued ticket with status, priority, owner, related tickets
- `/improvements` — full history of 1,000+ atomic improvements with diffs
- `/meta-acceleration` — engine throughput, commit cadence, ticket velocity dashboards
- `/full-story` — narrative timeline from ZPO model → bound improvement → published paper
- `/lambda-roadmap` — gap-by-gap dependency graph from current state → `Λ ≤ 0`
- `/rh-attack` — five classical attack paths under the ZPO framing
- `/proof-checker` — Li coefficients, Hamiltonian self-adjointness tests, Weil positivity checks
- `/explorations` — 80+ AI exploration entries with LaTeX, citations, cross-refs

### The ZPO framing in one paragraph

Every prime `p` defines a harmonic oscillator with energy levels `E_k = k · log p`. Summing over excitations gives `H_p(s) = 1/(1 − p⁻ˢ)` — simultaneously a partition function (statistical mechanics) and a transfer function (circuit theory). Cascading all primes recovers the Euler product. The **twin-ladder system** pairs ζ(s) with the dual ladder ζ(1−s) coupled by a bridge χ(s) satisfying `|χ(½+it)|=1` (lossless on the critical line). Under this framing the Riemann Hypothesis becomes: **the twin-ladder network is Darlington-lossless**, forcing all transmission zeros onto σ=½.

This gives every classical RH attack a network-theoretic interpretation:

| Classical attack | ZPO interpretation |
|---|---|
| Hilbert–Polya (spectral) | Self-adjoint Hamiltonian of the ladder chain |
| Darlington (network) | Twin-ladder is exactly lossless |
| Weil positivity (Connes) | Scattering form `W[f] ≥ 0` |
| Nyman–Beurling | `L²` density of bridge images of fractional parts |
| Li criterion | `λₙ ≥ 0` for all n, computable from bridge expansion |

## Repository layout

```
paper/                       LaTeX paper (main.tex, main.pdf, refs.bib)
public/papers/               PDF artifacts served by the app
rust/interval-rk4/           Rust interval-arithmetic engine
  src/rk4.rs                  Verner 8(7), Barnes-Hut multipole drift
  src/bin/                    CLIs (interval-rk4-cli, chain, sweep, etc)
lean/                        Lean 4 formalization scaffolding
src/
  App.jsx                     React Router, HashRouter, code-splitting
  pages/  (65 pages)          Interactive content + visualizations
  components/                 KaTeXMath, InsightDAG, TwistorDiagram3D, ...
  math/                       Zeta, primes, spectral attack, gap closing
  data/   (177 modules)       Queue, manifests, journal, improvements
    asymptotic-lambda-bound-2026-05-20.js   The Λ ≤ 8e-4 composition
    improvement-queue.js                     1,146 tickets, status, priority
    paper-publication-2026-05.js             Paper v1 manifest + tripwires
    papers-release-manifest.js               Release-ordered paper index
  styles/app.css              Dark-theme global styles
scripts/
  auto-improve.sh             Subscription Opus 4.7 engine
  auto-improve-api.sh         API Opus 4.7 engine
  auto-improve-sonnet.sh      Sonnet 4.6 engine
  auto-improve-haiku.sh       Haiku 4.5 engine
  push-watcher.sh             60s push daemon
  dispatch-subagent-worktree.mjs   Worktree-isolated subagent harness
  cloud-sweep.sh              AWS EC2 spot burst launcher
  run-assertions.mjs          Build-time tripwire sweep
  setup-new-machine.sh        One-command bootstrap (LaunchAgent templates)
```

## Quick start

```bash
# Web explorer
npm install
npm run dev          # http://localhost:3002

# Auto-improvement engines (run any/all)
./scripts/auto-improve.sh start          # Opus 4.7 subscription
./scripts/auto-improve-api.sh start      # Opus 4.7 API
./scripts/auto-improve-sonnet.sh start   # Sonnet 4.6
./scripts/auto-improve-haiku.sh start    # Haiku 4.5
./scripts/push-watcher.sh --daemon-loop  # auto-push commits

# Rigorous Rust sweep (requires Rust + GMP)
cd rust/interval-rk4
cargo test                                  # 3/3 unit tests
cargo run --release --bin interval-rk4-cli -- \
  --drift-mode bh_multipole --theta 0.1

# Build paper PDF
cd paper && tectonic main.tex
```

## Tech stack

- **React 19** + React Router (HashRouter) · **Vite 6** with code-splitting
- **KaTeX** · **D3.js** · **Three.js** + React Three Fiber · **Canvas 2D** · **SVG**
- **Rust** + `inari` interval crate · GMP/MPFR · Barnes–Hut tree
- **Lean 4** + Mathlib (scaffolding)
- **Claude Code** orchestrating Opus 4.7 / Sonnet 4.6 / Haiku 4.5 in parallel

## Status, accountability, and reading order

Numerical claims in the paper and in any `*ready*` data module are guarded by build-time tripwires in `scripts/run-assertions.mjs`. If a tripwire fails, CI fails and the manifest entry cannot be marked `ready`.

Suggested reading order for a new visitor:

1. `paper/main.pdf` — the formal write-up (11 pages, v1)
2. `/lambda` page — what bound we are attacking and where we sit
3. `/full-story` — narrative timeline
4. `/lambda-roadmap` — what gaps remain
5. `/improvement-queue` — live ticket flow
6. `/improvements` — the 1,000+ atomic edits behind the current state

## License

MIT
