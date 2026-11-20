# REFEREE (adversarial, lens: general) for c19-hq2-screen-fe-int-mult-pos-devices/RESULT.md

Date 2026-11-19 (local). Referee runs: local only, through `scripts/memcap.sh 8`; no server use. Scripts kept
outside the repo (`/tmp/ref_c19/chk1.py`, `chk2.py`, `chk3.py`, `counts2.py`); the outputs are quoted below.
Only this file was written.

## Verdict

**The claimed verdict (precise obstruction; no statement about zeros of zeta) holds, with the corrections of
section 4.** Every PROVED step was re-derived and confirmed. The counts of the summary were recomputed from the
record files and agree. Three device cells outside the author's run and several lemma checks on members not in
the author's list agree with the claims. Nothing assumes RH, nothing restates verified height. Two points of
presentation are corrected: (1) Lemmas S, F, C are of a known, elementary type and should not be listed as new
without that qualification; (2) inside the class where Lemmas S, F, C apply, "class (iii-b)/(iii-c)" is not
independent of the pole clause (section 4, item E1), so "class (iii) is not empty" describes which step a device
reads first, not a rejection that the pole clause does not already give.

Requirement flags set by the referee: **R1 = false, R2 = false, R3 = false, R4 = false** (same as the author).

## 1. PROVED steps re-derived

1. HQ2 functional equation: u^2/(1-u)^4 -> (1/u^2) u^4/(u-1)^4 = u^2/(1-u)^4 under u -> 1/u. Confirmed.
   Numerically on a member not in the list, HQ2(5, 3e-5): relative difference of the two sides 5e-61, 1e-60,
   1e-61 at three points (60 digits).
2. Coefficients: u^2/(1-u)^4 = sum_{j>=2} C(j+1,3) u^j (exact rational series check, j <= 12, true), so
   a(n) = 1 + eps sum_{2<=j<=v_q(n)} C(j+1,3) q^(j/2); multiplicative because it depends on v_q(n) only and
   a = 1 when v_q = 0. Residue at 1: eps q/(sqrt q - 1)^4 + 1. Order-4 poles at u = 1 with leading coefficient
   eps/(v (s - s_k))^4. Confirmed.
3. Roots: (1-u)^4/u^2 = (2 sinh(w/2))^4 = -eps. Offsets w/v recomputed: (2, 1e-2) 0.323925227131 +
   0.321237373555 i; (3, 1e-2) 0.204374063729, 0.202678216935; (101, 1e-2) 0.0486504863911, 0.0482467963638;
   (2, 1e-4) 0.10205640258, 0.101971391102; (2, 1e-6) 0.0322609858228, 0.0322582975194. All agree with the table.
4. Log-derivative: with R = prod(1 - u/z)/prod(1 - u/p), u R'/R = sum_k (sum p^-k - sum z^-k) u^k and
   d/ds = -v u d/du, so nu(q^k) = v (1 + q^(k/2) c_k), c_k = 4 - S_k for HQ2. Confirmed, and checked by an
   independent route: exact rational power-series recursion for u m'/m (no root, no closed form) against
   4 - 2 Re(e^(kw) + e^(-kw)): relative difference below 2e-58 for all k tested. c_1 = 0, c_2 = 2 eps exactly.
5. First k with nu(q^k) < 0, decided in exact rational arithmetic (c_k < 0 and c_k^2 q^k > 1): (2, 1e-1) 13;
   (2, 1e-2) 22; (3, 1e-2) 22; (101, 1e-2) 22; (2, 1e-3) 38; (2, 1e-4) 67; (2, 1e-6) 212; (2, 1e-8) 669 (closed
   form, 400 digits). All agree with the table. New cases: (5, 1e-5) 119; (7, 3e-3) 29.
6. On the line the factor is 1 + eps/(16 sin^4(t v/2)). Confirmed (u^(-1/2) - u^(1/2) = 2 i sin(t v/2)).
7. HQ3, HQ4: invariance under u -> 1/u; zeros at u = e^(+-A) (resp. -e^(+-A)), poles at e^(+-B);
   c_k = 2 (cosh kB - cosh kA) (resp. 2 (cosh kB - (-1)^k cosh kA)) > 0 because B > A; hence nu >= Lambda and
   a(n) >= 1. Confirmed. New member (5; 0.07, 0.31): functional equation to 1e-60 for both; series recursion
   against the closed form to 3e-60 for k <= 40; smallest c_k 0.241 (HQ3), 1.03 (HQ4); HQ4 local sequence:
   24309 minors of order <= 4 on a 9 x 9 Toeplitz window, none negative (Edrei's theorem itself is CLASSICAL,
   not opened).
