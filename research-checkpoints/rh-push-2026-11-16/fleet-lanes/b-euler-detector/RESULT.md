# b-euler-detector: the multiplicativity hierarchy, the functional equation, and zero location

Working note, 2026-11-16. Scope: `tmp/research-2026-11-16/push/b-euler-detector/` only. Nothing committed or pushed.
No RH claim, no zero-free region, no Lambda bound. Labels: PROVED (argument given here), CLASSICAL (cited theorem),
CITED-FROM-MEMORY (reference not re-read in this session), MEASURED (float numerics, not interval-certified), MODEL
(random-phase model), OPEN.

## Verdict

**Precise obstruction, with five supporting results.** The full hierarchy of multiplicativity constraints plus the
functional equation does not force a zero-location statement at any stage. In every space of functions sharing one
functional equation that was examined, the constraints act as an *identification* device:

* before a finite, explicit set of primes is imposed, the constraint set contains functions with zeros in Re s > 1;
* once that set is imposed, the constraint set is a finite list of single L-functions, and any zero statement is a
  statement about those individual functions (GRH for them), to which the constraints contribute nothing further.

There is no intermediate stage at which a partial zero-location statement holds for the whole constraint set. Measured
on 94 Davenport-Heilbronn-type twins, the share of off-line zeros does not decrease with the density of primes at which
the twin has an Euler factor; it is set by the mixing phase of the twin (correlation -0.97 over all 94, -0.98 over the
54 twins counted to height 600).

The converse direction is rigid: Weil positivity with zeta's archimedean and pole terms pins the prime-2 coefficient to
within 0.1% already at support ln 3 (section 7), while the rung class without the exact phases loses Weil positivity
at support 0.7228, just above the information floor ln 2 = 0.6931.

## 0. Plan (as executed)

Question from the task: build the hierarchy of multiplicativity constraints as quadratic-form inequalities; decide
whether zeta satisfying all of them together with the functional equation (FE) forces a zero-location statement; test on
synthetic functions "FE + exact Euler product over a set of primes + non-Euler tail"; quantify whether off-line-zero
freedom shrinks as the Euler set grows.

What is new relative to the atlas, the fifty routes and the walls:

| Prior item | Overlap | New here |
|---|---|---|
| Route 30 (rung Toeplitz detector, DH at ln 2 / ln 4 / ln 6) | Same detector | The detector is extended to a complete constraint system and its solution set inside FE-spaces is determined (Lemma A). Route 30's `nextStep` (Euler-aware Weil radius) is computed (section 7). |
| Routes 14, 15, 19, 26, 44 (Euler-blind positivity; 440 twins) | Same twins | Zero census of 94 twins against Euler density; right edge sigma* of the zero set for each twin. Route 44 measured Weil-negativity onsets, not zero counts. |
| Atlas section 7 (finite-prime rigidity: changing finitely many prime coefficients breaks positivity) | Section 7 here is the same phenomenon at small support | Admissible window for c(2) at supports ln 2 < 2a < ln 3; the class-uniform radius. Consistent with the atlas bracket; not a new theorem. |
| Flow-blindness, MV-CAP, verified height | Not addressed | The obstruction here is a fifth one of the same kind: constraint satisfaction identifies the function and does not locate zeros. |
| DH wall | Used as the control throughout | DH is the unique index-2 member of its FE-space; its right edge is sigma* = 1.120362. |

Not attempted: any proof of RH or of a zero-free region. The best possible outcome of this angle was a theorem saying
which constraints force what; that is what is delivered.

## 1. The hierarchy

Let F(s) = sum a(n) n^{-s}, a(1) = 1, and -F'/F = sum c(n) n^{-s}. Rung moments m_k(p) = c(p^k)/log p.

* **E_p (Euler at p).** Quadratic forms Q_{p,j,m}(a) = a(1) a(p^j m) - a(p^j) a(m) = 0 for all j >= 1 and all m prime to
  p. Each equality is the pair of inequalities +-Q >= 0. Equivalent linear form: c(n) = 0 for every n = p^j m with
  j >= 1, m > 1, p not dividing m. Equivalent factorisation: F = F_p(p^{-s}) G_p(s) with G_p free of p. (PROVED,
  elementary: take logarithms.)
