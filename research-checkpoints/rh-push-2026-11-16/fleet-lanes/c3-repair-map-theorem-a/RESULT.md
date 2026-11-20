# c3-repair-map-theorem-a: map edits, second referee pass on Theorem A', engine records

Date: 2026-11-18. Kind: repair. No attack. No statement about zeros of zeta is made. Nothing here proves or refutes
RH and no bound moves. All numerics local through `scripts/memcap.sh 8` (longest run 167 s); the compute server was
not used and no unit was started there.

## Verdict

**Partial result (repair lane, score 0).** All four assigned items are done.

1. `campaign/MAP_PENDING.md` is applied to `push/OBSTRUCTION_MAP.md` entry by entry (25 entries, A1 to G), and the
   round-2 material is added (control WT, rows P41, P42, G25, Q21, Q22, closure of Q12, section 4 to 6 updates).
   Previous file: `OBSTRUCTION_MAP.before.md` in this directory.
2. Second referee pass on Theorem A' of `c2-jinner-multidelay-lft`: **the theorem holds**; every step re-derived
   (`REFEREE2.md`). The DH conductor-5 moment formula, an outline in the lane, is derived line by line and agrees
   with the lane's main term. Ball-arithmetic checks for zeta and DH confirm the main and second-order terms with a
   remainder that converges as `delta -> 0`. STRATEGY lead 20 and map row Q12 are closed in the text, with the
   uncovered cases named.
3. Engine: `aboutZeros` set to false in the two `e1-*` records (and in their `outcomes.json` entries);
   `build_graph.py` and `generate.py --top 60` rerun through memcap; counts below.
4. Engine controls `WT` (window translate) and `FM` (finite modification) added; both were absent.

## 1. Plan

Decisive first test for the one item that could fail (item 2): an independent certified computation of the Abel sums
of Theorem A' for zeta and DH, on the lane's own example and on a new example with complex pairing values, against
the main term plus the second-order term. If the remainder had grown with `1/delta`, the theorem or the DH formula
would be wrong and lead 20 would stay open. It did not (Section 3). The map and engine items are bookkeeping and were
done by script so that every edit has a line number and can be replayed (`apply_map.py`, `apply_map2.py`).

## 2. Edits to `push/OBSTRUCTION_MAP.md` (line numbers in the file as it is now; 392 lines before, 441 after)

### 2.1 MAP_PENDING entries (text taken verbatim from the blockquotes of MAP_PENDING.md by `apply_map.py`)

| Entry | Place | Action | Line(s) |
|---|---|---|---|
| A1 | section 6 item 6 | replaced | 348 |
| A2 | section 6 item 7 | replaced | 349 |
| A3 | section 6 item 8 | replaced | 350 |
| A4 | section 6 item 10 | sentence appended | 352 |
| A5 | section 6 item 11 | replaced | 353 |
| A6 | section 6 item 12 | sentence appended | 354 |
| A7 | section 6 item 14 | replaced | 356 |
| A8 | section 6, new items 16-20 | inserted after item 15 | 358-362 |
| B1 | section 2 row TW-, column Use | appended (Liouville twist) | 41 |
| B2 | section 2 row DH, column Has | phrase replaced (Arb certificate) | 38 |
| B3 | section 2 row HEAT, column Lacks | appended (located off-line zeros) | 39 |
| B4 | section 2 notes, auxiliary controls | appended (SEL, block-permuted family, random signs) | 50 |
| C1 | row P29, columns Where it stops and Source | appended; source `c1-pd-log-strip` added | 100 |
| C2 | row Q12 | replaced by the MAP_PENDING row (then edited again, see 2.2) | 162 |
| C3 | row P14, column Where it stops | appended (Gram side) | 85 |
| C4 | row Q4, column Where it stops | appended | 154 |
| D | rows P35-P40 | inserted after P34 | 106-111 |
| D | rows G22-G24 | inserted after G21 | 140-142 |
| D | rows Q19, Q20 | inserted after Q18 | 169-170 |
| D | row S11 | inserted after S10 | 190 |
| D | row Z21 | inserted after Z20 | 218 |
| D | row F8 | inserted after F7 | 231 |
| E | section 4 items 41-45 | appended to the numbered list (MAP_PENDING gives bullets; numbered here to continue the list) | 310-314 |
| F | section 5 | paragraph inserted after the corollary | 333 |
| G | section 7 | ten rows appended | 432-441 |

MAP_PENDING section H proposes nothing and nothing was done for it.

