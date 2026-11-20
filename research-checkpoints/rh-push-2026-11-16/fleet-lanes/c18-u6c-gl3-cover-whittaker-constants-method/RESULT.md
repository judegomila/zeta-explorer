# c18-u6c-gl3-cover-whittaker-constants-method: Whittaker constants on the cubic and double covers of GL(3)

Date: 2026-11-19/20 (campaign round 18; server runs 2026-11-20 04:41 to 04:55 UTC). Kind: deepen (cell U6 (c) of `c16-qa-filter-silent-cells-geometric-nodes`; map
rows Z21, Z23, section 6 item 18). Counts as 7/8-adjacent. Not refereed.
Nothing here proves or refutes RH, no bound moves, and no statement about zeros of zeta is made.

Labels: PROVED (argument written here) / CLASSICAL-opened (text read here; file named) / RECALLED (from memory, source
not opened) / MEASURED (server run; residue symbols exact integers mod 3, Gauss sums float64 rechecked to 5e-10) /
ARGUED / OPEN.

Files: `job.py` (double sums of the cubic A_2 series), `out_1e5.json`, `out_2e5.json`, `run_1e5.log`, `run_2e5.log`,
`local_3e3.json` (local pilot, 2 s, `scripts/memcap.sh 8`), `job2.py`, `out_tab.json`, `run_tab.log` (diagonal array,
first 1e5 indices, inequality against twins), `analyse.py`, `analysis_1e5.txt`, `analysis_2e5.txt`,
`dl/fg1403.3929.pdf` + `dl/fg.txt` (Friedberg-Ginzburg, arXiv:1403.3929v1, the one source opened), `lanes.jsonl`.
Server: units `rh-c18u6c-1e5-1120044136` (4 GB, 4 cores, 84 s), `rh-c18u6c-2e5-1120044307` (10 GB, 8 cores; peak
resident memory 5.2 GB), `rh-c18u6c-tab-1120044214` (2 GB, 1 core), all through `rhrun`; all three ended on their own.
Input table: `tmp/sextic/data/sf_1e6.npz` (read as data; squarefree primary moduli of Z[w] coprime to 6 with their
normalised cubic Gauss sums; rechecked here by direct sums at 7 primes and by twisted multiplicativity at 20000 nodes).

## 0. Verdict

**Precise obstruction. Cell U6 (c) is decided in its cubic half and reduced to a named computation in its
double-cover half; no inequality that scores is found.**

1. **Cubic cover of GL(3) (theta; unique Whittaker model).** The constants reduce to cubic Gauss sums. For a prime p
   of norm q the coefficient tau(p^l1, p^l2) is nonzero exactly when (l1, l2) = (0,0) or (1,1) mod 3. In the
   normalisation of section 3: tau(p^3 m1, m2) = tau(m1, p^3 m2) = tau(m1, m2), and
   tau(p, p) = kappa conj(gamma(p)) q^(-1/6), gamma(p) the normalised cubic Gauss sum, with kappa = 0.989 to 0.992 at
   X = 2e5 for five primes, rising with X (section 3). On the diagonal tau is twisted multiplicative with the cubic reciprocity
   cocycle. Status: support for l2 = 0 CLASSICAL-opened; the full support PROVED from a recalled criterion that
   reproduces four opened or classical statements; all of it MEASURED on the server (vanishing classes at relative
   size at most 0.012 at X = 2e5 and falling with X; nonzero classes at 0.47 to 1.00). The array is the cubic Gauss-sum
   array of map rows Z14 and Z15 (the "cubic rows" of TRO6). No new object.
2. **Every read of the cubic constants is a Gauss-sum identity (question Q-A, entry test).** The Hecke relation at p^3
   is the periodicity above (an identity). The candidate sign inequality (C3), Re S_w(X) > 0 for the smoothed diagonal
   sum, holds for the full array at all 398 grid values of X up to 3.5e5 and fails for the twins (Liouville twist,
   angular twist, cubic character twist), which have the same modulus, support and cocycle. It is the positivity of
   one residue of Patterson's series (a coefficient of the cubic theta function on GL(2): lower-rank data) in one
   normalisation: the sub-array of one residue class mod 9 has its main term at argument 142 degrees and fails (C3)
   at every grid point. Not an inequality in the sense of R3.
