# e2-gl3-cover-cuspidal-rows: cuspidally induced Eisenstein rows on the double cover of GL(3) as order-2 rows (2026-11-18)

Internal working note. Slug `e2-gl3-cover-cuspidal-rows`. Nothing committed, pushed or posted. Not refereed.
Files here: `find_form.py` (search for the second ternary form), `test1.py`, `test1.log`, `test1.json` (first
decisive test, 11 s), `test2.py`, `test2.log` (pivot check, exact), `dl/bf.txt` (text of arXiv:1403.6055v3, the one
source opened). All runs local, single process, through `scripts/memcap.sh 8`, interpreter `.venv-arb/bin/python`
(numpy); largest allocation 12 MB (printed before allocating). No ssh. No repo data module imported.

Labels: PROVED (complete argument or exact computation here) / CLASSICAL (cited; "recalled" = from memory, paper
not opened; "opened" = text read here) / MEASURED / ARGUED / OPEN.

**Verdict: precise obstruction. The first decisive test stops the combination.** The Whittaker coefficients of the
maximal-parabolic Eisenstein series on the double cover of GL(3) induced from a cusp form are Dirichlet series whose
coefficients are (quadratic exponential sum) x (Fourier coefficient of the genuine inducing form at a product
index). This gives two row types: twist rows (symbol x fixed column weight; symbol type, h = 0, Gram sign-blind) and
product-index rows d -> c(dm), where c(D)^2 is proportional to L(1/2, f x chi_{-D}) (Waldspurger). The product-index
rows are not of symbol type, but on the explicit form attached to the elliptic curve 11a (c(n) exact to 10^6;
c(D)^2 checked against 1264 central values computed by the approximate functional equation, relative agreement
1.2e-11): the row has no correlation with mu(d) chi_d(m) beyond random signs, the prime-direction statistic that
absorption needs to equal -1 is 0 within 1/sqrt(n), and the Gram spectrum equals that of the random-sign control.
The row series is entire: no reciprocal, h = 0, model abscissa 1 - h/r = 1. Pivot (one): the only coherent set
found is the square class d' in d (Q^x)^2 (Shimura relation, exact), which is the shift-1/2 mechanism already
closed by `e1-gl3-theta-order2-rows` Lemma S. Genuine cusp forms on the double cover of GL(3) were again not
computed (no explicit example). No statement about any zero is made. RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), OBSTRUCTION_MAP (section 4 rows Z14, Z15; positive list 33, 35; section 6 item 1),
`n4-gl3-double-cover-absorption` RESULT, `e1-gl3-theta-order2-rows` RESULT + REFEREE, `r3-method-limit` RESULT
sections 0-1, graph nodes map-pos-35, map-pos-33, separating-probe, mem-sextic-theta-squarefree.

Closed before: Borel Eisenstein rows on the double cover of GL(3) (n4); theta and theta-induced rows, and the
square-direction rows c(D m^2) of a genuine cusp form on GL(2) (e1). Named as not covered by e1 (its section 6,
items 1-2): the exact Whittaker coefficients of the Eisenstein series induced from a genuine cusp form, where e1
used the model chi_D(m) c(m); and cusp forms on the double cover of GL(3).

Tested here: the shape of those Whittaker coefficients from an opened source, and the row type that e1's model
did not contain: product-index rows c(dm), with signed coefficients, validated against central values.

Decision rule (assignment): the combination needs a row that carries mu(d) chi_d(m) without insertion, centred on
the unitary axis, with a coherent row set of relative size h/r = 1/2. Kill if the row is of symbol type, or if
its correlation with mu(d) chi_d(m) and its Gram spectrum are those of random signs.

---

## 2. First lemma: the row c -> a(c, m)

