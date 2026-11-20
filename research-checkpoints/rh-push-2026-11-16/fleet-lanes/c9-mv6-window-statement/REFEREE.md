# REFEREE (adversarial, lens: general) for c9-mv6-window-statement

Date 2026-11-18. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction. Only this file was
written in the lane directory. Referee scripts and logs are in `/tmp/ref_c9_general/` (scratch, outside the repo):
`s2check.py`, `prop1.py`, `e1term.py`, `indep.py`, and reruns of the lane's `check_slot.py` and `w_window.py` at
sizes the lane did not use. All runs local, one process, through `scripts/memcap.sh 8`. The compute server was not
used for computation; one read-only `rhstatus` call showed no active unit attributable to this lane (the active
`rh-c9mv6ff-*` units belong to another slug).

## Verdict

**The negative outcome holds: no window statement is proved, the headline is unchanged, all four requirement
flags are false. The steps labelled PROVED (Lemma 0, Proposition 1, Lemma S1, Lemma S2, the interpolation remark)
were re-derived and confirmed. The label "precise obstruction" is stronger than what is established: the
obstruction is a statement about two named proof techniques, its central step is ARGUED plus MEASURED (the lane's
own section 8 item 1 says so), and its content is the standard duality fact that the dual of a mean square with
K > N frequencies has a diagonal of size K, which c8 item 6 had already stated in words. Corrections E1 to E7
below change labels and wording, not the outcome.**

No statement about zeros is made and none is licensed. Nothing assumes RH; GRH for the twist family appears only
as a labelled hypothesis (Corollary S3, c8 Theorem 2). Verified height is not used.

## 1. Steps re-derived

