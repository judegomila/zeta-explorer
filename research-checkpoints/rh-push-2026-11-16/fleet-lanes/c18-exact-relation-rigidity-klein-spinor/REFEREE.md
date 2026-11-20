# REFEREE (adversarial, lens: general) for c18-exact-relation-rigidity-klein-spinor/RESULT.md

Date 2026-11-19. One referee, independent of the author. Numeric checks: mpmath 40 digits, local, through
`scripts/memcap.sh 8`, a few seconds; no server run (the lane's test is a paper test). The assignment allows
this file only, so the scripts are not stored; each check below is stated with its inputs and is a direct
evaluation of G = zeta(s) m(s) with `mpmath.zeta`, `findroot`, and `quad` of G'/G on circles.

## Verdict

**Holds, with corrections E1 to E5.** The claimed verdict (precise obstruction; no statement about zeros of
zeta) stands. The PROVED steps TN1, HQ1, HQ2, Lemma Q, Proposition F and Proposition D (a), (b) were
re-derived and are correct. The headline "multiplicativity excludes no twin with zeta's functional equation"
is established in the ordinary sense by HQ alone; for ZQ, NR-q and the Proposition W twin it is a statement
by convention (E2). Proposition D (c) has a gap as written (E1); it is repairable and the verdict does not
use it. Nothing assumes RH, nothing restates verified height, and the cited known results (Hamburger,
Theorem P, Knopp 1994, Voronin) are labelled as such.

Requirement flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false (agree with the lane).

## Re-derivations (all confirmed)

- **TN1.** Local factor (1 + alpha y)/(1 - y) = 1 + (1 + alpha)(y + y^2 + ...), alpha = q^(3/4): a(n) = 1 or
  1 + q^(3/4); multiplicative, >= 1, (s - 1)G entire of order 1, residue 1 + q^(-1/4). Zeros of the factor:
  s = 3/4 + i pi (2k + 1)/log q. Correct.
- **HQ2.** u -> 1/u fixes u^2/(1 - u)^4 (u^-2/(1 - 1/u)^4 = u^2/(u - 1)^4), so the functional equation is
  exact. u^2 (1 - u)^-4 = sum_{k >= 2} C(k + 1, 3) u^k and u^k = q^(k/2) q^(-ks); multiplying by 1/(1 - q^-s)
  gives a(q^v) = 1 + eps sum_{2 <= j <= v} C(j + 1, 3) q^(j/2). With u = e^-w: u/(1 - u)^2 = 1/(4 sinh^2(w/2)),
  real and <= -1/4 on abs u = 1, so the factor has no zero on the line; zeros at
  sinh(w/2) = (eps^(1/4)/2) e^(+-i pi/4) and negatives, Re z = eps^(1/4)/(sqrt 2 log q)(1 + O(sqrt eps)). Correct.
- **HQ1.** m = (1 + (eps - 2)u + u^2)/(1 - u)^2, b_k = eps k q^(k/2); on-line iff 0 < eps <= 4; eps > 4 gives
  u = -e^(+-theta), cosh theta = eps/2 - 1. Correct.
- **Lemma Q.** Periodicity, f analytic at 0 (the series is a power series in u with coefficients
  b_k q^(-k/2)), symmetry gives analyticity at infinity, finitely many poles, rational; pole-free gives
  constant. Correct. Integrality of q is not used (any real q > 1).
- **Proposition F.** eps = c_q + 2 gives cosh theta = c_q/2, theta = (log q)/4, zeros on Re s = 3/4, 1/4;
  abs(m - 1) <= eps abs(u)/(1 - abs(u))^2, of size q^(3/4 - sigma), tends to 0 for sigma > 3/4. Correct. The
  remark "any lambda < 1/2" is correct (eps = 2 + 2 cosh(lambda log q)).
- **DH at MULT.** a(2) = kappa, a(3) = -kappa, a(6) = 1 != -kappa^2. Correct.

## Numeric checks rerun on different cases (referee)

- HQ2 at q = 7, eps = 0.2 (not in the lane's table): root found by `findroot` from a crude start
  0.72 + 0.26i agrees with the closed form to 3e-42: 0.747293959 + 0.238267738i; offset 0.24729 against
  the leading term 0.24301 (ratio 1.018, consistent with 1 + O(sqrt eps)). The same from a start shifted by
  2 pi i/log q.
- Argument principle for HQ2 (q = 7, eps = 0.2) on circles about s = 1/2 (a check the lane did not make):
  radius 0.1 gives zeros minus poles = -4 (the order-4 pole, no zeros); radius 0.6 gives -1 = 4 zeros - 4
  - 1 (the pole of zeta at 1 is inside). So exactly four zeros in 0.1 < abs(s - 1/2) < 0.6. abs(G) d^4 at
  1/2 + d tends to abs(zeta(1/2)) eps/log(q)^4 = 0.0203703 (0.0203708 at d = 1e-5).
- Functional equation residual at three new points (0.37 + 11.3i, 2.2 - 0.7i, 0.9 + 101.5i): <= 3e-41.
- Coefficients for q = 7, eps = 0.2, n <= 20000: minimum 1; all coprime pairs (n <= 140) multiplicative; the
  Dirichlet series at s = 7 + 2i agrees with the closed form to 2.7e-27 (tail scale 1.6e-26).
- Proposition F at q = 13 and q = 997, k = 0 and k = 3, on both Re s = 3/4 and Re s = 1/4: abs(G) <= 1.2e-40
  with abs(zeta) between 0.50 and 1.69; the bound on Re s = 2 is attained at t = 0 (0.098577, 2.4770e-4).
- HQ1 threshold: roots of 1 + (eps - 2)u + u^2 have modulus 1 at eps = 0.3, 2, 3.999 and moduli (2, 0.5) at 4.5.
- TN1 at (q, k) = (5, 2), (7, -1): abs(G) <= 1.8e-40, abs(zeta) = 1.46, 0.68.

## Controls

The lane claims no zeta-only mechanism, so there is no mechanism to run controls against. The control table
of section 6 was checked entry by entry for the new members: HQ (E1 pass, INT pass, MULT pass, E3 fail,
E8 fail at q^2 since a(q^2) = 1 + eps q != a(q) = 1), TN1 (E1 fail), DH (MULT fail). Correct. The entries for
ZQ, NR-q, Proposition W at E6/E7 are subject to E2.

## Errors and corrections

**E1 (Proposition D (c): gap; statement 6 of the verdict is partly unproved).** Voronin's theorem gives
approximation on compact sets with connected complement in 1/2 < Re s < 1. The three witnesses are taken "on
a rectangle" (2 zeta on a zero-free rectangle, Davenport-Heilbronn on a rectangle where it does not vanish).
Convergence on one rectangle is not convergence in T_strip, so non-closedness of the hold sets in T_strip
does not follow from these witnesses. Extending them to the whole right half-strip by the exhaustion argument
needs f non-vanishing on all of 1/2 < Re s < 1; for f = 2 zeta that is RH, and for Davenport-Heilbronn it is
false. Repair: use a target that is non-vanishing on the whole half-strip and visibly outside the hold set,
for example f(s) = 1 + 2^-s/4 + 3^-s/4 (abs(f - 1) < 1/2; a(6) = 0 != a(2)a(3)) for MULT and f = 2 for a(1).
Also, T_strip is defined on the open strip while (c) is a statement on the right half only, without the
functional equation; inside the E1 class the lane itself lists it as OPEN (d). Statement 6 should read:
"(a), (b) PROVED; non-closedness of INT and MULT in T_strip is CLASSICAL on the right half-strip after the
repair, and OPEN inside the functional-equation class." The verdict uses (a), (b) and Proposition F only, as
the lane says; this does not change it.

**E2 ("ZQ, NR-q and the Proposition W twin pass multiplicativity" is a convention, and it conflicts with
the lane's own definition).** The Notation section defines MULT on a general frequency set as "log G has
its coefficient measure nu on the powers of the generators". For ZQ, nu = Lambda plus an absolutely
continuous density (map section 2: "ZQ is not an Euler product"), so under that definition ZQ fails MULT;
it passes only in the reading "on the atoms". For NR-q and the Proposition W twin,
m = (u + 1/u + c)/(2 + c): the coefficient function is a product of local factors only after removing the
monomial q^(s - 1/2) and the constant (the coefficient at frequency 1 is c/(2 + c), not 1), and for the
Proposition W twin with q a rational prime the frequency set is the rationals n/q, not a free semigroup with
a new generator. Consequences: (i) the row "N >= 0 deleted: ZQ (MULT on atoms)" of Proposition I is not a
twin keeping MULT in the defined sense; since Hamburger covers the integer-frequency case, every twin for
that row lies outside INT and the row is convention-dependent by necessity; (ii) the headline "multiplicativity
excludes no twin with zeta's functional equation" should be stated as: "HQ is a twin with zeta's functional
equation that satisfies ordinary multiplicativity; ZQ, NR-q and the Proposition W twin leave the class at
integrality/support before multiplicativity of integer coefficients is defined." The conclusion that
multiplicativity plus the functional equation does not identify zeta, and replaces neither FE (TN1) nor the
pole clause (HQ), is unaffected.

**E3 (pole order at every k).** "Quadruple poles at 1/2 + 2 pi i k/log q" for all k presumes
zeta(1/2 + 2 pi i k/log q) != 0. Proved at k = 0 (zeta(1/2) != 0), which is all the argument needs; for
other k the order is 4 minus the order of vanishing of zeta there. Checked: q = 2, k <= 40, min abs(zeta) =
0.2276. State "order 4 at k = 0 and at every k where zeta does not vanish".

**E4 (Lemma Q, wording of the consequences).** "Poles on the line pay for zeros off it" is not a consequence
of Lemma Q: the lemma gives number of zeros = number of poles of R on the u-sphere and places neither. A
symmetric R can have its poles off abs u = 1. In HQ they are on the line by construction. Consequence (c)
(no cancellation between primes) is correct for multiplicatively independent q, q'; it is not used.

**E5 (novelty and scope wording).** HQ is an explicit instance of the phenomenon in Knopp 1994 (cited by the
lane as recalled; the reference exists: Invent. Math. 117, 361-372); Lemma Q is a routine Liouville
argument; TN1 is a one-line example. None is a new theorem and the lane does not present them as such
beyond "not found on file". "Zeros at distance eps^(1/4)/(sqrt 2 log q) for every eps > 0" should carry
"inside the open strip for eps small" (at q = 2, eps = 1 the quartet is at Re s = 1.557, as the lane notes).
"Every exact relation on file" is the lane's reading list, not an enumeration of the engine graph (the
lane's weakest step 1; agreed).

## Surviving claim

No statement about zeros of zeta. (1) TN1 = zeta(s)(1 + q^(3/4 - s)) is an integer-frequency, multiplicative,
non-negative member with a single pole at 1 and zeros on Re s = 3/4; it lacks the functional equation. (2)
HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s), has zeta's functional equation exactly, integer
frequencies, multiplicative coefficients >= 1, and four zeros near each pole at distance
eps^(1/4)/(sqrt 2 log q)(1 + O(sqrt eps)) from the line; it has a pole of order 4 at s = 1/2. So ordinary
multiplicativity added to {FE, INT, N >= 0} does not replace the pole clause, and added to {INT, N >= 0,
POLE} does not replace FE. (3) Lemma Q: a pole-free symmetric one-base multiplier is 1. (4) Proposition F:
members with zeta's coefficients for n < q, uniformly within delta of zeta on Re s >= 2, with exact FE,
multiplicative non-negative coefficients, vanish on Re s = 3/4. (5) Among the relations listed, only
a(pn) = a(n) (the definition) and J = 1 (the target) exclude every control. Statements about ZQ, NR-q and
the Proposition W twin at multiplicativity are by convention (E2); Proposition D (c) needs the repair in E1.
Status: one referee holds with corrections; author plus one referee; elementary.
