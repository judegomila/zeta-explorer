# c8-ek-theta-second-moment-formula: the mean square of the completed theta rows, unfolded

Internal working note, 2026-11-18. Slug `c8-ek-theta-second-moment-formula`. Kind: deepen. Not refereed (no referee
pass was run from this lane; section 9 is a self-check, not a referee). Nothing committed, pushed or posted.
The compute server was not used: every run is local, through `scripts/memcap.sh 8`, float64 / complex64, longest
run 7 minutes.

Every abscissa below is the value of a hypothetical ESTIMATE SYSTEM relative to the unrefereed sources (openai/math
manuscript "MS", `~/lean-deps/qrh-verify/paper.txt`, read as text). No statement about any zero of zeta or of any
L-function is made. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-cond (complete relative to a named hypothesis) / PROVED-rel X /
CLASSICAL / MEASURED (float screen) / ARGUED / MODEL / OPEN.

## Requirement answers (stated first, as the assignment asks)

| flag | answer | evidence |
|---|---|---|
| R1 multiplicativity essential | **no** | The evaluation uses multiplicativity twice (Gauss-sum identity (4.7), and the target through 1/L), but the property (E-K) itself holds for random unimodular vectors (MEASURED, ratio 0.89 to 1.05). It is not a multiplicativity statement. |
| R2 height-uniform, every window | **no** | No conclusion about zeros; the statement is a mean square over rows at fixed target. |
| R3 controls fail structurally | **no** | (E-K) holds for the generic unimodular twist U and is below resolution for THIN at b = 0.9, 0.97; it fails for the Liouville twist and for the aligned twist, for a named reason (pole of the reciprocal at s = 1, multiplicity K^{1/6}). Not every control fails. |
| R4 reaches the critical line | **inside the architecture only** (flag false) | The result prices one input of the Prop. 2.1 format. It reaches no abscissa. |

## Verdict

**Partial result. (E-K) is not refuted; it is unfolded exactly, proved under GRH for one family in the range
rows >= columns, and identified as a statement of zero-free type about the twist family of the target.**

1. **Lemma 1 (exact unfolding; PROVED, checked numerically to 1e-9).** The row variable m is a complete lattice
   variable and every column is a character in m. Poisson summation in m, then the manuscript's Gauss identity
   gamma_1 gamma_2 = mu alpha G, turn the second moment of the theta rows into

       Sum_m g_X(m) |B_m|^2 = X D  +  X Sum_{k != 0} F_k,      effective range q_k <= N^2 / X,

   where D is the diagonal and F_k is a bilinear form in the sums
   M_k = Sum_c mu(c) psi(c) conj(chi_c(k)) w(c) / q_c: smooth partial sums of 1/L(1, eta theta chi_.(k)^{-1}) over the
   order-6 twist family of the target. The theta coefficient and the sextic Gauss sum cancel; what is left is the
   Moebius function. No Rankin-Selberg or period integral on the cubic cover is needed (section 2).
2. **Theorem 2 (PROVED-cond; bookkeeping in outline).** Under GRH for the Hecke L-functions of Q(omega) occurring
   in M_k: Sum_m g_X(m) |B_m|^2 = X D + O(N^{1+eps}), N = Z P the column length. So (E-K) holds for X >= N, and for
   X < N the bound is N^{1+eps} (loss Z^{1+l-M}). Under a zero-free half plane Re s > beta* for the family only:
   error O(N^{2 beta* + eps}). The hypothesis contains the target's own L-function: as an input to a zero-free
   argument for the target it is circular.
3. **The candidate excess (ARGUED; MEASURED in the controls).** The frequencies k = a^6 (times a finite set) all carry
   the same sum M_1, the smooth partial sum of 1/L(1, eta theta). Their number is about K^{1/6}, K = N^2/X. The term is
   X K^{1/6} H(M), H an indefinite Hermitian form of signature (2, 2) in the four square-class components of M_1. A zero
   of a member L(s, eta theta) with real part beta contributes +- X K^{1/6} Z^{2 beta - 2}. So (E-K) can fail only
   through zeros with beta > 1 - (2 + 2l - M)/12, and it does fail for a target whose reciprocal has a pole at 1
   (Liouville twist: +38%, aligned twist: +63% at Z = 8000, growing with the number of sixth powers below K).
4. **Dunn-Radziwill (source opened: arXiv 2109.07463, sections 1.4 and 9).** The extremal vector of Theorem 1.4 is
   beta_b = g~(b) W(N(b)/B), cubic Gauss sums on squarefree b, against the CUBIC symbol (b/a)_3, with the Patterson
   main term B^{5/6}/A^{1/6} as the mechanism. The probe's rows differ in two ways, each of which removes that main
   term: the row symbol is the sextic symbol to the first power (j = 1), and the coefficient carries the angular
   factor conj(alpha) (MS Prop. 5.1: T(s, Psi) is entire). The sharpness result does not settle (E-K) as false.
   The screen reproduces the Dunn-Radziwill growth in their configuration (cubic rows, vector gamma_2): ratio 4.3,
   6.6, 10.3 at Z = 500, 2000, 8000, exponent 0.32 against the predicted 1/3; in the probe's configuration the ratio
   is 1.00.