* **T_{p,K} (local temperedness, degree d).** Toeplitz matrix [m_{|i-j|}(p)]_{0<=i,j<=K} positive semidefinite, m_0 = d,
  m_{-k} = conj m_k. (Route 30.) By Herglotz-Caratheodory, T_{p,K} for all K holds iff
  F_p(x) = exp( - int log(1 - x e^{i theta}) d mu_p(theta) ) with mu_p a positive measure of mass d on the circle.
  Consequence: F_p is holomorphic and zero-free in |x| < 1. (CLASSICAL.)
* **I (integrality).** The local factor is a power series in x = p^{-s} (frequencies in log N), not a Laurent series.
* **FE.** A fixed gamma factor, conductor and root number.

All E_p and T_{p,K} together say: F is a product of local factors, each a generalised unitary factor. DH violates E_2
and E_3 (first at n = 6: Q = a(6) - a(2)a(3) = 1 + kappa^2, the route-30 value c(6) = (1 + kappa^2) ln 6) and T_{2,2}.

Which level excludes which twin (all three twins have off-line zeros; FE defects below 1e-30, `gl2_examples.py`):

| Twin | FE | E_p all p | T | I | Off-line zeros |
|---|---|---|---|---|---|
| Davenport-Heilbronn | yes (conductor 5) | fails at p = +-2 mod 5 | fails at p = 2, K = 2 | yes | yes, sup Re = 1.120362 |
| zeta(s - d) zeta(s + d), 0 < d < 1/2 | yes (degree 2, shifted gamma) | yes | fails at every p, K = 1: det = 4 - (p^d + p^{-d})^2 < 0 | yes | Re s = 1/2 +- d |
| zeta(s) (1 + e (p^{s-1/2} + p^{1/2-s})), 0 < e < 1/2 | yes, zeta's own FE exactly | yes, as a product over the group Q_{>0} | fails (local zero at \|x\| < 1; m_0 = -1) | fails: local factor has an x^{-1} term | Re s = 1/2 +- arccosh(1/(2e))/log p; e = 0.2, p = 2 gives 2.7604 |

The third row is the sharpest: a function with zeta's exact FE, a single simple pole, multiplicative coefficients, and
zeros at any prescribed real part. The only failing axioms are I and T. With I, zeta's FE alone gives F = zeta
(Hamburger, CLASSICAL), with no Euler hypothesis at all. So at conductor 1 the multiplicativity constraints are
redundant given FE + I, and without I they do not locate zeros.

## 2. Lemma A: Euler at a set S of primes inside an FE-space (PROVED)

**Setting.** V is a finite-dimensional complex vector space of Dirichlet series with a basis L_1, ..., L_d of normalised
series with multiplicative coefficients: a_i(nm) = a_i(n) a_i(m) for coprime n, m. Hypothesis (LI_p): the functions
m -> a_i(m), restricted to {m : p does not divide m}, are linearly independent. (LI_p) holds for distinct Dirichlet
characters mod q (orthogonality; every class prime to q contains integers prime to p) and for distinct Hecke eigenforms
(the a_i are distinct characters of the commutative Hecke algebra away from p, which is spanned by the T_m with m prime
to p; distinctness is strong multiplicity one; CLASSICAL).

**Lemma A.** Let F = sum_i c_i L_i with a_F(1) = sum c_i = 1, and let p be a prime. Then F satisfies E_p if and only if
all L_i with c_i != 0 have the same local factor at p (the same a_i(p^j) for all j).

*Proof.* E_p reads sum_i c_i a_i(p^j) a_i(m) = A_j sum_i c_i a_i(m) for all m prime to p, with A_j = a_F(p^j). So
sum_i c_i (a_i(p^j) - A_j) a_i(m) = 0 on {m : p does not divide m}. By (LI_p) every coefficient vanishes.
So c_i (a_i(p^j) - A_j) = 0 for every i and j. Conversely, if the supported L_i share
the local factor at p then a_F(p^j m) = a(p^j) sum c_i a_i(m) = a_F(p^j) a_F(m). QED.

