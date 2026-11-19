# c14-joint-pair-design-ratio-vortex-cross-bridge: RESULT

Round 14, kind explore (device design, stage A; one small stage-B check). Date 2026-11-19.
Local only: one python run through `scripts/memcap.sh 8` (`.venv-arb/bin/python`, python-flint balls at
100 bits read as float64; 28 s; largest array 2.3 MB). The server was not used. Nothing committed or pushed.
Nothing here is a statement about zeros of zeta. Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (argument given here, elementary) / PROVED-rel (relative to a named classical theorem that
was recalled and not opened) / CLASSICAL / MEASURED (float64 winding numbers from 100-bit ball values; not
an interval certificate) / ARGUED / OPEN.

## Verdict

**Precise obstruction for all three candidates; one conditional reduction worth keeping (Lemma A).**

1. **J1 (ratio Q_chi = L(s,chi)/zeta(s)).** Every winding, Jensen or Littlewood quantity of Q_chi is the
   signed difference of the two scalar quantities (first lemma, PROVED). A fixed finite set of ratios is
   passed exactly by T-NR at a split prime (Lemma C, PROVED): the feature "unchanged by a common multiplier"
   is the reason. With the whole family of moduli the device is a two-link chain,
   `(COMP) comparison in every window` + `zero density in the conductor aspect` => no zero of zeta right of
   the line (Lemma A, PROVED-rel). The second link is a theorem. The first link has no proof step, holds for
   every control whose off-line zeros are twist-covariant (T-NR, E_a: exact), fails for DEL and THIN, and on
   all but q^(theta+eps) members of the family it is the scalar statement "zeta has no zero in the window"
   (Lemma B, PROVED-rel). Each control fails exactly one link, but no inequality is proved, so no flag.
2. **J2 (cross bridge form from Hankel blocks of S_zeta, S_chi).** Block forms quantified over pairs contain
   the scalar zeta form on the slice (f, 0): closed by row Q28. The cross Gram
   X = Gamma_-(S_zeta)^* Gamma_-(S_chi) has rank min(rank, rank) for finite disjoint pole sets (PROVED): it
   vanishes iff one member is causal. Every step holds for an arbitrary pair of unitary symbols; the twist
   relation between the two members is not expressible at the level of S. BLS passes every step.
3. **J3 (own choice: twist-transfer form; consumes complete multiplicativity and unimodularity of chi with
   both functional equations in one step).** For tests g_c = sum c_m phi(r - log m), bump narrower than
   log(1 + 1/M), the prime sides of the Weil forms satisfy P_chi(g_c) = P_zeta(g_(c chi)) exactly (identity
   TW, PROVED). Hence W_chi(g_c) - W_zeta(g_(c chi)) is an archimedean quadratic form with leading term
   (log q) ||phi||^2 ||c||^2. The identity uses multiplicativity of the twisting character only; it holds
   for every Dirichlet series F whose twist has a functional equation. DH, T-NR and E_a pass every step.

Pivot (the one allowed): from "inequality on the ratio" to the conductor-aspect chain of Lemma A. Outcome
above. No second pivot.

## 0. Plan; what is new against the record; answers before work

- On file: bridge square and Krein index (`g-spinor-square-root`), bridge/antibridge block form
  (`g-antibridge-cancel`), family sums of bridge forms with positive weights (row Q25), the commutative
  matrix carrier (row Q28: direct sum over chi; open requirement "an inequality that reads PERM with FE"),
  Lemma P and exclusions X1 to X5 (`c13-tnr-invariance-prefilter-noncone-census`), BLS (round-13 lesson 1),
  Littlewood window functional as an identity (row Q27).
- Not on file: the ratio as a device; Lemma C (common-multiplier blindness as a control statement); Lemma A
  (comparison plus conductor-aspect density); the twist-transfer identity TW; the cross Gram rank.
- Q1 (controls): sections 2.4, 3.3, 4.3 and the table of section 5. Q2 (height): COMP is an every-window
  statement but is not proved; TW holds at every height. Q3 (multiplicativity): in J1 it enters in the density
  link (bounded coefficients of 1/L, type X1) and in the twist relation; in J3 only through chi. R4: Lemma A
  is a crossing conditional on COMP; nothing unconditional.

## 1. Pre-filter (three questions), all candidates

