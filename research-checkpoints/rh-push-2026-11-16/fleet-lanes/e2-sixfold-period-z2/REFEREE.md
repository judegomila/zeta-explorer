# REFEREE: e2-sixfold-period-z2

Date 2026-11-18. Adversarial referee. Scope: RESULT.md in this directory. Scripts of this report were run from
`/tmp/ref-e2z2/` (`chk.py`, `t2.py`) through `scripts/memcap.sh 8` with `.venv-arb/bin/python`; nothing was written
here except this file. Compute server not used.

## Verdict of the referee

**The verdict "dead" stands, on S3 alone. The claim as worded does not hold: two labelled steps fail.**

- S3 (signal entry = modulus scalar x Gram entry): CONFIRMED, re-derived and checked on new cases.
- S2: the algebra is correct; the conclusion drawn from it ("exceptional term has index 0, same as the principal
  signal, separation refuted") is NOT confirmed. It identifies the exceptional term with the diagonal Gram
  summand, which contradicts the manuscript.
- S3' (PROVED-rel label): the displayed chain of equalities is FALSE as written (two different errors).
  A corrected identity holds.
- S1, S4: confirmed as elementary/classical statements with the caveats below.
- T2: reproduced; "splits evenly as a random half would" is too strong.
- No step assumes RH, none restates verified height, no statement about zeros is made. S1 and "G depends on c mod 4"
  are classical facts and are not presented as new theorems (the second is under-labelled as MEASURED).

## 1. Errors

### E1 (main). The object tested in T1/S2 is not the exceptional term

RESULT S2: "The diagonal of the Gram form (source of the exceptional term) ... index 0"; T1 table row
"Gram summand abs(a)^2 (exceptional term)".

Manuscript, proof of Prop 15.2 (paper.txt lines 6316-6455): the expanded square is over pairs s1 = C n1,
s2 = C n2 with (n1, n2) = 1, followed by Poisson in the row variable with dual frequency k.
- "The frequency k = 0 contributes only the diagonal: the correlation forces n1 = n2 = 1 ... Its contribution is
  O(Q/Y')." This is the term 1 in the bracket of (15.4).
- The P_a^(1/6) term is the count of nonzero frequencies k = a1^6 e (e supported on C and the fixed support)
  times the trivial two-column point count over all (n1, n2), i.e. it comes from k != 0 and is dominated by
  off-diagonal pairs.

Consequences.
1. |a_pi(m)|^2 = 1 identically for (m, pi) = 1. Its "index 0 with leakage 1e-30" is a property of the constant
   function. The same holds for a b at s = c (= chi(-1) mu alpha G, constant). The T1 rows `gram` and `signal`
   are definitional identities; they are not evidence about the exceptional term, and the calibration and
   random-phase rows are likewise forced by the definitions (a = conj(chi(-m)) gamma_1 has index 5 by inspection).
2. By RESULT's own S2, an off-diagonal Gram entry a_s1 conj(a_s2) has index -1 / +1 at the primes of the
   symmetric difference: it is Z/2-ODD there. Checked (chk.py, s = 5*7, c = 7*13, 5 inert): under u = 1 mod 35
   the Gram and signal entries are both multiplied by chi_13(u)^(+1), including the value -1 at u = 281.
   So in grading (i) the entries that carry the exceptional term are odd on the symmetric difference and the
   principal row s = c is even. The sentence "same Z/2 character: the separation is refuted" is therefore the
   opposite of what S2 gives for the entries in question. What prevents a use of this is not a character
   coincidence: the unit group depends on the pair of moduli, the row sum has length Q <= Y'^2 (incomplete), and the
   manuscript's exceptional condition is on v_p(k) mod 6 of the dual frequency at primes OUTSIDE the moduli.
3. "The manuscript's exceptional frequencies are those with e_p = 0 mod 6, again index 0" merges the unit-action
   grading on m at primes of the modulus with the valuation grading of the frequency k at primes outside C. This
   is the same merge the referee of h-metaplectic-spin flagged (its item 2); section 1 of RESULT states that the
   gradings were separated, but S2 re-merges (i) with the frequency grading. No map between them is given.

Required change: delete "MEASURED ... the Gram summand and the signal summand both have Z/6 index 0" as support for
the verdict; relabel T1 as a convention check; restate S2 as "diagonal entries even, off-diagonal entries odd on
the symmetric difference, identically for the Gram and signal forms".

### E2. S3' is false as displayed

RESULT: `gamma_2(c) chi_c(m) G(c) = gt_2(m, c) * gt_3(4m, c) = mu(c) alpha(c) conj(gt_1(m, c))`.

Re-derivation from the definitions gt_j(y, c) = conj(chi_c(y))^j gamma_j(c), G = conj(chi_c(4)) gamma_3:
- gt_3(4m, c) = chi_c(4)^(-3) chi_c(m)^3 gamma_3 = chi_c(m)^3 gamma_3, because chi_c(4)^3 = chi_c(2)^6 = 1.
  So the middle expression is gamma_2 chi_c(m) gamma_3 = (left side) x chi_c(4). chi_c(4) is a cube root of unity,
  not 1 in general.
- Lemma L gives mu alpha conj(gamma_1) = gamma_2 conj(G), so the right expression is gamma_2 chi_c(m) conj(G) =
  (left side) x conj(G)^2. G^2 != 1 in general (G is a 12th root of unity).

Brute-force Gauss sums (chk.py, 7 moduli, 7 row values each):

| modulus | chi_c(4) | G | left - middle | left - right | corrected forms |
|---|---|---|---|---|---|
| 7 | zeta_3^2 | e(7/12) | 1.732 | 1.000 | < 1e-14 |
| 5(inert) x 7 | zeta_3^2 | e(1/12) | 1.732 | 1.000 | < 2e-14 |
| 7 x 13 | 1 | -i | 0 | 2.000 | < 5e-14 |
| 13 x 19 | zeta_3^2 | e(1/12) | 1.732 | 1.000 | < 6e-14 |
| 5(inert) x 13 | zeta_3 | zeta_3^2 | 1.732 | 1.732 | < 2e-14 |

Corrected identity (holds to 1e-13 on all cases, and follows from (4.7)):

  `gt_2(m, c) * G(c) chi_c(m)^3 = gamma_2(c) chi_c(m) G(c) = mu(c) alpha(c) G(c)^2 conj(gt_1(m, c))`.

The constant of the triple relation is mu(c) alpha(c) G(c)^2, a Moebius sign times a unit-modulus ray-class factor;
"mu(c) as its constant" is correct only up to that factor. The qualitative reading (cubic x quadratic x sextic,
2 + 3 + 1 = 0 mod 6, Hasse-Davenport) survives. The scripts did not catch this because `hd_nodes.py` and
`z6char.py` test Lemma L and (4.7), not the S3' chain.

### E3. T2: "as a random half would" is not what the data show

Rerun (t2.py) with the half-difference fitted directly (it equals the first moment at index y^4, as the script's
own docstring states) and with a second, disjoint set of indices.

| indices | mean z^2 all | even | odd | difference (index y^4) | random-sign difference |
|---|---|---|---|---|---|
| 44, norm <= 200 (original) | 38.58 | 20.85 | 20.91 | 3.27 (5 indices z > 3) | 0.72 (0 indices) |
| 33, norm 200..400 (new) | 25.91 | 13.19 | 14.13 | 1.48 (0 indices) | 0.94 (0 indices) |

The originals are reproduced exactly. The difference of the halves is above the random-sign control (4.5x at
small norm, 5 of 44 indices above 3 sigma against 0) and decays with the norm of pi. This is not unexplained
(RESULT weakest step 3): it is the theta coefficient at y^4, whose grade at pi is 4, linked to grade 0 by the
note's own S4, hence non-zero and of lower order in N(pi). Correct statement: the two Z/2 classes of moduli carry
(rho(y) +- rho(y^4))/2; the split is even up to a non-zero lower-order theta coefficient. The conclusion "the Z/2
class of the modulus does not isolate the residue" stands. Float64 fits, not interval-certified (admitted).

### E4. Smaller points

1. S3 scalar: the derivation gives conj(chi_c(-1)), not chi_c(-1). Equal, because chi_c(-1) = +-1. Not an error
   in value; the note should say so.
2. "G takes twelve values, one per class of c mod 4": twelve classes, nine distinct values (classes 0/1, 2/8, 3/11
   coincide in `hd_nodes.json`; same on the 1e7 table). That G is a function of c mod 4 is classical (quadratic
   Gauss sum over Q(omega) and cubic reciprocity for chi_c(4) = cubic symbol of 2), consistent with the manuscript
   calling G a "finite-ray function" at (4.7). Checked on a different case: 2,822,619 moduli of `sf_1e7.npz`,
   deviation within class 4.1e-9.
3. T1 uses split primes only; S2/S3 are stated for all squarefree moduli. chk.py includes the inert prime 5 and
   composite moduli: S3 error <= 7e-14, (4.7) error <= 7e-15.
4. S4: 4 - 5 = 5 mod 6, so grade 5 is also a fixed point of the reflection; its vanishing is an input from the
   cited Theorem C (as corrected by that lane's referee), not a consequence of the arithmetic. The arithmetic
   (j -> 4 - j fixes j mod 2, acts as j -> 1 - j mod 3) is correct. Theorem C itself was not re-derived from
   primary sources by either lane.
5. S1: correct and elementary (a product of types with total index odd is odd under -1 in mu_6). It refutes the
   literal integrand of the assignment only; it is the standard central-character condition, not a new result,
   and RESULT's weakest step 2 already notes that other realisations were not excluded.

## 2. Re-derivation of S3 (the step the verdict rests on)

From (4.7): gamma_2^3 = mu alpha, gamma_1 gamma_2 = mu alpha G, |G| = |gamma_2| = 1. Then
mu alpha G conj(gamma_1) = gamma_2^3 G conj(G) gamma_2^(-2) = gamma_2 (Lemma L). With
a_c(m) = conj(chi_c(-m)) gamma_1(c) and b_c(m) = gamma_2 alpha G Psi chi_c(m):

  b_c(m) = mu alpha^2 G^2 Psi chi_c(m) conj(gamma_1) = mu alpha^2 G^2 Psi conj(chi_c(-1)) conj(a_c(m)).

The scalar depends on c only. Summing against any w(m) a_s(m) gives the displayed identity for every pair (s, c),
diagonal or not. CONFIRMED (PROVED-rel (4.7), squarefree c, (m, c) = 1, n = 1 part of the row). Numerical check
on cases not in the lane's runs (inert prime, composite moduli, off-diagonal pair): agreement to 7e-14.

What S3 does and does not give. It gives: the signal form is the Gram form with the second argument weighted by
lambda(c) = mu alpha^2 G^2 Psi chi_c(-1); any linear operation on the row variable, including the Poisson
decomposition into exceptional and non-exceptional frequencies, acts on the two forms through the same matrix.
It does not give: that the exceptional-frequency part of the signal is non-zero or needed. A row-variable
projector that removed the exceptional frequencies would remove the same entries from both forms; whether the
signal survives that removal is decided by the contraction with mu(c) Psi(c) on the modulus index, which the note
does not analyse. The accurate wording of the dead verdict is: "no row-variable grading distinguishes the signal
kernel from the Gram kernel; any separation must come from the modulus weight mu(c) Psi(c), which is the
tro6-period form (MB)". That is a reduction to a known closed item, not a new obstruction.

## 3. Controls

No zeta-only mechanism is claimed, so there is no control run to repeat. The statement in section 6 that S1-S4,
T1, T2 do not contain the target is correct by inspection of the scripts (Psi never appears). The consequence
drawn is correct: a row-variable Z/2 separation could not have met the control requirement.

## 4. Three-requirement and hygiene check

- All primes together / every window / controls: not applicable; nothing about zeros is claimed. Correctly stated.
- RH not assumed. No verified-height input. No bound moved. No global period constructed (stated).
- Limits admitted by the lane and still open: non-squarefree moduli, moduli sharing primes with the row, the n^3
  part of the rows with chi_n(m)^3, rho^natural against the stripped rho.

## 5. Statement that survives

For squarefree moduli prime to m and the n = 1 part of the rows, relative to manuscript (4.7): each entry of the
signal form equals the corresponding entry of the additive Gram form times mu(c) alpha(c)^2 G(c)^2 Psi(c)
chi_c(-1), independent of the row variable; hence no grading of the row variable (the Z/2 factor of Z/6 included)
distinguishes the two kernels, and diagonal entries are even while off-diagonal entries are odd on the symmetric
difference in both. The integrand cubic theta x sextic section x Hecke character is odd under -1 in mu_6 and
integrates to zero; the balanced Gauss-sum triple is gt_2(m,c) x G(c) chi_c(m)^3 = mu alpha G^2 conj(gt_1(m,c)).
G is a function of c mod 4 (classical). On the modulus side both Z/2 classes carry the theta residue, with
difference equal to the coefficient at y^4 (small, non-zero; float64). Not established: that the exceptional
P_a^(1/6) term has a definite Z/6 character in any of the three gradings. Route status: dead, by reduction to
tro6-period (MB).
