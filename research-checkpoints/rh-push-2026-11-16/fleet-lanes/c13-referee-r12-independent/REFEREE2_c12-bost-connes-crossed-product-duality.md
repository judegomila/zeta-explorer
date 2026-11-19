# REFEREE2: c12-bost-connes-crossed-product-duality (independent second referee)

Date 2026-11-19. Written from the lane's RESULT.md only; the lane's REFEREE.md was not read before this report was complete. Scripts: `item135.py` (log `item135.log`), `supp.py` (log `supp.log`); mpmath 30 digits and Arb 200 bits, local, `scripts/memcap.sh 8`. Sources (Bost-Connes 1995, Takesaki duality, Connes-Marcolli) were not opened by this referee; the KMS formula was re-derived from the type I states instead.

## Verdict on the three statements asked

1. **Three classes of states: holds in a narrower form.** The closure is established for (i) sigma-invariant states through Lemma C, first sentence; (ii) the type I extension to the dual system at beta > 1 (inequality (D)); (iii) the vector states xi_(f,lambda) and their Mellin families (Lemma V, inequality (I)). The narrowing is in class (i): the consequences (a), (b), (d) and the sentence "zeta does not occur in any value of phi_beta on A" hold for the Galois-invariant KMS state only. For the extremal KMS states at beta > 1 they are false as written (section 2 below); the class is still closed for them, by a different reason (coefficient positivity right of 1, which T-NR with D >= 1 passes).
2. **T-NR = Tr(D e^(-beta H)) with D >= 1 in C*(Q/Z): holds.** Exact for Re beta > 1; D = 1 + c sqrt(q) P_q + q P_(q^2) has spectrum {1, 1 + c sqrt q, 1 + c sqrt q + q}, so D >= 1 for c >= 0. Narrowing of a side remark: "T-NR is a bounded inner perturbation of the Bost-Connes dynamics" is true one beta at a time (the perturbing element is -log D / beta); as a function of beta the T-NR function is the value zeta(beta) phi_beta(D) of the unperturbed KMS family on the fixed positive element D, not the partition function of one perturbed dynamics.
3. **Corrected KMS statement: holds.** "The KMS measure on Z^ is a product of local measures" is true for the Galois-invariant state (every beta > 0) and false for the extremal states at beta > 1, whose values on C*(Q/Z) include tau(conj chi) L(beta, chi)/zeta(beta). Verified here independently.

## 1. Re-derivation of the lemmas

