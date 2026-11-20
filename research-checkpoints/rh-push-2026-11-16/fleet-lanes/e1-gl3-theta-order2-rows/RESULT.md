# e1-gl3-theta-order2-rows: theta, maximal-parabolic and cuspidal coefficients on the double cover of GL(3) as order-2 rows (2026-11-17)

Internal working note. Slug `e1-gl3-theta-order2-rows`. Nothing committed, pushed or posted. Not refereed.
Files here: `test1.py`, `test1.log`, `test1.json` (residues of the quadratic A_2 series; exact sympy + exact
integer array; 4 s), `test2.py`, `test2.log`, `test2.json` (Kohnen form, exact q-expansion to 400000; row matrices
607 x 2000; 18 s). Both runs local, single process, through `scripts/memcap.sh 8`, interpreter
`.venv-arb/bin/python`; largest allocation about 64 MB (printed first). No ssh. No repo data module imported.

Labels: PROVED (complete argument or exact computation here) / CLASSICAL (cited; "recalled" = quoted from memory,
paper not opened) / MEASURED / ARGUED (derivation given, not line by line) / MODEL / OPEN.

**Verdict: precise obstruction. The first decisive test stops the combination; one pivot was taken and stops at the
same place.** The theta representation on the double cover of GL(3) has no Whittaker coefficients; its nonzero
Fourier coefficients are those of the Jacobi theta function of GL(2): a quadratic symbol on the slice m = n^2,
with row series L(2s, chi_d) and no reciprocal. The Eisenstein series induced from theta has Whittaker coefficients
equal to a symbol times zeta(2s) on the slice m = b n^2. Model abscissa for both: 1. Pivot: rows with non-symbol
data (square roots of central values, from genuine cusp forms). There the row does produce mu(e) chi_D(e) without
insertion, at relative weight e^{-1/2}: the reciprocal is 1/L(s + 1/2, chi_D), and in the model of
`r3-method-limit` the detection condition becomes beta > 3/2 - h/r >= 1. The non-symbol data enter as a diagonal
row scaling or as column weights seen only through their absolute values. Model abscissa 1, not below 5/6. Cusp
forms on the double cover of GL(3) itself were not computed (no explicit example); an argued structural reason is
given. No statement about any zero is made. RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), OBSTRUCTION_MAP (sections 2, 5, 6; rows Z14, Z15), SYNTHESIS_OVERNIGHT rows N19-N21,
SYNTHESIS_POSITIVITY_RESIDUALS row OBS-ORDER-TWO-NONPOISSON, `n4-gl3-double-cover-absorption` RESULT + REFEREE,
`n3-order2-dual-rank-classification` RESULT, `r3-method-limit` RESULT sections 1-2, graph nodes map-open-1,
separating-probe, mem-new-probe-non-sextic, seven-eighths-abscissa-formula.

Closed before: Borel Eisenstein coefficients on the double cover of GL(3) (N21); one-variable polynomial symbol
rows (N19); spin rows (N20); half-integral-weight forms on GL(2) in the square direction
(OBS-ORDER-TWO-NONPOISSON, mechanism M2). Named as untested by the N21 referee: the theta representation, residues
of the A_2 series on its polar lines, cuspidal and maximal-parabolic objects on the double cover of GL(3).

Tested here: (i) theta_3 and the theta-induced Eisenstein series, through the residues of the A_2 series
(exact); (ii) pivot: the rows that a maximal-parabolic Eisenstein series induced from a genuine cusp form of
GL(2) would carry, computed exactly for one explicit form.

Decision rule from the assignment: continue only if the model abscissa 1 - h/r is below 5/6.

---

## 2. First lemma: coefficients of theta on the double cover of GL(3)

Sources. None was opened; statements are recalled and section numbers may be off.
* Kazhdan-Patterson, "Metaplectic forms", Publ. Math. IHES 59 (1984) 35-142. Exceptional representation theta of
  the n-fold cover of GL(r): Langlands quotient of the genuine principal series at the exceptional exponent;
  globally the iterated residue of the Borel Eisenstein series. Section I.3: theta has a Whittaker model iff
  n >= r (unique iff n = r or n = r + 1 in the suitable twist). Section II: constant terms of theta along a
  parabolic are theta functions of the Levi factor.
