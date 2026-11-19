# Independent referee: c13-bilinear-reciprocity-height-antibridge (Lemma 1; the sign statement)

Referee lane `c14-referee-r13-independent`, 2026-11-19. Written from the lane's RESULT.md; the lane's REFEREE.md was
not read; Bettin's paper (arXiv:1607.05595) was not opened by this referee. Own code: `items35.py` (block lane 5),
`item5b.py`, `item5c.py`, `item5d.py`, `item5e.py`; outputs the corresponding `.json` and `.log` files (`items35.py`: log only). Ball arithmetic
(python-flint); Estermann function through Hurwitz zeta functions; remainder integral by `acb.integral` on panels.
Nothing here is a statement about zeros of zeta or of any L-function.

## Verdicts

| statement | verdict | exact line / form |
|---|---|---|
| (T5): D(s, 2s-1; a/q) = (2 pi)^-s Gamma(s) (e^(pi i s/2) M*(s; a, q) + e^(-pi i s/2) M*(s; -a, q)), q prime, with the zeta entry weighted by q^s + q^(1-s) - 2 | **HOLDS** (numerically; RELATIVE TO Bettin Theorem 5 as the lane labels it) | Three fresh instances, defects below 4e-57 (table below). |
| Lemma 1 (reciprocity truncated at J with the single remainder integral E_J) | **HOLDS** as displayed (numerically at instances not used by the lane; not re-proved) | Coded from the display of RESULT.md section 1 with no adjustment of signs or factors. Three instances below: defects 6e-19, 5e-19, 7e-18 while E_J has modulus 9.9, 2.2, 133. The lane's label "RELATIVE TO Bettin; finite-J form assembled here" is the right one. |
| Lemma 1, status line: "The integrand of E_J is O(abs(v)^(-J-1) (1 + abs(b))^(2J+2)) on the side with no exponential decay" | **HOLDS IN NARROWER FORM** | The exponent is -J - 3/2 - c with -1 < c < -1/2, i.e. between -J - 1 and -J - 1/2: weaker than stated. Measured (`item5e.json`): J = 1, c = -0.75: -1.750; J = 3: -3.75; J = 6, c = -0.6, -0.75, -0.9: -6.90, -6.75, -6.60. The conclusion drawn from it (absolute convergence for J >= 1) is unchanged, since -J - 3/2 - c < -1 for J >= 1. |
| Proposition 3 (i), (ii): R_chi(t) real, R_chi = R_chi-bar, R_chi(t) = (q/pi)^(1/2) Z_chi(t) Z_chi(-t) | **HOLDS** | Re-derived from the functional equation and eps(chi) eps(chi-bar) = 1. Numeric: abs(Im R)/abs(R) below 2e-35; R - (q/pi)^(1/2) Z(t) Z(-t) below 2e-34 at 61 heights for five complex characters (Z = Arb's Hardy function; the sign convention agrees). Note abs(R_chi(t)) = (q/pi)^(1/2) abs(L(1/2 + it, chi)) abs(L(1/2 - it, chi)), not (q/pi)^(1/2) abs(L(1/2 + it, chi))^2, for complex chi. |
| Proposition 3 (iv), sign rule: sign R_chi(t) = (-1)^(n_chi(t)), n_chi(t) = number of zeros of L(s, chi) on the critical line with ordinate in (-abs(t), abs(t)), with multiplicity | **HOLDS** under the stated hypothesis L(1/2, chi) != 0 | R_chi(0) = (q/pi)^(1/2) abs(L(1/2, chi))^2 > 0; t -> Z_chi(t) Z_chi(-t) is real-analytic and even and changes sign exactly at the points abs(gamma) of odd total order; the off-line zeros of L(s, chi) L(s, chi-bar) come in groups {tau, conj tau, -tau, -conj tau} in the variable t and contribute a positive factor. Numeric: 305 of 305 heights. |
| Row sentence "off-line zeros enter through positive factors"; Theorem 4 (a) | **HOLDS** | Same grouping. |
| Lemma 5 (T-NR: entries multiplied by mu_chi(t) mu_chi-bar(t) in [(abs(c)-2)^2, (abs(c)+2)^2]) | **HOLDS** | Algebra re-derived; numeric below. |
| Theorem 4 (d) (mixed weights), (f) (two heights), the DH row | not refereed | outside the assignment; the lane labels (d) MEASURED and the DH row ARGUED |

No statement is BROKEN.

## Numeric instances

Estermann routine: D(u, w; h/k) = k^(w-2u) sum_{m,n <= k} e(mnh/k) zeta(u-w, m/k) zeta(u, n/k); against the defining series
at u = 3.2 + 0.4i, w = 0.3 + 0.2i, h/k = 3/8, 4000 terms: 1.6e-8 (the tail of the series).

(T5), 200 bits:

| a/q | s | D(s, 2s-1; a/q) | defect |
|---|---|---|---|
| 3/7 | 1/2 + 2.5i | -1.2663034756 - 1.0922026409i (lane: -1.266303476 - 1.092202641i) | 4.9e-58 |
| 2/5 | 1/2 + 10i | -3.7246490708 (lane: -3.724649071) | 3.1e-57 |
| 4/11 | 0.3 + 1.7i | -1.4790064611 + 1.1771366166i | 9.1e-58 |

Lemma 1, 260 bits, remainder integral over v in [-48, V] on Re w = c (panels of length 2, 10, 50), parameters not used
by the lane:

| a/q | b | J | c | V | D_0(a/q) | main sum | E_J | abs(D_0 - main - E_J) | abs(D_0 - main) | abs(integrand) at V |
|---|---|---|---|---|---|---|---|---|---|---|
| 3/8 (q composite) | 1.9i | 8 | -0.75 | 400 | -1.5171808274 + 0.7632632172i | -7.1010 - 7.3586i | 5.5838 + 8.1218i | 6.1e-19 | 9.86 | 3.5e-17 |
| 4/9 (a, q composite; s = 0.65 + 1.2i off the line) | 0.15 + 1.2i | 8 | -0.8 | 350 | -0.7861412987 - 0.7935506537i | -1.9991 - 2.5713i | 1.2130 + 1.7778i | 5.4e-19 | 2.15 | 1.5e-17 |

| 5/7 | 3.2i | 9 | -0.75 | 350 | -1.2203161216 - 1.4969214605i | -67.949 - 116.728i | 66.729 + 115.231i | 6.5e-18 | 133.2 | 5.8e-17 |

Rows 1 from `items35.log`, rows 2 and 3 from `item5d.json`; about 7 minutes each. Not completed: the lane's own first
row (a/q = 2/5, b = 2.5i, J = 6) with V = 1500 was started in `items35.py` and stopped by the referee after about 30
minutes in the remainder integral; `items35.py` therefore wrote no output file and its record is `items35.log` (lane 3
block, (T5), first Lemma 1 instance). The Estermann value of that row is confirmed through (T5) at s = 1/2 + 10i and
through the lane's quoted D_0 values only.

The control object is not identically zero: the dual-modulus value D_0(-q/a) is -0.5543 + 0.6557i (3/8) and
-0.3534 - 0.7050i (4/9), -2.2201 (5/7), and the remainder E_J is of the size of the whole identity.

Sign rule (`item5c.json`): zeros of L(s, chi) on the line with abs(ordinate) < 40 located by sign changes of the Hardy
function on a grid of step 0.005 and bisection; R_chi(t) from the lane's definition (gamma factors, not the Hardy
function) at 61 heights in (0.37, 39.87).

