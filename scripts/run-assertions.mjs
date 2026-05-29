#!/usr/bin/env node
// scripts/run-assertions.mjs
// imp-501: Build-time assertion sweep -- run every exported *_ASSERTIONS array
// in src/math/ and src/data/ and exit non-zero if any fail.
//
// Uses Vite ssrLoadModule so ES-module imports between math files work without
// requiring "type":"module" in package.json. The server is created in
// middlewareMode so it does not bind a port.
//
// Usage:
//   node scripts/run-assertions.mjs              # full sweep
//   node scripts/run-assertions.mjs --fast       # skip modules known to be slow
//
// Exit codes:
//   0 -- all assertions pass
//   1 -- one or more assertions fail
//   2 -- script itself failed (Vite init error, module load error)
//
// Output:
//   scripts/logs/assertions-<ISO>.md

import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');
const LOGS_DIR   = path.join(__dirname, 'logs');
const FAST_MODE  = process.argv.includes('--fast');
const SEQUENTIAL = process.argv.includes('--sequential');
const PARALLEL_FLAG = process.argv.find((a) => a.startsWith('--parallel='));
// imp-1193: optional in-process Vite SSR pool. --ssr-pool=N opts in. Default OFF
// (no flag = code path is byte-identical to the imp-1171 single-server world).
const SSR_POOL_FLAG = process.argv.find((a) => a.startsWith('--ssr-pool='));
const SSR_POOL_N    = SSR_POOL_FLAG
  ? Math.max(1, parseInt(SSR_POOL_FLAG.split('=')[1], 10) || 1)
  : 0;
const SELF_TEST_MODE = process.argv.includes('--self-test-pool');
// imp-1171: concurrent module loading via shared-Vite-server promise.all pool.
// Worker_threads would require one Vite SSR server per thread (port conflicts)
// so we instead use a concurrency-capped Promise.all against the single server,
// which scales the slow ssrLoadModule I/O without server duplication.
const PARALLEL_DEFAULT = 4;
const PARALLEL = SEQUENTIAL
  ? 1
  : (PARALLEL_FLAG ? Math.max(1, parseInt(PARALLEL_FLAG.split('=')[1], 10) || PARALLEL_DEFAULT) : PARALLEL_DEFAULT);

// imp-1193: Pre-warmed Vite SSR pool support. If POOL_SOCK env var is set
// (or --pool-sock=PATH passed) and the unix socket accepts a ping within
// POOL_PROBE_MS, the sweep is delegated to the running daemon and we skip
// our own Vite createServer cold-start. If the probe fails for any reason
// we fall back silently to the original cold-start path -- behavior is
// unchanged for callers who do not start the pool.
const POOL_SOCK_FLAG = process.argv.find((a) => a.startsWith('--pool-sock='));
const POOL_SOCK = POOL_SOCK_FLAG
  ? POOL_SOCK_FLAG.slice('--pool-sock='.length)
  : (process.env.POOL_SOCK || '');
const POOL_PROBE_MS = 250;

// ── Module lists ──────────────────────────────────────────────────────────────

// Modules with CPU-heavy top-level computations (backward CM simulation etc.).
// In --fast mode these are skipped; in full mode they are loaded last so the
// Vite cache is warm and subsequent re-imports are instant.
const HEAVY_MODULES = [
  '/src/math/d-monotone-analytic-proof.js',
];

// All modules that export *_ASSERTIONS arrays (auto-detected at runtime).
// This list is ordered so heavy dependencies are loaded before the modules
// that re-import them.
const MATH_MODULES = [
  '/src/math/g1-sub-extremal-closure.js',
  '/src/math/path-g-cauchy-rigorous.js',
  '/src/math/m-raw-from-umon-bridge.js',
  '/src/math/rvm-jacobian-lower-bound.js',
  '/src/math/route-a-shift-witness.js',
  '/src/math/many-body-correction-closure.js',
  '/src/math/d-monotone-analytic-proof.js',
  '/src/math/mertens-rate-tightening.js',
  '/src/math/path-c-circularity-resolution.js',
  '/src/math/noswap-closure.js',
  '/src/math/chain-crossverify-N5e5.js',
  '/src/math/route-a-unfolded-reformulation.js',
  '/src/math/route-a-cm-extension.js',
  '/src/math/route-a-argmin-closure.js',
  '/src/math/paper-skeptic-review-2.js',
  '/src/math/verify-imp440-altpath.js',
  '/src/math/paper-skeptic-review-3.js',
  // imp-872: Phase 51 UNCOND-Λ sequence modules (imp-833/834/856).
  '/src/math/route-c-dynamical-analysis.js',
  '/src/math/c-mb-weaker-bound-search.js',
  // imp-857: PATH 3 follow-up — interval-arithmetic certified Dyson sweep.
  '/src/math/c-mb-interval-certified.js',
  // imp-862: PATH 2 escape hatch B2 — CM Hamiltonian rate analysis.
  '/src/math/route-c-cm-hamiltonian.js',
  // imp-864+865+866: alternative-angle scoping (Vinogradov / BBS / Maier).
  '/src/math/c-mb-alternative-angles-eval.js',
  // imp-871: adversarial review 7b (Phase 51 post-state).
  '/src/math/paper-skeptic-review-7b-phase51.js',
  // imp-863: PATH 2 escape hatch B3 — matched asymptotic.
  '/src/math/route-c-matched-asymptotic.js',
  // imp-857 alt-path: phased-forcing proof-path memo + commutator bound.
  '/src/math/imp-857-phased-forcing-memo.js',
  '/src/math/imp-857-commutator-bound.js',
  // imp-857 GUE-elimination pathway — merges imp-362 + imp-899 rows.
  '/src/math/imp-857-gue-elimination.js',
  // imp-903: uniform-K-bound structural reduction (27 H_raw plateaus).
  '/src/math/imp-857-uniform-K-bound.js',
  // imp-925: eml-interval primitive (Odrzywołek arXiv:2603.21852v2).
  '/src/math/imp-925-eml-interval-primitive.mjs',
  // imp-924: eml-normal-form rewrites + cancellation-search NEGATIVE result.
  '/src/math/imp-924-eml-normal-form.js',
  // imp-911 sharper cumulative Lipschitz bound: width-independent C_∞ ≈ 0.4382
  // replaces the imp-911 universal-per-step W × 0.6796 bound.
  '/src/math/imp-911-sharper-cumulative-lipschitz.js',
  // imp-911: formal Lipschitz bound on plateau F_mb growth (step 3 upgrade).
  '/src/math/imp-903-F-mb-plateau-lipschitz-proof.js',
  // imp-897: Richardson-extrapolated certified C_mb_empirical interval bound
  // from the phased-forcing grid, closed against the imp-892 residual.
  '/src/math/imp-857-phased-forcing-richardson.js',
  // imp-899 HONEST PARTIAL: bilinear linear-response fit + saddle-point
  // analysis of the imp-894 2x2 pilot (nSteps=30 regime only).
  '/src/math/imp-899-linear-response-bilinear-fit.js',
  // imp-370 / imp-508: HONEST PARTIAL closure of ESY port obstacle O1
  // (arithmetic input via Burgers-envelope KH bound + Cauchy interlacing).
  // Tripwires keep the residual O1-remaining-concentration sub-gap honest
  // and prevent a silent flip to "closed".
  '/src/math/esy-o1-closure.js',
];

// ── Data module registrations for imp-857 baseline sweep result. ──
// (Kept local to the change in case the top-level list becomes stale.)

