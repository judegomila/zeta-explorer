# c16-qa-filter-silent-cells-geometric-nodes: RESULT

Round 16, kind: combine (round-15 combinable 1). Date 2026-11-19. Sources: control ZQ and question Q-A
(`push/c15-control-with-zeta-fe-classes-u1-u2`, RESULT and both referee sections), Lemma F
(`push/c14-prefilter-sweep-geometric-nodes`, with REFEREE and REFEREE2), the lift ruling
(`push/c15-referee-r14-independent-checkpoint/LIFT_RULING.md`), `campaign/STRATEGY.md` section 4.0, map section 2
and rows D8, D9, G10, G33, G34, G36 to G40, P55.

Nothing in this file is a statement about zeros of zeta. It is a filter (which steps a control passes) and a
table. No answer for R4 is registered and the headline does not move. Labels: PROVED (argument in this file or
exact pointer), CLASSICAL, MEASURED (mpmath, 30 digits, this lane), ARGUED, READ (a typing made by reading a node
or cell statement; a judgment). Runs: local only, `scripts/memcap.sh 8` with `.venv-arb/bin/python`, 60 s and
33 s, under 200 MB. The server was not used (the decisive test is a paper table; the numeric check is small).
Node files and the graph were read as JSON text; no repo module was imported.

## 0. Outcome

