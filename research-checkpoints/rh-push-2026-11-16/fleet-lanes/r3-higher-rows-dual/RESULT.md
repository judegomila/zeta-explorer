# r3-higher-rows-dual: the dual exponent for row orders 4 and 5 (2026-11-16)

Internal working note. Nothing committed or pushed. Files, all in this directory:
`code/ms4.py` (order 4 over Q(i), mean squares, rows ~ length), `code/pole_probe.py`, `code/analyse4.py`,
`code/ms5.py` (order 5 over Q(zeta_5), Moebius side), `code/model_r4.py`; logs and data in `run/`
(`ms4_200000.log/.npz` is the motherbox run, 280 s on 8 cores; the rest ran locally, single process);
`dl/2607.07911v2.pdf/.txt` (de Faveri-Dunn-Hoffstein, downloaded today, text read).

Labels: PROVED / PROVED-sketch (argument given, bookkeeping of coprimality and ramified places not written line by
line) / PROVED-rel X / CLASSICAL / MEASURED / MODEL (exponent bookkeeping, 6 -> r transplant) / OPEN.

**Verdict: precise obstruction.** No abscissa is claimed. The individual dual exponent is a = 3 (r = 4, over Q(i)) and
a = 6 (r = 5, over Q(zeta_5)); no a = 2 reflection exists in either case. The mean square over rows, which is what the
architecture consumes, has square-root size numerically (MEASURED, r = 4 to length 2e5 with 34731 rows; r = 5 on the
Moebius side), but its proof at the balanced point is equivalent to the balanced mean square of Moebius sums over the
order-r twist family, which by itself gives the half-plane 1 - 1/(2r) (r = 4: 7/8, a tie; r = 5: 9/10) and nothing
lower, and which no coefficient-blind large sieve can supply (de Faveri-Dunn-Hoffstein, July 2026). 7/8 (unrefereed
manuscript) and B_flat = 0.874886647 (unrefereed follow-ups) stand. RH open.

---

## 1. Plan: what differs from the closed lanes

Closed and not repeated: `zf-higher-rows` (Theorem 1: the absorbed dual of order-r Moebius rows is the Gauss-sum family
of chi*rho, order nu(r); index exponents e = 1 + r/2, r + 1), its referee (Theorem 4(ii) refuted), `r2-zf-paired-rows`
(product rows: Theorem A, Lemma B, Theorem D; conductor measurement on 301 rows favouring 3 over 2 at about 2 sigma),
`zf-campaign-quartic-gl2.md` (Poisson dual of the quartic family, one direction, "sketched"; needed inputs (i) optimal
quartic sieve or (ii) Lindeloef on average at index h^3; toy numerics at D = 4000), `cubic-r2-conductor-verdict.md`.

