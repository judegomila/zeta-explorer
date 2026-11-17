# Synthesis: geometric objects against Hecke / metaplectic structure (h-lanes, 2026-11-16)

Source: seven lanes under `tmp/research-2026-11-16/push/h-*/` (RESULT.md + REFEREE.md each). Every lane returned the verdict "precise obstruction". No bound moves. No zero inequality for zeta was produced. Four referee reports hold the lane's claim with corrections (h-metaplectic-spin, h-seven-eighths-in-bridge, h-hecke-channels, h-tnr-geometric); three do not hold it as stated and survive only in corrected form (h-hecke-torus-symmetry, h-klein-fricke, h-twistor-penrose).

Scope rule for this file: a statement appears in section 1 only if a referee re-derived or reproduced it. Labels: PROVED, CLASSICAL, MEASURED (floating point, not interval-certified unless said), ARGUED, MODEL.

Short answers to the two questions behind this round, restricted to refereed content:

- Does lowering the de Bruijn-Newman bound Lambda help lower 7/8 or reach the critical line? Not in the direction asked. Refereed (h-seven-eighths-in-bridge, W4): a zero-free half-plane at distance d from the line gives Lambda <= 2d^2, and there is no converse. A Lambda bound gives no wall. Given 7/8 and de Bruijn, the channel tube half-width is sqrt(9/64 - tau/2), closing at tau = 9/32. Information flows from the half-plane to Lambda, not back.
- Does the geometric program (torus, Klein bottle, spin cover, twistor, twin ladder, bridge shear) contain the primes? In every lane the step that fails for Davenport-Heilbronn (DH) is the Euler product restated (complete multiplicativity of the coefficient sequence). No lane converts that step into a statement about zeros. Section 5 lists the moves that remain.

---

## 1. Referee-surviving statements

### 1.1 Ladder and Hecke structure of the theta kernel