1. **The filter is one proposition (Proposition F4, section 2)** with five questions: Q-P, Q-B, Q-S of Lemma F,
   Q-A, and Q-H (the HEAT question of the lift ruling, Lemma J1', with two elementary extensions). Canonical
   controls for a verdict "no control passes": T-NR, E_a, HEAT (canonical lifts to twist families), ZQ (single
   object), NR-q (twist family; its lift is a one-parameter family, every member of which keeps the functional
   equations and has zeros on the same two abscissae: PROVED here). A verdict "a control passes" needs no
   canonical lift; a verdict "no control passes" is stated against the canonical ones only.
2. **First lemma (Lemma QA, PROVED).** A step that reads only the data (d1) to (d5) of section 2.2 (functional
   equation, poles, order, trivial zeros and the zero count up to 1, and the prime-power atoms of the logarithm)
   is passed by ZQ for every eta in (0, 1/2). With a margin eps in the density norm it is passed by the members
   with defect below eps, which have zeros at distance up to eta(eps) = (r/2)/(1 + r), r = e sqrt(eps/8), from
   the line (0.48 sqrt(eps) to leading order). For twist families: NR-q.
3. **Three additions that widen what ZQ passes (section 3).** Lemma C: any strict condition on values on a
   compact set, and any heat-flow box certificate with t >= 0, that holds for zeta holds for ZQ once the removed
   pair is high enough (PROVED estimate; MEASURED). Lemma R: one exact scalar reading (the residue at s = 1) can
   be matched by a compound multiplier (PROVED; MEASURED to 1e-31). Scattering carrier: M = f(u)/f(u+1) with
   f = xi m is Schur, unitary on the axis, satisfies the cocycle relation and comes from an f with
   f(u) = f(1 - u) and zeta's archimedean factor (PROVED given the a >= 1/2 statement on file; MEASURED): ZQ has
   the two items the control BLS lacks.
4. **Table (section 4 and `TABLE.md`).** Cells, 16 rows: 3 passed by a control at a named step for the reads
   listed (U6 (d), U6 (g), the compact part of U8); 4 passed in part with a residual (U4 (i) to (iv)); 4 with no
   control by construction (the identification classes of U3); 3 with no control on file (U6 (c), (e), (f));
   2 with no device or candidate on file (U6 (a), (b); the unbounded part of U8). Nodes: 71 of 71 typed; 31 target-level, 22 passed by ZQ
   (5 atoms only, 6 zero list below a height, 11 compact certificate), 3 passed by ZQ under a margin not
   established here, 12 passed by a control already on record, 1 false for zeta on record, 1 with no control
   formulable (its missing input is of GRH strength by its own text), 1 not readable. **No node is a row "no
   control passes" with a hypothesis that is not the target.** The 15 nodes read twice get the class of the
   second reader in 15 of 15 (not blind).
5. **Pattern in the five "no control passes" cells (READ).** Each answers yes to Q-A (a) through its carrier:
   the object lives on something built from the integers as an additive set (a lattice, the Bost-Connes algebra,
   theta, the frequency set log N). Together with the zero-margin statement (Proposition M) this fixes the
   round-17 explore entry condition: the decisive step must be discontinuous in the coefficient measure at
   zeta, and the only inputs on file with that property are the ones that read the additive structure of the
   integers (Poisson summation, automorphy) in the same step as multiplicativity.
6. **Two search cells are inside a wall already on file.** U8 and the residual of U4, when the parameter set of
   the functional is compact and the sign is strict, are passed by the backward heat members with tau close to
   0 (continuity; the flow-blindness wall of the brief). A finite battery with fixed tau cannot show this. A
   survivor of such a search is not a statement with R3. Section 5.

## 1. Plan; what is new against the record

- On file and only quoted: Lemma F with Q-P, Q-B, Q-S; ZQ, SG, NR-q, Lemmas A, L, D, question Q-A; the referee's
  member G_+ (positive defect, real poles); Lemma J1'; the lift ruling; the c14 typing of 443 nodes and the c15
  second reading of 15.
- New here: the filter as one proposition with its hypotheses; Lemma QA with an explicit data list and a margin
  form; the lift of NR-q as a family; Lemmas C and R; ZQ on the scattering carrier; Proposition M; Lemmas J2, J3
  and Corollary K (each elementary); the table.
- Decisive first test: the table. It could have killed the lane in one way: a disagreement with the 15 nodes read
  twice, or a node passed by Q-A that the record says fails a control. Neither occurred.
- Answers to the three questions of map section 2: no attack. R1 not used; R2 none; R3 is the subject; R4 none.

## 2. The filter

### 2.1 Proposition F4 (PROVED as stated; its content is the lists of stable step types)

Setting as in Lemma F: a device is a list of hypotheses H_1, ..., H_n on an object and a conclusion C that
excludes zeros in Re s > theta for some theta < 1. Suppose every H_i holds for zeta (or for the pair, triple or
family the device reads). If one of the following holds, the device is false, because the named control satisfies
every H_i and violates C.

| question | control | hypotheses that it satisfies whenever zeta does | source |
|---|---|---|---|
| Q-P | T-NR at a rational prime p0, 2 < c < p0^(1/2) + p0^(-1/2) | S1 linear identities and linear classes stable under the multiplier; S2 dilation-invariant cone conditions on objects linear in F; S3 conditions away from p0 | Lemma P (quoted; two referees) |
| Q-B | BLS; T-NR as an inner factor | conditions on a coefficient that carries strip zeros as zeros and are closed under inner functions with the real symmetry: identities, Schur, bounded-analytic, Pick | Lemma B of c14 (quoted; scope line of REFEREE2) |
| Q-S | symmetric multiplier G(s)/G(w) | steps in which the target enters linearly or by division | Lemma M (quoted; exact for H_- only) |
| Q-A | ZQ (one object); NR-q (twist family) | atom-read hypotheses, section 2.2; with a margin, section 2.3 | Lemma QA (here) |
| Q-H | HEAT with the same tau on every member | reads unchanged by a common positive factor at each point (J1'); log-jets of order >= 3 and one-sided second-order conditions (J2); strict conditions on a compact parameter set, for abs(tau) small (K) | Lemma J1' (quoted; one derivation); J2, K (here) |

Rules of use (from the lift ruling and the referee restrictions on file).
- (L1) A pass is a counterexample and is valid for any lift that satisfies the hypotheses read. A verdict "no
  control on file passes" is stated against T-NR, E_a, HEAT, ZQ, NR-q only; BLS, theta^w, the Beurling system and
  the coefficientwise twists of DH are lane-defined lifts and their failure is not evidence.
- (L2) All hypotheses of a device are typed in one normalisation before a question is answered (Lemma P,
  restriction 3).
- (L3) The proposition is a sufficient test for "a control passes". Silence is not a verdict. A hypothesis that is
  the conclusion, an all-order criterion or a zero-location input is outside it (no control satisfies it, and it
  is not established for zeta): such rows are marked target-level, not "no control passes".
- (L4) E_a carries no question of its own here: it passes whatever does not read the size normalisation (row EA
  of the control table) and every Polya-frequency order (Lemma E, row P55). It is used in the cell table.

### 2.2 Lemma QA (first lemma)

Class A: G meromorphic in C of finite order with -G'/G(s) = integral over [1, inf) of x^(-s) d nu_G(x), absolutely
convergent in some half-plane; nu_G = nu_at + nu_c, the purely atomic part and the non-atomic part.

Definition. A hypothesis H on G in A is **atom-read** if its truth is determined by the following data of G:
- (d1) whether G satisfies zeta's functional equation (conductor 1, zeta's gamma factor);
- (d2) the poles of G with their orders (not the residue);
- (d3) the order of G and its reality on the real axis;
- (d4) the trivial zeros; the zero-counting function N_G(T) up to an additive error of 1 at every T; the
  non-trivial zeros with ordinate below a fixed height T_0, exactly;
- (d5) the atomic part nu_at, hence every statement about local factors at primes, complete multiplicativity or
  Hecke relations read on the atoms, the size abs(alpha_p) = 1, positivity and support of the atoms.

Q-A asks whether the step reads (a) nu_c = 0 (no coefficient mass off log N) or (b) the sign of nu against a
density of sup size O(eta^2 + d^2). A step that reads neither, and reads the coefficient object through its
atoms only, is atom-read.

**Lemma QA.** (a) For every pair T_0 < g1 < g2 of ordinates of zeros of zeta on the line and every eta in
(0, 1/2), ZQ = zeta m lies in A and has the data (d1) to (d5) of zeta. So a conjunction of atom-read hypotheses that
holds for zeta holds for ZQ, and no implication from atom-read hypotheses to "no zero in Re s > theta",
theta < 1, is valid (take eta in (theta - 1/2, 1/2); for theta <= 1/2 any eta).
(b) Margin form. Let p(D) = sup abs(D) + integral x^(-sigma_0) abs(D) dx for a fixed sigma_0 > 1/2. If a step
also reads nu_c through a condition that holds whenever p(nu_c) <= eps, it is passed by every ZQ with
8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2 + 4 (eta^2 + d^2)/(sigma_0 - 1/2 - eta)^3 <= eps (such members exist for
every eps > 0 because d can be taken small: CLASSICAL input of Proposition M).
(c) Twist families. For a family {L(s, chi)} put G_chi = L(s, chi) m_z(s), m_z(s) = conj(z) q^(s-1/2) + c +
z q^(1/2-s), q = 1 + sqrt 2, 2 < c < q^(1/2) + q^(-1/2), z = z(chi) unimodular with z(conj chi) = conj z(chi).
Each G_chi is entire for chi non-principal, satisfies the functional equation of L(s, chi) (with the pair
chi, conj chi), is a generalised Dirichlet series whose coefficients on each coset q^j N (j = -1, 0, 1) are a
constant times those of L(s, chi), so that the Euler factor and the Hecke relation at every rational prime hold
on each coset, and vanishes on Re s = 1/2 +- arccosh(c/2)/log q. So a step that reads, for each member, the
functional equation, entirety, order and the coefficients or local factors at rational primes is passed by NR-q
for every choice of z. (G_chi is not in the class A in this normalisation: m_z is unbounded to the right, so
there is no measure on [1, inf). Part (c) is a statement about generalised Dirichlet series; the question it
answers is Q-A (a) only.)

Proof. (a) m is a rational function of s(1 - s) with m -> 1 at infinity, real on the real axis: (d1), (d3).
Its poles 1/2 +- i g1, 1/2 +- i g2 are cancelled by zeros of zeta, m(1) is finite and not 0, so the only pole
of ZQ is the simple pole at 1: (d2). On the real axis t^2 = -(s - 1/2)^2 <= 0, so numerator and denominator of
m are positive: the trivial zeros are kept with their orders. Four zeros are removed and four added, with
ordinates in [g1, g2] in absolute value: N_ZQ(T) = N_zeta(T) for T < g1 and T > g2 and differs by at most 1
between, and the zeros below T_0 < g1 are those of zeta: (d4). -m'/m(s) = integral over [1, inf) of x^(-s) D(x) dx for Re s > 1/2 + eta with D continuous
(closed form of the ZQ lane, re-checked in section 6), so nu_ZQ = nu_zeta + D dx and the atomic parts agree:
(d5). ZQ vanishes at 1/2 +- eta +- i gbar. (b) The two terms are the proved bounds of the ZQ lane for sup abs(D)
and for the weighted integral. (c) m_z(1 - s) = m_(conj z)(s), so G_(conj chi)(1 - s) = L(1 - s, conj chi)
m_z(s) and the functional equation of the pair is kept; m_z is entire; q^k is irrational for k != 0, so the
frequencies log(n q^j) with j != 0 are off log N and the part at integer frequencies is c L(s, chi); m_z(s) = 0
iff q^(s-1/2) = z y with y + 1/y = -c, y real, abs(y) != 1, so Re s - 1/2 = +- log(abs y)/log q and the
ordinates move with arg z. QED

Remarks.
- (i) The lift of NR-q to a twist family is not unique (q is not a rational number, so chi has no value at q);
  the choices are z in the unit circle. By (c) every choice is a control with the same abscissae, so "NR-q
  passes" does not depend on the choice, and a device that rejects NR-q must reject every z. MEASURED for three
  values of z: zeros at 0.857311 + 3.564428i, + 4.901088i, + 7.128856i (`checks.json`, block E).
- (ii) Inherited restriction (referee E2 of the ZQ lane): "GEOM read on atoms" is a reading. If a device reads
  multiplicativity on ordinary coefficients, it reads INT, the answer to Q-A (a) is yes, and the device is in an
  identification class of U3.
- (iii) Atom-only criteria. A prime-side statement equivalent to a zero-free region for zeta (nodes 247, 341)
  has the same truth value for the atoms of ZQ. This is not a pass of a device: the equivalence with zeros is
  for the Euler product of the atoms, and the passage to zeros of G reads nu_c = 0. Such rows are target-level.

### 2.3 Proposition M (zero margin; PROVED given Lemma QA and a CLASSICAL input)

Let H be any hypothesis on G in the family {zeta m} that implies "no zero in Re s > 1/2". Then H does not hold
on any p-neighbourhood of zeta in the family: for every eps > 0 there is a ZQ with p(D) < eps. Quantitatively,
if "nu_G >= nu_zeta - eps dx implies every zero within f(eps) of the line" holds on the family, then
f(eps) >= eta(eps') for every eps' < eps, with eta(eps) = (r/2)/(1 + r), r = e sqrt(eps/8): 4.8e-4, 4.76e-3,
4.38e-2 at eps = 1e-6, 1e-4, 1e-2 (`ref_check.json`). Input: consecutive zeros on the line with gap tending to
0 (Selberg, positive proportion on the line; CLASSICAL, as corrected by referee E3 of the ZQ lane).
Reading: a hypothesis of RH strength holds for zeta with zero margin in the coefficient measure. This is the
coefficient-side form of the statement on file that Weil positivity over all finite tests has no margin
(eq48 Theorem 4).

## 3. Additions to ZQ used by the table

### 3.1 Lemma C (compact certificates)

(i) PROVED. For s = 1/2 - y + i z with y real and z real, abs(z) < g1:
abs(m(s) - 1) <= (eta^2 + d^2) [ (2 z^2 + 2 gbar^2 + 1)/(g1^2 - z^2)^2 + 1/(2 (g1^2 - z^2)) ] =: B(z).
Proof: t^2 = z^2 - y^2 + 2 i y z; abs(t^2 - g^2) >= g^2 + y^2 - z^2; abs(2 t^2 + 2 gbar^2 + eta^2 - d^2) <=
2 (y^2 + z^2) + 2 gbar^2 + 1; and 2 y^2/(a + y^2)^2 <= 1/(2a). The bound is uniform in y and tends to 0 as the
pair rises with eta < 1/2 and d bounded. So any condition on the values of G, of the completed function or of
finitely many derivatives on a compact set, that holds for zeta with strict inequality, holds for ZQ with g1
large enough. Zeros of zeta on the line exist at every height (Hardy; CLASSICAL).
(ii) PROVED for t >= 0. With F(z) the completed function in the variable z (s = 1/2 + i z) and
H_t = e^(-t d^2/dz^2) F, one has H_t(z) = E F(z + i sqrt(2t) N), N standard normal; the average runs along the
horizontal line Im s = Re z. Define the same for F m. Then abs(H_t^ZQ(z) - H_t(z)) <= B(Re z) E abs(F(z +
i sqrt(2t) N)), and the last factor does not depend on the pair. So a box certificate (non-vanishing or winding
on a compact set of (z, t), t >= 0) for zeta transfers to ZQ with the pair above the box.
(iii) ARGUED for the other sign of t (a Gaussian average along the real z-direction, which passes the removed
ordinates, where m - 1 is not small and F is of size e^(-pi gbar/4)) and for certificates stated as operator
norms of the kernel (nodes 357, 377).
MEASURED (`checks.json` block C, `ref_check.json`): sup abs(m - 1) on the box -1 <= Re s <= 3, abs(Im s) <= 50
and on three full horizontal lines, eta = 0.25: 1.83e-5, 7.46e-7, 2.56e-9 for the pairs (100, 101), (298, 299),
(6709, 6710), each below B (2.27e-5, 9.31e-7, 3.20e-9). Heat averages of zeta and ZQ at three points with
t = 0.05, 0.1, 0.15: relative difference 1.6e-5 to 1.8e-5, each below the bound. Kernel side: the L1 norms of
z^k xi(1/2 + iz)(m - 1), k = 0, 2, 4, are 3.33e-7 times those of z^k xi (pair 298, 299, eta = 0.07;
2 (eta^2 + d^2)/gbar^2 = 3.33e-7); near the removed pair abs(xi (m - 1)) <= 6.2e-181.

Use: a finite certificate is passed by a function with zeta's own functional equation, pole, order and every
Euler factor on the atoms, and with zeros off the line. The record said "finite certificates restate verified
height"; this names the control.

### 3.2 Lemma R (one exact scalar; PROVED)

m(1) = 1 + (eta^2 + d^2)(2 gbar^2 + eta^2 - d^2 - 1/2)/((1/4 + g1^2)(1/4 + g2^2)) > 1, so ZQ has residue m(1)
at s = 1 while its limit at +infinity is 1. Multiply by m_2 = (t^2 - h3^2)(t^2 - h4^2)/((t^2 - g3^2)(t^2 - g4^2))
with g3, g4 two further zeros on the line and h_i = g_i - delta: two on-line zeros are moved along the line.
m_2(1) is continuous and decreasing in delta from 1, so some delta > 0 gives m(1) m_2(1) = 1. The added density
is 2 x^(-1/2)(cos(g3 L) + cos(g4 L) - cos(h3 L) - cos(h4 L)), of sup at most 8 delta/e. The compound has every
property (d1) to (d5), residue 1, limit 1, and the quartet. MEASURED (pair 298, 299, eta = 0.07; zeros 300,
301): delta = 4.52e-5, m(1) - 1 = -9.9e-32, added sup 1.33e-4, symmetry defect 3e-42. Not proved: matching
k >= 2 exact scalars at once (a k-parameter version needs a rank condition; ARGUED).

### 3.3 ZQ on the scattering carrier (PROVED given a statement on file)

f = xi m satisfies f(u) = f(1 - u), is the completed function of ZQ with zeta's gamma factor, and has all its
zeros in the open strip. M_ZQ(u) = f(u)/f(u + 1). Then M_ZQ(u) M_ZQ(-u) = 1, abs(M_ZQ) = 1 on Re u = 0, the
poles are at rho - 1 (Re < 0), M_ZQ/M_zeta = m(u)/m(u + 1) -> 1, and M_ZQ is Schur on Re u > 0 by the statement
"all zeros with abs(Re lambda) <= a implies the bridge ratio R_a is Schur", a = 1/2 (Theorem E1' corollary,
`c15-klein-transport-lemma-w-stage-a-and-e1`; growth as for xi). M_ZQ vanishes at the quartet points with
Re u = 1/2 +- eta. MEASURED (pair 1, 2, eta = 0.3): symmetry 7e-31, cocycle 4e-31, unitarity 2e-31,
abs(M_ZQ) = 5e-29 at the quartet point against 0.84 for zeta; Pick matrices at 6 and 9 random nodes: smallest
eigenvalue +2.8e-9 and +8.7e-22 for ZQ, +4.0e-10 and +5.8e-22 for zeta, -1.5 and -12.3 for an anti-control
(division by a Blaschke factor at a point that is not a zero).
Against BLS (map section 2: "lacks a vector at the archimedean place; lacks f(z) = f(1 - z) for a function f
with M = f(z)/f(z+1)"): ZQ has the second and has zeta's archimedean factor; every identity among products of
M at shifted arguments that follows from f(u) = f(1 - u) holds for it. Not proved: Maass-Selberg positivity of
the truncated norm for ZQ (M_ZQ/M_zeta is a quotient of two Blaschke products of degree 4 over non-real
conjugate pairs and is positive on the real axis, minimum 0.99981 measured; Theorem C on file covers
multiplication, not division by factors at existing zeros): ARGUED.

### 3.4 Lemmas J2, J3 and Corollary K (PROVED, elementary)

- J2 (log-jets). For kernels without polar terms and K > 0, the HEAT member is g K with log g = tau u^2/4, so
  every derivative of log K of order >= 3 is unchanged and the second derivative moves by tau/2 < 0. A function
  of derivatives of order >= 3 of log K_A, log K_B at any points is HEAT-blind; a one-sided upper bound for a
  second derivative is passed. MEASURED: differences 0 and 1e-29 at six (tau, u).
- J3 (signs on the line). On Re s = 1/2 the T-NR and NR-q multipliers are real and >= c - 2 > 0 for every
  character and every z (c + 2 Re(conj(chi(p0)) p0^(it))). A read that depends only on the signs of the Hardy
  functions of the members at points of the line is passed by both. This is row Z36 for all members at once.
- K (compact parameter sets; an application of the flow-blindness wall, not a new statement). If a functional
  is jointly continuous in the kernel (uniform convergence of finitely many derivatives on a compact set) and
  in a parameter p in a compact set, and is strictly positive on zeta (or on the positive pair) for all p, then
  it is strictly positive on the HEAT member (same tau on every member) for abs(tau) < tau_0. Each member with
  tau < 0 has non-real zeros (Lambda >= 0, Rodgers-Tao; CLASSICAL). The same holds for ZQ with the pair high
  (kernel closeness as in 3.1; ARGUED).

## 4. Decisive test: the table

### 4.1 Cells (STRATEGY section 4.0)

Outcome NCP = no control on file passes, stated against the canonical controls. "Input" = the arithmetic input a
device in the cell would need, stated as a reading.

| cell | decisive read set | Q-A | first control that passes, with the step | outcome |
|---|---|---|---|---|
| U3-1 {FE, INT} at conductor 1 (Hamburger) | functional equation and frequencies in log N | yes (a) | none inside (identification). Relaxing INT: ZQ (density), NR-q (one generalised prime), T-NR in Laurent form | NCP by construction. Input: a non-identity inequality that fails for nu + D at every size of D (Proposition M) |
| U3-2 degree one, FE, INT, Euler-product axiom | same with the axiom | yes (a) | as U3-1 | NCP by construction |
| U3-3 {POS, GEOM at every rational prime, INT} | positivity and unimodular parameters on ordinary coefficients | yes (a) | none inside. Relaxing INT: the referee's G_+ (zeta's functional equation, D >= 0, every atom, real poles in (0, 1)); relaxing GEOM: E_a; relaxing POS: ZQ | NCP by construction |
| U3-4 {FE, pole at 1 only, Lambda_G >= Lambda} (Lemma L) | the sign of the defect | yes (b) | none inside. Relaxing the sign two-sidedly: ZQ; one-sidedly: SG (D <= 0); relaxing the pole clause: G_+ | NCP by construction. Its non-identity form is quantitative POS-FE; by Proposition M any such form has f(eps) >= 0.48 sqrt(eps) to leading order |
| U4 (i) quotients at different points | values of two members at s_1 != s_2 | no | on the line: T-NR and NR-q (J3, signs). Kernel form with a compact node set and strict sign: HEAT, tau near 0 (K) | pass for those reads; off the line with an unbounded parameter set: NCP |
| U4 (ii) logarithm of one member alone | log K at points | no | HEAT: derivatives of order >= 3 and one-sided second order (J2); compact strict reads (K) | pass for those reads; values and first derivatives at distinct points on unbounded sets: NCP |
| U4 (iii) kernels with polar terms | kernel with the pole terms | no | cone conditions: T-NR (Q-P). Compact strict reads: HEAT (K; continuity of the normalisation ARGUED) | pass for those reads; the rest is the measured search (canonical tier undecided) |
| U4 (iv) triples through the group law at several points | chi, chi^2 at s, s + it, ... | no | one point, degree 0: T-NR at a prime split for every character (Lemma C of row G38). On the line: J3 | off the line at several points: NCP. Known member right of 1: the 3-4-1 inequality (reads POS and the group law; E_a satisfies it with its own pole; no R4) |
| U6 (a), (b) residual | no device on file | - | - | not formulable. For a future device: reads of the coefficient only are passed by BLS and ZQ (3.3); EIS-w and NR-vec as on file |
| U6 (c) Whittaker constants, genuine cusp form on the double cover of GL(3) | constants at all indices | yes (a) by carrier | none formulable (no lift of a control to the cover on file) | NCP. Input: a relation between the constants at composite and at prime indices on the cover (the TRO6 type of statement of the brief); none on file |
| U6 (d) rank >= 2 compact-at-infinity squares, no Hecke rule | modulus squares | no | T-NR (Q-P, cone S2a; c14 pending table) | pass; carries no R1 |
| U6 (e) Bost-Connes states outside the three classes of row D8 | state values | yes (a) by carrier (the algebra is built on the integers; ZQ and NR-q have no realisation) | T-NR whenever the read is unchanged under phi -> phi(D .)/phi(D), D >= 1 in the centraliser | NCP for reads that are not D-invariant. Input: positivity of a state that is not sigma-invariant (row D8 (i): every sigma-invariant state sees C*(Q/Z) only), read together with the Fourier duality |
| U6 (f) unsummed complex isogenous points, neither linear nor a second moment | values of theta at the p^2 + p - 2 points | yes (a) by carrier (theta) | T-NR for linear and cone reads (row G33: every twin lies in the dilation module on theta) | NCP for non-linear reads. Input: an inequality among the point values that uses the Hecke correspondence beyond the sum relation R_p + C_p = 1 + 1/p |
| U6 (g) scattering inequalities reading an exact normalisation, the archimedean factor or f(z) = f(1 - z) | coefficient M with those reads | no | ZQ: Schur, bounded-analytic and Pick conditions together with f(u) = f(1 - u) and zeta's archimedean factor (3.3, PROVED); one exact scalar by Lemma R | pass for those reads. Maass-Selberg positivity for ZQ, rank above one and the affine kernel: ARGUED. A device that reads the Eisenstein series as a function on the quotient answers yes (a) |
| U8, compact parameter set, strict sign | kernel values at nodes | no | HEAT with tau near 0 (K); ZQ with the pair high (ARGUED) | pass: no device with R3 in this part of the cell |
| U8, unbounded node set or order | infinite families | - | members on file are all-order criteria | target-level; no candidate on file |

Count: 16 rows. Passed at a named step for the reads listed: U6 (d), U6 (g), U8 compact (3). Passed in part,
with a residual NCP: U4 (i) to (iv) (4). NCP by construction: U3-1 to U3-4 (4). NCP with an input named: U6 (c),
(e), (f) (3). No device or candidate on file: U6 (a), (b); U8 unbounded (2). Stated as explore candidates in
section 5: five (U3 as an inequality, the U4 residual, U6 (c), (e), (f)).

### 4.2 Nodes

Population: the 70 silent rows of the c14 sweep plus node 30 (c14 referee E4): 71. Full table: `TABLE.md`
(one row per node: class, decisive read set, Q-A, outcome, first control with the step). Summary
(`table.json`):

| outcome | count | nodes (index in the c14 sweep) |
|---|---|---|
| T: target-level | 31 | 0, 9, 14, 28, 34, 35, 41, 57, 58, 60, 73, 110, 134, 140, 141, 147, 157, 175, 178, 247, 261, 262, 263, 270, 273, 303, 323, 341, 350, 363, 411 |
| ZQa: ZQ passes exactly, atoms only (Lemma QA (a)) | 5 | 30, 55, 104, 292, 342 |
| ZQe: ZQ passes exactly, zeros or counts below a height | 6 | 13, 48, 82, 196, 271, 344 |
| ZQc: ZQ passes by Lemma C | 11 | 56, 94, 120, 212, 333, 357, 381, 387, 395, 420, 437 |
| ZQm: ZQ passes if the step has a margin (not established) | 3 | 84, 205, 213 |
| REC: a control on record passes | 12 | 1, 142, 158, 163, 166, 195, 197, 286, 355, 372, 374, 377 |
| FZ: false for zeta on record (row P53) | 1 | 61 |
| NF: no control formulable; missing input of GRH strength by the node text | 1 | 348 |
| NR: node does not display its hypothesis | 1 | 403 |

By class: t 31, c 18, L 9, Z 8, K 5. One class differs from the c14 list as corrected by its referee: node 157
(Lemma W), L -> t, following the result of lane `c15-klein-transport-lemma-w-stage-a-and-e1` (W(A) contains the
strip abs(beta - 1/2) <= 1/(2A)).

Readings worth a line.
- Class c (18 nodes): each is passed by ZQ with the removed pair above the certified range (16 by Lemma QA (a)
  with (d4) or by Lemma C; node 333 has an unbounded slice, node 403 is not readable). The parts of nodes 357,
  395, 420 that use the ARGUED forms of Lemma C are marked in the table.
- Class Z (8 nodes): four read atoms only and are passed exactly (30, 55, 104, 292); the cascade and the rung
  moments of ZQ are those of zeta, so these objects locate zeros of the atom product, not of the function that
  carries the functional equation. Nodes 84 and 213 read sizes right of 1 and are passed up to the factor
  abs(m) on the lines read. Node 163 is an identity already passed by twists on record. Node 348 is about
  symmetric powers in the conductor aspect; no control has a lift there.
- Node 342 ((star_min), a bound on a short von Mangoldt polynomial at every height): atoms only. It is not
  established for zeta; ZQ has the same truth value; so an implication from it to the absence of zeros of the
  function with the functional equation has to read nu_c = 0 at some step.
- No node is at once not target-level, with a hypothesis known or measured for zeta, and without a passing
  control. This agrees with item 4 of the c14 verdict and adds, for 25 nodes, a control with zeta's own
  functional equation.

### 4.3 Check on the 15 nodes read twice

Nodes 14, 30, 48, 104, 120, 134, 163, 195, 213, 286, 292, 350, 355, 363, 377: class here = class of the c15
second reader in 15 of 15 (t, Z, c, Z, c, t, Z, L, Z, L, Z, t, K, t, K); node 163 keeps the boundary note
(Z against PASS S1). Not blind: the second reader's table was on screen when these rows were typed, so this is
a consistency check of the new columns, not a third reading. No record of a run of ZQ on any node exists, so
the Q-A outcomes cannot contradict the record; the 12 REC rows repeat it.

## 5. What changes for round 17

1. Explore candidates (rows NCP), each with the input it would need:
   - U3 as an inequality: quantitative POS-FE with f(eps) not better than 0.48 sqrt(eps); input: a step that
     fails for every density D of sup size eps, that is, a step that reads integrality of the frequencies.
   - U4 residual: a group-law inequality at several points that holds left of Re s = 1 and on unbounded
     parameter sets; input: positivity of a combination of logarithmic derivatives left of the abscissa of
     absolute convergence (the 3-4-1 inequality has it right of 1 only).
   - U6 (c): a rule for Whittaker constants on the cover at composite indices.
   - U6 (e): a state that is not sigma-invariant, with positivity not preserved by D >= 1.
   - U6 (f): a non-linear inequality over the isogenous points that uses the correspondence beyond its sum.
2. Entry condition for any of them (Proposition M and Lemma QA): name the step that fails for ZQ with defect
   tending to 0, and for NR-q at every z. A step continuous in the coefficient measure does not qualify.
3. Compute slot: a search of U8, and the certified conversion of the canonical tier of dictionary DN, read
   functionals at nodes in a compact set. By Corollary K any strictly one-signed functional found is satisfied
   by HEAT members with tau close to 0, whichever members of the battery it rejects. The conversions can change
   a MEASURED row to a certified one; they cannot return a device with R3. Suggested rule: a search lane adds
   HEAT members at abs(tau) <= 0.005 (or states the limit tau -> 0 in its criterion) before any survivor is
   reported.
4. Map entries proposed (not applied; this lane does not edit the map): Lemma QA with the data list (d1) to (d5)
   under the ZQ control row; Lemma C as the control statement for finite certificates; the sentence "BLS lacks
   f(z) = f(1 - z)" to carry "ZQ has it (Schur, Pick, bounded-analytic conditions; Maass-Selberg not proved)";
   NR-q lift: a family in z; U8 and DN: scope line of Corollary K.

## 6. Checks

- **ZQ defect density against its bound at three parameter values** (`checks.json` block A; grid resolving
  cos(gbar L) at 60 points per period around the five largest envelope points; envelope on L <= 80, step 1/200):

| pair | d | eta | sup abs(D), resolved | envelope maximum | bound used | ratio | Laplace identity defect |
|---|---|---|---|---|---|---|---|
| 1, 2 | 3.4437 | 0.05 | 5.1152 | 5.1797 | 8 (the quadratic bound is 63.4) | 0.639 | 3.8e-33 (partial fractions), 5.9e-33 (direct quadrature) on a value 3.6e-3 |
| 298, 299 | 0.20911 | 0.07 | 0.200436 | 0.200445 | 0.284740 | 0.704 | 1.4e-34 on a value 1.5e-11 |
| 6709, 6710 | 0.018849 | 0.01 | 1.97105e-3 | 1.97108e-3 | 2.05306e-3 | 0.960 | 2.4e-35 on a value 4.9e-18 |

  The bound holds in the three cases; D takes both signs in each. The values for the second and third rows
  agree with the independent referee of the ZQ lane (0.200445; 1.971e-3).
- Zero counts by the argument principle, pair 100, 101, eta = 0.25 (`ref_check.json`): rectangle across the
  line: ZQ 2, zeta 2; rectangle 0.6 < Re s < 1.3: ZQ 1, zeta 0. m is real and >= 1.0000159 at s = 1, 0, 3 and
  the first five trivial zeros.
- Blocks B to G of `checks.json` and `ref_check.json`: quoted in section 3.
- Twice-read nodes: section 4.3. Table counts reproduce from `build_table.py`.

## 7. Controls on the lane itself

- The lane has no device, so the standard battery has nothing to run against. What can be checked is that the
  filter does not pass a control where the record has a failure of that control: the Q-A passes are 25 nodes
  (classes c and Z, and nodes 205, 342 of class L) and three cells (U6 (g), U8 compact, U4 on the line). ZQ has
  no recorded run on any of them, so this check is empty for ZQ; the 12 REC rows repeat the record.
- zeta is in the ZQ family at defect 0 only; every pass above uses a member with eta > 0.
- Davenport-Heilbronn, E_a, backward heat, sign twists, unimodular twists, the Beurling system, theta^w, the
  phase-rotated transfer operator: not in the family of Lemma QA (different gamma factor or conductor, or no
  functional equation). HEAT enters through Q-H only; E_a through rule (L4); T-NR through Q-P and J3.
- Anti-control for 3.3: division of M by a Blaschke factor at a point that is not a zero breaks the Pick
  matrices (-1.5, -12.3), so the positive values for ZQ are not an artefact of the node set.

## 8. Verdict

Precise obstruction, as a filter and a table. Proposition F4 with Lemma QA is a sufficient paper test for "a
control passes". Applied to the remaining silent cells it leaves five rows without a passing control, each of
which reads the integers as an additive set through its carrier, and it shows that the compact parts of U8 and
of the U4 search are inside the flow-blindness wall. Applied to the 71 silent nodes of the geometric program it
leaves none: 31 are target-level, 37 are passed by a named control (25 of them by ZQ, with zeta's own functional
equation and exact atoms), and 3 are false for zeta, not formulable or not readable. Nothing about zeros of
zeta; no R4 mechanism; headline unchanged.

## 9. Requirement flags

- R1 false. No argument about zeta; multiplicativity appears only as a property the controls keep.
- R2 false. No statement at height.
- R3 false. The lane shows controls passing; in the five NCP rows no device is on file, so no step is shown to
  fail for every control.
- R4 false. Nothing passes to the critical line. Proposition M is a necessary condition on such a passage, not
  a mechanism.

## 10. Three weakest steps

1. The table is a reading by one reader. "Atom-read" is decided from a node statement of two or three lines,
   and the four ZQa nodes and node 342 depend on it; if one of them reads multiplicativity on ordinary
   coefficients the answer to Q-A (a) is yes and the row moves to U3 (referee E2 of the ZQ lane applies
   unchanged). The 15 twice-read rows were not typed blind. "NCP" is relative to the controls on file and to
   what could be formulated; the inputs named in section 5 are judgments.
2. Lemma C is proved for values on compact sets and for the heat average with t >= 0. The other sign of t, the
   operator-norm certificates (nodes 357, 377), Maass-Selberg positivity for ZQ, the affine kernel, and the
   k-scalar form of Lemma R are ARGUED. ZQ itself still has one independent referee; the second is owed
   (STRATEGY item 37).
3. Corollary K needs joint continuity of the functional in the kernel and the parameter. For kernels with polar
   terms and for "other normalisations" of U8 the continuity in tau of the normalised kernel is ARGUED. A
   functional that is one-signed on zeta with zero margin, or on an unbounded parameter set, is outside it; the
   statement about the compute slot is limited to strict signs on compact sets.

## Files

`RESULT.md`; `TABLE.md`, `table.json`, `build_table.py` (node table); `silent71_text.json`, `map4_text.json`
(node statements copied as text; 67 from `engine/nodes/nodes-*.json`, 4 map-derived from `engine/IDEA_GRAPH.json`);
`checks.py`, `checks.json`, `checks.log` (60 s); `ref_check.py`, `ref_check.json`, `ref_check.log` (33 s);
`REFEREE.md` (same-lane second pass; an independent referee is owed); `lanes.jsonl`.
