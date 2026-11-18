# REFEREE (lens: general) for c4-repair-map-engine-r3

Date: 2026-11-18. Target: `RESULT.md` of this directory. Claimed verdict: partial-result (repair lane, no
mathematics, no statement about zeros).

Referee verdict: **the repair holds with one false count statement (E1) and four statements to qualify (E2-E5).**
Every number in sections 0, 3 and 4 that I reran reproduces, except the statement on how many new family patterns
match. The DH derivation was re-derived by hand and checked numerically on other cases: it holds. Nothing in the
result assumes RH, restates verified height as a result, or presents a known theorem as new. No statement about
zeros of zeta is made.

All runs local, through `scripts/memcap.sh 8`, in temporary copies; no file outside this REFEREE.md was written.
The compute server was not used.

## 1. What was rerun and the outcome

| Claim | Check | Outcome |
|---|---|---|
| Map replay byte-identical | `apply_map_r3.py` then `fix_map_r3.py` on a copy of `before/OBSTRUCTION_MAP.md` (via `MAP_PATH`), `cmp` with `push/OBSTRUCTION_MAP.md` | identical; 16 edits applied, 4 of 4 wording replacements |
| 37 closed entries (28 before), 7 partial | counted in `before/outcomes.json` and `engine/outcomes.json` | 28 closed / 10 proposed / 5 partial / 1 open before; 37 closed / 7 partial after; 44 entries both |
| 29 families (16 before) | counted | confirmed; 13 new |
| 1,509 -> 1,550 nodes, 8,407 -> 8,652 edges, WT / FM edges 0 -> 11 | counted in both graphs | confirmed. Of the 11, 9 are `control-defeats` and 2 are `special-case-of` (WT -> U, NR -> FM); both special cases are stated in map section 2 |
| Rejected 16,486 of 62,055 / 17,006 of 63,111 / 42,311 of 63,111 | reran `generate.py --top 60` on copies of the before files, and of the current files with and without `--no-r4-rules` | all three reproduce; output is deterministic (two runs identical); the current `engine/CANDIDATES.json` differs from my rerun only in the recorded `dump_rejected` argument |
| Rule (a) fired 24,823 | 9,091 + 7,968 + 3,705 + 3,159 + 900 | = 24,823; 25,105, 373, 109 are in the file metadata |
| Top-60 table (4.2) | recomputed curated ranks, theme counts and device kinds from `engine/CANDIDATES.json` | curated at ranks 8, 10, 11, 14, 29, 33; theme flow 6; 60 with a rule-(a) device; 33 distinct role-device nodes |
| "Same list" as the planner's | `before/CANDIDATES.json` (03:02) against `before/CANDIDATES.rerun.json` | same 60 candidates in the same order |
| Scoreboard: A, B, D unchanged | `diff` of `before/scoreboard.rerun.json` and `before/SCOREBOARD.rerun.md` against the current files | only the timestamp and six part-C fields differ; C(131,2) = 8,515, C(166,2) = 13,695, 13,695 - 394 - 437 = 12,864, 1,509 + 41 = 1,550, 422 + 24 = 446 |
| REFEREE2 addendum only | `diff` against the saved copy | one appended section, nothing else changed |

## 2. DH derivation (section 5), re-derived

Hand derivation of (D1)-(D7) of `push/c3-repair-map-theorem-a/REFEREE2.md` section 3:

- (D1) From the completed form for odd primitive chi, `L(s, chi) = eps q^{1/2-s} pi^{s-1/2} Gamma(1 - s/2)/Gamma((1+s)/2) L(1-s, conj chi)`; duplication `Gamma(1-s) = 2^{-s} pi^{-1/2} Gamma((1-s)/2) Gamma(1 - s/2)` and reflection `Gamma((1+s)/2) Gamma((1-s)/2) = pi/cos(pi s/2)` give `X_c`. For odd chi, `tau(conj chi) = -conj tau(chi)`, hence `eps(conj chi) = conj eps(chi)`, and the two conditions `eps c_1 = c_2`, `eps(conj chi) c_2 = c_1` are conjugate.
- (D4) `chi_+ = i (2 pi)^{s-1} e^{-i pi s/2} Gamma(1-s)`, so `X_{c,+} = -i chi_+`; `-25 i (k/5)^{5/2} = -i 5^{-1/2} k^{5/2}`; `2 pi i k e^{i delta} = 2 pi i k - 2 pi k eta`.
- (D5) `sum_psi tau(conj psi) psi(a) = 4 e(a/5)` by orthogonality; the two polar terms and the residue 4/5 are as stated.
- (D6) `e^{i delta/2}/eta = 1/(2 sin(delta/2))` exactly, so the passage from eta to delta costs O(delta) and introduces no phase.
- (D7) With `H = i beta + H_0` the imaginary constant cancels because `c_1 + c_2 = 1`; the Caratheodory disc at `rho^2 = 1/2` has centre `3 alpha`, radius `2 sqrt 2 alpha`; `|c_1| + |c_2| = sqrt(1 + kappa^2)`; constant `4 - 2 sqrt 2 sqrt(1 + kappa^2) = 1.05965865...`. The lane's remark is right: the real-part Harnack bound F3 alone does not bound `Re(c_1 z_1 + c_2 z_2)` for complex `c_j`; the disc form is the input.