3. **Double cover of GL(3).** Theta has no Whittaker coefficient (CLASSICAL-opened sentence; lane e1). For a genuine
   cusp form the space of local Whittaker functionals has dimension 4 at each odd unramified place (PROVED from the
   recalled commutator formula): the constants are not determined by Hecke data. They split into (I) relations
   inside a class of the index modulo squares, which are the local identities of row Z23 and are satisfied by
   arbitrary Satake data, and (II) the values a(D1, D2) at squarefree classes, which are global data with no
   formula on file. For (II) a computation method is written in section 5 (point values of a GL(3) Maass form at
   positive ternary quadratic forms, summed over a genus; the identification with the constants is Jacquet's
   correspondence, RECALLED and not established here), with truncation and validation steps. No run was made for (II).
4. **Controls.** For the cubic half: completely multiplicative unimodular twists of the Gauss-sum array keep every
   local relation and move or remove the main term. For reads of type (I): arbitrary Satake parameters. For reads of
   type (II): the same array with Eisenstein input is an Epstein zeta function of a ternary form at the class level
   (functional equation, no Euler product), the twin of `c17-u6f`; T-NR and the other zeta controls are not
   formulable on the cover (no lift on file), as recorded in the Q-A table.

Proposed map row: `MAP_ROW.md`. Record line: `lanes.jsonl` (also appended to `campaign/lanes.jsonl`).

Registered outcome: "a computation method on file plus one displayed candidate" for the double-cover half ((K3),
section 5.4), and "cell closed as an identity" for the cubic half. Score 0. No pivot was taken.

## 1. Plan

New relative to the sources. `n4`, `e1`, `e2`, `c6` computed Borel, theta-induced and cusp-induced Eisenstein rows
and the local Gelfand-Tsetlin data of the double cover of GL(3), and each named "global Whittaker constants of a
genuine cusp form" as not computed; `c16-qa-filter` listed the cell as "none formulable; input: a relation between
the constants at composite and at prime indices". No lane had computed a global Whittaker coefficient array on a
cover of GL(3) for a non-Eisenstein object. This lane (a) states which constants are meant and what determines them
on the cubic and on the double cover, (b) runs the decisive test on the one case with a unique Whittaker model
(cubic theta on GL(3)) by computing its coefficients as double residues of the cubic A_2 series, (c) writes the
method for the double cover.

Three questions before work. Q1 (controls): section 6. Q2 (uniform, every window): no statement of that kind is
reached; the outputs are identities for coefficient arrays. Q3 (multiplicativity): enters as twisted multiplicativity
of Gauss sums (cubic reciprocity) and as the periodicity at p^3; both are identities of the array, right of the
abscissa of the series; no step acts on a zero.

## 2. First lemma: which constants, and what determines them

Setting. F a number field with the n-th roots of unity, G~ the n-fold Kazhdan-Patterson cover of GL_r (twist c = 0),
psi_m(u) = psi(m_1 u_12 + ... + m_(r-1) u_(r-1,r)). For an automorphic form phi on G~ the constants are
a_phi(m) = int_{N(F)\N(A)} phi(u) conj(psi_m(u)) du with all m_i != 0 (non-degenerate characters), r = 3: a(m_1, m_2).

**Lemma K (free-orbit criterion; RECALLED as Kazhdan-Patterson, Metaplectic forms, section I.3; the count below is
PROVED here given that criterion).** At an unramified place, Whittaker functionals of a genuine principal series are
indexed by classes f in (Z/n)^r (exponents of the torus modulo n-th powers). The functionals that factor through the
exceptional (theta) quotient are spanned by the free orbits of the Weyl group S_r under the shifted action
w[f] = w(f - rho) + rho, rho = (r-1, ..., 1, 0). So f - rho must have pairwise distinct entries mod n. With index
exponents l_i = f_(i+1) - f_i (mod n):

- n = 2, r = 3: three distinct entries mod 2 do not exist. No functional: theta on the double cover of GL(3) has no
  Whittaker coefficient. Agrees with the opened sentence "When n = 2, Theta does not have a Whittaker model. ... all
  non-degenerate Whittaker coefficients tau(n1, n2) are zero" (`dl/fg.txt` line 604) and with `e1` Lemma T (i).
- n = 3, r = 2: f - rho = (a, b), a != b; l = b - a - 1 in {0, 1}. Patterson's cubic theta: tau(p^l) = 0 for
  l = 2 mod 3 (CLASSICAL).
- n = 3, r = 3: f - rho is a permutation of (0, 1, 2); six elements, one orbit: the model is unique.
  (l1, l2) = (b - a - 1, c - b - 1) with (b - a, c - b) in {(1,1), (2,2)}, so **(l1, l2) = (0,0) or (1,1) mod 3**.
  For l2 = 0 this gives l1 = 0 mod 3, which is the opened statement "tau(m, 1) = 0 unless m is a unit times a
  perfect cube, and tau(a m^3, 1) = |m| tau(a, 1)" (`dl/fg.txt` lines 667 to 669, attributed there to Proskurin and
  to Bump-Hoffstein, Cubic metaplectic forms on GL(3)).
