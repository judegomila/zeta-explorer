# c15-klein-transport-lemma-w-stage-a-and-e1

Date: 2026-11-19. Round 15, kind: combine. Nothing here proves or refutes RH; no bound moves; no statement about
zeros of zeta is claimed. Labels: PROVED (in this note, elementary), CLASSICAL (cited, not re-derived), MEASURED
(mpmath, not interval), OPEN.

Runs: local only, each through `scripts/memcap.sh 8` with `.venv-arb/bin/python` (mpmath 1.3.0), all under
100 MB. Server not used. Files: `checks.py/.json`, `cert_scan.py/.json`, `identity_check.py/.json`,
`second_pass.py/.json`, `draw_seed1519.json`, `PROPOSED_E1_REPLACEMENT.md`, `REFEREE.md`.

## 0. Verdict

**Precise obstruction. The pair stops at stage A, for two separate reasons, and neither reason is the one the
assignment expected in full.**

1. Lemma W is not only a density statement. For every A > 1 it contains the fixed strip
   abs(beta - 1/2) <= 1/(2A) as its own restriction to sigma > 1/2 + 1/(2A) (Proposition W1). The node's
   constant delta* = (1 + kappa)/(2A), kappa about 0.20, is not sharp: kappa can be taken 0 and verified height
   does not enter (W1). Lemma W is strictly stronger than that strip (W2) and strictly weaker than RH; the strip
   is the sharp conclusion over any class closed under adding finitely many zeros (W3). It is a target-level
   hypothesis: E_a, T-NR, DH and backward heat violate it by their zero sets, not at a step that uses
   multiplicativity.
2. The Klein certificate transfers the sign of Re xi'/xi from the line Re s = 1/2 + a inward to the point
   1/2 + h + it (identity K0, checked). For fixed 0 < h < a its right-hand side is negative for all
   t >= t0(a, h): unconditionally for a > 1/2, and under the strip that Lemma W supplies for 1/(2A) < a <= 1/2
   (Proposition K1). The failing step is R <= pi/(4M) against M >= c log t. With h = h(t) it can fire only for
   a - h at most about 1.1/M <= C/log t (constant-amplitude model, MEASURED), and in that range its conclusion
   is already implied by the strip hypothesis through the Hadamard sum when h > 1/(2A).
3. The composed statement is an inequality that is true in every window and sign-definite only at bounded
   height for fixed h: type "certificate at bounded height" (class c), fed by a target-level hypothesis (class
   t). No control fails at a named structural step. Score not raised.
