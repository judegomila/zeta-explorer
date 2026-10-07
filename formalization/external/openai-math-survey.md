# OpenAI math release (github.com/openai/math, 2026-10-06): survey for this project

Written 2026-10-07. Source: the release README/CONTENTS (722 manuscripts, 372 families; map at /tmp/openai-contents.md),
the per-family Lean scope notes `lean/docs/<id>.md`, the comparator statements `lean/ComparatorChallenges/*.lean|json`,
and the first pages of the 003, 005 and 017 manuscripts. The release README states that unformalized results may contain
errors. Nothing in this note has been refereed by us. We have **not** built or run any of the release's Lean code.

**Update 2026-10-07 (later the same day).** The 003 ζ and Dirichlet 7/8 theorems have since been built locally
(`lake build`, `#print axioms` = propext, Classical.choice, Quot.sound; statement matched to the comparator challenge by
hand; official comparator and lean4checker not run): see `openai-math-qrh-verification.md`. Read "(not compiled)" below as
superseded for those two statements only. The single-band route-P and Raymond-chain values with the 7/8 start were refereed
once internally; corrected values and conditions are in `src/data/openai-math-integration-2026-10-08.js`.

Status words: **proved** (by us, written), **certified** (interval/exact computation, ours), **conditional**, **measured**,
**heuristic**, **claimed (OAI)** = stated in the release, **claimed + Lean (OAI)** = stated in the release with a Lean
comparator statement and a solution module whose sources contain no `sorry`/`admit` and no `axiom` declarations (grep of
the shallow clone, 2026-10-07 11:22; the solution module was not compiled and `#print axioms` was not run by us).

Project frame (unchanged by this note): PT Λ ≤ 0.2 is the accepted benchmark. Route P joint value Λ ≤ 0.145276368594868
at PT height (`src/data/lambda-levers-combined-2026-10-09.js`), conditional on Raymond's chain (G0-c open: no non-project
reader) and the internal ledger. Raymond's preprint value 0.149396 (Zenodo 22867547) is unrefereed. RH is open.

---

## 0. Main findings

1. **Family 003 (quasi-Riemann hypothesis), claimed + Lean (OAI).** ζ(s) ≠ 0 and L(s, χ) ≠ 0 for every Dirichlet χ
   in Re s > 7/8 (Hecke L-functions over Q(√−3) also), plus a uniform Landau–Siegel gap (1 − β) log q ≥ c (c not
   explicit). Comparator statement for ζ: `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re {s : ℂ} (hs : (7/8:ℝ) < s.re) :
   riemannZeta s ≠ 0`, solution module `OAI.NumberTheory.DirichletL.Nonvanishing`; the `OAI/NumberTheory/DirichletL`
   tree has 2,926 files / 486,558 lines, 0 sorry files, 0 axiom declarations (grep). Permitted axioms in the comparator:
   propext, Quot.sound, Classical.choice (so `native_decide` / `Lean.ofReduceBool` would be rejected).
2. **What 003 gives for Λ by itself (conditional on 003, elementary).** In the Polymath15 normalisation
   H_0(z) = ξ(1/2 + iz/2)/8, a zero ρ = σ + iγ sits at z = 2γ − i(2σ − 1), so |Im z| = |2σ − 1| ≤ 3/4 for every zero.
   De Bruijn (1950, Thm 13) then gives **Λ ≤ (3/4)²/2 = 9/32 = 0.28125** with no verified height at all (the classical
   strip |Im z| ≤ 1 gives 1/2). This does not beat 0.2. It is a new anchor for route 50 (verified-height-free Λ curve).
   In the Polymath15 fixed-time theorem 003 only removes the trivial top of the y-range; it does not touch the binding
   input (verified height), so it gives nothing at PT height through that theorem (Λ ≤ t0 + y0²/2 with
   y0² = 9/16 − 2t0 returns 9/32 for every t0).