- **Relations (RE-DERIVED).** mu_n e(r) mu_n^* e_k = [n | k] e(rk/n) e_k = (1/n) sum_(ns = r) e(s) e_k. Correct; P_n is in C*(Q/Z).
- **Lemma C, first sentence (RE-DERIVED): holds.** sigma_t(mu_n x mu_m^*) = (n/m)^(it) mu_n x mu_m^*; an invariant state kills the terms with n != m; the remaining terms lie in C*(Q/Z) = C(Z^). So every sigma-invariant state is a probability measure on Z^ composed with E.
- **KMS formula (RE-DERIVED for beta > 1, CHECKED).** The Galois average of the type I states gives zeta(beta)^(-1) phi(b)^(-1) sum_k c_b(k) k^(-beta) = phi(b)^(-1) sum_(d | b) mu(b/d) d^(1 - beta), which is b^(-beta) prod_(p | b) (1 - p^(beta-1))/(1 - p^(-1)). Numerically (Hurwitz zeta, beta = 1.3, 2.5, 4; b = 2, 3, 4, 6, 9, 12, 35, 49; values not used by the lane): max difference 2.2e-31. For beta <= 1 the formula is the continuation; uniqueness and type are CLASSICAL (not opened).
- **Product measure for the invariant state (RE-DERIVED).** The Fourier coefficient at a/p^k of (1 - p^(-beta)) sum_j p^(-j beta) Haar(p^j Z_p^*) is p^(-k beta)(p - p^beta)/(p - 1) = f_beta(p^k) (Ramanujan sums of prime powers). Checked at three (p, k, beta) including beta < 1. Positive definiteness on (1/84)Z/Z (lane used 60): least eigenvalue 0.0515, 0.2695, 1, 0.0119 = 1/84, 0.00014 at beta = 0.25, 0.5, 1, 2, 3; all positive. Consequences (a), (b), (c) hold for this state. Lemma L (local Tate duality) is the same computation: the local statement holds. Its last sentence ("the product of gamma_p over all p diverges for 0 < beta < 1") is false at beta = 1/2, where gamma_p = 1 for every p; it is true for beta != 1/2 (log gamma_p = p^(-beta) - p^(beta-1) + smaller terms). This referee did not catch this in the first pass; it was found when comparing with the lane's existing REFEREE.md (its item E2) after this report was written, and then confirmed by the one-line computation just given.
- **Lemma W: holds** (phi_beta(P_n) = n^(-beta); a rewriting of the prime side; no inequality).
- **Inequality (D): holds** (Tr(e^(itH) e^(-beta H)) = zeta(beta - it), beta > 1).
- **Lemma V (RE-DERIVED): holds.** mu_n^* xi_(f,lambda) = xi_(f,n lambda); Omega_lambda(mu_n e(r) mu_m^*) = sum_k conj f(n lambda k) f(m lambda k) e(rk); the substitution u = lambda k factors the Mellin transform as (periodic zeta) times (archimedean integral). Scope: the vectors xi_(f,lambda) only, as the lane's weakest step 1 says.
- **Lemma B: holds** relative to zeta(sigma) < 0 on (0, 1): a positive-definite function has a non-negative value at 0.
- **Lemma T (RE-DERIVED, CERTIFIED): holds.** sum a(k) k^(-s) = zeta(s)(1 + c sqrt(q) q^(-s) + q^(1-2s)) = q^(1/2 - s) zeta(s)(2 cosh((s - 1/2) log q) + c). Zero of the bracket at 1/2 + arccosh(c/2)/log q + i pi/log q: Arb value of modulus below 5e-59 at (q, c) = (3, 2.1): 0.786656866897 + 2.85960086738 i (the lane's figure), and at two parameter pairs not used by the lane: (5, 2.3): 0.836202642680 + 1.95198126583 i; (2, 2.05): 0.821928094887 + 4.53236014183 i. Zeros lie inside 0 < Re < 1 exactly for 2 < c < sqrt q + 1/sqrt q (2.3094, 2.6833, 2.1213 at q = 3, 5, 2). D in the centraliser of phi_beta (sigma-fixed elements are in the centraliser of a KMS state): omega_D is a state and is KMS for Ad(D^(-it/beta)) o sigma_t at that beta. Poisson relation G(l) = (q l)^(-1) G(1/(q^2 l)) re-derived from theta inversion and checked at q = 5, c = 2.3 (1e-15 relative, float theta). Cocycle at q: a(qk)/a(k) ranges over [1, 6.14] at q = 5, c = 2.3: bounded, positive. Dirichlet series identity checked by a direct partial sum to 2e5 with tail bound (difference 2.8e-11, bound 1.4e-10).
- **DH row.** kappa = 0.2840790438, a(6) - a(2)a(3) = 1 + kappa^2 = 1.0807: confirmed. D_DH has eigenvalue -1: immediate.

## 2. The correction (independent check)

For chi mod 5 with chi(2) = i and x = sum_a conj chi(a) e(a/5) in C*(Q/Z), at beta = 2:
- extremal state (alpha = 1): phi(x) = 0.51683265726972 + 1.21263789412471 i = tau(conj chi) L(2, chi)/zeta(2) (agreement to all 15 printed digits);
- Galois-invariant state: phi_beta(x) = f_beta(5) sum_a conj chi(a) = 0.

So on A the extremal KMS states at beta > 1 read all primes, and beta -> phi_(beta,alpha)(x) continues to a meromorphic function with poles at the zeros of zeta. Consequences for the text of RESULT.md:
- Verdict, Lemma C bullet: "For KMS_beta the measure is a product over primes ... Zeta does not occur in any value of phi_beta on A": restrict to the Galois-invariant state.
- Section 2 (a): "entire, finitely many primes": Galois-invariant state only.
- Section 2 (d) and flag R1 ("(K) reads finitely many primes"): Galois-invariant state only. For an extremal state at beta > 1, (K) is positivity of the measure zeta(beta)^(-1) sum_k k^(-beta) delta_(k alpha): coefficient positivity on Re s > 1, the same content as (D); it is passed by every control with D >= 0 (T-NR with c > 2, E_a, DEL) and does not cross beta = 1 (the extremal states do not exist for beta <= 1; CLASSICAL).
The stage-A closure is unchanged; the reason for class (i) at beta > 1 is "coefficient positivity right of 1", not "local".

## 3. Labels to downgrade or restrict

| statement | lane label | this referee |
|---|---|---|
| Lemma C, sentence 1 (factorisation through C(Z^)) | PROVED | holds |
| Lemma C, sentences 2 to 4; consequences (a), (d) | PROVED | hold for the Galois-invariant state only; restrict |
| Lemma P, last sentence: "No value zeta(beta + it), beta <= 1, is a value of a positive functional of the system" | PROVED/CLASSICAL | downgrade to ARGUED; what is shown is that the dual weight of KMS_beta and the normal states of the type I representation do not carry it |
| Lemma T | PROVED; CHECKED | holds |
| "inner perturbation of the dynamics" (Lemma T, section 7 principle, round-12 lesson 2) | PROVED / principle | holds per beta; as a statement about the function of beta, reword to "value of the KMS family on a fixed D >= 1 in C*(Q/Z)" |
| Lemma V, Lemma B, Lemma W, (D) | PROVED | hold (Lemma V for the vectors xi_(f,lambda)) |
| Lemma L | PROVED | local statement holds; last sentence (divergence of prod gamma_p) false at beta = 1/2: restrict to beta != 1/2 |
| Lemma E | PROVED at input level | holds at that level (two commuting copies; not one Bost-Connes system) |
| EIS-w row, DEL row "no Poisson formula" | ARGUED | not checked; for finite S the DEL sum has a Poisson dual, which is a different function (no self-dual relation): reword |

## 4. Not checked

Uniqueness and type III_1 for beta <= 1, Takesaki duality, the GL_2 system: sources not opened. Coverage beyond the three classes (weights on the type II_infinity dual at beta <= 1) is not addressed by the lane or by this report.

## 5. Comparison with the existing REFEREE.md (read after sections 1 to 4 were written)

The existing independent pass reaches the same verdict. Its E1 (Lemma C second half true only for the Galois-invariant state; extremal values L(beta, chi)/zeta(beta)) is the same finding as section 2 here, obtained with a different element and a different check (it used e(a/5); this report used sum_a conj chi(a) e(a/5), which isolates one character). Its E2 (gamma_p = 1 at beta = 1/2) was missed here and is adopted above. Its E3 (inner perturbation), E4 (range of c for zeros inside the strip: 2 < c < sqrt q + 1/sqrt q) and E5 (last sentence of Lemma P not proved) coincide with the narrowings found independently here. Its E6 (a recalled statement about the GL_2 partition function assumes RH) concerns a CLASSICAL remark that this report did not check.

## 6. Run note

In `item135.log` the line "numerically at s=3: -8.52e-6" is not a valid check (series acceleration applied to a non-smooth summand); it is replaced by the direct partial sum with tail bound in `supp.log` (difference 2.8e-11 against a tail bound 1.4e-10).
