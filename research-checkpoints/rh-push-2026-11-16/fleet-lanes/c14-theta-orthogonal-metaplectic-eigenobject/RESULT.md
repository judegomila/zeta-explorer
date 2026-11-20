# c14-theta-orthogonal-metaplectic-eigenobject: the weight-1/2 Eisenstein series at a zero, with theta-orthogonality in place of cuspidality

Date 2026-11-19. Round 14, explore (device design; target R4). Stage A (paper) plus numeric checks of the lemmas (local, `scripts/memcap.sh 8`, 40 s in total, peak memory under 300 MB). Stage B was not run. The compute server was not contacted. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED (argument written here) / CLASSICAL / ARGUED / RECALLED (source not opened) / MEASURED / OPEN.

**Verdict: precise obstruction. The device is closed at the decisive first test. One pivot (any rank-one eigen-object, any cover; and a local-vector control), closed by Lemma E and Lemma V.**

Answer to the decisive test, in three lines.

1. Theta-orthogonality (vanishing of the row D = 1) is one linear condition, `b(1) = 0`, propagated to the whole row by the Hecke relation at squares (Lemma 2). It removes every polar term of the first-moment (Shimura) series `sum_n b(n^2) n^(-w)`, which is identically zero. It removes no polar term of the second-moment series `sum_m |b(m)|^2 |m|^(-w)`: its four poles are at `w = 1/2 + beta, 3/2 - beta, 1 +- i gamma`, with residues that do not contain `zeta(rho)` (Lemma 3).
2. The rightmost pole is at `P = 1 + |beta - 1/2|`; the gamma-factor pole is at `beta_0 = |beta - 1/2|`. `P - beta_0 = 1` for every beta. The Luo-Rudnick-Sarnak (LRS) count returns `beta_0 <= w*(1 + beta_0, d)`, true for every `beta_0 >= 0` and `d >= 2`: no inequality on beta, not even `beta <= 1`.
3. No step of the count reads the orthogonality. The generic parameter (row D = 1 not zero) passes every step with the same output. Per the stage-A rule the lane stops at the passing control.

Row for the map: `MAP_ROW.md`. Record line: `lanes_line.json` (appended to `campaign/lanes.jsonl`). Proposed engine entries: `engine_device_proposal.json`.

Files: `checks.py/.log/.json` (8 s, mpmath 30 digits and FFT), `checks2.py/.log/.json` (30 s, float64, measurements), `ref_check.py/.log/.json` (2 s, second pass, different code path). All run as `scripts/memcap.sh 8 .venv-arb/bin/python -I <file> <absolute output path>`.

---

## 0. Plan, and the three questions before work

Read: BRIEF.md to the end; `c13-lrs-twist-amplification-zero-representation` (RESULT, REFEREE, map row G35); `res-point-spectrum-square` Theorem Z; `res-order-two-nonpoisson` section 3 (M1, M2); `ap-squares-rallis` section 8; `h-metaplectic-spin` (rows G14, G18); `c13-kacmoody-eisenstein-affine-weyl-shift` (control BLS); map section 2 (controls, EIS-w, BLS, Lemma P) and rows G12, G31, G32, G35; STRATEGY.md sections 0 to 2. Not opened: Shimura 1973, Goldfeld-Hoffstein 1985, Zagier 1981, Luo-Rudnick-Sarnak 1995. The coefficient formula is derived from the definition here (Lemma 1), not recalled.

New against the map. Row G35 closes the LRS count for Borel Eisenstein data of GL_n and lists as not covered "non-Borel objects, metaplectic objects". Theorem Z(b) of `res-point-spectrum-square` records, as RECALLED, that the weight-1/2 object at `s_rho = 1/4 + rho/2` has parameter on the unitary axis iff beta = 1/2. No lane had run a device on that object. Its difference from the object of G35: there the non-tempered parameter is `(1 - beta)/2` (tempered iff beta = 1); here it is `beta - 1/2` (tempered iff beta = 1/2), so an LRS bound `beta_0 <= theta` would have been a statement `|beta - 1/2| <= theta`.

- Q1 (controls): section 5. The generic parameter passes every step of the count; a local-vector control passes the orthogonality step at every parameter.
- Q2 (height-uniform, every window): the object exists for each zero separately and every step is uniform in gamma. The output is vacuous, so nothing is claimed.
- Q3 (multiplicativity): the Hecke relation at `p^2` for every odd p turns `b(1) = 0` into the vanishing of the row (Lemma 2). It is an identity valid for every parameter. It acts at `s_rho`, inside the strip, by continuation of an identity; no inequality uses it.
- R4: the object is defined at the zero with no limit step. No inequality on beta results.

