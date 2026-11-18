# e2-ms-slot-capacity: the slot capacity of manuscript Lemma 17.1 (r + 2z < m against r + z < m)

Internal working note, 2026-11-18. Unrefereed. Nothing committed, pushed or posted. No ssh. All runs local, single
process, through `scripts/memcap.sh 8` (one run, U = 512000 with all rows, was killed by the cap and is not used).
Everything is relative to unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`,
line numbers below refer to it) and the Liu II / Xu-Sang scalar system as modelled by `r3-critical-count`.
No statement about zeros is made. RH open. NO QED.

Labels: PROVED / PROVED-rel (relative to the source as stated) / CLASSICAL / MEASURED / ARGUED / MODEL / OPEN.

**Verdict: precise obstruction, with three small results.**

1. Located (PROVED-rel, by substitution): the extra z is the hypothesis M + z_0 <= F of the canonical estimate
   (Lemma 17.2), and inside its proof it is the reflected dual length T_d = 2H + 2A_0 + 2z_a - N_* - ... of
   Lemma 14.3: the active prime marks sit in the conductor of the reflection, squared. It is not a
   Cauchy-Schwarz, dyadic or triangle-inequality loss. This corrects the reading in `r3-critical-count` section 5.1.
2. Forced or not: at r = 0 and for cubic rows the factor 2 is forced by an explicit configuration (a_p = cubic Gauss
   sum; MEASURED here with its scaling law). For the sextic rows of the lemma the same configuration gives a
   7-19% excess that does not grow at the sizes tested; undecided. In the range the application uses
   (r >= 1/2, hence z < 1/2) no extremal configuration exists among the ones tried: there the factor 2 is a
   property of the method, not of an example. The unrestricted statement "r + z < m for all rows u in O" is false
   for a different, elementary reason (sixth-power rows; PROVED, section 3.1).
3. First decisive test (MEASURED): in the window 1 - 2z < r < 1 - z the measured quantity is flat in U for every
   coefficient choice, including the worst unimodular a_p; so it is consistent with the relaxed bound and far
   below the general-sieve bound. The random-coefficient control is equally flat. By the stated criterion the
   flatness seen in the model is not arithmetic. The test does not kill the combination and gives no evidence that
   separates the arithmetic case from the generic one. The prime slots have 2 to 84 primes in the window at
   U <= 512000, so the test has little power there.
4. Abscissa with the relaxed slot (MODEL, float LP, conditional on an unproved (M1+) and on the unrefereed
   system): 0.87329 if only the first condition of Lemma 17.1 is relaxed; 0.87279 (optimistic) / 0.87299 (gated)
   if both are; 0.87034 without the prime-supply limit (not attainable with the source's probe). All above
   13/15 = 0.8667 and 5/6. No abscissa is claimed.

---

## 0. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP rows Z10-Z15 and section 6 item 3, graph nodes `map-open-3`,
`map-pos-34`, `mem-abscissa-formula`, `binding-row-bin`, RESULT + REFEREE of `r3-critical-count` (prices the
lever, reads the origin), `r2-zf-gm-inverse-witness`, `zf-large-values`, `n2-kloss-sdp-certificate` (reduced
model and code), manuscript sections 14.3-14.4, 17.1, 17.2, 17.6.

New relative to those lanes: (a) the inequality is traced through Lemma 14.3 and the terminal step of Lemma 17.2
(r3 weak step 1 said this was not done); (b) the quantity bounded by Lemma 17.1 is measured in the reduced model,
with worst-case coefficients and three controls; (c) the system value is recomputed with the second condition of
the lemma kept (referee item R1 of r3 asked for this).

## 1. First lemma: statement, proof skeleton, and where 2z enters

**Statement (manuscript l.6930-6975).** psi_u(n) = nu(n) chi_n(u)^{+-1} (sextic symbol, zero-extended),
M_u(Z^r; W) = Z^{-r/2} sum_n mu(n) psi_u(n) W(q_n/Z^r), Q_u = prod_i Z^{-z_i/2} sum_{p in P_i} a_i(p) psi_u(p) W_i(q_p/Z^{z_i}),
z = sum z_i; prime lists disjoint, coefficients |a_i(p)| <= 1 independent of u and otherwise arbitrary. If

    r + 2z <= m - c_1   and   2r + 8z <= 3m - c_2,

then sum_{u in O, 0 < q_u << Z^m} |M_u Q_u|^2 << Z^{m+eps}, uniformly in the prime supports and coefficients.

**Skeleton (READ; l.8658-9057, 7362-7475, 5862-6100).**

S1. Overlap reduction. j = (n, P); n = j n_0, P = j P_0, c = n_0 P_0 squarefree. For no overlap the residual
    polynomial R_0(u) = Z^{-D'/2} sum_c mu(c) nu_0(c) chi_c(u) d_0(c) W_0 has column length D' = r + z and a
    product mark d_0 of cap z_0 = z (17.68). Overlaps (G > 0) only shorten: D' = r + z - 2G, z_0 = z - G.
S2. Square out, Poisson in u at scale Z^m (Lemma 17.5). Dual rows h of length M_init = 2D' - m - 2P_1 (17.69).
    The principal term is counted directly.
S3. The non-principal part is a canonical sum E of Lemma 17.2 with (M, F_0, z_0) = (2(r+z) - m, r + z, z), and
    sum_u |R_0|^2 << Z^{m - D'} E. Lemma 17.2 gives E << Z^{F_0 + eps} under (17.2):

        q_{r_rho} <= Z^{F_0 - M - z_0 - c}     and     3M + 6 z_0 + c <= 4 F_0.

    Substituting: F_0 - M - z_0 = m - r - 2z and 4F_0 - 3M - 6z_0 = 3m - 2r - 8z. These are the two conditions of
    Lemma 17.1 (PROVED-rel, arithmetic; the same substitution as r3 section 5.1).
S4. Lemma 17.2 is proved by backward induction on depth; the terminal step ("short completion", l.7420-7475)
    applies Lemma 14.3 (reflected energy). Lemma 14.3 reflects the completed column sum; the denominator of the
    reflection is c = c_F F_act R P with R the residual row and P the product of the ACTIVE mark primes
    (l.5946-5952), so the retained dual length is

        v + 3 l_b + e_lambda <= T_d,     T_d = 2H + 2A_0 + 2 z_a - N_* - N_0 - 3B_0      (14.11),

    and T_d - S_0 - B_0 <= 2M - O + Q + V - N_* + 2 z_a (14.17). The energy is

        E_ref = O/2 + max(H, v + l_b) - S_0 - B_0 + z_a - u - l_b - 2e/3 - (T_d - v - 3 l_b - e)_+/2,
        u = min{v, z_a, (v + z_a)/3}     (14.13), (14.14),

    where v + z_a - u = max{v, z_a, 2(v + z_a)/3} comes from the quadratic-cubic norm bound Lemma 14.2: a
    Heath-Brown-type cubic sieve between the dual index n and the mark product P (cubic symbol chi_P(n)^{-2}).
S5. Three uses of the invariants (l.7450-7475): row branch E_ref <= M + z_a <= F - c (first invariant);
    column branch with u = z_a: E_ref <= O/2 + (T_d - S_0 - B_0), then (17.12)-(17.13) (first invariant, twice:
    once to absorb the puncture Q, once as M + z_0 <= F); column branch with u != z_a: (17.14) (second invariant).

**The single inequality (PROVED-rel in the principal configuration O = S_0 = B_0 = N_0 = A_0 = l_b = e = Q = V = 0,
N_* = N = F; algebra on (14.11), (14.14) only).** There T_d = 2H + 2z_a - F and:

* Row branch (v <= H). With u and the kernel term kept, E_ref <= max(H, F/2, (H + F)/3, H/6 + F/2 - z_a/3), which is
  <= F as soon as M <= F. The manuscript's line "E_ref <= M + z_a" drops u and the kernel term; in this
  configuration the row branch does not need z_0.
* Column branch, u = z_a (v >= 2 z_a), v = T_d, H = M:  E_ref = T_d = 2M + 2 z_a - F.  E_ref <= F  iff  **M + z_a <= F**.
  With M = 2(r+z) - m, F = r + z, z_a = z this is r + 2z <= m. This is where 2z enters: the reflected sum has
  length up to T_d, the marks contribute 2 z_a to T_d because they are in the conductor, and the reflected sum
  (rows H < its length v) is bounded at its level Z^v.
* Column branch, u != z_a (v < 2 z_a): E_ref = (2/3)(v + z_a) - (T_d - v)/2 <= 2 z_a. The manuscript bounds this
  branch by T_d/2 + z_a, which gives the second invariant; in this configuration that step is lossy whenever
  T_d > 2 z_a, i.e. whenever r + z > 2m/3.

So: the first condition r + 2z <= m is one identifiable term (column branch, full mark set active, dual length at
its maximum). It is structural: arbitrary coefficients a(p) cannot be completed or reflected, so the mark primes
are carried as part of the modulus, and a modulus of norm Z^{z_a} lengthens a quadratic-conductor dual by Z^{2 z_a}.
It is not the triangle inequality of l.5898: that step removes INACTIVE slots, whose absolute mass is
sum_p q_p^{-1} << Z^eps (no loss). The role of either invariant in the non-terminal (two-Poisson) recursion and in
configurations with A_0, N_0, B_0, O, Q != 0 was not traced.

**What a relaxed lemma needs (exact missing inequality, OPEN).** In the principal configuration with M <= F, the
dyads that violate E_ref <= F are those of the column branch with F < v <= T_d. On them the relaxed lemma needs,
for the reflected marked sum N of (14.16) (rows H = M shorter than the dual length v),

    N = sum_{k sf, q_k << Z^H} | sum_P a(P) q_P^{-1/2} sum_{n ~ Z^v} beta(n) chi_k(n)^3 chi_P(n)^{-2} |^2
      << Z^{v + F + eps}     instead of the proved   Z^{2v + eps}     (E_ref = exponent of N minus v),

a saving of up to Z^{v - F} = Z^{2(M + z_a - F)} <= Z^{2 z_a} below the level of a sum that is longer than its row
family. By Lemma E / Corollary W1' of r3-critical-count, a bound below level is not available from a
coefficient-free sieve; it has to use the coefficients beta (dual theta-type coefficients) and a.

## 2. Is the factor 2 forced? Extremal configurations

### 2.1 Sixth-power rows (PROVED, elementary)

Lemma 17.1 sums over all u in O with q_u << Z^m. Take r = 0, one slot, a(p) = conj nu(p). For u = v^6 coprime to
the slot, psi_u(p) a(p) = 1, so |Q_u|^2 = Z^{-z} (#P)^2 >> Z^{z - eps} on full annuli. There are >> Z^{m/6} such u. Hence

    sum_u |Q_u|^2 >> Z^{z + m/6 - eps},

which exceeds Z^{m + eps} for z > 5m/6. So "r + z < m" cannot replace "r + 2z < m" in the generality of Lemma 17.1:
at r = 0 the true capacity is at most 5m/6 unless the rows are restricted (sixth-power-free, as in Lemma 17.6 and
the application) or the term Z^{z + m/6} is carried. The same rows give nothing for r > 0 (there M_u is a Moebius
sum of a fixed character). MEASURED analogue: with all rows and the quadratic character (rows v^2), a = 1,
z = 0.75, the normalised moment grows from 1.82 (U = 1000) to 2.81 (U = 256000); with squarefree rows it is 0.96.

### 2.2 Gauss-sum vector at r = 0 (CLASSICAL for the mechanism; MEASURED here)

For a character of order j | 6 on the rows, g_j(u, p) = chi_p(u)^{-j} g_j(p), so with a_p = conj-normalised Gauss
sums, Q_u is a sum of twisted Gauss sums over primes. For order 3 the Dirichlet series of g(u, c) has a pole at
5/6 (normalised) with residue of size N(u)^{-1/6} |tau(u)| (Patterson), and the prediction is

    |Q_u|^2 - 1  ~  C  X^{2/3} (log X)^{-1} N(u)^{-1/3} |tau(u)|^2,     X = U^z,

so the moment exceeds the mean-value bound when z > 1/2. This is the mechanism behind the sharpness of
Heath-Brown's cubic large sieve (Dunn-Radziwill, under GRH; RECALLED, not re-read), here restricted to primes
(Patterson's conjecture shape). MEASURED (`slot.py`, `slot_bins.py`, squarefree rows coprime to 6):

| rows | z | I(Gauss)/tr at U = 1000 | 32000 | largest U | fitted exponent in U | maximiser overlap with Gauss vector |
|---|---|---|---|---|---|---|
| cubic (chi^2) | 0.6 | 1.352 | 1.316 | 1.278 (512000) | -0.005 +- 0.002 | (sup = Gauss value to 1%) |
| cubic | 0.75 | 1.381 | 1.711 | 1.857 (512000) | +0.044 +- 0.004 | 0.99 |
| cubic | 0.9 | 1.921 | 2.667 | 3.106 (128000) | +0.103 +- 0.004 | 0.99 |
| sextic (chi) | 0.6 | 1.156 | 1.083 | 1.068 (512000) | -0.010 +- 0.002 | < 0.3 |
| sextic | 0.75 | 1.103 | 1.155 | 1.139 (512000) | +0.003 +- 0.003 | < 0.1 |
| sextic | 0.9 | 1.163 | 1.163 | 1.185 (128000) | +0.012 +- 0.006 | < 0.1 |
| quadratic (chi^3) | 0.75 | 0.97 | 1.01 | 1.00 (512000) | 0.000 +- 0.003 | - |

(I(a) = (1/R) sum_u |Q_u(a)|^2, tr = its average over random phases. The exponents include the 1/log X factor,
which is why the cubic values are below (2z - 1)/3.) Scaling law at U = 128000, cubic rows (`log_bins_U128000.txt`):
(mean |Q_u|^2 - 1) N(u)^{1/3} is constant across the bins of N(u) from 30 to 128000: 66 to 79 at z = 0.9 and
24 to 31 at z = 0.75; the first number is 0.8 X^{2/3}/log X. So for cubic rows the factor 2 at r = 0 is forced by
an explicit prime-supported configuration, with the predicted law.

For the sextic rows of Lemma 17.1 the Gauss vector (a_p = g_5(p), equivalently +-conj g_1(p)) has a positive excess
of 0.07 to 0.19 at every size, flat in N(u) (0.13 to 0.19 in every bin of at least 500 rows; the N(u)^{-1/6} law of a
sextic theta residue would vary by a factor of about 2 across those bins and is not seen), and with no resolved growth
in U. ARGUED: the analogous prediction is exponent (2z - 1)/6 minus a logarithm, with a constant that depends on
the mean square of sextic theta coefficients (a TRO6-type quantity); over 1000 <= U <= 512000 that prediction is
flat to within 15% and cannot be told apart from a constant. The worst unimodular a_p found by monotone power
iteration is at the independent-vector level (1 + sqrt(n/R))^2 to within 7% and is reached from random starts.
UNDECIDED for sextic rows.

### 2.3 The application's range

The detector has t - 1/2 <= r <= t, t >= 1, so r >= 1/2 and the relaxed capacity is z <= 1 - r <= 1/2. A
configuration of the type 2.2 needs z > 1/2 for any order (the excess is X^{2/j} N(u)^{-1/j} against 1). So in
the range where the lever has a price, no extremal configuration is known, and the constraint "2z <= 1" that
2.2 would force never binds (`lp_relaxed.py`, capacity "forced" = capacity "both"). The factor 2 there is a
property of the proof (section 1), not of an example. OPEN whether it is forced.

## 3. First decisive test: the quantity of Lemma 17.1 in the window 1 - 2z < r < 1 - z

**Model (as n2-kloss-sdp-certificate: Z[omega], sextic symbol from its `gram.py`, one slot, no cube completion,
m = 1).** Rows: primary u, N(u) <= U (all, or squarefree coprime to 6). M_u: squarefree primary n coprime to 2,
bump on [0.2, 1] U^r, coefficient l2 norm 1. Slot: split primes with U^z/4 < N(p) <= U^z, n of them.
I_w(a) = (1/R) sum_u w_u |n^{-1/2} sum_p a_p chi_p(u)|^2 = a* G_w a with w_u = |M_u|^2 (the lemma),
|R_u|^2 (control: mu(n) replaced by a random unimodular coefficient per column), or 1 (control: no inverse factor).
Reported: tr G_w (average over random phases a), I(1), I(Gauss vectors), sup over unimodular a (monotone power
iteration from 18 starts: a lower bound) and n lambda_max(G_w) (upper bound). U = 1000 ... 512000 (the assigned
range Z <= 32000 plus four larger sizes). Largest planned allocation 5.0 GB, printed before allocation.

**Both bounds.** Relaxed slot: sup_a I_mu(a) << U^eps for r + z < 1. Source: no bound in the window; the fallback
is the general sextic sieve, exponent 2(1 + r + z)/3 - 1 (0.20 to 0.30 here). Trivial: n.

**MEASURED (`analysis.txt`; squarefree rows; all-rows values agree to within 0.05).** sup/tr = lower bound of
sup_a I_w(a)/tr G_w:

| (r, z) | r + 2z | general-sieve exponent | n at U = 512000 | sup/tr, w = mu: smallest usable U -> 512000 | w = random columns | w = 1 | fitted exponent (mu) |
|---|---|---|---|---|---|---|---|
| (0.3, 0.5) | 1.30 | 0.200 | 84 | 1.105 -> 1.048 | 1.143 -> 1.047 | 1.093 -> 1.029 | -0.014 +- 0.002 |
| (0.4, 0.45) | 1.30 | 0.233 | 48 | 1.434 -> 1.194 | 1.497 -> 1.191 | 1.053 -> 1.012 | -0.025 +- 0.011 |
| (0.5, 0.4) | 1.30 | 0.267 | 26 | 1.090 -> 1.062 | 1.082 -> 1.043 | 1.023 -> 1.006 | -0.004 +- 0.005 |
| (0.6, 0.3) | 1.20 | 0.267 | 10 | 1.159 -> 1.131 | 1.062 -> 1.028 | 1.011 -> 1.002 | n < 12, no fit |
| (0.7457, 0.2) | 1.146 | 0.297 | 4 | 1.087 -> 1.127 | 1.023 -> 1.011 | 1.002 -> 1.001 | n <= 4, no fit |
| (0.2, 0.6) | 1.40 | 0.200 | 260 | 1.195 (32000) -> 1.160 | 1.210 -> 1.155 | 1.181 -> 1.148 | two sizes only |

Upper bounds n lambda_max/tr are between 1.03 and 1.73 in every row. A growth with the general-sieve exponent
would be a factor 2.3 to 3.4 over the fitted range; none is seen.

Readings.
* The measured quantity satisfies the relaxed bound in the window with constant <= 1.7 at every size, for the
  worst coefficients found, and is far below the general-sieve bound.
* The control with random column coefficients in place of mu(n) gives the same values (to within 0.1) and the
  same absence of growth. By the criterion of the assignment the flatness is not an arithmetic effect of mu or of
  the primes: it is what a generic row-column matrix of these shapes does. A proof would then have to be a
  sieve inequality for arbitrary coefficients, and for arbitrary coefficients the cubic control of 2.2 shows that
  the mean-value bound is false beyond z = 1/2 at r = 0. So the model result is consistent with (M1+) and is no
  evidence for a provable form of it.
* One arithmetic effect is visible and constant in U: with a = 1 and w = mu, I(1)/tr is 1.09 to 1.38 at
  (0.4, 0.45), (0.6, 0.3), (0.7457, 0.2) for U >= 4000, against 1.00 for the random-column control (the inverse polynomial and
  the prime sum of the same character are positively correlated).
* Power: at the critical pair (0.7457, 0.2) the slot holds 2 to 4 primes for U <= 512000; with one slot of length
  U^0.127 (the source capacity) it would hold none. No exponent can be read there. Reaching 100 primes in a slot of
  length 0.2 needs U about 10^17. The window rows with usable n are at r <= 0.5, away from the saddle.

The test does not kill the combination. It also does not support it beyond "no finite-size counterexample".

## 4. System value with the relaxed slot (MODEL)

`lp_relaxed.py`: the scalar model of `r3-critical-count` (`caps.step`, LP in (b, l), fixed point
kappa = max(13/18, 2B - 1), class grid 141 x 21, prime supply L = l/h iterated), with only the M1 capacity changed.
Same-grid reference 0.8749133 (exact value of the source system 0.874886647); the last column subtracts the
same-grid gain from the exact value.

| M1 capacity z_M(r) | count at critical class (no supply / supply 0.2105) | B optimistic | B with gates | 0.874886647 - gain |
|---|---|---|---|---|
| (1-r)/2 (source) | 0.590349 / 0.590349 | 0.8749133 | 0.8749164 | 0.8748866 |
| min((1-r)/2, (3-2r)/8) (both source conditions) | same | same | same | same |
| min(1-r, (3-2r)/8) (first relaxed, second kept) | 0.578587 / 0.578587 | 0.8733143 | 0.8733185 | 0.87329 |
| 1-r (both relaxed), supply imposed | 0.530655 / 0.577042 | 0.8728192 | 0.8730210 | 0.87279 / 0.87299 |
| 1-r, no supply limit | 0.530655 | 0.8703626 | 0.8730210 | 0.87034 (not attainable with the source's probe) |
| min(1-r, 1/2) (region not excluded by 2.2) | identical to the two rows above | | | |

At the manuscript's binding bins (delta* = 0.3866376 and 0.388584, x = 1/2) the same count model gives
0.66849 -> 0.65870 (first relaxed) -> 0.65803 (both, supply) -> 0.61336 = 1 - delta* (both, no supply), resp.
0.66669 -> 0.65688 -> 0.65611 -> 0.61142. The manuscript's own system (slack 2.2815e-4) was not re-solved.

Readings: the whole lever is worth at most 2.1e-3 in B with the source's prime supply, 1.6e-3 if the second
condition stays. It does not reach 13/15 (the low-side floor is untouched; K-loss removal and 31/36 belong to
`n2-kloss-sdp-certificate` and are independent of this lemma). Any of these numbers is conditional on (M1+),
which is not proved, and on the unrefereed manuscripts.

## 5. Controls

* Random column coefficients; random mark phases; no inverse factor: all flat, equal to the arithmetic case
  (section 3). Positive control for the functional: cubic rows with the Gauss vector grow with the predicted law
  (section 2.2). Negative control: quadratic rows, squarefree, flat (0.94-1.01).
* The nine campaign controls (Davenport-Heilbronn, backward heat, sign-twisted primes, unimodular twist,
  zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w): no zero statement is made, so
  none is engaged by a claim. Structural remark: Lemma 17.1 as stated is uniform in the bounded coefficients
  a(p), so its slot side is invariant under the sign twist a(p) -> eps_p a(p). Section 2.2 shows that a
  statement with that invariance cannot have capacity above m/2 at r = 0 for cubic rows. A relaxed slot therefore
  has to give up the invariance: it must use the specific coefficients nu-bar(p) on full prime annuli (a prime
  sum of a Hecke character, i.e. -L'/L), together with mu in M_r (1/L). That is where an (M1+) would use the
  Euler product, and why it would fail for the sign-twisted control. It holds under GRH for the row characters
  (r3 section 5.2); nothing here proves any part of it unconditionally.
* Requirements: (M1+) is a mean value over the row family (all primes together: yes, through the two L-function
  factors; uniform in height: it is a conductor-aspect count, not a statement in every window). It is an input of
  the 7/8-type method, whose floors are 13/15 and 5/6 (Z15); it does not approach the critical line.

## 6. Verdict

Precise obstruction.

* PROVED-rel: both conditions of Lemma 17.1 are the two hypotheses of Lemma 17.2 under (M, F_0, z_0) =
  (2(r+z) - m, r + z, z). In the principal configuration the first one is the single requirement T_d <= F on the
  reflected dual length of Lemma 14.3 with all marks active, T_d = 2M + 2z_a - F: the marks are in the conductor.
* PROVED: with all rows u in O, "r + z < m" is false at r = 0 for 5m/6 < z < m (sixth-power rows).
* MEASURED: cubic rows, r = 0: Gauss-sum vector on primes violates the mean-value level for z > 1/2 with the law
  X^{2/3} N(u)^{-1/3}/log X; sextic rows: 7-19% excess, flat, no growth to U = 512000; window 1 - 2z < r < 1 - z:
  flat for all coefficients and equally for the random controls.
* MODEL: abscissa 0.87329 (first condition relaxed), 0.87279-0.87299 (both), 0.87034 (no supply limit).
* OPEN: (M1+) for any c_1 < 2 in the range r in (1/2, 1); whether the factor 2 is forced there; the growth
  exponent of the sextic Gauss vector on primes.

No pivot was run. The adjacent item is the below-level estimate displayed at the end of section 1, restricted to
a(p) = nu-bar(p) on full annuli; via Heath-Brown's identity its first necessary case is the mixed moment
sum_u |M_r S_b|^2 << U^{1+eps}, r + b <= 1 (named in r3 section 5.2), which no lane has attempted.

## 7. Three weakest steps

1. Section 1 "single inequality" is algebra on the displayed formulas (14.11), (14.13), (14.14) in the principal
   configuration only (no frozen or powerful parts, no puncture, V = 0, N_* = N). The statements that the row
   branch does not need z_0 and that the second invariant's terminal use is lossy for r + z > 2m/3 hold there
   and were not checked with A_0, N_0, B_0, S_0, O, Q != 0, nor through the two-Poisson recursion, where either
   invariant may be needed to keep the induction closed. The proof of Lemma 14.2 was read only at its last step.
2. The window test has almost no power at the pairs that matter (2 to 84 slot primes; the critical pair has
   2 to 4), uses one slot, omits the cube completion and the finite character nu, and its sup over a is a
   lower bound from 18 starts (the upper bound n lambda_max is within a factor 1.45). "Flat" means exponent
   within about +-0.03 over 2.7 decades; the sextic Gauss prediction (2z - 1)/6 minus a logarithm is inside
   that resolution, so "undecided" in 2.2 cannot be sharpened with these sizes. The Dunn-Radziwill and Patterson
   statements are recalled, not re-read; the sextic prediction is a heuristic.
3. Section 4 is the float model of r3-critical-count (same-grid error 2.7e-5, gates = r2 variant (iii), supply
   modelled as one number), inherited with its referee caveats; the manuscript's own binding-bin system
   (slack 2.2815e-4) was not re-solved, and the capacity "first relaxed, second kept" assumes the second
   condition is independent of the first, which weak step 1 leaves open.

## 8. Files

`slot.py` (model; usage `slot.py U "r,z,k;..." seed [sf]`), `run_batch.sh`, `log_{all,sf}_U*.txt`,
`slot_{all,sf}_U*.json`, `analyse.py` -> `analysis.txt`; `slot_bins.py` -> `log_bins_U128000.txt` (excess by
N(u) bin); `lp_relaxed.py` -> `lp_relaxed.log`. `batch.log` shows rc = 1 for U = 4000-16000 in the first pass
(a degenerate inverse polynomial at r = 0.2; patched and rerun, logs overwritten) and rc = 137 for U = 512000
with all rows (memory cap; not rerun, not used). In the JSON, `I_gauss[name]` is the value for a_p = conj(name_p).
