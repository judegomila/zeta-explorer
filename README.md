# Twin Ladder Explorer

*Interactive experiments in zeta-zero geometry and the Riemann hypothesis.*

[![status](https://img.shields.io/badge/status-active-brightgreen)]() [![commits](https://img.shields.io/badge/commits-2469%2B-blue)]() [![paper](https://img.shields.io/badge/paper-v1%20withdrawn-red)]() [![tickets](https://img.shields.io/badge/queue-1218%20tickets%20%C2%B7%201131%20closed-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

This repository hosts (a) an exploratory computational program around the de Bruijn–Newman constant Λ and (b) a large interactive web explorer documenting the calculations, failed routes, review candidates, and the Twin-Ladder research program.

> **Current honest status (2026-07-28):** This project does not prove RH. The standalone private review repository [`judegomila/dbn-lambda-01787854-candidate-audit`](https://github.com/judegomila/dbn-lambda-01787854-candidate-audit) presents `Λ ≤ 0.1787854` as an unreviewed computer-assisted candidate for an unconditional proof, pinned to tag `review-01787854-v3` and commit `2e9976c4becbf97e31c56fe75fce07cdff5dd4ea`. Its package, [referee PDF](public/papers/dbn-lambda-01787854-candidate-audit-v3.pdf), and [provenance sidecar](public/papers/dbn-lambda-01787854-candidate-audit-v3.provenance.txt) aim to certify a compact slab, a final-time half-strip, a fresh 3,149,013-row replay, corrected `10.50` error bounds, and the exact Polymath criterion weld. The bound is not established and has not been peer reviewed. It is not a proof of RH. Platt–Trudgian `Λ ≤ 0.2` remains the peer-reviewed benchmark, while the public `Λ ≤ 0.1875` certificate package remains an unrefereed claim.

> **Shear-kernel correction (2026-08-28):** The §25 claim that the line `u=v` is a non-zero “positive diagonal channel” of an ordinary continuum double integral is withdrawn: that line has two-dimensional Lebesgue measure zero. The repaired `/hidden-square-program` uses the exact paired `(r,s)` kernel identity and an arithmetic theta divisor-block diagnostic. These exact identities do not prove RH; the proposed Arb/ball finite-Gram calculation with an analytic theta tail remains an open certification backend. See `formalization/paper/shear_kernel_measure_audit_2026-08-28.md` and run `npm run audit:shear`.

**Author:** Jude Gomila · **Withdrawn historical artifact:** `paper/main.pdf` (its “unconditional beat” headline depends on undischarged `C_H`; it is not offered as a current result) · **Bundled historical research-program paper:** `research-inputs/twin_ladder_consolidated_v52.pdf` · **Current app review overlay:** v70 · **Live site:** `npm run dev`

---

## Why this exists

The Riemann Hypothesis is equivalent to `Λ ≤ 0` (and, with Rodgers–Tao `Λ ≥ 0`, to `Λ = 0`). It is important to separate three grades used in the app: the peer-reviewed `0.2` benchmark, the public but unrefereed `0.1875` record-package claim, and the unreviewed computer-assisted `0.1787854` candidate for an unconditional proof in the standalone private review repository. The candidate bound is not established, has not been peer reviewed, and is not RH.

This project does both of the following simultaneously, in public:

1. **Displays evidence-graded bounds and candidates.** It records replayable finite and tail computations while keeping candidate, establishment, and peer-review status explicit.
2. **Operationalizes a research-program paper.** The historical v52 paper is wired into dedicated sections, with a v70 correction overlay rather than silently rewriting the old audit ledger.
3. **Visualizes the structure.** 80 interactive pages, 4 new visualization pages (log-phase spiral, twin-ladder tomography, Euler transport flow, hyperbolic prime spiral) connecting twin-ladder coordinates to spiral / interferometric / flow representations, 80+ exploration journal entries, a 33-node insight DAG, and a live improvement queue so a reader can follow the proof attempt as it evolves.

The framing of the visualization side — the **Twin-Ladder Bridge model** — reinterprets ζ(s) as a cascade of prime harmonic oscillators coupled by a lossless bridge, giving every classical RH attack route a single geometric home. The v52 research-program paper sharpens this into a **shift-bridge / four-route / Blaschke-ghost / three-attack** decomposition.

## Headline results

| # | Result | Bound | Regime | Status | Source |
|---|---|---|---|---|---|
| 1 | **Peer-reviewed benchmark** | `Λ ≤ 0.2` | Global | ✓ Published theorem | Platt–Trudgian 2021 |
| 2 | **Public certificate-package claim** | `Λ ≤ 3/16 = 0.1875` | Fixed height + tail | Public, reproducible, unrefereed; locally repaired | Zenodo `21175533` |
| 3 | **Standalone private-review candidate** | `Λ ≤ 0.1787854` | Compact slab + final-time half-strip + criterion weld | Unreviewed computer-assisted candidate for an unconditional proof; bound not established; not peer reviewed; not RH | `/newman-lambda-01787854-candidate` |
| 4 | **Older finite-N “beat”** | about `0.02` at `N=10⁴` | Finite model | Estimate only; gated on open `C_H` | `src/data/lambda-roadmap.js` |
| 5 | **Conditional asymptotic target** | `Λ ≤ 3.06 × 10⁻⁵` | Asymptotic program | Conditional on Polymath15 G6a | `src/data/asymptotic-lambda-bound-2026-05-20.js` |
| 6 | **3-point Riemann ↔ GUE Pearson 0.978** | 7 grid points on 1e6 verified zeros | Microscopic scale | Empirical | `src/data/imp-1183-3point-correlation-empirical.js` |

The older asymptotic program target (#5) is retained as a conditional research path, not as a current bound. Its numerical value depends on the Polymath15 `G6a` bridge and therefore must not be compared with the three evidence-graded headline rows as if it were an established theorem.

## Twin-Ladder Research Program (v70 review over the v52 integration)

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
| `/paper-audit-dashboard` | — | 14 named conjectures tracked: **7 SUBSUMED-BY-RH**, 5 PARTIALLY-RELATED, 2 INDEPENDENT-NOVEL, 0 UNAUDITED |

**Audit status**: all 14 dashboard conjectures now have verdicts. Seven are RH-equivalent reformulations, five are partially related to existing theory, and two retain independent-novel classifications. The v70 overlay adds mathematical corrections without rewriting the historical v52 audit provenance.

## Vortex / bridge reserve research

The [vortex / bridge reserve lab](research/vortex-bridge-reserve/README.md) records the October–November 2026 continuation: finite scalar positivity through `t = log(1,000,000)`, fixed-window and prime-only audits, and a centered Vaughan/Möbius identity retaining its tail correction. The centered calculation now has interval enclosures for 23 parameter triples and 69 cutoff evaluations. It includes reproducible Python checks and an explicit list of unresolved arithmetic bounds. These finite certificates and research reductions do not prove RH or establish a new zero-free region.

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

Every prime `p` defines a harmonic oscillator with energy levels `E_k = k · log p`. Summing over excitations gives `H_p(s) = 1/(1 − p⁻ˢ)` — simultaneously a partition function (statistical mechanics) and a transfer function (circuit theory). Cascading all primes recovers the Euler product. The **twin-ladder system** pairs ζ(s) with the dual ladder ζ(1−s) coupled by a bridge χ(s) satisfying `|χ(½+it)|=1` on the critical line — but note this on-line unimodularity is *just the functional equation*, true whether or not RH holds.

> ⚠ **Honest correction (the circuit slogan is a heuristic, not a theorem).** The tempting statement "RH ⇔ the twin-ladder network is Darlington-lossless" does **not** hold rigorously. Darlington theory constrains transmission *zeros*, but for S₂₁(s) = ζ(2s)/ζ(s), a generic nontrivial zero ρ of the denominator produces a *pole* at ρ—not a transmission zero—unless a numerator zero cancels it. Off-line passivity, the only RH-strength reading, is itself equivalent to RH rather than an independent lever. The circuit picture is the **heuristic that generated** the model; the rigorous content lives in the **shift-bridge / de Branges layer** and must state any common-zero or coprimality hypothesis explicitly. See the [Project Results](#) and the systematic wall map for the remaining RH-hard objects.

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
