# zetaexplorer — the Twin-Ladder Λ Program

*An open research program approaching the Riemann Hypothesis on every axis — reducing the upper bound on the de Bruijn–Newman constant Λ, working the direct-RH routes and reformulations, proving no-go theorems that map where a proof cannot come from, machine-verifying the results, and tracking every other axis of the problem (the critical-line proportion, the spectral/geometric programs, the state of the wider field) — run by a human-directed autonomous AI fleet.*

[![status](https://img.shields.io/badge/status-active-brightgreen)]() [![commits](https://img.shields.io/badge/commits-10%2C700%2B-blue)]() [![routes](https://img.shields.io/badge/app-570%20routes-blue)]() [![tickets](https://img.shields.io/badge/queue-5%2C737%20tickets-blue)]() [![lean](https://img.shields.io/badge/Lean%204-20%20kernel--verified%20projects-6d55b8)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

The goal is RH itself. The sharpest measurable axis is the de Bruijn–Newman constant Λ (RH ⇔ Λ ≤ 0; with Rodgers–Tao Λ ≥ 0, RH ⇔ Λ = 0), so the Λ upper bound is the program's main quantitative frontier — but the approach is wider: 44 mapped routes across six areas (direct-RH reformulations, spectral and geometric programs, literature ports), a two-tier no-go landscape establishing which methods provably cannot work (knowing where the walls are is progress toward RH, not away from it), a Lean formalization pipeline, and the interactive web explorer documenting every calculation, route, and candidate as it evolves — with candidate, establishment, and peer-review status explicit everywhere.

> **Status as of 2026-11-20.** This project does not prove RH, and none of its bounds is refereed. Each line names the file that supports it.
> - `Λ ≤ 0.116091488672439`: conditional. It holds if three inputs that are not established hold: the zero-free half-plane `Re s > 7/8` (openai/math family 003; Lean proof rebuilt locally, standard axioms only; unrefereed), D. J. Raymond's decreasing-barrier chain (Zenodo 10.5281/zenodo.22867547; unrefereed), and this project's own floor and kernel tables, which are internal and partly uncertified. It also uses the Platt–Trudgian verified height. With the two external results and Platt–Trudgian only, the value is `0.118505710922701`. Draft of 9 October 2026; not submitted. Not an established bound. [`papers/lambda-qrh-0.116091/`](papers/lambda-qrh-0.116091/README.md)
> - `Λ ≤ 0.1758354`: computer-assisted candidate for an unconditional bound (revised mollifier + extended finite lane; four gates Arb-checked; the y-transfer reduction and Lemma B3 Lean-checked). **Unrefereed; not established.**
> - `Λ ≤ 0.1787854`: earlier computer-assisted candidate for an unconditional bound (compact slab + final-time half-strip + 3,149,013-row interval replay + exact Polymath weld), superseded as the smaller candidate by 0.1758354. Reviewed by Dan Romik; publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); **unrefereed; not established.** Package: [`dbn-lambda-01787854-candidate-audit`](https://github.com/judegomila/dbn-lambda-01787854-candidate-audit), tag `review-01787854-v3`.
> - Route P value `0.144997328111268` (conditional on Raymond's chain and the internal ledger): **unconfirmed below 0.145**. An independent re-certification confirmed 0 of the 36 floors on incomplete covers; without them the value is `0.145135157752420`. [`OBSTRUCTION_MAP.md`](research-checkpoints/rh-push-2026-11-16/fleet-lanes/OBSTRUCTION_MAP.md)
> - `Λ ≤ 0.14` is a **conditional completion contract, not a bound** (one open family, `|C_E,17| < 0.2797` on `690988 ≤ N ≤ 54799999`); `0.17759432` is a package value with open obligations, not a bound.
> - Third-party claims: D. J. Raymond, `Λ ≤ 0.107964910079` (depends on the unrefereed `7/8` half-plane), replayed and partially refereed here, **not verified** ([report](research-checkpoints/rh-push-2026-11-16/fleet-lanes/verify-0107965/VERIFICATION_REPORT.md)); the `Λ ≤ 0.1875` certificate package (Mosaic Intelligence, Zenodo), unrefereed, locally repaired and reproducible.
> - Zero-free half-plane: `Re s > 7/8` is Lean-checked (openai/math release of 2026-10-06, rebuilt locally; not peer reviewed). Preprints claim abscissae down to `0.874886647`; these are not in Lean and not checked here.
> - Direct attempts at RH (fifteen on 2026-11-01, and 196 lanes on 2026-11-16/17) all failed under internal referees. The failures are collected in one [obstruction map](research-checkpoints/rh-push-2026-11-16/fleet-lanes/OBSTRUCTION_MAP.md) with seven control functions that any valid argument must fail on.
> - Lean files added in November 2026: the multivariate Lee–Yang circle theorem (2 theorems, 407 lines) and the stage theorem (6 theorems, 292 lines), in an eight-file batch of 44 theorems and 2576 lines whose other six files are on other topics, and the Pick/Schur equivalence for the PR-48 residual target (29 theorems). None bears on whether RH is true.
> - The accepted bounds are unchanged by this project: `0 ≤ Λ ≤ 0.2` (Rodgers–Tao; Platt–Trudgian).
>
> The site is [exploreriemann.com](https://exploreriemann.com): the Observatory at `/observatory/` and the research pages at `/#/…`; the current status page is `/#/state-of-program`. This repository was created on 2026-11-20 from an earlier private repository; see [`docs/old-repository-map/`](docs/old-repository-map/README.md).

## Arithmetic theta geometry · 20 November 2026

The [research module](https://exploreriemann.com/#/rh-arithmetic-theta-geometry) presents version 0.2 of the geometric compression. It proves the finite frame and singular Schur identities, integral CM-minor separation, a packing bound without the source's extra support factor, and exact lattice cost accounting. The unrestricted lattice target is proved equivalent to the full-ray prime-ramp criterion; a specified arithmetic family still needs an independent cost estimate.

The [revised manuscript and full package](research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/README.md) include source, proofs, four exact checkers, a 47-declaration source map, a static inventory of the 175,187-file Main import closure, and an explicit proof-obligation register. The generic S76 supplier, the selected Main construction, the family constructor and the character-window endpoint are located at source-body level. **This is a conditional research compression, not an RH proof, external peer review, or a completed Lean replay.** The [earlier analytic manuscript and ladder refinement](research-checkpoints/rh-arithmetic-theta-2026-11-20/README.md) remain public dependencies.

**Research direction audit (2026-09-30):** prioritize the exact arithmetic positivity branch of the twin-ladder / Weil / Toeplitz–Krein program for direct RH work; retain freezing permutations as the quantitative Λ program. The audit corrects the pole-free criterion, pole sign, flow-blindness scope, and continuum-diagonal/Volterra claims. It supplies independent interval replays of the 0.90 and 0.96 payloads. A follow-up [two-prime certificate](formalization/paper/weil-two-prime-certificate-2026-09-30.md) covers support width 1.3 using interval finite sections and analytic bounds on the full complement. This is a local computer-assisted result, not RH or a refereed novelty claim.

Read the [audit and two-prime extension contract](formalization/paper/rh-direction-audit-2026-09-30.md).

The [all-support follow-up](formalization/paper/weil-all-support-attempt-2026-09-30.md) extends the local certificate to width **1.6**, with every contributing prime power (`2,3,4`). It derives an exact signed remainder identity at arbitrary width, but does **not** prove the inequality needed for RH. It also records why adding prime powers is not a positive update and why the current constant tail bound becomes too expensive to scale directly.


The [prime-5 extension](formalization/paper/prime5-extension-2026-09-30.md) certifies width **1.65** with gap **10⁻¹⁴**, retaining the new edge coupling exactly. Both 184-dimensional parity blocks pass at 512 bits with full complement bounds. A separately certified test shows that replacing the coupling by a crude collar penalty fails, although the full Weil form is positive on that test.

The [prime-7 extension](formalization/paper/prime7-extension-2026-10-01.md) now certifies width **2** with gap **10⁻²⁴** for smooth pole-free tests supported in (-1,1). It retains the exact four-node interactions of primes 5 and 7 and includes all contributing prime powers (`2,3,4,5,7`). Both 288-dimensional blocks pass a 768-bit interval congruence check with full complement bounds. Direct interval LDL was initially inconclusive; the successful check preserves all input uncertainty. The next prime-power-8 step has an eight-node decomposition and a verified baseline, but its full positivity remains uncertified. These are local results requiring independent review, not RH or formally verified theorems.

The [unbounded-support follow-up](formalization/paper/unbounded-support-translation-2026-10-01.md) derives an RH-equivalent growth criterion for **one fixed pole-free test and its two signed translates**. A subexponential bound on their interaction would suffice; that bound is **not proved**. The note gives the exact prime-power formula, its Laplace-transform proof, and a limitation of the current scalar-baseline method. Interval checks cover seven two-dimensional test spaces with separations 2 through 14; they do not enlarge the full-space width-2 certificate. Independent review of the reduction remains necessary.

The [energy and refinement attempt](formalization/paper/unbounded-support-energy-2026-10-01.md) isolates a one-sided bound on signed pairs of distinct prime powers; the diagonal already has an unconditional cubic bound. It derives a global weighted energy bound for **almost every multiplicative prime-sign twist**, but does **not** transfer that result to ordinary zeta's all-plus assignment. Exact refinement preserves the large-separation problem, and a sharp prime cutoff creates an exponential boundary artifact. Twelve rational/512-bit check groups cover these identities and continuous finite energy integrals through separation 6. The deterministic global bound and RH remain unproved; independent review is required.

The [all-plus completion attempt](formalization/paper/all-plus-recovery-attempt-2026-10-01.md) proves that the **raw uniform conditioning bound is false**, because its moving edge has exponentially growing energy even under RH. It constructs a centered recovery with an exact, checked endpoint identity, but does not prove its uniform bound. Any fixed positive sign bias retains the original deterministic mean; termwise absolute prime-pair bounds also grow exponentially. Nine rational/512-bit audit groups pass. These findings reject proposed shortcuts and correct the recovery target; they do not complete the proof or improve the unconditional growth exponent.

Reproduce:

```sh
npm run audit:rh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-route-i-certificate.py --self-test
python scripts/audit-route-i-certificate.py --certificate 090
python scripts/audit-route-i-certificate.py --certificate 096
python scripts/certify-weil-two-prime.py
python scripts/audit-weil-continuation.py
python scripts/certify-weil-window.py
python scripts/audit-prime5-blocks.py
python scripts/audit-prime5-collar.py
python scripts/certify-prime5-extension.py
python scripts/audit-prime7-blocks.py
python scripts/audit-prime7-acceptance.py
python scripts/certify-prime7-extension.py
python scripts/audit-unbounded-translation.py
python scripts/audit-unbounded-energy.py
python scripts/audit-all-plus-recovery.py
```

**Author:** Jude Gomila, with an AI fleet (Claude, Codex, ChatGPT) under human direction · **Live app:** `npm run dev` · **Papers:** `research-inputs/` (the consolidated twin-ladder paper, the permutation-architecture paper, the twistor framework note)

---

## What the program has established

| Result | Grade |
|---|---|
| Flow-blindness: an explicitly flow-stable class containing the Riemann profile cannot force all-real zeros | Conditional-class theorem (Rodgers–Tao input); application hypotheses must be checked |
| Frozen-rung ⟺ Platt–Trudgian: freezing the ladder rungs *is* the PT mechanism, capped at verified zero height | Theorem, Lean-verified components |
| The permutation atlas: every rearrangement family classified; isometries provably no-gain; the one possible-gain family merged (verified) with the weld ladder | Theorem + classification |
| Route map: distinguish exact reformulations, local certificates, numerical evidence, and open obligations | Research assessment; no universal impossibility theorem |
| Θ-trap flow invariants, heat-discriminant t_c, Route-B lim-sup (PCC/GUE-free), isolation-onset closed forms incl. `c* = √(2+√3)−1`, `c_glob = c_half` | Theorems, most Lean-verified |
| Ramanujan-reversal identity + row sum `R_n(1) = n^{n−1}` proved from scratch (Abel's binomial theorem + tree-function ODE built en route — theory mathlib lacks) | **Kernel-verified**, upgraded two open conjectures to theorems |
| The `[B_v,Π_p]` weld bracket driven 41× → the class sandwich `[0.2320723, 0.24502]`, now one copositivity certificate from its floor | Rigorous chain (refereed through continuation 19; newest stretch pending referee) |
| PT-floor audit: verified zero height is what binds `Λ ≤ 0.2`; the barrier-tightening class refuted as an approach | Audit, confirmed three ways |

**Machine verification:** 20 kernel-verified Lean 4 projects under `formalization/lean-aristotle/` (Harmonic Aristotle pipeline; every theorem on the three standard axioms; independent statement-faithfulness reviews). The verified general argument principle on rectangles, Abel's binomial theorem, tree-function ODE theory, and an IVT interlacing induction are PR-ready theory mathlib currently lacks.

**The discipline is the differentiator:** a corrections ledger of caught overclaims, paper-wins drafting passes that have caught 14+ spec errors before anything was quoted (including an essential hypothesis the paper's prose omitted, and a provenance gap in its numerical anchor), evidence grades on every claim, and `DEAD-END-FORNOW` rather than silent deletion. No false QED.

## The autonomous research fleet

A 24/7 multi-engine loop works a live improvement queue (5,737 tickets to date):

- **API pool** (parallel workers) + **Fable-5 frontier engine** (deep single-target runs; produced the 40+-theorem weld ladder) + **frontier scout** (ticket generation from sub-gaps)
- **Aristotle formalization pipeline** — 31+ jobs across 5 waves; drafting passes re-read the source before every submission; deliveries are files-only with provenance
- Independent referee panels on every engine-produced "rigorous" chain; partial-result and BLOCKED verdicts are first-class outcomes, reported as such
- Crash-checkpointing, orphan-commit salvage, worktree-isolated fanout, interval-arithmetic (Arb/FLINT, Rust `inari`) compute lanes

## The web explorer

```bash
npm install
npm run dev        # local
npm run build      # → dist/ (regenerates the live fleet-status snapshot)
```

570 routes in a warm editorial theme. The main pages:

| Route | What it is |
|---|---|
| `/atlas` | The approach map, fully broken out — all 44 routes inline across six areas |
| `/route-map` | The dense wall map: status + exact split point of every route |
| `/what-we-know` | The consolidated state + the two-tier **no-go landscape** (ours + the field's) |
| `/permutation-architecture` | The typed freeze calculus, the Λ ≤ 0.14 contract, the permutation + route atlases, the Lean verification record |
| `/state-of-field` | How the wider community approaches RH (2023–2026), cited, with engagement points |
| `/lambda-bounds`, `/lambda-timeline` | The evidence-graded Λ ledger and its history |
| `/critical-line-proportion` | The κ record (peer-reviewed 5/12; the external Claude/Anthropic ≥ 2/3 result, qualified) |
| `/viz-twistor-dual-intertwiner` | Flagship 3D: the Robinson congruence, its dual, the intertwiner, ζ on the fibers, fiber freezing |
| `/sign-switching` | Linked exact collision half-disk / modal diameter and full-kernel even-minus-odd energy identity; finite Ξ benchmarks, global inequality open |
| `/visualizations`, `/animations`, `/simulators` | 120+ visualization pages, 53 rendered films, 12 interactive simulators |
| `/engine-room`, `/improvement-queue` | Live fleet ops + the ticket queue |

The home page leads with **ζ itself, live** — domain coloring of the critical strip with the zeros as phase vortices and the twin-ladder interferometer across the σ ↔ 1−σ mirror. Even the 404 is a zeta plot.

## Repository layout

```
src/pages/            570 route pages (editorial theme)
src/data/             evidence-graded result modules with self-executing assertion tripwires
src/math/             evaluators (Riemann–Siegel, Borwein η, Euler–Maclaurin, model flows)
formalization/        Lean 4: lean-aristotle/ (20 verified projects), lean-mathlib-probe/, targets ledger
native/gate2-lane-a/  the C_E,17 native scanner (anchor-gated; see its README)
research-inputs/      the papers + delivered evaluator conventions (provenance-pinned)
rust/interval-rk4/    interval-arithmetic compute lane
scripts/              fleet engines, health gate, assertion sweeps, deploy publisher
```

Build-time discipline: `npm run build` runs a nav-link audit, bundle-size tripwires, and the site ships only through a browser-based health gate (all routes must render clean in real Chromium).

## Honest framing rules (enforced app-wide)

Functional language only; candidates are candidates until refereed; contracts are not bounds; internal drafts that didn't survive are "corrected/superseded," never implied publications; every numeric claim carries a grade and a tripwire; RH remains open.

**License:** MIT
