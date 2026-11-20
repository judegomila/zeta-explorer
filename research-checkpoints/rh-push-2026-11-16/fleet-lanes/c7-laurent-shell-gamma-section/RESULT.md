# c7-laurent-shell-gamma-section: sections on a Reinhardt shell and sections containing the gamma one-port

Date: 2026-11-18. Scratch research note, unreviewed (one author, no referee). No RH claim. No statement about zeros
of zeta is made.
Labels: PROVED (argument written here, resting on the twice-refereed steps of Theorem A' of
`c2-jinner-multidelay-lft`), ARGUED (derivation indicated, not written line by line), CLASSICAL, MEASURED-BALL
(python-flint ball arithmetic; what is inside the balls is stated), MEASURED (float64 pole location or quadrature),
OPEN.

## Verdict

**Precise obstruction.** The two families left open by rows Q12 and Q22 are worked out. The first-moment bracket
is computed in both; it has **no forced sign** in either, **for zeta and for Davenport-Heilbronn alike**. The
assignment's scoring case (no forced sign for zeta, forced sign for DH) does not occur. The first-moment no-go of
the polydisc class therefore does not extend to these classes, but nothing opens: the classes are closed by twisted
first moments (a mean-value statement that holds for DH), and the limit step is void in one formulation and equal
to the known height-coupled reserve bound `Q*(t)` of `g-passive-cascade` in the other.

1. **Lemma 1 (Laurent / shell class, no gamma term).** Let `P` be finite, `mu >= 0` a measure on the torus `T^P`
   carried by a hypersurface crossed by the orbit `t -> (p^{-it})_p`, `nu = sum_j r_j delta_{gamma_j}` its pullback
   to the line, `h` the positive-real lossless function with boundary measure `pi nu`. Then
   `2 pi delta sum_{gamma_j > t_0} r_j F(1/2 + i gamma_j) e^{-delta gamma_j} -> 2 int_{T^P} F_P dmu`,
   where `F_P(w) = sum_{n P-smooth} f_n n^{-1/2} w^n` is the P-part of `F` on the torus: `E_P(w) = prod_p (1 -
   p^{-1/2} w_p)^{-1}` for zeta, `D_P(w) = c_1 E_P(chi w) + c_2 E_P(conj(chi) w)` for DH. In coefficient form the
   bracket is `a_1 + conj((Pi_int h)(1/2))`, `Pi_int` the projection of the Bohr series of `h` onto integer
   frequencies. For polydisc sections `Pi_int h = h` and this is Theorem A'. (PROVED for densities that are
   trigonometric polynomials on a coordinate hyperplane; MEASURED-BALL for Poisson densities, zeta and DH.)
2. **Sign rule (Corollary 1).** In the Laurent class the real part of the bracket is `2 int Re F_P dmu`, and the
   class contains measures concentrating at any point of `T^P`. The sign is forced iff `Re F_P >= 0` on `T^P`.
   For zeta: iff `sum_{p in P} arcsin(p^{-1/2}) <= pi/2` (true for `{2}`, `{2,3}` (80.3 degrees), `{2,3,p}` with
   `p >= 37`; false for `{2,3,7}` (102.5 degrees) and every richer set). For DH: forced for `{2,3}` (minimum of
   `Re D_P` is 0.0387, grid), not for `{2,3,7}` (minimum -0.62). Minimum of `Re E_P` on `T^{2,3,7}`: -0.498.
   Ball-arithmetic run on a five-prime Laurent section: normalised first moment of zeta
   `-0.479 - 2.106 i` at `delta = 3e-6` against the predicted `-0.456 - 2.116 i`. The sign is negative.