**Source [CLASSICAL, opened].** Brubaker-Friedberg, "Whittaker coefficients of metaplectic Eisenstein series",
arXiv:1403.6055v3 (GAFA 25 (2015), journal reference recalled). Theorem 4.1, equation (16): for a cominuscule
maximal parabolic P = MN (all maximal parabolics of GL(r) qualify) and inducing data f_1 (x) f_2 on the cover of
M, with the test vector f_{s,a}, the psi-Whittaker coefficient of E_{f,s} equals

    W_{f_1,f_2,s}(1) * sum over (d_1, ..., d_N) of H(d_1, ..., d_N) delta_P^{s+1/2}(D) Psi(D) zeta_D c^psi_{f_1,f_2}(D),

N = dim U^P, H "the exponential sum defined in (12)", c^psi_{f_1,f_2}(D) the Whittaker coefficients of f_1 and
f_2 for the character u_M -> psi(u_M conjugated by (D^{w_M})^{-1}), D a torus element computed from the d_j
(their Proposition 5.9). Theorem 6.5 (opened: statement located, not checked): H is twisted multiplicative. The
introduction (opened) states the intended application: inducing forms on the double cover of GL(2), the
coefficient is "a Dirichlet series involving an exponential sum ... and a product of Fourier coefficients of the
inducing data. These Fourier coefficients in turn are related to central values of quadratically-twisted GL_2
L-functions by work of Waldspurger." Their worked example is GL(4) with Levi GL(2) x GL(2); the case GL(3) with
Levi GL(2) x GL(1) (N = 2) is covered by Theorem 4.1 but is not written out there.

**Specialisation to GL(3), Levi GL(2) x GL(1) [ARGUED; not derived line by line].** N = 2. The inducing form must
be genuine on the cover of the Levi factor; on the GL(2) block this is a form g of half-integral weight with
coefficients c(n) (Shimura lift f). The character index (m_1, m_2) and the summation variables (d_1, d_2) enter
(i) through H, which for the double cover is a product of quadratic Gauss sums, i.e. for squarefree arguments
quadratic symbols times square roots and a factor depending on residues mod 4, and (ii) through the index of the
coefficient of g, which is m_1 times a ratio of the d_j. The exact exponents and the exact index were not derived.
Both ways the labels can enter give a row type:

* **Twist row (label in the symbol).** a_II(c, m) = (c/m) c(m_1 m) w(m): quadratic symbol times a column weight
  that does not depend on the row. This is the model of e1 (its Lemma M).
* **Product-index row (label in the index).** a_I(c, m) = c(c m) w'(m) for (c, m) = 1, with a symbol in the other
  label. By Waldspurger / Kohnen-Zagier / Gross (recalled) c(D)^2 is proportional to L(1/2, f x chi_{-D}) |D|^{k-1/2}
  for fundamental -D: the central values enter as squares, the row entries are their signed square roots.
* A third reading, the array L(1/2, f x chi_d) chi_d(m) (central value as a row factor), is a diagonal scaling of
  the symbol table.

**Lemma 1 (symbol type) [PROVED].** By the criterion of e1 (row label enters only through a real symbol, times
row-independent column weights x_m, times a row scaling): a_II and the third reading are of symbol type. Their Gram
matrix sum_m chi_c(m) chi_c'(m) |x_m|^2 depends on x only through |x_m|^2 (e1 Lemma M; re-measured in section 3:
identical singular values with lambda(m) and |lambda(m)|). The row series sum_m chi_c(m) x_m m^{-s} with
x_m = c(m_1 m) is a character twist of a cusp form of half-integral weight restricted to a progression: entire
(CLASSICAL, recalled: Mellin transforms of a cusp form at the cusps; no Euler product). h = 0.
a_I is not of symbol type: for squarefree coprime c, m the entry c(cm) is not a function of a symbol of (c, m)
times a column weight (measured in section 3: the signs matter for the Gram matrix; exact failure: the supports
depend on chi_{-cm}(11)).