- n = 4, r = 3: l2 = 0 forces l1 in {0, 1} mod 4. This is the opened statement that the nonzero tau(m, 1) on the
  4-fold cover are those with exponents 0 or 1 mod 4, with tau(p^(4k+1), 1) = |p|^(k-1/2) conj g(p)
  (`dl/fg.txt` lines 793 to 798). Orbit count 24/6 = 4, permuted transitively by scalars: unique model; for n = 5
  the count is 2 classes (not unique), as the same text states for n > 4.

The criterion is my reconstruction of the Kazhdan-Patterson mechanism; it is not opened. Its outputs agree with the
four statements above and with the server test of section 3.

**Lemma C (cubic theta on GL(3); values).** In a unique model the coefficient at a class in the orbit of f = 0 is
obtained from tau(1, 1) by one simple reflection, which contributes one Gauss sum of the residue character
(RECALLED: Kazhdan-Patterson Lemma I.3.3). The class (1,1) is one simple reflection away from (0,0) (for example
f - rho = (2,0,1) -> (0,2,1)). Hence tau(p, p)/tau(1, 1) is a unit multiple of a cubic Gauss sum of p or its
conjugate, times a power of q. Which of the two, the power and the unit are MEASURED in section 3:

    tau(p^l1, p^l2) = 0                               unless (l1, l2) = (0,0) or (1,1) mod 3,
    tau(p^3 m1, m2) = tau(m1, p^3 m2) = tau(m1, m2),
    tau(p m1, p m2) = conj(gamma(p)) q^(-1/6) tau(m1, m2) (1 + o(1))   for p not dividing m1 m2 (cocycle below),

in the normalisation tau = double residue of the series of section 3 (no power of the index removed). Globally:
tau(m1, m2) != 0 iff m1 = c a^3, m2 = c b^3 with c squarefree, and then |tau| = N(c)^(-1/6) |tau(1,1)| to the
measured accuracy. gamma(c c') = (c/c')_3 (c'/c)_3 gamma(c) gamma(c') for coprime c, c' (CLASSICAL; checked on 20000
nodes to 4e-16), so the diagonal array is twisted multiplicative with the cubic reciprocity cocycle.

**Answer to the first lemma for the cubic cover.** The constants are determined by Gauss sums: the array
{tau(m1, m2)} is the array {gamma(c) : c squarefree} read through c = common squarefree class of m1 and m2. The
Hecke relation at p^3 is the periodicity (the genuine spherical Hecke algebra is supported on cubes; it moves the
index by p^3 and by nothing else). The relation between composite and prime indices asked for in the Q-A table
exists and is the reciprocity cocycle: an identity.

**Lemma D (double cover of GL(3)).**
(i) Theta: no Whittaker coefficient (above). Its Fourier coefficients are those of the Jacobi theta function (`e1`).
(ii) Genuine principal series at an odd unramified place: the commutator of two torus elements t, t' is
(det t, det t') prod_i (t_i, t'_i)^(-1) (RECALLED, Kazhdan-Patterson section 0.1, c = 0). On
T/T^2 = (F^x/F^x2)^3 = (Z/2)^6 this is the form (I + J) tensor h, h the Hilbert pairing (non-degenerate on
(Z/2)^2), J the all-ones 3 x 3 matrix. I + J has rank 2 over F_2 with kernel (1,1,1) (PROVED: rows (0,1,1), (1,0,1),
(1,1,0); the third is the sum of the first two). So T~/Z(T~) has order 16, a maximal abelian subgroup has index 4,
and the space of Whittaker functionals of a genuine unramified principal series has **dimension 4**: one for each
class of (l1, l2) mod 2 (the "four Whittaker classes" of `c6`).
(iii) Consequence (ARGUED). For a genuine cusp form the global functional is a vector in a restricted tensor product
of 4-dimensional spaces and need not be a pure tensor. The genuine spherical Hecke algebra is supported on squares
of the torus times scalars: it relates a(m1 p^(2j), m2 p^(2k)) to a(m1, m2) (the row series of `c6`: L-factor of
the Shimura lift times a numerator in which the quadratic symbol occurs only with q^(-1/2)). It gives no relation
between different classes modulo squares. The values a(D1, D2), D_i squarefree, are free global data: the analogue
of the coefficients c(D) of a half-integral weight form, which on GL(2) are square roots of central values
(Waldspurger). Not established: that these values are not expressible by Gauss sums; the dimension count shows only
that uniqueness, the mechanism that forces Gauss sums on the cubic cover, is absent.