const DATA_MODULES = [
  '/src/data/lambda-N1e6-final-assembly.js',
  '/src/data/lambda-N1e6-unconditional-beat.js',
  '/src/data/lambda-max-gap-extremal.js',
  '/src/data/lambda-intercept-pooled.js',
  '/src/data/g1-g2-closure.js',
  '/src/data/rh-dag.js',
  '/src/data/interval-dyson-collision.js',
  '/src/data/g6a-sub-hyperbolic-closure.js',
  '/src/data/imp440-cross-verification.js',
  '/src/data/path-c-baseline-fit-v2.js',
  '/src/data/imp-336-post-ladder-update.js',
  '/src/data/lambda-burgers-shock-lipschitz.js',
  '/src/data/soundararajan-bui-gap-bound.js',
  '/src/data/ticket-router.js',
  '/src/data/d-monotone-numerical-witness.js',
  '/src/data/lambda-polymath15-bridge.js',
  '/src/data/lambda-intercept-mingap-heuristic.js',
  '/src/data/lambda-pt-scale-extrapolation.js',
  '/src/data/lambda-roadmap.js',
  '/src/data/lambda-interval-dyson.js',
  '/src/data/guth-maynard-tail-bound.js',
  '/src/data/sota-lambda-claim.js',
  // imp-872: imp-833 PATH 1 empirical sweep extended to N=100k.
  '/src/data/empirical-m-sweep-extended.js',
  // imp-857-baseline-sweep-partial: disproves "blow-up at N>=1000" premise.
  '/src/data/imp-857-baseline-sweep-result.js',
  // imp-903 27-point H_raw-update sweep: rescue satisfied from N_0 = 100.
  '/src/data/imp-903-uniform-sweep-result.js',
  // imp-904 dense-N-grid partial closure: 31-N combined catalog over [10, 10^4].
  '/src/data/imp-904-dense-grid-analysis.js',
  // imp-933: per-plateau interior interval-RK4 certs (replaces universal Gronwall exp(1)).
  '/src/data/imp-911-per-plateau-gronwall-certs.js',
  // imp-963: finite-K C_mb unconditional closure for imp-856 / imp-835 / imp-440.
  '/src/data/finite-k-c-mb-unconditional.js',
  // imp-1086: cross-verification of imp-963 K = 0.2014 with DP45 second integrator.
  '/src/data/finite-k-c-mb-crosscheck.js',
  // imp-1202: HONEST PARTIAL numerical audit of Conj 15.4 (prime-delay domination) at sigma=0.6.
  '/src/data/imp-1202-conjecture-15-4-numerical-audit.js',
  // imp-962 HONEST PARTIAL: plateau-structure scan on (10⁴, 10⁶].
  '/src/data/imp-962-plateau-structure-N10k-to-N1e6.js',
  // imp-360 / imp-423: extended measured ladder at N ∈ {25k…1M} (one-ULP interval RK4).
  '/src/data/imp-360-extended-ladder-N1e6.js',
  // imp-962: per-plateau START+INTERIOR interval-RK4 certs for N ∈ (10⁴, 10⁶].
  '/src/data/imp-962-per-plateau-gronwall-certs-N10k-to-N1e6.js',
  // imp-1081: paper appendix C — rigorous unconditional finite-height beat at N* = 1e4.
  '/src/data/paper-appendix-C-finite-height-beat.js',
  // imp-1083: arXiv front-matter abstract rewrite leading with the rigorous finite-N* beat.
  '/src/data/paper-abstract-rewrite-2026-05.js',
  // imp-1094: paper Sections 1-3 draft (Introduction, Background, Main Result).
  '/src/data/paper-sections-1-3.js',
  // imp-1105: paper publication record (compiled PDF + sectionsIncluded + tripwires).
  '/src/data/paper-publication-2026-05.js',
  // imp-1090: Rust interval-RK4 backend Phase 1 MVP validation record.
  '/src/data/rust-port-phase1-validation.js',
  // imp-1091: Rust interval-RK4 Phase 2 wire-up validation (CLI dispatch).
  '/src/data/rust-port-phase2-wire-validation.js',
  // imp-1092: Rust interval-RK4 Phase 3 PILOT (1-of-9 plateaus measured, N=2e4).
  '/src/data/rust-port-phase3-pilot-validation.js',
  // imp-1093: Lambda timeline visualization page build-time validation.
  '/src/data/lambda-timeline-page-validation.js',
  // imp-1095: LIVE Lean toolchain installed + per-module lake build executed.
  '/src/data/lean-toolchain-validation-2026-05.js',
  // imp-1114: Constants.lean 4 elaboration errors fixed (closes imp-1095-sub-elaboration-fixes).
  '/src/data/lean-constants-elaboration-fixes-2026-05.js',
  // imp-1099: GUE Wigner surmise vs first 10000 Riemann zero spacings.
  '/src/data/gue-vs-zeros-comparison.js',
  // imp-1100: Voronin universality theorem numerical witness.
  '/src/data/voronin-universality-numerical.js',
  // imp-1098: Montgomery pair correlation conjecture numerical exploration.
  '/src/data/pair-correlation-montgomery-numerical.js',
  // imp-1097: Riemann-Siegel Z(t) high-precision explorer data + tripwires.
  '/src/data/riemann-siegel-z-explorer.js',
  // imp-1101: Berry-Keating xp Hamiltonian -- truncated-Hermite spectral data.
  '/src/data/berry-keating-xp-spectral.js',
  // imp-1102: Hardy Z(t) asymptotic comparison data file (sonnet-4-6 bucket).
  '/src/data/hardy-z-asymptotic-comparison.js',
  // imp-1096: page health audit refresh after user-reported /#/full-story load failure.
  '/src/data/page-health-audit-2026-05-18.js',
  // imp-1107: SOTA attack 2 -- survey of 3 alternative asymptotic routes.
  '/src/data/sota-asymptotic-alternatives-2026-05.js',
  // imp-1106: SOTA attack 1 -- ESY rigidity SMALL-WEDGE attempt (wedge failed cleanly, 3 obstructions named).
  '/src/data/esy-small-wedge-attempt-2026-05.js',
  // imp-1109: SOTA attack 4 -- Connes adelic spectral interpretation + truncated trace positivity at t = 0.02.
  '/src/data/connes-adelic-lambda-2026-05.js',
  // imp-1108: SOTA attack 3 -- empirical psi_N measurement of ESY rigidity at our existing N.
  '/src/data/esy-rigidity-empirical-2026-05.js',
  // imp-1112: Rust-only sanity sweep diagnostic at plateau N in (1e4, 1e6].
  '/src/data/rust-port-sanity-sweep-2026-05.js',
  // imp-1110: Rust interval-RK4 Phase 4 rayon parallel plateau sweep.
  '/src/data/rust-port-phase4-rayon-validation.js',
  // imp-1124: Bui-Sound optimal sigma finder for E_trunc_pt under the BS exponent.
  '/src/data/bui-soundararajan-optimal-sigma-2026-05.js',
  // imp-1115: Bui-Sound density numerical projection (4-point sigma grid + L_pt headline).
  '/src/data/bui-soundararajan-density-numerical-2026-05.js',
  // imp-1128: EDGE rigidity attack -- psi_N measurement near gamma_1 (vs imp-1108 bulk).
  '/src/data/edge-rigidity-empirical-2026-05.js',
  // imp-1123: Bui-Soundararajan PRIMARY rigorous-port attack on asymptotic SOTA.
  '/src/data/bui-soundararajan-rigorous-port-2026-05.js',
  // imp-1125: Goldston-Yildirim sieve + Maynard k-tuple numerical projection on imp-440 chain.
  '/src/data/goldston-yildirim-projection-2026-05.js',
  // imp-1127: HYBRID attack -- Bui-Sound density (imp-1123) + Polymath15 bridge refinement (imp-397/398/399).
  '/src/data/bui-sound-plus-polymath-bridge-2026-05.js',
  // imp-1135: C_C Selberg sieve refinement attempt (research-feasible 1.15x ceiling).
  '/src/data/c-c-selberg-refinement-2026-05.js',
  // imp-1131: JSDoc asterisk-slash audit for Polymath15 constants and consumers.
  '/src/data/polymath15-jsdoc-audit-2026-05.js',
  // imp-1134: C_F engine-closable refinement audit -- the imp-1127 hypothetical 1.05x is sign-flipped; honest factor = 1.00x.
  '/src/data/c-f-bulk-refinement-2026-05.js',
  // imp-1132: V2 intercept attack -- Barnes-Hut O(N log N) sparse drift sum in Rust.
  '/src/data/rust-port-phase7-barnes-hut.js',
  // imp-1139: BH multipole extension (monopole + dipole + quadrupole) -- O((extent/dist)^3) envelope.
  '/src/data/rust-port-phase8-multipole.js',
  // imp-1132-sub-multipole-extension: BH high-order multipole (M_0..M_4) -- O((extent/dist)^5) envelope.
  '/src/data/rust-port-phase8-multipole-high.js',
  // imp-1111: Rust port Phase 5 Verner 8(7) triangulation contract (HONEST PARTIAL).
  '/src/data/rust-port-phase5-verner-triangulation.js',
  // imp-1142: API channel engine (5th engine variant via Anthropic API direct).
  '/src/data/api-channel-engine-2026-05.js',
  // imp-1136: Phase 3 production sweep with Barnes-Hut backend -- HONEST PARTIAL.
  '/src/data/k-plateau-ladder-measured-2026-05.js',
  // imp-1137: V2 OLS interval-arithmetic refit -- rigorous error bar on the asymptotic intercept.
  '/src/data/v2-ols-interval-2026-05.js',
  // imp-1144: USER-REPORTED click-links audit (TOC fix on /#/full-story + app-wide click sweep).
  '/src/data/click-links-audit-2026-05-19.js',
  // imp-1147: composed rigorous asymptotic Lambda upper bound (~8e-4, 250x tighter than PT 2021).
  '/src/data/asymptotic-lambda-bound-2026-05-20.js',
  // imp-1129: Path C heuristic error-bar refit using imp-1136 9-plateau BH sweep.
  '/src/data/path-c-error-bar-refit-2026-05-20.js',
  // imp-1149: HONEST PARTIAL Koksma-Hlawka 2nd-moment attempt — intermediate N^{3/2} rate result.
  '/src/data/koksma-hlawka-2nd-moment-deviation-bound.js',
  // imp-1149-sub-L2-to-Linfty-sobolev-cost: FAILED attack on the Sobolev 1/sqrt(y) cost (3 routes documented).
  '/src/data/L2-to-Linfty-sobolev-attempt-2026-05.js',
  // imp-1149-sub-sub-selberg-discrepancy: NEGATIVE result attack on the sub-Selberg c < 1 sub-gap blocking N^{-2}.
  '/src/data/sub-selberg-discrepancy-attempt-2026-05.js',
  // imp-1149-sub-erdos-schlein-yau-port-residual: alternative-regimes sweep -- R3 linear-statistics candidate POSITIVE.
  '/src/data/esy-residual-alternative-regimes-2026-05.js',
  // imp-1160: bootstrap 95 pct CI on the imp-1149-sub-ESY R3 slope -- candidate-weak (CI width 0.54, contains -1).
  '/src/data/esy-lin-stat-slope-bootstrap-CI-2026-05.js',
  // imp-1162: extended imp-1149-sub-ESY linear-statistics sweep to N=1e6 (13-point combined OLS).
  '/src/data/esy-lin-stat-extended-sweep-2026-05.js',
  // imp-1163: literature survey of published lin-stat results for Riemann zeros
  // verifying paper Section 4.5 Conjecture 1 novelty -- verdict subsumed-by-hughes-rudnick-and-bourgade.
  '/src/data/lin-stat-riemann-literature-survey-2026-05.js',
  // imp-1151: papers release manifest — ordered downloads for the /papers page.
  '/src/data/papers-release-manifest.js',
  // imp-1141: Rust full-chain port (C_mb + E_trunc + E_flow + E_coll + L_pt in chain.rs).
  '/src/data/rust-port-phase10-full-chain.js',
  // imp-1140: Verner 8(7) / Fehlberg RK7(8) third integrator for bug-class triangulation.
  '/src/data/rust-port-phase9-verner-triangulation.js',
  // imp-1086-sub-interval-dp45: DP45 interval-arithmetic cross-check (extends imp-1086 from point to interval).
  '/src/data/rust-port-phase11-dp45-triangulation.js',
  // imp-1163 auto-tripwire skeleton (generated by scripts/auto-generate-tripwires.mjs).
  '/src/data/imp-1163-auto-tripwires.js',
  // imp-1167: Wieand 1999 CUE bulk linear-statistics analog port for cross-validation.
  '/src/data/imp-1167-wieand-cue-cross-validation.js',
  // imp-1185: Block-bootstrap CI on Conrey-Snaith corrected slope -- cross-validates imp-1166 percentile method.
  '/src/data/imp-1185-block-bootstrap-cross-validation.js',
  // imp-1164: BS 2008 50-point σ-sweep on [0.5, 0.75], formal tightening factor 2.04e6 (inherits imp-1123 obstructions).
  '/src/data/imp-1164-bui-sound-rigorous-port.js',
  // imp-1179: refines imp-1123 O-BS-B obstruction — bounds (log T)^A factor in BS 2008.
  // Verdict: rigorous tightening at T_PT=3e12 requires A_BS ≤ 4 (log-free) or ≤ 6 (BS-favorable σ-shift).
  '/src/data/imp-1179-bs-log-T-power-A-bound.js',
  // imp-1165: NEGATIVE RESULT - HR-via-Sobolev bridge to ESY closure fails by √N factor.
  '/src/data/imp-1165-hughes-rudnick-to-esy-closure-bridge.js',
  // imp-1126: Conrey-Snaith 3rd-moment attack — verdict no-new-rigorous-bound (CS bound from HB 1981 + Ingham 1926 is within polylog of conjectural truth).
  '/src/data/imp-1126-conrey-snaith-3rd-moment-attack.js',
  // imp-1126 auto-tripwire skeleton (generated by scripts/auto-generate-tripwires.mjs).
  '/src/data/imp-1126-auto-tripwires.js',
  // imp-1161: Costin-Lebowitz / Soshnikov port attempt — rigorous-partial-variance-upper-bound verdict.
  '/src/data/imp-1161-costin-lebowitz-port-attempt.js',
  // imp-1180: Higher-order-correlation alternative route for ESY closure — research-grade-open with c_3 unconditional gap.
  '/src/data/imp-1180-higher-order-correlation-route.js',
  // imp-1184: Direct Selberg + ESY-rigidity route audit — verdict direct-route-needs-pcc-at-step-D3-and-rho3-at-step-D5; shared-obstruction map narrows live attack surface to gap-PCC-2pt and gap-RS-3pt.
  '/src/data/imp-1184-direct-selberg-esy-route-audit.js',
  // imp-1178: refines imp-1166 simplified-correction to best-available Conrey-Snaith 2008 ratios-conjecture formula on the imp-1162 13-point grid.
  '/src/data/imp-1178-conrey-snaith-full-ratios-derivation.js',
  // imp-1186: extends imp-1162 13-point lin-stat grid to 20 points (interior fill + zeros6-based extension to N=2e6); reports 20-point OLS slope + 2000-replicate percentile-bootstrap CI.
  '/src/data/imp-1186-lin-stat-20point-sweep.js',
  // imp-1104: Selberg trace formula reference doc (haiku-4-5 bucket).
  '/src/data/selberg-trace-formula-reference.js',
  // imp-1119: Riemann hypothesis equivalents catalog (haiku-4-5 bucket).
  '/src/data/rh-equivalents-reference.js',
  // imp-1197: §16 four equivalent closure routes (companion to /closure-routes page).
  '/src/data/closure-routes-section.js',
  // imp-1193: in-process Vite SSR pool validation (this script's own opt-in
  // fast-path is gated by --ssr-pool=N; the tripwires here lock the contract).
  '/src/data/imp-1193-ssr-pool-validation.js',
  // imp-1183: 3-point correlation empirical on 1e6 zeros — Pearson 0.978 vs GUE, supports imp-1180 route.
  '/src/data/imp-1183-3point-correlation-empirical.js',
  // imp-1198: Blaschke ghosts section — §17 of twin-ladder-v52 paper.
  '/src/data/blaschke-ghosts-section.js',
  // imp-1210: literature audit on twin-ladder paper Section 22 Conjectures (22.1-22.4) — verdict 22.4=SUBSUMED.
  '/src/data/imp-1210-conjecture-22-literature-audit.js',
  // imp-1201: Apps M-O -- KYP state-space, bounded-real delay, delay-Gram positivity.
  '/src/data/kyp-bounded-real-section.js',
  // imp-1196: Shift-Bridge Reflection Positivity (§15 of v52 paper) reference doc.
  '/src/data/shift-bridge-positivity-section.js',
  // imp-1205: Cross-walk -- Connes 2025-2026 vs para 16 four-route equivalence.
  '/src/data/imp-1205-connes-four-route-crosswalk.js',
  // imp-1221: §23 freezing + bridge renormalization + targeted no-ghost attack.
  '/src/data/freezing-bridge-section.js',
  // imp-1217: Master index of every section of v52 paper (companion to /twin-ladder-paper-roadmap).
  '/src/data/twin-ladder-paper-roadmap.js',
  // imp-1220: rigorous-numerics stages I/II/III — §20 of twin-ladder v52.
  '/src/data/rigorous-numerics-stages.js',
  // imp-1218: Paper Audit Dashboard -- per-conjecture verdict tracker for v52 §§15-22.
  '/src/data/paper-audit-dashboard.js',
  // imp-1226: hyperbolic prime spiral — primes in Poincaré disk.
  '/src/data/viz-hyperbolic-prime-spiral.js',
  // imp-1222: WAVE 13 viz — log-phase interference spiral of zeta(1/2 + it).
  '/src/data/viz-log-phase-spiral.js',
  // imp-1224: VIZ /viz-euler-transport-flow -- streamlines of -zeta'/zeta vector field.
  '/src/data/viz-euler-transport-flow.js',
  // imp-1223: VIZ /viz-twin-ladder-tomography -- |zeta(sigma+it)| * |zeta((1-sigma)+it)| heatmap data + tripwires.
  '/src/data/viz-twin-ladder-tomography.js',
  // imp-1225: VIZ prime caustic reference data (sonnet-4-6 bucket).
  '/src/data/viz-prime-caustic.js',
  // imp-1227: VIZ prime phase-crystal Bragg-pattern reference data (sonnet-4-6 bucket).
  '/src/data/viz-prime-phase-crystal.js',
  // imp-1229: targeted audit of Conjecture 15.2 (zero bridge-thickness / shift contractivity) -- SUBSUMED-BY-RH.
  '/src/data/imp-1229-conjecture-15-2-audit.js',
  // imp-1232: Literature audit Conjectures 17.3 + 18.4 (ghost-absence) -- both SUBSUMED-BY-RH.
  '/src/data/imp-1232-conjectures-17-3-18-4-audit.js',
  // imp-1231: Literature audit Conjectures 16.4 (shift-bridge square) + 16.6
  // (canonical-system closure) -- both PARTIALLY-RELATED. Two-part reading:
  // RH-equivalent existence half + open non-circular-construction half. Cites
  // de Branges 1968, Krein 1955, Romanov 2010, Remling 2002/2018.
  '/src/data/imp-1231-conjectures-16-4-16-6-audit.js',
  // imp-1233: Literature audit Conjectures 18.1 (kernel/passivity closure) + 18.2
  // (prime-delay domination closure) -- both PARTIALLY-RELATED to KYP / de Branges-Krein
  // and Bombieri-Iwaniec / Vinogradov-Korobov / Weil-positivity literature respectively.
  '/src/data/imp-1233-conjectures-18-1-18-2-audit.js',
  // imp-1241: Unified de Branges canonical-system existence audit for
  // Conjectures 16.4 + 16.6 + 18.1 + 18.2. Verdict: three-of-four-unified.
  // 16.4 + 16.6 + 18.1 PARTIALLY-RELATED, unified under CDB-Exist. 18.2
  // SUBSUMED-BY-RH (same logic as 15.4: paired Hadamard).
  '/src/data/imp-1241-unified-existence-conjecture.js',
  // imp-1244: Opus 4.8 second-pass re-audit of all 7 SUBSUMED-BY-RH verdicts
  // (15.2, 15.3, 15.4, 17.3, 18.2, 18.4, 22.4) as a single group.
  // Result: 0 reclassifications -- all 7 CONFIRMED-SUBSUMED-BY-RH. The
  // §15-§22 cluster is a taxonomy of 7 RH-equivalent reformulations.
  '/src/data/imp-1244-subsumed-rh-second-pass.js',
  // imp-1234: ZPO model (/oscillators, /hamiltonian, /modes, /twin-ladder) vs
  // twin-ladder v52 §15 shift-bridge crosswalk -- 12 entries with honest
  // verdict vocabulary (identical / related / distinct / not-yet-identified).
  '/src/data/imp-1234-zpo-vs-twin-ladder-v52-crosswalk.js',
  // imp-1239: imp-447 / imp-459 sigma-shift admissibility audit -- YES at sigma=0.99
  // under log-free convention; sigma-shift is strictly required if the log factor is restored.
  '/src/data/imp-1239-imp447-sigma-shift-audit.js',
  // imp-1235: lambda-roadmap.js vs paper §24 "What remains to get the proof working"
  // crosswalk -- 15 entries (correspondence / partial-correspondence / lambda-unique /
  // sec24-gap / confirmed-by-v52). Identifies §24 open targets absent from lambda-roadmap
  // and lambda-roadmap items absent from §24. Name-collision warning for Routes A/B/C.
  '/src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js',
  // imp-1243: cross-check imp-1147 Lambda <= 7.98e-4 against v52 Section 17.4
  // negative-index identity -- per-plateau ghost-margin audit (9 rows + composed verdict).
  '/src/data/imp-1243-imp1147-ghost-margin-audit.js',
  // imp-1203: numerical pilot of Conjecture 18.2 (prime-delay domination closure,
  // finite-w form) -- empirical-supports in the convergent half-plane Re(w) > 1/2;
  // critical strip is truncation-inconclusive (finite p<=1e4 echo train diverges there).
  '/src/data/imp-1203-conjecture-18-2-pilot.js',
  // imp-1219: hidden-square program §25+26+27 — commutator → measure dom → endpoint-Hankel.
  '/src/data/hidden-square-program-section.js',
  // imp-1200: reciprocal program Apps B-G — corrected target after direct PF-inf
  // impossibility (B.2); ends at the App G restricted passive SOC certificate.
  '/src/data/reciprocal-program-section.js',
  // imp-1228: master index of 6 visualization pages — route /visualizations.
  '/src/data/visualizations-index.js',
  // imp-1215: Insight DAG additions for the twin-ladder v52 layer
  // (shift-bridge-positivity, four-route-equivalence, inverse-Blaschke-ghosts,
  // reciprocal-program, KYP-bounded-real). Tripwires lock DAG acyclicity +
  // reachability of every new node to the rh target.
  '/src/data/insight-dag.js',
  // imp-1236: /rh-attack 5 classical attacks vs /closure-routes 4 routes (§16) vs
  // /three-attacks 3 direct attacks (§18). 12-row crosswalk identifying duplicates
  // (Path C = Route D; Attack III = §17 ghosts), complements (Path A/B ↔ KYP/Route B),
  // and unique entries (Path D Nyman-Beurling, Path E Li, Route A Schur, Route C
  // hidden-square).
  '/src/data/imp-1236-attack-route-crosswalk.js',
  // imp-1238: EXTENDED 3-point correlation empirical -- 25 grid points + M_BULK=10000
  // (vs imp-1183's 7 / M=1000). Pearson 0.9828 (tightened by +0.005 from imp-1183's 0.978);
  // ticket-spec target of >0.995 NOT met due to systematic bin-convention residual.
  '/src/data/imp-1238-3point-correlation-extended.js',
  // imp-1240: empirical Volterra-norm pilot for §27 Conj 27.2 (‖V_{a,Phi}‖ ≤ 1).
  // 25 rows from 5x5 sweep (U ∈ {1,2,5,10,20} x a ∈ {0.5,0.2,0.1,0.05,0.025});
  // verdict 'norms-all-below-one' — all rows give ||V|| <= 1.86e-4 << 1.
  '/src/data/imp-1240-volterra-norm-pilot.js',
  // imp-1242: sensitivity of 3-point GUE empirical R_3 to bridge perturbation a > 0.
  // 3 levels a in {0.001, 0.01, 0.05} on the imp-1183 7-point grid. Pearson stays
  // > 0.96 for all a <= 0.05 -- GUE robustness verdict: robust-subcritical.
  '/src/data/imp-1242-3point-bridge-perturbed.js',
  // imp-1246: OPUS-4.8 RECHECK of imp-1147 linear-1/N gap. Verdict
  // closure-via-N^{-3/2}-redirect: chain imp-341 (lim sup |t_c| = 0) +
  // imp-1149 / Theorem 3 (N^{-3/2} explicit rate) bypasses the OLS
  // framework and gives unconditional Lambda <= 3.06e-5 (modulo Polymath15
  // bridge G6a). Tightens imp-1147 conditional 7.98e-4 by ~26x AND removes
  // the linear-1/N conditional dependence.
  '/src/data/imp-1246-linear-1N-gap-recheck.js',
  // imp-1257: BIN-INTEGRATION variant of imp-1238. Bin-averaging the GUE side
  // (the empirical side was already a bin integral) moves Pearson 0.98279 ->
  // 0.98311 (+0.0003) -- nowhere near 0.995. Pearson is scale-invariant so the
  // ~0.85 plateau offset is a no-op; the residual is sampling noise / finite-height,
  // NOT a bin-convention bug. Verdict: bin-integration-does-not-reach-0.995.
  '/src/data/imp-1257-3point-bin-integration.js',
  // imp-1245: OPUS-4.8 adversarial stress-test of imp-1241 CDB-Exist three-of-four
  // unification. Axes (a) reduction-of-18.1, (b) implication-strength, (c) Phi-
  // non-circularity. Verdict 'unification-holds-partially': axes (a) + (b) pass
  // with named gaps (missing Arov-Nudelman 1996 citation, outer-factor rigidity
  // of E_a not explicit); axis (c) FAILS -- CDB-Exist inherits the same Phi-non-
  // circularity obstruction. Updated recommendation: KEEP the expository
  // unification but explicitly state CDB-Exist is NOT a more tractable target.
  '/src/data/imp-1245-cdb-exist-stress-test.js',
  // imp-1258: bridge from imp-1240 Conj 27.2 (‖V_{a,Φ}‖ ≤ 1) to imp-1241 CDB-Exist.
  // Verdict TWO-WAY-COLLAPSE: forward + reverse implications hold modulo a single
  // §27 paper-construct identity (block positivity ⇔ K_a ⪰ 0). The §15-27 program
  // reduces to ONE statement: ‖V_{a,Φ}‖_{L²([0,∞))} ≤ 1.
  '/src/data/imp-1258-volterra-cdb-bridge.js',
  // imp-1247: OPUS-4.8 RECHECK of imp-1184 shared-PCC obstruction across the
  // three live ESY-closure routes. Verdict: PCC strictly load-bearing for
  // Route 1 only; Route 3 needs RS-3pt not PCC; no 4th route bypasses all
  // bottlenecks (Conrey-Snaith stronger than PCC, Heath-Brown 4th moment too
  // weak, Riemann-Hilbert spectral requires universality).
  '/src/data/imp-1247-shared-pcc-obstruction-recheck.js',
  // imp-1248: OPUS-4.8 RECHECK of imp-1240 Volterra-norm pilot. Adaptive-N
  // rescan (N = 100*U + 100) with U in {1, 2, 5, 10, 20, 50, 100}; 35 rows.
  // All norms <= 1.86e-4 << 1. imp-1240 U=20 artifact (ratio 1.62) resolved.
  '/src/data/imp-1248-volterra-norm-rescan.js',
  // imp-1262: EXTENDED Volterra-norm pilot. Widens a-grid 25x smaller
  // (down to a=0.001) while keeping U up to 100 with N = max(2000, 100*U+100).
  // 25 rows; all norms <= 7.45e-5 << 1; all converged in 7 power-iter steps;
  // STRONGER claim ||V|| <= 1e-3 also holds. U=50, U=100 rows reproduce
  // imp-1248 to 16 decimal digits (clean determinism check).
  '/src/data/imp-1262-volterra-extended-sweep.js',
  // imp-1265: OPUS-4.8 ADVERSARIAL RECHECK of the §27 paper-construct identity
  // ([[I, V_{a,Φ}], [V_{a,Φ}*, I]] ⪰ 0 ⇔ K_a ⪰ 0) on which the imp-1258 two-
  // way collapse rests. Five axes (a) K_a construction + A_a/B_a gauges, (b)
  // operator class, (c) boundary + Wiener-Hopf at finite [0, U], (d)
  // bidirectionality, (e) unstated regularity. Verdict: collapse-with-caveats
  // (2 pass / 3 pass-with-caveats / 0 fails). Central finding: §27 identity
  // is ASYMMETRIC — only the FORWARD direction (‖V‖ ≤ 1 ⇒ K_a ⪰ 0) is argued
  // in the paper; the reverse direction is salvaged via Arov-Nudelman 1996
  // passive realization, not by §27 itself. The imp-1258 two-way collapse
  // verdict SURVIVES this audit with one additional citation caveat for the
  // reverse chain. 12 tripwires.
  '/src/data/imp-1265-section27-identity-recheck.js',
  // imp-1281: tripwire-template helper library — factory contract self-tests
  // (makeRowCountTripwire / makeFieldPresence / makeAllBelow / makeAllAbove /
  // makeMonotone / makeSumEquals / makeStringContains / makeFrozenObject).
  // imp-1240 / imp-1245 / imp-1258 consume these helpers.
  '/src/data/_tripwire-helpers.js',
  // imp-1266: Mellin diagonalization ATTEMPT for V_{a,Φ} (route 3 of imp-1260).
  // NEGATIVE RESULT — V is NOT a multiplicative convolution on (0, ∞). Three
  // independent obstructions (kernel not a function of t/s, K_a is additive
  // not multiplicative convolution, Mellin of sinh diverges) kill the route
  // at step 0. Salvage: closed-form Laplace symbol L[k_a](z) = a/(z²-a²) for
  // route 4 (Wiener-Hopf); Phi Mellin shape ~ 2 ξ(s); rigorous HS-style bound
  // proving ||V|| ≤ 1 for all a ≤ ~12.6 (covers App-S a ≤ 0.5 with wide
  // margin). Points to imp-1267 (HS, already shipped) as the productive
  // attack. 13 tripwires.
  '/src/data/imp-1266-volterra-mellin-symbol.js',
  // imp-1267: analytical Hilbert-Schmidt upper bound for ||V_{a,Φ}|| on
  // L²([0, ∞)) — route 1 of imp-1260. Closed-form: ||V||_op ≤ sqrt(I_0 · J_a)
  // where I_0 = ||Φ||_{L²(R_+)}^2 ≈ 1.047e-2 and J_a = ∫ Φ² sinh²(au) du.
  // Worst HS_bound across the imp-1240 grid is 2.94e-4 (a=0.5), more than
  // 3000x below the Conj 27.2 threshold of 1. 10 tripwires.
  '/src/data/imp-1267-volterra-hs-bound.js',
  // imp-1260 (PARTIAL): large-a crossover analysis for Conj 27.2. Corrects the
  // imp-1267 "(0, ~2]" coverage claim — the CS-HS bound sqrt(I_0 J_a) crosses 1
  // at a* ~= 34.98 (NOT ~2), because J_a grows far slower than e^{4a} (Phi² is
  // concentrated on [0, ~0.3]). exact-HS extends the closed range to (0, ~37.66];
  // Schur ~35.86. Open sub-gap of imp-1260 shrinks from a>2 to a>~37.66. 9
  // tripwires. imp-1260 stays OPEN for all a > 0.
  '/src/data/imp-1260-largea-crossover.js',
  // imp-1286: RIGOROUS tail-bound transfer L²([0, U]) → L²([0, ∞)) for the
  // imp-1267 HS bound. Closed-form T_a(U) ≤ I_0 · (π³/8) · e^{(4+2a)U} ·
  // exp(-2π e^{4U}); at U=4 this is ≤ 10^{-24,247,990} for the App-S grid
  // (a ≤ 0.5) — twenty-four million decimal places below the main term.
  // Cross-window numerical identity J_a(U=4) ≡ J_a(U=8) ≡ J_a(U=12) confirms
  // fp-zero tail. Combined HS bound on L²([0, ∞)) ≤ 2.94e-4 across the
  // App-S range. Closes imp-1265 caveat (c) for a ≤ 0.5. 13 tripwires.
  '/src/data/imp-1286-tail-bound-transfer.js',
  // imp-1261: EXECUTION RECORD for the imp-1246 redirect -- shipped the
  // unconditional Lambda <= 3.06e-5 asymptotic bound (modulo Polymath15
  // G6a) via composition rewrite of asymptotic-lambda-bound-2026-05-20.js.
  // Triangle inequality on |t_c(N)| via imp-341 + imp-1149 + M_infty
  // strip-Jacobian decay; ~26x tighter than imp-1147 conditional 7.98e-4
  // AND removes the linear-1/N conditional dependence. 10 tripwires.
  '/src/data/imp-1261-asymptotic-lambda-redirect-shipped.js',
  // imp-1264: OPUS-4.8 DEEP review of the Polymath15 G6a shock-Lipschitz
  // bridge -- the remaining Lambda conditional on the post-imp-1261 bound.
  // Three routes: (a) direct Polymath15 Lemma 5.2 cite (CLOSED via imp-366
  // / imp-394 / imp-395 with C_H = 1/8 from rigorous Dyson tangency); (b)
  // HJB regularity Bourgain-Sinai / Caffarelli-Vasseur (ELIMINATED: wrong
  // exponent or requires viscosity); (c) numerical bracket C_C ~ 0.384
  // (CLOSURE-ROUTE-IDENTIFIED). Overall verdict: closure-via-multiple-routes,
  // honest residual is CITATION-CONDITIONAL not mathematically-open.
  // 13 tripwires.
  '/src/data/imp-1264-polymath15-g6a-bridge-review.js',
  // imp-1289: §17.4 Krein-Langer negative-index identity direct attack.
  // Verdict: recovers-de-branges-not-new — the κ = 0 specialization of the
  // Krein-Langer S^κ class is EQUIVALENT to the de Branges H(E_a) positivity
  // already used in the imp-1258 §15-27 collapse. NOT a 4th independent route
  // alongside imp-1267 HS / imp-1287 WH; remaining content is RH (Conj 17.3
  // SUBSUMED-BY-RH per imp-1232). 12 tripwires.
  '/src/data/imp-1289-section17-4-krein-langer-attack.js',
  // imp-1297: NOVEL classification — does Selberg's trace formula on
  // SL(2, Z) \ H bypass Montgomery PCC at 2-point for the ESY-closure
  // Poisson kernel? Verdict: selberg-requires-cuspidal-density-conjecture.
  // Route requires (a) Selberg eigenvalue conjecture (open, only 7/64 known
  // via Kim-Sarnak 2003), (b) Phillips-Sarnak full cuspidal density (open;
  // only deformation theorem rigorous), (c) Sarnak arithmetic-quantum-chaos
  // GUE 2-point conjecture (the EXACT ANALOGUE of Montgomery PCC on Maass
  // eigenvalues, not a substitute). Even granting all three, the trace-
  // formula 2-point bound on the (sigma > 1) regime where the ESY Poisson
  // kernel sits is STRICTLY WEAKER than PCC by a (log T)^(1/2) factor
  // (Iwaniec-Sarnak 2000). Extends imp-1247 negative conclusion to a 5th
  // candidate route. 10 tripwires.
  '/src/data/imp-1297-selberg-trace-pcc-route.js',
  // imp-1296: NOVEL Tracy-Widom β=2 edge-statistics empirical pilot on Riemann
  // ξ zeros. Sliding-window max-spacing s_max compared to TW2 via Prähofer-Spohn
  // 30-point lookup. KS = (0.40, 0.39, 0.47) at W ∈ (100, 1000, 10000); verdict
  // systematic-deviation-above-0.10 with honest interpretation that s_max is
  // NOT the right TW2 proxy (lambda_max would be — future ticket).
  '/src/data/imp-1296-tracy-widom-edge.js',
  // imp-1287: route-4 Wiener-Hopf factorization for ‖V_{a,Φ}‖ ≤ 1. Uses the
  // imp-1266 Laplace symbol L[k_a](z) = a/(z²-a²). Bare half-line convolution
  // K_a has WH bound ‖K_a‖ ≤ sup_t |a/((it)²-a²)| = 1/a. With the Φ twist:
  // ‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞/a = 0.1996/a (Φ(0)=0.4467 from imp-1266). WH closes
  // Conj 27.2 for a ≥ ‖Φ‖²_∞ ≈ 0.1996; combined with imp-1267 HS (sharpened
  // to a ∈ (0, ~37.66] by imp-1260), the union covers ALL a > 0 by two
  // independent analytical routes. 13 tripwires.
  '/src/data/imp-1287-volterra-wiener-hopf.js',
  // imp-1290: §18.3 Weil/Pontryagin explicit-formula attack on Λ. Beurling-
  // Selberg / Vaaler 1985 majorant at width W = 1 yields Λ ≤ ~0.80, ~26,000x
  // LOOSER than imp-1261's 3.06e-5. Soundararajan-Granville 1998 has the
  // wrong sign to tighten this route. Verdict: weil-too-loose-as-attack.
  // 12 tripwires.
  '/src/data/imp-1290-weil-explicit-formula-attack.js',
  // imp-1288: §23 freezing-bridge direct attack. Quotes §23.1-§23.7 from
  // imp-1221 (paper pp. 32-36). Three routes: (a) direct paper argument
  // (Conj 23.5 passive frozen-bridge closure — OPEN, no K^pass_{a,U}
  // construction in §23); (b) HJB regularity Bourgain-Sinai 2009 /
  // Caffarelli-Vasseur 2010 (NOT APPLICABLE: §23 object is operator-
  // positivity on a reproducing kernel, not a PDE solution — total
  // category mismatch); (c) §23.6 5-step numerical bracket (finite-window
  // FALSIFIER protocol, not a proof). Verdict on §23 ↔ G6a (imp-1264):
  // independent-from-G6a — §23 controls ind_-(K_a) = 0 on the shifted
  // bridge R_a = X(w−a)/X(w+a) (operator / reproducing-kernel layer);
  // G6a controls a Hölder-1/2 modulus of τ_c on real Dyson empirical
  // measures (PDE / empirical-measure layer). Different objects, different
  // tools, different layers. 11 tripwires.
  '/src/data/imp-1288-section23-freezing-bridge.js',
  // imp-1302: CRITICAL classification — does Goldston-Gonek 1998 (Annals 148)
  // + Conrey-Snaith 2008 close Montgomery PCC at 2-point unconditionally?
  // Verdict: goldston-gonek-improves-but-pcc-remains-open. GG1998 is a
  // theorem (unconditional, Annals 148, range theta < 1) but its (log T)^2
  // error prevents extension to theta = 1, let alone sigma > 1. CS2008 is a
  // CONJECTURE conditional on Conrey-Farmer-Zirnbauer ratios (unproven for
  // zeta). Combined: closes only the lower-order arithmetic correction
  // INSIDE Montgomery 1973's already-proven Fourier-support < 1 range; does
  // NOT extend the support range. Residual gap = PCC for support > 1 where
  // §15-27 ESY-closure Poisson kernel needs the diagonal-approx step
  // (imp-1184 D3). Extends imp-1297 negative conclusion to the second-moment
  // candidate route. 11 tripwires.
  '/src/data/imp-1302-goldston-gonek-pcc-attack.js',
  // imp-1303: CRITICAL classification — does Heath-Brown 1979 unconditional
  // 4th-moment of zeta (Proc. LMS (3) 38 (1979) 385-422), possibly with
  // Selberg 1944 mean-square / Iwaniec-Sarnak 2000 1-level density /
  // Conrey 1989 mollifier sieve, close Montgomery PCC at 2-point for Fourier
  // support sigma > 1 unconditionally? Verdict:
  // heath-brown-improves-but-pcc-remains-open. HB1979 gives a 2-point bound
  // matching PCC main term but WEAKER by (log T)^{1/2} in sigma in (1, 5/4);
  // above sigma = 5/4 no unconditional bound. The (log T)^{1/2} gap is
  // intrinsic to the 4th-moment Cauchy-Schwarz layer in the secondary
  // off-diagonal explicit-formula term. Sub-routes (a) Selberg 1944 (2nd
  // moment same layer, cannot improve rate), (b) IS2000 (1-level density
  // != 2-level in families, single-zeta has no horizontal-vertical transfer),
  // (c) Conrey 1989 mollifier (theta_C ~ 0.572-0.583 < 1, never reaches
  // theta > 1) all fail to close. Extends imp-1297 + imp-1302 negative
  // pattern; PCC for support > 1 remains binding obstruction. 12 tripwires.
  '/src/data/imp-1303-heath-brown-pcc-route.js',
  // imp-1304: CRITICAL classification — does Iwaniec-Sarnak 2000 Annals
  // "The non-vanishing of central values of automorphic L-functions and
  // Landau-Siegel zeros" (Annals of Math. 151 (2000) 1175-1216) bypass
  // Montgomery PCC at 2-point for the §15-27 ESY-closure single-zeta
  // statistic WITHOUT PCC input? Verdict:
  // iwaniec-sarnak-bypasses-pcc-for-family-not-single-zeta. IS2000-Annals
  // genuinely bypasses PCC for the FAMILY {L(s, f x chi_d) : |d| ~ D, d
  // fundamental} via amplified second moment + Heath-Brown 1995 quadratic
  // large sieve + Iwaniec 1997 Petersson trace formula + Kim-Sarnak 2003
  // theta_2 <= 7/64 (all theorems). But the family-averaging bypass does
  // NOT transfer to single zeta: the horizontal-vertical Plancherel formula
  // (Iwaniec-Kowalski 2004 §25.1) is CONJECTURAL and equivalent to the
  // Sarnak 1995 arithmetic-quantum-chaos conjecture which is itself the
  // quantum-chaos analogue of Montgomery PCC at 2-point — so the single-
  // zeta route is CIRCULAR. Auxiliary status CLEANER than imp-1297
  // (no full Selberg eigenvalue / Phillips-Sarnak density / GRH needed).
  // Architecturally distinct from imp-1303 sub-route (b) which addressed
  // the GAFA 1-level density companion paper. Extends imp-1297 + imp-1302 +
  // imp-1303 negative pattern to the family-averaging surface; PCC for
  // single zeta with support > 1 remains binding obstruction. Remaining
  // candidate lever is imp-1305 (Goldston-Yildirim 2003 absolutization).
  // 12 tripwires.
  '/src/data/imp-1304-iwaniec-sarnak-no-pcc.js',
  // imp-1300: NOVEL higher-N GUE statistics push (target rate gap). Ticket
  // asked for empirical M_∞(N) at N up to 10^8 to verify the imp-1149
  // N^{-3/2} deviation bound on 100× larger data. Bundle only carries
  // zeros-to-1e6 → script ran at the data ceiling N=10^6 with 3 log-spaced
  // N values; primary OLS fit α_tc = 0.4808 ± 0.0035 (R^2 = 0.99995) is
  // the LEADING t_c power-law (t_c ~ 1/(2 M_N), M_N ~ √N at the imp-341
  // strip), NOT the imp-1149 deviation rate (which would need a much
  // larger dynamic range or a tighter M_∞ reference). Verdict:
  // data-limited-at-N=1000000-cannot-push-further. 11 tripwires.
  '/src/data/imp-1300-higher-N-empirical.js',
  // imp-1271: OPUS-4.8 DEEP audit of v52 Appendices M-O (KYP bounded-real /
  // positive-real / delay-Gram). Last paper section never directly audited
  // (referenced by imp-1233 + imp-1245 but never opened). 9 claims classified
  // against the 13-conjecture audit taxonomy. Verdict: redundant-with-1244+
  // 1245+1258 — Apps M-O is a control-theoretic re-paraphrase of CDB-Exist /
  // §27 with no NEW closure path to Λ. Three structural questions (standalone
  // / block-extension / new-closure-paths) all answer NO (or no-modulo-smobius
  // for q-a). Signed-Mobius argument-principle route is closest-to-novel sub-
  // claim, flagged as follow-up sub-gap. 12 tripwires.
  '/src/data/imp-1271-apps-MNO-audit.js',
  // imp-1298: NOVEL structural classification — does the imp-1258 collapse
  // (||V_{a,Φ}|| ≤ 1 ⇔ CDB-Exist ⇔ RH for ζ) extend from the scalar Riemann ξ
  // to GL(n) automorphic L-functions in the Selberg class? Verdict:
  // collapse-extends-with-matrix-norm-bound-1. Forward chain extends via
  // matrix Schur-complement + matrix de Branges (Brodskii 1971 / Alpay-Dym
  // 1990) + matrix canonical-system theory (Sakhnovich 1999); reverse via
  // Arov-Nudelman 1996 Thm 4.1 matrix-Schur passive-realization theorem;
  // Φ_L super-exponentially decays at rate exp(-c e^{4u/n}); imp-1267 HS
  // bound extends with matrix trace norm I_0^L = tr ∫ Φ_L* Φ_L,
  // J_a^L = tr ∫ Φ_L* Φ_L sinh²(ax). Single load-bearing open item: matrix
  // §27 paper-construct re-derivation (block positivity ⇔ K_a^L ⪰ 0). PCC
  // obstruction (imp-1184) persists in GL(n) case as the Rudnick-Sarnak /
  // Iwaniec-Sarnak matrix-PCC analog. 10 tripwires.
  '/src/data/imp-1298-gl-n-selberg-extension.js',
  // imp-1259: Survey -- non-Twin-Ladder RH-equivalents not yet in the main
  // rh-equivalents-reference.js 12-entry catalog. Verdict: Speiser PRESENT;
  // Davenport-Heilbronn NOT-AN-EQUIVALENT (anti-example, correctly absent);
  // THREE MISSING GAPS identified: Weil-Bombieri explicit-formula positivity
  // (1952/1992), Connes adelic spectral triple (Selecta Math. 5, 1999),
  // Baez-Duarte Ramanujan-Nyman criterion (2003/2005). Adding all three would
  // bring the catalog to 15 (the imp-1119 spec upper bound). 8 tripwires.
  '/src/data/imp-1259-rh-equivalents-completeness-audit.js',
  // imp-1305: CRITICAL classification — can Goldston-Yildirim 2003 (Acta Math
  // 192 (2004) 95-148, "Higher correlations of divisor sums related to primes
  // I: Triple correlations") conditional-on-GRH triple-correlation be
  // ABSOLUTIZED via a Selberg 1944 / Heath-Brown 1979 / Hooley 1965 mean-square
  // substitute for the GRH input, yielding an unconditional Montgomery PCC
  // 2-point bound at Fourier support sigma > 1? Verdict:
  // goldston-yildirim-essentially-same-as-prior-routes. Absolutized GY2003
  // reduces to the SAME Cauchy-Schwarz / explicit-formula layer as imp-1303
  // (Heath-Brown 1979) with IDENTICAL (log T)^{1/2} slack in support (1, 5/4)
  // and no unconditional bound for sigma > 5/4. The Lambda_R divisor-sum
  // smoothing provides sharper polynomial constants but does not change the
  // Cauchy-Schwarz rate at the off-diagonal explicit-formula step. Aggregate
  // verdict across imp-1297 + imp-1302 + imp-1303 + imp-1305: the standard
  // moment-method toolkit is EXHAUSTED for PCC at 2-point with support > 1;
  // RH via §15-27 requires GENUINELY NEW INPUT outside the moment-method
  // family (Connes-Bost, Berry-Keating, novel sieve, or alternative §15-27
  // closure pathways that decouple from sigma > 1). 12 tripwires.
  '/src/data/imp-1305-goldston-yildirim-mean-square.js',
  // imp-1301: NOVEL follow-up to imp-1296 — TRUE windowed λ_max via the
  // Christoffel-Darboux sine-kernel restriction (100×100 edge block of the
  // unfolded zeros) compared to TW2 with Soshnikov 2000 centering+rescaling.
  // KS_matched at W=10000 = 0.4021 vs imp-1296 s_max baseline 0.4744 — modest
  // improvement (Δ = +0.07) consistent with imp-1296.honestScope.sMaxNotLambdaMax,
  // but well above the 0.10 success threshold. Raw Soshnikov μ_W = sqrt(2W)
  // centering fails (KS_raw = 1.0) because the 100×100 sub-block does not
  // reach the asymptotic regime — λ_max stays in [1.8, 2.5] regardless of W.
  // Verdict: discretization-too-coarse. Recommended follow-up: Bornemann 2010
  // Airy-kernel quadrature on 200+ Chebyshev nodes. 12 tripwires.
  '/src/data/imp-1301-true-tw-edge-statistic.js',
];

