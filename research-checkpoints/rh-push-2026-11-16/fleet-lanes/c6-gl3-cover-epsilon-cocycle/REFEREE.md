# REFEREE (lens: general) for c6-gl3-cover-epsilon-cocycle/RESULT.md (2026-11-18)

Verdict of this referee: **holds = false for the claim as worded; a narrower claim survives (section 5).**
The algebra of Lemma 1 and Lemma L is confirmed. Four statements in the claim or its support are wrong or
unsupported as written (E1-E4), and one load-bearing convention is not established (E5). No statement about
zeros is made in the result; nothing assumes RH; nothing restates verified height. Flags: R1 = R2 = R3 = R4 = false
(agree with the lane).

Referee runs: local, through `scripts/memcap.sh 8`, `.venv-arb/bin/python`, each under 2 minutes. The code is an
independent re-implementation of the recipe (general rank, weights of Lemma L, does not import `gt.py`); scripts
were kept outside the lane directory (`/tmp/c6ref/`), outputs are quoted below. No ssh, no server job.

## 1. Re-derivation of the PROVED steps

**Lemma 1: confirmed as arithmetic.** chat(0, b) = ghat(0) = -q^(-1/2); chat(a, -a) = chi(-1)^a/ghat(0)
= -chi(-1)^a q^(1/2); chat(a, b) = J(chi^a, chi^b)/sqrt q with modulus 1 when a, b, a + b != 0. For r = 2 only the
first two types exist. `cocycle.log` agrees (note: the docstring of `cocycle.py` says "-chat sqrt p is the Jacobi
sum"; the code and the lemma use +chat sqrt p = J; cosmetic).

**Lemma L: confirmed, given the recalled recipe.** The telescoping identity sum of Gamma_ij = k_1 + ... + k_r was
re-derived (Abel summation per column). The four per-entry values 1, 1 - 1/q, -1/q, T q^(-1/2) follow. Independent
check on cases not in the lane: rank 2 shapes with max(l1, l2) = 5 (344 monomials) PASS; rank 3 (GL(4)), 27 shapes
l_i <= 2, 2762 monomials: PASS, minimal order of a negative term q^(-1). The count 490 was re-added from
`lemmaL.json`: correct. Remark: once the recipe is granted the lemma is a one-line normalisation; the 490-monomial
check tests the code, not the mathematics.

**Lemma 2: the conclusion for r = 2 stands; one sentence of the statement is wrong (E3).**

**Rank-one Shimura form (validation 3):** re-derived by hand: numerator
1 + T Xu/r - T Xu U/r - Xu^2 U/q = (1 + T Xu/r)(1 - T Xu U/r) when T^2 = 1. Correct for eps = +1 only.

## 2. Rerun with different cases (row series)

Independent code, T symbolic with T^2 = eps, labels fixed in {0, 1, 2, 4} (4 is new), both directions, both eps,
7 terms (lane: 6). Truncation (degree <= 2 after multiplying by the cubic denominator): OK in all 32 cases,
including l = 4. The displayed closed form for l1 = 0, l2 even, eps = +1 matches exactly. Leading terms found
(t = q^(-1/2), l2 direction; the l1 direction is the mirror image):

| fixed l1, parity of l2 | order q^0 | order q^(-1/2) |
|---|---|---|
| 0, even | 1 | T (Xu + Yu - Yu U) |
| 0, odd | 1 | T Xu (1 + Yu^2 - Yu^2 U) |
| 1, even | 1 | T Yu (U - 1)(Xu^2 Yu^2 U - Xu^2 - 1) |
| 1, odd | 1 | 0 |
| 2, even or odd | 1 + Xu^2 + Xu^2 Yu^2 - Xu^2 Yu^2 U | T x (polynomial of degree 2 resp. 1 in U) |
| 4, even or odd | 1 + Xu^2 + Xu^4 + ... - (Xu^2 Yu^2 + Xu^4 Yu^2 + Xu^4 Yu^4) U | T x (polynomial of degree 2 resp. 1 in U) |
| 3, odd (extra run) | (1 - Xu^2/q)(1 - Yu^2/q)(1 - Xu^2 Yu^2/q)(1 + Xu^2 + Xu^2 Yu^2 - Xu^2 Yu^2 U) exactly | none |

## 3. Errors

**E1 (claim text; summary line of RESULT). "Numerator 1 - T Yu q^(-1/2) U + O(1/q) (64 exact cases)" is false as
stated.** The table above shows that this shape occurs in one parity class of one label (l1 = 0, l2 even, and its
mirror), up to the U-free term T (Xu + Yu) q^(-1/2). For l1 = 0, l2 odd the U-term is -T Xu Yu^2 U; for l1 = 1,
l2 even the q^(-1/2) part is quadratic in U and divisible by (1 - U), i.e. it is not a factor 1 - (unit) T
q^(-1/2) U; for l1 = 1, l2 odd there is no T; for l1 >= 2 the q^0 part is not 1. What the 64 runs establish is the
truncation (Hecke recurrence) only; section 3.3 of the result says so ("3 displayed"), the verdict paragraph and
the claim do not. The structural statement that survives is Lemma L: T occurs only with q^(-1/2).

**E2 (section 3.3, first bullet). "A product that converges absolutely for Re w > 0" is false.** The bracket
contains the U-free term -Xu Yu/q; its product over p is of the type 1/L(1, .), which does not converge absolutely
for any w. The prefactor (1 + T Xu/r)(1 + T Yu/r) is of the type L(1/2, .) and is not an Euler factor of the row
series at all (T depends on the coprime part of the index: twisted multiplicativity). The correct statement is
local: the only U-dependent term of the bracket above order 1/q is -T Yu q^(-1/2) U. "Reciprocal at shift 1/2" is
therefore a reading of one local factor, not a statement about a global Dirichlet series. The lane lists this
under weakest step 3; the text of 3.3 states it as fact.

**E3 (Lemma 2, labelled PROVED). "The cocycle between two members a, b is chat(a, b)^n ...: weight n w(a, b), sign
(-1)^n" is wrong when a, b or a + b is 0.** The epsilon factor of an unramified twist at p is 1, not
ghat(0)^n = (-q^(-1/2))^n. For the epsilon factors of Lemma 2 the cocycle is: 1 (type (i)); chi(-1)^(an), modulus
1, no factor -1 (type (ii)); (J/sqrt q)^n (type (iii)). So the weight table of Lemma 1 is not the weight table of
the epsilon factors of a twist family; the two agree only in type (iii). Also the constant eps(1/2, Pi) is missing
from the formula (independent of c, harmless). The conclusion used later (r = 2: epsilon factor = character x
periodic root of unity, no Jacobi-type value, any Pi, any n) is unaffected and is confirmed.

**E4 (coverage). "Covered: every unramified odd place" is not supported for q = 3 mod 4 (eps = -1).** Test run by
this referee: the Dynkin symmetry N_(l1, l2)(Xu, Yu) = N_(l2, l1)(Yu, Xu) holds exactly for all shapes l1, l2 <= 4
when T^2 = +1, and fails for 9 of 10 shape pairs when T^2 = -1, already at (1, 0) versus (0, 1), with difference
2 Xu^2 Yu^2 q^(-1)(q^(-1) - 1); replacing T by -T (the conjugate) on one side does not repair it. The recalled
Gelfand-Tsetlin theorems are stated (to this referee's recollection, also not opened) over fields containing the
2n-th roots of unity, where chi(-1) = 1. With one symbol T for every boxed odd entry and T^2 = -1 the recipe is
used outside that hypothesis, and the output fails a consistency test that the eps = +1 output passes. The rank-one
factorisation (validation 3) also uses T^2 = 1. The 32 runs with T = +-i are therefore not validated Whittaker
values. Lemma L's weights do not depend on this (any assignment of T or its conjugate to entries has the same
modulus), but the displayed series and the count "64 exact cases" do: 32 cases are inside the validated range.

**E5 (Lemma 1 as an obstruction: convention, not proved).** The weights {-1/2, -1/2, +1/2} depend on the choice
ghat(0) = -q^(-1/2). With ghat(0) = -q^(-theta) the table is {-theta, -theta, +theta} for types (i), (ii) and 0 for
(iii). With theta = 0 (the Ramanujan sum left unnormalised, g(0) = mu(p)) the order-2 identity
g(1)^2/q = -chi(-1) g(0) is "mu(p) times a character at weight 0". c5 Remark 8, which this lane says it puts in
checkable form, uses the Jacobi-sum convention in which J(chi_2, chi_2) = -chi_2(-1) has modulus 1. The whole
separation between r = 2 and r >= 3 in Lemma 1 therefore rests on the sentence "the transfer kernel is normalised
by sqrt(Nc) for every a", which is asserted for the 7/8 architecture and neither proved nor cited to a specific
statement. The convention-free content is: type (iii) has |g(a) g(b)/g(a + b)| = sqrt q, type (ii) has q, type (i)
has 1; Z/2 has only (i) and (ii). The label should be "PROVED identity; its use as a criterion is ARGUED"
(the lane's weakest step 2 concedes the criterion is a formulation; the claim text presents Lemma 1 as the cause).

## 4. Smaller points

1. "Checked on 490 monomials" counts monomials with T^2 unreduced (hence (0, 1): 7 but (1, 0): 8); not an error.
2. Validation 4 and "the Hecke algebra of the cover requires" the recurrence: the recurrence is confirmed
   (also at l = 4); the reason given is recalled, not derived.
3. The both-odd closed form is stated for l1 = 1; at l1 = 3 there is the additional T-free factor
   1 + Xu^2 + Xu^2 Yu^2 - Xu^2 Yu^2 U (confirmed exactly). Consistent with the result's third bullet.
4. Section 3.3 "T appears only as an overall factor T/r^odd of a class" (per Whittaker class) was not rerun.
5. Known theorems presented as new: none. Lemma 1 is the classical Gauss-Jacobi relation, Lemma 2 the classical
   twist formula, the rank-one series is Shimura's relation; all are labelled as such.
6. Controls: no zeta-only mechanism is claimed, so there is nothing for a control to fail. The unimodular-twist
   and sign-twist rows of section 5 were reproduced in effect by the symbolic runs (identities hold in Xu, Yu and
   for both signs of T). R3 is correctly reported as not established.
7. The step from "local shift 1/2" to "effective h = 0, model abscissa 1" uses the model of `r3-method-limit` as
   in e1/e2; it was not re-derived here and stays ARGUED.

## 5. Surviving claim

Given the recalled Gelfand-Tsetlin recipe for the double cover (n = 2), at an unramified odd place with
chi(-1) = +1: in unitary normalisation every pattern weight is a product of 1, 1 - 1/q, -1/q and T q^(-1/2), so
the quadratic symbol T occurs only together with q^(-1/2) and every minus sign only together with q^(-1), in every
rank (Lemma L; confirmed here in rank 2 on new shapes and in rank 3). The row series in either twist direction
satisfy the degree-3 recurrence of the parameters (1, Yu^2, Xu^2 Yu^2) (confirmed for fixed label up to 4, eps =
+1). For l1 = 0, l2 even the numerator is exactly the displayed product and its only U-dependent term above
order 1/q is -T Yu q^(-1/2) U. Epsilon factors of quadratic twists of any GL(n) form are a character times a
periodic root of unity. No local term of the form (sign depending on T) x (unit) at order q^0 occurs. Not
established: the general shape of the numerator for other labels; any global Euler-product statement; the case
chi(-1) = -1; the normalisation convention that turns Lemma 1 into an obstruction; the global Whittaker constants
of a genuine cusp form (open, as the lane says). No ledger entry with h > 1. No statement about zeros.

## 6. Requirement flags (set by this referee)

R1 false. R2 false. R3 false. R4 false. The result is a local algebraic obstruction; it establishes none of the
four properties and does not claim to.