**Answer to the first lemma for the double cover.** Not determined by Gauss sums and lower-rank data by any
argument on file; no computation of a(D1, D2) exists in the record or in the opened source. Method: section 5.

## 3. Decisive first test (server): the cubic theta coefficients as double residues

Object (RECALLED: Brubaker-Bump-Friedberg-Hoffstein, Weyl group multiple Dirichlet series III; Brubaker-Bump-
Friedberg Gamma rule): the Whittaker coefficient at (m1, m2) of the Borel Eisenstein series on the cubic cover of
GL(3) over Q(w), w = e^(2 pi i/3), is

    Z(s1, s2; m1, m2) = sum over c1, c2 = 1 mod 3 of H(c1, c2; m1, m2) N(c1)^(-2 s1) N(c2)^(-2 s2),

H twisted multiplicative,
H(c1 c1', c2 c2') = (c1/c1')(c1'/c1)(c2/c2')(c2'/c2)(c1/c2')^(-1)(c1'/c2)^(-1) H(c1, c2) H(c1', c2'),
H(c; m1 m1', m2 m2') = (m1'/c1)^(-1) (m2'/c2)^(-1) H(c; m1, m2), with p-parts H(p^k1, p^k2; p^l1, p^l2) given by
strict Gelfand-Tsetlin patterns of top row (l1 + l2 + 2, l2 + 1, 0) with weights g(p^(r-1), p^r) (boxed), q^r
(circled), q^(r-1)(q - 1) if 3 | r and 0 otherwise (neither). The recipe is the one of `c6-gl3-cover-epsilon-cocycle/gt.py`
(validated there by Tokuyama at n = 1 and the Shimura relation at n = 2), here with n = 3 and numerical Gauss sums.
Theta is the double residue of the Eisenstein series, so tau(m1, m2) is the double residue of Z(.; m1, m2).

Statistic. S(X; m) = sum of H(c1, c2; m) (N c1 N c2)^(-1/2) w(N c1/X) w(N c2/X), w(t) = (1 - t)^3 on [0, 1], over
c1, c2 coprime to 6 (S = {2, lambda}); R(m) = S(X; m)/S(X; (1,1)). All c1, c2 with nonzero H are included: the sum
is organised as (squarefree coprime parts A, B) x (defect pairs g1, g2 carrying every prime with a pattern other
than (1,0), (0,1), and every pattern at primes dividing m), with the matrix of cubic symbols (A/B)_3 for all pairs
of squarefree moduli (n^2 entries, exact). X = 1e5: n = 28224 moduli, 9601 primes, 8.0e8 symbol entries, up to 1139
defect pairs per index. X = 2e5: n = 56434 moduli, 18019 primes, 3.2e9 symbol entries, 717 s. Checks inside the run: reciprocity (A/B) = (B/A) on 4000 random
pairs, 0 mismatches; Gauss sums against direct sums at 7 primes, 5.2e-10.

Results (MEASURED). S(X; 1, 1) grows with local exponents 1.650, 1.661, 1.664 (X = 1.25e4 to 1e5): the double pole
at exponent 5/3 = 5/6 + 5/6. Primes: P7 = -2 - 3w and its conjugate P7b = 1 + 3w, P13 = 1 - 3w, P19 = -5 - 3w, I5 = -5 (inert, norm 25).
At X = 2e5 the local exponents are 1.661, 1.664, 1.661.

R(m) at the largest X of each run (`table.md`; all four X values per run in `analysis_1e5.txt`, `analysis_2e5.txt`):