* Bump-Hoffstein, "Cubic metaplectic forms on GL(3)", Invent. Math. 84 (1986) 481-505: this is n = r = 3 (cubic
  cover), where theta is generic. It is not the double cover; its coefficients are cubic Gauss-sum data and belong
  to the order-3/6 family of the existing 7/8 method (map rows Z14, Z15).
* Bump-Ginzburg, "Symmetric square L-functions on GL(r)", Ann. of Math. 136 (1992) 137-205: on the double cover of
  GL(r) theta has unique semi-Whittaker models (characters of N nontrivial on alternate simple roots only).
* Cai, "Fourier coefficients for theta representations on covers of general linear groups", Trans. AMS 371 (2019)
  7585-7626 (citation confirmed by search; content recalled): the unipotent orbit attached to theta on the n-fold
  cover of GL(r), r = a n + b, is (n^a b). For n = 2, r = 3: (2, 1).

**Lemma T [CLASSICAL-recalled for (i), (ii); (iii) ARGUED; (iv) PROVED in the Goldfeld-Hoffstein /
Chinta-Friedberg-Hoffstein model, `test1.log`].**
(i) n = 2 < r = 3: theta_3 is not generic. Every coefficient against a character psi(m_1 n_12 + m_2 n_23) with
m_1 m_2 != 0 is zero. There is no two-index Whittaker array.
(ii) The nonzero coefficients are of type (2, 1): (m_1, 0) and (0, m_2). Each is obtained by first taking the
constant term along the unipotent radical of a maximal parabolic, which is theta_2 x theta_1 on the Levi factor,
then a Fourier coefficient of theta_2.
(iii) theta_2 is the Jacobi theta function. In classical terms the family is theta_d(z) = sum_n (d/n) n^nu
e(n^2 z), nu in {0, 1}: coefficient at m equal to (d/n) if m = n^2 and 0 otherwise. Row d against column m:

    c_theta(m, d) = (d/n) 1_{m = n^2}.

Symbol type, supported on the slice of squares (about X^{1/2} columns up to X). Row series
sum_m c_theta(m, d) m^{-s} = L(2s, chi_d): an L-value, no reciprocal.
(iv) Consistency with (i), exact. For the A_2 p-part f = (1 - xy)/((1 - x)(1 - y)(1 - p x^2 y^2)) of N21
(x = p^{-s}, y = p^{-w}): the pole of Z(s, w) at w = 1 comes from the columns m = square only, and its local
factor is

    [(1 - y) f_even-in-x](x, 1/p) = 1/(1 - x^2)        (sympy, difference 0),

so Res_{w=1} Z(s, w) = zeta(2s) up to the factor at 2; symmetrically Res_{s=1} Z = zeta(2w). zeta(2s) is regular
at s = 1 (local factor p^2/(p^2 - 1)), so the iterated residue at s = w = 1 of the (1, 1) Whittaker coefficient is
0, as (i) requires. In the Whittaker normalisation (N = 1 + x + y - x^2 y - x y^2 - x^2 y^2) the residue has
local factor (1 - 1/p^2)(1 - x^2/p): it is 1/(zeta(2) zeta(2s + 1)), a reciprocal at real part >= 1 (mechanism M1
of `res-order-two-nonpoisson`: normalising factor, h/r = 0).

**Lemma E (theta-induced maximal-parabolic Eisenstein series) [ARGUED from (iv) + MEASURED, `test1.log` (b)].**
The Eisenstein series induced from theta_2 x theta_1 is the residue of the Borel series at w = 1; its Whittaker
coefficient with twisting parameter b in the d-variable is Res_{w=1} sum_{m,d} chi_b(d) a(m, d) m^{-s} d^{-w}.
Computed on the exact integer array a(m, d) (coefficient of m^{-s} in L(s, chi_{d_0}) Q_d(s); odd m <= 199, odd
d <= 19999): the mean over d of chi_b(d) a(m, d) is

