# c15-control-with-zeta-fe-classes-u1-u2: controls that have zeta's own functional equation

Round 15, kind: combine. Sources: `campaign/CHECKPOINT_R14_DRAFT.md` (classes U1, U2, U3), Lemma F of
`push/c14-prefilter-sweep-geometric-nodes/RESULT.md`, Statement O version 3
(`push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md`, sections A1, A4, C), Lemma M of
`push/c13-fourier-interpolation-zero-nodes`, map rows NR, Z34, Z36, P53, G34.

Nothing in this file is a statement about zeros of zeta. It constructs functions other than zeta. No R4 mechanism.
The headline does not move. Labels: PROVED (elementary, in this file), CLASSICAL (cited as recalled),
RELATIVE (to a source opened by another lane), MEASURED (mpmath, 30 digits, this lane), ARGUED, OPEN.

**Correction note (2026-11-19, `c16-repair-owed-record-r15`).** The independent referee (REFEREE.md, E1) found that the pole clause of Lemma L ("no pole other than s = 1") had been dropped in three places: table row F2, section 3 consequence (a), section 6 U2 POS branch. The clause is restored in those three places, each marked in square brackets; the text as filed is in `push/c16-repair-owed-record-r15/before/c15-control/RESULT.md`. Counterexample of the referee without the clause: G_+ = zeta m_+ with double real poles at 1/2 +- b, zeta's functional equation, exact atoms, Lambda_G >= Lambda >= 0 and an off-line quartet. Lemma L as stated in section 3 is unchanged and correct. The referee's corrections E2 to E5 (reading condition of the headline, Selberg's theorem as the classical input, scope of Lemma D, wording) are recorded in the obstruction map (section 2, note "Controls ZQ, SG, NR-q and Lemma L") and are not edited into this file.

## 0. Outcome in five lines

1. A control exists. **ZQ** (zero-quartet multiplier): G = zeta(s) m(s), m a rational function of s(1-s) of
   degree 0 that removes two consecutive on-line zero pairs and puts a quartet at 1/2 +- eta +- i gbar. It has
   zeta's functional equation exactly (conductor 1, zeta's gamma factor), the same pole, order and real axis
   symmetry, and every atom of its logarithm is zeta's: local factor (1 - p^-s)^-1 at every prime. Its only
   defect is an absolutely continuous signed density D(x) added to Lambda, with the closed form
   D(x) = -4 x^(-1/2) cos(gbar log x) (cosh(eta log x) - cos(d log x)), d the half gap of the removed pair, and
   sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2 (PROVED). On the pair 6709, 6710 (near 7005) with
   eta = 0.01: sup abs D = 1.97e-3, abs(m - 1) <= 2.1e-4 on Re s = 2 (MEASURED).
2. The infimum of the defect over the family is 0 and is not attained (PROVED given that gaps between zeta
   zeros tend to 0 on a subsequence, CLASSICAL); zeta is the member at defect 0 only.
3. What cannot be kept. INT (frequencies log n only): Hamburger, RELATIVE to the text opened in Statement O.
   POS in the form Lambda_G >= Lambda: **Lemma L** (PROVED here, given Landau's theorem for Laplace-Stieltjes
   transforms of positive measures): then G = c zeta. Discrete multipliers: **Lemma D** (PROVED): the
   off-integer coefficients have l1 mass at least 1 times the integer one, so no discrete control is close to
   zeta; the small-defect controls are the continuous ones.
4. Consequence for the checkpoint. U1 {FE, GEOM} and the SIZE branch of U2 {FE, SIZE} are not control-free:
   ZQ lies in both read classes when GEOM, SIZE and EP are read on the prime-power atoms, and it has zeros at
   any prescribed 1/2 + eta, 0 < eta < 1/2 (mode (Z) of Statement O, A4). A device in U1 or U2 escapes ZQ only by
   reading (a) that the coefficient measure has no mass off log N (then its read set contains {FE, INT}, class
   U3), or (b) the sign of Lambda against a signed density of sup size O(eta^2 + d^2) (then, with exact atoms,
   it is inside the identification class of Lemma L). So R3 for U1 and U2 is tested by ZQ plus the
   relaxation-family test of section 6, not by the old control table.
5. The sentence "no control on file has zeta's own functional equation" needs one correction: T-NR in its
   symmetric normalisation zeta(s)(q^(s-1/2) + c + q^(1/2-s)) has it (map row NR says so); it is a generalised
   Dirichlet series with frequencies log(n/q), log n, log(nq). What is true: no control on file has that
   functional equation together with unimodular parameters at every prime. ZQ does.

## 1. Plan

