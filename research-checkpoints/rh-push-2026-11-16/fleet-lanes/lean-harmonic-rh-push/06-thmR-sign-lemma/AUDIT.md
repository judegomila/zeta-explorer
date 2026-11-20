# AUDIT 06 thmR-sign-lemma (independent audit, 2026-11-20)

Audited file: `ThmRSignLemmaProved.lean` (307 lines + 5 `#print axioms`), sha1 `a438a76e475da2968b76ea3d530775ce45405e41`.
The auditor did not write the proof. Nothing was edited.

## 1. Compilation

Command (single process): `cd ~/probe428 && scripts/memcap.sh 14 lake env lean <file>`.
Result: exit 0, no errors, no warnings (no `sorry` warning), about 23 s wall time. Lean v4.28.0, built Mathlib.

## 2. Search for escapes

- Word search for `sorry`, `admit`, `native_decide`, `axiom`, `opaque`, `unsafe`, `implemented_by`, `extern`,
  `macro`, `syntax`, `notation`, `elab`, `instance`, `attribute`, `set_option`, `universe`, `local`, `decide`,
  `#eval`: one hit only, the word "sorry" inside the header comment (line 6). No code use.
- Only import: `Mathlib`. One `noncomputable section`, no namespace, no new instances, no redefined notation.
- Definitions: `gser` (same as original), plus two helpers `cosSer` (same series with general frequencies) and
  `kern` (integral of cos over [0, T]). Neither replaces an object in a theorem statement.
- Hypotheses are not contradictory: c = indicator of {2} satisfies all of them (g(y) = cos(y log 2)). No hypothesis
  restates a conclusion. `Zs` countable is satisfiable and non-trivial.
- Lean conventions checked: `Real.log 0 = 0` and `(0:ℝ)^(-1/2) = 0`; the n = 0 and n = 1 terms are removed by
  `h0`, `h1`, so the conventions do not change the meaning. `tsum` is a true sum under the summability hypothesis.

## 3. Axioms (`#print axioms`, from my own run)

All five theorems (`gser_exists_pos`, `gser_exists_neg`, `gser_continuous`, `gser_pos_on_interval`,
`theoremR_sign`): `[propext, Classical.choice, Quot.sound]`. These are the three standard axioms. No `sorryAx`,
no `Lean.ofReduceBool`.

## 4. Faithfulness

Against the original statement file (`rh-push-thmr-sign-lemma/RequestProject/Main.lean`, mtime 05:36, before the
proved file): a script extracted each declaration header up to `:=` and compared after whitespace normalisation.
`gser` and the five theorem statements are identical. The proved file adds 2 definitions and 12 helper lemmas.
The directory is untracked in git, so "original untouched" rests on the mtime and on this comparison.

Against the lane (`pick-induction/RESULT.md` section 3.2; referee: `r2-pick-euler-entry/REFEREE.md` section 1;
`pick-induction` has no REFEREE.md of its own):

- The lane's Theorem R: for nonzero real eta on {2, 3, ...} with sum |eta(n)| n^(-1/2) finite, L_eta has a non-PSD
  finite Pick matrix on every interval of (0, inf).
- The Lean file proves one step of that proof: g(y) = sum eta(n) n^(-1/2) cos(y log n) is continuous, takes a
  positive and a negative value, is positive on an interval, and is positive at some y outside any countable set.
- Not in the Lean file: the Pick-Nevanlinna extension, the identity Re L(iy) = 0 off the zeros of xi (functional
  equation), the identity Re L_eta(iy) = -g(y), the boundary-continuity step, and the conclusion about Pick
  matrices. L, xi and Pick matrices do not occur in the file.
- The support condition "eta on n >= 2" required by the referee is present (`h0`, `h1`).
- The proof method (Bohr means of g(1 +- cos(y log m))) is the lane's argument "mean value 0 and a nonzero Bohr
  coefficient", carried out in full.

Verdict: faithful, narrower scope. The file is a correct machine check of the sign lemma. It is not a machine
check of Theorem R. The name `theoremR_sign` and its docstring ("Theorem R in the lane's variables") overstate
this; the docstring also says "positive on an interval", which is the content of `gser_pos_on_interval`, not of
`theoremR_sign` itself.

## 5. Problems

1. Naming/docstring of `theoremR_sign` (above). No mathematical defect.
2. No other problem found.

Claimed outcome "proved, no statement changes": confirmed.
