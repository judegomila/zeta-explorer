# Independent referee report on c15-edge-argument-strip-width-hecke-amplified (lens: general)

Date: 2026-11-19. Written by a separate agent that did not write RESULT.md. The same-agent second pass that
RESULT.md section 8 refers to is kept unchanged at the end of this file (Appendix).
Scope: RESULT.md only. No file other than this one was written in the lane. Referee scripts were run from a
scratch directory through `scripts/memcap.sh 8` with `.venv-arb/bin/python` (local; server not used; all arrays
below 1 MB). Labels: CONFIRMED (re-derived here), CONFIRMED-NUM (rerun with own code, different case),
NOT CONFIRMED, ERROR.

## Verdict

**Holds, with corrections.** The claimed verdict (precise obstruction; no new statement about zeros of zeta) is
supported. Every step labelled PROVED was re-derived and is correct. Four items below need correction in
RESULT.md (one gap in the proof of the headline claim, closed here; one circular sentence; one wrong formula in
an ARGUED paragraph; one scope statement). None changes the verdict. Nothing assumes RH, nothing restates
verified height, and no known theorem is presented as new (Maass-Selberg, the Iwaniec covering bound, the
Sarnak-type width and absolute convergence are all attributed).

Requirement flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## Re-derivation of the PROVED steps

1. Lemma 1, relation (1). CONFIRMED. Maass-Selberg for constant term `A y^s + B y^(1-s)`, `s = sigma + it`:
   `(abs(A)^2 T^(2 sigma-1) - abs(B)^2 T^(1-2 sigma))/(2 sigma-1) + Im(A conj(B) T^(2it))/t`. With `A = 0`,
   `2 sigma - 1 = -delta`: `abs(B)^2 T^delta/delta`. `xi(rho-1) = xi(2-rho)` and `phi(1-rho/2) = xi(1-rho)/xi(2-rho) = 0`
   check. Measure `dx dy/y^2`, no volume factor.
2. Relation (2). CONFIRMED for `T_1, T_2 >= 1`: the difference of the truncations is the incomplete series of
   `c_0 1_(min < y <= max)`; unfolding pairs it with the constant term of `Lambda^(min) f`, which is zero above
   `min`. The argument does not extend to heights below 1 (RESULT.md does not use it there).
3. Identity (I). CONFIRMED. `int_(-1/2)^(1/2) abs(sum a_n cos(2 pi n x))^2 dx = (1/2) sum abs(a_n)^2`, so the
   strip `y > 1` gives `16 * (1/2) * sum abs(tau)^2 int_1^inf abs(K_nu(2 pi n y))^2 dy/y = L`; the rest of `F` is `S`.
4. Lemma 2, relation (3). CONFIRMED. For `g` outside the stabiliser `Im(gz) <= 1/y`, so for `y > 1/T` only the
   identity coset is subtracted; constant-term energy on `1/T < y <= T` is `abs(B)^2 (T^delta - T^(-delta))/delta`;
   the covering count `1 + 10/Y` at `Y = 1/T` is the cited lemma (recalled, not opened here either). The
   normalised form follows with `T = 8 pi X/gamma`; its constant is ARGUED, as stated.
5. Proposition A (a), relation (4). CONFIRMED. `m^(-1/2) d (a/d)^(s') = (a/d)^(mu0)` and
   `sum_(ad=m) (a/d)^(mu0) = tau_nu(m)`. The commutation of `T_m` with `psi -> E(z | psi)` is a bijection of
   cosets and holds pointwise for a cut-off `psi` (finite sums). CONFIRMED-NUM, see N1.
6. Proposition A (b), (c). CONFIRMED. For `T >= N` every height `T d/a >= T/N >= 1`, so (2) applies and (5)
   follows; the profile form is `int_0^min y^(delta-1) dy`. On `y <= T/N` every indicator is 1, which gives (c).
   Remark: by self-adjointness and commutativity of the `T_m`, `K` is real symmetric (seen in `spectral.log`:
   imaginary part 6e-16); RESULT.md calls it Hermitian, which is correct but weaker.
