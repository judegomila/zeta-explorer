# REFEREE: n4-spin-order-two-rows (2026-11-17)

Verdict under review: precise-obstruction. **Referee verdict: holds, with corrections to wording and to two
statistical statements.** No PROVED step failed. No statement about zeros is made; nothing assumes RH or restates
verified height. The obstruction is real but shallow: Lemma 1 is in the literature, and Proposition 4 has a
one-line proof that the result does not give.

## 1. Re-derivation of the PROVED steps

**Lemma 1.** Bimultiplicativity of (x/b) in both arguments gives it directly. Confirmed. Not new: it is the
twisted multiplicativity of spin in Friedlander-Iwaniec-Mazur-Rubin (Invent. Math. 2013, section 3). The result
says "new relative to the map", which is accurate; it is not new relative to the literature.

**Lemma 2.** Re-derived line by line.
- a sigma(a) sigma^2(a) = (N alpha), so (beta/a)(beta/sigma a)(beta/sigma^2 a) = (beta/(N alpha)). Correct; needs
  beta prime to N alpha (stated).
- (beta/(n)) = Jacobi(N beta/n): split p: beta mod sigma^i(p_1) corresponds to sigma^{-i}(beta) mod p_1, product of
  the three Legendre symbols is that of N beta. Inert p: the norm F_{p^3}* -> F_p* is x -> x^{p^2+p+1}, odd exponent,
  so it preserves the non-square class. Ramified p (not treated in the result): (p) = P^3, residue field F_p,
  N beta = beta^3 mod P, and (beta/P)^3 = (beta/P). Correct in all three cases.
- (alpha/sigma b) = (sigma^2 alpha/b) by applying sigma^2. Then B = (beta/a) Jacobi(N beta/N alpha) R(sigma^2 alpha, beta).
  Correct.
- The statement that R depends only on classes mod 4 is labelled MEASURED. It is CLASSICAL and I confirm it: for
  coprime odd totally positive x, y, reciprocity gives R(x, y) = (x, y)_2, the Hilbert symbol at the single place
  above 2 (2 is inert; real places give 1). On units of the unramified cubic extension K_2 of Q_2 the symbol
  factors through U/(U^2 (1+4O)) = (1+2O)/(1+4O) = (Z/2)^3, because u = 1 mod 4 makes K_2(sqrt u)/K_2 unramified
  and every unit is a norm from an unramified extension. It is non-degenerate there, giving 7 x 4 = 28 of 64
  pairs, i.e. 7/16 = 1372/3136. The measured count matches the derived one.

**Lemma 3.** (alpha/sigma b) = (sigma^2 alpha/b) and sigma-stability of the index set give M_sigma = P M_id.
Correct (it is a relabelling of one index; whether it is called a row or a column permutation depends on which
index carries the generator). Same singular values follow. The Poisson statement follows from the same
relabelling. Requires that the symbol is well defined on ideals, i.e. totally positive units are squares; true
here (8 sign patterns confirmed independently).

**Proposition 4.** Correct, with these repairs.
- (ii) as written is vacuous in a way the result does not notice: spin(p sigma(p)) = 0 for every split p, while
  mu psi_2 is non-zero there. So "spin x psi_1 = mu x psi_2 on squarefree ideals prime to a modulus" fails already
  on p sigma(p), for every modulus, with no cocycle computation and no Chebotarev. The cocycle argument is needed
  only for the fair version restricted to ideals with (a, sigma a) = 1; that set is not multiplicatively closed,
  so the correct statement is "B(p, q) = 1 for all primes p, q of distinct residue characteristic".
- (iii) is valid only for split p. For inert or ramified p, sigma(p) = sigma^2(p) = p and the recipe (non-residue
  mod sigma p, = 1 mod sigma^2 p) is contradictory. Split primes suffice for the conclusion.
- The non-triviality step, written out: for split p = (alpha) take beta = 1 mod 4, beta = 1 mod sigma^2(p), beta a
  non-residue mod sigma(p) (CRT; the three moduli are pairwise coprime), then add a large rational multiple of
  4 N(alpha) to make beta totally positive. Then R(sigma^2 alpha, beta) = 1 by the Hilbert-symbol fact above, and
  B(p, (beta)) = (beta/sigma p)(beta/sigma^2 p) R = -1. This closes weakest step 1 of the result. The map
  q -> B(p, q) is a character mod 4 sigma(p) sigma^2(p) trivial on unit squares, so Chebotarev gives -1 on half
  the primes.
- Hypothesis that must stay explicit: psi_1, psi_2 non-vanishing (or supported on a positive-density set of
  primes). B is symmetric, so by Ramsey there are infinite (thin) sets of primes on which B = 1 identically; on
  such a set spin restricted is multiplicative. This does not affect the obstruction but the sentence "no product
  of spin with any multiplicative function is multiplicative" is false without the non-vanishing hypothesis.

**No-go (bicharacter cocycle).** Correct and elementary: s^2 = 1, so the monoid is {psi, psi s}; s psi_1 = mu psi_2
with non-vanishing psi_i forces s multiplicative, i.e. B = 1 on coprime pairs; conversely s = mu (mu s). It is a
tautology (a product of multiplicative functions is multiplicative); it carries no information beyond the
definition and should not be counted as a result.

## 2. Independent numeric check, different case

