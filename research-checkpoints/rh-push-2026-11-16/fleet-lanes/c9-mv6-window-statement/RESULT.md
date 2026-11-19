# c9-mv6-window-statement: (MV6) as one statement over Z[omega], and the window Z/P < X < Z P

Internal working note, 2026-11-18/19. Slug `c9-mv6-window-statement`. Kind: combine
(`c8-ek-theta-second-moment-formula` + `c8-liou-row-bound-theorem`, framework of `c8-ek-ff-reflected-rows-exact`).
Device node: ek-vector-specific-row-mean-square. Not refereed (REFEREE.md is left to the referee). Nothing
committed, pushed or posted. Written: this directory and `~/rh-push/c9-mv6-window-statement/` on the compute
server (through `rhrun`, 4 cores, 8 GB: a first launch at chunk 300 was killed by the 8 GB limit after 3 minutes;
the problem was reduced to chunk 60 under the same limit and ran 82 minutes; both units are inactive).

This note makes **no statement about zeros of zeta or of any L-function**. Every abscissa mentioned is the value
of an estimate system relative to the unrefereed manuscript ("MS"). 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X (complete given X) / CITED / CLASSICAL / MEASURED (float
screen, complex64) / ARGUED (steps named, not written line by line) / OPEN.

## Requirement answers, stated before the work

| flag | answer in advance | answer after the work | evidence |
|---|---|---|---|
| R1 multiplicativity essential | no | **no** | (E-K) in the window holds for random column phases and for the generic unimodular twist U (MEASURED, section 5). Multiplicativity enters the exact formula (Gauss identity, 1/L), not the property. |
| R2 height-uniform, every window | no | **no** | A mean square over rows at fixed target; no statement about zeros. |
| R3 every control fails structurally | no | **no** | Random phases and U pass. The aligned and Liouville vectors fail (MEASURED: +2 to +40 percent in marked rows from Z = 4000 on, growing with Z and toward the lower edge), and the excess sits in one named term (the cross term of section 4). DH has no row family: the row moment is not defined for a finite combination except term by term (linear low side), so DH is not a control for this statement. |
| R4 reaches the critical line | no (inside the 7/8 architecture) | **no** | One input of the Prop. 2.1 format is restated; no abscissa is reached. |

## Verdict

**Precise obstruction. The decisive test is negative in both directions: in the window the mean value of 1/L is
neither reducible to moments with L in the numerator nor obtainable from a zero-free region (or GRH) for the whole
family by the method of Theorem 2 / Theorem A. The window statement is a cancellation between a positive frequency
form of size (N/X) D and its own diagonal, and both proof techniques bound the form, not the difference. One
pivot was made (slot decomposition, section 4): it isolates the open content of the window in a cross term over
pairs of distinct slot primes, where the aligned controls carry their excess. No proved window statement for the
Moebius vector. The score rule is not met; the headline is unchanged (ceiling 2/3, row Z24).**

1. **First lemma (PROVED-rel c8 Lemma 1 and Corollary 1, both confirmed by the c8 referee for squarefree
   columns).** (MV6-W), displayed in section 1, is one statement over Z[omega] for the Moebius probe vector. It is
   equivalent to (E-K) at the same X with the constant shifted by 1, for every X > 0. The lower bound
   Off_X >= -D#_X is free (positivity).
2. **The form (MV6) of c8 (absolute values, weight (K/q_k)^(1/6)) is not the window statement.** For K > N the
   absolute frequency form has a diagonal of its own, of size K D(beta) = (N/X) D up to constants (PROVED as an
   identity and as a phase average; MEASURED for the Moebius vector: 0.99 to 1.00 times its diagonal for K/N from
   1 to 64). So (MV6) in the absolute form holds only for K <= N, and in the window a bound for the off-diagonal
   through the absolute form returns N^(1+eps), which is its true size. Theorem 2 (a) of c8 (family GRH) is such a
   bound: its loss N/X in the window is not slack in the proof.
3. **L in the numerator does not help in the window (PROVED-rel Theorem A of `c8-liou-row-bound-theorem`).** For
   the Liouville vector Theorem A has the full second moment in the numerator (unconditional) and gives
   abs(Rem) <= C N^(1+eps) for every row length: the same N^(1+eps). The step is named: Step 5 of its section 3.4
   (absolute values in the frequency sum on the line Re z = 1 + eps); the output does not depend on the number of
   rows. And for that vector the conclusion is false (P >= c X^(5/6) N^(1/3) > X in the whole window; proved to dominate Rem
   for X > N^(4/5+eps)).
4. **Where the reduction 1/L -> L stops (exact step).** Identity (3.4) of Theorem A: with the weight mu lambda = 1
   the column sum is L^S(x, psi)/L^S(2x, psi^2); with the weight mu of the probe it is 1/L^S(x, psi). The second
   moment of L over the family (BGL Corollary 1.4) is proved through the approximate functional equation, which
   shortens the sum to the square root of the conductor, where the sextic large sieve is optimal. 1/L has no
   approximate functional equation; applied to the Moebius sum of length N against K frequencies the sieve gives
   (K + N + (K N)^(2/3)) N^(-1+eps), which is O(N^eps) only for K <= N^(1/2) (c8). A mollified second moment gives a
   zero-density exponent A through the same sieve, and (MV6) needs K^A <= N^2: A < 2 in the window, below the
   density hypothesis. Items 2 and 3 show that even A = 2, GRH, or L in the numerator do not reach the window.
5. **Pivot: slot decomposition (PROVED; identity checked to 1.6e-15 on 5832 pairs).** The marked row is
   B_m = Sum_pi u_pi chi_pi(m) B^Z_m[nu xi_pi], the unmarked row of length Z for the target twisted by the cubic ray
   character xi_pi(c) = chi_c(pi)^4 of conductor pi. Hence S_X = Sum_pi abs(u_pi)^2 S_X^unm[nu xi_pi] + Cross_X. The
   first part is the unmarked problem with K = Z^2/X: under GRH for the enlarged family it satisfies (E-K) for
   X >= Z (PROVED-cond in outline, as c8 Theorem 2), which is the upper half of the window. There the window
   statement is equivalent to the named input (CROSS), section 4. (CROSS) is not proved.
