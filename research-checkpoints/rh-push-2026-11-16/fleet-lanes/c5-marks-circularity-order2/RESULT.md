# c5-marks-circularity-order2: the "prime marks with l - lx = 2 are circular" heuristic, decided inside the reduced system

Internal working note, 2026-11-18. Slug `c5-marks-circularity-order2`. Unrefereed. Nothing committed, pushed or posted.
No ssh; all runs local, single process, through `scripts/memcap.sh 8`.
Scope: an ESTIMATE SYSTEM inside the 7/8 architecture (openai/math manuscript `~/lean-deps/qrh-verify/paper.txt` and
Liu II, both unrefereed), in the reduced form of `push/r3-method-limit` sections 1-4. Every abscissa below is the
value of a hypothetical estimate system. None is a zero-free region. No statement about zeros of zeta is made.
7/8 (unrefereed) stands. RH open. NO QED.

Labels: PROVED (complete argument here, scalar or elementary) / PROVED-rel X / EXACT (rational LP by vertex
enumeration, `lp5.py`, `lp5.log`) / CLASSICAL / ARGUED / MEASURED / MODEL / OPEN.

**Verdict: precise obstruction (outcome (a), relative to the reduced system; not unconditional).**

1. The mechanism named by the heuristic does not occur. The configuration "marks of length Z^l against fewer than
   Z^l rows" (l >= M) is infeasible in the reduced system for every low-side package, with or without compensation
   (Theorem A, PROVED scalar + EXACT). The vertices of `r3-method-limit` Theorem 3(b) with compensation kept
   (l = 7/2 polar, l = 2 with G = 0) use compensation at geometries where the rescaled row range is empty
   (M < 2l); they are not vertices of a consistent system. The consistent vertices at B = 1/2 are tall
   (M >= l + 3): (5, 5, 7) without compensation, (4, 8, 6) and (6, 12, 8) with compensation. None needs a
   prime-sum estimate on the low side.
2. Outcome (a) holds in a different and exact form (Theorems B and C). Relative to the system's own signal formula
   (S) and ideal high side (H): (i) every low-side package that is feasible at a geometry with h > 3 is false
   there; so a B = 1/2 vertex (h = 3) is a boundary point of the set where its inputs can hold; (ii) on the
   compensated tall ray (lx, ly, l) = (b, 2b, (3b - 2)/2) the low side has one unproved input, the saving sigma in
   the correlation of the polar part of A with the marked rows, and the system reads B = 1 - sigma, 0 <= sigma <=
   b/12. A saving Z^-sigma there is equivalent to the conclusion at abscissa 1 - sigma, at every level, and
   sigma = 1/2 (b = 6, full TRO6) is equivalent to the conclusion at 1/2. The probe on the ray is the smoothed
   reciprocal sum of the target plus terms below Z^(lx/2). This is the analogue of `ap-order-two` Theorem B/D.
3. The uncompensated vertex (5, 5, 7) needs one norm input, a large-sieve statement (Conjecture WLS-tall,
   section 6). It was tested at five scales and is flat, like its random control, while the pole control grows
   (MEASURED). By item 2(i) the uniform form of that conjecture contradicts the uncompensated branch of the
   reduced model at h > 3. So either the conjecture fails at large exponents or that branch of the model
   (a guess of r3, never derived) is wrong; in both cases (5, 5, 7) is not a route.
4. Consequence for row Z15: without the modelling hypothesis lx >= l the infimum of the reduced ideal system is
   1/2, not 5/6 (EXACT), and it is attained only at critical vertices, where the needed low estimate is equivalent
   to the conclusion (PROVED-rel the reduced system). The branch "h = r/2 by long marks" closes. Status for this
   branch: ARGUED -> PROVED-rel (reduced system of r3; (S) and (H) transcribed, not re-derived).

Requirement flags (section 9): R1 no, R2 no, R3 no, R4 no.

---

## 0. Plan and what is new