Numeric checks on cases other than the lane's (mpmath, 30 digits, kappa at full precision):

| Check | Case | Result |
|---|---|---|
| `f(s) - 5^{1/2-s} X_c(s) f(1-s)` | s = -1.5 + 7.25i; s = 0.81 - 3.1i | 2.6e-29 (abs f = 36.07); 5.9e-31 |
| `eps(chi) c_1 - c_2` | full precision | 2.0e-31 |
| displayed formula of (D4): `(1/2 pi) int_R 5^{2-it} X_{c,+}(-3/2+it) k^{it} e^{-delta t} dt` against the right side, by quadrature | (k, delta) = (3, 0.35), (7, 0.2), (2.6, 0.5) | differences 6e-31, 1e-30, 2e-31 |
| (D7) extremum on the pair of discs, closed form `z_j = 3 - 2 sqrt 2 conj(c_j)/abs(c_j)` | | 0.059658654986761, equal to `3 - 2 sqrt 2 sqrt(1 + kappa^2)` |

The lane did not check the (D4) integral numerically; it holds, including at a non-integer k.

## 3. Errors and qualifications

**E1 (false as worded). "Eleven of the thirteen new patterns match no generated candidate" (sections 1, 3.1, 8.2;
"only 2 of 13 match any candidate" in the summary).** Counting pattern matches independently of the order of the
family list (instrumented copy of `generate.py`, rules off, among candidates that reach the family check), eight of
the thirteen new patterns match:

| Family | matches | exempted by `unless` | first label taken by an older family |
|---|---|---|---|
| fam-fixed-window-count-rigidity | 776 | 776 | - |
| fam-rotation-invariant-stage-bound | 509 | 0 | 509 (489 by fam-stage-limit-semicontinuity) |
| fam-projection-domination-gonek | 494 | 0 | 79 |
| fam-cutoff-hecke-commutator | 251 | 0 | 251 (227 by fam-primitive-test-restriction) |
| fam-reflected-euler-stage-canonical | 98 | 2 | 48 |
| fam-jcontractive-several-delay-joint | 17 | 0 | 17 |
| fam-jcontractive-multidelay-lft | 1 | 0 | 1 |
| fam-tail-generic-selector | 1 | 1 | - |

The figures 415, 49 and "0" are the added rejections under first-match labelling, not the reach of the patterns.
The correct statement: 2 of 13 new families reject a candidate that no older family rejects; 8 of 13 match
candidates. Two consequences for section 8.2: the patterns are not untested (509, 251 and 17 matching candidates
are available as samples), and `fam-projection-domination-gonek` is not the only single-node closure:
`fam-rotation-invariant-stage-bound` matches through `map-open-19` alone (509 of 509) and
`fam-cutoff-hecke-commutator` through `map-open-20` alone (248 of 251). Both nodes are the map's own open items
whose text says "Closed in round 2", so the closure is right; their graph status is still `conjectural`.

**E2 (undisclosed dependence). The control "new device nodes are not rejected by any family" (4.3) holds only
through an `unless` exemption.** The node `rouche-fe-symmetrised-euler-stage` alone satisfies all four regexes of
`fam-fixed-window-count-rigidity` (row S12, closed against WT): 776 candidates, every one containing that node. All
776 are exempted because the `unless` regex finds "Riemann-Siegel length" in the node's own list of things still to
be checked ("Hamburger uniqueness past the Riemann-Siegel length"). The same node's text also says "To be checked:
the unimodular twist has the same stage theorem". So ranks 29 and 33 of the top 60 are present because a caveat
phrase switches off the family that encodes control WT; whether the device uses a window count of Riemann-Siegel
size is not established anywhere. Section 3.1 reports that the Euler-at-zeros pattern "matched the new Rouche node
itself" and was narrowed; the same defect in the window family was handled by exemption and is not reported.

