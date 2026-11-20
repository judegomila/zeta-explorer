# h-seven-eighths-in-bridge: the 7/8 half-plane as a wall theorem in the bridge, square-root and channel coordinates

Date 2026-11-16. Slug `h-seven-eighths-in-bridge`. Nothing committed, pushed or posted. Not refereed.
Nothing here proves or refutes RH. No bound moves. 7/8 (openai/math manuscript, unrefereed, Lean-checked by its
authors, text at `~/lean-deps/qrh-verify/paper.txt`) is an input throughout; every statement that uses it is marked
PROVED-rel 7/8.

Labels: PROVED / PROVED-rel X / CLASSICAL / MEASURED / MODEL (exponent bookkeeping transplanted from r = 6) /
RECALLED (literature not re-read) / OPEN.

Files: `cover_tests.py` + `.log` (exact and float small cases), `dh_detector.py` + `.log`, `dh_detector2.py` + `.log`
(Davenport-Heilbronn control). Python `.venv-arb`, single process, each run under 2 minutes.

## Verdict

**Precise obstruction, with an exact dictionary.**

1. The half-plane has an exact form in each of the user's coordinates (section 1): a shifted bridge kernel that is
   positive at shear offset a >= 3/8; a parabola of focal width 9/64 containing the support of the antibridge
   measure; a scattering function that is passive after a tilt of rate 3/8; a channel tube of half-width
   sqrt(9/64 - tau/2) at every height.
2. The detector of the 7/8 proof is identified (section 2): it is a pairing over the family of cyclic 6-fold covers
   whose deck group mu_6 is the automorphism group of the hexagonal torus C/Z[omega]. mu_6 = mu_2 x mu_3. The mu_2
   factor (the quadratic, spin-type twist) is what turns L into 1/L (Moebius absorption). The mu_3 factor is what
   makes the reflected side automorphic (cubic theta on the 3-fold metaplectic cover).
3. The wall position is one formula (section 3): distance = (1/2 - 1/|deck|) + (M - 2 l)/(2|deck|) = 1/3 + 1/24 = 3/8.
4. The step that fails for Davenport-Heilbronn is the signal extraction: the probe is linear in the target, and a
   linear probe returns the reciprocal only for a completely multiplicative target (section 4; MEASURED on DH).
5. No geometric modification tested moves the wall inward (section 5). The degree-2 (spin) family has ideal wall
   distance 0 but its deck holonomy is trivial, so the detector has no second representation. The user's loaded
   torus carries exactly this degree-2 theta.

## 0. Plan: what is new relative to the atlas, the campaigns and the walls

Read: BRIEF; SYNTHESIS_GEOMETRIC; stack-antibridge; g-symmetry-schur, g-torus-modular (+ referees);
g-spinor-square-root; stack-combinator TABLE; zf-campaign-synthesis, sextic-theta-synthesis; bypass-78,
r3-method-limit, r3-higher-rows-dual, zf-higher-rows; manuscript sections 1, 2, 6; PR 57 ZERO-CHANNELS-MATH.

Not repeated: optimisation of the estimate system (bypass-78, r3-method-limit); TRO6; row orders
(zf-higher-rows, r3-higher-rows-dual); bridge algebra (g-antibridge-cancel, stack-antibridge); channel certificates
(g-zero-channels).

New here:
- section 1: the four translations, as theorems with proofs;
- section 2: the dictionary detector <-> covers of the hexagonal torus, with the Gauss-lemma statement that a
  residue twist is the transfer of multiplication-by-a on torsion points modulo Aut(E) (T1), and the reading of
  zf-higher-rows Theorem 1 as "spin twist = inversion";
- section 3: the wall position split into a deck-order term and a range term;
- section 4: the DH failure located at one step, with a measurement on DH itself;
- section 5: modifications ranked by which term of the wall formula they act on, each with its small-case test.

Walls. Sections 1-3 are translations and identities, so they hold or fail for a control exactly as the half-plane
does. The only zero information is the imported 7/8 theorem. Section 4 runs the seven controls.

## 1. The half-plane in the user's coordinates

Notation: F(z) = xi(1/2 + z), L = F'/F, zeros z_rho = b_rho + i gamma_rho, b_0 := sup |b_rho|. The half-plane theorem
is b_0 <= 3/8. Pair-grouped Hadamard sum: L(z) = sum_rho 1/(z - z_rho).