### 2.2 Round-2 additions (`apply_map2.py`; texts condensed from the RESULT.md and REFEREE.md of the lanes named)

| Edit | Place | Content | Line(s) |
|---|---|---|---|
| R0 | after the path convention | update note (what was applied, where the previous file is) | 13 |
| control WT | section 2 table, after row B | window translate `zeta(s + i alpha_k)`; has / lacks / use; MEASURED parts labelled (`c2-euler-cone-fe-rigidity`) | 45 |
| note | section 2 notes | U as a torus rotation (Q21), WT read against the input-level sets, finite modification (engine code FM), RZ_b pointer | 52 |
| Q1 | section 2 question Q1 | control list extended by WT (and U, Liouville, finite modification where formulable) | 56 |
| P41 | section 3.1 | partial Euler products at zeros = Landau-Gonek diagonal (`c2-euler-at-zeros`, `c2-euler-at-zeros-scale`) | 112 |
| P42 | section 3.1 | projection domination with the smoothed Landau-Gonek identity (`c2-projection-domination-gonek`) | 113 |
| G25 | section 3.2 | cutoff and Hecke-dilation commutators equal the Weil form on a window (`c2-cutoff-hecke-defect`) | 143 |
| Q12 | section 3.3 | closing text replaces the open clause; status, defeated-by and source columns updated; the sentence "multiplicativity is used at the point evaluation" withdrawn | 162 |
| Q21 | section 3.3 | rotation-invariant stage tools give the trivial bound (`c2-polydisc-leeyang-bound`) | 171 |
| Q22 | section 3.3 | J-contractive several-delay sections: `M(H) V_0`, closure, limit step (`c2-jinner-multidelay-lft`) | 172 |
| row count | end of section 3 | `P 42, G 25, Q 22, S 11, Z 21, F 8, T 3, L 5 = 137` (was 118) | 251 |
| items 46, 47 | section 4 | Theorem A' with its DH form; Lemma R | 315-316 |
| paragraph | section 5 | round-2 sentence (mean value only; rotation; rank-one family; Weil form on a window; WT) | 335 |
| item 6 | section 6 | round-2 sentence: open remainder decided as a mean value (P41) | 348 |
| item 7 | section 6 | round-2 sentence: three forms closed (Q12, Q22); remainder named | 349 |
| items 19, 20 | section 6 | closed by Q21 and G25 | 361, 362 |

Status words used are those of the map (PROVED, CLASSICAL, MEASURED, ARGUED, OPEN, "refereed once / twice").
Check: `diff` of the previous and the new file touches 83 lines in the 25 hunks listed above and nothing else; running
`apply_map.py` then `apply_map2.py` on `OBSTRUCTION_MAP.before.md` reproduces the file on disk byte for byte.

## 3. Second referee pass on Theorem A' (full report: `REFEREE2.md`)

Points named in the assignment:

- **Uniformity in k (step 3): holds.** The difference between `J_k` and the full-line `chi_+` integral is bounded by
  `C(delta)`, an integral of absolute values that does not contain `k` (`|k^{it}| = 1`), bounded for `delta <= 1`.
  MEASURED (`ref2_step3.py`): `C = 0.0050, 0.0054, 0.0060` at `delta = 1, 0.3, 0.01` (`t_0 = 1`); actual differences
  for `k = 1, 2, 5, 30, 1000` are all below `C`.
- **Mellin shift (step 4): holds.** Absolute convergence on `Re w = 3` by F1; `h*(w - 1/2)` holomorphic and bounded
  on `Re w >= 1/2 + eps` by F2; single pole `w = 1`; decay `e^{-(pi - delta)|Im w|/2}`. Residue
  `conj h(1/2)/(4 pi sin(delta/2))`.
- **Boundedness on `D^inf ∩ c_0` (F2): holds**, by continuity of `H` on the open unit ball of `c_0` and compactness
  of `{|w_p| <= p^{-eps}}`. The Hilbert-Bohr correspondence is not needed.
- **DH conductor-5 formula: derived line by line** (`REFEREE2.md` Section 3, steps D1-D7): functional equation with
  `eps(chi) c_1 = c_2`; `X_{c,+} = -i chi_+`; the factor `e(k/5) exp(-2 pi k eta/5)`; additive twist expanded in
  characters with Gauss sums; pole at `w = 1` only from `L(w, chi_0)`; recombination by `eps(chi) c_1 = c_2`. Result:
  bracket `a_1 + c_1 conj H(w') + c_2 conj H(w'')` for every prime set; for infinite `P` the pairing is the value at
  `1/2` of bounded twisted Bohr lifts, so no convergence theorem for the series is needed. Status: PROVED, one
  derivation (this pass).

