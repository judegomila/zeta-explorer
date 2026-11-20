# REFEREE 2: Theorem 7 (iv), Lemma 2 and the abstract-family row of c5-angular-family-absorption

2026-11-18. Written by lane `c6-repair-referee-debts-r5`. Scope: Lemma 2 (Froehlich-Queyrut), Theorem 7 (iv), the
abstract-family row. Sources opened this time (not recalled): A. Froehlich and J. Queyrut, "On the functional
equation of the Artin L-function for characters of real representations", Invent. Math. 20 (1973) 125-138, page
scans of pp. 125-130 from the Goettingen digitisation (GDZ, PPN356556735_0020, images 131-136). Not opened: Weil
1952 (the AMS file was not retrievable); Remark 8 stays RECALLED and is used in no proof.

## Outcome

- **Lemma 2: upgraded from RECALLED to READ for finite-order characters; scope corrected for infinite order.**
- **Theorem 7 (iv): downgraded to ARGUED.** A precise sub-statement (iv-a) is PROVED below. The abstract-family row
  is ARGUED. Theorem 7 (i)-(iii) for the three listed families stand as the first referee left them.
- No statement about zeros. Flags unchanged (all false).

## 1. What Froehlich-Queyrut state (read from the scan)

- Theorem 1 (p. 125): if psi is the character of a representation of Gal(N/F) over R, then W(N/F, psi) = 1.
- Theorem 2 (p. 128): "Let E be a quadratic extension of F and let chi be a character (i.e. a continuous
  homomorphism of finite order) of C_E so that chi | C_F = 1. Then W(chi) = 1."
- Theorem 3 (p. 130): L a generalised quadratic extension of a local field K (a quadratic field extension or
  K x K), L = K[Delta], Delta^2 in K^*; phi a character of L^* with phi | K^* = 1. Then W(phi) = phi(Delta).
  Local root numbers as in (4.1)-(4.3): additive character lambda_p o tr_(L/Q_p), W(phi) = phi(D(L))^-1 for
  unramified phi, the normalised Gauss sum for ramified phi; at infinity W = 1 for phi = 1 and W = -i for the sign
  character of R.
- Deduction of Theorem 2 from Theorem 3 (p. 130): product over places, prod_P chi_P(Delta) = chi(Delta) = 1 since
  Delta is a principal idele.
- On p. 128 the paper fixes: "the term 'character' will always be used to mean continuous homomorphism, of finite
  order, into the group S."

## 2. Consequences for Lemma 2 of the lane

1. Ring-class characters of K = Q(sqrt(-3)) mod f: finite order, trivial on the ideles of Q (they factor through
   A_K^*/K^* C^* O_f-hat^*, and A_Q^* = Q^* R_(>0) Z-hat^* maps into K^* C^* O_f-hat^*). Theorem 2 applies as
   printed: W = 1. [READ + one-line check.] The lane's alternative (Epstein functional equation) is independent.
2. Angular characters lambda^(6k): infinite order. Theorems 2 and 3 as printed do not cover them (finite order is
   part of the definition of "character" there). The local statement of Lemma 2 of the lane, "for chi a character
   of K_v^* trivial on F_v^*, eps = chi(delta)", is covered by Theorem 3 at finite places for every continuous
   chi (K_v^*/F_v^* is compact and totally disconnected, so chi has finite order there), and is not covered at the
   complex place, where chi(z) = (z/abs z)^(2m). There the value i^(-2 abs m) = (-1)^m = chi(i) is Tate's local
   constant for C [CLASSICAL, recalled, not opened]. So for lambda^(6k) the Froehlich-Queyrut route needs one
   classical archimedean value in addition; the lane does not depend on it, because Lemma 1 (theta inversion,
   re-derived by the first referee, numerically checked by lane and referee) gives root number +1 directly.
   Re-derived here as well: P(alpha) = alpha^(6k) harmonic of degree 6k, Fourier transform factor i^(-6k); dual
   lattice of O is (2/sqrt 3) i O; P(i alpha) = i^(6k) P(alpha); product 1.
3. The sentence in the proposed map row "any family trivial on the ideles of a subfield of index 2" is established
   for finite-order characters (Theorem 2 as read). For infinite-order characters it holds with the archimedean
   value above taken as classical. The first referee's remark stands: characters whose restriction to Q is
   chi_(-3) are not in this class and their root numbers are not identically 1.

## 3. Theorem 7 (iv)

Statement in the lane: "with Cauchy-Schwarz, the large sieve for the family, convexity, the functional equation of
smooth rows and the row transform, the abscissa is >= 1; any low estimate giving abscissa B < 1 contains the bound
sum mu xi chi_p(a) w(Na/Z) << Z^(B + eps) for a row p carrying the target."

Finding: this is not a theorem as written. The set of admissible derivations ("with Cauchy-Schwarz, the large
sieve, ...") is not defined, so "abscissa >= 1" has no proof object for an abstract family. For the two group
families it is Theorem 6 (a) of the lane (PROVED there, with the first referee's log factor), a statement about one
explicit ledger. **Label: ARGUED** for the abstract family; PROVED only as Theorem 6 (a) for lambda^(6k) and the
ring-class twin.

What can be proved in general (replaces the second clause):

**(iv-a) [PROVED].** Let R be any finite set of rows, B_p = Z^(-1/2) sum_a c_a chi_p(a) w(Na/Z) with
c_a = mu(a) xi(a) (Theorem 7 (i), (ii)). If a low estimate is obtained from a bound sum_(p in R) abs(B_p)^2 <= U
(any mean-square or large-sieve bound for the row set), then for every single row p_0 in R,
abs(sum_a mu(a) xi(a) chi_(p_0)(a) w(Na/Z)) <= (U Z)^(1/2). In particular with U = K Z^eps (the generic size used in
Theorem 6 (b)) and K = Z^kappa, the Moebius sum of the row carrying the target is << Z^((1 + kappa)/2 + eps),
which is the abscissa the ledger outputs.
Proof. abs(B_(p_0))^2 <= sum_p abs(B_p)^2 <= U. QED
This is positivity of a sum of squares and nothing else. It shows that a low estimate of mean-square type over a
row set containing the target's row contains the pointwise Moebius bound of the same exponent. It does not cover a
low estimate that is not a bound on sum abs(B_p)^2 (for example a bilinear bound that uses cancellation between
A_p and B_p across rows). For such estimates clause (iv) is ARGUED.

## 4. Text for the map (entered as row Z22 by this lane)

"Group families (angular lambda^(6k), ring-class; any family of finite-order characters trivial on the ideles of an
index-2 subfield): epsilon factor identically 1 (Hecke theta inversion; Froehlich-Queyrut Theorem 2, read), row
transform = Fourier inversion on the group with kernel a function of the class of sc; no Gauss sum, mu is not
absorbed; rows are Moebius sums; Cauchy-Schwarz ledger abscissa >= 1 for the two computed families; a mean-square
low estimate over a row set contains the pointwise Moebius bound for the target's row. Abstract-family statement
(Theorem 7 (iv)) ARGUED."
