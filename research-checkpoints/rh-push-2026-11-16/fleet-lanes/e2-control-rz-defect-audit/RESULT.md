# e2-control-rz-defect-audit: the control RZ_b and the test "zero offset <= largest local defect"

Date 2026-11-18. Slug `e2-control-rz-defect-audit`. Filter lane, not an attack. Not refereed. Nothing committed or pushed.
Nothing here proves or refutes RH; no zero-free region, density bound or Lambda bound changes.
Labels: PROVED (argument given here) / CLASSICAL (cited, not re-read) / MEASURED (mpmath floats, not
interval-certified) / ARGUED (derived here from the statement of a lane result, not replayed inside that lane) / OPEN.
Numerics: local, one process, through `scripts/memcap.sh 8`; the compute server was not used.

## Verdict

**Precise obstruction. The observation does not survive as a lead; it survives as a bookkeeping rule.**

1. **Literal form: counterexample (PROVED).** With the defect read as written in the assignment,
   `sup_p |log|alpha_p|| / log p` over all local parameters, the control itself is a counterexample: in its own
   coordinate `s' = s + 1 - b`, `RZ_b = 1/zeta(s') = prod_p (1 - p^{-s'})` has unimodular local parameters
   (defect 0), a functional equation about `Re s' = 1/2`, coefficients `mu(n)`, and a zero at `s' = 1`, offset 1/2.
   The same reading also fails on T-NR (defect `1/2 + delta0`, offset `delta0`).
2. **Repaired form D1 (section 1.1): no counterexample in the searched class, and none is possible without
   deciding RH or GRH.** In the class "products and quotients of shifted zeta and Dirichlet L-functions, times
   T-NR factors at finitely many primes" the largest zero offset is produced by exactly three mechanisms
   (Lemma 1): (A) a local zero at a finite prime is a global zero (identity); (B) a quotient has a zero at the
   pole of its denominator (identity); (C) a shifted L-function has zeros at `1/2 + Re a + (beta - 1/2)`, and
   `offset <= defect` holds iff the L-function with the largest shift satisfies RH/GRH.
   **For `E_a` the observed equality "offset = a" is RH, not a verified property**: unconditionally
   `sup offset(E_a) = a + Theta - 1/2`, `Theta = sup Re rho`.
3. **One hypothesis outside the class, a counterexample exists (PROVED, exact arithmetic).** The function-field
   fake `Z(T) = (1 - 5T + 5T^2)/((1-T)(1-5T))`, `T = 5^{-s}`, is an Euler product over generalised primes with
   non-negative integer multiplicities `a_d` (1, 5, 25, 110, 500, ...), all local parameters unimodular
   (defect 0 in both readings), exact functional equation `Z(1/(5T)) = Z(T)`, coefficients `A_n <= 5^n`, and
   zeros on `Re s = 0.79899` and `0.20101` (offset 0.29899). The same function read as an Euler product over the
   single rational prime 5 has defect 0.29899 and satisfies the statement with equality by mechanism (A).
   **The defect is a property of the prime system, not of the function.**
4. **Statement delivered (section 4).** `S`: for an Euler product over the rational primes with rational local
   factors of degree <= 2, a functional equation about `Re s = 1/2` and D1 defect `delta`, every zero of the
   completed function has `|Re rho - 1/2| <= delta`. `S` at `delta = 0` is GRH for the object. Each of the three
   inputs is necessary, with an explicit witness: no Euler product (DH), no integers (the fake), no functional
   equation (`zeta(2s)/zeta(s)`, unimodular, zero at `s = 1`). `S` is true or undecided on every control; it is a
   statement, not a mechanism, and it does not name a step that uses multiplicativity to the left of `Re s = 1`.
5. **RZ_b as a control (sections 2, 3).** All listed properties hold. RZ_b passes every prime-side identity of
   positive-list items 16, 17, 18, 22 in shifted or sign-reversed form, and fails the sign-dependent items
   (20, 21) at the first coefficient. Its real zero at `b` is the pole of zeta and sits exactly on the `l^1`
   threshold of its own chain; its symmetry line is the `l^2` threshold. It adds one thing to the control set:
   an Euler-type signed twist, meromorphic on C, with a zero in `7/8 < Re s < 1`, for which the 7/8 argument
   returns a true statement in zeta's coordinate and is not formulable in RZ_b's own coordinate.

No pivot was taken: the adjacent combinations (defect as an `l^2` threshold of the chain; pole coupling) are
answered inside sections 3 and 4 and do not give a mechanism.

## 0. Plan

Decisive test first (section 1): fix a definition of local defect under which the observation is true for the two
objects it was read off from (`E_a`, T-NR), then search the stated class for a counterexample. Then the control row
(section 2), the table against items 16-23, Theorem PC and the 7/8 row structure (section 3), and the statement with
the inputs each control lacks (section 4).