Sanity bound fixed before work. Zeros with beta = 1/2 exist and for them `beta_0 = 0`, so no bound is excluded in advance (unlike G35, where `theta < 1/4` was excluded). Two readings of the target: on the weight-0 side (Shimura image, parameter `nu = rho - 1/2`, gamma pole at `2 |Re nu|`) the published GL_2 exponent would read `|beta - 1/2| <= 3/10`, a non-trivial strip; on the weight-1/2 side the gamma pole is at `|beta - 1/2| <= 1/2` and the threshold with P = 1, d = 4 is 3/5, so even a pole at P = 1 would give nothing there. A non-trivial output therefore needed both P = 1 and a transfer of the orthogonality to the weight-0 image. That image is the Eisenstein series `E(z, rho)` at a parameter where nothing vanishes, an object of row G35's class (`P - beta_0 = 1`).

## 1. The object

Group `Gamma_0(4)`, theta multiplier `j(g, z) = theta(gz)/theta(z) = eps_d^(-1) (c/d) (cz + d)^(1/2)`, `eps_d = 1` or `i` for `d = 1` or `3 mod 4`. For Re s > 1,

    E(z, s) = sum over Gamma_inf \ Gamma_0(4) of j(g, z)^(-1) Im(gz)^(s - 1/4),        F(z, s) = y^(1/4) E(z, s),

so `|F|` is invariant and `F ~ y^s` at the cusp infinity. Poisson summation in the lower-left entry gives (CLASSICAL computation; every constant checked in section 2)

    F(z, s) = y^s + c_inf(s) A(0, s) y^(1-s) + sum_{m != 0} A(m, s) y^(1-s) Omega_s(m y) e(m x),
    A(m, s) = sum_{c > 0, 4 | c} K(m, c) c^(-2s),      K(m, c) = sum_{d mod c, (d, c) = 1, d > 0} eps_d (c/d) e(m d / c),
    c_inf(s) = int (t + i)^(-1/2) (t^2 + 1)^(1/4 - s) dt = 2 pi e^(-i pi/4) 2^(1-2s) Gamma(2s - 1) / (Gamma(s + 1/4) Gamma(s - 1/4)).

`Omega_s(my) = int (t + i)^(-1/2) (t^2 + 1)^(1/4 - s) e(-m y t) dt` depends on m and y through `m y` only. Normalised coefficients: `b(m) = A(m, s) |m|^(s - 1)`, so that `F = (constant term) + sum b(m) W_m(|m| y) e(mx)` with `W` depending on sign(m) only. Throughout `u = 2s - 1/2`; `s_rho = 1/4 + rho/2` is `u = rho`.

Check of `c_inf`: quadrature against the Gamma formula at s = 1.3 and s = 0.9 + 1.5i agrees to all 17 printed digits (`checks.json` key E).

## 2. First lemma: coefficient formula, constant term, Hecke relation

**Lemma 1 (factorisation; PROVED, with the finite sums checked numerically).** Write `c = 2^a c'`, c' odd, a >= 2. Then

    K(m, c) = (2/c')^a eps_{c'} h_m(c') U_a(m, c' mod 8),

where `h_m` is multiplicative on odd integers, `h_m(p^k) = eps_{p^k}^(-1) sum*_{d mod p^k} (d/p)^k e(md/p^k)`, and `U_a(m, r) = sum over odd d mod 2^a of eps_{dr} (2/(dr))^a (-1)^((dr-1)(r-1)/4) e(md/2^a)`.

Proof. Chinese remainder theorem for d mod c; `(c/d) = (2/d)^a (d/c') (-1)^((d-1)(c'-1)/4)` for d > 0 odd (Jacobi reciprocity); the factors `eps_d`, `(2/d)^a` and the reciprocity sign depend on d mod 8 (d mod 4 when a = 2, where `(2/d)^2 = 1`); substitute `d -> d 2^a` in the odd part and `d -> d c'` in the 2-part. The Gauss sums `G_m(c') = sum* (d/c') e(md/c')` satisfy `G_m(c_1 c_2) = (-1)^((c_1-1)(c_2-1)/4) G_m(c_1) G_m(c_2)` and `eps_{c_1 c_2} = eps_{c_1} eps_{c_2} (-1)^((c_1-1)(c_2-1)/4)`, so `h_m = eps^(-1) G_m` is multiplicative. QED