What is new against the atlas and the walls: no attack; a control and three lemmas about the class of functions
with zeta's functional equation. Davenport-Heilbronn, E_a and the others have a different gamma factor or
conductor, so the checkpoint recorded that R3 "cannot be tested" in U1, U2. The plan: (1) describe the family
of all functions with exactly zeta's functional equation; (2) for each subfamily say which of EP, GEOM, POS,
SIZE, SUPP, INT it keeps and with what defect; (3) decisive test: one explicit member with off-line zeros and a
proved, small GEOM defect, checked numerically; (4) run it on paper against rows Z34, Z36, P53 and the U1 item
list; (5) controls on the lane itself.

## 2. The family (first lemma)

gam(s) = pi^(-s/2) Gamma(s/2). "Zeta's functional equation" for a meromorphic G: G(s) gam(s) = G(1-s) gam(1-s).

**Lemma A (PROVED, one line).** G has zeta's functional equation if and only if G = zeta m with m meromorphic
and m(s) = m(1-s). So the family is the set of symmetric multipliers of Lemma M (row G34); the only question
is which m keep which inputs. Equivalent reading: (zeta, gam m) is zeta with a changed gamma factor; (zeta m,
gam) is a changed function with zeta's gamma factor. The completed function xi m is the same in both. A device
that reads only the completed function cannot tell the two readings apart.

Inputs are read as in Statement O, A1, with one extension that A1 already allows for HEAT and Beurling
systems: the coefficient object is a measure on [1, inf). Write -G'/G(s) = integral x^-s dLambda_G(x) and
Lambda_G = Lambda + D, where -m'/m(s) = integral x^-s dD(x) when that representation exists in a half-plane.
"Atoms" are the point masses at prime powers.