8. Lemma N. Confirmed. A shorter closing step than the mean-value argument: the series
   sum (c_k + q^(-k/2)) x^k has non-negative coefficients, so it is >= 0 on [0, r); at a zero of R at x = r the
   function x R'/R tends to -infinity from the left; so x = r is a pole. The step "r is the smallest modulus of
   a zero or pole" needs R in lowest terms (every zero and pole of R is a simple pole of R'/R with non-zero
   residue); true. Consequence (b) needs two classical facts that the text does not name: zeta has no zero on
   the real segment (1/2, 1), and at s = 1 a pole of the factor makes the pole of G double. Both hold.
   Control run by the referee: 200 random symmetric R with an off-line zero quartet and no pole on (0, 1)
   (poles on the unit circle, or off-axis quartets), q in {2, 3, 5, 7}: nu(q^k) < 0 for some k < 4000 in
   200 of 200.
9. Lemma S. Confirmed. See E2 below for a strengthening that the text needs in row 17.
10. Lemma F. Confirmed; the sentence "apart from finitely many points ... hence exactly" is correct but
    terse. Full step: write the divisor of m as sum_p D_p, D_p a finite integer combination of cosets of
    (2 pi i/log p) Z. With D_p* the reflection, sum_p (D_p - D_p*) = 0, and each E_p = D_p - D_p* is periodic
    with period 2 pi i/log p. If E_p != 0 its support contains a whole coset L; on L the sum of the other
    E_p' has finite support (each coset of another prime meets L in at most one point, since log p/log p' is
    irrational). Contradiction. Then R_p(u)/R_p(1/u) = c_p u^(k_p), sum k_p log p = 0 gives k_p = 0, and
    c_p^2 = 1. Confirmed.
11. Lemma C. Confirmed in both steps (zeros of m lie on Re s = 0 only, so by symmetry there are none; then a
    remaining pole factor makes abs m -> 0 as sigma -> -infinity against m(1 - s) -> 1).
12. Section 5.1 and the Poisson identity. Derived independently from the mode functions e^(i tau_j x) on
    [0, U]: ghat_j(z) = (w0 e^(-izU) - 1)/(i (tau_j - z)) with w0 = e^(i tau_j U) the same for all j, which gives
    the rank-one term of `tz.rank_terms`; (g_j * g_k~)(x) gives the diagonal 2 (U - x) cos(tau x) and the
    off-diagonal 2 (sin tau_k x - sin tau_j x)/(tau_j - tau_k), which is `tz.loewner`. The n = 0 term of the
    Poisson sum gives 4 v Id. Q(as written) = Q(zeta) + Z_q - P_q and Q(own poles added) = Q(zeta) + Z_q
    follow. The certificate in `dev.py` (strict diagonal dominance of V^T (A + 2M) V with V^T V certified
    invertible; ball Rayleigh quotient for "neg") is sound.

## 2. Numerical reruns by the referee

- Identity, own code (no `tz.py`, no numpy), cases not in `check_ident.py`: (tw 2345.6, U 8.3, m 7, q 5,
  eps 3e-3): pole lattice against atoms 6.3e-6 with 20000 periods each side (truncation 1/K; largest entry 32),
  quartets minus 4 poles against atoms v (4 - S_k) 1.3e-10. (613.2, 10.4, 6, q 7, eps 2e-2): 7.4e-6, 8.8e-10.
  (2345.6, 8.3, 7, q 2, eps 1e-3, 40000 periods): 5.9e-7, 9.8e-11. Agrees with the author's figures.
- Band device, author's `dev.py` and `tz.py` on cells outside the run (windows w = 21 and 37; the run has
  w = 0..15; members (5, 1e-3) and (3, 1e-5) are new), python-flint 0.9.0, 192 and 96 modes:
  - (1e5, w 37, theta 0.8): zeta certified positive at M = 0 (s = 0.0169 / 0.0278). HQ2 (2, 1e-6), (3, 1e-5),
    (5, 1e-3) as written certified positive at M = 0 and 1. HQ2 (2, 1e-4) as written: negative at M = 0 on 192
    modes with own-poles form positive (a "pole lattice only" pair), positive at M = 1. HQ2 (2, 1e-2): both
    forms negative. T-NR negative. ZQ eta 0.102: negative at M = 0, positive at M = 1.
  - (1e4, w 21, theta 0.6): zeta and all small-eps members positive; T-NR with own conductor term negative
    at M = 1 (consistent with "positive only at theta = 0.55").
  - (1e4, w 21, theta 1.0): zeta undecided at M = 0 (s = -1.4e-15), positive at M = 1; small-eps members
    negative at M = 0 and positive at M = 1; own-poles form never below the as-written form.
  - Pole lattice alone: abs(lambda_min) <= 6e-15 Lg, undecided at M = 0, positive at M = 1, in all 18 records.
