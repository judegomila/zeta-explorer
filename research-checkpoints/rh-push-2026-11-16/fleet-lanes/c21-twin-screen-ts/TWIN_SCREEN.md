# TWIN_SCREEN (TS), version 1

Date 2026-11-20. Round 21, lane `c21-twin-screen-ts`, kind combine (filter). Paper only; no numerics; no
server unit. Nothing in this file is a statement about zeros of zeta. This file is a filter: it has no answer
for requirement R4 and scores 0.

Use (STRATEGY version 6, section 2, "Twin screen"): before a lane is launched on a device, statistic or
screening combination, find its row here. A row with verdict 1, 2 or 3 is not launched. A row "none" names the
row or lane that closes the object for another reason; a row "none, no closing row" is an input of the
inverse-explore slot (section 6).

Labels: PROVED-rel (relative to a refereed statement on file, named), CLASSICAL, ARGUED, TYPED (classified from
the text of a map row or device entry; the lane behind it was not opened in this lane), OPEN.

Sources: `c20-u4-second-order-archimedean-mixed-form` (Lemma S, Proposition C, K3-M; RESULT.md and REFEREE.md
with the independent referee section, F1 to F6), `c20-euler-shape-rigidity-infinite-modified-primes` (Theorems
A, B, C; independent referee section R-1 to R-6), `c20-statement-o-line2-dh-pick-kernel-certified-server`
(Theorems A, B, C of that lane; cited below as line-2 Theorems), `c20-referee-theorem-d-headline-and-r19`
(Lemma E in `REFEREE2_c1-leeyang-krein-limit.md`), `engine/curated/devices.json` (56 devices, 6 pending items,
11 cells; read as text), `campaign/screened.jsonl` (160 lines), `engine/nodes/*.json` (1,291 nodes),
`OBSTRUCTION_MAP.md` sections 2, 3.2 and the rows cited.

## 1. The three reasons as statements

Notation. F(s) = sum a(n) n^-s with a(1) = 1; Lambda_F defined by -F'/F = sum Lambda_F(n) n^-s. Stage P: the
data (a(n))_{n < P}, equivalently (Lambda_F(n))_{n < P} (the recursion a(n) log n = sum_{d | n} Lambda_F(d) a(n/d)
is triangular). u = log P. A_P = sum_{n < P} Lambda_F(n) n^(-1/2) C_(log n) on L^2[0, u] (C_a the compressed
shift); Gamma_c the compression of the multiplier G(1/2 + ix), G(s) = psi(s/2)/2 - (log pi)/2;
Lg = log(t/2 pi). Window vector at height t: h = e^(ist) h_0, h_0 in H^1_0[0, u]. y = q^(1/2 - s).

### Reason 1 (window scalar)

**Statement R1-S (PROVED-rel Lemma S and Proposition C of the c20 U4 lane; independent referee holds, F1, F2).**
Hypotheses: t >= 43; h a window vector with norm(h_0') <= K norm(h_0); P <= t^theta', theta' < 1; W a word of
length at most 2 in Gamma_c, Gamma_c*, A_P, A_P*. Then, with eps' = 8 (log t/t) norm(h_0') and
G_t = G(1/2 + it) = Lg/2 + i pi/4 + O(1/t),

    abs(<h, W h> - <h, W_0 h>) <= eps' (abs(G_t) + norm(A_P) + eps') norm(h_0),   norm(A_P) <= 2.1 P^(1/2),

