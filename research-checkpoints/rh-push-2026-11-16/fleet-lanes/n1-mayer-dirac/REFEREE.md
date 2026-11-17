# REFEREE: n1-mayer-dirac (adversarial, general)

Date: 2026-11-17. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.
All referee runs: local, serial, through `scripts/memcap.sh 8`, python3.14 + mpmath 1.4.1, no ssh.
Referee scripts were kept outside the repo (`/tmp/ref-n1md/r1.py`, `r2.py`); their outputs are quoted below.

## Outcome

**The verdict holds.** The kill (L1 is a generic identity with a bulk term; the boundary term of the
Eisenstein eigenfunction does not vanish; the flux functional separates the channels the wrong way)
is confirmed. Every step labelled PROVED was re-derived by hand; none failed. Four statements are
worded more strongly than what is proved (E1 to E4), and there is one wrong zero label (E5). None
changes the verdict; E1 and E2 make the obstruction stronger, not weaker.

No step assumes RH. Nothing restates verified height. Nothing classical is presented as new: S1,
the Bessel form S2, and P1 (`sum phi(n) n^(-s)`, Lewis-Zagier `psi^+`) are labelled classical in the
result. The result proves nothing about zeta zeros and says so.

## Re-derivations (all by hand, independent of the scripts)

| step | status | note |
|---|---|---|
| S2 | confirmed | `int e^(-yu) u^(nu/2) J_nu(2 sqrt(ut)) du = t^(nu/2) y^(-nu-1) e^(-t/y)` with `y = n+x`, sum over n gives `1/(e^u-1)`. Domain: see E1. |
| S3 density | confirmed | `(mz+n)^(-s) = Gamma(s)^(-1) int e^(-(mz+n)v) v^(s-1) dv`, `u = mv`; `(1-e^(-u))/(e^(u/m)-1) = sum_{k=1}^m e^(-uk/m)`; `H_nu[t^(nu/2) e^(-ct)] = u^(nu/2) c^(-nu-1) e^(-u/c)` with `c = (m+n)/m` gives `sum_{N>=2} N^(-nu-1) sum_{k=1}^{N-1} e^(-uk/N)`, which differs from `W g` by the `k = N` terms, `zeta(nu+1) e^(-u)`. The written g is the density of `psi(x+1)`, not of `psi^+(x+1)` (the `psi^+` terms add a point mass at 0 and a `zeta(nu+1)/2` term); they agree at a zero. |
| S4 | confirmed | index sets `c >= 2, e > c, c not| e` against `c >= 1, e > c`; difference `zeta(s) zeta(s, x+2)`; total `zeta(s)/2`. Rerun: see below. |
| S5 | confirmed for Re b > 0 | the remainder `sum (n+x)^(-2b-1)` needs Re b > 0. For the control roots with Re b < 0 more Taylor terms must be subtracted; the leading term is unchanged. Not stated in the result. |
| L1 | confirmed | `u d/du J_nu(x) = (nu/2) J_nu - sqrt(ut) J_(nu+1)`, `u d/du J_(nu+1)(x) = sqrt(ut) J_nu - ((nu+1)/2) J_(nu+1)`; `d/du [u^(1/2)(...)]` gives coefficients `(1/2 + Re nu)` and `-(1/2 + Re nu)`. |
| R2 | confirmed | `x(|J_nu|^2 + |J_(nu+1)|^2) -> (2/pi) cosh(pi Im nu)` at infinity; at Re nu = -1/2 the limit at 0 is `2/|Gamma(1/2 + i tau)|^2`, the same number. |
| R3 | confirmed | coefficients `(Re nu + 2c)` and `-(Re nu + 1 - 2c)`. |
| A1 | confirmed | `Phi_1 = W g ~ c_0 u^(nu/2)`. |
| A2 | confirmed at leading order | Mellin transform of `sum_m m^(-nu-1) sum_{k<=m} e^(-uk/m)` has the term `Gamma(w) zeta(w) zeta(nu+1-w)`, residue at `w = nu` gives `Gamma(nu) zeta(nu) u^(-nu)`, so `Phi_1 ~ (zeta(nu)/nu) u^(-nu/2)`. Cross-check: the multiplier `H_nu[t^(s-1)] = u^(-s) Gamma(nu/2+s)/Gamma(nu/2+1-s)` (re-derived from the Weber-Schafheitlin integral) at `s = nu/2` maps `c_0 t^(nu/2-1)` to the same term. The size of the remainder is not proved (the result says "in outline"); the 10-digit agreement in `t2d.log` supports it. |
| P1 | confirmed | `psi^+(1) = sum_{N>=2}(N-1)N^(-s) + zeta(s) = zeta(s-1)`. |
| P2 | confirmed | `zeta(rho-1) != 0` because zeros with negative real part are real. Restatement, as labelled. |
| P3 | confirmed with E3 | test vector `h = 2 psi^+(.+1)/zeta(2b)`; exponent arithmetic: `(1-2 sigma_0)/2 - (3/2 - 2 sigma_0) = sigma_0 - 1 < 0` for `0 < sigma_0 < 1/2`, and `-1` for `sigma_0 <= 0`. |