7. Proposition A (d), relation (6). CONFIRMED as written, for the lower bound taken on the strip `y > 1`.
   See correction C1: the device needs the strip `y > 1/T'` with `T'` of order `gamma`, which (d) does not treat.
8. Proposition A (e). The coefficient `c(t)` and `<Lambda^T f, 1>` agree with the two-parameter Maass-Selberg
   relation (terms carrying `phi(s')` drop). CONFIRMED as a formula. The sentences after it (ratio at most
   `N^(delta/2)`, size of the cross term for `T < N`) are ARGUED, as labelled.
9. Proposition C. CONFIRMED under its stated hypothesis `l <= C_0`.
   `abs(zeta(1+delta+i gamma)) >= zeta(2+2 delta)/zeta(1+delta) >= c delta`; Stirling factor
   `e^(pi gamma/2) abs(pi^(-s/2) Gamma(s/2))^2 = 2 (gamma/2 pi)^delta (1 + O(1/gamma))` (N3); `delta gamma^delta`
   is increasing in `delta` and equals `e^(C_1) (log log gamma + C_1)` at the stated threshold. The sharp
   threshold is `(log log gamma - log log log gamma + C)/log gamma`; the stated one is sufficient.
10. Section 3 arithmetic. `c/log gamma <= C delta log^4 gamma` gives `delta >= c/log^5 gamma`. ARGUED, as
    labelled; consistent with the cited `(log t)^(-3)` bound for `zeta(1+it)` combined with `zeta' << log^2 t`.

## Corrections required

C1 (gap in the headline claim; closed here). The claim "for `T >= N` the amplified inequality is implied by the
unamplified one" is proved in (d) only for the lower bound on the strip `y > 1`, i.e. against (I). The device
of section 3 does not use (I); it uses Lemma 2 at `T` of order `gamma` (S3, S4 at `X = gamma^2`). The amplified
form of Lemma 2 is not written in RESULT.md. It is as follows. For `T >= N` the profile of `A_x psi` is supported
in `y > T/N =: T_0 >= 1`, so for `y > 1/T_0` only the identity coset enters and the strip `y > 1/T_0` covers `F`
at most `1 + 10 T_0` times. With `NC(T_0) = 8 sum abs(tau_nu(n))^2 J(2 pi n/T_0)` and `R = x*Kx/abs(lambda_x)^2`:

    amplified:    NC(T_0) <= (abs(B)^2/delta) [ 10 T_0 T^delta R + T_0^(-delta) ],
    unamplified:  NC(T_0) <= (abs(B)^2/delta) [ 10 T_0 T_0^delta + T_0^(-delta) ]      (Lemma 2 at height T_0),

and `T^delta R >= T_0^delta` by (c). So the amplified Lemma 2 is implied by the unamplified one at height `T/N`.
With this addition the headline claim holds for both lower bounds that the device uses. RESULT.md should add it.

C2 (circular sentence, section 4 "Answer to the test"). "With `delta <= c_1/log gamma` (the range where the
device says anything, Proposition C) and `N <= gamma^k`, `N^delta <= e^(c_1 k)`: constants only." Proposition C
bounds the range for the unamplified inequality. If an amplifier lowered the right side by a factor `G`, the
condition of Proposition C would become `delta gamma^delta >= C G`, and for `G = N^delta` with `N >= gamma` it
gives no cap. The closure therefore rests on Proposition A (d) plus C1 (no gain at all for `T >= N`), not on
the size of `N^delta` inside the range of Proposition C. The second sentence of that paragraph (exact
cancellation by (6)) is the valid argument; the first should be removed or restated.

C3 (ERROR, ARGUED paragraph S4, no effect on PROVED items). "For the completely multiplicative parameters
`alpha_p = i p^(-delta/2)` one has `tau(p) = 0`." False for `delta > 0`:
`i p^(-delta/2) + (i p^(-delta/2))^(-1) = -i (p^(delta/2) - p^(-delta/2))`, of size `delta log p`. `tau(p) = 0`
needs the unimodular parameter `alpha_p = i`. The qualitative remark (Hecke relations alone give no flat lower
bound of size `1/log X`) is unaffected in the range `delta log X << 1`.