3. **Where 003 does bite: the band start of the Raymond / route-P barrier argument.** Theorem BB (formalization/paper/
   lemma-B-two-band.md §6.1) starts band 1 at q0 > q_MTY(x_L) = (1 − 2/(5.558691 log(x_L/2)))² ≈ 0.9755 (Mossinghoff–
   Trudgian–Yang, ledger item MTY) and band 2 at q0 > 1; Raymond's own 0.149396 starts at q0 = (1.000001)² from the
   classical strip |Im z| ≤ 1. Under 003 every zero of H_0 has y² ≤ 9/16, so both bands may
   start at q0 = 9/16 + 2·10⁻⁶. The barrier then has to descend from 0.5625 instead of 0.9755. **Measured (§3):** route-P
   band 1 with this start ends at Λ ≤ 0.117708313410954 (exact consumer, E1–E7 0 failures), against 0.145276368594868
   with the MTY start; a sibling replay of Raymond's chain gives 0.118505710922701 (his strip value 0.149395073827688
   reproduced exactly). Both are conditional on 003 and on the respective chains; the route-P figure is band 1 only.
4. **Families 005 (Catalan's constant G is irrational) and 017 (irrationality exponent of π is 2), both claimed + Lean
   (OAI).** Our /catalan-signed-ladder, /irrationality-pipeline and ~67 data modules state "Catalan G irrationality OPEN".
   That remains true as a statement about refereed mathematics, but it is now stale as a description of the literature:
   a Lean comparator statement `OAI.InternalCatalan.catalan_irrational : Irrational (∑' j, (-1)^j / (2j+1)^2)` with a
   sorry-free solution tree (981 files) is public. 005's mechanism (determinants Δ_N of size 48N whose rows have high Taylor
   contact so that the ζ(2) column cancels in every entry) is a direct answer to our "π-column is forced, every removal
   mechanism stalls" obstruction, which was proved only for the mechanisms we listed.
5. **Raymond's chain (user question 2).** No family in the release addresses Raymond's chain, the de Bruijn–Newman
   constant, Polymath15, or barrier arguments. G0-c (Raymond Lemmas 2–4 / Theorem 4′) stays open on the ledger for the
   same reason as before: internal re-derivation found no defect, no non-project reader.

---

## 1. Relevant families

Lean column: "Lean" = comparator statement + solution tree in the release (not compiled by us); "partial Lean" = the Lean
statement is a corollary or supporting statement only (per `lean/docs/<id>.md`); "none" = no Lean doc.