const ALL_MODULES = FAST_MODE
  ? [...MATH_MODULES, ...DATA_MODULES].filter((m) => !HEAVY_MODULES.includes(m))
  : [...MATH_MODULES, ...DATA_MODULES];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + 'Z';
}

// imp-1193: Send a single NDJSON request to the vite-ssr-pool daemon.
// Returns the parsed response or rejects on socket / parse error.
function poolRequest(sockPath, request, timeoutMs) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(sockPath);
    const timer = setTimeout(() => {
      try { client.destroy(new Error('pool request timeout')); } catch {}
      reject(new Error('pool request timeout'));
    }, timeoutMs);
    let buf = '';
    client.on('connect', () => {
      client.write(JSON.stringify(request) + '\n');
    });
    client.on('data', (chunk) => {
      buf += chunk.toString('utf8');
      const nl = buf.indexOf('\n');
      if (nl >= 0) {
        clearTimeout(timer);
        const line = buf.slice(0, nl);
        client.end();
        try { resolve(JSON.parse(line)); } catch (e) { reject(e); }
      }
    });
    client.on('error', (e) => { clearTimeout(timer); reject(e); });
    client.on('close', () => {
      clearTimeout(timer);
      if (!buf) reject(new Error('pool socket closed before response'));
    });
  });
}

