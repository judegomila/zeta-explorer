# e1-selberg-twist-control: a Selberg-zeta control with an Euler product, a functional equation and an off-line zero; Theorem PC with the PSL2(Z) companion

Date 2026-11-17. Slug `e1-selberg-twist-control`. Scope: this directory only. Nothing committed or pushed.
Nothing here proves or refutes RH. No zero-free region, density bound or Lambda bound changes. Not refereed.
Labels: PROVED (argument given here) / CLASSICAL (cited, not re-read in this run) / ARGUED (one standard step
sketched) / MEASURED (float64 linear algebra on Arb-evaluated matrix entries; truncation error measured, not
bounded; nothing is interval-certified) / OPEN.
All numerics local, single process, through `scripts/memcap.sh 8`. The compute server was not used.

## Verdict

**Precise obstruction for the combination as an attack; one new control row for the map.**

- **Part A (control), first decisive test: done, positive.** For Gamma(2) with the unitary character
  chi(A) = e(a), chi(B) = e(b) (A = [[1,2],[0,1]], B = [[1,0],[2,1]]), the twisted Selberg zeta Z(s, chi) has a real
  zero at s0 = 0.9503290739 for (a, b) = (0.01, 0.02) and at s0 = 0.8398960900 for (0.03, 0.05) (MEASURED). The Euler
  product, the functional equation Z(s) = Psi(s) Z(1-s) with an elementary factor, and the leading term
  x^{s0}/s0 of the twisted prime-geodesic sum were each checked numerically. For (0.05, 0.12), (0.10, 0.25) and
  three larger characters no real zero was found in [0.52, 1].
- **The control does not fill the gap named in the assignment in the strict sense.** The object with the functional
  equation s <-> 1-s is Z, whose local factor at a primitive geodesic is the infinite tower
  prod_{k>=0} (1 - chi(gamma) N^{-s-k}) (parameters chi N^{-k}, unimodular only for k = 0), and Z is entire of
  order 2. The degree-one unimodular factor, the Ruelle zeta, has no s <-> 1-s equation and has poles where Z has
  zeros. No Selberg object has "degree-one Euler product with unimodular parameters + s <-> 1-s + off-line zeros".
  Section 3 gives the corrected hitting sets under both readings.
- **What the control adds.** (i) It has FE, an Euler product, parameters in the closed unit disc, prime-number-theorem
  size and (in the compact form, CLASSICAL) Lambda >= 0 and the pole, and it lacks INT. Under the weak reading
  {FE, SIZE} and {FE, GEOM} are no longer hitting sets and every hitting set contains INT. (ii) The explicit
  formula has the opposite sign on the zero side, so every Landau-positivity mechanism holds for it with the
  inequality reversed and carries no constraint on exceptional zeros. (iii) Its off-line zeros are real and
  finitely many: it tests only statements that include height 0.
- **Part B (companion): silent.** For every Dirichlet series with non-negative coefficients of the form
  c Z'/Z + E (c > 0, Z the PSL2(Z) Selberg zeta, E holomorphic at 1/2 + 9.5337 i), sigma* >= 1/2 > beta/2 for
  every zeta zero (PROVED, Proposition B1). Theorem PC is never applicable at rho/2. The pole-cancelling difference
  is not a positive series (supports disjoint, first negative atom at n = 2). The only positive combination that
  removes the real pole at 1/2 is Z'/Z - 2 zeta'/zeta(2s), in which the rho/2 poles cancel identically
  (measured orders 0).

RH is open. Nothing here gives information about a zeta zero.

## 0. Plan and relation to the map

New relative to the map and the atlas: OBSTRUCTION_MAP section 2 lists seven controls; none is a Selberg zeta.
Route 28 ran the freeze calculus on the PSL2(Z) Selberg zeta and recorded as its next step an RH-true / RH-false
pair, not run. The r3 synthesis section 4 item 2 proposed Theorem PC with the PSL2(Z) Selberg zeta as companion,
first test sigma* versus beta/2, not run. This lane runs both first tests.

