/**
 * @fileoverview qrh-lambda-lean-2026-10-09 — Lean check of the conditional QRH values of
 * src/data/qrh-path-push-2026-10-08.js (F2: Λ ≤ 116091488672439/10^15) and of Raymond's chain alone under the 7/8 start
 * (Λ ≤ 118505710922701/10^15, tmp/oai-lambda-raymond.py). Lean package: formalization/lean/qrh-lambda (Lean 4.34.1,
 * Mathlib d13f23b7, LeanCert 7f91b6eb, sibling package raymond-core; 7/8 half-plane from openai/math
 * OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re). One internal referee pass (not refuted, minor; corrections applied).
 *
 * LEAN-CHECKED: soundness of the checker, the substep barrier lemma from two named hypotheses, strict entry, the terminal
 *  argument, the exp/log/Horner/cap/flow lemmas, the 7/8 start from the openai/math theorem via the substitution lemma,
 *  and every substep of both runs replayed by `decide +kernel` (no native_decide).
 * CONDITIONAL: the final theorems take RaymondChainHyps (head wall, first contact, contact exclusion) and the run's
 *  TableHyps (floor entries, kernel rows) as explicit arguments. They are not bounds on Λ.
 *
 * PT Lambda <= 0.2 stands; RH is open; NO QED. Import-free. QRH_LAMBDA_LEAN_ASSERTIONS check the internal consistency
 * of the record (values equal to the parent module's exact rationals, substep and chunk counts, axiom audit, hypothesis
 * list, honest-scope wording).
 */

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmp = (x, y) => { const [a, b] = big(x), [c, d] = big(y); const l = a * d, r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const dec15 = (x) => { const [a, b] = big(x); const n = a * 10n ** 15n; return n % b === 0n ? `0.${String(n / b).padStart(15, '0')}` : null; };

const PKG = 'formalization/lean/qrh-lambda';

export const QRH_LAMBDA_LEAN = Object.freeze({
  id: 'qrh-lambda-lean-2026-10-09',
  date: '2026-10-09',
  title: 'Lean check of the conditional QRH values Λ ≤ 0.116091488672439 (F2) and Λ ≤ 0.118505710922701 (Raymond chain, 7/8 start)',
  status: 'done',
  parent: 'src/data/qrh-path-push-2026-10-08.js',
  page: '/lambda-qrh-conditional',
  package: PKG,
  headline: 'The conditional QRH values now have a Lean check. Lean proves Λ ≤ 116091488672439/10^15 (F2) and Λ ≤ 118505710922701/10^15 '
    + '(Raymond\'s chain alone) for LeanCert\'s de Bruijn–Newman constant of the concrete H_t, assuming three analytic hypotheses about H_t '
    + '(head wall, first contact, contact exclusion) and the validity of each run\'s floor-table and kernel-table entries. The 7/8 start is '
    + 'derived in Lean from the openai/math theorem OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re (kernel-checked in the local build with '
    + 'standard axioms only; not replayed by an independent checker or the comparator; not peer-reviewed); without it, the confirmed '
    + 'statements are the *_of_zeroFree theorems, which take the half-plane as an argument. Every substep of both runs (59,439 and 60,675) '
    + 'is replayed by decide +kernel. Conditional, not a bound. PT Lambda <= 0.2 stands; RH is open; NO QED.',

  toolchain: Object.freeze({ lean: '4.34.1', mathlib: 'd13f23b7', leancert: '7f91b6eb', oaiWorkspace: '/tmp/qrh-verify/lean (local, not a git repository)' }),

  values: Object.freeze({
    F2: Object.freeze({ exact: '116091488672439/1000000000000000', dec: '0.116091488672439', substeps: 59439, chunks: 30, chunkSize: 2000,
      q0: '5625001/10000000', floorEntries: 468, kernelRows: 59, consumerRuns: 566, chunkLevelRuns: 595, terminal: Object.freeze({ n: 59438, cell: 464 }),
      altLogTerminalTest: 'passes (U = U_robust)', s1Margin: 1.8082252751949694e-8 }),
    R78: Object.freeze({ exact: '118505710922701/1000000000000000', dec: '0.118505710922701', substeps: 60675, chunks: 31, chunkSize: 2000,
      q0: '281251/500000', floorEntries: 476, kernelRows: 2, chunkLevelRuns: 506, terminal: Object.freeze({ n: 60674, cell: 474 }),
      kernelSplit: Object.freeze({ kernel4: 51614, kernel5: 9061 }),
      altLogTerminalTest: 'fails (alternate-log value 0.118505710922702); not used by the soundness theorem, which uses the degree-11 log bound' }),
  }),

  theorems: Object.freeze([
    Object.freeze({ name: 'QrhLambda.lambda_le_of_qrh_raymond', file: `${PKG}/QrhLambdaOAI/Main78.lean`,
      statement: 'theorem lambda_le_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) : deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15' }),
    Object.freeze({ name: 'QrhLambda.realZeros_of_qrh_raymond', file: `${PKG}/QrhLambdaOAI/Main78.lean`,
      statement: 'theorem realZeros_of_qrh_raymond (h : RaymondChainHyps) (f : FloorTableHyps) : ∀ t : ℝ, 116091488672439 / 10 ^ 15 ≤ t → ∀ z : ℂ, H t z = 0 → z.im = 0' }),
    Object.freeze({ name: 'QrhLambda.lambda_le_of_raymond78', file: `${PKG}/QrhLambdaOAI/Main78.lean`,
      statement: 'theorem lambda_le_of_raymond78 (h : RaymondChainHyps) (f : RaymondTableHyps) : deBruijnNewmanLambda ≤ 118505710922701 / 10 ^ 15' }),
    Object.freeze({ name: 'QrhLambda.lambda_le_of_qrh_raymond_of_zeroFree (and realZeros_…, lambda_le_of_raymond78_of_zeroFree)', file: `${PKG}/QrhLambda/Main.lean`,
      statement: '(hZ : RaymondCore.Substitution.ZetaZeroFreeRight (7 / 8)) (h : RaymondChainHyps) (f : FloorTableHyps) : deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15' }),
    Object.freeze({ name: 'QrhLambda.Cert.lambda_le', file: `${PKG}/QrhLambda/Sound.lean`,
      statement: '(C : Cert) (hframe : C.frame11 = true) (hchunks : ∀ j < C.chunks.length, C.chunkOK j = true) (hR : RaymondChainHyps) (hT : TableHyps C) (hstart : StartBound (C.qb : ℝ)) : Lambda ≤ (C.U : ℝ)' }),
    Object.freeze({ name: 'QrhLambda.barrier_step', file: `${PKG}/QrhLambda/Barrier.lean`,
      statement: 'substep barrier lemma (stored-barrier form of Lemma FB(θ) step 3), derived from first_contact and contact_exclusion' }),
  ]),
  definitions: Object.freeze({
    deBruijnNewmanLambda: 'abbrev for LeanCert.Analysis.DBN.Lambda = sInf {t | ∀ z, H t z = 0 → z.im = 0}, with H t z = ∫₀^∞ e^{tu²}Φ(u)cos(zu)du and H 0 z = ξ(1/2 + iz/2)/8 (proved in LeanCert). It is Λ itself; renamed from deBruijnNewmanUpper after the referee pass.',
  }),

  leanChecked: Object.freeze([
    'Every substep of F2 (59,439, from q0 = 5625001/10^7) in 30 decide +kernel chunk theorems: cell, v = q/h² ≤ ρ² (E1), h·r < 2, 1/2 ≤ h ≤ 5/2 (E7), the cap by Raymond\'s rule (E2), rate c = (2λ/h)(ℓ − cap/h) > 0 (E3), 0 < cδ < 1, T₁₈(cδ) by integer Horner, next stored value ceil_{2^-96}((q + 2/c)T₁₈ − 2/c) (E4), no early crossing via T₁₇ (E6), horizon t ≤ 41/250.',
    'Frame (decide +kernel): q0 > 9/16 (E8), strict entry S1, first substep, chunk links, terminal substep (z ∈ (0,1), lag₁₁ ≤ δ, U = ceil_{10^-15}(t_K + lag₁₁ + q_e/2) < 41/250, terminal enclosure ≤ q_e). F2 also passes the separate alternate-log terminal test (U = U_robust).',
    'The same for Raymond\'s chain: 60,675 substeps from q0 = 281251/500000, 31 chunks, U = 118505710922701/10^15.',
    'Proved (not by evaluation): checker soundness (Sound.lean), barrier_step from first_contact + contact_exclusion, strict entry, the terminal argument (LeanCert H_forward_strip and real_zeros_iff_Lambda_le), exp(−x) ≤ T₁₈(x), T₁₇(x) ≤ exp(−x), log(1+z) ≤ log₁₁(z), the self-pair cap lemma, the Horner identity, and StartBound (9/16) from the 7/8 half-plane via RaymondCore.Substitution.substitution.',
    'Negative controls (decide +kernel proves the check returns false): U lowered by 10^-15; R78 claiming its alternate-log value …702; R78 alternate-log frame; floor of cell 0 raised by 10^-12; floor entry 164 lowered by 10^-12 in chunk 10; kernel row 18 with ρ = 1/5 in chunk 10.',
  ]),

  namedHypotheses: Object.freeze([
    Object.freeze({ name: 'RaymondChainHyps.head_wall', tag: 'W', statement: '∀ t ∈ [0, 41/250], ∀ z, H t z = 0 → |Re z| ≤ X = 6000000185827 → Im z = 0',
      source: 'Raymond AF Part I §§2–3 (head cell, wall; Lemma B.3 of review A); contains PT\'s RH verification to γ ≤ 3000175332800, used once at t = 0' }),
    Object.freeze({ name: 'RaymondChainHyps.first_contact', tag: 'FC', statement: 'a continuous positive barrier on [t₀, t₁] (0 < t₀, t₁ ≤ 41/250) that starts strictly above the tail zeros and is not above them at some time has a first contact time s with strict separation on [t₀, s) and a tail zero with Im(z)² = β(s)',
      source: 'AF §11, main paper §7, Lemma FB(θ) step 3: Polymath15 Thm 1.5(i) compactness, Hurwitz, head_wall at the wall' }),
    Object.freeze({ name: 'RaymondChainHyps.contact_exclusion', tag: 'CE', statement: 'on a substep with a valid single-pair rate c at stored level Q ≥ b (PairRate, containing (J) and (K) as premises), the barrier flow b c (u − t₀) ≥ q_e cannot be touched after strict separation',
      source: 'AF §11 (11.1): Polymath Prop 3.1(i) zero dynamics, (10.1) summed over the other zeros, self-pair cap; Prop 3.1(ii) Hermite splitting' }),
    Object.freeze({ name: 'TableHyps.floors_valid', tag: 'J', statement: 'each floor entry (cell, r, h, ℓ): ∀ t in the closed cell, ∀ x ≥ X, ℓ < [S(t, x + rh, h) + S(t, x − rh, h)]/2 with S = ∂_y log|H_t| at y = h (F2: 468 entries; R78: 476)',
      source: 'Arb floor producers (AF §§4–9 one-point input with AF (4.6), G0-c joint floors, Track-A gains, multi-height licence), route-3 Theorem MP, route-P r2 floors. Mixed certification: the 89 r2 entries (11,304 F2 substeps) rest on a measured, uncertified 0.0023 time-box allowance, the unreviewed r2 L-slope lemma and WOL-C; the 289 X-option entries on the route-9 multi-height licence (not refereed outside the project); G0-c has no external reader' }),
    Object.freeze({ name: 'TableHyps.kernels_valid', tag: 'K', statement: 'AF (10.1) at scale 1 for each kernel row (r, λ, ρ) (F2: 59 rows; R78: catalogue kernels 4 and 5)',
      source: 'exact Bernstein certificates in Python; the 59 F2 rows re-certified by a second method' }),
  ]),
  externalInput: 'The 7/8 half-plane is not a hypothesis of the three headline theorems: it is OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re (Mathlib riemannZeta s ≠ 0 for 7/8 < Re s), kernel-checked in the local build with standard axioms only; source scan of its 2,923-module closure clean; official comparator and leanchecker not run on that closure (about 10 CPU-hours); not peer-reviewed.',

  axiomAudit: Object.freeze({
    standard: Object.freeze(['propext', 'Classical.choice', 'Quot.sound']),
    libraryTheorems: 121,
    libraryStandard: 120,
    noAxioms: Object.freeze(['QrhLambda.two96_pos']),
    oaiTheorems: 5,
    oaiStandard: 5,
    total: 126,
    sorry: 0,
    nativeDecide: 0,
    axiomDeclarations: 0,
    files: Object.freeze([`${PKG}/axioms-output.txt`, `${PKG}/oai-axioms-output.txt`]),
    rerunAfterCorrections: '2026-10-09, after the referee label corrections (rename and doc comments; no proof changed)',
  }),

  kernelCost: Object.freeze({
    F2: Object.freeze({ chunks: 30, wallPerChunkS: [13, 129], sumS: 953, maxRssGB: 3.0, refereeSumS: 858, refereeRangeS: [10, 119] }),
    R78: Object.freeze({ chunks: 31, wallPerChunkS: [6, 26], sumS: 701, maxRssGB: 2.8, refereeSumS: 648, refereeRangeS: [4.5, 23] }),
    sequential: 'F2C00 12.6 s user / 2.0 GB; F2C16 106.7 s / 3.1 GB; F2C17 109.3 s / 3.1 GB (catalogue-option chunks: ~300-bit rates)',
    refereeRebuildWallMin: 15.5,
    refereePeakRssGB: 10.8,
  }),

  referee: Object.freeze({
    refuted: false,
    severity: 'minor',
    independentChecks: Object.freeze([
      'from-scratch rebuild in a separate copy with a fresh LeanCert clone (76 QrhLambda modules incl. 61 chunk certificates)',
      'leanchecker replay rc = 0 for all 14 non-chunk modules, 61 chunk modules, RaymondCore.Substitution and 74 LeanCert closure modules',
      'axiom audit identical; 121-name enumeration matches',
      'independent Python implementation of Checker.lean semantics from Data/F2.lean: frame, 30/30 chunks, U and S1 margin reproduced',
      '0 mismatches against F2_final.steps.jsonl.gz over all 59,439 substeps; 20-substep Lean #eval spot check',
      '0 provenance failures over 468 F2 and 476 R78 floor entries; input hashes match',
      'RaymondChainHyps follows from RH (referee proof raymondChainHyps_of_RH): the hypotheses are consistent unless RH is false',
    ]),
    corrections: Object.freeze([
      'E6 names only the non-terminal no-early-crossing test; the U = U_robust comparison is the alternate-log terminal test (Terminal11.lean, F2Chunks.lean, README).',
      'deBruijnNewmanUpper renamed deBruijnNewmanLambda: it is Λ itself, not an upper bound (Main.lean, Main78.lean, README).',
      'Run counts: 566 consumer runs stored as 595 chunk-level runs in Data/F2.lean (split at 29 chunk boundaries); R78 has 506 chunk-level runs.',
      'Headline: the 7/8 start is derived from the openai/math theorem, kernel-checked locally only; without it the confirmed statements are the *_of_zeroFree theorems.',
      '"Certified table values" replaced by "table values asserted by the run" with the mixed certification of the floor sources stated (Hyps.lean, Main.lean, README).',
    ]),
  }),

  notChecked: Object.freeze([
    'The three RaymondChainHyps fields and PT\'s RH verification inside head_wall.',
    'The floor tables (AF §§4–9 incl. AF (4.6) and Φ\' = Re β_t, G0-c, Track A, Theorem MP, multi-height licence, r2 floors with the measured 0.0023 allowance and the unreviewed L-slope lemma).',
    'Kernel inequality (10.1) for the 59 + 2 kernel rows.',
    'The openai/math half-plane beyond the local build (no comparator or leanchecker run, not peer-reviewed).',
    'Reproducibility from a clean clone: the package needs /tmp/qrh-verify/lean (patched, not a git repository), the gitignored raymond-core LeanCert checkout, and /tmp inputs for regenerating the data.',
  ]),

  effortToFinish: Object.freeze([
    Object.freeze({ piece: 'kernels_valid (61 rows)', estimate: '1–2 person-months', note: 'parametric Lean reduction of (10.1) + Bernstein checker with soundness proof; then seconds per row by decide +kernel' }),
    Object.freeze({ piece: 'first_contact', estimate: '2–4 person-months', note: 'Polymath15 Thm 1.5(i) and a parametrised Hurwitz theorem' }),
    Object.freeze({ piece: 'contact_exclusion', estimate: '3–6 person-months', note: 'H_t\'/H_t as a sum over zeros (Hadamard), zero dynamics, Hermite splitting' }),
    Object.freeze({ piece: 'head_wall', estimate: '4–8 person-months (AF §§2–3)', note: 'PT\'s RH verification to 3.0001753e12 stays an imported hypothesis' }),
    Object.freeze({ piece: 'floors_valid (468 + 476 entries)', estimate: '6–12 person-months for the analytic reduction', note: 'kernel-only replay of the Arb tables (~10^10 interval operations) is out of reach without new tooling; the 89 r2 entries first need the 0.0023 allowance certified' }),
    Object.freeze({ piece: '7/8 half-plane', estimate: 'days', note: 'official comparator + leanchecker run; peer review is external' }),
  ]),
  effortNote: 'Rough judgements, not measurements. Total on the order of 16–32 person-months for the analytic hypotheses, with PT\'s computation remaining an imported hypothesis.',

  rebuild: 'cd formalization/lean/qrh-lambda; link .lake/packages to /tmp/qrh-verify/lean/.lake/packages (mathlib plausible LeanSearchClient importGraph proofwidgets aesop Qq batteries Cli) and ../raymond-core/.lake/packages/leancert; scripts/build_chunks.sh F2 3; scripts/build_chunks.sh R78 3; lake build; lake env lean scripts/AxiomsCheck.lean; scripts/check-oai.sh; lake env lean scripts/NegativeControl.lean',

  verdict: 'Lean-checked, conditional: under RaymondChainHyps and the run\'s TableHyps, Lean proves Λ ≤ 0.116091488672439 (F2) and Λ ≤ 0.118505710922701 '
    + '(Raymond chain), with the 7/8 start from the openai/math theorem (local build only, not peer-reviewed). The analytic hypotheses and table entries '
    + 'are not Lean-checked, so this is a conditional value, not a bound. PT Lambda <= 0.2 stands; RH is open; NO QED.',
});

const L = QRH_LAMBDA_LEAN;

export const QRH_LAMBDA_LEAN_ASSERTIONS = Object.freeze([
  {
    id: 'qrhl-values-exact',
    holds: () => dec15(L.values.F2.exact) === L.values.F2.dec && dec15(L.values.R78.exact) === L.values.R78.dec
      && cmp(L.values.F2.exact, L.values.R78.exact) < 0 && cmp('1/10', L.values.F2.exact) < 0 && cmp(L.values.R78.exact, '1/5') < 0
      && cmp(L.values.R78.exact, '41/250') < 0,
    why: 'Both values are exact 15-digit rationals; 0.1 < F2 < R78 < 41/250 < 0.2.',
  },
  {
    id: 'qrhl-theorem-literals',
    holds: () => /116091488672439 \/ 10 \^ 15/.test(L.theorems[0].statement) && /118505710922701 \/ 10 \^ 15/.test(L.theorems[2].statement)
      && L.theorems[0].statement.includes(L.values.F2.exact.split('/')[0]) && L.theorems.slice(0, 3).every((t) => /RaymondChainHyps/.test(t.statement))
      && !L.theorems.some((t) => /deBruijnNewmanUpper/.test(t.statement)),
    why: 'The headline Lean statements carry the recorded numerators, take RaymondChainHyps, and use the renamed deBruijnNewmanLambda.',
  },
  {
    id: 'qrhl-chunk-counts',
    holds: () => ['F2', 'R78'].every((k) => { const v = L.values[k]; return Math.ceil((v.substeps - 1) / v.chunkSize) === v.chunks && v.terminal.n === v.substeps - 1; })
      && L.values.F2.chunkLevelRuns === L.values.F2.consumerRuns + (L.values.F2.chunks - 1)
      && L.values.R78.kernelSplit.kernel4 + L.values.R78.kernelSplit.kernel5 === L.values.R78.substeps
      && L.kernelCost.F2.chunks === L.values.F2.chunks && L.kernelCost.R78.chunks === L.values.R78.chunks,
    why: 'Substeps 1..N−1 in chunks of 2000 give 30 (F2) and 31 (R78) chunks after the first substep; terminal n = N − 1; 566 + 29 = 595 chunk-level runs; R78 kernel split sums to 60,675.',
  },
  {
    id: 'qrhl-axiom-audit',
    holds: () => { const a = L.axiomAudit; return a.total === a.libraryTheorems + a.oaiTheorems && a.libraryStandard + a.noAxioms.length === a.libraryTheorems
      && a.oaiStandard === a.oaiTheorems && a.sorry === 0 && a.nativeDecide === 0 && a.axiomDeclarations === 0
      && a.standard.join(',') === 'propext,Classical.choice,Quot.sound'; },
    why: '126 theorems = 121 library + 5 openai/math-dependent; 125 depend on exactly propext, Classical.choice, Quot.sound and two96_pos on none; no sorry, native_decide or axiom declarations.',
  },
  {
    id: 'qrhl-hypotheses-named',
    holds: () => { const n = L.namedHypotheses.map((h) => h.name);
      return n.length === 5 && ['head_wall', 'first_contact', 'contact_exclusion', 'floors_valid', 'kernels_valid'].every((k) => n.some((x) => x.endsWith(k)))
        && /0\.0023/.test(L.namedHypotheses[3].source) && /PT/.test(L.namedHypotheses[0].source)
        && /not peer-reviewed/.test(L.externalInput) && /comparator/.test(L.externalInput); },
    why: 'Three RaymondChainHyps fields and two TableHyps fields are listed with sources; the r2 measured allowance, PT inside head_wall and the openai/math status are disclosed.',
  },
  {
    id: 'qrhl-referee',
    holds: () => L.referee.refuted === false && L.referee.corrections.length === 5 && /E6/.test(L.referee.corrections[0])
      && /deBruijnNewmanLambda/.test(L.referee.corrections[1]) && /595/.test(L.referee.corrections[2])
      && L.kernelCost.F2.refereeSumS < L.kernelCost.F2.sumS * 1.5 && L.kernelCost.R78.refereeSumS < L.kernelCost.R78.sumS * 1.5,
    why: 'Referee not refuted (minor); five corrections recorded; the independent rebuild times are consistent with the reported ones.',
  },
  {
    id: 'qrhl-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(L.verdict) && /NO QED/.test(L.verdict) && /not a bound/.test(L.verdict)
      && /PT Lambda <= 0\.2 stands/.test(L.headline) && /NO QED/.test(L.headline) && /not peer-reviewed/.test(L.headline)
      && L.effortToFinish.length === 6 && /not measurements/.test(L.effortNote),
    why: 'Verdict and headline: conditional value, not a bound; PT Λ ≤ 0.2 stands; NO QED; the half-plane is flagged not peer-reviewed; effort figures labelled as judgements.',
  },
]);

export default QRH_LAMBDA_LEAN;