// imp-1193: Run the sweep via the pool daemon when available. Returns
// the same shape that the in-process loop produces (passed/failed/loadErrors/
// failures/lines) so the rest of main() is identical between paths.
async function sweepViaPool(sockPath, modules, parallel, fastMode) {
  const startMs = Date.now();
  const lines = [];
  const log = (msg) => { console.log(msg); lines.push(msg); };
  log('# Assertion sweep — ' + new Date().toISOString());
  log('Mode: ' + (fastMode ? 'fast (heavy modules skipped)' : 'full') + ' · parallel: ' + parallel + ' (via pool)');
  log('');
  const resp = await poolRequest(sockPath, { op: 'sweep', modules, parallel }, 600000);
  if (!resp || !resp.ok) {
    throw new Error('pool sweep returned non-ok: ' + JSON.stringify(resp).slice(0, 200));
  }
  let passed = 0, failed = 0, loadErrors = 0;
  const failures = [];
  for (const le of resp.loadErrors || []) {
    log('  LOAD_ERR ' + le.moduleName + ': ' + (le.error || '').slice(0, 120));
    loadErrors++;
    failed++;
    failures.push({ id: le.moduleName, why: 'module load error: ' + (le.error || '').slice(0, 80) });
  }
  for (const r of resp.results || []) {
    let modPass = 0, modFail = 0;
    for (const a of r.assertions || []) {
      if (a.ok) { passed++; modPass++; }
      else {
        failed++; modFail++;
        failures.push({ id: a.id, why: (a.why || '').slice(0, 100) });
        log('  FAIL: ' + a.id);
      }
    }
    if (modFail === 0 && modPass > 0) log('  OK  : ' + r.arrayName + ' (' + modPass + ' assertions)');
  }
  // Sanity-check the pool stats against our re-tally.
  if (resp.stats && (resp.stats.passed !== passed || resp.stats.failed !== failed)) {
    log('  NOTE: pool stats differ from local tally (pool=' +
      resp.stats.passed + '/' + resp.stats.failed +
      ', local=' + passed + '/' + failed + ')');
  }
  return { passed, failed, loadErrors, failures, lines, startMs };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (SELF_TEST_MODE) {
    return runSelfTest();
  }

  // imp-1193: optional pool. When SSR_POOL_N > 0 we lazy-acquire from the pool
  // on each processOne call; otherwise the original single-server path runs.
  let server;        // single-server fallback (default behavior)
  let pool   = null; // populated only when --ssr-pool=N is passed
  if (SSR_POOL_N > 0) {
    try {
      const { createPool } = await import('./lib/ssr-pool.mjs');
      pool = createPool({
        cap: SSR_POOL_N,
        viteOptions: {
          root:     ROOT,
          logLevel: 'error',
          appType:  'custom',
          // ws:false silences the HMR WebSocket port-bind warning when N>1
          // servers run concurrently in the same process.
          server:   { middlewareMode: true, ws: false },
        },
      });
    } catch (e) {
      console.error('FATAL: could not init Vite SSR pool:', e.message);
      process.exit(2);
    }
  } else {
    try {
      server = await createServer({
        root:    ROOT,
        logLevel: 'error',
        appType:  'custom',
        server:   { middlewareMode: true },
      });
    } catch (e) {
      console.error('FATAL: could not create Vite server:', e.message);
      process.exit(2);
    }
  }

  const startMs  = Date.now();
  let passed     = 0;
  let failed     = 0;
  let loadErrors = 0;
  const failures = [];
  const lines    = [];

  function log(msg) { console.log(msg); lines.push(msg); }

  log('# Assertion sweep — ' + new Date().toISOString());
  log('Mode: ' + (FAST_MODE ? 'fast (heavy modules skipped)' : 'full') +
      ' · parallel: ' + PARALLEL +
      (pool ? ' · ssr-pool: ' + SSR_POOL_N : ''));
  log('');

  async function processOne(modPath) {
    let mod;
    let slot;
    try {
      if (pool) {
        slot = await pool.acquire();
        mod  = await slot.server.ssrLoadModule(modPath);
        pool.release(slot);
      } else {
        mod = await server.ssrLoadModule(modPath);
      }
    } catch (e) {
      if (slot && pool) pool.release(slot);
      const msg = 'LOAD_ERR ' + modPath + ': ' + e.message.slice(0, 120);
      log('  ' + msg);
      loadErrors++;
      failed++;
      failures.push({ id: modPath, why: 'module load error: ' + e.message.slice(0, 80) });
      return;
    }

    const arrays = Object.entries(mod).filter(
      ([k, v]) => k.endsWith('_ASSERTIONS') && Array.isArray(v)
    );
    if (arrays.length === 0) return;

    for (const [name, arr] of arrays) {
      let modPass = 0, modFail = 0;
      for (const a of arr) {
        let ok;
        try { ok = a.holds(); } catch (e) {
          ok = false;
          a._err = e.message;
        }
        if (ok) {
          passed++;
          modPass++;
        } else {
          failed++;
          modFail++;
          failures.push({ id: a.id, why: (a.why || a._err || '').slice(0, 100) });
          log('  FAIL: ' + a.id);
        }
      }
      if (modFail === 0) {
        log('  OK  : ' + name + ' (' + modPass + ' assertions)');
      }
    }
  }

  // imp-1171: concurrency-capped pool — N workers pull from a shared queue
  // against the single Vite SSR server. Sequential when PARALLEL=1.
  if (PARALLEL === 1) {
    for (const modPath of ALL_MODULES) {
      await processOne(modPath);
    }
  } else {
    const queue = [...ALL_MODULES];
    async function worker() {
      while (queue.length > 0) {
        const modPath = queue.shift();
        if (!modPath) return;
        await processOne(modPath);
      }
    }
    await Promise.all(Array.from({ length: PARALLEL }, () => worker()));
  }

  await finalize({ passed, failed, loadErrors, failures, lines, startMs }, server);
}

