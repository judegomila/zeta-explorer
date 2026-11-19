# c8-eh-nonprincipal-row-cancellation: is cancellation over the non-principal rows (E-H) an independent input

Internal working note, 2026-11-18. Slug `c8-eh-nonprincipal-row-cancellation`. Kind: deepen. Not refereed by an
independent agent (section 9 is a self-check only). Nothing committed, pushed or posted. Only this directory was
written. The compute server was not used: every run was local, through `scripts/memcap.sh 8`.

Every abscissa below is the value of a hypothetical ESTIMATE SYSTEM relative to the unrefereed sources (openai/math
manuscript "MS", `~/lean-deps/qrh-verify/paper.txt`; Liu II) as transcribed in `r3-method-limit` section 1. The
function-field part is a model computation over F_q[T]. No statement about zeros of zeta or of any number-field
L-function is made. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / EXACT (identity between exact integers, or rational LP:
CONFIRMED = feasible at the value and infeasible 1e-9 below) / LP (bisection) / MEASURED (real numbers computed from
exact integers) / MODEL / ARGUED / OPEN.

## 0. Verdict

**Precise obstruction. (E-H) is not an independent input. In the Proposition 2.1 format it is the conclusion
restated; as a measured phenomenon it is present for every weight, target or control.**

1. **Circularity (Lemma 1; PROVED-rel MS (10.5) and Lemma S of `c6-marks-bc-manuscript-check`).** The sum over the
   non-principal rows is NP = I - I_1 exactly (probe minus principal row). Given the low estimate at exponent l0,
   a bound |NP| << Z^E with E >= l0 holds if and only if the principal row satisfies |I_1| << Z^E, that is, if and
   only if H_eta(s)/L(s, eta) is holomorphic on Re s > B_E, the abscissa that Proposition 2.1 would output from
   that bound. For B_E >= 2/3 this is the zero-free statement for the target itself. Below 2/3 it is implied by,
   and does not imply, the zero-free statement (common zeros with the normaliser, map row Z24). It is independent
   of the zeros of the row family u != 1 and of the zeros of H_eta. (E-H) is therefore neither weaker than nor
   independent of its own conclusion. This is the same outcome as K + D in `c6-unreflected-marks-kd23` and Lemma C
   of `c7-uncompensated-high-side-normaliser`.
2. **Decisive test over F_q[T] (EXACT decomposition; MEASURED ratios).** The probe of
   `c7-ff-order2-vertex-exact` was decomposed into dual rows in exact integer arithmetic for 551 blocks (q = 7:
   404, q = 13: 147; dual length r = 1..4; up to 2800 non-zero rows) and eleven weights. The totals reproduce the
   exact |J|^2 of that lane's block files in 2644 of 2644 available comparisons. Result: cancellation against the
   trivial count T1 = sum over rows of |row| is present for every weight. In 2042 of 4116 (block, weight) records
   with T1 > 0 the non-principal sum is exactly zero, for the targets, the Moebius-type weights and the random
   non-multiplicative weights alike. Where it is non-zero, the cancellation exponent theta = log(T1/|NP|)/log(rows)
   has median 0.41 and 0.38 for the two targets, 0.25 to 0.38 for THIN, Liouville-twisted target, random
   multiplicative and random non-multiplicative weights and the DH sum (q = 7; paired differences to the target
   between -0.06 and 0.00), and 0.11, 0.08 for the two affine-invariant weights (w = mu and w = 1). It does not
   follow the function-field Riemann hypothesis: random weights with no L-function show it, and the weight w = 1,
   whose L-function has no zeros, shows the least. **Control-blind: no R3.**
3. **The three ways to bound NP.** Term by term: this is the floor class H0 (trivial count). By a bilinear
   (operator-norm) bound over the rows u: Theorem K' below, B >= 1 - 1/r + lx/r + l(1/2 - 1/r) with the K-loss
   kept (PROVED identity; EXACT LP 5/6 at r = 6), so no gain. By executing the u-sum: Poisson summation in u
   returns the m-sum, which is Lemma 1. This is a classification of the treatments in use, not a proof that no
   other exists.
4. **Exact LP (model inputs).** (a) Three-input system (G = 0, K only): B(theta) = (5 - 6 theta)/(6 - 6 theta),
   from 5/6 at theta = 0 to 2/3 at theta = 1/2 (square-root cancellation over rows gives exactly the normaliser
   ceiling). (b) With the source ledger (J-, K-, P-losses) and the polar term kept: 13/15 for every theta and with
   the high side deleted; (E-H) never binds. (c) (E-H) with (E-K) (K-loss deleted, J and P kept): 31/36 with the
   Gram term kept and 7/9 with G = 0, the same values as (E-K) alone. **(E-H) with (E-K) does not reach below 5/6
   on the reflected branch.** (d) In the LP of `c5-target-fe-order2-ledger` the branch with empty dual range has no
   low constraint; there (E-H) alone gives min(11/12 - theta/2, 13/12 - theta): below 5/6 for theta > 1/6, 2/3 at
   theta = 5/12, 7/12 at theta = 1/2. On that branch I is negligible, so NP = -I_1 and the hypothesis is the
   conclusion word for word.

