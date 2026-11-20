# REFEREE: h-tnr-geometric (adversarial pass, 2026-11-16)

Verdict: the three PROVED propositions are correct as mathematical statements. The claimed verdict
"precise obstruction" stands with the corrections below. Four wording/dictionary items overstate
what is proved; none breaks a proof step. Independent numerics (mpmath, own scripts in /tmp/ref_htnr,
not the lane's code) reproduce the DH and Pick figures.

## Re-derivations

**Prop 1. Confirmed.** `M[V_q f] = q^{1/2-s} M[f]`, `M[Jf](s) = M[f](1-s)`, `J V_q J = V_q^{-1}`,
unitarity on `L^2(x^{-1/2}dx)` all check by substitution. Tate side: `int 1_{q^k Z_q}|x|^s d*x =
q^{-ks}/(1-q^{-s})`, `FT 1_{q^k Z_q} = q^{-k} 1_{q^{-k}Z_q}`, so `Phi_q` is self-dual and gives
`(q^{1/2-s} + c + q^{s-1/2})/(1-q^{-s})`. Own check: Mellin ratio at `s = 3.2+1.7i`, `q=3`, `c=2.2`
is `1 - 9e-27 i`.

**Prop 2. Confirmed**, (i)-(iii). Zeros of `2cosh(w)+c`: `w = +-arccosh(|c|/2) + i pi(2k+1)` (c>2),
on the axis iff `|c| <= 2`. `delta_0 = arccosh(1.1)/log 3 = 0.403753`. Count 10 in `0.3 < Im z < 60` correct.

**Prop 3. Confirmed.** With `W = antidiag(conj eps, eps)` (root number), FE-invariant vectors have
`|alpha| = |beta| != 0`; `U_p = diag(chi(p), conj chi(p))` has such a vector as eigenvector iff
`chi(p)` is real, i.e. `p = +-1 mod 5`; `U_5 = 0` on E.

**DH numerics, own run.** `a = w chi + conj(w) conj(chi)` with `w = (1 - i kappa_0)/2` exact;
completed-function FE ratio `1 - 4e-27 i` at `s = 0.3+2i`; zeros of `f` at
`0.808517182457 + 85.699348485378 i` and `0.650830080610 + 114.163342730757 i` (`|f| < 1e-25`);
`max_n |a(pn) - a(p)a(n)| = 1.0807` at `p = 2,3,7,13` and `0` at `p = 5,11,19`.

**Pick pivots, own run** (200 digits, 12 linear nodes `0.55 + 0.35k`): zeta none; NRt none;
NR negative at orders 4, 5, 10, 12; EA at 7, 8; the symbol alone (`L_D`, c=2.2) at 4, 5, 10, 11.
Matches the lane (first negative order NR 4, EA 7).

## Errors and overstatements

**E1. "Hecke operator" is the GL(1)/Tate one, not the modular one; the lane does not say so.**
The completed zeta is the Mellin transform of the weight-1/2 theta, where the modular Hecke algebra
consists of `T_{p^2}` only. Classical (Shimura) `T_{p^2}` on weight 1/2:
`b(n) = a(p^2 n) + (n/p) p^{-1} a(n) + p^{-1} a(n/p^2)`, and `T_{p^2} theta = (1 + 1/p) theta`: a
constant eigenvalue with no `s`-dependence. Also `U_{p^2} theta = theta`, so the lane's
`V_q^{-1} psi = q^{-1/2} psi(x/q^2)` (super-ladder) is NOT `U_{q^2}`; it leaves level 4. The lane's
scaling `x -> q^2 x` is the correct index (it is classical `V_{q^2}`), so nothing is computed wrongly,
but `T_q = V_q + V_q^{-1}` is not the modular `T_{q^2}`. It is translation by the idele `q_q` in the
spherical Hecke algebra `C[Z]` of `GL_1(Q_q)` acting on Schwartz-Bruhat test functions. In that
setting every operator in the algebra acts on the character `|.|^s` by a scalar, and Prop 1 says only
"changing the local test vector multiplies Tate's integral by a Laurent polynomial in `q^{-s}`"
(Tate's thesis, classical). Prop 1 is an identity, but its content is this classical fact.
RESULT.md should state the distinction from `T_{p^2}` explicitly.

**E2. M2 / section-5 row "simultaneous `U_p` eigen-object" is wrong for NR and EA as written.**
Prop 3 defines `U_p a(n) = a(pn)`. NR is not a `U_3`-eigen sequence: `a(3) = 4.8105`,
`a(9)/a(3) = 1.6236`, `a(27)/a(9) = 1`. EA (`n^{-a} sigma_{2a}(n)`) is not `U_p`-eigen at any `p`
(it is `T_p`-eigen for GL(2)). `hecke.py` tests only `a(pn) = a(p)a(n)` for `p` not dividing `n`,
i.e. multiplicativity. So M2 must read "multiplicative coefficients / Euler product"; under the
literal `U_p` definition "each control fails exactly one item" is false (NR fails M2 and M4, EA
fails M2 and M3). Relatedly, the lane brief's phrase "NR is Hecke-eigen with a non-tempered
eigenvalue" is not what is proved: the underlying automorphic object of NR is the trivial character
(tempered; the lane's own M3 cell is P). What is proved: NR is the image of psi under a Hecke-algebra
element whose symbol vanishes at the non-tempered characters `|.|^{1/2 +- delta_0 + i t_k}`.

**E3. "Positive, invertible on H" is not a statement about psi.** `psi(x) ~ x^{-1/2}/2` at 0, so
`int |psi|^2 x^{-1/2} dx` diverges: psi is not in `H`. The no-go (iii) does not need it (it only
needs the zero set), but "positive invertible operator" contributes nothing beyond "symbol has no
zero on the line".

**E4. "Zeta functional equation" holds for the field, not for the Dirichlet series.**
`xi*(s)(2cosh+c) = q^{s-1/2} pi^{-s/2} Gamma(s/2) D(s)`, `D(s) = zeta(s)(1 + c q^{1/2-s} + q^{1-2s})`.
`D` has conductor `q^2`. That is the reason Hamburger does not exclude NR. Section 6's "in degree 1
with zeta's gamma factor M1-M4 leaves zeta (Hamburger)" needs conductor 1 added; M1-M4 as listed
admit every primitive even Dirichlet L-function.

**E5. Threshold in Prop 2(iii).** For the open half-plane `Re s > sigma_0` the inequality must be
strict: `|c| > q^{sigma_0-1/2} + q^{1/2-sigma_0}`. At equality the new zeros sit on `Re s = sigma_0`.

**E6. Analogy labelled as equivalence.** "Kesten spectrum" for a 2-regular line is Fourier analysis
on Z; the Hasse reading is the same discriminant inequality `c^2 <= 4` written for a polynomial that
is not a Frobenius polynomial of anything. Section 4(b): the GL(2) Eisenstein eigenvalue
`p^{s-1/2} + p^{1/2-s}` equals the symbol of `T_p` on the ladder, verified numerically, but no
intertwining map between the torus `T_p` and the ladder `V_p` is written down. These are consistent
formulas, not a proved dictionary.

**E7. `hecke.py` uses `W = [[0,1],[1,0]]` without the root number.** With that `W`, the DH vector
`(w, conj w)` is not `W`-invariant (w is not real). The proof in the text is right; the numerical
"W" check only tests `W U W^{-1} = U^*`, which is trivial for a swap.

**E8. M4 sharp form is circular.** "Hecke polynomial has all roots on the unit circle after the
weight shift" is the statement that the added zeros are on the line. NRt fails the non-sharp M4 and
has no new off-line zero, so non-sharp M4 is not necessary. Irredundancy is relative to five
functions (the lane states this).

## DH failure step

Correct and confirmed numerically: DH fails multiplicativity / `U_p`-eigen at `p = +-2 mod 5` and
passes at `p = 5` and `p = +-1 mod 5`. No zero-location argument is proposed, so there is no proof
step to fail. Note this is the statement "DH is a sum of two distinct eigenforms swapped by the FE";
it is classical.

## Surviving claim

For any real `c`, `xi*(s)(2cosh((s-1/2)log q)+c)` is Tate's zeta integral with the self-dual local
test vector `q^{1/2}1_{qZ_q} + c 1_{Z_q} + q^{-1/2}1_{q^{-1}Z_q}` (GL(1) Hecke-algebra image of the
standard vector; not a modular `T_{q^2}` statement). It keeps multiplicative coefficients, the gamma
factor, the field-level functional equation (Dirichlet-series conductor `q^2`) and kernel
positivity, and has zeros at `Re s = 1/2 +- arccosh(|c|/2)/log q`, on the line iff `|c| <= 2`. So no
hypothesis set invariant under such test-vector changes with `|c| > 2` implies RH. DH is FE-invariant
in the chi/chi-bar plane and is `U_p`-eigen exactly at `p = 5` and `p = +-1 mod 5`. Pick first
negative orders NR 4, EA 7 reproduced. The "minimal package" is a necessary-condition list
calibrated on five functions, with M2 read as multiplicativity.