- Counts recomputed from `dev.jsonl`, `dev3.jsonl`, `cth.jsonl` with a separate script: 21888 + 2592
  records, 48960 decisions, 2046 undecided (1712 pole lattice, 268 zeta, 66 HQ2 as written; all at M = 0;
  largest abs(lambda_min)/Lg 8.9e-15); zeta 0 negative, 288 of 288 positive at M = 0 for theta <= 0.75; pair
  table 2075 / 801 / 2242 / 66 / 0 at M = 0 and 3370 / 455 / 1359 at M = 1; HQ2 (2; 1e-8, 1e-6, 1e-4) as written
  positive at M = 1 in 384 of 384 with theta <= 0.85; float Loewner order violated in 0 of 5184 pairs; T-NR and
  HQ2 (2, 1e-2) positive at M = 1 only at (1e4, 0.55), 32 of 32, and 0 resp. 6 at M = 0; C(theta) pairs
  434 / 75 / 139; the HQ3 rows (2; 0.03, 0.06) and (2; 0.1, 0.2) of the table. All agree.
- Not rerun: `cth.py` (C(theta)), `dev3.py` (HQ3 on the device), `lemma1.py` (ball location of the 40 zeros and
  abs zeta > 0 at the pole points), the comparison with s3's W, the full-scale server run at 1e6.

## 3. Controls