| subfamily | m | FE (zeta's) | EP / GEOM on atoms | SIZE | POS | SUPP / INT | off-line zeros | status |
|---|---|---|---|---|---|---|---|---|
| F0 constants | c | exact | exact | exact | exact | exact | none known | zeta |
| F1 rational, degree 0 (**ZQ**, SG) | product of (z - w_j)/(z - z_j), z = s(1-s), z_j at zeros of zeta | exact | exact at every prime: all atoms are zeta's | atoms exact; density abs D <= 4 x^(-1/2) + 4 x^(beta-1), and <= 8e^-2 (eta^2+d^2)/(1/2-eta)^2 for ZQ | fails: D signed (ZQ) or D <= 0 (SG); forced by Lemma L | fail: D is absolutely continuous, mass exponent beta | prescribed quartet (ZQ) or real pair (SG) | PROVED, MEASURED |
| F2 rational with other poles | (z - w)/(z - v), v not at a zero of zeta | exact | exact on atoms | as F1 | fails [correction 2026-11-19, `c16-repair-owed-record-r15`, after REFEREE.md E1: POS can hold (D >= 0) at the price of real poles in (0, 1)] | fail | yes | G has extra poles: fails "pole at 1 only"; weaker than F1 |
| F3 symmetric Dirichlet polynomial at a rational prime (T-NR, on file) | q^(s-1/2) + c + q^(1/2-s), q prime | exact | fails at q: parameters of modulus q^(+-b) | fails at q | fails at q | INT fails (frequencies log(n/q)); SUPP holds on the group generated by primes | Re s = 1/2 +- b, b = arccosh(abs c/2)/log q | on file (row NR) |
| F4 same at a base q with no rational power (**NR-q**) | same m, q = 1 + sqrt 2 | exact | exact at every rational prime (integer-frequency part is c zeta; Hecke relation at every rational prime holds on each coset q^j N); one extra generalised prime q with non-unimodular parameter | fails at q only | fails at q only | fail (frequencies log n + j log q) | Re s = 1/2 +- b | PROVED, MEASURED |
| F5 entire zero-free (heat type) | exp(h), h(s) = h(1-s), for example exp(eps (s-1/2)^2) | exact | atoms exact | no Laplace-Stieltjes representation on [1, inf) (m unbounded to the right) | n/a | n/a | none (zeros are zeta's) | not a control; listed for completeness |
| F6 self-dual periodic combinations (**DH5e**) | [5^(s/2) L(s, chi_5) + t (5^(s/2) + 5^((1-s)/2)) zeta(s)]/zeta(s) | exact | none (no Euler product for t != 0) | no | no | frequencies log(n/sqrt 5), log(n sqrt 5) | yes: 0.7796 + 61.1685i, 0.6418 + 75.3995i at t = 1 (MEASURED) | weaker than F1, F4 |
| F7 products renormalised to conductor 1 | zeta(s+a) zeta(s-a) gam(s+a) gam(s-a)/gam(s) and the like | exact (formally) | none | none: the gamma quotient grows like Gamma(s/2) to the right, so no representation with support in [1, inf) | no | no | yes | not in the target class K of A1; no control |

Notes on the table.
- F6. 5^(s/2) L(s, chi_5) (chi_5 the real even character mod 5) has zeta's functional equation exactly
  (MEASURED defect 1.9e-30; CLASSICAL: the Gauss sum is sqrt 5 and the conductor is absorbed in the frequency
  scale). So does (5^(s/2) + 5^((1-s)/2)) zeta(s). Their combinations are the Davenport-Heilbronn construction
  moved to zeta's gamma factor. Each term separately is in the family with its zeros where zeta's or
  L(s, chi_5)'s are; only the combination has zeros off the line, and it has no Euler product. The same holds
  for every real even primitive character. More generally Hecke's theory for the groups G(lambda), lambda > 2,
  gives infinitely many independent solutions of this functional equation with frequencies sqrt(n) times a
  constant (CLASSICAL, cited as recalled, not opened; not used below).
- F7. This answers "zeta(s) zeta-type products renormalised to conductor 1, if any": none inside the class
  where SIZE or EP can be stated. ARGUED for the displayed example by growth: an absolutely convergent
  Laplace-Stieltjes transform of a measure on [1, inf) is bounded in a right half-plane, while the gamma
  quotient grows like Gamma(s/2) along the real axis.

## 3. What cannot be kept

**Hamburger (RELATIVE to Statement O line 9 and section C, where Hamburger 1921 Satz 1 with hypothesis d' is
recorded as opened).** INT with zeta's functional equation, finite order, finitely many poles, absolute
convergence right of 1: G = c zeta. So every control in the family fails INT. **Kaczorowski-Perelli 1999,
Theorems 2, 3 (RELATIVE to the same passage):** in degree one with integer frequencies the coefficients are
periodic up to a twist n^(i theta), and with the Euler-product axiom the function is zeta or L(s + i theta, chi);
at conductor 1 this is zeta. Both theorems need INT; neither says anything about F1 to F6, whose frequencies
leave log N.

**Lemma L (rigidity of one-sided positivity; PROVED, given Landau's theorem, CLASSICAL: for a positive measure
the real point of the abscissa of convergence of its Laplace-Stieltjes transform is a singularity).**
Let G = zeta m have zeta's functional equation, be meromorphic in C with at most a simple pole at s = 1 and no
other pole, and suppose -m'/m(s) = integral over [1, inf) of x^-s dD(x) in some half-plane with D a
non-negative measure (that is, Lambda_G >= Lambda). Then m is constant and G = c zeta.

Proof. m = G/zeta is meromorphic. Real singularities of m'/m are real zeros or real poles of m. A real pole of
m is a real zero of zeta that G lacks, so it is a trivial zero -2n; then G(-2n) != 0, the completed function
G gam has a pole at -2n, by the functional equation one at 1 + 2n, and G has a pole at 1 + 2n: excluded. (A pole
of m at 1 would give G a double pole.) A real zero of m of order k at sigma_0 gives -m'/m(sigma) -> -inf as
sigma decreases to sigma_0, while the transform of a non-negative measure is >= 0 on the real axis right of
its abscissa. By Landau the abscissa sigma_c, if finite, is a real singularity of m'/m, hence a real zero of m
with everything to its right regular, which contradicts the sign. So sigma_c = -inf, m'/m is entire, m has no
zero and no pole, and f(sigma) = -m'/m(sigma) >= 0 for every real sigma. Symmetry m(s) = m(1-s) gives
f(sigma) = -f(1 - sigma), so f = 0 on the real axis, D = 0, m constant. QED.

Consequences. (a) No member of the family with exact atoms [correction 2026-11-19, `c16-repair-owed-record-r15`, after REFEREE.md E1: and with no pole other than s = 1] keeps POS: with exact atoms POS is D >= 0. For ZQ
the negative part of D is forced, and it is small (section 4). (b) {FE, pole at 1 only, Lambda_G >= Lambda} is
an identification class in the sense of U3, alongside {FE, INT}. (c) The opposite sign is allowed: SG below has
D <= 0. Landau then forces the rightmost new singularity to be a real zero, which is what SG has.
(d) Not covered: Lambda_G >= 0 without Lambda_G >= Lambda (negative atoms at prime powers bounded by Lambda(n),
compensated elsewhere). No member of that kind was constructed and none was excluded: OPEN.

**Lemma D (discrete multipliers are far from 1; PROVED).** Let m(s) = 1 + sum_j c_j (l_j^(s-1/2) + l_j^(1/2-s)),
l_j > 1, with sum abs(c_j) (l_j^(1/2) + l_j^(-1/2)) finite. If m has a zero with abs(Re s - 1/2) <= 1/2 then
sum_j abs(c_j) (l_j^(1/2) + l_j^(-1/2)) >= 1. Proof: abs m(s) >= 1 - sum abs(c_j)(l_j^u + l_j^-u) with
u = abs(Re s - 1/2) <= 1/2, and u -> l^u + l^-u increases. Reading: in G = zeta m the coefficients at the
frequencies log(n l_j^(+-1)) are c_j l_j^(+-1/2) times those of zeta, so their total against the coefficient 1
of zeta at each n is at least 1. T-NR and NR-q have this ratio (q^(1/2) + q^(-1/2))/c, which is 1.046 for
q = 1 + sqrt 2, c = 2.1 (MEASURED) and exceeds 1 exactly when the zeros are inside the strip.

**Forced exponent (PROVED).** If G = zeta m has a zero rho' = beta + i gamma that zeta lacks, then
integral x^-sigma abs(dD) diverges for sigma < beta (the transform has a pole at rho'). The defect measure has
mass exponent at least beta > 1/2 in every representation. ZQ attains it: abs D(x) <= 8 x^(beta - 1).

## 4. Decisive first test: the control ZQ

Definition. Let g1 < g2 be ordinates of two simple zeros of zeta on the line (consecutive, for the smallest
defect), gbar = (g1 + g2)/2, d = (g2 - g1)/2, 0 < eta < 1/2, and t^2 = -(s - 1/2)^2 = s(1-s) - 1/4.

    m(s) = [ (t^2 + gbar^2 + eta^2)^2 - 4 gbar^2 t^2 ] / [ (t^2 - g1^2)(t^2 - g2^2) ]
         = 1 + (eta^2 + d^2) (2 t^2 + 2 gbar^2 + eta^2 - d^2) / [ (t^2 - g1^2)(t^2 - g2^2) ],
    ZQ(s) = zeta(s) m(s).

Properties (PROVED by inspection unless marked).
- m is a rational function of s(1-s), real on the real axis, m -> 1 at infinity. So ZQ has zeta's functional
  equation exactly, the simple pole at 1 (m(1) finite, non-zero), order 1, the real axis symmetry, the trivial
  zeros, and N(T) for ZQ equals N(T) for zeta for T > g2.
- Zeros: zeta's zeros with +-g1, +-g2 removed (the poles of m cancel them) and the quartet
  1/2 +- eta +- i gbar added (numerator = ((t - gbar)^2 + eta^2)((t + gbar)^2 + eta^2)).
- Logarithm: -m'/m(s) = sum over removed rho of 1/(s - rho) - sum over added rho' of 1/(s - rho')
  = integral from 1 to inf of x^-s D(x) dx for Re s > 1/2 + eta, with
  D(x) = -4 x^(-1/2) cos(gbar log x) [cosh(eta log x) - cos(d log x)].
  So Lambda_ZQ = Lambda + D(x) dx: every atom is zeta's, at every prime power; the local factor at every prime
  is (1 - p^-s)^-1; in particular ZQ restricted to its atoms is completely multiplicative with parameter 1 at
  every prime. EP, GEOM and SIZE hold exactly on the atoms.
- Size of the defect: with L = log x, cosh(eta L) - cos(d L) <= (eta^2 + d^2) L^2 cosh(eta L)/2 and
  L^2 e^(-L(1/2 - eta)) <= 4 e^-2/(1/2 - eta)^2, so
  **sup over x of abs D(x) <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2**, and also abs D <= 8 for all parameters;
  for sigma > 1/2 + eta, integral x^-sigma abs D dx <= 4 (eta^2 + d^2)/(sigma - 1/2 - eta)^3.
- Coefficients of 1/ZQ: 1/m = 1 + sum over the quartet of R_j/(s - rho'_j), so
  1/ZQ(s) = sum mu(n) n^-s + integral x^-s E(x) dx with E(x) = sum_j R_j sum_{n <= x} mu(n) n^-1 (x/n)^(rho'_j - 1),
  abs E(x) <= C_E (1 + 1/(1 - beta)), C_E = sum abs R_j, beta = 1/2 + eta. Atoms mu(n) exactly; bounded density.
- Not kept: INT and SUPP (the density D), POS (D changes sign; forced by Lemma L). Nothing else.

Numbers (MEASURED; `checks.py`, `checks.json`, 30 digits; re-derived by other routes in `ref_check.py`).

| instance | d | eta | FE defect | abs ZQ at the quartet point | winding there / at mirror / at removed g1, g2 | sup abs D (grid, log x <= 60) | proved bound | sup abs(m - 1) on Re s = 2 | C_E |
|---|---|---|---|---|---|---|---|---|---|
| zeros 1, 2 (14.1347, 21.0220) | 3.4437 | 0.30 | 1.8e-30 | 1.4e-29 | 1 / 1 / 0, 0 | 5.20 | 8 (the quadratic bound is 323, not sharp here) | 1.16 | 78.9 |
| zeros 1, 2 | 3.4437 | 0.05 | 1.9e-30 | 0 | 1 / 1 / 0, 0 | 5.11 | 8 | 1.16 | 470 |
| zeros 6709, 6710 (7005.0629, 7005.1006) | 0.018849 | 0.01 | 1.8e-30 | 9.8e-23 | 1 / 1 / 0, 0 | 1.971e-3 | 2.053e-3 | 2.0e-4 | 0.091 |
| zeros 6709, 6710 | 0.018849 | 0.25 | 1.8e-30 | 0 | 1 / 1 / 0, 0 | 0.2977 | 1.089 | 0.028 | 0.503 |

The grid does not resolve cos(gbar log x) (period 9e-4 in log x near 7005), so the grid column is a lower
estimate of sup abs D. The envelope 4 x^(-1/2)(cosh(eta log x) - cos(d log x)) is an upper bound for abs D and
its maxima are 5.2599, 5.1797, 1.97108e-3, 0.29782 for the four rows (step 1e-3 in log x), all below the
proved bound. Same-lane re-check by other routes: `ref_check.json` (rectangle counts near 7005: ZQ has 1 zero
in 0.55 < Re s < 1.5, zeta has 0; both have 2 in the rectangle across the line).

ZQ is not identically zero: ZQ(2) = 1.7767 (pair 1, 2) and 1.64493406688 (pair 6709, 6710) against
zeta(2) = 1.64493406685. The off-line zeros are simple (abs ZQ' = 0.10, 0.019, 0.216, 2.50). zeta itself has
winding 1 at 1/2 + i g1, ZQ has 0.

**Infimum 0, not attained (PROVED given CLASSICAL gap input).** m = 1 if and only if eta^2 + d^2 = 0. The
poles of m must sit on zeros of zeta, so d is half an actual gap (d = 0 only at a multiple zero), and eta > 0
is free. Consecutive ordinates below T have mean gap (2 pi + o(1))/log T, so d -> 0 along a sequence of pairs.
For fixed eta the bound tends to 8 e^-2 eta^2/(1/2 - eta)^2 along that sequence. To defeat an output abscissa
theta one needs eta > theta - 1/2, so the defect needed is at most
8 e^-2 ((theta - 1/2)^2 + d^2)/(1 - theta)^2 with d as small as wished: 0.068 for theta = 0.6, 0.0019 for
theta = 0.52, tending to 0 as theta -> 1/2. zeta is the limit and is in the family at defect 0 only.

Companion **SG** (real-zero twin): m = (t^2 + b^2)/(t^2 - g1^2), zeros of zeta at 1/2 +- i g1 replaced by the
real pair 1/2 +- b. D(x) = -2 x^(-1/2)(cosh(b log x) - cos(g1 log x)) <= 0 for all x (PROVED: cosh >= 1 >= cos).
So Lambda_SG <= Lambda with exact atoms, exact functional equation, and a real zero at any prescribed point
of (1/2, 1). MEASURED at b = 0.3: FE defect 1.9e-30, winding 1 at 0.8, D in [-3.587, -6.2e-6] on the grid.

Companion **NR-q** (F4): q = 1 + sqrt 2, c = 2.1: FE defect 1.9e-30; zero at 0.857311 + 3.564428i (winding 1);
the generalised series sum over n of q^(-1/2)(n/q)^-s + c n^-s + q^(1/2)(nq)^-s reproduces the product to
1.6e-30 at s = 3 (run with c = 2.2, where the zero is at Re s = 1.0033, outside the strip: c must be below
q^(1/2) + q^(-1/2) = 2.1974). Its integer-frequency part is c zeta exactly; the defect sits on one added
generalised prime q with parameter of modulus 2.129 per step against q^(1/2) = 1.554.

## 5. ZQ on paper against the three closed rows and the U1 item list

Convention for twists (a choice, ARGUED): chi acts on the atoms; the multiplier is kept. So
ZQ_chi(s) = L(s, chi) m(s), which has the functional equation of L(s, chi) because m is symmetric and real.
The same convention is the one the map uses for T-NR. **Limit of ZQ found here:** m has poles at
1/2 +- i g1, 1/2 +- i g2, which zeta cancels and L(s, chi) in general does not. So the twists of ZQ have up
to four poles on the critical line. ZQ is a control for single-object devices; for a device that reads
analyticity of the twists (or PER through entire twists) ZQ fails that input, and the control to use is NR-q,
whose multiplier is entire (its twists L(s, chi) m(s) are entire and keep their functional equations, as for
T-NR). No absolutely continuous member with entire twists under this convention exists: the poles of a
rational m of degree 0 with off-line zeros must be cancelled by every twist (PROVED: m entire rational and
bounded is constant).

- **Z34** (family-positivity form J_p with twist-modulus reciprocity). The row's steps: the one-line
  implication J_p > 0 => no zero; the s = 1 identities (Dedekind sums, Rademacher's law); the zero-one law
  sup_a J_p = 1 - #{chi: F(s, chi) = 0} for twist length >= p - 1. For ZQ: the implication is function
  independent; at s = 1 every twisted second moment is multiplied by the constant m(1)^2, so each reciprocity
  identity holds after scaling; the zero-one law is finite Fourier inversion and holds for any finite values
  F(s, chi). At a quartet point all p - 1 twists vanish together, so sup_a J_p = 1 - (p - 1) there. Away from
  the four pole points ZQ passes every step that zeta passes and the bound is false at its zeros; the twists
  are not entire, so as a member of the row's class (twists with their functional equations and no poles) ZQ
  is out and NR-q is in, with the same record as T-NR (multiplier a Dirichlet polynomial at the base q, twists
  prime to p unaffected since q is not an integer). The target's functional equation is not read (as the row
  says), so neither control adds information to this row. ARGUED at the level of the row's text; not
  recomputed.
- **Z36** (bilinear reciprocity at height t as a J-form). Entries R_chi(t) = const Z_chi(t) Z_chi(-t). For ZQ
  each entry is multiplied by m(1/2 + it)^2, which is real and positive for every real t other than +-g1,
  +-g2 (the numerator ((t - gbar)^2 + eta^2)((t + gbar)^2 + eta^2) has no real zero). At +-g1, +-g2 the zeta
  entry is finite (removed zero) and the other entries have a double pole of positive sign. So every sign,
  inertia and cone statement of the row is unchanged for t outside those four points, and the referee's sign
  rule (-1)^(number of zeros with ordinate in (-t, t)) is respected for the zeta entry: two on-line zeros are
  replaced by a pair with one ordinate. NR-q: every entry multiplied by a number in
  [(abs c - 2)^2, (abs c + 2)^2], as for T-NR. Both pass; PROVED given the row, with the pole caveat for ZQ.
- **P53** (de Branges shift positivity). The condition is on the completed function, implies a zero-free
  statement, and is false for zeta itself (zero 34 at h = 1; Re xi(s)/xi(s + 1) < 0 at 1 + 282i). ZQ fails one
  step earlier, at the zero-free conclusion, like DH, HEAT, E_a and T-NR in the row. The step never reads
  coefficients, so the row cannot use what distinguishes ZQ from T-NR. No new information; consistent.

U1 item list (checkpoint section 2, U1): a U1 device must show that its decisive step is not
- (i) an exact identity valid for the controls. ZQ: every identity that follows from the functional equation
  and the atoms holds for ZQ with one extra term carrying D (explicit formula: prime side Lambda + D; the
  approximate functional equation with an added integral). An identity "valid for zeta only" must therefore
  use D = 0, that is INT.
- (ii) an identification. {FE, INT} is Hamburger's class. ZQ shows that dropping "no mass off log N" and keeping
  everything else on the atoms leaves a class with off-line zeros at every 1/2 + eta. So the identification is
  carried by exactly that clause. Lemma L adds a second identification class: {FE, pole, Lambda_G >= Lambda}.
- (iii) stable under Blaschke factors on a scattering coefficient. For a coefficient M built as
  xi(2z - 1)/xi(2z), ZQ multiplies M by r(z) = m(2z - 1)/m(2z), which has modulus 1 on Re z = 1/2 (m real and
  symmetric), removes the four zeros of M at (1 + rho)/2, rho in {1/2 +- i g1, 1/2 +- i g2}, and adds four
  zeros at (1 + rho')/2; its poles lie in Re z < 1/2. PROVED. So on that carrier ZQ is a member of BLS with four
  Blaschke factors exchanged (division by the Blaschke factor of an existing zero and multiplication by a new
  one both keep Schur, Pick and bounded-analytic conditions: Lemma B of the c14 lane). Question Q-B of Lemma F
  answers ZQ as well.
- (iv) linear in the target or a division by it. ZQ is a symmetric multiplier with m and 1/m bounded away from
  eight points and m -> 1 at infinity, so every class stable under bounded rational multipliers is stable under
  it (a larger set of classes than for T-NR, whose multiplier oscillates between abs(c) - 2 and abs(c) + 2).
  Question Q-S of Lemma F answers ZQ as well.

Addition to Lemma F (PROVED as an instance of the lemma; hypothesis (i) must be checked per step):
**(Q-A)** T = {F -> F m, m of type ZQ}. Stable step types: S1 (linear classes stable under multiplication by a
rational function of s(1-s) tending to 1); every condition stated on the atoms (EP, GEOM, SIZE, complete
multiplicativity, Hecke relations at rational primes, abs mu(n) <= 1 at integers); the functional equation;
N(T) for T > g2; any condition in a window of heights away from gbar that is continuous in m - 1 in the sup
norm on the lines it reads (abs(m - 1) = O((eta^2 + d^2)/abs(t - gbar)^2) away from gbar). Not stable: INT,
POS, and anything that reads Lambda as a measure on all of [1, inf).

## 6. What this does to U1, U2 and the test of R3

**Statement (PROVED from sections 3, 4).** Let R be a read set whose inputs are among: FE (zeta's own, all
heights), EP, GEOM and SIZE read on prime-power atoms, the pole at 1, finite order, real coefficients, the
zero count N(T). Analyticity of twists is not among them (section 5). Then ZQ lies in K(R) for every admissible (g1, g2, eta) and has zeros at 1/2 + eta + i gbar.
A device reading only R outputs nothing below 1 (mode (Z); eta may be any number in (0, 1/2)).

So:
- U1 {FE, GEOM}: has a control. A U1 device is defeated by ZQ unless its decisive step also reads INT
  (no coefficient mass off log N). With INT the read set contains {FE, INT} and the device is in U3.
- U2, SIZE branch (abs mu(n) <= 1, size of log F, with FE): has the same control; the coefficients of 1/ZQ are
  mu(n) on the integers plus a bounded density.
- U2, POS branch (Lambda >= 0 with FE): no member of the family with exact atoms [correction 2026-11-19, `c16-repair-owed-record-r15`, after REFEREE.md E1: and with no pole other than s = 1] keeps POS (Lemma L); the
  class is an identification class and belongs with U3. The general case Lambda_G >= 0 is OPEN (no control, no
  exclusion).

**Relaxation-family test (replaces the control table in the two identification cells).** A device whose read
set contains {FE, INT} or {FE, POS} must be run on the two-parameter family ZQ(pair, eta), on SG(b), and on
NR-q, and must name the step that fails, with the size it needs:
- T1 (INT relaxed continuously): the step must fail when Lambda is replaced by Lambda + D with D absolutely
  continuous, sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2 and integral x^-sigma abs D <= 4 (eta^2 + d^2)/(sigma - 1/2 - eta)^3.
  A step that is continuous in the coefficient measure in either norm does not separate zeta from ZQ, because
  the defect tends to 0 with (eta, d) while the functional equation stays exact.
- T2 (POS relaxed one-sidedly): the step must fail for SG, where Lambda_G <= Lambda, the atoms are exact and
  the defect is -2 x^(-1/2)(cosh(b log x) - cos(g1 log x)). A step using only an upper bound for Lambda, or
  positivity of the atoms, passes SG.
- T3 (INT relaxed discretely, GEOM kept at rational primes): the step must fail for NR-q. A step that reads
  the coefficients at integers only, or Hecke relations at rational primes only, passes NR-q.
- T4 (existing): E_a, T-NR, WT, DEL, THIN, each relaxing one other input.
The test is passed only if each failure is at a named step and for a structural reason; "the device is
stated for ordinary Dirichlet series" is not a reason unless that step is shown to use it.

Limits. T1 to T3 are necessary conditions. Passing them does not make a device valid. The family does not
contain a member with Lambda_G >= 0, so a device that uses positivity of Lambda at full strength in the same
step as the functional equation is still tested only through T2 and Lemma L.

## 7. Controls on the lane itself

- zeta in the family at defect 0 only: m = 1 iff eta^2 + d^2 = 0 (closed form). With eta = 0 and the pair
  1, 2 the function has a double zero on the line at 1/2 + i gbar (winding 2, MEASURED), coefficient
  d^2 = 11.86, sup abs(m - 1) on Re s = 2 equal to 1.155: not zeta.
- Hamburger: every member F1 to F6 with m non-constant fails INT (F1: m - 1 is a non-zero rational function
  tending to 0, not an ordinary Dirichlet series; F3, F4, F6: frequencies outside log N). Consistent.
- Lemma L against the members: ZQ has D of both signs (grid min -1.971e-3, max +1.966e-3 on the pair near
  7005); SG has D <= 0 and its rightmost new singularity is the real zero, as Landau requires; reversing the
  sign of SG's density gives a function with a real pole at 1/2 + b (checked), which the lemma excludes; HEAT
  has no representation on [1, inf). No member contradicts the lemma.
- Lemma D against the members: T-NR and NR-q have ratio (q^(1/2) + q^(-1/2))/abs c > 1 exactly when the zero
  is inside the strip (1.046 at q = 1 + sqrt 2, c = 2.1; 0.9988 at c = 2.2, zero at Re s = 1.0033).
- Standard battery: not applicable in the usual sense (the lane has no device). DH, E_a, backward heat, sign
  twists, unimodular twists, Beurling systems, theta^w and the phase-rotated transfer operator are not in the
  family (different gamma factor, conductor, or no functional equation); WT has zeta's functional equation in
  one window only. T-NR is in the family (F3).

## 8. Verdict

Precise obstruction, as a map row and a control: **the classes U1 and U2 (SIZE branch) admit a control with
zeta's own functional equation, exact Euler factors at every prime and an arbitrarily small absolutely
continuous defect (ZQ); the class {FE, Lambda_G >= Lambda} is an identification class (Lemma L).** The
statement "R3 cannot be tested in U1, U2" is replaced by: R3 is tested by ZQ, SG, NR-q and the relaxation
test T1 to T4. Nothing about zeros of zeta; no R4 mechanism; headline unchanged.

Proposed map entries (not applied; this lane does not edit the map):
- Control row **ZQ** (section 2 of the map, next to NR): "zeta(s) m(s), m rational in s(1-s), degree 0, two
  on-line zero pairs exchanged for a quartet at 1/2 +- eta +- i gbar | keeps zeta's functional equation and
  gamma factor, pole, order, N(T), every prime-power atom of log zeta (EP, GEOM, SIZE on atoms) | lacks INT,
  SUPP (absolutely continuous density D, sup <= 8e^-2 (eta^2+d^2)/(1/2-eta)^2) and POS (forced, Lemma L) |
  kills anything that reads FE with atom-level multiplicative structure and not the absence of mass off
  log N". Companions SG (D <= 0, real zero) and NR-q (discrete, one added generalised prime).
- Note under Lemma F / Lemma P: question Q-A (section 5).
- Checkpoint U1, U2: per section 6; U3 gains the class of Lemma L.
- Engine: `engine_control_proposal.json` in this directory (control nodes `ctrl-zq-zero-quartet-multiplier`,
  `ctrl-sg-real-zero-twin`, `ctrl-nrq-noninteger-base`).

## 9. Requirement flags

- R1 (multiplicativity used essentially): **false**. No argument about zeta; the lane shows that atom-level
  multiplicativity with the functional equation is kept by a control.
- R2 (height-uniform, every window): **false**. No statement at height.
- R3 (every control fails at a named structural step): **false**. The lane builds controls; it has no device.
- R4 (reaches the critical line): **false**. Nothing crosses.

## 10. Three weakest steps

1. **Reading of GEOM, SIZE and EP "on the atoms".** ZQ is a control for U1 and U2 only if those inputs are read
   as statements about the prime-power atoms of the coefficient measure, with the target class of Statement O,
   A1, extended to measures with an absolutely continuous part (A1 already admits Mellin transforms of
   kernels for HEAT). If GEOM is read as "the function is an Euler product over primes and nothing else", it
   includes SUPP for the whole measure and ZQ fails it; then U1 contains INT implicitly and is inside U3. Either
   way U1 does not stand as a separate control-free class, but which of the two sentences applies to a given
   device is a reading, not a theorem.
2. **Lemma L covers Lambda_G >= Lambda only.** The general POS class (Lambda_G >= 0 with some atoms lowered) is
   open: neither a control nor an exclusion. The proof also uses Landau's theorem for measures as recalled
   (Widder's form), not opened, and assumes G meromorphic in the whole plane with no pole other than s = 1.
3. **Twists.** Under the convention ZQ_chi = L(s, chi) m(s) the twists of ZQ have poles on the critical line,
   so ZQ is a control for single-object devices only; for twist families the control with zeta's functional
   equation is NR-q (or T-NR), whose defect is of size 1 at one generalised prime (Lemma D). A U1 device that
   reads the target's functional equation together with entire twists is therefore tested by NR-q and T-NR,
   not by a small-defect control. Also: no independent referee, and the paper runs are at the level of the rows' texts.** The Z34, Z36, P53 runs
   and the twist convention ZQ_chi = L(s, chi) m(s) were not recomputed; `ref_check.py` is a same-lane re-check
   by other routes, not an independent pass. The "infimum 0" statement uses the classical fact that zero gaps
   tend to 0 along a subsequence; the measured instance is one pair (zeros 6709, 6710), 30-digit floating point
   with winding numbers on circles, not interval arithmetic. Hecke's G(lambda) remark and the reading of
   Hamburger and Kaczorowski-Perelli are relative to sources this lane did not open.

## Files

`checks.py`, `checks.json`, `checks.log` (main numerics; 127 s local under `scripts/memcap.sh 8`; `checks.json`
here is extracted from the log: the first run wrote its JSON to the working directory, the repository root,
where an untracked `checks.json` of unknown origin was listed at session start; that root file is no longer
present and its earlier content may have been overwritten by this run; the script now writes next to itself);
`checks2.py`, `checks2.json`, `checks2.log` (NR-q inside the strip, DH5e zeros); `ref_check.py`,
`ref_check.json`, `ref_check.log` (same-lane re-check); `REFEREE.md` (same-lane pass, five corrections applied;
an independent referee is owed: this session could not start one, so the lanes line records referees = 0); `engine_control_proposal.json`;
`lanes_line.json`. No server job was needed.