| candidate | Q-P (Lemma P: only S1-S3 steps?) | Q-B (survives a Blaschke factor?) | Q-S (target linear or by division?) |
|---|---|---|---|
| J1, fixed finite set of chi | yes for the ratio itself: a multiplier common to both members cancels; T-NR at p0 = 1 mod q passes exactly (Lemma C) | yes for a common factor | by division; a symmetric multiplier common to both members is invisible |
| J1, all moduli (chain of Lemma A) | no: the density link reads coefficients of 1/L (X1) | no at the density link | division in link 1, X1 in link 2 |
| J2 | every step is an identity for unitary symbols (S1) | yes: BLS passes | S is a Moebius transform of F'/F; no step reads the twist relation |
| J3 | identity TW (S1) plus an archimedean inequality (no step at p0) | not applicable (explicit formula of the pair) | linear in F'/F; the difference removes the prime side |

## 2. J1: the ratio

### 2.1 Structure (PROVED; checks C1, C2 in `checks.json`)

chi primitive mod q, Q_chi = L(s, chi)/zeta(s) = sum (chi * mu)(n) n^-s = prod_p (1 - p^-s)/(1 - chi(p) p^-s).

- Log level: Lambda_Q(n) = Lambda(n)(chi(n) - 1), so Re Lambda_Q <= 0 (type X1 input, with a sign).
- Local factor. For abs(omega) = 1, omega = e^(i theta) != 1, the map z -> (1 - z)/(1 - omega z) sends the unit
  disc onto the open half-plane bounded by the line e^(-i theta/2) R that contains 1 (boundary values
  e^(-i theta/2) sin(phi/2)/sin((theta + phi)/2) at z = e^(i phi)). The pole lies on the unit circle exactly
  because abs(chi(p)) = 1. For chi real, Q_chi = prod_{p | q} (1 - p^-s) prod_{chi(p) = -1} tanh(s log p / 2):
  a product of lossless positive-real factors, one per inert prime (check C2: defect 8.8e-11 at s = 3 + 2i,
  primes to 20000; this is the stub chain of `g-passive-cascade` restricted to inert primes).
- Functional equation. For chi even the gamma factors cancel: Q_chi(s) = eps(chi) q^(1/2 - s) Q_chibar(1 - s)
  (check C1, chi the real character mod 5: defect <= 7.3e-17 at three points). The ratio has degree 0 and
  conductor q; eps^(-1/2) q^(it/2) Q_chi(1/2 + it) is real. For chi odd the factor Gamma((s+1)/2)/Gamma(s/2)
  remains.
- Charges. Zeros of L are +1, zeros of zeta are -1; the net charge per unit height is (log q)/(2 pi), carried
  by the kink of the window mean of log abs(q^(s/2) Q) at Re s = 1/2.

### 2.2 First lemma: decomposition (PROVED)