Score: inside the architecture only. 'R4 inside the architecture' is not moved. (E-H) leaves the list of escapes of
`c7-probe-format-h-cap` section 4: it is the conclusion (item 1), it is control-blind where measured (item 2), and
its norm version is capped (item 3). One pivot taken (item 3, Theorem K'). No abscissa below 0.874886647 is proved.

---

## 1. Plan; reading; relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP rows Z15, Z15b, Z15c, Z24, Z25, Z26 and the control THIN;
`c7-probe-format-h-cap` RESULT and REFEREE (corrections E1 to E6); `c7-ff-order2-vertex-exact` RESULT (all), `ffx.c`
(as text); `r2-ff-tro6-complete` sections 2 to 7 (Theorem A, Lemma R, Theorem B, Theorem U); `r3-method-limit`
section 1 (the estimate system); `c5-target-fe-order2-ledger/tiers_fe.py`; verdict of `c6-unreflected-marks-kd23`;
MS Proposition 2.1 and (10.4), (10.5) in `paper.txt`.

Known before: H0 as the floor class of the high side (r3); "K kept, H0 removed gives 2/3 at (0, 0, 1)" in the
three-input system (c7-probe), corrected by its referee to 4/5 and 13/15 with the source ledger (E1). No lane had
written NP as an object, tested it in a model, or asked what a bound for it is equivalent to.

New here: (i) Lemma 1 and its corollary; (ii) the dual decomposition of the F_q[T] probe for arbitrary row weights,
in exact arithmetic, with the per-row statistics for target, Moebius-type and random weights; (iii) Theorem K'
(norm version of (E-H)); (iv) the theta-ladder of the LP and the empty-branch values.

Order of work: the F_q[T] test first (section 3), then the lemma was written against the manuscript text, then the
LP.

## 2. First lemma: the non-principal row sum and what a bound for it is equivalent to

**The object.** MS (10.5) is asserted as an exact identity for the independently defined probe, with absolute
convergence on the lines Re s = 2, Re w = 3, Re z = 3:

    I_eta(Z) = (2 pi i)^-3 Int Int Int W(X, Y, Z; s, w, z) Sum_u q_u^-z xi(u) zeta_F^S(6z) L^S(w, chi_.(u))
               / L^S(s, eta chi_.(u)) H_{eta,u,Z}(s, w, z) dz dw ds,

the sum over non-zero sixth-power-free u with (u, S) = 1 (the rows; frequencies u a^6 after Poisson summation in
m). Put I_1 := the term u = 1 and

    NP_eta(Z) := the same triple integral with the sum restricted to u != 1.

In Proposition 2.1, J_eta is the normalised I_eta, f_eta of (2.3) is the residue part of the normalised I_1, and
(2.5) is the bound for the normalised NP plus the remainder of row 1 after its two residues.

**Lemma 1 [PROVED-rel (10.5)].** (a) NP = I - I_1. Hence |NP| <= |I| + |I_1| and |I_1| <= |I| + |NP| for every Z.
(b) Write e(F) for the infimum of exponents E with |F(Z)| << Z^E. Then e(NP) <= max(e(I), e(I_1)),
e(I_1) <= max(e(I), e(NP)), and e(NP) = max(e(I), e(I_1)) when the two differ.
(c) Suppose the low estimate (2.4) holds at exponent l0. For every E >= l0:

    e(NP) <= E   if and only if   e(I_1) <= E.

Proof. (a) is the splitting of an absolutely convergent sum. (b), (c) are the triangle inequality. QED

**Corollary [PROVED-rel Lemma 1, Proposition 2.1 and Lemma S of `c6-marks-bc-manuscript-check` (two referees;
relative to MS Lemma 7.1)].** Let C(s) = s + c be the signal exponent (c = -1 + lx/2 + h/r in the ledger) and
B_E := E - c. Lemma S: f_eta(Z) << Z^(C(B)+eps) for every eps if and only if H_eta(s)/L^S(s, eta) is holomorphic on
Re s > B. So, for the target, given the low estimate at l0 <= E and the remainder of row 1 below Z^E:

    (E-H) at level E   <=>   H_eta / L^S(., eta) is holomorphic on Re s > B_E.

Readings.
- *Equivalent to the conclusion.* The right side is what Proposition 2.1 outputs from (low, (E-H) at E). The
  implication from right to left shows that the hypothesis is not weaker than its conclusion: any proof of (E-H)
  at E is a proof of the zero-free statement at B_E, and nothing short of that statement proves it.
- *Target, not row family.* The right side concerns L(s, eta) only. Zeros of the twists L(s, eta chi_u), u != 1,
  decide the size of the individual rows (the trivial count T1), not the size of their sum.
- *Normaliser.* For B_E >= 2/3, H_eta has no zeros (Z24) and the right side is "L(s, eta) has no zero with
  Re s > B_E". For B_E < 2/3 it is implied by the zero-free statement and implies only statement (R) of row Z26:
  every zero of L(s, eta) in B_E < Re s < 2/3 is a zero of L(6s - 3, psi_eta) of at least the same order. The
  zeros of H_eta by themselves neither give nor obstruct (E-H).
- *In the ledger.* With the saving parametrised as H_theta = 1/2 - ly/2 + (1 - 1/r - theta) h - l/2 (row count Z^h,
  saving Z^(-theta h)), "(E-H) with theta at geometry v" is true for the target exactly when
  beta* <= max(B_low(v), H_theta(v)). The LP value obtained by assuming it is the statement assumed.
- *Controls.* For a weight without a low estimate (THIN: no reflection, so only the unreflected side, abscissa
  >= 1) Lemma 1(c) has no hypothesis to start from: NP may be small while I and I_1 are both large and nearly
  equal. This is what the mu weight shows in section 3 (|Princ| and |J'| 27 to 99 times T1 in the median, |NP| below T1). So
  (E-H) can hold for a control with a zero off the line; the step that fails for the control is the low side.
  (E-H) carries no R3.

**Lemma 2 (the u-sum has no second handle) [EXACT in the model; ARGUED for MS].** The rows are the Poisson dual of
the m-sum. Completing the u-sum (Poisson or Gauss-sum evaluation in u for fixed moduli) is the inverse step: it
returns Sum_m A_m B_m with the sixth-power frequencies removed. In F_q[T] this is the identity
J' = Diag + Princ + NP of section 3, verified as an identity of integers in 2644 cases. Any estimate of NP that sums
over u before taking absolute values is an estimate of I - I_1.

## 3. Decisive test in F_q[T]

### 3.1 Object and identity

Conventions and objects are those of `c7-ff-order2-vertex-exact` section 2 (q = 1 mod 6; chi_c(x) =
chi_0(Res(c, x)); c_k(m), R_{N,lam}(m; w), J = Sum_{deg m = d} c_k(m) R(m); N' = N + lam; r = k + N' - 1 - d). A row
weight is any integer function W on squarefree A of degree N' (W(A) = w(A) for lam = 0; W(A) = Sum over primes
P | A of degree lam of w(A/P) for marks).

**Theorem B, general weight [PROVED-rel Theorem A, Lemma R, Lemma G of `r2-ff-tro6-complete`; the proof there uses
multiplicativity of nu only to write nu(gA') = nu(g) nu(A'), and is unchanged with W(gA') in its place].**

    J = omega q^d G* J',     J' = Diag + Sum_u c_u,
    c_u = Sum over (gamma, g, e, z1) with sixth-power-free part of z1 g^2 e^5 equal to u of
          s_gamma mu(g) mu(e) q^(gamma - deg e) wt(z1) I_W(z1 g^2 e^5; g),
    I_W(y; g) = Sum_{c1 monic, deg k - gamma} Sum_{A' squarefree monic, deg N' - gamma, (c1, A') = 1}
                mu(A') W(gA') chi_{c1}(y) conj chi_{A'}(y),

g squarefree monic of degree gamma, e | g with deg e <= d, r' = r - 2 gamma + deg e, z1 monic of degree <= r';
omega = (-G_1 G_2 / q)^N' (a unit), G* = G(chi_0^(k-N')) if 6 does not divide k - N' (then |G*|^2 = q and
wt(z1) = 1 for deg z1 = r', 0 otherwise) and G* = 1 if 6 | k - N' (then wt = -1 for deg z1 = r', q - 1 for
deg z1 < r'); s_gamma = chi_quad(-1)^(gamma(gamma-1)/2 + N1(N1-1)/2) chi_0(-1)^(N1(k1+1) + gamma k1), k1 = k - gamma,
N1 = N' - gamma; Diag is the term k = N' = gamma. Every c_u is an element of Z[zeta_6].

Rows: u = sixth-power-free part of the monic dual frequency y = z1 g^2 e^5. Principal row: u = 1 (Princ := c_1).
Non-principal sum NP := Sum_{u != 1} c_u. So **J' = Diag + Princ + NP** exactly. Trivial count T1 := Sum_{u != 1} |c_u|
(triangle inequality over rows; the manuscript's H0 is an upper bound for this quantity, obtained with zero
counts and mean values). U := number of non-zero non-principal rows. rho := |NP|/T1;
theta := log(T1/|NP|)/log U (0: no cancellation; 1/2: the level of random phases with equal moduli);
RMS := (Sum |c_u|^2)^(1/2).

### 3.2 Code, exactness, validation

`dual.py` (numpy; own sieve of F_q[T]; phases of chi_c(y) from norm tables of the prime factors of y and
reciprocity; all sums are integer histograms over zeta_6^a, held in int64 or Python integers), `run.py`,
`analyse.py`. Largest array: q^6 (q = 7) or q^5 (q = 13) entries; resident memory below 1 GB.

- EXACT, totals: |J|^2 = q^(2d) |G*|^2 |Diag + Princ + NP|^2 was compared as an integer with the field `J2` of
  `../c7-ff-order2-vertex-exact/blocks_q*_d*.jsonl` (produced by `ffx.c` from the m-side, a different code path):
  **2644 of 2644 identical** (q = 7: d = 1..8; q = 13: d = 1..4; weights a, b, mu, n1, n2, dh, t wherever that
  lane has the block). The random non-multiplicative weights n1, n2 use the same hash as `ffx.c`, so the general-W
  form of Theorem B is checked on them. (`run_q*.log`: no line contains `False`.)
- `check.py` / `check.log`: factorisation and mu (2800 polynomials), chi_c(y) against a Euclidean resultant
  (12,634 pairs), invariance of the row label under sixth powers (300), weight a (2800): 0 failures.
- The comparison checks the sum over rows, not each row. The assignment of terms to rows is by the definition
  above.

Runs: q = 7: all 404 geometries (k, N, lam, d) of the block files with 1 <= r <= 4 and max(k, N') <= 6; q = 13:
all 147 with 1 <= r <= 3 and max(k, N') <= 5. Eleven weights (q = 7), eight (q = 13); 5620 (block, weight) records;
4116 with T1 > 0. Up to 13,434 dual frequencies per block. For r <= 5 the only principal frequencies are the
constants (first non-constant sixth power at r = 6); this is the same pre-asymptotic range as the predecessor.

Weights: a, b = the two targets (quadratic characters of conductor T^3 + 2, T^3 + T + 1; Weil). mu = w = mu
(Moebius sum of the weight is trivial: the pole control, Liouville type). lnu = mu nu_a (Liouville twist of the
target; its reciprocal is L(u, nu)/L(u^2, nu^2)). thin = nu_a times a completely multiplicative sign eps with
eps(P) = -1 on the first floor(q^(0.8 e)/(2e)) primes of each degree e (function-field form of THIN). rm = random
completely multiplicative signs (Euler product, no functional equation: the U / sign-twist control). rma = nu_a
times rm. n1, n2 = random +-1, not multiplicative. dh = nu_a + nu_b. t = 1.

### 3.3 Results (`analysis.txt`)

**(i) Exact vanishing [EXACT].** Of the 4116 records with T1 > 0, 2042 have NP = 0 exactly; in 2039 of them
J = 0 and Princ = Diag = 0. Per weight (q = 7, d >= N', at least 20 rows): 60 to 68 of 83 to 96 blocks, for every
weight including n1, n2. These are blocks in which J vanishes identically (orthogonality in m, or c_k in the span
of blocks with empty dual range by F1/F2) while several hundred to 2800 individual rows are non-zero: complete
cancellation over the rows, the same for all weights.

**(ii) Parity [EXACT].** If 6 does not divide k - N' (odd case; 3343 records with T1 > 0) there is no principal
weight for r <= 5: Princ = Diag = 0 in all of them and **J' = NP**. In these blocks "cancellation over the
non-principal rows" is literally the size of the probe J, that is, the low side. If 6 | k - N' (773 records):
NP != 0 in 768, Princ + Diag != 0 in 767 of those, and |NP| / (|Princ| + |Diag|) has median 0.028 (q = 7), 0.006 (q = 13): the probe is its
principal row, as the predecessor found.

**(iii) Cancellation where NP != 0 [MEASURED].** Complete row range d >= N', at least 20 non-zero rows:

| weight | q = 7: blocks with NP != 0 | median rows | median rho | median theta | q = 13: blocks | median rho | median theta |
|---|---|---|---|---|---|---|---|
| a (target) | 26 | 384 | 0.122 | 0.411 | 7 | 0.128 | 0.293 |
| b (target) | 31 | 340 | 0.110 | 0.383 | | | |
| lnu (Liouville twist of target) | 28 | 371 | 0.126 | 0.382 | 7 | 0.076 | 0.332 |
| thin | 33 | 340 | 0.239 | 0.317 | 10 | 0.180 | 0.274 |
| rm (random multiplicative) | 32 | 341 | 0.123 | 0.369 | 10 | 0.231 | 0.231 |
| rma | 33 | 340 | 0.230 | 0.252 | 10 | 0.189 | 0.276 |
| n1 (random, not multiplicative) | 33 | 343 | 0.258 | 0.278 | 10 | 0.176 | 0.320 |
| n2 (random, not multiplicative) | 33 | 343 | 0.188 | 0.287 | 10 | 0.117 | 0.349 |
| dh | 31 | 342 | 0.165 | 0.372 | | | |
| mu (pole control) | 22 | 392 | 0.523 | 0.108 | 6 | 0.742 | 0.039 |
| t (w = 1) | 24 | 340 | 0.721 | 0.078 | | | |

Same geometry, weight against target a (paired; q = 7, 24 to 26 geometries): median of theta_w - theta_a is 0.000
(b, lnu, dh), -0.011 (n2), -0.028 (rm), -0.038 (thin), -0.050 (rma), -0.063 (n1), -0.210 (mu), -0.187 (t); the
range over geometries is about +-0.5 for every weight. q = 13 (7 geometries): between -0.052 and +0.119 for the
sign-type weights, -0.230 for mu. Marked blocks in the ledger region lx < l (k + lam > d; table T2): theta 0.50,
0.53 (targets), 0.51 (lnu), 0.28 to 0.39 (thin, rm, rma, n1, n2), 0.49 (dh), 0.27 (mu), 0.10 (t).

**(iv) What separates the weights is the principal row, not the cancellation [MEASURED].** Even blocks, at least
20 rows (T10, q = 7): (|Princ| + |Diag|)/T1 has median 2.2 (a), 1.7 (b), 0.78 (lnu), 1.3 and 1.6 (n1, n2), 27 (mu);
q = 13: 7.2 (a), 4.3 to 10 (lnu, rm, rma, n1, n2), 29 (thin), 99 (mu). The median of |J'|/T1 is within 20 percent of it for each of these weights. The
mu weight has the pole: its principal row and its probe are both large and nearly equal, and its NP is still below
T1. This is Lemma 1 in numbers: NP = J' - Princ - Diag, and the information about the target sits in Princ.

**Reading against the assignment's rule.** Cancellation appears for the true weight, the Moebius-twisted weights
and the random weights. It is control-blind. It is not produced by a step that uses the function-field Riemann
hypothesis: (a) half of it is exact vanishing that holds for arbitrary W; (b) the random non-multiplicative
weights, which have no L-function, have theta within 0.06 (paired median) of the target; (c) the two weights with
visibly less cancellation are mu and 1, the two that are invariant under T -> aT + b (the rows then repeat along
orbits of the affine group; ARGUED, not derived), and for w = 1 the relevant function 1/zeta has no zeros at all.
No difference between the two Weil targets and the sign-type controls is resolved at these sizes.

## 4. Pivot: (E-H) by a norm bound over the rows

Since the exact u-sum is circular and the termwise bound is H0, the one remaining standard treatment is bilinear:
Cauchy-Schwarz and a large sieve in u. Write T_np for the row operator with the sixth-power frequencies removed.
The best such bound is the Hilbert-Schmidt floor of T_np (Lemma HS of `c7-probe-format-h-cap`; the entries after
removal are unimodular on a proportion about 1 of positions; the removed part may contain the top singular
directions, so the floor is taken as attained: a hypothetical optimal "K + D" sieve):

    |NP| <= Q^(-1/2) ||A|| ||T_np|| ||beta||,   exponent >= lx/2 + max(0, 1 + l - M)/2,
    in the abscissa normalisation:   B >= N_np := 1 - h/r + max(0, 1 + l - M)/2.

**Theorem K' [PROVED: identity; relative to (S), the K-branch and the floor of the norm as inputs].** If
B >= L_K = 1 - h/r + (M + l - 1)/2 and B >= N_np, then

    B >= (L_K + N_np)/2 = 1 - h/r + l/2 = 1 - 1/r + lx/r + l (1/2 - 1/r)  >=  1 - 1/r      (r >= 2).

Proof. (M + l - 1)/2 + (1 + l - M)/2 = l, and h = 1 + l - lx. QED
(`eh_norm_lp.log`: the identity at 18,000 random rational points, r = 2, 3, 4, 6, 8, 12: 0 violations.)

The K-loss needs many columns per row (M + l <= 1 to vanish) and the norm bound of NP needs many rows per column
(M >= 1 + l); the two meet only at l = 0. EXACT LP with the high side min(H0, N_np), free geometry
(`eh_norm_lp.log`): 1 - 1/r CONFIRMED for r = 2, 3, 6 at (0, 1, 0); with the polar term 13/15; with (E-K) 31/36
(polar or source G) and 7/9 (G = 0): each value is that of H0 alone. With N_np as the only high constraint: 5/6
(G = 0), 35/39 (polar), 55/63 (polar, (E-K)). The norm version of (E-H) gains nothing. No second pivot.

A modulus-only bound for NP is not excluded by the alignment argument (Lemma A of `c7-probe-format-h-cap`): for the
Liouville-twisted target NP stays small while I and I_1 are large (section 3.3 (iv)). The cap comes from the
shape of the matrix, not from a control.

## 5. Compatibility with the ledger and the normaliser ceiling

All runs: exact rational vertex enumeration, python stdlib, through `scripts/memcap.sh 8`. `cap_lp_copy.py` and
`tiers_fe_copy.py` are unchanged copies; `tiers_fe_theta.py` differs from the copy in two lines (parameter theta in
the high constraint; diff recorded in the header of `eh_lp_c5.py`). Regressions: 13/15, 31/36, 5/6, 2/3 CONFIRMED.

(E-H) with strength theta: high constraint H_theta = 1/2 - ly/2 + (1 - 1/r - theta) h - l/2 <= B; "deleted" = no
high constraint. r = 6. Free geometry unless stated.

| low side | G | theta = 0 | 1/12 | 1/6 | 1/4 | 1/3 | 1/2 | high side deleted | file |
|---|---|---|---|---|---|---|---|---|---|
| K only | 0 | 5/6 | 9/11 | 4/5 | 7/9 | 3/4 | 2/3 | 2/3 | `eh_lp.log` |
| K only | polar or source | 13/15 | 23/27 | 5/6 | 17/21 | 7/9 | 2/3 | 2/3 | `eh_lp.log` |
| J, K, P (source ledger) | 0 | 5/6 | 9/11 | 4/5 | 4/5 | 4/5 | 4/5 | 4/5 | `eh_lp.log` |
| J, K, P (source ledger) | polar or source | 13/15 | 13/15 | 13/15 | 13/15 | 13/15 | 13/15 | 13/15 | `eh_lp.log` |
| (E-K): K deleted, J, P kept | 0 | 7/9 | 7/9 | 7/9 | 7/9 | 7/9 | 7/9 | 7/9 | `eh_lp.log` |
| (E-K): K deleted, J, P kept | polar or source | 31/36 | 31/36 | 31/36 | 31/36 | 31/36 | 31/36 | 31/36 | `eh_lp.log` |
| all range losses deleted | any | no floor | | | | | | no floor | `eh_lp.log` |

(Values are LP bisection results printed to 7 digits and identified with the fractions shown.)

- First row: at lx = 0, ly + l = 1 the constraints 5/6 - l/6 and (5/6 - theta)(1 + l) meet at l = theta/(1 - theta),
  giving B(theta) = (5 - 6 theta)/(6 - 6 theta) for 0 <= theta <= 1/2 [PROVED as a feasible point; the six LP values
  agree]. theta = 1/2 gives 2/3 at (0, 0, 1), h = 2: the value quoted by `c7-probe-format-h-cap`, which is the
  normaliser ceiling of Z24. Larger theta gives nothing more: the K-branch binds. **(E-H) alone cannot pass 2/3**
  in the reduced system, and the manuscript cannot be applied below 2/3 in any case.
- With the J- and P-losses and the Gram term of the source, (E-H) never binds (13/15). This confirms correction E1
  of the referee of `c7-probe-format-h-cap` and extends it to every theta.
- **(E-H) with (E-K): 31/36 (Gram term kept), 7/9 (G = 0).** These are the values of (E-K) alone. Below 5/6 with
  the Gram term kept needs the J- and P-losses deleted as well, and then the system has no floor (inconsistent, as
  recorded in Z15b).
- LP of `c5-target-fe-order2-ledger` (rows reflected | unreflected | empty dual; height w free; `eh_lp_c5.log`):
  source and free geometry with G polar or source: 13/15 at theta = 0; **19/24 at theta = 1/4 and 7/12 at
  theta = 1/2, both on the empty-dual branch** ((lx, ly, l) = (1/2, 0, 0) and (0, 1/2, 0)); high side deleted: no
  floor. On that branch the only constraint is H_theta, minimised over T = 2M + l - 1 + w <= 0:
  min(11/12 - theta/2, 13/12 - theta). So in that LP (E-H) alone, without (E-K), goes below 13/15 for
  theta > 1/10, below 5/6 for theta > 1/6, reaches 2/3 at theta = 5/12 and would pass it for larger theta (where
  Proposition 2.1 is not applicable, Z24). The branch has no low estimate because the reflected row is negligible:
  I is negligible, NP = -I_1 up to that, and the bound assumed for NP is the bound concluded for the signal.
  The value is the hypothesis.
- With (E-K) in the c5 LP the reflected-branch value is 23/27 (height w free; 31/36 at w = 0), unchanged by theta
  until the empty branch takes over at the same values as above.
- Not used: the c5 LP in free geometry with G = 0 returns 1/3 on the unreflected branch for every theta; that is the
  region already identified as inconsistent (Z15b; the Gram term is missing), and (E-H) does not enter it.

## 6. Controls

No statement about zeros is made; nothing has to fail. Where each control sits:

- **THIN** (F_q[T]: weight `thin`; 33 + 10 blocks with NP != 0). Exact vanishing in the same blocks as the target
  except in 6 of the 92 geometries (q = 7); theta 0.317 (q = 7), 0.274 (q = 13); paired difference to the target -0.038, -0.052.
  The cancellation is present. In the format THIN has no reflection, hence no low estimate, hence Lemma 1(c) says
  nothing: (E-H) may hold for THIN. The failing step for THIN remains the low side (c5; row Z25).
- **Liouville** (`mu`: the weight whose Moebius sum is trivial; `lnu`: the Liouville twist of the target).
  `lnu`: theta 0.382 against 0.411, paired difference 0.000. `mu`: NP = 0 in the same blocks as the target except 2; where non-zero,
  theta 0.108 (less cancellation), |NP| < T1 while |Princ| is about 27 to 99 times T1. A pole of the reciprocal
  does not enlarge NP.
- **U / sign-twisted primes** (`rm`, `rma`: random completely multiplicative signs). theta 0.369 and 0.252; paired
  -0.028, -0.050.
- **DH** (`dh` = nu_a + nu_b). The decomposition is linear in W: every c_u is the sum of the two targets' rows.
  theta 0.372; paired 0.000. DH fails in the base method at the reciprocal Euler product (MS Lemma 7.1), not here.
- **Non-multiplicative random weights** (n1, n2; not in the required list): theta 0.278, 0.287; paired -0.063,
  -0.011. This is the control that shows no Euler product is needed.
- Backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w: not applicable (no
  positivity or zero statement). E_a shifts every exponent by a and leaves Lemma 1 unchanged.

## 7. Requirement flags (for this lane's result)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Lemma 1 is the triangle inequality on an exact splitting; the general-W decomposition and the measured cancellation hold for non-multiplicative weights (n1, n2: 2 x 404 + 2 x 147 block records, totals exact) |
| R2 height-uniform, every window | false | no conclusion about zeros |
| R3 controls fail structurally | false | the cancellation is present for THIN, Liouville, U, DH and random weights (section 3.3, 6); (E-H) can hold for a control |
| R4 reaches the critical line | false | (E-H) is equivalent to its conclusion; its norm version is capped at 1 - 1/r; LP values below 5/6 occur only where the hypothesis is the conclusion |

## 8. Three weakest steps

1. **The corollary of Lemma 1 is relative and conditional.** Lemma 1 is exact given (10.5). The translation of
   e(I_1) into a statement about poles of H_eta/L uses Lemma S of `c6-marks-bc-manuscript-check` (relative to MS
   Lemma 7.1, not re-derived here) and assumes the remainder of row 1, after its two residues, is below the level
   in question (MODEL). The equivalence is stated "given the low estimate at l0 <= E"; in the region lx < l, where
   the h > 1 vertices lie, no low estimate has a source, and there the exact statement is only
   e(NP) <= E <=> e(I - I_1) <= E. Whether a proof technique exists that bounds NP without passing through I or
   I_1 is not decided; section 0 item 3 classifies the three treatments in use and is not exhaustive (for example a
   bound that uses the specific vector A on the u-side is not covered).
2. **The function-field test is pre-asymptotic and its row statistic is my definition.** r <= 4 (q = 7), r <= 3
   (q = 13); the principal frequencies are the constants only (the first non-constant sixth power needs r >= 6);
   at most 2800 rows, typically 340 to 400; theta is a ratio of logarithms at one size, not a fitted exponent, and
   its spread over geometries (+-0.5) is larger than the differences between weights. Rows are grouped by the
   sixth-power-free part of the monic dual frequency including the coupling terms (g, e); T1 is the triangle
   inequality over those rows and is not the manuscript's H0 (which bounds it from above). The model has sharp
   degree classes, squarefree A, uncompensated marks, and (for most blocks with large r) k > (d+1)/2, where c_k is a
   re-expression of a block with smaller k. The explanation of the weaker cancellation for mu and 1 (affine
   invariance) is ARGUED. Totals are verified against an independent code path; individual rows are not.
3. **LP inputs.** Every abscissa in section 5 is a value of the r3 / c5 transcription (MODEL), with the
   parametrisation "row count Z^h, saving Z^(-theta h)" chosen here; the density class of the high side is kept
   at theta = 0 or dropped, not re-derived with a saving. The fractions in the table are identifications of
   7-digit LP values; only the regressions and the r = 2, 3, 6 values of Theorem K' were CONFIRMED exactly. The
   Hilbert-Schmidt floor for T_np is taken as attained (best case); its true norm is not computed. The statement
   "I is negligible on the empty-dual branch" is taken from c5.

## 9. Self-check (not an independent referee pass)

Done by the lane itself, with different cases where possible; an independent referee is owed.
- Lemma 1: re-read against MS lines 4365 to 4395 of `paper.txt` ((10.4), (10.5): "the following identity is
  asserted for the independently given I_eta(Z), with absolute convergence of the sum and integrals"). The
  splitting needs nothing else. Proposition 2.1 (lines 381 to 460) uses (2.5) only through the triangle
  inequality (2.6), which is direction "(low, NP) gives I_1" of Lemma 1; the converse direction is the same
  inequality.
- Theorem K': by hand, (M + l - 1)/2 + (1 + l - M)/2 = l; 1 - (1 + l - lx)/r + l/2 = 1 - 1/r + lx/r + l(1/2 - 1/r).
- B(theta): at l = theta/(1 - theta), 5/6 - l/6 = (5 - 6 theta)/(6(1 - theta)); theta = 1/4 gives 7/9, theta = 1/3
  gives 3/4, as in the LP.
- Empty branch: lx = 1/2, ly = l = 0: h = 1/2, H_theta = 1/2 + (5/6 - theta)/2 = 11/12 - theta/2; lx = 0, ly = 1/2:
  h = 1, H_theta = 1/4 + 5/6 - theta = 13/12 - theta. LP: 19/24 and 7/12. Agree.
- F_q[T]: 2644 exact integer matches with the predecessor's m-side values; `check.py`; first run (q = 7, d = 2, 3,
  19 blocks, 6 weights with references) matched before any other run was made.
- Possible objection: "NP = 0 exactly" is counted in blocks where J = 0 for a reason unrelated to the rows
  (c_k = 0 or empty dual range of the re-expressed block). That is the point of Lemma 2: the row sum has no
  information that the m-sum does not have. The table of section 3.3 (iii) excludes these blocks.
- Known hazards checked: RH not assumed; no finite-height input; no statement about zeros; no known theorem
  presented as new (Lemma 1 is the triangle inequality; its content is the identification of (E-H) with the
  conclusion).

## 10. Proposed map row (not applied)

| Z15d | (E-H): cancellation over the non-principal rows of the Prop. 2.1 probe beyond the trivial count | NP = I - I_1 exactly (MS (10.5)). Given the low estimate, a bound Z^E for NP is equivalent to "H_eta/L(s, eta) holomorphic on Re s > B_E", the output of Prop. 2.1 for that bound: the hypothesis is its conclusion (target only; independent of the row family and of zeros of H_eta; below 2/3 only statement (R) of Z26). Norm version: with the K-branch, B >= 1 - 1/r + lx/r + l(1/2 - 1/r). F_q[T], exact dual decomposition (551 blocks, 11 weights, totals equal to the m-side integers in 2644 of 2644 cases): NP = 0 exactly in half of the records for every weight; elsewhere log(T1/|NP|)/log(rows) is 0.4 for targets and 0.25 to 0.38 for THIN, Liouville twist, random multiplicative, random non-multiplicative, DH; 0.1 for w = mu and w = 1. LP: with the source ledger (E-H) never binds (13/15); with (E-K) 31/36; three-input system (5 - 6 theta)/(6 - 6 theta), 2/3 at theta = 1/2; empty-dual branch of the c5 LP min(11/12 - theta/2, 13/12 - theta), where the hypothesis is the conclusion verbatim. | PROVED-rel MS (10.5) and Lemma S (Lemma 1); PROVED identity (Theorem K'); EXACT (model decomposition); MEASURED (cancellation, r <= 4); LP on MODEL inputs; not independently refereed | control-blind: present for THIN, Liouville, U, DH, random weights | `c8-eh-nonprincipal-row-cancellation` |

## 11. Compute record and files

Local only (Mac), every run through `scripts/memcap.sh 8`; interpreter with numpy:
`push/b-volterra-norm/venv/bin/python` (read only). Five processes of `run.py` (q = 7: d = 1..4, then d = 5, d = 6,
d = 7..8 separately; q = 13: d = 1..4); longest about 25 minutes (q = 13); resident memory at most 0.7 GB. One
process of mine was stopped by pid after it had finished d = 4 (its d = 5, 6 work was running in two other
processes). No process is left running. The compute server was not contacted.

Files: `RESULT.md`; `dual.py`, `run.py`, `analyse.py`, `analysis.txt`; `dual_q7.jsonl`, `dual_q7_d5.jsonl`,
`dual_q7_d6.jsonl`, `dual_q7_d7.jsonl`, `dual_q13.jsonl` (per block and weight: U, |NP|^2, T1, Sum |c_u|^2,
|Princ|^2, Diag, |J'|^2, J2 and the reference J2); `run_q*.log`; `check.py`, `check.log`; `eh_lp.py`, `eh_lp.log`;
`eh_lp_c5.py`, `eh_lp_c5.log`; `eh_norm_lp.py`, `eh_norm_lp.log`; `cap_lp_copy.py`, `tiers_fe_copy.py` (unchanged
copies), `tiers_fe_theta.py`; `lanes_line.json` (proposed line for `campaign/lanes.jsonl`, not appended).

No statement about zeta. No abscissa below 0.874886647 is proved.
