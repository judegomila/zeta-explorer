# REFEREE: c3-repair-map-theorem-a (adversarial pass, lens: general)

Date: 2026-11-18. Reviewed: `RESULT.md` and `REFEREE2.md` of this lane, against `c2-jinner-multidelay-lft/RESULT.md`
Sections 3 to 5, `campaign/MAP_PENDING.md`, `push/OBSTRUCTION_MAP.md`, `campaign/STRATEGY.md` and the engine files
(read as data; no engine script was run and no file other than this one was written). One numeric run, local,
through `scripts/memcap.sh 8` (37 s). The compute server was not used.

## Outcome

**The result holds as claimed (repair lane, partial-result, no statement about zeros).** Every PROVED step of
Theorem A' and of the DH conductor-5 derivation was re-derived here and confirmed; an independent ball-arithmetic
run on a new case agrees; the bookkeeping counts were reproduced. Six corrections are listed in Section 4; none
changes a mathematical statement, two concern the engine (the new controls have no edges; the FM node is labelled
"proved"). Nothing assumes RH, nothing restates verified height, and the result does not present Theorem A' as
more than an extension of a classical mean value.

Flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## 1. Re-derivation of Theorem A' (all steps confirmed)

- Herglotz form and reflection: with atomic measure `pi sum r_j delta_{gamma_j}` and no linear term (F2), the
  regulariser is purely imaginary, so `h(z) = -h*(-z)` and the residues are `r_j`. Confirmed.
- F1: Caratheodory `|a_m| <= 2 Re a_1`; Dirichlet series absolutely convergent for `Re z > 1`. Used only on
  `Re z = 2` and `Re w = 3` (argument `5/2`). Confirmed.
- F2: `K_eps` closed and totally bounded in `c_0`, inside the open unit ball; `H` continuous (Cayley transform
  bounded). Confirmed; the twisted lifts `h*_psi` are values of `conj H` on `K_eps` since `psi` is completely
  multiplicative with `|psi(p)| <= 1`.
- F3: `(1 - rho)/(1 + rho)` at `rho = 2^{-1/2}` is `(sqrt 2 - 1)^2 = 3 - 2 sqrt 2`. Confirmed.
- Step (0): mass bound from the Poisson kernel at `y = T + 1/2` (factor 5/4); orientation `sum = R - Lf + O(1)`.
- Step (1): on `Re z = 2`, `e^{i delta z} = e^{2 i delta} e^{-delta t}`; `k = 1` term `a_1/(2 pi delta) + O(1)`;
  `k >= 2` bounded by `sum |d_k|/(2 pi log 2)`. Confirmed.
- Step (2): `e_k = sum_{nm=k} n^{-5/2} conj(a_m) m^{-2}`. Confirmed.
- Step (3): `chi - chi_+ = -(i/2 pi)(2 pi)^s e^{i pi s/2} Gamma(1 - s)`, size `t^2 e^{-pi t}`; the bound contains
  no `k`. Change of variable `u = 1 - s` re-done: prefactor `i Y/(2 pi) = k e^{i delta}`, value
  `k^{5/2} e^{5 i delta/2} e^{-Y}`, `-Y = -2 pi k sin delta + 2 pi i k cos delta = -2 pi k eta + 2 pi i k`.
  Confirmed; integrality of `k` enters only through `e^{2 pi i k} = 1`.
- Step (4): `e_k k^{5/2} = sum_{nm=k} conj(a_m) m^{1/2}`; residue at `w = 1` times `e^{i delta/2}` equals
  `conj h(1/2)/(4 pi sin(delta/2))`; the line `Re w = 1/2 + eps` contributes `O(delta^{-1/2-eps})` because
  `|eta^{-w}| <= |eta|^{-Re w} e^{delta |Im w|/2}`. Confirmed.
- Step (5): `4 - 2 sqrt 2 = 1.1716`. Confirmed.

## 2. Re-derivation of the DH formula (D1 to D7 confirmed; this is a second derivation)

- D1: `eps(conj chi) = conj eps(chi)` for odd `chi` (from `tau(conj chi) = chi(-1) conj tau(chi)`), so
  `eps(chi) c_1 = c_2` gives both conditions. Confirmed.
- D4: `X_{c,+} = (2 pi)^{s-1} e^{-i pi s/2} Gamma(1 - s) = -i chi_+`; `-25 i (k/5)^{5/2} = -i 5^{-1/2} k^{5/2}`.
- D5: `e(a/5) = (1/4) sum_psi tau(conj psi) psi(a)` checked by orthogonality; `f_n = 0` for `5 | n`; the only poles
  at `w = 1` are `psi = conj chi` (with `c_1`) and `psi = chi` (with `c_2`), residue of `L(w, chi_0)` equal to 4/5.
- D6: `-i tau(chi)/sqrt 5 = eps(chi)`; bracket `a_1 + c_1 h*_chi(1/2) + c_2 h*_{conj chi}(1/2)`, and
  `h*_chi(1/2) = conj H((conj chi(p) p^{-1/2})_p)`. Confirmed.
- D7: Harnack disc centre 3, radius `2 sqrt 2`; `3 - 2 sqrt 2 sqrt(1 + kappa^2) = 0.0597`; total `1.0597`. Confirmed.

## 3. Numeric rerun on a different case (MEASURED-BALL, this referee)

Own script (not the lane's), python-flint 100-bit balls. `P = {2, 3, 5, 13}` (5 in `P`, which the lane did not
test), weights `c_p = (1.0, 0.6, 1.7, 0.8)`, phases `(2.3, 0.9, 1.4, 5.1)`, `t_0 = 1`, 7594 poles to height 8000.
Brackets: zeta `M = 7.103772 - 2.269535 i`; DH `M = 7.322323 - 0.708297 i`. `Sec` for DH written from (D5),
including the term `f(w)[h* - h*_{chi_0}](w - 1/2)` at the poles of the `p = 5` summand.