log Q = log L - log zeta, so for every rectangle B the winding number of Q on the boundary is
N_L(B) - N_zeta(B), and the Littlewood functional of Q on [sigma_0, 2] x [T, T+H] is the difference of the
Littlewood functionals of the members (each an identity for any zero configuration, row Q27 (i)). The proximity
part of a Nevanlinna characteristic is not additive, but by the first fundamental theorem T(Q) = T(1/Q) + O(1),
so a one-sided bound on it bounds zeros plus poles and carries no sign between the members.
Consequence: a one-sided bound on a winding quantity of Q_chi is a **comparison** of the two scalar counts,

    (COMP)   N_zeta(sigma_0; W) <= N_chi(sigma_0; W')    for every window W = [T, T+H], W' = [T-H', T+H+H'],

N_F(sigma_0; W) = number of zeros with real part >= sigma_0 and ordinate in W. It is not a sum of two scalar
positivity statements (so it is not literally the direct sum of row Q28), and it does not contain the scalar
zeta statement on a slice by algebra. It contains it on the slice of members with no zero in W' (section 2.5).

### 2.3 Lemma C: common-multiplier blindness (PROVED)

Let m_w be a T-NR multiplier at the prime p0 (D form, F = zeta D, D a polynomial in p0^-s). The twist of F by
chi is L(s, chi) D_chi(s) with D_chi(s) = D(s - i arg chi(p0)/log p0) (the coefficient of p0^(-ks) is multiplied
by chi(p0)^k), and it satisfies the functional equation of L(s, chi) with conductor q p0^2. If chi(p0) = 1 then
D_chi = D and (F tensor chi)/F = Q_chi identically. For a finite set X of characters take p0 = 1 mod the lcm of
the conductors (Dirichlet) and 2 < c < p0^(1/2) + p0^(-1/2): the pair lift (zeta D, L(chi) D) has the same
ratios as (zeta, L(chi)) for every chi in X, and zeta D has zeros in the open strip off the line.
**Every functional of finitely many ratios, with any hypotheses and any conclusion, takes the same value on
zeta and on this control.** The device on a fixed finite set of characters is closed by T-NR. For
chi(p0) != 1 the zeros of D_chi are those of D translated in height by arg chi(p0)/log p0, with the same real
parts and the same spacing 2 pi/log p0.

### 2.4 Lemma N and Lemma A: the family of all moduli

**Lemma N (PROVED).** For Re s_0 > 0, s_0 != 1: (1/phi(q)) sum_{chi mod q} L(s_0, chi) = sum_{n = 1 mod q} n^-s_0
(continued) = 1 + q^-s_0 zeta(s_0, 1 + 1/q) -> 1 as q -> infinity. So for q > q_0(s_0) some non-principal
character mod q does not vanish at s_0: a zero of zeta is a pole of some Q_chi, and "no Q_chi has a pole off the
line" implies RH without a common-zero hypothesis. Check C3: abs(value - 1) = 0.241, 0.024, 0.0047, 0.00075 at
s_0 = 0.8085 + 85.699i for q = 11, 101, 1009, 10007.

**Lemma A (PROVED-rel Montgomery, Topics in Multiplicative Number Theory, Theorem 12.1, recalled, not opened:
sum_{chi mod q} N(sigma, T, chi) << (qT)^(theta(sigma)) (log qT)^9 with theta(sigma) = 3(1 - sigma)/(2 - sigma)
on [1/2, 4/5]; theta(sigma) < 1 for sigma > 1/2).** Let sigma_0 > 1/2 and W a window. Suppose there are
theta' > theta(sigma_0), H' < infinity and infinitely many q, each with a set X_q of at least q^theta'
characters mod q, such that N_zeta(sigma_0; W) <= N_chi(sigma_0; W') for every chi in X_q. Then zeta has no
zero with real part >= sigma_0 and ordinate in W.
Proof. Average over X_q: N_zeta(sigma_0; W) <= q^(-theta') sum_{chi mod q} N(sigma_0, T + H + H', chi)
<< q^(theta(sigma_0) - theta') (T + H + H')^theta (log qT)^9 -> 0 with W fixed, and the left side is an
integer. QED.

Reading. A sign statement in every window (comparison of charges of the ratio) composes with a size statement
in the conductor aspect (density over the family) and gives a statement about one function at one height:
the average over the family is an upper bound for an integer, so MV-CAP does not apply to the conclusion. This is
the only place in this lane where sign and size information compose (STRATEGY 4.0 (e)). The cost is that
COMP is implied by RH trivially, so Lemma A is an equivalence: RH iff every hypothetical off-line zero of zeta
is accompanied, for infinitely many q, by zeros of at least q^theta' twists in a bounded window.

### 2.5 Lemma B: what COMP says on most of the family (PROVED-rel the same theorem)

For fixed W' and sigma_0 > 1/2, all but O(q^(theta(sigma_0) + eps)) characters mod q have N_chi(sigma_0; W') = 0.
On those characters COMP reads N_zeta(sigma_0; W) <= 0: the scalar statement, with chi absent. So the pair
inequality restricted to a set of relative density one in the family is the scalar inequality; this is the
analogue for J1 of Lemma P of row Q28 (the slice on which the second member contributes nothing).
A mechanism that proves COMP must produce off-line zeros of twists from an off-line zero of zeta, and the
density theorem says that at most q^(theta + eps) twists can have them. The mechanisms on file that do
produce them are twist-covariant origins of the zero (a local factor: T-NR; a shift: E_a), which are the
controls. Heuristic for zeta (ARGUED): twisting rotates the phase of every prime by arg chi(p); a zero
that is not attached to one local factor is kept only if chi(p) is close to p^(-i a) on the primes that matter,
and for such chi the tail of the Euler product over p > P is square-summable for sigma > 1/2 with random
phases, so the typical head-matched twist is non-vanishing in the box. This is requirement R4 again: the tail
right of 1/2 is controlled on average over chi and not for the one member chi = 1.

### 2.6 Controls for the chain COMP + density (pair lifts F -> (F, F tensor chi))

| control | link 1: COMP | link 2: conductor-aspect density of the twist family | first failing step |
|---|---|---|---|
| T-NR, chi(p0) = 1 | holds with equality (Lemma C) | false: every twist has the zeros of D | density, at the bound on coefficients of 1/F at p0 (X1) |
| T-NR, chi(p0) != 1 | holds with H' = 2 pi/log p0 (translated zeros, same real part) | false | same |
| E_a | holds if N_chi(1/2; W') >= N_zeta(1/2; W) (true for q large rel. GRH-size bounds for S(t, chi); ARGUED) | false: all twists have zeros at 1/2 + a | density, at SIZE (coefficients n^a) |
| DH (twists by psi mod q, q = +-1 mod 5 keep the functional equation: eps ratio changes by chi^2(q)) | all-chi form false; q^theta' form not decided at the measured q (MEASURED, below) | false: positive rate of off-line zeros per box (MEASURED) | density, at the Euler product (no bounded 1/F) |
| DEL, THIN (set S regular in residue classes mod q) | false: F has its zero at b; F tensor chi = L(s, chi) exp(analytic) near b because sum_{p in S} chi(p) p^-s has no singularity at b (ARGUED; regular sets exist rel. a short-interval prime theorem in progressions, not opened; the ray-class analogue is `c5-thin-walk-replay` Theorem 2) | true (zeros of the twists are zeros of L) | COMP; they lack the functional equation |
| DEL, THIN (S inside the class 1 mod q) | holds: the factor is common (Lemma C form) | false | density |
| U (n^(-i a)), window translate | same as zeta (zeros translated) | true | none: not a function with known off-line zeros; not a handle |
| EIS-w | not formulable (no surface in the device) | | not a handle |
| interpolation twin | twist relation holds; no Euler product, no functional equation | not known | same class as DH; not run |
| backward heat | twist of a non-Dirichlet kernel not defined | | not formulable; not a handle |
| sign twist (Liouville) | F = zeta(2s)/zeta(s), F tensor chi = L(2s, chi^2)/L(s, chi): off-line zeros of both lie in Re s < 1/2 | not applicable right of 1/2 | not a handle for sigma_0 > 1/2 |

Stage-B check of the DH row (MEASURED, `checks.py` C4). f = ((1 - i kappa)/2) L(chi) + conj, chi mod 5 of order
4; twists by all psi mod q; zeros counted in box A = [0.6, 1.4] x [84.7, 86.7] (contains the off-line zero
0.8085 + 85.6993i of f) and in a control box B = [0.6, 1.4] x [94, 96]; step 0.01; psi principal excluded.

| q | A: twists with a zero | B: twists with a zero | zeros of the members L(chi psi), L(chibar psi) in A, B |
|---|---|---|---|
| 11 | 1 of 9 | 0 of 9 | 0 |
| 19 | 1 of 17 | 4 of 17 | 0 |
| 29 | 1 of 27 | 2 of 27 | 0 |
| 31 | 0 of 29 | 0 of 29 | 0 |
| 61 | 4 of 59 | 6 of 59 | 0 |

psi principal reproduces the zero of f in A (1) and none in B (0) at every q. Totals: A 7 of 141, B 12 of 141.
The zero of DH is not carried to its twists (rate in A not above the rate in B); twists have off-line zeros at
a background rate of about 0.07 per box. Registered expectation before the run: positive in both boxes, no
enhancement in A; it held. Largest argument step on a contour 1.77 rad (q = 61, box B), below pi.

Reading of the table. Controls with the functional equation and off-line zeros fail link 2 and never link 1
in its q^theta' form; controls without the functional equation fail link 1. For zeta link 2 is a theorem and
link 1 is equivalent to the target. The table has no control passing both links, but link 1 has no proof
step, so "fails at a named step" is a statement about inputs, not about an argument. R3 is not claimed.

## 3. J2: the cross bridge form

Notation of `g-spinor-square-root`: S_F = N_F/D_F unitary on the axis, Gamma_-(S) = Q_c S P_c.

### 3.1 First lemma (PROVED)

(a) A Hermitian form on pairs (f_1, f_2) with diagonal blocks H^zeta, H^chi and any cross block, required to
be >= 0 on all pairs, contains H^zeta >= 0 on the slice (f, 0): the scalar statement (RH, refereed square-root
lane). Closed by row Q28. (b) The Hankel block of a product symbol S_zeta S_chi is the bridge form of a
product of the members (row Q25: negative index = number of distinct off-line zeros of the union).
(c) The quotient symbol S_chi S_zeta^* is unitary; under RH and GRH it is an inner function times the
conjugate of an inner function. N_zeta = F(1 - alpha F'/F) has a zero on the positive real axis for every
alpha > 0 (F'/F runs from 0 to infinity there), so the quotient has a pole in the right half-plane unless
N_chi vanishes at the same point: its anticausal block is non-zero in the true case except by coincidence
(ARGUED). No vanishing statement.
(d) The only object that is not one of these is the cross Gram X_c = Gamma_-(S_zeta)^* Gamma_-(S_chi), with
Hermitian part 2 Re <Gamma^zeta f, Gamma^chi f> = ||Gamma_-(S_zeta + S_chi) f||^2 - ||Gamma^zeta f||^2 -
||Gamma^chi f||^2: a difference of squares with no sign.

### 3.2 Rank of the cross Gram (PROVED for finite pole sets)

If S_zeta, S_chi have finitely many simple poles z_1..z_m and w_1..w_n in Re z > 0, the ranges of the two
blocks in L^2(c, inf) are spanned by the exponentials e^(-z_j r) and e^(-w_k r), and
<e^(-w_k r), e^(-z_j r)> = e^(-(z_j + conj w_k) c)/(z_j + conj w_k). Up to diagonal scaling this is a Cauchy
matrix with distinct nodes; every square minor is non-zero. So rank X_c = min(m, n): **X_c = 0 iff one of the
two members is causal.** The cross block reads "both members have off-line zeros": an AND, implied by RH
alone and by GRH for chi alone. Over a family, "X_c(chi) = 0 for all chi" is "RH, or GRH for every chi".

### 3.3 Controls

Every statement of 3.1 and 3.2 holds for an arbitrary pair of unitary symbols with poles in the right
half-plane. BLS (Blaschke quotients with prescribed poles) passes every step for each member separately, and
the pair (BLS, BLS) passes the cross statements. No step reads the twist relation: at the level of S (a
Moebius transform of F'/F) the twist has no expression, because it acts on the prime measure by the
multiplication chi(n) on the atoms log n, which is defined only at the level of F'/F (linear). The linear-level
cross form is J3. First control passing every step: **BLS**. J2 is closed at stage A.

## 4. J3: the twist-transfer form (consumes PERM with both functional equations)

### 4.1 Identity TW (PROVED; explicit formula CLASSICAL)

Fix M >= 2, a bump phi with support of phi * phi~ inside (-delta, delta), delta <= log(1 + 1/M), and
g_c(r) = sum_{m <= M} c_m phi(r - log m), c supported on (m, q) = 1. For integers n >= 1 and m, m' <= M with
n m' != m: abs(log(n m'/m)) >= log(1 + 1/M). Hence (g_c * g_c~)(log n) = ||phi||^2 sum_{m = n m'} c_m conj(c_m'),
and for the twisted coefficients c chi: sum_{m = n m'} c_m chi(m) conj(c_m' chi(m')) = chi(n) sum c_(n m') conj(c_m')
because chi(n m') = chi(n) chi(m') and abs(chi(m')) = 1. With W_F(g) = sum_rho ghat(rho) conj ghat(1 - conj rho)
= Pole_F(g) + Arch_F(g) - P_F(g), P_F(g) = sum_n n^(-1/2) 2 Re [Lambda_F(n) (g * g~)(log n)], Lambda_chi(n) = chi(n) Lambda(n) (with the opposite
convention for g~ read chibar for chi in the twisted test):

    (TW)   P_chi(g_c) = P_zeta(g_(c chi)),
           W_chi(g_c) - W_zeta(g_(c chi)) = (log q) ||phi||^2 ||c||^2                      [conductor, chi even]
                 + sum_{m != m'} c_m conj(c_m') (1 - chi(m) conj chi(m')) K_phi(log(m/m'))  [gamma kernel]
                 - Pole_zeta(g_(c chi)).

This is the one step in the lane in which complete multiplicativity, unimodularity at every n (PERM, type X2)
and the two functional equations are used together. The zero sums of L(chi) against c and of zeta against
c chi differ by an archimedean form.

### 4.2 Candidate inequality (X) (ARGUED; constants not computed; not needed for the verdict)

The gamma kernel is O(1/abs(u)) near 0, so the weighted Hilbert inequality bounds the second line by
C (integral of phi)^2 M ||c||^2, while ||phi||^2 >= (integral of phi)^2 / delta >= M (integral of phi)^2. For tests
with ghat_(c chi) vanishing at the pole and q above an absolute constant:
(X) W_chi(g_c) >= W_zeta(g_(c chi)) + c_1 (log q) M (integral of phi)^2 ||c||^2 at every height (the term
Re psi at height T cancels on the diagonal; the remainder is O(1/T)).
Direction: a lower bound for the twist in terms of zeta, the opposite of what a statement about zeta needs.
Regime: spectral width of the test about M with M coefficients, the boundary of the mean-value regime; one
off-line pair contributes at most M ||c||^2 (1 - 4 b^2)^(-1/2) (b = beta - 1/2) against an on-line mass of
order M log M ||c||^2 on average (not bounded below pointwise). Whether Weil positivity on this class is of
RH strength is OPEN and not decided here.

### 4.3 Controls

TW uses only: (i) the twisting character is completely multiplicative and unimodular; (ii) F and F tensor chi
both have explicit formulas of Weil type; (iii) Lambda_(F tensor chi)(n) = chi(n) Lambda_F(n), true for every
Dirichlet series F. Multiplicativity of the target is not read: the prime side is removed before any
inequality.

| control | step that fails |
|---|---|
| DH (psi mod q, q = +-1 mod 5) | none: (i), (ii), (iii) hold; Lambda_F is not supported on prime powers, the coincidence bound is for all integers n |
| T-NR | none: the twist has the functional equation (Lemma C); m_chi(1 - s) = m_chibar(s) |
| E_a | none (degree-two gamma factor on both members; the conductor term is 2 log q) |
| DEL, THIN, U, sign twist | (ii): no functional equation, no zero side of this form |
| window translate | (ii) holds exactly with the translated symmetry; passes as zeta does |
| backward heat, EIS-w, interpolation twin | not formulable / no explicit formula with ordinary coefficients |

First control passing every step: **DH** (also T-NR and E_a). J3 is closed at stage A.
General form of the finding (PROVED as stated): a pair functional built so that the twist relation is
consumed exactly cancels the prime side and leaves an archimedean form; the twist relation is a property of
chi and holds for every pair lift, so it cannot separate the target from a control that has a twist family
with functional equations.

## 5. Eleven-control summary (first failing step per candidate)

| control | J1 fixed set | J1 chain (COMP + density) | J2 | J3 |
|---|---|---|---|---|
| DEL | fails: twist ratio changes unless S in class 1 | COMP (S regular mod q) | not separated (identities) | no functional equation |
| THIN | same | COMP (S regular mod q) | not separated | no functional equation |
| U | passes as zeta (no off-line zeros known) | not a handle | not separated | no functional equation |
| DH | twist ratio defined; no hypothesis to fail | density | passes (identities) | **passes every step** |
| E_a | ratio Q(s+a)Q(s-a): poles off the line; conclusion false, hypotheses none | density (SIZE) | passes | **passes every step** |
| T-NR | **passes every step (Lemma C)** | density (X1 at p0) | passes | **passes every step** |
| EIS-w | not formulable | not formulable | not formulable | not formulable |
| window translate | passes as zeta | passes as zeta | passes as zeta | passes as zeta |
| interpolation twin | not run | not run | passes (identities) | no explicit formula of the type |
| backward heat | not formulable | not formulable | passes (identities; Krein index counts its pairs) | not formulable |
| sign twist | off-line zeros left of 1/2 only | not a handle | not separated | no functional equation |
| BLS (added) | pair of Blaschke quotients is not a twist pair | not formulable | **passes every step** | not formulable |

## 6. Requirement flags

- R1 false. No proved inequality uses multiplicativity of the target. TW uses multiplicativity of chi only.
  In the chain of Lemma A multiplicativity of the family enters the density link (classical), and COMP is not
  proved.
- R2 false. COMP is formulated in every window and TW holds at every height, but no conclusion about a
  window is established.
- R3 false. J1 on a fixed set: T-NR passes. J2: BLS passes. J3: DH, T-NR, E_a pass. For the chain, each
  control fails one link at the level of inputs; with no proof of link 1 this is not a verified failure.
- R4 false. Lemma A is a conditional passage (comparison in every window => zero-free right of sigma_0);
  its hypothesis is equivalent to the target.

## 7. Proposed map row and device record (this lane does not edit the map)

| Device | Finding | Status | Controls | Lane |
|---|---|---|---|---|
| Joint functionals of the pair (zeta, L(chi)): ratio Q_chi = L/zeta (winding, Littlewood, Nevanlinna), cross bridge Gram of (S_zeta, S_chi), twist-transfer Weil form | Ratio: every winding quantity is the signed difference of the member counts; for chi even the ratio has a gamma-free functional equation of conductor q; a multiplier common to both members cancels, so T-NR at p0 = 1 mod q has identical ratios for any finite set of characters. With all moduli: a comparison N_zeta(W) <= N_chi(W') for q^theta' characters mod q, infinitely many q, with theta' > 3(1-sigma)/(2-sigma), implies no zero of zeta right of sigma in W (rel. the conductor-aspect density theorem); the comparison is equivalent to the target and on all but q^(theta+eps) members is the scalar statement. Cross Gram: rank min(m, n) for finite pole sets, vanishes iff one member is causal; identities for any pair of unitary symbols. Twist-transfer: for narrow bumps at log m the prime sides of W_chi(g_c) and W_zeta(g_(c chi)) are equal; the difference is archimedean with leading term (log q)||phi||^2||c||^2; holds for every F whose twist has a functional equation. | PROVED (Lemmas C, N, TW, first lemmas, cross Gram rank); PROVED-rel Montgomery Theorem 12.1 recalled (Lemmas A, B); MEASURED (DH twists, 5 moduli); ARGUED (inequality (X), DEL/THIN row) | T-NR at a split prime passes every functional of finitely many ratios; BLS passes the cross bridge; DH, T-NR, E_a pass the twist-transfer form; in the chain, controls with a functional equation fail the density link and DEL, THIN fail the comparison | `c14-joint-pair-design-ratio-vortex-cross-bridge` |

Notes for lane `c14-joint-zeta-twist-noncone-search` (pair dictionary DJ): (1) any functional that depends
on the pair only through the ratio or through a difference of log-level data is T-NR-blind at split primes
(Lemma C); the T-NR pair class should include p0 with chi(p0) = 1 for every character in the dictionary.
(2) The pair lift of DH keeps a functional equation only for moduli q = +-1 mod 5.

## 8. Three weakest steps

1. Lemmas A and B rest on the conductor-aspect density theorem as recalled (exponent 3(1 - sigma)/(2 - sigma),
   uniform for fixed T as q grows). The source was not opened. Any exponent below 1 for sigma > 1/2 suffices,
   but the statement must hold with T fixed.
2. The DEL/THIN row of section 2.6 (COMP false) needs a thin set regular in every residue class mod q with
   the stated error term; this is quoted by analogy with the ray-class construction on file and was not
   constructed here. The DH row is float64 winding numbers on five moduli with one box pair; the largest
   argument step was 1.77 rad; the q^theta' form of COMP for DH is not decidable at these q.
3. Inequality (X) of section 4.2 is a sketch (kernel bound and Hilbert inequality not written out; the pole
   term is removed by a linear condition). The claim "the test class is in the mean-value regime" is argued by
   sizes, not proved. The verdict on J3 does not depend on (X): it depends on TW being an identity valid for
   the controls, which is proved. The finite-pole-set restriction in 3.2 is inherited from the square-root lane.

## Files

`RESULT.md`, `REFEREE.md`, `checks.py`, `checks.json`, `lanes_line.json` in
`tmp/research-2026-11-16/push/c14-joint-pair-design-ratio-vortex-cross-bridge/`.