6. **Numerical screen (MEASURED; section 5).** Marked rows, P about Z^(1/3), X on a dyadic grid across the window,
   Z = 2000, 4000, 8000 local and Z = 16000 on the server (prime table 17338 primes, 371888 live columns,
   3.6e6 rows). THETA: no excess at any window point (largest ratio 0.995, 1.007, 0.998, 0.997); the fitted
   exponent e in "mean square = X^(1+e)" is +0.012, +0.007, +0.018, +0.006, positive only because the ratio is
   below 1 near the lower edge (a deficit, down to 0.90). Aligned vector: 1.07 .. 1.10, 1.11 .. 1.16, 1.19 .. 1.40
   at Z = 4000, 8000, 16000; Liouville 1.02 .. 1.03, 1.04 .. 1.09, 1.08 .. 1.22; both grow with Z and toward the
   lower edge, and in the slot decomposition the whole excess is in the cross term (aligned cross at X = N:
   +0.046, +0.079, +0.120, +0.203 of the diagonal; up to +0.439 inside the window at Z = 16000; slot-diagonal
   part <= 0.99). Slope of log(cross) against log X: -0.068, -0.106, -0.129 (aligned), -0.116, -0.153, -0.150
   (Liouville) at Z = 4000, 8000, 16000; the sixth-power count predicts -1/6. At Z = 2000 the controls are within
   3 percent of 1. THETA cross term: -0.065 .. +0.012. U and random phases: 0.96 .. 1.02. The slots hold 5 or 6
   primes: a screen, not evidence for an exponent of the theta vector.

---

## 0. Plan, and relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP rows Z15, Z15b, Z15c, Z24, Z25, Z26 and the controls entries (THIN, U,
Liouville); RESULT and REFEREE of `c8-ek-theta-second-moment-formula` (all); RESULT of `c8-liou-row-bound-theorem`
(sections 3, 6); verdict of `c8-ek-ff-reflected-rows-exact`.

Known before this lane: Lemma 1 and Corollary 1 of c8 (exact unfolding; referee-confirmed for squarefree columns);
Theorem 2 of c8 (outline; family GRH gives X D + O(N^(1+eps))); the sixth-power term is positive semidefinite
(c8 referee, E1); Theorem A (Liouville rows, Rem <= X_col^(1+eps)); "window Z/P < X < Z P open".

New here: the displayed statement (MV6-W) with its ranges and the equivalence; the dual diagonal (Proposition 1);
the reading of Theorem A as a window no-go for the numerator technique; the slot decomposition and (CROSS); the
window screen on a full dyadic grid with the slot/cross split.

Order of work: decisive test first (sections 2, 3), written before any run at Z >= 2000. The test killed the
assigned reduction. One pivot (section 4). Screen (section 5).

Scope restriction inherited from the c8 referee (E2): everything below is for **squarefree columns** (the cube
parts n of the full row B_m are not covered by Lemma 1). The marked rows of the screen are squarefree.

## 1. The statement (MV6-W) and its equivalence with (E-K)

Notation of c8: F = Q(omega), O = Z[omega]; c, c' squarefree primary prime to 6; chi the sextic symbol;
tau_c = gamma_2(c) conj(alpha(c)); G from gamma_1 gamma_2 = mu alpha G (unimodular); R(a, b) = +-1 the reciprocity
bicharacter; kappa = 2 pi/sqrt 3; g_X(m) = exp(-kappa q_m/X). Target weight nu (it contains eta), completely
multiplicative of modulus <= 1. Column weight w(c) >= 0:

    unmarked:  w(c) = q_c^(-1/2) V(q_c/Z),
    marked:    w(c) = q_c^(-1/2) Sum_{pi | c, P < q_pi < 2P} W(q_pi/P) V(q_c/(Z q_pi)),         N = Z P the column length.

Theta vector a_c = tau_c nu(c) w(c); row B_m = Sum_c a_c chi_c(m); S_X = Sum_{m in O} g_X(m) abs(B_m)^2.
**Moebius probe vector** at level g:

    m_g(c) = mu(c) G(c) nu(g c) w(g c) q_c^(-1/2)          (c squarefree, (c, g) = 1).

Exact diagonal: D#_X = X^(-1) Sum_c abs(a_c)^2 Sum_{m : (m, c) = 1} g_X(m) = D + O(X^(-1) Sum_c abs(a_c)^2 2^omega(c)),
D = Sum_c abs(a_c)^2 phi(c)/q_c. (theta(Y) = Sum_m exp(-kappa q_m/Y) = Y theta(1/Y), so each divisor d of c contributes
mu(d)/q_d up to exp(-kappa X/q_d) if q_d <= X and at most 2/X otherwise.) D#_X is the quantity DIAG of the screen.

**(MV6-W).** For every eps > 0 there is C_eps such that for Z >= Z_0, P = Z^l, N = Z P and X in the stated range

    Off_X := Sum_g Sum_{d | g} (mu(d)/q_d) Sum_{k in O, k != 0} Sum_{(c_1, c_1') = 1, (c_1 c_1', g) = 1, c_1 c_1' != 1}
               R(c_1, c_1') chi_{c_1}(d) conj(chi_{c_1'}(d)) m_g(c_1) conj(m_g(c_1'))
               conj(chi_{c_1}(k g^2)) chi_{c_1'}(-k g^2) exp(-kappa X q_k / (q_d q_{c_1} q_{c_1'}))
          <= C_eps Z^eps D#_X.

The inner sums over c_1 and c_1' (after opening the coprimality by Moebius and the Gaussian by a Mellin integral,
c8 Corollary 1) are the sums M_y(s; theta) = (1/2 pi i) Int V~(u) (Z')^u / L^{S'}(1 - s + u, eta theta chi_.(y)^(-1)) du:
smooth partial sums of 1/L over the order-6 twist family, y = k g^2 d^5, theta in the fixed finite ray family. The
frequencies that matter have q_k <= K (log N)^2, K = N^2/X.

Ranges.
* X >= N (K <= N): the range of c8 Theorem 2. Here (MV6-W) follows from the absolute form (MV6) of c8.
* X <= Z/P: the range of the row functional equation (MS Prop. 5.1, not replayed).
* **Window Z/P < X < Z P, that is N < K < Z P^3.** Empty without marks (P = 1).

**Lemma 0 [PROVED-rel c8 Lemma 1, Corollary 1].** For every X > 0 and every finite vector of the form above

    S_X = X D#_X + X Off_X,          Off_X >= -D#_X.

Hence, for every A >= 1: S_X <= A X D#_X if and only if Off_X <= (A - 1) D#_X. With A = 1 + C_eps Z^eps this is the
equivalence of (E-K) at X with (MV6-W) at X.