| index (m1, m2) | exponents mod 3 | abs R, X = 1e5 | abs R, X = 2e5 | R at X = 2e5 | R q^(1/6)/conj gamma(p), 1e5 -> 2e5 |
|---|---|---|---|---|---|
| 1 | - | 1.00000 | 1.00000 | +1.00000-0.00000i |  |
| P7^(1,0) | (1,0) | 0.01462 | 0.01173 | +0.00250+0.01146i |  |
| P7^(0,1) | (0,1) | 0.01462 | 0.01173 | +0.00250+0.01146i |  |
| P7^(1,1) | (1,1) | 0.71418 | 0.71736 | -0.59726-0.39735i | 0.9878+0.0013i -> 0.9922+0.0001i |
| P7^(2,0) | (2,0) | 0.00981 | 0.00774 | +0.00641-0.00433i |  |
| P7^(2,1) | (2,1) | 0.00700 | 0.00527 | -0.00164-0.00501i |  |
| P7^(1,2) | (1,2) | 0.00700 | 0.00527 | -0.00164-0.00501i |  |
| P7^(2,2) | (2,2) | 0.00069 | 0.00042 | -0.00032+0.00028i |  |
| P13^(1,0) | (1,0) | 0.01460 | 0.01138 | +0.00871+0.00732i |  |
| P13^(0,1) | (0,1) | 0.01460 | 0.01138 | +0.00871+0.00732i |  |
| P13^(1,1) | (1,1) | 0.64414 | 0.64568 | +0.45955-0.45356i | 0.9877+0.0000i -> 0.9901+0.0001i |
| P13^(2,0) | (2,0) | 0.00833 | 0.00656 | -0.00240-0.00610i |  |
| P13^(2,1) | (2,1) | 0.00460 | 0.00347 | +0.00040+0.00345i |  |
| P13^(1,2) | (1,2) | 0.00460 | 0.00347 | +0.00040+0.00345i |  |
| P13^(2,2) | (2,2) | 0.00059 | 0.00047 | -0.00045+0.00012i |  |
| P19^(1,0) | (1,0) | 0.00640 | 0.00471 | -0.00423+0.00208i |  |
| P19^(0,1) | (0,1) | 0.00640 | 0.00471 | -0.00423+0.00208i |  |
| P19^(1,1) | (1,1) | 0.60348 | 0.60515 | +0.59153-0.12768i | 0.9858+0.0007i -> 0.9885+0.0003i |
| P19^(2,0) | (2,0) | 0.00369 | 0.00297 | -0.00291-0.00060i |  |
| P19^(2,1) | (2,1) | 0.00199 | 0.00149 | -0.00149-0.00004i |  |
| P19^(1,2) | (1,2) | 0.00199 | 0.00149 | -0.00149-0.00004i |  |
| P19^(2,2) | (2,2) | 0.00108 | 0.00095 | -0.00075+0.00059i |  |
| P7^(3,0) | (0,0) | 1.00051 | 0.99977 | +0.99977-0.00018i |  |
| P7^(0,3) | (0,0) | 1.00051 | 0.99977 | +0.99977-0.00018i |  |
| P7^(3,3) | (0,0) | 0.99490 | 0.99664 | +0.99664-0.00016i |  |
| P7^(4,1) | (1,1) | 0.71846 | 0.71839 | -0.59799-0.39811i | 0.9937+0.0004i -> 0.9936+0.0004i |
| P7^(1,4) | (1,1) | 0.71846 | 0.71839 | -0.59799-0.39811i | 0.9937+0.0004i -> 0.9936+0.0004i |
| P7^(1,1)*P13^(1,1) | - | 0.46972 | 0.47027 | +0.30762+0.35570i |  |
| P7^(1,0)*P13^(0,1) | - | 0.00691 | 0.00502 | +0.00145+0.00480i |  |
| P7^(1,1)*P7b^(1,1) | - | 0.52198 | 0.52201 | +0.52201-0.00000i |  |
| P7^(1,1)*P13^(1,0) | - | 0.00674 | 0.00582 | +0.00575-0.00091i |  |
| P7b^(1,1) | (1,1) | 0.71418 | 0.71736 | -0.59726+0.39735i | 0.9878-0.0013i -> 0.9922-0.0001i |
| I5^(1,1) | (1,1) | 0.57486 | 0.57811 | +0.57811-0.00000i | 0.9830-0.0000i -> 0.9886-0.0000i |
| I5^(1,0) | (1,0) | 0.00670 | 0.00557 | -0.00557+0.00000i |  |

Reading. (a) Support: the classes (1,0), (0,1), (2,0), (2,1), (1,2), (2,2) and the mixed indices
(P7, P13), (P7 P13, P7) have |R| at most 0.015 at X = 1e5 and at most 0.012 at X = 2e5 (every one of the 21
values decreases between the two runs; ratio about 0.8 per doubling, consistent with X^(-1/3), the next polar term); the indices with all exponents in the classes (0,0) and (1,1) mod 3 have |R| between 0.47 and 1.00, stable in X. (b) Periodicity:
R(p^3, 1) = R(1, p^3) = 0.9998, R(p^3, p^3) = 0.9966, R(p^4, p)/R(p, p) = 1.0014 (X = 2e5). (c) Value:
R(p, p) q^(1/6)/conj(gamma(p)) is real to 1e-3 and equal for the split primes of norms 7, 13, 19 and the inert
prime of norm 25: 0.9878, 0.9877, 0.9858, 0.9830 at X = 1e5 and 0.9922, 0.9901, 0.9885, 0.9886 at X = 2e5 (rising with X at every
prime; consistent with a limit 1, not resolved). The conjugate is
selected, not gamma(p) (gamma(p)^2 and conj gamma(p) differ by the angular factor -p/|p|: `out_tab.json`,
gamma^3 = -p/|p| to 3e-9 on 30304 primes). (d) Cocycle on the diagonal: R(P7 P13)/(R(P7) R(P13)) = 1.015 w^2 (argument
-119.87 degrees), with (P7/P13)_3 = w^2; R(P7 P7b)/(R(P7) R(P7b)) = 1.014, with (P7/P7b)_3 = 1 (X = 2e5; the
modulus is close to 1/kappa, as it must be if kappa is the same finite-X factor at every prime).