Sources read: BRIEF.md; OBSTRUCTION_MAP.md sections 1, 2, 4, 5, 6 and rows P13, P25, S1, Z15, L4;
`stack-combinator/RESULT.md` section 1 and TABLE.md rows 1-50;
`formalization/rh-attempts/2026-11-01-r3-pole-pretentious.md` (Definition 2.1, Theorem PC and proof, Theorem PCR,
section 2.2); r3-synthesis section 4 item 2; `src/data/route-28-selberg-zeta-freeze-sandbox-2026-10-12.js` and
`tmp/routes-b7-r28-transfer.py` (as text); `n1-mayer-dirac/RESULT.md` (verdict), `c1-missing-controls/RESULT.md`
(flags and verdict).

## 1. Part A: the control

### 1.1 Definition and classical facts

Gamma(2)/{+-1} is free on A, B; it has no elliptic elements, three cusps (infinity, 0, -1) with parabolic generators
A, B, A B^{-1}, and area 2 pi. A unitary character is chi_{a,b}(A) = e(a), chi_{a,b}(B) = e(b). Cusp twists:
alpha = (a, b, a - b) mod 1. If no alpha_j is an integer (chi singular at every cusp) the chi-twisted Laplacian has
discrete spectrum 0 < lambda_0 <= lambda_1 <= ..., no continuous spectrum and no scattering matrix (CLASSICAL:
Selberg; Venkov; Hejhal vol. 2; Phillips-Sarnak). Write lambda_j = s_j (1 - s_j).

    Z(s, chi) = prod_{gamma primitive hyperbolic in Gamma(2)} prod_{k >= 0} (1 - chi(gamma) N(gamma)^{-s-k}),  Re s > 1.

- Z(s, chi) is entire of order 2. Zeros in Re s > 0: s = 1/2 +- i r_j for lambda_j = 1/4 + r_j^2 >= 1/4, and the
  real pairs {s_j, 1 - s_j} for lambda_j < 1/4 (CLASSICAL). Z is real on the real axis (inversion gamma -> gamma^{-1}).
- As chi -> 1 the lowest eigenvalue tends to 0 (CLASSICAL; this is Selberg's source of small eigenvalues on cyclic
  covers), so s_0 -> 1.
- Functional equation (CLASSICAL form; constants fixed by the computation in 1.3):

      Z(s, chi) = Z(1 - s, chi) * exp( 2 pi int_0^{s-1/2} v tan(pi v) dv ) * prod_j (2 sin(pi alpha_j))^{2s-1}.

  ARGUED derivation: for a singular cusp the parabolic classes contribute
  (g(0)/2) sum_{n != 0} e(alpha n)/abs(n) = -g(0) log(2 sin(pi alpha)) to the trace formula and nothing else; with
  h(r) = 1/(r^2 + (s-1/2)^2), g(0) = 1/(2s-1), this is the constant in Z'/Z(s) + Z'/Z(1-s).
- Compact form (CLASSICAL, not computed here): for a compact surface with a short separating geodesic, or a cyclic
  cover (Randol 1974; Buser), Z_Gamma has Lambda_Gamma >= 0, a simple zero at s = 1, the same type of functional
  equation with the area factor only, and real zeros in (1/2, 1) arbitrarily close to 1.

### 1.2 How Z(s, chi) was computed

By Venkov-Zograf induction, Z_{Gamma(2)}(s, chi) = Z_{PSL2(Z)}(s, rho), rho = Ind chi (dimension 6). With
T = [[1,1],[0,1]], L = [[1,0],[1,1]]:

    Z(s, rho) = det(1 - K_X K_Y),   (K_X F)(z) = sum_{n>=1} X^n (z+n)^{-2s} F(1/(z+n)),  X = rho(T)^{-1}, Y = rho(L)^{-1}.

ARGUED: closed words (n_1, m_1, ..., n_k, m_k) modulo shifts by pairs are the primitive-power hyperbolic classes of
PSL2(Z) (even continued-fraction periods, matrix prod L^{m_i} T^{n_i}); the trace of the k-fold product is
sum over words of tr rho(M_w)^{-1} N_w^{-s}/(1 - N_w^{-1}). In the eigenbasis of rho(T) each block is the scalar
operator with phases e(theta n), whose Taylor matrix at z = 1 uses
sum_{n>=1} e(theta n)(n+1)^{-a} = e(-theta) Li_a(e(theta)) - 1 (Arb polylogarithm at 800 bits; entry radius asserted
below 1e-25), truncated at K x K per block; the determinant is float64.