W_0 being W with Gamma_c replaced by the scalar G_t. So every Hermitian form of degree at most 2 that pairs
the prime side below P with the gamma side on such vectors equals a polynomial in Lg times the first-order
band form <h, (Lg - 2 Re A_P) h>, plus the pure prime words norm(A_P h)^2, norm(A_P* h)^2, Re(d <h, A_P^2 h>)
with height-independent coefficients, plus O(K t^(theta'/2 - 1) log t) norm(h_0)^2.

Applies to an object when: the object is such a form (degree <= 2, window vectors, theta' < 1). What then
closes it: the first-order band form is map row P58 (restatement; ZQ passes in the lattice model), the pure
words fall under Reason 2.

Remark (ARGUED from the proof; not in the referee files): the estimate itself uses only P^(1/2) log t = o(t);
the restriction theta' < 1 is the range in which the lane read the first-order band form (below the band of
the reflected half). The source hypothesis theta' < 1 is kept in every verdict.

Not covered (so "reason 1" is not entered for these): words of degree 3 or more (two words do not reduce;
CHECKED in 3 float64 cells only, referee F1); vectors without the bound on norm(h_0')/norm(h_0); functions of
the operators that are not polynomial (inverses, determinants, logarithms); theta' >= 1, where the gamma side
enters through the phase theta(t) and the reflected half of the approximate functional equation.

### Reason 2 (twin invisibility at a stage)

**Statement R2-S (PROVED-rel K3-M of the c20 U4 lane, independent referee holds; coefficient form proved in
section 2 (i)).** Let X be any functional of the stage data (a(n))_{n < P} and of the gamma factor (and of
t, test vectors, parameters). Then X has the same value for zeta and for every F with zeta's gamma factor and
a_F(n) = 1 for n < P. Members with zeta's exact functional equation, integer frequencies and multiplicative
coefficients:

| twin | F/zeta | invisible when | zeros | poles |
|---|---|---|---|---|
| HQ1(q, eps) | 1 + eps y/(1 - y)^2 | q >= P | off the line for eps > 4, at Re s = 1/2 +- log r/log q, heights (2k+1) pi/log q | double, on the line, heights 2 pi k/log q |
| HQ2(q, eps) | 1 + eps y^2/(1 - y)^4 | q^2 >= P | off the line for every eps > 0 | quadruple, on the line |
| HQ3, HQ4(q; a, b) | palindromic quotient with zeros at abs(y) = e^(+-A), poles at abs(y) = e^(+-B) | q >= P | on Re s = 1/2 +- a | on Re s = 1/2 +- b |
| T-NR(q, c) | y^-1 (1 + c y + y^2) | q >= P, with Gamma_c replaced by Gamma_c + log q (conductor q) | off the line for c > 2 | none |

Each twin has zeros in every height interval of length 2 pi/log q (at most 2 pi/u for q >= P, 4 pi/u for HQ2).
Consequence: no implication "X(F; t, P) lies in a set, hence F has no zero off the line within pi/u of height
t" is valid on the class {zeta's functional equation, integer frequencies, multiplicative coefficients} when
zeta satisfies its hypothesis. In particular no stage-level inequality at P = t^theta', theta' < 1, locates
zeros near t in that class.

Applies to an object when: at each use the object reads a finite stage (finite support, finite section, finite
set of primes, test functions of compact support in the logarithmic variable: support in [-u, u] reads
n < e^u) together with the gamma side. K3-M does not require P below the height; the relation to the height
matters only for which fixed twin is seen: a fixed q is read from heights with P(t) > q^(j0) and is decided
there by the size of its local parameter at q (one prime).

Limits (referee E1 of the U4 lane; kept here). R2-S does not show that a stage inequality is false or without
content. HQ1 to HQ4 have poles; a class with a pole clause excludes them, and T-NR is excluded by the
conductor. With functional equation, pole clause and finite order the class is {zeta} by Hamburger (map rows
P56, P57, X1; identification, class U3): then the stage plays no role in the exclusion. R2-S says that the
stage inequality is not the step that separates zeta from the twins.

### Reason 3 (stage-level tests are not arithmetic)

**Statement R3-E (PROVED-rel Lemma E; second-referee file of Theorem D; refereed with correction E4).** If
a(1) = 1 and sum_{n >= 2} abs(a(n)) n^(-sigma_0) < 1 (for abs(a(n)) <= 1: sigma_0 = 2), then with
log F = sum b(n) n^-s the stages f_N = exp(sum_{2 <= n <= N} b(n) n^-s) are entire, have no zero, and converge
to F locally uniformly on Re s >= sigma_0. This holds for the Davenport-Heilbronn function (b(6) = 1.0807009,
not supported on prime powers). Conversely the Euler stages of the multiplicative controls T-NR, HQ2, G_q have
zeros in the strip. So "F is a limit of zero-free stages right of an abscissa" is neither implied by nor
implies multiplicativity; for Euler stages it is the clause "no local factor vanishes", a size clause at each
prime.

**Statement R3-C (PROVED-rel line-2 Theorem C; independent referee holds as stated).** For every N >= 1 and
beta > 0 there is a finite multiset Q of 3-smooth integers such that D_Q = f_DH prod_{q in Q} (1 + sqrt(q) q^-s)
is an ordinary Dirichlet series with exact functional equation (conductor 5 prod q), positive even kernel, no
Euler product, all zeros of f_DH (including 0.8085171825 + 85.6993484854 i and zeros with Re s > 1), and all
Pick matrices of order <= N with nodes in [0, beta] positive definite. Also (line-2 Theorem A): K_(xi E) =
K_xi + K_E >= K_xi at every order and node set, so zeta(s) B_c(s) (non-multiplicative coefficients) passes every
finite Pick statement that zeta passes.

Applies to an object when its defining property is (a) existence, or a limit, of zero-free finite stages, or
(b) positivity of Pick matrices (equivalently Richards or Schur-parameter signs) up to a finite order on a
bounded node range.

Limits. The control depends on N (line-2 Theorem B: no single function with an off-line zero passes every
order). Node ranges reaching infinity are not covered. Log-concavity of the kernel is not kept by D_Q
(MEASURED false for most Q). R3-E is proved on Re s >= sigma_0 only; convergence of the exponential stages of
DH further left is MEASURED.

Remark R3-add (ARGUED; not used for any verdict below except where marked "3, ARGUED"). The proof of line-2
Theorem C uses only: the matrix is additive under products of functions (it is linear in the logarithmic
derivative), it is continuous on a compact parameter set, and one admissible symmetric factor contributes a
matrix bounded below by a positive constant there. Any finite family of conditions with these three properties
(Li coefficients up to order n, a Weil form on a finite-dimensional test space where the lattice of zeros of
the added factor is a uniqueness set) is passed by a product of the same type. Not written out; the conductor
and hence the gamma side changes with Q.

## 2. First lemma (combinable (i)): where a twin can be

Setting. G = prod_p L_p(p^-s), L_p a power series with L_p(0) = 1, absolutely convergent in some half-plane;
n_p(y) = 1/(L_p(y)(1 - y)); N = zeta/G = prod n_p(p^-s) with coefficients c(n) (multiplicative). G has zeta's
functional equation: gam(s) G(s) = gam(1 - s) G(1 - s) near the line. Local clause (Lc_p): n_p is analytic in
abs(y) < p^(-1/2) and continuous on abs(y) <= p^(-1/2); then delta_p = sup over that disc of abs(n_p - 1). For a
rational L_p, (Lc_p) fails exactly when L_p has a zero in abs(y) <= p^(-1/2), that is when the local factor of
G at p vanishes at points with Re s >= 1/2.

**Lemma TS-1.** Let G be as above, G != zeta, and P >= 2.

(i) (invisibility; PROVED here, elementary) a_G(n) = 1 for all n < P if and only if c(n) = 0 for 2 <= n < P, if
and only if for every prime p the first non-constant term of n_p is y^(j_p) with p^(j_p) >= P. In that case
Lambda_G(n) = Lambda(n) for n < P and every functional of the stage data and the gamma factor takes the same
value on G and on zeta (R2-S).
Proof. zeta = G N gives 1 = sum_{d | n} a_G(d) c(n/d); by induction on n, a_G(m) = 1 for all m < P iff c(m) = 0
for 2 <= m < P. c is multiplicative, and n < P forces every prime-power component of n to be < P, so the
condition is c(p^k) = 0 for p^k < P. The triangular recursion gives the statement for Lambda_G. QED. The
equivalence does not use the functional equation or the Euler product of G.

(ii) (no twin in the summable class; PROVED-rel Theorem A of the euler-shape lane, independent referee holds)
If (Lc_p) holds for every p and sum_p delta_p is finite, then G = zeta. Hence every twin is in exactly one of:

- (T1) local twins: (Lc_p) fails for at least one prime;
- (T2) boundary regime: (Lc_p) holds for every prime and sum_p delta_p diverges. Each delta_p is finite, so the
  divergence is carried by the primes beyond any bound: a T2 twin is modified at infinitely many primes and
  beyond every stage.

(iii) (T1 is non-empty at every stage; PROVED-rel K3-M) HQ1, HQ3, HQ4 with q >= P and HQ2 with q^2 >= P are in
T1 and invisible at stage P (their n_q has a pole in the closed disc: on the boundary for HQ1 with
0 < eps <= 4, inside for eps > 4, HQ3, HQ4; referee R-4 of the euler-shape lane). T-NR(q, c) has the functional equation
with conductor q, so it is outside the class of this lemma; it is invisible at stage P up to the shift of
Gamma_c by log q (K3-M), and its local factor 1 + c y + y^2 (roots of product 1) has a root in the closed unit
disc of the variable y = q^(1/2 - s) for every real c, so it is of the same local kind. Membership in T1 is a property of a single local factor; it is read by any stage that contains
enough powers of that prime and is not a relation between different primes.

(iv) (T2; PROVED-rel Theorem C of the euler-shape lane, with its referee's wording E1) If the relative
product converges absolutely in every half-plane Re s > 1/2 (regime (K)), every zero of G off the line is a
zero of zeta, so such a twin has no off-line zero of its own; if moreover zeta/G is of finite order, G = zeta
unless G/zeta vanishes on the line. If the relative product has abscissa above 1/2 (regime 3), nothing is
decided. Existence of a T2 twin: OPEN in both sub-regimes (lead BR-2, BR-3; BR-0 asks whether Hamburger with
finitely many poles already excludes regime 3 under finite order).

Reading for the screen.
- A stage object cannot reject T1 twins beyond its stage. A class that excludes T1 must carry a clause on every
  local factor (no zero of L_p in abs(y) <= p^(-1/2), or a pole clause on G, or a bound on local parameters);
  this is a size clause at each prime.
- Inside that class, with the functional equation, the only twins left are T2. T2 is the one place on file
  where a statement relating infinitely many primes could be required, and no member of it is known.
- So a candidate for the inverse-explore slot is tested first against (a) a T1 twin at a prime beyond whatever
  stage it reads, (b) the product D_Q and the exponential stages of DH, and it must be stated on a class in
  which T2 is the remaining ambiguity.

## 3. Table (i): device types of `engine/curated/devices.json`

Columns: stage = finite stage the device reads, if any; pair = whether it pairs a prime-side form with the
gamma side in a window at height t; DH/D_Q = whether the defining property holds for DH stages (R3-E) or the
product D_Q (R3-C); verdict = 1, 2, 3 or none. For "none" the closing row and its kind are given:
M mean value or density (MV-CAP), I identity or identification with no inequality, T restatement of the
target or needs it as input, F passed at every stage by a named control that is not a stage twin, R reads
only Re s >= 1 or another aspect, V local zero detector or verified height, X false for zeta or for every
object, S finite measured search, FL floored. Rows 16 to 56 except 26, 28, 53, 55 are TYPED from the device
evidence text; rows marked * were checked against the map row or lane text in the referee sample.

| # | device type | stage | pair | DH / D_Q | verdict | closing row or note |
|---|---|---|---|---|---|---|
| 1 | mean-value-convexity | none (averages over heights) | no | mean values exist for DH | none | M: map section 5 part 1, P14, P15, P29 |
| 2 | exact-uniqueness | none (reads the function) | no | D_Q has an exact functional equation of another conductor; the class is {zeta} | none | I: L2, P6 |
| 3 | residue-explicit-formula | none for general tests; P = e^u for tests supported in [-u, u] | yes (it is the pairing) | identity holds for DH and D_Q | none (2 for tests of compact support) | I: P1, P8 (exact, no sign) |
| 4 | positive-kernel-transport | finite ladder steps = finite Pick orders (P3, P7) | no | D_Q passes order N on bounded nodes; DH passes to order 148 at the tested nodes | 3 | also P3 (verified height), G13, G17 |
| 5 | maximum-principle | none | no | fails for DH (S not Schur) because it is the target | none | T: P3, G20; node statement (circular gap) |
| 6 | dual-measure-compactness | finite scale x (prime terms up to x) | no | not checked | 2 at each finite scale, TYPED | limit step: P36 (cofinal limit controlled only in mean square) |
| 7 | recurrence-ergodicity | none | no | property of the flow, shared by all controls | none | T: P39 (hypothesis as strong as the zero-free statement). P39 states the fact behind reason 2 for Euler stages: an off-line zero is carried by the tail beyond every finite prime set |
| 8 | euler-fe-phase-at-height | primes <= P at one height | yes, through theta(t) | P40: the coupling is the functional equation alone and holds for DH to O(t^-2) | 2 (1 for its forms of degree <= 2 at theta' < 1) | P40, S12; c4-fe-stage-rouche-crossing, c4-stage-collision-law, c2-euler-cone-fe-rigidity |
| 9 | selberg-operator | none | no | not formulable | none | I/F: G24 |
| 10 | monotone-flow-functional | none | no | HEAT passes (flow-blind) | none | F (HEAT): F1, Q20, F8 |
| 11 | geometric-positivity * | none | no | P38: averaged brackets are of DH type (measured) | none | no object: T3 (nothing is known that Q_L counts; ARGUED, unrefereed); P38 (MEASURED; the needed infimum is not known under RH) |
| 12 | stage-limit | Euler or exponential stages | no | R3-E: zero-free stages exist for DH | 3 (2 at each stage) | Q19, Q21; second referee of Theorem D |
| 13 | section-extraction | finite prime set P (polydisc) | yes (gamma one-port) | not checked | 2 | Q12, Q22 |
| 14 | test-restriction-commutator | compact test support; finite window; real-node Pick LMI (S11) | yes for the window SDP | S11: the LMI never contains the primes | 2 (window and compact-support forms), 3 (Pick LMI) | P35, S11, P29; the commutator identities G22, G25 are kind I |
| 15 | finite-support-positivity * | finite support (P9: tests on [0, T), stage e^T) or finite order (P3, P21, Schwarzian stage: order 4) | partly | finite orders: zeta B_c passes whatever zeta passes at every node set (line-2 Theorem A); D_Q on bounded node ranges; DH Taylor blocks positive to order 164 (P21) | 2 (P9) and 3 (P3, P21, Schwarzian stage) | composite: P2 is kind X (margin false), P10 kind T, P22 kind F (kappa_sharp passes). R3-C does not cover the lacunary node set {4^k} (unbounded range); P18 closes it with its own control (an added off-line quadruple keeps positivity) |
| 16 | hecke-compression-lax-phillips | none (eigen-relation at each prime, parameter rho) | no | not formulable | none | F (EIS-w): G26 |
| 17 | hecke-correspondence-recurrence | none | no | not formulable | none | F (EIS-w): G31 |
| 18 | helson-discrepancy | none: hypothesis on all partial sums | no | DH not in the class (not completely multiplicative) | none | closed, STRATEGY 3.1 item 8: a theorem about F relative to zeta; Beurling passes. The one closed device with no finite stage and a global multiplicative hypothesis |
| 19 | twisted-discrepancy | none | no | not formulable | none | I (strict form: chi = n^(-i alpha)), F (THIN): c5-twisted-helson-arcs |
| 20 | frequency-only | finite sets of frequencies | no | every Dirichlet-series control passes, DH included | none | F: c5-device-table-extension |
| 21 | padic-special-values * | none | no | interpolation twin passes | none | R/F: c5-device-table-extension |
| 22 | tensor-squeeze | none | no | every unimodular twist passes | none | F (U): c5-device-table-extension |
| 23 | strip-dtn-identity | none | no | holds for DH with a pole sum | none | I: c5-device-table-extension |
| 24 | sum-product-vinogradov | none | no | not checked | none | R: crosses Re s = 1 by (log t)^(-2/3) only; closed by argument |
| 25 | quadratic-positivity-companions | none | no | coefficient squares positive for DH | none | R/F: P50 |
| 26 | coherent-set-large-sieve | Dirichlet polynomials inside a mean value over a coherent set | no | controls with zeros left of 7/8 pass by design | none | FL, not closed: Z15, Z16 (floor 5/6 at r = 6; proved 7/8) |
| 27 | effective-order-two | as 26 | no | not checked | none | T: STRATEGY 3.1 item 22 (each item ends at an input of zero-free type for the twist family) |
| 28 | laurent-shell-gamma-section | finite section P | yes (gamma one-port on the shell) | every statement holds for DH | 2 | c7-laurent-shell-gamma-section; rows under Q12/Q22; P growing with t is rows 53, 55 |
| 29 | function-field-order2-vertex * | none (F_q[T] model) | no | not formulable (the low input fails for the Moebius-twisted weight) | none | X: STRATEGY 3.1 item 23 (c7-ff-order2-vertex-exact, c9-mv6-ff-window-exact, c10-ff-completed-rows-692: the low input and the completed-row law fail in exact arithmetic); constraint Z24 |
| 30 | vector-specific-row-mean-square | none | no | not separated from random vectors in F_q[T] | none | M/T: Z30 (mean value of 1/L over a family containing the target) |
| 31 | nonprincipal-row-cancellation | none | no | present for random non-multiplicative weights in F_q[T] | none | T: Z31 (necessary and sufficient given the low estimate) |
| 32 | positive-term-sum-rule * | none for the sum rule; stage functionals at P | no | DH, HEAT fail only at chain formation | none (2 for the stage functionals) | F (U, THIN, Liouville, WT, FM pass): Q27. The reason on file for the stage functionals is rotation invariance (same distribution for every unimodular chain; K1), to which R2-S adds the twins beyond P |
| 33 | single-row-bridge | none | no | not formulable | none | I: Q26 (identity with no sign; blind to zeros of L0) |
| 34 | landau-siegel-mechanism | none | no | not formulable | none | R: conductor aspect only; c7-landau-siegel-device-read |
| 35 | twist-modulus-reciprocity | twist length X (not a coefficient stage) | no | not checked | none | F (T-NR at a prime outside the twists; window translate): Z34. Analogue of reason 2 in the twist variable, not an instance |
| 36 | regular-rep-matrix-bridge | none | no | E_a and T-NR lifts pass | none | T/F: c11-rs1-regular-rep-matrix-bridge |
| 37 | de-branges-positivity-family * | none | no | a lattice passes | none | X/T: c11-rs3-debranges-positivity-family (false for zeta at a named step, MEASURED, or a restatement of T3, G6) |
| 38 | bost-connes-crossed-product-positivity | finitely many local factors for the KMS state | no | T-NR passes | none | F/R: D8 |
| 39 | depth-aspect-height-transfer | none | no | zeta and every control fail the step identically | none | X: Z35 |
| 40 | x04-oval-hecke-fricke-loading | none | no | T-NR, E_a pass | none | I/F: G33 |
| 41 | kacmoody-loop-eisenstein-maass-selberg | none | no | T-NR, BLS pass; closed under Blaschke insertions | none | F: c13-kacmoody lane |
| 42 | fourier-interpolation-zero-nodes | none | no | T-NR satisfies (I-1) | none | F/R: G34 |
| 43 | lrs-amplification-eisenstein-at-zero | none | no | E_a, EIS-w, WT pass | none | F: G35 |
| 44 | edrei-thoma-local-total-positivity | one local factor | no | holds for T-NR (c >= 2), E_a | none | F: c13 census. A per-prime clause of the kind that defines T1 in Lemma TS-1 |
| 45 | bilinear-reciprocity-height-jform | none | no | DH has the same sign rule | none | I/F: c13-bilinear-reciprocity-height-antibridge |
| 46 | dictionary-d-kernel-sign-functionals | none (kernel side) | no | 0 functionals reject battery DH | none | S: G36 |
| 47 | laxphillips-hecke-norm-outside-l2 | none | no | EIS-w passes | none | F/T: G37 |
| 48 | joint-pair-ratio-crossgram-twist-transfer | none | no | DH (q = +-1 mod 5), T-NR, E_a pass | none | F: G38 |
| 49 | lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal | none | no | generic parameter passes | none | F: G39 |
| 50 | catalogued-x2-inequality-torus-parameter-eigenobject | none | no | EIS-w, E_a pass | none | F: G40 |
| 51 | dictionary-dj-joint-pair-sign-functionals | none | no | 5 of 28 DH members keep the functional equation under the twist | none | S: G41 |
| 52 | window-fe-rigidity-growing-count-one-span | pi(N) prime conditions in the finite model | windows of the functional equation, no prime-side form | not checked | none | F (translate WT): S12, S12b. HQ twins are excluded from its class by the local shape (degree one, unimodular); the remaining twins are T2 (Lemma TS-1) |
| 53 | fejer-section-prime-chain-growing-p | P = t^theta | yes | no proved step uses multiplicativity | 2 and 1 | c15-u7 lane; P45 |
| 54 | dictionary-dn-nonhomogeneous-pair-triple-sign-functionals | none | no | not checked | none | S: c15, c16 lanes |
| 55 | tz-one-sided-completion-bound-band | P = t^theta', 1/2 < theta' <= 1 | yes | ZQ passes (lattice model) | 1 and 2 (theta' < 1; at theta' = 1 only 2) | P58 |
| 56 | exact-relation-rigidity | none | no | not formulable | none | I: X1; control HQ2 at a fixed q with the pole clause deleted |

Count of primary verdicts: reason 3: rows 4, 12 (2). Reason 2 alone or first: rows 6, 8, 13, 14, 28 (5).
Reasons 2 and 3: row 15 (1). Reasons 1 and 2: rows 53, 55 (2). Total covered by at least one of the three
reasons: **10 of 56**. Covered in part (a stated sub-form only): rows 3, 32. None of the three: **46 of 56**,
each with a closing row on file (45 closed, 1 floored: row 26). No device type is left without a row. By first
kind listed: F 17 (rows 10, 16, 17, 20, 22, 32, 35, 38, 41, 42, 43, 44, 47, 48, 49, 50, 52); I 9 (2, 3, 9, 19,
23, 33, 40, 45, 56); T 5 (5, 7, 27, 31, 36); R 4 (21, 24, 25, 34); X 3 (29, 37, 39); S 3 (46, 51, 54); M 2 (1,
30); FL 1 (26); other 2 (row 11: no object; row 18: a theorem relative to zeta, with Beurling passing). Sum 46.
The letters are a reading aid; several rows carry two.

### Pending items

| # | pending item (state in devices.json) | stage | pair | verdict | closing row or note |
|---|---|---|---|---|---|
| p1 | Hecke amplifiers with T < N on truncated Eisenstein data (tried-not-closed) | amplifier length T in the Hecke eigenvalues of a zero-indexed object, not a coefficient stage of zeta | no | none | MEASURED obstruction, EIS-w shares the excess (G42); not a proved closure |
| p2 | rank-2 Gram positivity under symmetric Blaschke insertions (tried-not-closed) | none | no | none | D10; measured to pass, ZQ rational form passes; neither proved nor refuted |
| p3 | cell U5 beyond a span (open) | more than pi(N) prime conditions | windows of the functional equation | none | no candidate device; Q31, S12b; by Lemma TS-1 the exact-FE form of its question is the T2 question (lead BR) |
| p4 | density (family) quadratic forms with automorphic companions (open, not run) | none | no | none | M by rule (MV-CAP); no lane |
| p5 | model vertices with 1 < h <= 3 in the order-2 ledger (open, underived) | none | no | none | inside the 7/8 architecture; STRATEGY 3.1 item 22 |
| p6 | non-locality step 4 of the Rouche lane (open) | stage X (primes <= X), X <= t^2 | yes, FE-symmetrised stage | 2 at each stage | the step itself is ARGUED in c4-fe-stage-rouche-crossing: for X growing the inequality is the half-plane statement (kind T) |

### Cells (read classes, not devices; listed for the inverse-explore slot)

| cell | state in devices.json | verdict | note |
|---|---|---|---|
| U3, U2-POS, U6 (e), U6 (f) | closed | none | identification or control rows (P56, D8, G33 and their lanes) |
| U4 | cell (closed by its round-19 and round-20 lanes; engine state owed) | 1 and 2 for band-u reads at P = t^theta', degree <= 2 | G44, G45, c20 U4 lane |
| U6 (a), U6 (b), U6 (c) | cell (closed by their lanes, STRATEGY 3.1 items 66 to 69; engine state owed) | none | kind F or I by those lanes; not re-read here |
| U6 (d) | cell | none | no object displayed |
| U6 (g) | tried-not-closed | none | see p2 |
| U8 beyond dictionary DU | cell | none | no object displayed; G43 (finite search, outcome none) |

## 4. Table (ii): statistic classes read by the screening arm

Classes were formed from the field `obstruction` of the 160 lines of `screened.jsonl` (all 160 have
classification "closed"). Example lines are 1-based line numbers of that file. The assignment of every line to
a class was not tabulated; the examples were read.

| # | statistic class | example lines | stage | pair | verdict | reason on file |
|---|---|---|---|---|---|---|
| s1 | mean value, proportion or density over heights | 1, 28, 51, 96, 132, 138 | none | no | none | M (MV-CAP); exclusion (d) of STRATEGY section 2 |
| s2 | function of the list of on-line ordinates alone | 5, 7, 11, 20, 37, 38, 119, 140 | none | no | none | F: T-NR takes the same value; exclusion (a) |
| s3 | sum over zeros with cutoff at or above the height (explicit formula over the control's own zeros) | 77, 79, 93, 105, 150 | none | no | none | V; exclusion (b) |
| s4 | pointwise or window sign test near the height (local zero detector, argument principle) | 3, 4, 19, 21, 24, 27, 61, 62, 87, 114, 116, 142 | none | no | none | V: verified height in another form |
| s5 | Weil-type positivity with finite support or finite mesh (onset where support resolves the first off-line zero) | 14, 17, 47, 48, 60, 121, 123, 137, 157 to 160 | support N or band u | yes | 2 | twin beyond the support passes; line 70 states it ("no fixed support separates T-NR(q) or a flip at a prime beyond it") |
| s6 | finite-order positivity (Pick pivots, Richards, CMV, Li, Toeplitz order) with onset proportional to a zero count | 22, 39, 80, 95, 103, 109 to 111, 125, 127, 131, 143, 145 to 147 | order N, not a coefficient stage | no | 3 for Pick, Richards, CMV on bounded nodes (R3-C); 3, ARGUED for Li and Toeplitz orders (R3-add) | also V: onset = zero count |
| s7 | onset at the first prime where the coefficients differ from zeta's | 44, 70, 106, 107, 129 | support N | no | 2 | this is reason 2 read as a statistic |
| s8 | statistic on the prime torus at a finite prime set (rotation invariant) | 9, 117, 118, 120 | primes <= P | at one height | 2 | K1 of the c19/c20 U4 lanes: same closure of values for every unimodular chain; "separation only at t <= P" |
| s9 | coefficient size or a statistic readable on Re s >= 1 (depends on abs(c(n)), twist invariant) | 10, 25, 26, 33, 85, 89, 92, 108, 113, 130, 133, 135, 141 | none | no | none | R; exclusion (c) |
| s10 | kernel shape (flow stable, not a class property) | 13, 15, 16, 97, 99, 101 to 104 | none | no | none | F (HEAT) and X (comparison L-functions fail) |
| s11 | identity or bound valid for every object | 23, 50, 54, 57, 59, 83, 98, 136, 146, 154, 155 | none | no | none | I |
| s12 | premise false for zeta | 6, 36, 41, 42, 64, 81, 115 | none | no | none | X |
| s13 | sign or pole statistic (pole at 1 with Lambda >= 0; gamma-factor mismatch) | 49, 52, 90, 126, 153, 156 | none | no | none | R/X: comparison L-functions fail with the controls |
| s14 | statement in another aspect (7/8 strip, cubic Hecke family, conductor aspect) | 32, 71, 152 | none | no | none | R: not a separator for zeros of zeta |

Covered by the three reasons: s5, s6, s7, s8 (4 of 14). The four exclusions of the version-5 screening rule
are s1 to s3 and s9; none of them is one of the three reasons.

## 5. Table (iii): objects of the geometric program joined to arithmetic inputs

Arithmetic inputs on file that use multiplicativity at all primes: E = Euler product as the prime chain or
torus lift (G10, Q12, Q22; convergent in Re s > 1); H = Hecke relations at every prime (G14, G15, G16, G22,
G25, G26, G31, G33); C = coherent set with large sieve, 7/8 type (G20, Q26, Z15); D = complete multiplicativity
with power-saving discrepancy (c4 Helson lane); B = Bost-Connes action of N^x (D8). Entries are TYPED from the
map rows unless a round-20 lane is named. "no object" = no joined object is displayed on file; such a cell is
not a row.

| object (nodes) | finite stage | pairs prime side with gamma side in a window | property for DH stages / D_Q | verdict for the object | joins: E / H / C / D / B |
|---|---|---|---|---|---|
| twin ladder (`twin-ladder-network`, `t3-residual-inequality`) | yes: ladder cut at primes <= P; T3 on finite test sets | yes: direct ladder against the bridge chi | T3 on a finite test set in a bounded range is a finite Pick-type condition: D_Q passes (R3-C) | 2, 3 at finite stages (1 in window form); the full statement is RH (T) | E: 2 and 1 (rows 53, 55; G10). H: none, I (G14: the eigen-section condition restates the Euler factor at p). C: none, T (G20). D: no object. B: none, F (c17-u6e: twins b xi pass every positivity of a state) |
| bridge (`zv-finite-bridge-balance`, `bridge-winding-equals-NT`; H_c = A* M_c A) | none for the bare object | only when F is replaced by an Euler stage | H_c = sum_gamma y_gamma conj(y_gammabar) holds for every even F of order one, DH included (G6) | none: I/T (G1, G2, G6) | E: 2 and 1 (rows 8, 53, 55). H: none, I (G14, G25). C: none, I (Q26, G20). D: no object. B: no object |
| bridge shear (`zv-signed-shear-w`, shear Gram nodes) | none | no | kernel forms are flow stable (HEAT passes); G8: a symmetric entire control with an off-line quartet has L_1 > 0 on the line | none: T (W > 0 is RH), V, F | E: none, V (lines 3, 4 of screened.jsonl). H: none, I (G22). C, D, B: no object |
| antibridge (Gamma_-; G1; node `tz-one-sided-completion-bound-band`) | band u = log P in the band form | yes in the band form | Corollary S': no Hankel block against a window beyond 8 (log t/t) norm(h_0') | band form: 1 and 2 (P58); bare: none, T (Gamma_- = 0 iff RH) | E: 1 and 2 (P58). H: none, I/T (G25). Twist reciprocity (device 45, not one of the five inputs): none, I/F. C, D, B: no object |
| torus (`euler-product-torus-parametrisation`, `dbn-prime-torus-phase-closure`; lattice tori G3, G12, G16) | yes: primes <= N | at one height through the main-sum length (P40) | P40: holds for DH to O(t^-2); G16: lattice Hecke relations hold for every lattice | prime torus: 2 (K1); lattice tori: none, I | E: 2. H: none, I (G16, G3). C, D, B: no object |
| Klein (`zv-klein-quotient`, `klein-phase-transport-certificate`) | none | no | invariants N_K and the seam sign are blind to off-line pairs (G13) | none: I (G13), T (G17) | E: no object. H: none, I/F (G17, G33: T-NR, E_a pass). C, D, B: no object |
| spinor (`zv-bloch-spinor-state`; square-root form) | none | no | identity for every even F of order one (G6) | none: T/I (G6, G18) | E: none, T (G6 with G10). H: none, I (P35, G18). C: none, I (Q26). D, B: no object |
| twistor (`zv-twistor-map-s4`, `split-twistor-wide-bridge`) | none | no | the real structure is a choice; no positivity (G19) | none: I (G19) | H: none, I (G19). E, C, D, B: no object |
| zero channels (`zero-channel-certificates`, `zv-quartet-channel-certificate`) | none (finite certificates in height) | no | channel matrix: negative eigenvalues = off-line pairs (G11) | none: V (G7), T (G11) | E: none, F (G11: invariant under Lambda -> eps_n Lambda). H: lane `h-hecke-channels` on file, not opened. C, D, B: no object |
| vortex (`rh-szc-vortex-slab`, `vortex-blocker-equals-rh`) | none | no | HEAT: every strip statement is flow-critical (F1) | none: T (the blocker is RH) | H: none, F (G38: ratio vortices, T-NR identical). E, C, D, B: no object |

No geometric object, alone or in a join on file, has verdict "none" without a closing row. Input D (the only
input whose hypothesis has no finite stage) is joined to no geometric object on file.

## 6. Rows for the inverse-explore slot (round 23)

Rows with verdict "none" and no closing row on file (the displayed object is in the row):

1. p3, cell U5 beyond a span, in the exact-FE form: by Lemma TS-1 this is the existence question for T2 twins;
   it belongs to lead BR, not to a new device.
2. p1 and p2 (tried-not-closed): MEASURED obstructions without a proof. One more lane is allowed by STRATEGY
   section 3; the passing objects (EIS-w, ZQ) are on file.
3. U6 (d) and U8 beyond DU: no object displayed.
4. The empty joins of section 5 with input D: an object of the geometric program whose hypothesis is a bound on
   all partial sums of a completely multiplicative function. No object is displayed; device 18 shows that the
   output of this input, as it stands, is a theorem about F relative to zeta.

What a candidate must show before construction (from sections 1 and 2): it reads no finite stage (or it reads
a clause on every local factor at once); it is not a form of degree <= 2 on window vectors; its property is
not additive in log F on a compact parameter set and is not the existence of zero-free stages; and it is none
of the kinds M, I, T, F, R, V, X, S of section 3. The three reasons cover 10 of the 56 device types; the other
46 were closed by rows of those kinds, so the three reasons alone are not a sufficient launch filter.