New relative to the map: (a) the two examples behind the observation use two different normalisations, and one of
them is RH; (b) the divisor formula of Lemma 1 with its three mechanisms; (c) the fake as a Beurling-type system
with functional equation and unimodular local data, which isolates the input INT from FE and GEOM; (d) the RZ_b
column of the control table.

## 1. Decisive test

### 1.1 Definitions

Class `C`: `F(s) = prod_p L_p(p^{-s})`, `L_p(T) = prod_j (1 - beta_{p,j} T) / prod_i (1 - alpha_{p,i} T)` with at
most two `alpha` and two `beta` per prime, `|alpha|, |beta| <= p^A`; meromorphic of finite order; a functional
equation `gamma(s) F(s) = eps * conj(gamma F)(1 - conj s)` with `gamma` a ratio of products of Gamma factors and
exponentials (so the divisor of the completed function is symmetric about `Re s = 1/2`).

Local divisor at `p`: local poles on `Re s = log|alpha_{p,i}| / log p`, local zeros on `Re s = log|beta_{p,j}| / log p`.

* **D0 (literal reading):** `delta_p = max over all parameters of |log|.|| / log p`.
* **D1:** `delta_p = max( max_i |log|alpha_{p,i}|| / log p , max_j |log|beta_{p,j}| / log p - 1/2| )`: distance of
  local poles from `Re s = 0` and of local zeros from `Re s = 1/2`. `delta = sup_p delta_p`.

D1 is the only reading under which both source examples give "offset = defect": for `E_a` the parameters are
denominators `p^{+-a}` (defect `a`); for T-NR, `D(s) = (1 - alpha q^{-s})(1 - beta q^{-s})` has numerators of size
`q^{1/2 +- delta0}` (defect `delta0 = arccosh(|c|/2)/log q`). A functional equation about 1/2 forces a local
factor's zeros to be symmetric about 1/2, which is why numerators are measured from 1/2.