Numerical checks (python-flint 0.9.0, 100-bit balls; interpreter `push/c2-cutoff-hecke-defect/.venv/bin/python`,
used read-only):

- Lane's table entries certified: DH `2 pi delta S = 6.94134674 + 0.68009026 i` (`delta = 0.04`),
  `7.18956170 + 0.45346882 i` (`delta = 0.02`), bracket `7.65637154`; zeta `10.30246347 + 0.15891259 i`,
  `12.22211728 + 0.09203701 i`, bracket `17.63905333`. Ball radii below `1e-24`; truncation tail below `3e-14`
  (bounded outside the balls with `|F(1/2 + it)| <= t`). DH functional equation residual `0 +- 8e-28`.
- New phased example (complex pairing values; 17576 poles to height 18000): remainder
  `D = S - M/(2 pi delta) - Sec` for `delta = 0.04 ... 0.0025`: zeta `0.829 - 0.161 i -> 0.848 - 0.183 i`, DH
  `0.743 + 0.288 i -> 0.725 + 0.245 i`, successive differences halving, while `S` reaches 469 and 543.
- Landau-Gonek tables: rows `T0 = 1e3`, `P = 10` and `100` reproduced in ball arithmetic (`0.35947`, `0.07050`
  against `0.3595`, `0.0705`); Abel-weighted Landau sums at `n = 2..10` approach `-Lambda(n)/sqrt n` with gaps
  halving in `delta`. **Limit of this check:** the tables are sums over zeta zeros of a Dirichlet polynomial, the
  other pairing of the same residue computation; they test the diagonal-pairing rule and its normalisation, not
  steps (3)-(4) of Theorem A'. No entry of `dhtab.txt` is used, and none is certified (the DH zeros there are
  float64). The DH entries that are used, the lane's Theorem A' table, are certified as above.

Closures made because the theorem held:

- `campaign/STRATEGY.md` line 64: lead 20 marked CLOSED 2026-11-18 with the uncovered cases; line 77: pointer;
  line 85: change-log entry.
- Map row Q12 (line 162), section 6 item 7 (line 349), row Q22 (line 172).

Not covered by the closure (stated in the map and in STRATEGY): boundary nodes of `R_a` for `a >= 1/2`; sections
holomorphic only on a Reinhardt shell around the tori; sections containing the gamma term; J-expansive sections.

## 4. Engine

| File | Line(s) | Edit |
|---|---|---|
| `engine/outcomes/e1-burgers-cascade-anticausal.json` | 37, 38 | `aboutZeros` true -> false; `aboutZerosNote` added. RESULT.md line 4: "Nothing here proves or refutes RH; no zero-free region or Lambda bound changes"; the proved items concern zeros of polynomial heat solutions |
| `engine/outcomes/e1-euler-anchor-heat-certificate.json` | 34, 35 | `aboutZeros` true -> false; `aboutZerosNote` added. RESULT.md lines 3 and 144: "no zero-free statement results" |
| `engine/outcomes.json` | 292, 374 | the same field in the two entries (patched directly; `merge_outcomes.py` was not run, as in the previous engine step) |
| `engine/build_graph.py` | 127-137 | controls `WT` and `FM` added to `CONTROLS` (name, has, lacks, kills, keyword) |
| `engine/build_graph.py` | 139 | `CONTROL_CODE_RE` extended by `WT|FM` |
| `engine/merge_outcomes.py` | 38, 39 | `CTRL_PATTERNS` extended by `WT`, `FM` |

`campaign/lanes.jsonl` already had `aboutZeros: false` for both lanes; it was not edited. Copies of every edited
engine and campaign file as it was before are in `before/`.

Rerun (both through `scripts/memcap.sh 8`, a few seconds each):

- `build_graph.py`: 1246 reader records -> 1210 corpus nodes + 292 map/control/outcome nodes = 1502 nodes; 939 live;
  173 map rows; 8403 edges (composes-with 7355, control-defeats 500, obstructs 185, restates 173, special-case-of
  111, uses 75, separates-from 4); 14 controls (was 12: `ctl-WT`, `ctl-FM` added). Previous log entry: 1463 nodes,
  8258 edges, 927 live.
