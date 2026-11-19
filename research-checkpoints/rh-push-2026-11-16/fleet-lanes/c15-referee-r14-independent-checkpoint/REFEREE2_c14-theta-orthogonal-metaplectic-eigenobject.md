# REFEREE2: c14-theta-orthogonal-metaplectic-eigenobject

Independent referee, 2026-11-19; verdicts formed before the lane's REFEREE.md was opened. Not a statement about
zeros of zeta.

## Verdict: HOLDS WITH SCOPE LINE (one sentence false as written, not a lemma)

False as written (RESULT, answer line 1, and step T0): "Theta-orthogonality (vanishing of the row D = 1) is one
linear condition, b(1) = 0, propagated to the whole row by the Hecke relation at squares (Lemma 2)."
Lemma 2 is stated for odd p, so b(1) = 0 gives b(n^2) = 0 for odd n only. Counter-example to the literal sentence,
derived from the lane's own formula: A(1, s) carries the factor 1 + 2^(1-u); at u = 1 + i pi (2k+1)/log 2 it
vanishes with zeta(u) != 0, while A(4, s) = W_1(s) zeta(u)/((1 + 2^(-u)) zeta(2u)) does not. Correct sentence:
"the row vanishes at s_rho because every A(n^2, s) carries the factor zeta(u) (Lemma 1'); b(1) = 0 alone gives
the odd squares." The vanishing of the full row at zeros of zeta, and everything downstream, is unaffected.

Scope line (exact): "Lemma E (i), (ii) are proved; (iii) and Lemma 3 (pole positions of the Rankin-Selberg
function) are relative to the regularised Rankin-Selberg method for several cusps and half-integral weight, not
opened; the count (C) is relative to the c13 reconstruction of the Luo-Rudnick-Sarnak threshold. Lemma E closes
the LRS-type count on rank-one objects; it is not a statement about every inequality on such objects."

## Coefficient formula and Lemma 1' (PROVED): hold

Re-derivation of A(1, s) from the lane's case values: the 2-part is (1+i) 2^(-4s) (a = 2) + 4 e^(i pi/4) 2^(-6s)
(a = 3) = (1+i) 2^(-4s) (1 + 2^(3/2 - 2s)) = (1+i) 2^(-4s) (1 + 2^(1-u)); odd part prod_{p odd} (1 + p^(-u)) =
zeta(u)/((1 + 2^(-u)) zeta(2u)). For n = 2 n': W_1 = (1+i)(2^(-4s) + 4 * 2^(-8s)) + 16 e^(i pi/4) 2^(-10s). At
p | n' with v_p(n^2) = 2: local factor 1 + phi(p^2) x^2 + p^(5/2) x^3, x = p^(-2s), divisible by 1 + p^(1/2) x
(value at x = -p^(-1/2): 1 + (p - 1) - p = 0).
Independent numerical check (`ref2_checks.json` item3): K(m, c) computed from the definition (own Jacobi symbol,
sum over odd d mod c), series over c = 4, 8, ..., at s = 1.8, two truncations:

| m | closed form (real = imaginary part) | abs. difference, c <= 800 | c <= 1600 |
|---|---|---|---|
| 1 | 0.00875800811 | 5.5e-8 | 1.3e-8 |
| 4 (even square) | 0.00733977903 | 5.4e-8 | 1.3e-8 |
| 9 | 0.00849631722 | 5.4e-8 | 1.3e-8 |
| 36 (even square) | 0.00712046508 | 5.7e-8 | 1.3e-8 |
| 0 (constant term) | 0.00700840535 | 2.4e-8 | 5.6e-9 |

The differences fall by the factor expected from the tail (about 4.3 = 2^2.1) between the truncations. The check
is at s = 1.8, in the region of convergence; the values at s_rho are continuations and were not summed by me.
Not re-derived: the four case values of eps_r (2/r)^a U_a(4^j, r) for general j (used for j = 0, 1 through the
series check only); Lemma 1 (factorisation of K) in general; "only the trivial character mod 8 occurs" for
non-square m (the lane labels it MEASURED).

## Lemma E (PROVED; (iii) relative): holds with the scope line

(i) The zero mode of a weight-k eigenfunction satisfies -y^2 f'' = s(1-s) f: span of y^s, y^(1-s) (s != 1/2).
(ii) If the exponent of larger real part is absent at every cusp, abs(F)^2 is O(y^(2 sigma_min)) in each cusp
with 2 sigma_min < 1, so F is square-integrable, the boundary term of Green's formula is O(Y^(2 sigma_min - 1)),
and the eigenvalue s(1-s) is real; Im s(1-s) = tau (1 - 2 sigma). Correct. It also covers cusps where the
multiplier is not singular (no zero mode there) and forms with no zero mode at all.
(iii) Gamma pole: abs(W)^2 y^(w-2) with W of order y^(sigma_min) at 0 is integrable iff Re w > 1 - 2 sigma_min =
abs(2 sigma - 1). Correct. Pole at 2 sigma_max with a positive coefficient: needs the regularised unfolding and
phi_{inf,c}(w) > 0 for real w > 1 (a Dirichlet series with non-negative coefficients and a positive gamma ratio;
correct). P - beta_0 = 1.
Inequality (C): P - 1 <= w*(P, d) iff 0 <= (d-1)/2 + (d-2)(P-1); grid minimum of w*(1 + b, d) - b over d in
{2, 3, 4, 6, 9, 16}, b in [0, 1/2]: 0.2 (item3). Algebra holds.

## Lemma V

Not re-derived in full. One point checked on paper: with the stated twist formula and the principal character
mod q the Gauss sum is the Ramanujan sum, so "F x chi_q^2" has multiplier -(q-1) at q | m, not 0; the stated
coefficients b(m) 1[(m/q) = -1] need F - (1/q) sum_j F(z + j/q) in its place. Level and multiplier of f_q remain
relative to Shimura 1973 (not opened). Lemma V is used only for the control NR-vec, which no flag depends on.

## Label restrictions

1. Replace the "one linear condition b(1) = 0" sentence in the verdict, in T0, in MAP_ROW.md and in the record
   line by the Lemma 1' form.
2. Lemma V: "the global Whittaker functional equals zeta(2s - 1/2)/zeta(4s - 1) times non-zero local functionals"
   is wrong at the prime 2 for the level-4 vector (the factor 1 + 2^(1-u) vanishes on Re u = 1); restrict to
   "times local factors that are non-zero at s_rho".
3. Lemma 3 and Lemma E (iii): PROVED-rel, source not opened; pole positions MEASURED over one decade.
4. Lemma V: repair the definition of f_q; "PROVED relative to Shimura" applies to level and multiplier only.

## Comparison with the lane's REFEREE.md (read afterwards)

Its corrections 1 and 2 are the two points above (it also measured the 2-adic zero numerically). No disagreement.