Offset of `F`: `sup |Re rho - 1/2|` over zeros of the completed function (trivial zeros removed; poles not counted,
since zeta's own pole has offset 1/2).

### 1.2 Lemma 1 (divisor formula; PROVED, elementary)

Let `F = prod_{j} L(s + a_j, chi_j)^{e_j} * prod_{q in S} D_{q, c_q}(s)`, `e_j = +-1`, `S` finite, the multiset
`{(a_j, chi_j, e_j)}` closed under `(a, chi) -> (-conj a, chi)` or `(-a, conj chi)` (this is the condition for a
functional equation about 1/2). Write `Theta_j = sup Re rho` over zeros of `L(s, chi_j)`.

(A) Zeros of `D_{q,c}` are zeros of `F`: real parts `1/2 +- delta0(q, c)` when `|c| > 2`, exactly `1/2` when
`|c| <= 2`. Contribution to the offset: `delta0`. Contribution to the D1 defect: `delta0`. Equality, by identity.

(B) Each factor with `e_j = -1` and `chi_j` principal gives a zero of `F` at `s = 1 - a_j`; with the symmetric
partner the offsets are `1/2 +- Re a_j`. D1 defect of that factor (numerators `p^{-a_j}`): `1/2 + |Re a_j|`.
Equality, by identity (pole of zeta).

(C) Each factor with `e_j = +1` gives zeros at `rho - a_j`: offsets up to `|Re a_j| + Theta_j - 1/2`. D1 defect:
`|Re a_j|`. So this factor satisfies `offset <= |Re a_j|` iff `Theta_j = 1/2`.

Hence `offset(F) = max( max_S delta0 , max_{e=-1, principal} (1/2 + |Re a_j|) , max_{e=+1} (|Re a_j| + Theta_j - 1/2) )`
and `delta(F) = max( max_S delta0 , max_{e=-1} (1/2 + |Re a_j|) , max_{e=+1} |Re a_j| )`.

Proof. Zeros and poles of a finite product are the union of those of the factors (no cancellation occurs between a
zero of `D_q`, which lies on a vertical line in an arithmetic progression of step `2 pi / log q`, and the finitely
many real polar points unless parameters are chosen to coincide; coincidences only lower the offset). The local
parameters of `L(s + a, chi)` are `chi(p) p^{-a}`. The zeros of `D_{q,c}` are computed in `r3-tnr-control` section 1.
QED

**Corollary 1 (PROVED).** In this class `offset(F) <= delta(F)` holds iff
`|Re a_j| + Theta_j - 1/2 <= delta(F)` for every factor with `e_j = +1`. In particular:
* for a pure product without T-NR factors it is equivalent to RH/GRH for every factor of maximal `|Re a_j|`
  (and a weaker bound `Theta_j <= 1/2 + delta - |Re a_j|` for the others);
* for `E_a`: `offset = a + Theta - 1/2`, so "offset = defect" iff RH;
* whenever a quotient factor is present with `|Re a_-| >= max_+ |Re a_j|`, it holds unconditionally, because
  `Theta_j <= 1` (CLASSICAL);
* an unconditional counterexample inside the class would be a zero of some `L(s, chi_j)` off the line. None is
  known; none can be found by this search.

**Corollary 2 (literal reading; PROVED).** Under D0, `1/zeta(s)` (that is, `RZ_b` in its own coordinate) has defect
0 and offset 1/2; T-NR has defect `1/2 + delta0` and offset `delta0`. D0 is rejected.

### 1.3 T-NR at two primes

Product form `zeta(s) D_{q1,c1}(s) D_{q2,c2}(s)`: covered by (A), offset `max(delta0(q1), delta0(q2))`.
MEASURED on `q = 2, c = -2.5` (`delta0 = 1` exactly, since `arccosh(1.25) = log 2`) with `q = 5, c = 2.3`: five zeros
in the strip around `Re s = 3/2` up to height 40.3 (heights `2 pi k / log 2`, `k = 0..4`), none to the right.
A two-prime modification that is not a product, such as `c + 2 cosh((s - 1/2) log q1) + 2 cosh((s - 1/2) log q2)`,
keeps the functional equation but is not multiplicative; it has no local factors, so the statement is not
formulable for it (same status as DH). Not computed.

### 1.4 What lies just outside the class (PROVED)

**(i) No functional equation.** `zeta(2s)/zeta(s) = prod_p (1 + p^{-s})^{-1} = sum lambda(n) n^{-s}` (Liouville).
Denominator parameters `-1`: defect 0 in both readings; coefficients of modulus 1; zero at `s = 1`
(`sum lambda(n)/n = 0`, CLASSICAL; MEASURED slope `zeta(2) = 1.6449340666` at `1 + 1e-10`). Offset from 1/2 is 1/2.
It has no functional equation about one line (`zeta(2s)` reflects about 1/4, `zeta(s)` about 1/2).
A unimodular completely multiplicative twist with a zero in the open strip `1/2 < Re s < 1`, meromorphic near
that zero: `formalization/rh-attempts/2026-11-01-r3-pole-pretentious.md` Proposition RT reports rotation twins
with a zero at a chosen `w` (same-agent checked there; not re-run here). Subsets of primes with sign `-1` only
produce a boundary zero at the abscissa of convergence of `sum_{p in A} p^{-s}` (Landau), not an interior one.

**(ii) No integers (Beurling-type system with functional equation).** `Z(T) = (1 - 5T + 5T^2)/((1-T)(1-5T))`.
* `N_n := 5^n + 1 - (alpha_1^n + alpha_2^n)`, `alpha_{1,2} = (5 +- sqrt 5)/2`; `a_d := (1/d) sum_{e|d} mu(d/e) N_e`.
  Exact integers: `a_d = 1, 5, 25, 110, 500, 2215, 10000, 45100, 205200, 937874, ...`; `a_d >= 1` for all `d <= 400`
  (computed). For `d >= 6`: `d a_d >= 5^d - 2 (3.62)^d - (5/4) 5^{d/2} - d/2 > 0`. So `a_d` is a positive integer for
  every `d`.
* `Z(T) = prod_d (1 - T^d)^{-a_d}` (identity of power series; checked exactly mod `T^41`). With `T = 5^{-s}` this
  is an Euler product over `a_d` generalised primes of norm `5^d`, each with local factor `(1 - N^{-s})^{-1}`:
  unimodular parameter, `Lambda >= 0`.
* `Z(1/(5T)) = Z(T)` (one line of algebra), i.e. invariance under `s -> 1 - s`. Simple poles at `s = 0, 1`
  (mod `2 pi i / log 5`). Coefficients `A_n = (5^n - 1)/4 <= 5^n` for `n >= 1`: bounded by the norm.
* Zeros: `T = (5 -+ sqrt 5)/10`, `Re s = 0.7989937` and `0.2010063`. Offset 0.2989937.

So Euler product + `Lambda >= 0` + unimodular local data + functional equation + pole at 1 + linear coefficient
growth does not give the statement; the object lacks the integers (its norms are the powers of 5, and it is not
the zeta function of a curve: no curve over F_5 has these Weil numbers, since `|alpha| != sqrt 5`). The map lists
this function among the auxiliary controls ("no sections"); the point added here is the comparison of the two
prime systems. Read over the rational prime 5 alone, the same function has local zeros at `Re s = 0.799, 0.201`,
D1 defect 0.299, and satisfies the statement by mechanism (A).

### 1.5 Outcome of the decisive test

The combination "local defect bounds the zero offset" is not killed by a counterexample inside the class and is not
a lead: on finite sets of primes it is an identity, on quotients it is the pole of zeta, on infinitely many primes
it is RH for the factor that carries the largest shift. The only content is the D1 bookkeeping rule and the three
witnesses of section 1.4 and DH for the necessity of the three inputs.

## 2. The control row RZ_b (first lemma)

**Lemma 2 (PROVED, elementary; numerics MEASURED at b = 0.93).** For `7/8 < b < 1` put `RZ_b(s) = 1/zeta(s + 1 - b)`.

| Property | Statement | Check |
|---|---|---|
| Euler product | `prod_p (1 - p^{b-1} p^{-s})`, absolutely convergent for `Re s > b` | product over `p <= 2e5` at `2.5 + 3i`: difference 1.3e-10 |
| Dirichlet series | `sum mu(n) n^{b-1} n^{-s}`, `|coefficient| <= 1` | sum over `n <= 2e5`: difference 3.9e-13 |
| Log-derivative | `-RZ_b'/RZ_b = sum c(n) n^{-s}`, `c(n) = -n^{b-1} Lambda(n)`; `eps_n = -n^{b-1}`, `|eps_n| <= 1`, `eps_n < 0` | at `s = 3`, `n <= 2e4`: 6.1e-10 (tail size) |
| Continuation | meromorphic on C | closed form |
| Zeros | exactly one zero of the Dirichlet series: `s = b`, simple, slope 1 (the pole of zeta). No other zeros anywhere: `1/zeta` vanishes only where zeta has a pole | `RZ_b(b + 1e-12)/1e-12 = 0.9999999999994` |
| Poles | `rho - (1 - b)` for zeta zeros `rho` (real part `b - 1/2` for every zero on the critical line; at most `b` in general), and `-2k - (1 - b)` | first three: real part 0.43 |
| Functional equation | `G(s) = pi^{-s'/2} Gamma(s'/2) zeta(s')`, `s' = s + 1 - b`: `1/G(s) = 1/G(2b - 1 - s)`; symmetry line `Re s = b - 1/2` in `(3/8, 1/2)` | relative residuals 3.6e-31, 1.3e-30, 2.0e-31 |
| Completed function | `1/G` has exactly two zeros, `s = b` and `s = b - 1` (the poles of completed zeta at `s' = 1, 0`), symmetric about `b - 1/2` with offset 1/2; its poles are the shifted zeta zeros | slopes of `1/G` at `b`, `b - 1`: +1.0000000001, -0.9999999999 (step 1e-10) |

Has: Euler product over the rational primes (multiplicative, not completely multiplicative: `mu(p^2) = 0`),
bounded coefficients, prime-power-supported log-derivative of size `<= Lambda(n)`, meromorphic continuation, a
functional equation. Lacks: `Lambda >= 0` (all log-derivative coefficients are negative), a functional equation
about `Re s = 1/2`, zeta's gamma factor (its own is the reciprocal), the pole at 1 (it has a zero at `b` instead).

Additions to the graph node `ctrl-rz-reciprocal-shift`: (1) the completed function `1/G` has the zero pair
`{b, b - 1}` and nothing else, so against "zeros of the completed function lie on the symmetry line" RZ_b is a
counterexample by exactly one pair, both real, at offset 1/2 (the polar pair of zeta); against "a Dirichlet series
with zeta's archimedean side has no zero in `Re s > 7/8`" it is effective. (2) D1 defect relative to its own line is 1/2 (local zeros on
`Re s = b - 1`); relative to `Re s = 1/2` it is `3/2 - b`, and the zero at `b` has offset `b - 1/2 < 1/2`. (3) In
the completely multiplicative form `g(n) = lambda(n) n^{b-1}`, `G = zeta(2s + 2 - 2b)/zeta(s + 1 - b)` is not
pole-coupled at 1 and `N_g(x) = sum Lambda(n)(1 - Re g(n)) ~ x`, so `sigma*(g) = 1` and Theorem PC makes no
statement at `b`: this is the "reduced modulus" case of Proposition PT of the pole-pretentious note.

