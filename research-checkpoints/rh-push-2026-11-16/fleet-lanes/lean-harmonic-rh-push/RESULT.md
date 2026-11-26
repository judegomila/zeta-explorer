# lean-harmonic-rh-push: machine checking of the campaign's proved statements through Harmonic Aristotle

Date: 2026-11-20. Nothing committed or pushed. No RH claim; no bound moves.

## Verdict

**No statement was machine-checked in this pass. The Aristotle service no longer accepts Lean or pure-mathematics input.**

- Five jobs were submitted. Each returned within about 3 minutes with the service message: "No source files in a supported language were uploaded. Lean formalization projects aren't supported right now. More languages are on the way, and Lean support will return in the coming months."
- The current public SDK description (aristotlelib 3.4.0, PyPI) says the same: the service verifies Verilog, C and Rust; "It doesn't verify pure mathematics or Lean: a project with only Lean files runs and verifies nothing." Harmonic's announcement of the change is dated 2026-10-27. The installed CLI is 2.1.0; the refusal comes from the server, not from the client version.
- Three further submissions were declined by the service before starting, for quota reasons (a limit on concurrent runs). Empty projects were created for them.
- No workaround was attempted (no resubmission, no disguising Lean inside a C/Rust project, no local prover run, no hand proofs).

No refutation of any kind was returned.

## Table

| # | Statement (lane) | Project id | Task id | Outcome | Faithfulness of the statement file | Meaning for the lane |
|---|---|---|---|---|---|---|
| 01 | Multivariate Lee-Yang circle theorem, occupation form (input of res-sparse-ferromagnet Thm. 3; used by four Lee-Yang lanes) | f848ed0b-ec08-4ce8-ac27-62db1970da9e | fb678e41-9c4c-4cb4-bf08-2dd620232fe2 | no proof returned (Lean not supported) | statement reviewed; standard form; no vacuous hypothesis | unchanged: CLASSICAL, cited |
| 02 | Stage theorem (i)-(iii): zero-free half-planes, zeros on Re s = a, self-duality, sum-rule case on Re s = 1/2, with Lee-Yang as an explicit hypothesis | 9a9fe33c-727c-4e4b-bce6-b19f2468c275 | 2b7849c8-27da-4da9-a0df-b79bf0cc8000 | no proof returned | reviewed; referee's Curie-Weiss wording correction respected | unchanged: PROVED, refereed once |
| 03 | Anchor jet matrix = 2 H0 (+) 2 H1; first failure N* = min(2 K0 - 1, 2 K1) (stack-antibridge Thm. 4) | df5cf524-eb0c-45a1-9394-58024924f125 | fb000537-a298-44c1-a034-137d5e02cca4 | no proof returned | reviewed; jet-matrix form only (node-to-jet congruence not included) | unchanged: PROVED by author, unrefereed |
| 04 | Inertia theorem, finite form: kernel identity, at most and at least kappa negative squares (sq-krein-index Thm. A) | bff88973-bff6-4d03-b006-4d1b55bcd063 | 77351196-5652-4b81-a759-24692a0b780c | no proof returned | reviewed; finite zero set only | unchanged: unrefereed |
| 05 | M(Z1) M(Z2) = M(Z1 + Z2), rank-one J-defect, Moebius series law, reference change (sq-causal-cascade Thm. 1) | afd6a77e-1c8b-4991-b524-0b413401dc96 | adf3079f-ee0b-4357-9686-9b4c11d99333 | no proof returned | reviewed; 2x2 algebra | unchanged: unrefereed |
| 06 | Sign lemma of Theorem R: a nonzero cosine series over log n, n >= 2, is positive on an interval (pick-induction) | c868058d-3d7b-4cf8-87f1-2a6c1559e004 | none | not started (declined by the service, quota) | reviewed; covers one step of Theorem R, not the theorem | unchanged: refereed |
| 07 | sum lambda(n) n^-s = zeta(2s)/zeta(s); limit 0 at s = 1; negative on (1/2, 1) (box-riesz-order2 T2(a)) | cb33bc00-503c-4723-92f6-158da74fe729 | none | not started (declined by the service, quota) | reviewed; limit function only, not the Perron/Hurwitz/Kronecker steps | unchanged |
| 08 | Positive-definite mass function: maximal atoms form a subgroup; rigidity to c Z (n1-beurling-rigidity Thm. A, A1-A4) | 3582d5b5-a8a3-4200-8f3b-98c7128f2642 | none | not started (declined by the service, quota) | reviewed; S1-S3 and the step c = 1 not included | unchanged: refereed |

Nothing is pending on the service. There is nothing to collect later.

## Selection (task items 1 and 2)

Sources: OBSTRUCTION_MAP.md section 4; RESULT.md and REFEREE.md of the eight named lanes. `campaign/LEAN_QUEUE.md` does not exist. Ranking criteria: other lanes depend on it; self-contained; not already re-derived three times by a referee; not equivalent to RH.

- Chosen first: 01 and 02 (several Lee-Yang lanes rest on the circle theorem, which is not in Mathlib; 02 isolates exactly what the lane adds to it), 03 and 04 (unrefereed, finite-dimensional, the two statements where a machine check adds the most), 05 (unrefereed, cheap).
- 06, 07, 08: one self-contained step of each refereed theorem; the remaining steps of those theorems need Pick-Nevanlinna, Perron or tempered-measure theory and were left out by design.
- Not submitted: eq48 Theorem 4 (no margin). Its statement needs the zero set of xi through the Hadamard sum; the referee confirmed it; the Pick/Schur part is already in `push/b-lean-eq48`. Lowest value per job of the list.

