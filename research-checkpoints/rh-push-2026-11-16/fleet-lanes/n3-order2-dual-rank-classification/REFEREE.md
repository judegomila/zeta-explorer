# REFEREE: n3-order2-dual-rank-classification (general adversarial referee, 2026-11-17)

Scope: RESULT.md re-derived line by line; one independent numeric run (new cases) through
`scripts/memcap.sh 8`, single process, 8 s, largest allocation a few MB, no ssh. Script was run from /tmp and is
reproduced in outline in section 3. Only this file was written.

**Decision: holds = false as stated. The obstruction verdict survives in a narrower form (section 5).**
Theorem N is labelled PROVED but contains two false clauses and one missing case. The headline conclusion
("no frequency-0 Dirichlet target at shift < 1 produced by a one-variable order-2 polynomial row") is confirmed.
Nothing assumes RH, nothing restates verified height, no statement about zeros is made.

## 1. Steps confirmed (re-derived)

- **Lemma 1.** Parseval gives sum_h |S(h)|^2 = p^k (p^k - r); subtracting (p^k - 1) p^k gives p^k (1 - r). Correct.
  Classical (perfect / bent sequence counting); not new.
- **Lemma 2(a), (b).** Correct. Chebotarev (split primes) gives one distinct root; j even gives |S|^2 = 1.
- **Lemma 2(c).** Correct in the limit: sum_h = sum_b (1 + (bd/p)) K(1,b)^4, the twisted part is O(p^{5/2}).
  Rerun: M4 = 2.07 (p = 401), 1.92 (p = 503) for d = 7.
- **Lemma 3.** Correct. uv = d parametrisation, K(a,b) = K(1,ab), CRT with twisted multiplicativity; the case
  p | h is consistent because K(1,0;p) = -1 = S_f(0;p). Classical (hyperbolic term / Salie-type evaluation).
  Rerun on new cases d = 7, -3, 11 and 501 <= c < 800: S_f(0;c) = mu(c) exactly on 108 / 92 / 113 moduli;
  max |S_f(h;c) - K(1, h^2 d 4bar; c)| = 5.0e-14 (including h sharing factors with c); p^2 formula exact for
  p = 23, 29, 31.
- **Lemma 4 formula, (i), (iii), (iv).** Correct. Points at infinity of y^2 = g: 1 for n odd, 1 + (a/p) for n even.
  H zero-free for Re w > 1 holds because |S_g(0;p)| <= p (not because of the Weil bound, which is weaker at small
  p and large genus; the text does not say which bound it uses).
- **4.1.** Rerun with d = 3, Q = 30, Z = 120, s = 0.3 + 4i: |I| = 8.057e-2, |freq 0| = 2.77e-3, |NZ| = 8.331e-2,
  residual 3.4e-16. With d = 7, Q = 600, Z = 60, s = 0.5 + 3i: |I| = |freq 0| = 7.4809e-3, |NZ| = 4.9e-43.
- **4.2.** Correct for Om in C_c^inf. The "iff" needs W(rho - 1 - s) != 0 (W is entire and can vanish at a
  point); true for generic s, should be stated.
- **Lemma C.** The Mellin computation is correct (int w(c/Z) Z^{-v-1} dZ = c^{-v} W(v)); chi_m is nonprincipal
  for every m because m^2 - 2 is never a square (m = 1 gives (-1/.), m = 2 gives (2/.), both nonprincipal);
  singular set of L_b and the pole set of the frequency-0 transform are disjoint. Valid for Om of compact
  support (finite m-sum). For Schwartz Om (as in test2) the m-sum is infinite and termwise continuation needs
  a uniformity statement that is not given.
- **Section 6 Jacobi-sum step.** Correct.
- **DH step.** b(4) = a(2)^2 - a(4) = xi^2 + 1 = 1.0807 != 0, so the Dirichlet inverse is not supported on
  squarefree c. Correct, but see 4(c).

## 2. Errors

