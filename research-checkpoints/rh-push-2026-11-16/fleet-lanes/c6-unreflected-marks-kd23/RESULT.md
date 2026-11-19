# c6-unreflected-marks-kd23: do unreflected marked theta rows obey K + D or carry (KD)^(2/3) in 1 + l <= M < 2 + 2l

Internal working note, 2026-11-18. Slug `c6-unreflected-marks-kd23`. Kind: deepen. Not refereed. Nothing committed,
pushed or posted. Scope: an ESTIMATE SYSTEM inside the 7/8 architecture (openai/math manuscript
`~/lean-deps/qrh-verify/paper.txt` and follow-ups, unrefereed), in the reduced form of `r3-method-limit`,
`c5-target-fe-order2-ledger` and `c5-marks-circularity-order2`. No statement about zeros of zeta is made. 7/8
(unrefereed) stands. RH open. NO QED.

Labels: PROVED (complete elementary argument here) / CHECKED (finite identity verified by brute force) / MEASURED /
ARGUED (proof outline, exponents complete, analytic bookkeeping not written out) / EXACT (rational LP) / MODEL /
PROVED-rel X / OPEN.

Files (all in this directory): `msq.py`, `msq2.py` (mean-square measurement; stand-alone numpy; `zomega.py` copied
from `tmp/sextic`; tables `tmp/sextic/data/sf_1e6.npz`, `sf_1e7.npz` read as data), `msq_D*.json/.log`,
`msq2_D*.json/.log`, `analyse.py`, `analysis.txt`, `analysis2.txt`, `dual_check.py` + `.log`, `ledger_dirz.py`,
`ledger_dirz2.py`, `ledger_dirz.log`, `tiers_fe_copy.py` (copied unchanged from `c5-target-fe-order2-ledger`).
Local runs through `scripts/memcap.sh 8`. Server: two units through `rhrun`, 4 cores, 8 GB each, GPU not used
(units `rh-c6msq7-1118172538`, 1728 s, and `rh-c6msq7b-1118175504`, 1406 s, peak 3.8 GB; D = 10^7 only); both ended on their own, nothing left running.

## Verdict

**Precise obstruction for the region lx < l, reached through the second outcome of the assignment.**

1. MEASURED. Unreflected theta rows, marked and unmarked, show no (KD)^(2/3) term. With columns up to D = 10^7 and
   rows K = D^e, the ratio rho = (mean square over rows) / (squared norm of the coefficients) is 0.89 to 1.01 (0.84 to 0.98 for marks at D^(1/4)) at
   every tested aspect e in {1, 1.25, 1.5, 1.75, 2} and its exponent in D is within 0.025 of zero at each aspect (within 0.013 for e <= 1.75; standard errors
   0.004 to 0.009). The two
   pole controls measured in the same runs grow with the predicted exponents: cubic rows with cubic Gauss-sum
   weight, excess exponent 0.340 +- 0.005 at e = 1 (prediction 1/3, the (KD)^(2/3) law); sextic rows with sextic
   Gauss-sum weight, 0.153 +- 0.012 (prediction 1/6). The (KD)^(2/3) law would put rho near 10 to 15 at
   K = D = 10^7 (the cubic control has 15.5 there); the theta rows have 0.95 (th), 0.92 (tha), 0.93 (marked).
2. ARGUED + CHECKED (Lemma D, section 2). The reason is exact: the dual coefficients of the theta row are
   gamma_2(c) gamma_1(c) = mu(c) alpha(c) G(c) (Hasse-Davenport, manuscript (4.7); checked numerically), so after
   Poisson summation in the row variable the row energy is
   K ||b||^2 + (K/D) sum over frequencies k of norm up to D^2/K of |M_k(D)|^2, where M_k(D) is a smoothed partial
   sum of the reciprocal of a Hecke L-function of Q(omega). The (KD)^(2/3) term of the general sieve is the
   contribution of the sixth-power frequencies when the dual coefficients do not cancel; here they carry mu.
   Consequences: (a) if every L-function of the family F (section 2) is zero-free in Re s > theta, the row energy
   is << (K + D^(2 theta)) (KD)^eps ||b||^2: K + D under GRH for F, and K alone for M >= 2 theta (1 + l);
   (b) conversely a bound K^(1+eps) at aspect e < 2 forces a zero-free half-plane Re s > 1 - (2 - e)/12 for the
   L-function at the principal frequency, which contains the target character. At e = 1 this is 11/12, the
   Part I value of the manuscript.
