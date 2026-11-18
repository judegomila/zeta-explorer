# REFEREE: c2-repair-owed-passes (lens: general)

Date: 2026-11-18. Adversarial check of `RESULT.md` (claimed verdict: partial-result; repair lane, no attack) and of
the four `REFEREE2.md` files it produced. Labels: CONFIRMED (re-derived or recomputed here), CLASSICAL (not opened),
MEASURED (float), ERROR, WORDING. All runs local through `scripts/memcap.sh 8`, under 3 minutes each, allocations
below 10 MB; the compute server was not used. Scratch scripts in `/tmp/ref-c2/` (not kept in the repo).

## Outcome

**holds = true, with corrections.** Every step labelled PROVED or CONFIRMED in the four second passes was re-derived
and is correct. The bookkeeping claims were recomputed from the files and agree, except two counts in the summary
table and one rank list in the engine log. Nothing assumes RH, nothing restates verified height, no known theorem is
presented as new. No statement about zeros of zeta is made. Requirement flags: R1 = R2 = R3 = R4 = false.

## 1. Errors and corrections

E1 (count, RESULT section 0). "8 section-6 edits": `campaign/MAP_PENDING.md` has 7 (A1 to A7: items 6, 7, 8, 10, 11,
12, 14; section 4 of the result lists the same seven). "13 new rows": the file has 14 (P35-P40 = 6, G22-G24 = 3,
Q19-Q20 = 2, S11, Z21, F8). The other counts agree (5 new section-6 items, 4 control-table edits, 4 row edits,
5 kept results, 10 broken-claim rows).

E2 (wording that overstates, RESULT section 0 and the task claim). "Fails as written: Lemma 3 ... part (d) for DH
and for E_a with a >= 1/8". What is shown is that the repaired proof does not transfer: the approximants
`v_N = M_S sum_{n<=N} U_n v` have `1 - t_N(J rho)` unbounded when `Re(J rho) < -1/2`. That makes this particular
sequence fail; it does not show that the conclusion (infimum on primitive tests = infimum on all tests) is false for
DH or E_a. A different approximating sequence is not excluded. REFEREE2 says "NOT ESTABLISHED", which is the correct
label; the summary table and the sentence "(d) fails" should use the same words. Count line: 1 lemma part false
(3(a)), 1 lemma part not established for two controls (3(d)).

E3 (dependency not stated in RESULT). The threshold "E_a with a >= 1/8" rests on the zero-free half-plane
`Re s > 7/8` (Lean-checked per BRIEF, 2026 result). With classical inputs only, (Z1) is not known for any a > 0, so
the classical form of the finding is "not established for E_a, any a > 0". REFEREE2 names the input; RESULT should.

E4 (record inconsistency). `engine/ENGINE_LOG.md` gives the pre-change ranks reusing one closed node as 3, 20, 51,
52, 57; RESULT 2.3 gives 3, 14, 20, 45, 51, 52, 57. The run that produced the "before" numbers (19 of 60, rank 6)
was not saved, so neither list can be recomputed. The saved backup is one build earlier; for it the stated ranks
1, 4, 13, 19 were recomputed here and agree.

E5 (drift, not an error at writing time). "27 of the 40 distinct node sets left the list": against the current
`CANDIDATES.json` (regenerated 23:59, after the result) the number is 24 of 40.

W1 (attribution, `c1-missing-controls/REFEREE2.md`). "Selberg 1946 ... odd moments of lower order": the 1946 paper
states the even moments; the odd moments and the distributional form are in later accounts (Ghosh 1983, Tsang 1984).
The pass already proposes the Tsang citation. The conclusion is unaffected.

W2 (node record). `vasyunin-lammin-uniform-lower-bound` has `status: proved` with one referee pass and
`type: identity` for a two-sided inequality. The `refereeStatus` field says "proved, unrefereed", so the record is
honest; the type label is wrong in kind (it removed the node from the open-lemma pool, which was the purpose).
`p = 2 open` in the statement is consistent with `2^(Omega_N) = N^(o(1))`.

W3 (generator rule 1). The hard reject uses the union `nodes | launchedNodes` of every closed or refuted outcome
(all 28 records, not only `e1`). Two generic nodes that happened to be launched together (`landau-one-sided-target`,
`legendre-lcm-identity`, `nyman-beurling-dx`, `euler-product-torus-parametrisation`) now exclude every candidate
that contains both. 505 raw candidates are rejected by it and none was inspected. The result names this risk for
the penalty rule only.

## 2. Bookkeeping, recomputed

- Ten `e1-*` outcome records against the REFEREE.md verdict lines: 8 hold, 2 "does not hold as written, obstruction
  stands" (`e1-forcing-free-bilinear-split`, `e1-rs-torus-laguerre-orbit`). CONFIRMED. `aboutZeros` true in two engine
  records and false in the lane lines: as stated.
