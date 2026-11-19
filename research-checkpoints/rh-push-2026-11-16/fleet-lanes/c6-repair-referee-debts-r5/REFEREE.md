# REFEREE (general lens): c6-repair-referee-debts-r5

2026-11-18. Scope: RESULT.md and the five REFEREE2.md notes it wrote in other lane directories. Local only;
one numeric rerun through `scripts/memcap.sh 8` (`.venv-arb` python, float64). Compute server not used.

## Outcome

**Holds as a repair lane (partial-result).** Every step labelled PROVED was re-derived and confirmed. No statement
about zeros of zeta is made; nothing assumes RH; no verified-height restatement; no known theorem is presented as
new (U-stab and (iv-a) are one-line corollaries and are described as such). Five errors or gaps found, none in a
PROVED step; E1 is a false sentence in an argued (READ) passage and should be corrected in
`c5-angular-family-absorption/REFEREE2.md` section 2 item 2 and in RESULT section 2.

Flags: R1 false, R2 false, R3 false, R4 false (agree with the lane).

## Re-derivations

**Lemma U (equal slopes).** Re-derived: Mellin transform of f_i against Z^(-s-c_i) is A_i(s) (rapid decay at 0,
contour bound at infinity); with d = c_1 - c_2 > 0 the transform of f_2 against Z^(-s-c_1) is A_2(s+d);
g = f_1 - f_2 << Z^E gives holomorphy of A_1 - A_2(.+d) on Re s > a = beta* - min(sigma_1, sigma_2 + d);
A_2(.+d) holomorphic on Re s > max(sigma_0, beta_eta) - d; abs(H_1) >= 1/2 makes every zero of L right of sigma_0
a pole of A_1; hence beta_eta <= max(sigma_0, a) for every eta, with a independent of eta, against the supremum.
Confirmed. One implicit line: when beta* = 1/2 the contradiction uses beta_eta >= 1/2 for every eta (zeros
symmetric about the critical line); true, not stated (E4).

**U-stab.** Triangle inequality then Lemma U. Confirmed. Content is a corollary, not an independent statement.

**U-slope.** Transform is lambda_i^-1 A_i((w - c_i)/lambda_i); (1) e_1 > e_2 puts a pole of term 1 at
Re w_0 > max(E, m, e_2) where term 2 is holomorphic: confirmed. (2) with e_1 = e_2, c_1 - c_2 =
(lambda_2 - lambda_1) beta*, the map rho -> beta* + kappa (rho - beta*) is re-derived and stays in the region
(Re rho_1 > beta* - kappa eps_0); accumulation at beta* contradicts meromorphy (also if beta* were a pole).
Confirmed. Sharper description of the exception than the lane gives: it requires beta* > 1/2, beta* a real zero of
some L(s, eta), and no other zero of any target in the strip beta* - eps_0 < Re s <= beta*. For beta* = 1/2 the
exception is empty (zeros on the line exist and are not the real point). The lane's wording is correct but does not
record that the exception is empty when beta* = 1/2.

**(iv-a).** abs(B_(p_0))^2 <= sum abs(B_p)^2 <= U and the normalisation Z^(-1/2): confirmed. Trivial; the claim
"which is the abscissa the ledger outputs" was not re-derived against the lane's Theorem 6 (b).

**Lemma A step (c).** Orthogonality gives u(x) = chi(p) u(x/p) + O_p(x^(theta-1)); the Lipschitz bound, the dyadic
sum, the finite net and the passage to a continuous character of the positive reals were each re-derived.
Confirmed.

**Theorem 2 and Corollary.** Re-derived: Euler factor (1 - 1/q)/(1 - chi(q)/q); main term
c X (chi(p) - 1)/(p - 1); tail C X^(beta-1)/(1-beta); C_1 = C(1 + 1/(1-beta)); integration by parts identity;
Gallagher (pi X + 1/delta); spacing Q^-2; (2M + B + C)^2 <= 8M^2 + 4B^2 + 4C^2 (checked by AM-GM, gives the factor
p^2/3 with the k-sum <= p^2/12); pi + 1 + 2/3 < 5; sum p^4 <= Q^5; Q^5 = X^(2-2 beta). Corollary:
b <= 5 theta/(1 - beta) for beta > (1 + b)/2 gives b(1 - b) <= 10 theta; both uses need sigma_0 = b, i.e. the
largest real zero. Confirmed as stated.

## Numeric rerun (different case)

