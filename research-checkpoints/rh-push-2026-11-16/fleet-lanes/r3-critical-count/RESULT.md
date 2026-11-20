# r3-critical-count: a count saving at the critical class of Liu 2610.26835v2 (combination C3, round 3)

Internal working note, 2026-11-16. Unrefereed. Nothing committed or pushed. Writes only in this directory.
Everything is relative to unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`),
Liu arXiv:2610.12234, Xu-Sang arXiv:2610.15291v2, Liu arXiv:2610.26835v2 ("Liu II", text copy
`../bypass-78/dl/2610.26835.txt`; line numbers below refer to it). No new zero-free region. RH open. NO QED.

**Verdict: precise obstruction. No count saving tau > 0 is proved. B_flat = 0.874886647 (unrefereed) is unchanged;
7/8 remains the Lean-checked value.**

What is established:

1. (a) hybrid, (b) Jutila / Heath-Brown, (c) Guth-Maynard: each is closed at the critical class by a short
   argument that does not depend on the quality of the sextic large sieve (Lemmas E, J, T; section 2).
2. The count at the critical class is a saddle of two moment inputs at one witness pair (r*, m*) =
   (0.745700, 0.418254). A new second-moment estimate lowers the count only if it acts on a polynomial of total
   length Y in (0.872850, 1.112460) built from that pair. The only such polynomials are "inverse witness x primes"
   and "plain witness squared x primes" with more prime length than the source moments M1, M2 admit (Lemma W,
   section 3). The long-inverse exponent e(r) = (1 + 5r)/6 is the best a second moment at level with multiplicity
   can give; improving it needs a mean-square saving for Moebius sums longer than the family, which is itself a
   density estimate (Corollary W1'). So a count saving at the critical class through second moments is the same statement
   as a lower prime cost in M1 or M2.
3. The prime cost c1 = 2 of M1 (condition r + 2z < 1) is the sensitive lever, about ten times more than the cost
   6 kappa of M2 per relative change. Price (MODEL, with the prime supply imposed): c1 = 1.9 gives 2.2e-4, c1 = 1.75
   gives 6.5e-4, c1 = 1.5 gives 1.5e-3 to 1.7e-3 below the reference, and the lever saturates at about 2.0e-3
   (B about 0.8728-0.8730) because the probe supplies only prime length 0.21. Table in section 4. This lever was
   named but not priced by round 2.
4. The exact missing inequality is (M1+) of section 5. Its origin in the source is identified: both M1
   conditions are the two hypotheses of the canonical estimate (manuscript Lemma 17.2) with the prime marks charged
   once more against the dual row length (READ, section 5.1).

Labels: PROVED (argument written here) / PROVED-rel (relative to the source as stated) / CLASSICAL / READ
(structural reading of the source, not re-derived) / MEASURED (float scripts here) / MODEL (hypothetical input
priced; not a bound) / SKETCH / OPEN.

---

## 0. Plan; what differs from the atlas, the walls and the closed lanes

Read: BRIEF, CRITIC_R1, and RESULT + REFEREE of bypass-78 (no referee file exists), zf-hecke-all-fields,
zf-audit-inputs, zf-higher-rows, zf-large-values, r2-zf-critical-density, r2-zf-paired-rows,
r2-zf-gm-inverse-witness, r2-tro6-polar-theorem, r2-tro6-nonpolar-scale, r2-tro6-type12-split, tro6-numerics,
tro6-period. Source: Liu II sections 10.4, 12.4, 13.1, 13.4 (l.4995-5045, 5700-5925); manuscript Lemmas 17.1,
17.2, 14.3 and the initialization in section 17.6 (l.6930-7020, 8655-8800, 5862-5900).

Not repeated:
* r2-zf-critical-density: Lemma H (phase-blind hybrid over targets in the remainder), the general sieve with the
  (KD)^{2/3} term, max-form Halasz-Montgomery, unequal lengths and mixing, gated price of a uniform tau.
* r2-zf-gm-inverse-witness: cubic-trace expansion on an arbitrary row set, (GM6), sextic norm numerics.
* zf-large-values: Guth-Maynard shape against the mean value.
* bypass-78 price list; TRO6 lanes (low side; not a count).

Different here:
* (b) the pair-averaged (Jutila) form that both r2 notes list as untested is settled for every moment order k and
  every bound on the restricted norm (Lemma J);
* (a) and the "t-aspect traded" variant are settled by one enlargement statement with multiplicity (Lemmas E, T);
* the count is treated as a saddle and the set of polynomials that can move it is determined (Lemma W);
* the M1 prime cost, named in r2-zf-gm-inverse-witness section 3 and its referee item 4.1 as the strongest
  adjacent lever and left unpriced, is priced in the full system with the prime supply and the gates.

Walls. No zero statement is made, so DH, flow-blindness and verified height are not engaged by a claim (section 6).
A count is a mean-value statement that the method consumes; MV-CAP does not block it, and nothing here uses a mean
value to certify an every-row statement.

## 1. Setup (PROVED-rel Liu II Lemma 13.7, (13.2), (13.3), (13.14)-(13.16))

Family size U, rows u sixth-power-free, q_u ~ U = Z^d; critical scale d = h. Class (delta, x): the row has a twist
psi in X_u with a zero at real part a = (1 + delta)/2 and prime sums of amplitude g = delta x, 0 <= x <= 1/2.
All polynomials are centrally normalised.

* Detector (13.14), for each 1 <= t <= 3/2: a dyadic pair (r, m) with t - 1/2 <= r <= t, r + m >= t, m <= 1/2,
  |M_r S_m|^2 >= U^{delta (r+m)}, and the individual bounds |M_r|^2 ~ U^{delta r}, |S_m|^2 >= U^{delta m}.
  The pair is chosen by the row, not by the prover.
* M1 (13.2): r + 2z < 1 and 2r + 8z < 3 imply Sum_{q_k << U} |M_r Q|^2 << U^{1+eps}. Prime lists arbitrary within
  their annuli, bounded row-independent coefficients.
* M2 (13.3): n1 + n2 + 6 kappa z < 1 implies Sum |S_{n1} S_{n2} Q|^2 << U^{1+eps}; full prime annuli, coefficients
  in a fixed finite span, needs beta_* <= (1 + kappa)/2.
* Long inverse (Lemma 10.10): Sum_u |M_r|^2 << U^{e(r)}, e(r) = max(1, (1 + 5r)/6), from the multiplicity of the
  rows u a^6.
* Prime-sum factors are "exactly the original Q_i" of the probe (l.5861-5868): total supply l/d in U-units, about
  0.21 at d = h; the source uses supply > 1/5.

Write the prime costs as c1 (M1: r + c1 z < 1; source c1 = 2) and c2 (M2: 2m + c2 z < 1; source c2 = 6 kappa).
Count options at a pair (r, m):

  M1(r) = 1 - delta r - 2 delta x (1 - r)/c1   (r <= 1),   e(r) - delta r   (r >= 1),
  M2(m) = 1 - 2 delta m - 2 delta x (1 - 2m)/c2.

R(delta, x) = min over t of max over admissible (r, m) of min(M1, M2). `caps.py` part A reproduces the closed form
(13.16) to 2e-5 at four classes.

Critical class (`checks.log` item 1): delta_c = 0.469345, x = 1/2, kappa_flat = 0.749773,
t* = 1.163954, r* = 0.745700, m* = 0.418254, R_c = M1(r*) = M2(m*) = 0.590332. Source capacities there:
z_M = (1 - r*)/2 = 0.127150, z_S = (1 - 2m*)/(6 kappa) = 0.036343. Density-hypothesis value 1 - delta_c = 0.530655.

## 2. The three named routes

### 2.1 Lemma E (enlargement with multiplicity). PROVED

Level condition (L). A second-moment bound Sum_{F'} |F|^2 << U^{N} for a centrally normalised polynomial F of
length U^Y over a family of size U^{1+q} is "at level" if N >= max(1 + q, Y). Every coefficient-free (operator
norm) bound is at level: the squared norm of a |F'| x K matrix with entries of modulus 1 on a positive proportion
of positions is at least a constant times max(|F'|, K) (Frobenius norm over rank). Every bound for Y <= 1 + q that
is not below the diagonal U^{1+q} is at level. The source moments M1, M2 are at level (they have Y <= 1, N = 1).
A bound that is not at level is a mean-square saving for a polynomial longer than the family; for Moebius
coefficients that is itself a zero-density estimate for the family (Markov), see Corollary W1'.

Let F' be a family of characters containing the rows, |F'| = U^{1+q}, in which each detected row is represented
U^{omega} times with the same polynomial values. A count obtained from a second moment at level over F', for a
polynomial of length U^Y and spike U^{delta' Y}, delta' <= delta, has exponent at least

  max(1 + q, Y) - omega - delta' Y.

Proof. U^{omega} R U^{delta' Y} <= U^{N}, N >= max(1 + q, Y). QED.

Consequences.
* q > 0, omega = 0 (targets nu in a growing set; norm twists N^{it}, |t| <= T = U^q; any other twist under which a
  zero of one L-function is a zero of one member): the best possible exponent rises from 1 - delta to
  (1 + q)(1 - delta). A hybrid mean value over (target, row) or (t, row) cannot count rows better than the row
  family alone. This is the count-side companion of Lemma H of r2-zf-critical-density (which was the
  remainder side).
* omega > 0 needs distinct members with the same values chi_n(u) for all n. By (E1) of r2-zf-gm-inverse-witness
  (confirmed by its referee) chi_n(u) = chi_n(u') for all n prime to uu' forces u/u' to be a sixth power. So the
  only multiplicity available inside the residue-symbol family is u -> u a^6, with q = 6 alpha, omega = alpha.
  This is Lemma 10.10. Applied with primes (PROVED arithmetic): M1 at row range U^{1+6 alpha} admits extra prime
  length 3 alpha and costs 5 alpha, net change 5 alpha - 6 delta x alpha >= (5 - 3 delta) alpha > 0; M2 admits
  extra alpha/kappa and costs 5 alpha, net (5 - 2 delta x/kappa) alpha > 0. Amplification never pays for primes.

### 2.2 Lemma T (trading the conductor for the t-aspect). PROVED

For the hybrid family {chi_u N^{it} : q_u ~ U, |t| <= T = U^q} the general-coefficient sextic sieve with short
intervals gives the norm T (U + K/T + (UK/T)^{2/3}) = UT + K + T^{1/3} (UK)^{2/3}. The term T^{1/3}(UK)^{2/3} is
dominated by UT + K exactly when T >= K U^{-1/2}, so the hybrid sieve becomes perfect for long t-ranges. The count
exponent min over Y of max(1 + q, Y, q/3 + 2(1 + Y)/3) - delta Y is increasing in q (`checks.log` item 5:
0.7653, 0.7919, 0.8184, 0.8980 at q = 0, 0.05, 0.1, 0.25), and the perfect value is (1 + q)(1 - delta) by Lemma E.
The detected zeros have height at most Z^tau with tau arbitrarily small (Lemma 13.7), so q = 0 is forced and the
t-range cannot be lengthened without counting pairs (u, t) that carry no zero. No trade exists. QED.

### 2.3 Lemma J (pair-averaged Halasz-Montgomery, every k). PROVED

Let B be any set of R rows and P_u = Sum_n b_n chi_n(u) with |P_u|^2 >= K^{theta} ||b||^2 on B, where
K = Sum_n w(n) for a majorant w >= 1 of the support, and h(u, u') = Sum_n w(n) chi_n(u) conj chi_n(u').
Halasz duality and Hoelder with exponent 2k give, for every integer k >= 1,

  R K^{theta} <= C K + C R^{1 - 1/(2k)} (N_B(k) K^{k+eps})^{1/(2k)},

where N_B(k) is the squared norm of the matrix (chi_N(u'))_{u' in B, q_N <= (cK)^k}. Since N_B(k) >= c max(R, K^k),
the second term is at least c R K^{1/2}. Hence for theta <= 1/2 the inequality holds for every R and gives no
bound, for every k, every K and every estimate of N_B(k), the perfect restricted sieve N_B = R + K^k included.

Proof. (Sum_{u in B} |P_u|)^2 <= ||b||^2 Sum_{u,u' in B} |h(u,u')|. Diagonal: R h(u,u) = RK. For fixed u,
Sum_{u' in B} |h(u,u')| <= R^{1-1/(2k)} (Sum_{u'} |h(u,u')^k|^2)^{1/(2k)}, and h(u, .)^k is a polynomial in u' of
length K^k with coefficient norm^2 << K^{k+eps}. The lower bound for N_B is Frobenius norm over rank. QED.

At the critical class every counted polynomial has theta <= delta_c = 0.469345 < 1/2 (S/n <= delta, PROVED-rel in
r2-zf-gm-inverse-witness section 1). Real part 0.734672, distance 0.015328 below the 3/4 threshold. The
Jutila-type refinement that r2-zf-critical-density (section 2.4, last paragraph) and its referee (item 4.1) left
open gives nothing: the missing 0.0153 cannot be bought by any moment of the pair sums, because the constraint is
that the mean of |h| over pairs of B be below K^{delta}, which is below square-root size. What remains past this
lemma is cancellation between the pair sums (signs), i.e. (GM6) / (MI) of r2-zf-gm-inverse-witness, closed there.
Heath-Brown's 1979 density theorems and the Heath-Brown 1995 quadratic-family density theorem are of the two
types already covered: Halasz-Montgomery above 3/4, and Ingham-type with a perfect sieve, value 3(1-s)/(2-s) =
0.629072 > 0.590332 (r2 table).

## 3. Lemma W: which estimates can lower the count

**Lemma W1 (three-way saddle). PROVED-rel section 1.** At t = t* three values coincide:
M1(r*) = M2(m*) = e(t*) - delta t* = 0.590332 (`checks.log` item 1; 1/6 + (5/6 - delta_c) t* = 0.590332).
(i) Suppose further count options c_j(r, m) are added. If every new option has c_j(r*, m*) >= R_c, then for every
t in [1, t*] the count is at least R_c.
(ii) For t >= t* the pair (r, m) = (t, 0) is admissible up to O(1/log U), with value min(e(t) - delta t, M2(0)),
which is increasing in t and equals R_c at t*.
Proof. (i) For 1 <= t <= t* the pair (r*, m*) is admissible: r* <= 1 <= t, r* + m* = t* >= t, r* >= t - 1/2 since
t <= 1.164 < r* + 1/2, m* <= 1/2. Its value is min(R_c, c_j) = R_c. (ii) e(t) - delta t has slope 5/6 - delta > 0
and M2(0) = 1 - 2 delta x/c2 > R_c. QED.
So a count saving has exactly two sources: an option below R_c at the single pair (r*, m*) (the prover then lowers
t), or a moment for the bare long inverse witness M_r, r near t* = 1.164, below e(r) = (1 + 5r)/6 (the prover then
raises t).

**Corollary W1' (the long branch). PROVED under (L).** By Lemma E a count for M_r, r > 1, from a second moment at
level through an enlarged family with multiplicity has exponent at least
min over alpha >= 0 of max(1 + 6 alpha, r) - alpha - delta r = (1 + 5r)/6 - delta r, attained at alpha = (r - 1)/6.
That is e(r) - delta r. So the MODEL rows "amplification exponent 4/5, 3/4" of bypass-78 and "e(r) slope" of
r2-zf-critical-density can be realised only by a bound that is not at level:

  Sum_{q_k <= H} |Sum_{q_n ~ D} mu(n) psi_k(n) W(q_n/D)|^2 << D^{2 - eta}   for some D > H,

a mean-square saving for Moebius sums longer than the family. By Markov's inequality this is already a
zero-density estimate for the family, uniform in delta, and it holds with H D^{1+eps} under GRH. In the source it
is the first M1 condition at z = 0 (r <= m); the second condition alone would allow r <= 3m/2, and at r <= 3m/2
the count would be 1 - delta at every class (t = 3/2). The second source of saving is therefore the conclusion in
another form, not a route to it. The pair (r*, m*) remains.

**Lemma W2 (window). PROVED arithmetic.** An option obtained from a second moment at level (q = 0),
Sum_u |F_u|^2 << U^{max(1, Y)}, for a product F of total length U^Y with spike at most U^{delta_c Y}, is below R_c
only if

  0.872850 = (1 - R_c)/delta_c < Y < R_c/(1 - delta_c) = 1.112460.

**Inventory at the saddle (`checks.log` item 2).**

| polynomial | length Y | count at level | in window |
|---|---|---|---|
| M_r* | 0.7457 | 0.6500 | no |
| S_m*^2 | 0.8365 | 0.6074 | no |
| M_r* S_m* (the detector's own product) | 1.1640 | 0.6177 | no, above by 0.052 |
| S_m*^3 | 1.2548 | 0.6658 | no |
| M_r*^2 | 1.4914 | 0.7914 | no |
| M_r* x primes of length z | 0.7457 + z | 1 - delta(r* + z) | yes iff z > 0.1272 = z_M |
| S_m*^2 x primes of length z | 0.8365 + z | 1 - delta(2m* + z) | yes iff z > 0.0363 = z_S |

The two lower ends are the source capacities exactly; that is what "saddle" means. Consequences:
* a mixed inverse-plain moment Sum |M_r S_m|^2 << U^{max(1, r+m)}, even if proved, changes nothing at the
  critical class (it is outside the window, and Lemma W1 applies);
* no power or product of witnesses alone enters the window;
* with Corollary W1': **a count saving at the critical class through a second moment at or above the diagonal
  level is equivalent to a prime cost c1 < 2 in M1 or c2 < 6 kappa in M2** at lengths (r, z) near (0.7457, 0.127), resp. (m, z) near (0.418, 0.036).
  Options above the diagonal level (general sieve, Guth-Maynard shape on arbitrary row sets) are closed by r2.

The Guth-Maynard window 0.7605 < n < 0.8927 of zf-large-values is the window for a count of Guth-Maynard shape;
W2 is the window for a count of mean-value shape. They overlap on (0.8729, 0.8927). A mean-value-shape count
there needs only the second moment at level 1; a Guth-Maynard-shape count needs (GM6).

## 4. Price of the prime costs (MODEL; `caps.py`, `caps_supply.py`, `checks.py`)

Count at (delta_c, 1/2), kappa_flat, no supply limit (`caps.log` part B):

| c1 \ c2 | 6 kappa = 4.499 | 3 | 2 | 1 |
|---|---|---|---|---|
| 2 (source) | 0.590349 | 0.588766 | 0.585363 | 0.530655 |
| 1.9 | 0.588709 | 0.587208 | 0.583984 | 0.530655 |
| 1.75 | 0.585681 | 0.584336 | 0.581432 | 0.530655 |
| 1.5 | 0.578247 | 0.577238 | 0.575028 | 0.530655 |
| 1.25 | 0.564507 | 0.563990 | 0.562864 | 0.530655 |
| 1 (natural) | 0.530655 | 0.530655 | 0.530655 | 0.530655 |

First order at the source values: a 1% decrease of c1 gives tau = 3.05e-4; a 1% decrease of c2 gives
tau = 3.2e-5 (`caps.log` part C). The M1 cost is the sensitive one.

With the prime supply L (U-units) imposed (`checks.log` item 3):

| c1, c2 | L = 0.2105 | L = 0.25 | L = 0.5 |
|---|---|---|---|
| 1.5, 6 kappa | 0.578247 | 0.578247 | 0.578247 |
| 1, 6 kappa | 0.577003 | 0.570694 | 0.530655 |
| 2, 1 | 0.579555 | 0.577120 | 0.561632 |
| 1, 1 | 0.561685 | 0.551675 | 0.530655 |

So with the source's supply the natural costs do not reach the density-hypothesis value: the largest tau
available from prime costs alone is 0.0286 (both natural) or 0.0133 (c1 natural). Between c1 = 1.5 and c1 = 1 the supply starts to bind.

System value (balanced lengths, LP in (b, l), fixed point kappa = max(13/18, 2B - 1), supply L = l/h iterated;
class grid 141 x 21, same-grid reference 0.8749133 against the exact 0.8748866, so read the gains, not the
absolute values). "gates" = Remark 14.1 conditions without the two numerical conveniences, as in r2 variant (iii).

| input | optimistic B | gain | with gates | gain | b, l, kappa, L at the optimistic optimum |
|---|---|---|---|---|---|
| source (c1 = 2, c2 = 6 kappa) | 0.8749133 | 0 | 0.8749164 | 0 | L = 0.2090 |
| c1 = 1.9 | 0.8746957 | 2.18e-4 | 0.8746967 | 2.20e-4 | 0.1019, 0.1679, 0.74939, 0.2091 |
| c1 = 1.75 | 0.8742558 | 6.57e-4 | 0.8742836 | 6.33e-4 | 0.0976, 0.1696, 0.74851, 0.2112 |
| c1 = 1.5 | 0.8732108 | 1.70e-3 | 0.8733855 | 1.53e-3 | 0.0949, 0.1738, 0.74642, 0.2151 |
| c1 = 1.25 | 0.8728192 | 2.09e-3 | 0.8730210 | 1.90e-3 | 0.0394, 0.1754, 0.74564, 0.2242 |
| c1 = 1 (natural) | 0.8728192 | 2.09e-3 | 0.8730210 | 1.90e-3 | same (the supply binds below c1 about 1.25) |

Readings.
* In B_flat terms: c1 = 1.9 would give about 0.87467, c1 = 1.75 about 0.87423, c1 = 1.5 about 0.87319-0.87336,
  and the M1 prime cost alone cannot give less than about 0.8728-0.8730 with the source's prime supply. All MODEL,
  all relative to the unrefereed inputs.
* The gated column stops at 0.8730210 for every stronger input, including the unsupplied runs of `caps.log`
  part D. That is the cap of the written sufficient conditions of Remark 14.1 found by r2 (0.873386 on its finer
  grid and with its extra linearised gate); it is a property of the written proof.
* For comparison (bypass-78, r2): uniform count saving 1/120 gives 1.2e-3; TRO6 with eta = 0.1 gives 7.8e-4. The
  M1 prime cost at c1 = 1.5 is worth more than either.
* The c2 rows were not run with supply (about 5 minutes per row). Without supply (`caps.log` part D): c2 = 3 kappa
  gives 5.2e-4, c2 = 2 gives 7.1e-4 optimistic.

Without the supply limit (`caps.log` part D) the optimistic values are 0.8703626 (c1 = 1), 0.8710468 (c2 = 1),
0.8701261 (both), and 0.8666667 = 13/15 only when the long-inverse slope is also set to 0. These are not
attainable with the source's prime supply and are listed for comparison with bypass-78's row "counts at the
density-hypothesis value".

## 5. The exact missing inequality and where the factor 2 comes from

**(M1+).** For one presentation psi_u = nu chi_.(u)^{+-1}, centrally normalised M_r with Moebius coefficients and
Q a product of prime sums over disjoint full annuli of total length z with the fixed coefficients nu-bar(p)
(the "original Q_i"), and some c1 < 2:

  r + c1 z <= 1 - c   implies   Sum_{q_u << U} |M_r(u) Q(u)|^2 << U^{1+eps},

needed for r in a neighbourhood of 0.7457 and z up to (1 - r)/c1 <= 0.21, uniformly in the class parameters.
Each 1% of c1 is worth tau = 3.05e-4, i.e. dB = -4.2e-5 at the refereed rate -0.138.

### 5.1 Origin of r + 2z in the source. READ

Manuscript Lemma 17.1 is deduced from the canonical estimate Lemma 17.2 by one masked Poisson transformation.
With column length D' = r + z (no overlaps), the dual row length after Poisson is M = 2D' - m ((17.69) at
P_1 = 0), the column length is F_0 = D' and the mark cap is z_0 = z. The two hypotheses (17.2) of Lemma 17.2,

  q_{r_rho} <= Z^{F_0 - M - z_0 - c}   and   3M + 6 z_0 + c <= 4 F_0,

become r + 2z <= m and 2r + 8z <= 3m. These are exactly the two conditions of Lemma 17.1 / M1 (checked by
substitution). So the extra z is the term "+ z_0" next to M: the prime marks are charged against the dual row
length in addition to their contribution to the column length. In the terminal estimate (Lemma 14.3, reflected
energy) the proof begins "First remove the inactive slots by triangle inequality in the row Hilbert space"
(l.5898). A triangle inequality over Z^{z_0} marked tuples costs Z^{z_0} more than orthogonality would. This
attribution is a reading of a 170-page argument, not a re-derivation.

### 5.2 What (M1+) requires. SKETCH / OPEN

* For arbitrary bounded coefficients on arbitrary prime lists (the generality in which M1 is stated), c1 < 2 at
  r = 0 is a sextic large sieve of mean-value strength for prime-supported vectors of length above U^{1/2}. For
  squarefree-supported vectors that is false relative to the unpublished lower bound cited in Xu-Sang
  (r2-zf-gm-inverse-witness N1). Whether the extremal Gauss-sum vectors survive restriction to primes is OPEN.
  So (M1+) should be attempted only for the structured coefficients the application has.
* For full annuli with a fixed finite-order coefficient, Heath-Brown's identity writes each prime sum as a
  bounded combination of products of smooth plain sums and short Moebius sums. (M1+) with c1 = 1 then needs
  multi-factor moments Sum_u |M_r Prod M_{a_i} Prod S_{b_j}|^2 << U^{1+eps} at total length <= 1. The simplest
  necessary case is the mixed moment Sum_u |M_r S_b|^2 << U^{1+eps} for r + b <= 1 with b up to 0.21. The source
  has no moment in which Moebius and plain factors occur together; by Lemma W the mixed moment is useless at the
  saddle on its own, and it is the first new inequality on the way to (M1+).
* Under GRH for the row characters every factor is U^{eps} and (M1+) holds with c1 = 1. It is a statement that
  is expected to be true and is not proved; nothing here is a reason to think it false.
* Type II pieces of the same identity with arbitrary coefficients fall back on the general sieve, whose
  (KD)^{2/3} term gives count 2(1 + Y)/3 - delta Y >= 0.765 (r2). So an unconditional (M1+) has to carry the
  Moebius-Gauss-sum identity mu gamma_1 = G_0 conj(a_0) through a bilinear decomposition. No such argument was
  found here.

## 6. Controls

* DH: no zero statement is made. Lemmas E, T, J, W are statements about counts and norms and hold for arbitrary
  coefficients; none could succeed for Davenport-Heilbronn by accident. The count itself uses the Euler product at
  the three places listed in r2-zf-critical-density section 5 (inverse witness with coefficients mu psi, identity
  (10.16), log L on a zero-free disk). (M1+) would use it twice more: the prime sums are large because of
  -L'/L, and the Moebius factor of M_r.
* Backward heat family and sign twist: not applicable to a no-gain result. (M1+) is a statement about prime sums
  of characters, so the sign twist Lambda -> eps Lambda destroys it unless eps is a character.
* RH / GRH: used only in the remark that (M1+) holds under GRH. No PROVED step depends on it.
* Verified height: not used.

## 7. Verdict

Precise obstruction, relative to the unrefereed moments M1, M2 and detector of Liu II.

* PROVED: hybrid enlargement of the row family without multiplicity cannot lower a row count, and the only
  multiplicity is u -> u a^6, which never pays for primes (Lemma E). No trade of conductor for t-aspect (Lemma T).
  Pair-averaged Halasz-Montgomery of every order gives no bound for spike ratio <= 1/2, hence none at the
  critical class (Lemma J).
* PROVED-rel: the count at the critical class is a three-way saddle. It moves through a diagonal-level second
  moment only via prime length beyond the M1 or M2 capacity at the pair (0.7457, 0.4183) (Lemma W). Mixed
  inverse-plain moments and all products of witnesses are outside the window (0.8729, 1.1125). The long-inverse
  exponent (1 + 5r)/6 is optimal for second moments at level with multiplicity (Corollary W1'); below level it is
  a density estimate in another form.
* MODEL: price table for c1 and c2 with supply and gates (section 4). c1 is the sensitive lever.
* OPEN: (M1+) for any c1 < 2. No tau > 0. No new abscissa.

No pivot was run beyond pricing and locating (M1+): the adjacent levers (numerator average K = (3R+1)/4 -> R;
TRO6) belong to other slugs.

## 8. Three weakest steps

1. Section 5.1 is a reading. The identification F_0 = r + z, M = 2(r + z) - m, z_0 = z reproduces both M1
   conditions, but the statement that the "+ z_0" is a triangle-inequality loss (and not forced by the reflected
   energy for another reason, for example the puncture bound) was not traced through Lemma 14.3 and the two-Poisson
   recursion. Liu II's own proof (Theorem 11.2) was not read at all; only its statement (13.2).
2. Lemma W and Corollary W1' are about second moments at level (condition (L)) and about the single saddle pair.
   They do not exclude a count obtained from a moment below level (for example a mixed moment of M_r S_m at
   r + m > 1 with bound U^{1+eps}, which would be in the window; it is true under GRH and is a long-polynomial
   mean-square saving of the kind described in W1'), from a non-second-moment argument, or from a change of
   detector that removes the adversarial choice of (r, m). The claim "no power or product of witnesses enters the
   window" uses only the pair at t = t*; the prover may run several t at once, and no joint use of two pairs was
   analysed. Corollary W1' covers second moments over families of residue-symbol rows only; a moment of M_r over a
   different family in which the rows embed with multiplicity (not through u -> u a^6) is excluded by (E1) only
   when the embedded members have the same values chi_n(u) for all n.
3. Section 4 is a float model on a 141 x 21 class grid with a coarse inner min-max (same-grid reference error
   2.7e-5), the supply is modelled as one number L = l/h at the critical scale only, and the gates are r2's
   variant (iii) without its linearised (14.10) line 1a. The gains are indicative to about 10%. Lemma J's constant
   c in N_B >= c max(R, K^k) assumes a positive proportion of nonvanishing entries chi_N(u'), true for rows and
   columns in general position and not checked for thin sets of rows sharing many prime factors with the columns.

## 9. Files

`PY=.venv-arb/bin/python`, run as `$PY -I <script>`.
* `checks.py` -> `checks.log` (saddle, window, supply-capped counts, Lemma T exponents; 1 min)
* `caps.py --system` -> `caps.log` (count table, first-order sensitivities, system values without supply; 6 min)
* `caps_supply.py` -> `caps_supply.log` (system values with supply; c1 rows only, about 20 min; stopped before the c2 rows)
Single process, under 1 GB.