Calibration on the known case (cubic theta on GL(2), Patterson; same weights, single sums, `gl2` block of the
output): R2(p) q^(1/6)/conj(gamma(p)) = 1.019, 0.968, 0.982, 0.976 at X = 2e5 and |R2(p^2)| = 0.009 to 0.049
(predicted 0). The single sums are noisier than the double sums; the reading rule (ratio of smoothed sums = ratio
of residues) reproduces the classical theorem to the accuracy at which it is used above.

What the test does not show: kappa = 1 exactly (measured 0.989 to 0.992 at 2e5; a constant such as a ratio of local
factors at p is not excluded at this accuracy, though its equality across q = 7, 13, 19, 25 argues against a
q-dependent factor); the coefficients at indices divisible by 2 or lambda; the archimedean and lambda-adic
dependence (the sum over c = 1 mod 3 fixes one test function at lambda).

## 4. The diagonal array, the Hecke relation and one candidate inequality against twins (server, 1e5 indices)

t(m) = conj(gamma(m)) for the first 1e5 squarefree primary m coprime to 6 (N(m) <= 354217); by Lemma C,
tau(m, m) = kappa_m t(m) N(m)^(-1/6). `out_tab.json`:

- modulus: | |t| - 1 | <= 1.9e-9; cube identity gamma(p)^3 = -p/|p| at 30304 primes, deviation 3.1e-9;
- Hecke relation: periodicity at p^3 (section 3 (b)) and the reciprocity cocycle (section 3 (d); table identity to
  4e-16). There is no further relation at p^3: the three classes of exponents mod 3 on the diagonal are
  {tau, conj(gamma) q^(-1/6) tau, 0}.
- Candidate (C3): Re S_w(X) > 0 for all X >= 30, S_w(X) = sum_m t(m) w(N(m)/X). Size candidate (C-size):
  |tau(m1, m2)| <= N(c)^(-1/6) |tau(1,1)|, c the common squarefree class (an equality by Lemma C).

| array | S_w(X_max)/X_max^(5/6) | argument (degrees) | grid points with Re S_w <= 0 (of 398) |
|---|---|---|---|
| theta, all classes | 0.0594 | 0 | 0 |
| Liouville twist (-1)^Omega(m) t(m) | -0.00027 | 180 | 192 |
| angular twist (m/abs m)^3 t(m) | 0.00002 | 0 | 345 |
| cubic character twist (m/P7)_3 t(m) | 0.0382 (modulus) | 146.6 | 395 |
| theta, class m = 1 mod 9 | 0.0259 | 0 | 0 |
| theta, second class mod 9 (index 1) | 0.0134 (modulus) | 142.0 | 398 |
| theta, class index 4 mod 9 | 0.0091 (modulus) | 63.6 | 0 |

|S_w|/X^(5/6) is constant to 1 per cent over X_max/8 .. X_max for the rows with a main term (0.0598, 0.0594, 0.0593,
0.0594 for theta): exponent 5/6, Patterson's pole. The sum over all classes is real because m and its conjugate
both occur.

Reading. Each twin xi t, xi completely multiplicative and unimodular, has the same modulus, support, periodicity
and twisted-multiplicativity cocycle as t; it is the diagonal array of no theta function. (C3) holds for theta and
fails for the three twins. It is not an inequality of the kind R3 asks for: (i) it is the statement that one
residue (the coefficient at 1 of the cubic theta function of GL(2), Patterson; Heath-Brown-Patterson) is positive
in one normalisation, and the class sub-arrays of theta itself have residues at arguments 142 and 64 degrees, the
first failing (C3) at every grid point; (ii) it has no stated consequence for any zero. (C-size) is an equality.
So for Q-A: no read of the cubic constants found here is more than a Gauss-sum identity or a residue identity of
Patterson's series.