3. **Lemma 2 (gamma-coupled sections).** For `m` unimodular on `T^P` and poles at the solutions of
   `X_F(1/2 + it) m((p^{-it})_p) = 1` (`X_F` the gamma ratio of the functional equation), residues `2/|d arg/dt|`:
   normalised first moment `-> 1 + conj(int_{T^P} F_P m dHaar)`. Values: `m = 1` (Gram-type points): 2
   (Titchmarsh's classical mean); `m = -conj(F_P)/F_P` (the reflected Euler stage): 0; `m = -conj(F_P)/|F_P|`:
   `1 - ||F_P||_{L^1} < 0` for every nonempty `P` and for every `F` with `f_1 = 1` whose P-part is not constant.
   (ARGUED; MEASURED for zeta with `P = {2,3}`, `{2,3,7}` and for DH with `P = {2,3}`: -0.298 / -0.340 / -0.168
   against -0.303 / -0.354 / -0.175.)
4. **Closure by twisted first moments (Proposition 3, ARGUED; twists MEASURED).** If every pole of a section of
   either class is a zero of `F`, all twisted first moments vanish. In the Laurent class this gives `F_P mu = 0`,
   hence `mu = 0` for zeta (`E_P` has no zero on the torus) and also for DH (the zero set of `D_P` has codimension
   2 and carries no hypersurface measure). In the gamma-coupled class the twist by `q^{i gamma}`, `q` a prime
   outside `P`, has mean `f_q q^{-1/2}`, not 0; so every prime with `f_q != 0` must be in `P`, and inside the
   module of `P` the only candidate is the reflected stage `m = -conj(F_P)/F_P` (rows G10, Q10, closed). These
   statements use `f_q != 0`, not multiplicativity, and hold for DH.
5. **Limit step (Section 5).** Defined through boundary measures, the class is locally dense in all lossless
   positive-real functions and closed under locally uniform limits; "alpha L is a limit of such sections" is then
   RH restated with no arithmetic input. Defined through the analytic formula `U = X_F m` on a shell, contractivity
   `|U_P| < 1` of the reflected stage holds at height `t` only while `log(t/2 pi) > 2 sum_{p <= P} log p/(sqrt p -
   1)` (about `4 sqrt P`): the shell admits `P <= Q*(t)` of `g-passive-cascade` Section 5 (`{2,3}` from `t = 3590`)
   and is not uniform in height. No closed limit step was found. R4 is not reached.

No pivot was used. The compute server was used for the DH runs (one rhrun unit, 4 cores, 8 GB; Section 3).

## 0. Plan and what is new against the map

| Item | State before (rows Q12, Q22; `c2-jinner-multidelay-lft`; `c3-repair-map-theorem-a/REFEREE2.md`) | This note |
|---|---|---|
| First moment of a positive-real section | Theorem A': for `H` holomorphic on the full polydisc, bracket `a_1 + conj h(1/2)`, real part `>= (4 - 2 sqrt 2) Re a_1`; DH `>= 1.0597 Re a_1` | Bracket for sections whose Bohr spectrum contains rational, non-integral frequencies (Laurent in `w_p = p^{-z}`): `a_1 + conj((Pi_int h)(1/2)) = 2 int F_P dmu`. Harnack is lost because `Pi_int` is a cone projection. Sign rule in closed form. |
| Sections containing the gamma term | "not covered (no lane)" | Bracket `1 + conj(int F_P m)`; three named values; no forced sign for any nonempty `P`. |
| DH | first-moment no-go holds for DH | Same formulas with `D_P`; no forced sign for DH either, from 3 primes (Laurent) and from 1 prime (gamma-coupled). |
| Limit step | Proposition L: not closed in the torus topology; half-plane topology equals zero-freeness | Section 5: void by density (measure form) or height-coupled (formula form, equals `Q*(t)`). |

Three requirements. R1: tested by running every statement for DH; all hold for DH. R2: the statements are Abel
means, not every-window statements. R3: Section 6. R4: Section 5.

Notation as in the predecessor notes: `s = 1/2 + z`, `F` is zeta or the conductor-5 DH function
`f = c_1 L(s, chi) + c_2 L(s, conj chi)`, `chi(2) = i`, `c_1 = (1 - i kappa)/2`, `kappa = 0.2840790438...`,
`f_n = 2 Re(c_1 chi(n))` real. On the axis `w_p = p^{-it}`, and `F_P(w)` restricted to the orbit is
`sum_{n P-smooth} f_n n^{-1/2-it}`.

## 1. The Laurent class and Lemma 1

**Why the polydisc is not the natural domain.** A positive-real `h` on `Re z > 0` with atomic boundary measure
`pi nu`, `nu = sum r_j delta_{gamma_j}`, is determined by `nu` (up to `ib`; no linear term is assumed). Take `nu`
quasi-periodic with frequency module generated by `log p`, `p in P`: `nu` is the pullback along the orbit of a
positive measure `mu` on `T^P` carried by a hypersurface `V` transversal to the flow, with a smooth density. Then
`Re h(x + it)` is the flow-Poisson integral of `mu`, and

    h(z) = a_1 + sum_{q in Q_P, q > 1} a_q q^{-z},   a_1 = mu_0 + ib,  a_q = 2 mu^(q),

where `Q_P` is the group of positive rationals supported on `P` and `mu^(q)` is the Fourier coefficient of `mu` at
the character `w -> w^{-k}`, `q = prod p^{k_p}`. The sum runs over the half-space `k . log p > 0`, not over the
orthant `k >= 0`. `H(w) = sum a_q w^k` is a Laurent series; for real-analytic data it converges on a Reinhardt
neighbourhood of the family of tori `{|w_p| = p^{-x}}`, `x > 0` (a shell around the orbit closure), not on the
polydisc. The polydisc class of rows Q12, Q22 is the case where the spectrum of `mu` lies in the orthant and its
negative (pluriharmonic `mu`). A change of basis of the frequency lattice (for example the generators
`2, 3/2, 7/2`) turns a polydisc class in the new variables into a Laurent class in the prime variables; the cone of
integers is an orthant only in the prime basis.

**Explicit family used in the proof and the runs.** Fix `p_b in P`, angles `theta_p`, and a positive density `rho`
on `T^{P \ p_b}`. Poles `gamma_k = (-theta_b + 2 pi k)/log p_b` (the orbit meets the hyperplane `w_{p_b} =
e^{i theta_b}`), residues `r_k = rho((-gamma_k log p - theta_p)_p)/log p_b`. With
`rho = sum_kappa c_kappa e^{i kappa . phi}` and `u = e^{-i theta_b}` (up to the phase conventions fixed in
`test_a.py`), Poisson summation over `k` gives for `Re z > 0`

    h(z) = (c_0/2) (1 + u p_b^{-z})/(1 - u p_b^{-z}) + sum_{kappa != 0} c'_kappa u^{m_kappa} q_kappa^{-z}/(1 - u p_b^{-z}),
    q_kappa = p_b^{m_kappa} prod_{p != p_b} p^{kappa_p} in (1, p_b),

a rational function of the delays with denominators in the variables `w_p`, `p != p_b`: not holomorphic at `w = 0`.
`h` is positive-real and lossless because `nu >= 0`.

**Lemma 1.** For `rho` a positive trigonometric polynomial, `F` = zeta or DH, `t_0 > 0` not a pole height,

    sum_{gamma_k > t_0} r_k F(1/2 + i gamma_k) e^{-delta gamma_k} = B/(2 pi delta) + O(delta^{-1/2-eps}),
    B = sum_{n P-smooth} f_n n^{-1/2} c_nu(n),   c_nu(n) = lim 2 pi delta sum_k r_k n^{-i gamma_k} e^{-delta gamma_k},

that is `B = 2 int_{T^P} F_P dmu` with `2 mu_0 = lim 2 pi delta sum r_k e^{-delta gamma_k}`. For the product
Poisson density at radius `s` centred at `theta`: `B/(2 mu_0) = F_P(w^)`, `w^_{p_b} = e^{i theta_b}`,
`w^_p = s e^{i theta_p}`.

*Proof (PROVED by reduction to the steps of Theorem A' as checked in `REFEREE2.md` Section 1; outline).* `h` is a
finite sum of terms `g(z) = c q^{-z}/(1 - u p_b^{-z})`. Each has the expansions `sum_{j >= 0} c u^j (q p_b^j)^{-z}`
on `Re z > 0` (frequencies `q p_b^j >= q >= 1`) and `-sum_{j >= 1} c u^{-j} (p_b^j/q)^{z}` on `Re z < 0`. Run the
rectangle of A' for `g(z) F(1/2 + z) e^{i delta z}`. Steps (0), (1): after the shift to `Re z = 2` the product of
the two Dirichlet series has a constant term only if `q p_b^j n = 1`, i.e. only for the term `kappa = 0`, `j = 0`,
`n = 1`: contribution `a_1/(2 pi delta)`, the rest `O(1)`. Steps (2), (3): on the left edge the evaluation
`J_k = k^{5/2} e^{5 i delta/2} e^{2 pi i k} exp(-2 pi k eta) + O(1)` holds for every real `k > 0` (the referee's
form; integrality is not used), here with `k = n p_b^j/q`. Step (4) is replaced by a direct summation: for fixed
`j` the sum over `n` is a geometric series with ratio `e(k') e^{-2 pi k' eta}`, `k' = p_b^j/q`. If `k'` is an
integer `N` it gives `N^{-1/2}/(2 pi delta)` times the coefficient; if not, it is `O(min(1/(k' delta), a))`, `a`
the numerator of `q`, since the distance from `k'` to the integers is at least `1/a`; with the weight `k'^{1/2}`
the sum over `j` is `O(a delta^{-1/2})`. The integers `N = p_b^j/q_kappa` are exactly the P-smooth `n` whose
exponents are `-kappa_p`. Collecting terms gives `B`. For DH the same computation at `k/5` produces `e(nk'/5)`
and the periodic coefficients `f_n` (REFEREE2 (D3)-(D6)); a `1/delta` term again requires `k'` integral. QED.

For Poisson densities (infinitely many modes) the bound `O(a delta^{-1/2})` is not summable as written; the
statement is MEASURED-BALL there (Section 3) and expected by approximation with Fejer kernels.

**Corollary 1 (sign rule; PROVED from Lemma 1 for Fejer densities).** `Re B = 2 int Re F_P dmu`. Fejer products
on a hyperplane concentrate at an arbitrary point of `T^P`, so
`inf Re B/(2 mu_0) = min_{T^P} Re F_P` over the class. For zeta, `Re E_P = |E_P| cos(sum_p arg(1 - p^{-1/2}
w_p)^{-1})` with independent arguments of range `[-arcsin p^{-1/2}, arcsin p^{-1/2}]`: the minimum is negative iff
`sum_p arcsin(p^{-1/2}) > pi/2`. This criterion is where the product form of `E_P` enters: it decides, for zeta,
when the first-moment obstruction exists, and it removes the obstruction for rich `P`. For DH the minimum of
`Re D_P` was computed on grids (`prep.py`, MEASURED):

| `P` | `sum arcsin` (deg) | `min Re E_P` | `min Re D_P` | `min |D_P|` | `||E_P||_1` | `||D_P||_1` |
|---|---|---|---|---|---|---|
| `{2}` | 45.0 | 0.5858 | 0.5328 | 0.5328 | 1.1803 | 1.0868 |
| `{2,3}` | 80.3 | 0.2500 | 0.0387 | 0.1134 | 1.3029 | 1.1746 |
| `{2,3,7}` | 102.5 | -0.4980 | -0.6198 | 0.0007 (grid 160^3) | 1.3536 | 1.2187 |
| `{2,3,7,11}` | 120.0 | -1.6442 | -1.4006 | 0.0014 (grid 48^4) | 1.3860 | 1.2479 |

In the polydisc class the DH bracket is `>= 1.0597 Re a_1` for every `P` (Proposition E of c2); in the Laurent
class the sign is lost for DH at three primes, as for zeta.

## 2. Gamma-coupled sections and Lemma 2

**Class.** `X(s)` is the gamma ratio: `zeta(s) = X(s) zeta(1-s)`, `X = chi`; for DH `f(s) = X(s) f(1-s)`,
`X = 5^{1/2-s} X_c(s)`. On `Re s = 1/2`, `|X| = 1` and `d arg X/dt = -log(t/2 pi)` (zeta), `-log(5t/2 pi)` (DH), up
to `O(1/t)`. For `m` unimodular and smooth on `T^P` put `U(t) = X(1/2 + it) m((p^{-it})_p)`. For `t` larger than a
bound depending on `m` the phase of `U` is decreasing, the solutions `gamma_j` of `U = 1` are simple, and
`nu = sum r_j delta_{gamma_j}`, `r_j = 2/|d arg U/dt|`, is the boundary measure of the positive-real lossless
function `h` that equals `(1 + U)/(1 - U)` wherever the Laurent continuation of `m` keeps `|U| < 1`: a shell
`0 < Re z < c(t)` around the axis. The negative powers of `w_p` in `m` are the `n^{+z}` terms; `X` couples them to
the Euler side. This is the object named in the assignment. `nu = (1/pi) sum_{k in Z} U^k dt`.

**Lemma 2 (ARGUED; MEASURED).**

    sum_j r_j F(1/2 + i gamma_j) e^{-delta gamma_j} / sum_j r_j e^{-delta gamma_j}  ->  1 + conj( int_{T^P} F_P m dHaar ).

*Derivation.* Insert `nu = (1/pi) sum_k U^k dt` and the symmetric approximate functional equation
`F(1/2 + it) = sum_{n <= N(t)} f_n n^{-1/2-it} + X(1/2 + it) sum_{n <= N(t)} f_n n^{-1/2+it} + o(1)`
(`f_n` real). `k = 0` with the first sum has the constant term `f_1 = 1`. `k = -1` with the second sum is
`conj(m) sum f_n n^{-1/2+it}`, with mean `sum_n f_n n^{-1/2} <conj(m) w^{-n}> = conj(int F_P m)`. Every other
combination carries a factor `X^j`, `j != 0`, against frequencies `|log n| <= (1/2) log(t/2 pi) + O(1)` and has no
stationary point. The contour form is that of Theorem A' with `(1 + U)/(1 - U) = 1 + 2 sum U^k` on the right edge
of the shell and `-1 - 2 sum U^{-k}` on the left edge; it was not written out. The twists follow in the same way:

    mean of F(1/2 + i gamma) q^{+i gamma} -> f_q q^{-1/2},      mean of F q^{-i gamma} -> f_q q^{-1/2} conj(int F_P m)

for a prime `q` outside `P` (second formula for zeta, and for DH when `chi(q) = 1`).

**Consequences.**
- `m = 1`: poles at the Gram-type points `X = 1`; mean 2 (CLASSICAL for zeta: Titchmarsh).
  `m = -1`: mean 0. For constant `m = u`: `1 + conj(u)`, real part `>= 0` with equality at one phase.
- `m` holomorphic and inner on the polydisc: `int F_P m = m((p^{-1/2})_p)`, modulus `< 1`: sign forced. This is
  the gamma-coupled counterpart of the polydisc class.
- `m = -conj(F_P)/F_P`: poles are the real zeros of `Z_P(t) = 2 Re(e^{i vartheta(t)} F_P(1/2 + it))`, the reflected
  Euler stage; mean `1 - conj(int conj(F_P)) = 0`.
- `m = -conj(F_P)/|F_P|` (continuous when `F_P` has no zero on the torus): mean `1 - ||F_P||_1`. Since
  `||F_P||_1 >= |int F_P| = 1` with equality only for constant phase, the mean is negative for every nonempty `P`,
  for zeta and for DH. No forced sign with the gamma term included.

## 3. Runs

Interpreter `.venv-arb/bin/python` (python-flint 0.9.0, numpy, scipy); local runs through `scripts/memcap.sh 8`,
single process, longest 19 minutes (A2). Server: one unit `rh-c7dh-1118201041` through `rhrun c7dh 8 4` (4 cores, 8 GB,
peak memory 0.2 GB), DH only; its state is given at the end of Section 3.2.

### 3.1 Test A (Laurent class), `test_a.py`: MEASURED-BALL

Poles are exact (arb), residues are arb, `F(1/2 + i gamma_k)` are acb balls at 80 bits; the sums are balls. The
truncation tail (poles above `45/delta_min`) is bounded with `|F(1/2 + it)| <= t` (classical convexity bound, as
in the predecessor lanes) and is outside the balls; it is listed. Angles are exact rationals (three decimals).
`S` is the weighted sum of `F`, `S_1` the weighted sum of 1, `S_P` the weighted sum of the P-part `F_P` at the
same poles (it converges to the same limit by Weyl equidistribution and isolates the sampling error).

**A1, zeta.** `P = {2,3,7}`, `p_b = 7`, `theta = (2.647, 2.670, 2.638)`, `s = 1/2`; 1,393,656 poles to height 4.5e6.
Predicted `F_P(w^) = 0.415751 + 0.160026 i`; twist `q = 5`: predicted `5^{-1/2} F_P(w^) = 0.1859 + 0.0716 i` and 0.

| `delta` | `S/S_1` | `S_P/S_1` | `(S - S_P)/S_1` | twist `5^{+i gamma}` | twist `5^{-i gamma}` |
|---|---|---|---|---|---|
| 1e-3 | 0.41661 + 0.16874 i | 0.41547 + 0.16046 i | 0.0011 + 0.0083 i | 0.2007 + 0.0837 i | -0.0128 - 0.0157 i |
| 3e-4 | 0.41559 + 0.16438 i | 0.41569 + 0.16017 i | -0.0001 + 0.0042 i | 0.1924 + 0.0773 i | -0.0105 - 0.0049 i |
| 1e-4 | 0.41307 + 0.15850 i | 0.41573 + 0.16008 i | -0.0027 - 0.0016 i | 0.1889 + 0.0746 i | -0.0087 + 0.0017 i |
| 3e-5 | 0.41619 + 0.15808 i | 0.41575 + 0.16004 i | 0.0004 - 0.0020 i | 0.1876 + 0.0717 i | -0.0032 + 0.0048 i |
| 1e-5 | 0.41728 + 0.15912 i | 0.41575 + 0.16003 i | 0.0015 - 0.0009 i | 0.1873 + 0.0715 i | -0.0004 + 0.0044 i |

Ball radius of `S/S_1` at most 1.1e-14; tail bound at most 1.2e-12. The polydisc formula of Theorem A' does not
apply to this `h` (it is not holomorphic at `w = 0`); the Laurent bracket is matched to 0.002.

**A2, zeta, concentrated.** `P = {2,3,5,7,11}`, `p_b = 11`, `theta = (5.430, 5.331, 5.236, 5.186, 5.224)`,
`s = 7/10`; 5,724,553 poles to height 1.5e7. Predicted `F_P(w^) = -0.4557 - 2.1155 i`; twist `q = 13`: predicted
`-0.1264 - 0.5867 i` and 0.

| `delta` | `S/S_1` | `S_P/S_1` | `(S - S_P)/S_1` | twist `13^{+i gamma}` | twist `13^{-i gamma}` |
|---|---|---|---|---|---|
| 3e-4 | -0.0536 - 2.3104 i | -0.3398 - 2.1215 i | 0.2862 - 0.1889 i | -0.0128 - 0.4604 i | 0.0467 + 0.3037 i |
| 1e-4 | -0.3762 - 2.2995 i | -0.4233 - 2.1721 i | 0.0471 - 0.1274 i | 0.0070 - 0.7689 i | -0.0799 + 0.1073 i |
| 3e-5 | -0.5205 - 2.2210 i | -0.4302 - 2.1677 i | -0.0903 - 0.0533 i | -0.0894 - 0.7811 i | -0.0701 - 0.0166 i |
| 1e-5 | -0.5083 - 2.1201 i | -0.4314 - 2.1404 i | -0.0769 + 0.0203 i | -0.1448 - 0.6922 i | -0.0624 - 0.0237 i |
| 3e-6 | -0.4794 - 2.1056 i | -0.4457 - 2.1238 i | -0.0337 + 0.0182 i | -0.1705 - 0.6249 i | -0.0508 - 0.0110 i |

Ball radius at most 6.1e-14; tail bound at most 4.6e-10. The first moment of zeta against a positive-real lossless
section is negative (real part -0.48 at `delta = 3e-6`, estimated sampling scale 0.03 from the second and third
columns), which Theorem A' excludes for every polydisc section. The effective number of poles is small for
concentrated densities (weights between `(3/17)^4` and `(17/3)^4`); the convergence in `delta` is slower than in A1.

**A3, DH and zeta on one section.** `P = {2,3,7}`, `p_b = 7`, `theta = (3.830, 0.572, 3.630)`, `s = 3/10`. The DH
values `f(1/2 + i gamma_k) = c_1 L(1/2 + i gamma_k, chi) + c_2 L(1/2 + i gamma_k, conj chi)` are acb balls; the
cost of an L-value grows linearly with the height, which limits DH to height 9e4 (27,874 poles, local, 15 minutes).
Predicted `D_P(w^) = 0.6130 - 0.3654 i` (DH) and `E_P(w^) = 0.7310 - 0.1017 i` (zeta, 464,552 poles to 1.5e6).
Twists: DH with `q = 11` (`chi(11) = 1`): predicted `11^{-1/2} D_P(w^) = 0.1848 - 0.1102 i` and 0; zeta with
`q = 5`: predicted `0.3269 - 0.0455 i` and 0.

| function | `delta` | `S/S_1` | `S_P/S_1` | `(S - S_P)/S_1` | twist `q^{+i gamma}` | twist `q^{-i gamma}` |
|---|---|---|---|---|---|---|
| DH | 2e-3 | 0.6456 - 0.3435 i | 0.6229 - 0.3640 i | 0.0227 + 0.0204 i | 0.2278 - 0.1142 i | 0.0609 - 0.0456 i |
| DH | 1e-3 | 0.6290 - 0.3564 i | 0.6177 - 0.3650 i | 0.0114 + 0.0086 i | 0.2172 - 0.1165 i | 0.0339 - 0.0029 i |
| DH | 5e-4 | 0.6203 - 0.3583 i | 0.6153 - 0.3653 i | 0.0050 + 0.0070 i | 0.2103 - 0.1142 i | 0.0127 + 0.0115 i |
| zeta | 1e-3 | 0.7402 - 0.0957 i | 0.7289 - 0.0984 i | 0.0113 + 0.0027 i | 0.3316 - 0.0401 i | -0.0351 + 0.0099 i |
| zeta | 1e-4 | 0.7309 - 0.1031 i | 0.7308 - 0.1013 i | 0.0001 - 0.0017 i | 0.3284 - 0.0425 i | -0.0092 + 0.0044 i |
| zeta | 3e-5 | 0.7301 - 0.0999 i | 0.7310 - 0.1016 i | -0.0008 + 0.0016 i | 0.3282 - 0.0460 i | -0.0036 + 0.0044 i |

Ball radius at most 2.3e-15; tail bound at most 1.6e-13. The DH bracket of the Laurent class is matched to about
0.01 at the reachable height, with the difference halving as `delta` halves. A direct DH run on a concentrated
section with negative predicted real part was not made: at the heights where L-values are affordable in ball
arithmetic the effective sample is too small. For DH the negative sign in the Laurent class therefore rests on
Lemma 1 (same proof as for zeta) and on the grid minimum of `Re D_P`; the negative sign in the gamma-coupled class
is measured directly (Section 3.2).

### 3.2 Test B (gamma-coupled class), `test_b.py`: MEASURED

Poles are located in float64 (sign change of `Im U` on a grid of step 0.004, four Newton steps on the phase); they
are not certified. `F` at the located points is evaluated with acb at 64 bits. Every run reports the number of
crossings with the wrong orientation (phase increasing); it is 0 in all runs, so `nu >= 0`. The column "noise" is
`sqrt(mean |F|^2 / n_eff)`.

**Zeta, `P = {2,3}`, `t_0 = 4000`, heights to 304,000, 470,048 poles per case.** `||E_P||_1 = 1.302914`.

| `m` | predicted | `delta = 1e-3` | `3e-4` | `1e-4` | noise at `1e-4` |
|---|---|---|---|---|---|
| `-conj(E_P)/|E_P|` | -0.3029 | -0.2898 + 0.0016 i | -0.2946 + 0.0006 i | -0.2976 + 0.0003 i | 0.013 |
| `e^{i} (-conj(E_P)/|E_P|)` | 0.2960 + 1.0964 i | 0.2921 + 1.0815 i | 0.2924 + 1.0862 i | 0.2935 + 1.0898 i | 0.017 |
| `-conj(E_P)/E_P` (reflected stage) | 0 | 0.0284 - 0.0266 i | 0.0225 - 0.0055 i | 0.0180 - 0.0010 i | 0.012 |
| `1` (Gram type) | 2 | 1.9991 | 1.9997 | 1.9999 | 0.022 |

Twists with `q = 5` at `delta = 1e-4` (predicted `5^{-1/2} = 0.4472` for `q^{+i gamma}`, and
`0.4472 conj(int E_P m)` for `q^{-i gamma}`): case 1: `0.4439`, `-0.5684` (predicted `-0.5827`); case 2: `0.4458`,
`-0.3204 + 0.4765 i` (predicted `-0.3148 + 0.4903 i`); reflected stage: `0.4319`, `-0.4076` (predicted `-0.4472`);
Gram: `0.4467`, `0.4467` (predicted `0.4472`). The case with the phase `e^{i}` fixes the conjugation in Lemma 2.

**Zeta, `P = {2,3,7}`, `m = -conj(E_P)/|E_P|`.** Predicted `1 - 1.353603 = -0.3536`; measured `-0.3279`, `-0.3347`,
`-0.3404` at `delta = 1e-3, 3e-4, 1e-4` (noise 0.013).

**DH, `P = {2,3}`, `t_0 = 500`, local run to height 20,500, 27,988 poles per case.** `||D_P||_1 = 1.174646`,
`min |D_P| = 0.113` on the torus. Twist prime `q = 11` (`f_11 = 1`; predicted `11^{-1/2} = 0.3015`).

| `m` | predicted | `delta = 6e-3` | `3e-3` | `1.5e-3` | noise at `1.5e-3` |
|---|---|---|---|---|---|
| `-conj(D_P)/|D_P|` | -0.1746 | -0.1605 + 0.0019 i | -0.1611 + 0.0013 i | -0.1631 + 0.0006 i | 0.028 |
| `-conj(D_P)/D_P` | 0 | 0.0545 - 0.0021 i | 0.0490 + 0.0054 i | 0.0432 + 0.0054 i | 0.024 |

Twists at `1.5e-3`: `0.2959` and `-0.3178` (predicted `0.3015`, `-0.3542`); `0.2804` and `-0.2302` (predicted
`0.3015`, `-0.3015`).

**DH, same setting, server run to height 75,500, 119,807 poles (unit `rh-c7dh-1118201041`).**
`m = -conj(D_P)/|D_P|`, predicted -0.1746:

| `delta` | `S/S_1` | twist `11^{+i gamma}` (0.3015) | twist `11^{-i gamma}` (-0.3542) | noise |
|---|---|---|---|---|
| 3e-3 | -0.1611 + 0.0013 i | 0.2988 | -0.3117 | 0.038 |
| 1.5e-3 | -0.1631 + 0.0006 i | 0.2959 | -0.3178 | 0.028 |
| 8e-4 | -0.1654 + 0.0004 i | 0.2961 | -0.3247 | 0.021 |
| 4e-4 | -0.1678 + 0.0003 i | 0.2972 | -0.3320 | 0.016 |

Zero wrong-orientation crossings. The first two rows reproduce the local run. 

`m = -conj(D_P)/D_P`, predicted 0 (twists predicted `0.3015` and `-0.3015`): `0.0490 + 0.0054 i`,
`0.0432 + 0.0054 i`, `0.0371 + 0.0043 i`, `0.0301 + 0.0036 i` at `delta = 3e-3, 1.5e-3, 8e-4, 4e-4` (noise 0.014 at
the last); twists at `4e-4`: `0.2824` and `-0.2495`. Zero wrong-orientation crossings. The approach to 0 is slow
(the second-order term is of relative order `delta^{1/2}`), as for zeta's reflected stage in the table above.

State of the server unit: it ran Test B for DH (74 minutes at 4 cores), then failed at the first chunk of its
second stage (Test A for DH with 4 workers: acb objects cannot be pickled between processes) and exited on its
own; `systemctl --user is-active` reports inactive and `rhstatus` lists no unit of this lane. The bug is fixed in
`test_a.py` (workers return enclosing strings; checked locally against the single-process result). The second
stage was not rerun on the server; run A3 above covers the DH bracket of the Laurent class at lower height.

**Reading.** In both classes the measured first moments follow the stated brackets for zeta and for DH, including
complex values, and the negative values are reached. The twist by a prime outside `P` has the nonzero mean
`f_q q^{-1/2}` in every case.

## 4. Closure of the classes at finite `P` (Proposition 3)

Suppose every pole of a section lies at a zero of `F` on the line. Then for every Dirichlet polynomial `A` the
sum `sum_j r_j F(1/2 + i gamma_j) A(i gamma_j) e^{-delta gamma_j}` is 0.

(a) Laurent class. Lemma 1 applied to the modes of `A nu` gives the limit `2 int F_P A dmu` for `A` with
frequencies in `Q_P` (ARGUED: the proof of Lemma 1 is linear in the Fourier-Bohr modes of `nu` and does not use
positivity). Hence `F_P mu = 0`. For zeta `E_P` has no zero on `T^P`, so `mu = 0`. For DH, `D_P` is a real-analytic
complex function; its zero set is a proper analytic set, of real codimension 2 unless `Re D_P` and `Im D_P` share a
factor (not excluded by proof; on the grids `min |D_P|` is 0.113 for `{2,3}` and below 0.002 for three and four
primes, consistent with zero curves); a hypersurface measure with smooth density cannot live on it. Conclusion:
no nonconstant section of the Laurent class has all its poles at zeros of `F`, for zeta and, up to the stated
genericity, for DH. This does not use multiplicativity beyond the non-vanishing of `E_P`, and the conclusion is
the same for DH.

(b) Gamma-coupled class. For `A = q^{i gamma}`, `q` prime outside `P`, the mean is `f_q q^{-1/2}`. So a section
with all poles at zeros of `F` needs every prime with `f_q != 0` in `P`: no finite stage exists (for DH: every
prime except 5). For `A` with frequencies in `Q_P` the two contributions of Lemma 2 are
`int F_P A dHaar` (from `k = 0`) and `int conj(F_P) conj(m) A dHaar` (from `k = -1`); their sum vanishes for all `A`
iff `F_P + conj(F_P) conj(m) = 0`, i.e. `m = -conj(F_P)/F_P`. The only candidate inside the module of
`P` is the reflected stage, which rows G10 and Q10 close (negative squares at density `theta(X)/pi`, no finite
stage carries the functional equation). MEASURED: the twists in Section 3.2.

Both parts are mean-value statements (MV-CAP applies) and both hold for DH.

## 5. The limit step (R4)

Two formulations, both examined.

**(i) Sections defined by their boundary measure.** Every member is positive-real by construction, and positive-real
functions on `Re z > 0` are closed under pointwise limits. So closure holds and carries no information. Density
(ARGUED): already for `P = {2,3}` the orbit segment `0 <= t <= T` is an embedded arc of `T^2`; short transversal
arcs through the points at prescribed times `gamma_j`, with prescribed weights, give a quasi-periodic `nu'` that
equals any prescribed atomic measure on `[0, T]`. With the far mass matched in mean density, every lossless
positive-real function is a locally uniform limit of members. Therefore "alpha L is a locally uniform limit of
sections of the class" is equivalent to "alpha L is positive-real", i.e. RH, with no arithmetic input; and
a measure-defined section built on the real zeros of a stage is positive-real whether or not the stage has
off-line zeros. This formulation cannot see off-line zeros.

**(ii) Sections defined by the formula `U_P = X m_P` on a shell,** with the candidate forced by Section 4,
`m_P = -conj(F_P)/F_P`, i.e. `U_P(z) = -X(1/2 + z) F_P(1/2 - z)/F_P(1/2 + z)`. Contractivity `|U_P| < 1` on
`0 < Re z < c`: to first order in `x = Re z`,
`log |U_P| = -x [ log(t/2 pi) - 2 Re sum_{p <= P} log p/(p^{1/2 + it} - 1) ] + O(x^2)` for zeta, and the supremum
over `t` of the prime term is `2 sum_{p <= P} log p/(sqrt p - 1)` (Kronecker). So the stage is contractive on a
shell, at height `t`, for the primes with

    2 sum_{p <= P} log p/(sqrt p - 1) < log(t/2 pi):      P = {2,3} from t = 3590;  {2,3,5} from t = 4.9e4;  about 4 sqrt P in general.

This is the reserve inequality of `g-passive-cascade` Section 5 (`Q*(t) = 3` at `t = 1e4`, 37 at `t = 1e12`); the
same inequality is the orientation condition of Section 3.2 (zero wrong-orientation crossings from `t_0 = 4000`).
The prime set admitted at height `t` grows like `(log t)^2/16`; a fixed stage is contractive only above a height
that grows like `exp(4 sqrt P)`, and below it the stage has the negative squares of row G10. J-contractivity on
the shell is therefore a height-coupled statement (fails R2), and the chain is not summable at `sigma = 1/2`
(`sum 1/p` diverges; square-summability holds only for `sigma > 1/2`, Proposition L of c2). No topology was found
in which the stages converge on the shell and contractivity is preserved. The limit step is not closed.

What a closed limit step would need, stated as a target: a contractive section with `P(t)` growing like a power
of `t` (the length of the Riemann-Siegel sum), not like `(log t)^2`. Neither class supplies it.

## 6. Controls

| Control | Lemma 1 / sign rule (Laurent class) | Lemma 2 (gamma-coupled) | Closure (Prop. 3) | Limit step |
|---|---|---|---|---|
| DH (conductor 5) | Holds with `D_P`. Sign forced for `{2,3}`, not for `{2,3,7}` (grid). Run: Section 3.1. | Holds; `1 - ||D_P||_1 < 0`; run in Section 3.2. | Holds (`f_q != 0` for `q != 5`; codimension count). | (i) void for it as well; (ii) no product stage: `D_P` is not an Euler stage, the reserve inequality has no analogue with a sum over primes; the orientation condition held from `t_0 = 500` for `P = {2,3}` (measured). |
| Unimodular twist U / height translate WT | For `zeta(s + i alpha)` the kernel is `E_P` composed with a torus rotation; the class of `mu` is rotation-invariant, so the sign rule is identical. For a general unimodular twist there is no functional equation and the mean at `sigma = 1/2` is not formulable. The Laurent coupling is void, as asked in the assignment: the Laurent terms of `h` pair with `F` only through the mean value, not through a reflection. | Needs `X`; for WT `X` is `chi(s + i alpha)`: identical after rotation. General U: not formulable. | Same. | Same as zeta for WT. |
| `zeta(s+a) zeta(s-a)` | Leading term of order `delta^{-1-a}` (pole at `w = 1 + a`, c2 Section 7); kernel `E_P(p^{a} w) E_P(p^{-a} w)` with a wider range of argument: no forced sign for rich `P`. Inference, not run. | Two gamma factors; not derived. | Inference: holds (coefficients nonzero). | Not run. |
| Backward heat | Not formulable (no Dirichlet series in the delays). Not run. | Not formulable. | Not formulable. | Not formulable. |
| THIN, sign twists TW+- | No functional equation: first moment at `sigma = 1/2` not formulable; the class itself (which does not involve `F`) is unchanged. | Not formulable. | Not formulable. | (i) void identically. |
| T-NR, Beurling | T-NR: Lemma 1 with the modified local factor; inference, not run. Beurling: step (3) uses integer frequencies; not formulable. | Not run. | Not run. | Not run. |
| Phase-rotated transfer operator, `theta^w` | Not formulable in chain variables. | Not formulable. | Not formulable. | Not formulable. |

No statement of this note fails for DH at a structural step. "Not formulable" entries do not count as handles
(filter Q1 of the map).

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | The product form of `E_P` enters once, in the criterion `sum arcsin(p^{-1/2}) <= pi/2` for the sign of the bracket; the outcome (no forced sign for rich `P`) is the same for DH, and the closure (Prop. 3) uses only `f_q != 0`. |
| R2 (height-uniform, every window) | false | All statements are Abel means; the shell contractivity of Section 5 (ii) is height-coupled. |
| R3 (fails for every control at a named step) | false | Section 6: every formulable statement holds for DH and WT. |
| R4 (reaches the critical line) | false | Section 5: the limit step is void (measure form) or equals the known `Q*(t)` reserve bound (formula form). |

About zeros of zeta: nothing is claimed.

## 8. Three weakest steps

1. **Lemma 2 and Proposition 3 are ARGUED, not proved.** The derivation uses the approximate functional equation
   and non-stationary phase; the contour version is indicated only. The support is numerical (agreement to 0.005
   to 0.015 at the smallest `delta`, with pole location in float64, not certified). The DH part of Proposition 3(a)
   assumes that the zero set of `D_P` has codimension 2.
2. **Lemma 1 is proved for trigonometric-polynomial densities on a coordinate hyperplane only, and by reduction.**
   The proof reuses steps (0)-(3) of Theorem A' for two-sided Dirichlet series with rational frequencies; the
   referee passes checked those steps for integer frequencies (step (3) for real `k`). The uniformity of the
   `O(1)` terms in `j` (the weights `k'^{1/2}`) was summed by hand here and has not been refereed. The statement
   for general hypersurface measures and for Poisson densities is measured (two configurations for zeta, one for
   DH), not proved; the concentrated run A2 has a small effective sample and its error is estimated, not bounded.
3. **The density claim of Section 5 (i) and the first-order contractivity computation of Section 5 (ii).** Density
   is argued on a window with the far mass handled in one sentence. The identification with `Q*(t)` is a
   first-order statement in `Re z` checked against two values quoted from `g-passive-cascade` (`3.17 < 3.69 <
   4.47` at `t = 1e4`) and against the orientation counts of the runs; the shell width `c(t)` was not computed.

## 9. Files

`prep.py/.log/.json` (torus quantities), `pick_a.py`, `cfgA1.json`, `cfgA2.json`, `test_a.py`,
`testA1_zeta.log/.json`, `testA2_zeta.log/.json`, `test_b.py`, `testB_zeta_23.log/.json`,
`testB_zeta_237.log/.json`, `testB_dh_local.log/.json`, `cfgA3.json`, `testA3_dh.log/.json`,
`testA3_zeta.log/.json`, `server_dh.sh`, `server/testB_dh.log/.json` (copied back from the server).
