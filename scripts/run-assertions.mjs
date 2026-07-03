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
//   node scripts/run-assertions.mjs                   # full sweep
//   node scripts/run-assertions.mjs --fast            # skip modules known to be slow
//   node scripts/run-assertions.mjs --since-changed   # only changed files (fast pre-commit)
//
// Exit codes:
//   0 -- all assertions pass
//   1 -- one or more assertions fail
//   2 -- script itself failed (Vite init error, module load error)
//
// Output:
//   scripts/logs/assertions-<ISO>.md

import { execSync } from 'node:child_process';
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
const SELF_TEST_MODE    = process.argv.includes('--self-test-pool');
// imp-2745: --fail-inject mode proves holds()===false is caught by the harness.
const FAIL_INJECT_MODE  = process.argv.includes('--fail-inject');
// imp-2749: --since-changed restricts the sweep to modules whose source files
// have changed vs HEAD (staged + unstaged). Useful as a fast pre-commit check.
const SINCE_CHANGED = process.argv.includes('--since-changed');
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
// imp-2737: per-module watchdog — abort any ssrLoadModule that hangs past this
// threshold and surface it as a LOAD_ERR instead of blocking the whole sweep.
const MODULE_WATCHDOG_MS = 30000;

// imp-2832: overall wall-clock watchdog. A green-build gate that can HANG is
// worse than no gate — heavy modules importing the 16.7MB zeros bundle can wedge
// the sweep (and any caller that verifies via it) indefinitely. The per-module
// watchdog above bounds a single load; this is the outer backstop that bounds the
// whole run. On expiry we name the still-in-flight modules (the stall suspects)
// and exit non-zero — fail fast, not hang. Override with
// ASSERT_OVERALL_TIMEOUT_MS (ms); set it to 0 to disable.
const OVERALL_TIMEOUT_MS = (() => {
  const raw = process.env.ASSERT_OVERALL_TIMEOUT_MS;
  if (raw === undefined || raw === '') return 600000; // 10 min default
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 600000;
})();
const inFlightModules = new Set();

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
  '/src/math/g3a-fullsum-closure.js',
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
  // imp-2554: honest partial on the open sub-gap imp-911-sub-gronwall-interval — proves the saturation identity E_j = K_J*tau_c_pair = h_j^2/H_0^2 = 1 on every one of the 27 plateaus (binding-pair gap equals plateau scale by the H_raw-plateau definition), so the originally-proposed interval-RK4 rescaling of K_J at the plateau gap scale CANNOT push exp(E_j) below exp(1). Re-scopes the residual slack onto the pre-Gronwall pre-factor (g_new > h_j) and delta_config geometry. Documents the obstruction; does NOT close the sub-gap (imp-903 keeps its openSubGap pointer).
  '/src/math/imp-2554-imp911-gronwall-interval-saturation.js',
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
  // imp-2548: matched-N cross-validation of kernel-hack vs Path C collision time.
  '/src/math/imp-2548-kernel-pathc-matched-n.js',
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
  // imp-2481: ESY determinantal-CLT audit — Soshnikov 2000 hypotheses fail on the singular C_mb test function 1/x (infinite H^{1/2} seminorm); determinantal CLT is NOT a weaker citable input, only the 2-point/TIER-2 level is needed (refines imp-486, complements imp-2365).
  '/src/data/imp-2481-esy-determinantal-clt-audit.js',
  // imp-2492: ESY obstacle-O2 audit (ticket imp-370) — forward dissipative DBM rigidity does NOT transfer to the backward de Bruijn collision flow; reversal is the ill-posed backward heat equation exp(+t k^2), maximal at the microscopic scale the rigidity bound controls. Refines esy-rigidity-port.js obstacle2; O2 stays research-grade open.
  '/src/data/imp-2492-esy-o2-backward-flow-illposedness-audit.js',
  // imp-2493: ESY obstacle-O3 audit (ticket imp-370) — a high-probability ensemble bound mu(G_N)=1-N^{-c} does NOT derandomize to the single fixed zero sequence; a measure-1 set can exclude any named point (irrationals miss 1/2), so closing O3 needs quantitative GUE equidistribution (Montgomery-Dyson/Bourgade/Rudnick-Sarnak), which is open. Refines esy-rigidity-port.js obstacle3; O3 stays research-grade open.
  '/src/data/imp-2493-esy-o3-derandomization-audit.js',
  // imp-2491: ESY obstacle-coupling-matrix synthesis (ticket imp-370) — joins the three isolated obstacle audits (O1/imp-508, O2/imp-2492, O3/imp-2493). O1+O3 share an arithmetic/equidistribution axis (one GUE-equidistribution input spans both); O2 is the unique PDE-axis obstacle (only a backward-stability input reaches it). Hence no single input closes all three, and angle (b) needs >= 2 independent inputs across 2 orthogonal axes; highest leverage = the GUE-equidistribution input (O1+O3). Synthesis only; imp-370 stays research-grade open.
  '/src/data/imp-2491-esy-obstacle-coupling-matrix.js',
  // imp-2497: ESY highest-leverage-input availability audit (ticket imp-370) — decomposes the GUE-equidistribution input that imp-2491 names the top lever (closes O1 partial + O3 full). What is proven today (Montgomery 2-level, support < 1, RH; Rudnick-Sarnak n-level, restricted support, GRH) is BOTH support-restricted AND conditional, whereas ESY needs unrestricted all-scales n-level rigidity UNCONDITIONALLY. So the top lever is not available today; refines (does not contradict) imp-2491. imp-370 stays research-grade open.
  '/src/data/imp-2497-esy-highest-leverage-input-availability-audit.js',
  // imp-2498: ESY O2 backward-stability availability audit (ticket imp-370) — sibling of imp-2497 on the orthogonal PDE axis. Decomposes the backward-stability input imp-2491 names the unique O2 lever: what is proven today (backward UNIQUENESS via log-convexity = no quantitative transfer; CONDITIONAL Carleman/John stability = circular a priori bound + logarithmic modulus) is short of the UNCONDITIONAL power-law-strength transfer at k_{max} O2 needs, and unconditional continuous dependence is Hadamard-false. Joint with imp-2497: BOTH required inputs unavailable today. Refines imp-2492; O2 stays research-grade open.
  '/src/data/imp-2498-esy-o2-backward-stability-availability-audit.js',
  // imp-2545: ESY O2 backward-stability CONSTRUCTIVE estimate (ticket imp-370, critical) — upgrades imp-2498's ordinal strength handles to explicit closed-form constants. Lemma A (log-convexity three-lines, witnessed as a log-convex sum of exponentials): ||u(t)|| <= ||u(0)||^{1-t/T} ||u(T)||^{t/T}, unconditional but Hoelder exponent theta(t)=1-t/T vanishes at the collision-time endpoint (O2a). Lemma B (band-limited Carleman): ||P_{<=K} u(t)|| <= exp(+T K^2) ||P_{<=K} u(0)||, closing cutoff K=k_{max}~log(gamma_N)/(2 pi), constant exp(T(log gamma_N)^2/(4 pi^2)) DIVERGES in N (O2b). Honest partial; O2 stays research-grade open.
  '/src/data/imp-2545-esy-o2-backward-stability-logconvexity-carleman.js',
  // imp-2499: ESY both-axes joint-availability synthesis (ticket imp-370) — joins the two per-axis input-availability audits (imp-2497 arithmetic, imp-2498 pde). Both required inputs are unavailable today AND their residual sub-gaps anchor DISJOINT obstacle sets ({O1,O3} arithmetic vs {O2} pde), so the unavailabilities are independent and the distance-to-closure is their conjunction (both required simultaneously), not a minimum. The imp-2491 highest-leverage-first ordering yields no shortcut to a one-input-conditional route; angle (b) is the unique catalogued route needing two independent orthogonal breakthroughs. Synthesis only; imp-370 stays research-grade open.
  '/src/data/imp-2499-esy-both-axes-joint-availability.js',
  // imp-2500: ESY angle (b) breakthrough-floor ranking (ticket imp-370) — operationalizes the imp-2499 prose recommendation into a FORCED ordinal under one named cost proxy. breakthroughCountFloor(route) = minimum independent research-grade breakthroughs that must all land; angle (b) is a conjunction of 2 independent inputs (DERIVED from imp-2499) so its floor is 2, every single-input route has floor 1, and 2 > 1 makes the deprioritization forced (not discretionary) under this lower-bound proxy. Honest reach: WEAK domination (angle (b) not cheaper than any single-input route), NOT unconditional total-cost domination. Ranking only; imp-370 stays research-grade open.
  '/src/data/imp-2500-esy-angle-b-breakthrough-floor-ranking.js',
  // imp-2501: ESY weak-domination strict-upgrade gate (ticket imp-370) — pins the exact boundary of the imp-2500 ranking. imp-2500 proved WEAK domination (angle (b) floor 2 not-cheaper-than a single-input floor-1 route) and stopped short of STRICT domination because of an UNLESS escape clause; its reference floor of 1 was set by STIPULATION, not by auditing a concrete catalogued route. This module names the single verification that would discharge the clause against the canonical Bui-Soundararajan density port (imp-1123) — a comparison-route floor audit confirming exactly one required input — and records it as NOT performed, so STRICT domination stays unproven and the honest ceiling remains WEAK domination. Boundary pin only; imp-370 stays research-grade open.
  '/src/data/imp-2501-esy-weak-domination-strict-upgrade-gate.js',
  // imp-2502: ESY BS-route floor audit (ticket imp-370) — PERFORMS the comparison-route floor audit imp-2501 named as the single open gate. Reads the imp-1123 BS obstruction set: O-BS-C / O-BS-D are engine-closable (0 to the floor), and the two research-grade obstructions O-BS-A (effective C_BS) / O-BS-B (the (log T)^A exponent) are COUPLED — discharged by the SAME Heath-Brown style explicit-constants follow-up — so they collapse to ONE independent breakthrough, giving breakthroughCountFloorBS = 1. That resolves the imp-2500 UNLESS clause FALSE for the BS route and UPGRADES the WEAK domination of angle (b) (floor 2) to STRICT domination AGAINST THE BS ROUTE, discharging the imp-2501 residual sub-gap. Honest scope: strict claim is route-specific (not a global most-expensive overclaim), inherits the imp-1123 coupling characterization (new weaker residual sub-gap), and does NOT close O1/O2/O3 or imp-370 angle (b).
  '/src/data/imp-2502-esy-bs-route-floor-audit.js',
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
  // imp-1299: AUTO-CONJECTURE symbolic-fit survey over 3 frozen empirical targets
  // (imp-1238 plateau offset, imp-1240 Volterra norm scaling, imp-1243 ghost margin).
  // One clean structurally-backed identity (||V_{a,Phi}|| ~ a^1 sinh linearization);
  // one candidate-within-noise (~0.86 offset, artifact not identity); one negative
  // result (ghost margin is a discrete 3-value bracket sequence). Reads sources live.
  '/src/data/imp-1299-symbolic-regression-survey.js',
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
  // imp-2656: CURRENT strategic map for the direct-RH stream. Synthesizes the
  // v52 audit (7 SUBSUMED-BY-RH, 5 PARTIALLY-RELATED, 2 INDEPENDENT-NOVEL, 1
  // SUBSUMED-BY-LITERATURE), states the Montgomery PCC obstruction precisely,
  // and ranks the INDEPENDENT-NOVEL targets by closeness to proof (27.2 closest,
  // PCC-independent; 22.1 far). Orients the effort onto Conjecture 27.2.
  '/src/data/imp-2656-direct-rh-conjecture-map.js',
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
  // imp-2684 (PARTIAL): cosh-addition reduction collapsing the exact-HS DOUBLE
  // integral E(a) to a SINGLE O(N) integral E(a) = (1/2) int Phi² [cosh(2ax)C -
  // sinh(2ax)S - P] dx, the analytic prerequisite that turns the sliver
  // (34.98, 37.66] certification (imp-2654 single obstruction) from a 2D into a
  // 1D validated-quadrature problem. Verified to match the direct 2D quadrature
  // and the frozen exact-HS crossover 37.66224030 to 8+ sig figs. HONEST: no
  // validated enclosure produced yet (naive separable split is lossy by ~3
  // orders of magnitude); residual sub-gap is a cancellation-preserving cell-wise
  // enclosure in d = x-y. RH-EQUIVALENT route, no QED. 6 tripwires.
  '/src/data/imp-2684-volterra-sliver-interval.js',
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
  // imp-2332: HONEST NEGATIVE RESULT — feasibility assessment of removing the
  // Polymath15 Lemma 5.2 citation via a self-contained G6a re-derivation.
  // Verdict: NOT achievable as a "200-line port" (corrects imp-1264). Reduces
  // Lemma 5.2 to two un-discharged research-grade sub-claims: R1 uniform
  // Gronwall flow-Lipschitz AT the collision singularity, R2 cusp-density
  // W_1^{1/2} concentration. Holder-1/2 EXPONENT rigorous; uniform CONSTANT
  // citation-conditional. Bound stays "modulo Polymath15 Lemma 5.2". 7 tripwires.
  '/src/data/imp-2332-g6a-self-containment-assessment.js',
  // imp-2333: FORMAL DOWNGRADE — Route 3 (higher-cumulant ESY closure) is
  // restated as CONDITIONAL on the Rudnick-Sarnak three-point conjecture for
  // GENERAL (full-Fourier-support) test functions. Confirms the imp-1247
  // correction: the load-bearing Route 3 gap is general rho_3, NOT Montgomery
  // PCC. Restriction-method candidate (alternative A) surveyed and shown
  // structurally unable to reach full support unconditionally. Named residual
  // GAP-RS3PT-FULL-SUPPORT. No Lambda bound moves; SOTA stays <= 0.2. 6 tripwires.
  '/src/data/imp-2333-route3-rs3pt-conditional-downgrade.js',
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
  // imp-1269 sub-(e): closureNote well-formedness mini-audit. The "wave-15"
  // label is stale (no such grouping exists), so scoped to the real invariant:
  // every completed ticket bearing a closureNote carries a non-empty string.
  // Finding: malformedClosureNoteCount === 0 across all 1454 completions —
  // clean. Tripwires assert the snapshot's internal consistency (drift-free).
  // 4 tripwires.
  '/src/data/imp-1269-wave15-closurenote-audit.js',
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
  // imp-1307: NEW-INPUT classification — can the Connes-Bost adelic Lefschetz-
  // trace approach (Connes 1999 Selecta Math. 5, 29-106; Connes-Marcolli 2008
  // "Noncommutative Geometry, Quantum Fields and Motives", AMS Colloquium
  // Publications Vol. 55) yield a 2-point bound on the §15-27 ESY-closure
  // Poisson kernel at Fourier support sigma > 1 that BYPASSES the Montgomery
  // PCC obstruction documented in imp-1297/1302/1303/1304/1305? Verdict:
  // connes-bost-program-not-rigorous-as-published. The UNCONDITIONAL absorption
  // identity Connes 1999 Thm III.1 IS the Weil 1952 explicit formula in adelic
  // coordinates — same content as the classical explicit formula used by all
  // five moment-method routes, with the same (log T)^{1/2} Cauchy-Schwarz
  // obstruction at the off-diagonal prime-power correction. The CONJECTURAL
  // Lefschetz-trace interpretation Thm III.5 requires unproven type-II_1 trace
  // positivity on the adele class von Neumann algebra L(Y_Q), local positivity
  // at every place (equivalent to RH via Weil positivity), and additional
  // auxiliary inputs (Marcolli adelic universality, Meyer 2005 partial
  // absorption, Connes-Consani 2014 hyperring approach). 27 years since Connes
  // 1999 and 18 since Connes-Marcolli 2008 without the load-bearing positivity
  // being established. Tao 2008 review (MR2371808) explicitly identifies the
  // program as "suggestive framework rather than proof strategy with clear
  // endgame". First NEW-INPUT route audited after pcc-moment-methods-exhausted
  // verdict; aggregate pattern: moment-method family EXHAUSTED + Connes-Bost
  // NOT RIGOROUS. Engine planning: audit imp-1308 (Berry-Keating + Sierra-
  // Townsend 2008) next; in parallel DECOUPLE §15-27 closure from PCC at
  // support > 1 via test-function reformulation inside sigma <= 1 (lambda-
  // attack reformulation track). 12 tripwires.
  '/src/data/imp-1307-connes-bost-adelic-attack.js',
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
  // imp-1306: CRITICAL audit — can the Ingham 1940 effective constant feeding
  // E_trunc_pt = 3.06e-5 in the imp-1261 unconditional asymptotic Lambda
  // composition be sharpened by substituting modern explicit-NT alternatives
  // (Trudgian 2014, Cheng-Graham 2001, Hiary 2016, Platt-Trudgian 2020)?
  // Verdict: modern-constants-do-not-apply. The four ticket-named references
  // bound DIFFERENT analytic objects (N(T) counting, |zeta| pointwise,
  // Riemann-Siegel evaluation, verified zero-strip height) than the zero-density
  // N(sigma, T) estimate fed by Ingham 1940 into the imp-447 / imp-459 chain.
  // The single drop-in modern alternative (Bui-Soundararajan 2008, J. London
  // Math. Soc. 78) yields formal 2.04e6x tightening (3.06e-5 -> 1.51e-11) but
  // is RESEARCH-GRADE BLOCKED with four obstructions (O-BS-A through O-BS-D)
  // per imp-1123; rigorous tightening factor today = 1.0. Within Ingham
  // itself, sigma re-optimisation 0.75 -> 0.99 would tighten 6.4e8x formally
  // but inherits the same rigor obstructions imp-459 ducked. Recommended
  // follow-ups seed BS rigorous port revival + Kadiri effective-Ingham audit
  // + sigma re-optimisation port. 12 tripwires (10+ required).
  '/src/data/imp-1306-ingham-sharpening.js',
  // imp-1314: Lambda tightening lever -- can the Polymath15 G6a Holder constant
  // C_H = 1/8 in the shock-Lipschitz modulus be sharpened by substituting
  // modern alternatives (Pernici 2007, Caffarelli-Vasseur 2010, Kruzhkov 1970,
  // Bourgain-Sinai 2009, Deift-Zhou 1993 / Trogdon 2015)? Verdict: G6a-constant-
  // 1/8-is-already-optimal-via-Dyson-rigidity. The 8 in d(g_min^2)/dt = -8
  // factors as 2 (chain rule, immutable) * 4 (beta=2 GUE short-range Coulomb
  // coefficient, fixed by Hermitian conjugation symmetry; Mehta 2004 / Dyson
  // 1962). Sharpening would require switching ensembles (GSE beta=4 gives
  // 1/16) which is a category error for the GUE Riemann-zeros conjecture
  // (Montgomery 1973). All 7 modern alternatives surveyed either bound the
  // wrong observable (Pernici / Kruzhkov), require viscosity (Caffarelli-
  // Vasseur, wrong PDE class), give the wrong exponent (Bourgain-Sinai
  // KPZ 2/3 vs 1/2), or recover the same -4/g_min coefficient without
  // sharpening (Deift-Zhou / Trogdon / Erdos-Schlein-Yau). Lambda bound
  // unchanged at 3.06e-5; tightening factor on Lambda = 1.0. The C_H lever
  // does NOT gate Lambda (E_trunc_pt is the bottleneck; see imp-1306 also
  // producing tightening factor 1.0). 13 tripwires (8+ required).
  '/src/data/imp-1314-G6a-constant-sharpening.js',
  // imp-1327: Polymath15 -> imp-1261 chain explicit-constant audit. Systematic
  // walk of all seven chain constants (C_Selberg, C_KH, K_0, K_1, C_HO, C_H,
  // E_trunc_pt), classifying each as rigor-frontier vs has-headroom and
  // gating vs non-gating on the headline Lambda <= 3.06e-5. Verdict: chain-
  // headroom-is-non-gating-bottleneck-is-E_trunc_pt. Three are rigor frontier
  // (C_H = 1/8 Dyson rigidity per imp-1314; E_trunc_pt = 3.06e-5 Ingham per
  // imp-1306; K_1 = 1/(2 sqrt(2 pi)) sharp strip-Jacobian geometric coeff).
  // Four carry ~2x headroom (C_Selberg = 3.0 convention value propagating to
  // C_KH = pi C_Selberg, K_0 = pi C_Selberg / sqrt(2 pi), C_HO = 2 K_0 / K_1^2)
  // but ALL live in the |t_c(N)| -> 0 rate, not the E_trunc_pt anchor. Since
  // lim sup |t_c(N)| = 0 exactly (imp-341), collapsing the rate headroom gives
  // a ~2x finite-N speedup (helps imp-440 / imp-1088 witnesses) but leaves the
  // headline 3.06e-5 unchanged (tightening factor on Lambda = 1.0). The sole
  // gating constant is E_trunc_pt; the only Lambda-moving lever is raising
  // T_PT past 3e12 (imp-1328) or a uniform-in-sigma A=0 Ingham (imp-1329).
  // 12 tripwires (one+ per audited constant). No false QED.
  '/src/data/imp-1327-polymath15-chain-constant-audit.js',
  // imp-1311: NOVEL CLASSIFICATION — direct attack on RH and a numerical Lambda
  // bound via the Robin 1984 (J. Math. Pures Appl. (9) 63 (1984) 187-213) +
  // Lagarias 2002 (Amer. Math. Monthly 109 (2002) 534-543) sigma(n)/n elementary
  // RH-equivalent criteria, structurally orthogonal to spectral/moment/explicit-
  // formula attacks. Verdict: robin-criterion-RH-equivalent-only-not-numerical.
  // Robin and Lagarias are STRICT RH equivalences (RH iff sigma(n) < e^gamma*n*
  // log log n for n >= 5041; RH iff sigma(n) <= H_n + exp(H_n)*log(H_n) for
  // n >= 1) — by Newman 1976 + de Bruijn 1950 this gives Lambda <= 0 IFF RH,
  // qualitative only. The CA-number asymptotic G(N_k) = sigma(N_k)/(N_k log log
  // N_k) -> e^gamma along the colossally-abundant sequence (Erdős-Nicolas 1981,
  // Nicolas 1983, Caveney-Nicolas-Sondow 2011) is governed by Mertens 3rd
  // theorem with the Mertens constant C_M as the leading correction — NOT a
  // Lambda-related constant. Empirical evaluation on the first 14 CA numbers +
  // the known n = 5040 exception recovers the classical Robin failures at
  // {2, 6, 12, 60, 120, 360, 2520, 5040} and confirms Robin holds at all
  // sampled n >= 5041 (restating empirical RH on the tested range, strictly
  // weaker than Platt-Trudgian 2021's verification up to T = 3 * 10^12).
  // 12 tripwires.
  '/src/data/imp-1311-robin-lagarias-combinatorial-attack.js',
  // imp-1312: NOVEL CLASSIFICATION — direct attack on RH and a numerical Lambda
  // bound via the Beurling 1955 (Proc. Nat. Acad. Sci. USA 41 (1955) 312-314) +
  // Nyman 1950 (Uppsala PhD) + Bercovici-Foias 1984 (J. Funct. Anal. 56 (1984)
  // 168-182) functional-analytic RH-equivalent criterion + the BBLS-05
  // quantitative form (Balazard-Saias 2005 J. Number Theory 115 234-260).
  // Verdict: beurling-nyman-RH-equivalent-only-not-numerical. Beurling-Nyman:
  // RH iff L^2(0,1)-closure of span{rho(theta/x) - theta*rho(1/x) : 0 < theta
  // < 1} contains 1, where rho(y) = y - floor(y) is the fractional-part
  // function. BBLS-05 quantitative: d_N^2 := inf integral_0^1 |1 - sum a_k
  // rho(1/(kx))|^2 dx satisfies d_N -> 0 iff RH, with conjectured asymptotic
  // d_N^2 ~ C^2/log N where C^2 = sum_{rho} |rho zeta'(rho)|^{-2} is the
  // Baez-Duarte constant (a zero-side moment, NOT a heat-flow constant). By
  // Newman 1976 + de Bruijn 1950 the implication is qualitative only — Lambda
  // <= 0 IFF RH. All three BBLS sub-questions answered NO: finite-N d_N does
  // not give Lambda bound; conjectured asymptotic does not give Lambda bound;
  // Baez-Duarte constant does not connect to Lambda (it is a Selberg/
  // Soundararajan-style zero-side moment). Section §15-27 intersection (per
  // ticket item 3, imp-1258 two-way collapse ||V_{a,Phi}|| <= 1 ⇔ RH modulo
  // Montgomery PCC): BN and §27 Volterra are ORTHOGONAL operator-theoretic
  // families — different Hilbert spaces (L^2(0,1) multiplicative vs L^2([0,
  // infinity)) sinh-additive), different category (density vs norm-
  // contraction), Mellin bridge blocked at §27 side by imp-1266 (sinh(at)
  // kernel additive not multiplicative, Phi-modulation breaks scaling,
  // sinh(at) no L^2(R_+) Mellin transform). Shared only via trivial RH-
  // equivalence relation. THIRD orthogonal RH-equivalent family classified
  // negative (joining elementary-NT imp-1311 Robin/Lagarias and spectral/
  // moment imp-1297+imp-1302+imp-1303+imp-1305+imp-1309). 12 tripwires.
  '/src/data/imp-1312-beurling-nyman-attack.js',
  // imp-1310: CRITICAL classification — is there an alternative §15-27 → RH
  // closure pathway whose final step requires ONLY Fourier support ≤ 1 (where
  // Montgomery 1973 is unconditional), thereby DECOUPLING the chain from the
  // support > 1 PCC regime that imp-1297 + imp-1302 + imp-1303 + imp-1304 +
  // imp-1305 collectively ruled out? Verdict:
  // reroute-eliminated-support-greater-1-is-intrinsic. Support > 1 enters at
  // imp-1184 STEP D3 (Selberg PCC fixed-x fluctuation rate 1/sqrt(N) vs
  // optimistic 1/N) and STEP D5 (rho_3 / second-order discrepancy for sup-
  // improvement), both via Poisson kernel P_{y_micro} with Fourier tail
  // extending to log γ_N / (2π) at the unfolded microscopic scale y_micro =
  // 2 π / log γ_N — vastly exceeding Montgomery's [-1, 1] unconditional window
  // and Rudnick-Sarnak 1996's (-2/3, 2/3) rho_3 window. The three named
  // reroute candidates all collapse: (a) wavelet decomposition fails by
  // Plancherel invariance + Heisenberg uncertainty (Fourier support is a
  // property of the function not the basis; reproducing P_{y_micro} via
  // support ≤ 1 wavelet basis requires reaching scale j ≈ log_2(log γ_N) where
  // dyadic band exceeds support 1); (b) Mellin-truncation via short-interval
  // second moments fails because the observable swap loses pointwise content
  // needed by bridge-threshold theorem AND reproduces the existing
  // (log γ_N)² / N baseline — the (log γ_N) gap resurfaces as support > 1
  // requirement in the Mellin observable per Iwaniec-Kowalski 2004 §25
  // Plancherel rigidity; (c) direct §15-27 reformulation fails because Mellin
  // diagonalization of V_{a,Φ} is structurally blocked per imp-1266 (kernel
  // additive not multiplicative + Φ-modulation breaks scaling + sinh(at)
  // Mellin transform does not exist) and de Branges H(E_a) direct route per
  // Romanov-Woracek-Pruss 2024 territory requires open imp-1241 unified
  // existence + still hits support > 1 at the unfolded scale + the bridge-
  // threshold theorem is rigidly attached to y_micro (raising y to fixed scale
  // gives only macroscopic law). All three failures share the same Plancherel /
  // Heisenberg root: the support > 1 requirement is INTRINSIC to the
  // microscopic scale y_micro = 2 π / log γ_N. SIXTH consecutive negative
  // classification in PCC-attack series (imp-1297 + imp-1302 + imp-1303 +
  // imp-1304 + imp-1305 + imp-1310). The (log T)^{1/2} Cauchy-Schwarz layer
  // obstruction (imp-1303 / imp-1305) and the support > 1 transcription
  // obstruction (imp-1184 / imp-1310) are facets of the same Plancherel /
  // Heisenberg intrinsic constraint. Aggregate verdict:
  // pcc-genuinely-open-pending-new-input-geometric-or-adelic. Engine pivots to
  // imp-1307 (Connes-Bost adelic), imp-1308 (Berry-Keating H = xp), Hecke
  // triangle Selberg trace, or closing imp-1241 to enable de Branges direct
  // route. 12 tripwires.
  '/src/data/imp-1310-section15-27-support-leq-1-reroute.js',
  // imp-1309: NEW-INPUT CRITICAL classification — does Tao 2024 (or the
  // closest-known: Bloom-Maynard-Sisask 2020 entropy / additive-energy bounds +
  // Tao 2014 entropy compression + Tao-Vu 2011-2017 Wigner universality)
  // entropy-bound on zero gaps provide a genuinely NEW input that bypasses the
  // Montgomery PCC obstruction at Fourier support > 1 that imp-1297 + imp-1302 +
  // imp-1303 + imp-1304 + imp-1305 (moment-method family) all hit? Verdict:
  // tao-entropy-not-applicable-to-single-zeta-2-point. The entropy method is
  // GENUINELY ORTHOGONAL to moment methods in its primary domain (additive
  // combinatorics on integers, prime-gap statistics) but the orthogonality
  // does NOT transfer to the single-zeta 2-point PCC observable at sigma > 1
  // for three independent structural reasons: (R1) domain mismatch (entropy
  // bounds spacings, PCC bounds Fourier-pair-correlation, translation passes
  // through Pinsker + Cauchy-Schwarz + Parseval); (R2) absence of additive-
  // combinatorial structure on zeros (conjectural GUE is locally repulsive,
  // OPPOSITE of additive); (R3) linear-statistic vs set-count mismatch
  // (entropy outputs first-moment / concentration, PCC needs second-moment).
  // The entropy method SHIFTS the Cauchy-Schwarz step from input stage to
  // output stage but does not eliminate it; the (log T)^{1/2} slack is a
  // property of the L^1 / L^2 Hölder boundary not of any specific input.
  // Honest training-time uncertainty acknowledged: exact "T. Tao, Entropy
  // bounds on zero gaps, 2024" reference uncertain at January 2026 cutoff;
  // classification uses closest-known form (BMS2020 + Tao 2014 + Tao-Vu).
  // Aggregate verdict EXTENDED: imp-1297+1302+1303+1304+1305 (moment family)
  // + imp-1309 (entropy family) all negative -> pcc-genuinely-open-pending-
  // new-input remains; standard analytic-number-theory toolkit EXHAUSTED for
  // PCC at 2-point with support > 1. Remaining candidates: Connes-Bost
  // (imp-1307), Berry-Keating (imp-1308), imp-1310 alternative §15-27 pathway
  // with sigma <= 1. 12 tripwires.
  '/src/data/imp-1309-tao-entropy-pcc-attack.js',
  // imp-1308: NEW-INPUT CRITICAL classification — does the Berry-Keating H = xp
  // semiclassical Hamiltonian (BK1999) + Sierra-Townsend 2008 Landau-level
  // quantum correction provide a new input bypassing the Montgomery PCC
  // obstruction at support > 1? Verdict: berry-keating-program-not-rigorous-
  // as-published. (B1) no self-adjoint operator / reproduces only the smooth
  // counting function, not the zeros (Hilbert-Polya unconstructed); (B2) the
  // Bogomolny-Keating 1996 semiclassical PCC at support > 1 is CONDITIONAL on
  // Hardy-Littlewood (equivalent to PCC via Goldston-Montgomery 1987, circular);
  // (B3) the off-diagonal periodic-orbit sum IS the explicit-formula off-diagonal
  // correction, hitting the same (log T)^{1/2} Cauchy-Schwarz slack as imp-1303 /
  // imp-1305. Second geometric route after Connes-Bost (imp-1307), also NOT
  // RIGOROUS. 12 tripwires.
  '/src/data/imp-1308-berry-keating-quantum-attack.js',
  // imp-1339: CRITICAL classification — do the Hecke triangle groups
  // G_q = Delta(2, q, infinity) have a different spectral structure giving a
  // single-zeta 2-point bound at support > 1 bypassing the SL(2, Z) Sarnak AQC
  // equivalence of imp-1297? Verdict: hecke-triangle-no-bypass-arithmetic-
  // dichotomy. zeta enters a Selberg trace formula ONLY via the Eisenstein
  // scattering determinant phi(s), whose closed zeta / L form is a consequence
  // of ARITHMETICITY. By Takeuchi 1977 the arithmetic (2,q,infinity) triangle
  // groups are exactly q = 3, 4, 6, infinity. The bypass needs both a
  // zeta-bearing scattering determinant (P-zeta) and non-AQC statistics
  // (P-nonAQC), but these are mutually exclusive: arithmetic q in {3,4,6} have
  // P-zeta yet obey AQC (re-encode imp-1297); non-arithmetic q are plausibly
  // non-AQC but their scattering determinant is not zeta-bearing so the trace
  // formula carries no info about the zeros. Rigidity obstruction of the
  // imp-1334 family. Fourth spectral / trace-formula route after Selberg
  // (imp-1297), Connes-Bost (imp-1307), Berry-Keating (imp-1308), all NEGATIVE
  // -> spectral family EXHAUSTED for a zeta 2-point bypass at support > 1.
  // 10 tripwires.
  '/src/data/imp-1339-hecke-triangle-selberg-trace.js',
  // imp-1340: CRITICAL structural reduction — can a DIRECT construction of the
  // de Branges space H(E_a) from Phi close CDB-Exist (imp-1241) unconditionally
  // and thereby close §15-27 -> RH WITHOUT routing through ||V_{a,Phi}|| <= 1 ->
  // CDB-Exist -> PCC? Verdict: cdb-exist-direct-construction-reduces-to-
  // hermite-biehler-positivity-rh-equivalent. The construction factors into a
  // FORMAL layer (Aronszajn 1950 RKHS factorization + Arov-Nudelman 1996 passive
  // realization — both unconditional and zero-set-free) and a POSITIVITY layer
  // (E_a = X(a - iz) Hermite-Biehler / Theta_a = E_a^#/E_a Schur, from Phi). By
  // the change of variable s = a - iz, E_a Hermite-Biehler iff X has no zeros in
  // Re(s) > a; quantified over all a > 0 this is RH, and the de Branges 1986
  // chain-ordering theorem makes it TWO-WAY (RH-equivalent, sharpening the
  // imp-1245 axis-(b) inner-factor rigidity gap from RH-sufficient). Arov-Nudelman
  // gives NO Riemann-special-case unconditional bypass — its input hypothesis is
  // the RH-equivalent positivity. NAMED RESIDUAL SUB-GAP GAP-HB-POS: prove E_a
  // Hermite-Biehler for all a > 0 directly from Phi without the zero set or RH.
  // So the imp-1310 "cleanest remaining structural lever" (de Branges direct
  // route) is NOT a PCC bypass; it relocates the difficulty into GAP-HB-POS = RH.
  // 10 tripwires.
  '/src/data/imp-1340-CDB-Exist-direct-construction.js',
  // imp-1323: literature audit for T_PT = 3e12 successor (Platt 2023 continuation,
  // Johnston 2025 extensions). Verdict: no-peer-reviewed-successor-found; E_trunc_pt
  // unchanged at 3.06e-5; tightening factor 1.0. Hypothetical scenarios at 1e13, 3e13,
  // 1e14 computed. 6 tripwires.
  '/src/data/imp-1323-T-PT-successor-audit.js',
  // imp-1328: GPU-accelerated zero-verification COMPUTE DESIGN to push T_PT = 3e12
  // toward 1e14 (engineering design only, NO execution). Method stack:
  // Riemann-Siegel-Gourdon fast eval + Odlyzko-Schonhage / Platt-FFT amortization
  // + Booker-Trudgian-Platt Turing counting + Platt interval-arithmetic rigor.
  // Naive RS-only is ~1.8e21 ops (infeasible); amortization drops it to ~1e17-1e18
  // effective ops (multi-month GPU-cluster campaign). Verdict
  // feasible-with-amortization-two-engineering-risks-named. Sub-gap SUBGAP-1328:
  // R-AMORT (amortization constant is the dominant cost uncertainty) and R-RIGOR
  // (certified GPU enclosure + deterministic reduction unsolved -- the binding
  // correctness risk). tighteningFactorRigorous stays 1.0; E_trunc_pt stays
  // 3.06e-5. T=1e14 payoff if a future campaign succeeds: ~4.07x. 8 tripwires.
  '/src/data/imp-1328-T_PT-compute-design.js',
  // imp-2322: Lambda audit. Re-derives E_trunc_pt as an explicit power law in the
  // verified zero-strip height T_PT (E = 3.0 * T^{-0.4} at sigma_opt = 0.75) and
  // tabulates the bound at every candidate height. Key findings: the sensitivity is
  // an EXACT constant elasticity d log E / d log T = -kappa = -0.4 (10^{0.4} ~ 2.512x
  // per decade), and the single LOAD-BEARING height is Platt-Trudgian 2021 (3e12),
  // the only peer-reviewed all-zeros-in-strip verification -- individual-zero heights
  // (Gourdon 2.5e12, Odlyzko/LMFDB to 1e22) are loadBearingEligible = false.
  // tighteningFactorRigorous stays 1.0; E_trunc_pt stays 3.06e-5. 10 tripwires.
  '/src/data/imp-2322-etrunc-pt-T_PT-sensitivity.js',
  // imp-1324: rigor-honesty audit of the imp-459 implicit-constant-1 assumption at
  // sigma_opt = 0.75 against the Kadiri family of effective-Ingham bounds (Kadiri
  // 2013 / KLN 2018 / Simonič 2020) plus mitigating evidence (Heath-Brown 1979,
  // Ramare 2016). VERDICT: implicit-constant-borderline-needs-paper-grade-uniformity.
  // The 3.06e-5 headline is defensible at the boundary case sigma = 3/4 via
  // Heath-Brown 1979, but strict KLN 2018 substitution would push the bound to
  // ~ 0.253 (just over Polymath15 0.2). Recommended: keep 3.06e-5 with paper-grade
  // footnote; defensible-conservative bound 1.76e-3 (Ramare); worst-case 0.253 (KLN).
  // Definitive close via imp-1322 sigma re-optimisation (sigma -> 0.99). 14 tripwires.
  '/src/data/imp-1324-kadiri-effective-ingham-audit.js',
  // imp-1321: Bui-Soundararajan 2008 rigor port -- map closability of imp-1123 obstructions
  // O-BS-A through O-BS-D. Verdict: 2-of-4-closable-rest-need-new-input. O-BS-A (effective
  // C_BS) closable via Kadiri 2013 / KLN 2018 / Simonic 2020 / Johnston-Yang 2023 explicit-
  // constants tradition (4-8 weeks); O-BS-D engine-closable (mechanical grep); O-BS-B (pin
  // A in (log T)^A) closable via paper-walk but LIKELY-BINDING: at central A_BS = 6 the
  // (log T_PT)^6 ~ 5.6e8 multiplier DESTROYS the formal 2.04e6 tightening; only A_BS <= 4
  // preserves a 3x rigorous gain (requires Heath-Brown 2008 / Soundararajan-Tao 2024
  // sharper mollifier); O-BS-C (edge behaviour sigma -> 1) needs new input. Honest bottom
  // line: closing all 4 yields at most a 3-30x rigorous tightening, NOT the 6 orders of
  // magnitude claimed by formal substitution. Dedicated explicit-constants paper outlined
  // (9 sections, 8 lemmas, 40-60 pages, Acta Arith / Math. Comp. venue). 12 tripwires.
  '/src/data/imp-1321-bui-soundararajan-rigor-port.js',
  // imp-1322: Lambda tightening -- sigma-reoptimize within Ingham 1940 itself (0.75 -> 0.99,
  // 6.4e8 formal factor). Verdict: sigma-reopt-needs-new-uniformity-lemma (secondary:
  // sigma-reopt-equivalent-effort-to-BS-port). The formal 6.4e8 tightening (3.06e-5 ->
  // 4.79e-14) is exact under C_I = 1, A_I = 0; but the Kadiri 2013 / Kadiri-Lumley-Ng 2018
  // family worst-case A_I = 6 gives (log T_PT)^6 ~ 5.7e8 loosening that CANCELS the formal
  // gain pound for pound. The closing lemma needed (A_I = 0 sigma-uniformly as sigma -> 1
  // with C_I = O(1)) is NOT published in the literature; closing requires a dedicated 1-2
  // month explicit-constants paper sharing a candidate technique (BFI 1986 mean-value) with
  // imp-1321. Payoff ratio imp-1322 / imp-1321 ~ 314x IF closable. Parallel attack
  // recommended. Paper outline shipped (6 sections, principal Lemma 3.1 sigma-uniform
  // Ingham, 20-30 pages, J. Number Theory / Math. Comp. venue). Closes the imp-1324
  // "definitive close via imp-1322" requirement. 13 tripwires.
  '/src/data/imp-1322-ingham-sigma-reopt.js',
  // imp-1317: CONCRETE empirical test of the imp-1298 GL(n) HS-bound extension
  // on a specific GL(2) L-function -- the modular discriminant L(s, Delta)
  // (Ramanujan tau coefficients, weight 12, level 1, self-dual). Computes
  // Phi_Delta(u) = e^{6u} sum_n tau(n) exp(-2 pi n e^u) on [0, 2] via
  // truncated series (N_TAU=20; tail < 5e-50 at u=0), evaluates I_0^L,
  // J_a^L at a in {0.01, 0.05, 0.2}, and compares to Galerkin op_norm via
  // power iteration on V[i][j] = h * Phi(t_i) Phi(t_j) sinh(a(t_j-t_i)).
  // VERDICT: gl2-maass-HS-bound-holds. All 3 rows have hs_bound >= op_norm
  // with consistent 1.71x Cauchy-Schwarz slack (same regime as imp-1267
  // scalar xi case). Both HS bound (max 4.84e-8) and op_norm (max 2.83e-8)
  // more than 8 orders below Conj 27.2 threshold of 1. Linearity-in-a
  // matches expected ratios (5.0 and 4.0) to 0.1%. First concrete empirical
  // validation of the imp-1298 structural extension. NOT a proof of GRH for
  // L(s, Delta). Honest scope flags: Delta is HOLOMORPHIC (not Maass per
  // se), matrix Phi_L of imp-1298 collapses to scalar in weight-12
  // holomorphic case (true GL(2) Maass test with 2x2 matrix is OPEN). 11
  // tripwires (8+ required).
  '/src/data/imp-1317-gl2-maass-hs-concrete.js',
  // imp-2356: companion to imp-1317 -- Volterra HS-bound test on a REAL-ANALYTIC
  // MAASS cusp form (first even SL(2,Z) eigenform, spectral parameter R=9.5337).
  // Kernel g(u) = 2 e^{u/2} sum a(n) K_{iR}(2 pi n e^u) via the K-Bessel of
  // imaginary order K_{iR}(x) = int cos(R t) exp(-x cosh t) dt. The self-dual
  // Maass kernel is a SINGLE REAL scalar (K_{iR} encodes the product gamma
  // factor), resolving imp-1317 caveat #5. VERDICT: maass-HS-bound-holds. All 3
  // rows (a in {0.01,0.05,0.2}) have hs_bound >= op_norm with a CONSTANT 2.34x
  // Cauchy-Schwarz slack (within the imp-1267 scalar-xi range 1.58x-2.57x);
  // both HS bound (max 1.095e-14) and op_norm (max 4.679e-15) are >13 orders
  // below the threshold 1; linearity-in-a to 0.1%. Evidence the Volterra
  // contraction is a general automorphic phenomenon, not an artifact of
  // holomorphy. Approximate Hecke eigenvalues; NOT a proof of GRH. 11 tripwires.
  '/src/data/imp-2356-maass-volterra-hs.js',
  // imp-2402: HS-bound spot-check on a SECOND holomorphic GL(2) family after
  // Delta -- the weight-16 level-1 newform F = Delta * E4 (LMFDB 1.16.a.a).
  // Coefficients a(n) computed EXACTLY from the q-expansions of Delta and E4
  // (a(1)=1, a(2)=216). Phi_F(u) = e^{8u} sum a(n) exp(-2 pi n e^u) (gamma
  // center s = k/2 = 8, vs 6 for Delta). Sweeps a in {0.01,0.05,0.2}. VERDICT:
  // gl2-weight16-HS-bound-holds. All 3 rows have hs_bound >= op_norm with a
  // CONSTANT 1.82x Cauchy-Schwarz slack (inside the imp-1267 band 1.58x-2.57x,
  // close to Delta weight-12 1.71x); both HS bound (max 2.14e-7) and op_norm
  // (max 1.18e-7) >6 orders below the threshold 1; linearity-in-a to <0.2%.
  // Evidence the HS contraction persists across holomorphic cusp forms of
  // varying weight. Scalar reduction (single Gamma factor); NOT a GRH proof.
  // 10 tripwires.
  '/src/data/imp-2402-gl2-weight16-hs.js',
  // imp-1347: symbolic-regression identification of the consistent ~1.71x slack
  // between the imp-1267 HS bound sqrt(I_0 J_a) and the empirical op-norm. The
  // outer ratio factors as (Cauchy-Schwarz slack) x (HS-vs-op ratio); the FIRST
  // factor has the EXACT small-a closed form 1/sqrt(1 - rho^2) with rho^2 =
  // M_1^2/(I_0 M_2), M_k = int Phi^2 u^k du. For Riemann xi rho^2 = 0.5808 so
  // slack_CS = 1.54458, matching the directly-computed slack to 9 sig figs (rel
  // err 2.3e-10). Sharpens the small-a HS bound to a sqrt(I_0 M_2 - M_1^2)
  // (tighter by 1.5446x). HONEST PARTIAL: only the Cauchy-Schwarz factor is
  // closed-form; the residual HS-vs-op ratio is the named sub-gap
  // GAP-1347-HS-TO-OP. The closed FORM is universal; the VALUE is xi-specific.
  // 8 tripwires.
  '/src/data/imp-1347-cauchy-schwarz-slack-symbolic-regression.js',
  // imp-1346: GRH empirical check -- HS bound on primitive quadratic Dirichlet
  // L-functions L(s, chi_q) for q in {3, 5, 7, 11}. Phi_q(u) from the Dirichlet
  // theta function (even: 2 e^{u/2} sum chi(n) exp(-pi n^2 e^{2u}/q); odd: extra
  // e^{u} prefactor and n weight). Sweeps a in {0.01, 0.05, 0.2} per conductor
  // (12 rows). VERDICT: dirichlet-GRH-HS-bound-holds. Every row has
  // hs_bound >= op_norm with margins 1.72x-2.59x (inside the imp-1267 scalar
  // slack band 1.58x-2.57x); both HS bound (max 0.270 at q=11) and op_norm
  // (max 0.104) below the Conj 27.2 threshold 1. Extends the imp-1298 framework
  // to a third L-function family after zeta (imp-1267) and Delta (imp-1317).
  // Quadratic (real self-dual) chi only; complex chi OPEN. NOT a proof of GRH.
  // 11 tripwires (8+ required).
  '/src/data/imp-1346-dirichlet-character-GRH-empirical.js',
  // imp-1344: NEW-INPUT classification -- can Harper-type random multiplicative
  // function results (the "RH for typical chi" body of work; Harper 2020 Annals
  // better-than-squareroot cancellation via critical Gaussian multiplicative
  // chaos; random-Euler-product almost-sure analogue) be DERANDOMIZED to the
  // single deterministic Riemann zeta? VERDICT:
  // harper-random-not-derandomizable-to-deterministic-riemann. Premise
  // corrected first (no literal "Harper 2017 RH for random chi" theorem at
  // training-cutoff). Four independent obstructions: (D1) ensemble-vs-
  // realization (typical-realization statements are silent on a fixed
  // probability-zero realization); (D2) the load-bearing INDEPENDENCE of {f(p)}
  // is false for the deterministic phases p^{-it} (rigidly correlated,
  // Kronecker-Weyl); (D3) wrong observable (partial-sum SIZE vs ZERO location;
  // random zero-free regions use Borel-Cantelli + second moment); (D4) Voronin
  // universality runs the wrong way (proved from zero-distribution inputs, only
  // approximates zero-free targets, cannot certify zero-freeness). Random model
  // stays VALUABLE as a heuristic (Keating-Snaith 2000) but is a MODEL not a
  // proof input; shared meta-pattern with imp-1309. 8 tripwires.
  '/src/data/imp-1344-harper-2017-derandomization.js',
  // imp-1315: Lambda tightening audit -- can the Drmota-Tichy 1997 Ch. 1
  // L^2 / 2nd-moment Koksma-Hlawka inequality close the imp-1149 rateGap = 0.5
  // unconditionally (push |t_c(N) - 1/(2 M_infty(N))| from N^{-3/2} to N^{-2})?
  // Verdict: koksma-hlawka-needs-RH-input. Two legs traced: (A) square the
  // sup-norm star-discrepancy and feed through Sobolev -- gain sqrt(N) by
  // squaring, lose N^{1/4} by H^{1/2} -> L^infty (Stein 1970 Ch. V), net rate
  // N^{-7/4} (UNCONDITIONAL intermediate, halves residual gap 0.5 -> 0.25
  // but does NOT close); (B) use Drmota-Tichy L^2 KH with D_N^{*, L^2} = O(1/N)
  // directly -- this hypothesis is equivalent (Goldston-Montgomery 1987,
  // Analysis at Urbana Vol. I) to Montgomery PCC at unrestricted Fourier
  // support, which is OPEN per imp-1297 + imp-1302..1310 exhaustion and is
  // RH-tier (under RH Lambda = 0 trivially -- circular). Selberg 1944 +
  // Beck-Chen 1987 + Schmidt 1972 cited for the LDS hypothesis. Drmota-Tichy
  // 1997 LNM 1651 ISBN 978-3-540-62606-7 Theorem 1.21 + Cor. 1.22 pinned.
  // Lambda unchanged at 3.06e-5 (E_trunc_pt gates Lambda per imp-1306 audit;
  // imp-1149 link is asymptotically subdominant). Third Lambda lever audited
  // and exhausted after imp-1306 (Ingham) and imp-1314 (G6a C_H). 11 tripwires
  // (8+ required).
  '/src/data/imp-1315-koksma-hlawka-rate-closure.js',
  // imp-1318: NEW-INPUT HIGH classification — does Maynard 2024 (closest-known:
  // Guth-Maynard 2024 zero-density arXiv:2405.20552 + Maynard 2013/2015 GPY-style
  // small-gap sieve + Maynard 2019 primes-in-AP) sieve method provide a new
  // input bypassing the Montgomery PCC obstruction at support > 1 that imp-1297 +
  // imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment family) + imp-1309 (entropy
  // family) all hit? Verdict: maynard-sieve-applies-only-to-arithmetic-not-spectral.
  // The sieve method is GENUINELY ORTHOGONAL to BOTH moment AND entropy methods
  // in its primary domain (multiplicative structure on integers, admissible-tuple
  // combinatorics, Bombieri-Vinogradov level of distribution) but the orthogonality
  // does NOT transfer to the single-zeta 2-point PCC observable at sigma > 1 for
  // three independent structural reasons (parallel to imp-1309 R1/R2/R3):
  // (S1) arithmetic-to-spectral domain mismatch (sieve on integers Z with Mobius/
  // divisor/BV; zeros have no multiplicative structure on spacings; translation
  // via explicit formula Weil/Guinand hits Cauchy-Schwarz at off-diagonal prime-
  // power sum); (S2) admissible-tuple structure absent from zeros (conjectural
  // GUE is locally repulsive Wigner-surmise P(s) ~ s^2 e^{-cs^2}, OPPOSITE of
  // admissible-tuple near-coincidence pattern); (S3) sieve-weight L^1 first-
  // moment output vs PCC L^2 second-moment input mismatch (sieve gives weighted
  // counts; PCC needs Fourier-L^2 on second-moment; translation via Cauchy-
  // Schwarz re-introduces the layer). The sieve method shifts Cauchy-Schwarz
  // from input stage (on primes) to output stage (in arithmetic-to-spectral
  // translation via explicit formula OR Pinsker-Parseval) but does not eliminate
  // it; (log T)^{1/2} slack is a property of the L^1 / L^2 Hölder boundary not
  // of any specific input. Honest training-time uncertainty: well-attested
  // Guth-Maynard 2024 is a ZERO-DENSITY bound NOT a pair-correlation bound;
  // specific Maynard 2024 sieve refinement targeting 2-point uncertain at
  // January 2026 cutoff. AGGREGATE PATTERN EXTENDED: imp-1297+1302+1303+1304+1305
  // (moment family) + imp-1309 (entropy family) + imp-1318 (sieve family) all
  // negative -> pcc-genuinely-open-pending-new-input remains; the THREE major
  // orthogonal families of modern analytic-NT (moment + entropy + sieve) are
  // EXHAUSTED for PCC at 2-point with support > 1. Remaining candidates: Connes-
  // Bost (imp-1307), Berry-Keating (imp-1308), Hecke-triangle Selberg trace,
  // de Branges (imp-1241), imp-1310 alternative §15-27 pathway (also exhausted).
  // 13 tripwires.
  '/src/data/imp-1318-maynard-sieve-pcc.js',
  // imp-1325: A=0 sieve breakthrough attempt -- can the Maynard 2013/2024 sieve
  // be applied directly to the (log T)^A factor in N(sigma, T) that blocked
  // imp-1321 + imp-1322? VERDICT maynard-sieve-does-not-transfer-to-density-log-
  // factor. The GPY-Maynard SIEVE produces prime-tuple results, NOT zero-density
  // bounds; the Guth-Maynard 2024 result that DOES improve the density exponent
  // (30/13 coefficient, ~1.94x at sigma=0.75) is a large-values method, not a
  // sieve, and carries an unquantified T^{o(1)} rather than a bounded (log T)^A.
  // Sieve-route tightening = 1.0 (none). Named sub-gap routes the A factor to a
  // large-values / explicit-Ingham problem (imp-1332). 10 tripwires.
  '/src/data/imp-1325-maynard-sieve-zero-density.js',
  // imp-2323: finer-grid super-critical-strip sigma in (1/2,1) phase / winding survey.
  // 11 sigma slices {0.51..0.99} x t in [0.5, 200] (2001 pts/slice).
  // Sign-change rate monotone 90->78; near-zero approaches drop to 0 at sigma>=0.85.
  '/src/data/imp-2323-supercrit-phase-fine.js',
  // imp-1329: BFI 1986 mean-value scoping -- paper outline for a sigma-uniform
  // effective Ingham bound with A = 0. imp-1321 + imp-1322 both named
  // Bombieri-Friedlander-Iwaniec 1986 mean-value as the shared candidate to close
  // the (log T)^A binding that cancels the formal 6.4e8 sigma-reopt tightening.
  // VERDICT bfi-not-direct-residual-large-values-lemma-needed: BFI 1986 is a
  // dispersion/bilinear mean value over MODULI q (error term Delta(x;q,a)), not a
  // large-values count over the height t, so it does NOT directly give A = 0. The
  // binding (log T)^A lives in the Halasz-Montgomery large-values lemma; residual
  // Lemma R1 (explicit A = 0 sigma-uniform large-values) IS the paper, BFI can
  // only enter via residual transfer lemma R3. Coherent with imp-1325. Paper
  // outline shipped (6 sections + appendix, principal Lemma 3.1). 11 tripwires.
  '/src/data/imp-1329-BFI-1986-mean-value-scoping.js',
  // imp-2326: Explicit-constant ledger -- machine-checkable table of every
  // numerical constant in the imp-1261 Lambda <= 3.06e-5 derivation chain.
  // One row per constant {symbol, value, sourceCitation, loadBearing, whereUsed}.
  // Chain re-multiplication asserts (2 e_I / kappa) * T_PT^{-kappa} = 3.06e-5.
  // 10 tripwires; feeds imp-1327 explicit-constant audit.
  '/src/data/imp-2326-explicit-constant-ledger.js',
  // imp-1332: does Guth-Maynard 2024 (arXiv:2405.20552) substitute for Ingham
  // 1940 in the imp-1261 E_trunc_pt composition? Verdict
  // gm-substitutes-formally-but-o1-factor-blocks-rigor: GM bounds the SAME
  // N(sigma,T) object and binds at sigma_opt=0.75 (> the 7/10 crossover),
  // giving a FORMAL ~2.13x tightening (3.06e-5 -> 1.44e-5); but the T^{o(1)} /
  // (log T)^A factor is uneffective in the paper, so rigorous tightening today
  // is 1.0 and the headline 3.06e-5 stands. Single sub-gap GM-O1. 10 tripwires.
  '/src/data/imp-1332-guth-maynard-2024-substitution.js',
  // imp-1333: Selberg S(T) = (1/pi) arg zeta(1/2+iT) modern explicit constants
  // as the super-critical phase entry point. Verdict
  // s-t-catalogued-but-lambda-link-circular-on-critical-line: catalogues the
  // best explicit bounds (Trudgian 2014 unconditional 0.111 logT + ...; CCM
  // 2013 RH constant 1/4, 2x over Goldston-Gonek; Selberg CLT variance
  // 1/(2pi^2) loglogT; Bondarenko-Seip Omega-result), but S(T) on sigma=1/2 is
  // a functional of the zeros Lambda governs so it gives NO independent Lambda
  // constraint (bracket 0 <= Lambda <= 0.2 unmoved); the genuine super-critical
  // continuation is RH-gated -- sub-gap STC-1. S(T) moments are the phase-dual
  // of the imp-1183/1238/1257 n-point correlations. 10 tripwires.
  '/src/data/imp-1333-selberg-S-T-super-critical.js',
  // imp-1334: Voronin 1975 universality of zeta on the super-critical strip
  // (1/2, 1), quantitative version. Verdict
  // voronin-bagchi-equivalent-and-rigidity-obstruction-no-direct-lever:
  // catalogues the quantitative state (qualitative positive density d(eps) > 0
  // with NO effective lower bound; only doubly-exponential-in-1/eps effective
  // first-shift bounds, Good 1981 / Garunkstis 2003; strict strip (1/2,1)).
  // Universality gives NO direct Lambda lever (no height-decaying inequality
  // for the imp-1261 T_PT^{-0.4} chain) and is a rigidity OBSTRUCTION to local-
  // value RH attacks. Genuine payload: Bagchi 1981 strong-recurrence
  // RH-equivalence (zeta self-approximates iff RH), bridging into imp-1333.
  // Sub-gap VU-EFFECTIVE-DENSITY. 10 tripwires.
  '/src/data/imp-1334-voronin-universality-quantitative.js',
  // imp-1336: can the Levinson-Conrey mollified-moment method (which proves a
  // positive proportion of zeros lie ON sigma = 1/2: Levinson 1974 = 1/3,
  // Conrey 1989 = 2/5, Bui-Conrey-Young 2011 = 0.4105, Feng 2012 = 0.4128,
  // PRZZ 2020 record = 5/12) be re-pointed to CONFINE a positive proportion of
  // zeros to a strip |sigma - 1/2| < eps? Verdict
  // mollifier-method-symmetry-locked-to-line-strip-confinement-needs-zero-
  // density-no-new-lambda-bound: NO -- Levinson`s lemma counts real zeros of the
  // real Hardy function Z(t), which is real only on the functional-equation
  // fixed line, so there is no off-line analogue (sub-gap LCS-1). Strip
  // confinement is the separate zero-density technology (Bohr-Landau 1914 gives
  // 100% density confinement, stronger than any proportion; Ingham 1940 +
  // Guth-Maynard 2024 quantitative, already in imp-1322/1325/1332). Bracket
  // 0 <= Lambda <= 0.2 unmoved (a proportion leaves 7/12 unlocalized; Lambda is
  // the extreme zero). 8 tripwires.
  '/src/data/imp-1336-levinson-conrey-super-critical-extension.js',
  // imp-1338: NOVEL zeta phase tomography via twin-ladder + Hardy Z. Verdict
  // phase-tomography-circular-and-ladder-axis-transverse-to-lambda: reality of
  // the Hardy function Z(t) = exp(i theta) zeta(1/2+it) pins the observable
  // theta(t) - arg zeta to 2 theta (mod pi), so it recovers only the smooth
  // ladder theta plus the integer zero count -- a re-coordinatisation of
  // existing zero data. No Lambda lever for two independent reasons: (W1)
  // critical-line circularity (same wall as imp-1333 STC-1) and (W2)
  // ladder/heat-flow transversality (de Bruijn defines Lambda along d/dt while
  // the twin-ladder deforms along the shift axis d/da). Small-a empirical: the
  // ladder winding contribution a(b(t1)-b(t0))/pi is a vanishing fraction of
  // the smooth count, no new zeros. Bracket 0 <= Lambda <= 0.2 unmoved. Sub-gap
  // PT-LAMBDA-TRANSVERSE (mix d/da into d/dt). 8 tripwires.
  '/src/data/imp-1338-zeta-phase-tomography.js',
  // imp-1337: Backlund 1918 first-method S(t) argument-principle jump argument,
  // modernized (Trudgian 2014), tested as a Lambda lever and an E_trunc_pt
  // attack. Verdict backlund-counts-not-locates-decoupled-from-flow-and-routes-
  // back-to-zero-density: the rectangle count is a COUNTING / VERIFICATION tool
  // (engine of Platt-Trudgian finite-height RH verification), not a Lambda flow
  // estimate. (a) it counts the zeros of the static H_0 and supplies no flow
  // t-derivative, so it is DECOUPLED from the Polymath15 backward-uniqueness
  // mechanism that fixes Lambda -- bracket 0 <= Lambda <= 0.2 unmoved, sub-gap
  // BK-1. (b) a rectangle right edge at sigma > 1/2 needs the super-critical
  // phase S(sigma,T), whose unconditional control is itself an Ingham-type
  // N(sigma,T) zero-density estimate (and is RH-gated, the imp-1333 STC-1 wall),
  // so no Backlund bypass of Ingham for E_trunc_pt = 3.06e-5, sub-gap BK-2.
  // 8 tripwires.
  '/src/data/imp-1337-backlund-method-modern.js',
  // imp-1335: the IMAGE of zeta on the super-critical strip (1/2, 1) as a
  // topological / measure-theoretic object. Verdict
  // closure-is-all-of-C-zero-in-closure-obstruction-no-lever: for every fixed
  // sigma in (1/2, 1) the value set { zeta(sigma + iT) } is dense in C
  // (Bohr-Courant 1914), so its closure is the whole plane and contains 0
  // unconditionally -- the naive "0 not in closure => RH" route is dead, the same
  // rigidity obstruction as imp-1334. The Bohr-Jessen limiting distribution has a
  // smooth positive density but a strip zero is a measure-ZERO event, so density
  // at 0 does not separate RH either. Real zero-count info lives in the boundary
  // log|zeta| Littlewood-lemma argument integral (imp-1333 phase track), not the
  // value-set topology. No Lambda lever; sub-gap SCS-BOUNDARY-LOGZETA. 10 tripwires.
  '/src/data/imp-1335-super-critical-strip-topology.js',
  // imp-1342: rigor-honesty audit of the imp-1316 large-a empirical violation
  // of Conj 27.2 (||V_{a,Phi}|| <= 1) vs the imp-1287 Wiener-Hopf bound that
  // claimed coverage for a >= 0.1996. Verdict
  // wh-bound-invalid-Ka-unbounded-conj272-false-for-large-a: the WH step
  // ||K_a|| <= 1/a is FALSE (the causal sinh(a tau) convolution kernel is
  // unbounded on L^2; its Laplace transform converges only for Re(z) > a, so
  // the imaginary-axis symbol -a/(t^2+a^2) is an analytic continuation, NOT a
  // genuine bounded Fourier symbol, and the Krein/Gohberg-Krein Toeplitz
  // estimate does not apply). imp-1316 Galerkin values are rigorous lower
  // bounds (||A_N|| <= ||V||), so the violation is robust (case i, not ii/iii).
  // Conj 27.2 is therefore FALSE for large a; the only rigorous statement is the
  // HS coverage a in (0, 37.66]. RH/Lambda application is unaffected (App-S uses
  // a <= 0.5, Lambda <= 0.2). Sub-gap WH-KA-UNBOUNDED. 10 tripwires.
  '/src/data/imp-1342-large-a-WH-bound-investigation.js',
  // imp-2337: Interval-arithmetic certification of Ingham E_trunc_pt = 3.06e-5
  // on a 21-point fine sigma grid. Certifies E_trunc_pt(0.75) as a tight IEEE 754
  // interval, verifies monotone decreasing structure, and confirms sigma = 0.75 is
  // the argmin within the rigorous range [0.50, 0.75]. 10 tripwires.
  '/src/data/imp-2337-ingham-sigma-certification.js',
  // imp-1330: Path C via Bui-Soundararajan 2008 -- PARTIAL closure of the two
  // engine-closable obstructions per imp-1321 (O-BS-A + O-BS-D). Verdict
  // O-BS-D-fully-closed-O-BS-A-ledger-shipped-paper-grade: O-BS-D (downstream
  // chain audit) FULLY CLOSED -- 5 of 6 imp-1321 consumers use only the scalar
  // E_trunc_pt = 3.06e-5; the algebraic e_I form + monotone-argmin assumption
  // are confined to the single producer finite-height-beats-platt-trudgian.js,
  // and the monotonicity transfers to BS (d/dsigma e_BS = -100/(11+1.5sigma)^2
  // < 0), so a BS substitution is downstream-safe. O-BS-A (effective C_BS)
  // ships a 4-kernel constant LEDGER (HB 4th moment + BMMV + Selberg mollifier
  // + amplifier; central C_BS ~ 13.5, realistic [1,50]) but the exact constant
  // stays a 4-8 week paper-walk. O-BS-B + O-BS-C OUT OF SCOPE; rigorous Lambda
  // UNCHANGED at 3.06e-5 (both worked obstructions are no-gain). 8 tripwires.
  '/src/data/imp-1330-BS-port-partial-closure.js',
  // imp-1331: does the imp-1321 candidate 'Soundararajan-Tao 2024' close
  // O-BS-B (the binding (log T)^A obstruction)? Verdict
  // o-bs-b-not-closed-candidate-wrong-object-A-lives-in-large-values: (a) no
  // verifiable joint Soundararajan-Tao 2024 zero-density result exists; the
  // strongest verifiable referent is Soundararajan 2009 (Annals 170), a moment
  // bound ON the line. (b) object mismatch (coherent with imp-1329
  // SUBGAP-1329-A) -- A_BS lives in the Halasz-Montgomery large-values lemma +
  // Selberg mollifier, not in a moment object; a moment input sharpens only
  // the O-BS-A constant C_4. (c) A_BS stays at the imp-1179 / imp-1182 central
  // 6 > crossover A* ~ 4.33, so the formal 2.04e6 tightening is NOT rigorous
  // (net ~275x loosening at A_BS = 6). O-BS-B remains paper-grade. 8 tripwires.
  '/src/data/imp-1331-soundararajan-tao-2024-application.js',
  // imp-2354: unrestricted-support 3-point ESY attempt -- HONEST PARTIAL.
  // Both ticket sub-directions blocked (unrestricted rho_3 = GAP-RS3PT-FULL-
  // SUPPORT / Bogomolny-Keating; log-free 4-point = intrinsic explicit-formula
  // log, O-HOC-B). NEW: quantifies imp-1180 O-HOC-E -- the bandwidth-truncated
  // Poisson kernel penalty is N-INDEPENDENT (y_unfolded = 1; L2 ~ 2.30e-4,
  // variance ~ 2.16e-3), so the regularization cannot give an asymptotic ESY
  // closure. Named gap GAP-2354-SUPNORM-RESIDUAL-TRANSFER. 7 tripwires.
  '/src/data/imp-2354-unrestricted-3point-esy-attempt.js',
  // imp-2422: Quantify the achievable ESY bound under the RS bandwidth-2/n
  // restriction and deliver the gap to closure as a number (fan-out of imp-2354).
  // The RS96 3-point regime certifies the in-band projection L_N(phi^{(W)}),
  // W = 2/3, capturing 1 - 2.16e-3 of the variance form factor; the gap to
  // closing the full Poisson-kernel observable is the N-INDEPENDENT high-pass
  // residual (variance form ~ 2.16e-3, plain L2 ~ 2.30e-4 = exp(-4 pi * 2/3)).
  // Absolute gap ~6.2e-7 (1e6), ~8.4e-8 (1e7); relative gap fixed at 0.216%.
  // This is exactly what an unrestricted rho_3 (Bogomolny-Keating) must buy.
  // Named gap GAP-2422-HIGHPASS-FORMFACTOR-RESIDUAL = GAP-2354-SUPNORM-RESIDUAL-
  // TRANSFER, now quantified. 7 tripwires.
  '/src/data/imp-2422-bandwidth-restricted-esy-gap.js',
  // imp-2441: minimal input to close the N-independent 2.153e-3 ESY variance
  // gap (Wave-3 follow-on to imp-2422). Scores three candidates against the
  // exact form-factor integral: (A) wider band shrinks ~ exp(-4 pi W) but every
  // finite W leaves a residual > 0 (full support = Bogomolny-Keating; extending
  // RS96 support is open); (B) a 4-point input is an orthogonal cumulant on the
  // narrower 1/2 band and makes the gap WORSE; (C) the W = 1 win is Montgomery
  // pair-correlation, RH-conditional. Verdict: residual is STRUCTURAL (PCC),
  // no realistic unconditional input closes it. 7 tripwires.
  '/src/data/imp-2441-minimal-input-to-close-esy-gap.js',
  // imp-2460: wider-band ESY variance gap -- fit the exp(-4 pi W) closure law
  // and pin the Bogomolny-Keating-limit distance as a concrete number (Wave-4
  // follow-on to imp-2441). Closed-form gap g(W) = C exp(-4 pi W), C ~ 12.566,
  // tabulated over W in {1,2,4,8,16}; a log-linear fit recovers the rate 4 pi to
  // machine precision. BK-limit band-distance is INFINITE (residual 0 needs
  // W -> infinity), but each RS96-band of extra unconditional 3-point support
  // cuts the gap by exp(-8 pi / 3) ~ 2.30e-4 (~4351x); reaching 1e-6 takes ~1.95x
  // RS96 support (factor grows only logarithmically). Named gap
  // GAP-2460-BK-LIMIT-IS-INFINITE-SUPPORT-WIDENING = GAP-2441. 7 tripwires.
  '/src/data/imp-2460-esy-gap-bandwidth-fit-bk-distance.js',
  // imp-1343: NEW-INPUT classification (modern update of imp-1307) -- does the
  // Connes-Consani Riemann-Roch / scaling-site program (2016 Arithmetic Site,
  // 2017 Scaling Site Riemann-Roch, 2019 "complex lift of the scaling site")
  // close the (L1)-(L3) gap of imp-1307, bypass Tao 2008, or give a 2-point
  // bound at support > 1? Verdict connes-consani-2019-advances-L1-geometry-but-
  // positivity-on-the-square-remains-rh-equivalent: (a) (L1) ADVANCED -- the
  // scaling site is a constructed geometry with an UNCONDITIONAL Riemann-Roch,
  // replacing the un-constructed 1999 type-II_1 von Neumann algebra -- but not
  // fully closed (the square S x S is not constructed as an algebraic surface,
  // RR1). (b) Tao 2008 critique NOT bypassed but relocated/sharpened: the
  // endgame RR2 (intersection positivity on the square, a char-0 Castelnuovo-
  // Severi / Hodge index modeled on Weil 1948) is precise but RH-EQUIVALENT.
  // (c) NO 2-point bound: unconditional content = explicit formula (same
  // (log T)^{1/2} Cauchy-Schwarz obstruction as the moment routes and imp-1307);
  // conditional content (RR2) gives RH outright. Geometric/NCG family (imp-1307
  // Connes-Bost, imp-1308 Berry-Keating, imp-1339 Hecke-triangle, this) supplies
  // no support > 1 2-point bound. Sub-gap GAP-1343-RR2-INTERSECTION-POSITIVITY.
  // 9 tripwires.
  '/src/data/imp-1343-connes-consani-2019.js',
  // imp-2358: FAN-OUT from imp-1308 (Berry-Keating H = xp). Assesses the
  // Bender-Brody-Mueller 2017 PT-symmetric Hamiltonian (PRL 118, 130201) and
  // the Sierra 2019 review family, which imp-1308 flagged as not-yet-assessed.
  // Verdict bbm-2017-pt-symmetric-not-rigorous-unbroken-pt-equals-rh: (P1) the
  // positive metric operator (unbroken-PT certificate) is NOT constructed, so
  // reality of the spectrum is only formal; (P2) for this operator unbroken-PT
  // is EQUIVALENT to RH, so the step is renamed not removed (circular); (P3)
  // discreteness is imposed by a boundary condition that is the zeta secular
  // condition in disguise. Sierra 2019 falls under the same obstruction. Named
  // sub-gap GAP-2358-BBM-METRIC-OPERATOR. RH explicitly NOT asserted. 8 tripwires.
  '/src/data/imp-2358-bbm-pt-symmetric-self-adjointness.js',
  // imp-2359: FAN-OUT from imp-1307 (Connes-Bost adelic). Reviews the EARLIER
  // Connes-Consani 2010-2014 F1 geometry (Compositio 146, 1383-1415) and
  // Arithmetic-Site cohomology (CR 2014; Adv. Math. 291, 274-329), plus Meyer
  // 2005 partial absorption (Crelle 587, 89-116). Verdict: none yields a
  // rigorous unconditional trace realizing the zeros -- each reproduces the
  // Weil explicit formula but the forcing positivity / self-adjointness is the
  // missing ingredient and is RH-equivalent. Named sub-gap
  // GAP-2359-CHAR1-SURFACE-POSITIVITY. No 2-point bound at support > 1. RH NOT
  // asserted. 8 tripwires.
  '/src/data/imp-2359-connes-consani-f1-arithmetic-site-trace.js',
  // imp-2361: FAN-OUT from imp-1315 (Koksma-Hlawka rate closure). Tests whether
  // discrete discrepancy measures (the Erdos-Turan inequality, golden-ratio
  // Kronecker / Fibonacci low-discrepancy sampling) bypass the Montgomery-PCC
  // circularity of imp-1315 Leg B. Verdict discrete-variants-inherit-the-
  // obstruction: FLOOR 1 -- Erdos-Turan to O(1/N) needs |W_N(h)| = O(1) for all
  // h <= N, which for the xi zeros is PCC at unrestricted support (inherits
  // imp-1315 Leg B); FLOOR 2 -- Schmidt 1972 makes D_N^* = O(1/N) unattainable
  // by ANY 1D sequence. Builds the extremal {n*phi} sequence, computes exact
  // star-discrepancy + Erdos-Turan bound, and confirms N*D_N^* GROWS (log N / N
  // rate, not 1/N). Lambda unchanged at 3.06e-5; RH NOT asserted. 8 tripwires.
  '/src/data/imp-2361-erdos-turan-discrete-discrepancy-pcc-bypass.js',
  // imp-2390: FAN-OUT from imp-2360 / imp-1311. Tests a SECOND independent RH-
  // equivalent elementary inequality -- the Nicolas 1983 primorial / Euler-phi
  // criterion N_k/phi(N_k) > e^gamma log log N_k -- and asks whether its margin
  // carries Lambda content. Verdict nicolas-margin-is-arithmetic-scale-no-
  // lambda-bridge: the margin holds with NO exceptions (contrast Robins eight
  // CA exceptions), decays monotonically, and its scale probes show
  // m_k*log N_k GROWS (no 1/log N law) while m_k*(log log N_k)^2 is banded
  // (Mertens-variable arithmetic scale, no flow-time axis). Confirms imp-2360
  // via a second RH-equivalence. Named sub-gap GAP-2390-NO-FLOW-TIME-IN-PHI-
  // MARGIN. RH NOT asserted. 9 tripwires.
  '/src/data/imp-2390-nicolas-primorial-margin-no-lambda-bridge.js',
  // imp-2404: register imp-2401 dense Volterra-crossover sweep so its 7
  // already-shipped tripwires actually run -- frozen row-count (17), op_norm
  // monotonicity in a, headline crossing bracket a in [37.5, 40], Galerkin-vs-HS
  // threshold agreement (37.659 vs 37.66, < 0.05), and bit-for-bit imp-1316
  // cross-check at a=10 and a=50. Previously dormant (module not in DATA_MODULES).
  '/src/data/imp-2401-volterra-crossover-sweep.js',
  // imp-2435: Beurling / RH-violation stress test of the §27 Volterra
  // contraction. Generic Beurling systems lack a self-dual kernel so V_{a,Phi}
  // is inapplicable; the computable surrogate is the de Bruijn-Newman
  // deformation Phi_t = exp(t u^2) Phi (off-line zeros provably for t<0). All
  // 14 norms stay << 1 and rise with t -- the norm tracks kernel L^2 scale,
  // not zero location, so it is NOT a stand-alone zero detector. 6 tripwires.
  '/src/data/imp-2435-beurling-volterra-stress-test.js',
  // imp-2442: off-line finite-kappa structure of the de Branges / Pontryagin
  // canonical-system realization (Wave-3 follow-on to imp-2430). A hypothetical
  // off-line zero must be modelled by a GENUINE generalized-Nevanlinna function
  // N_kappa (Pick kernel with exactly kappa negative squares), NOT by a pole in
  // C+ (the imp-2430 naive surrogate, which does not saturate). Verifies the
  // canonical family N_k(z)=z^(2k+1) in N_k has Pick negative index exactly k,
  // saturating across four node sets (Pontryagin Pi_kappa fingerprint), and
  // reproduces the non-saturating pole-in-C+ contrast. Bookkeeping: on-line N_0
  // (Hilbert, ind_-(K_a)=0) vs off-line N_kappa (Pontryagin Pi_kappa,
  // ind_-(K_a)=kappa). Verdict: off-line zeros admissible only in Pi_kappa,
  // incompatible with the kappa=0 twin-ladder realization; sub-gap
  // GAP-2442-GENUINE-M-IS-N0 (genuine m in N_0 = RH). 6 tripwires.
  '/src/data/imp-2442-offline-finite-kappa-pontryagin-2026-06.js',
  '/src/data/imp-2562-g6a-tangency-dejure.js',
  // imp-2563 (S4): discriminant characterization of t_c -- d/ds log Disc =
  // -8 sum (x_i-x_j)^-2, heat-semigroup non-dynamical ladder t_c = smallest
  // root of strictly decreasing Disc. Cross-checked heat-vs-RK4 to 7+ digits.
  '/src/data/imp-2563-discriminant-tc-characterization.js',
  // imp-2604: closes imp-2563 deliverable B / R_B -- the per-N min-gap SANDWICH
  // theorem. Gap ODE dr/ds = -4/r + 2 r B linearises (u = r^2) to du/ds =
  // -8 + 4 B u; |B| <= beta brackets t_c as T_-(g,beta) <= t_c <= T_+(g,beta),
  // both unconditional, collapsing to (g^2/8)(1 +/- beta g^2/4). T_+ refines the
  // imp-2561/2562 one-sided pinch and adds the matched lower bound. 4 tripwires.
  '/src/data/imp-2563-min-gap-sandwich-theorem.js',
  // imp-2683: attacks beta, the gating field bound of the sandwich Theorem B.
  // B_p is a sum of POSITIVE terms; with G = global min gap the k-th flank
  // particle is at distance >= kG, giving the telescope bound B_p G^2 <=
  // 2(1 - 1/(K+1)) < 2 (sum 1/(k(k+1)) = 1) -- so beta_0 g^2 < 2 RIGOROUSLY and
  // N-uniformly at s=0 (bracket unconditional there). RvM ladder {1e3,1e4,1e5}:
  // beta g^2 ~ (pi^2/3)(g/l)^2 -> 0, margin grows. sup_s upgrade conditional on
  // the named punctured-min-gap residual (h(s) >= c g). 5 tripwires.
  '/src/data/imp-2683-sandwich-beta-field-bound.js',
  // imp-2849: SUFFICIENCY side of beta. Writes the sandwich bracket as a
  // function of beta at the verified gap g_min(1e4)=0.0376985 and marks which
  // beta make the conditional upper bound T_+ BEAT the unconditional A1 trap
  // t_c <= g^2/6. With x=beta g^2, T_+ < A1 iff F(x)=log(2/(2-x))-2x/3 < 0, whose
  // nontrivial root is x*=0.90879 -- so the sandwich beats A1 iff beta g^2 < x*
  // (beta < 639.46 at g_min(1e4)), STRICTLY inside the existence gate beta g^2<2
  // (beta<1407). A beta in (639,1407) keeps the bracket well-defined but looser
  // than the free A1; its only asset there is the lower bound T_-. RvM density
  // beta over heights [100,1e4] gives beta g^2 ~ 6e-3 << x* (beats A1 on the
  // MODEL), but stays CONDITIONAL on the punctured-min-gap residual. 4 tripwires.
  '/src/data/imp-mingap-beta-bound.js',
  // imp-3023: ASSESS-only classification of beta (route-map opp:5). Restates the
  // discharging estimate (PUNCTURED-GAP) h(s)>=c*g and shows it FACTORS: part (I)
  // the time-evolution half is DETERMINISTIC (dh/ds = +2/g_pair - 4/h + O(1), so
  // h is non-decreasing once c_0=h_0/g>2; witness h_min/h_0=1, RH-free) and
  // dischargeable; part (II) the residual reduces to ONE RH-hard scalar, the
  // uniform initial ratio c_0 = h_min(0)/g_min(0), which funnels into the shared
  // Montgomery-PCC / C_H wall. beta spawns no new wall. NOT closed. 4 tripwires.
  '/src/data/imp-3023-beta-dischargeability.js',
  // imp-2690: verifies coefficient 8 (sharp; B=0 pure 2-particle => du/ds=-8
  // exact, t_c=g^2/8) and reconciles imp-366 "-8+O(g_min)" with imp-2563 exact
  // "-8+4 B u". The adjacent-gap background drift telescopes to 2 r B, so the
  // d(g^2)/ds remainder is 4 B g^2 = O(g^2) and imp-366 O(g_min) is its loose
  // envelope; integrated this upgrades O(g_min^3) -> exact O(g_min^4). Sign
  // lemma: every other particle is outside [a,b] => B>0 strictly, so 4 B u>=0,
  // t_c(N) >= g^2/8 (background only DELAYS collision). This is the imp-2642
  // positive-remainder mechanism (|tau_c|/g0^2 above 1/8): 1/8 is NOT a Holder
  // sup, C_H NOT discharged. Validity window g <= 2 sqrt(eps/beta). 6 tripwires.
  '/src/data/imp-2690-tangency-remainder-sign.js',
  // imp-2697: cross-verify the imp-1149 / Thm 3 N^{-3/2} rate constant C_HO
  // and the M_inf(N) >= K_1 (L - log4pi) sqrt(N) lower bound that the
  // asymptotic Lambda <= 3.06e-5 headline triangle-composes; monotone-to-0 on
  // the imp-321 ladder. Unconditional skeleton only; G6a stays open modulo.
  '/src/data/imp-2697-theorem3-rate-crossverify.js',
  // imp-2451: scale-normalized dBN deformation, closing sub-gap B of imp-2435
  // (scale/zero confound). V is quadratic in Phi, so renormalizing
  // |Phi_t|_2 = 1 before assembly divides the exp(t u^2) L^2 scale out exactly.
  // The ~5x scale swing collapses to a ~0.9% residual spread, the t<0 vs t>=0
  // means differ by only ~0.47% (< 1%), and the residue is still monotone
  // increasing in t -- confirmed null, the norm sees no off-line zeros even
  // scale-out. 7 tripwires.
  '/src/data/imp-2451-scale-normalized-dbn-deformation.js',
  // imp-2454: off-line zero injected into the imp-2438 explicit N_0 de Branges /
  // Jacobi chain (Wave-4 follow-on to imp-2442 sub-gap GAP-2442-GENUINE-M-IS-N0).
  // The imp-2438 baseline point-measure m-function is ordinary Nevanlinna N_0
  // (Pick negative index 0, Hilbert, ind_-(K_a)=0). A genuine off-line zero is
  // injected as a NEGATIVE point mass + y^2/(z-x) (Herglotz measure term of the
  // wrong sign; off-line zero pair x +/- i*y of the Hermite-Biehler factor
  // (z-x)^2+y^2). Verifies the Pick negative index JUMPS to exactly kappa and
  // saturates across four node sets (Pontryagin Pi_kappa) for kappa=1,2,3, while
  // the imp-2430 naive pole-in-C+ perturbation of the same baseline does NOT
  // saturate. Verdict: an off-line zero forces ind_-(K_a)>=1, incompatible with
  // the kappa=0 Hilbert realization; sub-gap GAP-2454-GENUINE-M-IS-N0 (genuine m
  // in N_0 = RH). 6 tripwires.
  '/src/data/imp-2454-offline-zero-pick-index-jump-2026-06.js',
  // imp-2452: ABSOLUTE Birman-Krein SSF of the genuine twin-ladder operator
  // (Wave-4 follow-on to imp-2425). imp-2425 read ind_-(K_a) from the RELATIVE
  // SSF xi_a = (1/pi) arg [X_1/X_0], where the degree-N background cancels against
  // the RH-true reference X_0 -- a cross-check, not an operator-intrinsic input.
  // Here the negative index is read DIRECTLY off the imp-2438 genuine self-adjoint
  // de Branges / Jacobi operator J: (1) absolute SSF xi_abs = N_J - N_free against
  // an operator-intrinsic free Jacobi background with NONZERO DOS (no relative
  // cancellation); (2) reference-free index = argument-principle winding of
  // det(J - z) over the open upper half-plane. Genuine operator: all eigenvalues
  // real -> winding 0 -> ind_-(K_a) = 0 with NO reference subtraction; off-line
  // controls (1,2,3 conjugate pairs off-axis) wind 1,2,3. Sub-gap
  // GAP-2452-FINITE-POINT-MEASURE (inherited imp-2430 G2). 6 tripwires.
  '/src/data/imp-2452-absolute-birman-krein-ssf-2026-06.js',
  // imp-2466: Lambda-chain step 2 -- triple-integrator (RK4/DP45/DP8) interval
  // ladder on measured |t_c(N)| at tractable N<=800; literal {1e4,1e5,1e6}
  // ladder deferred to imp-1090 (GAP-2466-LARGE-N-OFFLINE). 6 tripwires.
  '/src/data/imp-2466-dyson-tc-interval-ladder.js',
  // imp-2453: genuine many-body Calogero-Moser Hessian at the Hermite argmin
  // (Wave-4 follow-on to imp-2439 sub-gap imp-2439-true-CM-Hessian). Replaces the
  // fitted scalar kappa ~ 0.895 with the exact second-derivative matrix H_ii = 1 +
  // sum 1/(x_i-x_j)^2, H_ij = -1/(x_i-x_j)^2; diagonalized spectrum = {1..N}
  // (Calogero) to ~1e-12 up to N=128. tr(H^-1)=H_N gives c_det=H_N/log N -> 1
  // (derived, not assumed); genuine coupling rho_CM = max/mean site compliance >= 1
  // identically and grows ~0.545 N^0.40. Edge escape (rho <= N^-1/3) excluded with
  // widening margin; corrected alpha_c_p50 = 1.06 at rho_CM(64)=2.86. Sub-gap
  // imp-2453-compliance-to-rigidity-map (imp-486 GUE obstruction). 8 tripwires.
  '/src/data/imp-2453-true-cm-hessian.js',
  // imp-2461: Maass Rankin-Selberg V-margin -- settles imp-2421 sub-gap (i). The
  // Maass x Maass RS four-gamma factor inverts to the SCALAR product of two
  // imaginary-order K-Bessels K_{iR1} K_{iR2} (Gradshteyn-Ryzhik 6.576.4). The
  // arithmetic anchor (self-RS f x f, R=9.5337) has margin 1.4738x with op_norm
  // ~34 orders below 1; the pure K_{iR}^2 archimedean envelope crosses margin 2
  // at spectral parameter R* ~ 15.35, above the first Maass eigenvalue. 9 tripwires.
  '/src/data/imp-2461-maass-rankin-selberg-margin.js',
  // imp-2486: Step 4 E(N) assembly verification — tabulates the assembled
  // E(N) = E_trunc + E_flow + E_shock (rigorous kappa_T from imp-317, imp-838
  // pinned C_F, post-imp-366 Holder-1/2 E_shock) at all seven imp-321 ladder
  // rows; bridge margin E(N) - |t_c(N)| positive everywhere incl. the measured
  // N = 2458 anchor; binding scale ~10^24.5 under unit constants. 11 tripwires.
  '/src/data/imp-2486-en-ladder-assembly-verification.js',
  // imp-2598: E(N) decomposition bottleneck attack — re-scopes imp-2486 to rank
  // the three named components by decay exponent (kappa_T ~ 0.182 < 1/2 < 1),
  // identifying E_trunc as the unambiguous bottleneck at every imp-321 ladder row
  // and asymptotically, and naming the imp-317 thin-strip density exponent as the
  // sole rate lever. Scoping/attack module, no closure claimed. 7 tripwires.
  '/src/data/imp-2598-en-bottleneck-attack.js',
  '/src/data/imp-2622-height-mismatch-refutation.js',
  // imp-2629: matched-height cross-validation of the recomposed bridge against the
  // repo's independent Lambda estimators. HONEST RESULT: no estimator reaches the
  // 1e13 headline height, and the height-consistent recomposed value (E_trunc ~7.65)
  // diverges ~63x from the finite-height estimator cluster (<= 0.121) -- the
  // cross-check CONFIRMS the imp-2630 withdrawal, not the headline. 5 tripwires.
  '/src/data/imp-2629-recomposed-bridge-cross-validation.js',
  // imp-2631: HONEST NEGATIVE — no truncation-error route improves on the
  // referee-passed finite-N*=1e4 beat. E_trunc_pt ~ 3.1e-5 is ~261x below the
  // binding L_cond ~ 8e-3 there, so truncation is not the bottleneck; the three
  // candidate routes (fixed verified height, fixed strip sigma>=0.62, GM 2024)
  // all fail to beat it. The only lever (higher instantiation height) is killed
  // by the imp-2622 thin-strip ceiling. 5 tripwires.
  '/src/data/imp-2631-honest-truncation-route-assessment.js',
  // imp-2625: pins the two E_trunc order-unity constants — kappa_T to the exact
  // rigorous Ingham/GM closed form 4 delta/(3-2 delta)=0.18166 (unconditional
  // floor 0.180 securing bound <= 0.137) and C_T reduced to the sharp checkable
  // threshold C_T <= 1.46 with its effective-Ingham blocking lemma named. THE
  // headline lever de-conditionalising the imp-2622 < 0.2 bound. 6 tripwires.
  '/src/data/imp-2625-etrunc-constant-pinning.js',
  // imp-2485: Step 2 cross-verification at N = 1e4 — true order-8 DOP853 +
  // RK4 dual-integrator agreement on |t_c| from the Odlyzko zeros (offline
  // sidecar; nothing heavy at build time), interval-RK4 brackets at two step
  // sizes, exact pair-collapse anchor t_pair = H_min^2/8 inside the fine
  // bracket. Closes GAP-2466-dp8-upgrade; N = 1e4 slice of fresh-rows gap.
  '/src/data/imp-2485-dp8-rk4-N1e4.js',
  // imp-2881: the N = 1e5 slice of GAP-2485-N1e5-N1e6 — same dual-integrator
  // (order-8 DOP853 + RK4) harness as imp-2485, freshly measured offline from
  // the first 100 000 Odlyzko ordinates with a bounded interval-RK4 bracket
  // (ladder-only; dt/5 fine pass documented-skipped since t_pair << dt). N = 1e6
  // stays open (GAP-2485-N1e6).
  '/src/data/imp-2485-dp8-rk4-N1e5.js',
  // imp-3001: independent-instrument cross-validation -- the exact imp-2563
  // heat-discriminant t_c (closed-form heat-evolved polynomial root) vs the
  // imp-2881 dynamical DP8/RK4 ladder t_c at N = 1e5. Bracket-containment check
  // (exact t_c ~ 2.70e-5 sits inside the dual-integrator (0, dt] and interval
  // brackets); the heat instrument reproduces the sidecar pair-collapse time.
  '/src/data/imp-3001-heat-discriminant-vs-dyson-N1e5.js',
  // imp-2523: batch-wired previously unregistered data modules (97 files).
  '/src/data/asymptotic-attack-status-2026-05.js',
  '/src/data/b1-slope-conditional-upper-bound.js',
  '/src/data/b2-intercept-analytic-bound.js',
  '/src/data/backward-flow-stability-gronwall.js',
  '/src/data/imp-2564-lambda-chain-direction-audit.js',
  '/src/data/tc-part-vs-mf-linchpin-finding.js',
  '/src/data/maxfanout-honest-status-2026-06-17.js',
  '/src/data/strategic-reframe-pcc-free-volterra-2026-06-17.js',
  '/src/data/section27-identity-refutation-2026-06-17.js',
  // imp-2856: self-contained Schur-complement verification of the SURVIVING §27
  // half -- block [[I,V],[V*,I]] >= 0 <=> ||V|| <= 1 (Bhatia 1997 Prop 1.3.2,
  // D = I > 0, Schur complement I - V V*) -- with a dependency-free Jacobi
  // eigensolver witnessing both directions plus the exact identity
  // lambda_min = 1 - ||V||, demarcated from the refuted LINK B.
  '/src/data/imp-linkA-schur-verification.js',
  '/src/data/section26-verdict-volterra-not-a-reduction-2026-06-18.js',
  '/src/data/ch-wall-frontier-verdict-2026-06-26.js',
  '/src/data/section26-mupass-operator-verdict-2026-06-30.js',
  // imp-3267: cross-module tripwire locking the five section26-mupass verdict headline
  // numbers (deficit 9.28e-9, ||V||_HS ~1.90e-4, B/D=1.074, hollow+indefinite shear-Gram,
  // ||R||=1.0000) against silent drift -- must be listed here so L1..L6 top-level throws
  // fire in run-assertions.mjs (the module is wired into assertion-sweep-2026-04-12.js via
  // rh-attack.js, but that path is not in MATH_MODULES, so a direct entry is required).
  '/src/data/imp-3267-section26-mupass-verdict-lock.js',
  '/src/data/econn-metric-rearchitecture-verdict-2026-06-30.js',
  // imp-2686: endpoint-bridge-enriched mu^pass construction (the surviving RH-equivalent Volterra target).
  '/src/data/imp-2686-mupass-construction.js',
  // imp-2841: degree-0 deficit profile quantifying the section26-verdict "~64% of tau" overflow.
  '/src/data/imp-mu-pass-overflow-quantification.js',
  // imp-3007: degree-0 cover of that overflow by the cosh-completion mu^pass (residual deficit
  // exactly 0); isolates the off-diagonal endpoint-Hankel operator step as the lone remaining gap.
  '/src/data/imp-3007-mupass-overflow-cover.js',
  // imp-3064: tabulates D_raw(a,U) and the cosh-over-minimal excess E(a,U) across an a-grid x
  // U-range, with the excess fraction E/D_raw shown to depend on the product a*U alone.
  '/src/data/imp-3064-deficit-excess-fraction-grid.js',
  '/src/data/full-route-map-2026-06-19.js',
  // imp-2833: lock Route B closure invariant — closesIf says it is already
  // closed unconditionally; tripwires guard against a false promotion that
  // would read Route B closing as closing the Lambda chain (E(N) feed stays
  // gated on C_H, which must remain OPEN). 5 tripwires.
  '/src/data/proof-chain-snapshot-2026-06-23.js',
  // imp-2750: DAG/route-map status-consistency cross-tripwire — fails if the
  // finite-N*=1e4 beat DAG node re-acquires a rigorous-unconditional framing
  // with an empty conditional closure, contradicting the route-map ESTIMATE/C_H verdict.
  '/src/data/imp-2750-dag-routemap-status-consistency.js',
  // imp-2857: cond-polymath15-G6a EQUALS cond-CH — proves the two conditional
  // leaves are the SAME imp-366 Holder-1/2 shock modulus C_H (asymptotic bridge
  // and finite-N* E_coll funnel through one object, not two independent paths).
  '/src/data/imp-g6a-equals-CH.js',
  // imp-2784: v52 dashboard finite-beat wording tripwire — fails if RHProofState
  // or Rigor dashboard pages call the finite-N*=1e4 beat rigorous/unconditional
  // without a downgrade qualifier, contradicting the route-map ESTIMATE/C_H label.
  '/src/data/imp-2784-dashboard-finite-beat-wording-consistency.js',
  '/src/data/supercritical-winding-experiment-2026-06-19.js',
  // imp-2664: independent operator-algebra re-derivation of the Section-27 identity
  // (Schur LINK A proved; Phi-uniform LINK B refuted robustly; scale-normalized form
  // reduced -- both directions -- to one open characteristic-function identification).
  '/src/data/imp-2664-section27-identity-rederivation.js',
  // imp-2695: verify the de Branges Hermite-Biehler DOWNSTREAM chain that survives
  // the Section-27 LINK B refutation -- K_a >= 0 => E_a HB (Thm 23) => H(E_a) de
  // Branges space (Thm 19-22) => canonical system (Thm 37-40), as a clean conditional
  // theorem with K_a >= 0 as the explicit UNPROVEN (RH-equivalent) antecedent. Tripwire
  // enforces the module nowhere claims K_a >= 0 itself.
  '/src/data/imp-2695-debranges-hb-downstream-verify.js',
  // imp-2668: attack on THE_REAL_GAP -- makes the Section-25 commutator decomposition
  // explicit (V-V^# = p(x)q^* - q(x)p^*, p=Phi*sinh, q=Phi*cosh, rank 2), shows the
  // crux as posed (identify Schur complement I-V^#V with K_a Gram) is IMPOSSIBLE by a
  // degree-counting no-go, and reframes it to the degree-consistent K_a <-> Im V
  // identification (which stays open). Honest partial; collapse stays conditional.
  '/src/data/imp-2668-section27-renormalization-nogo.js',
  // imp-2665: GAP-2 of the PCC-free Volterra route -- a truncation-uniform CS-HS
  // bound. Lemma A (d/da sinh^2(au) = u sinh(2au) >= 0) makes B(a)=sqrt(I_0 J_a)
  // monotone with B->0 as a->0 (controls the a->0 limit); Lemma B gives an
  // explicit doubly-exp tail T_I,T_J <= prefactor.exp(-2 pi e^{4U}), <exp(-5e7)
  // at U=4, making the imp-1267/2654 window numerics rigorously truncation-exact.
  // Honest partial: window integrals still need interval certification.
  '/src/data/imp-2665-volterra-truncation-uniform.js',
  '/src/data/imp-2636-units-audit.js',
  '/src/data/imp-2603-imp1149-meanfield-proxy-regrade.js',
  '/src/data/imp-2607-epp-sizing.js',
  '/src/data/sg1-theta-contraction.js',
  '/src/data/sg1c-theta-trap-theorems.js',
  '/src/data/imp-2563-zeta-zeros-corruption-audit.js',
  '/src/data/imp-2563-pathc-exact-tc-ladder.js',
  // imp-2848: redirect the heat-discriminant t_c ladder at the E_coll collision
  // constant -- two-sided rigorous bracket via the exact discriminant sign flip,
  // propagated into the E_coll Wasserstein input W_1(mu_N, rho_inf).
  '/src/data/imp-discriminant-at-Ecoll.js',
  // imp-2627: automated per-N Theta(0) <= 1/4 certification on every ladder rung.
  '/src/data/imp-2627-theta-certification.js',
  // imp-2858: explicit N-uniform bound (<= 28) on the Theta-trap CONTRACTION
  // constant C_Theta (Theorem A), distinct from the divergent W_1 modulus (imp-2680).
  '/src/data/imp-ctheta-uniform-bound.js',
  '/src/data/barrier-extrapolation-imp371.js',
  '/src/data/barrier-extrapolation-v2.js',
  '/src/data/bridge-lambda-rh.js',
  '/src/data/c-mb-empirical-dyson-sweep.js',
  '/src/data/csv-lambda-lower-bound.js',
  '/src/data/dead-code-audit-2026-04.js',
  '/src/data/dead-code-audit-2026-05.js',
  '/src/data/dyson-burgers-shock.js',
  '/src/data/dyson-collision-lower-bound.js',
  '/src/data/dyson-ladder-extended-N1M.js',
  '/src/data/dyson-ladder-measured.js',
  '/src/data/dyson-ladder-N10k.js',
  '/src/data/dyson-monotonicity-proof.js',
  '/src/data/dyson-slope-analytic-bound.js',
  '/src/data/esy-rigidity-port.js',
  '/src/data/finite-height-beats-platt-trudgian.js',
  '/src/data/finite-height-lambda-bound.js',
  '/src/data/g3a-extremal-closure.js',
  '/src/data/g6a-sub-constant-value.js',
  '/src/data/gram-points-numerical.js',
  '/src/data/heat-flow-cross-validation-imp372.js',
  '/src/data/heat-flow-pathc-ladder-imp2547.js',
  // imp-2884: triangulates heat-flow + barrier + Path-C/RK4 intercepts. Listed
  // after its heat-flow/barrier deps so the heavy zeros bundle loads first.
  '/src/data/cross-estimator-agreement-imp2884.js',
  '/src/data/holder-modulus-verification.js',
  '/src/data/imp371-barrier-cross-validation.js',
  '/src/data/imp-1166-conrey-snaith-correction-on-imp1162-grid.js',
  '/src/data/imp-1182-bs-2008-paper-walk-A-bound.js',
  '/src/data/imp-1186-lin-stat-sweep-20pt-2026-05.js',
  '/src/data/imp-1187-zeta-moment-asymptotic-constants-survey.js',
  '/src/data/imp-1188-bootstrap-ci-helper-tripwires.js',
  '/src/data/imp-1204-restricted-lift-pilot.js',
  '/src/data/imp-1207-app-S-adaptive-refinement.js',
  '/src/data/imp-1209-ghost-count-crosscheck.js',
  '/src/data/imp-1260-volterra-rigorous-bound-attempt.js',
  '/src/data/imp-1284-fanout-cap-analysis.js',
  '/src/data/imp-1313-bornemann-airy-kernel.js',
  '/src/data/imp-1316-volterra-large-a-sweep.js',
  '/src/data/imp-1326-riemann-siegel-error-sharpening.js',
  '/src/data/imp-1341-volterra-schatten-1-bridge.js',
  '/src/data/imp-1345-volterra-near-zero-sweep.js',
  '/src/data/imp-1348-bornemann-painleve-II.js',
  '/src/data/imp-2324-volterra-richardson.js',
  '/src/data/imp-2338-volterra-krawczyk.js',
  '/src/data/imp-2340-bootstrap-ci.js',
  '/src/data/imp-2357-selberg-volterra-margin.js',
  '/src/data/imp-2360-robin-margin-ca-growth.js',
  '/src/data/imp-2421-rankin-selberg-volterra-margin.js',
  '/src/data/imp-2429-route-a-rigidity-exponent-bisection.js',
  '/src/data/imp-2431-zpo-pair-correlation-gue.js',
  '/src/data/imp-2431-zpo-pair-correlation-sine-kernel.js',
  '/src/data/imp-2432-phillips-sarnak-cuspidal-density-gap.js',
  '/src/data/imp-2439-cm-coupling-constant-band.js',
  '/src/data/imp-2462-tier2-local-law-dependency-audit.js',
  '/src/data/imp-2464-volterra-hs-vs-opnorm-slack.js',
  '/src/data/imp-2488-partition-parity-assessment.js',
  '/src/data/imp-2752-bootstrap-determinism-crosscheck.js',
  '/src/data/imp-408-audit.js',
  '/src/data/imp-441-lean-import-graph.js',
  '/src/data/imp-888-info-theory-verification.js',
  '/src/data/imp-901-weil-formula-verification.js',
  '/src/data/imp469-cross-verification.js',
  '/src/data/k-plateau-monotonicity.js',
  '/src/data/kernel-hack-at-imp360.js',
  '/src/data/kernel-vs-dyson-crossverify.js',
  '/src/data/koksma-hlawka-C1-pinned.js',
  '/src/data/koksma-to-tc-closure.js',
  '/src/data/lambda-argmin-interiority.js',
  '/src/data/lambda-argmin-jumps.js',
  '/src/data/lambda-burgers-rate-upgrade.js',
  '/src/data/lambda-cross-validation.js',
  '/src/data/lambda-error-budget.js',
  '/src/data/lambda-historical-timeline.js',
  '/src/data/lambda-intercept-analytic.js',
  '/src/data/lambda-intercept-argmin-drift.js',
  '/src/data/lambda-intercept-burgers-uniformity.js',
  '/src/data/lambda-intercept-conditional-ladder.js',
  '/src/data/lambda-intercept-confidence.js',
  '/src/data/lambda-intercept-density-squeeze.js',
  '/src/data/lambda-intercept-density-weyl.js',
  '/src/data/lambda-intercept-monotonicity.js',
  '/src/data/lambda-intercept-quadratic.js',
  '/src/data/lambda-intercept-unconditional.js',
  '/src/data/lambda-rh-height-mapping.js',
  '/src/data/lambda-sota-assembly.js',
  '/src/data/lambda-zero-attack.js',
  '/src/data/local-law-rigidity-closure.js',
  '/src/data/platt-trudgian-matched-check.js',
  '/src/data/platt-trudgian-recheck-post-closure.js',
  '/src/data/polymath15-constant-C-C.js',
  '/src/data/polymath15-constant-C-F.js',
  '/src/data/polymath15-constant-C-T.js',
  // imp-413: double-double (~32-digit) precision verification of C_H/C_C/C_T/C_F.
  '/src/data/polymath15-constants-mpfr-check.js',
  // imp-422: GMP-grade (100-digit BigInt) precision verification of C_H/C_C/C_T/C_F.
  '/src/data/polymath15-constants-gmp-check.js',
  '/src/data/polymath15-lemma52-shock-holder.js',
  '/src/data/queue-gc-audit-2026-04-19.js',
  '/src/data/review-5-findings-audit.js',
  '/src/data/soft-gaps-cleanup-log.js',
  '/src/data/three-attacks-section.js',
  '/src/data/turing-zero-count-verification.js',
  '/src/data/zero-free-region-from-lambda.js',
  // imp-2518: imp-897 sub-gap RESOLVED-PARTIAL sync tripwires (same-step
  // collision bracket + Richardson-vs-single-point sharpness re-derivation).
  '/src/data/imp-857-phased-forcing-sweep.js',
  // imp-2530: (M-restated) = envelope form closure of the imp-2516 successor
  // sub-gap (certified flat-iff-violation trichotomy + imp-328 sufficiency audit).
  '/src/data/imp-2530-monotonicity-restatement.js',
  // imp-2535: imp-917 dual-id residual dedupe tripwires (consolidated into
  // the canonical imp-917-exec record; no execution claimed).
  '/src/data/imp-896-retuning-calibration.js',
  // imp-2538: queue-side sub-gap sync tripwires — the imp-997 openSubGap block
  // (canonical id imp-336-sub-monotonicity-on-trajectory) is pinned closed
  // (resolved negatively by imp-2516, successor closed by imp-2530) and the
  // whole queue is re-scanned each build for any open re-declaration of the id.
  '/src/data/improvement-queue.js',
  // imp-2546: cross-validation of the imp-299/imp-371 barrier extrapolation
  // (t_c = H_raw^2/8) against the Path C measured interval-RK4 ladder on the
  // extended N-to-1e6 Dyson ladder; per-rung bracket containment + Lambda
  // intercept agreement within the +/-0.01 error bar.
  '/src/data/imp371-barrier-cross-validation.js',
  // imp-2713: named-gap registry for the E(N) = E_trunc + E_flow + E_coll program.
  '/src/data/imp-2713-en-named-gap-registry.js',
  // imp-2826: build-time assertions for RouteErrorBoundary ChunkLoadError detection.
  '/src/data/imp-2826-chunk-load-error-assertions.js',
  // imp-2739: single-source headline-number registry + cross-file consistency tripwire.
  '/src/data/headline-numbers-registry.js',
  // imp-2740: tripwire forbidding NEW rigorous/unconditional adjacency to the finite-N*=1e4 beat.
  '/src/data/anti-overclaim-finite-beat-guard.js',
  // imp-2981: tripwire forbidding a rigorous/unconditional global Lambda<0.2 claim
  // in the two H_t finite-window (census + corridor) data files.
  '/src/data/imp-2981-ht-window-honest-status-tripwire.js',
  // imp-2681: pin C_shock from the cusp-density C_cusp via the quantile-spacing
  // identity — bounded/pinnable, isolating the C_H obstruction to C_Lip alone.
  '/src/data/imp-2786-c-shock-cusp-constant.js',
  // imp-3026: cross-validate the cusp-law C_shock (<1/3) against the squared-gap
  // surrogate constant C_shock^2/8 — both routes recover the SAME C_shock (~0.2692
  // at N*=1e4) to < 1e-9, confirming the two ch-wall-verdict appearances are one
  // constant. Consistency check only; surrogate stays refuted, PT 0.2 stays SOTA.
  '/src/data/imp-3026-c-shock-cross-validation.js',
  // imp-3029: independently recompute the local-energy reconditioning self-term
  // 2 g dg/dW via centered finite difference of g along the cusp family and confirm
  // it lands on the ch-wall-verdict literal C_shock^2 = 0.071289, FLAT across
  // W = 1e-2 .. 1e-10 (spread 1.4e-14). Numerical verification + flatness tripwire
  // of the g-coordinate-artifact cancellation; no new bound, PT 0.2 stays SOTA.
  '/src/data/imp-3029-reconditioning-flatness.js',
  // imp-3070: tabulate the N-dependence of the closed-form cusp constant
  // C_shock(N) = sqrt(2/(3 log gamma_N)) across the assembly N-range (N=2458..1e6)
  // and certify it stays strictly under the imp-2786 cap 1/3 with margin everywhere.
  // C_shock(N) is strictly decreasing (slow 1/sqrt(log gamma_N) factor); worst case
  // is the smallest N=2458 with C_shock ~ 0.2886, margin ~0.0447. Numerical uniformity
  // certificate of an already-proven cap, NOT a new bound; PT 0.2 stays SOTA.
  '/src/data/imp-3070-c-shock-n-dependence.js',
  // imp-3108: cross-validate the imp-3070 monotone C_shock(N) curve against the
  // imp-3026 three ladder values (reproduces them to < 1e-15) and tabulate the
  // margin 1/3 - C_shock(N) vs N, confirming it GROWS with N (smallest ~0.0447 at
  // N=2458, largest ~0.1095 at N=1e6) and the reduced inequality log gamma_N > 6
  // <=> gamma_N > e^6 ~ 403 holds at every assembly N. Numerical cross-check of an
  // already-proven cap, NOT a new bound; surrogate stays refuted, PT 0.2 stays SOTA.
  '/src/data/imp-3108-c-shock-margin-cross-validation.js',
  // imp-3132: closed-form FLOOR for the worst-case imp-3108 margin 1/3 - C_shock(N)
  // at the smallest assembly N=2458. Pins gamma_min = effectiveHeightForN(2458) ~ 2990
  // (log gamma_min > 8, reduced inequality log gamma_N > 6 with ~2.003 headroom) and
  // derives margin(N) >= 1/3 - 1/(2 sqrt 3) = (2 - sqrt 3)/6 ~ 0.0446582, just below the
  // exact worst case 0.0447131. Closed-form floor on an already-proven cap, NOT a new
  // bound; surrogate stays refuted, PT 0.2 stays SOTA.
  '/src/data/imp-3132-c-shock-worst-case-margin-floor.js',
  // imp-3151: profile the imp-3108 margin 1/3 - C_shock(N) BELOW the smallest assembly
  // N=2458 (margin is monotone decreasing in N, so its infimum lies below 2458, not at
  // it). Pins the sub-ladder crossing N_star = zeroCountAtHeight(e^6) ~ 203.03 where the
  // margin hits 0 (gamma_N = e^6), two ways (closed form + bisection, agree < 1e-5).
  // HONEST: cap C_shock < 1/3 is NOT inviolable at every N (fails for N < ~203) but
  // N_star is ~12.1x below N=2458, so every assembly clears e^6 with margin >= 0.0447.
  // Numerical profile of an already-proven cap, NOT a new bound; PT 0.2 stays SOTA.
  '/src/data/imp-3151-c-shock-submargin-profile.js',
  // imp-3047: tabulate the route-1 IMPOSSIBILITY lower bound C_Lip >= C_shock/(2 sqrt(W_1))
  // across a decreasing W_1 grid (1e-2 .. 1e-12) on the cusp law g_min = C_shock W_1^{1/2}.
  // The realized Lipschitz quotient reproduces C_shock/(2 sqrt(W_1)) to machine precision,
  // climbs ~1e5 across ten decades, and the log-log fit pins the divergence exponent at -1/2
  // — foreclosing a finite N-uniform global-W_1 C_Lip. Impossibility certificate, NOT a beat;
  // PT 0.2 stays SOTA.
  '/src/data/ch-lip-impossibility-w1grid-2026-06-30.js',
  // imp-2688: pin the E_flow Gronwall amplification constant C_G = 2/y_star^2 on
  // the explicit mesoscopic Trudgian density-floor strip (N-uniform), distinct
  // from the imp-2640 microscopic 2/g^2 wall.
  '/src/data/imp-2688-c-g-loglipschitz-bound.js',
  // imp-2735: numerical tripwires for the caustic resonance condition asserted
  // in prose by VizCausticResonancePage (bright-band / resonance correspondence).
  '/src/data/viz-caustic-resonance-checks.js',
  // imp-2751: denylist tripwire forbidding NEW load-bearing use of a REFUTED
  // phantom citation (seed: Soundararajan-Tao 2024, imp-1331 wrong object).
  '/src/data/phantom-citation-guard.js',
  // imp-2870: liveness tripwire — imports all 7 E(N) sub-cert modules
  // (imp-2641/2644/2700/2704/2709/2715/2762) not previously wired into the
  // sweep, triggers their self-executing assertions, and asserts each
  // *_ASSERTIONS array is non-empty to guard against silent array clearing.
  '/src/data/imp-2870-en-cert-liveness-tripwire.js',
  // imp-2865: cross-module storage-precision tolerance audit -- asserts every
  // E(N)-ledger comparison of a live value against a toFixed/toExponential
  // literal uses a tolerance >= the field's half-ULP floor (imp-2546/2539 trap).
  '/src/data/imp-2865-en-ledger-storage-tolerance-audit.js',
  // imp-2871: domain-validity audit for the elementary exp(x) <= 1+x+x^2
  // Gronwall tail bound -- enumerates every call site (imp-2704, imp-2762),
  // asserts each argument stays inside the proven 0<=x<=1 domain, and pins the
  // true crossing x* ~ 1.7932821 where the bound first fails.
  '/src/data/imp-2871-exp-tail-bound-audit.js',
  // imp-2867: shared certified T0 enclosure primitive for N*=1e4 -- extracts
  // the count-monotonicity straddle from imp-2704 into a single exported helper
  // and asserts consistency with imp-2704/imp-2709 carried values.
  '/src/data/imp-2867-t0-certified-enclosure.js',
  // imp-2962: gates the LMFDB L-function cross-reference table -- runs
  // assertIntegrity(), checks the DATA_AS_OF provenance stamp is a valid ISO
  // date, and pins lmfdbUrl() to the current LMFDB /L/<path> URL scheme so a
  // stale or schema-drifted external cross-reference fails the build sweep.
  '/src/data/lmfdb-l-function-cross-reference.js',
  // imp-2967: freshness/consistency cross-check between StateOfProgram TRUTHS
  // and overclaim-ledger -- RIGOROUS SOTA badge must still name Platt-Trudgian
  // Lambda<=0.2; every imp-id in the REFUTED TRUTHS entry must exist in
  // CAUGHT_OVERCLAIMS with an addressed status. Light (no zeros-bundle import).
  '/src/data/imp-2967-state-of-program-overclaim-cross-check.js',
  // imp-3065: INDEPENDENT quadrature cross-check that the degree-0 post-bridge
  // residual deficit D_pass(a,U) = int_0^U max(0, sinh(a*tau)-cosh(a*tau)) d(tau)
  // is EXACTLY zero across an a-grid x U-range (28 cells) via composite Simpson
  // (M=1000, distinct from the imp-3007 midpoint rule), with the rule validated
  // against the non-zero signed companion -(1-e^{-a*U})/a to < 1e-6 -- certifying
  // coveredFraction=1. SCALAR cover only; off-diagonal operator step out of scope;
  // RH-equivalent, structural/diagnostic, PT 0.2 stays SOTA.
  '/src/data/imp-3065-residual-deficit-quadrature-2026-06-30.js',
  // imp-3066: characterizes -- diagnostically, on a representative degree-4 monomial
  // truncation -- the off-diagonal endpoint-Hankel cross-terms the COMPLETE scalar
  // mu^pass cover (imp-3007) leaves untouched. The de-homogenized R = Gpass^{-1/2}
  // Gshear Gpass^{-1/2} has every diagonal < 1 (the scalar cover) yet a Perron operator
  // norm strictly above it, the gap fed entirely by the off-diagonal Hankel cross-terms.
  // Representative/diagnostic: ||R|| carries no RH verdict; positivity not attempted.
  '/src/data/imp-3066-offdiagonal-hankel-obstruction.js',
  // imp-3085: sweeps the imp-3066 operator/diagonal gap across the Cartesian a x U
  // grid and finds the off-diagonal endpoint-Hankel obstruction tracks the single
  // product s = a*U exactly (the U prefactor cancels in the de-homogenized R, so
  // equal-product cells coincide to machine precision -- the imp-3064 a*U invariant);
  // the RAW |H_jk| keeps the U scale and does not. Representative/diagnostic; no RH verdict.
  '/src/data/imp-3085-hankel-gap-aU-grid.js',
  // imp-3124: TESTS whether the imp-3085 exact s = a*U collapse BREAKS once the bare
  // hyperbolic weight is replaced by a Phi-proxy window (a fixed-scale Gaussian surrogate
  // for the completed Riemann kernel), as imp-3110 survivesSwap DERIVES it must. The global
  // U prefactor still cancels in R, but the window argument W(U*x) carries U directly, so
  // equal-product cells (0.5,6) and (0.3,10) -- identical to ~1e-15 under the bare weight --
  // split by ~0.246 once windowed (SIGMA=6); a SIGMA sweep shows the violation decays
  // monotonically to 0 as SIGMA -> infinity, pinning the break to the finite intrinsic scale.
  // Only the scale collapse breaks: the strictly-positive gap EXISTENCE survives on every
  // cell, exactly the imp-3110 survivesSwap split. Gaussian proxy, not the genuine kernel;
  // representative/diagnostic; no positivity; no RH verdict; PT 0.2 stays SOTA.
  '/src/data/imp-3124-phi-windowed-aU-collapse-break.js',
  // imp-3107: tabulates the DE-HOMOGENIZED off-diagonal extremes min/max_{j!=k} R_jk
  // (R_jk = H_jk/sqrt(D_jj D_kk)) across the imp-3085 a x U grid -- the curve imp-3085
  // never reported, having only contrasted the RAW |H_jk|. Confirms the de-homogenized
  // off-diagonal entries ARE functions of s = a*U alone (equal-product cells coincide to
  // ~1e-15, e.g. s=3 gives min R_jk 0.77125669, max R_jk 0.98549338) unlike the raw |H_jk|
  // (split 5.58 vs 9.31), and both extremes rise monotonically + saturate below 1 toward the
  // common-exponential Perron limit. Representative/diagnostic; no RH verdict; PT 0.2 SOTA.
  '/src/data/imp-3107-dehomogenized-offdiag-aU-grid.js',
  // imp-3110: characterizes the standing gap between the imp-3066 representative
  // monomial-moment truncation and the actual section-26 weighted Gram. Enumerates
  // FOUR concrete differences (D1 basis: monomials vs Phi-windowed complex channels;
  // D2 weight: bare cosh/sinh vs integrated Phi^2 densities; D3 endpoint: single-index
  // Hankel vs 2-variable past-future Volterra block; D4 dehomog: diagonal D vs full
  // G_pass). DERIVES that the strictly-positive gap EXISTENCE survives the swap
  // (Perron-Frobenius) while the a*U scale collapse, numerical magnitudes, and toy
  // diagonal dominance (= open Conj 26.3) are truncation artifacts. Self-computing
  // witness: toy shear is exactly Hankel; alternate-weight+basis rebuild keeps the
  // qualitative gap. Assessment only; no RH verdict; PT 0.2 SOTA.
  '/src/data/imp-3110-section26-gram-vs-monomial-gap.js',
  // imp-3087: characterizes the divergence of the imp-3064 excess fraction
  // phi(s) = G(s)/F(s) at the overflow onset s -> s0+ (s0 = arcsinh(1)). F has a
  // DOUBLE zero there (F(s0) = 0 and F′(s0) = sinh(s0) - 1 = 0, F′′(s0) = sqrt(2))
  // while G(s0) = 1 - arcsinh(1) > 0, so phi is a QUADRATIC POLE
  // phi ~ sqrt(2)*(1 - arcsinh(1))/(s - s0)^2 ~ 0.16776/(s - s0)^2 -> +infinity:
  // no finite supremum on (s0, inf). Degree-0 scalar one-sided limit; no RH verdict.
  '/src/data/imp-3087-excess-fraction-onset-divergence.js',
  // imp-3088: extracts the large-s decay CONSTANT of the imp-3064 excess fraction
  // phi(s) = G(s)/F(s) (the companion to the imp-3087 onset blow-up). As s = a*U ->
  // inf, G saturates at sqrt(2) - arcsinh(1) while F ~ e^s/2, so phi(s) ~ K*e^{-s}
  // with K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568 (phi*e^s -> K). The next-order
  // correction is set by the linear -s term in F: (phi*e^s)/K - 1 ~ (2s + 2C - 1/C)
  // e^{-s}, so the bare e^{-s} fit relative error decays ~2s*e^{-s} (55% at s=2 to
  // ~8e-8 at s=20). Degree-0 scalar leading asymptotic; no RH verdict.
  '/src/data/imp-3088-excess-fraction-large-s-decay.js',
  // imp-3105: locates the INTERIOR landmark scales of the imp-3064 excess fraction
  // phi(s) = G(s)/F(s) between the imp-3087 onset pole and the imp-3088 large-s decay.
  // The two asymptotic envelopes C/(s-s0)^2 and K e^{-s} cross TWICE (physical handoff
  // s ~ 1.91504; algebraic-vs-exponential re-crossing s ~ 4.31751); phi(s) = 1 at the
  // unique s* ~ 1.48895 where F = G ~ 0.30723 (transcendental, no closed form); and the
  // steepest transition max |dlog_phi/ds| has NO finite interior maximizer -- the slope
  // rises monotonically from -infinity at the onset double zero to -1, so the steepest
  // point is the onset boundary itself. Degree-0 scalar measure; RH-equivalent; no RH verdict.
  '/src/data/imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js',
  // imp-3130: spreads the imp-3105 SINGLE-POINT envelope gap into a full curve --
  // tabulates the EXACT phi(s)=G(s)/F(s) vs the two rough envelopes ENV_POLE=C/(s-s0)^2
  // and ENV_DECAY=K e^{-s} (and their max) with signed relative error env/phi-1 across
  // s in (s0, ~8). Both envelopes UNDERESTIMATE phi over the whole interior, and the
  // worst under-estimate of the natural ENV_MAX combination is EXACTLY at the imp-3105
  // handoff s_cross1 ~ 1.91504 (ENV_MAX/phi-1 ~ -0.58481) -- the single point imp-3105
  // reported is the GLOBAL worst case. Validity windows are two thin tails: ENV_POLE
  // within 10% only for s < ~0.91647 (never 1%), ENV_DECAY within 10% for s > ~4.40313
  // and within 1% for s > ~7.21846. Degree-0 scalar measure; RH-equivalent; no RH verdict.
  '/src/data/imp-3130-envelope-approximation-error-table-2026-06-30.js',
  // imp-3102: sweeps the imp-3086 BASIS-INVARIANT residual gap ||R_orth|| - max_j
  // R_orth_jj (R_orth = L H L^T, L = (Cholesky of the FULL passive cosh Gram)^{-1})
  // across the Cartesian a x U grid and finds the SURVIVING intrinsic obstruction also
  // tracks the single product s = a*U: both Gram moments carry the same U prefactor, so
  // L = U^{-1/2} Lbar(s) and R_orth = Lbar Hbar Lbar^T (U cancels), and equal-product
  // cells coincide to ~1e-13 -- the survivor SHARES the scalar-side a*U invariant rather
  // than breaking it, while the RAW |H_jk| keeps the U scale. Representative/diagnostic;
  // survivor strictly positive on every cell; no positivity; no RH verdict; PT 0.2 SOTA.
  '/src/data/imp-3102-orthogonalized-gap-aU-grid.js',
  // imp-3103: sweeps the imp-3086 TRUE basis-invariant operator norm ||R_orth||
  // (R_orth = L H L^T, L = (Cholesky of the FULL passive cosh Gram)^{-1}) across the
  // a x U grid and locates the RH-equivalent contraction boundary ||R|| <= 1. ||R_orth||
  // depends on s = a*U alone (U cancels in R_orth = L1 H1 L1^T, equal-product cells
  // coincide to ~1e-13) and is < 1 EVERYWHERE admissible -- since sinh < cosh, v^T H v <
  // v^T P v for all v != 0, so every pencil eigenvalue is strictly below 1: the
  // representative truncation is a contraction with NO finite-s* crossing, and the margin
  // 1 - ||R_orth|| shrinks monotonically to 0 from below as s -> inf. Representative/
  // diagnostic; no RH verdict (degree-dependence is the open imp-3104); PT 0.2 SOTA.
  '/src/data/imp-3103-orthogonalized-opnorm-aU-grid.js',
  // imp-3104: runs the imp-3084 RAW-basis degree sweep on the ORTHOGONALIZED basis --
  // measures the TRUE operator norm ||R_orth|| (= ||R_sym||, basis invariant) across
  // DEG in [2, 12] at a = 0.5, U = 6 (the open imp-3103 degree question). Where the raw
  // monomial ||R|| DIVERGES (~1.79 -> 10.8, imp-3084), the orthogonalized norm CONVERGES
  // to the analytic Rayleigh ceiling tanh(a*U) = tanh(3) ~ 0.99505 from below: the
  // distance shrinks ~16x over DEG [2, 10] (0.98986 -> 0.99474) while GS and Loewdin
  // agree to ~1e-5, so the raw divergence is ENTIRELY a basis-conditioning artifact --
  // the intrinsic operator norm is TAMED and bounded below 1. DEG 11, 12 are excluded:
  // the ill-conditioned cosh-Hankel P makes the orthogonalizer itself break down (GS vs
  // Loewdin disagree ~6-7%, both overshoot the analytic ceiling). Representative/
  // diagnostic; no RH verdict; positivity not attempted; PT 0.2 stays SOTA.
  '/src/data/imp-3104-orthogonalized-opnorm-degree-sweep.js',
  // imp-3288: UPGRADES imp-3104 from a monomial-truncation measurement to a FUNCTION-SPACE-
  // COMPLETE rigorous negative result. States and verifies the analytic ceiling lemma over ALL
  // of L2([0,U]): Q(f) = int sinh(a*tau) f^2 / int cosh(a*tau) f^2 <= tanh(a*U) for EVERY f
  // (proof: sinh = cosh*tanh, tanh(a*tau) <= tanh(a*U) integrated against the nonnegative weight
  // cosh(a*tau) f^2), and sup Q = tanh(a*U) < 1 is sharp (concentrating indicators reach it) but
  // NOT attained. imp-3104 only measured monomials approaching from below; here the ceiling is
  // proved over the full span and certified: 10 diverse non-monomial probes stay strictly below,
  // the concentrating ladder rises past the best imp-3104 monomial norm (~0.99474) toward tanh(3),
  // and the lemma re-verifies across an (a,U) family. Operator-order corollary: H <= tanh(a*U) P
  // sharply, deficit >= 1 - tanh(a*U) > 0. Rigorous NEGATIVE result about the SCALAR core ONLY;
  // does NOT touch K_a >= 0; no RH verdict; PT 0.2 stays SOTA.
  '/src/data/imp-3288-analytic-ceiling-lemma.js',
  // imp-3125: profiles the imp-3086/imp-3102 BASIS-INVARIANT surviving residual gap
  // ||R_orth|| - max_j R_orth_jj (R_orth = L H L^T) vs monomial truncation degree DEG in
  // {2,4,6,8,10} on the headline cell a=0.5,U=6 (both parents measured DEG=4 only). The
  // gap SATURATES: ||R_orth|| rises toward tanh(a*U)=tanh(3)~0.99505 (imp-3104) while the
  // max diagonal is pinned at the constant-direction closed form R_orth_00=(cosh(aU)-1)/
  // sinh(aU)=tanh(aU/2)~0.90515 (DEG-independent), so the survivor converges from below to
  // tanh(aU)-tanh(aU/2)~0.08991 (measured 0.08471->0.08959, distance to limit shrinks ~16x).
  // Intrinsic obstruction neither grows unbounded nor vanishes. Representative diagnostic;
  // no RH verdict; positivity not attempted; DEG inside the imp-3104 trustworthy range; PT 0.2 SOTA.
  '/src/data/imp-3125-orthogonalized-residual-gap-degree-sweep.js',
  // imp-3146: sweeps the imp-3125 SATURATING residual-gap limit tanh(aU)-tanh(aU/2)
  // across the FULL A_GRID x U_GRID product (imp-3125 had the DEG sweep at a=0.5,U=6 only).
  // Inheriting the imp-3102 a*U invariance, the limit is the single-variable closed form
  // G(s)=tanh(s)-tanh(s/2), s=a*U: strictly positive on every cell, vanishing only as s->0
  // and s->inf. G prime=0 reduces (c=cosh(s/2)) to 4c^4-6c^2+1=0, so cosh(a*U)=(1+sqrt5)/2=phi
  // (GOLDEN RATIO): the obstruction is MAXIMIZED on the locus a*U=arccosh(phi)~1.06128 with
  // closed-form max G(s*)=phi^{-5/2}~0.30028. Per-cell R_orth rebuild confirms the finite-DEG
  // survivor stays positive and saturates from below; a fine s-scan recovers the maximizer to
  // ~1e-5; equal-product cells coincide to machine precision. Representative diagnostic; no RH
  // verdict; positivity not attempted; PT 0.2 SOTA.
  '/src/data/imp-3146-residual-gap-limit-aU-grid.js',
  // imp-3176: CROSS-MODULE tripwire locking the imp-3146 golden-ratio landmark.
  // Re-derives the maximizer of G(s)=tanh(s)-tanh(s/2) from an INDEPENDENT Newton
  // solve of the stationarity condition G prime(s)=sech^2(s)-(1/2)sech^2(s/2)=0
  // (analytic G prime prime, seeded at s=1.6, never Math.acosh), then certifies
  // cosh(s*)=phi (golden ratio) and G(s*)=phi^{-5/2} to ~1e-9, that the independent
  // root matches the live imp-3146 sStarClosedForm/gStarClosedForm, and that the
  // live 24000-point fine-scan recovered the same maximizer/value. Lock only, no
  // new math, no QED; PT Lambda <= 0.2 stays SOTA.
  '/src/data/imp-3146-golden-ratio-maximizer-tripwire-2026-06-30.js',
  // imp-3106: assesses the INTEGRABILITY of the imp-3064 excess fraction phi(s) =
  // G(s)/F(s) over the admissible range (s0, inf). The integral DIVERGES: the
  // imp-3087 onset pole phi ~ C/(s-s0)^2 (C = sqrt(2)*(1-arcsinh(1)) ~ 0.16776) is
  // non-integrable at s0, so int_{s0+eps}^{s0+1} phi ds ~ C/eps (eps-cutoff ladder
  // grows ~10x per decade, eps*I(eps) -> C from above, and tracks the analytic
  // principal part C*(1/eps-1) to <1%). The area-weighted MEAN price thus has no
  // finite value. Away from the onset all is finite: the imp-3088 tail phi ~ K e^{-s}
  // (K ~ 1.06568) gives a convergent tail mass int_S^inf phi ds ~ K e^{-S}, and the
  // whole regular mass int_{s0+1}^inf phi ds ~ 0.2690 is fixed; the divergence is
  // localised ENTIRELY at the onset (I(1e-4) overruns 0.2690 by ~6250x). Divergence
  // characterization, not a value; degree-0 scalar measure; RH-equivalent; PT 0.2 SOTA.
  '/src/data/imp-3106-excess-fraction-integrability.js',
  // imp-3112: single cross-module build assertion locking BOTH companion asymptotic
  // constants of the imp-3064 excess fraction phi(s) = G(s)/F(s): the imp-3087 onset
  // pole constant C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776 (phi ~ C/(s-s0)^2 at s -> s0+)
  // and the imp-3088 large-s decay constant K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568
  // (phi ~ K e^{-s} at s -> inf). Recomputes both from the closed forms F, G, certifies
  // them to the published anchors to ~1e-10, certifies the live imp-3087/imp-3088
  // exports equal those closed forms to machine precision, and certifies the two
  // convergence signatures phi(s0+eps)/(C/eps^2) -> 1 and phi(s) e^s / K -> 1, so a
  // silent edit to F or G in either module cannot drift C or K unnoticed. 6 tripwires;
  // degree-0 scalar measure; RH-equivalent; lock only, no QED; PT 0.2 SOTA.
  '/src/data/imp-3112-onset-decay-constant-locks.js',
  // imp-3127: single cross-module build assertion locking the THREE interior landmark
  // scales of the imp-3064 excess fraction phi(s) = G(s)/F(s) that imp-3105 located:
  // the unique phi = 1 scale s* ~ 1.48895 (F = G ~ 0.30723), the physical onset->decay
  // envelope handoff s_cross1 ~ 1.91504, and the algebraic-vs-exponential re-crossing
  // s_cross2 ~ 4.31751. Recomputes all three by an independent bracketed root find on
  // the closed forms F, G, certifies them to the published anchors to ~1e-9, and
  // certifies the live imp-3105 exports equal those recomputed scales to ~1e-9, so a
  // silent edit to F or G in imp-3105 cannot drift the interior landmarks unnoticed.
  // 6 tripwires; degree-0 scalar measure; RH-equivalent; lock only, no QED; PT 0.2 SOTA.
  '/src/data/imp-3127-interior-landmark-locks.js',
  // imp-3129: single cross-module build assertion locking the TWO global integrability
  // signatures of the imp-3064 excess fraction phi(s) = G(s)/F(s) that imp-3106
  // characterized: the onset divergence rate eps*I(eps) -> C = sqrt(2)*(1 - arcsinh(1))
  // ~ 0.16776 (pinning the C/eps inverse-square pole) and the convergent tail law
  // int_S^inf phi ds ~ K e^{-S}, K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568 (tail ratio -> 1,
  // 1.0005 at S = 10). Independently recomputes eps*I(eps) at eps = 1e-4 (bounded
  // v = 1/(s-s0) substitution) and the S = 10 tail ratio from the closed forms F, G,
  // certifies them against C and 1 to the physically achievable tolerance, and certifies
  // the live imp-3106 exports (finest onsetRung.epsTimesMass, S = 10 tailRung.ratio) equal
  // those recomputed values to ~1e-9, so a silent edit to F or G in imp-3106 cannot
  // rebaseline either divergence signature unnoticed. 5 tripwires; degree-0 scalar
  // measure; RH-equivalent; lock only, no QED; PT 0.2 SOTA.
  '/src/data/imp-3129-onset-divergence-tail-locks.js',
  // imp-3147: single cross-module build assertion locking the imp-3125 SATURATING
  // surviving residual gap ||R_orth|| - max_j R_orth_jj on the headline cell a = 0.5,
  // U = 6. Independently rebuilds R_orth = L H L^T at the DEG = 10 sweep top from its own
  // quadrature + Cholesky code path, extracts the surviving basis-invariant gap, and
  // certifies: the recomputed DEG = 10 gap, operator norm and max diagonal equal the live
  // imp-3125 exports to ~1e-9 (drift sentinel); the max diagonal floor stays pinned at
  // tanh(a*U/2) = (cosh(a*U) - 1)/sinh(a*U) ~ 0.90515; the closed-form saturation limit
  // tanh(a*U) - tanh(a*U/2) equals the live analyticGapLimit to ~1e-12 and matches the
  // published 0.08991 anchor; and the DEG = 10 gap saturates that limit FROM BELOW (still
  // ~3.15e-4 short -- saturation is a limit, not equality). 5 tripwires; representative
  // truncation diagnostic; RH-equivalent; lock only, no QED; PT 0.2 SOTA.
  '/src/data/imp-3147-residual-gap-saturation-lock.js',
  // imp-3196: measures the DEGREE-CONVERGENCE RATE of the finite-DEG residual gap toward
  // the analytic limit G(s) = tanh(s) - tanh(s/2). imp-3125 swept the s = 3 cell and
  // imp-3177 certified saturation FROM BELOW at equal-s cells, but neither quantified HOW
  // resid(DEG) = G(s) - gap(DEG) decays. Rebuilds R_orth = L H L^T at s = 0.8, 1.2, 2.0, 3.0
  // (a = 0.5, U = 2s) over DEG in {2,4,6,8,10} and fits resid(DEG) against a power law
  // resid ~ C DEG^(-p) and a geometric law resid ~ C r^DEG. VERDICT at every cell: ALGEBRAIC
  // -- the log-log fit (R^2 ~ 0.996..0.999) beats the semi-log fit (R^2 ~ 0.96..0.97) and the
  // consecutive residual ratio rises toward 1 (~0.40 -> ~0.67), the algebraic-tail signature.
  // The fitted exponent is p ~ 1.5, rising monotonically with s from ~1.49 (s = 0.8) to ~1.72
  // (s = 3.0): the rate is s-dependent. The s = 3 cell reproduces the imp-3125 endpoints
  // (resid(2) ~ 5.20e-3, resid(10) ~ 3.15e-4). Empirical least-squares rate, NOT a proved
  // asymptotic order; representative diagnostic; RH-equivalent; no positivity; PT 0.2 SOTA.
  '/src/data/imp-3196-residual-gap-convergence-rate.js',
  // imp-3154: classifies the imp-3144 GENUINE degree-2 (absolute) occupation deficit
  // (recorded 9.28e-9, overflow on 19.4% of tau at the genuine Phi NPHI=10, a=0.5, U=6)
  // vs monomial truncation degree DEG in {2,4,6,8,10}, mirroring the imp-3125 scalar-gap
  // sweep. Rebuilds the genuine section-26 occupation densities from the lightweight Phi
  // kernel -- shear nu(tau)=int_0^tau du int_tau^U dv Phi(u)Phi(v)sinh(a(v-u)) (past-future
  // Volterra block) and passive mu(tau)=(1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du -- with
  // each hyperbolic weight truncated to its degree-DEG odd-Taylor polynomial. The deficit
  // is essentially DEG-INDEPENDENT (1.1906e-7 -> 1.18569e-7 by DEG=6, DEG=2 within ~0.42%
  // of the limit) with the overflow fraction pinned at 0.200 of tau at every degree,
  // reproducing the recorded 19.4% anchor: it SATURATES to a strictly-positive limit, NOT
  // a vanishing truncation artifact and NOT growth. The absolute magnitude carries this
  // module density normalization (same tiny order/sign as the recorded 9.28e-9); the
  // deliverable is the DEG-trend + overflow fraction. Representative diagnostic;
  // necessary-but-not-sufficient at operator order; no positivity, no RH verdict; PT 0.2 SOTA.
  '/src/data/imp-3154-genuine-deg2-deficit-degree-sweep.js',
  // imp-3199: generalizes the imp-3175 SINGLE-cell (a=0.5,U=6,NPHI=10) O(N) prefix/suffix
  // overflow-fraction resolution sweep to SEVEN genuine Phi cells (vary a, U, NPHI one knob
  // at a time) and certifies the O(N) sinh(a(v-u)) addition-law factorization against a
  // direct O(N^2) recompute at EACH cell. FINDINGS: (F1) the factorized nu(tau) reproduces
  // the direct O(N^2) loop to machine precision (max rel error ~1e-16) at every cell, not
  // just the base; (F2) the overflow fraction is monotone-increasing-to-a-converged-value at
  // every cell; (F3) the converged FRACTION is cell-dependent but ONLY through U (a in
  // {0.3,0.5,0.7} and NPHI in {6,10,14} all give ~0.209 -- the kernel saturates by NPHI=6;
  // U=5 -> 0.251, U=6 -> 0.209, U=8 -> 0.157), while the ABSOLUTE overflow-support measure
  // frac*U is ~1.2535 +- 0.001 across ALL seven cells. So the imp-3175 ~0.209 is the U=6
  // normalization of a cell-invariant overflow-support lag-length ~1.254, NOT a universal
  // fraction. Throws on import if any cell breaks the factorization, monotonicity, or the
  // invariant measure. Diagnostic; overflow-support only; necessary-but-not-sufficient at
  // operator order; no positivity, no RH verdict; PT Lambda <= 0.2 stays SOTA.
  '/src/data/imp-3199-overflow-fraction-cell-sweep.js',
  // imp-3216: assesses whether the imp-3199 cell-invariant overflow-support length frac x U ~ 1.2535
  // has a closed form. Resolving {tau : nu > mu} to N=51200 shows the overflow set is a SINGLE
  // contiguous interval [tau_1, tau_2] with BOTH endpoints cell-invariant (tau_1 ~ 0.1109, tau_2 ~
  // 1.3660, spread < 3e-4). FINDING: the invariance is EXACT but NOT a Phi-autocorrelation length --
  // tau_1 is a genuine a-scale-free nu/mu crossover, but tau_2 ~ 1.367 is the IEEE-754 double UNDERFLOW
  // HORIZON of the kernel Phi(u) (exp(-pi e^{4u}) drops below 2^-1074 at tau ~ (1/4)ln(X*), pi X* -
  // ln(2 pi^2 X*) = 744.44). The Phi^2-tail mu underflows FIRST (tau ~ 1.196) while single-Phi-tail nu
  // stays > mu until IT underflows at tau ~ 1.366, so the region ends by arithmetic underflow, not a
  // crossover. REVISES imp-3199 F3: mathematically the overflow is [tau_1, U], the true fraction
  // (U - tau_1)/U -> 1 as U grows (0.981 -> 0.991 over U=6..12) while the MEASURED (tau_2 - tau_1)/U
  // falls like 1/U (0.209 -> 0.105); the ~1.2535 length is a double-precision underflow artifact.
  // Throws on import if any endpoint, the underflow ordering, or the U-scaling breaks. Diagnostic;
  // overflow-support geometry only; necessary-but-not-sufficient; no positivity; PT Lambda <= 0.2 SOTA.
  '/src/data/imp-3216-overflow-support-length-closed-form.js',
  // imp-3197: tests the section26-mupass verdict claim that the K_a>=0 bridge sign-positivity
  // is "derived from Phi ALONE (not from |Gshear| own spectrum)" at the genuine Phi (NPHI=10,
  // a=0.5, U=6). Splits "correct sign at correct lags" into SIGN and MAGNITUDE: Phi>=0 on [0,U]
  // makes its autocorrelation nonnegative, so sign Gshear(u,v)=sign(v-u) -- the Phi-only sign
  // matches the |Gshear| entry sign on 100% of off-diagonal mass (zero gap). But the
  // lag-stationary surrogate carrying exactly Phi autocorrelation captures only ~3% of the true
  // ||Gshear|| (~97% is Phi position concentration = the |Gshear| spectrum). So the sign half is
  // Phi-only and free; the binding magnitude half stays operator-level / RH-equivalent. PT 0.2 SOTA.
  '/src/data/imp-3197-mupass-bridge-sign-phi-only.js',
  // imp-3215: N-scaling of the imp-3197 lag-stationary Toeplitz surrogate vs |Gshear| operator-norm
  // CAPTURE RATIO r(N)=||T||/||Gshear|| at the genuine Phi cell (NPHI=10,a=0.5,U=6), over the WIDER
  // ladder N in {160,240,320,480,640,800} (imp-3197 reported stability only over {160,240,320}). r(N)
  // decreases monotonically from ~0.03004 to ~0.02941 with shrinking decrements, converging from above
  // to a finite continuum limit ~0.0294 (Richardson ~0.02936): the ~3% capture NEITHER decays to zero
  // NOR grows -- it is a fixed structural fraction (the ratio is quadrature-weight-independent since the
  // common 1/H factor cancels; both norms grow ~linearly in N). So the ~97% position-concentration share
  // (~97.06%) is a genuine |Gshear| spectrum property, not a finite-N artifact -- sharpening imp-3197.
  // Throws on import if the ratio is non-monotone, drifts out of band, or the norms stop growing.
  // Diagnostic; RH-equivalent; imp-3066 endpoint-Hankel obstruction untouched; no QED; PT 0.2 SOTA.
  '/src/data/imp-3215-mupass-capture-ratio-n-scaling.js',
  // imp-3126: cross-checks whether the imp-3106 convergent regular tail mass
  // int_{s0+1}^inf phi ds ~0.26900597 is structurally related to the imp-3026/imp-3070
  // cusp constant C_shock = sqrt(2/(3 log gamma_N)) ~0.26922 (which agree to ~2.1e-4 at
  // N*=1e4) or a coincidence. VERDICT COINCIDENCE: the regular mass is a fixed
  // N-independent integral while C_shock(N) decays monotonically, so the abs diff grows
  // ~213x over the next two decades (2.1e-4 -> 4.5e-2); no shared arcsinh(1)/sqrt(2)
  // closed form. Pure cross-validation of two degree-0 scalars; no QED; PT 0.2 SOTA.
  '/src/data/imp-3126-regular-mass-vs-c-shock-coincidence.js',
  // imp-3152: cross-module tripwire LOCKING the imp-3126 COINCIDENCE verdict.
  // Independently recomputes the imp-3106 regular tail mass int_{s0+1}^inf phi ds
  // ~0.26900597 (own Simpson path) and the imp-3026/imp-3070 cusp constant C_shock(N)
  // = sqrt(2/(3 log gamma_N)) on the ladder N in {1e4,1e5,1e6}, and certifies: the
  // recomputed regular mass and C_shock(N) match the live imp-3126 exports to ~1e-9;
  // the abs diff |C_shock(N) - regularMass| is STRICTLY INCREASING in N (2.12e-4 ->
  // 2.53e-2 -> 4.52e-2); and the end-to-end blowup is ~213x (matching the live
  // absDiffBlowupOverLadder). A constant edit that shrinks the divergence to re-create
  // a false near-identity between the two degree-0 scalars is caught here. Pure
  // cross-validation; NOT an operator step; lock only, no QED; PT 0.2 SOTA.
  '/src/data/imp-3152-c-shock-coincidence-divergence-lock.js',
  // imp-3156: cross-module tripwire LOCKING the imp-3007 degree-0 scalar-cover
  // invariants. Independently recomputes, over the sweep a in {0.5,0.2,0.1,0.05} with
  // U=6 and its OWN Simpson quadrature, the post-bridge residual deficit D_pass(a) =
  // int max(0, sinh(a*tau) - cosh(a*tau)) and the forced excess E(a) = int [cosh(a*tau)
  // - max(1, sinh(a*tau))], and certifies D_pass(a) = 0 to machine precision (live
  // coveredFraction = 1) and E(a) > 0 for every a (closed form and own Simpson agree to
  // ~1e-6, matching the live imp-3007 excessMass to ~1e-9). A constant edit to the
  // imp-3007 weights that re-opens the overflow or collapses the forced excess is caught
  // here. Pure cross-validation of a degree-0 SCALAR cover; NECESSARY but NOT sufficient
  // for the operator step (imp-3066); lock only, no QED; PT Lambda <= 0.2 stays SOTA.
  '/src/data/imp-3156-scalar-cover-invariant-lock.js',
  // imp-3211: cross-module tripwire LOCKING the imp-3175 resolution-converged genuine
  // overflow fraction ~0.209 as the authoritative value. Three assertion groups:
  // (L1) imp-3175 finestFraction in [0.208,0.211] and verdict string; (L2) stale
  // anchors 0.194/0.200 are BELOW the converged value by >0.005 and still labeled with
  // their historical values; (L3) imp-3007 resolvedOverflowFractionOfTau matches the
  // imp-3175 offlineConvergedOverflow to <0.001 and differs from the stale
  // genuineDeg2OverflowFractionOfTau by >0.01. An edit that promotes 0.194 or 0.200 to
  // the resolved role -- or collapses the stale/resolved distinction -- fails here.
  // Lock only; overflow-support fraction only; not an operator step; no QED; PT 0.2 SOTA.
  '/src/data/imp-3211-overflow-fraction-converged-lock.js',
  // imp-3006+3061+3062+3063+3090+3091: basin-conditional local-energy C_Lip assembly
  // (c*=0.93185 closed form, BASIN_RHO=0.72 < ASYM_SCAN_INF=0.927, margin 0.207),
  // margin sensitivity ladder, gap-channel theta-sweep [0,1/4], divergence decomposition
  // (Theta channel 1/(1-Theta) removed, linear-N factor UNTOUCHED so global C_Lip stays
  // O(N)), Theta-channel 4/3 ceiling certificate, and off-basin C_Theta crossover scale
  // (~62.88, ~1668x the operative g_min). Module throws on import if any of its 26
  // self-executing assertions fail. Basin-conditional ONLY; NOT a global-W_1 beat;
  // PT Lambda <= 0.2 stays the rigorous SOTA.
  '/src/data/ch-lip-basin-conditional-2026-06-30.js',
];

