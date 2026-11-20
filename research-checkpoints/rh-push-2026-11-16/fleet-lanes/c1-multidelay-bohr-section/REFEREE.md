# REFEREE (adversarial, lens: general) for c1-multidelay-bohr-section/RESULT.md

Date: 2026-11-17. Referee verdict: **the claimed verdict (precise obstruction, lead closed in the forms tested) holds.**
Every PROVED step was re-derived by hand and confirmed. Two independent numeric reruns on different cases agree with
the formulas. No step assumes RH, none restates verified height. Six corrections of wording/scope are listed; none
changes the verdict. Flags set by the referee: R1=false, R2=false, R3=false, R4=false.

Referee scripts were kept outside the lane directory (`/tmp/ref_c1/a.py`, `d.py`; run through `scripts/memcap.sh 8`,
55 s and about 60 s, local, float64/mpmath dps 18). The compute server was not used.

## 1. Re-derivation of the PROVED steps

**Lemma 1 (confirmed).** With `N = [[-1,-1],[1,1]]`: `N^2 = 0`, so `M(Z)M(W) = M(Z+W)`. `JN = N*J = -[[1,1],[1,1]]`
and `N*JN = 0`, so `M(Z)*JM(Z) = J - Re Z [[1,1],[1,1]]` and the defect for `Z = -alpha U_P` is
`-alpha Re U_P [[1,1],[1,1]]` as stated. `Re(w/(1-w)) = (r cos - r^2)/(1 - 2r cos + r^2)`, range
`[-r/(1+r), r/(1-r)]`, mean 0, mean square `r^2/(2(1-r^2))`: all correct. (c) is Kronecker plus unique factorization.
Checked constants: `D_{1/2}({2}) = 1.673`, `D_{1/2}({2,3}) = 3.174`, reserves 0.23 / 1.38 / 2.53 at `t = 10, 1e2, 1e3`.

**Proposition 3 (confirmed).** Partial summation with PNT remainder gives
`sum_{p<=Q} log p p^{-s} = (Q^{1-s} - 2^{1-s})/(1-s) + O(Q^{1-sigma} e^{-c sqrt(log Q)})` for fixed `sigma < 1`, uniform
on a compact `t`-window; prime powers add `O(log Q)` at `sigma = 1/2`. The rotation argument is correct.
This is a standard fact about truncated Euler sums left of 1; it should be labelled CLASSICAL, not new.