C4 (scope of "kills the device"). For `T < N` nothing is proved. The gain bound `N^delta` is argued and has one
valid measured case (zero 1, `N = 8`, `T = 1`, `delta = 1/2`: 2.728 against 2.828), and in that case the gain at
`T = 1` exceeds the gain at `T >= N` (2.710). The one formal row at small `delta` that exists
(`spectral.log`, `delta = 0.03`: 1.06460 against `N^delta` = 1.06437) is above `N^delta`; RESULT.md correctly
excludes it as not describing a function, but there is then no evidence at small `delta`. What limits the
`T < N` case is a different fact, which RESULT.md should state: with clean Fourier modes (identity coset only)
on a strip `y > 1/T'`, one needs `T/N >= T'`, and S4 needs `T'` of order `gamma`; so the device as specified
forces `T >= N gamma > N`. An amplifier with `T < N` requires the Fourier modes of truncations at heights below
1 (not computed). The verdict line should read: closed for `T >= N` (proved, with C1); `T < N` is outside the
device as specified and is open, not closed.

## Numerical reruns (own code, different cases)

N1. Relation (4) on the incomplete part, by direct summation over cosets `(c, d)`, at zero 7
    (`gamma = 40.9187`), `delta = 0.5, 0.2`, `m = 4, 6, 12`, `T = 0.37, 1.3, 2.9` (so `T < m` and heights below 1
    are included), 18 random points `z`: largest relative defect of
    `m^(-1/2) sum_(ad=m, b mod d) E((az+b)/d | psi_T) - sum_(ad=m) (a/d)^(mu0) E(z | psi_(T d/a))` is 1.9e-14.
N2. Maximal gain `lambda* K^(-1) lambda` (30 digits) and, separately, the gain of the extremal vector by
    piecewise integration of the step profile (agreement to all printed digits):

    | zero | delta | N | max gain | N^delta | ratio |
    |---|---|---|---|---|---|
    | 7 | 0.2 | 16 | 1.71683 | 1.74110 | 0.9861 |
    | 7 | 0.2 | 48 | 2.14947 | 2.16894 | 0.9910 |
    | 9 | 0.05 | 40 | 1.19929 | 1.20255 | 0.9973 |
    | 2 | 0.9 | 20 | 13.7583 | 14.8227 | 0.9282 |
    | 12 | 0.01 | 60 | 1.041357 | 1.041793 | 0.99958 |

    Never above 1. The range "0.957 to 0.999" of RESULT.md is the range of its own 30 cases (confirmed from
    `checks.json`: 0.95670 to 0.99900), not a general lower bound: the case `delta = 0.9` gives 0.928.
N3. Identity (I) at zero 6 (`gamma = 37.5862`, not in RESULT.md), own quadrature (40 x 40 Gauss-Legendre for `S`,
    `mp.quad` for `J`, 18 digits): `M = 7.829262`, `L = 7.171107`, `S = 0.658155`, `abs(L + S - M)/M = 5.3e-9`
    (quadrature-limited). Stirling factor of Proposition C: ratio to `2 (gamma/2 pi)^delta` is
    `1 - 2.4e-8, 1 - 4e-14, 1 - 5e-10` at `gamma = 1e3, 1e6, 1e12`.
N4. Reported figures: `checks.json` maximal identity defect 3.85e-11 (claimed below 4e-11); 30 gain cases;
    `M_hyp/L` from 1.128 to 6.709 over 15 cases (claimed 1.11 to 6.7; the lower end rounds to 1.13). Consistent.

## Controls

