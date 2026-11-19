# REFEREE2 (second referee) for `c8-liou-row-bound-theorem`: Theorem A, sections 2 to 4

2026-11-18, lane `c9-repair-referee-debts-r8`. Written in this lane's directory; no file of the original lane was
edited. Read: RESULT.md sections 2 to 4 and 9, REFEREE.md. External text opened with a generic client (no project
details in any request): arXiv:1112.1650v1 (PDF, converted to text, read at Theorem 1.3, Corollary 1.4, Lemma 2.1,
the proof of Corollary 1.4 with (5.1), Appendix II); the arXiv abstract page; the Crossref record of the journal
version. No computation was needed for this item (the lane's certified identity and the first referee's rerun stand;
objects are not zero: N = 440.83, P = 21.87 at X = M = 2^11). No statement about zeros is made or checked.

## Outcome

| item | this pass |
|---|---|
| 3.4 Step 5, change of variable h -> g = hd | **holds** (re-derived independently; exact form of the inner sum below) |
| 3.4 Steps 1 to 4 (exponents, Fubini, Euler product (3.4), contour) | **holds** (re-derived) |
| Lemma S, twist insertion, against arXiv:1112.1650v1 | **holds** against the arXiv text (proof of Corollary 1.4 read line by line) |
| Lemma S against the journal version | **not checked: the journal text could not be opened.** Theorem A is relative to a statement located only in the arXiv version |
| Theorem A as a whole | **holds narrowed**: PROVED-rel (i) BGL Theorem 1.3 and the proof of Corollary 1.4 as printed in arXiv:1112.1650v1, journal statement unlocated; (ii) the classical reciprocity facts of Lemma 3' |

No requirement flag changes: R1 = R2 = R3 = R4 = false.

## 1. Step 5 (the line flagged in RESULT 9.2)

From Step 2 with Re z = 1 + eps: weights q_d^(-1+eps) and q_h^(-1-eps); Step 3: q_e^(2 eps); (3.5): X'^(1+4 eps) (q_d q_e)^(2 eps)
with X' = X/(q_d q_e). Powers: q_d: -1 + eps - 1 - 4 eps + 2 eps = -2 - eps; q_e: -1; M: M^(1 - z) = M^(-eps). CONFIRMED.

Change of variable. The quantity bounded is sum_d q_d^(-2-eps) sum_{h != 0} abs(r_d(h)) q_h^(-1-eps) F(hd), F >= 0 a
function of g = hd alone (F is the L-value in (3.5); the factors that depend on d and e separately were already
bounded by (q_d q_e)^(2 eps), and conj(theta(sigma_{de})) has modulus 1). The map (d, h) -> g = hd, with d a squarefree
primary divisor of g prime to S, is injective for fixed d, and q_h^(-1-eps) = q_g^(-1-eps) q_d^(1+eps). So the sum is

    sum_g q_g^(-1-eps) F(g) sum_{d | g} q_d^(-1) abs(r_d(g/d)),

and with r_d(h) = prod_{p | d} (q_p 1_{p | h} - 1) the inner sum is an exact product:

    sum_{d | g, d squarefree} q_d^(-1) abs(r_d(g/d)) = prod_{p | g, p not in S} (1 + a_p),  a_p = 1/q_p if p || g,  a_p = 1 - 1/q_p if p^2 | g.

This is at most 2^(omega(g)), as the lane states (and at most prod (2 - 1/q_p)). Extending d to all squarefree
divisors only adds non-negative terms. The restriction "g not in U_S (F^x)^6" passes to the g-sum unchanged. **Holds.**
The weight in (3.3) is 4^(omega(g)) (from abs(L^S)^2 <= 4^(omega(g)+abs(S)) abs(L)^2); together 8^(omega(g)) << q_g^(eta/4),
absorbed as stated.

Other points checked in 3.4: Phi^*(kappa + iy) = conj(Phi(kappa - iy)) and abs(Gamma) even, so the product is bounded
by one square; the class of c_2 = c_1/e is sigma_{de}; (e, g) = 1 comes from abs(chi_e(g))^2; psi(c_2) = 0 when
(c_2, g) != 1, so no extra coprimality is needed in A_theta; in (3.4) x = s + 1 - z has real part 3 - eps on the
initial line and 1/2 + eps after the shift, Im x = v - y; (3.2) gives the continuation (xi not principal because g is
not in U_S (F^x)^6). CONFIRMED.

## 2. The twist insertion in Lemma S

**Source located.** V. Blomer, L. Goldmakher, B. Louvel, "L-functions with n-th order twists".
- arXiv:1112.1650, one version only (v1, 7 Dec 2011, 21 pages). Opened and read.
- Journal: Int. Math. Res. Not. IMRN 2014, no. 7, 1925-1955, DOI 10.1093/imrn/rns257 (Crossref record; online
  27 Dec 2012). **Not opened**: the publisher's page and PDF return HTTP 403 to a generic client; no open copy was
  found. Whether numbering or hypotheses differ from v1 is not known. Since the arXiv has no later version, the
  printed text may differ from the one read.

