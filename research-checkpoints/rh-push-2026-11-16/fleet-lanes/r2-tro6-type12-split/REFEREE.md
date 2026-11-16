# REFEREE: r2-tro6-type12-split/RESULT.md

2026-11-16. Adversarial pass. Claimed verdict: precise-obstruction (no eta > 0; theta = 7/8 unchanged).

**Outcome: holds = false as written, on one over-labelled step (§5.1, second half). Every headline PROVED / EXACT
claim is confirmed. The verdict (no eta > 0, precise obstruction) survives.** No false QED. No RH/GRH assumption.
Nothing restates verified height. Scratch code: /tmp/ref-r2-type12/ (chk2.py, t2.py; not in the repo).

## 1. Lemma 2.1, Corollary 2.2, Lemma 2.3: CONFIRMED (re-derived and re-run on a different test set)

Re-derivation. d = d1 b + d2 a gives chi_ab(d) = chi_a(b) chi_b(a) chi_a(d1) chi_b(d2) and
e(md/ab) = e(m d1/a) e(m d2/b), so g~(m,ab) = chi_a(b) chi_b(a) g~(m,a) g~(m,b). With chi_b(a) = R chi_a(b), R = +-1:
chi_a(b) chi_b(a) = R chi_b(a)^2. Substitution d -> d k^{-1} gives g~(mk,b) = conj(chi_b(k)) g~(m,b) for (k,b) = 1 and
every m; k = a^4 gives chi_b(a)^{-4} = chi_b(a)^2. Hence g~(m,ab) = R g~(m,a) g~(m a^4,b). Correct. Squarefreeness of
a is not used in the algebra (only in the form of reciprocity quoted).
Corollary: k_e(m;ab) = alpha^2(ab) G(a)^e G(b)^e R^e * R conj g~(m,a) conj g~(m a^4,b) = R^{e+1} k_e(m;a) k_e(m a^4;b);
f_j = mu k_{j+1} from Lemma L. Correct. For the manuscript row (e = 2) one R remains; for e = 1 none. Correct.

Independent numerics (own Z[omega] code, no import of ident.py or tmp/sextic). Test set disjoint in part from the
author's: both conjugates of split p in {103,...,157} plus {7,...,37}, inert -5, -17; N(ab) <= 7000; 140 pairs
(55 with R = -1), 560 triples, m random / sharing a prime with a / with b / with both; **30 pairs with b = q^2
non-squarefree** (not tested by the author).

| identity | max error |
|---|---|
| g~(m,ab) = R g~(m,a) g~(m a^4,b), b squarefree | 8.3e-14 |
| same, b = q^2 | 7.2e-14 |
| G(ab) = G(a) G(b) R | 6.2e-15 |
| k_e split, e = 1, 2 | 8.3e-14 |
| Lemma L on ab, random m | 8.1e-14 |
| G constant on classes mod 4 | 12 classes seen, consistent |
| Fourier support of G on (O/4)^x | 4 coefficients: 1/2, 1/2, i/2, -i/2, all on the same cubic component |

The closed form G = psi_3 * (1/2)(1 + eps_lambda + i eps_{-1} - i eps_{-1} eps_lambda) was also checked by hand against
the cocycle: the bracket takes values 1, i, 1, -i on the four square classes and satisfies f(xy) = f(x) f(y) r(x,y) with
r = (-1)^{eh+fg+fh}. "4 characters, not 12" is correct.

## 2. The weight (correction to round 1): CONFIRMED against the manuscript

~/lean-deps/qrh-verify/paper.txt l. 2718-2721: T_{m,s,eta}(t) = Sum gamma_2(c) alpha(cn^3) Psi(cn^3) G(cn^3) q_c^{-1/2-t}
q_n^{-1-3t}. The row carries G; Lemma L supplies a second. On n = 1 the weight is alpha^2 G^2 nu and G^2 is a character.
The round-1 referee's "Psi = alpha^2 G nu" was correct for the conjecture note's shorthand row, as RESULT.md says.

## 3. Lemma 2.4 (Vaughan) and §4: CONFIRMED, two remarks

1/zeta = 2M - M^2 zeta + (1/zeta - M)(1 - M zeta); (1 - M zeta)(b) = 0 for N(b) <= U and = kappa_U(b) above. Correct.
* For N(c) ~ D > U the first term is zero, not "Type I at level <= U" (§7). Harmless.
* The factorisation is exact on squarefree c only. Non-squarefree c with a prime shared with m have k(m;c) != 0 and
  are not covered by Lemma 2.1 when a, b share a prime; RESULT.md defers these to proof note (3.9). So §4 is
  PROVED-rel (3.9) for the full row, PROVED on squarefree c.