**Lemma 2 (what "absorbs Moebius" requires) [PROVED as an equivalence of formulations; scalar].** In the model
(S), (L) of `r3-method-limit`, a row gives a signal at a zero beta of L(s, chi_c) only if its row series
A_c(s) = sum_m a(c, m) m^{-s} (unitary normalisation, a(c, 1) != 0) has a pole there, i.e. A_c(s) = B_c(s)/L(s, chi_c)
with B_c regular and nonzero near the zeros, at shift 0. On coefficients: sum_{p <= x} a(c, p) chi_c(p) log p
= -(a(c, 1) + o(1)) x, and the same with the Moebius pattern at squarefree m. The row-order identity
mu(pi) g(chi) = -J(chi, rho) g(chi rho)/g(rho) supplies this for Gauss-sum rows of order 6; for order 2 the row
itself must supply it. Three requirements follow for a(c, m):
(R1) prime-direction correlation of a(c, p)/a(c, 1) with -chi_c(p) equal to 1 (not o(1));
(R2) the shift is 0: a factor p^{-1/2} on the symbol term (e1 Lemma S) moves the pole to beta - 1/2;
(R3) a coherent set of rows of relative size h/r = 1/2 on which the poles add.
An entire row series fails (R1) at every shift: it has no poles.

**Lemma 3 (row series of the product-index row) [CLASSICAL-recalled + ARGUED].** sum_m c(cm) psi(m) m^{-s} is a
finite combination of additive twists of the Dirichlet series of g (detect c | n by additive characters mod c).
Each additive twist of a cusp form is entire with a functional equation. Hence no pole, no reciprocal of any
L-function, h = 0 in (S). Model abscissa 1 - h/r = 1.

---

## 3. First decisive test [MEASURED unless marked]

Object. f = the newform of weight 2, level 11 (eta(z)^2 eta(11z)^2; a_n exact to 150010). g = (theta_{Q_2} -
theta_{Q_1})/2, Q_1 = 4x^2 + 11y^2 + 12z^2 + 4xz = (2x+z)^2 + 11y^2 + 11z^2, Q_2 = 3x^2 + 15y^2 + 15z^2 - 14yz -
2xz - 2xy (construction: Gross, "Heights and the special values of L-series", 1987, recalled; Q_1 derived here from
the maximal order Z<1, i, (1+j)/2, (i+k)/2> in the quaternion algebra (-1, -11); Q_2 found by `find_form.py` as
the reduced form of the same discriminant 1936 whose theta series differs from that of Q_1 on n = 0, 3 mod 4
only). g = q^3 - q^4 - q^11 - q^12 + q^15 + 2q^16 + q^20 - q^23 - ..., exact integers c(n), n <= 10^6.

Cost printed before the run: 5575 fundamental d with |d| <= 10^4, 11 not dividing d; 4.2e8 float64 terms
(15|d| terms per d, tail below e^{-27}); 2.8e7 Kronecker symbols. Formula [CLASSICAL, recalled]:
L(E_d, 1) = (1 + w_d) sum_n a_n chi_d(n) n^{-1} exp(-2 pi n/(|d| sqrt 11)), w_d = chi_d(-11). Run time 11 s.

**Checks [PROVED by exact computation / MEASURED].**
1. L(E, 1) = 0.2538418608559467 (recalled reference 0.2538418608559...).
2. Plus-space support c(n) = 0 for n = 1, 2 mod 4: holds to 10^6 (exact).
3. Waldspurger / Gross relation: for the 1264 fundamental d < 0, |d| <= 10^4, w_d = +1, c(|d|) != 0, the ratio
   L(E_d, 1) sqrt|d| / c(|d|)^2 lies in [2.917633233861, 2.917633233897]. For the 123 with c(|d|) = 0 the computed
   L-value is below 1e-6 in absolute value. For all 1401 with w_d = -1, c(|d|) = 0.
4. No negative central value among the 5575 (minimum -2.3e-13, rounding).
5. Shimura relation c(n p^2) = (a_p - (-n/p)) c(n) - p c(n/p^2), p = 3, 5, 7, 13, 17: 180896 cases, 0 mismatches
   (`test2.log`, exact).

