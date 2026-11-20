# REFEREE: e1-heegner-averaged-nb-span

Adversarial referee pass, 2026-11-17. Local runs only, through `scripts/memcap.sh 8`, peak below 0.3 GB. No ssh.
Referee code and logs: `referee/ref_common.py` (own Kronecker symbol), `referee/ref_zeros.{py,log}`,
`referee/ref_ratio_spans.py`, `referee/ref_ratio.log` (spans and control), `referee/ref_ratio_pairs.log` (pairs; produced by
the same script with the pair loop set to `((-7,-8),(-3,-4))`, which is emptied in the saved copy).

**Outcome: the verdict "precise obstruction" holds. Lemmas A, B, C were re-derived and are correct in substance.
All re-run numbers reproduce. Six corrections are required (one sign/inversion error in a stated formula, one false
sentence about the zero table, four wording or scope errors). None changes the verdict. The word "killed" overstates
what the zero test shows.**

## 1. PROVED steps, re-derived

**Trace formula** (cited as classical). `E(tau,s) = (1/2) sum_{gcd(m,n)=1} y^s/|m tau+n|^(2s)` and
`Im(tau_Q)/|m tau_Q+n|^2 = sqrt|D|/(2 Q(m,n))` give `sum_Q (2/w) E(tau_Q,s) = (sqrt|D|/2)^s zeta_K(s)/zeta(2s)`. Confirmed.
Numeric check (referee): sum over the three reduced forms of D = -23 of the Epstein sum at s = 3 is 2.8206960060,
`2 zeta(3) L(3,chi_-23)` = 2.8206960060.

**Lemma A.** `2^(-s) pi^((s+1)/2) Gamma((s+1)/2)^(-1) |D|^(-1/2) (|D|/pi)^((s+1)/2) Gamma((s+1)/2) L = 2^(-s) |D|^(s/2) L`. Confirmed.
Functional equation and reality on the line follow for real weights. Corrections:
- "elementary factor without zeros" is false as written: `1/Gamma((s+1)/2)` vanishes at s = -1, -3, ... It is zero-free
  in `Re s > -1`, which is all that is used.
- "Davenport-Heilbronn type for any weights" needs "two or more nonzero weights"; with one weight the bracket is an
  Euler product times an exponential.
- Lemma A allows off-line zeros; it does not prove any exist. Existence is MEASURED only (section 3 below). The text
  says this correctly in the lemma and less carefully in the verdict line.

**Lemma B.** `2n/sqrt|D| = 2n'/sqrt|D'|` iff `|D|/|D'|` is a rational square. For fundamental `D < 0`, `|D| = d` or `4d` with
`d` squarefree and the case fixed by `d mod 4`, so the squarefree part determines `D`. Distinctness confirmed. The sum
over `D` is finite, each series converges absolutely for `Re s > 1`, so uniqueness of general Dirichlet series applies.
(i) and (ii) confirmed. Corrections:
- (iii) "not `g(s)` times an ordinary Dirichlet series" is false for arbitrary `g` (take `g = B_x`). The statement that
  is proved is for `g(s) = c lambda^(-s)`: the frequencies `2/sqrt|D|`, `2/sqrt|D'|` (n = 1, coefficient `c_D != 0`) have an
  irrational ratio and cannot both lie in `lambda * N`.
- Scope: "every Heegner bracket" means real combinations of class traces of fundamental discriminants. Divisors that
  are not class traces (single CM points, class-group characters) are not covered by Lemma B; the genus control
  covers one such case numerically. Non-fundamental discriminants are excluded (stated in weakest step 3).
- Lemma B excludes an Euler product in the ordinary sense; it says nothing about zero-freeness. That part is measured.

