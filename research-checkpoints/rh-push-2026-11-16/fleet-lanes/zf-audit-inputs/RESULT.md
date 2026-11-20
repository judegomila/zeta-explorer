# zf-audit-inputs: audit of the 7/8 half-plane and the unrefereed inputs below it

Status: internal working note, 2026-11-16. Unrefereed. Nothing here is a new zero-free region or a new Lambda bound.
RH open, no QED. Labels: PROVED (checked here, exact or by the Lean kernel), CLASSICAL, MEASURED (numerical),
READ (statement compared with its source by reading), OPEN / NOT VERIFIED.

## 0. Plan; what is new relative to the atlas and earlier notes

Atlas section 10 and `formalization/paper/zf-campaign-*.md` take the 7/8 theorem as correct and import Xu-Sang
(arXiv:2610.15291v2) through PR #14 without having the source text ("not on this machine"). The paper record
`papers/lambda-qrh-0.116091/` lists as "not done": the Hecke comparator statement, any kernel replay of the
openai/math closure. This audit does three things that were not on record:

1. re-runs the axiom check today against the built workspace, adds the Hecke-family statement, and runs a bounded
   `leanchecker` replay of the top of the import cone;
2. reads the Xu-Sang v2 source itself (downloaded to `src-xs/`), compares its imported statements with the 7/8
   manuscript line by line, and re-derives its exponent algebra and exact certificates by hand / exact arithmetic;
3. compares the kappa-range of the Lean plain-moment theorem with the range Xu-Sang needs.

Inputs audited (the chain "below 7/8" and the Lambda chain):

| id | input | used by |
|---|---|---|
| H1 | zeta, Dirichlet L (and Hecke L over Q(sqrt -3)) nonzero on Re s > 7/8, openai/math family 003 | everything |
| XS | Xu-Sang v2: 7/8 + "analytic inputs of [OAI26]" => B_0 = 69991/80000 => B_1 = 0.8748867 | PR #14 B = 0.87488665, Liu 2610.26835 B_flat |
| H2 | Raymond decreasing-barrier chain (Zenodo 10.5281/zenodo.22867547), hypotheses W / FC / CE and tables J / K | Lambda <= 0.118506 / 0.116091 |

## 1. H1: the Lean build. Every axiom / sorry / assumption

Workspace `~/lean-deps/qrh-verify/lean` (copy of openai/math `lean/` at `adc7f1241`), Lean 4.34.1, Mathlib
`d13f23b723b8`. All commands run today from this directory; logs are next to this file.

| check | result | label |
|---|---|---|
| `Nonvanishing.olean` sha256 | `adeff7db...d499fdc`, equal to the value recorded 2026-10-07 | PROVED (hash equality) |
| no OAI source newer than the final olean | 0 files | PROVED |
| Mathlib checkout | HEAD `d13f23b7...`, `git status` clean; the 24 patches touch other packages only | PROVED |
| `#print axioms OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` (`ax-oai.out`) | `[propext, Classical.choice, Quot.sound]` | PROVED |
| `#print axioms OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re` | same three | PROVED |
| statement | `forall {s : C}, 7/8 < s.re -> riemannZeta s != 0`; `riemannZeta` is Mathlib's `HurwitzZeta.hurwitzZetaEven 0` | PROVED |
| import closure (BFS from the final module, `closure-bfs.txt`) | 2924 OAI modules; outside OAI and Mathlib only `PrimeNumberTheoremAnd.Wiener`, `RellichKondrachov...Rellich`, `Lean.Elab.Tactic.Omega` | PROVED |
| source scan of `OAI/NumberTheory/DirichletL` (2926 files, 486,558 lines) for `sorry`, `axiom`, `native_decide`, `skipKernelTC`, `debug.`, `implemented_by`, `unsafe`, `ofReduceBool`, `run_cmd`, `elab`, `macro`, `syntax`, `initialize`, `addDecl` | 0 hits | PROVED |
| **new:** Hecke family `OAI.SevenEighths.HeckeFamily.LFunction_ne_zero_of_seven_eighths_lt_re` and the ray-family form (`AxHecke.lean`, `ax-hecke.out`) | the two modules `Hecke/ConditionalNonvanishing` (21 lines) and `Hecke/Nonvanishing` (47 lines) were not in the 2026-10-07 build; their text, inlined verbatim, elaborates against the built closure; axioms `[propext, Classical.choice, Quot.sound]` | PROVED |
| **new:** `leanchecker` kernel replay | see section 1.1 | PROVED for the modules listed there only |
| `QrhLambdaOAI/Main78.lean` re-run (`ax-qrh-main78.out`) | 5 theorems, the same three axioms | PROVED |
| qrh-lambda and raymond-core source scan (incl. 61 chunk files) | no `sorry`, `axiom`, `native_decide` | PROVED |

