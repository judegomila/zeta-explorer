# e1-heegner-averaged-nb-span: discriminant-averaged Heegner amplitudes and their Nyman-Beurling ratio

Internal working note, 2026-11-17. Not refereed. Nothing committed, pushed or posted. No ssh.
All runs local, single process each, through `scripts/memcap.sh 8`, peak memory below 2 GB.
Python: `.venv-arb/bin/python` (python-flint 0.9.0, numpy). Run times: three grid runs 16-17 min each, `lineA` 11 min,
`lineB` 24 min (over the 20-minute rule by 4 min; the two longer line runs for 200 < t <= 400 were stopped), the rest
under 3 min.
RH open. No statement about zeros of zeta is made.

Labels: PROVED (complete argument here from cited classical inputs) / CLASSICAL / MEASURED / OPEN.

**Verdict: precise obstruction; lane closed at the first decisive test.**

1. The averaged bracket is not an Eisenstein factor and is not zero-free. PROVED (Lemma A, B): every bracket
   `B_x(s) = sum_D c_D (sqrt|D|/2)^s L(s, chi_D)` equals an elementary factor times
   `sum_D c_D |D|^(-1/2) Lambda(s, chi_D)`, a combination of Euler products with one common functional equation
   (Davenport-Heilbronn type, for every choice of weights, not only for single discriminants), and its generalised
   Dirichlet coefficients are `c_D chi_D(n)` at pairwise distinct frequencies `2n/sqrt|D|`: averaging over discriminants
   cancels no term. MEASURED: for `|D| <= 50, 100, 200` and five weightings (trace, class sum, per-class, Cesaro,
   degree-0), every averaged bracket has zeros off the line in `1/2 < Re s <= 3`, `0 < Im s <= 50`
   (trace, `|D| <= 200`: `0.656138 + 21.135778i`, `0.857125 + 43.310912i`, `0.925668 + 37.759078i`,
   `1.178472 + 25.682320i`, `1.197421 + 35.884347i`, `1.793206 + 40.600627i`).
   The only zero-free average found is `sum_D L(s, chi_D)` without the factor `(sqrt|D|/2)^s`; it is not the amplitude of
   a divisor (its coefficients depend on `s`).
2. The Nyman-Beurling ratio of the span decreases with span size and is far from 1. MEASURED, two independent methods:
   `R(X) = 28.3, 9.38, 6.75, 4.76, 4.14, 3.81, 3.56, 3.31, 3.08` for `|D| <= X = 20, 60, 100, 200, 300, 400, 500, 700, 1000`
   (8 to 305 discriminants). The local log-log slope of `R - 1` falls from 1.2 to 0.3 over this range. No limit can be
   read off.
3. PROVED (Lemma C): `R(x) - 1 = E_mu|h_x - 1|^2 = int_1^inf |f_x(y) - 1|^2 dy/y^2`, where `f_x(y)` is the signed number
   of `Gamma_inf\Gamma`-translates of the Heegner divisor `x` in the horoball `Im z >= 2/(sqrt(Dmax) y)`. The assigned
   limit "ratio -> 1" is the statement that the constant 1 lies in the `H^2(mu)` closure of the normalised Heegner span.
   It implies RH (every element vanishes at every zero of zeta). Nothing in the construction bounds the distance: at
   level 1 the Neron-Tate height is identically 0 and the height bound H4' is the spectral identity whose other side
   is the cuspidal energy of `x` (section 5).

The assignment's rule was: continue only if the averaged bracket is zero-free and the ratio decreases. The second
condition holds, the first fails for a structural reason (item 1). The expected stop (completeness of the span is RH;
finite spans carry no zero information beyond a number larger than every possible Blaschke floor) is reached.
One pivot was taken (section 4.3: the counting-variable form of the ratio, run to `|D| <= 1000`); it gives item 3 and
the longer table in item 2 and does not change the verdict.

---