No zeta-only mechanism with a conclusion about zeros is claimed, so there is no mechanism to break. The one
statement with a conclusion is Lemma C (G = zeta). The referee checked each control against its hypotheses:
DH (no Euler product); characters, sign and unimodular twists, T-NR, zeta(s+a)zeta(s-a) (different functional
equation or none; the last also has degree 2 gamma factor); HQ1 to HQ4 (local factor not of geometric shape;
HQ1 added by the referee: (1-u)^2 + eps u has roots on the unit circle for 0 < eps <= 4, c_k = 2 - 2 cos k theta
>= 0, correct); a pair of sign-symmetric factors (1 - u_p)/(1 + u_p) at two primes (c_p = -1 each, allowed by
Lemma F; not geometric); Beurling (no integer frequencies, so no p^-s lattices); ZQ, backward heat, theta^w,
phase-rotated transfer operator (not Dirichlet series with an Euler product of this shape). No control
satisfies the hypotheses. This is how an identification theorem behaves and is rightly not counted as R3.
On the numerical devices the controls are not separated from zeta at finite stages (section 5.3 of the
result says so; the referee's three cells agree).

## 4. Errors and corrections

E1 (framing; the main correction). In the class where the forcing lemmas are proved (finitely many modified
primes, rational local factors, zeta's functional equation) the local-shape step is not independent of the
pole clause. A rational R with R(u) = +-R(1/u), R(0) = 1 and no pole in abs u <= 1 has no pole on the sphere, so
R = 1 (zero-freeness is not needed). Hence every such twin other than zeta has a lattice of poles of a local
factor on a line Re s = sigma_0 >= 1/2, and G has infinitely many poles there unless zeta vanishes on all but
finitely many points of a two-sided vertical arithmetic progression. For sigma_0 > 1/2 the zero-density
estimate N(sigma, T) = o(T) excludes that; on sigma_0 = 1/2 it needs a Putnam-type theorem on arithmetic
progressions of zeros (CLASSICAL, recalled by the referee, not opened; for the HQ members the author's
certified abs zeta > 0 at sampled k shows poles exist but does not cover all k). So within this class, the
set of twins rejected by (iii-b)/(iii-c) is the set already rejected by class (i). "Class (iii) is not empty"
is correct as a statement about which hypothesis a device reads first; it is not evidence of a rejection
mechanism beyond the pole clause. Statement 7 of the verdict and section 8 should say this. The open
question Q-inf is unaffected.

E2 (gap, small). Row 17 lists the Ramanujan bound a(n) << n^delta and the tensor squeeze as "forced: Lemma S".
Lemma S as proved covers local zero- and pole-freeness and Selberg's bound on the log-coefficients b(q^k); it
does not state the case of a bound on a(q^j). The case is true by the argument in E1 (a(q^j) << q^(j delta) for
every delta makes the local series converge in abs y < 1, so R has no pole in abs u < sqrt q), but that argument
is not in the file. Row 18 (7/8 architecture) is ARGUED only, as the author says.

E3 (novelty). Section 1 lists Lemmas S, F, C under "New here". They are elementary and of a known type: the
lattice-of-poles argument that the functional equation fixes finitely many Euler factors is the standard
mechanism behind strong multiplicity one in the Selberg class (CLASSICAL, recalled, not opened). They should
be labelled "elementary, known type; novelty not established". Lemma N is correctly labelled as Landau's
theorem applied to a local factor. HQ3 is acknowledged as the integer-frequency form of G_+ from c15.

E4 (notation, row 9). For an off-line zero rho the explicit-formula term for g * g~ is
ghat(rho) conj(ghat(1 - conj rho)), not abs(ghat)^2; the row writes "sum over zeros of abs(ghat)^2". The
conclusion of the row (the pole term is <= 0 for every test) is unaffected.

E5 (wording). Statement 4 of the verdict says "HQ3 is the only shape available". Lemma N gives a necessary
condition (a real pole of the factor at real part >= that of every factor zero); many shapes meet it. Replace
by "every member has this shape of pole".

E6 (wording). "zeta: never negative" means "never certified negative": 268 zeta records at M = 0 are
undecided with float lambda_min between -9e-15 Lg and 0. The body states this; the one-line summary does not.
The explanation given for these near-null eigenvalues (node count exceeds the number of zeros in the window)
is not derived and should carry the label ARGUED.

E7 (scope of the member list). The member (2, 1e-1) has its factor zeros at real part 1.081, outside the
strip; it is included in the 9 members of the pair table (5184 pairs). The body flags it; the totals
801 / 455 include no pair from it at theta <= 0.85 (all 384 are "both negative"), so the headline counts are
not inflated by it there. Stated for completeness.

No error was found in a PROVED step, in a certified count, or in the identities.

## 5. Checks required by the brief

- RH assumed anywhere: no. Lemma N (b) uses only that zeta has no real zero in (1/2, 1) and a simple pole at 1.
- Verified height restated: no. The cells are finite-stage data and are presented as such.
- Known theorem presented as new: see E3 (Lemmas S, F, C need the qualification); Lemma N, Edrei, Hamburger,
  Kaczorowski-Perelli are attributed.
- Rows 10, 11, 12, 18 are ARGUED and not run; the referee checked only the local expansion of row 10
  (near an order-4 pole z_0 of F, F + alpha F' vanishes at about z_0 + 4 alpha, in Re z > 0 for alpha > 0;
  consistent). Rows 11 and 12 were not checked.
- Rules: three `rhrun` units named, all ended; one stopped by the author and declared. Not verified on the
  server by the referee (no ssh was made).

## 6. Requirement flags (strict)

- R1 = false. Lemma C uses the Euler-product shape, but for finitely many modified primes, and its conclusion
  is an identification that locates no zero. No step uses all primes together.
- R2 = false. No height-uniform or every-window statement; the cells are finite.
- R3 = false. No argument about zeros is proposed. On the devices the controls with small off-line distance
  pass at finite stages.
- R4 = false. Nothing passes from finite stages or from Re s > 1 to the critical line; the numerical section
  documents the opposite (finite stages are passed by HQ2 and HQ3).

## 7. Statement that survives

No statement about zeros of zeta. (a) HQ2(q, eps) has zeta's functional equation, integer frequencies,
multiplicative coefficients a(n) >= 1, off-line zeros and order-4 poles on the line; its log-derivative
coefficients are signed for every eps > 0, first at k = 13, 22, 38, 67, 212, 669 for eps = 1e-1 ... 1e-8.
(b) HQ3 and HQ4 have nu >= Lambda (HQ4 also a totally positive local sequence), off-line zeros, and simple
poles at real part 1/2 +- b off the line, the first on the real axis; by Lemma N (Landau on one local factor) a
real pole at real part >= that of the factor zeros is unavoidable under nu >= 0 in the one-prime rational
class. (c) For finitely many modified primes with rational local factors and zeta's functional equation: the
multiplier splits into one-prime factors symmetric up to sign (F); a factor without poles in abs u <= 1 is
trivial (S, in the strengthened form of E1); geometric local factors force G = zeta (C). These are
elementary identification statements of known type; within this class they select the same twins as the
pole clause (E1). The case of infinitely many modified primes is open. (d) On the band devices N(theta),
W (theta = 1) and C(theta) at 1e4 to 1e6, HQ2 enters only through Z_q - P_q (identity re-derived and
rechecked); with factor zeros at distance <= 0.10 it passes N(theta) at M = 1 in 384 of 384 object-cells with
theta <= 0.85, and 801 certified pairs at M = 0 fail through the pole lattice alone. Device rows 10, 11, 12, 18
remain ARGUED.