Proof. Expand the square: S_X = Sum_{c, c'} a_c conj(a_c') S(c, c'), S(c, c') = Sum_m g_X(m) chi_c(m) conj(chi_c'(m)).
The pairs c = c' give X D#_X by definition. For c != c' write c = g c_1, c' = g c_1' with g the gcd, so
c_1 c_1' != 1. c8 Lemma 1 gives S(c, c') as the sum over d | g and k in O; the term k = 0 vanishes because
gt_1(0, c_1) = 0 for c_1 != 1. c8 Corollary 1 gives a_{g c_1} gt_1(k, c_1) = tau_g mu(c_1) G(c_1) conj(chi_{c_1}(k g^2)) (nu w)(g c_1),
and the same with -k and a conjugate for c_1'; abs(tau_g) = 1; the factor (q_{c_1} q_{c_1'})^(-1/2) of Lemma 1 is
in m_g. This is the display. Off_X >= -D#_X because S_X >= 0. QED

Remark. Lemma 0 is an identity, so (MV6-W) carries exactly the content of (E-K). What the rest of this note
decides is whether (MV6-W) is a statement of mean-value type in the window. It is not.

## 2. Decisive test, part 1: the absolute form has its own diagonal for K > N

For a vector beta on squarefree columns put

    N_K(beta) = Sum_{k in O} g_K(k) abs(Sum_c beta_c conj(chi_c(k)))^2.

**Proposition 1 [PROVED].** N_K(beta) = K D#_K(beta) + K Off_K(conj beta), and the mean of N_K over independent
unimodular column phases is K D#_K(beta) = K Sum_c abs(beta_c)^2 phi(c)/q_c (1 + O(tau-terms/K)).

Proof. Expand the square. The pairs c = c' give K D#_K(beta) by the definition of D#; the pairs c != c' are
K Off_K by definition, and each has mean zero over independent column phases. (Off_K has the dual form of Lemma 0
with k in the role of the row variable; it is not needed here.) QED

For beta = m_1 (the Moebius vector), abs(beta_c)^2 = abs(a_c)^2/q_c and the support has q_c of order N, so
K D(beta) is of order (K/N) D(a) = (N/X) D(a). Consequences:

