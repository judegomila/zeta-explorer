# REFEREE (independent, lens: general): c12-bost-connes-crossed-product-duality

Date 2026-11-19. Independent adversarial pass. The author's own pass is kept unchanged at the end of this
file. Method: every PROVED step re-derived from the relations of section 1; numeric checks rerun with
different cases (script outside the lane, mpmath 30 digits, through `scripts/memcap.sh 8`; compute server
not used); controls re-run by hand. Sources (Bost-Connes 1995, Takesaki, Connes 1999, Connes-Marcolli
2004) were not opened by this referee either.

## Verdict

**The claimed verdict holds: precise obstruction, device closed at stage A, for the three classes of
states examined. No statement about zeros of zeta is made or supported. Flags: R1 = R2 = R3 = R4 = false.**

Six statements in RESULT.md are wrong or overstated (E1 to E6). None is used by the closure; E1 changes the
wording of Lemma C and of inequality (K), and E3 changes the wording of the proposed engine principle.
They should be corrected before the row is entered in the map.

## Errors found

**E1. Lemma C, second half, is true only for the Galois-invariant KMS state; the summary says "KMS_beta"
and "every KMS state".** The first half (every sigma-invariant state factors through E) is correct for
all of them. The second half (product measure; values entire in beta; finitely many primes; "zeta does
not occur in any value") fails for the extremal KMS_beta states at beta > 1,
phi_{beta,alpha}(x) = zeta(beta)^-1 Tr(pi_alpha(x) e^{-beta H}):
- the measure is sum_k k^-beta delta_{k alpha} / zeta(beta), not a product over primes (the unit part of
  k at p depends on the exponents at the other primes);
- the values are phi_{beta,1}(e(a/b)) = zeta(beta)^-1 sum_k e(ak/b) k^-beta, a combination of
  L(beta, chi)/zeta(beta). Checked: b = 5, beta = 2: 0.04 + 0.606319 i (the invariant state gives -0.2);
  the value equals 5^-beta + (1/4) sum_chi tau(chi-bar) L(beta, chi)/zeta(beta) to 12 digits, also at
  beta = 1.4. These values are meromorphic in beta with poles at the zeros of zeta, they involve all
  primes, and zeta does occur.
Consequence: (K) "reads finitely many primes" is correct only for the invariant state. For extremal
states (K) is positivity of the coefficients k^-beta at real beta > 1, the class of inequality (D), and
is passed by every control with non-negative coefficients. The closure survives, by the argument of (D)
instead of the argument of 2(d). The statement in section 0 that corrects round 10 ("their read set on A
is finitely many local factors") needs the same restriction: round 10's "read set beta > 1" is the
correct description for the extremal states.

**E2. Lemma L: "the product of gamma_p over all p diverges for 0 < beta < 1" is false at beta = 1/2.**
gamma_p = (1 - p^(beta-1))/(1 - p^-beta) = 1 for every p at beta = 1/2. Checked over p < 20000: product
1.0 at beta = 1/2, 2.2e77 at beta = 0.3, 4.6e-78 at beta = 0.7. The conclusion (no relation between
phi_beta and phi_{1-beta} on A) is empty at beta = 1/2 and holds for beta != 1/2, so nothing downstream
changes. The phrase "ratio of the two normalising constants" is unclear: the constant of the Fourier
transform of nu_beta and the constant of the density of nu_{1-beta} are equal, both
(1 - p^(beta-1))/(1 - p^-1); gamma_p is the ratio of the Fourier-transform constant to the constant
(1 - p^-beta)/(1 - p^-1) of the density of nu_beta itself. Re-derived; the local statement is correct
with that reading.

**E3. Lemma T: "T-NR is a bounded inner perturbation of the Bost-Connes dynamics" with "partition
function zeta(beta) phi_beta(D)" joins two different objects.** The dynamics
sigma'_t = Ad(D^(-it/beta)) o sigma_t depends on beta. For one fixed perturbed Hamiltonian
H' = H - log D the partition function is sum a(k)^beta k^-beta, not the T-NR series. Checked, q = 5,
c = 3, beta = 3: 5.7194 against T-NR 1.2670. What is proved is: beta -> Tr(D e^{-beta H}) is the T-NR
function, D is a fixed positive element of C*(Q/Z) in the centraliser, and at each beta separately
phi_beta(D .)/phi_beta(D) is KMS for a beta-dependent inner perturbation. The engine principle of
section 7 should read "invariant under multiplication of the state by a positive element of C*(Q/Z)",
not "under bounded inner perturbations of the dynamics".

**E4. The range of c.** "c > 2" gives a zero of the T-NR factor inside the critical strip only for
2 < c < sqrt(q) + 1/sqrt(q) (q = 3: c < 2.3094). For larger c the zeros of the local factor have real
part >= 1 and <= 0 (my cases q = 5, c = 3: 1.0980 + 1.9520 i; q = 2, c = 2.3: 1.2806 + 4.5324 i; the
author met the same with c = 2.5). The control stays off the line for every c > 2; the text should
state the range if "zero inside the strip" is meant.

**E5. Lemma P, last sentence, and Lemma B, last sentence, are not proved.** "No value zeta(beta + it),
beta <= 1, is a value of a positive functional of the system" is not a well-posed statement (every
complex number is a value of some positive functional on some element) and its intended form rests on
the unopened Takesaki-duality statement. "The only positive quantity is ||E f||^2" is ARGUED. Both
should carry the label ARGUED/CLASSICAL-not-opened, not PROVED. Lemma B's proved part (below) is fine.

**E6. Lemma E: "zeros on Re beta = 1/2 and 3/2" assumes RH.** Unconditionally the zeros of
zeta(beta) zeta(beta - 1) lie in 0 < Re beta < 1 and 1 < Re beta < 2, hence off the symmetry line
Re beta = 1, which is all the control needs. Reword.

## Omission that changes the description of R4 (not the flag)

Lemma B says positivity is lost at the pole and "no crossing". The positive-definiteness of Z_{sigma+it}(1)
is lost, but a positivity of the opposite sign holds in the strip whenever F = |f|^2 is non-increasing on
[0, infinity): by the Muntz formula, for 0 < sigma < 1,
zeta(s) M F(s) = integral (sum_{k>=1} F(lambda k) - lambda^-1 integral_0^inf F) lambda^(s-1) d lambda,
and the bracket is <= 0 for monotone F (a Riemann sum from the right of a decreasing function). So
t -> -zeta(sigma + it) M F(sigma + it) is positive definite on every line 0 < sigma < 1. Checked with
F = e^-x (M F = Gamma): the 24 x 24 matrix [zeta Gamma(sigma + i(t_i - t_j))], spacing 0.9, has all
eigenvalues in [-3.73, -1.77] at sigma = 1/2, [-4.13, -2.72] at sigma = 0.2, [-11.65, -8.91] at
sigma = 0.9, and in [0.69, 4.27] at sigma = 1.5; the Gaussian bracket is negative at lambda = 0.05, 0.5,
1, 3. This is classical (zeta(s) Gamma(s) = integral (1/(e^x - 1) - 1/x) x^(s-1) dx). It is the
functional lambda^-1 F^(0)/2 - Omega_lambda(1), which is not a positive functional on A, it is a
Bochner statement on a line (positive definite functions can vanish), and it holds for every Dirichlet
series whose summatory step is a monotone Riemann sum, so no flag changes. The sentence "no crossing"
should say: positivity of the state does not cross; a sign-reversed kernel positivity exists in
0 < sigma < 1 and carries no zero information.

## Inconsistencies in the control table

- DEL, finite S: the table marks F "no: no Poisson formula". By the definition of [FE] in section 4
  (Poisson summation on e(r)), the step is an identity for every periodic density, and the DH row is
  marked "yes" on that ground. 1 - P_p is periodic. Checked for S = {3}: sum over k prime to 3 of
  F(lambda k) equals the two-term Poisson expression to 30 digits. With this reading DEL (finite S)
  passes S, M (exactly, completely multiplicative) and F, and has zeros on Re s = 0: a control inside A
  that passes every step with exact covariance, which T-NR does not. If F instead means "a functional
  equation s <-> 1 - s", the DH row is right and the DEL row is right, but then [FE] must be defined
  that way. Either way R3 stays false.
- T-NR, c < -2: M is marked "yes" while the same density with c > 2 is marked "exact only for
  (n, q) = 1". Same cocycle in both rows.
- Window translate: F = |f|^2 is unchanged by f -> f |x|^(-i alpha); the row is the gauge action
  sigma_alpha on off-diagonal elements and is not an independent control. Harmless, as the author says.

## Re-derivations that held

- Lemma C first half: sigma_t(mu_n x mu_m^*) = (n/m)^{it} mu_n x mu_m^*; holds.
- KMS formula for the invariant state: re-derived for beta > 1 from Ramanujan sums
  (f = phi(b)^-1 sum_{d | b} mu(b/d) d^(1-beta); agrees with the displayed product for b = p, p^2) and
  from the local measure (shell integral gives (p^(1-beta) - 1)/(p - 1) at b = p). Covariance through
  the fourth relation rechecked at beta = 0.05, 0.7, 2.6, n = 7, 14, 15, b = 7, 8, 14, 35, 49: 3e-31.
  Positive definiteness rechecked on (1/42)Z/Z at beta = 0.5 and 1.3: the eigenvalues equal
  42 nu_beta(class) computed from the product measure to 2e-30 (least 0.2695 and 0.3259).
  Uniqueness and type for beta <= 1: source, not checked.
- 2(b), 2(c): product measure and signs re-derived; f_2(2) = -0.5.
- Lemma W: identity (1.1) and phi_{1/2}(P_n) = n^(-1/2); holds. It is a rewriting of the prime side;
  nothing new is claimed and nothing new is there.
- (D): Tr(e^{-beta H} u_t)/zeta(beta) = zeta(beta - it)/zeta(beta); holds. Ratio at t = 2.5:
  0.511, 0.0634, 0.00646, 0.000647 at beta = 2, 1.1, 1.01, 1.001.
- [M], [FE], Lemma V: re-derived. Poisson with a non-self-dual F (e^{-3 pi x^2}), r = 3/7 and 5/12:
  error 0 at 30 digits. The read set {L(s, chi)} for single-vector Mellin families is correct.
- Lemma B, proved part: Z_s(1) = zeta(s) M F(s); positive definite for sigma > 1; value at t = 0
  negative for 0 < sigma < 1. Holds.
- Lemma T, proved part: coefficient identity (q = 5, c = 3 and q = 2, c = 2.3: 6e-29), D >= 1, zero
  location formula (|F| = 2e-31 at the predicted points), functional equation
  G(l) = (q l)^-1 G^(1/(q^2 l)) with non-self-dual F (2e-30), cocycle mu_q^* D mu_q = (1 + c sqrt q) +
  q P_q (diagonal entries 7.708, 12.708 against a(q)a(1) = 7.708, a(q)^2 = 59.416). KMS statement at
  fixed beta: correct (D is fixed by sigma_t, so it is in the centraliser).
- DH: kappa = 0.2840790438, 1 + kappa^2 = 1.0807009031; density eigenvalue -1. Holds.
- Interpolation twin values b(3) = -2, b(21) = 4, b(3*7*23) = -8: hold.

## Controls where a zeta-only mechanism is claimed

None is claimed. Every inequality in the result is passed by a control: (K, invariant state) by any
change of local factors away from the support; (K, extremal states) and (D) by any non-negative
coefficient sequence; (I) by E_a, T-NR, and DEL with finite S. I confirm these by the derivations above.

## Other checks

- RH is not assumed in any step used by the verdict (E6 is a wording slip in a recalled fact).
- Verified height is not used or restated.
- No known theorem is presented as new: the KMS formula, uniqueness, GL_2 system and trace formula are
  labelled CLASSICAL; the lemmas labelled PROVED are elementary rewritings and are described as such.
- Coverage: the closure is for (i) sigma-invariant states, (ii) the type I dual-system extension at
  beta > 1, (iii) Mellin families of the vector states sum f(lambda k) e_k. It is not a statement about
  all states on A or on the dual system. The map row must carry this limit.

## Flags (set by this referee)

R1 false: no inequality uses multiplicativity; [M] is a covariance identity, and DH fails at the sign of
its density. R2 false: nothing at height t in every window. R3 false: E_a, T-NR, DEL (finite S) pass.
R4 false: all positivity of states is on sigma > 1; the sign-reversed positivity in the strip carries no
zero information. Main claim holds with corrections E1 to E6.

---

# Appendix: the author's pass (unchanged)

# REFEREE pass: c12-bost-connes-crossed-product-duality

Date 2026-11-19. Adversarial pass by the lane author after the result was written (not an independent
referee; the campaign record should count it as an author pass). Method: each PROVED lemma re-derived
from the relations of section 1 without the text; each number re-read from `identity_checks.json`; each
control cell attacked by asking for a step the control fails that an inequality uses.

## Verdict of the pass

The main claim holds: the device is closed at stage A; no requirement flag is established
(R1 = R2 = R3 = R4 = false); nothing is said about zeros of zeta. Three corrections were made to
RESULT.md during the pass (items 1 to 3). No PROVED step broke. Flags confirmed: none.

## Corrections made

1. T-NR row, step M. First draft: "M yes". Re-derivation: mu_q^* D mu_q = (1 + c sqrt(q)) + q P_q, which
   is not a multiple of D. The covariance Omega_{n lambda}(x) = Omega_lambda(mu_n x mu_n^*) is exact only
   for (n, q) = 1; at q it holds with the bounded positive cocycle mu_q^* D mu_q D^-1 (C4d: a(q^2) - a(q)^2
   = -13.87, so the coefficients are not completely multiplicative). The claim "T-NR passes every step"
   is now "passes every step that (I) uses". The stop rule still applies through E_a, which passes the
   three marked steps exactly in its tensor system, and because no displayed inequality uses exact
   covariance at a single prime. Exact covariance at one prime is the local condition of map rows G21 and
   L4, recorded there as satisfied vacuously by zeta.
2. Lemma L. First draft said the Fourier transform of nu_beta "is the density of nu_{1-beta} away from
   0". The two functions are the same homogeneous function abs(.)^-beta on complementary domains
   (abs(xi) > 1 for the transform on Q_p/Z_p, abs(x) <= 1 for the density). Reworded.
3. T-NR numeric example. The first run used c = 2.5, q = 3, whose zero has real part 1.131 (right of 1,
   a zero of the local factor). Rerun with c = 2.1: zero at 0.786657 + 2.859601 i inside the strip;
   density still >= 1.

## Re-derivations that held

- Lemma C: sigma_t(mu_n x mu_m^*) = (n/m)^{it} mu_n x mu_m^*; invariance forces n = m. mu_n e(r) mu_n^* is
  in C*(Q/Z) by the fourth relation. Holds.
- KMS formula: derived independently for beta > 1 from sum_k c_b(k) k^-beta = zeta(beta) sum_{d | b}
  mu(b/d) d^(1-beta); gives f_beta(b). C2 tests the KMS covariance at beta = 0.3, 0.5, 1 where the
  derivation does not apply; it holds to 1e-31. Uniqueness and type for beta <= 1 are not checked (source).
- Lemma V: <xi, mu_n e(r) mu_m^* xi> = <mu_n^* xi, e(r) mu_m^* xi>; mu_n^* xi_{f,lambda} = xi_{f,n lambda}
  because mu_n^* e_k = e_{k/n} for n | k and 0 otherwise. Holds. The Mellin exchange needs Re s > 1 and
  f Schwartz. Holds.
- Lemma T: coefficient identity by expansion; q^(1/2-s)(q^(s-1/2) + q^(1/2-s) + c) = 1 + c sqrt(q) q^-s +
  q q^-2s. phi_beta(P_n) = n^-beta from the KMS formula with r = 0. Theta self-duality re-derived:
  G(l) = l^-1 [Th(1/l) + c q^(-1/2) Th(1/(ql)) + q^-1 Th(1/(q^2 l))] = (ql)^-1 G(1/(q^2 l)). Holds (C4e).
  Modular statement: D is in the centraliser of phi_beta (diagonal), so phi_beta(D .) has modular group
  Ad D^{it} composed with that of phi_beta; in the convention sigma^phi_t = sigma_{-beta t} this is KMS_beta
  for Ad(D^{-it/beta}) o sigma_t. Holds; the perturbed Hamiltonian H - beta^-1 log D depends on beta, which
  RESULT.md states through the formula for sigma'.
- Lemma B: a continuous positive definite function has non-negative value at 0. zeta(sigma) < 0 on
  (0, 1) (classical: (1 - 2^(1-sigma)) zeta(sigma) = eta(sigma) > 0). M F(sigma) > 0. Holds.
- Lemma W: (1.1) is sum_{n | k} Lambda(n) = log k. Holds. The sentence "it uses from A only
  phi_{1/2}(P_n) = n^(-1/2)" is a statement about the identity, not a proof that no other use of A exists.
- DH row: coefficients (1, kappa, -kappa, -1, 0), kappa = 0.2840790; a(6) - a(2)a(3) = 1 + kappa^2 =
  1.0807009, equal to the map's figure. Density has eigenvalues -kappa and -1. Holds.

## Attacks that did not break the claim

- "A is non-commutative, so Lemma C cannot be the whole story." It is not: Lemma C covers
  sigma-invariant states only. The vector states of (I) are not sigma-invariant; for them Lemma V gives
  the read set. A state that is neither (for example a vector state of a vector not of the form
  sum f(lambda k) e_k, or a state on the dual system at beta <= 1 other than the dual weight) is outside
  both lemmas. This is weakest step 1 and is the limit of the closure: the row should say "closed for
  sigma-invariant states, the dual-system state and the Mellin families of archimedean vector states".
- "E_a is not a control for a device on A because it needs A (x) A." The stop rule asks whether the
  control has a system in which every step holds; the assignment asks this explicitly. It has. Inside A
  itself the nearest control is T-NR, with the local caveat of item 1.
- "Window translate passing is harmless." Agreed and stated: it has no known off-line zero.
- "Inequality (K) at beta = 1/2 could still carry the symmetric point." f_{1/2}(p^k) = p^(-k/2)/(1 +
  p^(-1/2)); every value is a finite product of local terms. Nothing global.

## Not checked

- Bost-Connes 1995 (uniqueness, type III_1 for beta <= 1), Takesaki duality (dual weight), Connes 1999 and
  Connes-Consani-Marcolli 2007 (trace of the scaling action = Weil functional), Connes-Marcolli 2004 (GL_2
  partition function zeta(beta) zeta(beta - 1)): none opened.
- The EIS-w row was not written out in the GL_2 system.
- Checks C1 to C7 are mpmath at 30 digits, not interval arithmetic; they test identities, and no claim
  rests on a numerical inequality except "least eigenvalue 0.2566 > 0" (C3), which illustrates a
  classical theorem.

## Flags

R1 false, R2 false, R3 false, R4 false. Score 0. Main claim holds (author pass).