What `r2-zf-paired-rows` covered exactly: (a) counts of trivial rows for product families; (b) Framework A and the
bilinear probe for two-variable row families; (c) the individual conductor scale of the class-3 sums on at most 301
prime rows h with N(h) <= 1997 (rows << length). It did not treat: the mean square in the regime rows ~ length (its
referee's item 7), the literature after 2024, r = 5, or what the mean-square statement is equivalent to.

New here:

1. Section 2: the three different things called "a", and which one the manuscript uses (its Lemma 5.8).
2. Theorem A: a_FE = 3 for r = 4 over Q(i) from a written functional equation (no mu_8 needed), and the absorbed
   class has no pole. This closes weakest step 1 of `zf-higher-rows` for r = 4.
3. Theorem B: off-diagonal duality. The mean square of the absorbed dual and the mean square of the Moebius family are
   exchanged by Poisson summation in the row variable, for every r. Corollaries: what "a = 2 in mean square" means at
   the balanced point and below it.
4. Theorem C: relative to de Faveri-Dunn-Hoffstein (arXiv:2607.07911, not cited anywhere in the campaign), every
   coefficient-blind estimate of the dual returns exactly the trivial bound D^2, for every amplifier length. Input (i)
   of the quartic note is false.
5. Measurements at rows ~ length: order 4 (six coefficient classes, a polar control) and order 5 (Moebius side).
6. Section 7: which manuscript steps transplant to r = 4, which do not, and the MODEL abscissa for each available
   strength of the missing input.

Walls. The output is an obstruction, so MV-CAP, flow-blindness and verified height are not engaged. Theorem B says the
missing input is a mean value over a family (not blocked by MV-CAP) that contains an every-window statement for one
L-function through the amplifier rows; that is why it is hard.

---

## 2. Three meanings of the dual exponent

Row order r, field K containing mu_r, chi_a = (./a)_r. The absorbed dual rows are

  T_m(Z) = sum_a c_a conj(chi_a(m)) w(N a / Z),   c_a = mu(a) gamma_1(a) xi(a),   gamma_1(a) = g(chi_a)/sqrt(N a),

a over squarefree primary elements, xi a fixed unimodular (Hecke character) x (periodic) factor. For r = 4 over Q(i),
Lemma Q3 of the quartic note gives T_m = partial sum of the quartic Kubota series at index m^3 with the
Groessencharacter twist alpha(a) = a/|a| (index class 3). q = log Q / log Z, rows N(m) ~ Q.

* **a_FE** (individual): T_m(Z) is expressed by a sum of length N(m)^(a_FE) / Z.
* **Mean-square range.** MS_T(Q, Z) = sum_{N(m) ~ Q} |T_m(Z)|^2; "optimal" means << (QZ)^(1+eps) (square-root size).
* **What the manuscript uses.** Lemma 5.8 (read in `~/lean-deps/qrh-verify/paper.txt`, lines 2549-2567): the completed-row
  moment has square-root size for row ball Z^M and length Z^N whenever M <= N, i.e. q <= 1. It is proved by the cubic
  reflection (a_FE = 2), after which the only joint dependence on row and dual variable is a quadratic symbol
  (Lemma 5.7: chi_R(nb)^3), followed by the quadratic large sieve, which is perfectly orthogonal. Part I uses q = 1;
  Part II (Lemma 15.1) uses rows Z^(M'), 1/2 <= M' <= 5/6, i.e. q < 1.

In the campaign tables "a = 2" stands for the third item: optimal moment for all q <= 1. With an optimal sieve after
reflection, a_FE = a gives the optimal moment exactly for q <= 1/(a - 1). The model threshold found by
`r2-zf-paired-rows` (r = 4, 5 need a = 2 exactly) is this statement.

---

## 3. Theorem A: the individual exponent

**Theorem A.**
(i) [PROVED-rel de Faveri-Dunn-Hoffstein (6.8), (6.9), (6.12), which cite Diamantis 2004 and DDHL25 Prop 4.3; and
Lemma Q3] Over K = Q(i) the quartic Kubota series psi(delta, s; u) = sum_{c = u mod 4} g_4(delta, c) N(c)^(-s) has a
functional equation s -> 2 - s with index factor N(delta)^(1-s) (Gamma factors of degree n - 1 = 3 by the general
formula of the verdict note, not re-checked in the preprint), and convexity bound
N(delta)^((3/2 - Re s)/2 + eps) on 1 <= Re s <= 3/2. At delta = m^3 the conductor is N(m)^3: **a_FE = 3**. The
functional equation is stated for Gamma(lambda^4) in Q(i); it does not use mu_8.
(ii) [CLASSICAL: Suzuki 1983 Theorems 3-6, as quoted in (6.14)-(6.16) of the same paper] tau_4(m^3 delta; u) = 0 for
squarefree m != 1 prime to delta. The index-class-3 series has no pole at s = 5/4: the absorbed dual has no main term.
(iii) [PROVED, `cubic-r2-conductor-verdict.md` section 2.2 with n = 4] The stripped series of class e couples only to
class e* = -e - 2 mod 4. For e = 3, e* = 3: the reflected rows are again class 3, with the quartic symbol chi_c(m) as
the joint dependence. No reflection lowers the order of the row symbol (contrast Lemma 5.7 of the manuscript).
(iv) r = 5 over Q(zeta_5) [PROVED-rel Kubota's functional equation for n = 10, not re-read; mu_10 lies in Q(zeta_5)]:
the absorbed dual is the 10-fold Kubota series at index h^6, **a_FE = 6** (twisted form: 9). The explicit S-local form
(Brubaker-Bump) needs mu_20, which is absent; the index exponent is fixed at the complex place and does not depend on
it (verdict note section 3.3).

So the answer to "is a = 2 available as a reflection" is no for r = 4 (PROVED-rel written sources) and no for r = 5
(PROVED-rel, sources recalled). The previous conductor measurement (r2, about 2 sigma) is now redundant for r = 4.

---

## 4. Theorem B: off-diagonal duality

Inv_k(Z) = sum_a mu(a) xi'(a) chi_a(k) w(N a / Z) (Moebius sums twisted by the order-r symbol of k; partial sums of
1/L(s, xi' chi_.(k))). MS_mu(K, Z) = sum_{0 != k, N(k) <~ K} |Inv_k(Z)|^2, with the smooth cutoff produced by Poisson.

**Theorem B [PROVED-sketch; every r >= 3, K containing mu_r].** With K = Z^2/Q,

  MS_T(Q, Z) - (diagonal ~ QZ)  =  (Q/Z) * [ MS_mu(K, Z) - (diagonal ~ KZ) ]  up to factors (QZ)^eps,

and the same with T and Inv exchanged.

*Proof.* Extend the row sum to all m in the lattice with a nonnegative weight v whose Fourier transform is
nonnegative. Expand the square. For (a, a') = 1 the function m -> conj(chi_a(m)) chi_a'(m) is a primitive character
modulo aa'; Poisson summation modulo aa' gives

  sum_m conj(chi_a) chi_a'(m) v(m/sqrt Q) = (Q/N(aa')) sum_k g(conj(chi_a) chi_a'; k) vhat(k sqrt Q/(aa')),
  g(conj(chi_a) chi_a'; k) = eps(a, a') chi_a(k) conj(chi_a'(k)) * chi_a(-1) conj(g(chi_a)) g(chi_a'),

by the Chinese remainder theorem and r-th power reciprocity (eps is a finite combination of periodic characters). The
coefficient is c_a conj(g(chi_a)) = mu(a) xi(a) |gamma_1(a)|^2 sqrt(N a) = mu(a) xi(a) sqrt(N a): the Gauss sum cancels
identically. The k = 0 term vanishes for aa' != 1. The pairs a = a' give the diagonal. What remains is
(Q/Z) sum_k sum_{a != a'} mu(a) xi(a) chi_a(k) conj(...) vhat(...), i.e. the off-diagonal part of MS_mu(K, Z) with
cutoff N(k) <~ N(aa')/Q ~ K. Pairs with d = (a, a') != 1 reduce to the same expression for a/d, a'/d with a Ramanujan
sum in k and the quadratic twist chi_.(d)^2 (reciprocity), as in section 4 of the 11/12 paper; the non-separable
weight is separated by a Mellin integral, which is where (QZ)^eps enters. QED (sketch)

The identity is the statement "c_a times the Gauss sum of the row character is mu times a Hecke character", which is
the definition of the absorbed class. It holds for every r, including r = 6 (where it is the relation between the
manuscript's Lemma 5.8 and its (17.87)), and it is the only relation: Poisson in m is an involution q <-> 2 - q
between the two families, and the functional equation acts on T alone, q -> q/(a_FE q - 1) (fixed point
q = 2/a_FE). These are two involutions (one exchanges the families, one acts on T alone); no composition reaches a range where a sieve closes.

**Corollary B1 (balanced point, q = 1).** For each r the following are equivalent up to Z^eps [PROVED-sketch]:
(a) MS_T(Z, Z) << Z^(2+eps) (the Part I input, Lemma 5.8 at M = N = 1, for order r);
(b) MS_mu(Z, Z) << Z^(2+eps) (balanced Moebius moment over the order-r twist family).
Further: (c) GRH for the Hecke L-functions L(s, xi' chi_.(k)) of K implies (b), hence (a) [PROVED-sketch];
(d) (b) implies that every finite-order Hecke L-function of K is zero-free in Re s > 1 - 1/(2r), by the amplifier
with the r-th power rows alone [PROVED for r = 4: quartic note Prop Q1; the proof is order-independent].

So for r = 4 the statement "the mean-square dual exponent is 2 at the balanced point" is true under GRH, is equivalent
to (b), and (b) already yields 7/8 for all Hecke L-functions of Q(i) in two lines, without the probe. It is at least
as strong as the conclusion one wants from it, and the conclusion is a tie with 7/8, not a gain. For r = 5: 9/10.
For r = 3 (cubic rows over Q(omega)): 5/6 = 0.8333, the only one of the three below 7/8.

**Corollary B2 (below the balanced point, q < 1; needed by Part II).** MS_T(Z^q, Z) << (QZ)^(1+eps) for q < 1 is
equivalent to MS_mu(K, Z) = (diagonal) + O(Z^(2+eps)) for K = Z^(2-q) in (Z, Z^2): perfect orthogonality of the
Moebius coefficient vector against the order-r family in the range family > length, with error Z^2 and not K Z^(eps).
[PROVED-sketch.] This is not implied by pointwise square-root bounds for Inv_k (GRH gives MS_T <= QZ + Z^(2+eps),
i.e. loss Z^(1-q)); through the amplifier it gives only theta <= 1/2 + (2 - q)(1 - 1/r)/2, which is weaker than (d).

**What is proved unconditionally for class 3, r = 4.** q >= 2 (diagonal dominance; also BGL), and q <= 2/5
(Theorem A reflection followed by BGL). The Poisson route adds nothing unconditionally: the dual sum contains the rows
k = t^4, which are K^(1/4) copies of Inv_1, and these can only be bounded by Z^2 each without a zero-free half-plane
for the base L-function. (An earlier draft of this note claimed q >= 3/2 and q <= 3/7; that used the sieve on the
repeated rows and is withdrawn.) The repeated rows are the amplifier: MS_T contains (Q/Z) K^(1/r) |Inv_1(Z)|^2.

---

## 5. Theorem C: coefficient-blind estimates return exactly the trivial bound

de Faveri-Dunn-Hoffstein, "Non-orthogonality of the cubic and quartic large sieves via Rankin-Selberg",
arXiv:2607.07911v2 (13 July 2026; unrefereed preprint; text read): for the operator norms Xi_n(A, B) of the order-n
large sieve over Q(zeta_n), squarefree primary variables,

  Thm 1.1:  Xi_3(A, B) >> (AB)^(-eps) (A + B + (AB)^(2/3))                         (unconditional; BGL is sharp)
  Thm 1.2:  Xi_4(A, B) >> (AB)^(-eps) (A + B + A^(3/4) B^(1/2) + A^(1/2) B^(3/4))   (unconditional)
  (1.8), conjecture, all n >= 3:  Xi_n = (AB)^(o(1)) (A + B + A^(1-1/n) B^(2/n) + A^(2/n) B^(1-1/n)).

The extremal vector is beta_b = gamma_1(eta lambda^k, b): the class-1 Kubota sums, whose pole has residue
tau_n(a) and mean square sum_{N(a) <= A} |tau_4(a)|^2 ~ A^(3/4) (their Prop 8.2, by Rankin-Selberg; Lemma 8.4 on
squarefree a using Suzuki). They also prove Lindeloef on average for psi^(4)(a, 1 + eps + it) over all indices
N(a) <= A (their (8.4)); the cubes a = m^3 are a subset of density A^(-2/3) and are not covered.

**Theorem C [PROVED-rel Thm 1.1, 1.2 for n = 3, 4; rel conjecture (1.8) for n >= 5].** In Framework A at order n,

  J |A_1|^2 <= sum_{N(u) <= H} |A_u(D)|^2 <= D H + H * sum_{N(h) << K} |P_h(D)|^2,   J = H^(1/n),  K = D^2/H,

(P_h the normalised dual rows). Any bound for the dual sum valid for all unit-norm coefficient vectors is at least
Xi_n(K, D), and

  H * K^(1-1/n) D^(2/n) / H^(1/n) = (HK)^(1-1/n) D^(2/n) = D^2    for every H.

So a coefficient-blind treatment of the dual gives |A_1| <= D^(1-eps'), eps' -> 0: exactly trivial, at every
amplifier length, for n = 3 and n = 4 unconditionally (relative to the preprint) and for every n under (1.8). QED

Consequences.
* Input (i) of `zf-campaign-quartic-gl2.md` section 4.6 ("a quartic large sieve with c <= 1/2 at M ~ N") is false.
  Its threshold table (trivial for c >= 5/8) and Thm 1.2 (c >= 5/8 at A = B) meet exactly; with the true two-term
  shape the bound is D^2 for every H, not only at H = D.
* The non-orthogonality of the order-n sieve and the amplifier are the same object: the theta pole of the class-1
  dual is the Poisson image of the n-th power rows. For class 1 the principal row is sum_a 1 ~ Z (no cancellation);
  for the absorbed class it is Inv_1(Z).
* Only input (ii) remains: a coefficient-specific estimate for the absorbed class. By Corollary B1 it is the balanced
  Moebius moment.

---

## 6. Measurements

**Order 4 over Q(i)** (`code/ms4.py`; Gauss sums by direct summation, |gamma_1| = 1 to 1.8e-15 on all 243247 squarefree
primary a with N(a) <= 7e5; rows: all 69486 squarefree primary m with N(m) <= 2e5; w(x) = x exp(-x^2)).
R = mean over rows of |B_m|^2 / sum_a |c_a w_a|^2. RND (random unit phases, same symbols) is the baseline; it is below
1 because chi_a(m) = 0 when (a, m) != 1.

| Z | rows, N(m) in (Z/2, Z] | T (absorbed dual) | K3 (index m^3) | K3t (index lambda^2 m^3) | MU (Moebius) | RND | K1t (index lambda^2 m, polar) |
|---|---|---|---|---|---|---|---|
| 12500 | 2158 | 0.918 +- 0.020 | 0.899 | 0.962 | 0.895 | 0.926 | 3.39 +- 0.12 |
| 50000 | 8682 | 0.907 +- 0.010 | 0.911 | 0.940 | 0.917 | 0.926 | 4.23 +- 0.08 |
| 200000 | 34731 | 0.913 +- 0.005 | 0.917 | 0.928 | 0.907 | 0.918 | 5.45 +- 0.06 |

Rows at q = 5/6, Z = 200000 (4534 rows): T 0.923 +- 0.014, K3 0.965, K3t 0.905, MU 0.898, RND 0.922, K1t 8.91 +- 0.27.
Over all dyadic row bins with at least 500 rows and all three Z, R/R(RND) lies in [0.95, 1.09] for T, [0.96, 1.18] for
K3, [0.79, 1.06] for K3t, [0.97, 1.07] for MU, with no trend in Z (`run/analyse4.log`, `run/ms4_200000.log`).

* [MEASURED] The absorbed class and the Moebius family have square-root mean square at rows ~ length and at q = 5/6,
  indistinguishable from random phases at the 1 percent level at Z = 2e5. This is the regime the referee of
  `r2-zf-paired-rows` (item 7) said was untested.
* [MEASURED] The polar class exceeds it. The excess E = R(K1t) - R(RND) follows E = c Z^(1/2) N(m)^(-1/4) with
  c between 0.12 and 0.31 (typically 0.15 to 0.22) on every dyadic bin from 2^9 to 2^17 at all three Z; along Q = Z the fitted exponent is 0.219
  (Thm 1.2 of the preprint: 1/4). `pole_probe.py`: at m = 1 the pole is carried by the indices lambda^2, lambda^3 and
  i (|S| = 0.10 to 0.14 Z^(3/4), slopes 0.71 to 0.82), not by index 1.
* The run therefore reproduces the preprint's lower bound numerically and shows that the same data contain no excess
  in the absorbed class. Consistent with Theorem A(ii) (no pole) and Corollary B1(c).

**Order 5 over Q(zeta_5)** (`code/ms5.py`, Moebius side, which by Theorem B carries the same off-diagonal as the
order-10 absorbed dual and needs no generators or composite Gauss sums). Columns: 50086 squarefree ideals with all
prime factors of degree 1, N <= 210000; rows: 20000 elements in the box |m_j| <= 16; symbol by m(r)^((p-1)/5) mod p.
At Z = 60000, rows with |N(m)| in (24576, 98304] (7000 rows): MU 0.986 +- 0.012, RND 0.962; in (98304, 393216] (6352
rows): MU 0.965, RND 0.962. At Z = 15000 and 3750: MU 0.94 to 0.99, RND 0.94 to 1.00 (`run/ms5_60000.log`).
[MEASURED] Square-root size. Limits: primes of degree 2 and 4 omitted from the columns; no polar control for r = 5
(it needs order-5 Gauss sums at composite ideals, i.e. primary generators); the order-10 Gauss sums were not computed.

---

## 7. The r = 4 architecture: what transplants, what does not, and the abscissa per input

| manuscript step | status at r = 4 over Q(i) |
|---|---|
| Moebius absorption, (4.5)/(4.7) | transplants: Lemma Q2/Q3 (PROVED; class 3, index m^3) |
| Poisson side: plain x inverse polynomials, signal rows k = a^4 | transplants (PROVED-sketch; pole of zeta_K(4z) at z = 1/4) |
| Lemma 6.1, 6.2 (planar additive large sieve, additive norm) | transplants unchanged (uses only separation of the fractions d/s) |
| Prop 5.1 (completed cubic reflection, a = 2) | does not: Theorem A, a_FE = 3, class 3 is closed under reflection |
| Lemma 5.7 (after reflection the row symbol is quadratic) | does not: the row symbol stays quartic (Theorem A(iii)) |
| Lemma 5.8 (optimal moment for q <= 1) | does not. q = 1: equivalent to the balanced Moebius moment (Cor. B1). q < 1: Cor. B2. Proved range q <= 2/5 |
| Prop 6.3, Part I | conditional on Cor. B1(b); output 7/8, which (b) gives directly |
| Lemma 9.1 (order-r sieve, BGL) | transplants; by Theorem C it cannot be improved to what is needed |
| Lemmas 14.2, 14.3, 15.1 (marked reflected energy and norm) | do not: built on Prop 5.1 and the quadratic-cubic norm |
| Lemma 17.1, (17.87), Lemma 17.6 (inverse moments, r-th power amplification) | (17.87) is Cor. B1(b)/B2 for the order-4 family: open |
| Lemma 18.1, Prop 19.2 (plain capacity, row counts) | MODEL (6 -> 4 in counts; not re-derived) |

MODEL abscissa (`code/model_r4.py`: the `runB` constraint set of `zf-higher-rows/models.py`, with the completed-row loss
set to what each input gives; reproduces 0.87496 at r = 6):

| input for the completed-row moment | r = 4 | r = 3 | r = 5 |
|---|---|---|---|
| reflection a_FE + BGL (what is proved) | 1.028 | 1.046 | > 1 |
| pointwise square-root bound for every Inv_k (GRH level, via Theorem B) | 0.8906 | 0.8333 | 0.9259 |
| zero loss for all q <= 1 (the "a = 2" column; Cor. B2) | 0.8099 | 0.7428 | 0.8492 |

All MODEL, and conditional rows are not abscissas: the second row assumes GRH for the twist family, the third assumes
Cor. B2. Reading: for r = 4 even GRH-level control of the dual leaves the model above B_flat = 0.874886647; the values
0.810 and 0.849 require the perfect-orthogonality statement of Cor. B2, for which no approach is known and which
Theorem C excludes for general coefficients. r = 3 is the only order where the balanced statement alone (5/6) is
below 7/8.

No r = 4 abscissa is written, because the condition in the task ("a = 2 or anything giving an abscissa below 0.8749
provable for r = 4") is not met: the provable range is q <= 2/5 and the architecture needs q in [1/2, 1].

---

## 8. Controls

No zero-free statement is made, so nothing can transfer wrongly. For the record, where each control would act on the
conditional statements:
* Davenport-Heilbronn: Theorem B uses c_a g(chi_a)-bar = mu(a) xi(a) sqrt(N a) prime by prime (mu(pi) = -1 against the
  Jacobi sum) and twisted multiplicativity; Cor. B1(d) uses that mu xi chi_.(k) are the coefficients of 1/L. Neither
  exists for a linear combination of L-functions.
* Backward heat family: no functional of the flow appears.
* Sign twist Lambda -> eps Lambda (multiplicative eps): the Moebius side survives, the Gauss-sum side does not
  (no reciprocity for eps); Theorem B fails at the step g(conj(chi_a) chi_a') = eps(a, a') * product.

---

## 9. Answers to the task, and the three weakest steps

* True dual exponent, individual: 3 (r = 4, Q(i)), 6 (r = 5, Q(zeta_5)). Not 2. Fields without mu_2n: no change.
* True dual exponent, mean square over rows: the moment has square-root size (MEASURED, r = 4 and r = 5), i.e. the
  truth is as good as "a = 2"; the proof at the balanced point is equivalent to the balanced Moebius moment
  (Theorem B), which is of the strength of the half-plane 1 - 1/(2r) for the whole Hecke family of K and is open.
* Patterson / Heath-Brown / Dunn-Radziwill / David-Dunn-Hamieh-Lin / 2025-2026: the cubic sieve is sharp
  (unconditional since July 2026), the quartic sieve is not perfectly orthogonal (lower bound X^(5/4) at A = B = X;
  conjectured sharp), quintic and higher: conjecture (1.8) only. DDHL (quartic Gauss sums over primes) uses the
  quadratic sieve over Q(i) and Suzuki's evaluation at squares; it gives nothing for the class-3 moment.
* r = 4 architecture and abscissa: not available; table in section 7.

Weakest steps.
1. **Theorem B is a sketch.** The coprime pairs are complete; the pairs with (a, a') != 1, the ramified prime, the
   extension of the row sum to non-squarefree m and the Mellin separation are described, not written. The corollaries
   are stated "up to Z^eps" and inherit this. Cor. B2's equivalence needs the error term Z^2 exactly and is the most
   exposed.
2. **Theorem A(i), (iv) and Theorem C rest on an unrefereed 2026 preprint** (read in full only in sections 1, 2, 6.2,
   6.3, 8, 9) and, for n = 10, on Kubota's theory as recalled. The r = 5 exponent 6 was not tested numerically.
3. **The measurements are at one scale ladder (Z <= 2e5) with a specific smooth weight**, and for r = 5 only on the
   Moebius side with degree-1 primes. They show no excess at the 1 percent level; they do not distinguish an
   exponent excess below about 0.01, and they say nothing about the marked (slot) versions needed by Part II.

Next step if this lane is continued: the cubic balanced Moebius moment over Q(omega),
sum_{N(k) <= Z} |sum_{N(a) <= Z} mu(a) nu(a) chi_{3,a}(k)|^2 << Z^(E), where any E < 25/12 gives a half-plane below 7/8
by the amplifier alone (E = 2: 5/6). Heath-Brown/BGL give 7/3 and Theorem C shows that is the limit of
coefficient-blind methods, so the proof has to use the class-4 structure of the 6-fold dual (for instance a Voronoi /
circle-method bilinear estimate of the kind in Dunn, Algebra Number Theory 19 (2025), for cubic metaplectic
coefficients). No such estimate is in hand.
