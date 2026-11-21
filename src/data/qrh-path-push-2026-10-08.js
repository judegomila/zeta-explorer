/**
 * @fileoverview qrh-path-push-2026-10-08 — push along the 7/8 (quasi-Riemann hypothesis) path, 2026-10-07: (1) re-tuning of
 * the route-P single-band consumer on the lower barrier path that the openai/math family-003 start q0 = 9/16 + ε produces,
 * with one adversarial internal referee pass (not refuted, minor; corrections R1–R5 applied here); (2) two internal
 * deep-review passes of Raymond's analytic chain G0 under the 7/8 start (part A: AF Part I §§2–5 + main-paper Lemma 2,
 * Lemma 3, Theorem 4/4′; part B: AF Part I §§6–12 + Part II). Parent record: src/data/openai-math-integration-2026-10-08.js.
 *
 * PROVED (elementary, written, internal):
 *  - multi-band layouts cannot lower the single-band value when all bands start from the same zero-free start (band 1 =
 *    single band; q_MTY_upper(a1) ≥ 0.975109743635927 > 9/16 for a1 ≥ X);
 *  - X-option generator reduction (for 3r² ≥ 1 the self cap is the constant 2/(1+r²), so the largest admissible λ per
 *    (set, mode) dominates); dropping never-chosen option families cannot invalidate a value;
 *  - G0 part A: Lemma W (wall dephasing / Abel / model error; fixes GAP A1); G0 part B: Lemma S(θ) and Lemma FB(θ)
 *    (start, strict entry, first contact and terminal step for a general zero-free start; fixes GAP B1, B2).
 * CERTIFIED (exact rationals, relative to the route-P ledger, hence CONDITIONAL): F2 = 116091488672439/10^15
 *  = 0.116091488672439 (59,439 substeps, terminal cell 464, E1–E8 + S1 + generator agreement + F-X 0 failures; extended
 *  step verifier and the referee's from-scratch verifier both 0 failures; 79 new kernels and all 59 kernels used on F2
 *  re-certified by a second method; all 289 table cells used by X options re-certified at a different precision).
 * CONDITIONAL: every Λ value here — on the 003 half-plane (Lean-checked locally, not peer-reviewed), on Raymond's chain G0
 *  (internal passes only; no reader outside the project), on PT's RH verification to 3.0001753e12, and on the route-P
 *  ledger. None is a bound on Λ.
 * MEASURED: binding/sensitivity analyses, float-clone scenarios, height-feasibility scans, the v4c probe.
 * HEURISTIC: the r2-structured-floor port to the re-tuned heights (−1.85e-4 to −4.5e-4 in the float clone, not certified).
 *
 * No refereed bound is changed (accepted, peer-reviewed); RH is open; NO QED. Import-free. QRH_PATH_PUSH_ASSERTIONS recompute the
 * ladder, its sum, the 15-digit decimals, the strict-entry margin, the substep provenance partition and the G0 grade tables
 * in exact rationals / plain JS.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const norm = ([a, b]) => { if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b) || 1n; return [a / g, b / g]; };
const q = (x) => (Array.isArray(x) ? x : big(x));
const cmp = (x, y) => { const [a, b] = q(x), [c, d] = q(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const eq = (x, y) => cmp(x, y) === 0;
const sub = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d - c * b, b * d]); };
const add = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d + c * b, b * d]); };
const mul = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * c, b * d]); };
const dec15 = (x) => { const [a, b] = q(x); const n = a * 10n ** 15n; return n % b === 0n ? `0.${String(n / b).padStart(15, '0')}` : null; };
const num = (x) => { const [a, b] = q(x); return Number(a * 10n ** 18n / b) / 1e18; };
const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });

export const QRH_PATH_PUSH = Object.freeze({
  id: 'qrh-path-push-2026-10-08',
  date: '2026-10-08',
  title: 'Quasi-RH (7/8) path: route-P re-tune to a conditional Λ value 0.116091488672439, and two internal G0 review passes under the 7/8 start',
  status: 'done',
  parent: 'src/data/openai-math-integration-2026-10-08.js',
  headline: 'Conditional on the openai/math family-003 half-plane Re s > 7/8 (Lean-checked locally, not peer-reviewed), on Raymond\'s analytic chain G0 '
    + '(internal review only), on PT\'s RH verification to 3.0001753e12 and on the route-P ledger, re-tuning the route-P single-band consumer on the '
    + '7/8 path gives the certified conditional value Λ ≤ 116091488672439/10^15 = 0.116091488672439 (was 0.117708313410954; −1.616824738515e-3). '
    + 'Most of the gain (−1.201e-3, 74%) comes from Track-A floors at lowered heights in cells 0–250 with the route-3 λ<2 kernels at r = 3/5 applied there. '
    + 'Two internal G0 review passes (part A: AF §§2–5, Lemma 2, Lemma 3, Theorem 4/4′; part B: AF §§6–12, Part II) find no ERROR; their GAPs are expository and the fixes are written. '
    + 'This is a conditional value, not a bound. No refereed bound is changed; RH is open; NO QED.',

  values: Object.freeze({
    baseline: V('58854156705477/500000000000000', '0.117708313410954', 'CONDITIONAL (003, G0, PT, route-P ledger); reproduced exactly by the extended consumer (60,267 steps, 0 failures)', 'published route-P 7/8 single band, q0 = 9/16 + 2e-6'),
    E1: V('58854068553651/500000000000000', '0.117708137107302', 'CONDITIONAL; exact run, 0 failures', 'E1: start offset 2e-6 → 1e-7'),
    E2: V('23462447352327/200000000000000', '0.117312236761635', 'CONDITIONAL; exact run, 0 failures', 'E2: route-9 tables W4/m097/m094/m091 with r = 3/5 λ<2 kernels at their heights'),
    E3: V('116174796162911/1000000000000000', '0.116174796162911', 'CONDITIONAL; exact run, 0 failures', 'E3: new sets QA (0.88×PLAN, cells 0–140) + QB (0.91×PLAN, cells 0–199)'),
    E4: V('116110902986179/1000000000000000', '0.116110902986179', 'CONDITIONAL; exact run, 0 failures', 'E4: per-cell moment-cap set QC (0.860–0.903×PLAN, cells 0–250)'),
    F1: V('116091900099009/1000000000000000', '0.116091900099009', 'CONDITIONAL; exact run + extended verifier, 0 failures', 'F1: 79 new r = 3/5 kernels on X options'),
    F2: V('116091488672439/1000000000000000', '0.116091488672439', 'CONDITIONAL (003, G0, PT, route-P ledger); certified run, extended verifier and referee from-scratch verifier 0 failures; U_robust identical', 'F2 final: same kernels also on route-3 P-modes at PLAN heights'),
    raymond78: V('118505710922701/1000000000000000', '0.118505710922701', 'CONDITIONAL (003, G0, PT); from the parent module', 'Raymond chain alone, same 7/8 start'),
  }),
  ladder: Object.freeze([
    Object.freeze({ step: 'baseline → E1', lever: 'start offset 2e-6 → 1e-7', delta: '-44075913/250000000000000' }),
    Object.freeze({ step: 'E1 → E2', lever: 'route-9 tables + r = 3/5 λ<2 kernels at their heights', delta: '-395900345667/1000000000000000' }),
    Object.freeze({ step: 'E2 → E3', lever: 'QA (0.88×) + QB (0.91×) height sets', delta: '-284360149681/250000000000000' }),
    Object.freeze({ step: 'E3 → E4', lever: 'QC per-cell moment-cap heights', delta: '-15973294183/250000000000000' }),
    Object.freeze({ step: 'E4 → F1', lever: '79 new r = 3/5 kernels (X options)', delta: '-1900288717/100000000000000' }),
    Object.freeze({ step: 'F1 → F2', lever: 'same kernels on route-3 P-modes', delta: '-41142657/100000000000000' }),
  ]),
  totalGain: '-323364947703/200000000000000',
  attribution: Object.freeze({
    heights: Object.freeze({ delta: '-37541680483/31250000000000', share: 74.3, note: 'E3 + E4: QA/QB uniform sets −1.137e-3 (70.4%), QC per-cell moment-cap set −6.39e-5 (4.0%)' }),
    route9Tables: Object.freeze({ delta: '-395900345667/1000000000000000', share: 24.5 }),
    newKernels: Object.freeze({ delta: '-970715687/50000000000000', share: 1.2 }),
    startOffset: Object.freeze({ delta: '-44075913/250000000000000', share: 0.01 }),
  }),
  run: Object.freeze({
    steps: 59439, terminalCell: 464, terminalTime: '29719/256000', q0: '5625001/10000000', q0offset: '1/10000000',
    c0: '41336831094003950997/3755300000000000000', heights: Object.freeze(['91/100', '47/25']),
    provenance: Object.freeze({ xOptionsTrackA: 36923, r2Structured: 11304, route3Joint: 11212 }),
    xOptionsBySet: Object.freeze({ QC_cliff: 21504, m091: 5120, W4: 4027, QB_m0_91: 2816, QA_m0_88: 1664, m094: 1536, m097: 256 }),
    newKernelSubsteps: 37342,
    windowSubsteps: 0,
    runtimeSeconds: 639,
    checks: Object.freeze(['E1 ρ/spatial/sharp/recomputed v', 'E2 caps', 'E3 rate and cδ', 'E4 A18 enclosure', 'E5', 'E6 no early crossing, two log bounds, U < 41/250',
      'E7 heights ⊂ [1/2, 5/2]', 'E8 q0 > 9/16', 'S1 strict entry', 'generator A/B agreement', 'F-X floor re-read']),
    failures: 0,
    dumpFingerprint: 'sha256 1c546f5c… identifies one run only; re-runs differ only in id()-based labels of route-3 multi options (referee re-run dd196d3b…); every other field of all 59,439 records reproduces exactly',
  }),
  newSets: Object.freeze({
    QA_m0_88: Object.freeze({ cells: 141, usable: 136, failedCells: Object.freeze([126, 130, 136, 139, 140]), g0dChecks: 41512 }),
    QB_m0_91: Object.freeze({ cells: 200, usable: 200, failedCells: Object.freeze([]), g0dChecks: 60600 }),
    QC_cliff: Object.freeze({ cells: 251, usable: 251, failedCells: Object.freeze([]), g0dChecks: 76053, maxMomentC: 3.378 }),
    X1_m0_91: Object.freeze({ g0dChecks: 111959, note: 'route-9 set, never refereed before this pass' }),
    rederive: 'QA/QB/QC TABLES and TABLES_BASE re-derived byte-identically from archived PROBE files under python 3.14 / flint 0.9.0 (produced under 3.13 / 0.8.0)',
    refereeRecert: '289 (set, cell) pairs used by X options re-certified at 224/320-bit lanes and divisions 600/1000 (published 192/256, 400/800): all usable; all 3,179 mode floors +1.9e-4 to +4.2e-4 above the published values, none lower',
  }),
  newKernels: Object.freeze({ count: 79, r: '3/5', rhoFrom: '81/400', rhoTo: '171/400', rhoStep: '1/400', existingGridPoints: 12, bernsteinDepth: 22, h2MinRatio: 943,
    refereeSecondMethod: 'tmp/qrh-ref-kcert.py (Arb, adaptive bisection, no shared code with the Bernstein certifier): 79/79 PASS at 64 bits (549,302 boxes); 59/59 kernels used on F2 PASS at 128 bits (425,359 boxes); controls above the certified λ fail' }),

  proved: Object.freeze([
    'Multi-band layouts cannot lower the single-band value when every band starts from the same zero-free start: a Lemma-B layout returns the max over bands; band 1 = [X, a1] uses the same floors and q0 as the single band; q_MTY_upper(a1) ≥ 0.975109743635927 > 9/16 for every a1 ≥ X (256-bit, increasing; checked at X, 9.0e12, 9.9e12, 1.56e13, 1e14). Elementary, given no floor valid only on a bounded x-range.',
    'X-option generator reduction: for 3r² ≥ 1 the self cap is the constant 2/(1+r²); on fixed (set, cell, mode) the rate 2λ/h·(ell − cap/h) increases in λ; X options carry no q-window, so the largest admissible λ per (set, mode) leaves the first-admissible-by-rate choice unchanged.',
    'Dropping never-chosen option families (tab_A, tab_B, tab_cat8; none of their 233 modes chosen in the baseline) cannot invalidate a value: any admissible choice sequence gives a valid conditional value.',
  ]),
  certified: Object.freeze([
    'F2 = U = U_robust = 116091488672439/10^15 = 0.116091488672439, exact consumer tmp/qrh-tune-consume.py, all checks 0 failures, 59,439 substeps, terminal cell 464, q0 = 9/16 + 1/10^7, strict-entry margin 1.808e-8.',
    'Reproduced three ways (referee): extended verifier on the archived dump; from-scratch verifier tmp/qrh-ref-verify.py (no shared code); consumer re-run (653 s) + from-scratch verifier on the new dump. Provenance exactly as claimed.',
    'Regression: the extended consumer reproduces the published 0.117708313410954 exactly (60,267 steps, 0 failures, strict-entry margin 1.922e-6).',
    'Exact lever ladder (one run per rung; the final value comes from one run, not from summed gains).',
    '79 new two-point kernels at r = 3/5 (exact Bernstein, depth 22, first attempt, λ = floor_{1/5000}(scout) − 1/5000); second-method re-certification by the referee.',
    'New height tables QA/QB/QC (two Arb lanes 192/256 bit): G0-d family referee 0 failures (QA 41,512; QB 60,600; QC 76,053; route-9 X1_m0.91 111,959); referee re-certification of all 289 used cells at a different precision.',
  ]),
  conditional: Object.freeze([
    'Every Λ value here: on the 003 half-plane (Lean-checked locally; official comparator and lean4checker not run; not peer-reviewed), on G0 (parts A and B below are internal; G0-c has no reader outside the project), and on PT\'s RH verification to 3.0001753e12 (RH-head caveat).',
    'Route-P ledger items used on F2: r2 structured floors on 11,304 substeps (κ=0.94 r_19_40 and r_49_100 P47 floors in cells 228–320, κ=1 r_49_100 in cells 380–400; WOL-C outer lemma via wol-pd/r5/v4c certificates, r2-floors-base, measured 0.0023 time-box allowance, and the r2 L-slope lemma for uniformity in x, not reviewed); route-3 joint P-mode floors on 11,212 substeps (Theorem MP = Raymond Lemma 3 + Track A gains, Track A Lemma R, G0-a); Track-A joint floors at re-tuned heights on 36,923 substeps (producer layer, route-9 multi-height licence).',
    'X options (λ<2 kernels at non-PLAN heights) rest on: exact scaling K_ch(cx,cb) = K_h(x,b)/c; the kernel certificate for all real d, 0<y≤ρ, 0≤b≤y; the constant self cap 2/(1+r²) = 25/17 for 3r² ≥ 1; the Track-A joint floor of mode r_3_5 at the set\'s height under the multi-height licence. Not externally refereed.',
    'Single-implementation remainder: the joint-pair and Track-A gain code, and the 275 route-3 kernels not used on F2. The 79 new kernels, the 59 used on F2 and the 289 used table cells now have a second, independent check.',
    'G0 part A recommended rechecking (5.4), k > 0 and h·v0 > 2 at re-planned heights (its table was computed on PLAN only). Done 2026-10-07 (premiseRecheck below): all 468 (cell, height, source) triples used on F2 pass in 256-bit Arb, so no option is excluded and F2 is unchanged.',
  ]),
  measured: Object.freeze([
    'Binding on the published path: sensitivity sum 3.917e-3 per unit rate; per-cell floor sensitivity ≈ 2.6e-5 per unit floor over cells 0–300; cells 0–229 carry 66.8% of the weight, cells 430–470 1.2%.',
    'Binding on F2: cells 0–250 carry 72.5% of the weight, almost all through QC r = 3/5 X options.',
    'Height feasibility set by Raymond\'s producer moment cap C < 17/5 (exceptional labels m·n < e^{2C} in the head n ≤ 1024): ×0.84 fails in every scanned cell; per-cell limit 0.860–0.903×PLAN (median 0.878); F2 schedule ×0.870 (cells 0–140), ×0.904 (141–250), ×0.951 (251–330), ×0.988 (331–464).',
    'Float clone tmp/qrh-tune-fast.py agrees with the exact consumer to 1.2e-14; synthetic height tests give no further lever (QC + 1/200: −6.7e-9; ×0.925 in cells 240–340: 0; large-r P-modes at ×0.97: −2.5e-7).',
    'Tighter WOL-C/r2 certificates: best single uncertified target ≈ 3.2e-6 to first order (an estimate, not a bound); the 349 positive-value candidates ≈ 4.6e-4 to first order; tightening all 261 certified P47 floors to m = 0.01 gives −4.0e-5 (float, hypothetical).',
    'v4c probe on 393|1|r_3_5: 21 min, still in the unseeded 960-box initial phase, no certificate; completed campaign floors average 9,233 s wall.',
  ]),
  heuristic: Object.freeze([
    'Largest open lever: port the r2 structured-floor pipeline (inner K0* + WOL-C) to the QC/QB heights in cells 0–250, mode r_3_5; uniform +0.03/+0.05/+0.07 floor raises give −1.85e-4/−3.15e-4/−4.5e-4 in the float clone. Not certified.',
    'Going below the moment-cap limit needs a larger producer head (HEAD = 1024 → C < 17/5): an AF/G0 premise, out of scope.',
    'Raymond could re-tune a single height plan too; the multi-height menu and the λ<2 kernels are route-P additions.',
  ]),
  refereeCorrections: Object.freeze([
    'R1: gain attribution — heights give −1.201333775456e-3 (74.3%): QA+QB uniform 0.88×/0.91× −1.137e-3 (70.4%), QC per-cell moment-cap set −6.39e-5 (4.0%); route-9 tables 24.5%; 79 new kernels 1.2%. The draft\'s "almost all from the moment-cap limit" overstated QC.',
    'R2: "worth at most 3.2e-6 per floor" relabelled as a first-order estimate for the best single target, not an upper bound; all 349 candidates ≈ 4.6e-4 to first order.',
    'R3: Lemma H2 is not an input of single-band X options (H2 is listed under routePNotNeeded); the four actual inputs are listed in `conditional`. H2 holds for all 79 kernels anyway (min ratio 943).',
    'R4: dump sha256 1c546f5c… is not reproducible across re-runs (id()-based labels of route-3 multi options); a canonical fingerprint must exclude the multi-option "lab" field.',
    'R5: ledger update — the 79 new kernels and all 59 kernels used on F2 are independently re-certified, and all 289 used table cells re-certified at a different precision; joint-pair / Track-A gain code and the other 275 route-3 kernels remain single-implementation.',
  ]),

  g0Review: Object.freeze({
    scope: 'Internal deep review of Raymond\'s chain (Zenodo 22867547) under the 7/8 start; two passes written 2026-10-07/08. No reader outside the project. Moves no Λ value.',
    A: Object.freeze({
      file: 'formalization/paper/raymond-g0-review-a-2026-10-08.md',
      covers: 'AF Part I §§2–5; main-paper eq. (1), Lemma 2, eq. (3), Lemma 3, eq. (5), eqs. (6)–(9), Theorem 4, eqs. (11)–(15); Theorem 4′',
      outcome: 'No ERROR. GAPs expository: 2a, 3a, 3b (known), A1 (wall ideal model undefined; fixed by Lemma W), A2 (eq. (1) not derived in the deposit; written in the Theorem 4′ doc), A3 (uniformity bookkeeping; table supplied). Start-only swap VALID, CONDITIONAL on 003. Uniformity in x ≥ X−2 SOUND. RH below X used once (PT at t = 0, clearance 175,239,886).',
      grades: Object.freeze([
        Object.freeze({ section: 'AF §2 classical framework, PT clearance', grade: 'SOUND' }),
        Object.freeze({ section: 'AF §2 head localisation', grade: 'SOUND; GAP 2a (fixed in Lemma B.3)' }),
        Object.freeze({ section: 'AF §3 prefix certificate (3.1), time radius', grade: 'SOUND' }),
        Object.freeze({ section: 'AF §3 ideal model, dephasing, Abel transfer', grade: 'SOUND; GAP A1/3b (fixed by Lemma W)' }),
        Object.freeze({ section: 'AF §3 error budget, P15 Thm 1.3, floor > 3/4', grade: 'SOUND; GAPs 3a, 3b' }),
        Object.freeze({ section: 'AF §4.1 remainder for σ ∈ [−1, 2]', grade: 'SOUND' }),
        Object.freeze({ section: 'AF §4.2 (4.6), (4.7)', grade: 'SOUND' }),
        Object.freeze({ section: 'AF §5 (5.1)–(5.6)', grade: 'SOUND; GAP A3 (uniformity bookkeeping)' }),
        Object.freeze({ section: 'main eq. (1)', grade: 'SOUND; GAP A2 (written in Theorem 4′ doc)' }),
        Object.freeze({ section: 'main Lemma 2, eq. (3)', grade: 'SOUND' }),
        Object.freeze({ section: 'main Lemma 3, eq. (5)', grade: 'SOUND' }),
        Object.freeze({ section: 'main eqs. (6)–(9), Theorem 4', grade: 'SOUND' }),
        Object.freeze({ section: 'main eqs. (11)–(13)', grade: 'SOUND (uses Lemma CG, G0-a)' }),
        Object.freeze({ section: 'main eqs. (14)–(15) self-pair algebra', grade: 'SOUND' }),
        Object.freeze({ section: 'Theorem 4′ (Track A bins, Lemma R)', grade: 'SOUND' }),
        Object.freeze({ section: 'time-zero strip, 7/8 start', grade: 'VALID, CONDITIONAL on 003' }),
        Object.freeze({ section: 'uniformity in x ≥ X − 2', grade: 'SOUND' }),
        Object.freeze({ section: 'RH below X', grade: 'PT only, once' }),
      ]),
      certified: 'S1 entry margins (exact): 7/8 1.922651e-6, 11/12 1.909496e-6, strip 1.879268e-6; identical to part B\'s independently coded entry.py',
    }),
    B: Object.freeze({
      file: 'formalization/paper/raymond-g0-review-b-2026-10-08.md',
      covers: 'AF Part I §§6–12 and Part II under q0 = 9/16 + 2e-6',
      outcome: 'No ERROR. GAP B1 (start written only for q0 > 1; fixed by Lemma S(θ)), GAP B2 (first contact and final barrier lemma compressed; written as Lemma FB(θ)), latent GAP B3 (route P only: q-window floors need the stored-barrier form; 0 window substeps on every current value, including F2), B4/B5 record and code notes. Part II is not a premise of the 7/8 values (sharp kernel on 0 substeps).',
      grades: Object.freeze([
        Object.freeze({ section: '§6 identity (6.1), cone lemma', grade: 'SOUND' }),
        Object.freeze({ section: '§6 product head ≥ 0, (6.3), Q_y = −V/2', grade: 'SOUND' }),
        Object.freeze({ section: '§6/§9 exceptional pairs', grade: 'SOUND' }),
        Object.freeze({ section: '§7 time variation, block enclosures', grade: 'SOUND' }),
        Object.freeze({ section: '§8 activation (incl. t = 0)', grade: 'SOUND' }),
        Object.freeze({ section: '§9 assembly, (9.1), E_ℓ cap, (9.2)', grade: 'SOUND' }),
        Object.freeze({ section: '§10 kernels (10.1)', grade: 'SOUND; 13/13 certified (own code)' }),
        Object.freeze({ section: '§10 self caps M_r, M_{r,V}', grade: 'SOUND; caps exact' }),
        Object.freeze({ section: '§11 zero dynamics, (11.1), selection', grade: 'SOUND' }),
        Object.freeze({ section: '§11 ideal barrier, knots', grade: 'SOUND (route-P windows: latent GAP B3)' }),
        Object.freeze({ section: '§11 start, strict entry', grade: 'GAP B1 (fixed by Lemma S(θ)); substance sound, CONDITIONAL on 003' }),
        Object.freeze({ section: '§11 compactness, Hermite splitting, contact', grade: 'GAP B2 (written in Lemma FB); substance sound' }),
        Object.freeze({ section: '§12 exponential and log enclosures, terminal, q_e/2', grade: 'SOUND' }),
        Object.freeze({ section: 'final barrier lemma (main §7 + §11 + AF §12)', grade: 'GAP B2 (written as Lemma FB(θ))' }),
        Object.freeze({ section: 'Part II Thm 1, self pair, §4 coupling', grade: 'SOUND; unused on the 7/8 paths' }),
        Object.freeze({ section: 'Part II Thm 2, §7', grade: 'SOUND as stated; not premises' }),
      ]),
      certified: 'Own exact replay of AF §§10–12: 7/8 0.118505710922701 (alt log 0.118505710922702), 11/12 0.129826438865344, strip 0.149395073827688, bit-identical to the two existing implementations; tightest admissibility margin 3.793e-6; 13/13 catalogue kernels + 5/5 route-3 rows certified with own Bernstein code.',
    }),
    remaining: 'G0-c (main-paper joint-floor lemmas) has no reader outside the project; Lemma W, Lemma S(θ), Lemma FB(θ), the uniformity table and the eq. (1) derivation need a non-project referee (G0-e); route P\'s r2 L-slope lemma is not reviewed.',
  }),

  premiseRecheck: Object.freeze({
    scope: 'Recheck of Raymond\'s per-row source premises on every (cell, height) actually used on F2: (5.4) e_AB + e_C^broad + e_pair < 1e-6, k = t_L·v0/2 − (1 − h)/2 > 0 and h·v0 > 2 (also (5.1), (4.3), (5.6), (t_L·v0/2 + h)·v0 > 2, (1 + h)/2 > 1/v0 and the time-radius line). '
      + 'Definitions: Raymond\'s producer tmp/s145-1-g1/code/certify_coupled_probe.py (identical arithmetic in tmp/b145-B-ccp.py, which produced the QA/QB/QC tables; it already asserts these per cell and skips failed cells) and review part A §5/§8, C4.',
    grade: 'CERTIFIED (outward-rounded, python-flint Arb 256 bit; margins are lower ball endpoints); evaluated at the producer anchor x = X − 4, every term nonincreasing in x (part A §8), re-evaluated at x = 10X, 1e16, 1e20: 0 violations',
    method: 'tmp/qrh-recheck-extract.py reads tmp/qrh-tune-out/F2_final.steps.jsonl.gz (substep n → cell ⌊n/128⌋, height h of the chosen option); tmp/qrh-recheck-premises.py checks each triple. Output tmp/qrh-recheck-out/{used_cells.json, premises.json}.',
    substeps: 59439, triples: 468, cellHeightPairs: 466, cells: '0–464', failures: 0, monotoneViolations: 0, verdict: 'PASS',
    sources: Object.freeze(['X options: QC_cliff, QB_m0.91, QA_m0.88, W4, m091, m094, m097 (Track-A tables at re-tuned heights)', 'r2 structured floors κ = 0.94 and κ = 1 (B:cat)', 'route-3 joint P-modes at PLAN heights (P_27_40, P_3_5, P_13_20, P_5_8, P_51_80)']),
    heights: Object.freeze(['91/100', '47/25']),
    minima: Object.freeze({
      k: Object.freeze({ value: 0.4391807347170579, cell: 1, h: '15/8', src: 'X:QC_cliff:r_3_5' }),
      hv0: Object.freeze({ value: 12.235748740181311, cell: 464, h: '91/100', src: 'route3:P_27_40' }),
      margin54: Object.freeze({ value: 8.500610155022008e-7, maxSum: 1.4993898449779916e-7, cell: 319, h: '2773/2500', src: 'B:cat κ = 0.94' }),
      margin51: Object.freeze({ value: 0.06767719630504193, cell: 319, h: '2773/2500' }),
      cv0: Object.freeze({ value: 22.12323375592818, cell: 319, h: '2773/2500' }),
    }),
    plans: Object.freeze({ note: 'every row (cells 0–464) of each height plan read by F2, used or not', PLAN: 'PASS (min k 0.588361 = part A C4)', W4: 'PASS', m097: 'PASS', m094: 'PASS', m091: 'PASS (min k 0.488361)',
      QA_m0_88: 'PASS (141 rows, min k 0.455861)', QB_m0_91: 'PASS (200 rows)', QC_cliff: 'PASS (251 rows, min k 0.439181)' }),
    lambdaChange: 'none: no option fails, so no re-run with options excluded is needed; F2 = 0.116091488672439 stands (CONDITIONAL as before)',
  }),

  files: Object.freeze(['tmp/qrh-tune-out/summary.json', 'tmp/qrh-tune-consume.py', 'tmp/qrh-tune-verify.py', 'tmp/qrh-tune-final.sh', 'tmp/qrh-tune-ladder.sh',
    'tmp/qrh-tune-out/F2_final.json', 'tmp/qrh-tune-out/F2_final_verify.json', 'tmp/qrh-tune-out/F2_final.steps.jsonl.gz', 'tmp/qrh-tune-out/xkernels_final.json',
    'tmp/qrh-tune-out/lever3_targets.json', 'tmp/qrh-ref-out/', 'tmp/qrh-ref-verify.py', 'tmp/qrh-ref-kcert.py', 'tmp/qrh-ref-tables.py',
    'tmp/qrh-recheck-extract.py', 'tmp/qrh-recheck-premises.py', 'tmp/qrh-recheck-out/premises.json', 'tmp/route1-campaign-78/',
    'formalization/paper/raymond-g0-review-a-2026-10-08.md', 'formalization/paper/raymond-g0-review-b-2026-10-08.md', 'formalization/paper/lambda-qrh-note-draft.md']),
  reproduce: 'tmp/qrh-tune-final.sh with XK=KK=tmp/qrh-tune-out/xkernels_final.json, start offset 1/10000000, sets W4 m097 m094 m091 QA_m0.88 QB_m0.91 QC_cliff (≈ 11 min) then tmp/qrh-tune-verify.py (≈ 1 min); independent: tmp/qrh-ref-verify.py',
  nextSteps: Object.freeze([
    '1. Non-project referee (G0-e) for the merged chain write-up: Lemma W, Lemma S(θ), Lemma FB(θ), uniformity table, eq. (1) derivation, plus G0-c.',
    '2. Done: (5.4), k > 0 and h·v0 > 2 rechecked on every height used on F2 (premiseRecheck: PASS, min k 0.439, min h·v0 12.24, max (5.4) sum 1.50e-7).',
    '3. Port the r2 structured-floor pipeline to QC/QB heights in cells 0–250, mode r_3_5 (heuristic −1.9e-4 to −4.5e-4).',
    '4. Queued: 125 of the 130 7/8-path targets run in a second campaign tmp/route1-campaign-78 (campaign78.py, max 4 workers, starts only after the main campaign has no eligible floors and load < 25); the other 5 (330–334|1|r_23_40) have no batch_P47 entry and are held (held78.json).',
    '5. Canonical dump fingerprint excluding the multi-option "lab" field.',
  ]),
  verdict: 'Conditional on the 003 half-plane (Lean-checked locally, not peer-reviewed), on G0 (two internal review passes: no ERROR, expository GAPs with written fixes; no external reader), on PT\'s RH verification and on the route-P ledger, '
    + 'the re-tuned route-P single-band 7/8 path gives the certified conditional value 116091488672439/10^15 = 0.116091488672439 (−1.616824738515e-3 against 0.117708313410954; '
    + '0.002414222250262 below Raymond\'s chain with the same start). Adversarial internal referee: not refuted, minor; corrections R1–R5 applied. '
    + 'This is a conditional value, not a bound. No refereed bound is changed; RH is open; NO QED.',
});

const C = QRH_PATH_PUSH;
const v = (k) => C.values[k].exact;
const sumObj = (o) => Object.values(o).reduce((a, b) => a + b, 0);

export const QRH_PATH_PUSH_ASSERTIONS = Object.freeze([
  {
    id: 'qrh-ladder-exact',
    holds: () => {
      const rungs = ['baseline', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2'];
      const stepsOk = C.ladder.every((s, i) => eq(sub(v(rungs[i + 1]), v(rungs[i])), s.delta) && lt(s.delta, '0'));
      const total = C.ladder.reduce((acc, s) => add(acc, s.delta), '0');
      return C.ladder.length === 6 && stepsOk && eq(total, C.totalGain) && eq(sub(v('F2'), v('baseline')), C.totalGain)
        && Math.abs(num(C.totalGain) + 1.616824738515e-3) < 1e-15;
    },
    why: 'Each rung difference equals the recorded exact step; the six steps sum to −323364947703/(2·10^14) = F2 − baseline; every lever is negative.',
  },
  {
    id: 'qrh-decimals-exact',
    holds: () => Object.values(C.values).every((x) => dec15(x.exact) === x.dec),
    why: 'Every stated 15-digit decimal is the exact expansion of its rational.',
  },
  {
    id: 'qrh-attribution',
    holds: () => {
      const a = C.attribution; const T = num(C.totalGain);
      const parts = [a.heights, a.route9Tables, a.newKernels, a.startOffset];
      return eq(a.heights.delta, add(C.ladder[2].delta, C.ladder[3].delta)) && eq(a.newKernels.delta, add(C.ladder[4].delta, C.ladder[5].delta))
        && eq(parts.reduce((acc, p) => add(acc, p.delta), '0'), C.totalGain)
        && parts.every((p) => Math.abs(100 * num(p.delta) / T - p.share) < 0.06)
        && num(C.ladder[3].delta) / T < 0.05;
    },
    why: 'Referee R1: heights (E3+E4) = −1.201333775456e-3 = 74.3%, route-9 tables 24.5%, new kernels 1.2%, start offset 0.01%; the QC moment-cap set alone is < 5% of the gain.',
  },
  {
    id: 'qrh-strict-entry',
    holds: () => {
      const r = C.run; const m = sub(sub(r.q0, mul(add('2', mul(r.c0, r.q0)), '1/100000000')), '9/16');
      return eq(r.q0, add('9/16', r.q0offset)) && lt('0', m) && Math.abs(num(m) - 1.8082252751949694e-8) < 1e-15 && lt(m, r.q0offset);
    },
    why: 'q0 = 9/16 + 1e-7 and q0 − (2 + c0·q0)·1e-8 − 9/16 = 1.8082e-8 > 0 exactly with c0 ≈ 11.0076.',
  },
  {
    id: 'qrh-provenance-partition',
    holds: () => sumObj(C.run.provenance) === C.run.steps && sumObj(C.run.xOptionsBySet) === C.run.provenance.xOptionsTrackA
      && C.run.failures === 0 && C.run.windowSubsteps === 0 && C.run.steps < 60267
      && C.newSets.QA_m0_88.usable === C.newSets.QA_m0_88.cells - C.newSets.QA_m0_88.failedCells.length
      && C.newSets.QC_cliff.maxMomentC < 17 / 5 && C.newKernels.count === 79
      && eq(add(C.newKernels.rhoFrom, mul(String(C.newKernels.count + C.newKernels.existingGridPoints - 1), C.newKernels.rhoStep)), C.newKernels.rhoTo),
    why: '36,923 + 11,304 + 11,212 = 59,439 substeps; X options by set sum to 36,923; 0 failures; 0 q-window substeps (GAP B3 not exercised); QA 141 − 5 = 136 usable; QC max C 3.378 < 17/5; ρ grid 81/400…171/400 has 91 points (79 new + 12 existing).',
  },
  {
    id: 'qrh-g0-grades',
    holds: () => {
      const all = [...C.g0Review.A.grades, ...C.g0Review.B.grades];
      return all.length === 34 && !all.some((g) => /ERROR/.test(g.grade))
        && C.g0Review.B.grades.filter((g) => /GAP B[12]/.test(g.grade)).length === 3
        && C.g0Review.A.grades.some((g) => /CONDITIONAL on 003/.test(g.grade)) && C.g0Review.B.grades.some((g) => /CONDITIONAL on 003/.test(g.grade))
        && /No ERROR/.test(C.g0Review.A.outcome) && /No ERROR/.test(C.g0Review.B.outcome) && /no reader outside the project/.test(C.g0Review.remaining);
    },
    why: 'Parts A (18 rows) and B (16 rows) grade no item ERROR; B1/B2 are the only non-latent GAPs in part B; the start swap is graded CONDITIONAL on 003 in both; G0-c still has no external reader.',
  },
  {
    id: 'qrh-margins',
    holds: () => eq(sub(v('raymond78'), v('F2')), '2414222250262/1000000000000000') && lt(v('F2'), v('baseline')) && lt(v('baseline'), v('raymond78'))
      && lt('1/10', v('F2')) && lt(v('F2'), '1/5'),
    why: 'F2 lies 0.002414222250262 below Raymond\'s chain with the same start; 0.1 < F2 < 0.2.',
  },
  {
    id: 'qrh-premise-recheck',
    holds: () => {
      const R = C.premiseRecheck; const m = R.minima;
      const X = 6000000185827, N0 = 690988, v0 = Math.log(N0), Lm = Math.log((X - 4) / (4 * Math.PI));
      const k = (cell, h) => (cell / 4000) * v0 / 2 - (1 - h) / 2;
      const e54 = (cell, h) => { const hf = h - 0.01, tt = cell / 4000, tR = (cell + 1) / 4000;
        const eC = 4 * Math.exp(-(1 + hf) * Lm / 4 - tt * Lm * Lm / 16 + 0.1); const pair = 3 * Math.exp(-(1 + hf) * v0 / 2 - tt * v0 * v0 / 4 + 1e-5);
        const raw = (tR * tR * (Lm / 2 + 1) ** 2 / 8 + tR / 4 + 1 / 6) / ((X - 4) / 2 - 3.33); return eC + pair + 18 * Math.expm1(raw); };
      return R.verdict === 'PASS' && R.failures === 0 && R.monotoneViolations === 0 && R.substeps === C.run.steps
        && Math.abs(k(m.k.cell, num(m.k.h)) - m.k.value) < 1e-12 && m.k.value > 0
        && Math.abs(num(m.hv0.h) * v0 - m.hv0.value) < 1e-11 && m.hv0.value > 2
        && Math.abs(e54(m.margin54.cell, num(m.margin54.h)) / m.margin54.maxSum - 1) < 1e-9 && m.margin54.maxSum < 1e-6
        && Math.abs(1e-6 - m.margin54.maxSum - m.margin54.value) < 1e-15
        && Math.abs((m.margin54.cell / 4000 * v0 / 2 + num(m.margin54.h)) * v0 - m.cv0.value) < 1e-11 && m.cv0.value > 2
        && m.margin51.value > 0 && C.run.heights.every((h) => num(h) >= num(R.heights[0]) && num(h) <= num(R.heights[1]))
        && /none/.test(R.lambdaChange) && Object.values(R.plans).slice(1).every((x) => /^PASS/.test(x));
    },
    why: 'Every (cell, height) used on F2 (59,439 substeps, 468 triples) passes (5.4), k > 0 and h·v0 > 2 in Arb; the recorded minima recompute in plain JS doubles (k = 0.43918 at cell 1, h = 15/8; h·v0 = 12.236 at cell 464, h = 91/100; (5.4) sum 1.499e-7 at cell 319, h = 2773/2500); no option excluded, F2 unchanged.',
  },
  {
    id: 'qrh-honest-scope',
    holds: () => /refereed bound is changed/i.test(C.verdict) && /NO QED/.test(C.verdict) && /not a bound/.test(C.verdict) && /not peer-reviewed/.test(C.verdict)
      && /refereed bound is changed/i.test(C.headline) && /NO QED/.test(C.headline)
      && Object.values(C.values).every((x) => /CONDITIONAL/.test(x.grade)) && C.refereeCorrections.length === 5
      && /first-order estimate/.test(C.refereeCorrections[1]) && /not an upper bound/.test(C.refereeCorrections[1]) && /not an input/.test(C.refereeCorrections[2]),
    why: 'Every Λ value is CONDITIONAL; verdict and headline say not a bound, no refereed bound is changed, no QED; referee corrections R1–R5 recorded (R2: first-order estimate, not a bound; R3: H2 not an input).',
  },
]);

export default QRH_PATH_PUSH;
