# REFEREE (adversarial, lens: general) for c5-device-table-extension/RESULT.md

Date 2026-11-18. Claimed verdict: precise-obstruction, seven devices CLOSED, no CANDIDATE, flags all false.
Referee verdict: **holds** as a set of closures. No statement about zeros of zeta is made, RH is not assumed anywhere, no verified-height statement is used, and the known theorems are labelled CLASSICAL. Six corrections to the wording are listed in section 4; none changes a closure or a flag.

Runs: local, single process, `scripts/memcap.sh 8`, mpmath 1.3.0 (python of `pick/venv`), scripts kept outside the repo (`/tmp/c5ref`). The server was not used.

## 1. PROVED steps re-derived

| Step | Result |
|---|---|
| (e) twin: L(s, chi_-4) vanishes at -1, -3, ...; L(s, chi_5) (even) vanishes at 0, -2, ...; so C_c(-k) = zeta(-k) for all k >= 0 and all c | Confirmed (parity of the characters). c = -zeta(s0)/H(s0) gives C_c(s0) = 0 when H(s0) != 0. |
| (g) strip identity | Confirmed by hand. Poisson kernel of the side x = b: (1/2b) sin(pi x/b)/(cosh(pi d/b) + cos(pi x/b)); its x-derivative at x = 0 is (pi/(4 b^2)) sech^2(pi d/(2b)). Normal derivative of the Green function at x = 0 is 2 pi times the Poisson kernel of the side x = 0, which is K(x, d). With u = h - sum G(., z_k) + sum G(., p_j), u = 0 on x = 0 and u_x = theta_y, the stated signs follow. |
| (g) -theta' = 2 alpha (Xi'^2 - Xi Xi'')/(Xi^2 + alpha^2 Xi'^2) | Confirmed (L(iy) = -i Xi'/Xi, theta = 2 arctan(alpha Xi'/Xi)). |
| (g) u < 0 on Re s >= 1 for zeta | Confirmed: abs S < 1 iff Re L > 0, and Re xi'/xi = sum Re 1/(s - rho) > 0 for Re s >= 1. |
| (g) pole position -alpha + sqrt(alpha^2 + x_0^2), height 2/x_pole | Confirmed from the two-term model L = 2x/(x^2 - x_0^2) and K(x, 0) ~ 2/x. |
| (g) model fraction 1/(b alpha lam^2) | Confirmed: -log abs S ~ 2/(alpha lam), integral of the sech^2 kernel is 4b/pi, mean of -theta' is 2 lam. |
| (a) window mean square of a fixed Euler stage | Confirmed given the two classical inputs: gap >= (log n)^(-C) for S-units, and sum over S-units of n^(-2 sigma) (log n)^C converges for sigma > 0. The trivial gap 1/n gives the same only for sigma > 1/2. |
| (b) bilinear form with (mn)^(it) on a rectangle is rank one | Trivial, confirmed. |
| (c) N + D = 2F, D - N = 2 alpha F'; equal-spacing zero position arctanh(1/(alpha lam))/lam = 0.0755 at T = 10^4 | Confirmed. |
| (f) finite Turan bound applied as D(s_0 - nu delta) | Substitution confirmed; the theorem itself is CLASSICAL and matches the standard statement. |

## 2. Numerics rerun with different cases

**Twin (e), independent implementation (Hurwitz-zeta form of the two L-functions instead of `mpmath.dirichlet`).**
- The four quoted zeros of zeta + L(s, chi_-4) L(s, chi_5) reproduce: Newton from the quoted values moves less than 6e-11, residual below 1.1e-29. In particular 0.86409960179 + 29.95041276875i.
- New prescribed points: s0 = 0.6 + 40i (c = -0.4111674434 + 0.9968107476i), 0.95 + 300.5i (c = -0.9097058102 + 0.4369630891i), 0.55 + 7i (c = -0.1241615384 + 1.578528535i): abs C_c(s0) = 0 at 30 digits, abs zeta(s0) = 1.20, 1.36, 1.09, abs C_c'(s0) = 1.31, 0.61, 3.93 (simple zeros), max over k <= 15 of abs(C_c(-k) - zeta(-k)) below 3.3e-18 (rounding of the Hurwitz form; exact vanishing is the parity statement).
- Dirichlet coefficients 1 + (chi_-4 * chi_5)(n), n < 4000, summed at s = 3 + 2i agree with the closed form to 2.2e-8 (tail size).

**Strip identity (g), lane's routine with new parameters; theta' cross-checked by a finite difference of arg S (agreement 1e-11 or better).**

| Function | alpha | b | y | -theta' | T_b | zero sum | pole sum | residual | winding = zeros - poles |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 0.3 | 1/2 | 40.2 | 1.013415731 | 0.932453372 | 0.080962358 | 0 | 2.4e-17 | 4 = 4 - 0 |
| zeta | 0.3 | 1/2 | 43.1 | 3.892647055 | 2.017752343 | 1.874894712 | 0 | 7.4e-17 | |
| DH | 0.3 | 1 | 85.2 | 1.005241906 | 1.335082125 | 0.401853444 | 0.731693664 | 5.4e-10 | 8 = 9 - 1 |
| DH | 0.3 | 1 | 85.72 | -11.635066356 | 1.642933283 | 1.135951065 | 14.413950705 | 4.9e-10 | |
| DH (second off-line zero, 0.6508 + 114.163i) | 0.2 | 3/4 | 113.8 | 2.111263299 | 1.570325527 | 1.148399755 | 0.607461982 | 1.7e-11 | 7 = 8 - 1 |
| DH | 0.2 | 3/4 | 114.16 | -33.787218421 | 1.747014091 | 2.628987454 | 38.163219966 | 2.0e-11 | |

Poles of S for DH: (0.13647, 85.72456) at alpha = 0.3 (two-term prediction 0.1303) and (0.05104, 114.16772) at alpha = 0.2 (prediction 0.0505; 2/x_pole = 39.2 against pole sum 38.2). The control result stands at a second off-line zero and a second alpha: the identity holds for DH, the Laguerre expression is negative there, and the pole sum is the term that makes it so.

Numerical caveat found: with alpha = 0.3, b = 3/4 near 85.7 the residual was 2e-4 and 1e-3 although the winding count matched (5 = 6 - 1). Cause: a zero of S at (0.75837, 85.91703), 0.008 outside the edge x = b, makes log abs S(b + iy') nearly singular and the trapezoid rule with step 1/50 inaccurate. Moving the edge to b = 1 gives the 5e-10 rows above. The lane's own windows are not affected, but the "residual as completeness check" in weakest step 3 is valid only when no zero or pole of S lies within a few quadrature steps of the edge.

**Prime-side fraction T_b/(2 lam) (g, Q2), alpha = 1, b = 1/2, own quadrature (step 1/40, half-width 8b), heights not used by the lane.**

| T | fraction | model |
|---|---|---|
| 300 | 0.461 | 0.535 |
| 3000 | 0.264 | 0.210 |
| 3000.7 | 0.202 | 0.210 |
| 30000 | 0.104 | 0.111 |
| 30001.3 | 0.095 | 0.111 |
| 300000 | 0.075 | 0.069 |

Consistent with the lane's 0.74, 0.32, 0.11, 0.10: the fraction falls with T and follows 1/(b alpha lam^2) within about 30 percent. Max of log abs S on the edge was negative in every window (-0.30 to -0.54). Two heights 0.7 apart differ by 25 percent, so "0.11 to 0.10 from 10^4 to 10^5" in the lane's table is scatter, as the lane says. The 1/log^2 T rate is ARGUED, with six plus eight single-height points in support; it is not a fitted law.

## 3. Controls where a zeta-only mechanism is claimed

No device is claimed to be zeta-only. The lane's claim is the opposite (each device is passed by a control, or is the classical theorem). The two control claims that carry weight were rerun: the interpolation twin (section 2, new points) and the strip identity for DH (section 2, second zero, second alpha). Both confirmed.

Strengthening not stated in the lane: the twin also passes every twisted version of device (e). For any Dirichlet character chi, chi chi_-4 and chi chi_5 have opposite parity, an odd L-function vanishes at -1, -3, ..., and an even one (principal with modulus > 1 included, by its Euler factor at 0) vanishes at 0, -2, .... So L(s, chi) + c L(s, chi chi_-4) L(s, chi chi_5) has the values of L(s, chi) at all non-positive integers. The control therefore covers all branches omega^i and all layers of the cyclotomic tower, not only the branch of zeta.

## 4. Errors and overstatements

1. **(f), row text: "Turan's equivalence ... holds for every Euler product", "the equivalence holds for TW+-, THIN".** Not established here and not what the cited theorem states. Turan's theorem is for zeta; its proof uses continuation of finite order in the strip and the zero count per unit height. A sign twist TW+- need not continue past Re s = 1, and then "zero-free strip" has no meaning. The claim is correct at most for Euler products with finite-order continuation to the strip (THIN, by its construction). The lane lists this as weakest step 1. The closure of (f) does not depend on it (finite form: coefficient-blind; limit form: restates the target for zeta). Row text and the controls table cell should read "for zeta (CLASSICAL, not re-read); extension to other Euler products not checked".
2. **(a), row text: "the constant is doubly exponential in the stage length".** This is the size of the constant that Baker-Matveev proves, not a measured or proved property of the frequencies. The lane's own data follow the pigeonhole exponent k - 1 (min gap about U^(-3) for 4 primes), which would give a constant of size exp(O(k log k)). The statement should be "the provable constant". The closure does not depend on it (no finite stage carries the functional equation).
3. **(g) Q1/summary: "u < 0 on x = b unconditionally" and "T_b > 0"** are proved for zeta only. For DH (zeros with Re s > 1 exist) negativity on the edge is measured in the windows used, not a property of the function. The text says "measured" in the tables; the row text "T_b > 0" should be scoped to zeta.
4. **(b): "This is the reason every Vaughan-type split is closed".** Exact rank one holds on a rectangle; Vaughan bilinear forms carry the cut mn <= x. The statement is ARGUED, not PROVED, for those forms. The label PROVED applies only to the rectangle identity.
5. **(c): label "PROVED (hypothesis audit)"** is an audit of literature statements cited from memory, and "the only prime-side Carleson statement" is an unproved universal. The label should be CLASSICAL / ARGUED. (d) item (3) ("the same squeeze proves RH in function fields") is a loose description of Deligne's argument in families; it is context, not a step.
6. **Bookkeeping.** "Seven map rows written": the rows exist as row text in RESULT.md only; `OBSTRUCTION_MAP.md` and `campaign/MAP_PENDING.md` contain no entry for this lane. The Verdict says "four classes" and tabulates five. The summary's "a zero at any prescribed point" needs the condition H(s0) != 0 (stated in the body), and for c != 1 the coefficients are complex; the twin has no functional equation and no Euler product, so it is a control of DH type for value-reading devices and says nothing about devices that use the functional equation (Hamburger uniqueness, as the lane notes).

## 5. Checks requested

- RH assumed anywhere: no. "S bounded analytic iff RH" and "poles of S in Re z > 0 iff RH fails" are used as stated equivalences from the refereed lane `g-spinor-square-root`; not re-derived here.
- Verified height restated: no.
- Known theorem presented as new: no. The strip identity is called the Poisson-Jensen formula of the strip; (b) is called Vinogradov-Korobov; the twin is elementary (parity of trivial zeros) and is presented as a control, not a theorem about zeta.
- Not checked: the cited constants of Turan's theorem, Matveev's constant, the Balazard-Saias-Yor identity and Fejer's bound were compared with memory only (they agree in form); the rows P25, P40, G13, S1, Q21 and `c4-thin-twist-control-78` were taken as stated.

## 6. Requirement flags (referee's own setting)

- **R1 false.** No device here uses multiplicativity in a step that yields anything beyond a classical theorem ((b), (d)); the others use none.
- **R2 false.** Height-uniform statements are for a fixed finite stage (a), the classical region (b), or an identity (g) whose prime-side term is a decaying fraction of the phase derivative (confirmed at six further heights).
- **R3 false.** (a), (f-finite) are coefficient-blind; (e) is passed by the twin (confirmed, and extended to all twists); (g) holds for DH (confirmed at two off-line zeros); (d) is passed by unimodular twists.
- **R4 false.** Nothing reaches the critical line.

**holds = true** for the verdict "precise obstruction, seven closures, no CANDIDATE", with the six wording corrections of section 4 to be applied before the row texts are copied into the map.