| `delta` | zeta `abs(S)` | zeta `D = S - M/(2 pi delta) - Sec` | DH `abs(S)` | DH `D` |
|---|---|---|---|---|
| 0.04 | 28.8 | -0.00344 + 1.61724 i | 23.9 | -2.24701 + 0.77476 i |
| 0.02 | 61.6 | 0.00704 + 1.64680 i | 51.3 | -2.27996 + 0.75443 i |
| 0.01 | 125.2 | 0.01209 + 1.66174 i | 110.7 | -2.29698 + 0.74370 i |
| 0.005 | 249.4 | 0.01456 + 1.66925 i | 231.9 | -2.30563 + 0.73820 i |

Successive differences of `D` halve for both functions, while `S - M/(2 pi delta)` without `Sec` moves by several
units (zeta: `-0.03 + 3.35 i` to `10.34 - 6.96 i`). The main term, the Gauss-sum recombination, the second-order
residues and the bounded remainder are confirmed on this case. `chi(2) = i` for Conrey label 2 was checked.

Controls: the lane claims no zeta-only mechanism. The DH run above is the control run for the reviewed theorem:
DH passes (positive bracket), as the result states.

## 4. Bookkeeping reproduced, and corrections

Reproduced: map 392 -> 441 lines; `diff` has 25 hunks, 66 lines added and 17 removed (83); row counts by prefix
`P 42, G 25, Q 22, S 11, Z 21, F 8, T 3, L 5 = 137` (before: 118); `apply_map.py` then `apply_map2.py` run on a
copy in a temporary directory reproduce `OBSTRUCTION_MAP.stage1.md` and the map on disk byte for byte; 49 of the 50
blockquote lines of MAP_PENDING are in the map verbatim (five with the list marker replaced by a number), the 50th
is the Q12 row that the second script edits, as declared. Graph: 1502 nodes, 8403 edges, edge types as stated, 14
control nodes. Generator meta: 62055 generated, 45928 scored, rejections sum to 16127; 60 candidates. `aboutZeros`
is false in both `e1-*` records and in `outcomes.json`. STRATEGY line 64 carries the closure with the uncovered cases.

Corrections:

1. **The new controls are inert in the graph.** `ctl-WT` and `ctl-FM` exist as nodes but have no edge of any type
   (`control-defeats` counts: DH 221, HEAT 82, ..., WT 0, FM 0). "Engine controls WT and FM added" is true for the
   control list only; they do not yet filter or score any candidate. RESULT Section 7 item 3 mentions untested
   keyword patterns but not this.
2. **Node `ctl-FM` has `status: "proved"` and `source: "OBSTRUCTION_MAP.md section 2; syntheses"`.** The map text
   and RESULT say the definition is written by this lane and unrefereed. The node should carry that status and source.
3. **`ENGINE_LOG.md` has no entry for this rebuild** (last change before the rebuild; no mention of the lane, WT or
   FM). The counts are recorded only in this lane's RESULT.md.
4. **STRATEGY lead 20 is marked CLOSED although one of its three named parts ("boundary nodes of R_a for
   a >= 1/2") was treated by no lane.** The text says so, but the status word covers more than was closed;
   "closed in two of three parts" is the accurate status. Map section 6 item 7 also keeps the header "closed in
   two forms; three forms open" above a body that now says the three forms are closed.
5. **`REFEREE2.md` remark 4 and Section 4.2 are incomplete for `5 in P`.** The term
   `f(w)[h* - h*_{chi_0}](w - 1/2)` is regular at `w = 1` (main term unchanged, as stated) but it has poles on
   `Re w = 1/2` and contributes to `Sec`; "the sum over the four characters" omits it. Checked in Section 3 above.
6. **Status of the `Sec` expansion.** `S = M/(2 pi delta) + Sec + O(1)` and `D = C + O(delta)` remain a sketch
   with numerical support (three cases now, finite `P` only); RESULT Section 7 item 1 says this, the verdict
   paragraph ("confirm the main and second-order terms") should carry the word MEASURED. The engine's "173 map
   rows" is a different count from the map's 137 rows and is not explained in the result.

Not checked here: the condensed texts of rows P41, P42, G25, Q21, Q22 and WT against their lanes (read for
overclaim only: none makes a statement about zeros of zeta); `ref2_step3` and `ref2_lg` were not rerun; Lemma R,
Theorem C and Proposition L remain with one referee.

## 5. Checks requested by the assignment

- Assumes RH: no. Theorem B' has a hypothesis that implies RH; the result says so and uses B' only as a no-go.
- Restates verified height: no (the only height input is "no zero with `0 < gamma <= 14`").
- Known theorem presented as new: no. Map item 46 describes Theorem A' as an extension of the mean of zeta on
  vertical arithmetic progressions with no bearing on zeros; the DH functional equation and Gauss-sum expansion are
  labelled CLASSICAL.
- Statement about zeros of zeta: none.

## 6. Flags

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No attack; the reviewed sign holds for DH, so no step uses multiplicativity. |
| R2 | false | Abel mean and bookkeeping; no statement in any window. |
| R3 | false | DH passes the reviewed no-go; controls were added, none is defeated. |
| R4 | false | Nothing passes to the critical line. |

Surviving claim: as stated in RESULT.md, with corrections 1 to 6. Referee count for Theorem A': three (first
referee, `REFEREE2.md`, this pass); for the DH conductor-5 formula: two derivations.