**Corollary A1 (degree 1).** Let q be prime and V_q^{+-} the span of L(s, chi), chi mod q of one parity. By
Kaczorowski-Perelli (Acta Math. 182, 1999; CLASSICAL) every degree-1 element of the extended Selberg class with that FE
type has coefficients on (n, q) = 1 of this form, up to the completely multiplicative twist n^{-i theta} fixed by the FE. For a set S of primes not dividing q:
{F : a(1) = 1, E_p for p in S} is the union of the affine spans of the fibres of chi -> chi restricted to <S, -1>.
Each fibre has [G : <S, -1>] elements, G = (Z/q)^x. The set of primes at which a fibre member has an Euler factor is a
union of residue classes of density 1/[G : H], H the common kernel.

* **Gap (PROVED given KP).** No degree-1 FE function has an Euler factor on a set of primes of density in (1/2, 1).
  DH sits at the extreme: density exactly 1/2.
* **Collapse.** The constraint set is a finite list of single L-functions iff <S, -1> = G.
* With the root number fixed, a fibre of size m generically carries m - 2 free real parameters. Index 2 gives an isolated twin:
  DH is the unique function of its kind at q = 5.

**Corollary A2 (degree 2, level 1).** V = S_k(SL_2(Z)); by Hecke's converse theorem (CLASSICAL) this is the whole
solution space of its FE. Lemma A: F in S_k with a(1) = 1 satisfies E_p iff its support lies in one eigenspace of T_p.
Computed here: the characteristic polynomial of T_2 on S_k is irreducible over Q, hence has simple roots, for every
even k <= 600 (294 weights, dimension up to 50; `gl2_examples.py`, exact rational arithmetic). So for k <= 600:

  FE of level 1 and weight k, plus an Euler factor at the single prime 2, implies F is a Hecke eigenform.