**Statements read in v1 (agree with RESULT 3.3).** Theorem 1.3 (large sieve over squarefree ideals prime to S, bound
(MN)^eps (M + N + (MN)^(2/3)), arbitrary complex coefficients); Corollary 1.4 (sum over all a in I(S), N a <= N, of
abs(L(1/2 + it, chi_a))^2 << (N (1 + abs(t))^(d/2))^(1+eps)); (5.1) (the form with the weight (N a_2)^(n-2+eps));
Lemma 2.1 (chi_a primitive, chi_{a b^n} = chi_a, chi_a chi_b = chi_ab if ab is n-th power free, conductor between a_0
and c a_0); Appendix II (chi_a(b) = (x m_E/b) for a = (x) E g^n, x = 1 mod c).

**The printed proof of Corollary 1.4, step by step, with xi = primitive character inducing theta conj(chi_a).**
1. Approximate functional equation [IK, Theorem 5.3] for a primitive Hecke character. xi is primitive. theta has
   finite order and F = Q(omega) has one complex place, where a character of finite order is trivial (C^x is
   connected), so the gamma factor is the same as for chi_a. Outside S, theta is unramified, so the prime-to-S part
   of the conductor of xi is that of chi_a; the conductor lies between a_0' and c f_theta a_0' (a_0' the squarefree
   kernel of the n-th power free part). The length of the sums changes by a bounded factor. **Holds for F = Q(omega).**
   For a field with real places the gamma factor could change; not needed here.
2. Decomposition b = b_0 b_1 b_2 (S-part, squarefree, squarefull). xi is completely multiplicative on ideals,
   abs(xi(b_0 b_2)) <= 1, and sum (N b_0 b_2)^(-1/2-eps) converges: the same Cauchy-Schwarz step applies; the
   coefficient lambda_{b_1} may depend on b_2 through 1_{(b_1, b_2) = 1}, not on a.
3. xi(b_1) for b_1 squarefree prime to S: at a prime p not in S, xi is ramified iff chi_a is, and where both are
   unramified xi(p) = theta(p) conj(chi_a(p)). So xi(b_1) = theta(b_1) conj(chi_a(b_1)) for every such b_1, with both
   sides 0 at primes of the conductor. With a = a_0 a_1 a_2^n as in the source ((a_0, a_1) = 1, a_0 squarefree),
   chi_a(b_1) = chi_{a_0}(b_1) chi_{a_1}(b_1) by Lemma 2.1; chi_{a_1}(b_1) theta(b_1) is absorbed in lambda_{b_1}
   (Theorem 1.3 has arbitrary coefficients), and abs(sum lambda_b conj(chi_{a_0}(b)))^2 = abs(sum conj(lambda_b) chi_{a_0}(b))^2.
4. The sum over a_0, then over a_1, a_2: unchanged.
**Holds.** The twisted form is not a printed statement; the label PROVED-rel is right. Steps (b), (c) of Lemma S
(line 1/2 to 1/2 + eps by a contour integral with e^(w^2)/w; dyadic sum with eps < eta) re-derived: hold.

**From elements to the family.** g = l g', a = (g'); g' = u x m_E g_0^6 with u an S-unit and (g_0, c) = 1; so
(g/c)_6 = theta_{lu}(c) chi_a((c)) for c prime to S g, theta_v the Kummer character of v in U_S/U_S^6 (finite set).
Each ideal a comes from the elements l g', l in U_S, and sum_l q_l^(-1-eta) converges. CONFIRMED.

## 3. Corrections owed to RESULT.md (not applied)

1. Status line of Theorem A (3.1) and verdict item 2: add "source: arXiv:1112.1650v1; journal version (IMRN 2014
   (7) 1925-1955) not opened".
2. 3.4 Step 5: the inner sum has the exact value prod (1 + a_p) above; "number of squarefree divisors" is the bound.
3. Lemma S (a): say that the gamma factor is unchanged because F has only a complex place.
4. The first referee's corrections 1 to 8 stand; none is changed by this pass.

## 4. What lanes of this round may use

Theorem A (N = D + P + Rem; P >= 0 termwise; c M^(5/6) X^(1/3) <= P <= C M^(5/6) X^(1/3) for C M <= X^2;
abs(Rem) <= C_eps M^(-eps) X^(1+5 eps)) as a two-referee statement **relative to the arXiv text of BGL** and to the
classical reciprocity facts. Corollary B with the first referee's repair 6 (apply at M = Z/(4 log Z)).
Not covered: single nu, the completed row for small S, the asymptotic constant of P, anything for THIN.

## 5. Weakest points of this pass

1. The journal version was not opened; a difference in the printed Theorem 1.3 (range, the set S) would move the
   dependency, not the argument.
2. [IK, Theorem 5.3] was used in its standard form without opening the book; the uniformity of the cut-off function
   in the conductor is the usual one.
3. Lemma 3' (wild conductor exponents) was not re-derived here; the first referee did, and the lane's exhaustive
   check stands.