3. Identification of the false input (settles referee item E3 of `r3-method-limit` conditionally). Under GRH for
   F, the unreflected K + D input (dir0), the density-hypothesis counts and Lindelof all hold, so by Theorem B of
   `c5-marks-circularity-order2` the system that returns B < 1/2 fails at its remaining input: the uncompensated
   branch of the reduced model (signal formula (S) with h = 1 - lx + l kept, high side H0' = H0 + l/2), which was
   a guess of r3 and was never derived. The sieve is not the false input. Without GRH the same conclusion holds
   in the weaker form "the uncompensated branch, or the density hypothesis, or Lindelof on the classes".
   EXACT (LP): with the conditional sieve of Lemma D at theta = 7/8 in place of dir0 the uncompensated system
   still returns 0.8125, 0.6458, 0.3125 at search bounds 8, 16, 32.
4. Resulting h. With compensation (lx >= l) the K + D input changes no vertex: h <= 1 and the floor 5/6 stand
   (ledger rows S1). Without compensation the model gives h = 1 + (l - lx) with no upper bound and
   B = 1 - h/6, and is inconsistent for h > 3; by item 3 that branch is the false input. So there is no model
   vertex with h > 1 whose unproved inputs are all consistent with GRH. The state "R4 inside the 7/8
   architecture" stays at: no probe with h > 1.

Score criterion of the assignment (model vertex with h > 1 and a named unproved input): not met. The second
outcome holds for the sieve question, and it moves the falsity onto the only other input the h > 1 vertices have.

---

## 0. Plan; relation to closed rows

Read: BRIEF (to the end); STRATEGY section 4.0; OBSTRUCTION_MAP rows Z5, Z12, Z15 and the controls list;
`c5-target-fe-order2-ledger` (all, with `tiers_fe.py`, `tiers_fe2.log`); `r3-method-limit` RESULT sections 1-3 and
REFEREE item E3; `c5-marks-circularity-order2` verdict, Theorem B, sections 5-6 (Conjecture WLS-tall);
`c4-kloss-marks-scaleup` verdict; manuscript (4.7), (5.30), (6.1), (6.2), Lemma 9.1, (12.4), (12.5), 16.1;
`tmp/sextic` scripts (`zomega.py`, `alib.py`, `build_table.py`, `sextic_theta.py`) as text.

Not repeated: the two-scale test of WLS-tall in `c5-marks-circularity-order2` (five scales, Z <= 512, one mark per
column, mark Gram matrix); the K-loss at (M, l) = (1, 1/3) (`c4-kloss-marks-scaleup`).

Different here: (a) sizes: columns to 10^7, rows to 10^14, eight aspect ratios, with two positive controls whose
power laws are known; (b) the mechanism (Lemma D) and its two consequences, a conditional proof of K + D and a
necessary zero-free condition; (c) the false input of the lx < l region is named.

Requirement statements for the plan: R1: Lemma D uses the multiplicative identity gamma_1 gamma_2 = mu alpha G
(a coefficient identity, not a statement about zeros). R2: none, no conclusion about zeros. R3: none; controls
are reported in section 5. R4: none; this lane tests whether a model vertex with h > 1 exists.

## 1. First lemma: the row, its mean square, and what each input assumes

Notation of the ledger (`r3-method-limit` section 1): X = Z^lx, Y = Z^ly, marks of total length l (P = Z^l),
M = lx + ly, Q = XY = Z^M, h = 1 - lx + l. Write K = Z^M (rows) and D = Z^(1+l) (columns), e = M / (1 + l).

Row. Manuscript (5.30), (6.1), (12.5): the marked completed row is
B_m = sum_theta a_theta C_V(Z P; m, nu_sigma theta) with the indicator 1_{p | c n^3} for the mark primes, and

    C_V(X; m, nu) = sum_{c sf, n} gamma_2(c) alpha(c n^3) nu(c n^3) chi_{c n^3}(m) (q_c)^(-1/2) (q_n)^(-1) V(q_c q_n^3 / X).

Reduced product form (n = 1; the form used by n1, n2, c4, c5):

    R_m = sum_{c sf, (c, S) = 1} b_c d(c) chi_c(m),
    b_c = gamma_2(c) alpha(c) nu(c) q_c^(-1/2) V(q_c / D),      d(c) = sum_{p | c, p in the slot} a_p,   a_p = eta(p) W(q_p / P)

(d = 1 for the unmarked row). chi_c(m) is the sextic symbol, gamma_2 the normalised cubic Gauss sum,
alpha(c) = c / |c| on the primary generator, nu a fixed finite ray character (it contains the target eta).

Mean square over the modulus range, and the loss k of the ledger:

    E(K, D) = sum_{q_m ~ K} |R_m|^2,     N = sum_c |b_c d(c)|^2 = Z^o(1),     E(K, D) <= Z^(M + k + eps) N.

Structure of chi_c(m) gamma_2(c) [PROVED, from complete multiplicativity]: gamma_2(c) chi_c(m) =
[gamma_2(c) conj(chi_c(m))^2] chi_c(m)^3, a cubic Gauss sum of index m twisted by the quadratic symbol of m. The
row is not a Kubota series of index m, and for squarefree m it has no theta pole in the data of section 4.

Which bound each input of the reduced system assumes:

| input (name in `tiers_fe.py`) | bound on E(K, D) / N | status |
|---|---|---|
| refl (source low side, Liu II Lemma 2.4) | reflection of the row, then the quadratic large sieve in its optimal form (rows + dual length) on the dual of length Z^T, T = 2M + l - 1; k = max(0, l - T/4, T - M, (3l - 1)/2). No (KD)^(2/3) term occurs. | PROVED-rel manuscript; used for M + l <= 1 |
| dir (manuscript Lemma 9.1) | K + D + (KD)^(2/3); k = max(0, 1 + l - M, (2 + 2l - M)/3) | proved for arbitrary coefficients |
| dir0 | K + D; k = max(0, 1 + l - M) | hypothetical; Conjecture WLS-tall of c5 for M >= 1 + l |
| k0 (r3 "ideal") | K for every geometry | hypothetical; stronger than K + D when M < 1 + l |
| high side (H), counts | density-hypothesis counts U^(1 - delta) of rows u in a class: the strength of an optimal sieve for the counting problem; the manuscript's own counts use Lemma 9.1 with the (KD)^(2/3) term (row Z12) | MODEL |
| vertices with h > 1 (`tiers_fe2.log` Y3, Y4, Y5, Y7) | dir0 or k0 in the range 1 + l <= M < 2 + 2l, together with the uncompensated high side | MODEL |

In the range 1 + l <= M < 2 + 2l the two candidates differ by Z^((2 + 2l - M)/3) = (D^2/K)^(1/3): a power of D
at every aspect e < 2, D^(1/3) at K = D. For M >= 2 + 2l the character sums are complete and K is exact.

## 2. Lemma D: the dual form of the row energy

**Step 1 [PROVED, CHECKED].** For coprime squarefree primary c, c' and k coprime to c c',

    (q_c q_c')^(-1/2) sum_{v mod c c'} chi_c(v) conj(chi_c'(v)) e(k v / (c c'))
        = eps(c, c') gamma_1(c) conj(gamma_1(c')) conj(chi_c(k)) chi_c'(k),
    eps(c, c') = chi_c(c') conj(chi_c'(c)) chi_c'(-1) in {+1, -1},

and the sum vanishes when (k, c c') != 1. Proof: Chinese remainder theorem (v = v_1 c' + v_2 c) and primitivity of
chi_c at every prime of c; eps = +-1 by sextic reciprocity (manuscript Lemma 4.4), a function of the classes of
c, c' mod 4. Brute-force check: `dual_check.log`, 230 triples (c, c', k), maximal deviation 2.8e-13, eps = +-1 in
every case.

**Step 2 [PROVED-rel manuscript (4.7); CHECKED].** gamma_2(c)^3 = mu(c) alpha(c) and
gamma_1(c) gamma_2(c) = mu(c) alpha(c) G(c), G(c) = chi_c(4) gamma_3(c), |G| = 1, G a finite ray character times
a square-class sign. Checked on the first 20000 nodes of `sf_1e6.npz` (deviation 3e-9; G / gamma_3 takes three
values, the cube roots of unity) and by brute force on 10 moduli (1e-14). So

    b_c gamma_1(c) = mu(c) alpha(c)^2 G(c) nu(c) q_c^(-1/2) V(q_c / D):

the dual coefficient of the theta row is the Moebius function times a Hecke character of Q(omega).

