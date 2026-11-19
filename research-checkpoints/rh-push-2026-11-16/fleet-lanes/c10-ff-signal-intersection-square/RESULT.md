# c10-ff-signal-intersection-square: is the squared signal of the Prop. 2.1 probe an intersection-form square?

Internal working note, 2026-11-18. Slug `c10-ff-signal-intersection-square`. Kind: combine (attack). Not refereed.
Nothing committed, pushed or posted. All runs local through `scripts/memcap.sh 8` (about 4 s each); the compute
server was not used and no unit was started there.

This note makes **no statement about zeta** and none about zeros of any number-field L-function. It is a
function-field model computation in which the Riemann hypothesis for the targets is Weil's theorem.
7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (argument given here; inputs named) / CLASSICAL / EXACT (equality of exact integers or rationals on
the stated cases) / MEASURED / ARGUED / NOT-RUN / OPEN.

## 0. Verdict

**Precise obstruction. The decisive test gives "equal", and the equality carries no positivity input.**

1. **First lemma (EXACT, 84 configurations, 112 curves each; section 2).** For a target nu_F (quadratic character of
   prime cubic conductor F, q = 7; curve C_F: y^2 = -F(T), genus 1, Frobenius traces t_j = alpha^j + alphabar^j)
   the Moebius sum of the probe is a linear form in the Frobenius traces with a coefficient vector that does not
   depend on the curve:

       S_cop(k) = sum_{j=0..N} c_j t_j,        c = c(q, N, lam, k).

   For lam > N and k = 0: c = -pi(lam) (Chebyshev coefficients of M_N = t_N + q t_{N-2} + ...; last term
   q^(N/2) t_0/2 for even N).
2. **Decisive test (EXACT; section 3).** With D_k = sum_j c_j (P_{N+j} + q^j P_{N-j}) in NS(C_F x C_F)_prim (x) Q,
   P_j the primitive part of the graph of Frobenius^j:

       S_cop(k)^2 = - D_k.D_k / (2 q^N)

   per curve (9408 of 9408 cases) and summed over the family (84 of 84). The law B_coh of round 8 is then
   sum_k kappa_k (-D_k.D_k) with positive rational kappa_k independent of the curve; it reproduces the 52 values
   of `c9-mv6-ff-window-exact/predictions.json` for targets a, b (q = 7) exactly.
3. **Why this is not the Hodge index theorem (PROVED, section 4).** On an elliptic curve F^j + V^j is the integer
   t_j (V = dual of Frobenius). So D_k is the primitive class of the graph of m F^N with the integer
   m = S_cop(k), and -D_k.D_k = 2 deg(m F^N) = 2 m^2 q^N. The identity is "the degree of multiplication by m is
   m^2". It holds, with the same c and the same sign, for the genus-1 polynomials 1 - a u + 7 u^2 that are not
   zeta functions of curves and violate the Riemann hypothesis (|a| >= 6): 3444 of 3444 cases, no negative value,
   while their form is indefinite on other vectors (EXACT). The squared signal is the square
   (P_0 . D)^2 of an intersection number with the diagonal class, not a self-intersection that needs the index
   theorem for its sign.