## What exists in this directory

Per statement `NN-name/`: `rh-push-<name>/` (Lean project in the layout of `formalization/lean-aristotle/*`: `lakefile.toml`, `lean-toolchain` v4.28.0, `RequestProject/Main.lean` with every hypothesis explicit and `sorry` proofs), `JOB_ID.txt`, `submit.log` (service response body removed for the three declined submissions), `service_status.log`, `statement_typecheck.log` (elaboration in `~/probe428`: 0 errors in all eight; `sorry` warnings only), `FAITHFULNESS.md` (what the statement covers and what it leaves out). `_scripts/sanity.py`: float checks of the stage duality (defect 1.4e-14), of Lee-Yang inside the polydisc, and of one negative square for kappa = 1. These checks are MEASURED, not proofs.

The statement files are ready to submit unchanged to any Lean prover.

## Decision needed

Machine checking through Aristotle is not available for Lean at present. Options, none taken here: (a) wait for Lean support to return; (b) ask Harmonic whether an enterprise or legacy route still accepts Lean; (c) allow local proving of these eight files (05 is routine; 02, 03, 06, 08 are moderate; 01, 04-lower-bound, 07-negativity are the hard ones); (d) another hosted prover.

## Three weakest points

1. No proof exists for any of the eight files. The statement review and float checks do not replace one.
2. 03 and 04 formalize finite cores; the lanes' full claims (clustered nodes; infinite zero sets, operator form) are wider.
3. Three of the eight statements (06, 07, 08) were never started by the service (declined for quota reasons), so the service returned nothing about them.

## Update 2026-11-20 (later the same day): local proofs, option (c) taken

The user allowed local proving ("ok you can do the lean proofs"). This section supersedes the Verdict and the Outcome column above; the earlier record is kept as written. Full report: `LOCAL_PROOFS.md` in this directory.

**All eight statement files are now proved and checked by Lean locally** (Lean v4.28.0, Mathlib, project `~/probe428`, one `lake env lean` process per file under a 14 GB cap). 44 theorems, 2576 lines. Every theorem depends only on `propext`, `Classical.choice`, `Quot.sound`. No `sorry`, `admit`, `native_decide`, added axiom or `opaque`. No statement or definition was changed; nothing was refuted or corrected. Each file was compiled by its prover and again by a separate auditor. The Aristotle service was not used.

**None of these statements bears on whether the Riemann hypothesis is true.** No bound moves. Nothing committed or pushed.

| # | Status now | Proved file | Lines | Faithfulness | Meaning for the lane |
|---|---|---|---|---|---|
| 01 | proved, machine-checked (2 theorems) | `01-leeyang-circle/LeeYangCircleProved.lean` | 407 | faithful | the classical input is machine-checked in the form the lane uses (was: cited) |
| 02 | proved, machine-checked (6 theorems) | `02-stage-selfdual/StageSelfdualProved.lean` | 292 | faithful, narrower scope | parts (i)-(iii) checked, Lee-Yang as hypothesis; (iv)-(vi) not formalized |
| 03 | proved, machine-checked (7 theorems) | `03-anchor-hankel/AnchorHankelProved.lean` | 375 | faithful, narrower scope | jet-matrix core checked; lane still unrefereed; node form (4.1) not formalized |
| 04 | proved, machine-checked (4 theorems) | `04-krein-inertia-finite/KreinInertiaFiniteProved.lean` | 426 | faithful, narrower scope | finite Thm. A checked by a route different from the lane's; lane still unrefereed |
| 05 | proved, machine-checked (11 theorems) | `05-cascade-composition/CascadeCompositionProved.lean` | 157 | faithful, narrower scope | 2x2 algebra checked; chain formula (1.1) not formalized; lane still unrefereed |
| 06 | proved, machine-checked (5 theorems) | `06-thmR-sign-lemma/ThmRSignLemmaProved.lean` | 313 | faithful, narrower scope | sign step only; Theorem R not machine-checked |
| 07 | proved, machine-checked (6 theorems) | `07-liouville-limit/LiouvilleLimitProved.lean` | 420 | faithful, narrower scope | limit function only; T2 not machine-checked |
| 08 | proved, machine-checked (3 theorems) | `08-beurling-maxatoms/BeurlingMaxAtomsProved.lean` | 186 | faithful, narrower scope | A1-A4 core only; Theorem A not machine-checked |

Each directory now also holds `<Name>Proved.compile.log` and `AUDIT.md`; the original `RequestProject/Main.lean` files are unchanged and still contain their `sorry`s.

Changes to the "Three weakest points" above:

1. Point 1 (no proof exists) no longer holds: all eight files are proved.
2. Point 2 stands and is now the main limit: seven of the eight files are cores or single steps of the lane theorems. Lanes 03, 04, 05 remain unrefereed; the lane's own lower-bound argument in 04 was not the one checked.
3. Point 3 no longer limits the record: 06, 07 and 08 were proved locally with the other five.
4. New: the faithfulness judgement is by automated reviewers, not by Lean; the join of 01 into the hypothesis of 02 rests on text-identical definitions and was not compiled as one file.

The "Decision needed" section is closed for these eight files.