Local values (CLASSICAL Gauss and Ramanujan sums), `v = v_p(m)`, `m = p^v m_0`: for k even, `h_m(p^k) = phi(p^k)` (k <= v), `-p^(k-1)` (k = v + 1), 0 (k > v + 1); for k odd, `h_m(p^k) = (m_0/p) p^(k-1/2)` (k = v + 1), 0 otherwise.

Checks. Closed form of h against the direct sum, p in {3, 5, 7, 11}, k <= 4, 18 values of m: maximal difference 2.1e-12 (`checks.json` A1). The identity of Lemma 1 against K computed from the definition by FFT, every c = 4, 8, ..., 1200 and 30 values of m of both signs (squares, non-squares, 0): maximal difference 4.8e-12 with max |K| = 385 (A2). `U_a(m, r) = 0` for `a > v_2(m) + 3`: no exception (A3).

**Lemma 1' (the row D = 1; PROVED).** For `m = n^2`, `n = 2^j n'`, n' odd:

    A(n^2, s) = W_j(s) * [zeta(u) / ((1 + 2^(-u)) zeta(2u))] * prod_{p | n'} Q_p(p^(-2s)),

with `W_j` a polynomial in `2^(-2s)` and `Q_p` polynomials. In particular `A(1, s) = (1 + i) 2^(-4s) (1 + 2^(1-u))/(1 + 2^(-u)) * zeta(u)/zeta(2u)`.

Proof. By Lemma 1, `A(m, s) = sum over the four characters psi mod 8 of W_psi(m, s) prod_{p odd} (sum_k psi(p)^k h_m(p^k) p^(-2ks))`, `W_psi = (1/4) sum_r conj(psi)(r) eps_r sum_a (2/r)^a 2^(-2as) U_a(m, r)`. (i) 2-part. `U_a(m, r)` depends on m mod `2^a` and vanishes for `a > 2j + 3`; `n'^2 = 1 mod 8`, so `U_a(n^2, r) = U_a(4^j, r)`. For `m = 4^j` the quantity `eps_r (2/r)^a U_a(m, r)` equals `(1+i) 2^(a-2)` (a even, a <= 2j + 2), `4 e^(i pi/4) 2^(a-3)` (a = 2j + 3), 0 otherwise, for each r in {1, 3, 5, 7} (direct evaluation of sums over d mod 4 and mod 8). It does not depend on r, so `W_psi = 0` for psi != 1. (ii) Odd part, psi = 1, x = p^(-2s): for p not dividing n the factor is `1 + p^(1/2) x = 1 + p^(-u)`; for `v_p(n^2) = 2e` it is `L_p(x) = sum_{j <= e} phi(p^(2j)) x^(2j) + p^(2e + 1/2) x^(2e+1)`, and `L_p(-p^(-1/2)) = 1 + sum_{j=1..e} (p^j - p^(j-1)) - p^e = 0`, so `L_p = (1 + p^(-u)) Q_p`. `prod_{p odd} (1 + p^(-u)) = zeta(u)(1 - 2^(-u)) / (zeta(2u)(1 - 2^(-2u)))`. QED

Checks. The four case values of (i) for j = 0..6, all a, all r: relative difference at most 6.1e-11, no failure (`checks2.json` H). Weights of the three non-trivial characters for m in {1, 4, 9, 16, 25, 36, 49, 64, 81, 144} at 12 complex points: exactly 0 (`checks.json` B2). Closed form of A(1), A(9), A(25) against the series truncated at c <= 1400 (second code path): differences at most 3.4e-7 with |A(1)| = 0.022 (`ref_check.json` R1; the truncation tail is of that order). Programmed closed form for 29 values of m against the truncated series at 2s = 3.6 and 3.6 + 1.4i: at most 2.4e-8 (`checks.json` B1).

General m (MEASURED, not needed below): for every m with 0 < |m| <= 2000 only the trivial character mod 8 has non-zero weight, so `A(m, s) = W(m, s) L(u, (m/.)) / zeta(2u)` times a finite Dirichlet polynomial, where `(m/.)` is the Jacobi symbol on odd integers. This is the statement recorded as RECALLED in Theorem Z(b) of `res-point-spectrum-square` and in M1 of `res-order-two-nonpoisson`.