(Maeda's conjecture gives this for all k; Ghitza-McAndrew verified it to much larger weight, CITED-FROM-MEMORY.)

**Corollary A3 (general GL(2) spaces).** For spans of newforms sharing an FE, the set of Euler primes of a non-monomial
member has density at most 7/8 (Ramakrishnan, Invent. Math. 116, 1994: refinement of strong multiplicity one; CLASSICAL).
For several small levels, FE plus one or two Euler factors already implies modularity (Conrey-Farmer, IMRN 1995;
CITED-FROM-MEMORY).

Numerical check of Lemma A (`lab_dirichlet.py`, part A): q = 5, 13, 17, 31; 9 configurations. Random members of a fibre
satisfy E_p to 1e-13; generic members violate it by O(1). A Gauss-Newton solve of the quadratic system from random
starts converged 1008 times; all 1008 solutions are supported in a single fibre.

## 3. Collapse statistics (MEASURED, exact integer arithmetic)

For each prime conductor 5 <= q <= 4,000,000 (283,144 conductors) and Euler set S_r = the first r primes (those
dividing q skipped), fibre size m_r(q) = [G : <S_r, -1>] (`lab_dirichlet.py`, part B).

| r (primes imposed) | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| share of conductors not collapsed | 0.4387 | 0.1793 | 0.0803 | 0.0370 | 0.0171 | 0.0078 | 0.0014 | 0.0002 | 0.00001 |
| mean of (m_r - 1) | 7.53 | 0.501 | 0.134 | 0.0478 | 0.0200 | 0.0086 | 0.0015 | 0.0002 | 0.00001 |

* The share not collapsed falls by a factor of 2.2 to 2.5 per prime. Heuristic: an odd prime l dividing q - 1 survives
  with probability l^{-r}; l = 2 survives with probability 2^{-r-1}.
* Every conductor in range collapses by the prime 47 (worst case q = 3,818,929, 15 primes). Largest collapse prime for q in
  [10, 10^2), [10^2, 10^3), ..., [10^6, 4*10^6]: 5, 7, 17, 29, 37, 47. Largest value of P_0 / log^2 q is 0.233 (q = 241). Under GRH, Bach's bound gives
  P_0 <= 2 log^2 q.

So in degree 1 the freedom does shrink as the Euler set grows: per conductor in steps (a divisor chain of q - 1), on
average geometrically, and it reaches zero after O(log^2 q) primes. What shrinks is the number of functions. Section 4
shows that the zero location of the survivors does not improve.

## 4. No zero-location statement before collapse

**Theorem B (dichotomy; CLASSICAL inputs).** Let F belong to a fibre of size >= 2 and not be a single L-function. Then

* F has infinitely many zeros in Re s > 1 (Davenport-Heilbronn; Saias-Weingartner, Acta Arith. 140, 2009, for periodic
  coefficients; Booker-Thorne and Righetti for automorphic combinations);
* F has >> T zeros in every strip sigma_1 < Re s < sigma_2 inside (1/2, 1) (Saias-Weingartner for periodic
  coefficients; Kaczorowski-Kulas 2007 for the extended Selberg class, CITED-FROM-MEMORY).

So a statement "FE + E_p for p in S implies no zeros in Re s > sigma_0" is false for every sigma_0 below the right edge
of the worst fibre member, as long as one fibre has two elements; and once all fibres are singletons it is a statement
about individual L-functions.

**Theorem C (right edge; PROVED here, see note on prior art).** For F = c L(chi) + conj(c) L(conj chi) with chi complex,
put T = arg(-c/conj c) in (-pi, pi], chi(p) = e^{i phi_p}, r = p^{-sigma},

  beta_p = arg(1 - e^{2 i phi_p} r^2),  gamma_p = arcsin( 2 r |sin phi_p| / |1 - e^{2 i phi_p} r^2| ),
  B(sigma) = sum_p beta_p,  Gamma(sigma) = sum_p gamma_p.

Then sup{Re rho : F(rho) = 0} = sigma* := max{sigma : dist(T - B(sigma), 2 pi Z) <= Gamma(sigma)}. For DH,
B = 0, gamma_p = 2 arctan(p^{-sigma}) on p = +-2 mod 5, T = pi - 2 arctan(kappa), so sigma* solves

  2 sum_{p = +-2 mod 5} arctan(p^{-sigma}) = pi - 2 arctan(kappa),   sigma*(DH) = 1.120362,

and the supremum is not attained.

*Proof.* For sigma > 1, F = L(chi)(c + conj(c) R), R = prod_p (1 - chi(p) u_p)/(1 - conj chi(p) u_p), u_p = p^{-s}, and
L(chi) != 0. A zero means R = e^{iT}. For |u| = r the map u -> (1 - e^{i phi}u)/(1 - e^{-i phi}u) traces a circle with
centre (1 - e^{2i phi} r^2)/(1 - r^2) and radius 2r|sin phi|/(1 - r^2). The circle is orthogonal to the unit circle, so
the two points of extreme argument, beta +- gamma, have modulus 1. Summing principal arguments, a zero at abscissa
sigma needs T + 2 pi k in [B - Gamma, B + Gamma] for some integer k (necessity). At sigma = sigma* the target sits at an
endpoint, so the extremal configuration z* (every factor at its tangent point) has R = e^{iT} with modulus exactly 1: the
Dirichlet series sum a(n) z*(n) n^{-s} vanishes at the real point sigma*. By Kronecker there are t_k with
p^{-i t_k} -> z*_p for every p, F(s + i t_k) converges to that series locally uniformly on Re s > 1, and Hurwitz gives
zeros of F with real part tending to sigma*. For DH the extremal configuration needs 2^{-it} = -1 and 3^{-it} = 1 at
once, which is impossible; so no zero has real part exactly sigma*. QED.

Numerics: primes to 1e8 plus the prime-number-theorem tail give 1.12036247; the value moves by 7e-9 between 1e7 and
1e8 (`dh_sigma_star.py`). Prior art: Bombieri-Ghosh (Russian Math. Surveys 66, 2011, Theorem 7) and Righetti (Algebra
Number Theory 11, 2017) study the real parts of such zeros and define sigma*. I did not retrieve their text, so the
formula and the number are **not claimed as new**.

Checks of Theorem C (MEASURED, `check_theoremC.py`).
(i) Truncated model on the primes {2, 3, 7} with DH phases: predicted edge 0.6530422; a Kronecker search plus Newton
finds a zero at 0.6530419 + 14386005.6933 i (2.8e-7 below the edge); at abscissa edge + 0.01 the function stays above
0.0132 in modulus over 0 <= t <= 2e6 and the largest |arg R| is 2.563 < T = 2.588.
(ii) The omega = -1 twin at q = 5 has predicted edge 2.382286. Argument-principle counts for 0.25 < Im s < 3000: 288 zeros
right of 1.5, 191 right of 2.0, 43 right of 2.3, and 0 right of 2.39.

**Right edge against Euler density (MEASURED, `sigma_star.py`).** 94 twins (47 character pairs, q = 5..41, both root
numbers): sigma* ranges over [1.0695, 3.6817]. Correlation of sigma* with |T| is -0.85; with Euler density, -0.04.

## 5. Zero census of the twins (MEASURED)

`twin_zeros.py` (python-flint L-values, 64 bits; motherbox, 8 cores). For each twin and 0.25 < Im s < T: total zeros
by the argument principle on the right half rectangle, on-line zeros by sign changes of the real function
Z_F(t) (step 0.02 with a close-pair refinement), zeros right of 0.75 and right of 1 by the argument principle.
Checks: N_total within 1e-12 of an integer in every run; the off-line count is non-negative in every run and even in 92
of 94 (the two exceptions are explained below); DH
reproduces the four known off-line zeros below 200 (8 = 4 pairs) and one zero right of 0.75.

94 twins: 54 at T = 600.3 (all complex character pairs, q = 5, 7, 11, 13, 17, 19, both root numbers) and 40 at
T = 150.3 (q = 29, 31, 37, 41, five pairs each). 37,431 zeros counted, 7,294 of them off the line. Full table:
`analyze.log`. Columns: T_c = |arg(-c/conj c)| (the mixing phase), "off" = off-line zeros, "share" = off / N.

| q | Conrey m | order of chi | omega | Euler density | T_c | N | off | share | N(Re > 0.75) | N(Re > 1) | sigma* |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 17 | 10 | 16 | +1 | 0.125 | 2.989 | 611 | 10 | 0.016 | 0 | 0 | 1.0859 |
| 5 | 2 | 4 | +1 (DH) | 0.500 | 2.588 | 494 | 30 | 0.061 | 7 | 0 | 1.1204 |
| 13 | 4 | 6 | +1 | 0.333 | 2.605 | 585 | 22 | 0.038 | 4 | 0 | 1.0938 |
| 17 | 2 | 8 | +1 | 0.250 | 2.403 | 610 | 48 | 0.079 | 8 | 0 | 1.1785 |
| 7 | 3 | 6 | +1 | 0.333 | 1.968 | 526 | 72 | 0.137 | 28 | 4 | 1.2654 |
| 17 | 8 | 8 | +1 | 0.250 | 1.647 | 611 | 114 | 0.187 | 40 | 12 | 1.3742 |
| 19 | 8 | 6 | +1 | 0.333 | 1.473 | 621 | 158 | 0.254 | 50 | 12 | 1.3204 |
| 13 | 2 | 12 | -1 | 0.167 | 1.021 | 585 | 172 | 0.294 | 64 | 33 | 1.6173 |
| 19 | 6 | 9 | -1 | 0.111 | 0.713 | 621 | 184 | 0.296 | 81 | 67 | 2.0378 |
| 5 | 2 | 4 | -1 | 0.500 | 0.554 | 494 | 178 | 0.360 | 84 | 74 | 2.3823 |
| 7 | 2 | 3 | -1 | 0.333 | 0.460 | 526 | 202 | 0.384 | 97 | 86 | 2.4322 |
| 17 | 10 | 16 | -1 | 0.125 | 0.152 | 610 | 238 | 0.390 | 112 | 99 | 3.6817 |

Least-squares fit of the off-line share on (T_c, Euler density, log q):

| sample | coefficient of T_c (t-value) | coefficient of Euler density (t-value) | R^2 | corr(share, T_c) | corr(share, Euler density) |
|---|---|---|---|---|---|
| 54 twins, T = 600.3 | -0.153 (-34.8) | +0.044 (+1.3) | 0.960 | -0.978 | +0.053 |
| all 94 twins | -0.165 (-36.0) | +0.064 (+2.0) | 0.935 | -0.965 | +0.059 |

Mean off-line share by Euler density (the two root numbers of a pair have T_c summing to pi, so every group has mean
T_c = pi/2): 0.200 (density 1/20), 0.192 (1/18), 0.193 (1/15), 0.189 (1/14), 0.184 (1/10), 0.189 (1/9), 0.193 (1/8),
0.174 (1/7), 0.176 (1/6), 0.198 (1/5), 0.185 (1/4), 0.212 (1/3), 0.208 (1/2).

Reading. Across a tenfold range of Euler density the off-line share stays between 0.174 and 0.212. The fitted
coefficient of Euler density is positive and of marginal significance: more shared Euler factors do not reduce off-line
zeros, and if anything raise them slightly. This is the direction expected from the mechanism: zeros leave the line
where the two terms c L(chi) and conj(c) L(conj chi) are comparable, and shared Euler factors make them more
correlated. The share is governed by the mixing phase T_c: about 0.44 - 0.16 T_c at these heights.
A structural remark (PROVED from the FE, since Z_{conj chi}(t) = Z_chi(-t); checked numerically to 1e-6 for q = 5, 7,
13): on the critical line the twins of a pair are |c| (Z_chi(t) + Z_chi(-t)) for omega = +1 and
+-|c| (Z_chi(t) - Z_chi(-t)) for omega = -1. They are the even and odd parts of the Hardy function of chi; DH is the
even part for the character mod 5 with chi(2) = i.

Two runs, (q, m, omega) = (29, 4, -1) and (37, 6, -1), returned an odd off-line count. Cause: the sampling grid ends
0.01 below T, and in both runs Z_F changes sign in (150.29, 150.30) (checked directly). The table uses the corrected
on-line counts.


**Bohr-Jessen cross-check (MODEL, `mc_density.py`).** Density of zeros right of sigma_0 per unit height from the
random-phase model, D(sigma_0) = -(1/2 pi) d/d sigma E log|1 - R_sigma e^{-iT}|:

| twin | D(0.75) model | census N(Re > 0.75)/T | D(1) model | census N(Re > 1)/T |
|---|---|---|---|---|
| DH, omega = +1 (T = 2.588) | 0.0124 +- 0.0004 | 7/600 = 0.0117 | 0.0000 +- 0.0001 | 0 |
| DH, omega = -1 (T = -0.554) | 0.1670 +- 0.0005 | 84/600 = 0.140 | 0.1254 +- 0.0003 | 74/600 = 0.123 |

With the target phase held fixed and only the lab changed (so only the Euler set changes):

| lab (order of chi; Euler density) | D(0.75), T = 2.588 | D(0.75), T = 1.0 | D(1), T = 1.0 |
|---|---|---|---|
| q = 5, order 4; 1/2 | 0.0134 | 0.1373 | 0.0951 |
| q = 7, order 3; 1/3 | 0.0049 | 0.1495 | 0.0873 |
| q = 7, order 6; 1/3 | 0.0131 | 0.1301 | 0.0911 |
| q = 13, order 12; 1/6 | 0.0022 | 0.1499 | 0.0737 |
| q = 101, order 100; 1/50 | 0.000 (below noise 0.0003) | 0.1578 | 0.0478 |

No monotone dependence on Euler density. At the hard target the density is governed by which small primes are
non-Euler and with what phase.

## 6. The formal lab: Euler factors shared at every prime up to P (no FE)

Corollaries A1-A3 show that an FE-exact function cannot have Euler factors at "all p <= P" and a non-Euler tail beyond
P unless P is below the collapse threshold: the non-Euler set has density at least 1/2 (degree 1) or 1/8 (GL(2)). The
task's synthetic family in its literal form therefore exists only without the FE. For it (DH phase pattern on the
primes p > P, p = +-2 mod 5; `formal_tail.py`, `mc_density.py`):