RESULT.md claims no zeta-only mechanism, so there is no mechanism whose failure on controls must be shown.
What was run here: the lower bound of Proposition C, `abs(F(1+delta+it)) >= zeta(2+2 delta)/zeta(1+delta)`, on
zeta, `L(s, chi_4)` and the Liouville series `zeta(2s)/zeta(s)` (sign twist with an Euler product), 307 heights
each, `delta = 0.5, 0.1, 0.02`: smallest ratio 1.18, 1.57, 1.30 at `delta = 0.5`; 2.68, 3.77, 3.35 at 0.1; 10.6,
15.1, 13.9 at 0.02. The bound holds for all three, as the proof (any Euler product with local parameters of
modulus at most 1) says. This confirms the statement that the cap of Proposition C is not specific to zeta.
N1 confirms that (4) is a property of the coset sum for any exponent `s'` and reads no arithmetic of `B`.
The EIS-w, BLS, T-NR and E_a lines of section 6 are arguments on paper; the Phillips-Sarnak input is recalled
there and was not opened here. DH, backward heat, theta^w, the phase-rotated transfer operator and Beurling are
not formulable at S0 and were not run by either side.

## Requirement flags (strict)

| requirement | flag | reason |
|---|---|---|
| R1 | false | No step is shown to need multiplicativity. (1), (2), (4), (5), (c), (6) hold for any scattering zero; the amplifier is proved to add nothing for `T >= N`; S4 uses prime-indexed coefficients and smoothness of `p^(i gamma)` and is ARGUED |
| R2 | false | Output is a width `c/log^5 gamma` (ARGUED) and a cap `(log log gamma + C)/log gamma` (PROVED under `l <= C_0`): both depend on height |
| R3 | false | EIS-w and BLS pass the amplified-norm part verbatim; T-NR and E_a pass; five controls not formulable; Proposition C holds for sign-twisted Euler products (run here) |
| R4 | false | The inequality lives at distance `o(1)` from `Re s = 1`; nothing reaches the critical line |

## Surviving claim

No new statement about zeros of zeta. At a zero `rho = 1 - delta + i gamma`:
`norm(Lambda^T E*(., rho/2))^2 = abs(xi(2 - rho))^2 T^delta/delta` for `T >= 1`, and `M(1) = L + S` (PROVED from
Maass-Selberg; measured at zeros 1 to 6). On the truncated series `T_m` is the combination (4) of truncations at
dilated heights (PROVED; checked to 2e-14). For `T >= N` the amplified norm is `M(T) x*Kx`, the gain is at most
`N^delta`, and the amplified inequality is implied by the unamplified one, both against (I) (RESULT.md) and
against Lemma 2 (C1 above). With a lower-bound input bounded in `gamma`, the unamplified inequality (hence the
amplified one for `T >= N`) follows from absolute convergence for `delta >= (log log gamma + C)/log gamma`
(PROVED; holds for every Euler product with local parameters of modulus at most 1). Width `c/log^5 gamma`:
ARGUED, weaker than classical. Open and not closed by this lane: amplifiers with `T < N`.

---

# Appendix: same-agent second pass (text of the earlier REFEREE.md; only its top heading is demoted one level)

## Second pass on c15-edge-argument-strip-width-hecke-amplified

Status: written by the same agent that wrote RESULT.md, with separate code (`ref_checks.py`) and a line-by-line
reread. It is NOT an independent referee: this session has no tool to start another agent. The lane line in
`campaign/lanes.jsonl` records `referees: 0` and the debt. An independent referee should re-derive (2), (4), (5)
and Proposition C.

## What was re-derived

1. Relation (2), `<Lambda^(T_1) f, Lambda^(T_2) f> = M(min)`: holds; the difference of the two truncations is
   `c_0(y)` on `min < y <= max`, and `Lambda^(min) f` has zero constant term there.
2. Relation (4): `T_m (y^(s') 1_(y>T)) = sum_(ad=m) (a/d)^(mu0) y^(s') 1_(y > T d/a)` from
   `m^(-1/2) d (a/d)^(s') = (a/d)^(s' - 1/2)`; the sum of the coefficients is `lambda(m)`. Holds. The commutation of
   `T_m` with `psi -> E(z | psi)` is recalled, not re-proved.
