# An upper bound for the de Bruijn–Newman constant from a zero-free half-plane

> **Work in progress. Draft, not peer reviewed. The bound depends on two unrefereed results.**

> **Status.** A computer-assisted upper bound. It depends on two recent results that have not
> been refereed: the zero-free half-plane `Re s > 7/8` (openai/math family 003, whose
> Lean proof was rebuilt here with standard axioms only) and D. J. Raymond's
> decreasing-barrier construction (Zenodo 10.5281/zenodo.22867547). The value
> 0.116091 also uses this project's internal floor and kernel certificates; without
> them the same argument gives 0.118506. Not yet peer reviewed. The accepted
> peer-reviewed bound remains `Λ ≤ 0.2` (Platt–Trudgian). RH is open.
>
> Draft, 9 October 2026; not submitted, not published. Theorem 1.1 gives
> `Λ ≤ 116091488672439/10¹⁵ =
> 0.116091488672439` at the Platt–Trudgian verified height from
> (1) `ζ(s) ≠ 0` for `Re s > 7/8` (openai/math family 003; Lean proof rebuilt
> locally, standard axioms only; not peer reviewed),
> (2) D. J. Raymond's decreasing-barrier analytic chain (Zenodo
> 10.5281/zenodo.22867547; unrefereed; reviewed only inside this project),
> (3) Platt–Trudgian's verification of RH to height 3000175332800 (peer reviewed),
> and (4) this project's route-P certificates (internal, mostly single
> implementation). With (1)–(3) only: `Λ ≤ 118505710922701/10¹⁵ =
> 0.118505710922701`. Without (1) the chain gives Raymond's
> 0.149395; without (2) or (3) it gives nothing below the accepted 0.2.

This folder is private. It lives in the private `mathexplorer` repository, is not
under `public/`, and is not linked from any page of the site.

## The result

Theorem 1.1 of `paper/main.tex`:

| | hypotheses | conclusion |
|---|---|---|
| (i) | (H1), (H2), (H3) | `Λ ≤ 118505710922701/10¹⁵ = 0.118505710922701` |
| (ii) | (H1), (H2), (H3), (H4) | `Λ ≤ 116091488672439/10¹⁵ = 0.116091488672439` |

* **(H1)** `ζ(s) ≠ 0` for every `s` with `Re s > 7/8`.
* **(H2)** The statements of Raymond's construction used by the chain: the head
  localisation (W), the probe identity and zero dynamics behind his inequality
  (11.1), and the floor and kernel inequalities of his tables used by run (i).
* **(H3)** RH for zeros with `0 < γ ≤ 3000175332800`.
* **(H4)** The floor inequalities for the 468 floor entries and the kernel
  inequality for the 59 kernel rows used by run (ii).

This result changes one thing in Raymond's method: the start. If `ζ` has no zeros with
`Re s > θ`, every zero of `H_t` satisfies `(Im z)² ≤ max((2θ − 1)² − 2t, 0)`, and the
barrier may start at `q0 > (2θ − 1)² = 9/16` instead of `q0 > 1`. The half-plane is
read at exactly one place in the chain: the start and its strict-entry check on
`[0, 10⁻⁸]`. Everything else (floor estimates, kernel catalogue, choice rule,
comparison arithmetic) is Raymond's, and value (i) is his chain with only the
start changed. Value (ii) adds this project's floors and kernels, re-tuned along
the lower barrier path.

**Dependency.** Remove (H1) and the same chain returns Raymond's own value
0.149395073827688. Remove (H2) or (H3) and the argument gives nothing below the
accepted 0.2: (H1) alone gives `Λ ≤ 9/32 = 0.28125`. Remove (H4) and value (ii)
falls back to value (i). No input can be dropped without losing the stated value.

## Which document should I read?

| document | read it for |
|---|---|
| [`paper/main.tex`](paper/main.tex) (built: [`paper/main.pdf`](paper/main.pdf), 18 pages; copy at [`lambda-qrh-0.116091-draft.pdf`](lambda-qrh-0.116091-draft.pdf)) | The paper: history of the bounds, Raymond's method, the substitution lemma with proof, the barrier lemma with a zero-free start, the computation, the `Λ(θ)` table, what limits 7/8, Lean status, dependencies. Start here. |
| [`PROOF_NOTE.md`](PROOF_NOTE.md) | The argument in short form: Lemma 1 (half-plane to squared strip) with proof, Lemma 2 (barrier lemma with a zero-free start) with proof, the two runs. |
| [`PARAMETERS.md`](PARAMETERS.md) | Every exact rational: starts, strict-entry margins, step counts, the re-tuning ladder, 11/12 values, the `Λ(θ)` table, with the source file of each number. |
| [`DEPENDENCIES.md`](DEPENDENCIES.md) | The four conditions, their status, what breaks without each, and the parts of (H2) and (H4) in detail. |
| [`LEAN.md`](LEAN.md) | What is Lean-checked (the openai/math 7/8 theorem rebuilt locally; the substitution lemma, Lemma CG, Lemma R; the final theorem from named hypotheses with every substep replayed by the kernel), what is not, and the build commands. |
| [`OPEN_REVIEW_QUESTIONS.md`](OPEN_REVIEW_QUESTIONS.md) | What a referee should check, in priority order. |
| [`PROVENANCE.md`](PROVENANCE.md) | SHA-256 of every source module, script, run artefact, Lean file and reference copy used. |
| [`BIBLIOGRAPHY.md`](BIBLIOGRAPHY.md) | The references, each checked against Crossref, arXiv, Zenodo or GitHub on 2026-10-09. |
| [`CITATION.md`](CITATION.md) | How to refer to this draft internally. |