4. **Where the index theorem does enter: as an upper bound, on the opposite side.** By Cauchy-Schwarz for the
   Hodge form, signal^2 <= (g/2) Q_TL[c_sym] <= g^2 max |f|^2: this is the Weil bound for the Moebius sum of the
   target, which is what keeps B_coh below the diagonal for dual length r <= 3N. The excess for r > 3N (the
   model's h > 1) comes from the factor wt_k^2 in kappa_k, the count of sixth-power dual frequencies of the sextic
   Gauss-sum row; it is a property of the probe, not of the target curve, and is the same for every vector.
5. **Genus 2 (EXACT, 80 seeded prime quintics).** The equality is special to genus 1. For N = 1 (signal linear in
   traces): M_1^2 = (g/2)(-D.D)/q - (phi_1 - phi_2)^2 with gap between 5 and 85, never 0; the genus-1 form of the
   equality holds in 0 of 80. For N = 2 the signal is not linear in the traces: 2 M_2 = t_1^2 + t_2 (80 of 80), and
   M_2 is not an affine function of (t_1..t_4) (68 of 80 off the fitted plane). The signal is the trace of
   Frobenius on Sym^N of H^1 (complete homogeneous polynomial h_N of the eigenvalues), which is a combination of
   Frobenius traces only for SU(2).

State for the scoreboard: **not** "model vertex with h > 1 and a named unproved input". The model vertex with
h > 1 stands as measured in rounds 7 to 9; its squared signal is an intersection-form square only in the sense
of item 3, and no new input is named. No requirement flag. Proposed row: section 7.

## 1. Plan, what is new, relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP rows T2, T3, Z15, Z15b, Z15c, Z24, Z26 and the controls section;
`formalization/paper/function-field-twin-ladder.md` sections 0 to 3; `c8-ek-ff-reflected-rows-exact/RESULT.md`
(sections 0 to 7; `ffx.c` command `sc`); `c9-mv6-ff-window-exact/RESULT.md` (sections 0 to 4), `predict.py`,
`predictions.json`; engine nodes function-field-twin-ladder, ff-three-approaches-one-statement,
ff-order2-vertex-probe; candidates of rank 17 and 26.

Known before: (twin ladder) G_jk = q^j + q^k - Gamma_j.Gamma_k = -P_j.P_k = q^((j+k)/2) S_(k-j), Q_TL >= 0 is the
Hodge index theorem; (round 8) row energy/diagonal = non-coherent part + B_coh, B_coh = sum_k wt_k^2 q^(2d)
S_cop(k)^2 / (||c_k||^2 q^(N+lam) diagsum); (round 9) for r > 3N the excess grows for Weil targets.

New here: the coefficient vector c; the exact comparison of S_cop^2 with -P.P; the reason for equality
(F^j + V^j is an integer in genus 1); the fake and genus-2 controls. Row T3 says no object counted by Q_L is
known over Z; this lane does not re-run it. It tests one specific candidate (the squared signal) in the model.

Requirement flags expected before the run: R1 to R4 false (a model identity raises no flag by itself).

Decisive first test, run first: target a (F = T^3 + 2, trace a = 1), (N, lam) = (2, 7): S_cop = (705888, 4235328,
29647296) (equal to `ffx sc` as stored by c9), c = -pi(7) (7/2, 0, 1) at k = 0, and
S_cop(0)^2 = -D.D/(2 q^2). Equal.

## 2. First lemma: the signal as a combination of Frobenius traces

Conventions of `ffx.c`: q = 7, nu_F(A) = Legendre symbol of Res(F, A) mod 7; S_cop(k) as in `cmd_sc`:

    lam = 0:  S_cop(k) = sum_{A' squarefree, deg N} mu(A') w(A') cop_k(A'),
    lam > 0:  S_cop(k) = - sum_{A'} mu(A') w(A') (pi(lam) - #{P | A', deg P = lam}) (cop_k(A') - cop_{k-lam}(A')),

cop_k(A) = #{c monic, deg c = k, (c, A) = 1}. Curve: nu_F(P) = +1 iff P splits in y^2 = -F(T) (quadratic
reciprocity at q = 3 mod 4; the sign was checked by the point counts below). L(u, nu_F) = 1 - a u + q u^2,
t_j = alpha^j + alphabar^j, t_0 = 2.

**Lemma 1 [PROVED for F prime of fixed degree 3; EXACT check].** S_cop(k) is a polynomial of degree <= N in a
with coefficients depending only on (q, N, lam, k), hence a linear form sum_j c_j t_j. Proof: the summand depends
on A' only through its factorisation type; the sum of nu_F over squarefree A' of a given type is a polynomial in
the power sums sum_{deg P = e} nu_F(P)^m; for even m these count the primes other than F, for odd m they are
coefficients of log L(u, nu_F), polynomials in a. A polynomial of degree <= N in a = t_1 is a linear combination
of t_0..t_N (Chebyshev). QED. **This is where multiplicativity enters c**: the reduction to power sums over
primes is the Euler product of the generating function prod_P (1 - nu(P) u^deg P (1 - x^deg P)).

Checks (`run_main.py`, `main.log`, `main.json`):