## 4. §5.1 [labelled PROVED]: NOT CONFIRMED as stated

Proved part: Sum_{(b,a)=1} g~(m,ab) N(ab)^{-u} = g~(m,a) N(a)^{-u} Sum_b R(a,b) g~(m a^4,b) N(b)^{-u}, i.e. the b-sum is a
Kubota Dirichlet series at index m a^4 with a mod-4 twist. That is the headline statement and it holds.
Not proved, and wrong as written: "Equivalently N(a)^u Sum_{c = 0 (a)} conj g~(m,c) N(c)^{-u}: the m-th coefficient of
the conjugate Kubota Eisenstein series for Gamma_0(a)".
* The inner sum in §4 carries Psi(b) = alpha(b)^2 G(b)^2 nu(b) and rho(a,b). The "equivalently" drops all of it.
  alpha^2 is an angular (infinity-type) twist: the twisted series is not a Fourier coefficient of the weight-zero
  Eisenstein series. nu is the manuscript's finite ray character (eta Xi^{-1} R(.,s)), so the object is target-free
  only after a class decomposition, which is not written.
* The factor conj g~(m,a) vanishes for (m,a) != 1; the restriction (c/a, a) = 1 and the cusp are not specified.
* Consequence: (RS) is formulated for an object that is not the Type-I sum. Since (RS) is OPEN/CONDITIONAL this does
  not affect the verdict, but §5.1 should read "PROVED: Kubota series at index m a^4 twisted by Psi rho(a,.), coprime
  to a; SKETCH: Rankin-Selberg interpretation", and (RS) needs the alpha^2 and ray-class twists and kappa re-examined.

## 5. §6.2 window [PROVED-rel (LB)] and §6.3: arithmetic CONFIRMED, scope overstated

* ||K||_op >= ||K||_F / min(n_A,n_B)^{1/2} >= max(A,B)^{1/2} ||rho|| given (LB); with AB = Q^{1.4} this gives
  Q^{0.4+2eta} <= A, B <= Q^{1-2eta}. Correct. Sextic large sieve: (Q + D + (QD)^{2/3})^{1/2} = Q^{0.8}. Correct.
  rho_m = conj chi_{c0}(m) gives an entry Q^{1/2} ||rho||. Correct.
* (LB) is measured (and 20% of the measured mean square is estimator noise). The label is honest.
* Scope: the window is a necessary condition for an inequality with arbitrary l^2 coefficients. The Vaughan pieces
  have specific coefficients (mu(a), kappa_U(b)). "Type II impossible outside the window" (§7 table) is a statement
  about the method (BIL), not about the sums. "Type I must reach Q^{0.4}" holds only inside the Vaughan + (BIL) scheme.
* Measurement re-run with a different case: Q = 2400 (not used by the author), boxes (51,136]x(154,417],
  (17,45]x(471,1271], (5,15]x(1437,3881], new seed. Polar exponent -0.320; mean |z|^2 = 1.820; s1 = 15.6, 22.8, 33.6
  against phase-null 15.8+-0.4, 22.0+-0.4, 33.3+-0.3 and random-matrix level 16.8, 23.1, 35.4; raw s1 = 58, 66, 71.
  Same reading: rank-one polar part, remainder at random-matrix level. Caveat: square boxes give a complex symmetric
  K while the null is non-symmetric, and composite c can occur in more than one entry; neither changes the reading.

## 6. Prop 5.1, §3.3, §6.4, §7 arithmetic: CONFIRMED

