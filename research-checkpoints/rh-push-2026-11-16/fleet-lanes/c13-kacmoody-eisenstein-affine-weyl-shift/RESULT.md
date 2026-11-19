# c13-kacmoody-eisenstein-affine-weyl-shift: Borel Eisenstein series on the loop group of SL_2 as a device for R4

Internal working note, 2026-11-19, round 13, explore lane (RS-2, R4 direct). Local numerics only, through
`scripts/memcap.sh 8` (two runs, 6.2 min and 45 s, mpmath, under 200 MB). The server was not contacted.
RH is open. No statement about zeros of zeta is made. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X (complete given the statement X of a source that was not
opened or was read only in abstract) / CLASSICAL / MEASURED / ARGUED / OPEN.

**Verdict: precise obstruction. The device stops at stage A; score 0; all four flags false.**

1. First lemma (section 2). In the Godement region every zeta argument of the constant term and of the Whittaker
   coefficients has real part > 1. In the open fundamental chamber 0 < Re z < Re c of the continued series the
   numerator arguments enter the strip (the argument z itself, and z + kc, kc - z), while every denominator
   argument, in the constant term and in every degenerate Whittaker coefficient, has real part > 1.
2. Decisive test (section 3). Positivity of a truncated norm and holomorphy plus non-vanishing both act on the
   denominators. Strip arguments occur only as zeros of coefficients. For the rank-one Levi the Maass-Selberg
   inequality is equivalent to a Nevanlinna property (Theorem B), and that property is preserved when zeros are
   inserted at arbitrary conjugate pairs of the open right half-plane (Theorem C, PROVED). So the inequality carries
   no constraint on numerator zeros.
3. Controls (section 4). T-NR with c > 2 and a scattering-level Blaschke control pass every analytic step
   (PROVED); they fail only at "the datum is a vector in a group representation". DH passes the formal test in the
   computed box and fails only through its zeros right of 1, none of which lies below height 2000.
4. Kept: at central parameter c = 1 the chamber is the critical strip, the diagram automorphism is s <-> 1 - s,
   and every non-identity constant-term coefficient is xi(z)/xi(z + n) (Lemma A3, PROVED-rel the constant-term
   formula). This is an identity; no inequality was found on it.

---

## 1. Plan and what is new

Read: BRIEF (to the end), STRATEGY sections 1 and 4.0, round-12 lessons, round-13 allocation, map section 2
(controls) and rows G26, G31, P18, Q5; `n1-maass-selberg-norm` and `n2-rank2-eisenstein-kernel` headers.
Sources for the loop group, none opened in full: Garland (convergence; Maass-Selberg relations 1 to 4),
Garland-Miller-Patnaik arXiv:1304.4913 (introduction read through a summary), Fleig-Kleinschmidt-Persson
arXiv:1312.3643 (statements of eqs. 2.8, 2.9, Proposition 1 and section 3.6 read through a summary),
Braverman-Kazhdan (not read). Everything about the loop group below is "relative to" these.

Answers required before work:
- R1 (multiplicativity): enters once, in the Gindikin-Karpelevich step: the constant-term coefficient is the
  product over all primes of the local unramified factors, giving xi(z)/xi(z+1). It is an identity, not an inequality.
- R2: the Maass-Selberg inequality holds at every height with one truncation parameter.
- R3: to be decided by the table of section 4.
- R4: the hope was that the affine Weyl group (s <-> -s composed with shifts by c) transports control from the
  right of 1 into the strip.

New relative to the map: the map has no row on Kac-Moody groups. Rows G26, G31 treat the modular surface
(resonances at rho/2, Hecke recurrence); `n2` treats a rank-2 kernel numerically. Not on file: the Nevanlinna form
of the Maass-Selberg inequality with its closure under insertion of zeros (Theorems B, C), the level-1 identity
(Lemma A3), and the argument census of the affine constant term (Lemma A1, A2).

---

## 2. First lemma: the list of zeta arguments

### 2.0 Setting (PROVED-rel Garland; FKP eqs. 2.8, 2.9)