let ALL_MODULES = FAST_MODE
  ? [...MATH_MODULES, ...DATA_MODULES].filter((m) => !HEAVY_MODULES.includes(m))
  : [...MATH_MODULES, ...DATA_MODULES];

// imp-2885: module-count floor tripwire — fail fast if the registered module
// list drops below the current floor (catches accidental list truncation).
// Update MODULE_COUNT_FLOOR when new modules are intentionally added; never
// lower it silently.
const MODULE_COUNT_FLOOR = 200;
if (MATH_MODULES.length + DATA_MODULES.length < MODULE_COUNT_FLOOR) {
  console.error(
    'MODULE COUNT REGRESSION: ' +
    (MATH_MODULES.length + DATA_MODULES.length) + ' modules registered, floor is ' +
    MODULE_COUNT_FLOOR + '. Update MODULE_COUNT_FLOOR in run-assertions.mjs if this is intentional.'
  );
  process.exit(2);
}

// imp-2749: --since-changed incremental mode — restrict sweep to modules whose
// source files are changed vs HEAD (both staged and unstaged). One cheap git
// call at startup; falls back to full sweep if git is unavailable or returns
// no matches (so the flag is always safe to pass).
if (SINCE_CHANGED) {
  try {
    const out = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' });
    const changedSet = new Set(out.trim().split('\n').filter(Boolean));
    // Module paths carry a leading '/' (e.g. '/src/data/foo.js'); git paths don't.
    const filtered = ALL_MODULES.filter((m) => changedSet.has(m.slice(1)));
    if (filtered.length > 0) ALL_MODULES = filtered;
  } catch { /* git unavailable — run full sweep */ }
}

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