* Prop 5.1: A * A^{-1/2} * A^{kappa/4} Q^{5/12} <= Q^{11/12-eta} iff A <= Q^{1/2-eta} (kappa = 2), Q^{1/3} (kappa = 4).
* §3.3: Cauchy-Schwarz in delta gives Q^{1.2}/Y'; open range Y' <= Q^{0.2}; target X^{7/9} Y'^{1/2}.
* Dunn arXiv:2403.13151v5 (PDF read): Thm 1.5 bound ((AB)^{1/2} + A^{3/2} B^{1/4}) ||mu^2 alpha||_inf ||beta||_2 and
  Prop 1.6 bound (AX)^{1/3} ||mu^2 alpha||_2 are quoted correctly; cuspidality is used ("zero frequencies contribute
  nothing"). Transposition: X/A'^{1/2} + A'^{3/4} X^{3/4}; conditions A' >= X^{4/9}/Y' and A' <= X^{1/27} Y'^{2/3};
  empty for Y' < X^{11/45}, hence for Y' <= X^{1/9}. (AX)^{1/3} A^{1/2} at A = X^{7/9} is X^{53/54}. Correct.
  Citation slip: the dual form (X/A^2) Sum Sum mu^2(a) g(a) alpha_a rho_f(nu) (nu/a)_3 is Dunn's (1.15) in v5;
  (1.14) is the Type-II sum B_f.
* §7: u-interval [0.4 + 2 eta, 1/2 - eta] nonempty iff eta <= 1/30; second and third Vaughan terms land in the
  window. Polar exponent 5/6 + 1.4/24 = 0.8917, eta_Q = 1/40. Correct. Coprimality (a,b) = 1 couples the Type-II
  variables and must be removed (standard; not mentioned).
* Not verified: "Lemma R + Poisson gives no saving at any level" (§5, end) and the §3.5 sliver; both rest on
  tro6-sieve.

## 7. Controls

* DH: no positive argument is made, so nothing needs to fail. The stated control is correct: mu comes from
  gamma_2^3 = mu alpha; (BIL) is target-free; 1/L enters only through complete multiplicativity of nu.
* Backward heat and sign twist (mandatory since the brief's addendum) are not addressed. Not needed for an obstruction
  verdict, but the section should say so.
* No RH/GRH. The 7/8 zero-free input appears only in a row marked CONDITIONAL. No finite certificate.

## 8. Is the obstruction real?

It is a correct reduction, not a barrier theorem. The exact part (split, weight, Vaughan) is solid. The quantitative
part is tied to (i) the toy geometry, which RESULT.md itself shows is inconsistent with Theorem D at beta_0 = 7/8
(weakest step 2), and (ii) the choice "Vaughan + arbitrary-coefficient (BIL)". Ways around that are not excluded:

1. **Type I on average over the level.** The level-a pieces carry coefficients mu(a1) mu(a2) and are summed over a.
   A second-moment bound over a (large sieve in the level aspect for the index-shifted Kubota series, using Lemma 2.1
   to write the a-dependence as conj chi_b(a)^2 g~(m,a), a cubic character in a) is a cubic-large-sieve problem in
   (a | b) with the m-sum kept inside, not the per-m version dismissed in §6.3. If it gave Lindelof on average, the
   Type-I level would pass Q^{1/2} and overlap the window with room.
2. **Heath-Brown identity with two smooth variables.** Pieces with b = b1 b2 smooth are double Kubota sums
   (a divisor-twisted Kubota series at index m a^4), a different object from (BIL); not examined.
3. **Use the coefficients.** In the third Vaughan term a carries mu(a) with N(a) > U. Since gamma_2^3 = mu alpha, mu(a)
   can be put back into Gauss sums, turning the Type-II sum into a trilinear sum of Gauss sums with theta_6
   coefficients; the (LB) window does not apply to it.

None of these is shown to work. The statement "no existing large sieve covers any part of the window" is correct for
the bounds quoted.

## 9. Surviving claim

For coprime primary a, b prime to 6 (b not necessarily squarefree; checked on 229 + 140 independent moduli pairs sets,
errors <= 8.3e-14): g~(m,ab) = R(a,b) g~(m,a) g~(m a^4,b), hence k_e(m;ab) = R^{e+1} k_e(m;a) k_e(m a^4;b). The manuscript
row carries G, so the n = 1 weight is alpha^2 G^2 nu with G^2 a character; G is psi_3 times a 4-term combination of
quadratic characters mod 4. Vaughan transports exactly on squarefree c; the Type-I inner sum is a Psi-twisted Kubota
Dirichlet series at index m a^4 (its Rankin-Selberg reading, (RS) and kappa = 2 are unproved and (RS) omits the alpha^2
twist). Given the measured lower bound (LB), an arbitrary-coefficient bilinear inequality can hold only for
Q^{0.4} <= N(a), N(b) <= Q; the sextic large sieve gives Q^{0.8} against Q^{1/2-eta}; Dunn Prop 1.6 transposed is the
primal large sieve and Thm 1.5 transposed leaves an empty range. Type-II matrix at random-matrix level after rank-one
polar removal (reproduced at Q = 2400). All exponents are for the toy geometry. No eta > 0. theta = 7/8 unchanged.