## 1. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP (controls, positive list, rows P12, P14, G9, N5, N6),
`n3-green-two-sheet-heegner-gram/RESULT.md`, `n3-cm-taylor-central-values/RESULT.md`,
`formalization/rh-attempts/2026-11-01-r3-heegner-heights.md` (sections 1.2, 2.6, H4, H5, 4.7, 4.8, 8),
`-r3-synthesis.md` section 4 item 3, graph nodes `heegner-nb-ratio`, `heegner-height-upper-bound-h4prime`,
`cm-eta-heights-lambda1`, `nyman-beurling-dx`.

New relative to those: N5 uses the resolvent Gram matrix at CM points, N6 the SO(2)-type expansion at `i`; the source
note computed the ratio for one pair (`tau_-7 - tau_-8`, ratio >= 2.0e3) and one bracket zero. No run of the
averaged bracket or of the span ratio existed.

Order followed: first decisive test (sections 3, 4.1, 4.2), then the lemmas (section 2), then the pivot (4.3).

## 2. Statements

Notation (source note 2.6). `D < 0` fundamental, `h(D)`, `w_D`. Trace amplitude
`A_D(s) = sum_{Q in Cl(D)} (2/w_D) E(tau_Q, s) = (sqrt|D|/2)^s zeta(s) L(s, chi_D)/zeta(2s)` [CLASSICAL, Hecke].
For real `c = (c_D)`: `A_x = sum c_D A_D`, bracket `B_x(s) = sum_D c_D (sqrt|D|/2)^s L(s, chi_D)`,
`A_x = zeta(s) B_x(s)/zeta(2s)`. Degree 0 means `B_x(1) = 0`. `mu` = harmonic measure of `Re s > 1/2` from `s = 1`,
`d mu = dt / (2 pi (1/4 + t^2))`. `a_x = log(sqrt(Dmax)/2)`, `Dmax = max{|D| : c_D != 0}` (mean type, source Lemma 4.7).
Ratio `R(x) = e^{a_x} E_mu|A_x|^2 / |A_x(1)|^2`; `R(X)` = infimum over degree-0 `x` supported on `|D| <= X`.

### Lemma A (every bracket is of Davenport-Heilbronn type) [PROVED]

`(sqrt|D|/2)^s L(s, chi_D) = 2^(-s) pi^((s+1)/2) Gamma((s+1)/2)^(-1) |D|^(-1/2) Lambda(s, chi_D)` with
`Lambda(s, chi_D) = (|D|/pi)^((s+1)/2) Gamma((s+1)/2) L(s, chi_D) = Lambda(1-s, chi_D)` (odd real primitive character, root
number 1). Hence `B_x(s) = (elementary factor without zeros) * F_x(s)`, `F_x(s) = sum_D c_D |D|^(-1/2) Lambda(s, chi_D)`,
`F_x(s) = F_x(1-s)`, `F_x` real on the critical line. This is source Prop. F for two discriminants; the computation is
the same for any number of terms and any real weights. The Heegner factor `(sqrt|D|/2)^s` is exactly what aligns the
functional equations. Consequence: the zeros of `B_x` are symmetric under `s -> 1 - conj s`; off-line zeros are not
excluded by any symmetry.

### Lemma B (no cancellation between discriminants; no Euler product) [PROVED]

For `Re s > 1`, `B_x(s) = sum_D sum_n c_D chi_D(n) (2n/sqrt|D|)^(-s)`. For distinct fundamental `D, D'` the ratio
`|D|/|D'|` is not a rational square (the squarefree part of `|D|` together with its class mod 4 determines `D`), so the
frequencies `2n/sqrt|D|` are pairwise distinct over all `(D, n)`. By uniqueness of generalised Dirichlet expansions the
coefficient of `B_x` at `2n/sqrt|D|` is `c_D chi_D(n)`. Hence: (i) `B_x = 0` only for `c = 0`; (ii) no choice of weights
makes the non-square terms cancel; (iii) with two or more nonzero `c_D` the bracket is not `g(s)` times an ordinary
Dirichlet series, in particular not an Euler product and not `zeta(2s)` times an Euler factor.