// imp-1193: shared end-of-sweep handler used by both the cold-start and the
// pool-delegate paths. `server` is optional (the pool path does not own one).
async function finalize(state, server) {
  const { passed, failed, loadErrors, failures, lines, startMs } = state;
  const log = (msg) => { console.log(msg); lines.push(msg); };
  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
  log('');
  log('---');
  log('Passed : ' + passed);
  log('Failed : ' + failed);
  log('Errors : ' + loadErrors + ' load errors');
  log('Time   : ' + elapsed + 's');
  log('');

  if (failures.length > 0) {
    log('## Failures');
    for (const f of failures) {
      log('- `' + f.id + '`: ' + (f.why || '').slice(0, 80));
    }
  }

  if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
  const logFile = path.join(LOGS_DIR, 'assertions-' + isoTimestamp() + '.md');
  fs.writeFileSync(logFile, lines.join('\n') + '\n');
  console.log('\nLog written to ' + path.relative(ROOT, logFile));

  if (pool) {
    const s = pool.stats();
    console.log('ssr-pool: created=' + s.created + ' reuseCount=' + s.reuseCount + ' cap=' + s.cap);
    await pool.drain();
  } else {
    await server.close();
  }

  if (failed > 0) {
    console.error('\nASSERTION SWEEP FAILED: ' + failed + ' failures');
    process.exit(1);
  } else {
    console.log('\nAll assertions pass.');
    process.exit(0);
  }
}