## Reruns with different cases

**L1 and R3 on a different g** (`r1.py`, dps 30). `g = t^(0.2-0.4i) e^(-1.7t) + (0.5+0.3i) t^(1+0.6i) e^(-(0.8+0.3i)t)`
(two terms, complex decay rate), interval [0.05, 9], closed forms cross-checked against direct
quadrature of `H_(nu+1)[sqrt(t) g]` (difference 2.9e-17):

| nu | boundary B | Re(kappa) N | source S | defect | R3 defect (c = 0.4) |
|---|---|---|---|---|---|
| -0.5 + 6.3i | -575356.411814 | 0.0 | -575356.411814 | 1.0e-25 | 0.0 |
| -0.35 + 4.2i | -767.949885129 | 298.376936396 | -1066.32682152 | -4.0e-28 | -2.0e-28 |
| 0.4 - 2.5i | -2.29400895961 | 18.3896076177 | -20.6836165773 | 0.0 | 3.2e-30 |
| -0.9 + 1.1i | -29.961010483 | -15.945970092 | -14.015040391 | -1.6e-30 | -1.6e-30 |

L1 holds for a function that is not an eigenfunction of anything; at Re kappa = 0 the boundary term
is nonzero and equals the source. This confirms R1 and the first item of the verdict.

**S4, P1, P3 at new points and N = 44, dps 55** (`r2.py`):

| b | abs(collocation value at 0 - 2 zeta(2b-1)/zeta(2b)) | sup abs((1-L) psi^+ - zeta(2b)/2) on nodes | abs(h(0)) | sup over nodes abs(h) |
|---|---|---|---|---|
| 0.35 + 11i | 5.9e-22 | 6.8e-23 | 4.9987 | 4.9981 |
| 0.28 + 16.5i | 2.7e-16 | 4.0e-19 | 55.1689 | 55.1638 |
| 0.6 - 4i | 6.6e-30 | 4.9e-30 | 2.23762 | 2.2372 |

In all three cases `sup |h|` on [0,1] is attained at x = 0 to 3 to 4 digits, so on these points the
P3 bound is close to the actual value of `||1||/||h||` for this test vector, not a loose bound.

**Shifted-weight roots at higher N** (`r2.py`; the result used N = 28 and lists this as uncertified):

| a | root (N = 36 and N = 44, identical to 10 digits) | shift from the N = 28 value | abs(f(0))/sup abs(f) |
|---|---|---|---|
| 0.7 | -0.6474897156 + 4.0339180117i | 1.0e-11 to 1.7e-11 | 0.637 |
| 0.7 | 0.2090045777 + 8.4776740104i | 6.0e-11 | 1.000 |
| 0.3 | 0.4574161733 + 10.0793151157i | 2.9e-11 | 0.416 |

The control roots are stable in N. They remain MEASURED (double-precision determinants), which is
what the result says.

**Not completed.** A third check (`r3.py`: the first-order relation `u Phi_1' = (nu/2) Phi_1 - sqrt(u) Phi_2'`
on the Eisenstein eigenfunction at rho_1, rho_2, with `Phi_1 = W g` explicit and `Phi_2'` by quadrature) did
not finish inside the 20-minute limit and was stopped with no output. L1 on the eigenfunction
therefore remains unverified numerically, as the result itself states (weak step 2); see E1.

## Controls

The result claims no zeta-only mechanism: L1 holds for every g (confirmed above on an arbitrary g),
so Davenport-Heilbronn, backward heat and the sign twist cannot fail it and there is nothing to run
them against. No transfer operator of this type is attached to any of the three; the result says
this and does not claim otherwise. The control that does live in the operator class (shifted Bose
weight) was rerun above and stands. The only zeta-specific statement is the identity P1; it is an
identity with classical content and yields no inequality, and for a = 0.7 the same matrix element
has poles on both sides of Re b = 1/4 (roots confirmed above). G_5 was not run by the result and
not by this referee; by R1 it could not change the outcome for L1.

## Errors and overstatements

**E1 (domain of S2 and L1 on the eigenfunction; partly disclosed as weak step 2, but understated).**
S2 says "Re nu > -1 directly". For the Eisenstein eigenfunction `g ~ c_0 u^(nu/2 - 1)` at 0, so:

- the Laplace integral `int e^(-xu) u^(nu/2) g du` has integrand `~ u^(nu-1)` and converges only for Re nu > 0, i.e. Re rho > 1: for no zero;
- `Phi_1 = H_nu g` converges only for Re nu > 0: for no zero (the result avoids this by using `Phi_1 = W g`);
- `Phi_1' = H_nu[sqrt(t) g]` and `Phi_2 = H_(nu+1) g` have integrands `~ t^(nu - 1/2)` at 0 and converge only for Re nu > -1/2, i.e. Re rho > 1/2. On the critical line the integrand is `t^(-1 + i gamma)`: not convergent, not even conditionally;
- only `Phi_2' = H_(nu+1)[sqrt(t) g]` converges for every zero in the strip.

So for every zero on the critical line (all known zeros) three of the four transforms in L1, and the
Laplace representation itself, exist only as finite parts. L1 "for every g for which the four
transforms exist" does not cover the one function the lane is about. The PROVED label on L1 is
correct for the class stated; its application to the eigenfunction is not PROVED. This does not
rescue the target: the part of the boundary term used for the kill is `u^(1/2)|W g|^2`, which is
explicit and needs no transform.

**E2 (A3 at the lower end).** `Phi_2 = O(u^((nu+1)/2))` as u -> 0 requires the moment
`int t^((nu+1)/2) g dt` to converge, i.e. Re rho > 1/2. On the critical line the competing
homogeneous term `u^(-nu/2)` has the same modulus `u^(1/4)`, so the stated order is right but the
statement is not a consequence of the argument given. The lower bound for B in section 3 subtracts
"(Phi_2 at eps)" without a proved size for it on the line. The result already labels A3 ARGUED and
says the non-vanishing does not depend on it; that is correct for the upper end (R -> inf at fixed
eps), which is all the kill needs.

**E3 (P3 function space).** "Any Banach space of functions on [0,1] containing constants" is too
wide. For Re b <= 1/2 the sum defining `L_b` diverges on C[0,1]; the continuation through
`zeta(2b+j, x+1)` needs Taylor coefficients at 0, so the space must consist of functions
holomorphic on a disc containing [0,1] (the usual `A(D)`, `D = {|x-1| < 3/2}`), and must contain
`psi^+(.+1)`. With the sup norm on D the argument goes through unchanged (`0 in D`).

**E4 (wording of "never zero").** The summary says the boundary term is "never zero". What is
proved is that the upper-end contribution is at least `|zeta(rho-1)/(rho-1)|^2 R^(3/2 - Re rho)(1+o(1))`,
so `B(eps, R)` is unbounded as R -> inf at fixed eps for every zero in the strip. `B(eps, R) = 0`
at isolated pairs (eps, R) is not excluded and is irrelevant.

**E5 (label).** Section 5 says the dip at Im b = 36 lies next to "rho_20/2 = 36.03". It is
`rho_18/2 = 0.25 + 36.0336i`; `rho_20/2 = 0.25 + 38.5724i`. `rho_9/2 = 24.0026` is correct.

**Minor.** A2 is labelled "PROVED in outline"; the leading term is proved, the remainder
`O(exp(-2 sqrt(2 pi u)))` is asserted. It should read ARGUED + MEASURED. The N-coefficients
-0.128, -0.288, -0.500 and the sentence "N = +|c_0|^2 log(1/eps) - |coef| R + O(1)" rest on A3 and
are ARGUED, as the result says in section 8 but not where the numbers appear.

## What survives

1. L1 is a generic first-order identity for the pair `(H_nu g, H_(nu+1) g)`; it holds for every
   admissible g with a bulk term, and the factor `Re(rho) - 1/2` comes from the choice of weight
   `u^(1/2)` (R3). No arithmetic enters. Confirmed, with an independent g.
2. For the Eisenstein eigenfunction, `u^(1/2)|Phi_1|^2` tends to `|zeta(rho-1)/Gamma(rho)|^2 u^(Re rho - 1/2)`
   at 0 and to `|zeta(rho-1)/(rho-1)|^2 u^(3/2 - Re rho)` at infinity; the coefficient is the flux
   functional `f(0) = zeta(rho-1) != 0`. The form N is not finite on the critical line. Confirmed
   (leading terms by hand; numerics in `t2d.log`).
3. `(1 - L_b) psi^+(.+1) = zeta(2b)/2` and the matrix element `2 zeta(2b-1)/zeta(2b)`. Confirmed by
   hand and at three new points. Classical content; restates RH; no bound follows.
4. The resolvent of `1 - L_b` in the sup norm on the disc is unbounded in height on every line
   Re b < 1/2, unconditionally. Confirmed (with the space corrected as in E3).

The lane is closed. Nothing in it should be reattempted in the Laplace/Hankel picture: the
boundary term is the cusp flux and is nonzero exactly on the channel that carries the zeros.