5. **Decisive test (MEASURED).** Ratio Sum_m g |B_m|^2 / (diagonal) for the theta vector: 0.96 to 1.01 at
   Z = 2000 and 8000 for X/N from 1/8 to 16; with one mark slot (P up to 40) 0.94 to 1.04 for X/N from 1/32 to 8,
   which covers part of the window Z/P < X < Z P reached by neither proof. Random unimodular vectors: 0.89 to 1.05.
   No excess for the theta vector at any size.
6. **Where the range beyond the approximate functional equation enters.** There are two dual representations.
   Row functional equation (MS Prop. 5.1): dual length (X P)^2/N, lossless iff X P <= Z. Poisson in m (Lemma 1): dual
   length N^2/X, sign-definite enough to use iff X >= N = Z P. The window Z/P < X < Z P (width P^2; empty without
   marks) is the range where both duals are longer than their row sets. The 31/36 vertex (1/2, 1/2, 1/3) lies in the
   window; the 7/9 vertex (0, 4/3, 1/3) lies on its edge X = N.
7. **ORDER-2 under (E-K).** Not decided as a theorem. What is decided: (a) deleting the K-loss is not a false input
   in the range M >= 1 + l (it is a theorem under family GRH), so in the inconsistent free-geometry region of
   `c7-probe-format-h-cap` the false input is among (S) at lx < l, H0 at h > 1 and G; (b) used without circularity
   (Lemma 1 plus the zero-free region 7/8, pointwise), the new low branch has loss (7/4)(1 + l) - M and gives
   nothing below 13/15 inside any box of side <= 4 (EXACT LP on MODEL inputs: 0.976 at box 1, 0.905 at box 4);
   (c) the content of (E-K) is a mean value of 1/L over the order-6 family with conductors up to N^2/X, at
   large-sieve-optimal strength, for the Moebius vector. That is a hypothesis of density type in the conductor
   aspect; it is not known, and by Dunn-Radziwill it cannot come from an operator bound.

---

## 0. Plan; relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP rows Z6, Z15, Z15b, Z15c and the controls section (THIN, U, Liouville);
RESULT of `c7-probe-format-h-cap` (all), `r3-method-limit` (sections 1, 2, 5), `c5-target-fe-order2-ledger`
(section 1); MS sections 4.1-4.2 (Gauss identities, (4.7)), 5.1 (Prop. 5.1), 5.5 (Lemma 5.7, 5.8), 6.1, 7.2, 15.1;
Dunn-Radziwill sections 1.4 and 9 (fetched with a generic client into `dl/`, converted with pdftotext, read as
text).

Already known: the K-loss M + l - 1 is forced for every operator-norm estimate of the reflected rows (c7 Lemma HS);
phase-blind estimates have B >= 1 (c7 Lemma A); (E-K) was named as the vector-specific escape, with the
Dunn-Radziwill risk recalled and not opened (r3 section 5 item 2).

New here: Lemma 1; Theorem 2; the identification of the excess with the target's reciprocal at s = 1 and its
sixth-power multiplicity; the reading of the Dunn-Radziwill extremal vector against the probe's row symbol; the
screen with nine vectors at seven sizes; the window statement of item 6.

Definition of B_m (c7 / c5 transcription of MS (5.30), (6.1), section 15.1; this is the only point of contact with
`c8-ek-ff-reflected-rows-exact`):

    B_m = Sum_{c squarefree, n} gamma_2(c) conj(alpha(c n^3)) psi(c n^3) chi_c(m) chi_n(m)^3 q_c^{-1/2} q_n^{-1} V(q_c q_n^3 / Z),

c, n primary and prime to 6, chi the sextic symbol of Z[omega], alpha(a) = a/|a|, gamma_j the normalised Gauss sum of
chi_c^j, psi = nu theta with nu containing the target eta; the corrected row of MS section 6.1 carries the extra
factor G(c n^3). Marked rows: the indicator that a slot prime p ~ P divides c n^3, summed over p with a smooth weight,
at scale Z q_p; column length N = Z P.
Transcription note: in the text extraction the bar on alpha is lost in the displays (5.30), (6.1), (15.1). It is
present in the definition of D(s, Psi) in Prop. 5.1 and is forced by the signal computation of MS section 7.2. The
table check below confirms the reading gamma_2 conj(alpha) and G(c) = conj(chi_c(4)) gamma_3(c).

## 1. Lemma 1: the exact unfolding

Notation. O = Z[omega]; e(z) = exp(2 pi i Tr(z/lambda)); O is self-dual for (z, y) -> e(zy) with the measure
(2/sqrt 3) dx dy. Row weight g_X(m) = exp(-kappa q_m / X), kappa = 2 pi / sqrt 3; its transform is
g~(y) = X exp(-kappa X |y|^2) > 0. gt_1(k, c) = q_c^{-1/2} Sum_{v mod c} chi_c(v) e(kv/c) = conj(chi_c(k)) gamma_1(c)
for squarefree c (zero if (k, c) != 1, and gt_1(k, 1) = 1). R(a, b) = +-1 is the reciprocity bicharacter of MS
Lemma 4.4: chi_b(a) = R(a, b) chi_a(b).

