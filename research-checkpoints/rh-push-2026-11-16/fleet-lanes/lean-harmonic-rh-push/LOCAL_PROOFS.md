# LOCAL_PROOFS: local Lean proofs of the eight statement files

Date: 2026-11-20. Nothing committed or pushed. Nothing in `~/probe428` was modified; no `lake build` was run.

**None of these eight statements bears on whether the Riemann hypothesis is true.** They are finite-dimensional algebra, classical statistical-mechanics input, elementary harmonic analysis and classical facts about zeta(2s)/zeta(s). No bound on Lambda moves. No lane changes status from "unrefereed" to "refereed" through this work: a machine check of a formalized core is not a referee report on the lane.

## Summary

- All eight statement files are proved: 44 theorems, 2576 lines in eight self-contained files (`import Mathlib` only).
- Each file was compiled twice by separate agents (prover, then auditor) with the single-process command `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <file>` on Lean v4.28.0: exit 0, 0 errors in all eight.
- `#print axioms` for every one of the 44 theorems lists only `propext`, `Classical.choice`, `Quot.sound`. No `sorryAx`, no `Lean.ofReduceBool`, no user axiom.
- No theorem statement and no definition was changed. Each auditor compared the statements with the original `RequestProject/Main.lean` by script. The originals are untouched and still contain their `sorry`s.
- Nothing was refuted. Nothing needed correction.
- Checks made for this report (not a third compile): line counts, a word search for `sorry|admit|native_decide|axiom|opaque` across the eight files (one hit, the word "sorry" in a header comment of file 06), the number of axiom lines in each compile log (2, 6, 7, 4, 11, 5, 6, 3 = 44) and the absence of `error`, `sorryAx`, `ofReduceBool` in the logs.

## Table

| # | Statement (lane) | Outcome | Lines | Compiles | Sorry-free | Axioms | Faithfulness | Statement changes | What remains |
|---|---|---|---|---|---|---|---|---|---|
| 01 | Multivariate Lee-Yang circle theorem, occupation form (res-sparse-ferromagnet, input of Thm. 3) | proved, 2 theorems | 407 | yes | yes | propext, Classical.choice, Quot.sound | faithful | none | Nothing in the file. Not stated: depth > 1 sites, mixed and boundary cases, limits. |
| 02 | Stage theorem (i)-(iii) with Lee-Yang as hypothesis (res-sparse-ferromagnet Thm. 3) | proved, 6 theorems | 292 | yes (5 unused-variable warnings) | yes | same | faithful, narrower scope | none | Parts (iv)-(vi) and the coefficient relations of (iii) not formalized; subset-to-divisor bijection not formalized; joining with 01 not compiled in one file. |
| 03 | Jet matrix = 2 H0 (+) 2 H1, first failure N* = min(2 K0 - 1, 2 K1) (stack-antibridge Thm. 4) | proved, 7 theorems | 375 | yes | yes | same | faithful, narrower scope | none | Node-to-jet congruence (rule 4.1 for clustered nodes), sum over zeros, inertia statement, Stieltjes link not formalized. |
| 04 | Inertia theorem, finite form (sq-krein-index Thm. A) | proved, 4 theorems | 426 | yes (2 unused-variable warnings) | yes | same | faithful, narrower scope | none | Infinite zero sets, Theorems B and C, index formula; the dimension count joining upper and lower bound. |
| 05 | Cascade composition, J-defect, Moebius law, reference change (sq-causal-cascade Thm. 1) | proved, 11 theorems | 157 | yes (2 linter warnings) | yes | same | faithful, narrower scope | none | M(Z) = exp(ZN/2), the J-expansive clause, chain formula (1.1). |
| 06 | Sign lemma of Theorem R (pick-induction) | proved, 5 theorems | 313 | yes | yes | same | faithful, narrower scope | none | Theorem R itself: Pick-Nevanlinna extension, Re L = 0 on the axis, the non-PSD conclusion. |
| 07 | sum lambda(n) n^-s = zeta(2s)/zeta(s), limit 0 at s = 1, negative on (1/2, 1) (box-riesz-order2 T2(a)) | proved, 6 theorems | 420 | yes | yes | same | faithful, narrower scope | none | Riesz sections, Perron asymptotic, Hurwitz step, Kronecker transfer T3, finite-N thresholds. |
| 08 | Positive-definite mass function: maximal atoms form a subgroup, rigidity to cZ (n1-beurling-rigidity Thm. A, A1-A4) | proved, 3 theorems | 186 | yes | yes | same | faithful, narrower scope | none | S1-S3, the step c = 1, Corollary A, Theorem B, Lemma T. |