**Lemma C.** Euler factor `(1+x)/(1-chi(p)x)`: split `1+2x+2x^2+...`, inert `1`, ramified `1+x`. Confirmed, and checked
against the convolution definition `1 * chi * mu_sq` for D = -23, n <= 2000 (max difference 0).
`h_x(s) = e^a sum_D c_D sum_n a_D(n) (n/theta_D)^(-s)`, so `h_x(s)/s` is the Mellin transform of `f_x`; `f_x = 0` on `y < 1`;
with `y = e^u` Plancherel gives `int f^2 dy/y^2 = (1/2 pi) int |h/s|^2 dt = E_mu|h|^2`; `h(1) = <f,1>`, `||1|| = 1`. Confirmed.
`mu` is the Poisson measure of the point 1 for `Re s > 1/2`. Confirmed.
- Gap in the written proof: Plancherel needs `f_x` in `L^2(dy/y^2)` and the Mellin representation on `Re s = 1/2`. This
  follows from pole cancellation and the classical lattice-point error `N_D(y) = kappa_D y + O(y^(1/2))`, not from the
  fourth-moment remark, which only gives finiteness of the line integral. The fix is one line.
- Consequence (ii): with `h/s` in `H^2(Re s > 1/2)`, dividing by the Blaschke product `b` gives
  `E_mu|h|^2 >= |h(1)|^2/|b(1)|^2 = prod |rho/(1-rho)|^2`. Confirmed.
- Consequence (iii): the set `{h_x}` is not a linear space (`a_x` depends on the support of `x`); "closure of the
  normalised span" should read "closure of the set of normalised `h_x`". The implication to RH (point evaluation at
  an off-line zero is continuous and all `h_x` vanish there) is confirmed.
- **Error in the stated formula (verdict item 3 and the task summary):** the horoball is `Im z >= sqrt(Dmax)/(2y)`,
  not `Im z >= 2/(sqrt(Dmax) y)`. Derivation: `N_D(sqrt|D| y'/2)` counts `Im z >= 1/y'`, and `theta_D y = sqrt|D| y'/2` gives
  `y' = 2y/sqrt(Dmax)`. The stated version contradicts `f_x = 0` on `y < 1` (at y = 1 it would contain every CM point of
  height above `2/sqrt(Dmax)`); the corrected one gives exactly the highest point `Im = sqrt(Dmax)/2` at y = 1. Section 2
  ("horoball `Im z >= 1/y`" for the unnormalised variable) is correct. Also `f_x` carries the factor `e^a` and the
  weights `2/w_D`, so it is a weighted signed count, not a signed count.

**Novelty labels.** Lemma A is the standard common-functional-equation computation (the source note's Prop. F for any
number of terms). Lemma B is uniqueness of general Dirichlet series. Lemma C is the Nyman-Beurling/Baez-Duarte
Mellin-Plancherel dictionary applied to this family, and (ii)-(iii) are the source note's T5. Section 7 lists
"New here: Lemma A-C"; they are routine consequences of classical facts and should be labelled so. That class-trace
Epstein combinations with h > 1 have off-line zeros is classical (Davenport-Heilbronn 1936 and later); the control
rows restate it numerically.

## 2. Numeric re-runs (referee code, own Kronecker symbol, different cases)

Zeros (`ref_zeros.log`). The six listed trace zeros for `|D| <= 200` were re-found by Newton from the six-digit values
(shift below 6e-7); winding number on a circle of radius 0.03 is 1 for each (largest phase step 0.07 rad, 96 points);
two were evaluated with mpmath's `dirichlet` (independent of flint): `|B| = 8e-14` and `2e-13` at the roots, 0.19 and
0.64 at distance 0.01. Genus D = -15 roots `0.800011+12.038599i`, `0.927461+15.496634i`: confirmed the same way
(mpmath residual 1e-15, 3e-15). Genus identity checked: Epstein sum of `x^2+xy+4y^2` at s = 3 is 2.1243482871,
`zeta L(chi_-15) + L(chi_-3) L(chi_5)` = 2.1243482872.