Assumptions the Lean result still rests on (complete list):

1. The Lean 4.34.1 kernel as run during the 2026-10-07 build (the olean files are trusted by `#print axioms`; only
   the modules in 1.1 were replayed by a second pass).
2. Mathlib's definition of `riemannZeta` and `DirichletCharacter.LFunction` (not shadowed; CLASSICAL).
3. For the Hecke statement only: `HeckeFamily.LFunction` is an OAI definition (`HeckeTheta.latticeL` of the
   coefficient lattice, divided by 6), not a Mathlib one. The theorem text equals the comparator file's text, but the
   two definition chains were not compared as `Expr`s and the definition was not proved equal to the Hecke Dirichlet
   series here. NOT VERIFIED (definition faithfulness).
4. Not done: official comparator run (Linux `landrun`), full-closure replay (about 10 CPU-hours), nanoda, refereeing
   of the manuscript.

There is no `axiom` declaration and no `sorry` in the dependency cone of the zeta, Dirichlet or Hecke theorem.

### 1.1 Kernel replay (bounded)

`leanchecker OAI.NumberTheory.DirichletL.Nonvanishing OAI.NumberTheory.DirichletL.Detector.FinalAssemblyUnconditional`:
exit 0 (31 s; `leanchecker-top.out`). A second pass over the closure in BFS order from the final module, one module
per process, under a 9-minute budget: 6 modules replayed, 6 passed, 0 failed (`Nonvanishing`, `Foundation`, `Detector.FinalAssemblyUnconditional`, `Arithmetic.EisensteinCoordinates`, `Mellin.ExponentialSmoothing`, `Mellin.LogProfiles`); that is 6 of 2924 (log `leanchecker-bfs.log`). A first attempt in batches of 100
modules did not finish one batch in 600 s and was stopped; it produced no verdict. The full closure was not replayed.

### 1.2 Structure of the Lean proof that matters downstream

`DetectorCertifiedBands` is stated under `7/8 < HeckeZeroSupremum.beta` and the final assembly instantiates the
plain-moment parameter at `kappaPlain = 3/4 + 2(beta - 7/8) = 2 beta - 1`. The reusable Lean form of the manuscript's
Lemma 18.1 is `CenteredMomentEnergyCertifiedExistence.terminal_certificate`, with hypotheses

    (hk0 : (3/4 : R) <= kappa)   (hbeta : 51/100 <= beta)   (hk : 2*beta - 1 <= kappa)

So the Lean library covers the plain moment at kappa = 3/4 given beta <= 7/8 (READ), and does not cover any
kappa < 3/4 (PROVED by the signature).

## 2. XS: Xu-Sang v2 against its source

Source: `src-xs/xs-v2.html` and the text extraction `src-xs/xs-v2.txt` (arXiv HTML, v2 of 15 Oct 2026). The theorem is
conditional by its own statement: "Assume the analytic inputs of [OAI26] recorded in Section 2, including the
family-wide 7/8 zero-free half-plane." Its AI-use paragraph says the imported proofs "have not been independently
verified here".

### 2.1 Imported statements vs the 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`)

| Xu-Sang use | manuscript statement | match |
|---|---|---|
| (4) marked inverse moment, margins `r + 2z < m`, `2r + 8z < 3m` | Lemma 17.1 (l.6957): `r + 2z <= m - c1`, `2r + 8z <= 3m - c2` | READ, equal |
| (5) `e(r) = max{1, (1+5r)/6}` | Lemma 17.6 (l.9235), (17.88) | READ, equal |
| (6)-(7) plain fourth moment, `m1 + m2 + 6 kappa z <= 1`, `beta_* <= (1+kappa)/2`, `3/4 <= kappa <= 1`, slot coefficients in Theta, inducing character outside Theta | Lemma 18.1 (l.9354), (18.3) | READ, equal |
| (9) simultaneous witnesses for `t in [1, 3/2]` | Proposition 8.3 (l.3557), (8.3)-(8.4) | READ, equal |
| completed-row norm `L_l(d) = (5l + d - 1)_+ / 4` | Lemma 15.1 (l.6131) is stated only at `l = 1/6`: exponent `((d - 1/6)/4)_+`; the general-`l` branch `1 + 3l' - 2M' - 2 Delta_H` appears inside its proof (l.6276) | consistent at `l = 1/6`; general `l` NOT VERIFIED |
| additive Gram bound with `P_a^{1/6}` | Proposition 15.2 (l.6297) | READ (statement), range of use not re-checked |