| P | sigma*(P), T = 2.588 | (sigma* - 1) log P | sigma*(P), T = 0.554 | (sigma* - 1) log P | D(0.75), T = 0.554 (MODEL) |
|---|---|---|---|---|---|
| none | 1.12036 | - | 2.38229 | - | 0.167 |
| 2 | 1.04671 | 0.0324 | 1.58832 | 0.408 | 0.230 |
| 3 | 1.02427 | 0.0267 | 1.28383 | 0.312 | 0.272 |
| 7 | 1.01824 | 0.0355 | 1.21082 | 0.410 | 0.223 |
| 13 | 1.01564 | 0.0401 | 1.18044 | 0.463 | 0.174 |
| 23 | 1.01274 | 0.0400 | 1.14619 | 0.458 | 0.080 |
| 47 | 1.01104 | 0.0425 | 1.12672 | 0.488 | 0.028 |
| 997 | 1.00636 | 0.0439 | 1.07284 | 0.503 | - |
| 99991 | 1.00383 | 0.0441 | 1.04387 | 0.505 | - |
| 999983 | 1.00319 | 0.0441 | 1.03657 | 0.505 | - |

**Proposition D (PROVED given the prime number theorem in progressions).** If the non-Euler primes beyond P have
density delta and mean |sin phi| equal to mbar on them, then (sigma*(P) - 1) log P -> x_T, the root of
2 delta mbar E_1(x) = |T| (E_1 the exponential integral). For the DH pattern: E_1(x) = 2.588 gives 0.0441, and
E_1(x) = 0.554 gives 0.505; both match the table. Reason: Gamma(sigma) ~ 2 delta mbar int_P^inf x^{-sigma} dx / log x.