**Control row for section 2 of the map (proposed).**

| Code | Control | Has | Lacks | Use |
|---|---|---|---|---|
| RZ | `RZ_b(s) = 1/zeta(s + 1 - b)`, `7/8 < b < 1` | Euler product over rational primes; coefficients `mu(n) n^{b-1}`, bounded; signed twist `eps_n = -n^{b-1}` of `Lambda`; meromorphic on C; functional equation about `Re s = b - 1/2`; real zero at `s = b` | `Lambda >= 0`; functional equation about 1/2 and zeta's gamma factor; pole at 1; complete multiplicativity | an Euler-type twist with continuation and a zero in `7/8 < Re s < 1`: kills arguments that use size, support, multiplicativity and continuation of the prime side but neither the sign of `Lambda` nor the position of the symmetry line. It is `1/zeta` shifted, so any argument that is covariant under `s -> s + const` and under `F -> 1/F` sees it as zeta |

## 3. Table: controls against positive-list items 16-23, Theorem PC and the 7/8 rows

Entry: first step that fails, and its type (I = identity or exact structural condition, Q = inequality), or PASSES.
"n/f" = not formulable (not a quantitative handle). Cells are ARGUED from the statements of the cited results
unless marked; DH cells and the T-NR, DH, twist cells of the 7/8 block are quoted from the lanes. UT = unimodular
twist `prod (1 - eps_p p^{-s})^{-1}`, `|eps_p| = 1`. B = Beurling system (general, no functional equation).