"Faithful, narrower scope" means: the Lean statement says what the lane says for the part it covers, and covers less than the lane's theorem. The limits were declared in each `FAITHFULNESS.md` before proving.

Files (all under `tmp/research-2026-11-16/push/lean-harmonic-rh-push/`), with sha1 at the time of this report:

| # | File | sha1 |
|---|---|---|
| 01 | `01-leeyang-circle/LeeYangCircleProved.lean` | 3f1689e913022fe7b12ddd4ff9e04df4caa69aa9 |
| 02 | `02-stage-selfdual/StageSelfdualProved.lean` | d052ccc1e3e8528bc3e4081dfb23737b2596a774 |
| 03 | `03-anchor-hankel/AnchorHankelProved.lean` | 9388c0466f54f5756959ec8a1f020acf0984fe7f |
| 04 | `04-krein-inertia-finite/KreinInertiaFiniteProved.lean` | fda969bdf0f793a509a2fca5d0ba29e533b163f5 |
| 05 | `05-cascade-composition/CascadeCompositionProved.lean` | bc2404fd9d79191466ecbd0759cc2d87a1212e17 |
| 06 | `06-thmR-sign-lemma/ThmRSignLemmaProved.lean` | a438a76e475da2968b76ea3d530775ce45405e41 |
| 07 | `07-liouville-limit/LiouvilleLimitProved.lean` | 9c2ca44a18a87687601e4097b1231def1c9a9a43 |
| 08 | `08-beurling-maxatoms/BeurlingMaxAtomsProved.lean` | 4da5c95597f090178303ba055b0e1867d0d6f46b |

Each directory also holds `<Name>Proved.compile.log` and `AUDIT.md`. Directory 08 holds `AuditNonVacuity.lean` (the hypotheses of `beurling_core` hold together for the indicator of Z).

## Per statement: what the machine check establishes and what it does not

**01 Lee-Yang circle (res-sparse-ferromagnet).** Established: for any n, any symmetric K >= 0 and any complex activities z, the subset-sum partition function `stageZ K z` has no zero when all |z_p| e^{r_p/2} < 1, and none when all are > 1. The proof is a complete Asano contraction argument with no assumed step, and it machine-checks the bookkeeping identity (pairs inside S = half the row sums minus half the cut) that the faithfulness note had checked by hand. For the lane this replaces "CLASSICAL, cited" by "classical and machine-checked in the form the lane uses". The intermediate lemma `LY_wt` is slightly more general (real edge weights in [-1, 1] on any finite site type). Not established: anything for spin-S or depth > 1 sites, mixed or boundary cases, or any limit n -> infinity.

**02 Stage theorem (res-sparse-ferromagnet Thm. 3 (i)-(iii)).** Established: given the Lee-Yang property of K as a hypothesis, the stage polynomial has no zero in either half-plane away from the abscissa, all zeros lie on Re s = a when the abscissae coincide, and under the sum rule the zeros of the Dirichlet stage lie on Re s = 1/2. The self-duality and the functional equation Z(1-s) = M^(s-1/2) Z(s) are unconditional. `stageZ`, `rowSum` and the two halves of `LeeYangProp` in file 02 are text-identical to the definitions and the two theorems of file 01, so for symmetric K >= 0 the hypothesis is discharged by 01; this join was read off the two files and was not compiled as one file. Lean's linter shows `hsymm` and `hnn` are unused in the critical-line theorem: sign and symmetry of K act only through Lee-Yang. Not established: parts (iv) Curie-Weiss at all depths, (v) twists, (vi) zero count, the coefficient relations of (iii), and the identification of subsets with divisors of M. The stage polynomials are finite exponential sums; their zeros on Re s = 1/2 say nothing about zeros of zeta.