3. Proposition A (c): the profile equals `lambda_x y^(s')` on `y <= T/N` because `d/a >= 1/N` for `ad <= N`.
   Holds. `ref_checks.json` R2: norm by piecewise integration of the step profile (not by formula (5)), 18 cases
   (zeros 1, 3, 5; `delta` = 0.5, 0.1, 0.03; `N` = 8, 24), 40 amplifiers each: the minimum of
   `(x*Kx/abs(lambda_x)^2) N^delta` is 1.0212, never below 1. The trivial amplifier `x = e_1` gives `N^delta > 1`,
   as it must.
4. Proposition A (d): for `y > 1` only the identity coset contributes to `E(z | A_x psi)` when the profile is
   supported in `y > T/N >= 1` (`Im(gz) <= 1/y < 1` for the other cosets). Holds. Inequality (6) follows.
5. Lemma 2: `ref_checks.json` R1 with `mp.quad`: zeros 1 to 3, `T = 1, 2, 4`: strip total over `M(T)` =
   0.68, 2.85, 4.60 / 0.82, 2.60, 4.66 / 0.74, 2.62, 4.75; bounds 11, 21, 41. The `T = 1` values reproduce
   `L/M` of `checks.json` P1 to five digits by a different quadrature.
6. Proposition C: `ref_checks.json` R3 (70 digits; the first run at 20 digits lost all digits at `gamma = 1e32`
   and was discarded). Lower bound `m` on the normalised `M'` from absolute convergence:

   | gamma | delta = 1/log gamma | delta = log log gamma / log gamma | delta = 0.1 |
   |---|---|---|---|
   | 1e2 | 1.16 | 1.91 | 0.52 |
   | 1e4 | 0.94 | 3.97 | 0.83 |
   | 1e8 | 0.61 | 7.39 | 2.08 |
   | 1e16 | 0.35 | 12.0 | 13.1 |
   | 1e32 | 0.19 | 17.3 | 523 |

   At `delta = log log gamma / log gamma` the bound grows with `gamma`; at `delta = 1/log gamma` it decays. This
   matches the threshold of Proposition C.

## Errors found in the first draft and corrected in RESULT.md

E1. The first draft reported the rows `delta = 0.1, 0.03` of `spectral.json` as a check of the gain at `T = 1`
    "within quadrature error". Wrong: formula (e) holds only at a zero (`phi(s') = 0`); at a hypothetical `delta`
    it describes no function, and its mass misses `1/delta` by 6e-3 and 2.5e-3 although the grid integrates the
    Lorentzians to 1e-11 (diagnostic run). Only the row `delta = 0.5` is a check. RESULT.md now says so. Effect:
    the statement "gain at most `N^delta` for `T < N`" has one measured case, not three.
E2. A first version of S4 used a harmonic-weight lower bound from the convolution identity
    `1 = (mu a^(2 nu)) * (n^nu tau_nu)`. It was dropped before writing: the weights that the Bessel integral gives
    are flat, the low range `n <= gamma` cannot be converted, and the harmonic bound is trivial (the term `n = 1`).

## Points an independent referee should attack

- The covering constant `1 + 10 T` and the claim that `Lambda^T f` keeps the non-constant modes of `f` for
  `y > 1/T` (Lemma 2).
- The size of the cross term of (e) for `T < N` and whether an amplifier with `N` much larger than `T` gains more
  than `N^delta` on the lower-bound side (not computed).
- Section 3: the sieve step and the exponent 5; Sarnak's paper was not opened.
- Proposition C: the hypothesis `l <= C_0`.
- The EIS-w line: the statement that resonances approach the unitary axis at bounded height is recalled.

## Verdict of this pass

The PROVED items (Lemma 1, Lemma 2, Proposition A (a)-(d), Proposition C) survive the reread and the separate
numerics. One reporting error (E1) was corrected. The verdict "precise obstruction, score 0" stands. Holds: yes,
as a same-agent pass only.