- `campaign/lanes.jsonl`: 18 lines, 10 with `e1-`; fields (`brokenProved` 1 for the two lanes, `restatement` true for
  two, `lemmasDecided` 1 for the Gram lane, r1..r4 false) as stated. CONFIRMED.
- `generate.py` against `scratch/generate.before-c2.py`: exactly two inserted blocks (5 lines each). CONFIRMED.
- Current top 60 against `outcomes.json`: 0 supersets of a closed set, 0 candidates with a node of a closed minimal
  set, 0 sharing two nodes with `nodes | launchedNodes` of a closed lane; 12 candidates contain a node of some `e1`
  lane (8 from closed lanes' launched-only nodes, 4 from the partial Gram lane). Rule 1 rejection count 505 read from
  the meta block. CONFIRMED.
- `referee2` field present in four `c1` outcome files; referee count not raised. CONFIRMED.

## 3. Mathematical steps re-derived

Theorem A step (iii) (`c1-multidelay-bohr-section/REFEREE2.md`). CONFIRMED. Orientation and signs of the two
vertical sides; Titchmarsh 4.11 with `X = CT`, `sigma >= 1/2 - c > 0`; right side main term `H(0)(T-1)` and
`O(T^{1/2-c} log T)`; left side with `h(-c+it) = -conj h(c+it)`: diagonal weight `n^{-1/2+c} m^{-c} = m^{-1/2}` giving
`conj h(1/2)`; off-diagonal split at `n/2 < m < 2n` with `|log(m/n)| >= |m-n|/max(m,n)` and
`n^{-1/2+c} <= (m/2)^{-1/2+c}`; `X^{1-s}/(1-s)` and `O(X^{-sigma})` terms; horizontal side via the Herglotz sum and the
convexity exponent `1/4 + c/2`; passage from `T'` to every `T`. No error found.
Numeric rerun, two cases not in the result (mpmath 20 digits, residues `2/|phase'|`, each pole verified `|b - 1| < 1e-6`):

| case | T | poles | mass (predicted T Re H(0)/pi) | mean | predicted | diff * sqrt T |
|---|---|---|---|---|---|---|
| `b = B(6^{-z})`, `B(w) = (w+0.3)/(1+0.3w)`, `H(0) = 13/7` | 1000 | 285 | 590.80 (591.15) | 5.7265 - 0.0495i | 6.2768 | 17.5 |
| same | 4000 | 1140 | 2363.20 (2364.59) | 6.0268 - 0.0256i | 6.2768 | 15.9 |
| same | 12000 | 3422 | 7093.75 (7093.76) | 6.1414 - 0.0075i | 6.2768 | 14.9 |
| `b = 4^{-z} (3^{-z}+0.5)/(1+0.5*3^{-z})`, `H(0) = 1` | 1000 | 395 | 317.63 (318.31) | 3.1766 - 0.0247i | 3.4365 | 8.3 |
| same | 4000 | 1581 | 1272.47 (1273.24) | 3.3292 + 0.0121i | 3.4365 | 6.8 |
| same | 12000 | 4745 | 3818.93 (3819.72) | 3.3544 - 0.0012i | 3.4365 | 9.0 |

The first case has `H(0) != 1`, so it tests the `H(0)` term separately from `conj h(1/2)`. Both agree with the
formula at rate about `T^{-1/2}`. In all five cases (these and the result's) the difference is negative: a
secondary term of size `T^{1/2}` with a fixed sign is consistent with the data and allowed by the error bound; it is
not identified.

Lemma 3' (`c1-spinor-hecke-primitive/REFEREE2.md`). CONFIRMED for zeta. (a') `U_n` shifts supports to the right, so
`M_S(D)` is in D; point evaluations at the zeros of `m_S` give infinitely many independent vanishing conditions.
(b') `1 - t_N = m_S * partial sum`; `L^2` on `Re z = 0`; low zeros: partial summation gives
`2^k delta int_N^inf x^{-delta-1} Psi(x) dx = O(N^{-delta} (log N)^k)` at `delta ~ c/sqrt(log N)` (the stated
`(log N)^{3k/2}` is a valid upper bound); high zeros: `|1 - t_N| <= 2^k Psi(N)` against `G^{-A}`. (c') index by
convergence of Gram matrices. Hermitian symmetry of Q (needed in 4') follows from J-invariance of the zero set.
Rerun with `S = {2, 7}`, heights 25.01, 48.01, 333.3, `N = 1e3 .. 1e200`: `sup |t_N|` at `Re z = 0`:
6.6e-2 -> 5e-14; at -0.3: 0.64 -> 1.7e-13; at -0.45: 2.2, 2.2, 0.16, 3.3e-4, 2.6e-9; at -0.55: 5.1 -> 3.0e11; at
-0.62: 9.4 -> 3.4e25. Convergence for `Re z > -1/2` (slow near the edge), growth for `Re z < -1/2`: as stated.
Scope for DH, E_a, T-NR: the logic is correct subject to E2, E3. "DH has zeros with Re s > 1" is CLASSICAL
(Davenport-Heilbronn 1936; Titchmarsh 10.25) and was not recomputed; the value "sup Re about 1.12" is taken from the
map and is not checked by this lane or by this report.

Lemma 4 and Lemma 4'. CONFIRMED. `v_s = S_s v - e^{-s/2} V(1/2) phi` has transform 0 at 1/2; `Q(S_s v) = Q(v)` because
`conj(J rho) = -rho`; each cross term has modulus at most `e^{-s(1/2 - |Re rho|)}` times a summable majorant;
dominated convergence needs `|Re rho| < 1/2` for every zero, i.e. no zero on `Re s = 1`. Lemma 4' is a short density
statement of the same type as 3'; it is single-author and now has one referee (this report).

Lemma 5. CONFIRMED: substitution `r' = r + 2 log d` gives `d^{-1/2-z}[y_z - R_{c,d}]`; Moebius expansion by linearity;
block identity by inserting `1 = P + Q`.

Step 2.1(c) (`c1-leeyang-chain-closure/REFEREE2.md`). CONFIRMED. Gaussian average: `E e^{-a(z + i s X)^2}` exists iff
`2 a s^2 < 1`, i.e. `4 a lambda < 1`, and equals `q^{-1/2} e^{-a z^2/q}`. Closed form with the quadratic factor
rechecked on three new parameter sets (a, 4 a lambda, x_1, z) = (0.7, 0.3, 2.2, 1.3), (2.0, 0.95, 0.5, -0.8),
(0.25, 0.6, 1.7, 2.9): relative differences 1.3e-31, 2.7e-22, 5.1e-31. Route 2: `f - c f' = -c e^{z/c}(e^{-z/c} f)'`,
kernel factor `(1 + lambda u^2/n)^n <= e^{lambda u^2}`, Hurwitz: correct, and it needs Lemma M as the pass says.
The Craven-Csordas Lemma 3.2 hypothesis `alpha_1 alpha_2 < 1/4` matches the statement as I know it; the source was
not opened here.

GHS input. Chain-rule reduction to `u_3(i,j,k) <= 0` with site-dependent fields `h_i >= 0`: CONFIRMED. The theorem
in that form is CLASSICAL and is the standard statement; not opened here either. Brute force rerun with a different
seed (2026): maximum `u_3` 4.4e-16 over 1500 systems; +0.77 with negative fields or antiferromagnetic couplings.
Certificate recomputed with independent code (exact rationals): m = 44: minimum coefficient 0, third cumulant
+0.037910; m = 43: -0.022493; m = 48: 0, +0.285019; new member m = 60, cos = 30/31, w = 2: 0, +0.431684.

Part D (`c1-missing-controls/REFEREE2.md`). CONFIRMED: `(2k)!/(k! 2^k) v^k` at `v = (log log T)/(2 pi^2)` equals
`(2k)!/(k! (2 pi)^{2k}) (log log T)^k`; Selberg's even-moment theorem is unconditional; Bohr-Jessen 1932 covers
`1/2 < sigma <= 1` unconditionally with the horizontal-cut branch; the limit law has a continuous density, so the
statement as written is the weaker form; the tightness argument needs one bounded rectangle. See W1.

## 4. Controls

No zeta-only mechanism is claimed, so there is no control run that could falsify a claim here. The
control-relevant statements were checked as statements about proof scope (section 3, Lemma 3' and 4'): for DH the
density lemmas are not established (zeros right of 1); for E_a they depend on a zero-free half-plane; for T-NR the
condition `arccosh(|c|/2)/log q < 1/2` is correct. Theorem A uses complete multiplicativity inside a no-go.

## 5. Requirement flags (set by this referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | No attack. Multiplicativity appears only in the no-go Theorem A. |
| R2 | false | No height-uniform statement about zeta is established. |
| R3 | false | No mechanism for a control to fail on; the two density lemmas are proved for zeta only. |
| R4 | false | Nothing passes to the critical line. |

## 6. What survives

Repair completed. Bookkeeping agrees with the files (two table counts and one log rank list wrong). Second passes:
Theorem A step (iii) holds with error `O(T^{1/2+c} log T)` for every T; Lemma 3' and Lemma 4' hold for zeta; Lemmas
4, 5 hold; step 2.1(c) holds by two routes; the GHS, Selberg and Bohr-Jessen inputs are used in their classical
form (sources other than Craven-Csordas not opened by either pass). For DH and E_a the equality "infimum on
primitive tests = infimum on all tests" is not established (not shown false). No negative verdict changes.