**E1 (Theorem N(B): "The dual is not flat at any prime" is false).** Labelled PROVED. Lemma 1 gives only a
necessary condition (S(0) = 0 and one root), and for deg g >= 4 that condition can hold. Exact counterexamples at
good primes (g squarefree mod p, degree preserved), found by exhaustive search:
- g = m^4 - m^2 + m, p = 3: values (0, 1, -1), |S(h)|^2 = 3 for h = 1, 2. As a function on F_3 it is m.
- g = m^4 + 4m^3 + m^2 + m, p = 5 (80 of 2080 squarefree quartics mod 5 are flat).
- g = 2m^4 + m, p = 7 (84 of 12600).
- none at p = 11, 13 (0 of 134200, 0 of 318240); degree 2: none at any p <= 13, as Lemma 1 + S(0) = -(a/p) proves.
Also false at bad primes for a trivial reason (3m^2 + m is m mod 3). Correct statement: for deg g = 2 not flat at
every good prime (proved); for deg g >= 4 not flat for p > p_0(deg g) (needs Katz or a fourth-moment bound, not
derived in the note; RESULT section 8 item 3 concedes this, but the theorem body does not).

**E2 (Lemma 4(ii) "Dirichlet component present iff n is even" and Theorem N(A) "the reciprocal of a target can
enter only through x_c" are false for f, as opposed to g).** For f = a g k^2 the roots t of k with g(t) != 0
contribute -sum_t (a g(t)/p) to S_f(0;p): weight-0, modulus-1 Dirichlet characters, the same kind of class as the
conic's points at infinity. The note's own table has the counterexample and dismisses it in words:
f = m (m-1)^2 has g linear (case A) and S_f(0;p) = -1 at every p. Rerun: S_f(0;c) = mu(c) exactly for every odd
squarefree c < 700. So the row ((m (m-1)^2)/c) has frequency-0 term Q Om^(0) M_Z(1 + s), identical to the
conic's, with mu produced by the row and target 1/zeta(1 + s), while its nonzero frequencies are a Gauss sum plus
a bounded term (character-type dual). Likewise f = (m-3)(m-4)^2(m-7)^2 gives S(0;p) = -2 at all tested p.
Consequences:
- the sentence in section 3 "The only rows with Moebius-type frequency 0 are those with deg g even" is false;
- verdict item 1 ("Lemma 0 has exactly one escape ... deg g even") is false: there is a second escape with a
  character dual, in case (A);
- the distinction "not a row class, it is one point" has no definition behind it; cohomologically both are
  weight-0 classes of H^1_c of the open curve.
The shift is still 1, so the final no-go sentence is unaffected. The kill criterion as worded ("mu-type frequency
0 has a character dual or frequency 0 suppressed by sqrt p") is still met, and this example is in fact an
instance of both alternatives at once.

**E3 (trichotomy not exhaustive).** deg g = 0 (f = a k^2, nonconstant) is in none of (A), (B), (C) as described:
(B) literally includes it ("deg g even") but the description "frequency 0 carries mu(c)(a/c) x_c / c" is wrong
there (S = (a/p)(p - r_p)). It is treated in Lemma 4(iv) only. "Exactly one of the following holds" needs a
case (D).

## 3. Overclaims and unverified parts

- **"The conic identity is closed."** Proved only in two regimes: Z <= Q^{1-eps} (4.2) and fixed Q, Z -> infinity
  (Lemma C). Lemma C in that regime is close to a tautology: the direct side is a finite sum of smoothed partial
  sums of L_b(s, chi_m), which has no pole at rho - 1, so the other side has none either. For Q = Z^M, M <= 1
  (including the transition Q^{1-eps} < Z < Q^{1+eps}) nothing is proved; RESULT section 8 item 2 says so, the
  verdict paragraph does not. "Closed" should read "closed for M > 1 and for fixed Q; not examined for M <= 1".
- **4.3 is ARGUED and was not checked here.** One specific doubt: K(1, h^2 d 4bar; c) contains the inverse of 4
  mod c, so it is not K(1, n; c) for a fixed n; the claimed h-Dirichlet series L(u, sym^2 u_j)/zeta(2u) depends
  on the cusp-pair normalisation (with the pairing (h, hd) one gets a Rankin-Selberg series with a pole at u = 1
  instead; the two differ exactly on (h, c) > 1). The table of exponents should not be cited.
- **Theorem N concerns frequency 0 only.** Verdict item 4 says a "frequency-0 (or coherent-set) coefficient" of
  size c^{-1/2} is excluded. The coherent-set part (targets carried by a structured subset of nonzero
  frequencies, as h = a^2 for the linear row) is not addressed for deg g >= 2 except by the unverified 4.3.
- **Section 6, "odd-weight eigenvalues are never roots of unity times sqrt p".** False prime by prime
  (supersingular: alpha = +- i sqrt p). True only as a statement about a compatible system; for k = 1 the needed
  fact is Lemma 4(i) (integrality of the trace), which is what is actually proved.
- **Several variables.** ARGUED only, as labelled.

## 4. Controls (run or checked by me)

(a) The lane claims no zeta-only mechanism, so there is nothing for a control to break; I checked instead that
no step silently separates zeta from the controls.
(b) Sign twist: x_c = eps_c c^{-s} gives frequency 0 = 1/L_eps(1 + s) by the same identity. Confirmed by
inspection of 4.1 (the identity is linear in x_c).
(c) DH: the statement "target cannot be DH" holds only because c is restricted to squarefree and x_c is bounded.
With all odd c (Jacobi symbol) S_f(0;c)/c is multiplicative and nonzero at p, p^2 (p > 3), so x_c can be chosen
to make frequency 0 equal to 1/L_DH(1 + s) on Re > 0. The exclusion is a property of the chosen support, not of
the row. The identity itself holds for every x_c, as the note says.
(d) Backward heat: not formulable for rows with a character in c; agreed.
(e) E2's example is an additional control internal to the lane: a character-dual row with the same frequency-0
term as the conic. Anything attributed to "the conic escape" at frequency 0 is reproduced by it.

## 5. Novelty

Lemma 1 (Parseval count), Lemma 3 (conic = Kloosterman; hyperbolic term), Lemma 4 (Weil), 4.2 (complete sums)
are classical. The note says so for the conic average only. Theorem N is a bookkeeping statement assembled from
them; its content is the remark that weight-0 classes enter S(0;p)/p at shift 1.

## 6. Surviving claim

For f in Z[x] nonconstant, c odd squarefree, good primes: S_f(0;p) is an integer equal to
-(a/p) 1_{deg g even} - sum_{k(t)=0, g(t) != 0} (a g(t)/p) - (trace of Frobenius on H^1 of y^2 = g); every
Dirichlet (weight-0) part has modulus O(1), so its target sits at 1 + s; size sqrt p parts are Jacobian
L-functions; size p needs g constant and then the sign is a Dirichlet character, not mu. Hence no one-variable
order-2 polynomial row has a frequency-0 Dirichlet target at shift < 1 produced by the row. For the conic
m^2 - d: S_f(0;c) = mu(c), S_f(h;c) = K(1, h^2 d 4bar; c), identity 4.1; for Z <= Q^{1-eps} the probe equals the
frequency-0 term up to O(Q^{-A}); for fixed Q (compactly supported Om) the monomials Q Z^{rho-1-s} cancel.
Not established: non-flatness for deg g >= 4 at small primes (false), uniqueness of the conic escape (false),
closure for Q = Z^M with M <= 1, the Kuznetsov table, coherent-set targets in nonzero frequencies.

## 7. Required corrections

1. Theorem N(B): replace "not flat at any prime" by the proved statement for deg g = 2 and a cited, large-p
   statement for deg g >= 4; list the small-prime exceptions.
2. Lemma 4(ii), Theorem N(A), section 3 outcome sentence, verdict item 1: state the frequency-0 coefficient for
   f (with the deleted-point characters) and remove "only for deg g even" / "exactly one escape".
3. Add the case deg g = 0 to the theorem.
4. Verdict: restrict "closed" to the regimes proved; demote the "coherent-set" clause of item 4 to OPEN.