## How the argument is organised

1. **Lemma 1** (`PROOF_NOTE.md` §1; paper Lemma 4.1). A zero-free half-plane
   `Re s > θ` puts every zero of `H_0` in `|Im z| ≤ 2θ − 1`, and de Bruijn's theorem
   carries the squared strip forward: `(Im z)² ≤ max((2θ − 1)² − 2t, 0)`. Proved in
   Lean (`RaymondCore.Substitution.substitution`).
2. **Raymond's chain** (paper §3). A head wall at `X = 6000000185827` (resting on
   Platt–Trudgian) keeps nonreal zeros to the right of `X`; certified probe floors
   and kernel inequalities give `q′ < −2 − c q` for the highest zero; a barrier
   `β′ = −2 − c β` on 608 cells × 128 substeps bounds the squared height; the bound is
   the time the barrier reaches `10⁻⁸`, plus `5·10⁻⁹`.
3. **Lemma 2** (`PROOF_NOTE.md` §3; paper Theorem 4.2). The first-contact argument
   with the start `q0 > (2θ − 1)²` and the strict-entry check
   `q0 − (2 + c0 q0)·10⁻⁸ > (2θ − 1)²`, written out in full.
4. **Runs.** Value (i): Raymond's chain from `q0 = 9/16 + 2·10⁻⁶`, 60,675 substeps.
   Value (ii): the re-tuned route-P run from `q0 = 9/16 + 10⁻⁷`, 59,439 substeps.
   Both in exact rational arithmetic, replayed by the Lean kernel.

## How to reproduce

Paths are relative to the repository root. The scripts and run artefacts are in the
untracked `tmp/` tree (hashes in `PROVENANCE.md`).

```sh
# value (i): Raymond's chain with the 7/8 start (about 35 s)
.venv-arb/bin/python tmp/oai-lambda-raymond.py OUT.json X1 --thetas 7/8
#   expected: U = 118505710922701/1000000000000000, 60675 steps, last row 474

# value (ii): re-tuned route-P consumer (about 11 min) and its step verifier
cd tmp && XK=qrh-tune-out/xkernels_final.json KK=qrh-tune-out/xkernels_final.json \
  ./qrh-tune-final.sh F2_repro 1/10000000 W4 m097 m094 m091 QA_m0.88 QB_m0.91 QC_cliff
#   expected: U = U_robust = 116091488672439/1000000000000000, 59439 steps, 0 failures

# value (ii): from-scratch verifier, no code shared with the consumer (about 1 min)
cd tmp && ./qrh-ref-run.sh refverify /tmp/qrh-tune-dump-F2_repro F2_repro_refverify

# Λ(θ) table
tmp/qrh-theta-curve-raymond.sh; tmp/qrh-theta-curve-routeP.sh

# Lean (needs the machine-local dependency builds described in LEAN.md)
cd formalization/lean/qrh-lambda
scripts/build_chunks.sh F2 3; scripts/build_chunks.sh R78 3
lake build && lake env lean scripts/AxiomsCheck.lean
scripts/check-oai.sh && lake env lean scripts/NegativeControl.lean

# the paper
cd papers/lambda-qrh-0.116091/paper && latexmk -pdf main.tex
```

Re-run for this package on 2026-10-09: value (i) (33.9 s, `U` and step count
reproduced) and the from-scratch verifier of value (ii) on the archived dump with
sha256 `1c546f5c…0cfb` (38 s, `U = U_robust`, empty failure list).

## Folder organisation

```
papers/lambda-qrh-0.116091/
├── README.md                 this file
├── PROOF_NOTE.md             short mathematical summary with proofs
├── PARAMETERS.md             exact rationals and tables
├── DEPENDENCIES.md           the four conditions and their status
├── LEAN.md                   Lean status and build commands
├── OPEN_REVIEW_QUESTIONS.md  referee questions
├── PROVENANCE.md             sha256 of every file used
├── BIBLIOGRAPHY.md           checked references
├── CITATION.md               internal citation
├── lambda-qrh-0.116091-draft.pdf  copy of paper/main.pdf
├── paper/
│   ├── main.tex              the paper (article class, amsthm)
│   ├── refs.bib              BibTeX references (amsplain style)
│   └── main.pdf              built from main.tex and refs.bib
└── tools/
    └── make_provenance.py    regenerates PROVENANCE.md (run from the repository root)
```

## Not yet done

* An external referee of Raymond's chain (H2) and of this paper's start
  substitution.
* The official comparator run and an independent kernel replay of the openai/math
  7/8 proof; a rebuild at the updated openai/math commit (the update of 8 October 2026
  changes no module of the import closure of the 7/8 theorem).
* Certification of the measured 0.0023 time-box allowance and review of the L-slope
  lemma behind the r2 floors in (H4).
* A decision on whether, and in what order, to contact D. J. Raymond, whose chain
  gives value (i) with no input from this project beyond the start substitution.
* A release of the scripts and run artefacts outside the untracked `tmp/` tree.