**(a) Correlation with mu(d) chi_d(m).** Family: -D fundamental, chi_{-D}(11) = -1 (where c can be nonzero),
c~(D) = c(D)/D^{1/4}. z = sum_D v(D) mu(D) chi_{-D}(m) / (sum_D v(D)^2)^{1/2} (standard normal under independent
random signs); columns m coprime to 22, m < 60 (27 columns; 6 columns at 10^6).

| D <= | n | c~ vs mu chi: max / rms | sign(c) vs mu chi | c~^2 - mean (central values) vs mu chi | control: random signs | c~ vs chi alone |
|---|---|---|---|---|---|---|
| 10^4 | 1387 | 2.69 / 1.13 | 1.82 / 0.86 | 3.02 / 1.20 | 2.58 / 1.33 | 0.90 / 0.30 |
| 10^5 | 13930 | 2.46 / 1.21 | 2.40 / 1.01 | 2.31 / 1.02 | 1.39 / 0.73 | 0.49 / 0.20 |
| 10^6 | 139325 | 1.29 / 0.81 | 1.47 / 0.72 | 2.22 / 1.12 | 1.30 / 0.81 | 0.12 / 0.07 |

Correlation coefficient of c~(D) with mu(D): 0.043, -0.018, -0.0003 against 1/sqrt(n) = 0.027, 0.0085, 0.0027.
Central values from the approximate functional equation, both signs of d, 2778 values: z-scores of
sum_d (L_d - mean) mu(d) chi_d(m): max 2.62, rms 1.17. All at the random-sign level. The last column (no mu) is
below the random level: sums of cusp-form coefficients cancel beyond square root (classical); this is a property
of an entire series, not a reciprocal.

**(b) Prime direction (requirement R1).** rho(D_0) = sum_p c~(D_0 p) chi_{-D_0}(p) / (n sum_p c~(D_0 p)^2)^{1/2}
over primes p with D_0 p <= 10^6 and -D_0 p fundamental. Absorption needs rho = -1 (up to normalisation, of
order 1).

| D_0 | c(D_0) | primes | rho with chi_{-D_0}(p) | rho with 1 | 1/sqrt(n) |
|---|---|---|---|---|---|
| 3 | 1 | 14286 | -0.0030 | -0.0018 | 0.0084 |
| 4 | -1 | 10996 | +0.0067 | +0.0067 | 0.0095 |
| 15 | 1 | 3310 | +0.0080 | +0.0112 | 0.0174 |
| 23 | -1 | 2246 | -0.0104 | +0.0045 | 0.0211 |
| 31 | -1 | 1719 | -0.0251 | +0.0149 | 0.0241 |
| 56 | 2 | 2044 | +0.0298 | -0.0150 | 0.0221 |
| 67 | 3 | 863 | -0.0016 | +0.0066 | 0.0340 |

(D_0 = 20, 59, 71 in the log: same level.) No term -chi(p) c(D_0) in c(D_0 p).

**(c) Row Gram spectrum.** Rows normalised to norm 1.