The orthogonality statement behind the proposal (`sum_D chi_D(n)` is small unless `n` is a square, so
`sum_D L(s, chi_D) ~ #D * zeta(2s) prod_p (1 - p^(-2s)/(p+1))`) [CLASSICAL] concerns `sum_D L(s, chi_D)`, which collects the terms
with equal `n`. In `B_x` those terms sit at different frequencies and do not add. Writing
`sum_D L(s, chi_D) = sum_D (sqrt|D|/2)^(-s) * [(sqrt|D|/2)^s L(s, chi_D)]` shows the plain average needs `s`-dependent
weights; it is not `A_x` for a divisor `x`.

### Lemma C (the ratio is a distance; counting form) [PROVED from CLASSICAL inputs]

`zeta(s) L(s, chi_D)/zeta(2s) = sum_n a_D(n) n^(-s)`, `a_D` multiplicative, `a_D(p^k) = 2` (p split), `0` (p inert),
`a_D(p) = 1, a_D(p^k) = 0 for k >= 2` (p ramified): `a_D(n) >= 0` is the number of primitive ideals of norm `n`.
`N_D(y) = sum_{n <= y} a_D(n)`. For degree-0 `x` with `A_x(1) = 1` put `h_x(s) = e^{-a_x (s-1)} A_x(s)` and
`f_x(y) = e^{a_x} sum_D c_D N_D(theta_D y)`, `theta_D = sqrt(|D|/Dmax) <= 1`. Then `h_x(s)/s = int_0^inf f_x(y) y^(-s-1) dy`,
`f_x = 0` on `y < 1`, and by Plancherel on `Re s = 1/2`

    R(x) = E_mu|h_x|^2 = int_1^inf f_x(y)^2 dy/y^2,     R(x) - 1 = E_mu|h_x - 1|^2 = int_1^inf |f_x(y) - 1|^2 dy/y^2.

Proof. `E_mu|h|^2 = (1/2pi) int |h(1/2+it)/(1/2+it)|^2 dt`; the integral is finite (fourth moments of zeta and
`L(., chi_D)`, `1/zeta(1+2it) << log t`). `h_x(1) = int_1^inf f_x dy/y^2 = <f_x, 1>` and `||1||^2 = int_1^inf dy/y^2 = 1`. QED.

Geometric form: since `E(tau, s) = sum_{Gamma_inf\Gamma} Im(gamma tau)^s` and `Im(gamma tau_Q) = sqrt|D|/(2 Q(m,n))`,
`sum_D c_D N_D(sqrt|D| y/2)` is the signed number of translates of the divisor `x` in the horoball `Im z >= 1/y`.
The Heegner ratio problem is: approximate the count of one point by signed horoball counts of Heegner divisors, in
`L^2(dy/y^2)`. Each `N_D(theta y) = sum_m b_D(m) [theta y/m]` with `sum b_D(m) m^(-s) = L(s, chi_D)/zeta(2s)`, so each
element is an infinite Nyman combination with bounded, non-decaying coefficients, and the span is a proper subfamily
of Nyman's space with real dilations.

Consequences [PROVED]: (i) `R(x) >= 1` with equality only for `h_x = 1`, impossible by Lemma B; (ii)
`R(x) >= prod |rho/(1-rho)|^2` over the zeros of `h_x` in `Re s > 1/2` (source T5), which include every off-line zero
of zeta and every zero of `B_x` there; (iii) `inf_x R(x) = 1` iff `1` is in the `H^2(mu)` closure of the span, and
this implies RH. The converse direction (does RH, or GRH for all `chi_D`, give density of this span) is OPEN and was
not attempted.

## 3. First decisive test, part 1: zeros of the averaged bracket [MEASURED]