Files: `sel.py` (library), `t0_sanity.py`, `t1_zero.py`, `t2_fe_psi.py`, `t4_line_gate.py`; logs `t0.log`, `t1.log`,
`t2.log`, `t4.log`; data `t1_zero.json` (not written: the run stopped at a quadrature type error after the zero
table and three FE rows, which are in `t1.log`), `t2_fe_psi.json`, `t4_line_gate.json`.

### 1.3 First decisive test (MEASURED)

**Representation and Euler product.** max abs(rho(g)rho(h) - rho(gh)) = 2.2e-16 on 200 random pairs. For
(a, b) = (0.03, 0.05):

| s | det(1 - K_X K_Y), K = 36 | Euler product over 34,075 closed words (trace <= 400) | difference |
|---|---|---|---|
| 3 | 0.9998407053817947 | 0.9998407053819875 | 1.9e-13 |
| 2 | 0.9933734653424704 | 0.9933735258074591 | 6.0e-8 (tail of the product) |
| 1.5 + 2i | 0.98857299 + 0.01708096 i | 0.98858725 + 0.01707967 i | 1.4e-5 (tail) |

K-convergence at s = 2: 0.9933734654034 (K = 20), ...3425217 (28), ...3424704 (36). For chi = 1 the same code gives
Z_{Gamma(2)}(2) = 0.9924147767 (determinant) against 0.9924152476 (words, trace <= 400), and the scalar block
reproduces route 28's Z_{PSL2(Z)}(2) = 0.9537995978.

**Real zeros in (1/2, 1).** Grid 0.52(0.04)1.00 at K = 24, bisection, then secant at K = 30 and 36.

| (a, b) | cusp twists | sum of abs twists | s0 (K = 24 / 30 / 36) | lambda_0 = s0(1-s0) |
|---|---|---|---|---|
| (0.01, 0.02) | 0.01, 0.02, -0.01 | 0.04 | 0.9503290736153 / 0.9503290738903 / 0.9503290738923 | 0.04720 |
| (0.03, 0.05) | 0.03, 0.05, -0.02 | 0.10 | 0.8398960901181 / 0.8398960900356 / 0.8398960900348 | 0.13447 |
| (0.05, 0.12) | 0.05, 0.12, -0.07 | 0.24 | none found | |
| (0.10, 0.25), (0.15, 0.40), (0.25, 0.60), (1/3, 2/3) | | 0.5 to 1 | none found | |

A zero in (0.50, 0.52) would be missed by the grid. The first-order heuristic lambda_0 ~ sum abs(alpha_j) (energy of
e(alpha z / 2) in each cusp over area 2 pi) gives 0.04 and 0.10; measured 0.0472 and 0.1345.

**Functional equation.** With the predicted constant kappa = 2 sum_j log(2 sin(pi alpha_j)) (not fitted), the relative
error of Z(s)/Z(1-s) against exp(2 pi int v tan(pi v) dv + kappa (s - 1/2)) at K = 36:

| character | s = 0.6 / 0.7 / 0.75 / 0.9 | 0.7 + i | 0.95 + 0.4 i | 0.8 + 3 i | 0.55 + 6 i |
|---|---|---|---|---|---|
| (0.03, 0.05) | 1.7e-13 / 4.1e-13 / 6.9e-13 / 6.9e-13 | 3.8e-12 | 3.8e-13 | 2.4e-9 | 9.5e-6 |
| (0.10, 0.25) | - / 9.4e-16 / - / - | 2.8e-14 | 1.9e-14 | 1.4e-10 | 1.4e-6 |
| (0.01, 0.02) | - / 1.8e-13 / - / - | 1.7e-11 | 1.3e-12 | 4.0e-9 | 1.3e-5 |

The other three sign choices are off by 1.4e-2 to 2.9 at the real points. The growth of the error with height is the
truncation at fixed K (K = 32 against K = 40 on the line: 5e-9, 2e-8, 7e-7 at t = 1, 2.5, 4.5).