| b | on the slice m = b n^2 (all n in range) | max abs off the slice, D = 4999 | D = 19999 |
|---|---|---|---|
| 1 | 1.000 (m = 1, 9, 25, 49, 81, 121, 169) | 0.0048 | 0.0015 |
| 3 | 0.667 (m = 3, 27, 75, 147) | 0.0096 | 0.0020 |
| 5 | 0.800 | 0.0112 | 0.0033 |
| 7 | 0.857 | 0.0144 | 0.0047 |
| 15 | 0.533 | 0.0112 | 0.0034 |
| 21 | 0.571 | 0.0172 | 0.0056 |

The on-slice value is phi(b)/b, independent of n. So the coefficient is (phi(b)/b) b^{-s} zeta(2s) (odd part): a
constant on the slice m = b n^2. A second twist chi_a(m) multiplies it by chi_a(b n^2) = (a/b) for (n, a) = 1.
Row b against column a: the Jacobi symbol table (a/b) times a zeta value. Symbol type; N19-N21 and
`ap-order-two` Lemma 0 apply unchanged. Reciprocity signs and the factor at 2 were not tested.

**Answer to the first lemma.** Theta rows and theta-induced rows are of symbol type on a thin slice, as the
assignment expected. No non-symbol data.

---

## 3. First decisive test: h, r and the model abscissa for the theta rows

Model of `r3-method-limit` (S), (L): signal exponent C(s) = s - 1 + lx/2 + h/r for a row whose principal term is
1/L(s, .); low estimate at or above Z^{lx/2}; abscissa B >= 1 - h/r.

* r = 2 (the symbol (d/n)). Coherent set: d d' in a square class times squares, i.e. chi_d = chi_d'. For
  fundamental d this is d' = d only (exceptional coset = the identity class; with a character chi_5 inserted it
  moves to d' in 5 d (Q^x)^2, as measured by the N21 referee).
* Principal term of a theta row: L(2s, chi_d). No reciprocal, so no zero of any L-function is a pole of a row:
  h = 0 in (S). Model abscissa 1 - 0/2 = 1.
* With mu inserted by hand (x_n = mu(n)): the row is sum_n mu(n) chi_d(n) n^{-2s}; in the variable u = 2s this is
  the row of `ap-order-two` (Lemma 0, Theorems C, D, E): direct and Poisson sides coincide and the low estimate is
  the conclusion, f(theta) = theta. Nominal h/r = 1/2 with a circular input list.
* Row Gram matrix (`test2.log`, rows = the 607 fundamental discriminants 1 < D <= 2000, columns m <= 2000):
  theta rows have 44 nonzero columns (n <= 44), so rank <= 44 and 5482 row pairs with correlation above 0.5; this
  is the thin slice, not a coherent set (the same holds for random signs on 44 columns). Symbol table (D/m) on all
  2000 columns: no pair above 0.5, largest off-diagonal correlation 0.196, sv_1^2/rows = 0.019.

**Stop.** 1 - h/r = 1 >= 5/6 for the theta and theta-induced rows. The combination as assigned is closed.

---

## 4. Pivot (one): rows with non-symbol data

The adjacent candidates are the maximal-parabolic Eisenstein series induced from a genuine cusp form on the double
cover of GL(2), and cusp forms on the double cover of GL(3). Their inducing data / coefficients are not symbols:
by Waldspurger and Kohnen-Zagier the coefficient at a fundamental discriminant D is a square root of a central
L-value. Exact test object: Kohnen's form of weight 13/2 on Gamma_0(4), Shimura lift Delta,

    delta = (1/2) E_4(4z) D theta - 60 (D G)(4z) theta = q - 56 q^4 + 120 q^5 - 240 q^8 + 9 q^9 + 1440 q^12 - ...

(D = q d/dq, (D G) = sum n sigma_3(n) q^n; Kohnen-Zagier, Invent. Math. 64 (1981) 175-198, recalled; the expansion
printed by `test2.py` agrees with the recalled one). Coefficients c(n), n <= 400000, exact integers.

**Checks [PROVED by exact computation, `test2.log`].**
1. c(n) = 0 for n = 2, 3 mod 4, all n <= 400000 (plus space).
2. c(D) != 0 for all 607 fundamental discriminants 1 < D <= 2000.
3. Kohnen's relation (Math. Ann. 248 (1980); Shimura, Ann. Math. 97 (1973)):
   c(D m^2) = c(D) sum_{e | m} mu(e) (D/e) e^5 tau(m/e). 15647 cases (all D m^2 <= 400000, m >= 2), 0 mismatches.