- PROVED (h-hecke-torus-symmetry T1): kappa = sum_n V_n g0, with V_n = n^(-1/2) times translation by -2 log n. (1 - V_p) kappa is p-primitive for every p. Fricke: J V_p J = V_p*. This is equivalent to the Shimura T(p^2) eigenvalue 1 + 1/p on the weight-1/2 theta function (checked at p = 3, 5, 7, n < 500; also 3e-31 at p = 2, 3, 5 in h-metaplectic-spin).
- PROVED (T4 a, b, d): V_p* H_c V_p = p^-1 H_(c + 2 log p). The defect is a window form on (c, c + 2 log p]. Only scalars commute.
- PROVED (T5 a-c): translations plus J act multiplicity-free. The orbit integral of H_c is the Laguerre multiplier alpha (f'^2 - f f''), up to a constant the referee did not check. Im(conj(D) D') = alpha (f'^2 - f f'').
- PROVED, corrected statement (h-metaplectic-spin B): a ladder is a T_{p,eps} eigen-section (Shimura T_{p^2}, weight nu + 1/2) iff a(p^k m) = a(p^k) a(m) for all k and all m prime to p, with local factor (1 - (eps/p) x) / (1 - lambda' x + (eps^2/p) x^2).
- PROVED, as a statement about defining formulas (h-metaplectic-spin A): bridge objects are built from theta on the geodesic tau = i e^b, whose modular stabiliser is {1, S}. The automorphy factor is real positive there (the multiplier is e^{-i pi/4}). The Jacobi symbol appears only as the cusp coefficient at 2c/d (MEASURED, 1.7e-6 at d = 15, 36 cusps).

### 1.2 Tori, lattices, the Klein bottle

- CLASSICAL (h-hecke-channels R1, h-klein-fricke Prop 2, h-hecke-torus-symmetry T2): for every rank-2 lattice L and prime p, the sum over the p + 1 index-p sublattices of the completed Epstein field equals (p^s + p^(1-s)) Lambda_L(s), identically in s. On heat traces: Theta(t) + p Theta(p^2 t). The relation holds for every lattice, with or without an Euler product.
- PROVED (weakened form of N1): these relations are linear and homogeneous, so they cannot exclude a zero at any vertex. A non-trivial witness is the ring-class-character twisted toric period, which vanishes at Z[i] for every s0.
- PROVED + MEASURED (R2): at a zero rho of zeta * L(chi_-4), the 2-neighbours of the square torus vanish; the 3- and 5-neighbours take the values +-(1/2) pi^-rho Gamma(rho) p^rho B(rho), with B a different Euler product. Neighbour fields have off-line zeros from height 10.41 (2x^2 + 2xy + 5y^2, Re 1.3618) and 20.65 (x^2 + 9y^2, Re 0.8651); 14-40% of zeros below height 200 are off-line (winding counts balance; not interval-certified).
- PROVED (C1): 2 Lambda_2i + 5 Lambda_i has a zero at 1.7716 + 4.5324i.
- PROVED/CLASSICAL (h-klein-fricke): r^-4 = lambda(2 tau_E) on an arc of X_0(4)(R). Fricke w_4 is K <-> K', fixed at r = 2^(1/4). Completed zeta is the Mellin transform of sqrt(2K/pi) along the arc (formula 2.3, checked to 15 digits; a restatement of Jacobi and Riemann). The zeta-view Klein bottle E_r/A is a fibre, not a modular quotient.
- Corrected (h-klein-fricke): a single Epstein function is one Euler product iff the class group is trivial (the weight-1 theta series is a Hecke eigenform; the Galois orbit of j is a point). Functions of Hecke traces are constant on a Hecke module and cannot determine the count of off-line zeros.
- Corrected (h-klein-fricke Prop 5): cosine dominance traps all zeros of E*(z, s) on the line below t ~ 2 pi y for any high torus. It is Euler-blind: 46 zeros are forced for the non-Euler class [1,0,41] (D = -164, h = 8), the same count as D = -163. Class number one is only the condition for zeta to be a factor; the resulting statement (7 zeta zeros below t = 42) is inside verified height.

### 1.3 Flow, shear, twistor reading

- PROVED (h-twistor-penrose): for every real t, G_t kappa = sum_n n^(-1/2) W_t(log n) G_t f, with W_t(a) = e^{-t a^2/4} M_{-ta/2} D_a a homomorphism in a. The cocycle exp((t/2) log m log n) is a coboundary of exp(t a^2/4). The Gaussian acts on the Heisenberg group of the log-scale line by the shear (a, b) -> (a, b - ta/2).
- PROVED (h-hecke-channels R3, kernel identity): the de Bruijn flow turns the multiplier p^(+-z) into a shift by (tau/2) log p. The series form is valid for tau <= 0 only.
- PROVED: for t < 0 the evaluated series converges absolutely at every complex w while zeros are off the line (Rodgers-Tao; b-escape-law). Therefore multiplicativity of the coefficient sequence relative to a fixed archimedean profile, with evenness, reality and positivity of the kernel, is preserved by the Gaussian multiplier and cannot by itself give zero reality.

### 1.4 The 7/8 input in bridge language

- PROVED (W1-W3(ii)): zeros lie within distance a > 0 of the line iff the shifted kernel (L(z) + conj L(w)) / (z + conj w - 2a) is PSD on Re z > a iff the poles of M lie in the parabola Re s <= a^2 - (Im s)^2 / (4a^2) iff S(a + .) is Schur. These restate the half-plane and add no zero information.
- PROVED relative to 7/8 (arithmetic only): d = 1/2 - h/6 + b/12 = 1/3 + (M - 2l)/12 = 3/8 at the manuscript geometry (r = 6; C_II = s - 11/16, low exponent 3/16, crossing at 7/8). 7/8 is an imported, unrefereed input.
- PROVED + MEASURED independently: for DH the Dirichlet inverse has a simple pole at 0.8085 + 85.6993i (residue modulus 0.7963, growth 0.552 per doubling), while the Moebius twist is regular there (modulus 0.778).
- PROVED (h-metaplectic-spin E): sum mu(n) a(n) n^-s for DH equals alpha / L(s, chi) + conj(alpha) / L(s, chi-bar), finite at the DH off-line zero.
- CLASSICAL (h-metaplectic-spin C, D): cubic/sextic covers over Q(omega) are trivial at the complex place (flat mu_n residue-symbol characters). Theta Hecke relations are the grade reflection j -> n - 2 - j: n = 2 fixes grade 0 (no Gauss sums), n = 3 gives the 7/8 input, n = 6 leaves grades 1 and 2 free.

### 1.5 The T-NR control (highest-rated lane, strength 0.3)

- PROVED (h-tnr-geometric Prop 1): for real c, xi*(s) (2 cosh((s - 1/2) log q) + c) is Tate's zeta integral with the self-dual local test vector q^(1/2) 1_{q Z_q} + c 1_{Z_q} + q^(-1/2) 1_{q^-1 Z_q}; equivalently the Mellin transform of (V_q + V_q^-1 + c) psi, V_q being idele translation in the GL(1) Hecke algebra.
- PROVED (Prop 2): this change keeps multiplicative coefficients, the gamma factor, the field-level functional equation and kernel positivity. The added zeros sit at Re s = 1/2 +- arccosh(|c|/2) / log q; on the line iff |c| <= 2.
- Consequence (PROVED): no hypothesis set invariant under such test-vector changes with |c| > 2 can imply RH; none invariant for |c| > q^(sigma0 - 1/2) + q^(1/2 - sigma0) can give a zero-free half-plane Re s > sigma0.
- MEASURED and reproduced (200 digits, 12 linear nodes): first negative nested Pick order is 4 for NR and 7 for EA; none for zeta and NRt.

### 1.6 DH facts reproduced by every referee

- Off-line zeros at 0.8085171825 + 85.6993484854i and 0.6508300806 + 114.1633427308i; functional equation ratio 1 to 1e-25 or better.
- DH is a U_p / T_{p^2} eigen-object at p = +-1 mod 5, degenerately at p = 5 (eps = 0, lambda = 0), and at no prime p = +-2 mod 5. Defect a(6) - a(2) a(3) = 1 + k^2 = 1.0807. For general inert p: a(2p) - a(p) a(2) = -+(1 + k^2).
- DH and its Fricke-odd partner span a 2-dimensional U_p-module with dihedral symmetry of order 8.
- Laguerre sign f'^2 - f f'' < 0 for DH at t = 85.7 and 114.16 (recomputed by the referee; the lane had only cited it).

---

## 2. Dictionary: geometric object to Hecke / metaplectic structure

### 2.1 Identities (refereed)

| Geometric object | Arithmetic structure | Status |
|---|---|---|
| Twin ladder rung shift V_p (n^(-1/2) times translation by -2 log n) | Level-raising tau -> p^2 tau on weight-1/2 theta; only T(p^2) is involved; eigenvalue 1 + 1/p | Identity. Equivalent to c(pm) = c(m), i.e. p-primitivity of (1 - V_p) kappa |
| Ladder is a spin-Hecke eigen-section at p | Coefficients satisfy a(p^k m) = a(p^k) a(m): Euler factor at p | Identity (corrected "iff") |
| Bridge shear under de Bruijn flow | Conjugation of the dilation group by the Gaussian multiplier; shift (tau/2) log p; Heisenberg shear (a, b) -> (a, b - ta/2) | Identity (kernel level; series for tau <= 0) |
| Klein-bottle / torus parameter r | Point on an arc of the real oval of X_0(4): r^-4 = lambda(2 tau_E) | Identity |
| Fixed point r = 2^(1/4), K <-> K' | Fricke involution w_4; gives the functional equation for formula (2.3) only | Identity for (2.3) |
| Spin cover, n = 2 | PR 43 "+-i" = lifts of the centre; e^{b/4}; H^4 = (4/pi^2) K K' | Identity for n = 2 only |
| Index-p sublattices of a torus (p + 1 neighbours) | Lattice Hecke operator T_p with eigenvalue p^s + p^(1-s) on the Epstein field | Identity; Euler-blind (holds for every lattice) |
| Local modification of the ladder at one prime (T-NR) | Change of Tate local test vector at q; Laurent polynomial in q^-s | Identity |
| Bridge PSD on Re z > a, antibridge parabola, Schur square root | Zero-free region at distance a | Identity; a restatement |
| Hexagonal torus automorphisms; Gauss-lemma transfer; Kummer projection; absorption identity | Aut = mu_6; pieces of the 7/8 detector | Identities |

### 2.2 Analogies, readings, models (not identities)

| Claimed link | Why it is not an identity |
|---|---|
| "sqrt(p) V_p acts on the zero module as diag(p^(-i gamma))" (Hecke action on zeros) | D_c V_p = p^(-1/2) D_(c + 2 log p): V_p maps the c-module to a different module. The diagonal action is the translation group diag(e^(-i gamma h/2)) for all real h; primes play no role. "RH iff tempered" is a restatement. |
| V_q + V_q^-1 as the modular Hecke operator on theta | It is idele translation in the GL(1) Hecke algebra. V_q^-1 leaves level 4. The modular T_{p^2} eigenvalue is s-independent. |
| Dilation D_{log p} "is T_p restricted to the geodesic" | Wrong index: it is the extreme branches of T_{p^2}; "restricted to the geodesic" is not an operator statement. |
| Twistor / Penrose datum kappa(q) dq on the parabola | It is the Fourier-Laplace representation over the characteristic parabola; the twistor label adds nothing checked. |
| Torus Hecke relation (R1) <-> DH two-vertex graph (R4) | R4 is U_p on coefficients of a degree-1 conductor-5 function that is not the field of any torus; not part of an isogeny graph. |
| Klein-fricke Section 2 (weight-1/2 theta, zeta) <-> Sections 3-6 (Epstein, zeta * L) | Different constructions. No statement carries Hecke information into formula (2.3). |
| Kesten / Hasse threshold for |c| <= 2 | The same inequality c^2 <= 4; no intertwining map given. |
| Exceptional term = grade-0 class of the sextic cover | Merges the grading v_p(index) mod 6 with the class of the Poisson frequency modulo sixth powers. ARGUED. |
| Gauss sum = branch holonomy; reflection = Fricke-type involution; "mu_2 gives inversion, mu_3 automorphy" | Standard identifications and readings, not derived from the manuscript. The sign exists for any character pair; inversion also needs complete multiplicativity. |
| "Loaded torus sits at r = 2, wall distance 0, detector circular" | MODEL. No twisted family is defined in the user sources. |
| "The 7/8 detector applied to DH" | The lanes' own model. DH is not a target over Q(sqrt -3); the measurement tests the Dirichlet-inverse lemma over Z. |
| Theorem A as "the reason earlier lanes found only the functional equation" | ARGUED. Theta on the geodesic determines theta everywhere by analytic continuation, so the statement is about defining formulas, not information. |
| PR 43/56 loading carries Hecke structure | It carries none as defined (P0, not re-read by the referee). |

### 2.3 One distinction that recurs

Two Hecke actions were conflated in four lanes: the action on the lattice variable (weight 0, eigenvalue p^s + p^(1-s), true for every lattice) and the action on coefficients (U_p, T_{p^2}, true only with an Euler product). Only the second separates zeta from DH, and it is equivalent to complete multiplicativity.

---

## 3. Where each control fails structurally

| Control | Step it fails | Does the failure give zero information? |
|---|---|---|
| Davenport-Heilbronn | Coefficient multiplicativity at primes p = +-2 mod 5 (defect 1.0807); Fricke swaps the chi and chi-bar eigenlines. In the 7/8 detector: Lemma 7.1 and the Part II compensation (12.5), both needing a completely multiplicative target; the Moebius twist returns c1/L(chi) + c2/L(chi-bar), blind to DH's own zeros. | No. In every lane this is the Euler product restated; through norm convergence it yields only Re s > 1. No sign statement uses it. |
| Backward heat (tau < 0) | Fails nothing in these lanes. It keeps the sheared multiplicative structure, evenness, reality, positivity, and converges at every w, with zeros off the line. | It bounds what can work: any hypothesis preserved by the Gaussian multiplier cannot give zero reality. |
| T-NR (c > 2) | Fails only the local condition at q: the test vector is non-spherical with a symbol vanishing off the unitary axis. Keeps multiplicative coefficients, gamma factor, field functional equation, kernel positivity. First negative Pick order 4. | It bounds what can work: an argument must detect the local test vector at each prime. NR at q = 2, c = 2.2 has zeros at Re s = 1.1399 > 1. |
| EA (torus at real shear) | Not multiplicative at any p. Positive log-concave kernel with off-line zeros. First negative Pick order 7. | No. |
| zeta(s + a) zeta(s - a) | Under the literal U_p test it fails at every prime (b_2n/b_n = 2.04, 1.55, 2.04, 1.40); the lane's claim that it passes was false. | No. |
| Single Epstein class, h > 1 (DH-type surrogate) | Fails nothing geometric: satisfies the lattice Hecke relation, and passes cosine dominance (46 forced zeros for [1,0,41]). | Shows the lattice Hecke relation and cosine dominance are Euler-blind. |
| Sign twist Lambda(n) -> eps_n Lambda(n) | Not run in these seven lanes. | Not tested. |

Summary of the structural picture that survived: the conditions each control violates are (i) functional equation / Fricke, (ii) multiplicative coefficients, (iii) spherical local vector at every prime, (iv) the unsheared position tau = 0. The "minimal package" M1-M4 of h-tnr-geometric is a list of necessary conditions calibrated on five functions. It is valid only with M2 read as multiplicativity, its sharp M4 is a restatement of zero location, and as listed it admits every primitive even Dirichlet L-function unless conductor 1 is added.

---

## 4. What a referee broke

### 4.1 Claims that failed

- h-klein-fricke, main claim: the stated DH-failing step is wrong. Cosine dominance does not use the Euler product; non-Euler tori pass it. The lane has no mechanism that DH-type functions fail. Also: "Euler product iff the T_p orbit is a point" is false (Prop 2 of the same note shows the sublattice sum always returns a multiple); the correct criterion is the class-group orbit. The classical DH function (odd characters mod 5) is not an Epstein function, so most of the lane is not formulable for it.
- h-hecke-torus-symmetry T6: the "Hecke action on the zero module" does not descend; it is the translation group, with no prime-specific content.
- h-hecke-torus-symmetry T4(c): cross terms are T_(2l) H_(c-l) + H_(c-l) T_(-2l), not H_(c+l) (error 24.2 on scale 25.4 in a circulant model; corrected form 9e-15).
- h-hecke-torus-symmetry T7: on L^2(e^(-2 delta u) du) the norm is p^(-1/2 + 2 delta); the product diverges for every delta > 0. The conclusion (Re s > 1 only) is unchanged after the fix.
- h-twistor-penrose Theorem 1: J normalises only the Laurent ring (J W_t(a) J = W_t(a)^-1); the functional equation is a separate input. Theorem 3 is a tautology (a conjugate triple read with an unconjugated evaluation). "DH is not an operator Euler product for any t" is undefined without a fixed algebra and profile class. Prop 6 uses the wrong Hecke index. "Identities to 1e-30" overstates: sheared-series agreement is 4e-9 to 3e-6.
- h-hecke-channels N1: the proof is defective (ignores homothety identifications; part (b) is a non sequitur); the conclusion holds for the weaker reason in 1.2. "R1 at p is equivalent to the p-Euler factor" is false. The flow series for tau > 0 does not exist; the pole requires s(s-1) Lambda_L; Rodgers-Tao covers zeta only.
- h-seven-eighths-in-bridge: "the probe is linear in the target" holds only for the base probe (6.1), which gives 11/12; the Part II probe (12.5) that gives 7/8 has degree up to K + 1. "No setting of lengths gets below 1/3 with a 6-fold deck group" repeats a claim already corrected in r3-method-limit: d >= 1/3 holds only under lx >= l (a modelling hypothesis) or under M >= 2l with the polar term kept. The "at most 1/96" statement is not established.
- h-metaplectic-spin C: the free local grades at n = 6 are 1 and 2, not "0 and 1"; the real n = 3 / n = 6 difference is that nothing links grade 1 to grade 0. Corollary B1 omitted p = 5 and proved failure only at p = 2, 3 (closed by the referee for general inert p).
- h-tnr-geometric: "simultaneous U_p eigen-object" is wrong as written for NR (not U_3-eigen) and EA; "each control fails exactly one" is false under the literal definition. psi is not in H. The Dirichlet series has conductor q^2. The numerical W check in hecke.py is vacuous (bare swap without root number); the text proof is correct.

### 4.2 Not checked by any referee

- Howe semigroup closure, Schoenberg hypotheses (h-twistor-penrose).
- Most of the N_right table, the 13-prime table (h-klein-fricke).
- DH Pick to order 36, kernel log-concavity tables, argument-principle counts for EA and DH (h-tnr-geometric).
- W3(iii), which rests on the unrefereed sq-hankel-traces Thm 3.
- Manuscript sections 8-20 behind the 7/8 detector model; control cells outside the DH column in h-metaplectic-spin.
- Constants 2 pi and alpha/pi in the Laguerre orbit integral.
- All numerics are floating point, not interval-certified.

---

## 5. Top 5 next moves for a geometric program that contains the primes

Ordering is by lane strength rating and by whether the referee left the starting point intact. None of these has been started. Each must be run against DH, backward heat, T-NR, and the sign twist (not yet run in this round).

1. **Local test-vector functional (from h-tnr-geometric; referee holds).** Find a bridge-form functional of the local test vector Phi_q, using the additivity P_NR = P_zeta + P_D, that is extremal at the standard vector 1_{Z_q} and changes sign exactly at |c| = 2, stated for all q without absolute-value sums over primes. Acceptance test: reject NR and EA, accept NRt (c = 1), fail for DH at p = +-2 mod 5. This is the only move with a refereed no-go behind it that names what an argument must detect (the spherical vector at every prime).

2. **Hecke defect on p-primitive tests (from h-hecke-torus-symmetry; T1 and T4(a,b,d) survive).** Evaluate the window form on (c, c + 2 log p] on tests built from the p-primitive kernel (1 - V_p) kappa, for all p together, and check whether p-primitivity fixes its sign. Controls: DH at p = 2, 3, NR at q, backward heat. If the result is kernel-independent, close rank-one Hecke. Use the corrected T4(c) cross terms.

3. **The 7/8 probe as a period on the 6-fold cover (from h-metaplectic-spin and h-seven-eighths-in-bridge; both referees hold).** Derive manuscript eq. (6.1) as a period: cubic theta times a sextic metaplectic Eisenstein section, twisted by eta, so that reflection and Poisson are its two unfoldings. Then test whether the Z/2 factor of Z/6 = Z/2 x Z/3 (the classical spin sign) separates the exceptional coset from the principal row. This is the one place where the spinor sign and the only new arithmetic input of 2026 could meet. Prerequisite: read manuscript sections 8-20; the current section 7 table is a translation, not a derivation. Compute-shaped companion: check whether theta coefficients on the 6-fold cover reproduce the measured mean of rho_sigma(-e0 m) in `tmp/sextic` (acts on the polar 1/96 term; literature recalled only, not tested).

4. **Sheared Hecke commutator at tau -> 0 (from h-hecke-channels R3 and h-twistor-penrose; corrected).** R3 singles out tau = 0 as the position where Hecke operators act as scalar multipliers (zero shear). Test whether the bridge / Krein form of g-spinor-square-root has a sign-definite commutator with the sheared operators T_p^(tau) as tau -> 0. Run against T-NR (C1) and the class-number-2 neighbours first. Use the T_{p^2} index, for tau <= 0, and apply the flow to s(s-1) Lambda_L. Keep only if the sign is definite for tau > 0 and both DH and backward heat fail it; otherwise close the shear lane.

5. **Move the loading from the fibre to the base (from h-klein-fricke; fibre lane closed).** Load the bridge field on the base: theta = sqrt(2K/pi) along the r-arc of X_0(4)(R) with Fricke w_4, instead of on the Klein-bottle fibre. Test whether any base-side form fails for DH. The fibre-side lane should be closed: its one separating step is capped by Heegner-Baker-Stark (|D| <= 163, t <= 42.6) and its trapping mechanism is Euler-blind.

### Lanes to close as stated

- Klein-bottle fibre as a modular object (h-klein-fricke).
- Zero-module Hecke action / "RH iff tempered" (h-hecke-torus-symmetry T6): a restatement.
- Twistor label on the Fourier-Laplace datum (h-twistor-penrose): no content beyond the sheared multiplicative structure.
- Lattice-variable Hecke relations as a source of rigidity (h-hecke-channels): linear, homogeneous, Euler-blind.
- Lowering Lambda as a route to a zero-free wall: no converse (section 0).

### Compute note

The compute server is off-limits under the STOP notice in BRIEF.md (dated 2026-11-17) until that notice is removed; nothing here was run on it. If it is reopened, the compute-shaped items from this round are: the sextic-cover theta coefficient check against `tmp/sextic` (move 3); interval certification of the floating-point tables (off-line zero counts of neighbour tori below height 200, the D = -163 window, Pick orders for NR/EA/DH); and the all-primes Hecke defect scan (move 2). Moves 1, 4 and 5 are derivation-first and need no heavy compute until a candidate functional exists.