| chi | parity | R_chi(0) | zeros with abs(gamma) < 40 | heights with sign = (-1)^n | negative entries |
|---|---|---|---|---|---|
| chi_5(2, .) | odd | 0.7953 | 31 (lane: 31 sign changes for q = 5) | 61 of 61 | 19 |
| chi_7(3, .) | odd | 1.0975 | 36 | 61 of 61 | 27 |
| chi_7(2, .) | even | 0.1514 | 35 | 61 of 61 | 18 |
| chi_11(2, .) | odd | 4.3208 | 42 | 61 of 61 | 21 |
| chi_13(2, .) | odd | 4.8482 | 44 | 61 of 61 | 22 |

Referee's own error, recorded: a first pass (`item5b.json`) located zeros by grid midpoints (step 0.01) and reported 1
failure of 61 for chi_7(2, .) and for chi_11(2, .); both were test heights within the grid step of a zero. With
bisection the count is 305 of 305. The first pass also compared abs(R) with (q/pi)^(1/2) abs(L(1/2 + it, chi))^2, which
is the wrong modulus for complex chi (row 4 of the verdict table).

T-NR (Lemma 5), q0 = 2, c = 2.1, chi = chi_7(3, .), 200 heights in (0.1, 73.7): largest abs(F(s,chi) F(s,chi-bar)/(y^2 L L-bar) - mu_chi mu_chi-bar)
= 6e-34; mu mu in [0.3145, 9.6098] inside [0.01, 16.81]; positive throughout; twin zeros at Re s = 0.9543 and 0.0457.

## Labels to restrict

- Section 1, Lemma 1 status: replace "O(abs(v)^(-J-1) ...)" by "O(abs(v)^(-J-3/2-c) ...), -1 < c < -1/2".
- Proposition 3 (ii): keep "abs(Z_chi(t)) = abs(L(1/2 + it, chi))"; add that abs(R_chi(t)) involves both L(1/2 + it, chi) and L(1/2 - it, chi).
- Proposition 3 (iv): the hypothesis L(1/2, chi) != 0 is in the statement; it should also appear in the map row ("Sign of R_chi(t) = parity of ..."), which states the rule without it.
- Lemma 1 stays "RELATIVE TO Bettin; finite-J form assembled in the lane, supported numerically" (now by 8 lane instances and the referee's fresh ones). It is not PROVED in the sense of a written proof of the boundary limit; the lane says so in weakest step 1.