**03 Anchor jet matrix (stack-antibridge Thm. 4).** Established: for an arbitrary real sequence mu, the jet matrix J_N is positive definite (resp. semidefinite) exactly when both Hankel blocks H0 and H1 are, through the exact identity x^T J_N x = 2 u^T H0 u + 2 v^T H1 v; and the first-failure rule N* = min(2 K0 - 1, 2 K1) for the jet matrix, with the one-sided variants. Also the one-lambda Pick identity and its double power series. This is the first check of this lane beyond its author: the lane is unrefereed and remains so, but its finite algebraic core now holds. Not established: that `jetCoeff` is the Taylor array of the kernel summed over zeros of xi (only the one-lambda series is in the file, matched by inspection); the congruence as an equality of inertia; rule (4.1) for node matrices with clustered nodes; the Stieltjes moment problem link; the lane's numerical failure orders for the twin and Davenport-Heilbronn examples.

**04 Krein inertia, finite form (sq-krein-index Thm. A).** Established for a finite zero set: the kernel identity; the form is real; it is >= 0 on the subspace cut out by the kappa constraints (at most kappa negative squares); and there is a subspace of dimension exactly kappa on which the form is negative definite (at least kappa). The lower bound was proved by a different route from the lane: exact linear algebra through a polynomial-identity spanning argument, giving form = -2 sum mr_j |t_j|^2, in place of residue functionals and an isotropic-subspace lemma. Consequently the lane's own isotropic lemma and Riemann-sum transfer are not machine-checked, while the finite conclusion is. Lean shows a >= 0 and ma_k > 0 are not needed for the lower bound. Not established: "exactly kappa" as one theorem (the dimension count joining the two bounds is not formalized), infinite zero sets and Hadamard convergence, kappa = infinity, Theorems B and C, the index formula. The lane stays unrefereed. One side remark from planning, not machine-checked: a perturbative construction with equal eps for unequal weights has leading matrix D K + K D, which need not be definite; the lane's written lower-bound argument should be read against this.

**05 Cascade composition (sq-causal-cascade Thm. 1).** Established: the 2x2 algebra of parts (a)-(d): N^2 = 0, M(Z1) M(Z2) = M(Z1 + Z2), list products, the Moebius series law, the rank-one J-defect, J-contractive iff Re Z >= 0, J-unitary iff Re Z = 0, the scattering defect, reference change, and the power-wave contractivity criterion. Not established: M(Z) = exp(ZN/2) as a matrix exponential, the J-expansive clause, and formula (1.1) for the prime chain, which is the only part of the theorem that involves xi'/xi. The hypothesis 1 + Z != 0 in `mob_short` is unused (both sides are the same division in Lean). The lane stays unrefereed.

**06 Sign lemma (pick-induction Theorem R).** Established: for summable coefficients supported on n >= 2 and not all zero, g(y) = sum c_n cos(y log n) is continuous, takes a positive value and a negative value, is positive on an interval, and is positive at some point outside any given countable set. The proof is by Bohr mean values. The referee's support condition (n >= 2) is in the statement. Not established: Theorem R. The Pick-Nevanlinna extension, Re L(iy) = 0 from the functional equation, Re L_eta(iy) = -g(y), boundary continuity and the conclusion that a finite Pick matrix is not PSD are absent; L, xi and Pick matrices do not occur in the file. The theorem name `theoremR_sign` and its docstring overstate the content; read it as "sign step of Theorem R". The prover did not read the lane files; the auditor compared against pick-induction/RESULT.md section 3.2 and r2-pick-euler-entry/REFEREE.md section 1.