**E3 (qualification). The top-60 improvements are measured with the predicates the rules enforce.** "Contains a
device 23 -> 60" is the hard rule (a); "majority flow / Lambda 14 -> 0", "majority mean value 12 -> 1" and "no
shared object 16 -> 0" are the three -3 penalties, evaluated by `compare_top.py` with the constants imported from
`generate.py`. They show that the rules act, not that the list is nearer to R4. The headline "14 -> 0" uses the
declared-tag definition; the definition under which the before value is also 14 and which is closest to the
planner's reading (theme flow or tag majority) gives 14 -> 6, and six candidates of generator theme `flow` remain.
Both rows are in table 4.2; the summary quotes only the first.

**E4 (leaks in rule (a), beyond the three examples of 8.1).** The exclusions for mean-value objects and
certificates read tags only. Among the 33 role devices of the new top 60:
`inverse-line-cotangent-mean-value` (name "Absolute-value mean of cotangent sums", tags `large-sieve`,
`trace-formula`; role from the word "equidistribution") counts as a device in two candidates although it is a
mean-value object of the class closed by MV-CAP; `klein-phase-transport-certificate` and `toeplitz-krein-sigma2`
("interval-certified for 2a <= 0.96"; role from "compact resolvent") pass the certificate exclusion; role matches
on "eventual" account for six further nodes. So "majority mean-value 12 -> 1" and "60 of 60 contain a device" are
upper readings in favour of the rules. This agrees with the lane's weakest step 1 and makes it concrete.

**E5 (qualification). Rule (b) does not test that the device is connected to its partners.** At rank 33 the only
shared object is the tag `hecke` between `sun-catalan-preprint-verdict` and `qrh-seven-eighths-input`; the curated
node shares nothing with either. The +3 for the curated tag and the exemption of curated candidates from both
majority penalties place a conjectural, unreported device in the top 60 next to unrelated nodes. The six
"planner-named" entries are a consequence of the curated score, not a finding of the generator.

Minor:

- `dh_reading_check.py`: the lines "(D6) -i tau/sqrt5 - eps" and "(D4) X_c,+ + i chi_+" compare an expression with
  itself (both sides are built from the same formula) and return exact zero; they check nothing. The other lines
  are real checks.
- Section 5, "the bound is attained on the pair of discs": true for the two discs as sets; no single H is exhibited
  that attains it at both points. The addendum's wording ("this argument cannot give more") is the right scope.
- 4.4: "marked closed 422 -> 446" follows the scoreboard's definition; counting `status == closed` in the graph
  gives 396 -> 420 (same difference, 24).
- The label of a rule-(a) rejection is decided by the first crossing member only, and tests the role `phenomenon`
  where `device_kind` also tests the node type; the five-way breakdown is therefore a labelling, the total is exact.
- Map row G10, "the count goes to infinity along the stages and to zero in the limit": checked against the lane
  (`c3-twinladder-prime-built-chain` RESULT line 97): the limit Theta is a Moebius factor with or without RH, so the
  sentence does not assume RH. The pole count `T theta(X)/pi` follows from `2 (T log p)/(2 pi)` poles per prime.

## 4. Controls

No zeta-only mechanism is claimed, so there is no control run to make on a mechanism. For the engine the control
content is the WT and FM edges and the families. Checked: WT -> U and NR -> FM are stated in map section 2; the five
edges derived from lane records correspond to records that name a height translate or a finite modification in
`controlsThatDefeat`. E2 is the one place where a control (WT, through row S12) is switched off for a new node by a
keyword.

## 5. Requirement flags (set by the referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | repair lane; no mechanism, nothing uses multiplicativity |
| R2 | false | no conclusion in height |
| R3 | false | no mechanism to fail for a control; the three device nodes are conjectural and one is exempt from the WT family by keyword |
| R4 | false | no passage to the critical line; the device nodes are proposals |

## 6. Surviving claim

Repair lane, no mathematics, no statement about zeros. Map: 16 anchored edits plus 4 wording edits, replay
byte-identical. Engine: 44 outcome entries, 37 closed (28), 7 partial; 29 families (16); 1,550 nodes; 11 edges on
WT / FM (9 control-defeats, 2 special-case-of). Generator: 16,486 of 62,055 before; 17,006 of 63,111 with the merge
and families; 42,311 with the rules. Of the 13 new families, 8 match candidates and 2 add rejections beyond the
older families; all 776 candidates containing the Rouche device node match the fixed-window-count family and are
exempted by an `unless` keyword. Top 60: the reported counts reproduce and are measured with the rules' own
predicates; 6 entries contain a curated (conjectural, score-boosted) device, 54 rest on a keyword role that still
admits a mean-value node and two certificate nodes. Scoreboard parts A, B, D unchanged; part C accounted for. DH
derivation (D1)-(D7) holds, re-derived and checked numerically on other cases including the (D4) integral; (D7)
needs the disc form, constant 1.0597 correct.