Affine root system of SL_2: simple roots alpha_1 = alpha, alpha_0 = delta - alpha; positive real roots
alpha + k delta (k >= 0) and k delta - alpha (k >= 1), with coroots alpha^vee + kK and kK - alpha^vee (K central).
Unitary normalisation: the section is a^(nu + rho), and

    z = <nu, alpha^vee>,   c = <nu, K>   (central parameter),   <nu, alpha_0^vee> = c - z.

W is infinite dihedral: s_1: z -> -z, s_0: z -> 2c - z, both fixing c. With M(u) = xi(u)/xi(u+1),
xi(u) = pi^(-u/2) Gamma(u/2) zeta(u),

    constant term  =  sum over w in W of  c(w, nu) a^(w nu + rho),     c(w, nu) = prod over beta > 0, w beta < 0 of M(<nu, beta^vee>),
    c(w w', nu) = c(w, w' nu) c(w', nu).

Functional-equation step: the cocycle relation is consistent because M(u) M(-u) = 1, which is xi(u) = xi(1 - u).
Multiplicativity step: M is the product over p of zeta_p(u)/zeta_p(u+1) times the archimedean factor.
Regions: Godement region 1 < Re z < Re c - 1 (needs Re c > 2); open chamber C: 0 < Re z < Re c; Tits cone Re c > 0.
The element a contains exp(-r d), r > 0; for a translation t_n the exponent a^(t_n nu) is Gaussian in n of rate
r Re c, so the constant term converges absolutely for Re c > 0 away from poles (ARGUED from the growth
M(u) ~ (2 pi/u)^(1/2); sign conventions for r and d were not checked against Garland).

### 2.1 Lemma A1 (arguments of the constant term). PROVED-rel 2.0.

The inversion sets of the elements of W are the initial segments of the two chains, so every coefficient is

    c = prod_{k=0}^{n-1} M(z + k c)      or      c = prod_{k=1}^{n} M(k c - z),      n >= 1.

Numerator arguments: z + kc (k >= 0), kc - z (k >= 1). Denominator arguments: the same plus 1.
(i) Godement region: every numerator argument has Re > 1, every denominator argument Re > 2.
(ii) Open chamber C: every numerator argument has Re > 0, every denominator argument Re > 1. Numerator arguments
with real part in (1/2, 1) occur: z itself for 1/2 < Re z < 1, and for small Re c a number of the order of
1/(2 Re c) of consecutive members z + kc of a progression of heights Im z + k Im c.
(iii) On the two walls Re z = 0 and Re z = Re c one denominator argument has Re = 1.
(iv) Outside the closed chamber, E_nu is defined by a functional equation (E_nu = M(z) E_(s_1 nu) for Re z < 0)
whose factor has denominators xi(u + 1) with Re u < 0: the poles of E_nu there are the hyperplanes
+-z + kc + 1 = rho. Holomorphy of E_nu on such a hyperplane is equivalent to xi(rho) != 0 (the rank-one statement
"E(g, s) is holomorphic in 1/4 < Re s < 1/2 iff RH" with a shift by kc).
Numerical check of the cocycle against the chain products (words of length <= 6, complex z, c): 4.2e-31.

### 2.2 Lemma A2 (arguments of the Whittaker coefficients). PROVED-rel FKP section 3.6 and Proposition 1.

Generic Whittaker coefficients vanish (no element of W maps both simple roots to negative roots; FKP 3.6).
A character supported on alpha_i gives a sum over u in W with l(s_i u) > l(u) of

    c(u, nu) * a^(...) * W^{SL_2}(<u nu, alpha_i^vee>),     W^{SL_2}(v) proportional to sigma_{-v}(m) |m|^{v/2} K_{v/2}(.) / xi(v + 1).

For nu in C and l(s_i u) > l(u), the point u nu lies on the positive side of the wall alpha_i, so
Re <u nu, alpha_i^vee> > 0 and the new denominator xi(v + 1) has Re > 1. Enumeration over words of length <= 8 at
nu = (0.3 + 3i, 0.45 + i): minimum real part 0.15 > 0. FKP state that their proof is for finite-dimensional groups
and that the formula is assumed to extend to the Kac-Moody case in the region of convergence.
Multiplicativity occurs here a second time (sigma_{-v}(m) is multiplicative in m), again as an identity.

### 2.3 Lemma A3 (central parameter 1). PROVED-rel 2.0; numerical check 4.5e-31.

At c = 1 the chains telescope: prod_{k<n} M(z + k) = xi(z)/xi(z + n) and
prod_{k=1}^{n} M(k - z) = xi(1 - z)/xi(n + 1 - z) = xi(z)/xi(z - n) (second equality: functional equation). Hence

    constant term at (z, 1)  =  a^(nu + rho)  +  xi(z) * sum over n != 0 of a^(w_n nu + rho) / xi(z + n).

The chamber is 0 < Re z < 1; the diagram automorphism alpha_0 <-> alpha_1 is z <-> 1 - z. At z = rho every
non-identity coefficient vanishes (checked at the first zero: 7.6e-31), the affine form of Zagier's observation
for E*(., rho/2). For a general M_f = f(u)/f(u+1) the first chain telescopes always, the second iff f(u) = f(1 - u).

### 2.4 Answer to the first lemma

Arguments with real part in (1/2, 1) occur, but only in numerators, and only outside the Godement region.
The affine Weyl group acts on the argument by u -> +-u + 2kc. It moves the chamber, not the information: E_(w nu)
is a scalar multiple of E_nu, so a statement proved at nu and transported to w nu is the same statement times
c(w, nu). The translation by c does not carry a statement about xi at Re > 1 to a statement about xi in the strip:
it multiplies by further factors M at new points.

---

## 3. Decisive test: is there an inequality that constrains zeta at a strip argument?

### 3.1 The candidate inequality (stage A, item (i))

Rank-one Levi (alpha_1), truncation height T = e^x, phi = M, f_z(t) = e^(tz/2) + M(z) e^(-tz/2):

    (I)   K_x(z, w) = 2 [e^(x(z + wbar)/2) - M(z) conj(M(w)) e^(-x(z + wbar)/2)] / (z + wbar)
                    + 2 [conj(M(w)) e^(x(z - wbar)/2) - M(z) e^(-x(z - wbar)/2)] / (z - wbar)      is a positive kernel on Re z > 0,  x >= 0.

This is the Maass-Selberg formula for <Lambda^T E(z), Lambda^T E(w)> on the modular surface in the variable
z = 2s - 1 (CLASSICAL). Diagonal consequence: |xi(z)/xi(z+1)| <= T^(Re z) (sqrt(1 + e^2) + e), e = Re z/|Im z|
(measured maximum of the ratio at T = 1 on a 29 x 79 grid: 0.9956).
Affine form (I_aff): positivity of the Gram kernel of truncated loop Eisenstein series, a double sum over W x W of
c(w, nu) conj(c(w', mu)) times exponentials over linear forms (relative to Garland's Maass-Selberg relations, not
opened; GMP report that Garland used them to continue the series to a larger region bounded by a wall of
singularities). Its coefficients are the chain products of Lemma A1; (I) is its restriction to the Levi.

Marked steps. S0: the datum is an automorphic character and a vector in the induced representation of the adelic
group. S1 (multiplicativity): Gindikin-Karpelevich, M = product of local factors over all primes. S2 (functional
equation): M(u) M(-u) = 1, real symmetry. S3: holomorphy of the coefficients in the chamber, unitarity on the wall.
S4: the inequality (I) for every T >= 1. S5: a consequence for the numerator arguments.

### 3.2 Theorem B (Nevanlinna form). PROVED; identity check 9.6e-31.

Let phi be meromorphic with phi(zbar) = conj(phi(z)), phi(z) phi(-z) = 1, S = e^(-xz) phi, and
N(omega) = z (1 - S(z))/(1 + S(z)), omega = z^2 (well defined: z (1 - S)/(1 + S) is even by S2). Then

    K_x(z, w) = 2 f_z(x) conj(f_w(x)) [N(omega_z) - conj(N(omega_w))] / (omega_z - conj(omega_w)).

Proof: K = 4 Wronskian(f_z, conj f_w)(x)/(z^2 - wbar^2) by direct expansion, and f'/f at x equals N/2.
So (I) holds iff N is a Nevanlinna function of omega (Im N Im omega >= 0 off the real axis; classical kernel
criterion). The poles of N are the solutions of T^(z/2) xi(z+1) + T^(-z/2) xi(z) = 0; Nevanlinna forces them to
z real or Re z = 0. This is the known statement that the constant term of the Eisenstein series at height y >= 1
has its zeros on the critical line or the real axis (relative to Hejhal 1990, Lagarias-Suzuki 2006; not opened).
MEASURED: sign of Im N on 4800 + 2700 grid points of the first quadrant (heights to 122): 0 negative for
x = 0, 0.5, 1; 262 to 4521 negative for x = -0.1, -0.5, -2. The threshold T = 1 is visible, so the test has power.

What the inequality reads: xi at arguments z and z + 1 together, that is the edge Re = 1, shifted copies added.

### 3.3 Theorem C (zeros can be inserted). PROVED.

Let Theta(z) = (z - a)(z - abar)/((z + a)(z + abar)), Re a > 0. If N_S is Nevanlinna then N_(S Theta) is Nevanlinna.
Hence (I) for phi implies (I) for phi Theta, for every finite product of such factors and for locally uniform
limits of such products.

Proof. With P = (1 - S)/(1 + S): P_(S Theta) = (P + P_Theta)/(1 + P P_Theta) and
z P_Theta = kappa omega/(omega + m), kappa = 2 Re a, m = |a|^2. So

    N' = mu_omega(N),   mu_omega(N) = (N (omega + m) + kappa omega)/(omega + m + kappa N).

For Im omega = q > 0 and real N: Im mu_omega(N) = q kappa (N^2 + kappa N + m)/|omega + m + kappa N|^2 >= 0 because
kappa^2 - 4m = -4 (Im a)^2 <= 0. Also mu_omega(infinity) = (omega + m)/kappa lies in the upper half-plane, and the
pole N = -(omega + m)/kappa of mu_omega lies in the lower half-plane. So mu_omega maps the real line to a circle
in the closed upper half-plane and the upper half-plane to its interior. Random check: 0 violations in 20000;
composition formula 1.6e-31.

Consequences.
(a) Scattering-level Blaschke control BLS: phi = M Theta has S2, S3, S4 and a zero at any prescribed a with
0 < Re a < 1, Re a != 1/2. It equals f(z)/f(z+1) for f = xi(z) Gamma(z + a) Gamma(z + abar)/(Gamma(z - a) Gamma(z - abar)):
a change of the archimedean factor only; every p-adic factor is that of zeta. MEASURED in addition: 0 negative
grid points for a = 0.25 + 3i, 0.9 + 14.5i, two pairs; anti-control M/Theta (pole in the half-plane): 295 negative.
(b) T-NR. For xi(s)(q^(s-1/2) + q^(1/2-s) + c), c > 2, zeros inside the strip (b = arccosh(c/2)/log q < 1/2):
M_T(z) = T(z)/T(z+1) is analytic and bounded in Re z > 0, unimodular on the axis, positive on the positive real
axis, with zeros at 1/2 +- b + i(2k+1)pi/log q (non-real conjugate pairs); it is the Blaschke product of its
zeros (CLASSICAL factorisation), so Theorem C applies: T-NR passes S2, S3, S4. MEASURED: q = 2, c = 2.1 and
q = 3, c = 2.2: 0 negative. (c = -2.1, real zero pair, and single real Blaschke factors are outside the proof;
measured 0 negative.)
(c) The class of phi that satisfy S2 to S4 is closed under insertion of zeros anywhere in the open half-plane.
No consequence S5 for numerator zeros can follow from S2 to S4.

### 3.4 Holomorphy plus non-vanishing (Whittaker side)

The Langlands-Shahidi step reads: E_nu holomorphic at nu_0 and the remaining factor of a Whittaker coefficient
non-zero imply that the denominator xi(v + 1) does not vanish. Holomorphy of E_nu is known by independent means only
on the closed chamber (convergence, Maass-Selberg). By Lemma A2 the denominators there have Re >= 1: the output
is zeta(1 + it) != 0 and nothing else. A strip argument v + 1 requires Re v in (-1, 0), which is outside the
chamber, where holomorphy of E_nu is the statement to be proved (Lemma A1 (iv)).

### 3.5 Outcome of the decisive test

No. Both mechanisms constrain the denominators, whose arguments have real part >= 1 wherever the mechanism is
available. Strip arguments are zeros of coefficients; in rank one the inequality is proved to be insensitive to
them (Theorem C). For the affine kernel (I_aff) the same insensitivity is not proved (weakest step 1); no step
was found in which the shifts by c produce a denominator argument inside the strip within the chamber.

---

## 4. Stage A table: first failing step per control

Steps S0 to S5 as in 3.1. "Formal" means: the function M_F(u) = xi_F(u)/xi_F(u+1) of the control inserted in (I).

| control | first failing step | status |
|---|---|---|
| DEL (thin prime deletion) | S0, and S2 formally: no functional equation, M_F(u) M_F(-u) != 1, the sum over W has no cocycle | ARGUED |
| THIN | S0, S2 (same) | ARGUED |
| U (unimodular twist) | S0 (the character is not automorphic), S2 | ARGUED |
| sign twist (TW+, TW-, Liouville) | S0, S2 | ARGUED |
| interpolation twin | S1, S2 | ARGUED |
| DH | S0/S1 (a combination of two induced representations I(chi), I(chibar); no scalar Gindikin-Karpelevich factor). Formal M_DH: S2 holds (functional equation checked, 8.7e-31); S3, S4 hold on the grid (0 of 4800 negative, x = 0, 0.5; Gram matrices positive). S3 fails where DH has a zero with Re s > 1: classical existence, none below height 2000 in the battery record (`c12-control-battery-harness/tables/zeros_DH.json`, largest real part 0.8695) | MEASURED; failure of S3 CLASSICAL, not located |
| backward heat | S0/S1. Formal: S2 holds; S3 fails for tau with a zero right of Re s = 1 (map section 2 lists one for tau = -2); for small abs(tau) not decided here | ARGUED-rel `b-escape-law` |
| E_a | As a group object (E(z + a) E(z - a) on the product of two groups, or induction from a non-unitary datum): passes S0 to S4 with the chamber walls at Re z = +-a; its true conclusion is the edge statement for its own walls. Formal diagonal M(z+a) M(z-a) in (I): fails S4 (150 and 79 of 4800 negative at a = 0.2; 45 of 2700 at a = 0.05); M(z+a) M(z-a) has two real poles 1 +- a (cause of the failure not proved) | group form PROVED-rel classical; formal failure MEASURED |
| T-NR (c > 2) | S0/S1 only: no vector at p_0 gives the factor (on the Iwahori level the two eigenvalues of the scattering matrix of Gamma_0(p) are phi times (1 + p^(1-s))/(p^s + 1) and -phi (1 - p^(1-s))/(p^s - 1), zeros on Re z = 1). **Passes S2, S3, S4** (Theorem C) | PROVED; the eigenvalue formula CLASSICAL, recalled |
| EIS-w | the device is this family (the Eisenstein series at a generic parameter); the test "does a step read M(z) = 0" has answer no (Theorem C) | PROVED in rank one |
| window translate | same object at nu shifted by an imaginary vector; passes every step; rigidity control only | ARGUED |
| UNIV | the diagonal bound is an upper bound for abs(zeta(z)/zeta(z+1)) of size abs(t)^(1/2), weaker than convexity; not a height-uniform closed condition on values; out of scope of the filter | ARGUED |
| BLS (new; 3.3 (a)) | S0/S1 at the archimedean place only. **Passes S2, S3, S4** with a prescribed zero off the line | PROVED |

Two controls pass every step that an inequality uses (T-NR, BLS). By the stage A rule the lane stops here.
How T-NR and E_a enter, as asked: T-NR is excluded only by the existence of a group vector at p_0, and the
inequality does not see that exclusion, because any Blaschke product over non-real conjugate pairs may multiply M
(the sign matters: -M fails S4, 220 of 2700 negative; round-12 lesson 2 in this
carrier: a positive Dirichlet polynomial at one prime with strip zeros is an inner factor of the scattering
coefficient). E_a is the same device on a product group with non-unitary shift; it fails nothing, and its
conclusions are relative to its own walls, which is the general reason an automorphic device returns edge statements.

---

## 5. Pivot (one, on paper): the level-1 identity

Lemma A3 gives an exact object not on file: at c = 1, E_nu/xi(z) has constant term sum over n in Z of
a^(w_n nu + rho)/xi(z + n), an orbit sum with Gaussian weights whose coefficients are 1/xi at the integer translates
of one strip point; at z = rho the series E_nu has the single exponent nu. Test for an inequality: a contradiction
would need a symmetric operator for which the single-exponent function is normalisable. ARGUED, not proved:
the quotient at fixed r is bounded in the torus direction (Garland's Siegel sets), the non-compact direction is r,
the exponent in r is exp(-r <nu + rho, d>), not square integrable over r, and the spherical Hecke operators of the
loop group change r. Result: an identity (holds for every f with f(u) = f(1 - u), hence for DH formally); no
inequality. The pivot stops here.

---

## 6. Requirement flags

- R1 false. Multiplicativity is used in S1 and in sigma_{-v}(m), both identities. The inequality S4 does not need
  the product over all primes: T-NR (one prime altered) and BLS (archimedean factor altered) satisfy it.
- R2 false as a flag. (I) is height-uniform and holds in every window, but it is not a statement about zeros.
- R3 false. T-NR (c > 2) and BLS pass S2 to S4; DH passes the formal test below height 2000.
- R4 false. No proved step constrains an argument inside the strip. Constrained arguments have Re >= 1.

Score 0. Device state: closed at stage A (rank-one Levi proved; affine kernel argued).

## 7. Three weakest steps

1. The affine Maass-Selberg relation was not opened. The closure is proved for the Levi inequality (I); for
   (I_aff) the statement "the Gram kernel stays positive when M is replaced by M Theta" is OPEN (the controls are
   not group objects, so positivity is not automatic, and no formula was available to test it). A two-variable
   inequality in (z, c) that fails for M Theta is not excluded by this lane.
2. Normalisations and regions for the loop group are recalled, relative to sources read only through summaries:
   the Godement region as 1 < Re z < Re c - 1, convergence of the constant term in the whole Tits cone, the sign
   of r, the extent of Garland's continuation ("a larger region" up to a wall), and the validity of the degenerate
   Whittaker formula in the affine case (assumed by FKP). The argument census (Lemmas A1, A2) depends on them.
3. Control statements with limited support: DH fails S3 only by the classical existence of zeros right of 1 and
   passes the formal test at all computed heights; the formal failure of E_a is measured at two values of a and
   not proved; the T-NR factor is identified with a Blaschke product through the classical inner-function
   factorisation without a written convergence argument; the Hecke-operator remark of section 5 is argued.

## 8. Files

- `tmp/research-2026-11-16/push/c13-kacmoody-eisenstein-affine-weyl-shift/RESULT.md`
- `.../identity_checks.py`, `identity_checks.json`, `identity_checks.log` (run: `scripts/memcap.sh 8 .venv-arb/bin/python -u`, 6.2 min)
- `.../ref_checks.py`, `ref_checks.json`, `ref_checks.log` (45 s)
- `.../REFEREE.md`, `lanes_line.json`, `engine_device_proposal.json`, `controls_BLS_proposed.json`, `MAP_ROW.md`