So in the formal lab the right edge tends to 1 like x_T / log P and never crosses 1: the non-Euler primes have
divergent sum of 1/p, so Gamma(1+) is infinite and every target is reachable. The zero density at a fixed abscissa
inside the strip is not monotone in P (it rises from 0.167 to 0.272 as the primes 2 and 3 are made Euler, then decays);
for large P it decays like a Gaussian tail in the variance sum_{p > P} p^{-2 sigma_0}. A zero-free statement in
Re s > 1 would need a non-Euler set with small sum of 1/p; the FE forbids that (density >= 1/2 or >= 1/8).

## 7. Route 30's next step: the Euler-aware (class-uniform) Weil radius (MEASURED, Rayleigh-Ritz)

Form (`weil_class.py`): for g supported in [-a, a], F = g * g~,

  W_c(g) = 2 Re(u conj v) + (C(a) - log pi) F(0) + int_0^{2a} k(x) [2F(0) - F(x) - F(-x)] dx
           - sum_n c(n) n^{-1/2} F(log n) - conj,
  u = int g e^{x/2}, v = int g e^{-x/2}, k(x) = e^{-x/2}/(1 - e^{-2x}), C(a) = int_0^inf (e^{-2x}/x - 1_{x<2a} 2k(x)) dx.

This is Weil's explicit formula with the digamma term written through Gauss's integral. Discretisation: piecewise
constants on n cells, for which every term is evaluated exactly; this is a subspace of the form domain, so a negative
eigenvalue found here is a negative direction of the true form (up to float rounding), and the admissible sets below
are outer bounds. Validation: for g = 1_{[-1/2, 1/2]} the form gives 0.0880146 and the sum over the first 400 zeta zeros
plus a tail estimate gives 0.0880080.