**Euler-side check of the zero (independent of the determinant).** Psi_chi(x) = sum over gamma_0^j with
N <= x of tr rho(gamma_0^j) log N(gamma_0), from 211,152 closed words (trace <= 1000). Z(1, chi) != 0, so there is no
term x; the leading term is x^{s0}/s0.

| x | (0.01, 0.02): Psi_chi / (x^{s0}/s0) | (0.03, 0.05): Psi_chi / (x^{s0}/s0) | (0.10, 0.25): Psi_chi / sqrt x | (1/3, 2/3): Psi_chi / sqrt x |
|---|---|---|---|---|
| 1e4 | 1.0374 | 0.9294 | 1.73 | -3.48 |
| 1e5 | 0.9661 | 0.9963 | 0.06 | -5.17 |
| 3e5 | 0.9952 | 1.0132 | 0.45 | 4.17 |
| 9.9e5 | 0.9990 | 1.0319 | -2.26 | -0.75 |

For the two characters with a zero, Psi_chi(9.9e5) = 524,215 and 133,394 (527 and 134 times sqrt x); for the two
without, abs(Psi_chi) <= 5.2 sqrt x on the table. The regular-representation sum divided by 6x is 0.9963 at 9.9e5.

**Zeros on the line (consistency with self-adjointness).** H(t) = Z(1/2 + it) Psi(1/2 + it)^{-1/2} is real to 1.8e-8
(relative) for 0 < t <= 4.5; it has 16 sign changes for (0.03, 0.05) and 11 for (0.10, 0.25) (step 0.05; Weyl main
term T^2/2 = 10.1 plus (T/pi) sum log(1/(2 sin pi alpha_j)) = 7.0 and 0.3). An earlier scan to t = 9 at K = 30 lost
the reality of H (truncation) and is not used.

**Phase gate of route 28 on the pair (one pair, not density-matched).** On sigma = 0.55, 0 < t <= 4.5: Re Z < 0 on
8.9% of the grid for (0.03, 0.05) (min -2.80) and on 0% for (0.10, 0.25) (min +0.071). The pair has no rho/2 family
(no scattering), which removes route 28's confound; the two members still differ in zero density (16 against 11)
and the first one is negative on the real segment (1 - s0, s0), so this is not an attribution.

### 1.4 The Has/Lacks row (first lemma)

| Code | Control | Has | Lacks | Use |
|---|---|---|---|---|
| SEL | Z_{Gamma(2)}(s, chi_{a,b}), chi singular at all cusps and close to 1 (measured: (0.01, 0.02), s0 = 0.95033; (0.03, 0.05), s0 = 0.83990). Compact form (CLASSICAL): Z of a compact surface with a small eigenvalue | Euler product over a free monoid (primitive geodesics), Re s > 1; local parameters chi(gamma) N^{-k}, k >= 0, all in the closed unit disc, the leading one unimodular; functional equation s <-> 1-s with an elementary factor (Barnes type, order 2); entire; counting pi(x) ~ li(x) for the norms; coefficient size log N /(1 - N^{-j}) <= 1.031 log N; all non-real zeros on Re s = 1/2 (self-adjointness). Compact form in addition: Lambda >= 0 and a simple zero at s = 1 in the role of the pole | INT (norms are quadratic units, no ordinary Dirichlet series, no additive structure); order one (zero count ~ area T^2 / 4 pi); finite degree (the local factor is an infinite tower; the degree-one factor is the Ruelle zeta Z(s+1)/Z(s), which has no s <-> 1-s equation); the sign of the zero side (trace formula: sum_j h(r_j) = identity + prime sum, against sum_rho h = archimedean - prime sum for zeta, so zeros of Z are poles of the degree-one Euler product); for the twisted form also Lambda >= 0 and the pole at 1. Off-line zeros: real, finitely many, in (1/2, 1) and mirrored | kills arguments that use an Euler product, a functional equation, parameter bounds and prime-number-theorem size without the integers; kills nothing whose conclusion excludes the real segment or is stated for abs(t) >= t_0 > 0 |

