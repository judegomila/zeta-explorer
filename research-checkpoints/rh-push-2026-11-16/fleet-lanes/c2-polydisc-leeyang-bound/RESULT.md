# c2-polydisc-leeyang-bound: what multi-affine (polydisc) stability gives for the size of the Euler stages

Date: 2026-11-17. Kind: deepen (R4 lane; follows `c1-leeyang-krein-limit` Thm. D and its section 5).
Labels: PROVED (argument in this note), CLASSICAL (recalled, source not opened), MEASURED (float64 grid, not interval arithmetic), OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction. The multivariate bound is exactly the trivial bound, and this is a theorem.**

1. (PROVED, Thm. 1) The sharp consequence of stability on a polydisc of polyradius (R_p) for the size of a stage is
   prod_p (1 - |z_p|/R_p)^(d_p) <= |F(z)| <= prod_p (1 + |z_p|/R_p)^(d_p), with equality for F = prod (1 + z_p/R_p)^(d_p), a member of the class.
   For the Euler stage E_P = 1/prod(1 - z_p), z_p = p^-s, R_p = 1, this reads |E_P(s)| <= prod_{p<=P} (1 - p^-sigma)^-1 = E_P(sigma): the trivial bound, with the exact constant. With the Lee-Yang radius of the stage theorem (zero-free only for Re s > 1/2, R_p = p^(-1/2)) the bound is prod (1 - p^(1/2 - sigma))^-1, exponent of order P^(3/2 - sigma)/log P: weaker than trivial by a power of P.
2. (PROVED, Thm. 2) No tool whose hypothesis is membership in a class invariant under the torus rotations z_p -> e^(i theta_p) z_p (zero-freeness on a polydisc, multi-affine stability, Lee-Yang property, and everything obtained from these by Grace-Walsh-Szego, Asano contraction, Borcea-Branden closure, or a Ruelle radius) can give a bound below sup over the torus, which is the trivial bound. A unimodular twist is a torus rotation, so zeta's stage and every U stage are the same class member up to the group action.
3. (PROVED, Thm. 3) For zeta itself, with the pole renormaliser: sup over all real t of |G_P(sigma + it)| >= prod_{p<=P}(1 - p^-sigma)^-1 for every P and every sigma in (0, 1). A bound on G_P that is uniform in height and below the trivial bound by any factor does not exist. The scoring target "uniform in P, below exp(P^(1-sigma)/log P) by a power" can hold only on bounded height ranges, and there it is c1 Thm. D(b), equivalent to the zero-free statement.
4. (PROVED, Prop. 4, CLASSICAL content: Bohr) For each fixed P the U stage at height t is, to any accuracy on any compact set, zeta's stage at another height t + tau. A stage statement uniform in height therefore holds for zeta if and only if it holds for every unimodular twist. U lacks no per-prime variable property; the difference is the joint position of the point (chi(p) p^(-it))_p on the torus, and at finite P that position is not a closed condition.
5. (MEASURED) P <= 1e4, sigma = 0.6, 0.75, 0.9, |t| <= 1e4: the true sup of log|G_P| stays between 2.0 and 2.9 for zeta while the derived bound grows from 2.66 to 16.57 (sigma = 0.6). At P = 10 the sup over 1 <= t <= 1e4 of log|E_P| is 2.625 against the bound 2.658 (98.8 percent): the torus bound is already nearly attained at height 1.5e3 with four primes. All four twisted controls give the same derived bound and true sups within 1.4 of zeta's.

The idea is dead at the first lemma for the reason in items 2 and 3. No pivot was made: the adjacent idea (a bound that uses the position on the torus) is c1 Thm. D(b) again, i.e. sum_{p<=P} p^(-s) + E_1((s-1) log P) bounded above on compacts, which is the prime number theorem with square-root error.

## 1. Plan and what is new against the sources

Sources read: `BRIEF.md`; `c1-leeyang-krein-limit/RESULT.md` and `REFEREE.md`; `ap-leeyang-ladder/RESULT.md` (verdict, Thm. A, Prop. C); `ap-leeyang-structural/RESULT.md` (verdict, section 1); `res-sparse-ferromagnet/RESULT.md` Thm. 3 statement; `STRATEGY.md` lead 13.

Recorded there: stage theorem; Lee-Yang derivative bound exp((log M)(1 + delta - sigma)/2), weaker than trivial (c1 section 5); Thm. D (local boundedness of G_P equivalent to zero-freeness).