| Item | RZ_b | E_a | T-NR | DH | B | UT | HEAT |
|---|---|---|---|---|---|---|---|
| 16 Passive cascade `xi'/xi = G - sum_p [Z_p - (log p)/2]`, `Re s > 1` | Identity holds with every sign reversed and `s -> s + 1 - b`: the prime stubs enter un-negated, the gamma port negated. With zeta's `G` kept: fails at the termination (I) | Holds for `Re s > 1 + a` with two stubs per prime, lossless about `Re s = +-a` instead of 0. First failure: stub axis (I) | Fails at `q`: the section there has zeros on `1/2 +- delta0` and is not a stub lossless about `Re s = 0` (I) | Parallel junction, Prop. 4 (I) | Prime chain PASSES; no gamma port (I, missing) | Prime chain PASSES (rotated delays); no gamma port (I, missing) | no chain: first step (I, n/f) |
| 17 Chain thresholds: defect `l^1` iff `Re s > 1`, `l^2` iff `Re s > 1/2` | PASSES shifted: `l^1` iff `Re s > b`, `l^2` iff `Re s > b - 1/2`. The zero sits on the `l^1` threshold, the symmetry line on the `l^2` threshold | PASSES shifted: `l^1` at `1 + a`, `l^2` at `1/2 + a` | PASSES unchanged (one prime does not move a threshold): `l^2` at 1/2 while zeros sit at `1/2 + delta0` | no chain (I) | PASSES when `pi_P(x) ~ x/log x`; zeros up to any `theta < 1` (CLASSICAL) | PASSES unchanged | no chain (I, n/f) |
| 18 Coverage: truncated chain J-contractive on `Re s >= 1/2`, `|t| >= t_0`, `Q <= Q*(t_0)` | PASSES verbatim with zeta's `G` (the theorem holds for every `|eps_n| <= 1`) | Fails at `Re u_p <= log p/(p^sigma - 1)` on `1/2 <= Re s <= 1/2 + a` (Q); a version on `Re s >= 1/2 + a` passes | Fails once `Q >= q`: `|Lambda_F(q^k)| ~ q^{k(1/2 + delta0)} log q`, the local series diverges on `Re s <= 1/2 + delta0` (Q) | no chain (I) | no gamma reserve `R(t)` (Q, n/f) | PASSES verbatim with zeta's `G` | no chain (I, n/f) |
| 19 Theorem R (all-order Pick positivity has zero tolerance in each prime weight; hypothesis `sum |eta(n)| n^{-1/2} < inf`) | Outside the hypothesis: `eta = -(1 + n^{b-1}) Lambda`, not summable (Q). The theorem covers finite and sparse twists only | Outside the hypothesis (Q) | Outside the hypothesis: `|eta(q^k)| q^{-k/2} ~ q^{k delta0}` (Q) | `eta` not summable and not prime-supported (Q); the theorem's proof does not use prime support | Not a perturbation of `Lambda` on the integers (n/f) | Outside the hypothesis unless `eps_p = 1` off a sparse set (Q) | no Dirichlet series (n/f) |
| 20 Theorem E: `Q_L(v) <= A(v)` for `v >= 0` (uses `Lambda >= 0` and the pole) | Fails at the sign of `Lambda_F` at `n = 2` (Q); the reversed inequality holds with the pole term replaced by a zero term | PASSES with poles at `1 +- a` in `A` | Fails at `Lambda_F(q) = (1 + c sqrt q) log q < 0` for `c < 0`, at `Lambda_F(q^2) < 0` for `c > 0` (Q) | Fails (MEASURED in the lane) (Q) | Prime side PASSES; `A` has no archimedean part (I, missing) | Fails at the first `p` with `eps_p` not in `[0, 1]` (Q) | n/f |
| 21 `u -> log F(sigma + iu)` positive definite for `sigma > sigma_abs` (iff `Lambda_F(n) >= 0` for all `n`, Bochner) | Fails at `n = 2`: every coefficient is negative; `-log RZ_b` is positive definite (I: sign of a coefficient) | PASSES for `sigma > 1 + a` | Fails at `q` or `q^2` as in item 20 (I) | Fails at `3^{-s}` (lane) (I) | PASSES | Fails at the first `p` with `eps_p != 1` (I) | n/f |
| 22 Ladder Hecke identity: `kappa = sum V_n g_0`; eigen-section iff `a(p^k m) = a(p^k) a(m)` | Multiplicative step PASSES (`kappa = prod_p (1 - p^{b-1} V_p) g_0` formally); fails at Fricke evenness about 1/2 (I). No positive kernel: `1/G` is not the transform of an even positive theta kernel | PASSES as a Hecke eigen-object (Eisenstein series); the seed is a K-Bessel function, not the Gaussian `g_0` (I) | Eigen step PASSES; the local vector at `q` is not spherical (item 23) (I) | Fails the eigen step: `a(6) - a(2)a(3) = 1.0807` (lane) (I) | Eigen step PASSES over generalised integers; no Poisson summation, so no Fricke step (I) | Eigen step PASSES; Fricke fails (MEASURED in `c1-missing-controls`) (I) | Fricke PASSES (even kernel); eigen step fails: coefficient cocycle `2t log m log n` (I) |
| 23 Tate integral with a pure-tensor test vector, spherical at almost all places, against one quasi-character | Fails "spherical at almost all places": `Z_p(f_p, s) = P_p(p^{-s}, p^s)/(1 - p^{-s})` with `P_p` a Laurent polynomial, and `1/zeta` needs `P_p = (1 - p^{-s})^2` at every `p` (I) | PASSES as a product of two Tate integrals at `|.|^{s +- a}`; the quasi-characters are not unitary on the line (I: size) | PASSES by definition: non-spherical self-dual vector at `q` | Fails "one idele class character": a combination of two characters mod 5 (I) | no adele ring (n/f) | Fails unless `eps_p = chi(p) p^{-it}` for a Hecke character (I) | Fails "integration against a quasi-character": the weight `e^{tau u^2/16}` in `u = log|x|` is not a character (I) |
| Theorem PC (pole-coupled Landau positivity) | Not pole-coupled; `sigma* = 1`; no statement at `b` (I: residue at 1) | `g(n) = n^{+-a}` violates `|g| <= 1` (Q) | `|g(q)|` unbounded on the inverse side; not completely multiplicative (Q) | not multiplicative (I) | n/f (not a function on the integers) | In scope; PC gives `r_G(w) + conj r_G(conj w) = 2 ord_w zeta` to the right of `sigma*(g)` only | n/f |
| 7/8 rows S0-S6 (`r3-tnr-control` section 2), relative to the unrefereed manuscript | In zeta's coordinate every step passes and the conclusion is true: no pole of RZ_b in `Re s > b - 1/8`; the zero at `b` is the principal term. In its own coordinate with weight `mu(n) n^{b-1}`: fails S2 (weight not a function on a ray class group; reflection Prop 5.1) and S3 (not completely multiplicative) (I) | Fed as `zeta(s - a)`, weight `n^a`: fails S0/S2/S3 at `|eta(p)| <= 1` (Q); returns "no zeros in `Re s > 7/8 + a`", true | Fails S0 and Lemma 7.1 at `|eta(q)| = 1` (Q); returns `max(7/8, 1/2 + delta0)` (lane, Prop. T) | Fails (7.13): no prime-by-prime factorisation (I) (lane) | Probe built from cubic Gauss sums over `Z[omega]`: n/f; as a weight, fails Prop 5.1 (I) (lane) | Fails Prop 5.1 and the Hecke reflection, Sections 17-18 (I) (lane) | n/f (lane) |