**Lemma 1 [PROVED].** Let (a_c) be a finite complex sequence on squarefree primary c prime to 6 and
B_m = Sum_c a_c chi_c(m). For squarefree c = g c_1, c' = g c_1' with g = gcd(c, c'),

    S(c, c') := Sum_{m in O} chi_c(m) conj(chi_c'(m)) g_X(m)
              = Sum_{d | g} (mu(d)/q_d) chi_{c_1}(d) conj(chi_{c_1'}(d)) R(c_1, c_1') (q_{c_1} q_{c_1'})^{-1/2}
                Sum_{k in O} X exp(-kappa X q_k / (q_d q_{c_1} q_{c_1'})) gt_1(k, c_1) conj(gt_1(-k, c_1')),

and Sum_m g_X(m) |B_m|^2 = Sum_{c, c'} a_c conj(a_c') S(c, c'). (For c = c' = 1 the term m = 0 is included.)
The k = 0 terms occur only for c_1 = c_1' = 1 and give the diagonal

    X D,   D = Sum_c |a_c|^2 phi(c)/q_c.

Proof. chi_c conj(chi_c') = 1_{(m, g) = 1} chi_{c_1} conj(chi_{c_1'}). Expand 1_{(m,g)=1} = Sum_{d | g} mu(d) 1_{d | m} and
put m = d m'. The function m' -> chi_{c_1}(m') conj(chi_{c_1'}(m')) is periodic modulo c_1 c_1'. Poisson summation
on residue classes (Sum_{m = r mod n} f(m) = q_n^{-1} Sum_k f~(k/n) e(kr/n)) with f(z) = g_X(dz), f~(y) =
q_d^{-1} g~(y/d), gives the k-sum with the complete sum Sum_{r mod c_1 c_1'} chi_{c_1}(r) conj(chi_{c_1'}(r)) e(kr/(c_1 c_1')).
Writing r = r_1 c_1' + r_2 c_1 it factors as chi_{c_1}(c_1') conj(chi_{c_1'}(c_1)) (q_{c_1} q_{c_1'})^{1/2}
gt_1(k, c_1) gt_5(k, c_1'), with gt_5(k, c) = conj(gt_1(-k, c)), and chi_{c_1}(c_1') conj(chi_{c_1'}(c_1)) = R(c_1, c_1').
QED

**Corollary 1 [PROVED-rel MS (4.7), checked on the table].** For the theta vector a_c = tau_c nu(c) w(c),
tau_c = gamma_2(c) conj(alpha(c)), w >= 0: by gamma_1 gamma_2 = mu alpha G and the twisted multiplicativity
gamma_2(g c_1) = gamma_2(g) gamma_2(c_1) (chi_g(c_1) chi_{c_1}(g))^2,

    tau_{g c_1} gt_1(k, c_1) = tau_g * mu(c_1) G(c_1) conj(chi_{c_1}(k g^2))

((chi_g(c_1) chi_{c_1}(g))^2 = chi_{c_1}(g)^4 = conj(chi_{c_1}(g^2)) by reciprocity, R^2 = 1). With the factor
chi_{c_1}(d) = conj(chi_{c_1}(d^5)) of Lemma 1, the c_1-dependence of the summand of a_c conj(a_c') S(g c_1, g c_1') is

    mu(c_1) G(c_1) nu(c_1) conj(chi_{c_1}(k g^2 d^5)) w(g c_1) q_{c_1}^{-1/2},

and the same with a conjugate and -k for c_1'. For the corrected row (factor G(c) inserted) G(c_1) is replaced by
G(g c_1) G(c_1) = G(g) R(g, c_1) G(c_1)^2 and G^2 = conj(chi_.(16)) chi_.(-1) is a ray character. G is a function on a
fixed ray group (MS Lemma 4.4) and R is a bicharacter of the square classes modulo 4, so both expand into finitely
many ray characters theta. For fixed y != 0 the map c -> chi_c(y) is a ray character of conductor dividing a fixed
power of 6 times y (MS Lemma 4.1). Hence, with the gcd condition (c_1, c_1') = 1 opened by Sum_{e | c_1, e | c_1'} mu(e)
and the Gaussian in k separated by a Mellin integral of Gamma(s),

    Sum_m g_X(m) |B_m|^2 = X D + X Sum_{g, d | g, e} (weights <= 1/(q_g q_d q_e^2)) Sum_{k != 0} Sum_{theta, theta'} c_{theta theta'}
                            (1/2 pi i) Int Gamma(s) (kappa X q_k / (q_d q_e^2))^{-s} M_{k'}(s; theta) conj(M_{-k'}(conj s; theta')) ds,
    M_y(s; theta) = Sum_{c squarefree, (c, g e) = 1} mu(c) (eta theta)(c) conj(chi_c(y)) V(q_g q_e q_c / Z) q_c^{-1+s}
                  = (1/2 pi i) Int V~(u) (Z/(q_g q_e))^u / L^{S'}(1 - s + u, eta theta chi_.(y)^{-1}) du,

k' = k g^2 d^5 (the last line for the weights w(c) = q_c^{-1/2} V(q_c/Z) of the rows, so that a_c gt_1 q_c^{-1/2} carries
V(q_g q_e q_c / Z)/q_c; S' = S together with the primes of g e).

Where the theta structure is used: only in gamma_1 gamma_2 = mu alpha G (Hasse-Davenport plus the cubic Jacobi sum,
MS Lemma 4.2) and in conj(alpha). The functional equation of theta (Prop. 5.1) is not used. The identity holds for
every weight nu: it needs no periodicity of the target.

Numerical checks (`t1_identity.py`, `t1_identity.log`):
- (4.7) on the table of `tmp/sextic` (N <= 400): |G| = 1 to 1.2e-9 and G = conj(chi_c(4)) gamma_3(c) to 2.0e-9
  (the unconjugated reading fails by 1.7). At full size (N <= 96000) G from (4.7) agrees with
  conj(chi_c(4)) Gamma(c), Gamma the four-term formula (4.3), to 3.6e-9 (`t2_Z*.log`, line "check G"; N up to 1.5e6).
- pair formula: 68 pairs (random, with common factors, and diagonal), X = 60: max |direct - dual| = 8.4e-9.
- aggregated identity, columns N <= 130: theta vector 17.2580757837 (direct) against 17.2580757845 (dual);
  vector conj(gamma_1): 18.3936902226 against 18.3936902217.

Why no Rankin-Selberg integral. A period integral of theta conj(theta) against an Eisenstein series computes
Sum |tau(c)|^2 q_c^{-s}, which is the diagonal D. The off-diagonal is not a property of theta conj(theta): after the
m-sum each column meets the Gauss sum of its own row symbol, and gamma_2 conj(alpha) gamma_1 = mu G. The same
cancellation produces the signal of the probe (MS section 7.2). The second moment of B is a probe of the same kind
with itself in place of the additive polynomial A: its "signal" is 1/L at s = 1 and its "number of sixth-power
frequencies" is K^{1/6}.

Relation to Dunn-Radziwill (1.13). Their corrected cubic large sieve has the same shape: after removing a main term,
the mean square over rows a ~ A of Sum_b beta_b g~(b) (b/a)_3 is (A/B) Sum_{0 < |h| <= B^2/A} |Sum_b beta_b (b/h)_3|^2
plus errors: the Gauss sum is divided out of the vector and the dual variable has length B^2/A. In Lemma 1 the
vector after division is mu G nu.

## 2. Theorem 2: evaluation under GRH, and under a zero-free half plane

**Theorem 2 [PROVED-cond; the gcd, ray-class and Mellin bookkeeping is written in outline].** Let the rows be the
unmarked or marked theta rows (column length N = Z P, weights w(c) = q_c^{-1/2} times a smooth profile at scale N).
(a) Assume GRH for all Hecke L-functions L(s, eta theta chi_.(y)^{-1}) of Q(omega), theta in the fixed finite ray
family, y != 0 in O. Then for every eps > 0

    Sum_m g_X(m) |B_m|^2 = X D + O_eps(N^{1+eps}),      D = Sum_c |a_c|^2 phi(c)/q_c  (of size about 1).

(b) Assume only that these L-functions have no zero in Re s > beta*. Then the error is O(N^{2 beta* + eps}).
Consequences: (E-K) holds for X >= N under (a) and for X >= N^{2 beta*} under (b). For X < N the bound under (a)
is N^{1+eps}: loss exponent 1 + l - M, to be compared with the K-loss M + l - 1 of the reflected rows (equal at
M = 1).

Proof outline. In the display of Corollary 1 move the u-contour to Re u = -1/2 + Re s + eps under (a)
(Re u = beta* - 1 + Re s + eps under (b)); 1/L is O((q_y (1 + |t|))^eps) there (CLASSICAL, Littlewood's bound on a
zero-free half plane), V~ decays faster than any power for the Gaussian-log profile. So
|M_y(s)| << (Z/(q_g q_e))^{-1/2 + Re s + eps} q_y^eps. For q_k <= K_g := q_d q_e^2 (Z/(q_g q_e))^2 / X take Re s = eps, for
larger q_k take Re s = A; the k-sum contributes K_g^{1+eps} (Z/(q_g q_e))^{-1+eps} = q_d q_e Z^{1+eps} /(q_g X). With the
weights 1/(q_g q_d q_e^2) the sum over g, d, e is O(Z^{1+eps}/X) and the factor X in front gives N^{1+eps}. With marks,
M_y is a prime sum over the slot (square-root cancellation under (a)) times a Moebius sum at scale Z; the count
is the same with N in place of Z. QED (outline)

Scope of the hypothesis. The family contains y = 1: L(s, eta theta), the target and its fixed ray twists. In the
Prop. 2.1 format the low estimate has to hold for the target whose zero is being excluded. So (a) cannot be an
input, and (b) is admissible only with beta* a zero-free abscissa already known for the whole twist family
(relative to MS: 7/8). With (b) and beta* = 7/8 the loss exponent of the mean square is
max(0, (7/4)(1 + l) - M).

**Unconditional statement [PROVED-rel MS Lemma 9.1 for the squarefree part; ARGUED for the rest].** The sextic
large sieve K + N + (K N)^{2/3} applied to the Moebius vector gives Sum_{k squarefree, q_k <= K} |M_k|^2 << N^{-1+eps}
(K + N + (K N)^{2/3}), which is O(N^eps) for K <= N^{1/2}, that is X >= N^{3/2}. It does not cover (i) the
frequencies with small sixth-power-free part (multiplicity up to K^{1/6}, section 3), which need a pointwise bound
for M_1 and so a zero-free region for the target family, nor (ii) the frequencies with a large powerful part
(mixed characters chi_{k_1} chi_{k_2}^2 ...), for which freezing the powerful part costs a power of K. So no
unconditional range for (E-K) at the Q^{1+eps} level is claimed.

## 3. The candidate excess

For k = a^6 one has chi_c(k) = 1_{(a, c) = 1}, so M_{a^6} = M_1 with a coprimality condition. More generally for
k = t a^6, t in the finite set of elements for which c -> chi_c(t) is trivial on the support or factors through the
square classes modulo 4, the sums M_k are the class components of M_1. The number of such k with q_k <= K is
about c K^{1/6}. Their contribution to X Sum_k F_k is

    X * #{a : q_a^6 <~ K} * H(M_1),      H(f) = Sum_{x, y} R(x, y) f(x) conj(f(y)) (with the class character chi_.(-1) on y),

x, y running over the four square classes modulo 4 and f(x) the part of M_1 on the class x. The matrix
R(x, y) = (-1)^{eh + fg + fh} is a symmetric Hadamard matrix with trace 0: eigenvalues +2, +2, -2, -2. So H is
indefinite of signature (2, 2) [PROVED for the matrix; ARGUED that no further cancellation occurs between the
frequencies]. M_1 is the smooth partial sum of 1/L(1 + s, eta theta), of size Z^{beta - 1} if a member has a zero of
real part beta, and of size 1 if the reciprocal has a pole at 1.

Consequences.
- A zero of real part beta of a member of the target's ray family gives a term of size X K^{1/6} Z^{2 beta - 2}, with a
  sign depending on the class character. It exceeds the diagonal X only if beta > 1 - kappa_K/12,
  kappa_K = log K / log Z = 2(1 + l) - M (for X >= N). Relative to the 7/8 region this term is harmless whenever
  kappa_K <= 3/2; at the vertex (0, 4/3, 1/3), kappa_K = 4/3.
- The general frequencies need the mean value
  (MV6)  Sum_{k sixth-power-free, q_k <= K} (K/q_k)^{1/6} |M_k|^2 << N^eps,
  a density-type statement for the order-6 family in the conductor aspect. If the family has a zero-density bound
  N(sigma) << K^{A(1 - sigma)}, (MV6) follows for K^A <= N^2 [ARGUED]; A = 2 is the density hypothesis for the family
  and gives the full range K <= N.
- Sign twists. For a target whose reciprocal has a pole at 1 (Liouville twist), M_1 has size 1 and the excess is
  X K^{1/6}: exponent kappa_K/6 in the mean square. This is the aligned coherent term of c7 Lemma A seen on the row
  side. So a low estimate that does not see the phases of the target cannot be better than Z^{M + kappa_K/6}.

## 4. Decisive test (MEASURED)

Tools: `zomega.py` (copied from `tmp/sextic`, unchanged), the squarefree tables `tmp/sextic/data/sf_1e6.npz` and
`sf_1e7.npz` read as data, `ek_common.py`, `t2_moment.py`. Rows: all m != 0 in Z[omega] with q_m <= 2.5 X_max.
Columns: squarefree primary c prime to 6 with q_c <= 12 Z (times 2P with a slot), profile
V(y) = exp(-(log y)^2), cube parts n with q_n^3 <= 12 Z in the unmarked runs, nu = 1. Marked runs: one slot
(P, 2P) with window sin^2, column weight Sum_{pi | c, slot} W(q_pi/P) V(q_c/(Z q_pi)).
ratio(X) = Sum_m g_X(m) |B_m|^2 / Sum_m g_X(m) DIAG_m, with DIAG_m the exact mean of |B_m|^2 over independent
random column phases (it includes the coprimality zeros and the cube parts). (E-K) is "ratio = O(Z^eps)".

Vectors: THETA (tau_c = gamma_2 conj(alpha)); THETA*G (the corrected row, factor G(c n^3)); LIOU (tau mu);
LIOU*G; ALIGNED (conj(gamma_1) = tau mu conj(G): dual coefficient 1); THIN (tau eps, eps the thin sign twist of
the map with b = 0.9, also b = 0.97); THIN*ALIGN (dual coefficient mu eps); U (tau times a random completely
multiplicative unimodular function); GAMMA2 (gamma_2 without conj(alpha): the Dunn-Radziwill vector); RAND1, RAND2
(independent random phases).

Unmarked rows (N = Z, columns 1696 / 6767 / 27096, rows up to 1.16e6), probe symbol j = 1:

| Z | X/N range | THETA | THETA*G | RAND1, RAND2 | U | LIOU (X = N) | LIOU*G (X = N) | ALIGNED (X = N) |
|---|---|---|---|---|---|---|---|---|
| 500 | 1/8 .. 16 | 0.998 .. 1.098 | 0.882 .. 1.000 | 0.894 .. 1.020 | 0.997 .. 1.131 | 0.975 | 1.103 | 1.240 |
| 2000 | 1/8 .. 16 | 0.958 .. 1.013 | 0.894 .. 0.999 | 0.984 .. 1.048 | 0.993 .. 1.041 | 1.203 | 1.274 | 1.406 |
| 8000 | 1/8 .. 16 | 0.966 .. 0.998 | 0.945 .. 0.997 | 0.995 .. 1.020 | 1.002 .. 1.028 | 1.377 | 1.420 | 1.628 |

For X >= N (the range of Theorem 2) THETA lies in 0.995 .. 1.014 and THETA*G in 0.981 .. 0.999 at all three sizes.
The largest deviations are at X = N/8 (228 to 3624 rows in the top shell) and are of the size of RAND there.
ALIGNED excess at X = N: 0.24, 0.41, 0.63 for K = 500, 2000, 8000; the number of a (up to units) with q_a^6 <= K
is 1, 2, 3 (q_a = 1, 3, 4). The excess follows the count of sixth powers, as section 3 states.
LIOU takes values on both sides of 1 (0.935 at Z = 500, X = 4N; 1.377 at Z = 8000, X = N): the form is indefinite.
THIN (b = 0.9): 0.984 .. 1.001 at Z = 2000, 0.968 .. 1.010 at Z = 8000 (up to 1.158 at Z = 500, X = N/8); b = 0.97,
Z = 2000: 0.986 .. 1.056. THIN*ALIGN: 0.984 .. 1.034. A thin twist with a zero at b gives an excess
of relative size K^{1/6} Z^{2b - 2} / |zeta_F(b) W(b)|^2, below the resolution of the screen at these sizes.

Marked rows (one slot; the window Z/P < X < Z P is X/N in (P^{-2}, 1)):

| Z, P | slot primes | live columns | X/N range | THETA | THETA*G | RAND1, RAND2 |
|---|---|---|---|---|---|---|
| 300, 40 | 10 | 10863 | 1/32 .. 4 | 0.938 .. 0.991 | 0.934 .. 1.003 | 0.978 .. 1.013 |
| 1000, 10 | 4 | 13486 | 1/32 .. 8 | 1.000 .. 1.037 | 0.949 .. 1.000 | 0.966 .. 1.037 |
| 2000, 12.6 | 5 | 36197 | 1/32 .. 4 | 0.954 .. 0.996 | 0.964 .. 0.997 | 0.970 .. 1.003 |
| 4000, 16 | 5 | 72933 | 1/32 .. 2 | 0.995 .. 1.007 | 0.935 .. 1.001 | 0.980 .. 1.000 |

No excess for the theta vector inside the window at these sizes. The slots hold at most ten primes; this is a
screen of the window, not evidence of an exponent.

Dunn-Radziwill configuration (row symbol chi^4, the conjugate cubic symbol; `t2_Z*_j4.log`):

| Z | GAMMA2 at X = N/8, N, 4N | THETA (with conj(alpha)) at X = N | RAND |
|---|---|---|---|
| 500 | 7.11, 4.31, 3.23 | 0.557 | 0.82 .. 1.03 |
| 2000 | 11.84, 6.61, 4.73 | 0.557 | 0.92 .. 1.02 |
| 8000 | 19.21, 10.30, 7.05 | 0.564 | 0.99 .. 1.00 |

GAMMA2 grows as Z^{0.31} to Z^{0.32} at fixed X/N and falls as X^{-0.29} at fixed Z: the (Z^2/X)^{1/3} of the Patterson main
term. With conj(alpha) the same rows show a deficit (ratio 0.28 to 0.81, a function of X/N only), not an excess:
the angular factor removes the main term (Prop. 5.1, entire). With the probe's symbol (j = 1) GAMMA2 is 1.00 to
1.07 for X >= N and rises to 1.3 to 1.5 at X = N/8, consistent with the rows m = r^4, on which the sextic symbol
is the conjugate cubic symbol.

Outcome of the test: it does not kill the idea. It kills the alternative "the theta vector is near a top singular
vector of the row operator".

## 5. Dunn-Radziwill, read against the probe

Source: A. Dunn, M. Radziwill, "Bias in cubic Gauss sums: Patterson's conjecture", arXiv:2109.07463 (`dl/dr.pdf`,
`dl/dr.txt`). Read: section 1.4 (statement of the cubic large sieve (1.11), Theorem 1.4, Remark 1.1, the paragraph
on the example, (1.13)), section 9 to the statement of Proposition 9.2 (Theorem 9.1, (9.2), Lemma 9.1, proof of
Theorem 1.4 with (9.3)-(9.5), Proposition 9.1). Not read: the proofs of Propositions 8.1, 9.1, 9.2.

What it states. Theorem 1.4 (lower bounds conditional on GRH for Hecke L-functions over Q(omega)): the operator norm
B(A, B) of the cubic-symbol matrix (rows a squarefree, A < N(a) <= 2A; columns b squarefree, B < N(b) <= 2B) satisfies
(AB)^{2/3} << B(A, B) for A in [sqrt B, B^2] (with (AB)^{2/3 - 3 eps} near A = B). The extremal sequence is
beta_b = g~(b) W(N(b)/B) (9.3). Mechanism (9.4): g~(b) (b/a)_3 = g~(ab)/g~(a) up to fixed factors, and
Sum_b W(N(b)/B) g~(ab) has the main term B^{5/6}/A^{1/6} from the pole of the cubic Gauss-sum series (Voronoi,
Proposition 8.1). "Any sequence of the form beta_b g~(b) with beta_b non-negative and not correlated with cubic
symbols would provide a counterexample."

Decision. The extremal vectors are theta-type vectors: the cubic Gauss sums, which are the unimodular part of the
cubic theta coefficients. They are not the configuration of the probe, for two independent reasons.
1. Row symbol. The probe's rows carry chi_c(m), the sextic symbol to the first power. gamma_2(c) chi_c(m)^j is a
   cubic Gauss sum with shifted argument only for even j. For j = 1,
   gamma_2(c) conj(alpha(c)) chi_c(m) = mu(c) G(c) conj(gt_1(m, c)): a Moebius-twisted conjugate sextic Gauss sum,
   which has no Kubota-Patterson series. (`c7-ff-order2-vertex-exact` found the same identification in the
   F_q[T] model.) On the rows m = r^4 the symbol is cubic; these are Q^{1/4} rows out of Q.
2. Angular factor. The probe's coefficient is gamma_2(c) conj(alpha(c)). The Patterson pole comes from the constant
   term of theta and occurs for the trivial angular character only; MS Prop. 5.1 states that T(s, Psi) is entire for
   every local type, j_p = 4 included [PROVED-rel MS Prop. 5.1, proof not replayed; MEASURED: deficit instead of
   excess in the j = 4 run].
So the sharpness theorem does not make (E-K) false. It does bound what can be proved: by (9.2) and Theorem 1.4 no
operator bound for cubic symbols is better than (AB)^{2/3}, and an optimal bound for the order-6 family as an
operator bound is excluded in the same way (ARGUED: the cubic members k = r^2 of the family, with the vector
gamma_2). (MV6) therefore has to use the Moebius vector, as (E-K) had to use the theta vector.

## 6. Consequences for the estimate system (EXACT LP on MODEL inputs)

`lp_pm.py`, `lp_pm2.py` (the solver of c7 `cap_lp.py` with three added low branches; r = 6, floor-class high side
H0; regression 13/15 CONFIRMED):

| low branch | status of the branch | source geometry | free geometry |
|---|---|---|---|
| D: loss 1 + l - M | Theorem 2 (a), family GRH; circular | 5/6 at (1, 1, 1) | no floor (0.25 = search bound at h = 4.5; 0.792, 0.75, 0.667, 0.583 at box 3/2, 2, 3, 4) |
| E: loss (7/4)(1 + l) - M | Theorem 2 (b) with beta* = 7/8, pointwise | 0.976, 0.964, 0.952, 0.929, 0.905 at box 1, 3/2, 2, 3, 4; 5/6 at (7, 7, 7) | same up to box 4; 13/16 at box 8 |
| S: loss (2 + 2l - M)/3 | frozen powerful part (ARGUED) | 1 with G kept | 1 with G kept |

Reading.
- With D the system is the "k = 0" system on M >= 1 + l. In free geometry it has no floor. Under family GRH the
  low branch is a theorem, and a system of true inequalities cannot return a value below 1/2. So at least one of
  the other MODEL inputs is false in that region: the signal exponent (S) at lx < l, the floor class H0 at h > 1, or
  the Gram term G of the additive factor. The deletion of the K-loss is not the false input there. This narrows
  the list in c7 section 3(b).
- With E, the only non-circular form, nothing below 13/15 appears in a box of side <= 4. The values below 13/15
  (5/6 at (7, 7, 7); 13/16 at box 8) need X, Y, P >= Z^7 and are outside any range in which the transcribed
  inequalities have a source.
- The 7/9 vertex of c7 at (0, 4/3, 1/3) has M = 1 + l: it sits on the edge X = N of the range of Theorem 2, where
  the statement needed is (MV6) at K = N together with the 7/8 region for the sixth-power term (kappa_K = 4/3 <= 3/2).
  The 31/36 vertex at (1/2, 1/2, 1/3) has X = Z < N = Z^{4/3}: inside the window, where Theorem 2 gives the loss
  1 + l - M = 1/3, equal to the K-loss. Lemma 1 buys nothing there.

## 7. Controls

No statement about zeros is made, so nothing has to fail. What each control does to (E-K):

| control | Lemma 1 | (E-K) | reason |
|---|---|---|---|
| Liouville twist (target eta lambda) | holds | fails, excess X K^{1/6} | mu lambda = 1 on squarefree c: M_1 has size 1 (pole of the reciprocal). MEASURED +38% (LIOU), +42% (LIOU*G), +63% (ALIGNED) at Z = 8000 |
| U, generic | holds | holds | M_k are sums of random phases. MEASURED 0.993 .. 1.041 |
| U, aligned (twist mu conj(G)) | holds | fails | same as Liouville with the ray phase removed |
| THIN (zero at b) | holds | fails iff b > 1 - kappa_K/12 in a positive class [ARGUED]; below resolution at b = 0.9, 0.97 | M_1 has size Z^{b-1}/|zeta_F(b) W(b)| |
| DH (finite combination) | holds term by term | by linearity, as its members | low side is linear |
| random column phases | holds | holds | off-diagonal has mean zero |
| backward heat, T-NR, Beurling, phase-rotated transfer operator, theta^w, zeta(s+a) zeta(s-a) | not applicable | | no positivity or zero statement; for E_a every exponent shifts by a |

Which step uses periodicity of the theta coefficients: none in Lemma 1 and Theorem 2. They use periodicity of
the row symbol in m (lattice translation in the row variable, Poisson uniform in the modulus c c') and the Gauss-sum
identity (4.7). The reflected representation (MS Prop. 5.1, Lemma 5.8) is the one that uses L-periodicity of
phi(x) = chi_x(lambda)^2 Psi_0(x), that is periodicity of the target-twisted coefficients; it is not available for
THIN, and Lemma 1 is. So for THIN the row mean square is still governed by Lemma 1, and it is controlled by the
zero of the thin twist.

Unlike the cap of c7 (target-independent), (E-K) is target-dependent: its truth is read off the reciprocals of the
target's twist family near s = 1.

## 8. Three weakest steps

1. **Theorem 2 is conditional and its bookkeeping is in outline.** The exact part (Lemma 1) is checked to 1e-9.
   The passage to M_k (ray-class expansion of G and R, the gcd sums over g, d, e, the Mellin separation of the
   Gaussian, uniformity of the 1/L bound in the conductor of chi_.(k g^2 d^5), the slot prime sum) was written once
   and not replayed line by line; the marked case is by analogy. The hypothesis includes the target, so the theorem
   decides the truth value of (E-K) under GRH and gives no input to a zero-free argument. The signature (2, 2) and
   "no further cancellation between sixth-power frequencies" in section 3 are ARGUED; the only numerical support is
   the two-sided behaviour of LIOU and the count 1 : 2 : 3 in ALIGNED.
2. **The window Z/P < X < Z P is open.** Neither representation proves (E-K) there, also not under GRH. The
   screen covers it only with slots of 4 to 10 primes, sizes N <= 6.4e4, float arithmetic, one profile V narrower
   than the manuscript's Gaussian, nu = 1, S = {2, 3}, no xi(m) mask, one slot instead of a slot system. A ratio
   of 1.00 +- 0.04 at these sizes does not exclude a small positive exponent or a power of log. The 31/36 vertex
   lies in this window.
3. **Transcription and literature.** B_m is the c7 / c5 transcription; the bars on alpha are restored from Prop. 5.1
   and from the table check, not from the PDF. The statements about MS Lemma 5.8 / 15.1 (reflection lossless for
   X P <= Z) and Prop. 5.1 (entire) are read, not replayed. Of Dunn-Radziwill only sections 1.4 and 9 (statements
   and the proof of Theorem 1.4) were read; "an optimal operator bound for the order-6 family is excluded" is
   ARGUED from the cubic members, not proved. The LP rows are MODEL: D, E, S are new branches inserted into the c7
   system with its H0 high side only.

## 9. Self-check (not a referee pass)

- Lemma 1 was derived by hand twice (coprime case, then with a common factor) and then tested; the first test of
  the pair formula failed by exactly 1 on the pair c = c' = 1 (the term m = 0), which fixed the statement.
- The first marked run was killed by the memory cap (prime tables for all primes up to the column bound, 9 GB);
  the table is now restricted to moduli whose largest prime factor is at most max(12 Z, 2P). A run at Z = 32000
  was stopped by its own pid for the same reason before producing output; no result from it is used.
- The j = 4 run is a positive control of the code: it finds the Dunn-Radziwill growth with the right exponent, so
  the absence of growth for the probe is not an artifact of the normalisation.
- Not checked: Theorem 2 against a direct computation of M_k at full size; the LP branches against a second solver.

## 10. Proposed map row (not applied)

| Z15d | (E-K): mean square of the completed cubic-theta rows for the theta vector | Exact unfolding (Poisson in the row variable, then gamma_1 gamma_2 = mu alpha G): Sum_m g_X(m) abs(B_m)^2 = X D + X Sum_{k != 0} F_k, F_k bilinear in smooth partial sums M_k of 1/L(1, eta theta chi_k^{-1}) over the order-6 twist family, q_k up to N^2/X. Under GRH for that family the error is N^{1+eps}: (E-K) holds for X >= N = Z P; for X < N the loss is Z^{1+l-M}. Excess term: X K^{1/6} H(M_1), H of signature (2, 2), M_1 the partial sum of the target's own reciprocal; a zero of real part beta matters iff beta > 1 - (2+2l-M)/12; a pole (Liouville twist) gives X K^{1/6}. The Dunn-Radziwill extremal vector (cubic Gauss sums against cubic symbols) is not the probe's configuration (sextic symbol j = 1; angular factor conj(alpha), Prop. 5.1 entire). Window Z/P < X < Z P open. Non-circular use (7/8 pointwise) buys nothing below 13/15 in boxes of side <= 4. | Lemma 1 PROVED (checked 1e-9); Theorem 2 PROVED-cond, outline; excess ARGUED; screen MEASURED (theta 0.94 .. 1.04, seven sizes); D-R sections 1.4, 9 opened; unrefereed | Liouville twist and aligned U: (E-K) fails (measured +38% to +63%); generic U, random phases: holds; THIN: governed by its zero, below resolution | `c8-ek-theta-second-moment-formula` |

No pivot taken. No abscissa below 0.874886647 is proved.

Files: `RESULT.md`; `ek_common.py`, `t1_identity.py` (+ log), `t2_moment.py` (+ `t2_*.log`, `t2_*.json`),
`lp_pm.py`, `lp_pm2.py` (+ logs), `zomega.py` (copy), `dl/` (Dunn-Radziwill abstract page, PDF, text).
`LANE_LINE.json`: proposed line for `campaign/lanes.jsonl`; not appended by this lane, because the shared file is
written by the learn step after the referee pass. No REFEREE.md exists yet.