**Theorem A (confirmed, including the error terms the author flagged as weakest).**
- Coefficient bound `|h^(m)| <= 2 Re H(0)` (several-variable Caratheodory) and `sum_m m^{-c} = prod (1-p^{-c})^{-1}`: correct.
- Reflection `h(-conj z) = -conj h(z)` follows from `Re h = 0` on the axis; it also extends `h` to the whole plane
  with poles only on the axis, which the contour at `Re z = -c` needs (the statement says "neighbourhood of
  `Re z >= 0`"; the reflection supplies the rest. Say so).
- Right side: only `n = m = 1` is resonant; remainder `O(T^{1/2-c})`. Correct.
- Left side, diagonal: `T sum_m conj(h^(m)) m^{-1/2} = T conj h(1/2)`, absolutely convergent. Correct, sign `+`.
- Left side, off-diagonal, redone in full: pairs with `m >= 2n` or `m <= n/2` give `O(X^{1/2+c})`; for
  `n/2 < m < 2n`, `m != n`, `1/|log(m/n)| <= 2 max(m,n)/|m-n|`, so each `m <= 2X` contributes
  `|h^(m)| m^{-c} * O(m^{1/2+c} log m)`; total `O(X^{1/2+c} log X * sum|h^(m)|m^{-c}) = o(T)` since `c < 1/2`.
  (Sharper: only `O(log^{|P|} X)` smooth `m` occur, giving `O(X^{1/2} log^{|P|+1} X)`.) The range `T < m <= 2X` causes
  no problem. The author's outline bound is right.
- Horizontal sides: unit-interval mass bound from `Re h(1+it)`; far poles contribute a bounded amount to
  `h(x+iy) - h(c+iy)`; near poles give `log`-integrable singularities; convexity exponent `1/4 + c/2 < 1`. Correct.
  The restriction to "a suitable sequence" is unnecessary: the poles in a unit interval contribute `o(T)`.
- Special case check: `h = (log p/2) coth(z log p/2)` gives mean `1/(1 - p^{-1/2})`, which is the known mean of zeta on
  the progression `1/2 + 2 pi i k/log p`.

**Theorem B (confirmed).** `L - h` PR and `h` PR give `0 <= mu_h <= mu_L`, `mu_L` atomic on zeros, no linear term
(`h` bounded on `x -> +infinity`), so Theorem A applies with left side 0, forcing `Re H(0) = 0`. The proof does not
assume RH; the hypothesis implies RH (the author states this). Content: a conditional-on-RH no-go.

**Proposition C (confirmed; trivial).** `S(x) -> -1` because `L(x) ~ (1/2) log x`; then `|b(0)| = 1`. The proof uses
only the growth of the gamma term, so it holds verbatim for DH, `E_a`, Dirichlet L-functions and every control with a
gamma factor. It carries no arithmetic information.

**Proposition D (confirmed).** Residues at `w = 0` (double), `1-s`, `rho - s`, `-2k-s` recomputed; with
`zeta'/zeta = -G + sum 1/(s-rho)` the identity `Phi_Q = sum_rho k_lam(s-rho)` follows exactly, and the pole at `s = 1`
cancels between `G`, `G'/lam` and the `Q^{1-s}` term. `(1-u/lam)_+ e^{-xu}` is nonnegative, decreasing and convex on
`[0, infinity)` (second derivative `e^{-xu}[x^2(1-u/lam) + 2x/lam] >= 0`, slope jump at `lam` upward), so Polya gives
`Re k_lam >= 0`. The converse via normal families is correct. This is a Fejer-kernel form of a standard
explicit-formula positivity criterion; the author labels it a restatement, which is the right label.

## 2. Numeric reruns on different cases (MEASURED by the referee)

**(a) Theorem A, new case: three delays, different inner function, and the DH control.**
`b = (4 w1 w2 w3 - w2 w3 - w1 w3 - w1 w2)/(4 - w1 - w2 - w3)` on `D^3` (denominator zero-free on the closed polydisc,
unlike the author's `2 - w1 - w2`, which vanishes at `(1,1)`), `w = (2^{-z}, 3^{-z}, 5^{-z})`, `phi = 0.7`, `H(0) = 1`.

| `T` | poles | `sum r_j` (pred) | zeta: `2 pi S/T` (pred 1.8351 + 0.1212i) | DH: `2 pi S/T` (pred 1.8471 + 0.1135i) |
|---|---|---|---|---|
| 500 | 270 | 158.85 (158.84) | 1.7380 + 0.1936i | 1.9030 + 0.0409i |
| 1000 | 541 | 318.22 (317.99) | 1.8145 + 0.0766i | 1.9284 + 0.0713i |
| 1500 | 811 | 476.97 (477.15) | 1.7963 + 0.0948i | 1.8810 + 0.0915i |

Agreement 2 to 5 percent at `T = 1500`, consistent with the `T^{-1/2+c}` error. The DH prediction used is the
author's Section 4 formula `c_1 conj H(chibar(p) p^{-1/2}) + c_2 conj H(chi(p) p^{-1/2})` plus `H(0)`; it is confirmed
as the main term. In this example the DH bracket also has positive real part, in line with `test5` (no DH
counterexample found; the DH analogue stays OPEN). All residues came out real positive (asserted in the script).

**(b) Tapered section, different window, `Q` and seeds.** `Q = 200`, `t in [2000, 6000]`, step 0.02, max of
`Re U^F_Q - Re G`:

| | `sigma = 0.5` | `sigma = 0.6` |
|---|---|---|
| zeta | -0.235 | -0.680 |
| 4 random sign twists | 1.58, 1.08, 0.70, 1.33 | 0.24, **-0.02**, 0.42, 0.40 |
| 3 random unimodular twists | 1.18, 0.96, 0.94 | **-0.016**, **-0.173**, 0.21 |
| Liouville twist (`eps_p = -1` for all `p`) | 0.68 | **-0.045** |

At `sigma = 0.5` the author's separation is reproduced. At `sigma = 0.6` four of eight twists are contractive on this
window. So the statement in RESULT.md items 5 and Section 5, "every sign and unimodular twist tested violates it for
`Q >= 100` at `sigma = 0.5` and `0.6`", is specific to the author's window `[100, 1e4]`, whose low end has a small
reserve. The twist failure is a competition between `Q` and the reserve `(1/2) log(t/2 pi)`, not a structural
failure at each height. This agrees with the author's own conclusion (no R3) but the sentence should carry the
window.

## 3. Errors and corrections (none changes the verdict)

1. **Lemma 1 title and verdict item 1 overstate.** "Classification of joint sections" and "a block of prime sections
   has no matrix or torus freedom" are true only inside the unipotent family `M(Z)` fixed by the chain convention.
   General J-inner linear-fractional sections are OPEN (the author says so in Section 4). Lemma 1 is an identity
   about the chosen sections, not a classification.
2. **Twist failure is window-dependent** (Section 2(b) above). Reword item 5 and the Section 5 reading.
3. **Lee-Yang special case is stated without its needed step.** For `h = D'/D + (log N)/2` one must show that the
   several-variable polynomial is zero-free on the whole open polydisc (not only on the tori `|w_p| = p^{-x}` reached
   by the orbit) and that `Re H >= 0` there. This is true (the orbit ray lies in the amoeba-complement component of
   the constant term, which is the log-convex convergence domain of `1/D`, a complete Reinhardt domain; then the
   Poisson integral on the tori), but it is not in the text, nor is positivity of `h` (needs the Hadamard form with
   symmetric type). Mark the corollary "no Dirichlet polynomial with all zeros on the line has all of them at zeros
   of zeta" as PROVED only once these two lines are written; as it stands it is a sketch.
4. **Prior art not cited.** The single-progression case of Theorem A is the known mean value of zeta on vertical
   arithmetic progressions (Putnam 1954 for the non-progression of zeros; Steuding-Wegert 2012 and later work for the
   mean `1/(1 - l^{-s_0})`). Theorem A is a weighted several-frequency extension by the same contour method; it should
   be presented as such. Proposition 3 and Proposition D(a),(b) are classical.
5. **Theorem A hypothesis.** State that reflection extends `h` to the plane; drop "suitable sequence".
6. **Scope of "closed".** The no-go is for finite `P`, `H` holomorphic on the polydisc (absolutely convergent
   Dirichlet series over `P`-smooth integers), additive form, plus the trivial multiplicative form. Infinite `P`,
   general J-inner sections and the DH analogue are open, as the author lists. Theorem B is vacuous unless RH holds,
   so it removes a mechanism; it gives no information about zeros.

## 4. Checks requested by the assignment

- RH assumed anywhere: no. Theorem B's hypothesis implies RH (stated). Proposition D(c) is an equivalence.
- Verified height restated: no. The measured contractivity of the tapered section for `t <= 1e4` reflects that the
  zeros in that range are on the line; the author presents it as MEASURED and as a restatement, not as a result.
- Known theorem presented as new: partly (item 4 above): cite the progression mean-value literature; label
  Proposition 3 classical.
- Zeta-only mechanism claimed: none proved. The one measured separation (tapered section) was rerun with controls
  (Section 2(b)); it separates at `sigma = 1/2` on the windows tried, not uniformly, and the identity behind it holds
  for DH and `E_a`.
- No statement about zeros of zeta is made beyond "the poles of such `h` are not all zeros", which is a statement
  about `h`.

## 5. Requirement flags (referee, strict)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Theorems A, B use finite `P`; multiplicativity enters only as a point evaluation in a no-go. Proposition D uses no multiplicativity. |
| R2 | false | Nothing height-uniform is established: Theorem A is a mean, Proposition D(c) is an equivalence with RH, the rest is measured on finite windows. |
| R3 | false | Lemma 1 holds for every twist; Proposition C holds for every control with a gamma factor; Proposition D's identity holds for DH and `E_a`; twist failure is window-dependent. |
| R4 | false | Proposition 3: the sharp section fails at fixed `sigma < 1`. No passage to the line. |

## 6. Verdict

holds = true. Surviving claim: for finite `P` and `H` holomorphic with `Re H >= 0` on `D^P`, the weighted first moment
of zeta over the poles of a lossless `h = H((p^{-z}))` is `(T/2 pi)(H(0) + conj h(1/2)) + o(T)` with real part at least
`(T/2 pi) Re H(0)`; hence no such `h` other than an imaginary constant can be split off `xi'/xi` as a positive-real
summand, and no bounded multi-delay factor divides `S`; the sharp joint section fails at fixed `sigma < 1` by the pole
term; the tapered section is an explicit-formula identity equivalent to RH. The lead gives no progress on RH.