`t1_grid.py`, `t1_zeros.py`, `t4_wide.py`. `L(s, chi_D)` for the 62 negative fundamental discriminants with
`|D| <= 200` from `flint.dirichlet_char(|D|, n).l(s)` (Conrey index matched to the Kronecker symbol; check
`L(1, chi_D) = 2 pi h/(w sqrt|D|)` to 1e-15 for eight `D`). Grid: `Re s = 0.5 (0.025) 1.0`, `Im s = 0 (0.05) 50`
("fine"), and `Re s = 0.5 .. 3.0`, `Im s` step 0.1 ("wide"). Zeros by winding number of the phase around each cell,
then Newton refinement with flint; every listed root has residual `<= 2e-13` and lies in its cell (5 of about 150
refinements left their cell and are not used).

Weights: `trace` (`c_D = 1`), `classsum` (`c_D = w_D/2`), `perclass` (`c_D = 1/h(D)`), `cesaro` (`c_D = 1 - |D|/(X+1)`),
`deg0` (trace with `c_{-3}` fixed so that `B(1) = 0`), `minimiser` (the ratio minimiser of section 4), `plain`
(`sum_D L(s, chi_D)`, no Heegner factor).

| weights | X = 50 | X = 100 | X = 200 | floor from the zeros found, X = 200 |
|---|---|---|---|---|
| trace | 2 + 4 | 5 + 0 | 3 + 3 | 1.013 |
| classsum | 1 + 6 | 3 + 2 | 2 + 2 | 1.015 |
| perclass | 4 + 4 | 5 + 2 | 4 + 3 | 1.021 |
| cesaro | 1 + 3 | 4 + 3 | 2 + 4 | 1.033 |
| deg0 | 0 + 4 | 0 + 12 | 0 + 15 | 2.08 |
| minimiser (X = 60, 100, 200) | 1 + 2 | 0 + 0 | 1 + 0 | 1.0006 |
| plain | 0 + 0 | 0 + 0 | 0 + 0 | - |

Entries: number of zeros with `0 < Im s <= 50` in `1/2 < Re s < 1` plus the number in `1 <= Re s <= 3` (X = 200 counts
exclude one zero on the line; only roots that stayed in their cell are counted, strip counts from the fine grid, right
counts from the wide grid). The last column is `prod |rho/(1-rho)|^2` over the refined roots and their conjugates
(approximate: it includes the few roots that converged from a neighbouring cell), a lower bound for the ratio of that
element. For `Re s` in `[3, 120]`, `Im s <= 50`: one further zero for trace X = 50
(`7.588726 + 46.605605i`), none for X = 100, 200.

Reading. Every average that is a Heegner amplitude has off-line zeros in the box, as Lemma A allows and Lemma B makes
generic. The count does not go down with X. The degree-0 trace is dominated by its `D = -3` term on the critical strip
and has its zeros to the right of 1. The plain average is zero-free in the box (phase change per edge at most 0.6),
which matches the classical main term, and is not a Heegner amplitude. The assigned question "is the averaged bracket
an Eisenstein factor with no zeros in `Re s > 1/2` other than zeta's" has the answer no.

## 4. First decisive test, part 2: ratio against span size [MEASURED]

### 4.1 Critical-line Gram matrix (`t2_line.py`, `t2_ratio.py`)

`G_{DD'} = E_mu[A_D conj A_D']` by Simpson on `t in [0, T]`, step 0.025; residue functional `p_D = b_D(1)`, value functional
`v_D = b_D'(1)/zeta(2)` (`L'(1, chi_D)` by a central difference at 200 bits). `R = e^a * min c^T G c` subject to
`p.c = 0, v.c = 1`. Truncation at `T` lowers `G` in the positive semidefinite order, so each entry is a lower bound for
the true `R(X)`.