4. Classification test of `n3-order2-dual-rank-classification` on the raw coefficients: for p = 3, 5, 7, 11, 13
   the column m = p, as a function of the row D (607 rows), takes one value per symbol class:
   c(D p^2)/c(D) = tau(p) - (D/p) p^5. Frequency-0 part tau(p) (252, 4830, -16744, 534612, -577738); symbol part
   exactly -(D/p) p^5 (243, 3125, 16807, 161051, 371293). In the unitary normalisation (divide by p^{11/2}):
   frequency-0 part tau~(p) of size O(1), flat (character) part -(D/p) p^{-1/2}.

**Lemma S (shape of the non-symbol rows) [PROVED-rel check 3 for delta; CLASSICAL in general].**
Normalised rows R(D, m) = c(D m^2)/(c(D) m^{11/2}) factor exactly as R = X T,

    X(D, e) = mu(e) (D/e) e^{-1/2},      T(e, m) = tau~(m/e) 1_{e | m},

with T independent of D. Consequences:
(a) The non-symbol number c(D) is a diagonal row scaling. It does not enter the normalised row, its Gram matrix,
    its coherent set, or h and r.
(b) The row produces mu(e) (D/e) without insertion (this is outside Theorem N of N19, whose shifts are integers:
    here the shift is 1/2). The row series is L(s + 11/2, Delta)/L(s + 1/2, chi_D): reciprocal at shift 1/2 from the
    unitary axis of the Hecke part. This is mechanism M2 of OBS-ORDER-TWO-NONPOISSON, re-verified here on raw
    coefficients.
(c) Dual type: character dual (class A of Theorem N) plus a dominant frequency-0 term tau~(p) whose target is
    L(s, Delta) itself, not a reciprocal.

**Lemma M (rows of the form symbol x coefficient) [PROVED].** For rows chi_D(m) x_m with any complex x_m, the Gram
matrix sum_m chi_D(m) chi_D'(m) |x_m|^2 depends on x only through |x_m|^2. Measured with x_m = c(m)/m^{11/4}
(the model for a Whittaker coefficient of an Eisenstein series induced from delta, see weakest step 2): maximal
difference between the Gram matrix and that of the symbol table with weights |x_m| is 0.00e+00; random column
signs give identical singular values (3.644, 3.291, 2.802, 2.697). The signs of c(m), which are the non-symbol
data, are invisible to every row-norm or large-sieve estimate. They could act only through the principal term
sum_m c(m) chi_D(m) m^{-s}, which is the twisted L-series of delta: entire, with a functional equation, no Euler
product, and no reciprocal of any L-function.

**Row matrices [MEASURED, 607 x 2000, rows scaled to mean norm 1].**

| rows | sv_1..sv_4 | sv_1^2/rows | off-diagonal correlation rms / max | pairs above 0.5 |
|---|---|---|---|---|
| symbol table (D/m) | 3.43, 2.78, 2.51, 2.32 | 0.019 | 0.030 / 0.196 | 0 |
| theta rows (44 columns) | 8.48, 6.84, 6.03, 5.29 | 0.119 | 0.203 / 0.931 | 5482 |
| Shimura rows R = X T | 21.31, 8.28, 5.87, 3.78 | 0.748 | 0.761 / 0.991 | 172418 |
| Shimura rows minus the common part tau~(m) | 16.71, 11.68, 7.53, 5.46 | 0.460 | 0.471 / 0.976 | 67007 |
| (D/m) c~(m) | 3.64, 3.29, 2.80, 2.70 | 0.022 | 0.060 / 0.301 | 0 |
| same, random column signs | 3.64, 3.29, 2.80, 2.70 | 0.022 | 0.060 / 0.301 | 0 |
| random signs | 1.54, 1.54, 1.53, 1.52 | 0.004 | 0.022 / 0.131 | 0 |
| control: Hecke part of E_a (a = 0.3), minus common | 21.49, 8.60, 5.83, 4.05 | 0.761 | 0.633 / 0.999 | 111514 |
| control: chi_5(e) inserted, minus common | 17.74, 12.52, 5.83, 4.75 | 0.519 | 0.516 / 0.983 | 78062 |
| control: random multiplicative signs on e, minus common | 16.63, 11.82, 7.47, 5.46 | 0.456 | 0.470 / 0.978 | 66978 |

