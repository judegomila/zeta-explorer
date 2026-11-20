# REFEREE (adversarial, lens: general) for c8-ek-theta-second-moment-formula

Date 2026-11-18. Target: `RESULT.md` in this directory. Claimed verdict: partial-result ((E-K) not refuted, not
proved). Referee scratch: `/tmp/ref-c8-general/` (own scripts `indep.py`, `indep2.py`; copies of the lane's
`t2_moment.py` with a changed seed). All runs local under `scripts/memcap.sh 8`; the compute server was not used.
Nothing outside this file was written in the lane directory.

## Outcome

**The verdict "partial-result; (E-K) neither refuted nor proved" holds. Lemma 1 and the Corollary 1 identity are
confirmed (re-derived and checked with independent code). One ARGUED statement that is carried into the claim line
is wrong: the sixth-power form is not indefinite of signature (2, 2); with the factor chi_.(-1) that RESULT itself
names, it is positive semidefinite. Theorem 2 is an outline for squarefree unmarked columns and an analogy for
marked rows and cube parts. No statement about zeros is made. Flags: R1 = R2 = R3 = R4 = false.**

## 1. PROVED steps re-derived

**Lemma 1 (pair formula). CONFIRMED.**
- Fourier normalisation: with e(z) = exp(2 pi i Tr(z/lambda)), Tr(w/lambda) = 2 Im(w)/sqrt 3; the dual of O is O;
  self-dual measure (2/sqrt 3) dx dy; transform of exp(-kappa |z|^2 / X) is X exp(-kappa X |y|^2) exactly for
  kappa = 2 pi / sqrt 3. Recomputed by hand.
- chi_c conj(chi_c') = 1_{(m,g)=1} chi_{c_1} conj(chi_{c_1'}); Moebius over d | g; m = d m'; Poisson on classes
  modulo c_1 c_1' with f = g_{X/q_d}; CRT split r = r_1 c_1' + r_2 c_1. Prefactor (1/q_n)(X/q_d) q_n^{1/2} =
  X/(q_d q_n^{1/2}), n = c_1 c_1': agrees with the statement. Diagonal: X Sum_{d | c} mu(d)/q_d = X phi(c)/q_c.
  The m = 0 bookkeeping is consistent (for g != 1 the Moebius sum over d kills it).
- Independent numeric check (`indep.py`: no lane code, no table, own sextic symbol and own Gauss sums by direct
  summation over residues, arbitrary non-primary generators, R replaced by its definition
  chi_{c_1}(c_1') conj(chi_{c_1'}(c_1)); ten pairs, X between 5.5 and 50, different from the lane's X = 60):
  max |direct - dual| = 1.8e-14. Three of the ten pairs are non-zero (two diagonal, one off-diagonal complex value
  0.104369346 + 7.900201421 i on both sides); the other seven vanish on both sides by unit symmetry.
  Remark for readers of `t1_identity.log`: most random pairs vanish identically for that reason, so the "68 pairs"
  check is carried by the few unit-invariant pairs and by the aggregated test (c).

**Corollary 1 (tau_{g c_1} gt_1(k, c_1) = tau_g mu(c_1) G(c_1) conj(chi_{c_1}(k g^2))). CONFIRMED.**
- Algebra rechecked: twisted multiplicativity of gamma_2, (chi_g(c_1) chi_{c_1}(g))^2 = chi_{c_1}(g)^4, alpha
  multiplicative.
- `indep2.py` (own Gauss sums; primary generators read from the table as data): G := mu conj(alpha) gamma_1 gamma_2
  equals conj(chi_pi(4)) gamma_3(pi) on all 34 split primes of norm <= 160 to 7.4e-14; the displayed identity holds
  on all products of two split primes with q_g q_{c_1} <= 300 and three k to 9.6e-14.