**Constant term (PROVED by the same computation).** `U_a(0, r)` vanishes for a odd and `eps_r U_a(0, r) = (1+i) 2^(a-2)` for a even; `sum_j phi(p^(2j)) x^(2j) = (1 - p x^2)/(1 - p^2 x^2)`. Hence

    A(0, s) = (1 + i) 2^(-4s) zeta(4s - 2) / ((1 - 2^(1-4s)) zeta(4s - 1)),
    phi_inf(s) := c_inf(s) A(0, s) = pi 2^(5/2 - 6s) Gamma(2s - 1) zeta(4s - 2) / (Gamma(s + 1/4) Gamma(s - 1/4) (1 - 2^(1-4s)) zeta(4s - 1)).

Check: A(0, 1.8) closed 0.0070084053 (1 + i), series to c <= 1200: 0.0070083977 (1 + i) (`checks.json` E); second path at two complex s: 1.7e-7, 1.2e-8 (`ref_check.json`). At `s_rho`: `phi_inf = (elementary) zeta(2 rho - 1)/zeta(2 rho)`; modulus 0.697 and 0.363 at the first two zeros. Both exponents s and 1 - s are present.

**Lemma 2 (Hecke relation at squares and the Shimura rows; CLASSICAL in form (Shimura), verified numerically here).** For odd p and every m != 0,

    p b(p^2 m) + p^(-1/2) (m/p) b(m) + p^(-1) b(m/p^2) = (p^(2s-1) + p^(1-2s)) b(m).

Hence for t not divisible by `p^2`: `sum_k p^k b(t p^(2k)) X^k = b(t) (1 - (t/p) p^(-1/2) X)/(1 - lambda_p X + X^2)`, `lambda_p = p^(2s-1) + p^(1-2s)`. At `s_rho`: `lambda_p = p^(rho - 1/2) + p^(1/2 - rho)`, of modulus-one parameters iff beta = 1/2.

Checks: defect at most 1.9e-13 at the first zero and 3.4e-13 at s = 0.83 + 3.1i over p in {3, 5, 7} and 16 values of m, including m divisible by p and by p^2 (`checks.json` D; smallest right-hand side 0.028). Row recursion to k = 5: 1.2e-13 (`checks2.json` F). From the truncated series alone, p = 11 and 13: relative defect at most 1.6e-6 (`ref_check.json` R1).

