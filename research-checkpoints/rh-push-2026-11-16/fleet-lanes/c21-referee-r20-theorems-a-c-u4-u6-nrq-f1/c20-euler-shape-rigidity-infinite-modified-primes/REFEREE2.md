# REFEREE2: c20-euler-shape-rigidity-infinite-modified-primes (Theorems A, C, Corollary A2)

Second referee, lane `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1`, 2026-11-20. Written from `RESULT.md` of the
refereed lane and the map (section 2) only. The lane's `REFEREE.md` (an author pass) was not read. Numerics:
`thmA_ref2.py` -> `thmA_ref2.json`, `thmA_ref2.log` (mpmath 30 digits for point values; float64 only for long Bohr
means and root finding, labelled; local, `scripts/memcap.sh 8`, 10 s). No statement about zeros of zeta.

Labels used below: PROVED-2 (re-derived here, complete; two derivations now exist) / CLASSICAL / CHECKED (30 digits) /
MEASURED (float64) / ARGUED / OPEN.

## Verdict

**Theorem A: holds. Corollary A2: holds. Theorem C (a), (b), (c) and the finite-order clause: hold.**
Three corrections of wording, none touching a proof step used by the lead BR. The footing of the lead BR
(regime split 1 / (K) / 3; "no twin in regime 1"; "a finite-order twin in regime (K) has a zero of G/zeta on the
line") stands.

## 1. Steps re-derived, with labels

| # | Step (lane label) | Re-derivation | Label after this pass |
|---|---|---|---|
| A-i | Under (H) the product N = prod n_p(p^-s) converges absolutely and uniformly on Re s >= 1/2 (PROVED) | abs(p^-s) <= p^(-1/2) on the closed half-plane, so abs(n_p(p^-s) - 1) <= delta_p; Weierstrass M-test for products. N continuous on Re s >= 1/2, analytic inside, abs N <= prod(1 + delta_p) <= exp(sum delta_p). | PROVED-2 |
| A-ii | N -> 1 uniformly as sigma -> +infinity (PROVED) | Schwarz lemma on the disc of radius p^(-1/2): abs(n_p(y) - 1) <= delta_p abs(y) p^(1/2), so abs(n_p(p^-s) - 1) <= delta_p p^(1/2 - sigma) <= delta_p 2^(1/2 - sigma) and abs(N - 1) <= exp(2^(1/2 - sigma) sum delta_p) - 1. This gives the rate, which the lane's "dominated" argument does not state. | PROVED-2 |
| A-iii | (FE) from a meromorphic functional equation of G (PROVED) | N = zeta/G is meromorphic near the line and N(s) = N(1 - s). N is bounded on all of Re s > 1/2, hence N(1 - s) is bounded on all of Re s < 1/2; a meromorphic function bounded on both sides of the line near a point of it has a removable singularity there. Its value on the line is the limit from the right, the boundary value of the product. Note: s -> 1 - s sends 1/2 + it to 1/2 - it, so the boundedness on the left of 1/2 + it comes from the right of 1/2 - it; the global bound covers this. | PROVED-2 |
| A-iv | Reflection: E = N on Re s >= 1/2, N(1 - s) on Re s <= 1/2 is entire (Morera, CLASSICAL) and bounded, so constant (Liouville), equal to 1 | E is continuous on C (the two definitions agree on the line by (FE): N(1 - (1/2 + it)) = N(1/2 - it) = N(1/2 + it)), analytic off the line, so entire; abs E <= exp(sum delta_p); the constant is the limit of A-ii. | PROVED-2 (Morera and Liouville CLASSICAL) |
| A-v | N = 1 implies n_p = 1 for every p (PROVED) | Cauchy on abs y = p^(-1/2): abs c_(p,k) <= delta_p p^(k/2). At sigma = 2: sum_k abs(c_(p,k)) p^(-2k) <= delta_p p^(-3/2)/(1 - p^(-3/2)) <= 0.5470 delta_p (lane: 0.55). So the Dirichlet series of N converges absolutely at sigma = 2 and equals the product there; an absolutely convergent Dirichlet series equal to 1 on a vertical line has c(n) = 0 for n >= 2; c(p^k) = c_(p,k). | PROVED-2 |
| A-deg1 | delta_p = abs(1 - alpha_p) p^(-1/2)/(1 - p^(-1/2)) <= 3.4143 abs(1 - alpha_p) p^(-1/2) | n_p - 1 = (1 - alpha) y/(1 - y); max of abs(y/(1 - y)) on abs y <= r is r/(1 - r), at y = r; 1/(1 - 2^(-1/2)) = 3.41421. | PROVED-2 |
| A-deg d | delta_p <= ((1 + A r)^d - 1 + r)/(1 - r) | n_p - 1 = (prod(1 - alpha_j y) - 1 + y)/(1 - y). | PROVED-2 |
| A2 | sup_t abs(N(1/2 + it) - N(1/2 - it)) >= abs c(n) n^(-1/2), n >= 2 (PROVED) | f(t) = N(1/2 + it) is a uniform limit of finite products of functions F_p(e^(-i t log p)), F_p in the disc algebra with Taylor coefficients c_(p,k) p^(-k/2); each finite product is a uniform limit of trigonometric polynomials with frequencies -log n, and by unique factorisation the coefficient at -log n is c(n) n^(-1/2). Bohr means pass to uniform limits. g(t) = f(-t) has frequencies +log m only, so M{g n^(it)} = 0 for n >= 2. abs M{(f - g) n^(it)} <= sup abs(f - g). | PROVED-2 (uniform limits of Bohr means CLASSICAL) |
| A0 | Lemma A0 (any Dirichlet series, not a product) | Same reflection; the constant is c(1) because a Dirichlet series convergent somewhere tends to c(1) as sigma -> +infinity. | PROVED-2 |
| B | Theorem B via Bohr's inequality | Applied at each sigma > 1/2 and then sigma -> 1/2 by monotone convergence. Domain: N must be a Dirichlet series convergent somewhere (true when the alpha_p are polynomially bounded). | CLASSICAL input, deduction PROVED-2 |
| C-a | m = G/zeta has no zero off the line; zeros of G off the line are zeros of zeta with at most zeta's multiplicity | N is a locally uniform limit of analytic functions on Re s > 1/2, so analytic there; ord m = -ord N <= 0 there; ord G = ord zeta + ord m <= ord zeta. Left half by m(s) = m(1 - s) (both G and zeta have the same functional equation); on Re s < 1/2 the zeros of zeta include the trivial ones. | PROVED-2 |
| C-b | Strip hypothesis with growth exp(exp(k abs t)), k < pi/(2d), gives G = zeta | On the closed strip 1 - sigma_1 <= Re s <= sigma_1 of width w = 2 sigma_1 - 1 < 2d the admissible Phragmen-Lindelof growth is exp(exp(k abs t)) with k < pi/w, and pi/(2d) < pi/w. Edge bound: abs N <= exp(sum_p delta_p(sigma_1)) on Re s = sigma_1, and the same on Re s = 1 - sigma_1 by symmetry. Then N is bounded and entire, limit 1; A-v with Cauchy on abs y = p^(-sigma') for one sigma' in (1/2, 2). | PROVED-2 (Phragmen-Lindelof CLASSICAL) |
| C-fin | Finite-order clause: a twin G != zeta of finite order has a zero of G/zeta on the line | G of finite order (Nevanlinna) gives N = zeta/G of finite order. Poles of N: none in Re s > 1/2 (analytic), none in Re s < 1/2 (symmetry). If m has no zero on the line, N has no pole on the line either, so N is entire of finite order rho: abs N <= C exp(abs(s)^(rho + 1)), which is below exp(exp(k abs t)) in every vertical strip for every k > 0. C-b gives N = 1. | PROVED-2 |
| C-c | abs alpha_p <= p^(1/2): same for m; a finite-order twin has a zero and a pole of G/zeta on the line and none off it | m_p - 1 = (alpha - 1) y/(1 - alpha y); on abs y <= p^-sigma, abs(alpha y) <= p^(1/2 - sigma) <= 2^(1/2 - sigma) < 1, so sup abs(m_p - 1) <= abs(alpha - 1) p^-sigma/(1 - 2^(1/2 - sigma)): the summability for N transfers to m with a constant depending on sigma only. Then C-a and C-b for m. | PROVED-2; bound CHECKED (ratio to the bound at most 1.000 on 60 samples) |
| K | sup_t abs N(sigma + it) = prod_p max over abs y = p^-sigma (Kronecker) | Not re-derived in full (not needed for A, A2, C); statement accepted in the region of uniform convergence. | PROVED (one derivation) |

## 2. Tests on the controls (objects checked not identically zero)

A general statement used for the HQ rows, proved here: **Lemma P (PROVED-2).** Let f = A/B, A, B coprime polynomials
in u with A(0) = B(0) = 1, f(u) = f(1/u), f not constant. Then deg A = deg B >= 1, the root sets of A and of B are
closed under u -> 1/u, and both A and B have a root in abs u <= 1. So for every one-prime symmetric rational factor
both N_q = B/A and m_q = A/B have a pole in the closed disc and (H) fails for N and for m. (Proof: f(infinity) =
f(0) = 1 gives equal degrees; zeros and poles of f in C* are inversion-symmetric; a root r has r or 1/r in the closed
disc; if A were constant then B would be constant.) This is the one-prime content of Theorem A: a symmetric
one-prime factor cannot satisfy (H).

| Control | Object not zero | zeta's FE | (H) for N or m | Agrees with Theorem A |
|---|---|---|---|---|
| E_a, a = 1/4 | abs m = 0.738, 1.352, 1.225 at s = 1/2 + 5i, 0.8 + 11.3i, 1/2 + 20i | fails: abs(m(s) - m(1 - s)) = 0.4704, 1.2110, 2.2708 (own degree-2 equation holds to 1e-34) | fails: sum over p <= 1e3..1e6 of abs c(p) p^(-1/2) = 34.8, 151, 691, 3262; at sigma = 1: 3.7, 5.6, 8.4, 12.6 (divergent); at 1.3: 1.57, 1.73, 1.86, 1.95 | yes; outside both hypotheses. **Correction 1:** the abscissa of the relative product is 1 + a (c(p) = 1 - p^a - p^-a), not 1 as in the lane's table |
| HQ1 (eps = 1, c_q + 2, 6), HQ2 (1e-2), HQ3, HQ4 (0.1, 0.2), q = 2 and 5 | abs m(0.3 + 7.1i) between 0.40 and 3.88 | holds: defect <= 6.4e-31 in all 12 cases | fails for N and for m: least root modulus of numerator / denominator (float64): HQ1 1.000 or 0.841 (q = 2), 0.669 (q = 5), 0.268 / 1.000; HQ2 0.799 / 1.000; HQ3, HQ4 0.933 / 0.871 (q = 2), 0.851 / 0.725 (q = 5); partial sums of abs c(q^k) q^(-k/2) over k <= 60, 120 grow in all 24 cases (slowest: 1/m of HQ1, eps = 1: 40, 80) | yes (Lemma P) |
| DEL, THIN on a sparse set (S1 = lane's set; S2 = next prime after j^6, j = 2..31, 30 primes, sum p^(-1/2) = 0.1986) | abs N(1/2 + i t*) between 0.86 and 1.79 | fails, as Theorem A forces: abs D(t*) at 30 digits = 1.0179 (DEL, S1), 2.2333 (THIN, S1), 0.3961 (DEL, S2), 0.8106 (THIN, S2), 1.4461 and 0.5608 (alpha = i) | holds | yes; A2 bounds 0.3015, 0.6030, 0.1222, 0.2443, 0.4264, 0.1728 are all below the measured sup; float64 Bohr means over [0, 4e4] of N n^(it) at n = p_min and n = p_1 p_2 agree with c(n) n^(-1/2) to 1e-5 in all 12 cases, and the means at n^(-it) are below 2.4e-5 (one-sided spectrum) |
| DEL, THIN of the map (b = 0.75, greedy floor rule, primes to 2e6) | N_DEL(2) = 1.0858, N_THIN(2) = 1.0590 | not available: the relative product does not converge at Re s <= b, so N on the line is not defined by it | fails: sum over S of p^(-1/2) = 4.36, 6.50, 9.49, 13.84, 15.53 at X = 1e3, 1e4, 1e5, 1e6, 2e6 (pi_S = 45, 176, 756, 3433, 5459); at sigma = 0.8: 1.48 .. 1.93 (convergent) | yes; regime 3. Theorem A says nothing here, as the lane states |
| a non-product (Lemma A0): 1 + 0.3 3^-s + (0.2 + 0.1i) 7^-s | - | fails | holds | sup defect 0.5033 >= 0.1732, 0.0845 |

The S2 rows carry a tail bound 0.018 to 0.035 for the primes with j >= 32 (crude); the defect of the infinite set
is positive in every row.

## 3. Corrections (wording; no proof step changes)

1. **E_a row of the controls table:** "sigma_rel = 1" should be "sigma_rel = 1 + a". The row's conclusion (outside
   the hypothesis; functional equation fails) is unchanged.
2. **Item (i), "In Re s > 1 where N != 0 the product of the L_p converges to zeta/N":** when some abs(alpha_p) is
   large the local factor L_p has poles with Re s > 1 (zeros of n_p), so the Dirichlet series of G converges only for
   Re s >= sigma_0 with sigma_0 chosen so that 2^(1/2 - sigma_0) sup delta_p < 1/2. Read: "G is the meromorphic
   function zeta/N on Re s > 1/2, equal to its Euler product for Re s >= sigma_0."
3. **Theorem B and verdict statement 5 ("iff"):** add the domain "N is a Dirichlet series convergent somewhere"
   (alpha_p polynomially bounded); Bohr's inequality remains CLASSICAL (not opened by either pass).

Not errors, recorded: Theorem A does not use that the n_p are local factors (Lemma A0), as the lane says; so it
gives no R1. The regime-(K) existence question and the natural-boundary expectation are OPEN / ARGUED as labelled.

## 4. Three weakest steps (of the lane, after this pass)

1. Theorem C (b) is a conditional statement: analyticity of N in a strip around the line with admissible growth is
   a hypothesis. In regime (K) the product gives no information on the line, so for the lead BR the usable part is
   the finite-order clause only, and "finite order" is a hypothesis on the twin, not a consequence of Euler shape.
2. Bohr's inequality (Theorem B, sharpness) and the Kronecker sup formula are recalled or proved once; the
   three-regime table's second column ("N bounded iff summable") rests on them. Theorems A and C do not.
3. The filter table (section 6 of the lane) matches local-shape hypotheses of earlier rows against Theorem A without
   re-running those rows; its "forced" entries are RELATIVE to the rows on file. Regime 3 is untouched by any
   statement of the lane.

## 5. Flags

R1 false (Lemma A0: no multiplicativity), R2 false, R3 false (no control meets the hypotheses; base-blind), R4 false.
Agrees with the lane.
