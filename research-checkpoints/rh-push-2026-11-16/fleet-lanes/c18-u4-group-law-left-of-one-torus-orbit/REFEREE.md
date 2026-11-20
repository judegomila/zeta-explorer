# REFEREE (adversarial, lens: general) for c18-u4-group-law-left-of-one-torus-orbit

Object: `RESULT.md` of this directory. Claimed verdict: precise obstruction; no statement about zeros of zeta.

Referee verdict: **the obstruction holds, with four corrections of wording (E1 to E4) and three label
restrictions (E5 to E7).** None of the corrections changes the control table or the closure of the cell for the
stated read. No step assumes RH; no step restates verified height; Lemmas S and V and Theorem T are presented
as elementary or classical, not as new theorems. Requirement flags set by the referee: R1 false, R2 false,
R3 false, R4 false.

Labels below: CONFIRMED (re-derived by hand here), RERUN (recomputed by the referee with an independent script,
different cases), ERROR, RESTRICT (label too strong).

## 1. Re-derivation of the PROVED steps

**Transform M_U.** CONFIRMED. integral_0^U (1 - u/U) e^(zu) du = -1/z + (X^z - 1)/(z^2 U) = (X^z - 1 - zU)/(z^2 U).

**Identity E.** CONFIRMED by residues. v(u) = (1/2 pi i) integral M(z) e^(-zu) dz on Re z = c, so
S_U(s) = (1/2 pi i) integral M_U(z)(-zeta'/zeta)(s+z) dz, c > 1 - sigma. Part X^z/(z^2 U) moved left: double
pole at z = 0 gives -zeta'/zeta(s) - (1/U)(zeta'/zeta)'(s); z = 1 - s gives + X^(1-s)/((1-s)^2 U); z = rho - s
gives - X^(rho-s)/((rho-s)^2 U); z = -2j - s gives the gamma terms. Part -(1 + zU)/(z^2 U) moved right
contributes 0 (the Dirichlet series decays like 2^(-Re z)). The rewriting "first three terms =
M_U(1-s) + L*(s) + L*'(s)/U" is CONFIRMED term by term.

**(C-F).** CONFIRMED: 3 + 4 cos x + cos 2x = 2 (1 + cos x)^2, each atom non-negative. The modulus bound on the
k = 1, 2 pole terms holds (4.25 and 4.5 in place of 5). The gamma-term bound 8 X^(-2-sigma)/(4U) holds for
X >= 1.2 (the j >= 2 terms need X^-2/(16 (1 - X^-2)) <= 1/4 - 1/6.25); for U near 0 it is not stated correctly,
which is immaterial.

**Lemma GL (a), (c).** CONFIRMED (trivial: the polynomial 1 is in the family).

**Lemma GL (b). ERROR E1 (one direction of the "iff" as written).** The tests use cosine polynomials with real
coefficients and read only Re Lambda_k(n). The condition they impose is: the even real sequence
k -> Re Lambda_k(n) is positive definite, that is Re Lambda_k(n) = integral cos(k theta) d mu_n, mu_n >= 0.
It is not "Lambda_k(n) = integral e^(ik theta) d mu_n". Counterexample to the written "only if":
Lambda_0(n) = 1, Lambda_1(n) = i, Lambda_k(n) = 0 for k >= 2. Every non-negative cosine polynomial has
a_0 >= 0, so every inequality holds, but the candidate density 1 + 2 sin theta has minimum -1 (RERUN). The
"if" direction is correct and is the only direction used in section 3 (E_a, G_+, THIN, U); the T-NR row uses
real sequences, where the two statements agree. Corrected statement: "... hold iff for every atom n the
sequence k -> Re Lambda_k(n), extended evenly, is positive definite".

**Theorem T.** CONFIRMED as stated (fixed translates tau_j, positive weights, no pole in Omega + i tau_j): at
s_0 + eps the sum is -(sum a_k m_k)/eps + O(1), resp. (sum a_k m_k) log eps + O(1).
**ERROR E2 (application paragraph).** The triple sigma, sigma + it, sigma + 2it is not a family of fixed
translates of one open set: member 0 does not move with t and member 2 moves at double speed. Theorem T as
stated does not cover it. The same computation does: at a zero sigma_0 + i t_0 of order m, approached as
(sigma_0 + eps, t_0), the sum is -(4 m + a_2 m')/eps + O(1) (m' the order at sigma_0 + 2 i t_0), and the
same with t_0/2 for a zero seen from member 2; member 0 is finite because zeta has no zero on (1/2, 1)
(CLASSICAL, used silently). Second point: "B finite" must read "B locally bounded in (sigma, t)"; with B an
arbitrary finite function the inequality holds off the zeros for any meromorphic function and the "iff" is
empty. With both repairs the sentence "true iff the strip is zero-free" stands.