## 5. Method for the double cover (the cell's remaining half)

5.1 What is to be computed. a(D1, D2) for squarefree D1, D2: the 4-class data at each prime of Lemma D (iii).

5.2 Identification (RECALLED, not established here; one web search confirmed the statements, not the proofs).
Jacquet's correspondence: automorphic representations of GL_r distinguished by an orthogonal group correspond to
genuine representations of the double cover, and the comparison of relative trace formulas equates orthogonal
periods P_Q(phi) = integral of phi over SO_Q(F)\SO_Q(A), Q a quadratic form in r variables, times a Whittaker
coefficient of phi, with products of Whittaker coefficients on the double cover; the classes of Q over F_p for r = 3
(determinant class and Hasse invariant: 4 classes) match the 4 Whittaker classes of Lemma D. Fundamental lemma:
Mao (r = 3, 1998), Do (general r, positive characteristic). r = 2 is Waldspurger / Katok-Sarnak. For Eisenstein
input and r = 3: Chinta-Offen (the O(3)-period of the unramified Eisenstein series is a finite sum of products of
double Dirichlet series that are coefficients of Eisenstein series on the double cover; the quadratic A_2 series of
lane `n4`). The global identity for cusp forms on GL(3) is, as far as recalled, not a theorem.

5.3 The computation (independent of 5.2 as a definition). For Q positive definite and phi spherical on
SL_3(Z)\SL_3(R)/SO(3), SO_Q(R) is compact and the adelic period is the finite sum

    K_phi(G) = sum over classes Q in the genus G of phi(g_Q)/|SO_Q(Z)|,     Q = g_Q^T g_Q,

a sum of point values of phi on the space of positive ternary forms (for r = 2: Katok-Sarnak sums over CM points).
Steps, each with its truncation:
1. Classes. Enumerate Eisenstein-reduced positive ternary integral forms of determinant D <= D_max; sort into genera
   by the local invariants at p | 2D; record |SO_Q(Z)|. D_max = 1e4 gives about 1e5 classes.
2. Input form. phi with Fourier coefficients A(m1, m2): (a) the symmetric square of a level-one Maass form
   (Gelbart-Jacquet), A from the Hecke eigenvalues of the GL(2) form (to be taken from a published table; none is in
   the repository), spectral parameters (2ir, 0, -2ir); (b) the Borel Eisenstein series (closed form: Chinta-Offen;
   code check); (c) the degenerate Eisenstein series, where phi(g_Q) is the Epstein zeta function
   Z_Q(s) = sum over x != 0 of Q(x)^(-s) up to a normalising factor (code check and control, section 6).
3. Point values. Fourier-Whittaker expansion
   phi(z) = sum over gamma in U_2(Z)\SL_2(Z), m1 >= 1, m2 != 0 of A(m1, |m2|)/(m1 |m2|) W_J(M gamma z; nu, psi_(1, m2/|m2|)),
   M = diag(m1 |m2|, m1, 1). The Whittaker integral needed is Jacquet's function for SL_3(R) at (y1, y2); to be
   evaluated from the Vinogradov-Takhtajan / Stade one-dimensional integral of a product of two K-Bessel functions
   (formula to be taken from Bump, Automorphic forms on GL(3, R), not from memory) or from its double Mellin-Barnes
   integral, in ball arithmetic. Truncation: at a reduced point y1, y2 >= sqrt(3)/2 the terms decay like
   exp(-2 pi (m1 y1' + |m2| y2')) in the transformed coordinates; keeping m1 y1' + |m2| y2' <= 6 leaves a relative
   tail below 1e-14; the gamma-sum runs over coprime (c, d) with |c z_2 + d|^2 below the same threshold.
4. Output. K_phi(G) for all definite genera of determinant up to D_max, 30 digits. Size: about 1e5 point values
   times 1e3 to 1e4 terms; of the order of 10 core-hours with ball Bessel functions (8 cores, under 12 GB).
5. Validation. Input (c): the genus sum against the Mellin transform of the genus theta series (Siegel's theorem:
   a weight 3/2 Eisenstein series, coefficients class numbers). Input (b): against Chinta-Offen. Then input (a).
Indefinite genera need integrals over arithmetic surfaces and are left out of the first run.

5.4 Displayed candidate for the next explore slot (a test statement; no supporting argument is on file):

    (K3)   Delta_phi(p, q) := K_phi(G_1) K_phi(G_pq) - eps(p, q) K_phi(G_p) K_phi(G_q)  !=  0   for some primes p != q,

