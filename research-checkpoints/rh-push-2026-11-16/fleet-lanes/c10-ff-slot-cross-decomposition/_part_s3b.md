
### 3.1 Outcome of the rules (`rules.txt`)

| rule | statement | outcome |
|---|---|---|
| A | abs(s - 1) <= 0.05, real vectors, lam >= 7 | **HOLDS**: 288 vector-configurations, largest 2.4e-3 ((3, 7, 1), `one`). By mark length: lam 7, 8: <= 2.4e-3; 9, 10: <= 6.0e-4; 11, 12: <= 6.5e-5. Not in the rule: lam 5, 6: <= 0.11; lam 3, 4: <= 0.19 |
| B | -1.05 <= c_perp <= 1.5 for a, b / c4, mu, class U; for mu abs(c/beta - 1) <= 0.1 where beta >= 10 | **FAILS**: 593 of 596; violations q = 7 (2, 12, 1) b: 4.45; (2, 12, 1) seed U2: 8.13; (2, 11, 2) mu: 1.66. The second clause holds in 26 of 26 |
| C | sb <= 2 dim/q^d, real vectors, lam >= 7 | **HOLDS**: 288 of 288; largest sb = 0.51 of the bound |
| D (i) | class r: mean cross within max(3 standard errors, 0.02) of 0 in at least 90% of the F configurations | **HOLDS**: 50 of 51 (outside: (3, 7, 1), 7 rows, mean -0.28 +- 0.06) |
| D (ii) | slot-sign classes: mean e within max(3 standard errors, 0.02) of s in at least 90% | **HOLDS**: 97 of 102 |
| D (iii) | target a separated from class U in c_perp | 1 of 51 configurations: not separated |
| completed rows | rule B fails with span{v_0, v_1} where the cube term is active and holds with the enlarged span | **as registered**: 37 violations of 218 with span{v_0, v_1} (a, b at (3, 8, 1), (3, 8, 2), (3, 9, 2): 4.2 to 6.3; a, c4 at q = 13 (3, 6, .): 1.7 to 2.1; 26 of class U); 0 of 218 with the enlarged span |

Outcome by the rule of PREREG section 4: A, C, D hold; B fails for b (and for one U seed and for mu at one size
each). **The label "EXCESS = COHERENT CROSS" is not awarded.** Named as the rule requires: configuration (2, 12, 1),
q = 7, vector b, c_perp = 4.45 (n = 5.31); the term is identified post hoc in section 4.

Non-coherent part n = e - beta over all squarefree configurations: a: 58 values, median 0.41, max 1.44; b: 40,
0.49, 5.31; c4: 18, 0.44, 1.47; mu: 58, 0.00, 2.62; class U: 422, 0.47, 8.98; `one`: 58, 0.00, 9.06. For the real
multiplicative vectors n is below 1 in the median: the cross term is negative when no squared signal is active
(c = n - s + beta). In 49 vector-configurations (one, a, b / c4, mu) the rows vanish identically (e = 0, c = -s):
the lower bound Off >= -D of c9 Lemma 0 is attained. For d = 1 and the vectors `one`, `mu`: n = 0 exactly (Remark X5).

Predictions of PREREG section 5: 1 (s) HIT; 2 (c_perp of the targets in [-1, 0.6]) MISS in 1 of 116 (b at
(2, 12, 1)); 3 (a at (2, 12, 1): beta in [18, 21.5], c_coh/c in [0.9, 1.1]) HIT (19.43; 0.982); 4 (`one` at (2, 8, 3):
the missing term is in beta) MISS (beta = 0.87, e = 9.28); 5 (every slot-signed vector within 3/sqrt(q^d) of s)
MISS in 2 of 844 (one seed each at (2, 4, 3) and (3, 7, 1)); 6 (class U: beta spread by more than a factor 3 in
every active configuration; a not separated) MISS in 1 of 27 for the spread, HIT for the separation.

### 3.2 Reading

- **Is the model excess (up to 20.6) the cross term? Yes.** In the 32 excess vector-configurations (e >= 2;
  one, a, b / c4, mu, class U) with lam >= 10, c/(e - 1) is between 0.99997 and 1.00005; in the 55 with lam >= 7,
  between 0.9992 and 1.0001. The slot-diagonal part is the diagonal (Lemma X3), and with random signs on the
  marked primes the same vector returns to the diagonal (Table 3): a at (2, 12, 1) from 20.6 to 1.01 and 0.50;
  a at q = 13 (2, 7, 2) from 2.34 to 0.90 .. 1.12 (8 seeds); mu there from 269.6 to 1.02 .. 1.12.
- **Is Cross = B_coh + O(diagonal)?** For the first target: yes in all 58 configurations, with the O-term between
  -0.95 and +0.58 (Table 1: a at (2, 12, 1): 19.64 = 19.28 + 0.36). For mu and class U: yes except in one
  configuration each (largest O-term otherwise +1.37 and +1.04). For the second target at the largest size: no;
  the remainder is 4.45 diagonals and is another squared signal (section 4).
- **(CROSS) of c9 in the model.** With s = 1 the named input (CROSS) of `c9-mv6-window-statement` is (E-K)
  itself up to O(N q^(N - lam/2)), and in the data it holds for a vector when every squared signal of the vector is
  O(diagonal) (the remainder n is at most about 1.5 after the signals of section 4; `one` at d = 3 excepted). For Weil targets it fails where c9 found it failing; nothing is added to or taken from that verdict.
- **Class U against the target.** The random multiplicative vectors show the same split as the target: s = 1,
  negative non-coherent cross, a squared signal whose size varies by seed (beta from 0 to 65). The target is
  inside the class range in 50 of 51 configurations. The statistic does not read the target's Euler product.