**Step 3 [ARGUED; Heath-Brown's Poisson step for power-residue sieves].** Open the square in E(K, D) with a smooth
row weight Omega(q_m / K), split c, c' into classes mod 4, and apply Poisson summation over m in O to the pairs
c != c' (modulus c c', dual length q_c q_c' / K <= D^2 / K; the zero frequency vanishes because chi_c conj(chi_c')
is non-principal). With Step 1:

    E(K, D) = K Omega^(0) sum_c |b_c d(c)|^2 kappa(c)
              + (K / D) sum_{sigma, sigma'} eps(sigma, sigma') sum_{k != 0} Omega^(q_k K / D^2 ...) M_{k, sigma}(D) conj(M_{k, sigma'}(D)) + (pairs with a common factor),

    M_{k, sigma}(D) = sum_{c in sigma} mu(c) alpha(c)^2 G(c) nu(c) d(c) conj(chi_c(k)) q_c^(-1/2) V~(q_c / D)

(kappa(c) = proportion of rows coprime to c; V~ a smooth weight obtained by separating variables with a Mellin
transform; q_c^(-1) from b_c gamma_1 q_c^(-1/2) is written as D^(-1/2) q_c^(-1/2) up to the weight). Pairs with
common factor g = (c, c') give the same form with D replaced by D / q_g, weight q_g^(-1), and one more character
of conductor dividing g (manuscript line 7701: gamma_2(ab) = gamma_2(a) gamma_2(b) chi_b(a)^4); they sum.
Not written out: the smooth-weight bookkeeping, the cube completion n != 1 of (5.30), and uniformity in the
separation variable. The same formula is stated in `c5-marks-circularity-order2` section 5 without Step 2.

**Step 4 [classical].** For fixed k, c -> conj(chi_c(k)) is a Hecke character of conductor dividing 36 q_k (sextic
reciprocity), so M_k(D) = (1/2 pi i) Int V^(s) D^s F_k(s) / L(s + 1/2, xi_k) ds with xi_k = alpha^2 G nu conj(chi_.(k))
and F_k a finite Euler correction (for the marked row, times the prime polynomial sum_p a_p xi_k(p) q_p^(-s-1/2) and
a local factor). Family: **F = { alpha^2 G nu conj(chi_.(k)) : k in O, k != 0 }** and its twists by characters of
conductor dividing a mark or a common factor. The sixth-power frequencies k = a^6 give the single character
xi_1 = alpha^2 G nu, which contains the target eta.

**Lemma D [ARGUED on Steps 3-4; Steps 1-2 PROVED/CHECKED].**
(a) Sufficiency. If every L(s, xi), xi in F, is zero-free in Re s > theta (1/2 <= theta <= 1), then
|M_k(D)| << (D q_k)^eps D^(theta - 1/2) and

    E(K, D) << (KD)^eps ( K + D^(2 theta) ) N.

(K / D times D^2 / K frequencies times D^(2 theta - 1).) For theta = 1/2 (GRH for F): E << (K + D)(KD)^eps N, the
optimal form, for marked and unmarked rows with a_p as in the manuscript (under GRH the mark polynomial is
<< (P q_k (1 + |t|))^eps on the line; for arbitrary |a_p| <= 1 it is not, and the statement is not claimed).
In ledger units: k <= max(0, 1 + l - M, 2 theta (1 + l) - M) =: dirZ(theta); k = 0 for e >= 2 theta.
(b) Necessity. Take Omega with Omega^ >= 0 and one class sigma with eps(sigma, sigma) = +1. Then every dual term
is non-negative and the sixth-power frequencies alone give

    E(K, D) >= c (K / D) (D^2 / K)^(1/6) |M_1(D)|^2 - (lower-order terms),

so E << K^(1 + eps) N for all large D at a fixed aspect e < 2 implies M_1(D) << D^(1/2 - (2 - e)/12 + eps), hence
L(s, xi_1) != 0 for Re s > 1 - (2 - e)/12. At e = 1: 11/12; as e -> 2: no condition.
(c) Where the general term comes from. For arbitrary coefficients a_c the same steps give the sixth-power
frequency term (K / D)(D^2 / K)^(1/6) |sum_c a_c gamma_1(c)|^2 <= K^(5/6) D^(1/3) N for sextic rows and, for
cubic rows, (K / D)(D^2 / K)^(1/3) D N = (KD)^(2/3) N, attained by a_c = conj(cubic Gauss sum): the
Dunn-Radziwill extremal vector (RECALLED) is the vector whose dual coefficients are all 1. Both laws are measured
in section 4 (controls c2c and s1c).

What is proved without hypothesis by this route: nothing beyond Lemma 9.1 in the stated range. With Lemma 9.1
applied to the squarefree dual frequencies the bulk is K + K^(1/3) D (so K for M >= (3/2)(1 + l)), but the
frequencies u a^6 with small u need a power saving in the individual sums M_u(D), i.e. a zero-free strip for F.
Relative to a zero-free half-plane 7/8 for every member of F (the manuscript's claim is for the supremum over
primitive targets; whether F is inside that family was not checked): k = 0 for M >= (7/4)(1 + l).

## 3. Consequence for the ledger: which input is false at lx < l

`tiers_fe2.log` Y3/Y4: geometry lx <= l, no compensation on the high side, dir0, polar G: B = 0.4653 (box 8),
0.25 (box 16). Theorem B of `c5-marks-circularity-order2` [PROVED-rel (S), (H), Prop. 2.1]: a low estimate with
B_low < 1/2 at a geometry where the high rows hold is false there, or (S)/(H) are not valid there.

**Proposition E [relative to Lemma D and to Theorem B of c5; conditional on GRH for F and for the row family].**
On the cone (lx, ly, l) = (t, t, t + 2 + d), t > 5 + 2d, d > 0:
(i) G = 0 (b = 0; manuscript Lemma 6.2, planar large sieve) and k = 0 (Lemma D(a) with theta = 1/2, since
M = 2t >= t + 3 + d = 1 + l) hold, so |I| << Z^(lx/2 + eps) by Cauchy-Schwarz in (6.2);
(ii) the density-hypothesis counts and Lindelof on the classes hold (GRH);
(iii) hence the uncompensated branch of the reduced model, that is the pair "(S) with h = 1 - lx + l" and
"H0' = H0 + l/2", is not valid there: otherwise Theorem B gives a zero-free region to the left of 1/2.
Branch (2) of the dichotomy of c5 section 5 holds; branch (1) (failure of WLS-tall) does not.

Without GRH: at least one of {uncompensated branch, density hypothesis, Lindelof on the classes, GRH for F} fails
on the cone. The measurements of section 4 bear on the last item only through the sieve itself (flat to 10^7).

Why the branch is the natural suspect [reading, not a derivation]. Manuscript after (12.5): "The subtraction is
designed to cancel the scalar prime contribution on the high side, leaving the sextic-character prime factor
used by the moment estimates"; (16.1): the local multiplier of the two-term operation is
Q^(z-1) (eta(p) Q^x P_p*/P_p - Q^(-w)). Without the subtraction the scalar term stays in every row of the high
side and the prime moment estimates do not apply to it. r3 modelled this by deleting the saving l/2 and keeping
(S) unchanged; neither statement was derived. Which of the two fails was not located here.

LP with the conditional sieve in place of dir0 (`ledger_dirz.log`; `tiers_fe_copy.py` unchanged, one branch
added; EXACT bisection, MODEL inputs):

| run | theta = 1/2 | 5/8 | 3/4 | 7/8 | 1 |
|---|---|---|---|---|---|
| lx <= l, no compensation, G polar, box 8 | 0.4653 (h = 3.21) | 0.4653 | 0.6250 (h = 2.25) | 0.8125 (h = 1.125) | 1 |
| same, box 16 | 0.25 (search bound) | 0.25 | 0.2917 (h = 4.25) | 0.6458 (h = 2.125) | 1 |
| same, box 32 | 0.25 | - | 0.25 | 0.3125 (h = 4.125) | - |
| source geometry (lx, ly >= l, compensated), G polar | 5/6 at (1, 1, 1) | - | 5/6 at (3, 3, 3) | 5/6 at (7, 7, 7) | 1 |
| source geometry, dir (Lemma 9.1) | 1 | | | | |

Reading: (1) the inconsistency of the uncompensated branch does not depend on the optimal sieve: it is reached
with the sieve that follows from a zero-free half-plane 7/8 for F, at larger geometry (t >= 7h on the ray
(t, t, t + h - 1)). (2) With compensation the unreflected branch reaches the floor 5/6 at h = 1 and nothing
below, for every theta < 1: K + D in the range does not move the floor of row Z15.

**The resulting h.** Compensated: h = 1 - (lx - l) <= 1, B >= 5/6. Uncompensated model: h = 1 + (l - lx),
unbounded, B = 1 - h/6 on lx = ly (4/5 at (7/5, 7/5, 8/5), 1/2 at (5, 5, 7), as in c5 section 6), false for h > 3
under GRH by Proposition E, and underived for 1 < h <= 3.

## 4. Decisive test: measurement

Definition (`msq.py`). Columns: squarefree primary c coprime to 6 with q_c <= D (tables of `tmp/sextic`,
truncated). Coefficients a_c = v_c sin^2(pi q_c / D) q_c^(-1/2). Rows: m in O, K < q_m <= 2K, (m, 6) = 1,
uniform random sample (2000 rows for D <= 10^6, 1500 for D >= 3 10^6; exhaustive when the annulus is small).
S(m) = sum_c a_c chi_c(m)^j (j = 1 sextic symbol, j = 2 cubic symbol), exact integer symbols, complex64 sums.
rho(K, D) = mean_m |S(m)|^2 / sum_c |a_c|^2. A row-independent vector of random phases has rho = the proportion
of coprime pairs, about 0.93 to 0.95. K = D^e. Laws: K + D gives rho <= C (1 + D/K) (exponent 0 in D for
e >= 1); (KD)^(2/3) gives rho of order (D^2/K)^(1/3), exponent (2 - e)/3.

Weights v_c:

| name | v_c, symbol | role |
|---|---|---|
| th | gamma_2(c), chi_c(m) | theta row, unmarked, without the angular factor |
| tha, thA | gamma_2 conj(alpha), gamma_2 alpha, chi_c(m) | theta row with the angular factor of (5.30), both conventions |
| thm4, tham4, thAm4 | the same times omega_P(c) = number of mark primes dividing c, slot (D^(1/4), 2 D^(1/4)] | marked row, a_p = 1, l = 1/3 |
| thm2, tham2 | marks in (D^(1/2)/2, D^(1/2)] | marked row, l = 1 |
| thr, thar | marks with a random sign per mark | marked row, random a_p |
| thc | conj(gamma_2), chi_c(m) | theta row with the conjugate symbol (not the manuscript row) |
| s1c | conj(gamma_1), chi_c(m) | sextic pole control: row = conj of the index-m sextic Kubota sum; predicted excess (D^2/K)^(1/6) |
| c2c | conj(gamma_2), chi_c(m)^2 | cubic pole control (Dunn-Radziwill vector): predicted excess (D^2/K)^(1/3) = the (KD)^(2/3) term |
| c2, s1 | gamma_2 with chi^2; gamma_1 with chi | vanishing-residue controls (index m^2, m^5) |
| one, mu, mua2 | 1, mu(c), mu alpha^2 | weight 1; the dual coefficients of the theta row |
| rnd, rsg, crnd | random phase, random sign (sextic), random phase (cubic) | random rows |
| onem4, rsgm4 | marks with weight 1 and random sign | marked controls |

Class split: the same with c restricted to each class mod 4, energies added (a coherent term loses up to a
factor 12 there; exponents are unaffected). Structured row families m = j^2, j^3, j^4 measured separately.

### 4.1 Theta rows, generic rows: rho(K = D^e, D)

Set 1 (`msq_D*.json`):

| weight | D | e = 1.0 | e = 1.25 | e = 1.5 | e = 1.75 | e = 2.0 |
|---|---|---|---|---|---|---|
| th | 1e+04 | 0.908 | 0.956 | 0.948 | 0.929 | 0.955 |
| th | 3e+04 | 0.899 | 0.931 | 0.945 | 0.952 | 0.959 |
| th | 1e+05 | 0.966 | 0.951 | 0.956 | 0.940 | 0.925 |
| th | 3e+05 | 0.939 | 0.959 | 0.921 | 0.983 | 0.956 |
| th | 1e+06 | 0.986 | 0.941 | 0.906 | 0.918 | 0.937 |
| th | 3e+06 | 0.918 | 0.909 | 0.946 | 0.982 | 0.951 |
| th | 1e+07 | 0.953 | 0.944 | 0.959 | 0.938 | 0.983 |
| thm4 | 1e+04 | 0.836 | 0.889 | 0.860 | 0.869 | 0.863 |
| thm4 | 3e+04 | 0.902 | 0.929 | 0.893 | 0.924 | 0.873 |
| thm4 | 1e+05 | 0.891 | 0.901 | 0.911 | 0.915 | 0.907 |
| thm4 | 3e+05 | 0.888 | 0.907 | 0.887 | 0.905 | 0.936 |
| thm4 | 1e+06 | 0.903 | 0.902 | 0.919 | 0.891 | 0.908 |
| thm4 | 3e+06 | 0.919 | 0.947 | 0.942 | 0.939 | 0.912 |
| thm4 | 1e+07 | 0.930 | 0.961 | 0.946 | 0.917 | 0.906 |
| thm2 | 1e+04 | 0.897 | 0.942 | 0.927 | 0.933 | 0.904 |
| thm2 | 3e+04 | 0.970 | 0.927 | 0.951 | 0.899 | 0.943 |
| thm2 | 1e+05 | 0.920 | 0.961 | 0.956 | 0.952 | 0.923 |
| thm2 | 3e+05 | 0.976 | 0.982 | 0.941 | 0.980 | 0.909 |
| thm2 | 1e+06 | 0.935 | 0.982 | 0.939 | 0.967 | 0.992 |
| thm2 | 3e+06 | 0.927 | 0.958 | 1.004 | 0.927 | 0.942 |
| thm2 | 1e+07 | 0.948 | 0.933 | 0.981 | 0.965 | 1.002 |

Set 2 (`msq2_D*.json`, independent rows):

| weight | D | e = 1.0 | e = 1.25 | e = 1.5 | e = 1.75 | e = 2.0 |
|---|---|---|---|---|---|---|
| tha | 1e+04 | 0.916 | 0.933 | 0.957 | 0.934 | 0.945 |
| tha | 3e+04 | 0.918 | 0.938 | 0.946 | 0.976 | 0.954 |
| tha | 1e+05 | 0.928 | 0.944 | 0.923 | 0.968 | 0.981 |
| tha | 3e+05 | 0.903 | 0.942 | 0.922 | 0.927 | 0.930 |
| tha | 1e+06 | 0.936 | 0.939 | 0.955 | 0.970 | 0.961 |
| tha | 3e+06 | 0.904 | 0.942 | 0.899 | 0.935 | - |
| tha | 1e+07 | 0.920 | 0.943 | 0.988 | 0.961 | - |
| thA | 1e+04 | 0.922 | 0.968 | 0.938 | 0.935 | 0.947 |
| thA | 3e+04 | 0.944 | 0.921 | 0.971 | 0.943 | 0.922 |
| thA | 1e+05 | 0.966 | 0.925 | 0.965 | 0.907 | 0.982 |
| thA | 3e+05 | 0.934 | 0.908 | 0.957 | 0.965 | 0.937 |
| thA | 1e+06 | 0.903 | 0.913 | 0.928 | 0.935 | 0.937 |
| thA | 3e+06 | 0.943 | 0.962 | 0.973 | 0.888 | - |
| thA | 1e+07 | 0.950 | 0.910 | 0.961 | 0.966 | - |
| tham4 | 1e+04 | 0.883 | 0.866 | 0.899 | 0.879 | 0.858 |
| tham4 | 3e+04 | 0.883 | 0.886 | 0.888 | 0.904 | 0.905 |
| tham4 | 1e+05 | 0.899 | 0.901 | 0.880 | 0.897 | 0.890 |
| tham4 | 3e+05 | 0.876 | 0.901 | 0.890 | 0.927 | 0.894 |
| tham4 | 1e+06 | 0.950 | 0.900 | 0.947 | 0.902 | 0.976 |
| tham4 | 3e+06 | 0.938 | 0.906 | 0.917 | 0.898 | - |
| tham4 | 1e+07 | 0.931 | 0.946 | 0.905 | 0.949 | - |
| tham2 | 1e+04 | 0.931 | 0.929 | 0.941 | 0.983 | 0.929 |
| tham2 | 3e+04 | 0.933 | 1.007 | 0.962 | 0.998 | 0.916 |
| tham2 | 1e+05 | 0.926 | 0.977 | 0.942 | 0.937 | 0.936 |
| tham2 | 3e+05 | 0.964 | 0.981 | 0.976 | 0.953 | 0.952 |
| tham2 | 1e+06 | 0.960 | 0.957 | 0.943 | 0.969 | 0.922 |
| tham2 | 3e+06 | 0.921 | 0.931 | 0.948 | 0.996 | - |
| tham2 | 1e+07 | 0.936 | 0.985 | 1.002 | 0.949 | - |

### 4.2 Exponent of rho in D at fixed aspect (weighted least squares on log rho, D >= 10^4)

Set 1:

| weight | e = 0.5 | e = 0.75 | e = 1.0 | e = 1.25 | e = 1.5 | e = 1.75 | e = 2.0 |
|---|---|---|---|---|---|---|---|
| th | +0.017 +- 0.016 | +0.005 +- 0.006 | +0.007 +- 0.006 | -0.003 +- 0.004 | -0.001 +- 0.004 | +0.002 +- 0.005 | +0.002 +- 0.004 |
| thm4 | +0.011 +- 0.014 | +0.004 +- 0.006 | +0.011 +- 0.004 | +0.008 +- 0.004 | +0.013 +- 0.004 | +0.005 +- 0.004 | +0.008 +- 0.004 |
| thm2 | +0.012 +- 0.012 | -0.003 +- 0.004 | +0.003 +- 0.006 | +0.003 +- 0.004 | +0.008 +- 0.004 | +0.006 +- 0.005 | +0.012 +- 0.005 |
| thr | -0.012 +- 0.017 | +0.004 +- 0.004 | +0.008 +- 0.004 | +0.009 +- 0.006 | -0.001 +- 0.004 | +0.008 +- 0.004 | +0.009 +- 0.004 |
| thc | +0.251 +- 0.114 | -0.006 +- 0.008 | +0.010 +- 0.006 | -0.001 +- 0.004 | +0.007 +- 0.004 | -0.007 +- 0.005 | -0.000 +- 0.006 |
| one | -0.292 +- 0.156 | -0.026 +- 0.010 | -0.002 +- 0.004 | +0.002 +- 0.004 | +0.003 +- 0.004 | +0.006 +- 0.005 | +0.001 +- 0.007 |
| mu | +0.013 +- 0.026 | +0.000 +- 0.005 | +0.007 +- 0.005 | -0.005 +- 0.007 | +0.004 +- 0.005 | +0.002 +- 0.005 | -0.000 +- 0.007 |
| rnd | -0.001 +- 0.014 | +0.002 +- 0.004 | +0.001 +- 0.006 | +0.002 +- 0.005 | -0.003 +- 0.004 | -0.000 +- 0.004 | +0.010 +- 0.004 |
| rsg | -0.007 +- 0.012 | +0.006 +- 0.006 | +0.000 +- 0.007 | +0.002 +- 0.004 | +0.001 +- 0.004 | -0.000 +- 0.004 | +0.009 +- 0.004 |
| onem4 | +0.038 +- 0.028 | -0.003 +- 0.009 | +0.006 +- 0.007 | +0.013 +- 0.007 | +0.018 +- 0.012 | +0.004 +- 0.008 | +0.028 +- 0.011 |
| rsgm4 | -0.003 +- 0.012 | +0.014 +- 0.004 | +0.010 +- 0.004 | +0.008 +- 0.004 | +0.014 +- 0.004 | +0.010 +- 0.004 | +0.012 +- 0.004 |
| c2 | +0.130 +- 0.093 | -0.001 +- 0.020 | -0.013 +- 0.006 | -0.006 +- 0.005 | +0.001 +- 0.004 | +0.006 +- 0.004 | -0.005 +- 0.004 |
| s1 | -0.024 +- 0.012 | +0.001 +- 0.004 | -0.003 +- 0.004 | -0.007 +- 0.004 | -0.001 +- 0.004 | +0.002 +- 0.005 | -0.001 +- 0.004 |
| crnd | -0.010 +- 0.018 | +0.000 +- 0.006 | +0.000 +- 0.004 | -0.008 +- 0.005 | +0.001 +- 0.004 | +0.003 +- 0.006 | -0.004 +- 0.005 |

Set 2:

| weight | e = 0.75 | e = 1.0 | e = 1.25 | e = 1.5 | e = 1.75 | e = 2.0 |
|---|---|---|---|---|---|---|
| th | -0.004 +- 0.007 | +0.008 +- 0.004 | +0.002 +- 0.004 | +0.000 +- 0.005 | -0.004 +- 0.005 | +0.003 +- 0.011 |
| tha | +0.002 +- 0.009 | -0.000 +- 0.004 | +0.001 +- 0.004 | +0.001 +- 0.005 | +0.000 +- 0.004 | +0.001 +- 0.006 |
| thA | +0.000 +- 0.006 | +0.000 +- 0.004 | -0.004 +- 0.005 | +0.001 +- 0.004 | +0.000 +- 0.005 | -0.000 +- 0.007 |
| tham4 | +0.014 +- 0.010 | +0.011 +- 0.004 | +0.009 +- 0.004 | +0.005 +- 0.004 | +0.007 +- 0.004 | +0.022 +- 0.009 |
| tham2 | -0.005 +- 0.006 | +0.001 +- 0.004 | -0.001 +- 0.006 | +0.004 +- 0.004 | -0.002 +- 0.004 | +0.002 +- 0.006 |
| thAm4 | +0.010 +- 0.008 | +0.006 +- 0.004 | +0.013 +- 0.004 | +0.012 +- 0.004 | +0.015 +- 0.004 | +0.011 +- 0.007 |
| thar | +0.011 +- 0.006 | +0.002 +- 0.004 | +0.011 +- 0.004 | +0.009 +- 0.004 | +0.007 +- 0.004 | +0.017 +- 0.006 |
| mu | -0.006 +- 0.013 | +0.004 +- 0.005 | -0.002 +- 0.005 | -0.006 +- 0.005 | -0.005 +- 0.005 | -0.009 +- 0.009 |
| mua2 | -0.005 +- 0.014 | -0.005 +- 0.005 | -0.005 +- 0.005 | -0.005 +- 0.005 | -0.002 +- 0.005 | +0.011 +- 0.010 |
| rnd | +0.003 +- 0.006 | -0.001 +- 0.004 | -0.000 +- 0.004 | +0.003 +- 0.005 | +0.010 +- 0.004 | -0.000 +- 0.006 |

Prediction of the (KD)^(2/3) law: 0.333, 0.250, 0.167, 0.083 at e = 1, 1.25, 1.5, 1.75. Every theta-row entry is
within 0.025 of zero; the marked rows with marks at D^(1/4) rise from 0.84 to 0.95 over the range and stay below
the random value (rows divisible by a small mark prime lose those columns; the proportion of such rows falls as
the mark primes grow): a saturation, not a power.

### 4.3 Controls with a known law (the measurement detects both powers)

| weight | D | e = 0.5 | e = 0.75 | e = 1.0 | e = 1.25 | e = 1.5 | e = 1.75 | e = 2.0 |
|---|---|---|---|---|---|---|---|---|
| c2c | 1e+04 | 6.877 | 4.316 | 2.322 | 1.525 | 1.006 | 0.938 | 0.890 |
| c2c | 3e+04 | 14.148 | 6.376 | 3.096 | 1.738 | 1.295 | 0.887 | 0.935 |
| c2c | 1e+05 | 24.714 | 9.108 | 3.987 | 2.072 | 1.446 | 0.823 | 0.943 |
| c2c | 3e+05 | 36.797 | 13.587 | 5.314 | 2.561 | 1.508 | 0.806 | 0.929 |
| c2c | 1e+06 | 66.419 | 23.568 | 7.654 | 3.062 | 1.399 | 0.802 | 0.942 |
| c2c | 3e+06 | - | 34.277 | 10.983 | 3.871 | 1.589 | 0.814 | 0.964 |
| c2c | 1e+07 | - | 58.628 | 15.540 | 4.886 | 1.958 | 0.814 | 0.980 |
| s1c | 1e+04 | 1.357 | 1.428 | 1.299 | 1.128 | 1.023 | 0.907 | 0.918 |
| s1c | 3e+04 | 1.553 | 1.565 | 1.348 | 1.166 | 0.966 | 0.941 | 0.974 |
| s1c | 1e+05 | 2.010 | 1.655 | 1.446 | 1.293 | 1.039 | 0.851 | 0.937 |
| s1c | 3e+05 | 2.054 | 1.757 | 1.555 | 1.335 | 1.114 | 0.915 | 0.984 |
| s1c | 1e+06 | 2.752 | 2.188 | 1.730 | 1.378 | 1.077 | 0.894 | 0.923 |
| s1c | 3e+06 | - | 2.342 | 1.808 | 1.366 | 1.128 | 0.886 | 0.930 |
| s1c | 1e+07 | - | 2.829 | 1.967 | 1.456 | 1.188 | 0.935 | 0.963 |
| rnd | 1e+04 | 0.988 | 0.971 | 0.893 | 0.963 | 0.963 | 0.938 | 0.909 |
| rnd | 3e+04 | 0.895 | 0.930 | 0.977 | 0.954 | 0.938 | 0.938 | 0.926 |
| rnd | 1e+05 | 0.935 | 0.956 | 0.918 | 0.920 | 0.914 | 0.919 | 0.938 |
| rnd | 3e+05 | 0.993 | 0.945 | 0.965 | 0.938 | 0.935 | 0.949 | 0.909 |
| rnd | 1e+06 | 0.933 | 0.950 | 0.961 | 0.924 | 0.904 | 0.910 | 0.932 |
| rnd | 3e+06 | - | 0.951 | 0.921 | 0.984 | 0.956 | 0.926 | 0.987 |
| rnd | 1e+07 | - | 0.980 | 0.913 | 0.978 | 0.929 | 0.948 | 0.976 |

Exponent in D of the excess rho - rho_rnd (D >= 10^4):

| weight | e = 0.5 | e = 0.75 | e = 1.0 | e = 1.25 | e = 1.5 |
|---|---|---|---|---|---|
| c2c | +0.501 +- 0.022 | +0.409 +- 0.007 | +0.340 +- 0.005 | +0.275 +- 0.008 | +0.144 +- 0.043 |
| s1c | +0.286 +- 0.054 | +0.198 +- 0.014 | +0.153 +- 0.012 | +0.111 +- 0.039 | +0.161 +- 0.042 |

| prediction | e = 0.5 | e = 0.75 | e = 1.0 | e = 1.25 | e = 1.5 |
|---|---|---|---|---|---|
| c2c: (2 - e)/3 | 0.500 | 0.417 | 0.333 | 0.250 | 0.167 |
| s1c: (2 - e)/6 | 0.250 | 0.208 | 0.167 | 0.125 | 0.083 |

### 4.4 Aspect ratios below the range (calibration in the reflected regime, K < D)

At e = 0.5 and 0.75 (M < 1 + l, where the source uses the reflected row): th, tha, thm4, thm2 stay at the random
level (exponents within 0.02 of zero, table 4.2; th = 0.954 at D = 10^7, e = 0.75), i.e. the energy is about K ||a||^2 and below the K + D bound by
the factor K/D; the cubic control grows with exponent 0.50 and 0.41 (prediction 0.50, 0.417); weight 1 falls
below the random level at e = 0.5 (the smooth sum of chi_m(c) over c longer than the conductor of chi_m is short
by the functional equation); the conjugate-symbol row thc grows at e = 0.5 (1.3, 0.9, 1.8, 2.0, 2.5 at
D = 10^4, 3 10^4, 10^5, 3 10^5, 10^6): its dual coefficients gamma_2 conj(gamma_1) are again cubic Gauss sums (Hasse-Davenport), not
Moebius, so Lemma D does not apply to it. The manuscript row is th/tha.

### 4.5 Structured rows

| family | weight | D | e = 1.0: rho (share) | e = 1.25: rho (share) | e = 1.5: rho (share) | e = 2.0: rho (share) |
|---|---|---|---|---|---|---|
| sq | th | 1e+05 | 11.6 (2e-02) | 1.8 (6e-04) | 2.7 (2e-04) | 0.8 (3e-06) |
| sq | th | 3e+05 | 2.9 (2e-03) | 1.7 (3e-04) | 2.2 (7e-05) | 0.9 (1e-06) |
| sq | th | 1e+06 | 5.3 (2e-03) | 2.9 (2e-04) | 0.8 (1e-05) | 0.9 (4e-07) |
| sq | th | 3e+06 | 17.4 (4e-03) | 7.9 (3e-04) | 1.7 (1e-05) | 0.8 (1e-07) |
| sq | th | 1e+07 | 7.6 (1e-03) | 5.1 (9e-05) | 0.9 (2e-06) | 0.8 (3e-08) |
| sq | tha | 1e+05 | 0.8 (1e-03) | 1.0 (3e-04) | 0.9 (7e-05) | 1.0 (4e-06) |
| sq | tha | 3e+05 | 1.0 (7e-04) | 0.9 (1e-04) | 0.9 (3e-05) | 0.9 (1e-06) |
| sq | tha | 1e+06 | 1.1 (4e-04) | 1.0 (7e-05) | 0.9 (1e-05) | 0.9 (4e-07) |
| sq | tha | 3e+06 | 1.0 (2e-04) | 0.9 (4e-05) | 0.8 (5e-06) | - |
| sq | tha | 1e+07 | 0.9 (1e-04) | 1.0 (2e-05) | 1.0 (2e-06) | - |
| sq | tham4 | 1e+05 | 0.9 (1e-03) | 0.9 (3e-04) | 1.0 (7e-05) | 0.9 (4e-06) |
| sq | tham4 | 3e+05 | 1.0 (7e-04) | 0.9 (1e-04) | 0.8 (3e-05) | 0.9 (1e-06) |
| sq | tham4 | 1e+06 | 1.0 (4e-04) | 0.9 (7e-05) | 0.9 (1e-05) | 0.9 (4e-07) |
| sq | tham4 | 3e+06 | 1.0 (2e-04) | 0.9 (3e-05) | 0.9 (5e-06) | - |
| sq | tham4 | 1e+07 | 0.9 (1e-04) | 0.9 (2e-05) | 0.9 (2e-06) | - |
| cube | th | 1e+05 | 47.1 (6e-03) | 0.5 (1e-05) | 8.2 (2e-05) | 1.9 (1e-07) |
| cube | th | 3e+05 | 0.7 (4e-05) | 0.5 (3e-06) | 5.0 (4e-06) | 2.8 (4e-08) |
| cube | th | 1e+06 | 0.6 (2e-05) | 35.9 (9e-05) | 0.9 (2e-07) | 0.9 (2e-09) |
| cube | th | 3e+06 | 122.9 (2e-03) | 24.4 (3e-05) | 36.0 (3e-06) | 7.1 (4e-09) |
| cube | th | 1e+07 | 0.5 (3e-06) | 78.1 (3e-05) | 0.8 (2e-08) | 14.6 (2e-09) |
| cube | tha | 1e+05 | 1.1 (1e-04) | 1.1 (2e-05) | 1.3 (3e-06) | 1.1 (6e-08) |
| cube | tha | 3e+05 | 1.3 (7e-05) | 0.7 (5e-06) | 0.9 (7e-07) | 0.9 (1e-08) |
| cube | tha | 1e+06 | 1.5 (4e-05) | 0.7 (2e-06) | 0.8 (2e-07) | 0.9 (2e-09) |
| cube | tha | 3e+06 | 0.9 (1e-05) | 1.1 (1e-06) | 1.0 (9e-08) | - |
| cube | tha | 1e+07 | 0.6 (4e-06) | 0.8 (3e-07) | 0.9 (2e-08) | - |
| cube | tham4 | 1e+05 | 0.6 (7e-05) | 1.1 (2e-05) | 1.0 (3e-06) | 0.8 (5e-08) |
| cube | tham4 | 3e+05 | 0.9 (5e-05) | 1.3 (9e-06) | 0.9 (8e-07) | 0.8 (1e-08) |
| cube | tham4 | 1e+06 | 1.5 (4e-05) | 0.8 (2e-06) | 1.1 (3e-07) | 0.9 (2e-09) |
| cube | tham4 | 3e+06 | 0.6 (8e-06) | 0.9 (1e-06) | 1.0 (9e-08) | - |
| cube | tham4 | 1e+07 | 0.6 (4e-06) | 0.8 (3e-07) | 1.0 (3e-08) | - |
| fourth | th | 1e+05 | - | 53.0 (2e-04) | 45.9 (2e-05) | 34.0 (2e-07) |
| fourth | th | 3e+05 | - | 100.3 (1e-04) | 62.5 (8e-06) | 36.8 (4e-08) |
| fourth | th | 1e+06 | 254.6 (2e-03) | 203.7 (9e-05) | 152.5 (5e-06) | 72.8 (1e-08) |
| fourth | th | 3e+06 | 261.3 (7e-04) | 376.5 (6e-05) | 257.8 (3e-06) | 126.4 (5e-09) |
| fourth | th | 1e+07 | 1015.1 (1e-03) | 548.4 (3e-05) | 469.9 (1e-06) | 229.5 (1e-09) |
| fourth | tha | 1e+05 | - | 0.2 (7e-07) | 0.4 (2e-07) | 0.2 (1e-09) |
| fourth | tha | 3e+05 | - | 0.1 (1e-07) | 0.2 (3e-08) | 0.2 (3e-10) |
| fourth | tha | 1e+06 | 0.0 (2e-07) | 0.1 (4e-08) | 0.2 (6e-09) | 0.3 (6e-11) |
| fourth | tha | 3e+06 | 0.0 (6e-08) | 0.0 (6e-09) | 0.1 (6e-10) | - |
| fourth | tha | 1e+07 | 0.0 (2e-08) | 0.0 (2e-09) | 0.1 (2e-10) | - |
| fourth | tham4 | 1e+05 | - | 0.8 (3e-06) | 0.7 (3e-07) | 0.7 (4e-09) |
| fourth | tham4 | 3e+05 | - | 0.4 (5e-07) | 0.9 (1e-07) | 0.7 (9e-10) |
| fourth | tham4 | 1e+06 | 0.5 (3e-06) | 0.4 (2e-07) | 1.5 (5e-08) | 1.0 (2e-10) |
| fourth | tham4 | 3e+06 | 0.9 (2e-06) | 1.0 (2e-07) | 0.7 (7e-09) | - |
| fourth | tham4 | 1e+07 | 0.5 (6e-07) | 0.3 (2e-08) | 0.8 (2e-09) | - |

share = rho times the proportion of rows of the family in the annulus. Largest share in the table: 1.5e-02.

Without the angular factor (th) rows m = j^4 carry a theta pole (gamma_2(c) chi_c(j)^4 is the cubic Gauss sum of
index j), rows m = j^2 carry one for the conjugate sign (thc), and cube rows (quadratic twist of the cubic theta
series) are polar for some j; the values depend on the few j in the family and are erratic. With the angular
factor of (5.30) (tha, tham4) the structured rows are at the random level: no pole is seen on any of the three
families, and the rows m = j^4 with small j are far below it (0.0 to 0.1 at D = 10^7: a smooth sum much longer
than its conductor, with no pole). In Lemma D this is the statement that the principal character alpha^2 G nu is not of finite order.
The share of a family in the total energy is rho times the density of the family; it falls with e, so the
structured families are inside K + D in the range in every case. They are the visible part of the dual sum of
Lemma D, which is << D in total under GRH for F.

### 4.6 Largest single generic row

max_m |S(m)|^2 / ||a||^2 over the sample, range over all (D >= 10^4, 1 <= e <= 2): th: 5.7 to 11.2; thm4: 5.2 to 10.9; thm2: 5.3 to 9.8; rnd: 6.2 to 12.9; tha: 5.5 to 15.0; thA: 5.8 to 9.6; tham4: 5.3 to 12.2; tham2: 5.6 to 11.1. For a complex
Gaussian the maximum of 1500 to 2000 samples is about 7.5. The theta rows have the same range as the
random-phase row: no heavy rows in the sample.

## 5. Controls

| control | outcome |
|---|---|
| reflected regime K < D (calibration) | section 4.4: theta rows at the random level; pole controls grow as predicted |
| weight 1 | flat at 0.93 to 0.99 for e >= 1; below random for K < D^(3/4) |
| cubic-character rows with cubic Gauss-sum weight (c2c) | carries the (KD)^(2/3) term with the predicted exponent at five aspects |
| sextic Gauss-sum weight (s1c) | carries K^(5/6) D^(1/3) with the predicted exponent |
| vanishing-residue rows (c2, s1) | flat |
| random phase, random sign, random marks | flat, same level as the theta rows |
| Moebius weight (mu, mu alpha^2: the dual coefficients) | flat at every aspect including K < D: mean square of twisted Moebius sums of length D over conductors up to D^(1/2) .. D^2 is at the random level |

The flatness of the theta rows is shared by the random rows, so the measured property does not use the
arithmetic of the target. Lemma D does: it identifies the term that a random row lacks for a different reason
(a random vector has no correlation with gamma_1; the theta vector has full correlation, cancelled by mu).

Controls of the campaign list (no statement about zeros is made, so none has to fail): THIN and sign twists: the
target enters Lemma D only through xi_1 = alpha^2 G nu; for a completely multiplicative unimodular twist with a
zero at b the lemma holds with theta >= b and part (b) reads b <= 1 - (2 - e)/12, a true statement or not
according to b: the lemma is Euler-blind in this sense. Davenport-Heilbronn: the row is linear in the target, the
lemma holds term by term. Backward heat, unimodular twist U, zeta(s+a)zeta(s-a), T-NR, Beurling, transfer
operator, theta^w: not applicable.

## 6. Conjecture, and what a proof needs

**Conjecture WLS-range.** For the manuscript row coefficients b_c d(c) of section 1 (nu in the fixed finite family
of ray characters, a_p = eta(p) W(q_p / P), cube completion included), every eps > 0 and all D <= K <= D^2:
sum_{q_m <= K} |R_m|^2 << (KD)^eps K sum_c |b_c d(c)|^2.

It is WLS-tall of c5 with the range made explicit. Status after this lane:
* MEASURED flat for the reduced rows at D <= 10^7, e = 1 .. 2, marks at l = 1/3 and l = 1 (section 4).
* Implied by GRH for F (Lemma D(a), ARGUED).
* Implies L(s, alpha^2 G nu) != 0 for Re s > 1 - (2 - e)/12 at aspect e (Lemma D(b), ARGUED): at e = 1 it is at
  least as strong as the 11/12 result of Part I for these characters. A proof at K = D therefore has to contain
  a zero-free argument of that strength; an unconditional proof by a norm inequality alone is not possible.
* A proof needs: (1) Lemma D written with weights, common factors and the cube completion; (2) the mean-square
  bound sum_{0 < q_k <= D^2/K} |M_k(D)|^2 << D^(1 + eps). Lemma 9.1 gives (2) on squarefree k when K >= D^(3/2);
  the frequencies u a^6 with q_u small need |M_u(D)|^2 << D (q_u K / D^2)^(1/6), a power saving for individual
  reciprocal sums, i.e. a zero-free strip for each L(s, xi_u), uniformly in u.

What it would give: nothing below 5/6 with compensation; with the uncompensated branch the vertices of c5
section 6, which Proposition E removes under GRH.

## 7. Requirement flags (for this lane's result)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | Lemma D uses gamma_1 gamma_2 = mu alpha G, but the lane proves no statement about zeros; the measured flatness is shared by random rows |
| R2 height-uniform, every window | false | no conclusion about zeros |
| R3 controls fail structurally | false | nothing to fail; Lemma D holds for THIN and DH with the stated reading |
| R4 reaches the critical line | false | no consistent model vertex with h > 1: the sieve input holds (measured; GRH-conditional), and the uncompensated branch that every h > 1 vertex uses is false for h > 3 under GRH |

## 8. Three weakest steps

1. **Lemma D, Step 3, is an outline.** The Poisson step, the pairs with common factors, the separation of the
   weights and the cube completion n != 1 are not written out; the marked case needs the mark polynomial on the
   line, which is bounded only for the manuscript's a_p under GRH. Part (b) needs a row weight with non-negative
   transform and a class with eps = +1, and treats the lower-order terms as negligible. Steps 1 and 2 are
   finite identities and were checked. The measurement uses the reduced product form (n = 1, nu trivial, a_p = 1
   or random signs), not the completed row of (5.30).
2. **Finite range and sampling.** D <= 10^7 with 1500 to 2000 random rows per point. An exponent below 0.01 or a
   logarithmic growth is not excluded; a contribution carried by a set of rows of density below 10^-3 is seen
   only through the three structured families tested. The total-energy statement for all rows rests on Lemma D,
   not on the sample. float64/complex64 arithmetic; no interval certificate (the question is a power law against
   a power law, not a threshold).
3. **Proposition E is relative.** It uses Theorem B of `c5-marks-circularity-order2` (one referee; relative to the
   transcribed (S), (H) and Prop. 2.1), GRH for F and for the row family, and the transcription of the
   uncompensated branch from `r3-method-limit`. It names the branch, not the failing line inside it; the reading
   of (12.5)/(16.1) in section 3 is not a derivation. Whether F lies inside the family covered by the
   manuscript's 7/8 claim was not checked, so the theta = 7/8 column of the LP table is a model row.

## 9. Proposed map row (not applied)

| Z15c | Unreflected theta rows in 1 + l <= M < 2 + 2l | Row energy = K ||b||^2 + (K/D) sum_{q_k <= D^2/K} |M_k(D)|^2 with M_k a reciprocal sum of a Hecke L-function (dual coefficients gamma_1 gamma_2 = mu alpha G). No (KD)^(2/3) term: measured exponent within 0.025 of zero at D <= 10^7, five aspects, marked and unmarked; pole controls grow as 1/3 and 1/6. K + D follows from GRH for the family; K at aspect e implies zero-free Re s > 1 - (2 - e)/12 for the principal character. Under GRH the false input of the lx < l region is the uncompensated branch of the reduced model, not the sieve; with the 7/8-conditional sieve the branch still returns 0.3125. | MEASURED; ARGUED (Lemma D); kernel identity CHECKED; LP EXACT on MODEL inputs | random rows pass the measurement; Lemma D is Euler-blind (THIN: theta >= b) | `c6-unreflected-marks-kd23` |

No pivot taken. No abscissa below 0.874886647 is proved.