**Lemma S.** CONFIRMED with one repair. **E3:** the proof quotes "a bounded integrable function with
non-negative transform"; for a > 0 the function f_a = v(|u|) e^(a|u|) is not known to be bounded in advance.
The local form is what is needed and it is classical: f in L^1, essentially bounded near 0, transform >= 0
imply the transform is integrable and |f| <= f(0) almost everywhere, with f(0) = v(0+) by right-continuity.
Part (i) (multiplication by e^(-c|u|), Poisson kernel) CONFIRMED. The consequence
v(u) e^(-sigma u) <= v(0+) e^(-u) follows by taking a up to 1 - sigma.
The statement "for the Fejer weight the sign region is exactly Re z <= 0" is labelled MEASURED on the grid
c = 0, 0.5, 1, 2. It is provable, and the referee supplies the proof: Re M_U(iy) = (1 - cos yU)/(y^2 U) >= 0
vanishes at y_0 = 2 pi/U, and d/da Re M_U(a + i y_0) at a = 0 equals
U^2 integral_0^1 x (1 - x) cos(2 pi x) dx = -U^2/(2 pi^2) < 0; with part (i) the region is exactly a <= 0.
RERUN: min over y of Re M_1(c + iy) = -5.1e-4, -2.6e-3, -5.3e-3, -0.0175, -0.0321, -0.0815, -0.2654 at
c = 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2 (the lane's -0.032, -0.081, -0.27 agree).

**Lemma V.** CONFIRMED: log M is convex on the real axis (Laplace transform of a non-negative weight), so
M(1 - sigma)/M(beta_0 - sigma) >= exp((1 - beta_0) (log M)'(beta_0 - sigma)); with a_1 < 2 a_0 for a
non-negative cosine polynomial the condition (1 - beta_0) ubar < log(a_1/a_0) < log 2 follows for a simple
zero. RERUN on the Fejer weight: ratio 1.2471 >= 1.2339 (U = 3, sigma = 0.7, beta_0 = 0.8); 1.7344 >= 1.6818
(U = 10, 0.6, 0.9); 1.1439 >= 1.1389 (U = 1, 0.75, 0.6). The numbers 2.88 / n < 18 and 0.72 / n < 2.1 are
right. **RESTRICT E5:** the lemma is a necessary condition for one mechanism only (the term of rho_0 at
member k = 1 alone exceeding the k = 0 pole term, every other term dropped). It is correctly worded in the
lemma; the summary sentence "a zero at distance delta from Re s = 1 needs mean log-length < log 2/delta"
(claim line, proposed map row) must carry "for a simple zero, in the 3-4-1 mechanism"; for a zero of order m
the bound is log(m a_1/a_0)/delta.

**Height paragraph.** integral Re M(a + iy) dy = pi v(0+): CONFIRMED (inversion at 0, valid when the
transform is integrable, which Lemma S gives in the sign-controlled case only). sup of U(2 - 3 g(delta U)) =
0.11172/delta at delta U = 0.424: RERUN, agrees. **RESTRICT E6:** the comparison value "2.5 log t" is the mean
(a_1 + a_2)/2 times log t of the on-line zero terms for a sign-controlled weight; the worked case uses the
Fejer weight at sigma = beta_0 < 1, which is not sign-controlled (its sign region is Re z <= 0). The
"reachable heights t < 9.3, 2.4, ..." are therefore an illustration with mixed hypotheses, not a bound. The
lane labels the general ceiling ARGUED; the worked case should carry the same label, not MEASURED.

## 2. Numeric check rerun with different cases

Independent script (mpmath 25 digits, 600 zeros and conjugates, own Lambda), cases not in the lane's table:

| sigma | t | X | prime side | defect |
|---|---|---|---|---|
| 0.70 | 30.0 | 50 | 4.2451054 | -6.1e-8 |
| 0.95 | 3.3 | 80 | 4.5036065 | -6.4e-7 |
| 0.55 | 32.9351 (fifth zero) | 18 | 2.3949932 | -1.2e-7 |
| 0.55 | 32.9351 | 17 | 2.2669653 | -3.6e-4 |

The last row is not an error of Identity E: with X = 17 the defect is -1.07e-3, -6.2e-4, -3.6e-4 for 150, 300,
600 zeros (decay like 1/T), and 2.8e-5 at X = 17.5. When X is a prime power the truncated zero sum converges
without cancellation (Landau: sum over gamma < T of X^(i gamma) is about -T Lambda(X)/(2 pi sqrt X)). **Note
E7:** the claim "identity checked to 3e-6" is true for the lane's X = 30 and 800 zeros; it is a truncation
figure, not a precision of the identity, and at prime-power X with the same number of zeros it is 1e-4 to
1e-3. The prime side was also checked against the closed form sum Lambda(n) n^-sigma v 2(1 + cos)^2 to 1e-15.

## 3. Controls run by the referee

Coefficients (RERUN): T-NR (3, 2.2): Lambda_F(3^k) = 5.285, -8.262, 24.207, -58.875, 160.304, -425.636, zero
abscissa 0.903753 (agree). Derivation checked: 1 + c sqrt(q) x + q x^2 = q (x - w1)(x - w2), w1, w2 < 0,
Lambda_m(q^k) = -log q (w1^-k + w2^-k), alternating sign; zeros at q^-s = w1, t = (2k+1) pi/log q. Other
parameters, not in the lane: (q, c) = (5, 2.4): 10.25, -28.65, 120.8, ... abscissa 0.8867; (2, 2.1): 2.752,
-2.648, 6.498, ... abscissa 0.9543. The sign failure at q^2 is structural (both roots negative), not a feature
of the lane's parameters. NR-q (2.876, -5.129): agree. HEAT Lambda_F(6) = a(2) a(3) log 6
(e^(tau log 2 log 3/2) - 1): re-derived from the Dirichlet inverse; -0.25154, -0.06417, -0.00340 agree.
G_+ density: -m_+'/m_+ = 2/(s - 1/2 - b) + 2/(s - 1/2 + b) - (quartet) gives D_+ = 4 x^(-1/2)(cosh bL -
cos(gbar L) cosh(eta L)) >= 0 for eta < b; minimum 0.0 on a grid of 6e5 points (agree). Beurling-rational
density |1 - x^(rho-1)|^2: re-derived from the partial fractions.

Prime side of (C-F), independent implementation, N = 2e5, 3000 points, seed 7, sigma in [0.52, 0.99], t
log-uniform in [1, 1e7] (float64, MEASURED; through `scripts/memcap.sh 8`, planned memory below 0.2 GB):

| family | X = 12: neg; min | X = 300: neg; min | X = 2e5: neg; min |
|---|---|---|---|
| ZETA | 0; 0.160 | 0; 0.452 | 0; 0.739 |
| E_a(0.2) | 0; 0.163 | 0; 0.480 | 0; 0.753 |
| T-NR(5, 2.4) | 0; 0.091 (25 > X) | 0.0067; -0.089 | 0; 0.115 |
| T-NR(2, 2.1) | 0.138; -0.444 | 0.050; -0.343 | 0.0043; -0.132 |
| Liouville (single object) | 0.961; -1.890 | 1.0; -1.406 | 1.0; -1.161 |
| U as a family (zeta, L_u, L_u^2), random unimodular u(p) | 0; 0.172 | 0; 0.466 | 0; 0.700 |

Same picture as the lane's server table: E_a and the unimodular family pass at every point (forced by
Lemma GL in the "if" direction); T-NR fails on short tests that contain the atom q^2 and nearly passes long
tests; the single-object sign twist fails. The U-family row is not in the lane's table and confirms the row
"U passes (1), (2) as a family" numerically. Spot check of `server_table.md` against
`prime_side_test_1000000_100000.json` (six cells and the decade table): agree.