| X (number of D) | T = 50 | T = 100 | T = 200 | sum of abs(c_D), T = 200 |
|---|---|---|---|---|
| 8 (4) | 252.9 | 270.5 | 281.9 | 42 |
| 20 (8) | 26.23 | 27.32 | 27.76 | 7.3 |
| 40 (14) | 12.33 | 12.67 | 12.87 | 3.6 |
| 60 (21) | 8.92 | 9.17 | 9.28 | 2.4 |
| 100 (31) | 6.41 | 6.64 | 6.70 | 1.7 |
| 160 (51) | 4.73 | 5.15 | 5.22 | 1.3 |
| 200 (62) | 3.82 | 4.69 | 4.73 | 1.3 |

Sub-spans at T = 200: `100 <= |D| <= 200`: 4.85; `150..200`: 4.94; `180..200` (6 discriminants): 5.58; `20..40`: 16.5.
Best pair: `(-163, -119)`, `R = 4.95`. Lemma C explains it: all primes below 41 are inert for `-163`, so
`zeta L(., chi_-163)/zeta(2s) = 1 + sum_{n >= 41} a(n) n^(-s)`; `-119` (`h = 10`) cancels the pole with a small coefficient.
Almost all of the decrease to X = 200 is already present in this one pair.

### 4.2 Check in the counting variable (`t5_yspace.py`)

For the minimisers `c` of 4.1, `int_1^Y f_x^2 dy/y^2` was summed exactly over the steps of `f_x` (coefficients `a_D(n)`
for `n <= 3e5` from the multiplicative formula; density check against `L(1, chi_D)/zeta(2)` to 1e-4). No L-values enter.

| element | line, T = 100 | counting, Y = 3e3 | Y = 3e4 | Y = 3e5 |
|---|---|---|---|---|
| X = 20 minimiser | 27.32 | 27.94 | 28.33 | 28.49 |
| X = 60 | 9.17 | 9.31 | 9.42 | 9.47 |
| X = 100 | 6.64 | 6.70 | 6.79 | 6.82 |
| X = 200 | 4.69 | 4.77 | 4.85 | 4.89 |
| pair `tau_-7 - tau_-8` | 2046 | 2176 | 2253 | 2282 |

`int f^2 - int |f - 1|^2 = 1.0000` in every row (Lemma C). The two methods agree within the two truncations. The pair
value reproduces the source's "ratio >= 2.0e3". The minimiser computed at T = 50 for X = 200 (56 of 61 directions kept,
`sum |c_D| = 1.8e4`) has true ratio 3e7: an under-truncated Gram matrix produces spurious minimisers, so T = 50 rows
with large `sum |c_D|` are not minimisers of the true problem (they remain valid lower bounds).

### 4.3 Pivot: the ratio in the counting variable up to |D| <= 1000 (`t6_ybig.py`)

Gram matrix of `y -> N_D(sqrt|D| y/2)` in `L^2(dy/y^2)` on a logarithmic grid of 1e6 cells, `y <= 1e4` (midpoint rule; the
truncation lowers the value, by about 2.5% judged from 4.2). 305 discriminants. Eigenvalue cut-offs 1e-6 .. 1e-3
change `R` by at most 1%.

| X | 20 | 60 | 100 | 200 | 300 | 400 | 500 | 700 | 1000 |
|---|---|---|---|---|---|---|---|---|---|
| number of D | 8 | 21 | 31 | 62 | 94 | 122 | 153 | 215 | 305 |
| R(X) | 28.29 | 9.38 | 6.75 | 4.76 | 4.14 | 3.81 | 3.56 | 3.31 | 3.08 |
| sum of abs(c_D) | 7.3 | 2.4 | 1.5 | 1.0 | 0.83 | 0.88 | 0.68 | 0.81 | 0.84 |

X = 200: 4.76 here, lower bound 4.73 from 4.1, upper value 4.89 from 4.2. Local slope of `log(R - 1)` against `log X`:
-1.17 (20 to 40), -0.61 (100 to 200), -0.42 (200 to 400), -0.30 (500 to 1000). The data do not distinguish a limit above
1 from a slow decay to 1. For scale: the classical Nyman-Beurling distance with 305 integer dilations is below 0.02;
the Heegner span with 305 elements is at distance squared 2.08.

