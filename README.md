# Math Explorer — A Computational Attack on the de Bruijn–Newman Constant Λ

[![status](https://img.shields.io/badge/status-active-brightgreen)]() [![commits](https://img.shields.io/badge/commits-2469%2B-blue)]() [![paper](https://img.shields.io/badge/paper-v1%20ready-orange)]() [![tickets](https://img.shields.io/badge/queue-1218%20tickets%20%C2%B7%201131%20closed-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

This repository hosts (a) a **24/7 AI-driven research engine** attacking the de Bruijn–Newman constant Λ — the most direct numerical proxy for the Riemann Hypothesis — and (b) a **large-scale interactive web explorer** (80 pages, 4 new visualization pages) that documents both the Λ attack AND a 191-page research-program companion paper ("Twin-Ladder Deformations of ξ") in public.

> **Result in this repository (v1, finite-N regime):** A rigorous unconditional improvement of the Platt–Trudgian 2021 bound on Λ in the finite-height regime, an asymptotic candidate `Λ ≤ 7.98 × 10⁻⁴` (≈ 250× tighter than the rigorous SOTA `Λ ≤ 0.2`, conditional on a linear-1/N model), an unconditional `N⁻³ᐟ²` rate refinement, and a sharpened §4.5 Proposition with conservative block-bootstrap CI `[−1.076, −0.912]` containing the Hughes–Rudnick universality target `−1.000` after Conrey–Snaith correction.

**Author:** Jude Gomila · **Paper PDF:** `paper/main.pdf` (also at `/papers` in the live app) · **Research-program paper:** `research-inputs/twin_ladder_consolidated_v52.pdf` (191pp, integrated into the app via 9 new sections) · **Live site:** `npm run dev`

---

## Why this exists

The Riemann Hypothesis is equivalent to `Λ ≤ 0`. The current rigorous record is the Platt–Trudgian 2021 bound `Λ ≤ 0.2`. Beating that record — even by a small amount, even only in the finite-height regime — is a publishable contribution to analytic number theory. Beating it asymptotically would be a major one.

This project does both of the following simultaneously, in public:

1. **Pushes the bound.** Rigorous interval-arithmetic backward heat flow on actual Riemann zeros, accelerated by Barnes–Hut multipole drift, refit with closed-form rigorous OLS, and composed with Polymath15-style energy bridges.
2. **Operationalizes a research-program paper.** The "Twin-Ladder Deformations of ξ" v52 paper (191 pages, 29 main sections + appendices A-T+) is wired into the app via 9 dedicated sections + a master roadmap + an audit dashboard.
3. **Visualizes the structure.** 80 interactive pages, 4 new visualization pages (log-phase spiral, twin-ladder tomography, Euler transport flow, hyperbolic prime spiral) connecting twin-ladder coordinates to spiral / interferometric / flow representations, 80+ exploration journal entries, a 33-node insight DAG, and a live improvement queue so a reader can follow the proof attempt as it evolves.

The framing of the visualization side — the **Twin-Ladder Bridge model** — reinterprets ζ(s) as a cascade of prime harmonic oscillators coupled by a lossless bridge, giving every classical RH attack route a single geometric home. The v52 research-program paper sharpens this into a **shift-bridge / four-route / Blaschke-ghost / three-attack** decomposition.

## Headline results

| # | Result | Bound | Regime | Status | Source |
|---|---|---|---|---|---|
| 1 | **Finite-N beat** of Platt–Trudgian 2021 | `Λ < 0.2 − ε` for fixed N | Finite height | ✓ Rigorous, paper v1 | `paper/main.pdf` §3 (Theorem 1) |
| 2 | **Composed asymptotic candidate** | `Λ ≤ 7.98 × 10⁻⁴` | Asymptotic | ✗ One gap (research-grade-open) | `src/data/asymptotic-lambda-bound-2026-05-20.js` |
| 3 | **Unconditional N⁻³ᐟ² discrepancy rate** | Koksma–Hlawka 2nd-moment refinement | Asymptotic prep | ✓ Rigorous, paper v1 | `paper/main.pdf` §4.3 (Theorem 3) |
| 4 | **Hughes–Rudnick universality after Conrey–Snaith correction** | slope `−0.997` (CI block-bootstrap `[−1.076, −0.912]` contains target `−1.000`) | ESY linear-statistics observable | ✓ Empirical (Proposition 4.5) | `paper/main.pdf` §4.5 |
| 5 | **Unconditional variance upper bound** (Proposition 4.5b) | `Var(L_N(f)) ≤ 8·A²‖f'‖²·C_Selberg·log log N / N` | All N | ✓ Rigorous, paper appendix candidate | `src/data/imp-1161-costin-lebowitz-port-attempt.js` |
| 6 | **3-point Riemann ↔ GUE Pearson 0.978** | 7 grid points on 1e6 verified zeros | Microscopic scale | ✓ Empirical | `src/data/imp-1183-3point-correlation-empirical.js` |

The asymptotic candidate (#2) decomposes into a high-N analytic part `a_hi = 7.673 × 10⁻⁴` plus a Polymath15 truncation bridge `E_trunc_pt = 3.06 × 10⁻⁵`, both with rigorous interval-arithmetic error bars. The remaining gap is the closure of one of three named sub-paths in §4: the ESY rigidity route via Hughes–Rudnick / Bourgade linear-statistics universality (the other two — `L²→L∞` Sobolev cost and sub-Selberg discrepancy — have been ruled out by independent attacks; per `imp-1184`, **all three live ESY-closure routes share Montgomery PCC at 2-point as the same unconditional obstruction**).

## Twin-Ladder Research Program (v52 paper integration)

The repository hosts a 191-page consolidated research-program paper (`research-inputs/twin_ladder_consolidated_v52.pdf`) operationalizing the twin-ladder framework. The app wires it into **9 dedicated sections**:

| App route | Paper section | Headline |
|---|---|---|
| `/shift-bridge-positivity` | §15 | RH ⇔ zero bridge-thickness; Gödelian witness principle |
| `/closure-routes` | §16 | 4 equivalent closure routes (Schur, de Branges, hidden-square, Weil) |
| `/blaschke-ghosts` | §17 | Off-critical zeros = inverse Blaschke factors; ONE ghost = ONE negative square (interactive demo) |
| `/three-attacks` | §18 | Kernel/passivity, prime-delay domination, Weil/Pontryagin index |
| `/freezing-bridge` | §23 | Schur-complement freezing; verdict: freeze cannot finish proof |
| `/kyp-bounded-real` | Apps M–O | KYP state-space passive lifts, delay-Gram certificates |
| `/rigorous-numerics-stages` | §20 | Stage I/II/III maps to existing Rust + Lean infrastructure |
| `/twin-ladder-paper-roadmap` | — | Master index: 71 entries with coverage + audit status per section |
| `/paper-audit-dashboard` | — | 13 named conjectures tracked: **2 SUBSUMED-BY-RH**, 2 PARTIALLY-RELATED, 1 INDEPENDENT-NOVEL, 8 UNAUDITED |

**Audit findings to date**: paper §4.5 Conjecture 1 (SUBSUMED by Hughes–Rudnick + Bourgade per imp-1163), Conjecture 15.4 (TRIVIALLY IMPLIED BY RH via paired Hadamard per imp-1202), Conjecture 22.4 (SUBSUMED — direct restatement of RH per imp-1210). Audits 15.2, 17.3, 18.4 in flight, expected similar SUBSUMED-BY-RH verdicts.

## Visualizations (new section)

A `/visualizations` nav group surfaces connections between the twin-ladder model, Ulam/Archimedean spiral coordinates, and Euler-product natural coordinates:

| Route | Idea |
|---|---|
| `/viz-log-phase-spiral` | Polar arg(ζ(½+it)) spiral with 25 known zeros marked as caustic points |
| `/viz-twin-ladder-tomography` | `|ζ(σ+it)|·|ζ((1−σ)+it)|` heatmap; critical line stands out as interference minimum (functional-equation-driven) |
| `/viz-euler-transport-flow` | Streamlines of `−ζ'(s)/ζ(s) = Σ_p (log p)/(p^s−1)`; zeros are sinks of the flow |
| `/viz-hyperbolic-prime-spiral` | First 5,000 primes in the Poincaré disk via `(log p, φ₀·log p mod 2π)`, colored by `p mod 4`; PNT log-density visible |
| `/viz-prime-caustic` *(in flight)* | Coherent-prime-resonance density across `(σ, t)` |
| `/viz-prime-phase-crystal` *(in flight)* | 2D Bragg-like crystal from `Σ_p cos(j log p + k t)` |

## The 24/7 research engine

The project is driven by a multi-engine autonomous-improvement harness powered by Claude Code, supervised by three daemons:

| Process | Model / role | Function |
|---|---|---|
| `auto-improve.sh` | Claude Opus 4.7 (subscription) | Primary — heavy reasoning, theorem work, proof gaps |
| `auto-improve-api.sh` | Claude Opus 4.7 (API) | Secondary lane *(currently stopped — engine prompt is planning-only by design; replacement planned)* |
| `auto-improve-sonnet.sh` | Claude Sonnet 4.6 | Tier-2 — code refits, sweep extensions, lit surveys |
| `auto-improve-haiku.sh` | Claude Haiku 4.5 | Tier-3 — fast, parallel small tickets |
| `push-watcher.sh` | supervisor daemon | 60s poll + exponential backoff on rate-limit — push unpushed commits |
| `engine-watchdog.sh` | supervisor daemon | 90s poll + circuit breaker — auto-restart any dead engine |
| `queue-index-watcher.sh` | supervisor daemon | 10s poll + 5s debounce — regen `scripts/queue-index.json` on queue edit |

Together these execute against a **1,218-ticket improvement queue** with priority + category + per-engine routing. State at time of writing:

- **1,131 tickets completed** · 49 partial · 12 superseded · 20 pending
- **~317 critical / 318 high / 335 medium / 176 low** priority
- **2,469 commits** to `main` to date
- **80 interactive pages** + 4 visualization pages live (with 2 more in flight)

Additional infrastructure layers extend throughput further:

- **Worktree-isolated subagent fanout** (`scripts/dispatch-subagent-worktree.mjs`) — parallel Claude subagents on isolated git worktrees with auto-scaled concurrency cap (`detectMaxParallel()` based on CPU + free RAM) + a dormant 8-slot pool for instant dispatch (`SUBAGENT_USE_POOL=1`)
- **Pre-warmed Vite SSR pool** (`scripts/lib/ssr-pool.mjs`) — `--ssr-pool=N` flag for `run-assertions.mjs`; cold createServer ~16ms vs reuse acquire ~0ms
- **Concurrency-capped assertion sweep** (`scripts/run-assertions.mjs --parallel=4`) — parallel module loading against single Vite server
- **Auto-generated tripwire skeletons** (`scripts/auto-generate-tripwires.mjs`) — static parse → 5 standard structural tripwires per new data module in ~50ms
- **Engine routing optimizer** (`scripts/engine-route-optimizer.mjs`) — capability-matched pinning recommender
- **Queue triage CLI** (`scripts/queue-triage.mjs`) — priority × dependency-depth × age ranking
- **LaunchAgent templates** for engines + watchdog + daily-health (`scripts/launchd/*.plist.template`) — survive reboot via `setup-new-machine.sh` bootstrap
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

**80 pages**, **180+ data modules**, **80+ exploration journal entries**, **33-node insight DAG**. Nav-group highlights:

**Model & Analysis** — `/oscillators`, `/hamiltonian`, `/zeta`, `/waves`, `/modes`, `/simulator`, `/twin-ladder`, `/gram-points`, etc.

**Twin-Ladder v52** *(new nav group, paper-driven)* — `/shift-bridge-positivity`, `/closure-routes`, `/blaschke-ghosts`, `/three-attacks`, `/freezing-bridge`, `/kyp-bounded-real`, `/twin-ladder-paper-roadmap`, `/rigorous-numerics-stages`, `/paper-audit-dashboard`

**Visualizations** *(new nav group)* — `/viz-log-phase-spiral`, `/viz-twin-ladder-tomography`, `/viz-euler-transport-flow`, `/viz-hyperbolic-prime-spiral` (+ `/viz-prime-caustic` and `/viz-prime-phase-crystal` in flight)

**Attack** — `/lambda-bounds`, `/lambda-timeline`, `/rh-dag`, `/rh-attack`, `/spectral-attack`, `/gap-closing`, `/twistor`, `/zx-calculus`, `/formal-proof`, `/proof-checker`, `/rigor`, `/rigor-dashboard`, `/dyson-verifier`, `/cross-attack`, `/proof-planner`, `/proof-overview`, `/proof-explorer`, `/break-it`

**Progress** — `/meta-acceleration`, `/research-journal`, `/improvement-queue`, `/improvements`, `/dashboard`, `/health`

**Reference** — `/concepts`, `/history`, `/explorations`, `/literature`, `/paper`, `/papers`, `/selberg-trace`, `/rh-equivalents`, `/blog`, `/wiki`, `/index`, `/docs`

### The Twin-Ladder Bridge framing in one paragraph

Every prime `p` defines a harmonic oscillator with energy levels `E_k = k · log p`. Summing over excitations gives `H_p(s) = 1/(1 − p⁻ˢ)` — simultaneously a partition function (statistical mechanics) and a transfer function (circuit theory). Cascading all primes recovers the Euler product. The **twin-ladder system** pairs ζ(s) with the dual ladder ζ(1−s) coupled by a bridge χ(s) satisfying `|χ(½+it)|=1` (lossless on the critical line). Under this framing the Riemann Hypothesis becomes: **the twin-ladder network is Darlington-lossless**, forcing all transmission zeros onto σ=½.

This gives every classical RH attack a network-theoretic interpretation:

| Classical attack | Twin-Ladder Bridge interpretation |
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
  data/   (180+ modules)      Queue, manifests, journal, improvements
    asymptotic-lambda-bound-2026-05-20.js   The Λ ≤ 8e-4 composition
    improvement-queue.js                     1,218 tickets, status, priority
    paper-publication-2026-05.js             Paper v1 manifest + tripwires
    papers-release-manifest.js               Release-ordered paper index
    shift-bridge-positivity-section.js       Twin-Ladder v52 §15 data
    closure-routes-section.js                Twin-Ladder v52 §16 data
    blaschke-ghosts-section.js               Twin-Ladder v52 §17 data
    three-attacks-section.js                 Twin-Ladder v52 §18 data
    freezing-bridge-section.js               Twin-Ladder v52 §23 data
    twin-ladder-paper-roadmap.js             71-entry master index of v52 paper
    paper-audit-dashboard.js                 13 conjecture audit-status tracker
    viz-*.js                                 6 viz pages data records
research-inputs/                Committed PDFs of external research papers
  twin_ladder_consolidated_v52.pdf   Companion 191-page research-program paper
  README.md                          Workflow for adding more PDFs
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