Reading. The Shimura rows are strongly correlated for all pairs D, D', for two reasons that are not a coherent set
in the sense of the 7/8 method: the common Hecke part tau~(m) (rank one, same for every row), and the weights
e^{-1/2}, which put most of the symbol part on e = 2, 3, 5, so rows correlate by the class of D modulo 8, 3, 5.
The same figures occur for the random multiplicative sign control (0.456 against 0.460) and for the E_a control.
Nothing in the table separates the true rows from the controls.

**Model abscissa [MODEL].** Insert the row of Lemma S(b) into (S), (L) of `r3-method-limit`. A zero beta of
L(., chi_D) is a pole of the row at Re s = beta - 1/2. It is detected iff
Z^{(beta - 1/2) - 1 + lx/2 + h/r} > Z^{lx/2}, i.e.

    beta > 3/2 - h/r.

With r = 2 and h <= 1: beta > 1. The shift 1/2 is equal to the largest gain h/r = 1/2 that order 2 could give, so
the two cancel and the model abscissa is 1 for every admissible h. This agrees with the statement of
OBS-ORDER-TWO-NONPOISSON ("a probe bound at exponent e is equivalent to a zero-free half-plane Re s > e + 1/2").
1 is not below 5/6. Stop.

**Why the shift is 1/2 [ARGUED].** A quadratic Gauss sum has modulus p^{1/2}; the Hecke operators of a genuine
form act through p^2-directions (the genuine spherical Hecke algebra of the double cover is supported on squares:
Kazhdan-Patterson; Savin; recalled), with eigenvalues normalised at size 1. A symbol entering a Hecke relation is
a Gauss sum divided by p, hence carries p^{-1/2}. In the Borel Eisenstein series there is no Hecke part and the
spectral variable can be re-centred on L(s, chi_d) (N21: coefficient +chi_d(p), an L-value); once a cuspidal Hecke
part fixes the unitary axis, the symbol-bearing reciprocal lies 1/2 to its right. In every case computed in N21
and here, "Moebius sign on a symbol" and "centred on the unitary axis" do not occur together:

| object | symbol term | sign | position |
|---|---|---|---|
| Borel Eisenstein (N21), off the slice | +chi_d(p) | L-type | centred |
| Borel Eisenstein (N21), slice d = d_0 m^2 | -chi_{d_0}(p) | Moebius | argument s + 2w (real part 3/2) |
| theta rows, theta-induced rows (section 2) | (d/n) on m = n^2; (a/b) | L-type or none | L(2s, chi_d); zeta(2s) |
| normalising factors | none | Moebius | 1/zeta(2s + 1), edge |
| genuine cusp form on GL(2) (Lemma S) | -(D/p) p^{-1/2} | Moebius | shift 1/2 |

**Cusp forms on the double cover of GL(3) [OPEN; not computed].** No explicit genuine cusp form on this cover was
available, so no Gram matrix was computed. Expected from the argument above and from the metaplectic
Casselman-Shalika formula (Chinta-Offen, Amer. J. Math. 135 (2013); McNamara; recalled): local Whittaker values
are polynomials in the Satake parameters of the Flicker-Kazhdan lift (Publ. Math. IHES 64 (1986) 53-110) with
coefficients built from quadratic Gauss sums (0, +-p^k, symbol times p^{k - 1/2}); Whittaker models are not unique
(local dimension 4 at odd places, recalled), so base coefficients on square classes are free non-symbol numbers
that act as scalings, as c(D) does in Lemma S(a). This is an expectation, not a result.

---

## 5. Controls

No zero statement is made, so no control can pass wrongly. The assignment asks what happens at the coherent-set
step.