| id | claim (release wording, shortened) | Lean | bearing on our routes | concrete action |
|---|---|---|---|---|
| **003** | ζ and all Dirichlet L zero-free in Re s > 7/8; same for finite-order Hecke L over Q(√−3); alternate proof of 11/12 (paper2, human-assisted writeup); uniform Siegel gap (1−β) log q ≥ c; corollaries: least quadratic nonresidue n(p) ≤ C(log p)^A, deterministic square roots mod p | Lean: QuasiRiemannHypothesis, DirichletSevenEighths, HeckeSevenEighths, SiegelZeros (four comparator files) | Λ: 9/32 anchor (route 50, route 20); band start q0 = 9/16 for Theorem BB (routes 1, 2, 5, 8, 9 and Raymond's own value); E_trunc density tails (imp-124775, fixed strip σ = 3/4) lose the σ > 7/8 part; routes 14 (family Weil positivity over Dirichlet twists) and 15 (Epstein: ζ_{Q(√−3)} = ζ·L(χ₋₃) is covered); rh-landscape-dag walls `wall-siegel-zero`, `zfr-classical`, `zfr-vk` | verify the comparator (Action 1); re-run every band with the QRH start (Action 2); write the 9/32 anchor (Action 4) |
| **005** | G = β(2) irrational | Lean: Catalan | /catalan-signed-ladder verdict "open"; period-dimension obstruction (dim 5 with forced π-column); /irrationality-pipeline row "G = β(2): OPEN" | numerically reproduce the Δ_N ζ(2)-cancellation at small N (mpmath/flint, cheap); re-state our obstruction as "obstruction for the listed mechanisms"; status update (Action 5) |
| **017** | irrationality exponent μ(π) = 2; Flint–Hills series converges | Lean: PiExponent | /irrationality-pipeline context (the release cites 7.1032, Zeilberger–Zudilin, as the prior record) | no site statement to correct (grep); optional literature entry |
| **007** | ordinary (not log-averaged) two-point Chowla: Σλ(L1(n))λ(L2(n)) = O(X/(log X)^c); binary corrected Elliott under uniform nonpretentiousness | Lean: OrdinaryElliott, OrdinaryTwoPointCorrelations | parity-barrier / Theorem U concept pages; HistoryPage's "Tao log-averaged Chowla" entry is now not the latest; no Λ lever | status update in literature.js / HistoryPage; check whether Theorem U's statement cites two-point Chowla as open |
| **023** | Patterson's first moment for cubic Gauss sums, unconditional | Lean: PattersonFirstMoment | same automorphic objects (Kubota/Patterson cubic theta) as the 003 proof; 003 says it does not use 023 | read only if auditing 003 |
| **011** | prime factors of p−1 → Poisson–Dirichlet PD(1); μ(p−1) = 1 infinitely often; Erdős totient-fibre conjecture | none | parity-type statements at shifted primes; no Λ lever | none beyond a literature entry |
| **029** | Artin's primitive-root conjecture (infinitude) for every admissible base, ≥ c_a x/(log x)² primes in (x, 2x) | none | historically GRH-conditional (Hooley); worth checking whether the proof uses 003 | literature entry; check dependency on 003 |
| **026** | positive lower density of prime gaps > C log p_n; p_n/n increases on a positive-density set | partial Lean (prime-ratio corollary only) | prime-gap pages, if any | literature entry |
| **021** | Jacobsthal h(k) ≪ k²/(log log 3k)² | Lean: Jacobsthal, JacobsthalImproved | none direct | none |
| **012, 013, 020, 024, 028, 159, 182** | joint Dickman; Ostmann inverse Goldbach; power-free polynomial values; totient count asymptotic; Gaussian moat; Erdős reciprocal-sum (APs); square-difference power saving | Lean (all) | multiplicative/additive number theory context only | literature entries |
| **014** | function-field generic Ramanujan, restricted geometric Langlands | none | route 27 (function-field twin ladder: Ramanujan/RH proved there) — background only | none |
| **002, 006** | full BSD in Selmer corank ≤ 1; Goldfeld density 1/2 | none | L-function central values; no Λ lever | none |
| **008** | Deligne–Drinfeld (grt freely generated in odd weights 3, 5, 7, …) | Lean: DeligneDrinfeld | motivic side of the Catalan / odd-zeta period-dimension discussion (MZV algebra); indirect | none now |
| **090** | triangular-lattice universal optimality; sharp Cohn–Elkies certificate for planar packing, global sign conditions proved by interval arithmetic, formalized | Lean: AtomicGaussian, TriangularEnergy, TriangularGaussian, PlanarPacking | method template: Lean-checked positive-Fourier-transform certificates are the same shape as our Route I Toeplitz–Krein / dual certificates (positive-definite extension, sign conditions on intervals) | read the Lean encoding of the interval sign proofs as a template for route 41 (Lean replay of Arb certificates) |
| **178, 219, 239** | deterministic Ramanujan graphs; GOE bulk universality for random regular graphs; sharp singularity rate of symmetric sign matrices | none | routes 23 and 33 (random-matrix comparisons) — background only | none |
| **261, 325** | Anderson model spectrum (Lean: spectral set only); complete Crouzeix (Lean) | partial / Lean | spectral and operator-theory context (route group F) | none |
| **076** | ultraflat real Littlewood polynomials | Lean | Dirichlet-polynomial flatness intuition only | none |
| **Lean infrastructure** | `OAI/NumberTheory/DirichletL` (Hecke L over Q(√−3), large sieves, Mellin/contour machinery), `SiegelZeros`, `PiExponent`; dependencies `leancert` (interval arithmetic), `PrimeCert`, `PrimeNumberTheoremAnd`, `StrongPNT`, `Zeta3Irrational`, `carleson` | toolchain leanprover/lean4:v4.34.1, Mathlib d13f23b (ours: v4.22) | route 10 (Lean core of Raymond's chain), route 39 (Weil explicit formula + small-support positivity), route 41 (Lean replay of Arb certificates) | evaluate `leancert` for route 41 before writing our own; reuse the Mellin/contour lemmas for route 39 (port cost v4.22 → v4.34 is the main expense) |

Families scanned and judged not relevant: the remaining ~340 (algebraic geometry, Langlands over function fields beyond
014, combinatorics, complexity, probability/spin glasses, operator algebras, topology, geometry, PDE).

---

## 2. Top 10 actions, ranked by expected value for this project

1. **Verify the 003 comparator statements locally** (QuasiRiemannHypothesis, DirichletSevenEighths, SiegelZeros).
   Everything in Actions 2–4 is conditional on 003. Cost: Lean v4.34.1 + Mathlib cache + building a 2,926-file tree;
   the Lean task budget (≤ 4 processes, ≤ 16 GB) applies; run only when load allows. Caveat: the comparator tool uses
   `landrun` (Linux Landlock sandbox), so on this Mac the faithful check needs a Linux container or VM; the local fallback
   is `lake build OAI.NumberTheory.DirichletL.Nonvanishing` plus `#print axioms OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`
   and a statement diff against the challenge file. Outcome: 003 moves from "claimed + Lean (OAI)" to "Lean-checked by us".
2. **Re-run route P with the QRH band start q0 = 9/16 + 2·10⁻⁶** (band 1 done as a projection, §3; bands 2 and 3 of the
   3-band layout still to do — their U2 / X165mid tables were deleted after the 2026-10-01 replays and must be rebuilt).
   Then add a ledger item "QRH-start" (conditional on 003, replaces MTY for band 1 and the q0 > 1 start for band 2).
   Can push the conditional route-P value from 0.145276 to 0.117708 (§3) if bands 2 and 3 end at or below band 1, or
   use the sibling single-band run (`tmp/oai-lambda-routeP.py`) if its single-band justification survives a referee.
3. **Recompute Raymond's own architecture with the QRH start.** His 0.149396 starts from "the classical width-one zero
   strip at time zero", q0 = (1.000001)² > 1, qe = 10⁻⁸ (tmp/raymond-22867547/Analytic_Foundations.txt l.126, 145;
   Correlated_Translated_Probes.txt l.451). Replacing q0 by 9/16 + ε is a one-constant change to his verification run
   (Verification_Guide, data/PLAN.json). This is the fair comparison for "does our work beat his result": both values
   move, and the gap is what matters.
4. **Write the 9/32 anchor** (conditional on 003): Λ ≤ 9/32 = 0.28125 with no verified height, via de Bruijn Thm 13.
   Record it in route 50's curve and route 20's module as the verified-height-free floor of the method (it does not
   beat 0.2). Half a page; the normalisation check is in §0 item 2.
5. **Status updates on the site** (§4 list): Catalan (005), π exponent (017), zero-free half-plane / Siegel zeros (003),
   ordinary two-point Chowla (007). Wording: "claimed in the OpenAI math release (2026-10-06) with a Lean comparator
   statement; not refereed; not checked by us". Not "proved", not "open".
6. **Catalan cross-check (cheap):** build the 005 determinant Δ_N for N = 1, 2 (size 48, 96) with mpmath at high precision
   and confirm the ζ(2) column cancels exactly; then restate the /catalan-signed-ladder obstruction as covering only the
   mechanisms we tested. Settles whether our period-dimension obstruction is contradicted or merely sidestepped.
7. **Route 41 tooling:** evaluate the release's `leancert` dependency and family 090's Lean interval sign proofs as the
   base for Lean replay of our Arb certificates (Route I certificates, band E1–E8 checks).
8. **Route 39 tooling:** reuse the DirichletL Mellin/contour and explicit-formula-type lemmas for the Lean Weil explicit
   formula; requires porting our Lean project to v4.34 or theirs down to v4.22 (estimate the diff before starting).
9. **E_trunc density tail with 003:** in imp-124775 / imp-34791 (fixed strip σ = 3/4, Guth–Maynard tail) the zeros with
   σ > 7/8 vanish under 003. Measure the change; expected small because the tail is dominated by σ near 3/4 (heuristic).
10. **Routes 14 / 15 / generalized Λ_χ:** 003 gives, conditionally, Λ_χ ≤ 9/32 for every primitive Dirichlet χ by the same
    de Bruijn argument applied to Ξ(·, χ) (uniform in q), and covers ζ_{Q(√−3)}. Low cost, map-level value only.

---

## 3. Measured: route-P band 1 with the QRH start

Run: `tmp/oai-survey-qrh/qrh-start-consume.py` — the collect6 joint command of 2026-10-07 (`tmp/routes-b4-rec-joint-run.sh`:
same certfile `routes-b4-rec-joint-out/collect6/merge/certfile_fullref.json`, a1 = 9900000003031.5801, same six route-3
tables, kernels_all5.json) with one change, q0 = 9/16 + 2·10⁻⁶ in place of ⌈q_MTY_upper(a1) + 2·10⁻⁶⌉. Output
`tmp/oai-survey-qrh/QRH_band1_c6.json`, log `tmp/oai-survey-qrh/QRH_band1.log`. E8 (q0 > q_MTY) fails by construction and is
replaced by the 003 condition q0 > 9/16.

**Output (exact consumer, conditional, single run, not refereed):**
U = 58854156705477/500000000000000 = **0.117708313410954** (U_robust identical), terminal at t_K = 30133/256000 (cell 470,
substep 106), 60,267 steps (original start: 74,382), failures: E8-start = 1 only (by construction); E1–E7 and the A/B
generator agreement 0 failures; heights used [89/100, 109/50] inside the H2 range [1/2, 5/2]; no sharp-r2 window option
chosen. Strict-entry check of Raymond's type (q0 − (2 + c·q0)·10⁻⁸ > 9/16), done afterwards in floats with the run-wide
maximum rate c ≈ 19.77: slack 1.87·10⁻⁶ > 0 (measured, not part of the exact run). 1,248 s, one process, < 0.1 GB.

Grade: **conditional + measured.** Conditional on (a) family 003 (Re s > 7/8 zero-free; unverified by us), (b) the whole
route-P ledger (G0-c open, AF gaps, Lemma B as written, producer layer, RH-win, RH-head, …), and (c) bands 2 and 3 of the
3-band layout also ending at or below this value with the same start. (c) is **not** established: the band-2/3 runs need
their U2 / X165mid floor tables rebuilt. Under the old start band 1 bound the joint value (0.145276 vs U2 0.144255); with
the QRH start the ordering is unknown. So this is a band-1 value, not a joint Λ value.

Cross-check from a sibling task in this workflow (not mine, recorded for coordination): `tmp/oai-lambda-raymond.py` replays
Raymond's own chain (tmp/s145-1-g1 regeneration) with the zero-free start; it reproduces his strip value
18674384228461/1.25·10¹⁴ = 0.149395073827688 exactly and gives 0.129826438865344 for θ = 11/12 and **0.118505710922701**
for θ = 7/8 (`tmp/oai-lambda-out/raymond_X1.log`). `tmp/oai-lambda-routeP.py` runs route P as a single band (no band split)
for θ = 7/8, 11/12, 1 and a reproduction lane; results pending at the time of writing (`tmp/oai-lambda-out/routeP_*.json`).
The two route-P framings should agree to within the band-split effect; compare when the sibling run finishes.

Reading: with the 003 start, the route-P band-1 value (0.117708) is 0.000797 below Raymond + 003 (0.118506), compared
with 0.004119 below Raymond under the classical starts. Most of the drop (≈ 0.0276 for route P, ≈ 0.0309 for Raymond)
comes from 003, not from our levers.

---

## 4. Site statements that a family now claims to resolve

None of these should be changed to "proved". Each should say the problem is claimed resolved in the OpenAI release with a
Lean comparator statement, unrefereed, not checked by us.

- **Catalan (005).** src/pages/CatalanSignedLadderPage.jsx (lines 31–32: byline "G irrationality open", ticker
  "irrationality OPEN"; line 130 verdict.open); src/data/catalan-signed-ladder.js (lines 10, 30, 91, 163, assertion at 236
  tests /OPEN/); src/data/irrationality-pipeline.js (lines 94, 103, 121: "G = β(2): OPEN"); src/pages/HomePageEditorial.jsx
  line 53 ("G irrationality open"); src/data/raymond-lambda-note.js lines 25, 34; viz pages Imp95995 (l.107), Imp95771
  (l.96), Imp96016 (l.178), Imp95975 (l.155), Imp96015 (l.130), Imp95792 (l.189); about 67 src/data modules carry the
  boilerplate "Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed" (e.g. imp-95516, imp-95603,
  imp-95966, imp-95842, imp-95802, imp-95984, imp-95979, imp-95683, imp-95669, imp-95653, imp-96025). Note: 005 cites Sun
  and says it uses no result from Sun's preprint.
- **π irrationality exponent (017).** No site statement on μ(π) found by grep. src/pages/OddZetaPage.jsx lines 281–286
  discuss μ(ζ(3)) ≤ 5.51 and "the generic expectation μ = 2" only; nothing to correct, a one-line note is optional.
- **Zero-free regions / quasi-RH (003).** src/data/rh-landscape-dag.js: `zfr-classical` and `zfr-vk` nodes (lines ~94–100)
  present de la Vallée Poussin / Vinogradov–Korobov as the frontier; `wall-siegel-zero` (line 222: "ineffective Siegel
  bounds cannot exclude a real zero near 1"); src/data/concepts-registry.js line 567 (`siegel-zero`: "Not ruled out");
  src/pages/HistoryPage.jsx line 598 ("best known zero-free region, … essentially unimproved for over 60 years").
  No page uses the words "quasi-Riemann".
- **Chowla (007).** src/pages/HistoryPage.jsx lines 690–691 and src/data/literature.js lines 824–867 present the
  log-averaged two-point result as the latest; 007 claims the ordinary-average two-point case.
- **Least quadratic nonresidue (003 corollary).** No site statement found.

---

## 5. Answers to the three user questions, as far as this survey reaches

1. *Back to SOTA by beating Raymond's result?* Route P's conditional value 0.145276 is already below 0.149396. Neither is
   refereed, so neither is the accepted SOTA (PT Λ ≤ 0.2 is). The release gives one new input that lowers both values
   (the QRH start, §0 item 3, §3), conditional on 003: route-P band 1 0.117708 (measured), Raymond + 003 0.118506
   (sibling replay). Anyone holding Raymond's code can make the same substitution, so the start change is not a lever
   specific to us; our margin over Raymond shrinks from 0.0041 to 0.0008 under it.
2. *Raymond's chain checked?* Internally yes (ledger G0-a proved+refereed(internal), G0-d proved+refereed(internal), G0-c
   open for lack of a non-project reader). The release does not touch it. Route 10 (Lean core of the chain) is the way to
   remove the reader dependence; the release's Lean stack is a possible base (Action 8 cost applies).
3. *Another route or combination?* The combination available now is route P (+ campaign, + route 3, + route 5 layout)
   with the QRH start (band 1: 0.117708). It needs Action 1 (verify 003) before it can be stated as anything other than
   conditional, and the band-2/3 re-runs (or the single-band argument) to become a joint value. The levers measured so far
   (route 1 campaign, routes 3, 5, 9) were tuned on the old trajectory (q from 0.976); with the trajectory now starting at
   0.5625 their marginal values have to be re-measured.

Honesty: nothing here proves RH or a new unconditional Λ bound; every Λ number above is conditional on family 003 and on
the route-P ledger; the 003, 005, 017 claims are unrefereed and unchecked by us.