* **Typical vectors.** For K > N the absolute frequency form is (N/X) D on average. X N_K is then N D, not X D.
* **The Moebius vector itself [MEASURED].** `w_Z2000_unmarked.log`, columns MUG (mu G) and MUGc (mu conj G), rows
  in the role of k: N_K / (K D#) = 0.998, 0.994, 0.991, 0.991, 0.992, 0.994, 0.996 (MUG) and 1.011, 1.004, 1.001,
  0.999, 0.996, 0.995, 0.996 (MUGc) at K/N = 1, 2, 4, 8, 16, 32, 64. The Moebius sums M_k do not fall below
  square-root size on average when there are more frequencies than terms.
* **Therefore.** (MV6) of c8, Sum_{q_k <= K} (K/q_k)^(1/6) abs(M_k)^2 << N^eps in the normalisation
  abs(M_k)^2 ~ 1/N, is a true-or-false statement only for K <= N. For K > N its left side is at least of order
  K/N [MEASURED for the Moebius vector; PROVED on average over phases].
* **Structure of Off_X in the window [ARGUED].** Opening (c_1, c_1') = 1 by Sum_{e} mu(e), the term e = 1 is a
  positive semidefinite frequency form (c8 referee E1 for the unit orbit of k, Schur product with the rank-one
  kernel conj(chi_c(k)) chi_c'(k)) which contains the pairs c_1 = c_1'; it has size (N/X) D. The terms e > 1 have
  the same number of frequencies K and Moebius sums shortened to N/q_e, so each has size (N/X) D / q_e, and the
  alternating sum over e removes the diagonal (Sum mu(e)/q_e -> 0). Off_X = O(Z^eps D) is the statement that what
  remains after this removal is smaller than each of the pieces by the factor X/N.

So a proof of (MV6-W) in the window cannot put absolute values on the frequency sum. Both available techniques do:

* c8 Theorem 2 (a): abs(M_y(s)) << Z'^(-1/2 + Re s + eps) pointwise under family GRH, then the sum over K frequencies.
  Output N^(1+eps). By the second bullet this is the true size of the quantity bounded.
* Theorem A, Step 5: abs(Phi Phi*) <= (abs(Phi)^2 + abs(Phi*)^2)/2 on Re z = 1 + eps, then the second moment of L.
  Output X_col^(1+eps) = N^(1+eps) (section 3).

## 3. Decisive test, part 2: Theorem A read in the window; the step where 1/L -> L fails

Theorem A (`c8-liou-row-bound-theorem`, notation there: M rows, X columns; here rows X, columns N): for the
aligned rows conj(gamma_1) in one class, S = D + P + Rem with every term of P >= 0,
c_3 X^(5/6) N^(1/3) <= P <= c_4 X^(5/6) N^(1/3) for C X <= N^2, and abs(Rem) <= C_eps X^(-eps) N^(1+5 eps) for all X.
[PROVED-rel Lemma S there; unmarked class rows.]

Read in the window X < N:
* P/(X D) is of order (N^2/X)^(1/6) = K^(1/6) > 1: the aligned vector violates (E-K) throughout the window, by more
  as X decreases. Proved by Theorem A only where P exceeds the bound for Rem, X > N^(4/5 + eps) (its Corollary B).
* The bound for Rem is N^(1+eps), independent of X. For X < N it is larger than the diagonal X D. So with L in
  the numerator and the Lindelof-on-average second moment as a theorem, the technique gives for the off-diagonal
  remainder exactly what family GRH gives for the Moebius vector in c8 Theorem 2 (a).

**The exact step.** In Step 5 of section 3.4 of Theorem A the Mellin variable z of the row Gaussian sits on
Re z = 1 + eps, where the frequency sum Sum_h q_h^(-1-eps) abs(Phi_{d,e,hd})^2 converges absolutely, and the bound is
(rows)^(-eps) (columns)^(1+5 eps). To gain from a short row range one has to move z to the left of 1. There the
frequency sum no longer converges absolutely, and by Proposition 1 its positive part has the diagonal of size
(N/X) D: the quantity to be bounded is the difference of section 2, for L in the numerator as for 1/L.

**Why the reduction 1/L -> L is not available for the Moebius vector.**
(i) (3.4) of Theorem A: Sum_{c squarefree} psi(c) q_c^(-x) = L^S(x, psi)/L^S(2x, psi^2) uses mu lambda = 1 on squarefree c.
With mu in place of mu lambda the sum is Prod (1 - psi(p) q_p^(-x)) = 1/L^S(x, psi); moving x to Re x = 1/2 + eps is
family GRH [PROVED: the identity; the consequence is c8 Theorem 2].
(ii) Lemma S (BGL Corollary 1.4) is proved from the approximate functional equation: the sum has length
(conductor)^(1/2) = K^(1/2), and the sextic sieve K + K^(1/2) + (K^(3/2))^(2/3) is of size K there [CITED].
1/L has no approximate functional equation. The Moebius sum of length N against K frequencies gives
(K + N + (K N)^(2/3)) N^(-1+eps), O(N^eps) only for K <= N^(1/2), that is X >= N^(3/2) (c8, unconditional range).
(iii) Mollified identity: 1/L = M_y + (1 - L M_y)/L leaves 1/L in the tail. Used as a zero-detector it gives a
zero-density bound N(sigma, K) << K^(A(1-sigma)+eps); through the sextic sieve near sigma = 1 the terms
K N^(1-2 sigma) + N^(2-2 sigma) + K^(2/3) N^(5/3-2 sigma) force polynomial length N >= K^2 and A = 4 [ARGUED; not written
out], which returns K <= N^(1/2), the range of (ii). (MV6) needs K^A <= N^2 (c8).
(iv) In the window K > N even A = 2 (the density hypothesis for the family) and GRH give N^(1+eps): section 2.

**Outcome of the decisive test.** In the window the 1/L mean value does not reduce to moments with L in the
numerator (step (i)-(ii)), and a zero-free region for the whole family, at any strength up to GRH, does not give
the window statement by the available method (section 2). The assigned reduction is dead for this reason. What
is missing is not a bound for a mean value but a cancellation of relative size X/N.

Remark (interpolation gives nothing) [PROVED]. S_X is increasing in X (g_X is), so S_X <= S_N in the window: the
bound N^(1+eps) again (under the hypothesis of Theorem 2). As a function of t = 1/X, S is a Laplace transform of
a positive measure, so log S is convex in t; between t = 1/N and t = P/Z this gives at X = Z the bound
S_Z <= S_N^(P/(P+1)) S_{Z/P}^(1/(P+1)), which is N P^(-2/(P+1)) at the diagonal sizes of the two edges: no gain.

## 4. Pivot: slot decomposition of the marked row, and the named input (CROSS)

Slot primes: primary primes pi prime to 6 with P < q_pi < 2P; u_pi = W(q_pi/P) tau_pi nu(pi) q_pi^(-1/2);
delta = Sum_pi abs(u_pi)^2 = Sum_pi W(q_pi/P)^2/q_pi. For a multiplicative weight nu' let
B^Z_m[nu'] = Sum_{c' squarefree} tau_c' nu'(c') chi_c'(m) q_c'^(-1/2) V(q_c'/Z) be the unmarked row of length Z.

**Lemma S1 [PROVED-rel the twisted multiplicativity of gamma_2 and reciprocity (MS Lemmas 4.2, 4.4), as used in
c8 Corollary 1; checked numerically].** For a prime pi and squarefree c' prime to pi:
tau_{pi c'} = tau_pi tau_c' chi_c'(pi)^4.
Proof. gamma_2(pi c') = gamma_2(pi) gamma_2(c') (chi_pi(c') chi_c'(pi))^2, chi_pi(c') = R(c', pi) chi_c'(pi), R^2 = 1,
alpha multiplicative. QED
Check (`check_slot.py`, `check_slot.log`): 5832 pairs (pi, c') with q_pi <= 60, q_pi q_c' <= 30000:
max abs(tau(pi c') - tau(pi) tau(c') chi_c'(pi)^4) = 1.6e-15.

**Lemma S2 (slot decomposition) [PROVED].** Let xi_pi(c') = chi_c'(pi)^4 (zero if pi | c'). For the marked weight w,

    B_m = Sum_pi u_pi chi_pi(m) B^Z_m[nu xi_pi],
    S_X = Sum_pi abs(u_pi)^2 Sum_{m, (m, pi) = 1} g_X(m) abs(B^Z_m[nu xi_pi])^2  +  Cross_X,
    Cross_X = Sum_{pi != pi'} u_pi conj(u_pi') Sum_m g_X(m) chi_pi(m) conj(chi_pi'(m)) B^Z_m[nu xi_pi] conj(B^Z_m[nu xi_pi']).

Proof. w(c) = Sum_{pi | c} q_pi^(-1/2) W(q_pi/P) q_c'^(-1/2) V(q_c'/Z) with c = pi c'. Insert Lemma S1,
nu(pi c') = nu(pi) nu(c'), chi_{pi c'}(m) = chi_pi(m) chi_c'(m), and exchange the sums. abs(chi_pi(m))^2 = 1_{(m, pi) = 1}. QED

c' -> xi_pi(c') = conj(chi_c'(pi^2)) is a ray class character of F of order 3 with conductor dividing a fixed power
of 6 times pi (MS Lemma 4.1 as quoted in c8). So the first part of S_X is the **unmarked** row moment, column
length Z, for the target eta twisted by a cubic character of conductor pi. A column with two slot primes lies in
two blocks; the phase average of Cross_X is therefore not zero but X (D# - D#_slot), 5 to 7 percent of X D# in the
screen.

**Corollary S3 [PROVED-cond in outline, relative to c8 Theorem 2 (a) with its referee's caveats E2, E3].** Assume
GRH for the Hecke L-functions L(s, eta theta xi_pi chi_.(y)^(-1)), pi in the slot, theta in the fixed ray family,
y != 0. Then the first part of S_X is X D#_slot + O(delta Z^(1+eps)). So for X >= Z the slot-diagonal part satisfies
(E-K), and in the upper half of the window, Z <= X < Z P,

    (E-K) at X    <=>    (CROSS):  Cross_X - X (D# - D#_slot) <= C_eps Z^eps X D#.

In the lower half, Z/P < X < Z, the slot-diagonal part is itself in the conductor window of the twisted unmarked
row (row functional equation lossless for X P <= Z, Poisson for X >= Z), and nothing is gained.

What (CROSS) says. Rows of length Z twisted by two different slot primes, multiplied by the character
chi_pi conj(chi_pi') of m, have small correlation in the mean over q_m <= X, after summation over the P^2/(log P)^2 pairs
with weights of size 1/P. On the dual side every pair (pi c_1, pi' c_1') with pi != pi' has no frequency k = 0, the
frequencies run to K = N^2/X, and the slot primes enter the Moebius vector only through mu(pi) G(pi) R(pi, c_1): a
sign on the four square classes modulo 4. The cubic twist xi_pi is absent on the dual side.

* Aligned vector (dual coefficient 1): the sixth-power frequencies give Cross of order X K^(1/6) delta'^2,
  delta' = Sum_pi W/q_pi, against a slot-diagonal coherent part smaller by the number of slot primes and by
  (Z^2/N^2)^(1/6). The excess of the aligned and Liouville vectors in marked rows is in the cross term [ARGUED;
  MEASURED in section 5: aligned cross +0.035 .. +0.439, slot-diagonal part <= 0.99].
* Moebius vector: the sixth-power part of Cross is X K^(1/6) abs(Sum_pi u~_pi M_1^(pi))^2 with M_1^(pi) the class
  components of the smooth partial sum of 1/L(1, eta theta). Relative to a zero-free abscissa beta* for the ray
  family of the target alone it is <= X K^(1/6) delta'^2 Z^(2 beta* - 2 + eps), below X delta for K <= Z^(12(1 - beta*)), that
  is X >= Z^(1/2) P^2 at beta* = 7/8 (inside the window iff P <= Z^(1/2)) [ARGUED]. The other frequencies are the
  content of (CROSS) and carry the difference structure of section 2.

Status: (CROSS) is a named unproved input for the upper half-window, conditional on the family hypothesis of
Corollary S3, which contains the target (circular in the Prop. 2.1 format, as c8 states for Theorem 2). This does
not meet the score rule: there is no proved window statement, and the model vertex (1/2, 1/2, 1/3) (X = Z, on the
line between the two halves) keeps the status it had in c8.

## 5. Numerical screen

Tools: `w_window.py` (c8 `t2_moment.py` with: dyadic grid X/N = 2^-j down to below P^-2; vectors MUG, MUGc added,
THIN*ALIGN, GAMMA2, RAND2 removed; tree pruned to live columns and ancestors; optional worker pool; per-slot blocks
for the decomposition of Lemma S2), `ek_common.py`, `zomega.py` (copied unchanged), tables `tmp/sextic/data/sf_1e6.npz`
and `sf_1e7.npz` read as data. `w_window.py` at Z = 500, P = 8 reproduces the unmodified script to all printed
digits. Local runs through `scripts/memcap.sh 8`; Z = 16000 on the server through `rhrun` (4 cores, 8 GB).
complex64; a screen, not a verdict.

Definitions. ratio = S_X / (X D#_X) (D# = exact phase average). sd = slot-diagonal part / its phase average.
cr = (Cross_X - its phase average) / (X D#_X). Marked rows, one slot, V(y) = exp(-(log y)^2), W = sin^2.
Window points used for slopes: Z/P < X <= N and X >= 400 (at least about 1450 rows under the Gaussian).
e = least-squares slope of log(ratio) against log X; the mean square is X^(1+e); (E-K) is e = 0.

<!-- TABLES-BEGIN -->
### 5.1 Summary over the window (grid points with Z/P < X <= N and X >= 400)

| Z | P | N | where | points | THETA ratio | e(THETA) | THETA*G ratio | ALIGNED ratio | LIOU ratio | U ratio | RAND1 ratio | THETA cr | ALIGNED cr | slope log cr | LIOU cr | slope log cr | U cr | RAND1 cr |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2000 | 12.6 | 25200 | local | 6 | 0.954 .. 0.995 | +0.012 | 0.964 .. 0.991 | 0.987 .. 1.026 | 0.966 .. 1.013 | 0.981 .. 0.992 | 0.970 .. 0.996 | -0.020 .. -0.001 | +0.035 .. +0.048 | +0.065 | +0.006 .. +0.026 | +0.470 | -0.008 .. +0.006 | +0.001 .. +0.009 |
| 4000 | 16 | 64000 | local | 8 | 0.965 .. 1.007 | +0.007 | 0.893 .. 0.999 | 1.065 .. 1.102 | 1.019 .. 1.028 | 0.993 .. 1.014 | 0.959 .. 1.000 | -0.006 .. +0.012 | +0.079 .. +0.118 | -0.068 | +0.037 .. +0.070 | -0.116 | -0.004 .. +0.009 | -0.005 .. +0.001 |
| 8000 | 20 | 160000 | local | 9 | 0.897 .. 0.998 | +0.018 | 0.910 .. 0.999 | 1.107 .. 1.163 | 1.044 .. 1.089 | 0.976 .. 1.000 | 0.992 .. 1.021 | -0.065 .. -0.004 | +0.120 .. +0.216 | -0.106 | +0.051 .. +0.118 | -0.153 | -0.019 .. -0.001 | -0.004 .. +0.015 |
| 16000 | 25 | 400000 | server | 10 | 0.956 .. 0.997 | +0.006 | 0.961 .. 1.002 | 1.192 .. 1.403 | 1.084 .. 1.221 | 0.990 .. 1.004 | 0.991 .. 1.006 | -0.020 .. -0.003 | +0.203 .. +0.439 | -0.129 | +0.089 .. +0.235 | -0.150 | -0.016 .. +0.002 | -0.008 .. +0.005 |

At the edge X = N (aligned cross term cr, Liouville cross term cr, THETA ratio):

| Z | K = N | ALIGNED ratio | ALIGNED cr | LIOU ratio | LIOU cr | THETA ratio | THETA cr |
|---|---|---|---|---|---|---|---|
| 2000 | 25200 | 1.026 | +0.046 | 1.013 | +0.026 | 0.995 | -0.002 |
| 4000 | 64000 | 1.065 | +0.079 | 1.027 | +0.037 | 1.002 | +0.002 |
| 8000 | 160000 | 1.107 | +0.120 | 1.044 | +0.051 | 0.998 | -0.004 |
| 16000 | 400000 | 1.192 | +0.203 | 1.084 | +0.089 | 0.997 | -0.003 |

### 5.2 Full grids

**Z = 2000, P = 12.6, N = 25200** (`w_Z2000_P12.log`): prime table 2662 primes, 106574 columns in the table, 36197 live columns, 457008 rows, slot norms [13, 13, 19, 19, 25]; window X/N in (0.0063, 1), X in (159, 25200).

| X/N | X | X/Z | in window | THETA | THETA*G | LIOU | ALIGNED | THIN | U | RAND1 | THETA sd | THETA cr | LIOU cr | ALIGNED cr | U cr | RAND1 cr |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.0078 | 197 | 0.098 | yes | 0.899 | 0.983 | 1.034 | 0.975 | 0.956 | 0.954 | 0.966 | 0.944 | -0.048 | +0.036 | +0.027 | -0.012 | +0.027 |
| 0.0156 | 394 | 0.197 | yes | 0.936 | 0.985 | 0.996 | 0.977 | 0.962 | 0.986 | 0.966 | 0.967 | -0.033 | +0.017 | +0.027 | +0.005 | +0.014 |
| 0.0312 | 788 | 0.394 | yes | 0.954 | 0.973 | 0.970 | 0.987 | 0.973 | 0.990 | 0.970 | 0.973 | -0.020 | +0.006 | +0.035 | +0.006 | +0.009 |
| 0.0625 | 1575 | 0.787 | yes | 0.968 | 0.964 | 0.966 | 0.999 | 0.981 | 0.985 | 0.980 | 0.974 | -0.008 | +0.006 | +0.043 | -0.000 | +0.008 |
| 0.1250 | 3150 | 1.575 | yes | 0.979 | 0.966 | 0.977 | 1.008 | 0.984 | 0.981 | 0.989 | 0.982 | -0.003 | +0.011 | +0.047 | -0.007 | +0.006 |
| 0.2500 | 6300 | 3.150 | yes | 0.989 | 0.974 | 0.990 | 1.014 | 0.988 | 0.983 | 0.994 | 0.990 | -0.002 | +0.017 | +0.048 | -0.008 | +0.004 |
| 0.5000 | 12600 | 6.300 | yes | 0.994 | 0.984 | 1.002 | 1.019 | 0.993 | 0.988 | 0.996 | 0.995 | -0.001 | +0.022 | +0.047 | -0.006 | +0.002 |
| 1.0000 | 25200 | 12.600 | edge | 0.995 | 0.991 | 1.013 | 1.026 | 0.996 | 0.992 | 0.996 | 0.996 | -0.002 | +0.026 | +0.046 | -0.003 | +0.001 |
| 2.0000 | 50400 | 25.200 | no | 0.995 | 0.995 | 1.020 | 1.031 | 0.997 | 0.995 | 0.996 | 0.998 | -0.003 | +0.028 | +0.045 | -0.001 | +0.000 |

**Z = 4000, P = 16, N = 64000** (`w_Z4000_P16.log`): prime table 4941 primes, 272702 columns in the table, 72933 live columns, 580380 rows, slot norms [19, 19, 25, 31, 31]; window X/N in (0.0039, 1), X in (250, 64000).

| X/N | X | X/Z | in window | THETA | THETA*G | LIOU | ALIGNED | THIN | U | RAND1 | THETA sd | THETA cr | LIOU cr | ALIGNED cr | U cr | RAND1 cr |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.0020 | 125 | 0.031 | no | 0.868 | 0.878 | 1.091 | 1.196 | 0.942 | 1.044 | 0.926 | 0.914 | -0.051 | +0.134 | +0.166 | +0.051 | -0.014 |
| 0.0039 | 250 | 0.062 | no | 0.931 | 0.884 | 1.056 | 1.150 | 0.971 | 1.029 | 0.945 | 0.955 | -0.027 | +0.102 | +0.141 | +0.028 | -0.005 |
| 0.0078 | 500 | 0.125 | yes | 0.965 | 0.893 | 1.028 | 1.102 | 0.985 | 1.014 | 0.959 | 0.969 | -0.006 | +0.070 | +0.118 | +0.009 | +0.001 |
| 0.0156 | 1000 | 0.250 | yes | 0.982 | 0.910 | 1.019 | 1.076 | 0.992 | 1.004 | 0.971 | 0.975 | +0.005 | +0.053 | +0.104 | -0.002 | -0.001 |
| 0.0312 | 2000 | 0.500 | yes | 0.995 | 0.935 | 1.020 | 1.069 | 0.993 | 1.001 | 0.980 | 0.983 | +0.011 | +0.047 | +0.099 | -0.004 | -0.004 |
| 0.0625 | 4000 | 1.000 | yes | 1.002 | 0.959 | 1.023 | 1.070 | 0.992 | 0.998 | 0.987 | 0.990 | +0.012 | +0.046 | +0.100 | -0.004 | -0.005 |
| 0.1250 | 8000 | 2.000 | yes | 1.006 | 0.979 | 1.024 | 1.070 | 0.992 | 0.995 | 0.992 | 0.996 | +0.010 | +0.044 | +0.098 | -0.003 | -0.003 |
| 0.2500 | 16000 | 4.000 | yes | 1.007 | 0.991 | 1.022 | 1.069 | 0.993 | 0.993 | 0.996 | 1.000 | +0.007 | +0.041 | +0.092 | -0.003 | -0.000 |
| 0.5000 | 32000 | 8.000 | yes | 1.004 | 0.997 | 1.024 | 1.068 | 0.995 | 0.993 | 0.999 | 1.001 | +0.003 | +0.038 | +0.086 | -0.002 | +0.001 |
| 1.0000 | 64000 | 16.000 | edge | 1.002 | 0.999 | 1.027 | 1.065 | 0.996 | 0.994 | 1.000 | 1.000 | +0.002 | +0.037 | +0.079 | -0.002 | +0.001 |

**Z = 8000, P = 20, N = 160000** (`w_Z8000_P20.log`): prime table 9264 primes, 687079 columns in the table, 145509 live columns, 1451094 rows, slot norms [25, 31, 31, 37, 37]; window X/N in (0.0025, 1), X in (400, 160000).

| X/N | X | X/Z | in window | THETA | THETA*G | LIOU | ALIGNED | THIN | U | RAND1 | THETA sd | THETA cr | LIOU cr | ALIGNED cr | U cr | RAND1 cr |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.0010 | 156 | 0.020 | no | 0.784 | 0.816 | 1.123 | 1.238 | 0.936 | 0.906 | 1.053 | 0.887 | -0.112 | +0.176 | +0.299 | -0.076 | +0.026 |
| 0.0020 | 312 | 0.039 | no | 0.850 | 0.868 | 1.102 | 1.183 | 0.962 | 0.944 | 1.039 | 0.929 | -0.084 | +0.140 | +0.245 | -0.045 | +0.021 |
| 0.0039 | 625 | 0.078 | yes | 0.897 | 0.910 | 1.089 | 1.163 | 0.979 | 0.976 | 1.021 | 0.959 | -0.065 | +0.118 | +0.216 | -0.019 | +0.015 |
| 0.0078 | 1250 | 0.156 | yes | 0.930 | 0.944 | 1.082 | 1.160 | 0.988 | 0.995 | 1.009 | 0.977 | -0.048 | +0.107 | +0.202 | -0.006 | +0.012 |
| 0.0156 | 2500 | 0.312 | yes | 0.951 | 0.969 | 1.079 | 1.155 | 0.988 | 1.000 | 1.001 | 0.984 | -0.034 | +0.101 | +0.189 | -0.001 | +0.007 |
| 0.0312 | 5000 | 0.625 | yes | 0.965 | 0.982 | 1.076 | 1.146 | 0.987 | 0.998 | 0.994 | 0.989 | -0.025 | +0.097 | +0.174 | -0.002 | -0.000 |
| 0.0625 | 10000 | 1.250 | yes | 0.977 | 0.987 | 1.069 | 1.139 | 0.989 | 0.994 | 0.992 | 0.996 | -0.020 | +0.089 | +0.162 | -0.004 | -0.004 |
| 0.1250 | 20000 | 2.500 | yes | 0.985 | 0.991 | 1.062 | 1.132 | 0.992 | 0.993 | 0.994 | 1.002 | -0.016 | +0.078 | +0.152 | -0.005 | -0.004 |
| 0.2500 | 40000 | 5.000 | yes | 0.991 | 0.994 | 1.054 | 1.123 | 0.995 | 0.995 | 0.996 | 1.004 | -0.012 | +0.067 | +0.141 | -0.004 | -0.003 |
| 0.5000 | 80000 | 10.000 | yes | 0.995 | 0.997 | 1.047 | 1.115 | 0.997 | 0.997 | 0.997 | 1.003 | -0.008 | +0.057 | +0.130 | -0.002 | -0.002 |
| 1.0000 | 160000 | 20.000 | edge | 0.998 | 0.999 | 1.044 | 1.107 | 0.999 | 0.999 | 0.998 | 1.003 | -0.004 | +0.051 | +0.120 | -0.001 | -0.001 |

**Z = 16000, P = 25, N = 400000** (`w_Z16000_P25.log`): prime table 17338 primes, 1728003 columns in the table, 371888 live columns, 3627558 rows, slot norms [31, 31, 37, 37, 43, 43]; window X/N in (0.0016, 1), X in (640, 400000).

| X/N | X | X/Z | in window | THETA | THETA*G | LIOU | ALIGNED | THIN | U | RAND1 | THETA sd | THETA cr | LIOU cr | ALIGNED cr | U cr | RAND1 cr |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.0005 | 195 | 0.012 | no | 0.903 | 0.916 | 1.281 | 1.525 | 1.016 | 0.985 | 1.006 | 0.930 | -0.035 | +0.291 | +0.551 | -0.037 | +0.000 |
| 0.0010 | 391 | 0.024 | no | 0.939 | 0.929 | 1.247 | 1.444 | 0.997 | 0.983 | 1.011 | 0.955 | -0.020 | +0.259 | +0.481 | -0.025 | +0.007 |
| 0.0020 | 781 | 0.049 | yes | 0.956 | 0.961 | 1.221 | 1.403 | 0.999 | 0.990 | 1.006 | 0.973 | -0.020 | +0.235 | +0.439 | -0.016 | +0.005 |
| 0.0039 | 1562 | 0.098 | yes | 0.970 | 0.988 | 1.190 | 1.378 | 1.003 | 0.997 | 0.998 | 0.986 | -0.017 | +0.209 | +0.411 | -0.009 | -0.001 |
| 0.0078 | 3125 | 0.195 | yes | 0.980 | 1.000 | 1.163 | 1.348 | 1.004 | 1.000 | 0.993 | 0.992 | -0.013 | +0.183 | +0.378 | -0.005 | -0.006 |
| 0.0156 | 6250 | 0.391 | yes | 0.984 | 1.002 | 1.141 | 1.316 | 1.002 | 1.002 | 0.991 | 0.995 | -0.012 | +0.161 | +0.343 | -0.001 | -0.008 |
| 0.0312 | 12500 | 0.781 | yes | 0.988 | 1.000 | 1.126 | 1.289 | 1.000 | 1.004 | 0.991 | 0.998 | -0.011 | +0.145 | +0.312 | +0.001 | -0.006 |
| 0.0625 | 25000 | 1.562 | yes | 0.991 | 0.999 | 1.117 | 1.264 | 0.998 | 1.004 | 0.993 | 1.000 | -0.009 | +0.134 | +0.284 | +0.002 | -0.004 |
| 0.1250 | 50000 | 3.125 | yes | 0.993 | 0.998 | 1.110 | 1.240 | 0.998 | 1.003 | 0.994 | 1.000 | -0.007 | +0.123 | +0.258 | +0.002 | -0.003 |
| 0.2500 | 100000 | 6.250 | yes | 0.994 | 0.998 | 1.103 | 1.219 | 0.998 | 1.002 | 0.996 | 0.999 | -0.005 | +0.113 | +0.235 | +0.000 | -0.001 |
| 0.5000 | 200000 | 12.500 | yes | 0.996 | 0.999 | 1.094 | 1.204 | 0.998 | 1.001 | 0.997 | 0.999 | -0.003 | +0.101 | +0.218 | -0.000 | -0.001 |
| 1.0000 | 400000 | 25.000 | edge | 0.997 | 0.999 | 1.084 | 1.192 | 0.999 | 1.000 | 0.998 | 1.000 | -0.003 | +0.089 | +0.203 | -0.000 | -0.001 |
<!-- TABLES-END -->

### 5.3 Reading

* **Theta vector: no excess at any window point.** Largest ratio in the window 0.995, 1.007, 0.998, 0.997 at
  Z = 2000, 4000, 8000, 16000. The slope e is positive (+0.006 to +0.018) because the ratio is below 1 near the
  lower edge (0.90 at Z = 8000, X = 625; 0.956 at Z = 16000, X = 781) and returns to 1 at X = N: a deficit,
  present in the slot-diagonal part and in the cross term alike. A deficit is admissible in (E-K) (Lemma 0:
  Off >= -D#). Random phases do not show it (0.99 .. 1.02), so it is a property of the theta vector near
  X = Z/P, where the reflected row is shorter than the row; it was not analysed.
* **Exponent of the excess, as the assignment asks.** For the theta vector there is no excess to fit; in the
  form "mean square = X^(1+e)" the fitted e is +0.012, +0.007, +0.018, +0.006 at the four sizes, with the sign
  explained above. Nothing in the data is at the level of the K-loss (an operator bound allows ratio N/X, up to
  P^2 = 160 .. 625).
* **Aligned and Liouville vectors: excess at every window point from Z = 4000 on, growing with Z and toward the
  lower edge.** At X = N the aligned cross term is +0.046, +0.079, +0.120, +0.203 of the diagonal and the
  Liouville cross term +0.026, +0.037, +0.051, +0.089. Inside the window the aligned cross term rises to +0.118,
  +0.216, +0.439 at the lowest point used (Z = 4000, 8000, 16000) and the total aligned ratio to 1.10, 1.16, 1.40.
  Slope of log cr against log X: -0.068, -0.106, -0.129 (aligned), -0.116, -0.153, -0.150 (Liouville). The
  sixth-power count K^(1/6) predicts -1/6 = -0.167. At Z = 2000 the slopes have the other sign and the total
  aligned ratio is within 3 percent of 1: at that size the control is not separated from the noise.
* **The excess of both controls is in the cross term.** Their slot-diagonal part is 0.94 .. 0.99 of its phase
  average at every window point of every run. This is the statement of section 4: the coherent term is carried
  by pairs of distinct slot primes.
* **Size compared with round 8** (+38 to +63 percent, unmarked rows, Z <= 8000): in marked rows the diagonal is
  linear in the slot mass (D# = 0.015 .. 0.033) and the coherent term is quadratic in it; the aligned excess
  reaches +40 percent only at Z = 16000 near the lower edge.
* **U and random phases**: ratio 0.96 .. 1.02, cross within -0.019 .. +0.015. Not separated from the theta vector.
  THIN (b = 0.9): 0.97 .. 1.00.

### 5.4 The absolute frequency form for K > N (section 2)

`w_Z2000_unmarked.log`: unmarked columns at Z = 2000 (6767 squarefree columns with cube parts as in c8), rows up to
X = 64 N in the role of the frequency k, vectors MUG = mu G and MUGc = mu conj(G) with the row weights q^(-1/2) V.

| rows/columns scale (K/N) | 1 | 2 | 4 | 8 | 16 | 32 | 64 |
|---|---|---|---|---|---|---|---|
| MUG: form / diagonal | 0.998 | 0.994 | 0.991 | 0.991 | 0.992 | 0.994 | 0.996 |
| MUGc: form / diagonal | 1.011 | 1.004 | 1.001 | 0.999 | 0.996 | 0.995 | 0.996 |

### 5.5 Identity checks

`check_slot.log`: tau(pi c') = tau(pi) tau(c') chi_c'(pi)^4 to 1.6e-15 on 5832 pairs (Lemma S1);
G(pi c') = +-G(pi) G(c') to 2.8e-15 on the same pairs, the sign constant on each of the 132 pairs of residue classes
modulo 4 that occur (the dual-side remark of section 4). G from (4.7) against the four-term formula: 4e-9 at every
size (line "check G" of each log).

## 6. Controls

No statement about zeros is made, so no control has to fail for a conclusion. What each control does to the
window statement:

| control | (MV6-W) / (E-K) in the window | reason, and where |
|---|---|---|
| aligned vector conj(gamma_1) (dual coefficient 1) | fails | Theorem A: P of order X K^(1/6) for unmarked rows [PROVED-rel, X > N^(4/5)]; marked rows MEASURED +7 to +40 percent at Z = 4000, 8000, 16000 (within 3 percent of 1 at Z = 2000), all of it in Cross (section 5) |
| Liouville twist (tau mu) | fails | mu lambda = 1 on squarefree columns: the reciprocal has a pole at 1; MEASURED +2 to +22 percent in marked rows at Z = 4000, 8000, 16000, in Cross; smaller than the round-8 unmarked values (+38 to +63 percent) because the coherent term is quadratic in the slot mass delta and the diagonal is linear |
| U (random completely multiplicative unimodular twist) | holds | MEASURED 0.98 .. 1.01 in the window; cross -0.019 .. +0.009 |
| random column phases | holds, at the diagonal | phase average is exactly X D#; not a separator (as the assignment states) |
| random phases on the slot primes only | first part of Lemma S2 on average | with independent unimodular phases on the slot blocks the mean of S_X is the slot-diagonal part exactly; by positivity and Markov the window statement holds for most slot phases wherever the slot-diagonal part satisfies (E-K) [PROVED from Lemma S2; conditional through Corollary S3]. Not a separator. |
| THIN (b = 0.9) | below resolution | MEASURED 0.97 .. 1.00, as in c8 |
| DH | no row family | a finite combination has no row moment of its own; the low side is linear, so the statement is that of its members |
| backward heat, T-NR, Beurling, phase-rotated transfer operator, theta^w, zeta(s+a) zeta(s-a) | not applicable | no positivity or zero statement |

## 7. Requirement flags

R1 false, R2 false, R3 false, R4 false; evidence in the table at the top. aboutZeros: false.

## 8. Three weakest steps

1. **Section 2, "a proof cannot put absolute values on the frequency sum".** Proved: the identity and the phase
   average. Measured: the Moebius vector at one size (Z = 2000, K/N up to 64), with the row weights q^(-1/2) V in
   place of the dual weights q^(-1) V. Argued, not proved: that the majorants of Theorem 2 and Theorem A are bounded
   below by a constant times X N_K (they bound sums over g, d, e of Mellin integrals of abs(M M*), not N_K itself),
   and the description of Off_X as "positive form minus its diagonal" (the Gaussian coupling
   exp(-kappa X q_k/(q_c q_c')) is not of rank one, and the positivity is the c8 referee's for the leading term).
   A method that keeps the signs of the e-sum, or works on the row side, is not excluded.
2. **Corollary S3.** It inherits c8 Theorem 2 (a), which its referee labels an outline for squarefree unmarked
   columns; the twist by xi_pi (conductor pi, uniformity in pi) and the coprimality (m, pi) = 1 are not written. The
   lower half-window is only described. The row functional equation of MS Prop. 5.1 for the twisted row was not
   replayed.
3. **The screen.** 5 or 6 slot primes; P is between 12.6 and 25; the window has 6 to 10 dyadic points with enough
   rows; the aligned excess is at most 40 percent and the slope of its cross term changes sign between Z = 2000
   and Z = 4000 (three sizes agree in sign after that). The deficit of the theta vector near the lower edge (ratio 0.90) is not explained. The sixth-power count is
   logarithmic at these sizes (c8 referee E5). The screen shows no excess for the theta vector and a positive cross
   term for the aligned controls at every window point; it supports no exponent in either direction.

## Follow-up (one item)

Decide (CROSS) in the function-field model of `c8-ek-ff-reflected-rows-exact` (exact integers, Weil targets):
split its row energy by pairs of marked primes, and compare the cross term with the squared probe signal B_coh
that the model already isolates. If Cross = B_coh + O(diagonal) there, (CROSS) for a GRH target is the statement
"squared signal below the diagonal", which is the model's bulk result, and the upper half-window would be closed
in the model with the mechanism named.

## Files

- `RESULT.md`, `lanes_line.json`
- `w_window.py` (screen), `w_window_v1.py` (first version, without the slot blocks), `fit.py`, `mk_tables.py`,
  `assemble.py`, `check_slot.py`, `check_slot2.py`,
  `ek_common.py`, `zomega.py`, `t2_moment.py` (c8 original, unchanged)
- logs and data: `w_Z500_P8.log`, `w_Z2000_P12.log/.json`, `w_Z4000_P16.log/.json`, `w_Z8000_P20.log/.json`,
  `w_Z8000_P20_v1.log/.json`, `w_Z16000_P25.log/.json` (server), `w_Z2000_unmarked.log/.json`, `check_slot.log`,
  `fit.log`