Read: BRIEF (all notices), OBSTRUCTION_MAP section 2, rows Z10-Z18, section 6 item 1; RESULT + REFEREE of
`r3-method-limit` (Theorem 3(b), referee items E2, E3 and "a way around"); `ap-order-two` Theorems A-D;
`e2-ms-slot-capacity` sections 1-3; `c4-kloss-marks-scaleup` (Conjecture WLS, definitions, controls);
`c4-thin-twist-control-78` (Proposition D); `n2-kloss-sdp-certificate/gram.py` (copied as code); manuscript
(6.1), (6.2), (12.4), (12.5), 13.1, 16.1.

Not repeated: single-input price list (`bypass-78`), row orders (`zf-higher-rows`), paired rows
(`r2-zf-paired-rows`), the K-loss at the model point (M, l) = (1, 1/3) (`c4-kloss-marks-scaleup`).

New here:
1. The geometry of compensation is imposed (M >= 2l and ly >= l, or no compensation). r3's free-geometry table
   kept the compensated high side where the rescaled term is empty.
2. Three low-side packages with their true status: k = 0 is elementary for M >= 2 + 2l (complete character sums);
   between, the large sieve with or without the (QN)^(2/3) term.
3. The criticality theorem (referee item E3 of r3 turned into a statement) and the equivalence on the tall ray.
4. A numerical test of the one norm input that is not a correlation statement (tall geometry, M > 1 + l; c4 worked
   at M = 1).

## 1. First lemma: the estimate a system with l - lx = 2 needs

Notation of `r3-method-limit` section 1: X = Z^lx, Y = Z^ly, marks of total length l (P = Z^l), M = lx + ly,
b = ly - lx, h = 1 - lx + l, Q = XY. Probe (manuscript (6.2), (12.5)):

    I = Q^(-1/2) sum_m A_m R_m,   R_m = marked completed row.