| rows | size | sv_1..sv_4 | sv_1^2/rows | off-diagonal rms / max | pairs above 0.5 |
|---|---|---|---|---|---|
| product-index c~(dm), d < 500, m < 2000 squarefree odd, (d, m) = 1 | 187 x 744 | 1.404, 1.383, 1.369, 1.359 | 0.0105 | 0.032 / 0.278 | 0 |
| control: eps_n \|c~(n)\| at n = dm, eps random | same | 1.471, 1.469, 1.467, 1.452 | 0.0116 | 0.037 / 0.327 | 0 |
| control: \|c~(dm)\| (signs removed) | same | 4.911, 4.902, 4.812, 4.653 | 0.1290 | 0.245 / 0.736 | 1729 |
| c~(dm) times symbol (D_d/m) | same | 1.469, 1.455, 1.442, 1.423 | 0.0115 | 0.036 / 0.338 | 0 |
| c~(dm) mu(m) (column signs) | same | identical to row 1 | 0.0105 | 0.032 / 0.278 | 0 |
| random signs | same | 1.484, 1.471, 1.465, 1.455 | 0.0118 | 0.037 / 0.153 | 0 |
| symbol table chi_d(m) | 741 x 2000 | 3.651, 2.729, 2.545, 2.388 | 0.0180 | 0.033 / 0.263 | 0 |
| L(1/2, E x chi_d) chi_d(m) | same | identical to symbol table | 0.0180 | 0.033 / 0.263 | 0 |
| lambda_E(m) chi_d(m) | same | 3.198, 2.919, 2.599, 2.513 | 0.0138 | 0.048 / 0.377 | 0 |
| control: \|lambda_E(m)\| chi_d(m) | same | identical to previous row | 0.0138 | 0.048 / 0.377 | 0 |

Reading. (1) Product-index rows over squarefree coprime labels: flat spectrum, no pair above 0.5, same figures as
the random-sign control and as a random sign matrix. There is no coherent set among squarefree rows. (2) The
product-index Gram matrix is not sign-blind (removing the signs changes it: the nonnegative array has a common
mean), but the true signs act as random signs. (3) Twist rows and central-value-scaled rows are exactly
sign-blind and scaling-blind (Lemma 1).

**h/r of the rows.** r = 2. Twist rows: h = 0 (L-type or entire row series). Product-index rows: h = 0 (Lemma 3,
entire). Model abscissa 1 - h/r = 1 for both; the requirement was h/r = 1/2.

**Stop.** (R1) fails: measured prime-direction correlation 0 within 1/sqrt(n), and structurally the row series
is entire. The combination as assigned is closed.

---

## 4. Pivot (one): square-class rows of the product-index array

The product-index array has rows with non-squarefree labels. `test2.log` [exact relation, MEASURED correlations],
columns coprime to 2310 d_0:

| d_0 | columns | corr(row d_0, row 9 d_0) | 25 d_0 | 49 d_0 | row 5 d_0 | null |
|---|---|---|---|---|---|---|
| 3 | 1413 | -1.000 | +0.624 | -0.872 | -0.026 | 0.027 |
| 23 | 176 | -0.617 | +0.415 | -0.888 | -0.043 | 0.075 |
| 31 | 132 | -0.722 | +0.781 | -0.866 | +0.012 | 0.087 |

(Rows 7 d_0 and 13 d_0 have support disjoint from row d_0, correlation exactly 0: 7 and 13 are non-residues
mod 11, so the root numbers differ.) The coherent set of a row d_0 is its square class {d_0 k^2}: about Z^{1/2}
rows up to Z, which is the count Z^{h/r} with h/r = 1/2. But the relation between coherent rows is the Shimura
relation [PROVED here for p <= 17 by exact check]: row d_0 p^2 = (a_p - (-d_0 m/p)) row d_0, so the symbol term
enters as -chi(p) against a Hecke eigenvalue of size p^{1/2} in this normalisation, i.e. at relative weight
p^{-1/2}. This is e1 Lemma S: reciprocal 1/L(s + 1/2, chi), detection condition beta > 3/2 - h/r = 1 at h/r = 1/2.
The coherent set of the right size exists (R3) and carries the Moebius sign, and (R2) fails by exactly the gain.
The pivot ends at the row already closed by e1; nothing new below 1. Stop.

Summary against Lemma 2:

| row | R1 (Moebius produced) | R2 (shift 0) | R3 (coherent set, h/r = 1/2) |
|---|---|---|---|
| twist rows (c/m) x_m | no (entire / L-type) | - | no (D' = D only) |
| product-index rows, squarefree labels | no (measured 0; entire) | - | no (measured: random-sign spectrum) |
| square-class rows c(d_0 k^2 m) | yes | no (shift 1/2) | yes |
| needed | yes | yes | yes |

---

## 5. Controls

No zero statement is made, so no control can pass wrongly. Behaviour at the tested step:

| control | outcome | reason |
|---|---|---|
| random signs eps_n on c(n) | not separated: spectrum 1.47 against 1.40, correlations at the same level | the true signs of c(D) behave as random signs in every statistic computed |
| sign twists on columns (mu(m), symbols) | Gram matrix identical or at the same level | Gram sign-blindness for column signs (exact) |
| DH-type (character inserted) | not excluded | a character twist relabels twist rows; for product-index rows it multiplies by a symbol (measured row 4 of table (c): same level) |
| zeta(s+a) zeta(s-a) | not computed; expected not excluded | the genuine form with an Eisenstein lift is Cohen's series (coefficients L(0, chi_D)-values, recalled); the Shimura relation has the same form |
| backward heat, T-NR, Beurling, phase-rotated transfer operator, theta^w | not formulable | coefficient identities of one automorphic form; no deformation parameter |

Three requirements: all primes together: yes (exact identities). Uniform in height: the statements are about
coefficient arrays, not zeros. Fails for the controls for a structural reason: no; the rows are statistically the
same as the random-sign control.

---

## 6. What is and is not covered

Covered: shape of the Whittaker coefficients of the cuspidally induced maximal-parabolic series from an opened
theorem; both row types that shape allows; signed square roots of central values for one form of weight 3/2,
validated against the approximate functional equation; square-class coherent sets.

Not covered: (1) genuine cusp forms on the double cover of GL(3): no explicit example, nothing computed [OPEN];
(2) the exact exponential sum H and the exact coefficient index for GL(3), Levi GL(2) x GL(1): the two row types
were tested separately, not the actual double sum over (d_1, d_2), whose Gauss-sum weights could in principle
combine product-index entries across d; (3) factors at 2, 11 and infinity; (4) other forms, levels and weights.

---

## 7. Three weakest steps

1. **The specialisation of Theorem 4.1 to GL(3) is argued, not derived.** Only the general formula (16) and the
   introduction were read. The exponential sum H for N = 2 and the index of c in terms of (m_1, m_2, d_1, d_2)
   were not computed; "product-index row" and "twist row" are the two elementary ways a label can enter, and the
   test treats them one at a time. A sum over d weighted by Gauss sums of a product-index row is a new row that
   was not formed.
2. **One form, one range, statistical evidence.** Requirement R1 is refuted by measurement (correlations 0 within
   1/sqrt(n), n up to 1.4e5) and by Lemma 3, whose entire-ness statement for additive twists of half-integral
   weight cusp forms is recalled, not opened. A correlation with mu chi of size below 0.003 is not excluded by
   the data.
3. **Model pricing.** "h = 0 hence abscissa 1" and "beta > 3/2 - h/r" transplant the scalar system of
   `r3-method-limit` (written for the sextic architecture) to order 2, as e1 did; the identification of the
   square-class coherent set with h/r = 1/2 is by count only.

---

## 8. Verdict

Precise obstruction. For the Eisenstein series on the double cover of GL(3) induced from a cusp form, the rows
are either of symbol type (h = 0, Gram sign-blind) or product-index rows of signed square roots of central values.
The latter are new non-symbol rows, but: no Moebius is produced (prime-direction correlation 0 within sampling
error, row series entire), the Gram spectrum equals the random-sign control, and there is no coherent set among
squarefree labels. The one coherent set (square classes, size Z^{1/2}) carries the Moebius sign only at shift 1/2,
the case closed by e1. The three requirements of Lemma 2 are never met together. Model abscissa 1, not below 5/6.
OBSTRUCTION_MAP section 6 item 1 stays open only for genuine cusp forms on the double cover of GL(3) and for the
Gauss-sum-weighted double sum of weakest step 1. No zero-free statement, no statement about RH.