4. Sentence E1 of `c14-prefilter-sweep-geometric-nodes`: corrected statement with a complete proof in
   `PROPOSED_E1_REPLACEMENT.md` (Theorem E1'); it is the written proof of the statement of graph nodes 386 and
   358, not a new result. 400 of 400 random instances agree.
5. Second reader, 15 of the 71 silent nodes, seed 1519: 14 of 15 agree with the list as corrected by the c14
   referee (13 of 15 with the first reader's original typing; the difference is node 30); 1 boundary case
   (node 163).

## 1. Plan

Decisive test first: (i) does Lemma W hold for E_a and T-NR; (ii) is Lemma W implied by, equivalent to, or
stronger than the strip it is used to derive. Then the stage-A read of the pair, the control list, the E1
repair, the second reading. New against the record: W1 (kappa = 0), W3, K0 as the reading of the conclusion,
K1 and the reach bound. Not new: the E1' statement (nodes 386, 358), the section-7 polynomial control (PR 56).

## 2. Lemma W (node 157)

Statement W(A, C, T0): sum over zeros with 0 < gamma <= T of T^(2A d_rho) <= C T log T for all T >= T0, where
d_rho = abs(beta - 1/2), A > 1.

**W1 (PROVED).** W(A, C, T0) implies d_rho <= 1/(2A) for every zero, with no dependence on C, T0 or verified
height. Proof: fix a zero with d = d_rho. It is a term of the sum for every T >= max(gamma, T0), so
T^(2A d) <= C T log T for all such T, that is 2A d <= 1 + log(C log T)/log T. Let T -> infinity.

Check of the node's constants. The node takes T = T_PT only and gets delta* = (1 + kappa)/(2A),
kappa = log(C log T_PT)/log T_PT about 0.20 (C about 10.8 back-computed from 0.20 at T_PT = 3e12), and states
that verified height enters only there. Table (`checks.json`, `lemmaW_delta_of_T`), A = 4/3, C = 10.8:
delta(T) = 0.4499, 0.4109, 0.3877, 0.3766 at T = 3e12, 1e30, 1e100, 1e1000; limit 0.375. Corrected chain:
W(A) implies strip 1/(2A) implies Lambda <= 2 (1/(2A))^2 = 1/(2A^2) (de Bruijn, CLASSICAL, with zeros of H_0
at imaginary part 2 d_rho). Lambda < 0.2 needs A > 1.5811, not 1.897. The implication claimed by the node is
valid; its constant is weaker than what the lemma gives.

**W2 (PROVED).** W(A) is strictly stronger than the strip of half-width 1/(2A), as a statement about zero
multisets with the counting function of zeta: a multiset with all d_rho = d0, 0 < d0 <= 1/(2A), satisfies the
strip and has sum N(T) T^(2A d0), which exceeds C T log T. Conversely the strip together with
N(sigma, T) <= C T^(1 - 2A(sigma - 1/2)) log T on 1/2 <= sigma <= 1/2 + 1/(2A) gives W(A') for every A' < A
(partial summation: the sum is N(T) + 2A' log T int T^(2A'(sigma - 1/2)) N(sigma, T) dsigma over both sides,
at most N(T) + 2 C A' T log T/(A - A')). So W(A) = [strip 1/(2A)] + [density with slope 2A between the line and
the strip edge], up to an arbitrarily small loss in A. The node's "log^O(1)" in the equivalence must be the
first power of log for the equivalence to be exact.

Position. RH implies W(A) for every A (the sum is N(T)). W(A) for every A is RH. For fixed A:
RH => W(A) => strip 1/(2A), both strict at the level of multisets. W(A) with A > 1 is stronger than the density
hypothesis (1 - 2A(sigma - 1/2) <= 2(1 - sigma)), as the node says. Known near the line (CLASSICAL, cited
from memory, not re-read): N(sigma, T) << T^(1 - theta(sigma - 1/2)) log T with theta = 1/4 (Selberg), theta < 1
(Jutila), theta < 8/7 (Conrey); required here: theta = 2A > 2.

Mean-value typing. The part sigma <= 1/2 + 1/(2A) is of mean-value type. The part sigma > 1/2 + 1/(2A) reads
N(sigma, T) <= C T^(-eta) log T < 1, a pointwise statement. Because one zero with d > 1/(2A) violates W(A), no
argument that cannot exclude a single zero (MV-CAP) proves W(A) for any A > 1. The derivation "Lemma W implies
a fixed strip" is therefore the restriction of the hypothesis to large sigma: circular in the sense of class t.

**W3 (PROVED, conditional on W(A) for zeta).** If W(A, C, T0) holds for a multiset Z, it holds, with a larger
C, for Z plus finitely many points with d <= 1/(2A) (each adds at most T). By Lemma F of the c14 lane with the
region R = {0 < d <= 1/(2A)}: no implication from W(A) together with hypotheses stable under adding finitely
many zeros (Blaschke multiplication of a coefficient, control BLS) can give a strip narrower than 1/(2A).

Decisive test, controls against W(A) (any A > 1):
- E_a0 = zeta(s + a0) zeta(s - a0): all 2N(T) zeros at distance a0; sum = 2N(T) T^(2A a0). [Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes (register campaign/CORRECTIONS_R16.md row 7; second referee push/c16-referee-r15-j1prime-u8-screening): the preceding statement is false as written. Corrected: "each zeta zero at signed offset e gives zeros of E_a0 at offsets e + a0, e - a0, and T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(2A a0); so the sum is at least 2N(T) T^(2A a0)." The conclusion FAILS stands.] FAILS for every
  A > 0 (PROVED). Ratio to T log T at a0 = 0.05, A = 4/3: 0.47, 1.60, 11.4 at T = 1e3, 1e6, 1e12.
- T-NR, xi(s)(2 cosh((s - 1/2) log q) + c), c > 2: (T log q)/pi added zeros at distance
  b = arccosh(c/2)/log q; sum >= (T log q/pi) T^(2A b). FAILS for every A > 0 (PROVED). q = 2, c = 2.0506,
  b = 0.3238, A = 4/3: ratio 12.4, 2.4e3, 1.8e8.
- DH: at least cT zeros in a closed substrip of 1/2 < sigma < 1 and in sigma > 1 (CLASSICAL). FAILS.
- Backward heat: at least cX zeros outside any strip up to height X (map row F1, `b-escape-law`, quoted).
  FAILS.
- BLS (finitely many added zeros): passes if d <= 1/(2A) (W3), fails if d > 1/(2A).
In every failing case the failing object is the hypothesis itself, evaluated on the control's zero set.

## 3. Klein transport certificate (node 142)

Source: PR 56 `klein_phase_transport.md` sections 5 to 7, read as text. U_a(t) = F(1/2 + a + it) =
A_a(t) e^(i theta_a(t)), theta_a' = Re F'/F(1/2 + a + it).

**K0 (reading of the conclusion; source section 7 for the polynomial, MEASURED here for xi).**
W_h(t)/h = int_0^inf omega_{a,h}(r) C_a(t, r) dr = Re(F' conj F)(1/2 + h + it)/h, with omega a probability
density. `identity_check.json`: mass 1.0; polynomial control exact; xi at (a, h, t) = (1, 0.5, 20),
(0.3, 0.15, 14.2), (0.3, 0.05, 14.134725): relative defect 6e-25, 3e-17, 6e-16; (0.6, 0.3, 100): 6e-9
(quadrature of an oscillating integrand, value 1e-60). So the certificate concludes
Re xi'/xi(1/2 + h + it) > 0 at depth h < a from phase data on the line at depth a: an inward transfer.

**Hypothesis on zeros supplied by Lemma W.** By W1, all d_rho <= delta := 1/(2A). For a > delta the Hadamard
sum theta_a'(v) = sum over rho of (a -+ d_rho)/((a -+ d_rho)^2 + (v - gamma)^2) has all terms positive, and
(CLASSICAL zero count in windows of fixed length) theta_a'(v) >= c(a, delta) log v. So Lemma W supplies mu > 0
in every window on every line a > 1/(2A), with mu and M both of order log t. Its density half is not used: the
certificate reads pointwise bounds on a window. What Lemma W cannot supply is the other half of the
hypothesis, R <= pi/(4M) with R comparable to a - h; no statement can, since M >= mu >= c log t.

**K1 (PROVED; asymptotic, constants not tracked).** Fix 0 < h < a. Assume either a > 1/2, or all zeros have
d_rho <= delta < a. Then for every admissible (mu, M, R) the right-hand side of the certificate is negative for
t >= t0. Proof. (i) M >= theta_a'(t) >= c log t: for a > 1/2, theta_a'(t) = (1/2) log(t/2 pi) +
Re zeta'/zeta(1/2 + a + it) + O(1/t) and abs(zeta'/zeta) <= -zeta'/zeta(1/2 + a); otherwise by the window
count. Hence R <= pi/(4 c log t). (ii) omega(r) = kappa r^2 (1 + O(r/(a - h))),
kappa = 4 pi^2 sin(beta)/(a^2 h (2 + 2 cos beta)^2). Using mu <= M <= pi/(4R): core <=
sup_{r<=R}(A A) int_0^R omega/(2aR) = sup(A A) kappa R^2/(6a) (1 + o(1)). (iii) tail >=
inf_{R<=r<=r1}(A A) int_R^{r1} omega/(2ar) dr. (iv) Amplitudes: for a > 1/2,
A_a(t - r) A_a(t + r)/A_a(t)^2 lies between (zeta(1 + 2a)/zeta(1/2 + a)^2)^2 (1 - o(1)) and
zeta(1/2 + a)^4/zeta(1+2a)^2 (1 + o(1)) for r <= 1 (the gamma factors cancel to 1 + O(r^2/t^2)), so with r1 = 1
the tail is bounded below by a positive constant times A_a(t)^2 and the core is O(R^2) A_a(t)^2. Under the
strip hypothesis, abs((log A_a)'') = abs(Re (xi'/xi)') <= sum 1/abs(s - rho)^2 <= theta_a'/(a - delta) <=
C log t, so the ratio is within e^(+-1) for r <= r1 = c'/sqrt(log t); then tail >= c'' A_a(t)^2/log t and core
<= C'' A_a(t)^2/log^2 t. In both cases core/tail -> 0.

Numbers (MEASURED). Kernel at constant amplitude, best case mu = M = pi/(4R) (`second_pass.json`):
core/tail = 3.3e-2, 2.1e-3, 1.3e-4 at R = 0.2, 0.05, 0.0125 times (a - h) for h = a/2. Threshold R* below
which the certificate cannot fire at constant amplitude: R*/(a - h) = 0.71, 0.76, 0.91, 1.08, 1.24, 1.37, 1.39
at h/a = 0.02, 0.1, 0.3, 0.5, 0.7, 0.9, 0.99, that is M (a - h) <= 1.11, 1.03, 0.86, 0.73, 0.63, 0.57, 0.56.
Actual xi, best admissible R on a grid (`cert_scan.json`; mu, M from 0.01-spaced samples):

| a | h | t = 20 | 30 | 60 | 100 | 200 | 400 | 1000 | 10000 |
|---|---|---|---|---|---|---|---|---|---|
| 2.0 | 1.0 | 0.48 | 0.39 | 0.23 | 0.29 | 0.22 | 0.13 | 0.072 | 0.029 |
| 1.0 | 0.5 | 0.66 | 0.58 | 0.56 | **1.28** | **1.19** | 0.50 | 0.23 | 0.082 |
| 1.0 | 0.95 | **10.9** | **9.9** | **11.9** | **23.9** | **22.7** | **11.2** | **6.5** | **3.4** |
| 0.6 | 0.3 | **1.17** | 0.52 | **1.15** | **4.9** | **4.7** | 0.76 | 0.44 | 0.23 |
| 0.3 | 0.15 | **13.3** | 0.76 | **5.1** | **125** | **162** | 0.67 | 0.48 | 0.41 |

Entries: core/tail; bold = right-hand side positive (the certificate fires). M at t = 1e4 is 3.76 to 5.02
against (1/2) log(t/2 pi) = 3.69. The certificate fires at low height and at h close to a; for h = 0.95 a the
model predicts the last firing height near M = 11, t about 4e10. Consistent with K1 and with the model.

Reach. With h allowed to depend on t the certificate can fire in every window only for
a - h <= about 1.1/M <= C/log t (model; MEASURED). For h > delta the conclusion Re xi'/xi(1/2 + h + it) > 0 is
then already a consequence of the strip hypothesis (all Hadamard terms positive), without the certificate. For
h <= delta the certificate does not cross a zero: a zero at depth d in (h, a) near height t gives
M >= 1/(a - d), and the polynomial control of source section 7 (F = (s - 1/2)^2 - delta^2, theta_a' > 0 on
the outer line, W_h/h = 2(h^2 + t^2 - delta^2) < 0 inside) shows the conclusion false below the zero.

## 4. Stage-A read of the pair

Composed statement: W(A) => for a > 1/(2A), 0 < h < a, t, and admissible (mu, M, R):
Re(xi' conj xi)(1/2 + h + it)/h >= core - tail.
- Identity, certificate or inequality: a true inequality in every window (PROVED given W(A)); its
  right-hand side is positive only at bounded height for fixed h (K1), or within C/log t of the line a.
  Type: certificate at bounded height (class c) on a class-t hypothesis. Not an every-window positive
  inequality.
- What the pair adds to its parts: nothing. W(A) gives the strip 1/(2A) by W1 alone; for h > 1/(2A) the
  conclusion follows from the strip without the certificate; for h <= 1/(2A) the certificate has reach
  C/log t and stops at the first zero.

Three pre-filter questions (Lemma F of the c14 lane), for the pair:
- Q-P (positive multiplier at one prime): the hypothesis W(A) is not stable under F -> m_w F with c > 2
  (adds (T log p0)/pi zeros at distance b > 0); for c <= 2 it is stable and adds no off-line zero. No. Silent.
- Q-B (Blaschke multiplier): W(A) and the window hypothesis are stable under finitely many added zeros with
  d <= 1/(2A) and d < a. Yes, with region R = {0 < d <= 1/(2A)}: BLS passes; conclusion sharp (W3).
- Q-S (symmetric multiplier, c < -2 included): same as Q-P. No. Silent.

Controls, composed statement; first failing step named:

| control | Lemma W | Klein implication (section 6) | first failing step |
|---|---|---|---|
| DH | fails (cT zeros at fixed distance) | passes: theorem for any analytic F; hypothesis holds on lines right of its zeros | hypothesis W, on the zero set |
| E_a0 | fails for every A > 0 | passes for a > a0; local model = section-7 polynomial | hypothesis W, on the zero set |
| T-NR | fails for every A > 0 | passes for a > b | hypothesis W, on the zero set |
| backward heat | fails (zeros leave every strip, row F1, quoted) | passes: the source states it for the heat family | hypothesis W, on the zero set |
| BLS | passes for d <= 1/(2A) | passes | none: the control passes; the conclusion (strip 1/(2A)) is true for it |

No control fails at a step that uses the Euler product: the section-6 inequality uses no property of F beyond
analyticity and a non-vanishing trace, and Lemma W is a statement about the zero multiset. [Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes (register campaign/CORRECTIONS_R16.md row 8; second referee push/c16-referee-r15-j1prime-u8-screening): the preceding statement is false as written. Corrected: "the section-6 inequality uses the functional-equation symmetry, order one and a non-vanishing trace; no Euler product." (First referee; not rechecked by the second.)]

## 5. Sentence E1 (part 2)

`PROPOSED_E1_REPLACEMENT.md`: Theorem E1' with proof. For X even, real, of order one with sum of
abs(lambda)^-2 finite, and a > 0: R_a(w) = X(w - a)/X(w + a) is Schur on Re w > 0 iff
m(lambda - 2a) >= m(lambda) for every zero with Re lambda > a. Corollaries: all abs(Re lambda) <= a implies
Schur; Schur at one a < 1/2 does not imply the strip; Schur along a sequence a_n -> 0+ iff all zeros on the
axis. The statement is that of nodes 386 and 358; the proof (per-ordinate finite Blaschke products after
cancellation) is written out here. Checks: 7 hand cases (`checks.json`), 400 random multisets
(`second_pass.json`): 400 agree, 32 of them Schur. Proposed replacement text for the three places E1 occurs is
in the same file. The c14 files are not edited.

## 6. Second reader (part 3)

Population: the 70 silent rows of `sweep.json` plus node 30 (c14 referee E4) = 71. Draw: `random.seed(1519)`,
`random.sample(sorted indices, 15)` = 14, 30, 48, 104, 120, 134, 163, 195, 213, 286, 292, 350, 355, 363, 377.
Typed from the node statements with the class legend of c14 section 3.2. Not blind: the first reader's table
had been displayed earlier in this session while reading the lane.

| # | node | second reader | first reader | agree |
|---|---|---|---|---|
| 14 | bagchi-strong-recurrence | t (RH-equivalent criterion) | t | yes |
| 30 | cascade-s21-zeta2s-over-zeta | Z (exact local sections, Re s > 1; zeros are poles) | PASS (Q-S); referee: Z | with referee |
| 48 | conformal-schur-window | c | c | yes |
| 104 | finite-support-euler-detector | Z (local parameter size at single primes); L is defensible (finite support) | Z | yes |
| 120 | genuine-theta-box | c | c | yes |
| 134 | hidden-square-conj-16-4 | t | t | yes |
| 163 | map-open-11 | identity "multiplicative at p"; sign and unimodular twists pass by the node text: PASS (S1) or Z | Z | boundary |
| 195 | mem-lacunary-loophole | L (Pick form on a thin node set) | L | yes |
| 213 | mirror-euler-rate-t0 | Z | Z | yes |
| 286 | route-i-krein-certificate | L (finite-support Weil form); c is defensible (interval certificate) | L | yes |
| 292 | rung-toeplitz-euler-detector | Z | Z | yes |
| 350 | t3-residual-inequality | t | t | yes |
| 355 | theta-kernel-sqrt-concavity | K | K | yes |
| 363 | twin-ladder-jacobi-reconstruction | t | t | yes |
| 377 | volterra-hs-bound | K (kernel-only norm bound); c is defensible | K | yes |

Agreement: 13 of 15 with the first reader as filed; 14 of 15 with the list after referee correction E4;
1 boundary (163, silent Z against PASS S1: the same wording boundary the c14 referee reports in E5). Three
agreeing rows have a defensible second class (104, 286, 377). No drawn node displays an inequality that is not
the target, a certificate, or closed on file.

## 7. Requirement flags

- R1 false. No step uses multiplicativity: W1 to W3 are statements about multisets; K0, K1 use Hadamard and
  the zero count (K1 for a > 1/2 uses abs(zeta'/zeta) <= -zeta'/zeta(sigma), a size bound).
- R2 false. K1 shows the certificate is not sign-definite at height for fixed h.
- R3 false. Four controls fail only at the hypothesis; BLS passes.
- R4 false. Nothing passes from right of the strip edge to the line; the reach is C/log t and stops at a zero.

## 8. Three weakest steps

1. K1 under the strip hypothesis (a <= 1/2): the lower bound theta_a' >= c log t and the amplitude bound are
   argued with unspecified constants from the classical window count; not written with explicit constants and
   not checked numerically for a <= 1/2 at large t (the scan stops at t = 1e4).
2. The reach statement "a - h <= about 1.1/M" rests on the constant-amplitude model. At actual amplitudes the
   firing set differs (a = 0.3, h = 0.15 fires at t = 100, 200 with core/tail above 100). It is MEASURED, not
   PROVED; only the fixed-h asymptotic K1 is proved.
3. Controls: DH and backward heat against Lemma W are quoted (classical zero counts; row F1), not re-derived;
   the Selberg, Jutila, Conrey exponents are cited from memory. E1': the Hadamard grouping by ordinate pairs is
   stated for order one with sum abs(lambda)^-2 finite; multiplicity bookkeeping at Re lambda = a and at real
   zeros was checked on examples only through the random test.

## 9. Incident (file outside the lane)

The first run of `checks.py` wrote its output with a relative path while the working directory was the
repository root, and overwrote an untracked file `checks.json` there (present before this lane started; several
lanes' `checks.py` use the same relative path, including a sibling round-15 lane whose directory holds no copy).
The earlier content is not recoverable. The file written by this lane was moved out of the root; the script now
writes next to itself. The owner of the earlier root file should rerun its script.