Different cases, not in RESULT.md:
- trace, `|D| <= 30` (10 discriminants): off-line zeros `0.707557+23.982585i`, `1.193006+31.511817i`, `1.343773+26.047965i`.
- trace, `|D| <= 150` (47 discriminants): `0.664656+19.768064i`, `0.724281+34.158889i`, `0.894275+24.734909i`,
  `0.961028+35.873334i`, `1.409146+37.552320i`.
- genus bracket D = -35 (`zeta L(chi_-35) + L(chi_-7) L(chi_5)`): `0.629289+29.775720i`, `0.743743+24.718088i`,
  `0.795308+21.675446i`.
Each has winding number 1 on a circle of radius 0.02. Search box `Re s <= 2` (1.5 for the genus case), `Im s <= 40` (30).
Not interval-certified; float64 grid search then Newton, as in the original.

Ratio (`ref_ratio_pairs.log`, `ref_ratio.log`).
- Pair (-7,-8): `c = (-34.426224, 34.426224)`; counting form to Y = 4e5: 2283.6; line integral (mpmath, step 0.05):
  1898.53 (T = 50), 2045.85 (T = 100). These match RESULT.md to all printed digits.
- Different case, pair (-3,-4): counting 9142.6, line 7847.7 (T = 50), 8417.8 (T = 100). `int f^2 - int |f-1|^2` = 1.0003,
  1.0004 for the two pairs (Lemma C).
- Span `|D| <= 100`, counting Gram on a 4e5-cell grid, value functional computed numerically as `int F_D dy/y^2` (no
  `L'(1)`): R = 6.7493; with the `L'(1)` functional (referee formula through digamma and Stieltjes values): 6.7490.
  RESULT.md: 6.7492.
- Different case, span `|D| <= 150` (47 discriminants): R = 5.261 (both functionals). Consistent with the table
  (6.75 at 100, 4.76 at 200; line value 5.22 at X = 160).
- "Two methods agreeing to 1-3%" is correct for the span rows. For the pair it is 6-10% (2046 or 2146 against 2283),
  explained by the slow tail in T; the summary's range 2.1e3-2.3e3 states this correctly.

## 3. Controls

No zeta-only mechanism is claimed; RESULT.md section 6 states that Lemma C and the decrease use only Plancherel and
pole cancellation. The referee tested that statement with a control the original did not run
(`ref_ratio_spans.py`): each `a_D(n)` permuted inside dyadic blocks `[2^k, 2^(k+1))`. This keeps the density and the pole
cancellation and removes multiplicativity; the common factor `zeta(s)/zeta(2s)` is gone.

| span | arithmetic `a_D` | permuted, seed 1 | permuted, seed 7 |
|---|---|---|---|
| `|D| <= 100` | 6.749 | 2.095 | 1.673 |
| `|D| <= 150` | 5.261 | 1.468 | 1.370 |

(numeric value functional, Y = 1e4, eigenvalue cut 1e-6; truncation in Y lowers all entries by a few percent.)
The non-arithmetic family is closer to 1 than the Heegner family at the same size. This confirms, and sharpens, the
statement that the measured ratios do not separate zeta from the controls: a smaller ratio is not evidence of
arithmetic structure. It should be added to section 6.

Control rows 5 and 6 of section 6 (E_a, DH, backward heat, T-NR, Beurling, theta^w, sign twist, unimodular twist) are
"not constructible at step H1" statements, not runs. That is an acceptable reason for a closed lane, but it means the
requirement "fails for the controls for a structural reason" is not met by any proved step: the one step where
arithmetic enters (common factor `zeta/zeta(2s)`) is never used to bound a distance. RESULT.md says this.

## 4. Errors and overstatements in the reading

1. **False sentence.** Section 3: "Every average that is a Heegner amplitude has off-line zeros in the box." The table
   in the same section has `minimiser, X = 100: 0 + 0`, and the minimiser is a Heegner amplitude (the only degree-0
   row besides `deg0`, hence the only kind of element that enters the ratio). Correct statement: all five fixed
   weightings have off-line zeros at each X; the ratio minimisers have 3, 0 and 1 in the box. The task summary
   ("all five averaged weightings") is correct.