Reading of the table.

* **RZ_b passes the prime-side identities and the size inequality, and fails only sign and symmetry-line steps.**
  Items 16-18 and 22 hold for it after `s -> s + 1 - b` and `F -> 1/F`. Any future argument must therefore contain a
  step that is not covariant under these two operations; the step is either the sign of `Lambda` (which the map's
  three theorems show cannot suffice with the functional equation) or the position of the pole and of the
  symmetry line relative to the prime chain.
* **Identity or inequality.** DH, B, UT and HEAT fail at identities everywhere (missing factorisation, missing
  gamma port, missing Fricke step). `E_a` and T-NR fail at inequalities of size (`|alpha_p| <= 1`), in items 18,
  19, PC and the 7/8 rows, and pass the identities. RZ_b fails at identities of sign or symmetry and passes the
  size inequalities. No control in the list fails only at an inequality that is tight for zeta.
* **Item 17 separates two notions of defect.** The `l^2` threshold of the chain is `1/2 + delta_inf`, where
  `delta_inf` is the exponent of `sum_p |alpha_p|^2 p^{-2 sigma}` (it sees only infinitely many primes); the zero
  offset in mechanism (A) is `delta_fin`, a supremum over single primes. T-NR has `delta_inf = 0` and offset
  `delta0`; `E_a` has `delta_inf = a` and offset `a + Theta - 1/2`. The `l^2` threshold is therefore not a zero
  locator even with the functional equation and an Euler product (T-NR), and where it coincides with the zero
  line (`E_a`, zeta) the coincidence is RH.