// ── imp-1193 self-test ────────────────────────────────────────────────────────
// `node scripts/run-assertions.mjs --self-test-pool` runs a tiny micro-bench:
// loads a small fixed module subset (a) cold-single-server, (b) pool-of-4,
// prints wallclock numbers + pool stats + active-handle delta after drain.
// Used by tools / by the imp-1193 validation file to refresh measured numbers.
async function runSelfTest() {
  const { createPool } = await import('./lib/ssr-pool.mjs');
  // 12 mixed modules (math + data) — enough to amortise warm-up, small enough
  // to keep the self-test under ~15 s.
  const SUBSET = [
    '/src/data/lambda-roadmap.js',
    '/src/data/rh-dag.js',
    '/src/data/sota-lambda-claim.js',
    '/src/data/lambda-N1e6-final-assembly.js',
    '/src/data/lambda-intercept-pooled.js',
    '/src/data/imp-360-extended-ladder-N1e6.js',
    '/src/math/g1-sub-extremal-closure.js',
    '/src/math/path-g-cauchy-rigorous.js',
    '/src/math/noswap-closure.js',
    '/src/math/route-a-shift-witness.js',
    '/src/data/papers-release-manifest.js',
    '/src/data/rh-equivalents-reference.js',
  ];

  async function loadAll(srv, paths) {
    for (const p of paths) {
      try { await srv.ssrLoadModule(p); } catch { /* ignore */ }
    }
  }

  // (A) Baseline: single fresh Vite server.
  const baselineHandlesBefore = process._getActiveHandles().length;
  const t0 = Date.now();
  const single = await createServer({
    root: ROOT, logLevel: 'error', appType: 'custom',
    server: { middlewareMode: true },
  });
  await loadAll(single, SUBSET);
  const baselineMs = Date.now() - t0;
  await single.close();
  const baselineHandlesAfter = process._getActiveHandles().length;
  const baselineHandleDelta  = baselineHandlesAfter - baselineHandlesBefore;

  // (B) Pool-of-4 against the same subset, run twice to exercise reuse.
  const poolHandlesBefore = process._getActiveHandles().length;
  const t1 = Date.now();
  const pool = createPool({
    cap: 4,
    viteOptions: {
      root: ROOT, logLevel: 'error', appType: 'custom',
      server: { middlewareMode: true, ws: false },
    },
  });
  // Concurrency-cap-4 worker race over SUBSET ++ SUBSET (so each slot reused).
  const work = [...SUBSET, ...SUBSET];
  async function worker() {
    while (work.length) {
      const p = work.shift();
      if (!p) return;
      const slot = await pool.acquire();
      try { await slot.server.ssrLoadModule(p); } catch { /* ignore */ }
      pool.release(slot);
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => worker()));
  const poolMs   = Date.now() - t1;
  const poolStat = pool.stats();
  await pool.drain();
  const poolHandlesAfter = process._getActiveHandles().length;
  const poolHandleDelta  = poolHandlesAfter - poolHandlesBefore;

  const ratio = baselineMs > 0 ? (poolMs / baselineMs) : 1;
  const result = {
    timestamp:           new Date().toISOString(),
    subsetSize:          SUBSET.length,
    baselineMs,
    poolMs,
    ratio:               Number(ratio.toFixed(3)),
    pool: {
      created:    poolStat.created,
      reuseCount: poolStat.reuseCount,
      cap:        poolStat.cap,
    },
    handleDeltaBaseline: baselineHandleDelta,
    handleDeltaPool:     poolHandleDelta,
  };

  console.log('# imp-1193 ssr-pool self-test');
  console.log(JSON.stringify(result, null, 2));

  // Emit machine-readable line for scripted ingestion.
  console.log('SELFTEST_RESULT=' + JSON.stringify(result));

  process.exit(0);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(2);
});