**07 Liouville limit function (box-riesz-order2 T2(a)).** Established: for Re s > 1 the Liouville series is summable and equals zeta(2s)/zeta(s); the ratio tends to 0 at s = 1; and it is a negative real on (1/2, 1). The file proves two facts not in Mathlib that other lanes can reuse: zeta(sigma) < 0 for real sigma in (0, 1) (`riemannZeta_real_neg`) and zeta(x) > 0 for real x > 1 (`riemannZeta_real_pos`). All of this is classical. Not established: T2 itself. The Riesz sections f_N, the Perron asymptotic, the Hurwitz step, the Kronecker transfer T3 and the certified finite-N thresholds are not formalized. The lane directory has no REFEREE.md; the comparison was with RESULT.md.

**08 Beurling maximal atoms (n1-beurling-rigidity Thm. A, steps A1-A4).** Established: for a positive-definite function phi on R, |phi(t)| <= phi(0); the set {phi = phi(0)} is a subgroup; and under the mass, local-finiteness and non-triviality hypotheses the support is cZ for some c > 0. A2-A3 were proved from the 3x3 positive-semidefinite form with coefficients (1, -2, 1), not by the lane's mean M_R and cosine inequality; the conclusion is the same. Not established: Theorem A. S1-S3 (functional equation => mu^ = mu => positive-definiteness of the atom-mass function) enter only as the hypothesis `IsPosDefFn`; the step c = 1 is absent and cannot follow from these hypotheses, since the indicator of cZ satisfies them for every c; Corollary A, Theorem B and Lemma T are not formalized. The check adds nothing on novelty.

## Refuted or corrected

Nothing was refuted. No statement was corrected or weakened. All eight formalized statements are true as written.

Observations produced by the proofs that the lanes can use. None is an error in a lane.

| # | Observation | Consequence for the lane |
|---|---|---|
| 02 | `hsymm`, `hnn` unused in the critical-line theorem once Lee-Yang is assumed; `hinj` and `hn` unused. | The lane's hypotheses on K matter only for Lee-Yang (statement 01). No change of claim. |
| 02 | The sum-rule hypotheses of (iii) cannot hold for n = 1 or 2; they are satisfiable from n = 3 (auditor's example P = (2,3,5)). | Part (iii) is non-vacuous only from three primes on. Worth one sentence in the lane. |
| 03 | The equivalences hold for any real sequence mu; no Stieltjes or positivity assumption is used. "H0 of order K0 not PosDef" forces K0 >= 1. | The rule is purely algebraic; the lane can state it without the moment hypotheses. |
| 04 | The lower bound needs neither a >= 0 nor ma_k > 0; gamma_k need not be distinct. The Lean route differs from the lane's. | The finite result is slightly stronger than stated. The lane's own lower-bound proof (isotropic lemma, Riemann sums) is still unchecked and should be refereed, with the D K + K D remark in mind. |
| 05 | `mob_short` holds without 1 + Z != 0 in Lean (division by zero convention). | Artifact of the formalization. No change. |
| 06 | Name and docstring of `theoremR_sign` overstate the content. | Cite it as the sign step only. |
| 08 | c = 1 cannot follow from the formalized hypotheses. | Already known to the lane (it uses Poisson summation for that step). Confirms the step must stay separate. |

## Limits of this record

1. Scope. Seven of the eight files cover a core or one step of the lane theorem. Only 01 covers its target in full. The lanes' wider claims are neither supported nor weakened by these checks.
2. Review of the proofs. Each file had one prover and one auditor, both automated agents. The kernel check and the axiom list guard the proofs; the faithfulness judgement (does the Lean statement say what the lane says) is the part that is not machine-checked. The provers of 02, 06 and 07 did not read the lane files; the auditors did.
3. Provenance. The directory is untracked in git, so "original statement file untouched" rests on file times and on the scripted statement comparisons.
4. The 01-into-02 join was not compiled as a single file.