Own code (/tmp/ref_n4spin/ref.py, not the lane's test1.py), exact integers, run through `scripts/memcap.sh 8`,
single process, under 1 minute each. Different fields and different sampling: totally positive elements
a + b theta + c theta^2 drawn from a box (norms up to 3.7e5), symbols by Legendre symbols at degree-1 primes
and by direct exponentiation in F_p[theta] at inert primes (not by the norm shortcut), sigma found by solving for
the Galois action. 200000 random pairs per field.

| field | Lemma 1 failures / tested | Lemma 2 failures / coprime pairs | norm step failures | Lemma 3 identity failures | B = -1 | R classes: seen, non-constant, with -1 | explicit beta of Prop 4(iii) |
|---|---|---|---|---|---|---|---|
| conductor 9, x^3 - 3x + 1 | 0 / 198501 | 0 / 163352 | 0 | 0 / 200000 | 49.6% | 3136, 0, 1372 | 25 of 25 primes: B = -1, R = +1 |
| conductor 13, x^3 + x^2 - 4x + 1 | 0 / 184414 | 0 / 156582 | 0 | 0 / 200000 | 49.8% | 3136, 0, 1372 | 25 of 25 |
| conductor 7 (the lane's field) | 0 / 197848 | 0 / 181207 | 0 | 0 / 200000 | 49.3% | 3136, 0, 1372 | 25 of 25 |

Also in all three: R = +1 whenever one argument is 1 mod 4 (0 violations); spin x spin' constant on all 56
classes mod 4; spin(sigma a) = spin(a) with 0 failures; 8 unit sign patterns; 2 inert. Mean of spin x mu on
squarefree-ideal samples (n about 1800 to 2300): 0.014, 0.002, 0.022 against 1/sqrt(n) about 0.021 to 0.024.
The SVD table was not rerun; it is implied by the exact entrywise identity of Lemma 3, which was checked.

## 3. Errors and overstatements found

1. **Significance of the correlation table is misstated.** spin and mu are both sigma-invariant, so squarefree
   ideals come in Galois orbits of three with equal values (the result's own side check proves this). The
   effective sample is n/3, and the coin-model z for spin x mu is 2.49/sqrt(3) = 1.44, not 2.49. "Two to three
   coin-model standard deviations" (weakest step 3) should read "about 1.5". The same correction applies to the
   2e4 prime sum (+123: 2.6 becomes 1.5), so the remark that it "is not present at 2e5" describes noise.
2. **The spin x Liouville row is biased and mislabelled.** The table says "all odd ideals" (52570) but the log has
   n = 41856 (ideals with spin != 0). On a = b^2 c the value is spin(c)-type and square ideals have
   spin x Liouville = +1, which gives a positive bias of order N^{-1/2}; the 3.4 sigma there is not evidence of
   correlation with Liouville and should not be read either way.
3. **Proposition 4 statement** needs the repairs in section 1 (split p; coprime residue characteristics;
   non-vanishing psi). As stated in the verdict paragraph ("no product of spin with any multiplicative function is
   multiplicative") it is too strong.
4. **Novelty.** Lemma 1 is FIMR. Lemma 2's reduction is one application of the product formula a sigma(a)
   sigma^2(a) = (N alpha) plus reciprocity; FIMR use the same reciprocity step with a fixed 2-power modulus.
   Lemma 3 is a relabelling. Proposition 4 follows from spin(p sigma p) = 0 in one line. The FIMR recall
   (cyclic totally real K, totally positive units squares, unconditional for degree 3 with exponent 1/10656)
   agrees with my memory of the paper; neither of us re-read it. Nothing here is a known theorem presented as a
   new theorem, but the "PROVED" items are exercises, not results.
5. **"Parity / no signal" paragraph** ("if an absorption identity existed, the same theorem would give a zero-free
   strip for a Hecke L-function") is a heuristic, not a statement with a proof; it should be labelled ARGUED.
6. The pivot section examined three ideas on paper and ran none. Item 2 ("not a Frobenius class function ... in
   any usable sense") is asserted, not proved; FIMR's equidistribution of spin does imply it is not a class
   function of any fixed finite extension, which could have been said precisely.

## 4. Controls

The result claims no zeta-only mechanism and makes no zero statement, so there is nothing for Davenport-Heilbronn,
backward heat or the sign twist to break; I ran none and agree none applies. The row has no main term against
mu for zeta, so it does not separate zeta from any control. This is consistent with the campaign wall: a
{0, +-1} symbol has no power at which mu appears, so order 2 gives no analogue of g^3 = mu(c) c^2 c-bar.

## 5. What survives

For the cyclic cubic fields of conductor 7 (and, by my check, 9 and 13): the spin cocycle is
(beta/a) x Jacobi(N beta/N alpha) x (sigma^2 alpha, beta)_2, with the last factor a non-degenerate pairing on
classes mod 4; it is -1 on half of all pairs of split primes of distinct residue characteristic (PROVED with the
completed non-triviality step, given Chebotarev); the bilinear matrix of spin is a relabelling of the plain
quadratic symbol matrix; spin times a non-vanishing multiplicative function is never mu times a Hecke character
(trivially, from spin(p sigma p) = 0, and also on the coprime-to-conjugates set by the cocycle). Spin is not an
effective order-2 object for the 7/8 method: no signal term. The measured correlation with mu is at noise level
(about 1.5 orbit-corrected standard deviations at norm 2e5). No route, no model abscissa, RH open.