// imp-2483: Vite's in-process SSR transport can spuriously emit
// "transport invoke timed out after 60000ms" under heavy CPU contention even
// when the module evaluates fine — these false-positive load timeouts pollute
// the assertion log and can mask real regressions (notably for the heavy
// c-mb-alternative-angles-eval.js / paper-skeptic-review-7b-phase51.js modules).
// Retry the load a bounded number of times on transient timeout errors only;
// the Vite cache stays warm from the prior attempt so the retry is cheap and
// usually succeeds once the contention spike passes. Non-timeout errors (real
// load failures) still throw immediately, preserving the original behavior.
async function loadModuleWithRetry(target, modPath) {
  const MAX_LOAD_ATTEMPTS = 3;
  let lastErr;
  for (let attempt = 1; attempt <= MAX_LOAD_ATTEMPTS; attempt++) {
    try {
      // imp-2737: race each load attempt against a per-module watchdog so that
      // modules that hang (e.g. large bundle imports under Vite SSR) surface as
      // LOAD_ERR instead of blocking the entire sweep indefinitely. Watchdog
      // timeouts are NOT retried — only Vite transport transients are.
      const watchdog = new Promise((_, reject) => {
        const t = setTimeout(
          () => reject(new Error('module watchdog timeout after ' + MODULE_WATCHDOG_MS + 'ms')),
          MODULE_WATCHDOG_MS
        );
        if (t.unref) t.unref();
      });
      return await Promise.race([target.ssrLoadModule(modPath), watchdog]);
    } catch (e) {
      lastErr = e;
      const transient = /invoke timed out|transport.*timed out|timed out after \d+ms/i.test(e.message || '');
      if (!transient || attempt === MAX_LOAD_ATTEMPTS) throw e;
    }
  }
  throw lastErr;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (SELF_TEST_MODE)   return runSelfTest();
  if (FAIL_INJECT_MODE) return runFailInject();

  // imp-2832: arm the overall wall-clock watchdog before any heavy work so the
  // sweep can never wedge the gate. On expiry, name the still-in-flight modules
  // (stall suspects) and exit non-zero. unref() so a clean finish is never held
  // open by the pending timer.
  if (OVERALL_TIMEOUT_MS > 0) {
    const watchdog = setTimeout(() => {
      const stalled = [...inFlightModules];
      console.error('\nASSERTION SWEEP TIMEOUT: overall wall-clock budget of '
        + OVERALL_TIMEOUT_MS + 'ms exceeded — failing fast instead of hanging.');
      if (stalled.length > 0) {
        console.error('  Still-in-flight modules (stall suspects):');
        for (const m of stalled) console.error('    STALLED ' + m);
      } else {
        console.error('  No modules in flight — stall is outside module loading.');
      }
      process.exit(124);
    }, OVERALL_TIMEOUT_MS);
    watchdog.unref();
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
  // imp-2746: track DATA_MODULES entries that export no *_ASSERTIONS arrays
  const dormantDataModules = [];

  function log(msg) { console.log(msg); lines.push(msg); }

  log('# Assertion sweep — ' + new Date().toISOString());
  log('Mode: ' + (FAST_MODE ? 'fast (heavy modules skipped)' : 'full') +
      (SINCE_CHANGED ? ' · since-changed (' + ALL_MODULES.length + ' modules)' : '') +
      ' · parallel: ' + PARALLEL +
      (pool ? ' · ssr-pool: ' + SSR_POOL_N : ''));
  log('');

  async function processOne(modPath) {
    let mod;
    let slot;
    inFlightModules.add(modPath); // imp-2832: overall-watchdog stall report
    try {
      if (pool) {
        slot = await pool.acquire();
        mod  = await loadModuleWithRetry(slot.server, modPath);
        pool.release(slot);
      } else {
        mod = await loadModuleWithRetry(server, modPath);
      }
    } catch (e) {
      if (slot && pool) pool.release(slot);
      inFlightModules.delete(modPath);
      const msg = 'LOAD_ERR ' + modPath + ': ' + e.message.slice(0, 120);
      log('  ' + msg);
      loadErrors++;
      failed++;
      failures.push({ id: modPath, why: 'module load error: ' + e.message.slice(0, 80) });
      return;
    }
    inFlightModules.delete(modPath);

    const arrays = Object.entries(mod).filter(
      ([k, v]) => k.endsWith('_ASSERTIONS') && Array.isArray(v)
    );
    // imp-2746: flag DATA_MODULES entries with no *_ASSERTIONS array
    if (arrays.length === 0) {
      if (DATA_MODULES.includes(modPath)) dormantDataModules.push(modPath);
      return;
    }

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

  // imp-2746: report dormant DATA_MODULES entries after sweep
  if (dormantDataModules.length > 0) {
    log('');
    log('## Dormant DATA_MODULES (no *_ASSERTIONS exported): ' + dormantDataModules.length);
    for (const m of dormantDataModules) {
      log('  DORMANT: ' + m);
    }
  }

  await finalize({ passed, failed, loadErrors, failures, lines, startMs }, server, pool);
}

// imp-1193: shared end-of-sweep handler used by both the cold-start and the
// pool-delegate paths. `server` is optional (the pool path does not own one);
// `pool` is non-null only on the --ssr-pool=N path.
async function finalize(state, server, pool) {
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
    const assertFails = failed - loadErrors;
    if (assertFails === 0) {
      console.error('\nASSERTION SWEEP CRASHED: ' + loadErrors + ' load errors, 0 assertion failures');
    } else {
      const errSuffix = loadErrors > 0 ? ' + ' + loadErrors + ' load errors' : '';
      console.error('\nASSERTION SWEEP FAILED: ' + assertFails + ' assertion failures' + errSuffix);
    }
    process.exit(1);
  } else {
    console.log('\nAll assertions pass.');
    process.exit(0);
  }
}

// ── imp-2745 fail-injection self-test ─────────────────────────────────────────
// `node scripts/run-assertions.mjs --fail-inject`
//
// Proves the assertion harness correctly handles holds()===false (and throws).
// Does NOT start Vite. Runs three synthetic assertions through the same inner
// evaluation loop used by processOne(), then asserts the counts are correct:
//   expected 2 failures (always-false + throws), 1 pass (always-true)
// Exits 0 on success (harness works), 1 if the harness missed a failure.
async function runFailInject() {
  const syntheticAssertions = [
    {
      id:    'fail-inject-always-false',
      why:   'synthetic: holds() always returns false',
      holds: () => false,
    },
    {
      id:    'fail-inject-throws',
      why:   'synthetic: holds() throws an error',
      holds: () => { throw new Error('injected error'); },
    },
    {
      id:    'fail-inject-always-true',
      why:   'synthetic: holds() always returns true',
      holds: () => true,
    },
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const a of syntheticAssertions) {
    let ok;
    try { ok = a.holds(); } catch (e) {
      ok = false;
      a._err = e.message;
    }
    if (ok) {
      passed++;
    } else {
      failed++;
      failures.push({ id: a.id, why: (a.why || a._err || '').slice(0, 100) });
    }
  }

  const EXPECTED_FAILED = 2;
  const EXPECTED_PASSED = 1;

  if (failed === EXPECTED_FAILED && passed === EXPECTED_PASSED) {
    console.log('FAIL_INJECT: pass — harness correctly caught ' + failed +
                ' failing assertions and passed ' + passed);
    console.log('  caught: ' + failures.map((f) => f.id).join(', '));
    process.exit(0);
  } else {
    console.error('FAIL_INJECT: FAIL — expected failed=' + EXPECTED_FAILED +
                  ' passed=' + EXPECTED_PASSED +
                  ', got failed=' + failed + ' passed=' + passed);
    process.exit(1);
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