2. **"Killed" is the assignment's stopping rule, not a mathematical obstruction.** Off-line zeros of individual
   brackets do not prevent `inf R = 1`: elements of a dense family may each have zeros, and the measured floors are
   1.0006 to 1.03 (2.08 for `deg0`) against ratios of 3 to 28. Four of the five weightings (trace, class sum,
   per-class, Cesaro) are not degree 0, so their amplitudes have a pole at 1 and are outside the ratio problem. What
   is established is: no weighting turns the bracket into an Euler or Eisenstein factor (Lemma B), and the sampled
   brackets have off-line zeros (measured).
3. **"The ratio decreases" has no content.** `R(X)` is an infimum over nested sets, so it is non-increasing by
   definition. The second continue-condition of the assignment is vacuous. Only the rate carries information, and
   RESULT.md correctly declines to extrapolate it. (The code fixes `e^a` by the largest discriminant in the range
   rather than in the support; this can only raise the computed value.)
4. **Grid reliability.** Every non-plain run has a largest edge phase step of 3.12-3.14 rad, so cell winding numbers
   are undetermined on some cells and counts are not reliable in either direction. The table entry "trace X = 200:
   3 + 3" differs from both logs (fine grid 4 + 0 including the on-line zero at `0.5+1.345976i`; wide grid 4 + 3), i.e.
   it was adjusted by hand. Existence of the listed zeros is confirmed (section 2); the counts are indicative.
5. **"Lower bound" and "upper value".** Truncation in T lowers the Gram matrix, but Simpson error and the eigenvalue
   cut are not controlled, and the 4.89 "upper value" is itself truncated in Y. The bracket 4.73-4.89 for X = 200 is
   a numerical estimate, not an enclosure. Weakest step 2 already says so.
6. **Uncited comparison.** "The classical Nyman-Beurling distance with 305 integer dilations is below 0.02" is not
   computed or cited, mixes distance and distance squared, and compares dilation ranges of ratio 305 and 18. It
   should be removed or computed.

## 5. Other checks

- RH is not assumed anywhere. The Blaschke floor remark uses verified height only to state that a ratio near 3
  cannot detect an off-line zero (`2(2 beta - 1)/gamma^2 < 2.3e-25` at height 3e12: confirmed); it is presented as the known
  end point, not as a result.
- Slopes: -1.20, -0.61, -0.42, -0.30 recomputed from the table. Confirmed.
- Section 5 (H4' and the identification of its slack with cuspidal energy) is taken from the source note and not
  re-derived, there or here. "Level 1 height is 0" is immediate (genus 0). "The slack is cuspidal energy, so no bound
  follows" rests on the source note's label and stays unverified in this lane.
- Open, correctly stated: density of the family under RH or GRH.
- Run-time rule: `lineB` ran 24 minutes (stated).

## 6. Surviving claim

For real combinations of two or more class traces of fundamental negative discriminants, the bracket is a
common-functional-equation combination of `Lambda(s, chi_D)` with pairwise distinct generalised Dirichlet frequencies, so no
weighting produces an Euler or Eisenstein factor (proved, routine). Off-line zeros exist for the five fixed weightings
at `|D| <= 50, 100, 200`, for traces at `|D| <= 30, 150` and for genus brackets of D = -15, -20, -24, -35, -40 (measured,
not certified). `R(x) - 1 = int_1^inf |f_x - 1|^2 dy/y^2` with `f_x` the weighted signed count of the divisor in
`Im z >= sqrt(Dmax)/(2y)` (proved, standard dictionary). `R` is about 28, 9.4, 6.75, 5.26, 4.76, 3.08 at
`|D| <= 20, 60, 100, 150, 200, 1000` (measured, 1-3%). A block-permuted non-multiplicative control has smaller ratios
(1.4-2.1), so these values carry no arithmetic information. `inf R = 1` would imply RH; no step bounds the distance;
nothing passes from finite spans to the limit.