- `generate.py --top 60`: 62,055 generated, 16,127 rejected, 45,928 scored (round-3 planning run: 61,200 / 14,662 /
  46,538). Largest rejection classes: closed family `fam-legendre-dual-limits` 2980; "no member uses
  multiplicativity (DH passes)" 2905; `fam-nb-gram-lammin` 2093; `fam-selberg-control-companion` 1929; "contains a
  combination closed in outcomes.json" 1000; `fam-multidelay-section` 40. `CANDIDATES.json` holds 60 candidates;
  the previous file is `before/CANDIDATES.before.json`.

Not done in the engine (not assigned): closed-family patterns for the round-2 families (partial Euler products at
zeros, rotation-invariant stage tools, cutoff commutators, projection domination) in `merge_outcomes.py` FAMILIES.
The map rows exist now (P41, P42, G25, Q21, Q22), and `build_graph.py` reads them as rows.

## 5. Controls

A repair lane has no mechanism to run against the controls. What changed in the control list:

| Control | Where | Content |
|---|---|---|
| WT, window translate | map section 2 line 45; engine `ctl-WT` | passes zeta's functional equation inside one window; kills single-window functional-equation arguments; not a function with known off-line zeros |
| FM, finite modification | map section 2 note line 52; engine `ctl-FM` | finitely many Euler factors changed (`zeta(s)(1 - q^{b-s})`, T-NR); kills arguments invariant under such a change. Definition written by this lane, elementary, unrefereed |
| Liouville twist | map row TW- line 41 (MAP_PENDING B1) | exact twist with zeros at `rho/2` |
| DH | map row DH line 38 (B2); row Q12 | kernel certificate; the first-moment no-go of Theorem A' holds for DH (derived formula) |
| HEAT | map row HEAT line 39 (B3) | located off-line zeros |

For Theorem A' itself (from the reviewed lane, with this pass): DH passes with bracket `>= 1.0597 Re a_1` (now
derived); sign twists have no functional equation (step void); `E_a` and general Dirichlet L-functions are not
derived (first referee's correction 4 stands).

## 6. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | false | No attack. The reviewed theorem uses no multiplicativity: the same sign holds for DH (`REFEREE2.md` Section 3). |
| R2 height-uniform, every window | false | No inequality for zeta in any window is produced; Theorem A' is an Abel mean. |
| R3 every control fails structurally | false | DH passes the reviewed no-go; the lane adds controls, it does not defeat them. |
| R4 reaches the critical line | false | Nothing of the kind is attempted. |

## 7. Three weakest steps

1. **The DH derivation has one author.** `REFEREE2.md` Section 3 is written by the referee of this pass and checked
   numerically on one prime set (`{2, 3, 7, 11}`, two phase choices). It has not been read by a second person or
   pass. The expansion beyond `Re w = 1/2` (the `Sec` term and the `O(1)` remainder) is a sketch supported by the
   numerics, not a written proof; the truncation-tail bounds use classical convexity bounds that were not re-derived
   and lie outside the balls.
2. **The Landau-Gonek comparison is indirect.** The tables test the dual pairing and cannot test steps (3)-(4) of
   Theorem A'; the Abel-weighted table law was compared only at `L = 3.6`, where first-order agreement is loose
   (0.645 against 0.614 at `P = 2`). The DH tables of `c2-euler-at-zeros-scale` remain uncertified.
3. **Condensed map text and new control text.** Rows P41, P42, G25, Q21, Q22 and the WT row are condensations by one
   editor of the lanes' RESULT.md and REFEREE.md; they were not re-derived here (Lemma R, Theorem C and Proposition L
   have the first referee only). The FM control is defined by this lane. The engine keyword patterns for WT and FM
   were not tested for false matches beyond one rebuild. `outcomes.json` was patched directly, so a later
   `merge_outcomes.py` run must give the same two values (it reads the corrected record files).

## 8. Files in this directory

`RESULT.md`, `REFEREE2.md`, `lanes.jsonl` (one line; not appended to `campaign/lanes.jsonl`, which the learn step
writes), `OBSTRUCTION_MAP.before.md`, `OBSTRUCTION_MAP.stage1.md` (after MAP_PENDING, before the round-2 additions),
`apply_map.py`, `apply_map2.py`, `apply_map_stage{1,2}.json`, `ref2_abel.py` with `ref2_abel_{author,zeta,dh}.{log,json}`,
`ref2_step3.{py,log,json}`, `ref2_lg.{py,log,json}`, `before/` (previous versions of the edited engine and campaign
files).