| check | cases | outcome |
|---|---|---|
| L(u, nu_F) = 1 - a u + 7 u^2 for the 112 prime cubics; traces a in {-5, -3, -1, 1, 3, 5} (7, 21, 28, 28, 21, 7 curves) | 112 | holds |
| brute point count of y^2 = -F over F_7, F_49 (112 curves) and F_343 (targets a, b) against q^n + 1 - t_n | 226 | 0 mismatches |
| closed-point count from the splitting of all primes of degree <= 6 (target a), n = 1..6: N_n = 7, 63, 364, 2331, 16597, 117936 | 6 | 0 mismatches |
| S_cop(k; F) = sum_j c_j t_j(F), c fitted on N + 1 curves, N = 1, 2, 3, lam in {0, 1, 2, 3, 7, 10, 12}, k = 0..3 | 84 vectors, 112 curves each | 0 mismatches of 9408 |
| k = 0, lam = 7: c / (-pi(7)) against Chebyshev: (0, 1), (7/2, 0, 1), (0, 7, 0, 1) | 3 | equal |
| S_cop of targets a, b against `ffx sc` values stored in c9 `predictions.json` | 52 configurations | equal |

Examples of c (target-independent): (N, lam, k) = (2, 7, 0): (-411768, 0, -117648); (2, 7, 1):
(-2470608, 0, -705888); (2, 2, 0): (-287/4, 0, -41/2); (3, 7, 2): (0, -33059088, 0, -4941216);
(3, 2, 2): (0, -5474, 0, -841). All 84 are in `main.json`.

## 3. Decisive test: B_coh against -P.P

Intersection numbers on C x C from the point counts N_n = q^n + 1 - t_n (twin-ladder note, item 2):
Gamma_j.Gamma_k = q^min(j,k) N_|j-k| (j != k), Gamma_j.Gamma_j = q^j (2 - 2g), G_jk = -P_j.P_k =
q^j + q^k - Gamma_j.Gamma_k. Unnormalised classes are used to stay in Q (the normalised B(c) has q^(-j/2));
D = sum_i x_i P_i with x_(N+j) = c_j, x_(N-j) = q^j c_j (x_N = 2 c_0) is the class q^(N/2) B(c~) for the symmetric
vector c~_(N+-j) = q^(j/2) c_j.

| statement | cases | outcome |
|---|---|---|
| S_cop(k; F)^2 = -D_k.D_k/(2 q^N), per curve | 84 x 112 = 9408 | equal in all |
| sum over the 112 curves of S_cop^2 = sum of -D.D/(2 q^N) | 84 | equal in all |
| B_coh (law of round 8, exact rational) = sum_k kappa_k (-D_k.D_k), kappa_k = wt_k^2 q^(2d)/(2 q^N \|\|c_k\|\|^2 q^(N+lam) diagsum); targets a, b; all q = 7 configurations of the c9 plan (N = 2, 3; lam = 7..13; d = 1, 2, 3) | 52 | equal in all; values equal to c9 (e.g. (2, 7, 2) a: 0.999992; (2, 10, 2) a: 4.701760; (2, 12, 2) a: 24.499788; (3, 12, 2) a: 2.694111) |

Family mean of M_N^2/q^N over the 112 curves: 1 (N = 1, exactly: 784/784), 1.2245 (N = 2), 1.5948 (N = 3); the
SU(2) value is 1. B_coh is a pointwise function of the Frobenius class of the target, not a family average; the
mean-value cap is not the reason it fails as an input.

## 4. Why the equality holds, and what it does not carry

**Proposition 2 [PROVED; inputs CLASSICAL: End(E) with Rosati involution, deg as the norm form, -P_phi.P_phi =
2 deg phi for the primitive class of the graph of phi; not opened in a source].** On an elliptic curve
F^j + V^j = [t_j]. Hence sum_j c_j (F^(N+j) + q^j F^(N-j)) = F^N sum_j c_j (F^j + V^j) = [m] F^N with
m = sum_j c_j t_j = S_cop(k), and -D.D = 2 deg([m] F^N) = 2 m^2 q^N.
Algebraic form, valid for any pair (beta, q/beta): with x(z) = z^N f(z), f(z) = sum_j c_j (z^j + (q/z)^j),
-D.D = 2 x(alpha) x(q/alpha) = 2 q^N f(alpha)^2. QED.

Consequences.
- (a) For one curve the statement "S^2 is a Hodge norm" is empty: every real s is deg of multiplication by s.
  The content of section 3 is only that c does not depend on the curve (Lemma 1).
- (b) The sign of -D.D on these classes does not use the index theorem: f(alpha) is real for every root pair of
  a real quadratic 1 - a u + q u^2, on or off the circle. Control 1 below.