## 4. The statement and the inputs each control lacks

**Statement S (OPEN; equal to GRH at delta = 0).** Let `F` be in class `C` of section 1.1 over the rational primes,
with functional equation about `Re s = 1/2` and D1 defect `delta(F)`. Then every zero of the completed function
satisfies `|Re rho - 1/2| <= delta(F)`.

Status. PROVED for T-NR factors and quotient poles (Lemma 1 (A), (B)). For a shifted product it is equivalent to
`|Re a_j| + Theta_j - 1/2 <= delta` (Corollary 1). The trivial unconditional bound in the class is
`offset <= 1/2 + sup_p (local pole abscissa)` from absolute convergence and the functional equation (CLASSICAL).
`S` is weaker than GRH for a hypothetical non-tempered primitive object and equal to GRH for tempered ones.
Equality `offset = delta` is not claimed in general.

| Control | In class C over the rationals? | Input it lacks | Outcome for S |
|---|---|---|---|
| zeta | yes, `delta = 0` | none | S is RH |
| `E_a` | yes, `delta = a` | SIZE (absorbed into `delta`) | S iff RH; offset `a + Theta - 1/2` |
| T-NR (one or two primes) | yes, `delta = max delta0` | GEOM at `q` (absorbed into `delta`) | true with equality, identity (A) |
| RZ_b, own line | yes, `delta = 1/2` | `Lambda >= 0`, zeta's gamma factor | true with equality: the completed function has zeros exactly at `b` and `b - 1`, offset 1/2, identity (B) |
| RZ_b, line 1/2 | no functional equation about 1/2 | FE about 1/2 | hypothesis fails; the inequality `b - 1/2 <= 3/2 - b` holds |
| DH | no | Euler product (no local factors) | n/f; zeros at offset 0.3085 and with `Re s` up to about 1.12 (map) |
| Beurling, general | no | INT, FE | n/f without a symmetry line |
| Fake over "F_5" (Beurling system with FE) | no (generalised primes) | INT | **false**: `delta = 0`, offset 0.2989937 (PROVED) |
| Unimodular twist | no functional equation | FE | **false** in the form "offset from 1/2": `zeta(2s)/zeta(s)`, `delta = 0`, zero at `s = 1` (PROVED) |
| Backward heat | no | Dirichlet series, Euler product | n/f |

Each of the three inputs of `S` is necessary given the other two (PROVED by the witnesses: DH for the Euler
product, the fake for the integers, `zeta(2s)/zeta(s)` for the functional equation). In the map's input codes:
`S` uses FE + INT + multiplicativity and replaces SIZE and GEOM by the measured quantity `delta`. This agrees with
the map's note that at conductor 1, FE + INT is Hamburger uniqueness. `S` gives no step that acts to the left of
`Re s = 1`; for the three requirements of the campaign it is uniform in height and uses all primes only in the
sense that it is a restatement of the target.

## 5. Controls (for this lane's own claims)

This lane makes no zero-location argument, so there is no step to fail. The claims are Lemma 1, Lemma 2, the two
witnesses of section 1.4 and the table. Lemma 1 was tested on eight members by winding numbers (section 6). The
table's cells for DH, T-NR and the twists in the 7/8 block are the lanes' own; the remaining cells are ARGUED.

## 6. Numerics (MEASURED; `checks.py`, `checks.json`, `checks.log`, `winding_run.log`)

Winding number of `F` around the rectangle `[1/2 + delta + 0.013, 3] x [-0.7, 40.3]` (zeros minus poles to the right
of the predicted extreme line) and around the strip `[1/2 + delta - 0.013, 1/2 + delta + 0.013] x [-0.7, 40.3]`
(zeros on the extreme line). Contour step 0.02 and 0.01, 15 digits; largest argument increment 1.33 rad (below pi,
so the count is unambiguous); all windings integral to 4 decimals.

