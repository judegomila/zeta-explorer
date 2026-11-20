# c20-euler-shape-rigidity-infinite-modified-primes: RESULT

Date 2026-11-20. Round 20, kind: combine (pre-filter). Scope: this directory only. Server: not used; the
decisive first test is a paper argument and it decided the question in the assigned class; the numerics are
sanity checks of the proof mechanism and ran locally through `scripts/memcap.sh 8` (python3.14, numpy float64
and mpmath at 40 digits; `checks.py`, `ref_check.py`; under 2 minutes in total). Nothing committed or pushed.
No independent referee has read this file (referees = 0; `REFEREE.md` is the author's adversarial pass and
says so). **No statement about zeros of zeta is made. This lane cannot reach zeros by itself: every result
below is an identification (it names a function, it locates no zero) or a statement about twins.**
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete elementary argument in this file; author only) / CLASSICAL (recalled, not opened) /
MEASURED (float64 or mpmath, grid statements) / RELATIVE (to a row on file) / ARGUED / OPEN.

Sources read: `BRIEF.md` to the end; `c19-hq2-screen-fe-int-mult-pos-devices` (RESULT.md sections 0 to 4,
REFEREE.md sections 3, 4 with E1, E2, MAP_ROW.md); `c18-exact-relation-rigidity-klein-spinor` (Lemma Q,
Proposition F, Proposition D with the entered correction; REFEREE.md items on these);
`c16-pos-fe-u2-positivity-rigidity` through its map row P56 (Theorem P; the proof was not re-opened);
`OBSTRUCTION_MAP.md` section 2 (controls), rows P6, P46, P51, P56, P57, Q19, Q21, G40, Z18, D8, L1 to L6.

## 0. Verdict

**Identification (class U3), proved in the assigned class; no twin; no new control.** Registered outcome:
'identification'.

1. (Theorem A, PROVED.) Let G be an Euler product with zeta's functional equation. If the relative Euler
   product N = zeta/G converges absolutely and uniformly on the closed half-plane Re s >= 1/2 (hypothesis
   (H): the sum over p of sup over abs y <= p^(-1/2) of abs(n_p(y) - 1) is finite, n_p = 1/(L_p(y)(1 - y))),
   then G = zeta. For degree-one geometric local factors (1 - alpha_p p^-s)^-1 hypothesis (H) is exactly
   **sum over p of abs(1 - alpha_p) p^(-1/2) < infinity**. This covers every modified set S with sum over
   p in S of p^(-1/2) finite and bounded alpha_p (including deletion alpha_p = 0 and sign flips), every
   degree d_p <= d with bounded parameters on such S, and all of Lemma C of c19 (finite S, any alpha). No
   pole clause on G, no order clause and no positivity is used; G is not assumed meromorphic beyond a
   neighbourhood of the line (boundary values on the line are enough). Lemma C's lattice-divisor argument is
   not used.
2. (Kill test, on paper.) A twin with geometric local factors on an infinite set S with sum p^(-1/2) finite,
   bounded parameters and zeta's exact functional equation **does not exist** (Theorem A). In particular
   zeta times a symmetric multiplier built as a product convergent up to the line is zeta.
3. (Quantitative form, Corollary A2, PROVED.) Under (H), sup over real t of abs(N(1/2 + it) - N(1/2 - it))
   >= abs(c(n)) n^(-1/2) for every n >= 2, c the coefficients of N; in particular >= abs(1 - a_G(p)) p^(-1/2)
   for every prime p. Sparse sign chains and sparse deletions therefore miss the functional equation on the
   line by at least 2 p_min^(-1/2) and p_min^(-1/2) (MEASURED: sup 2.23 and 1.02 for S = {11, 101, 1009, ...}).
4. **What the theorem is, stated against the requirement (R1).** The proof does not use multiplicativity. It
   is the statement that a function whose boundary values on the critical line have one-sided Bohr spectrum
   (frequencies -log n, n >= 1) and are symmetric under t -> -t is constant; equivalently Liouville after a
   reflection. It holds for any Dirichlet series m or 1/m bounded on Re s > 1/2 with continuous boundary
   values, Euler product or not, and it holds with the Davenport-Heilbronn function or a Beurling zeta as the
   base in place of zeta. The Euler shape enters only as a size condition: it makes zeta/G bounded and
   continuous on Re s >= 1/2. This is referee item E1 of c19 for infinitely many primes: in the functional
   equation class the local-shape step is a boundedness (pole and size) clause on zeta/G in the closed right
   half-plane, not a separate mechanism.