`thm2_check.py` rerun with X = 300000, chi with seventh-root values on 114 primes p = 2 mod 3 (first members 2,
17, 53, 113, 227, 347; includes p = 2), test primes 3, 5, 7, 11, 23, 41, 53, 113, 307. chi = 1 * g assertion
passes; c = 0.458151 + 0.295874 i; step (ii): abs(T - main) between 11.9 and 202.3, main terms 6135 (p = 53) and
2848 (p = 113), 0 elsewhere, all inside the bound; assembled inequality holds at Q = 10, 30, 100, 300, 547 with
ratio <= 7.0e-7. Consistent with the lane. Same limit as the lane states: the assembled inequality is far from
sharp and does not test the exponent.

## Controls

No zeta-only mechanism is claimed. Checked that the lane's control statements are right: Lemma U, U-stab, U-slope
use only "zeros of L are poles of 1/L" and the supremum, so they hold for any family in the format (no separation);
(iv-a) is coefficient-blind; Theorem 2 concerns thin twists relative to zeta. R3 false is the correct setting.

## Errors and gaps

- **E1 (false sentence, not load-bearing).** REFEREE2 of the angular lane, section 2 item 2, and RESULT section 2:
  "at finite places ... K_v^*/F_v^* is compact and totally disconnected, so the local character has finite order".
  True at inert and ramified places. False at split places: K_v = F_v x F_v, K_v^*/F_v^* is isomorphic to F_v^*,
  not compact, and the local component of lambda^(6k) there is (chi_1, chi_1^-1) with chi_1 unramified of infinite
  order (value (pi/conj pi)^(6k) at the uniformiser). Froehlich-Queyrut Theorem 3 as printed (finite order) does
  not cover it. The conclusion W = chi(Delta) at split places is still true by the classical identity
  eps(chi_1) eps(chi_1^-1) = chi_1(-1), which holds for all quasi-characters; so the repair is one more classical
  input (besides the archimedean value), not zero. The lane's root number +1 does not depend on this (theta
  inversion, re-derived: i^(-6k) times i^(6k)). Map row Z22 cites Froehlich-Queyrut only for finite order and is
  unaffected.
- **E2 (provenance).** `engine_run.log` records the `generate.py --top 60` step as failed ("can't open file
  '.../generate.py --top 60'", an argument-quoting error). The counts 36,447 / 27,557 / 8,890 come from a separate
  run logged in `generate_top60.log`. They match, and IDEA_GRAPH.json has 1,592 nodes and 8,621 edges as claimed
  (checked), but RESULT section 6 presents one clean rerun; the failed invocation should be mentioned.
- **E3 (count).** "24 cases" in step (ii): p = 3 lists k = 1 twice and p = 5 lists k = 2 twice ((p-1)/2 coincides);
  22 distinct cases.
- **E4 (unstated line).** Lemma U step 6 with beta* = 1/2: needs beta_eta >= 1/2. One line; true.
- **E5 (necessity example incomplete as written).** H(s) = L(s)/L(s + delta) omits the factor
  exp((s + delta - 5/6)^2 - (s - 5/6)^2) produced by the shift, and H is holomorphic on Re s > sigma_0 only for
  delta > beta_eta - sigma_0. With both amendments the example stands (H vanishes at the zeros, so the constant is
  not fixed without abs(H - 1) <= 1/2).

## Not verified here

- Coleman 1990 Theorem 2.1: primary text not opened by the lane or by this referee. arXiv:2008.09677 exists with
  the stated title and authors and its abstract names Coleman; the exponents 19/24, 5/24 were not seen by this
  referee. The lane's label (located, second-hand) is the right one. The reading "ideal class group mod f = ray
  class group" and uniformity in h remain open, as the lane states.
- The consequence for Theorem 2 of `c5-thin-walk-replay` (zero-free region max(b - 5/24 + eps, b/3)) was not
  re-derived.
- Froehlich-Queyrut page scans were not reopened; statements quoted agree with the standard form of that paper.
- Map: line counts 471 -> 490 and the row count 155 (P 49, G 26, Q 22, S 12, Z 23, F 8, T 3, L 5, D 7) were
  recounted and agree. Row texts D1-D7 were not compared word by word against the device lane's referee.
- LP values in row Z15b (7/9, 1/3, 2/3) not rerun (the lane says the same).

## Surviving claim

Lemma U confirmed by a third derivation; U-stab and U-slope hold (exception: beta* > 1/2 an isolated real top zero
across the family); (iv-a), Lemma A (c), Theorem 2 and its corollary (largest real zero) hold; Theorem 7 (iv)
ARGUED; Coleman input second-hand; bookkeeping counts agree. Correct E1 and note E2, E3, E5. No score change, no
statement about zeros.