| control | at the coherent-set step | reason |
|---|---|---|
| DH (character mod 5 inserted) | not excluded: same figures (0.519 against 0.460); coherent coset moves from D' = D to D' in 5 D (Q^x)^2 | rows are symbol rows composed with a fixed operator; a character twist relabels them |
| sign twist, random multiplicative signs on e | not excluded: 0.456 against 0.460; Lemma M: Gram matrix exactly unchanged for column signs | the Gram matrix sees only absolute values |
| E_a (Hecke part zeta(s+a) zeta(s-a), a = 0.3) | not excluded: same structure R = X T with a different T (0.761); Cohen's Eisenstein series of half-integral weight is the genuine form with this kind of lift | the symbol part X does not depend on the Hecke part |
| backward heat, NR, Beurling | not formulable (coefficient identities; no residue symbols on Beurling integers) | not a quantitative handle |

Exceptional coset: {D' : chi_D' = chi_D}, i.e. D' in D (Q^x)^2; among fundamental discriminants the single
element D. No control fails at this step. The three requirements: all primes together: yes (exact identities);
uniform in height: yes (half-plane statements); fails for the controls for a structural reason: no, the rows are
the same for every control.

---

## 6. What is and is not covered

Covered: theta_3 (no Whittaker coefficients; degenerate coefficients = symbol on squares); the theta-induced
Eisenstein series (symbol times zeta(2s), in the Goldfeld-Hoffstein model, odd part); the residues of the A_2
series at w = 1 and s = 1 (N21 referee item 2.3); the square-direction rows of one genuine cusp form on GL(2) on
raw coefficients; Gram sign-blindness for symbol x coefficient rows.

Not covered: (1) cusp forms on the double cover of GL(3) (section 4, OPEN); (2) the exact Whittaker coefficients
of the Eisenstein series induced from a genuine cusp form on GL(2) (the form chi_D(m) c(m) is a model);
(3) the residue on the third polar line s + w = 3/2; (4) factors at 2 and at infinity, reciprocity signs;
(5) covers of degree >= 4 paired with quadratic rows.

---

## 7. Three weakest steps

1. **Lemma T (i)-(iii) is cited from memory.** Non-genericity of theta_3 (Kazhdan-Patterson), the (2, 1) orbit
   (Cai) and semi-Whittaker uniqueness (Bump-Ginzburg) were not opened; the passage from the adelic statement to
   the classical row c_theta(m, d) = (d/n) 1_{m = n^2} is argued. The only checks here are the exact vanishing of
   the iterated residue at s = w = 1 and the measured slice structure of the w = 1 residue (D <= 19999, convergence
   at the 10^-3 level, twist in one variable only, in the Goldfeld-Hoffstein model, not in the Gauss-sum
   normalisation).
2. **The pivot tests GL(2) data, not GL(3) objects.** The Whittaker coefficients of a maximal-parabolic Eisenstein
   series induced from a genuine cusp form were not derived; chi_D(m) c(m) and the Shimura rows are the two natural
   ways the inducing data can appear, and other combinations (for example Dirichlet series in a modulus with
   Gauss sums and shifted indices c(m_1 n)) were not examined. Genuine cusp forms on the double cover of GL(3)
   were not computed at all. One form (weight 13/2, level 4) and one size (607 x 2000) were used.
3. **The model pricing is a transplant.** "beta > 3/2 - h/r" inserts a shifted reciprocal into the scalar system
   of `r3-method-limit`, which was written for the sextic architecture; the "p^{-1/2} per symbol" explanation is
   argued, not proved, and the claim that Moebius sign and centring never coincide is a table of computed cases,
   not a theorem about all genuine automorphic forms on double covers.

---

## 8. Verdict

Precise obstruction. On the double cover of GL(3): theta has no Whittaker coefficients and its Fourier
coefficients are quadratic symbols on the squares (row series L(2s, chi_d)); the theta-induced Eisenstein series
has coefficients symbol times zeta(2s). Both are of symbol type with h = 0 and model abscissa 1; N19-N21 apply.
Pivot: rows carrying non-symbol data (genuine cusp forms) do produce mu(e) chi_D(e) without insertion, but at
shift 1/2, where the detection condition is beta > 3/2 - h/r >= 1; the non-symbol data are row scalings or
sign-blind column weights; the controls give the same rows. Model abscissa 1, not below 5/6: stopped as the
assignment prescribes. OBSTRUCTION_MAP section 6 item 1 stays open only for genuine cusp forms on the double cover
of GL(3) (not computed) and for covers of degree >= 4 paired with quadratic rows. No zero-free statement, no
statement about RH.