1. **Lemma 0.** From c8 Lemma 1 and Corollary 1 (both confirmed by the c8 referee for squarefree columns):
   a_{g c_1} gt_1(k, c_1) = tau_g mu(c_1) G(c_1) conj(chi_{c_1}(k g^2)) (nu w)(g c_1); the conjugate factor for c_1'
   with -k; abs(tau_g) = 1; (q_{c_1} q_{c_1'})^(-1/2) absorbed in m_g; the factor X taken out. The display (MV6-W) is
   the off-diagonal of Lemma 1 divided by X. k = 0 vanishes when c_1 c_1' != 1 (one of the two Gauss sums is 0).
   Off_X >= -D#_X is S_X >= 0. The estimate D#_X = D + O(X^(-1) Sum abs(a_c)^2 2^omega(c)) was replayed
   (theta(Y) = Y theta(1/Y) for this normalisation; divisors with q_d > X contribute at most 2 each). Correct.
   Lemma 0 is a restatement of c8 Lemma 1 + Corollary 1 in one display; the equivalence is immediate.
2. **Proposition 1.** The identity is the definition of D# and Off with K in place of X; the phase average is
   the diagonal. Correct, and without content beyond the definition. abs(m_1(c))^2 = abs(a_c)^2/q_c, so
   K D(m_1) is (K/N) D(a) up to the spread of q_c over the support. Correct.
3. **Interpolation remark.** g_X increasing in X; S as a function of t = 1/X is a Laplace transform of a
   positive measure, log-convex; the weight at t = 1/Z between 1/N and P/Z is P/(P + 1); the bound is
   N P^(-2/(P+1)) against the target N/P. Arithmetic confirmed.
4. **Exponent arithmetic of section 3.** P/(X D) = (N^2/X)^(1/6); P > N^(1+eps) iff X > N^(4/5 + ...);
   (K + N + (K N)^(2/3))/N <= 1 iff K <= N^(1/2) iff X >= N^(3/2); sieve at conductor K with length K^(1/2) has
   size K; K^(2/3) N^(-1/3) <= 1 iff N >= K^2; K^(1/6) Z^(2 beta* - 2) <= 1 iff K <= Z^(12(1 - beta*)), at 7/8:
   X >= Z^(1/2) P^2, inside the window iff P < Z^(1/2). All confirmed. Theorem A, Step 5 and identity (3.4) were
   opened in `c8-liou-row-bound-theorem/RESULT.md` and read as quoted (bound abs(Rem) <= C M^(-eps) X^(1+5 eps) on
   Re z = 1 + eps; (1 + u) = (1 - u^2)/(1 - u) puts L in the numerator only for the weight mu lambda = 1).
5. **Lemma S1.** gamma_2(pi c') = gamma_2(pi) gamma_2(c') (chi_pi(c') chi_c'(pi))^2, chi_pi(c') = R(c', pi) chi_c'(pi),
   R^2 = 1, alpha multiplicative: tau_{pi c'} = tau_pi tau_c' chi_c'(pi)^4. Correct relative to the twisted
   multiplicativity of gamma_2.
6. **Lemma S2.** w(pi c') splits over the slot primes of c; with S1 and nu(pi c') = nu(pi) nu(c') the marked row is
   Sum_pi u_pi chi_pi(m) B^Z_m[nu xi_pi]; xi_pi(c') = chi_c'(pi)^4 is multiplicative in c' and zero for pi | c'.
   Correct. A column with two slot primes has a_c = t_1 + t_2 with both terms on the common phase tau_c nu(c),
   so D# - D#_slot >= 0. Correct.
7. **Corollary S3 (outline).** Given the first part = X D#_slot + O(delta Z^(1+eps)) and D# - D#_slot <= D#, the
   equivalence of (E-K) with (CROSS) for X >= Z follows with changed constants. The equivalence is the identity
   S = slot part + Cross with the slot part assumed controlled; it adds a name, not a reduction. The input is an
   outline (uniformity in pi and the condition (m, pi) = 1 not written), as the lane states.

## 2. Numerical checks rerun with different cases

| check | lane | referee (different case) | outcome |
|---|---|---|---|
| Lemma S1 | 5832 pairs, q_pi q_c' <= 30000, 1.6e-15 | `check_slot.py 90000`: 17536 pairs, q_pi q_c' <= 89989, max deviation 1.67e-15, no missed lookup | confirmed |
| Lemma S2 as stated (marked row = sum of twisted unmarked rows) | not tested directly: `w_window.py` splits the row by column blocks, which is an identity without S1 | `s2check.py` (own code): Z = 60, P = 9 (slot norms 13, 13) and Z = 100, P = 17 (slot norms 19, 19, 25, 31, 31, one inert prime), 200 random rows each: max abs(direct - slot form) = 6.3e-16 and 9.2e-16 | confirmed |
| Proposition 1 for the Moebius vector | Z = 2000, row weights q^(-1/2) V, cube parts present: 0.991 .. 1.011 | (i) `w_window.py 1200 --xmax 64`: MUG 0.989 .. 1.008, MUGc 0.983 .. 0.999 at K/N = 1 .. 64. (ii) `prop1.py` (own code), Z = 1500, dual weights q^(-1) V, squarefree columns only, conj(chi_c(k)): MUG 0.986 .. 0.999, MUGc 0.987 .. 0.995, mu alone 0.989 .. 1.002, random phases 0.980 .. 1.005, constant vector 1.54 falling to 1.02 (K/N = 1 .. 32) | confirmed, and now with the weights of the dual side and without cube parts |
| "Off_X = positive form minus its diagonal" (section 2, ARGUED) | not tested | `e1term.py` (own code), unmarked, Z = 60, 67 squarefree columns, narrow V, g = d = 1, all frequencies: the form with the coprimality dropped (e = 1) is 0.604, 0.290, 0.135, 0.058 at X/Z = 1/4, 1/2, 1, 2; its diagonal 0.630, 0.315, 0.157, 0.078; (N_eff/X) D = 0.630, 0.315, 0.158, 0.079; the coprime part is -0.026, -0.025, -0.022, -0.019 and the row side gives Off = -0.028, -0.026, -0.023, -0.019 (D# = 0.142 .. 0.147). R(c, c) chi_c(-1) = +1 on the diagonal is what makes the diagonal positive | the structure is confirmed at this size: the e = 1 form is 4.3 D# at X = Z/4 while Off is -0.2 D# |
| screen code | `w_window.py` | `indep.py` (own weights and loops), Z = 600, P = 9.5, X/N = 1/32, 1/8, 1/2, 1: ratio, sd and cr of THETA, LIOU, ALIGNED agree with `w_window.py 600 9.5` to the four printed digits (one last-digit difference) | the screen computes what it says |
| window screen at a new size | Z = 2000, 4000, 8000, 16000 | `w_window.py 3000 12.9` (slot norms 13, 13, 19, 19, 25; 49092 live columns; 5.6e6 rows; 21 minutes): see section 3 | THETA: no excess, confirmed. Controls: not separated at this size |

Tables 5.1, 5.2 and 5.4 of RESULT were compared with `fit.log` and the `w_Z*.log` files: every quoted range and
slope matches.

## 3. Referee run Z = 3000, P = 12.9 (N = 38700; window X in (233, 38700))

Window points with X >= 400 (X = 605, 1209, 2419, 4838, 9675, 19350, 38700), from `/tmp/ref_c9_general/m_Z3000_P12.9.log`:

| vector | ratio | sd | cr |
|---|---|---|---|
| THETA | 0.959 .. 0.994 | 0.970 .. 0.998 | -0.016 .. -0.003 |
| THETA*G | 0.933 .. 0.992 | | |
| ALIGNED | 0.993 .. 1.033 | 0.947 .. 0.978 | +0.043 .. +0.062 |
| LIOU | 0.973 .. 1.015 | 0.957 .. 0.988 | +0.014 .. +0.027 |
| U | 0.978 .. 1.004 | 0.984 .. 0.994 | -0.009 .. +0.016 |
| RAND1 | 0.998 .. 1.035 | 1.001 .. 1.012 | -0.006 .. +0.023 |
| THIN | 0.970 .. 0.998 | | |

Reading. (i) The theta vector has no excess at any window point and the same deficit toward the lower edge as in
the lane's runs (0.95 at X = 302, 0.92 at X = 151). (ii) The cross term of the aligned vector is positive at
every point and its slot-diagonal part is below 1, as the lane reports. (iii) At this size the controls are not
separated: the total aligned ratio is at most 1.033 and RAND1 reaches 1.035; the aligned cross term (+0.04 to
+0.06) is two to three times the cross term of the random vectors (up to +0.023, and +0.033 at X = 302). The
slot here is the slot of the lane's Z = 2000 run (norms 13, 13, 19, 19, 25), and the result is the same as there
("within 3 percent of 1"). So the separation of the controls reported "from Z = 4000 on" starts with the change
of slot (norms 19 .. 31 and above), and the three sizes that show it have three different slots. The growth with
Z is therefore not separated from the dependence on the slot primes. This does not affect the theta result.

## 4. Errors and gaps

**E1 (label of the verdict).** "Precise obstruction" and, in the claim line, "so the window statement is a
cancellation of relative size X/N, not a mean value" rest on three things of different status: the identity of
Proposition 1 (definition), the measured value N_K/(K D#) for the Moebius vector (float screen; confirmed here at
two further sizes), and the ARGUED description of Off_X as a positive form minus its diagonal (confirmed here
numerically at one small size, not proved: the Gaussian coupling is not of rank one, as section 8 item 1 says).
No lower bound N_K(m_1) >= c K D is proved for the Moebius vector. What is established is: the two named
techniques (c8 Theorem 2 (a); Theorem A Step 5) output N^(1+eps), and the quantity they bound has that size on
average over phases and, by measurement, for the Moebius vector. A method that keeps the signs of the e-sum, or
works on the row side, is not excluded (stated in section 8, absent from the verdict and the claim line). Correct
wording: "obstruction for the two absolute-value techniques; ARGUED + MEASURED".

**E2 (novelty).** Proposition 1 is the duality principle of the large sieve: a bilinear form with K frequencies
and N terms has a diagonal of size max(K, N) on each side. c8 item 6 already says "Poisson in m: dual length
N^2/X, usable iff X >= N; the window is the range where both duals are longer than their row sets", and c8
section 5 says "Lemma 1 buys nothing there". This lane quantifies that sentence (measured ratio, the exact step in
Theorem A); it does not add a new closed row. Lemma 0 is a display of c8 Lemma 1 + Corollary 1.

**E3 (verdict item 3, label "PROVED-rel Theorem A").** Theorem A is a theorem about unmarked class rows
(columns of length X_col, no slot). The window Z/P < X < Z P is empty without marks (the lane's section 1). What
is PROVED-rel is: for unmarked aligned rows with fewer rows than columns, P >= c X^(5/6) N^(1/3) and
abs(Rem) <= N^(1+eps). The transfer to marked rows ("for that vector the conclusion is false in the whole window")
is by analogy plus the screen: in marked rows the coherent term is quadratic and the diagonal linear in the slot
mass, and the measured excess is +7 to +40 percent, not K^(1/6). Section 6 states this correctly; verdict item 3
and the claim line do not. Also: Theorem A's vector is conj(gamma_1) in one class (the screen's ALIGNED); item 3
calls it "the Liouville vector". Within one class the two differ by a constant phase; in the screen they are
different columns with different values.

**E4 (what Theorem A shows about the technique).** The N^(1+eps) bound for Rem is not shown to be sharp for the
aligned vector (for that vector P dominates and Rem is not measured). The no-go for "L in the numerator" is: the
written proof takes absolute values on Re z = 1 + eps and its output does not depend on the number of rows. That
is a statement about one written proof, labelled correctly in section 3 ("the exact step") and too strongly in
the verdict ("is not reducible to moments with L in the numerator").

**E5 (number).** Section 4: "the phase average of Cross_X is ... 5 to 7 percent of X D# in the screen". From the
logs DIAGs/DIAG = 0.951, 0.941, 0.926, 0.900 at Z = 2000, 4000, 8000, 16000: 5, 6, 7 and 10 percent.

**E6 (Proposition 1, measured object).** The lane's measurement uses row weights q^(-1/2) V and columns with cube
parts and the theta cube-part coefficients, not the vector m_1 of (MV6-W). Stated in section 8. The referee run
`prop1.py` uses the dual weights without cube parts and gives the same result, so the conclusion stands.

**E7 (screen resolution).** Five or six slot primes, and the slot changes with Z (section 3: at Z = 3000 with the
slot of Z = 2000 the controls are not separated from the random vector, so "growing with Z" is confounded with the
choice of slot); the THETA deficit near the lower edge (0.90) is unexplained
and is of the same size as the control excess at Z = 4000; U has cr up to +0.12 and THIN falls to 0.75 at
Z = 600 (referee run), so values within about 5 percent of 1 carry no information below Z = 4000. The lane says
"a screen, not evidence for an exponent"; agreed. The slopes -0.07 .. -0.15 "against -1/6 predicted" should not be
read as support for the sixth-power count (c8 referee E5 applies).

Not errors: the citation "BGL Corollary 1.4" and the sextic sieve shape were not reopened here (opened by the
referee of `c8-liou-row-bound-theorem`); the row functional equation range X <= Z/P (MS Prop. 5.1) is quoted, not
replayed, as stated.

## 5. Controls

The lane claims no zeta-only mechanism, so no control has to fail. Run by the referee (sections 2, 3): random
column phases and the generic unimodular twist U satisfy the window statement at the diagonal; the aligned and
Liouville vectors exceed it, in the cross term; the constant vector violates the dual form at K = N (1.54).
The property (E-K) in the window is therefore not specific to the theta vector among unimodular vectors, which is
the lane's own reading (R1 false). DH, backward heat, T-NR, Beurling, the phase-rotated transfer operator,
theta^w and zeta(s+a) zeta(s-a) have no instance of the statement; nothing is claimed for them.

## 6. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | the window property holds for random phases and for U; multiplicativity enters the formula, not the property; nothing is proved for the theta vector |
| R2 | false | a mean square over rows at a fixed target; no statement in height |
| R3 | false | generic controls pass; no conclusion exists for a control to fail |
| R4 | false | no abscissa reached; the only conditional statement (Corollary S3) assumes GRH for a family containing the target |

## 7. Summary

holds = true for the negative verdict with corrected labels. Surviving claim: Lemma 0 (display and equivalence,
relative to c8), Proposition 1 (identity), Lemmas S1 and S2 (slot decomposition, confirmed by an independent
check of the statement itself), the conditional outline S3 with the named unproved input (CROSS), and a float
screen in which the theta vector shows no excess in the window while the aligned and Liouville vectors show an
excess located in the cross term. The obstruction is: the two absolute-value techniques return N^(1+eps) in the
window, and the form they bound has that size (ARGUED, MEASURED; not a theorem excluding other methods).