### 2.2 Algebra re-derived by hand (all PROVED, elementary)

* (12): `C_b(B(l)) = l_x/2 + b/12` with `B(l) = 11/12 - l/4`.
* (17): `-d + (5l + d - 1)_+/8 <= -7d/8` for `l <= 1/5`.
* Proposition 4.1: `A_I(r) = 1 - delta{x + (1-x) r}` from (4) with `z = (1-r)/2`; `A_P(m) = 1 - delta{cx + (2 - 2cx) m}`
  from (6) with `z = (1-2m)/(6 kappa)`; crossing `r_*`; `R_sh(t) = 1 - delta + delta (P/D)(3/2 - t)`;
  `R_long(t) = 1 - delta + (5/6 - delta)(t - 1)` from (5); balance at `t_*` gives (21). Supply checks:
  `(1-r)/2 <= 1/5 < 21/100` and `(1-2m)/(6 kappa) <= 1/(18 kappa)`.
* Proposition 5.1: (23); Hoelder step (26); full-capacity identity
  `R + (1/2 - theta) m_0 - (3R+1)/4 + theta/2 = (R - (6 kappa - 2q) L)/4`.
* (28) equals (27) at `d = h` with `theta = q/(6 kappa)`; `C_0 = -1/4 + b/6 + 5l/4`.
* Licensing identities (36): `(1 + 3/4)/2 = 7/8`, `(1 + 29991/40000)/2 = 69991/80000 = B_0`.

### 2.3 Certificates (PROVED by exact rational arithmetic, `xs_identity_check.py`, `xs_cert_check.py`)

* The polynomial identity (40), `2 Lambda_j J (-E_j - g_j) = A_j delta^2 + B_j delta + C_j`, holds exactly for
  j = 0, 1 (checked on a 6 x 7 rational grid, which determines a polynomial of degree (2, 3)).
* `4 A_j C_j - B_j^2` has the printed coefficients `d_{j,r}`; all coefficients of `A_j` and of the discriminant
  are positive. Hence `E_j < -g_j` on the whole rectangle `1/8 <= delta <= 5/6`, `0 <= x <= 1/2`.
* MEASURED cross-check: max `E_0 = -2.224e-6` and max `E_1 = -2.195e-7`, both at `x = 1/2`, `delta = 0.46939` /
  `0.46935` (the binding bin found independently in `zf-campaign-high-side.md`).
* Scalar conditions `l_x > l`, `l_y - l > 11b/6`, `6 kappa l > 3/4`, `l/(h + zeta) > 21/100`, `B > 87/100`: true
  at both triples.

### 2.4 Appendix A (kappa down to 13/18)

The manuscript proof of Lemma 18.1 (l.9354-11000) mentions kappa in exactly five places: the prime bound (18.12),
the terminal cap (18.13), the centred comparison (`6 kappa - 1 >= 7/2`, `z < M/21 < M/20`, (18.15)-(18.16)), the
child repair (`6 kappa d` against `kappa d`), and the support error (`0 <= 6 kappa - 1 <= 5`). Xu-Sang's Appendix A
lists the same five. Re-derived at `kappa >= 13/18` (`6 kappa - 1 >= 10/3`):

* `z <= M/(6 kappa) <= 3M/13`, `kappa z <= M/6`;
* `(6 kappa - 1) z < M/6` gives `z < M/20` (the bound the manuscript uses afterwards); `A - z > 47M/60 > 2L`;
* `A_comp <= 23M/30 + xi` and `A_comp + (6 kappa - 1) z <= 14M/15 + xi`: both M/15 reserves are unchanged.

PROVED relative to the manuscript text. 13/18 is exactly the value at which `z < M/20` survives. Not covered: any
kappa-dependence that the manuscript proof does not display, and the Lean proof (which assumes `3/4 <= kappa`).

### 2.5 Not verified here

* Proposition 3.1 direct estimate for `1/6 < l <= 1/5`: a re-run of the proofs of manuscript Lemma 14.3 / 15.1 /
  Proposition 15.2-15.3 at a geometry the manuscript does not state.
* Appendix B (approximate functional equation with row-dependent conductors by Sobolev in `log Q`), Appendix C
  (Euler region lowered from 7/8 to 87/100, Lemma 6.2, Lemma C.1), Appendix E-F (remaining rows, order of choices).
* The manuscript-level proofs of Lemmas 14.3, 17.1, 17.6, 18.1 and Propositions 8.3, 15.2. The Lean theorem proves
  the conclusion of the 7/8 paper; its intermediate Lean statements were not matched to these numbered statements,
  except Lemma 18.1 (section 1.2).