Reading. The ratio decreases, so the second continue-condition holds. The decrease has no discriminating content: by
Lemma C(ii) an off-line zero `rho` in the common factor would stop the ratio at `prod |rho/(1-rho)|^2`, which for a zero
pair at height `gamma` exceeds 1 by about `2(2 beta - 1)/gamma^2`, below 1e-24 above the verified height. Measured values near
3 cannot see it. This is the "finite spans restate verified height" end point, with a weaker constant than the classical
Nyman-Beurling span.

## 5. Where the height inequality stands [from the source note; not re-derived]

Requirement "the positivity is Neron-Tate". Source H4': `2 pi int rho_zeta |P^ B_x|^2 kappa_N d mu = U(x) - h^(x) <= U(x)`.
With Lemma C the left side is `E_mu|A_x|^2` up to normalisation, so H4' is an upper bound for the numerator of the
ratio, the correct direction. Its content:

- Level 1: `X(1)` has genus 0, every degree-0 `x` has `h^(x) = 0`, and H4' is the spectral expansion of the Green
  function. `U(x) - E_mu|A_x|^2` is the cuspidal (Maass) energy of `x`, a sum over Maass forms of squared CM periods
  (by Waldspurger-type formulas, central values `L(1/2, u_j) L(1/2, u_j x chi_D)` for traces) [CLASSICAL in kind; A in the
  source]. There is no inequality with a geometric source at level 1.
- Level N: `h^ >= 0` adds a non-negative term to the slack. The bound becomes weaker, not sharper.
- To reach "ratio -> 1" through `U` one needs a sequence `x_n` with `e^{a} U(x_n)/|A_{x_n}(1)|^2 -> 1`. That is two
  statements: `E_mu|h_{x_n} - 1|^2 -> 0` (density, implies RH, OPEN) and cuspidal energy of `x_n` tending to 0 relative
  to `|A_{x_n}(1)|^2` (not implied by the first; no mechanism). `U` itself contains the Maass term, so evaluating
  `U(x_n)` arithmetically is the same problem.

Theorem B of the source (CM eta-heights equal `A - lambda_1(zeta_K)/2`) enters only through `v_D = b_D'(1)/zeta(2)`, the
normalising value `A_x(1)`; it carries the first Li coefficient and no further zero information. It was used as
stated.

Requirement check. All primes together: yes, through `zeta_K`. Uniform in height, one global limit: the target
`inf R = 1` is one global statement, but nothing proves it. Fails for the controls for a structural reason: see section 6;
the criterion fails for them, the measured numbers do not.

## 6. Controls

| control | outcome | step |
|---|---|---|
| single discriminant pair `tau_-7 - tau_-8` (DH type) | `R = 2146` (T = 200), 2282 (counting, Y = 3e5); bracket zero at `1.9257 + 7.3520i` (source) | must fail: fails |
| one class = one genus (`t3_genus.py`): principal form of `D = -15, -20, -24, -40`, bracket `zeta L(chi_D) + L(chi_d1) L(chi_d2)` | 6, 7, 5, 6 zeros off the line in `1/2 < Re s < 1`, `Im s <= 60` (search region `Re s <= 2.5`), e.g. `0.800011 + 12.038599i`, `0.927461 + 15.496634i` (D = -15), `0.932970 + 15.668250i` (D = -20), `0.803749 + 15.117579i` (D = -24) | must fail: fails. The genus average of one class does not contain `zeta` as a factor, so the base-locus step (source H1(c)) is lost as well |
| Epstein, `h > 1`, single class `[2,1,3]`, `D = -23` | off-line zeros `0.820013 + 39.065175i`, `1.007112 + 22.569405i` (row N5, cited, not re-run) | same |
| averaged bracket over `|D| <= X` (the proposal itself) | DH type by Lemma A; off-line zeros in every weighting (section 3) | the average does not leave the DH class |
| `E_a = zeta(s+a) zeta(s-a)`, Davenport-Heilbronn, backward heat, T-NR, Beurling, theta^w | no CM divisor has these as amplitude: Hecke's toric formula (source H1) is ideal counting in `O_K`. No height pairing | step H1 |
| sign-twisted primes, unimodular twist | the coefficients `a_D(n)` are counts of lattice points; a twist `chi_D(n) -> eps_n chi_D(n)` has no horoball count and no Green function | step H1; Lemma C keeps its form (it is Plancherel) but `f_x` is no longer a count |