Reduced product form of the marked row (cube completion omitted, as in n1, n2, c4, e2):
R_m = sum_{c = p c'} b_c chi_c(m), b_c = gamma_2(c) conj-alpha(c) eta-factor q_c^(-1/2) W(q_c / Z^(1+l)), p in the
slot [P, 2P], q_c' <= Z. Normalisation: sum_c |b_c|^2 = Z^o(1).

Signal (S): row u = 1 contributes Z^C(s) F(s)/L(s, eta), C(s) = s - 1 + lx/2 + h/6.
Low side (L): |I| << Z^(lx/2 + G + k/2), where Z^(2G) = ||A||^2 Y/Q (Gram excess of A) and
Z^k = sum_m |R_m|^2 / Z^M (row excess). Abscissa: B = 1 - h/6 + G + k/2.

**Lemma 1 [PROVED-rel (S), (L); scalar].** A system with effective order r/h = 2 (h = 3, that is l - lx = 2) and
abscissa 1/2 needs

    (N)   |I_modified(Z)| << Z^(lx/2 + eps)   for all large Z,

the square-root level with no excess. In norm form it needs both
    (N-A)  sum_{q_m ~ Z^M} |A_m|^2 << Z^(M - ly + eps)        (G = 0), and
    (N-R)  sum_{q_m ~ Z^M} |R_m|^2 << Z^(M + eps)             (k = 0),
or, where the norm of A has the polar excess Z^(b/6) (b > 0, measured polar law of the tro6 lanes), (N-R) together
with the correlation statement
    (N-C)  Q^(-1/2) |sum_m A_m^coh R_m| << Z^(lx/2 + eps),    A^coh = polar part of A,
a saving Z^(-b/12) against the Cauchy-Schwarz bound for that part (TRO6 at eta = 1 at this b).
In general a system at abscissa B needs exponent lx/2 + e with e = B - 1 + h/6.

Proof. B = (low exponent) - (C(s) - s) (manuscript Prop. 2.1; r3 Theorem 1). With h = 3: C(1/2) = lx/2. QED

Which geometries carry (N) is the content of sections 2-3.

## 2. Theorem A: the thin branch is empty; where compensation exists

Compensation (12.5) subtracts q_p^(-3/2) I(X/q_p, Y/q_p, Z). Its s-sum has length Y/P and its row range is
q_m ~ q_s X / q_p, of size Z^(M - 2l). X enters only through the weight W_0(q_m/(q_s X)), so X/P < 1 is allowed
(referee item E2 of r3). The rescaled term is nonempty iff

    (GEO-Q)   ly >= l   and   M >= 2l.

Otherwise the rescaled term is zero and the probe is uncompensated; the reduced high side is then r3's
`comp=False` form (no -l/2, no amplitude term) [MODEL, r3's guess; weakest step 1].

High side, floor class: H0 = 1/2 - ly/2 + 5h/6 - l/2 <= B (compensated), H0' = 1/2 - ly/2 + 5h/6 <= B (not).

**Theorem A [PROVED scalar; EXACT `lp5.log` T5].** In the reduced system no geometry with l >= M has abscissa
B <= 1, for any G >= 0 and k >= 0.
Proof. Compensated: (GEO-Q) and l >= M give M >= 2l >= 2M, so M = l = 0. Uncompensated: l >= M = lx + ly gives
h = 1 - lx + l >= 1 + ly, so H0' >= 1/2 - ly/2 + 5(1 + ly)/6 = 4/3 + ly/3 > 1. QED

Consequences.
* r3 Theorem 3(b), columns "polar kept" (l = 7/2 at lx = ly = 3/2, M = 3 < l) and "G = 0" (l = 2, lx = 0): these
  use the compensated high side with M < 2l. They are not vertices of a consistent system. The column "polar kept,
  no compensation" (l = 7) is confirmed: vertex (5, 5, 7).
* The heuristic's premise ("a prime variable of length Z^(7/2) or Z^2 against Q <= Z^3 rows; the dual large sieve
  gives max(Q, #marks)") never arises. At every feasible point the rows outnumber the marks.
* Two forms of the heuristic that are true but vacuous here [PROVED]:
  (i) duality: for marks with arbitrary |a_p| <= 1, sup_a sum_m |B_m|^2 |P^(-1/2) sum_p a_p chi_p(m)|^2
  >= P max_m |B_m|^2 >= Z^(l - M) sum_m |B_m|^2 (take a_p = conj chi_p(m_0)); so k >= l - M for a
  coefficient-blind estimate. Adding this row changes no value in `lp5.log` T1 (packages `dual`, `srcdual`).
  (ii) marks priced pointwise by ZF(theta) for the row family (|P^(-1/2) sum_p|^2 <= P^(2 theta - 1)):
  B_low = 5/6 + lx/6 + G + l(theta - 2/3) >= 5/6 for theta >= 2/3. Marks priced this way never go below 5/6
  unless theta < 2/3 is already known (`lp5.log` T4: 5/6 for theta = 2/3, 3/4, 5/6, 7/8).

Exact vertex table (`lp5.log` T1-T3; smallest l at the stated B; "comp" = (GEO-Q) imposed):

| low package | comp | inf B | vertex at B = 1/2 (lx, ly, l) | M, 1 + l | at B = 3/4 | at B = 4/5 |
|---|---|---|---|---|---|---|
| polar G, k = 0 or optimal large sieve | yes | 5/6 | none | | none | none |
| polar G, k = 0 or optimal large sieve | no | 1/2 | (5, 5, 7) | 10, 8 | (2, 2, 5/2) | (7/5, 7/5, 8/5) |
| polar G, proved large sieve (with (QN)^(2/3)) | either | 1 | none | | none | none |
| polar or TRO6 G, source k | either | 13/15, 0.8810, 6/7, 13/15 | none | | | |
| TRO6 G (eta = 1), k = 0 or optimal large sieve | yes | 1/2 | (4, 8, 6) | 12, 7 | (1, 2, 3/2) | k = 0: (2/5, 4/5, 3/5); optimal sieve: (3/5, 6/5, 4/5) |
| TRO6 G (eta = 1), proved large sieve | yes | 1/2 | (6, 12, 8) | 18, 9 | (3, 6, 7/2) | (12/5, 24/5, 13/5) |

G packages: polar = max(0, b/12); TRO6 = max(0, b - ly/2). k packages: optimal large sieve = max(0, 1 + l - M);
proved large sieve = max(0, 1 + l - M, (2 + 2l - M)/3); source = max(0, J, K, P) of Liu II section 15.1.
The value 6/7 with source k and TRO6 G agrees with referee item E1 of r3; 13/15 with r3 T1.
All values are MODEL abscissae with the ideal high side (density-hypothesis counts, Lindelof on the class).
r3's note E4 applies: H0 is conservative for ly > h, so the minimal l may be smaller than listed.

Status of the k packages.
* k = 0 for M >= 2 + 2l + eps [ARGUED, elementary]: for columns n != n' of norm <= Z^(1+l) the character
  chi_n conj chi_n' in the variable m is nonprincipal of conductor norm <= Z^(2+2l); a smooth sum over all m of
  norm about Z^M >= Z^(2+2l+eps) is a complete sum and vanishes up to Z^(-A). So sum_m |R_m|^2 = Z^M ||b||^2
  (1 + o(1)) times a divisor factor from the cube parts. The source's K-loss M + l - 1 is a property of the
  reflection used there, not of the norm, in this range.
* 1 + l <= M < 2 + 2l: the proved cubic large sieve has the term (QN)^(2/3), sharp for general coefficients
  (Dunn-Radziwill; RECALLED, as in r3). k = 0 there is Conjecture WLS-tall (section 6).

## 3. Theorem B: criticality

**Theorem B [PROVED-rel (S), (H), Prop. 2.1; EXACT `lp5.log` T6 and `chk_high.log` for the regions].** Let g be a
geometry at which the high-side rows of the reduced system hold for every B in [1/2, 1] and h(g) > 3. Then no low estimate
|I| << Z^(lx/2 + e), e < (h - 3)/6, is true at g. Equivalently: every low-side package whose B_low(g) is below 1/2
is false at g, or (S)/(H) are not valid at g.

Proof. Let beta* >= 1/2 be the supremum of real parts of zeros over the family (zeros exist in the strip and are
symmetric about 1/2). If the low estimate held, the system at g would be feasible at every abscissa
B in (1 - h/6 + e, 1], in particular at some B < beta* when beta* > 1/2 (then Prop. 2.1 with the ideal high side
excludes the zero: contradiction), and when beta* = 1/2 the high side is unconditional (floor class only), the
identity I = signal + noise with noise << Z^(C(1/2) - margin) gives signal(Z) << Z^(C(1/2) - delta) for all Z,
and Mellin inversion continues F(s)/L(s, eta) to Re s > 1/2 - delta, against a zero on the line. QED

This is Proposition D of `c4-thin-twist-control-78` with zeta's own critical zeros in the place of the control's
zero. It makes referee item E3 of r3 precise: "the reduced system returns B < 1/2" means "its inputs are false
there".

Regions (T6): low rows at B_low = 49/100, 2/5, 1/4 with high rows at 1/2 are feasible for
(polar, optimal sieve, no comp) at (51/10, 51/10, 179/25), (6, 6, 43/5), (15/2, 15/2, 11);
(TRO6, proved sieve, comp) at (153/25, 306/25, 409/50), (36/5, 72/5, 49/5), (9, 18, 25/2).
At these six geometries and at the vertices (5, 5, 7), (4, 8, 6), (6, 12, 8), (3, 6, 7/2), (12/5, 24/5, 13/5) the
high rows hold for all B in [1/2, 1] (`chk_high.py`, exact, 501 values of B).

**Corollary B1 [PROVED-rel].** At a vertex V with h = 3 and B = 1/2: GRH for the family implies (N) at V
(signal and noise are both << Z^(C(1/2) + eps) = Z^(lx/2 + eps)); and (N) at V with the high side of the system
implies GRH for the family. The needed estimate is equivalent to the conclusion. Every neighbourhood of V
contains geometries with h > 3 at which the same package is false.

**Corollary B2.** A low-side package given by an inequality that is uniform in the geometry (a large-sieve
inequality valid for all Q >= N; a correlation saving with a fixed fraction eta of the polar exponent for all b)
cannot be the input at a B = 1/2 vertex: uniformity extends it to h > 3, where it is false. The input at V must
change its exponent exactly at h = 3, i.e. it must itself encode the abscissa 1/2.

## 4. Theorem C: on the compensated tall ray the low-side input is the conclusion

Ray: (lx, ly, l) = (b, 2b, (3b - 2)/2), b >= 2. Then M = 3b = 2 + 2l (k = 0 elementary, section 2), M >= 2l and
ly >= l (compensated), b - ly/2 = 0 (no P_a^2/Y' term), h/6 = b/12.

**Theorem C [PROVED-rel (S), (H), the polar decomposition of A (MODEL), k = 0 (ARGUED)].** On the ray:
(i) the Cauchy-Schwarz bound with the polar norm is |I| << Z^(lx/2 + b/12), which gives B = 1: nothing;
(ii) for 0 <= sigma <= b/12:  |I| << Z^(lx/2 + b/12 - sigma + eps)  if and only if  the system's conclusion at
abscissa 1 - sigma (zero-freeness of the family there), given the high side at that abscissa;
(iii) the part of I not coming from the polar part of A is << Z^(lx/2) by Cauchy-Schwarz with proved norms, so
the saving sigma is a saving in the single correlation (N-C), i.e. TRO6 with eta = 12 sigma / b;
(iv) sigma <= 1/2 for every b (Theorem B); eta = 1 is possible only for b <= 6, and at b = 6, vertex (6, 12, 8),
eta = 1 is equivalent to the conclusion at 1/2. For b > 6: eta <= 6/b.

Proof. C(B) = B - 1 + lx/2 + h/6 = lx/2 + b/12 - (1 - B). (ii, =>) is Prop. 2.1 with B_low = 1 - sigma (the
high rows hold on the ray for 1/2 <= B: `lp5.log` T2, T3 vertices (3, 6, 7/2), (12/5, 24/5, 13/5), (6, 12, 8) are
on the ray). (ii, <=): with the family zero-free right of 1 - sigma, the signal integral on Re s = 1 - sigma + eps
is << Z^(C(1 - sigma) + eps) and the noise is below it by E <= 0. (iii) k = 0 and the non-polar Gram bound.
(iv) Theorem B. QED

Reading. On the ray, I = (smoothed reciprocal sum of the target, Z^(C(s)) F/L integrated) + O(Z^(lx/2 + eps))
+ noise, and the first term is the correlation of the polar part of A (sextic theta coefficients) with the marked
cubic rows. The abscissa is 1 minus the power saving in that correlation. A norm estimate gives saving 0. So the
estimate needed for effective order 2 on this branch is not an independent arithmetic input: it is the conclusion
in another variable, at every level 1 - sigma and not only at 1/2. TRO6-natural was measured at b = 1/8, where
eta b/12 is at most 1/96; the ray needs b >= 2 for any abscissa below 5/6 and b = 6 for 1/2.

Vertex (4, 8, 6) (TRO6 G, k = 0 by the optimal sieve at (M, 1 + l) = (12, 7)) is the same statement with one
more unproved input (WLS-tall); Theorem B applies to it unchanged.

## 5. The uncompensated vertex (5, 5, 7)

Inputs: G = 0 at b = 0 (balanced additive norm, manuscript Lemma 6.2; CLASSICAL planar large sieve); k = 0 at
(M, 1 + l) = (10, 8), which is Conjecture WLS-tall; (S); the uncompensated high side H0' (tight: H0' = 1/2).

Large-sieve duality [CLASSICAL in form (Heath-Brown's recursion for the cubic sieve); ARGUED here]. For Q > N,
Poisson summation in m gives
    sum_m |R_m|^2 = Q ||r||^2 + (Q/N) sum_{q_k <~ N^2/Q} |sum_n r_n g~_6(n) conj chi_n(k)|^2 + small,
with g~_6 the normalised sextic Gauss sum. So WLS at (Q, N) is the optimal thin sieve (rows K = N^2/Q < N) for
the Gauss-twisted coefficients. At (10, 8): K = Z^6 against marks P = Z^7. The thin configuration of the
heuristic reappears on the dual side, with budget: mean |dual row|^2 <= N/K = Z^2, while the optimal thin sieve
for the mark factor alone gives P/K = Z. No pointwise prime-sum bound is needed if the optimal sieve holds for
these coefficients; the proved sieve gives Z^(8/3) and fails.

**Dichotomy [PROVED-rel Theorem B].** On the cone (t, t, t + 2 + d), t > 5 + 2d, d > 0, the same inputs give
B_low = 1/2 - d/6 with the high rows satisfied at 1/2. So at least one of the following holds:
(1) WLS-tall fails on the cone by at least Z^(d/3) (while (M, N) = (2t, t + 3 + d) has the same shape as (10, 8));
(2) the uncompensated branch of the reduced model ((S) unchanged and H0' = H0 + l/2) is not valid for l > lx.
Under (1) the vertex needs the non-uniform, critical form of the sieve (Corollary B2). Under (2) the vertex does
not exist. The measurements of section 6 favour (2) weakly (flat at the accessible exponents); they cannot reach
the cone (rows Z^10 and more).

## 6. Conjecture WLS-tall and the two-scale test [MEASURED]

**Conjecture WLS-tall.** For the manuscript row coefficients b_c = gamma_2(c) conj-alpha(c) q_c^(-1/2) W on
columns c = p c' (p in a slot [Z^l, 2 Z^l], q_c' <= Z) and rows q_m ~ Z^M with M >= 1 + l:
sum_m |sum_c b_c chi_c(m)|^2 << Z^(M + eps) sum_c |b_c|^2.

What it would give, in the reduced model: with G = 0 at b = 0 (proved) and the uncompensated ideal high side,
abscissa 5/6 - (l - lx)/6 on lx = ly, e.g. 4/5 at (7/5, 7/5, 8/5), 3/4 at (2, 2, 5/2), 1/2 at (5, 5, 7); each
also needs density-hypothesis counts and Lindelof on the classes, and branch (2) of the dichotomy must not hold.
It is a mean-value statement over rows, not a prime-sum statement.

Test: `wls_tall.py` (definitions and code copied from `n2-kloss-sdp-certificate/gram.py`; rows chunked; exact
integer sextic symbols; float64 sums). G = mark Gram matrix. one = 1^T G 1 / tr G (coefficients a_p = 1, the
quantity k measures); lam = n lambda_max(G)/tr G (bound for the supremum over |a_p| <= 1). Variants: Ap
(manuscript row), Rnd (random phase per column), K (Kubota row gamma_2 with chi^4: theta pole, growth control).
For l >= 1 each column has exactly one mark, so the overlap term of c4 is absent.

Geometry (M, l) = (2.8, 1.6): the B = 4/5 vertex (7/5, 7/5, 8/5).

| Z | rows | marks | columns | Ap one | Ap lam | Rnd one | Rnd lam | K one | K lam |
|---|---|---|---|---|---|---|---|---|---|
| 16 | 532 | 17 | 68 | 1.0526 | 1.694 | 1.0110 | 1.696 | 1.1736 | 1.689 |
| 32 | 3706 | 41 | 369 | 1.0094 | 1.392 | 1.0048 | 1.396 | 1.3139 | 1.462 |
| 64 | 25869 | 105 | 1680 | 1.0209 | 1.436 | 0.9990 | 1.443 | 1.4040 | 1.601 |
| 128 | 180174 | 284 | 9372 | 1.0101 | 1.554 | 1.0027 | 1.549 | 1.5792 | 1.804 |
| 256 | 1254774 | 760 | 49400 | 1.0027 | 1.402 | 0.9989 | 1.401 | 1.9998 | 2.174 |

Geometry (M, l) = (3.2, 1.0): dual rows K = Z^0.8 below the mark length Z (dual-thin, as at (5, 5, 7)).

| Z | rows | marks | columns | Ap one | Ap lam | Rnd one | Rnd lam | K one | K lam |
|---|---|---|---|---|---|---|---|---|---|
| 16 | 1620 | 5 | 20 | 0.9791 | 1.602 | 0.9935 | 1.634 | 1.0065 | 1.615 |
| 32 | 14868 | 6 | 54 | 1.0119 | 1.187 | 1.0055 | 1.187 | 1.0366 | 1.177 |
| 64 | 136528 | 15 | 240 | 1.0004 | 1.349 | 0.9970 | 1.347 | 1.0562 | 1.359 |
| 128 | 1254774 | 22 | 726 | 0.9991 | 1.377 | 0.9996 | 1.378 | 1.0437 | 1.382 |

Reading.
* Ap: one tends to 1 (1.053 -> 1.003 at (2.8, 1.6)); lam equals the random control to 3 digits at every Z. No
  growth. The conjecture survives at both geometries and all scales tried.
* K (pole control) at (2.8, 1.6): the excess one - 1 = 0.17, 0.31, 0.40, 0.58, 1.00; last-step exponent 0.79;
  the prediction from the (QN)^(2/3) term is Z^0.8. The functional detects coherent growth at these sizes.
  At (3.2, 1.0) the predicted exponent is 0.27 and the excess (0.04 to 0.06 with 5 to 22 marks) does not resolve it.
* As in n2 and c4, the flatness is not specific to the manuscript coefficients (the random control is equally
  flat). It is evidence that these coefficients carry no pole in this direction, not evidence of an arithmetic
  mechanism.
* Not run: Z = 512 at (2.8, 1.6) (projected 36 minutes, above the local limit; stopped by the lane; no result
  used). The exponents of the B = 1/2 vertices (rows Z^10 to Z^18) are out of reach of any direct test.

## 7. Controls

The lane proves statements about an estimate system. Each is an instance of Prop. 2.1 and holds verbatim for a
control with 1/2 replaced by the control's own abscissa; none separates zeta from a control. For each control, the
step at which a B = 1/2 vertex system stops:

| control | step that fails | status |
|---|---|---|
| THIN (completely multiplicative sign twist with a zero at b in (7/8, 1), `c4-thin-twist-control-78`) | Prop. 2.1, (6.2), (7.5), Lemma 7.1 and the large sieve hold. On the ray the correlation (N-C) needs the completed cubic reflection, whose line "phi is L-periodic" (Prop. 5.1) is false for the twist; on the high side Lemma 4.8 and Lemma 8.1 (Hecke strip growth, reflected-line bound) are unavailable. Theorem C for the twist reads: saving sigma <= 1 - b. | ARGUED (from c4-thin section 3) |
| sign twists TW+, TW- | same as THIN when the twist is not a ray-class character; when it is one, it is a member of the family and the system applies. Liouville twist: the reciprocal has a pole at 1 and the system returns 1. | ARGUED |
| T-NR (one local factor changed) | the system is run for the function with the factor at q deleted (Section 2, abs(eta(p)) = 1 at the remaining primes); restoring the factor fails because the local factor has zeros at Re s = 1/2 +- arccosh(abs(c)/2)/log q. Rows Z18, G21. | ARGUED |
| theta^w | not formulable: no completely multiplicative target, so the local identity Lemma 7.1 has no analogue at the first prime. This is not a quantitative handle. | stated |
| WLS-tall, numerics | the random-phase control passes exactly as the manuscript row; the Kubota pole control fails (grows). So the measured property is absence of a theta pole in the marked direction; it does not use multiplicativity of the target. | MEASURED |

Davenport-Heilbronn, backward heat: not applicable (no statement about zeros, no positivity).

## 8. What moves in the map

* Row Z15, sentence "5/6 is not established as the limit: the reduced system is inconsistent outside lx >= l":
  replace by: outside lx >= l the reduced ideal system has infimum 1/2 (EXACT), attained at h = 3 on tall
  geometries only; the thin configuration is infeasible (Theorem A); inputs with B_low < 1/2 are false
  (Theorem B); on the compensated ray the input is equivalent to the conclusion at each level (Theorem C).
  Between 5/6 and 1/2 every vertex found needs TRO6 at eta = 1 (compensated; b = 2/5 at the 4/5 vertex, far above
  the measured b = 1/8) or the uncompensated branch with WLS-tall, plus the ideal high side; with the polar term
  kept and compensation, 5/6 stands (r3 Theorem 1, second form).
* Section 6 item 1, "prime marks with l - lx = 2 are heuristically circular": the stated mechanism (GRH-strength
  prime sums on the low side) does not occur; the conclusion stands for a different reason (Theorems B, C).
  Status PROVED-rel the reduced system.
* r3 Theorem 3(b) table: columns "polar kept" and "G = 0" with compensation are not consistent vertices; the
  compensated minimal lengths need TRO6 G and are l = 6 (optimal sieve) or 8 (proved sieve) at B = 1/2.

## 9. Requirement flags

* R1 (all primes together, multiplicativity essential): **no**. The results are scalar identities of the estimate
  system and Prop. 2.1; the numerics pass with random phases.
* R2 (height-uniform, every window): **no**. No conclusion about a function is drawn. (Prop. 2.1 is
  height-uniform; this lane adds nothing to it.)
* R3 (fails for every control at a named structural step, verified): **no**. Section 7 names steps by reading
  c4-thin and rows Z18, G21; none was verified here, and theta^w is "not formulable".
* R4 (finite stages or the region right of 1 to the critical line): **no**. The branch that reaches 1/2 inside
  the 7/8 architecture is shown to need an input equivalent to the conclusion.

## 10. Three weakest steps

1. **Everything is relative to the reduced system of r3, transcribed and extrapolated.** (S) is proved in the
   manuscript at its own geometry and for Re s > 7/8; row Z18 records that the scalar factor at the signal poles
   is L^S(6s - 3, (lambda eta)^6) E_eta with E_eta absolutely convergent only for Re s > 1/2 and per-prime
   bounds stopping at 2/3, and for targets with (lambda eta)^6 principal it has a pole at s = 2/3. Theorems B and C
   use (S) down to Re s = 1/2 and a nonvanishing scalar factor at the zeros. The uncompensated high side
   (H0' = H0 + l/2 with (S) unchanged) is r3's guess and was not derived; the dichotomy of section 5 suggests it
   is wrong. If (S) or (H) fail outside lx >= l, the vertices do not exist; the closure of the branch survives
   (no route either way), but "infimum 1/2" would not.
2. **Theorem C depends on a decomposition that is MODEL.** "Polar part of A" and "the remainder has Gram excess
   0 when b <= ly/2" are r3's G branches (manuscript Prop. 15.2 plus TRO6 at eta = 1), extrapolated from
   b = 1/8 to b >= 2. k = 0 for M >= 2 + 2l is argued in the product form with the cube completion omitted and
   with a smooth row weight; it was not written against the manuscript's completed row. The equivalence (ii)
   needs the ideal high side (density-hypothesis counts) at levels above 1/2.
3. **The numerics are small.** Z <= 256, 5 to 760 marks, exponents (M, l) = (2.8, 1.6) and (3.2, 1.0) only;
   float64; the pole control resolves growth only at the first geometry. The test is at the B = 4/5 vertex of a
   branch that the dichotomy puts in doubt, and it cannot approach the cone h > 3. The (QN)^(2/3) sharpness and
   Heath-Brown's recursion are recalled, not re-read.

## 11. Files

`lp5.py`, `lp5.log` (exact LP, T1-T6), `chk_high.py`, `chk_high.log`, `tiers_copy.py` (copy of r3 `tiers.py`, solver only),
`wls_tall.py`, `wls_Z*.log`, `wls_dualthin_Z*.log`, `wls_Z*_M*_l*.json` (key `R` holds the random-control record;
row counts are in the logs), `wls_summary.txt`.