- Not replayed: that G and R expand into a FIXED finite set of ray characters uniformly (MS Lemma 4.4), the
  e-opening of (c_1, c_1') = 1 together with the twisted multiplicativity of G(e c). These are routine but are
  part of the passage to M_k and remain "outline".

**4x4 matrix R(x, y) = (-1)^{eh + fg + fh}.** Symmetric Hadamard, trace 0, eigenvalues +2, +2, -2, -2: CONFIRMED for
the matrix as written. It is not the form that occurs (section 2 below).

## 2. Errors and gaps

**E1 (wrong, ARGUED item carried into the claim line and the proposed map row): "indefinite form, signature
(2, 2), sign +-".** From Lemma 1 the k-dependence is gt_1(k, c_1) conj(gt_1(-k, c_1')) =
conj(chi_{c_1}(k)) chi_{c_1'}(k) chi_{c_1'}(-1) gamma_1(c_1) conj(gamma_1(c_1')). RESULT section 3 mentions "the class
character chi_.(-1) on y" and then takes the signature of R alone. Checked on the table: chi_c(-1) = (-1)^f on
the square class (e, f) (400 primes, no exception). Pairing k with -k gives the kernel R(x, y)(s(x) + s(y)),
s = (-1)^f, with eigenvalues 0, 0, 4, 4. Including all six units, the kernel
R(c, c') Sum_u conj(chi_c(u)) chi_c'(-u) on the 848 squarefree columns of norm <= 3000 is Hermitian with rank 6,
largest eigenvalue 876 and no negative eigenvalue (smallest -1.7e-12). So the sixth-power term at leading order
(g = d = e = 1, q_k well below K so that the Gaussian factor is 1) is positive semidefinite in the dual vector,
for every vector. Consequences:
- "A zero ... contributes +- X K^{1/6} Z^{2 beta - 2}, with a sign depending on the class character" should read
  "a non-negative contribution of that size, possibly zero if the class components lie in the kernel".
- "LIOU takes values on both sides of 1: the form is indefinite" is not supported. The LIOU values below 1
  (0.935 at Z = 500; 0.9635 at Z = 1000, X = 8N in the referee run) occur at K <= 250 and are of the size of the
  RAND fluctuation there; their source (non-sixth-power frequencies, the Gaussian factor, or the g, e > 1 terms)
  is not identified.
- ALIGNED is above 1 at every size and every X in all runs, which is what a positive semidefinite form gives.
The verdict does not depend on the sign; the claim line and row Z15d should drop "indefinite".

**E2 (gap): Lemma 1 does not cover B_m as defined.** B_m in section 0 has cube parts n (characters chi_c chi_n^3,
weights 1/q_n) and Theorem 2 is stated for "the unmarked or marked theta rows". Lemma 1 and Corollary 1 treat
squarefree columns only. With n present the Poisson step produces mixed sextic-quadratic Gauss sums, and columns
(c, n a^2) and (c, n) carry the same character up to coprimality, which adds coherent terms to the diagonal (a
bounded change of D; absent from the screen only because q_n^3 <= 12 Z admits no n = a^2 at these sizes). This is
not written. Theorem 2 is therefore an outline for squarefree unmarked columns, and ARGUED for the rows actually
used by the probe.

**E3 (label): Theorem 2 is "PROVED-cond" in the verdict, "bookkeeping in outline" in the statement, "by analogy"
for marked rows.** The count in the outline was replayed for the squarefree unmarked case and is correct:
|M_y(s)| << Z'^{-1/2 + Re s + eps} with Z' = Z/(q_g q_e); K_g Z'^{-1} = q_d q_e Z/(q_g X); weights 1/(q_g q_d q_e^2);
total X * Z^{1+eps}/X. The 1/L bound on Re = 1/2 + eps under GRH, the removed Euler factors at primes of g e and
at primes of y (each product is q^{o(1)}), and the contour for Re s = A are in order. The marked case (slot prime
shared between c and c', twisted multiplicativity of G across the slot prime) is not written. Correct label:
outline, conditional; not a completed conditional proof. RESULT section 8 item 1 says this; the verdict line 2
and LANE_LINE say "holds for X >= N" without the qualifier.

**E4 (overstatement in verdict item 3): "(E-K) can fail only through zeros with beta > 1 - (2 + 2l - M)/12".**
That threshold is for the sixth-power term alone. The general frequencies need (MV6), which RESULT section 3
states is open, and nothing is proved in the window Z/P < X < Z P. "Only" is not established outside the range
of Theorem 2 (where, under family GRH, there is no failure at all).

**E5 (measured exponent).** RESULT says the ALIGNED excess "follows the count of sixth powers" (three sizes).
With the two referee sizes the excess at X = N is 0.24, 0.34, 0.41, 0.52, 0.63 at Z = 500, 1000, 2000, 4000, 8000:
a power fit gives K^{0.35}, about twice the stated 1/6. This is compatible with a small discrete count under a
wide smooth cutoff (three ideals of norm 1, 3, 4), but the data do not confirm the exponent 1/6; they show growth.

**E6 (section 6, first reading).** "The deletion of the K-loss is not the false input" in the free-geometry
region uses branch D for marked rows (l > 0), where Theorem 2 is by analogy (E2, E3). The inference is ARGUED.
The LP numbers quoted agree with `lp_pm2.log`.

**E7 (novelty).** Lemma 1 is the standard duality step of the large sieve for power-residue symbols (Poisson in
the complete variable; compare Heath-Brown's cubic large sieve and Dunn-Radziwill (1.13), which RESULT cites).
It is a correct computation for this vector, not a new method. The identification of the dual vector with
mu G nu is the content.

## 3. Numeric check rerun with a different case

`t2_moment.py` copied to scratch, seed 11 -> 2026, sizes not run by the lane unmarked (Z = 1000, Z = 4000):

| Z | X/N range | THETA | THETA*G | U | RAND1, RAND2 | LIOU (X = N) | LIOU*G (X = N) | ALIGNED (X = N) |
|---|---|---|---|---|---|---|---|---|
| 1000 | 1/8 .. 16 | 0.966 .. 1.014 | 0.865 .. 1.011 | 0.981 .. 1.003 | 0.956 .. 1.020 | 1.075 | 1.196 | 1.336 |
| 4000 | 1/8 .. 16 | 0.954 .. 0.999 | 0.946 .. 1.001 | 0.960 .. 1.000 | 0.991 .. 1.022 | 1.302 | 1.347 | 1.516 |

Consistent with RESULT section 4: no excess for the theta vector, ratio within the RAND spread; excess for LIOU
and ALIGNED growing with Z. The claim "theta ratio 0.94 .. 1.04 at seven sizes" refers to THETA; THETA*G reaches
0.865 (referee) / 0.882 (lane) at X = N/8, a deficit of the same size as RAND there. Float screen only.

## 4. Controls

No zeta-only mechanism is claimed; (E-K) is a mean square over rows at fixed target. Rerun by the referee
(table above): generic unimodular twist U holds (0.96 .. 1.00), random phases hold, Liouville and aligned twists
fail with growth, THIN (b = 0.9) 0.965 .. 1.025 (below resolution, as stated). Since the property holds for
random phases and generic U, it is not a multiplicativity statement and not every control fails. DH, backward
heat, T-NR, Beurling, transfer operator, theta^w, zeta(s+a) zeta(s-a): not applicable to this statement; nothing
was run and nothing is claimed.

## 5. Other checks

- RH / GRH: used only in Theorem 2 (a), stated as a hypothesis; the circularity (family contains the target) is
  stated. Nothing else assumes it. Verified height is not used.
- Dunn-Radziwill: `dl/dr.txt` read at Theorem 1.4, Remark 1.1, the example paragraph, and the proof with
  (9.3)-(9.5). The quotations are accurate: lower bounds conditional on GRH, extremal vector g~(b) W(N(b)/B)
  against the cubic symbol, main term B^{5/6}/A^{1/6}. "The sharpness result does not settle (E-K) as false" is a
  correct reading: different symbol power and an angular factor. That the angular factor removes the main term
  rests on MS Prop. 5.1 (unrefereed, not replayed) and on the j = 4 float run.
- All abscissae are relative to unrefereed sources; RESULT says so.

## 6. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | (E-K) holds for random phases and generic unimodular twists; multiplicativity enters the evaluation, not the property |
| R2 | false | no statement uniform in height; no statement about zeros |
| R3 | false | generic U and random phases pass; only Liouville/aligned fail |
| R4 | false | prices one input of an estimate system; reaches no abscissa |

## 7. Surviving claim

(E-K) is neither refuted nor proved. Exact: for squarefree columns, Poisson in the row variable plus
gamma_1 gamma_2 = mu alpha G give Sum_m g_X(m) |B_m|^2 = X D + X Sum_{k != 0} F_k with F_k bilinear in localized
Moebius sums M_k (Mellin transforms of 1/L(1 + u, eta theta chi_k^{-1}) over the order-6 twist family), effective
range q_k <= N^2/X (confirmed independently to 1e-14 on pairs). In outline, under GRH for that family (circular:
it contains the target), error N^{1+eps} for squarefree unmarked columns, so (E-K) for X >= N; marked rows and cube
parts by analogy. The sixth-power frequencies carry the target's own sum M_1 with multiplicity about K^{1/6}
through a positive semidefinite form (not indefinite); the excess is measured for the Liouville and aligned
twists (growth confirmed at five sizes, exponent not resolved). The Dunn-Radziwill extremal configuration is not
the probe's. Float screen: theta ratio within the random-phase spread at nine sizes. Window Z/P < X < Z P open.
No abscissa, no statement about zeros.