G_d the definite genus of determinant d with trivial Hasse invariants away from d, eps(p, q) the quadratic
reciprocity sign that makes Delta vanish for a pure tensor. (K3) says that the global Whittaker functional is not a
pure tensor. If (K3) fails for all p, q the squarefree-class data are local and the cell closes as in section 2 for
the cubic cover; if it holds the data are global and the next question is their relation to twisted central values
(the GL(2) analogue is c(D)^2 = central value). Entry test: (K3) reads neither the absence of mass off log N nor
the sign of Lambda (Q-A: neither); it is not a statement about zeros; with Eisenstein input (c) the class-level
values are Epstein zeta functions and the genus sums are class-number series, which are not multiplicative in d,
so the Eisenstein member satisfies (K3) as well (ARGUED from the non-multiplicativity of class numbers; not run).
A one-sided inequality on the array with a consequence for a zero is not known to me; (K3) is registered as the
statement the method decides first, not as an attack.

## 6. Controls

The nine controls of the assignment are objects built on zeta. None has a lift to a cover of GL(3) on file (Q-A
table, row U6 (c)), and none was constructed here; "not formulable" is recorded, not counted as a handle. The
controls that are formulable for the reads of this lane:

| read | control | has | first step that fails | status |
|---|---|---|---|---|
| cubic support and periodicity (Lemma K, C) | any array xi(c) gamma(c), xi completely multiplicative unimodular (unimodular twist; sign twist xi = Liouville) | modulus, support, periodicity at p^3, reciprocity cocycle | none: passes every local relation | MEASURED (section 4), PROVED for the cocycle |
| (C3) sign of the smoothed diagonal sum | same twins | as above | the main term: absent (Liouville, angular) or rotated (character) | MEASURED |
| (C3) | theta itself restricted to one class mod 9 | everything | sign: main term at 142 degrees | MEASURED |
| double cover, reads of type (I) (within a class mod squares) | arbitrary Satake parameters in the formulas of row Z23 | every Hecke identity | none | PROVED-rel row Z23 |
| double cover, reads of type (II), class level | Eisenstein input (c): Epstein zeta function of a ternary form | functional equation s <-> 3/2 - s; no Euler product for class number above one; real zeros in the strip for suitable forms (RECALLED: Terras 1979) | not run | RECALLED |
| (K3) | Eisenstein input (c), genus level | class-number series | none expected (passes) | ARGUED |
| T-NR, E_a, DH, backward heat, Beurling, phase-rotated transfer operator, theta^w | no lift to the cover | | not formulable | recorded |

Answer to "does T-NR or an Epstein-type twin at inert primes pass, as in c17-u6f": on the cubic cover the inert
prime I5 behaves as the split primes (section 3, same kappa), and the twins that pass are the multiplicative twists;
on the double cover the Epstein-type twin is the Eisenstein member of the array of section 5 and it is expected to
pass (K3); T-NR is not formulable.

## 7. The four requirement flags

- R1 (multiplicativity essential): not established. Multiplicativity enters as the reciprocity cocycle and the
  periodicity; both are identities shared by the twins. False.
- R2 (height-uniform, every window): no statement of that kind. False.
- R3 (every control fails at a named step): false. Twins pass every relation of the cubic array; (C3) separates
  them but is a residue identity in one normalisation and fails on a class sub-array of theta.
- R4 (reaches the critical line): false. Every statement is about coefficient arrays, right of the abscissa.

## 8. Three weakest steps

1. Lemma K is a reconstruction from memory of the Kazhdan-Patterson criterion, and the p-parts of the A_2 series are
   the recalled Gamma rule. Neither source was opened. Protection: the criterion reproduces four opened or classical
   statements, and the server test agrees with it at all 34 indices. Lemma and test rest on different recalled inputs
   (the criterion; the Gamma rule with twisted multiplicativity), so their agreement supports both; no third source
   was opened for the value conj(gamma(p)) q^(-1/6) at (p, p).
2. The reading "ratio of smoothed double sums = ratio of double residues" is asymptotic. Vanishing is read from
   |R| <= 0.015 with decay in X, not proved; kappa = 1 is not resolved (0.989 to 0.992 at 2e5). The sums omit the
   primes 2 and lambda and fix one test function at lambda.
3. Section 5: the identification of K_phi(G) with Whittaker constants on the double cover is Jacquet's
   correspondence, recalled, and not a theorem for cusp forms on GL(3) as far as recalled; the Whittaker integral
   and its truncation are specified but not implemented; (K3) has no supporting argument and its control row is
   argued, not run. Lemma D (iii) (no relation between classes modulo squares) is argued from the dimension count.