5. (Sharpness of the method, Theorem B; Bohr's inequality CLASSICAL.) If zeta/G is a Dirichlet series bounded
   on Re s > 1/2 then sum over p of abs(1 - a_G(p)) p^(-1/2) <= sup abs(zeta/G). So for degree-one geometric
   factors "zeta/G bounded on Re s > 1/2" is equivalent to the summability in statement 1, and outside it
   the reflection argument has no hold.
6. (Regime (K): relative product convergent in the open half-plane only; Theorem C, PROVED.) If the relative
   product converges absolutely for every Re s > 1/2 (sum abs(1 - alpha_p) p^-sigma finite for each
   sigma > 1/2) but (H) fails, a twin is not excluded, but: (a) every zero of G off the critical line is a
   zero of zeta, with at most zeta's multiplicity; such a twin cannot serve as an off-line control;
   (b) if zeta/G is in addition analytic in a strip around the line with growth below exp(exp(k abs t)),
   then G = zeta; so a twin of finite order must have G/zeta vanishing at a point of the critical line.
   Existence of a twin in this regime: OPEN.
7. (Where the proof breaks.) When the relative product has abscissa of absolute convergence sigma_rel > 1/2
   (non-sparse S with alpha_p not tending to 1; all unimodular completely multiplicative classes, Dirichlet
   characters, E_a, THIN and DEL with b > 1/2), zeta/G is not given by the product in 1/2 < Re s <= sigma_rel
   and no boundedness is available there. This is requirement R4 in relative form (pass from the half-plane
   of convergence of zeta/G to the line). Question Q-inf of c19 remains OPEN in this regime only.
8. (Filter.) Device rows that rejected a control only through local Euler shape: section 6. For controls
   with zeta's functional equation the rejection is forced for finitely many modified primes (Lemma C) and
   for infinitely many in the summable class (Theorem A: no such control exists); in regime (K) no control
   with an off-line zero exists (Theorem C (a)); for sigma_rel > 1/2 it is not decided. No device gains a
   mechanism from this; nothing here raises the requirement score.

## 1. Plan; what is new against the record

Plan as assigned: (1) kill test on paper: twin with degree-one geometric factors on an infinite sparse S and
zeta's functional equation; (2) first lemma: extend Lemma F / Lemma C to S with sum p^(-1/2) finite, stating
the convergence used and where the functional equation enters, or find the breaking point; (3) controls
HQ2, HQ3, HQ4, ZQ, NR-q, THIN, DEL, E_a; (4) filter list.

New against the record: Theorem A (infinitely many modified primes, summable class), Corollary A2 (defect
bound), Theorem B as the sharpness statement, Theorem C (regime (K)), the three-regime split by sigma_rel,
the statement that the summable-class rigidity uses no multiplicativity and is base-blind. Not new: Lemmas
S, F, C (c19), Lemma Q (c18), referee E1 of c19 (pole-freeness alone suffices for one prime), Bohr's
inequality and the uniqueness theorem for almost periodic functions (classical), the hypothesis shape
sum abs(eta(n)) n^(-1/2) < infinity of Theorem R (row P6).

Notation. y = p^-s, u = p^(1/2 - s). G(s) = prod over p of L_p(p^-s), L_p a power series with L_p(0) = 1.
n_p(y) = 1/(L_p(y)(1 - y)) and N = prod n_p(p^-s) = zeta/G; m = 1/N = G/zeta. For degree one,
L_p = (1 - alpha_p y)^-1 and n_p = (1 - alpha_p y)/(1 - y) = 1 + (1 - alpha_p)(y + y^2 + ...), so the Dirichlet
coefficients of N are c(n) = prod over p dividing n of (1 - alpha_p). a_G(p) is the coefficient of G at p;
c(p) = 1 - a_G(p). "Zeta's functional equation" for G: gam(s) G(s) = gam(1 - s) G(1 - s),
gam(s) = pi^(-s/2) Gamma(s/2), which is m(s) = m(1 - s), N(s) = N(1 - s).

## 2. Theorem A and the kill test

### 2.1 Statement

**Theorem A (PROVED).** Suppose
(H) each n_p is analytic in abs y < p^(-1/2) and continuous on abs y <= p^(-1/2), and
delta_p = sup over abs y <= p^(-1/2) of abs(n_p(y) - 1) satisfies sum over p of delta_p < infinity;
(FE) N(1/2 + it) = N(1/2 - it) for every real t, where N is the product of (i) below.
Then n_p = 1 for every p, that is L_p(y) = (1 - y)^-1 for every p and G = zeta.

(i) Convergence used, and only this: under (H) the product N(s) = prod n_p(p^-s) converges absolutely and
uniformly on the closed half-plane Re s >= 1/2 (abs(n_p(p^-s) - 1) <= delta_p there). N is analytic in
Re s > 1/2, continuous on Re s >= 1/2, abs N <= exp(sum delta_p), and N(sigma + it) -> 1 as sigma -> +infinity
uniformly in t (each factor tends to n_p(0) = 1; dominated by delta_p). In Re s > 1 where N != 0 the product
of the L_p converges to zeta/N, so G = zeta/N as meromorphic functions on Re s > 1/2.

(ii) Where the functional equation enters: once, as (FE), an identity of boundary values on the critical
line. If G is given with zeta's functional equation as a meromorphic identity near the line, then
N = zeta/G is meromorphic near the line and symmetric; being bounded on Re s > 1/2 near each point of the
line it is analytic there and its values on the line are the limits from the right, which are the
continuous boundary values of the product. So any form of the functional equation gives (FE). Nothing is
assumed about G in Re s < 1/2 and nothing about poles of G: zeros of N in Re s >= 1/2 (poles of G, present
when some abs alpha_p >= p^(1/2)) are allowed.

Degree one: delta_p = abs(1 - alpha_p) p^(-1/2)/(1 - p^(-1/2)) <= 3.4143 abs(1 - alpha_p) p^(-1/2) (the maximum
of abs((1 - alpha) y/(1 - y)) on the disc is at y = p^(-1/2)). So (H) is the condition
sum abs(1 - alpha_p) p^(-1/2) < infinity. Degree d_p <= d with abs alpha_(p,j) <= A on a set S with
sum over S of p^(-1/2) finite: delta_p <= ((1 + A p^(-1/2))^d - 1 + p^(-1/2))/(1 - p^(-1/2)) <= C(d, A) p^(-1/2),
so (H) holds. alpha = 0 (deletion of the prime; d_p = 0) is included. S need not be sparse if alpha_p -> 1
fast enough; S may be all primes.

**Corollary A1 (the assigned first lemma, PROVED).** Let S be a set of primes with sum over p in S of
p^(-1/2) finite, L_p = prod over j <= d_p of (1 - alpha_(p,j) y)^-1 for p in S with d_p and abs alpha_(p,j)
bounded, L_p = (1 - y)^-1 outside S. If G has zeta's functional equation then G = zeta. For unbounded
parameters the same holds under sum over S of abs(1 - alpha_p) p^(-1/2) < infinity (degree one).

**Corollary A2 (defect bound, PROVED).** Under (H) without (FE): for every n >= 2,
sup over real t of abs(N(1/2 + it) - N(1/2 - it)) >= abs(c(n)) n^(-1/2); in particular
>= abs(1 - a_G(p)) p^(-1/2) for every prime p.

### 2.2 Proofs

Proof of Theorem A, first form (reflection and Liouville). Put E(s) = N(s) for Re s >= 1/2 and
E(s) = N(1 - s) for Re s <= 1/2. By (FE) the two definitions agree on the line; E is continuous on C and
analytic off the line, hence entire (Morera; CLASSICAL). abs E <= exp(sum delta_p), so E is constant
(Liouville), and the constant is the limit 1 at sigma -> +infinity. So N = 1 on Re s >= 1/2. Cauchy's
estimate on abs y = p^(-1/2) gives abs(c_(p,k)) <= delta_p p^(k/2) for the Taylor coefficients of n_p, so at
sigma = 2 the Dirichlet series N = sum c(n) n^-s converges absolutely (sum over k of abs(c_(p,k)) p^(-2k) <=
0.55 delta_p). An absolutely convergent Dirichlet series equal to 1 on a vertical line has c(n) = 0 for
n >= 2 (mean value of N(2 + it) n^(it)). c(p^k) = c_(p,k), so n_p = 1. QED

Second form (one-sided spectrum; also proves A2). f(t) = N(1/2 + it) is a uniform limit on R of finite
products of functions n_p(p^(-1/2) e^(-i t log p)); each of these is a continuous function on the circle with
Fourier coefficients c_(p,k) p^(-k/2) at k >= 0 only, evaluated along t. So f is Bohr almost periodic with
Fourier-Bohr coefficients M{f(t) n^(it)} = c(n) n^(-1/2) for integers n >= 1 and M{f(t) e^(i lambda t)} = 0
for every other lambda, in particular for lambda = -log n, n >= 2 (limits of the coefficients of the partial
products, which are trigonometric-polynomial limits with spectrum in {-log n}). g(t) = N(1/2 - it) = f(-t)
has M{g(t) n^(it)} = 0 for n >= 2. Hence M{(f - g)(t) n^(it)} = c(n) n^(-1/2) and
abs(c(n)) n^(-1/2) <= sup abs(f - g): this is A2. Under (FE) f = g, so every c(n) with n >= 2 vanishes, and
f = c(1) = 1 by the uniqueness theorem for almost periodic functions (CLASSICAL); then conclude as before. QED

Remarks. (a) Neither form uses that N is a product. Lemma A0 (PROVED by the same lines): a Dirichlet series
D(s) = sum c(n) n^-s, convergent somewhere, bounded and analytic in Re s > 1/2 with continuous boundary values
satisfying D(1/2 + it) = D(1/2 - it), is the constant c(1). With D meromorphic on C and D(s) = D(1 - s) the
continuity assumption can be dropped: a meromorphic function bounded on both sides of the line has no pole
on it. The frequencies log n may be replaced by any set of non-negative reals (Beurling integers). The base
zeta may be replaced by any function B with a functional equation: B m has the functional equation of B iff
m is symmetric. So the rigidity is base-blind and coefficient-multiplicativity-blind.
(b) Multiplicativity is used only to convert a local hypothesis into the global bound: for a product,
sup abs N <= prod (1 + delta_p). The hypothesis could be imposed on 1/N = m instead (local factors
L_p(y)(1 - y) analytic on the closed disc with summable deviation: local factors free of poles in
Re s >= 1/2); the same proof gives G = zeta. One of the two one-sided conditions suffices; this is the
infinite form of referee item E1 of c19.
(c) Lemma C of c19 is the case of finite S: (H) holds for every finite set of geometric factors whatever
the alpha (the numerator of n_p is a polynomial). Lemma S of c19 is the one-prime case of remark (b).
Lemma F (splitting into one-prime symmetric factors) has no content in the summable class, where m = 1.

### 2.3 Kill test: the twin candidates

Candidate 1: m(s) = prod over p in S of (1 - p^-s)/(1 - alpha_p p^-s) with S sparse (sum p^(-1/2) finite),
alpha_p bounded, required to satisfy m(s) = m(1 - s). By Theorem A, m = 1. There is no choice of S and
alpha_p in this class. Corollary A2 gives the size of the miss.

Candidate 2: an infinite product of one-prime symmetric factors R_p(u_p) (HQ1 to HQ4 at infinitely many
primes). Each local factor is then (1 - y)^-1 R_p, not geometric (Lemma S). Also ARGUED: with zeros or poles
of R_p at fixed distance from the line the lattices 2 pi i k/log p have spacing tending to 0 and the poles
accumulate on a vertical line, so the product is not meromorphic there; with poles moved out to real part
tending to infinity the product is meromorphic on C and symmetric but is not a Dirichlet series convergent in
any half-plane. Neither is a member of the class of the question.

Candidate 3: ZQ and symmetric T-NR as multipliers. ZQ: m is rational in s(1 - s); m(1/2 + it) tends to 1 at
infinity and is not constant, so it is not almost periodic: m is not a Dirichlet series, no local factors
exist. T-NR: m = u^-1 + c + u has the frequency +log q (a coefficient at "n = 1/q"): two-sided spectrum; it
is not an Euler factor with L(0) = 1, and it is unbounded on Re s > 1/2. Multiplying by u restores one-sided
spectrum and destroys the functional equation. Both are outside the class at a named hypothesis.

Result of the kill test: the twin cannot exist in the class named in the assignment (sparse S in the sense
sum p^(-1/2) finite, degree-one completely multiplicative modification with bounded parameters). The lemma
is an identification row, class U3.

## 3. The edge of the method

**Theorem B (CLASSICAL input: Bohr's inequality).** If D(s) = sum c(n) n^-s converges somewhere and extends
to a bounded analytic function on Re s > sigma_1, then sum over primes of abs(c(p)) p^(-sigma_1) <= sup abs D.
Applied to D = N = zeta/G with sigma_1 = 1/2: boundedness of zeta/G on Re s > 1/2 forces
sum abs(1 - a_G(p)) p^(-1/2) <= sup abs N. For degree-one geometric factors this is the converse of (i): N is
bounded on Re s > 1/2 iff sum abs(1 - alpha_p) p^(-1/2) is finite. For products in the region of absolute
convergence the exact value is sup over t of abs(N(sigma + it)) = prod over p of max over abs y = p^-sigma of
abs(n_p(y)) (Kronecker: the logs of the primes are independent over Q; PROVED by density of the orbit in the
torus and uniform convergence; checked numerically in section 5). This is the one place where the
arithmetic of the frequency set (unique factorisation) is read, and it is read to show that the method
stops, not to prove an identification.

Three regimes, by the abscissa sigma_rel of absolute convergence of the relative product (degree one:
of sum abs(1 - alpha_p) p^-sigma):

| Regime | Condition | Status of "FE + Euler shape => zeta" | Zeros of a twin |
|---|---|---|---|
| 1 | sum abs(1 - alpha_p) p^(-1/2) finite (sigma_rel < 1/2, or = 1/2 with convergence at 1/2) | PROVED: G = zeta (Theorem A) | no twin |
| 2 = (K) | finite for every sigma > 1/2, infinite at 1/2 | OPEN; partial: Theorem C | off the line: zeta's only (PROVED); finite order: G/zeta has a zero on the line (PROVED) |
| 3 | sigma_rel > 1/2 | OPEN (Q-inf of c19); the proof has no input in 1/2 < Re s <= sigma_rel | not decided |

**Theorem C (regime (K), PROVED).** Let n_p be analytic in abs y < p^(-1/2) for every p and suppose
sum over p of sup over abs y <= p^-sigma of abs(n_p(y) - 1) is finite for every sigma > 1/2. Let G be
meromorphic on C with zeta's functional equation and G = zeta/N on Re s > 1/2. Then
(a) m = G/zeta has no zero in Re s != 1/2: every zero of G off the critical line is a zero of zeta (or a
trivial zero), with multiplicity at most zeta's.
(b) If N is analytic in a strip abs(Re s - 1/2) < d and abs N <= exp(exp(k abs t)) there with k < pi/(2d),
then G = zeta. In particular a twin G != zeta of finite order has a zero of G/zeta on the critical line.
(c) Degree one with abs alpha_p <= p^(1/2) for all p: the same holds for m in place of N, so a twin of
finite order has both a zero and a pole of G/zeta on the critical line and none off it.

Proof. (a) N is analytic in Re s > 1/2 (locally uniform limit), so m = 1/N has no zero there; m is symmetric,
so none in Re s < 1/2. (b) M(sigma) = sup over t of abs N(sigma + it) is finite for sigma > 1/2 and
N is bounded on Re s >= sigma_1 for each sigma_1 > 1/2. Take 1/2 < sigma_1 < 1/2 + d. N is analytic in the
closed strip 1 - sigma_1 <= Re s <= sigma_1, bounded by M(sigma_1) on both edges (symmetry) and of admissible
growth, so abs N <= M(sigma_1) in the strip (Phragmen-Lindelof; CLASSICAL). With the bound on Re s >= sigma_1
and its reflection, N is a bounded entire function with limit 1. Then as in Theorem A. A meromorphic
function of finite order without poles is entire of finite order, which is admissible growth; the only
possible poles of N in the strip are on the line (by (a)), and they are zeros of m. (c) For
abs alpha_p <= p^(1/2) the factors (1 - y)/(1 - alpha_p y) are analytic and zero-free in abs y < p^(-1/2) and
the same summability holds for m; apply (a), (b) to m. QED

Reading of regime 2. A twin there would have "the Riemann hypothesis relative to zeta": its extra zeros and
poles sit on the line (HQ1 with 0 < eps <= 4 has this divisor pattern in the one-prime, non-geometric
class). Whether one exists with geometric factors is OPEN; the natural candidates
(abs alpha_p = p^(1/2) on a super-sparse set) have local pole lattices on the line with spacing tending to 0
and the product does not converge on the line (ARGUED: natural boundary expected; not proved).

Reading of regime 3. THIN and DEL (map section 2, b in (1/2, 1)) have sigma_rel = b and their continuation
is zeta(s)(s - b)W(s): the relative product, continued left of its abscissa, has a zero at s = b off the line.
They have no functional equation, so they are not twins; they show that in regime 3 the continuation of a
geometric relative product can vanish in 1/2 < Re s <= sigma_rel, which is excluded in regimes 1 and 2. An
argument for Q-inf in regime 3 must therefore read the functional equation and the local shape jointly in a
region where the product is not available: the wall R4 in relative form.

## 4. Controls

The statement tested is Theorem A (and A0). An identification theorem is not expected to give R3; the table
records which hypothesis each control fails. "Base" = the theorem with the control in place of zeta.

| Control | FE of zeta | one-sided Dirichlet spectrum, L(0) = 1 | (H) for N or for m | Fails at | Status |
|---|---|---|---|---|---|
| HQ1 (0 < eps <= 4; eps = c_q + 2) | yes | yes | no | n_q and m_q have a pole or zero in abs u <= 1 (on the circle for eps <= 4); sum over k of abs c(q^k) q^(-k/2) diverges for both | PROVED (roots); MEASURED sums |
| HQ2 (2, 1e-2) | yes | yes | no | zeros of m at abs u = 0.799, poles at abs u = 1 | same |
| HQ3, HQ4 (2; 0.1, 0.2) | yes | yes | no | zeros at abs u = 0.933, poles at abs u = 0.871 | same |
| ZQ, SG | yes | no | - | m is not almost periodic on the line (rational in s(1 - s)); no local factors | PROVED |
| NR, NR-q (symmetric T-NR) | yes | no | - | frequency +log q (two-sided spectrum); m unbounded on Re s > 1/2; NR-q also has a non-integer base | PROVED |
| THIN, DEL (b in (1/2, 1)) | no | yes | no (sigma_rel = b) | no functional equation; regime 3 | RELATIVE (map) |
| THIN, DEL on a sparse S (sum p^(-1/2) finite) | no, forced | yes | yes | Theorem A: the functional equation must fail; A2: defect >= 2 p_min^(-1/2), p_min^(-1/2) | PROVED; MEASURED sup 2.23, 1.02 |
| TW+, TW-, U, sign chains on a sparse S | no, forced | yes | yes | as the previous row | PROVED |
| E_a | no (gamma factor of degree 2) | yes | no (sigma_rel = 1) | functional equation; abs(m(s) - m(1 - s)) = 0.470 at s = 1/2 + 5i, a = 1/4 | MEASURED |
| Dirichlet L(s, chi), WT | no (conductor; shifted centre) | yes | no | functional equation; regime 3 | CLASSICAL |
| DH as base | - | - | - | Theorem A holds verbatim for DH m: base-blind | PROVED |
| B (Beurling) as base or as frequency set | - | - | - | Theorem A0 holds verbatim for non-negative frequencies | PROVED |
| HEAT, theta^w, phase-rotated transfer operator | - | no | - | not Dirichlet series of this form | - |

No control satisfies the hypotheses. No control is rejected by a step that zeta passes for a reason tied to
zeros: zeta passes because m = 1. R3 is not claimed.

## 5. Numerics (MEASURED; `checks.py` -> `checks.json`, `ref_check.py` -> `ref_check.json`)

T1. S = {11, 101, 1009, 10007, 100003, 1000003, 10000019, 100000007, 1000000007, 10000000019,
100000000003, 1000000000039} (next prime after 10^j, j = 1..12; sum p^(-1/2) = 0.4471; the tail j >= 13 of the
infinite set adds at most 4.7e-7). D(t) = N(1/2 + it) - N(1/2 - it) on t in [0, 2e4], step 0.01.

| Family | sup abs D (grid) | bound A2: max abs(1 - alpha_p) p^(-1/2) | sup abs N (grid) | bound exp(sum delta_p) | tail effect on sup abs D (bound) |
|---|---|---|---|---|---|
| alpha = -1 (sparse THIN) | 2.2278 | 0.6030 | 2.4949 | 3.2505 | 6.0e-6 |
| alpha = 0 (sparse DEL) | 1.0160 | 0.3015 | 1.6658 | 1.8029 | 1.7e-6 |
| alpha unimodular, random | 1.1701 | 0.4434 | 1.8523 | 2.2141 | 4.1e-6 |
| alpha = 1 + 0.3i | 0.2864 | 0.0905 | 1.1485 | 1.1934 | 3.3e-7 |
| alpha = 2.5 | 1.4378 | 0.4523 | 1.6331 | 2.4208 | 3.4e-6 |

So for the infinite set S = {next prime after 10^j, j >= 1} each family misses the functional equation on the
line by an amount 1e5 times the tail bound: none is identically zeta and none is a twin. Proof mechanism:
means over [0, 2e4] of N(1/2 + it) n^(it) for n = 11, 101, 1111, 121 agree with c(n) n^(-1/2) to within 9e-5 in
all 20 cases (example, alpha = -1: 0.602996, 0.199030, 0.120009, 0.181836 against 0.603023, 0.199007, 0.120006,
0.181818); the means of N(1/2 + it) n^(-it) are below 5e-5 in modulus in all 20 cases (one-sided spectrum).
Second pass at 40 digits (`ref_check.py`): abs D at t = 1, 7.3, 100.25 with 12 and with 20 primes differ by
at most 1.0e-6 (inside the tail bound), values 0.342, 0.860, 0.759 for alpha = -1.

T2 (Theorem B). (a) Primes 2, 3, 5 with alpha = -1, 2i, 0 at sigma = 0.6: sup over t in [0, 4e5] of abs N =
24.6350 against the product of local maxima 24.6384. (b) Non-summable sparse family p_j = 10^j,
(alpha_j - 1) p_j^(-1/2) = 1/j (square-summable, not summable): log of sup over t of abs N(1/2 + eps + it) by
the product formula, J = 10000 factors: 1.20, 3.12, 5.34, 7.60, 8.82 at eps = 1e-1, 1e-2, 1e-3, 1e-4, 1e-5
(Bohr's lower bound for the sup itself: 1.58, 3.78, 6.07, 8.34, 9.57). The sup grows without bound as the
line is approached: the reflection argument has no bounded function to apply to.

T3 (HQ controls, q = 2). Least modulus of a zero / of a pole of m in u: HQ1 (eps = 1): 1.000 / 1.000;
HQ1 (eps = c_q + 2): 0.841 / 1.000; HQ2 (1e-2): 0.799 / 1.000; HQ3 and HQ4 (0.1, 0.2): 0.933 / 0.871. Partial
sums over k <= 50, 100, 200 of abs(c(q^k)) q^(-k/2) grow for m and for 1/m in all five members (smallest
growth: 1/m for HQ1 with eps = 1: 34, 67, 134).

T4. E_a, a = 1/4: abs(m(s) - m(1 - s)) = 0.4704 at s = 1/2 + 5i with abs m(s) = 0.738.

Server: not used. The assignment's first test is a paper test; no numerical statement here decides anything
that a larger scale would change (the proofs are complete without the numbers).

## 6. Filter: device rows that rejected a control only through local Euler shape

"Survives" asks: can a control with zeta's functional equation and with infinitely many modified primes pass
the local-shape step of the row? Regime 1 = summable class; regime 2 = (K); regime 3 = sigma_rel > 1/2.
The local shapes below all make n_p analytic in abs y < p^(-1/2) (local factor zero-free in Re s > 1/2) except
row L6 and the Ramanujan-size variant of row 17 (a bound a(p^k) << p^(k delta) makes the local factor pole-free
in abs y < 1, and zero-free in abs y <= p^(-1/2) only for large p).

| Map row / c19 device row | Local-shape step | Control rejected there | Finite S | Regime 1 | Regime 2 | Regime 3 |
|---|---|---|---|---|---|---|
| X2 row 5; Q19, Q21 (Lee-Yang stage, stage polynomial stable) | local factor zero-free and pole-free in Re s > 1/2 | HQ2 | forced (Lemmas S, F) | forced: no twin (Theorem A, remark (b)) | no twin with an off-line zero (Theorem C (a)) | OPEN |
| X2 rows 13, 14; D8 eigenstates (Lemma E of c17-u6e); G40 Hecke eigen-relation at every prime (step type X2) | complete multiplicativity / degree-one factor | HQ2 | forced (Lemma C) | forced (Corollary A1) | as above | OPEN |
| X2 row 15; P46, P51 (Helson and twisted discrepancy classes) | unimodular completely multiplicative coefficients | HQ2 (class membership) | forced | forced | as above | OPEN; the class lives here (sigma_rel = 1 in general); row P46's relative theorem already gives "zeros right of sigma_0 are zeta's" without FE |
| X2 row 17; L1 (local temperedness, Ramanujan size, Selberg axiom theta < 1/2, tensor squeeze) | size of local parameters | HQ2, NR, DH, E_a | forced (Lemma S; referee E2 for a(q^j)) | forced (for the Ramanujan-size variant through remark (b), the pole-free side) | temperedness and Selberg axiom: as above; Ramanujan-size variant: Theorem C (a) applied to m gives no pole of G/zeta off the line, zeros of G/zeta off the line are not excluded | OPEN |
| X2 row 18; Z18 (7/8 architecture, local hypothesis abs eta(p) = 1) | unimodular local parameter | NR at q = 3, HQ2 | forced | forced | as above | OPEN |
| X2 row 20; section 3.8 in general; L4 (sign-change functionals of the local symbol), L5 (package M1 to M4) | local shape at one prime | NR, HQ2 | forced | forced | as above | OPEN |
| L2 (Euler at p as membership in a finite-dimensional FE-space) | shared local factor | DH-type twins | identification already | identification (Theorem A is the infinite-dimensional, summable analogue) | - | OPEN |
| X2 row 16; L6 (Edrei-Thoma local total positivity) | totally positive local sequence | HQ2 | not forced: HQ4 passes | Theorem A applies only if the negative roots stay outside abs y <= p^(-1/2) with summable deviation; otherwise no statement | no statement | OPEN |

Reading. (1) Every rejection of a functional-equation control through local shape on file was of a control
with one modified prime (HQ1 to HQ4, NR, the Z18 twin) or of a function outside the class (DH, E_a). For these
the rejection is forced, as recorded by c19. (2) With infinitely many modified primes the rejection survives
in regimes 1 and 2 in the sense that no control with zeta's functional equation, the local shape and an
off-line zero exists there; in regime 1 no control other than zeta exists at all. (3) In regime 3 nothing is
proved; any future twin with local Euler shape must have sigma_rel > 1/2, that is, it must modify a set of
primes with sum over p of abs(1 - a(p)) p^-sigma divergent for some sigma > 1/2. This is the pre-filter
statement of the lane. (4) In all regimes where the rejection is forced it is forced by boundedness of
zeta/G (or G/zeta) on the closed half-plane or by analyticity on the open one, which for these devices is a
consequence of the local shape plus sparseness. No row gains a mechanism that separates zeta from a control
by a step involving zeros. Controls without the functional equation (THIN, DEL, TW, U) pass the local-shape
step of every row; the filter does not concern them.

## 7. Requirement flags, with the evidence

- R1 (all primes together, multiplicativity essential): **false**. Theorem A and Lemma A0 hold for any
  Dirichlet series with the stated boundedness (remark (a)); multiplicativity only converts local bounds
  into the global bound. Theorem B reads the independence of the logs of primes, and only to show where the
  method stops.
- R2 (height-uniform, every window): **false**. No statement about windows; the conclusions are identities
  of functions.
- R3 (fails for every control at a structural step): **false**. No control meets the hypotheses (section 4),
  and the theorem is base-blind (holds over DH and over Beurling systems).
- R4 (finite stage or right of 1 to the line): **false**. The theorem works exactly when the relative Euler
  product converges up to the line (regime 1) or up to its open side (regime 2); the open case is the one
  where it does not (regime 3). For zeta itself the comparison function is 1 and nothing is passed to the
  line.

## 8. Three weakest steps

1. Theorem C (b), (c): the Phragmen-Lindelof step assumes N (or m) analytic in a strip around the line with
   admissible growth; "finite order" is used through the classical fact that a meromorphic function of
   finite order without poles is entire of finite order. Stated as a hypothesis, not derived from the
   Euler shape. The existence question in regime 2 is left OPEN and the natural-boundary expectation for the
   candidates abs alpha_p = p^(1/2) is ARGUED only.
2. The step from "G has zeta's functional equation" to (FE) on the line for the product N uses that G is
   meromorphic in a neighbourhood of the line and equals zeta/N on the right; if the functional equation is
   meant in a weaker sense (for example only as a distributional identity of boundary values) the argument
   needs the H-infinity form of the gluing lemma (CLASSICAL, not opened). The second form of the proof needs
   the limit interchange for Fourier-Bohr coefficients under uniform convergence (CLASSICAL).
3. Theorem B and the "iff" in verdict statement 5 rest on Bohr's inequality as recalled (sum over primes of
   abs c(p) <= sup norm for Dirichlet series bounded in a half-plane); the Kronecker product formula is
   proved here only in the region of uniform convergence and checked on one three-prime example to 1.4e-4
   relative. The filter table's "forced" entries for rows L4, L5, Z18 and X2 row 18 inherit the ARGUED
   status those rows have on file: the devices were not re-run, only their local-shape hypothesis was
   matched against Theorem A.

## 9. Files

`RESULT.md`, `REFEREE.md` (author's adversarial pass; independent referee owed), `MAP_ROW.md`, `lanes.jsonl`,
`checks.py`, `checks.json`, `checks.log`, `ref_check.py`, `ref_check.json`.