Mechanism claimed for zeta only: none. The lane claims no zeta-only mechanism (R3 false), so there is no
control that was required to fail and did not.

## 4. Remaining remarks

- Rows DEL, THIN, ZQ, SG, BLS are PROVED-rel the map rows, as the lane says in weakest step 2; the referee did
  not re-derive the continuation of DEL and THIN. They are not needed for the verdict: E_a, the G_+ lift, the
  unimodular family and the Beurling-rational member, all re-derived here, already give passers of (1), (2),
  and E_a and G_+ give passers of (1) to (3).
- The G_+ lift L(s, chi^k) m_+(s): the functional equation of member k relates chi^k to its conjugate, not to
  itself; "the functional equation of the lifted members" means the family is closed under it. Not checked
  numerically by either side.
- The server run was a float64 record at 4 cores; the registered ball test was not run, by the stated
  condition. The table decides nothing and the lane says so.
- No statement in the file is about zeros of zeta beyond CLASSICAL facts (no zero on (1/2, 1); the classical
  zero-free region). The remark "under RH, B of order (log t)^(2 - 2 sigma)" is a recalled conditional size and
  is not used.

## 5. Flags and surviving claim

- R1 false: the device reads the sign and support of Lambda atom by atom (Lemma GL (a), (c), confirmed).
- R2 false: (C-F) holds at every t but concludes nothing about zeros.
- R3 false: E_a, G_+ lift pass (1) to (3); U, THIN, TW+, DEL, the Beurling-rational member pass (1), (2).
- R4 false: no continuation step.

Surviving claim: No statement about zeros of zeta. Cell U4 (iv) is closed for the read "positivity-derived
inequality on shifts s + ikt or powers of a character". (C-F) holds for every sigma, t, U with every term
finite in 1/2 < sigma < 1 (identity E; truncation defect 1e-7 to 3e-6 at non-prime-power X with 600 to 800
zeros). Lemma GL with (b) corrected to "k -> Re Lambda_k(n), evenly extended, is positive definite at each
atom". Theorem T for fixed translates, and by the same computation for the triple sigma + ikt with B locally
bounded. Lemma S with the local boundedness hypothesis; Fejer sign region exactly Re z <= 0 (proved above).
Lemma V for a simple zero in the 3-4-1 mechanism. Controls as tabulated; the height ceiling stays ARGUED.