**Consequence at a zero (PROVED from Lemmas 1', 2; checked).** Let `zeta(rho) = 0`, beta >= 1/2 (so `zeta(2 rho) != 0`; the case beta < 1/2 is the reflected object). Then `A(n^2, s_rho) = 0` for every n >= 1. The object is not zero: its constant term contains `y^(s_rho)` with coefficient 1.

MEASURED (`checks.json` C, 30 digits). First zero: `|A(n^2)|` at most 5.1e-31 for n^2 in {1, 4, 9, 25, 36, 49, 225} (`|zeta(rho)|` as computed: 6.2e-31, `|zeta(2 rho)|` = 1.949); other rows: `|A(m)|` = 0.722, 0.627, 1.083, 0.331, 0.416, 0.877 (m = 2, 3, 5, 6, 7, 13) and 0.563, 0.220, 0.743, 0.410, 0.485, 0.339 (m = -1, -2, -3, -4, -7, -15). Second zero: row at most 1.4e-30; other rows between 0.124 and 1.742. Zeros 3, 4, 5 (second path, 25 digits): `|A(1)|` at most 2.1e-25; `|A(5)|` = 1.247, 2.264, 0.187; `|A(-3)|` = 1.587, 0.785, 1.323. Generic parameters: `|A(1)|` = 0.561 at u = 0.5 + 15i, 0.0273 at u = 0.8 + 14.134725i.

## 3. Decisive test: the LRS exponent count with theta-orthogonality in place of cuspidality

Steps as in G35 (section 3 of the c13 lane), for `D(w) = sum_{m != 0} |b~(m)|^2 |m|^(-w)`, `b~(m) = A(m, s) |m|^(s - 1/2)` (the normalisation in which the Rankin-Selberg integral of `|F|^2` against the weight-0 Eisenstein series `E_inf(z, w)` of `Gamma_0(4)` unfolds to `D(w)` times a gamma factor).

| Step | Content | What holds for F(., s_rho) |
|---|---|---|
| T0 | the row D = 1 vanishes (orthogonality to theta: the Shimura integral of F against conj(theta) is identically zero) | `zeta(rho) = 0` and Lemma 2. One linear condition, `b(1) = 0`. |
| S1 | arithmetic structure of D(w) | no Euler product; `D(w) = sum over square classes t of |b~(t)|^2 t^(-w) (local factors from Lemma 2)`. Identity for every s. |
| S2 | untwisted function has one simple pole pair | false: four poles (Lemma 3). T0 removes none. |
| S2' | position of the rightmost pole, P = 1 | false: `P = 1 + |beta - 1/2|`. |
| S3 | twists by non-quadratic characters are entire | holds for every s (ARGUED: the polar terms come from constant terms of F twisted, which vanish at every cusp for chi^2 != 1). For quadratic chi the twist has poles. |
| S4 | positivity `|b~(m)|^2 >= 0` | holds, no arithmetic. |
| S5 | functional equation of the twists with a root number that averages to a hyper-Kloosterman sum | not available in this form (ARGUED): the twisted series at level `4 q^2` is mapped by `w -> 1 - w` to a combination of the series at all cusps through the scattering matrix. Not needed for the verdict. |
| S6, S7 | non-vanishing on average at `w > w*(P, d)`; gamma pole at `beta_0` forces vanishing | `beta_0 = |beta - 1/2|` (below). Output `beta_0 <= w*(1 + beta_0, d)`. |

**Lemma 3 (polar terms; PROVED relative to the regularised Rankin-Selberg method for functions of power growth, Zagier 1981, in its form for several cusps and weight 1/2, not opened; exponents MEASURED).** Let s = sigma + i tau with `2 sigma = 1/2 + beta`, `2 tau = gamma`.

(a) Second moment. The constant term of `|F|^2` at infinity is `y^(2 sigma) + |phi_inf|^2 y^(2 - 2 sigma) + conj(phi_inf) y^(1 + 2 i tau) + phi_inf y^(1 - 2 i tau)`. The regularised integral against `E_inf(z, w) = y^w + phi^0(w) y^(1-w) + ...` has, for each exponent alpha with coefficient c, the terms `c/(w + alpha - 1)` and `c phi^0(w)/(alpha - w)`. So D(w) has poles at `w = 1/2 + beta, 3/2 - beta, 1 +- i gamma` (and at the reflected points). The coefficients are 1, `|phi_inf(s_rho)|^2`, `phi_inf(s_rho)` and its conjugate, with `phi_inf(s_rho)` proportional to `zeta(2 rho - 1)/zeta(2 rho)`; the weight-0 factor at the rightmost pole is `phi^0(1/2 + beta)`, proportional to `xi(2 beta)/xi(1 + 2 beta)`, and contributions of the other cusps add with the same sign for real alpha > 1. None contains `zeta(rho)`. For beta = 1/2 the first two poles merge at w = 1 with the pole of `phi^0`: a double pole.

(b) First moment (Shimura integral). By Lemma 2, `sum_n b(n^2) n^(1-w)` equals `b(1)` times an Euler product over odd p of `(1 - p^(-1/2-w))/((1 - p^(2s-1-w))(1 - p^(1-2s-w)))` times a 2-factor: a quotient of zeta functions with poles at `w = 2s` and `w = 2 - 2s`. Every polar term carries `b(1)`, proportional to `zeta(2s - 1/2)/zeta(4s - 1)`. At `s_rho` the function is identically zero.

(c) Gamma factor. The Whittaker functions behave as `y^(1/2 +- (s - 1/2))` at 0 with coefficients `Gamma(-+(2s - 1))/Gamma(1/2 -+ (s - 1/2) - kappa)`, kappa = +-1/4, non-zero for tau != 0 (CLASSICAL). The integral of `|W|^2 y^(w-2)` converges for `Re w > |2 sigma - 1|` and has its rightmost pole at `beta_0 = |2 sigma - 1| = |beta - 1/2|`.

Answer to "which polar terms does theta-orthogonality remove": all of (b), none of (a). The row D = 1 is one square class among infinitely many; its share of the second moment at a generic parameter is 3.4 out of 3397 at X = 2000 (below).

MEASURED (`checks2.json` G; `S(X) = sum_{0 < |m| <= X} |b~(m)|^2`, float64, L-values by Euler-Maclaurin Hurwitz sums validated to 7e-15):

| parameter | prediction | X = 125 | 250 | 500 | 1000 | 2000 |
|---|---|---|---|---|---|---|
| first zero, sigma = 1/2 | double pole at 1: `S/(X log X)` constant | 0.2247 | 0.2169 | 0.2198 | 0.2179 | 0.2137 |
| same | (`S/X` would be constant for a cusp form) | 1.085 | 1.198 | 1.366 | 1.505 | 1.624 |
| u = 0.8 + 14.1347i, sigma = 0.65 | pole at 2 sigma = 1.3: `S/X^1.3` constant | 0.1718 | 0.1683 | 0.1739 | 0.1734 | 0.1737 |
| u = 0.3 + 14.1347i, sigma = 0.40 | pole at 2 - 2 sigma = 1.2: `S/X^1.2` constant | 0.828 | 0.846 | 0.872 | 0.891 | 0.891 |

The off-line rows are generic parameters (no zero of zeta is off the line in the computed range); they test the rule `P = 1 + |2 sigma - 1|`, which does not involve the zero.

**The count.** `P - beta_0 = (1 + |beta - 1/2|) - |beta - 1/2| = 1` for every beta. With the threshold of G35, `w*(P, d) = (A P - (P - 1))/(A + 1)`, `A = (d - 1)/2 + d(P - 1)` (ARGUED there; algebra confirmed by its referee), the output is

    (C)    |beta - 1/2| <= w*(1 + |beta - 1/2|, d),

and `P - 1 <= w*(P, d)` iff `0 <= (d - 1)/2 + (d - 2)(P - 1)`, true for all `d >= 2`, `P >= 1`. Grid check: the minimum of `w*(1 + beta_0, d) - beta_0` over d in {2, 3, 4, 6, 9, 16} and beta_0 in [0, 1/2] is 0.2 (`ref_check.json` R3). (C) holds for every beta; it does not depend on the unavailable step S5 or on the value of d.

Independent of the exponent count: for the untwisted function the gamma pole `w = beta - 1/2` (beta > 1/2) coincides with the reflected polar point `1 - (3/2 - beta)` of the subdominant exponent, whose coefficient `|phi_inf(s_rho)|^2` is not zero. The completed function has a pole there; nothing is forced on D. For twists the forced vanishing, if S3 and S5 are granted, is an identity in s (no step reads T0), as Lemma 2 of the c13 lane was (ARGUED by analogy; not derived here).

**Outcome.** The difference between the pole position and the gamma pole does not depend on beta. Theta-orthogonality does not replace cuspidality at any of the three places where the mechanism uses it (single pole, pole position, entire twists; the third holds for every Eisenstein object). Relative to G35: there the zero supplied the single pole pair and not its position; here the zero supplies neither, because it annihilates a row and not a constant-term exponent.

## 4. The second object, at the pole s = (1 + rho)/4

`E(z, s)` has poles where `zeta(4s - 1) = 0`. Let `R_rho` be the leading Laurent coefficient at `s' = (1 + rho)/4` (PROVED from section 2). Constant term: the term `y^s` has no pole and drops out; the single exponent is `1 - s'`, real part `3/4 - beta/4 > 1/2`, coefficient proportional to `zeta(rho - 1)/zeta'(rho)` (simple zero), non-zero. Coefficients: proportional to `L(rho/2, (m/.))`. `T_(p^2)` eigenvalue `p^((rho-1)/2) + p^((1-rho)/2)`: this is the Shimura image of the object `E*(z, rho/2)` of row G35 (same eigenvalues, tempered iff beta = 1; pole type of Theorem Z(a)). The Rankin-Selberg function has one pole pair, at `P = 3/2 - beta/2`; the gamma pole is at `beta_0 = 1/2 - beta/2`; `P - beta_0 = 1`. Closed by the same count; nothing new against G35. Its row D = 1 is proportional to `zeta(rho/2)`, which vanishes only if `rho/2` is a zero: no orthogonality is forced.

## 5. Controls

"Passes" means: every step that feeds the output holds, with the same output (the vacuous inequality (C)).

| Control | Object in this device | First step that differs | Verdict |
|---|---|---|---|
| generic parameter s (weight-1/2 form of EIS-w; `zeta(2s - 1/2) != 0`) | F(., s) | T0 fails: `|b(1)|` = 0.561, 0.0273 (MEASURED). No later step takes T0 as input: Lemma 3(a),(c) and (C) hold verbatim, exponents MEASURED at sigma = 0.65 and 0.40 | **passes every step of the count with the same output** |
| NR-vec (local vector at one odd prime q; new, Lemma V below) | `f_q = (F x chi_q^2 - F x chi_q)/2`, level `4 q^2`, any s | T0 holds for every s: the row D = 1 at infinity is identically zero and the object is not zero | **passes T0 at every parameter**; fails only "level 4" or "the full row including the Hecke relation at q" |
| E_a = zeta(u + a) zeta(u - a) | a zero `u_0 = rho - a` of the factor `zeta(u + a)` is carried by `F(., 1/4 + (u_0 + a)/2) = F(., s_rho)`: the same object. No object has row D = 1 equal to E_a(u) with one Hecke parameter | none: the device is covariant under the shift; "tempered iff the zero is on the line of its own factor" | passes with the same output; not a separating control here |
| WT (height translate) | F(., s_rho) relabelled | none | passes |
| T-NR, `g(u) = 2 cosh((u - 1/2) log q) + c` | (i) `g(u) F`: zero as a function at zeros of g, no object. (ii) `g(u) F(z, s) + kappa F(q^2 z, s)`: `b_f(1) = g(u) b(1)` vanishes at zeros of g, but `b_f(q^2) = g(u) b(q^2) + kappa b(1) q^(..) != 0` there | T0 holds for the single coefficient n = 1 and fails for the row at n = q: the Hecke relation at q (type X2 of Lemma P) | formulable at one coefficient; fails the row at one named step. Since T0 feeds nothing, this does not separate |
| DH | the complex characters mod 5 are odd; weight 3/2, sum of two eigenforms with nebentypus chi and conj(chi) | not an eigenfunction of `T_(p^2)`: a combination can vanish at n = 1, the row polynomials differ, so the row does not vanish | ARGUED, not constructed |
| BLS (scattering-level Blaschke) | changes `phi_inf` by a Blaschke factor; has no Fourier coefficients | T0 not formulable. The count reads only the constant-term exponents and the non-vanishing of their coefficients | passes the count |
| HEAT, TW+, TW-, U, THIN, DEL, Beurling, theta^w, phase-rotated transfer operator, interpolation twin | no automorphic object | not formulable | no handle |

**Lemma V (theta-orthogonality at a cusp is a property of the vector; PROVED relative to Shimura 1973, Lemma 3.6, for the level and multiplier of a twist; the coefficient statement is elementary).** Let q be an odd prime, chi_q the quadratic character mod q, `F x chi = g(conj chi)^(-1) sum_{j mod q} conj(chi)(j) F(z + j/q)`. Then `f_q = (F x chi_q^2 - F x chi_q)/2` has coefficients `b(m) 1[(m/q) = -1]`; it is a weight-1/2 form on `Gamma_0(4 q^2)` with the theta multiplier, an eigenfunction of `T_(p^2)` for p not dividing 2q with the eigenvalues of F, a finite combination of translates of F by unipotent elements at q (same automorphic representation of the double cover of SL_2), and all its coefficients of index `n^2` vanish, for every s. It is not zero when some `b(m)` with `(m/q) = -1` is not zero (first zero, q = 3: `|A(2)|` = 0.722, `|A(5)|` = 1.083).
Consequence: "the row D = 1 vanishes" does not characterise zeros unless the vector is fixed (level 4, unramified at every odd prime). The representation-level statement that characterises `zeta(rho) = 0` is "the global Whittaker functional for the additive character of class D = 1 vanishes on the whole representation", which equals `zeta(2s - 1/2)/zeta(4s - 1)` times non-zero local functionals.

Three-question pre-filter (Lemma P): T0 is a linear identity on one vector (class S1; passed by NR-vec and, at one coefficient, by T-NR); S4 is a square; (C) is algebra in P. No step is outside S1 to S3 except the Hecke relation at q in T0, which feeds nothing.

First passing control: the generic parameter. Stage A stops here; stage B is not opened; the device is registered as closed.

## 6. Pivot (once): any eigen-object in rank one, on any cover

Question: is there a rank-one object attached to a zero off the line (period type or pole type of Theorem Z, any weight, any metaplectic cover, any level, any vector) for which `P - beta_0 < 1`?

**Lemma E (PROVED; (iii) relative to the regularised Rankin-Selberg method as in Lemma 3).** Let Gamma be a lattice of finite covolume in SL_2(R) or a cover, and F a smooth function of weight k and any unitary multiplier, of moderate growth, with `Delta_k F = s(1 - s) F`, s = sigma + i tau.
(i) At each cusp the constant term is `a y^s + b y^(1-s)` (two-dimensional solution space; sigma != 1/2 or tau != 0).
(ii) If `tau != 0` and `sigma != 1/2`, the exponent of larger real part, `sigma_max = max(sigma, 1 - sigma) > 1/2`, has a non-zero coefficient at some cusp. Proof: otherwise F and `Delta_k F` are square-integrable, the boundary term of Green's formula at height Y is of order `Y^(1 - 2 sigma_max)` and tends to 0, so `s(1-s) ||F||^2 = <Delta_k F, F> = <F, Delta_k F> = conj(s(1-s)) ||F||^2`; but `Im s(1-s) = tau (1 - 2 sigma) != 0`.
(iii) Hence the Rankin-Selberg series of F (summed over the cusps where the dominant exponent occurs; the weight-0 scattering entries are positive at real arguments > 1, so there is no cancellation) has its rightmost pole at `P = 2 sigma_max = 1 + |2 sigma - 1|`, and its gamma factor has its rightmost pole at `beta_0 = |2 sigma - 1|`. `P - beta_0 = 1`.

Consequence. For every rank-one object whose Laplace eigenvalue is non-real exactly when the zero is off the reference line (all objects of Theorem Z: poles of intertwiners, zeros of Fourier coefficients, zeros of CM-point values, in every weight and cover, at every level, for every vector in the representation, including `f_q`), the LRS count returns (C). A linear condition on Fourier coefficients or periods cannot change this: it does not act on the constant term, and the constant term cannot lose its dominant exponent without the eigenvalue becoming real. This is the edge statement of row G12 in the form used by the count. The pivot is closed. No further pivot.

Not covered by Lemma E: rank >= 2 non-Borel or metaplectic objects (constant terms along several parabolics; no single exponent rule). Row G35 covers Borel data of GL_n at regular parameters.

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | The Hecke relation at every odd `p^2` is used (Lemma 2: one vanishing coefficient gives the row), as an identity valid for every parameter. No inequality consumes it; the output (C) is algebra. |
| R2 (height-uniform, every window) | false | Each step is uniform in gamma and the object exists for each zero; the output is vacuous. |
| R3 (every control fails at a structural step) | false | The generic parameter passes every step of the count; NR-vec passes the orthogonality step at every parameter. |
| R4 (reaches the line) | false | The object is defined at a zero with no limit step, and its temperedness is equivalent to beta = 1/2 (Lemma 2); no bound on beta follows. |

Score 0. Not a statement about zeros.

## 8. What the lane adds to the record

1. The coefficient formula and constant term of the weight-1/2 Eisenstein series on `Gamma_0(4)` at the cusp infinity, derived from the definition with the 2-factor explicit for squares (Lemmas 1, 1'), and the Hecke relation at squares with its normalisation, checked. Two earlier lanes cite these as RECALLED.
2. Theta-orthogonality at a zero is one linear condition. It annihilates the first-moment series and is invisible to the second-moment series, whose pole pattern is that of a generic two-exponent Eisenstein series. A zero can change a Rankin-Selberg pole pattern only through a constant-term coefficient (as in G35), not through a Fourier coefficient.
3. Lemma E: `P - beta_0 = 1` for every rank-one eigenfunction with non-real eigenvalue, on any cover and for any vector. The device type "LRS on a rank-one object at a zero" is closed.
4. Control NR-vec: vanishing of the square-index coefficients at one cusp holds at every parameter for a suitable vector at one prime. A device that reads theta-orthogonality must fix the level or read the Whittaker functional on the whole representation.

## 9. Three weakest steps

1. Lemma 3(a) and Lemma E(iii) rest on the regularised Rankin-Selberg method for several cusps and half-integral weight (Zagier 1981 and extensions; not opened). The pole positions were measured at three parameters (the exponent to about two digits over X <= 2000, one decade); the residues were not compared with a predicted constant. The verdict needs only that the dominant exponent has a non-zero coefficient (coefficient 1 at infinity for beta > 1/2: PROVED) and that the mean square of the coefficients grows like `X^(2 sigma_max)`.
2. The threshold `w*(P, d)` and steps S3, S5 are taken from the c13 lane's reconstruction of LRS (ARGUED there). For this object S5 is not available in the required form and the twisted series were not analysed; the statement about the forced vanishing for twists is by analogy. The verdict does not use them: (C) is true for every d >= 2, and the control passes because no step reads T0.
3. Control rows DH and T-NR are paper statements; no level-q or weight-3/2 object was computed. Lemma V relies on Shimura's twisting lemma (not opened) for the level and multiplier of `f_q`; its coefficient statement is elementary. Lemma 1' is proved for all squares; for non-square m the statement "only the trivial character mod 8 occurs" is MEASURED for |m| <= 2000 and not proved in general.