**Conclusions the control leaves untouched.** (1) Every statement about zeros with Im s != 0: it is true for the
control. (2) Every statement at height abs(t) >= t_0 > 0, in particular height-uniform or every-window statements at
large height (Q2 of the map is not tested). (3) Density statements. It refutes only (a) mechanisms whose conclusion
is a zero-free half-plane Re s > theta < 1 including the real segment, and (b) all-zeros positivity criteria (Weil,
Li, Pick type) for the full zero set. For zeta the real segment (0, 1) is excluded by the alternating series for
(1 - 2^{1-s}) zeta(s), which uses the integers.

**Sign lemma (PROVED, elementary).** Z'/Z(s) = sum Lambda_Gamma N^{-s} has residue +ord at each zero, and for the
compact form residue +1 at s = 1. For zeta, -zeta'/zeta has residue +1 at the pole and -ord at zeros. Hence every
inequality of the form "non-negative combination of Re(-zeta'/zeta) at shifted points >= 0" (3-4-1 and its
generalisations, Theorem E, Theorem PC's Landau series) is satisfied by SEL with all singular terms of one sign: it
gives no upper bound on zero mass near Re s = 1 and no contradiction. This is why real zeros of Z can approach 1
while de la Vallee-Poussin holds for zeta.

## 2. Q1 of the map for positive-list items 16-23 and the 7/8 row, against SEL

P = the control satisfies the statement (the statement cannot separate zeta from it); F = fails; N = not formulable.
A star marks an inference from the inputs the statement uses, not a derivation in the lane's formalism.

| Item | Statement | SEL | Reason |
|---|---|---|---|
| 16 | passive cascade: log-derivative = archimedean term - sum of lossless prime stubs, Re s > 1 | P* with sign + | Z'/Z = sum_gamma sum_k log N * w/(1-w), w = chi N^{-s-k}: a convergent chain of stubs on Re s > 1; the k-th stub is lossless on Re s = -k; stubs enter with sign + (not negated). Identity only. |
| 17 | chain is l^1 iff Re s > 1 and l^2 on the Bohr torus iff Re s > 1/2 | P* | uses stub size N^{-sigma} and the count pi(x) ~ li(x) only. SEL has a zero at 0.9503 inside the l^2 region: the l^2 threshold does not exclude zeros. Q-independence of the lengths was not checked (lengths have unbounded multiplicity). |
| 18 | coverage: truncated chain J-contractive on Re s >= 1/2, abs(t) >= t_0 | N* / silent | the reserve is zeta's Binet term; SEL's archimedean term is of order 2. The statement is for abs(t) >= t_0 and the exceptional zero is at t = 0. |
| 19 | Theorem R (zero tolerance of all-order Pick positivity per prime weight) | N | needs an ordinary Dirichlet series (Bohr structure on log n) and is conditional on the positivity it would prove. |
| 20 | Theorem E: Q_L(v) <= A(v) for v >= 0 from Lambda >= 0 and the pole; Theorem F: Theta(t) > 0 | E: F as stated, P reversed (compact form); twisted form: no sign. F: P | sign lemma: for g >= 0 the trace formula gives sum_j h(r_j) >= identity term, a lower bound, and an exceptional eigenvalue adds positive mass. The heat trace is positive for every self-adjoint spectrum, exceptional or not. |
| 21 | u -> log zeta(sigma + iu) positive definite for sigma > 1, zero slack | compact: P with sign - ; twisted: F | -log Z has non-negative coefficients in the compact form; chi(gamma) is complex in the twisted form. |
| 22 | ladder Hecke identity on the theta kernel | N | no theta kernel and no V_n on the integers. Spectral-side remark (CLASSICAL): for congruence characters Hecke operators exist and lambda_0 >= 3/16 (Selberg) / 975/4096 (Kim-Sarnak); chi_{a,b} with generic (a, b) is not a congruence character and has no Hecke algebra. |
| 23 | T-NR as a Tate integral with a non-spherical local vector | N | no adelic local factor. |
| 7/8 row (map 5.6, table row 50) | zero-free half-plane from cubic rows, sharp mean values and FE | argument N; conclusion's analogue F for (0.01, 0.02) (s0 = 0.9503 > 7/8), true for (0.03, 0.05) | every step is a Dirichlet polynomial or Gauss sum over integers (INT). |

Reading. No item among 16-23 separates zeta from SEL by a quantitative failure: 16, 17 pass; 20, 21 pass with the
sign reversed (compact form); 18, 19, 22, 23 and the 7/8 argument are not formulable. The statement "the 7/8 theorem
is the only row violated by every control" (S1) stays true with SEL added, and the failing step for SEL is INT.

**Selberg-side analogue of the 7/8 row (CLASSICAL, stated for orientation).** The half-plane statement for Z_Gamma
of a congruence group, "no real zero in (3/4, 1)", is Selberg's lambda_1 >= 3/16; its proof is Weil's bound for
Kloosterman sums, which enter as Fourier coefficients of Poincare series over the integers. For chi_{a,b} with an
exceptional zero the twisted Kloosterman zeta function has a pole at s0, so square-root cancellation fails there.
In this family the off-line zeros are removed by arithmetic input on integers, not by the geodesic Euler product
with the functional equation: the same split as in the map (section 5 item 6).

## 3. Corrected minimal hitting sets

Map section 2, input level: attributes FE, SIZE, GEOM, INT; lacks-sets consistent with the map's three minimal sets:
DH {SIZE, GEOM}, HEAT {SIZE, GEOM, INT}, TW+- {FE, GEOM}, EA {SIZE, GEOM}, NR {SIZE, GEOM}, B {FE, INT}.

- **Weak reading** (GEOM = every local parameter in the closed unit disc with a unimodular leading one; SIZE = prime-
  number-theorem count and coefficients <= 1.031 log N; FE = s <-> 1-s with an elementary archimedean factor of any
  order). SEL lacks {INT} only. Minimal hitting sets with SEL added: **{INT, GEOM}** and **{FE, SIZE, INT}**.
  {FE, SIZE} and {FE, GEOM} are no longer hitting sets. Every hitting set contains INT.
- **Strict reading** (GEOM = finite degree with all parameters unimodular; SIZE = abs(Lambda(n)) <= log n exactly, order
  one, pole only at 1). SEL-Z lacks {GEOM, SIZE, INT}; the Ruelle zeta lacks {FE, INT} and has infinitely many
  poles. The three sets of the map stand unchanged.
- **Extended attribute list.** Adding ORD (order one, finite degree) and SIGN (zero side enters the explicit formula
  with sign opposite to the prime side) to the weak reading: SEL lacks {INT, ORD, SIGN}; minimal hitting sets are
  {INT, GEOM}, {FE, SIZE, X}, {FE, GEOM, X} with X in {INT, ORD, SIGN}.

PROVED (elementary structural statement): within Selberg zeta functions of Fuchsian groups with unitary characters,
"degree-one Euler product with unimodular parameters" and "functional equation s <-> 1-s" are never properties of
the same function: Z = prod_k R(s+k)^{-1} with R(s) = Z(s+1)/Z(s) the Ruelle zeta; from the equation for Z,
R(s) R(-s) = Psi(1+s)/Psi(s) is elementary (a symmetry s <-> -s); R has its poles on Re s = 1/2 and its zeros on
Re s = -1/2, so a relation R(s) = F(s) R(1-s) forces F to carry the whole spectrum (F is not elementary). The gap named in the assignment (a control with a degree-one unimodular Euler product, s <-> 1-s and
off-line zeros) is therefore not filled by this family. OPEN: whether any Beurling-type system has all three. Over
the integers the converse theorems (Hamburger; degree one in the Selberg class) leave only Dirichlet L-functions,
which is why {INT, GEOM} hits every control.

## 4. Part B: Theorem PC with the PSL2(Z) Selberg zeta as companion

Theorem PC (r3 note, Definition 2.1): g completely multiplicative on the integers, abs(g(p)) <= 1, G pole-coupled at
1; D_g = sum Lambda(n)(1 - Re g(n)) n^{-s} >= 0 termwise; for Re w > sigma*(g): r_G(w) + conj r_G(conj w) = 2 ord_w zeta.
The proposal: use Z = Z_{PSL2(Z)}, whose zeros in 0 < Re s < 1/2 are at rho/2.

**Facts about Z used (CLASSICAL; orders re-measured here by the argument principle, 96 points, radius 0.2, K = 44).**

| point | ord Z | ord of Z(s)/zeta(2s) |
|---|---|---|
| s = 1 | +1.000 | +1.000 |
| s = 1/2 | -1.000 (simple pole; (s - 1/2) Z(s) -> -1.888) | 0.000 |
| s = rho_1 / 2 = 0.25 + 7.0674 i | +1.000 | 0.000 |
| s = 1/2 + 9.5337 i (first cusp form) | +1.000 | +1.000 |
| s = 0.75 (radius 0.04, no zero) | 0.000 | 0.000 |

abs Z at the three zeros: 3.3e-15, 5.4e-14, 2.2e-12. File `t3_partB.py`, `t3.log`, `t3_partB.json`.

**Proposition B1 (PROVED, from Landau's lemma for general Dirichlet series and the cusp form at r_1).** Let
D(s) = sum_nu c_nu nu^{-s}, c_nu >= 0, converge for Re s > 1, and suppose D = c Z'/Z + E on Re s > 1 with c > 0 and E
meromorphic on Re s > sigma_E (sigma_E < 1/2) and holomorphic at 1/2 + i r_1. Then the abscissa of convergence of D is
>= 1/2 and D is singular at a real point >= 1/2. So sigma*(D) >= 1/2 > beta/2 for every zero rho = beta + i gamma of
zeta. *Proof.* D has a pole at 1/2 + i r_1, so the series does not converge in any half-plane containing that
point: sigma_c >= 1/2. Landau: the real point sigma_c is singular. ∎
Every E built from log-derivatives of zeta(s), zeta(2s), zeta(2s - 1) and their real shifts satisfies the
hypothesis (r_1 = 9.5337 is below the first zeta ordinate; zeta(1 + 2 i r_1) != 0). Removing the obstruction needs a
companion carrying the whole Maass spectrum with matching multiplicities.

**The three concrete couplings.**

1. Positive sum Z'/Z - zeta'/zeta = sum Lambda_Gamma N^{-s} + sum Lambda(n) n^{-s}: residue 2 at s = 1, sigma* = 1.
   Not pole-coupled; Theorem PC says nothing (the case of the round-2 twin MT).
2. Pole-cancelling difference Z'/Z + zeta'/zeta: coefficients of both signs. PROVED: N(gamma) = eps^2 with eps a
   quadratic unit is never an integer (eps^2 + eps^{-2} = t^2 - 2 is an integer and 0 < eps^{-2} < 1), so the two
   measures have disjoint supports and no termwise domination exists; the first negative atom is at n = 2 < 6.854.
   Step 1 of the proof of Theorem PC is unavailable. MEASURED: up to 1e5 there are 9,700 negative atoms (prime
   powers) and 21,233 positive atoms (closed words); psi_Gamma(x) - psi(x) = -7.6, -80.1, -83.4, -297.7, -3295.8 at
   x = 1e2, 1e3, 1e4, 1e5, 9.9e5 (Ruelle weights; -0.76 to -3.31 times sqrt x, the real pole at s = 1/2 plus
   oscillation). Even as a singularity count, the real pole at 1/2 gives sigma* >= 1/2.
3. Z'/Z - 2 zeta'/zeta(2s) = sum Lambda_Gamma N^{-s} + 2 sum Lambda(n) n^{-2s}: non-negative coefficients; the pole at
   1/2 and all poles at rho/2 cancel (orders 0, 0 measured); residue +1 at s = 1 remains, sigma* = 1. This is the
   determinant of the scattering matrix phi = xi(2s-1)/xi(2s) read as an identity: the zeta zeros are removed
   exactly and nothing is learned about them.

**Row for the map.** Pole-coupled Landau positivity with the PSL2(Z) Selberg companion: silent. sigma* >= 1/2 for
every positive coupling (Proposition B1); the proposal needs sigma* < beta/2 < 1/2. Stops at: disjoint supports
(no domination) for the pole-cancelling form; the Maass poles on Re s = 1/2 for every positive form. Expected stop
in the r3 synthesis ("scattering terms enter with the continuous-spectrum sign") is confirmed in the sharper form
of the sign lemma of 1.4.

**Inside the geodesic monoid.** PROVED by the proof of Theorem PC verbatim (free monoid, abs(g) <= 1, Landau): for g
completely multiplicative on primitive geodesics with G having a simple zero at 1, r_G(w) + conj r_G(conj w) =
2 ord_w Z for Re w > sigma*(g); Theorem PCR applies verbatim, so the class gives no reduction. The twisted control is
the instance g = chi: G = Z(., chi) has no zero at 1, so it is not coupled, sigma* = 1, and
N_chi(x) = sum Lambda_Gamma (1 - Re chi) is non-decreasing with main terms x - x^{s0}/s0 (the table of 1.3): the zero
mass at 1 has moved to the real point s0, the outcome "real singularity" of Proposition PT.

### Controls for Part B

- **DH.** Leaves at step 1 of Theorem PC, as recorded in the r3 note (Lambda_f not supported on prime powers; 461
  negative Landau coefficients for n <= 3000). Not rerun. Proposition B1 does not involve DH.
- **Beurling.** The proof of Theorem PC uses only a free monoid, abs(g) <= 1 and Landau, so it holds inside every
  Beurling system with zeta_B in place of zeta (inference, not run); Beurling systems with zeros at any
  theta < 1 exist (literature), so the conservation law is location-blind, in agreement with Theorem PCR. Coupling
  a Beurling system to the integer primes fails at the same step as coupling 2 above (disjoint supports).
- **SEL (this lane).** Passes Theorem PC inside its own monoid and has an off-line zero: a third instance of the
  same blindness, with a functional equation present.

## 5. Controls for Part A (map section 2, Q1-Q3 for the control construction itself)

Part A is a control, not an argument for RH, so Q1-Q3 are answered for its use.
- Q1: section 2 above. Against SEL, no positive-list item 16-23 fails quantitatively; the 7/8 row is not formulable
  (INT).
- Q2: SEL does not test height-uniformity. Its violation is at height 0 and finite in number.
- Q3: SEL uses multiplicativity over a free monoid with unimodular leading parameters at every prime geodesic, to
  the right of Re s = 1; it has an s <-> 1-s equation; it still has a zero at 0.9503. What it lacks relative to zeta
  is the integers, order one and the sign of the zero side.

## 6. Three weakest steps

1. **Numerical status of the zero.** Z(s, chi) is a float64 determinant of a truncated operator with no truncation
   bound. Evidence for s0: K-convergence (K = 24, 30, 36 agree to 2e-12), the functional equation with a non-fitted
   constant (1e-13 on the real axis), and the Euler-side leading term (ratio 0.9990 and 1.03 at x = 9.9e5, an
   independent computation with relative noise of order x^{1/2 - s0}). None is an interval certificate. The
   existence of exceptional zeros near chi = 1 is CLASSICAL; the digits are MEASURED.
2. **Identities taken as classical or argued.** The two-step transfer determinant for an induced representation,
   the Venkov-Zograf induction and the functional equation for singular characters were not re-read in a source;
   they are supported by the trace computation in 1.2, by three Euler-product comparisons (1.9e-13 at s = 3) and by
   the FE table. The compact (Lambda >= 0) form of the control is cited (Randol, Buser), not computed.
3. **Attribute readings and starred cells.** Whether SEL "has" SIZE, GEOM and FE depends on the reading in section
   3; the hitting-set correction holds only under the weak reading. The cells for items 16, 17, 18 are inferences
   from the inputs those statements use, not derivations inside the lanes' formalisms (Q-independence of geodesic
   lengths and an order-2 analogue of the coverage reserve were not worked out). The phase-gate comparison is one
   pair without density matching.

## 7. For the engine graph

- `selberg-control-pair`: first test run. Pair: chi_{0.03,0.05} (zero at 0.83990) / chi_{0.10,0.25} (none found), and
  chi_{0.01,0.02} (0.95033). Freeze objects of route 28 other than the sigma = 0.55 gate were not rerun.
- `selberg-zeta-companion`: closed as silent (Proposition B1).
- New node: SEL control row (section 1.4) with the sign lemma; filter consequence: an argument must use the integers
  (additive structure), or order one, or the sign of the zero side, in addition to FE and the Euler product.