Class: zeta's pole and archimedean terms, prime side from the formal unitary degree-1 rung class c(p^k) = alpha_p^k
log p, |alpha_p| = 1 (the extreme points of the Toeplitz-positive class).

| quantity | value (support 2a) |
|---|---|
| information floor | ln 2 = 0.6931 |
| class-uniform radius: largest support with W >= 0 for every alpha (worst case alpha_2 = -1) | 0.72312 (n = 150), 0.72292 (n = 300), 0.72285 (n = 600) |
| radius with the prime side deleted | 0.7434 |
| zeta (alpha = 1): smallest eigenvalue at 2a = 0.8, 1.0, ln 3 (n = 400) | 2.2e-4, 5.1e-5, 5.3e-5 (positive, as it must be) |

Admissible window for c(2) = t ln 2 under W >= 0 (outer bounds, n = 400; `weil_window.py`):

| 2a | real t | imaginary half-width |
|---|---|---|
| 0.72 | [-1.236, 2.384] | 1.757 |
| 0.80 | [0.7797, 1.0667] | 0.118 |
| 0.90 | [0.9791, 1.0073] | 0.0117 |
| 1.00 | [0.99790, 1.00317] | 0.0025 |
| ln 3 | [0.99905, 1.00100] | 0.0010 |

Reading. (i) Rung unitarity without the exact phases buys Weil positivity only up to 2a = 0.7228, which is 0.03 above
the floor: this answers route 30's `nextStep` and synthesis item 10 in the negative. (ii) The implication runs the
other way: Weil positivity with zeta's bridge determines c(2) to 0.1% from tests of support below ln 3. This agrees
with atlas section 7 (finite-prime rigidity). Positivity determines the Euler data; Euler-class membership does not
give positivity. The archimedean radius 0.9385 quoted in route 30 belongs to a different (pole-free, even-data) form
from `tlb-dh-blind` and is not comparable with 0.7228.