Done here and not recorded there: the sharp polydisc bound with its extremal (Thm. 1); the rotation-invariance no-go for the whole tool family (Thm. 2); the unconditional lower bound for sup_t |G_P| (Thm. 3); the stage-level indistinguishability of zeta and U under height-uniform statements (Prop. 4); the numerical table. All of it is elementary or classical (Bohr, Kronecker, Dirichlet); no novelty is claimed.

Notation. Primes p <= P, n = pi(P). z_p = p^-s, r_p = p^-sigma. E_P(s) = prod_{p<=P} (1 - p^-s)^-1. G_P(s) = E_P(s) exp(E_1((s-1) log P)). For a completely multiplicative unimodular chi: E_P^chi(s) = prod (1 - chi(p) p^-s)^-1. Polydisc Delta_R = {z : |z_p| < R_p for all p}.

## 2. First lemma: which multivariate stability the stages have

(a) Euler stage. E_P = 1/F with F(z) = prod_p (1 - z_p), multi-affine, nonvanishing on the unit polydisc Delta_1 (all |z_p| < 1, i.e. Re s > 0), F(0) = 1. Same for every twist: F^chi(z) = F(chi(p) z_p). PROVED (trivial).

(b) Lee-Yang stage (`res-sparse-ferromagnet` Thm. 3, refereed; Lee-Yang circle theorem CLASSICAL). For squarefree M, couplings K_pq >= 0 with the sum rule, D_M(s) = sum_{n|M} w_K(n) n^-s is F_K(u) with u_p = p^(1/2 - s), F_K multi-affine, F_K(0) = 1, nonvanishing on the open unit polydisc in u and on the open exterior polydisc (self-reciprocal). In the variables z_p = p^-s the polyradius is R_p = p^(-1/2). Holds for every unimodular chi (rotation of u).

So the stability the stages have is: multi-affine, nonvanishing on a polydisc centred at 0, value 1 at the centre; polyradius 1 for Euler stages and p^(-1/2) for Lee-Yang stages; the Lee-Yang stage has in addition the reflected property on the exterior polydisc.

## 3. Work

### Theorem 1 (sharp size bound from polydisc stability). PROVED.
Let F be a polynomial in (z_p), of degree at most d_p in z_p, F(0) = 1, F != 0 on Delta_R. Then for z in Delta_R:

  prod_p (1 - |z_p|/R_p)^(d_p) <= |F(z)| <= prod_p (1 + |z_p|/R_p)^(d_p).

Both bounds are attained in the class (F = prod (1 + z_p/R_p)^(d_p) at z_p = |z_p| and at z_p = -|z_p|). The same holds for self-reciprocal members (R = 1, extremal prod (1 + z_p), all zeros on the torus), so the second Lee-Yang property does not improve it.