- (c) General genus [PROVED, elementary]: for a signal that is linear in the traces, l(c) = sum_m phi_m,
  phi_m = f(alpha_m) (m = 1..g), and -D.D = 2 q^N sum_m phi_m^2, so

      l(c)^2 = (g/2)(-D.D)/q^N - sum_{m<n} (phi_m - phi_n)^2.

  The index theorem (phi_m real) gives l(c)^2 <= (g/2)(-D.D)/q^N: an **upper** bound for the squared signal.
  With -D.D <= 2 g q^N max_{|z| = sqrt q} f^2 this is the Weil bound for the Moebius sum.
- (d) The probe signal M_N = h_N(alpha_1..alpha_2g) is linear in the traces only for g = 1 or N = 1. In
  partial fractions M_N = sum_i alpha_i^(N+2g-1)/prod_{j != i}(alpha_i - alpha_j): the weights are 1/L' at the
  zeros.

So in the model: lower bound of the row energy by the squared signal = Bessel (round 8, Proposition C);
size of the signal count wt_k = sixth-power frequencies (round 7/8 law, MEASURED for r >= 6); size of the
target factor = Weil bound = index theorem used as an upper bound. The low input (E-K) fails for r > 3N because
wt_k^2 grows, and the index theorem for the target limits the excess from above; it does not produce it.

## 5. Controls

`run_controls.py`, `controls.log`, `controls.json`; `run_g2.py`, `g2.log`. Exact arithmetic.

| control | what was run | outcome | structural step |
|---|---|---|---|
| genus-1 fakes 1 - a u + 7 u^2, a = -20..20 (for abs(a) >= 6 no curve, zeros off the line) | identity of section 3 with the 84 vectors c | 3444 of 3444 equal; -D.D >= 0 in all; the form is indefinite for abs(a) >= 6 (x = a P_0 - 2 P_1: -x.x = 8q - 2a^2 < 0). a = -6: M_N = -6, 29, -132 against Weil bounds 5.29, 21, 74.1 | **passes the identity**: Proposition 2 is algebraic. It fails only the upper bound of 4(c) |
| trivial target (w = 1) | S_cop, N = 1..3, lam in {0, 2, 7, 11}, k = 0..3 | non-zero (e.g. (2, 11, 1): 7549792992; B_coh = 4.99 at (2, 11, 2) in c9) | genus 0: NS(P^1 x P^1)_prim = 0, every -D.D = 0. **Not equal.** The signal sits on the span of the fibre classes H, V, where the form has signature (1, 1) |
| Liouville-twisted vector (w = mu) | same | full counts, e.g. (2, 7, k): -4941216, -29647296, -207531072 | no curve; as the trivial target. **Not equal** |
| Liouville-twisted target (w = mu nu_F) | curve-independent c over 112 curves, 27 (N, lam, k) | c exists (0 of 3024 off the line); square identity 0 failures | **passes**: still an Euler product on a genus-1 curve |
| seeded random signs on A', not multiplicative (three seeds), times nu_F | same fit | no curve-independent c: 2851, 2626, 2577 of 3024 off the fitted line | fails at Lemma 1 (no reduction to power sums over primes) |
| seeded random completely multiplicative signs on primes (three seeds), times nu_F | same fit | no curve-independent c: 2628, 2416, 2480 of 3024 | fails at Lemma 1 (Euler product present, no curve: the power sums are not Frobenius traces) |
| aligned vector w(A) = conj chi_A(m_0), m_0 prime of degree 2 (21 choices) | norm of M_N(w) in Z[zeta_6], N = 1, 2, 3 | 7, 49, 343 for every m_0 | the weight is a sextic Hecke character with L of degree 1: a rank-one piece, abs(M_N)^2 = q^N identically. **Passes** as a norm on a rank-one piece; no positivity content |
| genus 2 targets (80 seeded prime quintics) | section 0 item 5 | genus-1 equality 0 of 80; corrected identity 4(c) 80 of 80; M_2 not linear in traces | equality is an SU(2) fact |
| Davenport-Heilbronn | not run | - | the function field has no member with zeros off the line (c8); the fakes above are the available substitute |
| backward heat, unimodular twist family, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run | - | no positivity or zero statement is made |