## 8. Answer to the question, and the DH control

**Does zeta satisfying every multiplicativity constraint, together with the FE, force a zero-location statement?**
Not through the constraints. Precisely:

1. At conductor 1 the FE plus integrality already gives F = zeta (Hamburger). The constraints add nothing, and the
   Laurent twin of section 1 shows that without integrality FE + multiplicativity allows zeros anywhere.
2. In each FE-space with more than one member, the constraint set at stage S is a union of fibres (Lemma A). A fibre
   with two elements contains functions with zeros in Re s > 1 (Theorem B), with right edge given by Theorem C. A fibre
   with one element is one L-function.
3. The transition is forced to be abrupt by refined strong multiplicity one: Euler density cannot lie in (1/2, 1) in
   degree 1 or in (7/8, 1) on GL(2). There is no family of FE-exact functions whose Euler set increases to all primes.
4. In coefficient space (c-coordinates, where the Weil form is linear) the constraint class is convex and zeta's
   coefficients satisfy it identically. Positivity for zeta would have to hold on the whole class to be derived from
   class membership; it fails at support 0.7228 (section 7).

**DH control.** Every statement above holds for DH with the correct outcome. DH lies in the q = 5 odd FE-space, is the
index-2 fibre member for S = {p = +-1 mod 5}, fails E_2 and E_3 with Q = 1 + kappa^2, and has zeros up to
sigma* = 1.120362. The census reproduces its known off-line zeros. No step here would prove anything about zeros of an
L-function; the first step that uses the Euler product is the hypothesis E_p of Lemma A, and its output is
identification only.

**What an argument for RH would have to use instead.** A property of the individual function that no member of any
relaxed class shares. The examples in this note fix the list of candidates: exact phases alpha_p = 1 coupled to the
archimedean factor (section 7), integrality (section 1), and an Euler set of full density (sections 2-3). The hierarchy
of inequalities cannot encode the first of these except as the Weil form itself.

## 9. Three weakest steps

1. **Scope of the labs.** Lemma A needs a finite-dimensional FE-space with an eigenbasis. That covers degree 1
   (Kaczorowski-Perelli) and level-1 weight-k (Hecke). For FE types whose solution space is infinite-dimensional
   (Hecke groups with lambda > 2, i.e. level >= 5 without twists) the structure of {FE + E_p, p in S} is cited
   (Conrey-Farmer) and not reproved or tested here.
2. **Census and model are not certified.** Zero counts use float argument tracking with fixed steps; sign-change
   counting can miss close pairs (a miss would overstate the off-line count by 2). The 94-twin regression is at heights
   150-600, far below the Bombieri-Hejhal asymptotic regime (off-line share tends to 0). The Monte Carlo errors are
   one-sigma and the estimator has heavy tails (one value is -2.5 sigma below zero).
3. **Section 7 is one-sided.** Negativity statements are Rayleigh-Ritz facts in float arithmetic; the positivity side
   (the radius is above ln 2; zeta's eigenvalues) and the window widths are numerical and not converged in n (windows
   are outer bounds and shrink with n). Theorem C's novelty is unchecked against Bombieri-Ghosh.

## 10. Files

All under `tmp/research-2026-11-16/push/b-euler-detector/`.

| File | Content |
|---|---|
| `lab_dirichlet.py`, `.json`, `.log` | Lemma A check; collapse statistics for 283,144 prime conductors |
| `gl2_examples.py`, `gl2_examples.json`, `gl2_600.log` | T_2 irreducible on S_k, k <= 600; Laurent twin; shifted-product twin |
| `dh_sigma_star.py`, `.json` | sigma*(DH) with primes to 1e8 |
| `check_theoremC.py`, `.json` | two checks of the right-edge formula |
| `sigma_star.py`, `.json`, `.log` | sigma* for the 94 census twins |
| `formal_tail.py`, `.json` | right edge in the formal lab; Proposition D |
| `mc_density.py`, `.json`, `.log` | Bohr-Jessen zero densities |
| `twin_zeros.py`, `jobs.txt`, `twins.jsonl`, `analyze.py`, `analyze.json` | zero census and regression |
| `weil_class.py`, `weil_window.py`, `.json`, `.log` | class-uniform Weil radius; admissible window for c(2) |