### W1. Bridge: positivity at shear offset a

**Theorem W1 [PROVED; CLASSICAL in content].** For a >= 0 the following are equivalent.
(i) F has no zero with Re z > a.
(ii) Re L(z) > 0 on Re z > a.
(iii) The shifted bridge kernel P^(a)(z, w) = (L(z) + conj L(w)) / (z + conj w - 2a) is positive semidefinite on every
finite node set in Re z > a.

Proof. (i) => (ii): Re 1/(z - z_rho) = (Re z - b_rho)/|z - z_rho|^2 > 0 termwise. (ii) => (iii): G(w) = L(a + w) is a
Caratheodory function on Re w > 0, and (G(w) + conj G(w'))/(w + conj w') is its Herglotz kernel. (iii) => (i): the
diagonal gives Re G >= 0 where G is finite, and a function with nonnegative real part near a pole of residue +1
cannot exist (Re 1/(z - z_rho) takes both signs). QED

So **7/8 is: P^(a) >= 0 at all orders for every a >= 3/8** [PROVED-rel 7/8]. RH is the same statement at a = 0.
On real nodes x_i > a, P^(a) = P o [(x_i + x_j)/(x_i + x_j - 2a)] (Schur product with 1 + 2a x Cauchy kernel), so
P >= 0 implies P^(a) >= 0 for a > 0 [PROVED]. Whether real nodes alone give (iii) => (i) for a > 0 is not checked
here (the eq48 proof was not re-read for its use of evenness): OPEN.

This is candidate C6 of stack-antibridge (kernel P_a on the line Re s = 1/2 + a). Localised form
(g-renderer-learnings Thm A): Re L < 0 only inside half-disks of radius b_rho about the feet i gamma_rho, so with the
wall every such half-disk has radius <= 3/8.

### W2. Antibridge / Stieltjes class: a parabola

Coordinates of stack-antibridge: s = z^2, M(s) = L(z)/(2z) = sum over pairs 1/(s + lambda), lambda = -z_rho^2.
RH is "M is a Stieltjes function": nu = sum of unit masses on the half-line lambda > 0.

**Theorem W2 [PROVED].** b_0 <= a if and only if every pole -lambda of M lies in the closed parabolic region
Pi_a = { s : Re s <= a^2 - (Im s)^2/(4a^2) }, equivalently supp nu lies in { lambda : Re lambda >= (Im lambda)^2/(4a^2) - a^2 }.

Proof. z^2 = b^2 - gamma^2 + 2i b gamma, so Re s = b^2 - (Im s)^2/(4b^2), increasing in b^2 at fixed Im s. QED

- 7/8 is: supp nu inside the parabola with vertex -9/64 and focal parameter a^2 = 9/64 [PROVED-rel 7/8].
- The trivial strip is a = 1/2: Re s <= 1/4 - (Im s)^2. This is the curve on which stack-antibridge Theorem 6
  places the singularities of the prime stubs. The 7/8 theorem moves the support of nu strictly inside the prime
  parabola; RH collapses the parabola to the half-line.
- Function class: M belongs to the class "2 sqrt(s) M(s) is a Caratheodory function of w = sqrt(s) - a" (W1 in the s
  coordinate). The masses stay +1; only the support moves. The anchor Hankel matrices H0, H1 of stack-antibridge
  Theorem 4 are not made positive by a > 0: planted off-line twins inside the wall already give negative pivots
  (stack-antibridge section 5), so the wall implies no sector positivity at any fixed order.

### W3. Square root: passivity after a tilt

S = N/D, D = F + alpha F', N = F - alpha F', so S = (1 - alpha L)/(1 + alpha L) and |S(z)| < 1 iff Re L(z) > 0.

**Theorem W3 [PROVED from W1 and g-renderer-learnings Thm A].** For every alpha > 0:
(i) b_0 <= a iff S(a + .) is a Schur function (analytic, modulus <= 1) on Re w > 0.
(ii) Every pole of S in Re z > 0 lies in a half-disk |z - i gamma_rho| < b_rho of an off-line pair, in particular in
0 < Re z < b_0.
(iii) In the time domain the anticausal part of the kernel of S is a sum of modes e^{z_j u}, u < 0, with
0 < Re z_j < b_0; multiplying the kernel by e^{-a u} (the tilt z -> z + a) makes every mode causal when a >= b_0.

Proof. (i) is W1 with the Cayley transform. (ii): a pole is a zero of D, where L = -1/alpha, so Re L < 0, which
happens only inside those half-disks. (iii) is (ii) with the residue expansion of sq-hankel-traces Thm 3 (unrefereed;
finitely many off-line pairs in a window). QED

So **7/8 is: the anticausal Hankel block Gamma_- of S(3/8 + .) vanishes** [PROVED-rel 7/8]; RH is the same at tilt 0.
The Krein negative index of H_c (the number of off-line pairs) is not bounded by the wall; the wall bounds only how
far from the axis the anticausal modes sit.

### W4. Zero channels: a tube at every height

F_tau = exp((tau/4) d_s^2) xi (PR 57 normalisation; Polymath H_t(z) with z = 2y, t = tau).

**Theorem W4 [PROVED-rel 7/8 + CLASSICAL de Bruijn 1950 Thm 13].** For every tau >= 0 every zero of F_tau satisfies
|Re s - 1/2| <= w(tau) := sqrt(max(0, 9/64 - tau/2)), at every height. All zeros are on the line for tau >= 9/32.

Proof. De Bruijn: zeros of H_0 in |Im z| <= Delta imply zeros of H_t in |Im z| <= sqrt(max(Delta^2 - 2t, 0)).
Delta = 2 b_0 = 3/4 and |Re s - 1/2| = |Im z|/2. QED

Reading in PR 57 terms: an off-line channel can exist only inside the tube of half-width w(tau) about the line, and
the tube closes at tau = 9/32 = 0.28125 (this is lit-dedekind Thm A at theta = 7/8; Polymath's Lambda <= 0.2 is
stronger for the closing time and says nothing about the width at tau = 0).

Direction of implication (the user's question whether lowering Lambda helps lower 7/8). The wall gives a Lambda
bound: half-width d at tau = 0 implies Lambda <= 2 d^2 [CLASSICAL]. There is no converse: "all zeros real at
tau = Lambda_0" puts no bound on the tube width at tau = 0. b-escape-law Thm A (refereed) shows that running the
flow backwards from a real-rooted member of this family produces zeros outside every strip. A smaller Lambda
therefore does not move the wall at tau = 0. The wall moves Lambda, not the reverse.

Numerical check of W1 on the DH pair (b = 0.308517, gamma = 85.699348; `dh_detector2.log`) [MEASURED]:
min over t in [85.2, 86.2] of Re L(a + it) = -2.26, -15.1, -114.8 at a = 0.10, 0.25, 0.30 and +1.24, +1.29, +1.53,
+1.97 at a = 0.3086, 0.32, 0.375, 0.5. The sign changes at a = b.

## 2. The proof read backwards: what the detector is

Structure of the manuscript (sections 1, 2, 6; r3-method-limit section 1) [PROVED-rel 7/8]:

- Probe (6.2): I_eta = Q^{-1/2} sum_m A_m B_m. Row variable m in Z[omega], N(m) ~ Q = XY.
- B_m(Z): sum of cubic-theta coefficients at completed indices c n^3, weighted by the target eta(c n^3) and by the
  Kummer character a -> chi_a(m) (sextic residue symbol with numerator m).
- A_m(Y): additive polynomial in sextic Gauss sums g_{chi_s}(s, -m), N(s) ~ Y.
- Two exact representations. (R) the cubic theta functional equation (Prop 5.1) reflects B_m. (P) Poisson summation in
  m gives frequencies u a^6 with u sixth-power-free; the row u = 1 is Z^{C(s)} / L(s, eta).
- Prop 2.1: a direct bound Z^{C(sigma_0) + omega} for the probe, plus a power saving for (probe - signal), continues
  1/L(s, eta) to Re s > beta* - eps, with eps independent of eta. This contradicts beta* > sigma_0.

Dictionary.

| Proof object | Geometric object | Status |
|---|---|---|
| Field Q(sqrt -3), ring Z[omega] | The hexagonal torus E = C/Z[omega]; Aut(E) = mu_6 | CLASSICAL |
| Sextic symbol (a/pi)_6 | Transfer of multiplication-by-a on the torsion points E[pi] modulo Aut(E): if R is a set of representatives of (E[pi] minus 0)/mu_6 and a r = zeta^{e(r)} r', then (a/pi)_6 = zeta^{sum e(r)} | PROVED (one line: multiply over R); T1 exact, 705/705 |
| Row m, twist by chi_.(m) | The cyclic 6-fold cover F(m^{1/6}); the twist is the projection onto one isotypic component of its deck group mu_6 | CLASSICAL (Kummer theory) |
| Sum over rows m (Poisson (P)) | Average over the family of 6-fold covers. It keeps the indices over which every cover in the family splits: sixth powers a^6 | CLASSICAL orthogonality |
| Signal exponent h/6 | Log-count of sixth powers among frequencies of norm <= Z^h: the common split locus has dimension 1/6 | PROVED-rel 7/8 (10.3), (10.5) |
| Gauss sum g(chi_s) | Holonomy of the cover at its branch divisor (local root number of the deck character) | CLASSICAL |
| Cubic theta coefficients | The section on the 3-fold metaplectic cover whose Fourier coefficients are the cubic branch holonomies (Patterson) | CLASSICAL |
| Reflection (R) | The Fricke-type involution of the 3-fold metaplectic cover. It is the same kind of object as the functional-equation involution D of the loaded torus, on a different cover | PROVED-rel 7/8 Prop 5.1 |
| mu_6 = mu_2 x mu_3, Moebius absorption | mu(pi) g(chi) = -J(chi, rho) g(chi rho)/g(rho), rho quadratic: multiplying the order-6 deck character by the order-2 (spin-type) character gives an order-3 character and produces the Moebius sign | PROVED (zf-higher-rows Thm 1); T2: error 9.5e-15, order 3 in 28/28 cases |
| 1/L(s, eta) in row u = 1 | sum mu(a) eta(a) N(a)^{-s}: the Moebius sign from the mu_2 factor, summed against a completely multiplicative target | PROVED-rel 7/8 Lemma 7.1 |
| Cauchy-Schwarz on sum_m A_m B_m | A positive-definite pairing on the row space; it gives the square-root level X^{1/2} and discards the sign of each row | PROVED-rel 7/8 |

Two readings follow.

**(D1) The detector compares two dualities on one family.** (R) is an involution in the theta index (the base of the
cover); (P) is a Fourier transform in the family parameter m (which cover). Their composition is not the identity
because the branch holonomy of a cover of degree >= 3 is not a character. The mismatch is the signal.

**(D2) The 6 is 2 x 3 with two different jobs.** mu_3 gives automorphy: the reflected rows have a functional equation
with dual exponent 2 and a quadratic residual symbol (manuscript Lemmas 5.7, 5.8), which the quadratic large sieve
bounds unconditionally. mu_2 gives inversion: without it the row u = 1 would contain L, not 1/L, and a pole of the
signal at a zero of L would not exist. zf-higher-rows Theorem 2 (involution nu) says no other order has both jobs
done: nu(r) = 3 only for r = 6.

## 3. The wall theorem and what fixes 3/8

**Wall theorem [PROVED-rel 7/8; restatement].** For zeta and every finite-order Hecke L-function over Q(sqrt -3):
no zero channel of F_0 lies at distance more than 3/8 from the line, at any height; equivalently W1-W4 at a = 3/8.

**Wall position [PROVED-rel 7/8 at r = 6; zf-higher-rows Formula 3; r3-method-limit Thm 1].** With probe lengths
X = Z^{lx}, Y = Z^{ly}, prime length l, M = lx + ly, h = 1 - lx + l, and deck order r = 6:

    d = sigma_0 - 1/2 = (1/2 - 1/r) + (M - 2l)/(2r) = 1/2 - h/r + b/(2r),    b = ly - lx.

At the manuscript geometry (lx, ly, l) = (17/48, 23/48, 1/6): h = 13/16, b = 1/8, d = 1/3 + 1/24 = 3/8
(`cover_tests.log` T4, exact). Part I: (1/2, 1/2, 0), h = 1/2, d = 5/12.

Reading of the three terms:
- 1/2: the trivial strip (absolute convergence of the Euler product).
- h/r: the dimension of the common split locus of the cover family. A zero at distance d from the line is visible
  only if the count Z^{h/r} of r-th-power frequencies covers the deficit Z^{1 - beta} of the reciprocal, i.e.
  Z^{beta - 1} Z^{h/r} > 1, because the signal and the noise floor both carry X^{1/2} (r3-method-limit, "Reading").
- b/(2r): the polar term P_a^{1/6}, the value of the additive side on the coset e_0 t^6 a^6. It lives on the 6-fold
  cover, where no Patterson-type evaluation exists (TRO6-natural).

So **3/8 = 1/3 + 1/24**: 1/3 = 1/2 - 1/|mu_6| is fixed by the deck group; 1/24 = (M - 2l)/12 is the part of the
family range not yet converted. The low-side floors of r3-method-limit are d = 11/30, 13/36, 19/54, and 1/3 at full
conversion (h = 1). No setting of lengths, counts or sieves gets below 1/3 with a 6-fold deck group.

Insensitivity to feedback [EXACT from bypass-78 section 4]: the wall enters its own proof through kappa = 2 sigma_0 - 1
(stage-0 licence). B*(0.75) = 0.8748869894 and B*(0.749773294) = 0.8748866496, so d(sigma_0)/d(kappa) = 1.5e-3. The
wall position is set by the cover, not by bootstrapping from the previous wall.

## 4. Controls

The step that uses the Euler product is the extraction of the row u = 1.

**Lemma 4.1 [PROVED, elementary].** The probe I_eta is linear in the target eta (it enters (6.1) only through
Psi_{m,s,eta}(a) = eta(a) Xi(a)^{-1} R(a,s) chi_a(m)). For a combination f = c_1 eta_1 + c_2 eta_2 the signal is
c_1 H_1/L(s, eta_1) + c_2 H_2/L(s, eta_2). Its poles are the zeros of L(s, eta_1) and L(s, eta_2), not the zeros of
c_1 L(s, eta_1) + c_2 L(s, eta_2). The Dirichlet inverse of a sequence a(n) with a(1) = 1 equals mu(n) a(n) if and
only if a is completely multiplicative [CLASSICAL].

So the family of twisted copies inverts only a simultaneous eigen-object. Applied to DH = c L(s, chi) + conj(c)
L(s, conj chi) (mod 5), the detector traps the zeros of the two constituents (both covered by Theorem 1.1 of the
manuscript) and is blind to the zeros of the sum.

MEASURED on DH itself (`dh_detector.log`, `dh_detector2.log`, coefficients to N = 4e6 and 2e6):
- a(4) - a(2)^2 = -1.0807; max |a^{-1} - mu a| over n <= 100 is 4.29.
- Partial sums: Moebius twist sum mu(n)a(n) stays at 0.32-0.50 x sqrt N (fitted exponent 0.506); the Dirichlet inverse
  has fitted exponent 0.743 on [2^10, 4e6] and still rising (the nearest off-line zero has real part 0.8085; DH also
  has zeros with real part > 1 [CLASSICAL], not seen at this length).
- Resonance at the DH off-line zero s = 0.808517 + 85.699348i (Cesaro-weighted partial Dirichlet sums at N/8, N/4,
  N/2, N): inverse 9.286, 9.838, 10.390, 10.942 (constant increment 0.552 per doubling, i.e. a simple pole);
  Moebius twist 0.764, 0.761, 0.760, 0.763 (no pole).

Seven controls (stack-combinator TABLE), wall theorem and proof steps:

| Control | Wall theorem (d = 3/8) | First proof step that fails | Status |
|---|---|---|---|
| DH | F (zeros with Re s > 1 exist, CLASSICAL) | Signal extraction: target not completely multiplicative (Lemma 4.1) | PROVED + MEASURED |
| HEAT (tau < 0) | F (zeros outside every strip, b-escape-law) | Not formulable: no ordinary Dirichlet series, no row/target structure (flow-euler-defect) | PROVED-rel |
| TW+ / TW- (Lambda -> eps_n Lambda) | ? (no functional equation; not formulable as W1-W4, which use evenness of F) | Reflection (R): eta must be a Hecke character for the twisted theta rows to be automorphic. Extraction survives if eps is completely multiplicative | inferred from the inputs used |
| EA = zeta(s+a) zeta(s-a) | F if a > 3/8 | Unitarity of the target: the constituent n^{-a} is a non-unitary character, the theorem applies to each factor and returns Re s <= 7/8 + a | PROVED-rel 7/8 |
| NR = xi(s)(2 cosh((s-1/2) log q) + c) | ? (has off-line zeros, ideation-panel T-NR; their distance for given q, c not computed here) | Target is not a ray-class character | inferred |
| B (Beurling) | N (no functional equation) | Poisson (P) and reflection (R): no lattice | inferred |

Every control fails a named step. DH fails for a structural reason, at the one step where the mu_2 (inversion)
factor of the deck group meets the target. Sections 1 and 3 by themselves are translations and separate nothing.

## 5. Moving the wall as a geometric question, with small-case tests

d = (1/2 - 1/r) + (M - 2l)/(2r) + (range losses k/2). Three handles: the deck order r (which cover), the family
range (which twisted copies), the pairing.

### 5.1 Which cover: the deck order

Ideal distance at full range, d(r) = 1/2 - 1/r [MODEL for r != 6; `cover_tests.log` T4]:

| deck order r | 2 | 3 | 4 | 6 | 8 | 12 |
|---|---|---|---|---|---|---|
| d(r) | 0 | 1/6 | 1/4 | 1/3 | 3/8 | 5/12 |
| torus with Aut = mu_r | generic | - | square C/Z[i] | hexagonal C/Z[omega] | none | none |

A one-dimensional torus has Aut in {mu_2, mu_4, mu_6} [CLASSICAL]. Smaller deck order puts the ideal wall closer to
the line, and r = 2 would put it on the line. The test is whether the detector still has two representations.

**Test T3 [MEASURED; `cover_tests.log`]. Deck holonomy g(chi)/sqrt p over the 1033 primes p = 1 mod 12, p < 40000.**

| r | distinct values of arg | abs(mean) | abs(mean of r-th power) |
|---|---|---|---|
| 2 | 1 | 1.0000 | 1.0000 |
| 3 | 1033 | 0.2130 | 0.0127 |
| 4 | 1033 | 0.1308 | 0.0422 |
| 6 | 1033 | 0.1005 | 0.0304 |

For r = 2 the holonomy is constant (Gauss's sign theorem). Consequences [PROVED / CLASSICAL]:
- The absorption identity needs chi rho nontrivial, so it has no r = 2 case: nu(2) is undefined. The spin factor
  alone cannot produce the Moebius sign from a Gauss sum.
- Poisson summation in the row variable maps the quadratic family to itself (the Gauss sum of chi_n at frequency k
  is a constant times chi_n(k)). (R) and (P) are then the same transformation and the probe is compared with itself.
- The twisted copies of the degree-2 theta are sum chi(n) q^{n^2}, with Mellin transforms L(2s, chi): they contain L,
  not 1/L. Inversion must be put in by hand through mu, and the mean square of Moebius sums over the family is the
  statement about the family's zeros (r3-higher-rows-dual Theorem B: Poisson exchanges the two mean squares).

**Consequence for the user's geometry [PROVED given the above].** The theta kernel of the loaded torus (kappa, Phi) is
the degree-2 theta: its squares-supported coefficients are the reason the symmetry line is at 1/2 (split locus of
dimension 1/2), and its symmetry group (Z/2)^3 (g-symmetry-schur Thm 1) contains only involutions. A family of
twisted copies built from these symmetries is a quadratic family. It sits at the r = 2 column: ideal wall at
distance 0, detector circular. This is the same finding as the 14 geometric lanes (exact, and DH-blind), now with a
reason: a (Z/2)-valued holonomy is a character, so the two dualities coincide.

r = 4 (square torus): nu(4) = 4, both sides on the 4-fold cover, dual exponent 3, no evaluation
(r3-higher-rows-dual Thm A); realised abscissa 8/9 or none. r = 3: reflected side on the 6-fold cover, exponent 4
(cubic-r2-conductor-verdict). So among covers of the three tori with extra automorphisms only the hexagonal one
with the full mu_6 works, and it is capped at d = 1/3.

### 5.2 Which family: the range h

h = 1 - lx + l <= 1 because the compensated probe needs lx >= l (manuscript (12.5)). This is the term 1/24. Converting
all of it gives d = 1/3 and needs three named range losses removed (r3-method-limit Thm 2: floors 13/15, 31/36,
23/27, 5/6). Product families and conjugate-paired rows (the Klein fold m <-> conj m on the hexagonal torus) were
closed by r2-zf-paired-rows. Mixtures of orders: zf-higher-rows Theorem 4(i) (the lowest-order component bounds the
mixture; part (ii) of that theorem was refuted by its referee and is not used).

### 5.3 Which pairing

Below d = 1/3 the estimate has to beat the square-root level X^{1/2}, i.e. it cannot be a norm estimate of A and B
separately (r3-method-limit section 4(a)). In the bridge vocabulary the present pairing is positive definite on the
row space; what would be needed is an identity for sum_m A_m B_m that keeps the row signs (an indefinite, Krein-type
pairing in which the non-principal rows u != 1 cancel instead of being bounded). No such identity is known. The
polar part of this is TRO6-natural; the rest has no formulation yet. OPEN.

### 5.4 Higher rank [RECALLED, OPEN, not tested]

A Patterson-type evaluation fails on the 6-fold cover of GL(2) because Whittaker models are not unique there
(Kazhdan-Patterson). Uniqueness is expected for theta functions on the n-fold cover of GL(n-1) and GL(n). The
candidate object for an evaluable order-6 holonomy is therefore the theta function on the 6-fold cover of GL(5) or
GL(6). Whether its coefficients control the coset e_0 t^6 a^6 of Prop 15.2 is not known to this lane and was not
examined in the sextic-theta campaign. This would act on the b/(2r) term only (at most 1/96 in d at the manuscript
geometry; more after re-optimisation: full removal was priced at theta about 0.8635 in the sextic-theta brief).

### 5.5 Summary of tests

| Test | Result | File |
|---|---|---|
| T1 residue twist = torsion transfer modulo Aut(E), 21 split primes, a < 40 | 705/705 exact | cover_tests.log |
| T2 absorption identity r = 6, 14 primes, both signs | max error 9.5e-15; order of chi rho = 3 | cover_tests.log |
| T3 holonomy by deck order | r = 2 constant; r = 3, 4, 6 all distinct | cover_tests.log |
| T4 wall arithmetic | 11/12, 13/15, 7/8 reproduced exactly; d(r) table | cover_tests.log |
| DH: twist vs inverse | exponents 0.506 vs 0.743; pole at the DH zero only for the inverse | dh_detector*.log |
| W1 sign at the DH pair | sign change at a = b = 0.3085 | dh_detector2.log |

## 6. What this establishes and what it does not

Established:
- W1-W4: exact forms of the half-plane in the bridge, antibridge, square-root and channel coordinates.
- The detector is a pairing over the mu_6 covers attached to the hexagonal torus; mu_2 does inversion, mu_3 does
  automorphy; the wall is at 1/3 + 1/24.
- DH fails at signal extraction (linearity of the probe plus the Dirichlet-inverse lemma), confirmed numerically.
- The user's loaded torus is the r = 2 member of the same scheme, where the detector is circular.

Not established:
- Any abscissa below 0.874886647 or below 7/8.
- Any statement that the wall cannot be moved by a mechanism outside this architecture.
- The d(r) table for r != 6 is MODEL.

Three weakest steps:
1. The dictionary rows "Gauss sum = branch holonomy" and "reflection = Fricke involution of the metaplectic cover"
   are identifications by standard theory, not derived here from the manuscript's Prop 5.1 line by line. If the
   manuscript's reflection uses structure beyond the theta functional equation (it retains character zeros on
   non-units), reading (D1) is incomplete.
2. Section 5.1's conclusion that the loaded torus "sits at r = 2" identifies the user's symmetry group with a
   quadratic twist family. No twisted family is defined in the user's sources (PR 49 and PR 56 use one field); the
   statement is about which families the (Z/2)^3 symmetries can generate, and a family built from other data
   (Hecke correspondences between different tori, level structure) is outside it.
3. W3(iii) uses the residue expansion of sq-hankel-traces (unrefereed, finitely many off-line pairs in a window), and
   the control table entries for TW, NR and B are inferences from the inputs each step uses, not computations.

## 7. Next step

One concrete object carries both missing pieces: a family of covers of the hexagonal torus whose holonomy is
non-abelian enough to be evaluable (5.4) and whose pairing keeps signs (5.3). The cheapest decisive check is 5.4:
compute, for small norms, whether the coefficients of the GL(5)/GL(6) 6-fold theta (as far as the literature gives
them) reproduce the measured mean of rho_sigma(-e_0 m) from `tmp/sextic/`. If they do not, the wall stays at
1/3 + 1/24 for this architecture and the remaining geometric question is 5.3 alone.