| Member | D1 defect | right box: winding / known poles / zeros | strip: zeros minus poles | Lemma 1 prediction |
|---|---|---|---|---|
| `zeta(s+a) zeta(s-a)`, `a = 0.2` | 0.2 | -2 / 2 (at 0.8, 1.2) / 0 | 6 | 6 zeta zeros below 40.3 on `Re = 0.7` |
| `L(s+a, chi_4) L(s-a, chi_4)`, `a = 0.15` | 0.15 | 0 / 0 / 0 | 14 | zeros of `L(s, chi_4)` below 40.3 |
| `zeta D_{3, 2.2}` | 0.40375 | -1 / 1 / 0 | 7 | heights `pi(2k+1)/log 3`, `k = 0..6` |
| `zeta D_{2, -2.5} D_{5, 2.3}` | 1.0 | 0 / 0 / 0 | 5 | heights `2 pi k/log 2`, `k = 0..4` |
| `zeta(s+a) zeta(s-a) D_{3, 2.2}`, `a = 0.1` | 0.40375 | -1 / 1 / 0 | 6 | 7 zeros minus the pole at 0.9 |
| `zeta(s+a) zeta(s-a)/zeta(s)`, `a = 0.3` | 0.5 | -1 / 1 / 0 | 1 | zero at `s = 1` |
| `1/zeta(s)` | 0.5 | 0 / 0 / 0 | 1 | zero at `s = 1` |
| `zeta(s+a) zeta(s-a)/(zeta(s+b) zeta(s-b))`, `a = 0.1`, `b = 0.2` | 0.7 | 0 / 0 / 0 | 1 | zero at `s = 1.2` |

These confirm the divisor formula on a window where all zeta and `L(s, chi_4)` zeros are on the line; they are not
evidence for `S` beyond verified height. In the first run the pole list for `E_a` omitted the pole of `zeta(s + a)`
at `1 - a = 0.8`; the measured winding -2 is the two poles (corrected in `winding.json`; raw output kept in
`winding_run.log`). The script's first run was stopped twice by the author (contour too fine for the 20-minute
limit; a loop of length `a_d` in the exact Euler-product check, replaced by binomial coefficients); the winding
block was not rerun and is read from `winding.json`.

RZ_b values and the fake's exact arithmetic are in sections 2 and 1.4.

## 7. Three weakest steps

1. **The table's ARGUED cells.** Items 16, 17, 22, 23 for RZ_b, `E_a`, B, UT and HEAT were derived from the
   statements of the lane theorems, not by rerunning the lanes' proofs or scripts with the control's data. The most
   exposed are: item 17 with general local parameters (the threshold `1/2 + delta_inf` is the lane's Parseval
   computation with `|alpha_p|` inserted, not re-derived line by line); item 22 for `E_a` (K-Bessel seed) and for
   RZ_b (formal product `prod (1 - p^{b-1} V_p) g_0`, convergence not examined); item 23 for HEAT.
2. **Scope of "no counterexample".** Lemma 1 covers products and quotients of shifted zeta and Dirichlet
   L-functions with T-NR factors. Degree-2 objects not of this form (cusp forms, Maass forms, Artin and Hecke
   L-functions of quadratic fields) were not searched: for them `S` at `delta = 0` is GRH and no unconditional
   information exists. The claim that degree-1 members of the class are exactly shifted Dirichlet L-functions
   with finitely many modified local factors rests on Kaczorowski-Perelli (CLASSICAL, not re-read) and was not
   checked for non-tempered Euler products.
3. **The definition D1 is chosen to fit two examples.** It is the reading under which `E_a` and T-NR both give
   equality, and it is forced by the symmetry of local divisors under the functional equation, but for objects with
   numerators at infinitely many primes it always gives `delta >= 1/2`, which makes `S` weak there (it then holds
   by `Theta <= 1` whenever the quotient shift dominates). A sharper definition for quotients was not sought. The
   interior-zero unimodular twist is cited from an unrefereed note and was not re-run.

## 8. Files

* `RESULT.md` (this file).
* `checks.py`: RZ_b properties, winding numbers, `zeta(2s)/zeta(s)`, exact arithmetic for the fake. Run:
  `scripts/memcap.sh 8 .venv-arb/bin/python -u tmp/research-2026-11-16/push/e2-control-rz-defect-audit/checks.py`
  (2 s with `winding.json` present; the winding block, kept in the script as the string `WINDING_CODE`, took about
  8 minutes).
* `checks.json`, `checks.log`: outputs. `winding.json`, `winding_run.log`: winding block, parsed and raw.