What the controls show about the mechanism: Lemma C and the measured decrease use only Plancherel and the pole
cancellation. They hold verbatim for any family `theta^s G(s)` with `G` in `H^2` after pole removal. The arithmetic
enters only in the statement that the common factor of all `h_x` is `zeta(s)/zeta(2s)`, and no step uses it to bound
`E_mu|h_x - 1|^2`.

## 7. Relation to the map

- P14 (Nyman-Beurling rate) and `nyman-beurling-dx`: the Heegner span is a subfamily of Nyman's space with real
  dilations `theta_D` and infinite coefficient sequences `b_D(m)`; its distance to 1 at 305 elements is 2.08 against
  below 0.02 for 305 integer dilations.
- N5, N6: the same end point (Hecke structure enters, no sign rule or closure follows). New here: Lemma A-C, the
  zero tables, the ratio table to `|D| <= 1000`.
- Source note Prop. F is the two-term case of Lemma A; source Lemma 4.7 (mean type) is the factor `e^{a_x}`, which
  is why only discriminants near `Dmax` help (section 4.1 sub-spans).

## 8. Verdict

Precise obstruction. (a) Averaging over discriminants or genera keeps the bracket in the Davenport-Heilbronn class
(Lemma A) and cancels nothing (Lemma B); off-line zeros of the averaged bracket were found in every weighting.
(b) The ratio equals `1 + dist^2(1, h_x)` (Lemma C), decreases slowly (3.08 at 305 discriminants), and its limit being
1 is a density statement that implies RH and for which the height identity supplies no bound. (c) Nothing passes from
finite spans to the limit. Not established: whether the Heegner span is dense under RH or GRH.

## 9. Three weakest steps

1. Zero counts (section 3) come from float64 phase winding on a grid with cells `0.025 x 0.05` and `0.1 x 0.1`; about
   0.2-0.4% of edges have phase change above 2 rad, so counts can be low by a few. The listed roots are Newton-refined
   to residual `<= 2e-13` but are not interval-certified. The claim used is existence of off-line zeros, not the counts.
2. Ratio values (section 4) carry truncation in `T` (lower bounds), in `Y` (about 2.5% low) and a midpoint rule on step
   functions in 4.3; agreement between the two methods is 1-3%, not a certified enclosure. The slope values and the
   comparison with the classical Nyman-Beurling distance are descriptive; no extrapolation is justified.
3. Section 5 takes H4' and the identification of the slack with cuspidal energy from the source note (labelled A
   there) without re-derivation, and the level-N remark is not computed. Lemma B's distinct-frequency argument is for
   fundamental discriminants only; non-fundamental discriminants (Zagier traces over all `D`, Hurwitz class numbers)
   share frequencies within a square class and were not run.

## Files

`hlib.py` (characters, class numbers), `t1_grid.py`, `gridA/B/C.npz`, `t1_zeros.py`, `t1_zeros_fine.{log,json}`,
`t1_zeros_wide.{log,json}`, `t4_wide.{py,log,json}`, `t2_line.py`, `lineA/B.npz`, `t2_ratio.py`,
`t2_ratio_T100.log`, `t2_ratio_T200.log`, `t2_ratio.json` (T = 50, 100, 200), `gram_T*.npy`, `t3_genus.{py,log,json}`,
`t5_yspace.{py,log,json}`, `t6_ybig.py`, `t6_ybig_200.log`, `t6_ybig_1000.{log,json}`, `ybig_*.npz`.