Proof. Induction on the number of variables. Fix z' = (z_p)_{p != q} in the polydisc of the other variables and put f(u) = F(u, z'), a polynomial of degree <= d_q in u with no zero in |u| < R_q. f(0) = F(0, z') != 0, so f(u) = f(0) prod_k (1 - u/a_k) with at most d_q factors and |a_k| >= R_q. Hence |f(0)| (1 - |u|/R_q)^(d_q) <= |f(u)| <= |f(0)| (1 + |u|/R_q)^(d_q). The polynomial z' -> F(0, z') has value 1 at 0 and no zero on the polydisc of the remaining variables; apply the induction hypothesis. QED.

Consequences.
- Euler stage (R = 1, d = 1, E_P = 1/F): prod (1 + r_p)^-1 <= |E_P^chi(s)| <= prod (1 - r_p)^-1 = E_P(sigma). This is the trivial bound (triangle inequality on the Dirichlet series of E_P) with equal constant. log E_P(sigma) = sum_{p<=P} p^-sigma + O(1) = (1 + o(1)) P^(1-sigma)/((1-sigma) log P).
- Lee-Yang stage (R_p = p^(-1/2), d = 1): |D_M(s)| <= prod_{p|M} (1 + p^(1/2 - sigma)); exponent (1 + o(1)) P^(3/2 - sigma)/((3/2 - sigma) log P). Between the trivial bound (P^(1-sigma)/log P) and the c1 derivative bound (P (1 + delta - sigma)/2). It is the triangle-inequality bound for coefficients w(n) <= n^(1/2).
- The proof uses the tools named in the assignment in their simplest form: the one-variable step is the degree-1 case of Grace-Walsh-Szego (coincidence is the identity for one variable); the induction is the statement that setting a variable to a point of the disc preserves the class (a Borcea-Branden closure operation; Asano contraction is not needed because the stage is already multi-affine). A Ruelle-type enlargement of the zero-free polydisc would enter only through R_p, and R_p cannot exceed 1 for the Euler stage (F vanishes at z_p = 1) nor p^(-1/2) for the Lee-Yang stage (zeros on its torus).

### Theorem 2 (rotation-invariance no-go). PROVED.
Let C be a class of functions on Delta_R closed under z_p -> e^(i theta_p) z_p for all real theta, and let B(r) be any quantity with |F(z)| <= B(r) for every F in C and every z with |z_p| = r_p. Then for every F in C, B(r) >= max over the torus {|z_p| = r_p} of |F|. For C containing 1/prod(1 - z_p): B(r) >= prod (1 - r_p)^-1.

Proof. F(e^(i theta) z) is in C; take theta at the maximiser. QED.

The classes "nonvanishing on Delta_R", "multi-affine and nonvanishing on Delta_R", "Lee-Yang polynomial with |a_pq| <= 1", "reciprocal of such", and their closures under products, specialisation, Asano contraction and coefficient-wise (Schur-Szego type) composition are all rotation invariant. So every bound derived from the stage theorem alone is at least the trivial bound: for the Euler stage the trivial bound is the exact answer to the question "what does multivariate stability give".

Unimodular twist: E_P^chi(s) = E_P evaluated at the rotated point (chi(p) z_p). Class membership cannot see chi.

### Theorem 3 (no height-uniform improvement for zeta). PROVED (Dirichlet's approximation theorem CLASSICAL).
For every P >= 2 and sigma in (0, 1): limsup_{t -> inf} |G_P(sigma + it)| = sup_t |E_P(sigma + it)| = E_P(sigma) = prod_{p<=P} (1 - p^-sigma)^-1.

Proof. Upper bound for E_P: Thm. 1. Renormaliser: for w off the negative real axis E_1(w) = e^(-w) int_0^inf e^(-u)/(u + w) du and |u + w| >= |Im w|, so |E_1((s-1) log P)| <= P^(1-sigma)/(|t| log P) -> 0 as |t| -> inf at fixed P. Lower bound: by Dirichlet's simultaneous approximation theorem, for every eps > 0 and T_0 there is t > T_0 with dist(t log p/(2 pi), Z) < eps for all p <= P; at such t, |1 - p^(-sigma - it)| <= (1 - r_p) + 2 pi eps r_p for each p, so |E_P(sigma + it)| >= E_P(sigma) prod (1 + 2 pi eps r_p/(1 - r_p))^-1. Let eps -> 0. QED.

No linear independence of the log p is used; the statement holds for any finite set of frequencies (Beurling systems included) and, by Kronecker (CLASSICAL, log p independent over Q by unique factorisation), for every twist: sup_t |E_P^chi(sigma + it)| = E_P(sigma).

Consequence for the scoring line. "A bound uniform in P with growth below exp(P^(1-sigma)/log P) by a power" is false as a statement uniform in t, for zeta, at every P. On a bounded range |t| <= T it is c1 Thm. D(b). The two requirements R2 (uniform in height) and R4 (bounded renormalised stages) cannot both be met by a bound on G_P: the first forces the bound up to E_P(sigma).

### Proposition 4 (zeta and U coincide at stage level along the height flow). PROVED (Kronecker; this is Bohr's equivalence, CLASSICAL).
For every P, every unimodular chi, every compact K in Re s > 0 and every eps > 0 there is tau with |E_P^chi(s) - E_P(s + i tau)| < eps on K. Conversely with the roles exchanged.

Proof. Kronecker: the flow tau -> (p^(-i tau))_{p<=P} is dense in the torus T^n, so some tau has |p^(-i tau) - chi(p)| < delta for all p <= P; E_P is uniformly continuous on a neighbourhood of the compact image of K in Delta_1. QED.

Reading. Fix P. Any property of the function t -> E_P(sigma + it) that is closed under locally uniform limits of height translates holds for chi = 1 if and only if it holds for every chi. What separates zeta from U must therefore couple P to the height: the point (p^(-it))_{p<=P} with t held fixed while P -> inf. In the variables: each coordinate z_p of zeta's point and of U's point has the same modulus, lies in the same disc, and enters the same local factor; the difference is the vector of angles (-t log p)_p against (arg chi(p) - t log p)_p. For zeta the angle is a linear function of log p with slope bounded by T; for U at s0 = sigma0 + i t0 it is t0 log p +- arccos(-p^(sigma0 - 1)) - t log p, which has no such description. "Angle = slope times log p with slope small against P" is a joint condition on infinitely many coordinates; restricted to p <= P it is satisfied to any accuracy by a height translate of U (Prop. 4). This is the named step for lead 13: **U lacks no per-prime property; it lacks the joint linearity of the angles in log p at bounded slope, and no rotation-invariant stage tool reads the angles.**

What the angles give. For sigma > 1/2, log|E_P^chi(s)| = Re sum_{p<=P} chi(p) p^-s + O(1) (the O(1) is at most sum_p p^(-2 sigma)). Boundedness of |G_P| on compacts is the statement that sum_{p<=P} p^(-sigma) cos(t log p) + Re E_1((s-1) log P) is bounded above: cancellation in an exponential sum over primes at fixed frequency t, to square-root accuracy. That is c1 Thm. D(b); nothing in the stability toolbox addresses a sum at one torus point.

## 4. Decisive test. MEASURED.

`bound_test.py`, `bound_test.log`, `bound_test.json`. Grid t in [0, 1e4] step 0.005 (2,000,001 points; |t| <= 1e4 by symmetry), float64. All entries are natural logarithms. "poly R=1" = log prod (1 - p^-sigma)^-1 (Thm. 1, Euler stage). "poly LY" = log prod (1 - p^(1/2 - sigma))^-1 (Thm. 1, Lee-Yang radius). "c1" = theta(P)(1.05 - sigma)/2 (c1 section 5, delta = 0.05). "assign." = P^(1-sigma)/log P, the trivial exponent as written in the assignment. "sum" = sum_{p<=P} p^-sigma.

| sigma | P | poly R=1 | poly LY | c1 | assign. | sum | zeta: sup log abs E_P, t >= 1 | zeta: sup log abs G_P | zeta: inf log abs G_P | t of sup G |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.60 | 10 | 2.658 | 8.61 | 1.2 | 1.091 | 1.869 | 2.625 | 2.625 | -1.505 | 1549.9 |
| 0.60 | 30 | 3.867 | 16.97 | 5.1 | 1.146 | 2.959 | 2.848 | 2.848 | -2.344 | 8647.1 |
| 0.60 | 100 | 5.259 | 33.43 | 18.8 | 1.370 | 4.286 | 2.763 | 2.763 | -2.770 | 7378.2 |
| 0.60 | 1000 | 9.281 | 146.25 | 215.2 | 2.294 | 8.242 | 2.528 | 2.529 | -3.019 | 9654.1 |
| 0.60 | 10000 | 16.570 | 746.46 | 2226.6 | 4.322 | 15.502 | 2.501 | 2.502 | -2.952 | 6925.5 |
| 0.75 | 10 | 2.100 | 5.32 | 0.8 | 0.772 | 1.565 | 2.079 | 2.079 | -1.290 | 1549.9 |
| 0.75 | 30 | 2.866 | 9.37 | 3.4 | 0.688 | 2.281 | 2.210 | 2.210 | -1.831 | 8647.1 |
| 0.75 | 100 | 3.614 | 16.14 | 12.6 | 0.687 | 3.009 | 2.141 | 2.140 | -2.055 | 8475.8 |
| 0.75 | 1000 | 5.280 | 51.86 | 143.4 | 0.814 | 4.662 | 2.011 | 2.011 | -2.170 | 9654.1 |
| 0.75 | 10000 | 7.420 | 191.52 | 1484.4 | 1.086 | 6.801 | 2.010 | 2.010 | -2.149 | 6925.6 |
| 0.90 | 10 | 1.691 | 3.81 | 0.4 | 0.547 | 1.316 | 1.677 | 2.338 | -1.107 | 0.0 |
| 0.90 | 30 | 2.184 | 6.13 | 1.7 | 0.413 | 1.788 | 1.752 | 2.314 | -1.449 | 0.0 |
| 0.90 | 100 | 2.591 | 9.44 | 6.3 | 0.344 | 2.188 | 1.714 | 2.270 | -1.566 | 0.0 |
| 0.90 | 1000 | 3.291 | 22.97 | 71.7 | 0.289 | 2.887 | 1.648 | 2.253 | -1.619 | 0.0 |
| 0.90 | 10000 | 3.928 | 61.32 | 742.2 | 0.273 | 3.523 | 1.651 | 2.247 | -1.612 | 0.0 |

Readings.
- The derived bound (poly R=1) equals the exact trivial bound and exceeds the measured sup of log|G_P| on |t| <= 1e4 by 0.03 (P = 10) to 14.1 (P = 1e4) at sigma = 0.6. It is true and carries no information beyond the triangle inequality.
- The Lee-Yang-radius form and the c1 derivative form are weaker than trivial at every row with P >= 30 (c1 at P = 10 is below "poly R=1" only because the factor zeta(1 + delta) = 20.6 is omitted from that column).
- Thm. 3 is visible at small P: P = 10, sigma = 0.6, sup over 1 <= t <= 1e4 is 2.625 of 2.658; sigma = 0.75: 2.079 of 2.100. For P = 30 the fraction is 0.74, for P = 1e4 it is 0.15: the height needed to align the phases grows with pi(P) (exponentially, by the pigeonhole count; not measured).
- sup log|G_P| is stable in P for P >= 1e3 (2.53, 2.50 at 0.6; 2.01, 2.01 at 0.75; 2.25, 2.25 at 0.9, the last at t = 0 where G_P(sigma) approximates zeta(sigma) = -9.43, log 9.43 = 2.24). This is the behaviour c1 Thm. D(c) describes; it is not a consequence of anything proved here. zeta itself was not evaluated on the grid.
- At sigma = 0.9 the column "assign." decreases with P while the true sup does not: exp(P^(1-sigma)/log P) without the factor 1/(1-sigma) and the O(1) is not an upper bound in this range; the valid trivial bound is the column "poly R=1".

Controls on the same grid (sup of log abs of the renormalised stage; derived bound identical to zeta's in every case except Beurling, where it is 16.74, 7.58, 4.08 at P = 1e4):

| sigma | P | zeta | Liouville chi(p) = -1 | U (zero at 0.75 + 20i) | random U | Beurling g_k = p_k + U(-1/2, 1/2) |
|---|---|---|---|---|---|---|
| 0.60 | 100 | 2.763 | 3.293 | 3.205 | 3.333 | 3.556 |
| 0.60 | 1000 | 2.529 | 3.582 | 3.626 | 3.600 | 3.945 |
| 0.60 | 10000 | 2.502 | 3.619 | 3.886 | 3.791 | 3.773 |
| 0.75 | 10000 | 2.010 | 2.509 | 2.622 | 2.692 | 2.731 |
| 0.90 | 10000 | 2.247 | 1.901 | 1.904 | 2.017 | 2.403 |

Renormalisers: zeta and Beurling exp(E_1((s-1) log P)); Liouville exp(-E_1((s-1) log P)); U exp(-E_1((s - s0) log P)) (its zero at s0 appears as log abs = -inf at the grid point t = 20, sigma = 0.75); random U none. The sup over a fixed height range does not separate the constructed U from a random twist or from Liouville; its sup at sigma = 0.6 is still rising with P (3.21, 3.63, 3.89) while zeta's is not, which is the square-root rate of c1 Test 2 seen from the size side. The derived bound does not register any of this.

## 5. Controls

| Control | Stage stability (section 2) | Thm. 1 bound | Where the derived bound stops | Status |
|---|---|---|---|---|
| U (zero in the strip) | same class member up to torus rotation | identical to zeta's, true | Thm. 2: the bound is rotation invariant, so it is true and uninformative for U and for zeta alike; U fails at no step. Missing property named in Prop. 4 (joint angle linearity), which the tool does not read | PROVED; MEASURED |
| Liouville twist | rotation by pi in every coordinate | identical | same | PROVED; MEASURED |
| random U | rotation | identical | same | PROVED; MEASURED |
| Beurling (any real energies) | Thm. 1 and Thm. 3 hold for arbitrary positive frequencies | same form | same; Thm. 3 uses Dirichlet only | PROVED; MEASURED for one perturbed system |
| DH | Bohr lift is a sum of two products with zeros inside the polydisc (`ap-leeyang-ladder` item 2: up to sigma = 0.653 for primes {2,3,7}); hypothesis of Thm. 1 fails | upper bound still holds by the triangle inequality on bounded coefficients | hypothesis step (zero-freeness on the polydisc) | by citation; not re-run |
| backward heat | antiferromagnetic pair coupling, zeros inside the polycircle (`ap-leeyang-ladder` Prop. C) | hypothesis fails | hypothesis step | by citation; not re-run |
| zeta(s+a) zeta(s-a) | stage prod (1 - p^(-a) z_p)^-1 (1 - p^(a) z_p)^-1, zero-free polyradius p^(-a), d_p = 2 as a product | prod (1 - p^(a - sigma))^-1 (1 - p^(-a - sigma))^-1 for sigma > a: true, weaker than zeta's | passes with a smaller radius; fails at no step | PROVED (direct) |
| sign-twisted primes (eps_n on Lambda) | when completely multiplicative on prime powers it is the Liouville or U row | | | covered above |
| T-NR, phase-rotated transfer operator, theta^w | | | | not run |

No control "fails for a structural reason" because the derived statement is true for all of them that have product stages. The controls show the bound is uninformative; they do not test a proof step.

## 6. Requirement flags

- R1 (multiplicativity essential): **false.** The upper bound prod (1 + r_p/R_p) holds for any coefficients bounded by the stage's weights (triangle inequality); zero-freeness is used only for the lower bound and for the reciprocal form, and the result is the triangle inequality there too. Multiplicativity enters Thm. 3 and Prop. 4 only through the independence of log p, and Thm. 3 does not need it.
- R2 (height-uniform, every window): **false** as a positive result. Thm. 1 to 3 are uniform in height, and Thm. 3 shows that uniformity in height forces the trivial bound.
- R3 (every control fails at a named structural step): **false.** U, Liouville, random U, Beurling and zeta(s+a)zeta(s-a) satisfy the derived bound; DH and backward heat fail only the hypothesis, by citation; three controls not run.
- R4 (reaches the critical line): **false.** No bound on G_P below the trivial one is obtained; the residual is c1 Thm. D(b) unchanged.

## 7. Row for the obstruction map (proposed; the map file was not edited by this lane)

| Route | Step that stops | Reason | Status |
|---|---|---|---|
| Size of Euler / Lee-Yang stages in the strip from multivariate stability (polydisc zero-freeness, Grace-Walsh-Szego, Asano, Borcea-Branden closure, Ruelle radius) | bound on log abs G_P below sum_{p<=P} p^-sigma | (i) the class is invariant under torus rotations, so any class bound is >= the torus maximum prod (1 - p^-sigma)^-1, attained by a class member (Thm. 1, 2); (ii) for zeta itself sup over heights of abs G_P equals that maximum for every P (Thm. 3, Dirichlet approximation); (iii) at fixed P every unimodular twist is a height translate of zeta to any accuracy (Bohr), so height-uniform stage statements cannot separate U. A usable statement must couple height to P (t fixed, P -> inf) and read the angles t log p; that is PNT with square-root error | PROVED; closed for rotation-invariant tools |

## 8. Three weakest steps

1. Thm. 2 excludes only arguments whose input is membership in a rotation-invariant class plus the moduli |z_p|. The four tools named in the assignment were treated through that property; their literature statements were recalled, not opened, and no search was made for stability results on classes that are not rotation invariant (for example stability on products of half-planes or sectors anchored at z_p = 1, which do distinguish angles). For the Euler stage such a region gives per-prime information only, since the stage is a product of one-variable factors, but this was argued in one line, not worked out as a theorem.
2. The numerics are float64 on a grid of step 0.005 with heights to 1e4 only; sups are grid sups (not certified), zeta was not evaluated for comparison, the renormaliser uses a 30-term asymptotic series for abs(w) >= 40 and mpmath below that, and the Beurling and random controls are single seeds. The fractions quoted for Thm. 3 (98.8 percent at P = 10) are measured at one height range; the growth of the alignment height with pi(P) is not measured.
3. Prop. 4 and Thm. 3 are statements at fixed P. They say nothing against a statement on a range |t| <= T(P) with T growing slowly; the claim that the remaining target "is PNT with square-root error" rests on c1 Thm. D (refereed) and adds nothing to it. The lane therefore closes a tool family and does not narrow the residual.

## 9. Files and compute

- `bound_test.py`, `bound_test.log`, `bound_test.json` in this directory. One local run through `scripts/memcap.sh 8`, 153 s, planned allocation 240 MB. Interpreter `/tmp/g-chan-venv/bin/python` (numpy, mpmath).
- The compute server was not used; no units were started there.