Per single curve every real number passes (4(a)), so the per-curve comparison separates nothing; the
family-level statement (existence of c) separates multiplicative curve targets from random vectors, and does not
separate the target from its Liouville twist or from the fakes.

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | multiplicativity enters c at Lemma 1 (reduction to power sums over primes; random non-multiplicative signs have no c). That is a property of a model identity; no attack step uses it, and the identity also holds for the fakes and the Liouville-twisted target |
| R2 height-uniform, every window | false | fixed q = 7, N <= 3; no statement about zeros |
| R3 every control fails at a named step | false | genus-1 fakes with zeros off the line, the Liouville-twisted target and the aligned vector pass the identity; only vectors without a curve fail (Lemma 1), and the trivial target fails for lack of primitive classes |
| R4 reaches the critical line | false | the index theorem is not used for the sign of the squared signal; it enters as the Weil upper bound, which is the Riemann hypothesis of the target |

What R4 would need over Z [ARGUED]: (i) the squared signal as a Weil functional Q_L(test) with a test function
independent of the target. By 4(d) the Moebius-type signal carries weights 1/L'(rho) at the zeros; it is linear in
the zero sums only for SU(2), so over Z it is sum_rho x^rho/(rho zeta'(rho)), not a functional of the form
sum_rho f(rho). (ii) Even granted (i), Weil positivity bounds the signal from above (4(c)); the format needs the
low input as an upper bound on the row energy, which contains the squared signal: the input would again be the
conclusion (rows Z26, T3; c8 section 5).

## 7. Proposed map row and allocation note

Proposed row (next free Z number; not entered by this lane):

| Squared signal of the Prop. 2.1 probe as an intersection-form square (model) | For genus-1 targets over F_7, S_cop(k) = sum_j c_j t_j with c independent of the curve, and S_cop^2 = -D.D/(2 q^N), D = sum_j c_j (P_(N+j) + q^j P_(N-j)); B_coh = sum_k kappa_k (-D_k.D_k). The equality is deg[m] = m^2 (F^j + V^j is an integer): it holds for genus-1 fakes with zeros off the line and uses no index theorem. In genus 2 it fails; l^2 = (g/2)(-D.D)/q^N - sum (phi_m - phi_n)^2, and M_N is not linear in the traces for N >= 2. The index theorem enters as the Weil upper bound for the signal. h > 1 comes from the sixth-power count of the probe rows. | EXACT (q = 7, N <= 3, 112 curves; 80 curves of genus 2); PROVED (Proposition 2, 4(c)); unrefereed | genus-1 fakes, Liouville-twisted target, aligned vector pass; trivial target and w = mu have no primitive class | `c10-ff-signal-intersection-square` |

Round 11: no allocation to "name the number-field input as an intersection form for the squared signal". The
state of the vertex is unchanged: model vertex with h > 1, low input equal to the conclusion.

## 8. Three weakest steps

1. **Lemma 1 beyond the cases run.** Proved for prime conductor of degree 3 by a symmetric-function argument
   and checked at q = 7, N <= 3, seven values of lam, k <= 3. Other conductor types (composite F, even degree
   as for c4 at q = 13, where L has the factor 1 - u) change the even power sums and were not run.
2. **B_coh is the measured law of round 8, not the squared probe value.** The identification
   abs(J_k) = wt_k q^d abs(S_cop(k)) is exact at r = 0, tested for 1 <= r <= 5 and extrapolated (starred) for
   r >= 6. This lane did not recompute J_k; items 2 and 4 of the verdict apply to the law. The attribution of
   h > 1 to wt_k rests on it.
3. **Classical inputs not opened and the genus-2 scope.** F^j + V^j = [t_j], deg as the Rosati norm and
   -P_phi.P_phi = 2 deg phi are used from memory; the exact checks (9408 + 3444 cases) cover the consequence,
   not the sources. In genus 2 only M_1 and M_2 (lam = 0, k = 0) were computed, not S_cop with marks, and the
   statement about Sym^N H^1 and the 1/L' weights is the partial-fraction identity, not run beyond 2 M_2 =
   t_1^2 + t_2. The statement about Z in section 6 is ARGUED.

Files: `sq.py` (library), `run_main.py`, `main.log`, `main.json`, `run_controls.py`, `controls.log`,
`controls.json`, `run_g2.py`, `g2.log`.
