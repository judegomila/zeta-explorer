/**
 * @fileoverview openai-math-integration-2026-10-08 — integration record for the openai/math release (github.com/openai/math,
 * 2026-10-06; 722 manuscripts written by an internal OpenAI model; the release README states that unformalized results may
 * contain errors). Three workflow strands, 2026-10-07: (A) local Lean check of family 003 (quasi-Riemann hypothesis, ζ ≠ 0 for
 * Re s > 7/8); (B) Λ values with the 003 half-plane as the time-zero start of Raymond's decreasing-barrier chain and of the
 * route-P consumer, plus one adversarial internal referee pass (not refuted, minor; corrections P1–P7 applied here);
 * (C) survey of the release against the project's routes and site statements (formalization/external/openai-math-survey.md).
 *
 * VERIFIED (locally, 2026-10-07; formalization/external/openai-math-qrh-verification.md):
 *  - `lake build +OAI.NumberTheory.DirichletL.Nonvanishing` on Lean 4.34.1 / Mathlib d13f23b7 with the release-pinned
 *    dependencies: Build completed successfully (7061 jobs), 2924 / 2924 OAI modules of the import closure built, 0 errors,
 *    0 sorry warnings. `#print axioms` on OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re and on
 *    OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re: [propext, Classical.choice, Quot.sound]. Statement equal
 *    (raw Expr, up to one auto-generated binder name) to the comparator challenge elaborated against Mathlib alone;
 *    `riemannZeta` is Mathlib's own definition. Source scan of the closure (486,490 lines): no sorry / admit / axiom /
 *    native_decide / unsafe / implemented_by / extern / set_option.
 *  - Not done: the official comparator run (needs Linux landrun + lean4export), an independent kernel re-check (lean4checker /
 *    nanoda), the HeckeSevenEighths and SiegelZeros statements, any refereeing of the papers. Trust rests on the Lean 4.34.1
 *    kernel, Mathlib's definitions and the build toolchain.
 * CONDITIONAL (every Λ value in this module): the 003 half-plane (Lean-checked as above, not peer-reviewed); Raymond's analytic
 *  chain G0 (no reader outside the project; AF §§2–5, §§10–12 and Part II not independently refereed); PT's RH verification to
 *  3.0001753e12; for route-P values additionally the route-P ledger in single-band mode (list in `routePConditions`; single
 *  implementation, internal referee). None of these values is a bound on Λ; each is a conditional value.
 * MEASURED: heights other than PT (hypothetical or wall-less), the height-scan proxy, the equivalent-strip-height fits.
 *
 * No refereed bound is changed (accepted, peer-reviewed); RH is open; NO QED. Import-free. OPENAI_MATH_INTEGRATION_ASSERTIONS recompute
 * the de Bruijn half-plane values, the start-above-bound checks, the decimal expansions, the decomposition differences and the
 * substep partitions live in exact rationals.
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const norm = ([a, b]) => { const g = gcd(a, b) || 1n; return [a / g, b / g]; };
const q = (x) => (Array.isArray(x) ? x : big(x));
const cmp = (x, y) => { const [a, b] = q(x), [c, d] = q(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0;
const sub = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d - c * b, b * d]); };
const add = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * d + c * b, b * d]); };
const mul = (x, y) => { const [a, b] = q(x), [c, d] = q(y); return norm([a * c, b * d]); };
const eq = (x, y) => cmp(x, y) === 0;
const dec15 = (x) => { const [a, b] = q(x); const n = a * 10n ** 15n; return n % b === 0n ? `0.${String(n / b).padStart(15, '0')}` : null; };
const num = (x) => { const [a, b] = q(x); return Number(a * 10n ** 18n / b) / 1e18; };
const V = (exact, dec, grade, label) => Object.freeze({ exact, dec, grade, label });

// half-plane Re s > θ  ⇒  every zero of H_0 has |Im z| ≤ 2θ − 1 (z = 2γ − i(2β − 1)); de Bruijn: Λ ≤ (2θ − 1)²/2
const qBound = (theta) => { const t = sub(mul('2', theta), '1'); return mul(t, t); };
const deBruijn = (theta) => mul(qBound(theta), '1/2');

export const OPENAI_MATH_INTEGRATION = Object.freeze({
  id: 'openai-math-integration-2026-10-08',
  date: '2026-10-08',
  title: 'openai/math (2026-10-06) integration: family 003 Lean proof re-built locally; conditional Λ values with the 7/8 half-plane start',
  status: 'done',
  source: Object.freeze({
    repo: 'https://github.com/openai/math',
    released: '2026-10-06',
    commit: 'adc7f1241 (Initial commit)',
    author: 'internal OpenAI model (722 manuscripts, 372 families); README: unformalized results may contain errors',
    family003: 'The Quasi-Riemann Hypothesis: ζ and every Dirichlet L-function zero-free in Re s > 7/8 (paper, 2026-09-30); alternate 11/12 proof, human-edited writeup (paper2, 2026-10-05)',
  }),
  headline: 'The released Lean proof of ζ(s) ≠ 0 for Re s > 7/8 (openai/math family 003, claimed by an internal OpenAI model, not peer-reviewed) '
    + 're-builds locally with only the standard axioms, and its statement matches the comparator challenge; the Dirichlet L-function version passes the same checks. '
    + 'Conditional on that half-plane, on Raymond\'s unrefereed analytic chain (G0) and on PT\'s RH verification to 3.0001753e12, Raymond\'s decreasing-barrier '
    + 'chain at PT height gives the conditional value Λ ≤ 0.118505710922701 (his alternate log bound: 0.118505710922702); adding the route-P ledger '
    + '(single implementation, internal referee) gives 0.117708313410954. With the 11/12 half-plane: 0.129826438865344 and 0.128829131217197. '
    + 'These are conditional values, not bounds. Without the half-plane nothing changes: no refereed bound is changed, RH is open, NO QED.',

  lean: Object.freeze({
    outcome: 'VERIFIED LOCALLY (lake build + #print axioms + statement match by hand); official comparator not run',
    theorem: 'theorem OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re {s : ℂ} (hs : (7/8:ℝ) < s.re) : riemannZeta s ≠ 0',
    companion: 'OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re (L(s,χ) ≠ 0 for 7/8 < re s, except χ = 1, s = 1)',
    solutionModule: 'OAI.NumberTheory.DirichletL.Nonvanishing',
    toolchain: 'Lean 4.34.1 (commit 5045d005), Mathlib d13f23b723b8, 24 release patches applied and reverse-checked',
    buildJobs: 7061,
    closureModules: 2924,
    closureModulesBuilt: 2924,
    closureLines: 486490,
    mathlibCacheFiles: 8908,
    axioms: Object.freeze(['propext', 'Classical.choice', 'Quot.sound']),
    permittedAxioms: Object.freeze(['propext', 'Quot.sound', 'Classical.choice']),
    forbiddenTokensFound: 0,
    oleanSha256: 'adeff7db7211767b3a3437958cecce7229185c998c8ac909a7013ec75d499fdc',
    coldBuild: 'about 10 min lake update + Mathlib cache, about 1.9 h build at load 40–150 on 18 cores; peak about 4 Lean processes, about 11 GB',
    notDone: Object.freeze([
      'official comparator run (needs landrun, Linux-only, and lean4export); its two checks were reproduced by hand',
      'independent kernel re-check (lean4checker / nanoda); the challenge JSON has enable_nanoda = false',
      'HeckeSevenEighths and SiegelZeros comparator statements',
      'paper refereeing (abstract, introduction, proof overview and contents read only; no gap found at that depth)',
      '11/12 writeup corollaries (Landau–Siegel exclusion, least nonresidue, idoneal numbers): paper level only',
    ]),
    processNote: 'for about one minute two build processes shared the tree; the 1056 files written in that window were deleted and rebuilt by one process before the final checks (judged unaffected, not proved)',
  }),

  values: Object.freeze({
    deBruijn78: V('9/32', '0.281250000000000', 'CONDITIONAL on the 7/8 half-plane (classical implication; no verified height)', 'de Bruijn 1950 Thm 13 + ξ(s) = ξ(1−s): Λ ≤ (2θ−1)²/2'),
    deBruijn1112: V('25/72', null, 'CONDITIONAL on the 11/12 half-plane', 'same, θ = 11/12 (0.347222…)'),
    raymond78: V('118505710922701/1000000000000000', '0.118505710922701', 'CONDITIONAL (003, G0, PT); certified run, two independent implementations agree', 'Raymond chain, start q0 = 9/16 + 2e-6, PT height'),
    raymond78AltLog: V('59252855461351/500000000000000', '0.118505710922702', 'CONDITIONAL (003, G0, PT); Raymond AF §12 alternate log bound', 'referee P1: alternate terminal log bound, +1e-15'),
    raymond1112: V('2028538107271/15625000000000', '0.129826438865344', 'CONDITIONAL (11/12 half-plane, G0, PT)', 'Raymond chain, start q0 = 25/36 + 2e-6, PT height'),
    raymondStrip: V('18674384228461/125000000000000', '0.149395073827688', 'CONDITIONAL (G0, PT); control, reproduces Raymond\'s deposit', 'Raymond chain, classical strip start (θ = 1)'),
    routeP78: V('58854156705477/500000000000000', '0.117708313410954', 'CONDITIONAL (003, G0, PT, route-P ledger single-band); 0 failures in the referee\'s independent step verifier', 'route-P stack, single band, 7/8 start'),
    routeP1112: V('128829131217197/1000000000000000', '0.128829131217197', 'CONDITIONAL (11/12, G0, PT, route-P ledger single-band); 0 failures in the referee\'s step verifier', 'route-P stack, single band, 11/12 start'),
    routePStrip: V('5930005871003/40000000000000', '0.148250146775075', 'CONDITIONAL (G0, PT, route-P ledger); single run, not re-run by the referee', 'route-P stack, single band, strip start (reference)'),
    routePJoint: V('36319092148717/250000000000000', '0.145276368594868', 'CONDITIONAL (route-P ledger); lambda-levers-combined-2026-10-09', 'route-P joint 3-band, MTY / strip starts'),
    raymondPreprint: V('149396/1000000', '0.149396000000000', 'EXTERNAL unrefereed preprint (Zenodo 22867547)', 'Raymond\'s stated value'),
    xl25_78: V('2426268460593/20000000000000', '0.121313423029650', 'MEASURED (needs RH to 1.25e12 and a finite-head wall near 2.5e12 that is not certified)', '7/8 start at X = 2.5e12, N0 = 446031'),
    xl25_1112: V('66637286679949/500000000000000', '0.133274573359898', 'MEASURED (same caveat)', '11/12 start at X = 2.5e12 (strip start does not finish inside t ≤ 0.152)'),
  }),
  heightCurve78: Object.freeze([
    Object.freeze({ height: '10X', value: '0.112235848057212', grade: 'MEASURED (height unverified; referee re-checked)' }),
    Object.freeze({ height: '100X', value: '0.107056451546934', grade: 'MEASURED (height unverified; referee re-checked)' }),
    Object.freeze({ height: '1000X', value: '0.102615591280579', grade: 'MEASURED (height unverified; referee re-checked)' }),
  ]),
  stripCurve: Object.freeze([
    Object.freeze({ height: '100X', value: '0.132065192014899', grade: 'MEASURED (height unverified)' }),
    Object.freeze({ height: '1000X', value: '0.125808959269171', grade: 'MEASURED (height unverified)' }),
  ]),
  substeps: Object.freeze({
    raymond78: 60675, raymond1112: 66472, raymondStrip: 76491, routeP78: 60267, routeP1112: 65961, routePStrip: 75905,
    raymond78Kernels: Object.freeze({ '23/40,199/100,7/20': 51614, '3/5,199/100,1/5': 9061, sharp: 0 }),
    routeP78Floors: Object.freeze({ trackA: 22272, r2: 20127, route3Joint: 17868 }),
    routeP1112Floors: Object.freeze({ trackA: 22272, r2: 21079, route3Joint: 22610 }),
  }),
  startMargins: Object.freeze({ strictEntry78: 1.92e-6, strictEntry1112: 1.91e-6, startOffset: '2/1000000', horizon: '41/250' }),
  analysis: Object.freeze([
    'Substitution (referee-confirmed reading, not externally refereed): the time-zero strip enters Raymond\'s chain only through the start q0 > 1 and its strict-entry check (AF §11). '
      + 'The head localisation (AF §§2–3) needs no change: the classical strip and the y ≤ 1 wall hold for 0 ≤ t ≤ 41/250 unconditionally. Floors, kernel certificates and the head wall are unchanged; q enters only through v = q/h², recomputed along the new path.',
    'Fixed-t0 criterion (Polymath15 Thm 1.2, the type behind PT 0.2): the half-plane lowers the tops of hypotheses (ii)/(iii) to √((2θ−1)² − 2t) but leaves the conclusion Λ ≤ t0 + y0²/2 and its binding point y = y0 unchanged, so no fixed-t0 bound moves (method-level analysis, relabelled from "proved" per referee P5).',
    'MTY (R = 5.558691) gives |Im z| ≤ 0.98748 at X; it is narrower than 3/4 only for x < 8.43, so it gives no uniform start.',
    'Decomposition at PT height: Raymond strip 0.149395 → route-P strip single band 0.148250 (route-P levers −0.0011) → route-P 3-band MTY 0.145276 (−0.0030) → 11/12 start 0.128829 → 7/8 start 0.117708. '
      + 'The zero-free start does almost all the work (−0.0309 on Raymond\'s chain alone); route-P levers add −0.000797 (7/8) and −0.000997 (11/12) on top, because the 7/8 path never uses a sharp kernel and the r2 sharp windows and campaign floors were placed on the band path.',
    'Raymond, or anyone with a decreasing-barrier chain, can make the same substitution; under 003 the route-P margin over Raymond falls from 0.0041 to 0.0008.',
  ]),
  routePConditions: Object.freeze(['G0-c', 'G0-d', 'AF gaps', 'Track A Lemma R', 'G0-a (Lemma CG)', 'r2-floors-base',
    'outer lemma (route-1 campaign / v4c certificates, wol-pd/r5 lemmas)', 'time-box allowance', 'route-3 Theorem MP with single-implementation kernel certificates',
    'multi-height consumer', 'producer layer', 'PT (RH-head caveat)']),
  routePNotNeeded: Object.freeze(['Lemma B', 'H2', 'RH-win', 'MTY', '3-band layout']),
  refereeCorrections: Object.freeze([
    'P1: the two enclosure lanes do not agree for 7/8 once Raymond\'s actual AF §12 alternate log bound is used: 0.118505710922702 (+1e-15); the primary 0.118505710922701 remains an upper bound (odd-degree alternating partial sum)',
    'P2: headline now names G0, PT (RH to 3.0001753e12, Turing-step exposure "not determined" on the ledger) and, for 0.117708313410954, the route-P ledger',
    'P3: the route-P "independent reproduction" is a second driver over the same consumer code; the independent confirmation is the referee\'s from-scratch step verifier (60,267 / 65,961 substeps, 0 failures)',
    'P4: head wall needs no substitution; the half-plane is used only at the start and in the strict-entry check',
    'P5: "no fixed-t0 bound moves" relabelled as method-level analysis',
    'P6: route-P single-band dependency list made explicit (Track A, route-3 kernel certificates, G0-a, r2-floors-base, wol-pd/r5 pads, RH-head)',
    'P7: route-P strip reference, X1.9–X9 height points, scan proxy and strip-height fits are single runs; none enters the 7/8 or 11/12 values',
  ]),
  heuristic: Object.freeze([
    'Equivalent strip height for 7/8: strip law c = 3.461 + 0.02836·ln T extrapolates to about 4.7e16 (≈ 1.6e4× PT); ≈ 1.6–2.1e11 core-hours at PT cost scaling',
    'Equivalent strip height for 11/12: ≈ 6.5–6.8e14 (≈ 220× PT; measured interpolation between the 100X and 1000X strip runs)',
    'Height re-optimisation proxy 0.117191 (7/8) / 0.128483 (11/12): model, not a bound',
    'Further 7/8-path levers (sharp windows and campaign floors re-certified on the lower path, kernels for v ≈ 0.1, heights at 0.9–0.94×): each a few × 1e-3',
  ]),

  userQuestions: Object.freeze({
    sota: 'PT Λ ≤ 0.2 remains the accepted bound; neither Raymond\'s 0.149396 nor route P\'s 0.145276 is refereed. Under the 003 half-plane (Lean-checked locally, not peer-reviewed) the conditional route-P value is 0.117708313410954, 0.0317 below Raymond\'s stated 0.149396; Raymond\'s own chain with the same start gives 0.118505710922701, so the lead from our levers is 0.0008.',
    raymondChain: 'Internally checked: the numerical chain regenerated bit-identically (strip control reproduced again here, 76,491 substeps); G0-a and G0-d proved with internal referee; G0-c has no reader outside the project. The openai/math release does not touch the chain. The independent G0 referee is now the binding premise of every value above.',
    otherRoute: 'The combination available now is route P (campaign + route 3 kernels) with the 003 start, single band: 0.117708313410954 conditional. Levers tuned on the old trajectory are worth only −0.0008 on the new one; re-tuning them on the lower path is the next numerical lever (a few × 1e-3 each, heuristic).',
  }),
  topActions: Object.freeze([
    '1. Official comparator run on Linux (landrun + lean4export) for QuasiRiemannHypothesis and DirichletSevenEighths; lean4checker on OAI.NumberTheory.DirichletL.Nonvanishing',
    '2. Commission the independent G0 referee (AF §§2–5 wall/Abel, §§10–12 first contact, Part II) and referee the start-substitution reading of AF §2 and §11',
    '3. Re-certify route-P levers along the 7/8 path (r2 sharp windows, campaign floors, kernels for v ≈ 0.1, floors at 0.9–0.94× heights)',
    '4. Write up the conditional Λ ≤ 9/32 anchor (de Bruijn + half-plane) for routes 50 and 20',
    '5. Site status updates for 003 (zero-free region, Siegel zero), 005 (Catalan), 007 (Chowla): external claim, Lean-formalized per the repository, not peer-reviewed',
    '6. Rebuild 005\'s determinants Δ_N for N = 1, 2 and confirm the ζ(2)-column cancellation; restate the Catalan obstruction as covering the listed mechanisms only',
    '7. Assess the release\'s leancert and family 090 interval sign proofs as a base for route 41 (Lean replay of Arb certificates)',
    '8. Assess the release\'s Mellin/contour lemmas for route 39 (version port v4.22 → v4.34 is the main cost)',
    '9. Measure the effect of 003 on the zero-density tail term (imp-124775 / imp-34791)',
    '10. Certify a finite-head wall near x = 2.5e12 to turn the reduced-height 0.1213 measurement into a conditional value',
  ]),
  files: Object.freeze(['formalization/external/openai-math-qrh-verification.md', 'formalization/external/openai-math-survey.md',
    'tmp/oai-lambda-raymond.py', 'tmp/oai-lambda-routeP.py', 'tmp/oai-lambda-classical.py', 'tmp/oai-lambda-out/summary.json',
    'tmp/oai-lambda-ref-raymond.py', 'tmp/oai-lambda-ref-routeP-verify.py', 'tmp/oai-lambda-ref-out/raymond_X1.json', 'tmp/oai-lambda-ref-out/raymond_X1_rob.json',
    'tmp/oai-lambda-ref-out/routeP_t78_verify.json', 'tmp/oai-lambda-ref-out/routeP_t1112_verify.json', 'tmp/oai-survey-qrh/QRH_band1.log']),
  verdict: 'Verified locally: the openai/math family 003 Lean proof of ζ(s) ≠ 0 for Re s > 7/8 builds with only propext, Classical.choice and Quot.sound, '
    + 'statement identical to the comparator challenge (official comparator and independent kernel re-check not run; not peer-reviewed). Conditional on that '
    + 'half-plane, G0 and PT: Raymond chain 0.118505710922701, route-P single band 0.117708313410954 (11/12: 0.129826438865344 / 0.128829131217197); '
    + 'conditional values, not bounds. The half-plane alone gives 9/32 via de Bruijn, which does not beat 0.2. No refereed bound is changed; RH open; NO QED.',
});

const C = OPENAI_MATH_INTEGRATION;
const v = (k) => C.values[k].exact;
const near = (x, target, tol) => Math.abs(num(x) - target) < tol;
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

export const OPENAI_MATH_INTEGRATION_ASSERTIONS = Object.freeze([
  {
    id: 'oai-debruijn-half-plane',
    holds: () => eq(deBruijn('7/8'), v('deBruijn78')) && eq(deBruijn('11/12'), v('deBruijn1112')) && eq(deBruijn('1'), '1/2')
      && eq(qBound('7/8'), '9/16') && eq(qBound('11/12'), '25/36') && lt('1/5', v('deBruijn78')),
    why: '(2θ−1)²/2 = 9/32 (θ = 7/8), 25/72 (θ = 11/12), 1/2 (strip); 9/32 > 1/5, so the half-plane alone does not beat PT.',
  },
  {
    id: 'oai-start-above-bound',
    holds: () => ['7/8', '11/12'].every((th) => lt(qBound(th), add(qBound(th), C.startMargins.startOffset)))
      && lt(qBound('7/8'), qBound('11/12')) && lt(qBound('11/12'), '1') && C.startMargins.strictEntry78 > 0 && C.startMargins.strictEntry1112 > 0
      && C.startMargins.strictEntry78 < 2e-6 && C.startMargins.strictEntry1112 < 2e-6,
    why: 'q0 = (2θ−1)² + 2e-6 lies above the bound; the starts are ordered 9/16 < 25/36 < 1; strict-entry margins 1.92e-6 / 1.91e-6 are positive and below the 2e-6 offset.',
  },
  {
    id: 'oai-decimals-exact',
    holds: () => Object.values(C.values).every((x) => x.dec === null || dec15(x.exact) === x.dec),
    why: 'Every stated 15-digit decimal is the exact expansion of its rational.',
  },
  {
    id: 'oai-ordering-and-gaps',
    holds: () => lt(v('routeP78'), v('raymond78')) && lt(v('raymond78'), v('xl25_78')) && lt(v('xl25_78'), v('routeP1112'))
      && lt(v('routeP1112'), v('raymond1112')) && lt(v('raymond1112'), v('xl25_1112')) && lt(v('xl25_1112'), v('routePJoint'))
      && lt(v('routePJoint'), v('routePStrip')) && lt(v('routePStrip'), v('raymondStrip')) && lt(v('raymondStrip'), v('raymondPreprint'))
      && eq(sub(v('raymondPreprint'), v('routeP78')), '31687686589046/1000000000000000')
      && eq(sub(v('routePJoint'), v('routeP78')), '27568055183914/1000000000000000')
      && eq(sub(v('raymond78'), v('routeP78')), '797397511747/1000000000000000')
      && eq(sub(v('raymond1112'), v('routeP1112')), '997307648147/1000000000000000')
      && eq(sub(v('raymond78AltLog'), v('raymond78')), '1/1000000000000000')
      && near(sub(v('raymondStrip'), v('raymond78')), 0.0309, 5e-5),
    why: 'Order 0.117708 < 0.118506 < 0.121313 < 0.128829 < 0.129826 < 0.133275 < 0.145276 < 0.148250 < 0.149395 < 0.149396; gaps 0.031687686589046 (vs Raymond 0.149396), 0.027568055183914 (vs route-P joint); route-P levers on the new path 7.97e-4 / 9.97e-4; alternate log +1e-15; the start alone −0.0309.',
  },
  {
    id: 'oai-substep-partitions',
    holds: () => sum(C.substeps.raymond78Kernels) === C.substeps.raymond78 && C.substeps.raymond78Kernels.sharp === 0
      && sum(C.substeps.routeP78Floors) === C.substeps.routeP78 && sum(C.substeps.routeP1112Floors) === C.substeps.routeP1112
      && C.substeps.routeP78 < C.substeps.raymond78 && C.substeps.raymond78 < C.substeps.raymond1112 && C.substeps.raymond1112 < C.substeps.raymondStrip,
    why: '51,614 + 9,061 = 60,675 Raymond 7/8 substeps (no sharp kernel); floor sources 22,272 + 20,127 + 17,868 = 60,267 and 22,272 + 21,079 + 22,610 = 65,961; lower starts reach the barrier floor in fewer substeps.',
  },
  {
    id: 'oai-height-curves',
    holds: () => C.heightCurve78.every((r, i, a) => i === 0 || Number(r.value) < Number(a[i - 1].value)) && Number(C.heightCurve78[0].value) < num(v('routeP78'))
      && C.stripCurve.every((r, i) => Number(r.value) > Number(C.heightCurve78[i + 1].value)) && C.heightCurve78.every((r) => /MEASURED/.test(r.grade))
      && /MEASURED/.test(C.values.xl25_78.grade) && /not certified/.test(C.values.xl25_78.grade),
    why: 'The 7/8 curve falls with height (0.1122, 0.1071, 0.1026 at 10X/100X/1000X), every strip value at 100X/1000X stays above the 7/8 value at the same height, all off-PT heights graded MEASURED.',
  },
  {
    id: 'oai-lean-record',
    holds: () => C.lean.closureModules === C.lean.closureModulesBuilt && C.lean.buildJobs === 7061 && C.lean.forbiddenTokensFound === 0
      && C.lean.axioms.length === 3 && C.lean.axioms.every((a) => C.lean.permittedAxioms.includes(a)) && !C.lean.axioms.includes('sorryAx')
      && /^[0-9a-f]{64}$/.test(C.lean.oleanSha256) && /comparator not run/.test(C.lean.outcome) && C.lean.notDone.some((x) => /lean4checker/.test(x)),
    why: 'All 2924 closure modules built; axioms ⊆ the comparator\'s permitted set, no sorryAx; the limits (no official comparator, no independent kernel check) are recorded.',
  },
  {
    id: 'oai-honest-scope',
    holds: () => /refereed bound is changed/i.test(C.verdict) && /NO QED/.test(C.verdict) && /not bounds/.test(C.verdict) && /not peer-reviewed/.test(C.verdict)
      && /G0/.test(C.headline) && /PT|refereed bound is changed/.test(C.headline) && /route-P ledger/.test(C.headline) && /not bounds/.test(C.headline)
      && Object.values(C.values).filter((x) => x.label !== 'Raymond\'s stated value').every((x) => /CONDITIONAL|MEASURED/.test(x.grade))
      && C.refereeCorrections.length === 7 && C.routePNotNeeded.includes('MTY') && C.routePConditions.includes('G0-c'),
    why: 'Every Λ value is graded CONDITIONAL or MEASURED; the headline names the half-plane, G0, PT and the route-P ledger; the seven referee corrections are recorded; no QED.',
  },
]);

export default OPENAI_MATH_INTEGRATION;