No error was found in any step that was checked.

## 3. H2: Raymond chain

* PROVED (Lean, re-run today): from `RaymondChainHyps` (W, FC, CE) and `TableHyps` (J, K) plus H1, the two values
  `118505710922701/10^15` and `116091488672439/10^15`.
* PROVED (arithmetic): `|Im z| <= 2 theta - 1 = 3/4` at t = 0; starts `5625001/10^7` and `281251/500000` exceed
  9/16; `(X+1)/2 = 3000000092914`; Platt-Trudgian height 3000175332800; clearance 175,239,886.
* CLASSICAL: the terminal step `Lambda <= T + q/2` (de Bruijn). FC follows from Hurwitz plus a locally uniform bound
  on nonreal zeros for t > 0 (attributed to Polymath15 Thm 1.5(i) in `Hyps.lean`; recalled, not re-read here); under RH all three chain hypotheses hold trivially, so they are consistent
  unless RH is false.
* NOT VERIFIED here: W, FC, CE as unconditional statements; (J) for 468 + 476 floor entries; (K) for 59 + 2 kernel
  rows; for value (ii) the measured 0.0023 time-box allowance and the unreviewed r2 L-slope lemma. The Zenodo record
  could not be fetched in this session (connection timeout). The only reviews are the two internal passes.

## 4. Verdict per input

| input | verdict |
|---|---|
| H1 zeta / Dirichlet, Re s > 7/8 | **verified** as a Lean theorem with standard axioms (assumptions 1-2 of section 1). Manuscript not refereed. |
| H1 Hecke family over Q(sqrt -3) | **verified** in Lean for the OAI-defined `HeckeFamily.LFunction`; definition faithfulness **cannot verify here**. |
| XS stage 0: 7/8 => B_0 = 0.8748875 (kappa = 3/4) | **cannot verify here**. Checked: algebra, exact certificate, statement match of imports, Lean coverage of the plain moment at kappa = 3/4. Unchecked: section 2.5. No gap located. |
| XS stage 1: B_0 => B_1 = 0.8748867 (kappa = 29991/40000) | **gap at Lemma 2.1 / Appendix A** relative to the Lean-checked base: the Lean plain moment requires `3/4 <= kappa`; the extension to 13/18 is a hand re-check of five displayed inequalities (which do hold). Worth 8e-7 in B. |
| PR #14 B = 0.87488665; Liu 2610.26835 B_flat = 0.874886647 | inherit XS stage 0 and stage 1 (any kappa < 3/4). Not audited beyond that. |
| H2 Raymond (W, FC, CE, J, K) | **cannot verify here**; deduction from the named hypotheses verified in Lean. |

## 5. DH control

Davenport-Heilbronn is a fixed linear combination of two Dirichlet L-functions mod 5. H1 states nonvanishing for
each L(s, chi) separately and says nothing about a linear combination, so no statement audited here applies to DH.
Inside the proofs the Euler product enters at: (a) the Poisson row u = 1 carries `H_eta(s)/L^S_F(s, eta)` with
`H_eta` an Euler product of local factors (manuscript Lemma 7.1; Xu-Sang (18)-(19)), i.e. the reciprocal is a
Dirichlet series with multiplicative, bounded coefficients; (b) the inverse witnesses `M_psi` have Moebius
coefficients (Proposition 8.3); (c) the prime polynomials are bounded through `L'/L` on `Re s = (1+kappa)/2 + e`
(manuscript (18.11)-(18.12)); (d) multiplicativity of the row characters in (18.4). For DH, 1/f is not a Dirichlet
series with such coefficients and (a)-(d) all fail.

## 6. Three weakest steps of this audit

1. `#print axioms` reads olean files; outside the modules of section 1.1 the kernel pass is the single one of
   2026-10-07. A full `leanchecker` run of the 2924-module closure is still outstanding.
2. The Xu-Sang verdict rests on reading: the statement match in 2.1 compares manuscript statements, not Lean
   statements, and the items in 2.5 (in particular the low estimate for l > 1/6) were not re-derived.
3. The Hecke theorem is about an OAI-defined L-function; its identification with the classical Hecke L-function
   was not checked.

## 7. Files

`ax-oai.out`, `AxOAI.lean`, `ax-hecke.out`, `AxHecke.lean`, `hecke-src/`, `ax-qrh-main78.out`, `leanchecker-top.out`,
`leanchecker-bfs.log`, `closure-bfs.txt`, `closure-modules.txt`, `xs_cert_check.py`, `xs_identity_check.py`,
`src-xs/xs-v2.{html,txt}`.
