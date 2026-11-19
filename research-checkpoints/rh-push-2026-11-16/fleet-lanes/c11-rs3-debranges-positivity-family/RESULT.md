# c11-rs3-debranges-positivity-family: RESULT

Verdict: **precise obstruction; device closed at stage A.** The de Branges shift-positivity condition, in every variant examined (shifted structure functions E_a with any shift, the Theorem-2 weight form with any pair (a, h), the bridge-symbol weight, a conductor family), is either a restatement of a closed row (T3, G6) or is false for zeta at a named step. The condition factors as "zeros on the line" AND "a phase-balance condition at every zero". The second factor fails for zeta at the first zero in the weight form and at the 34th zero in the entire-function form (h = 1). The functions that pass are those with rigid zero spacing (a lattice; a gamma-only fake passes the necessary condition for h < 2). The Euler product is what makes the condition fail, not what makes it hold. No statement about zeros of zeta is obtained.

Labels: PROVED / CLASSICAL / OPENED (source read in this lane) / RECALLED (source not opened) / MEASURED / ARGUED / OPEN.
Source opened: Conrey-Li, "A note on some positivity conditions related to zeta and L-functions", arXiv:math/9812166v1 (all 10 pages read). de Branges 1986, 1992, 1994 not opened: his theorems are cited relative to the Conrey-Li text.
Numerics: local, `scripts/memcap.sh 8`, mpmath 30 digits, single process, screen 648 s, checks under 2 minutes, no server use. Nothing is interval-certified. Files: `screen.py`, `screen.log`, `screen.json`, `checks.py`, `checks.json`, `jc.py`, `jc.json`.

## 1. Plan

1. State the condition as one inequality and locate the failing step for zeta (stage A (i)).
2. Generalise the shift (structure function E_a(z) = xi(1/2 + a - iz), shift 2a) and the weight form (shift h independent of a); decide which variants are restatements; mark the multiplicativity step and the functional-equation step (stage A (ii)).
3. Control table (stage A (iii)).
4. Numeric screen of the necessary condition for zeta, DH and a gamma-only fake at three heights up to 1e4.

New relative to the map: no row treats the de Branges shift condition. Nodes `de-branges-hamiltonian-xi`, `de-branges-lagarias-hamiltonian` (row G6 family) treat the Hermite-Biehler property of Xi + i Xi', which is a different statement (section 3, V2). `sigma2-not-de-branges-weight` treats a Weil-form weight. `n3-twin-ladder-endpoint-bridging` and `g-passive-cascade` do not treat the shift operator.

## 2. Stage A (i): the condition and where it fails

Notation. xi(s) = s(s-1) pi^(-s/2) Gamma(s/2) zeta(s). E(z) = xi(1 - iz). E*(z) = conj E(conj z). H(E) = entire F with F/E, F*/E in H^2 of the upper half-plane, norm^2 = int |F(x)/E(x)|^2 dx (the real z-axis is the line Re s = 1).

**The condition (Conrey-Li (3.1); de Branges, relative to Conrey-Li Theorem 1).**

    (C)   Re int_R F(x) conj(F(x + i)) / |xi(1 - ix)|^2 dx  >=  0   for every F in H(E) with F(. + i) in H(E).

Theorem 1 (OPENED; "essentially due to de Branges"): if E has no real zeros, |E*(z)| < |E(z)| in the upper half-plane, E*(z) = eps E(z - i), and |E(x + iy)| is strictly increasing in y > 0, then (C) implies (N1) all zeros of E lie on Im z = -1/2, and (N2) Re K(w, w + i) >= 0 at each zero w, which for zeta reads

    (N2)   q_1(rho) := - Re{ xi'(rho) xi(rho + 1) } >= 0   at every zero rho.

Weight form (Conrey-Li Theorem 2, OPENED): W(z) = 1/xi(1 - iz), F(W) the weighted Hardy space, T the map K(w, .) -> K(w + i, .). If Re <F, TF> >= 0 on F(W), then xi has no zeros in Re s > 1/2 and

    (P)    Re{ xi(s) / xi(s + 1) } >= 0   for Re s > 1/2.

**Failing step for zeta.** (N1) is RH. The failure is at (N2) and (P):
- (N2) fails at the 34th zero: -Re{xi'(rho_34) xi(1 + rho_34)} = -5.38910050718e-69 (Conrey-Li (3.2); reproduced here to 12 digits, MEASURED).
- (P) fails at s = 1 + 282i: Re = -0.000131957293 (Conrey-Li (3.4); reproduced, MEASURED). Sarnak's argument in the Conrey-Li remark (OPENED) gives failure of (P) without computation from the density of values of log zeta on vertical lines in 1/2 < Re s < 1 (RECALLED: Bohr, Titchmarsh ch. XI).

**Lemma 1 (reading of (N2); PROVED given the zeros used are on the line, checked numerically).** For a zero rho = 1/2 + i gamma_n on the line and h > 0 let

    Delta_h(gamma_n) = sum over zeros gamma' != gamma_n (both signs of height, symmetric summation) of arctan( h / (gamma_n - gamma') ).

Then - Re{xi'(rho) xi(rho + h)} / (|xi'(rho)| |xi(rho + h)|) = cos Delta_h(gamma_n). So

    (N2_h)   holds at rho_n   iff   Delta_h(gamma_n) lies in [-pi/2, pi/2] mod 2 pi.

Proof. xi is real on the critical line, so xi'(rho) = -i Xi'(gamma_n) with sign Xi'(gamma_n) = (-1)^n. The phase of xi(sigma + i gamma_n) just right of the line is the phase of xi'(rho), and d/dsigma arg xi = Im(xi'/xi) = - sum_{gamma'} (gamma_n - gamma') / ((sigma - 1/2)^2 + (gamma_n - gamma')^2); integrate from 1/2 to 1/2 + h. QED. Check (MEASURED, `checks.py`): 18 pairs (n, h), n in {1, 2, 5, 10, 34, 60}, h in {0.5, 1, 2}; cos Delta from the first 400 zeros with a tail estimate agrees with the direct value to between 5e-6 and 1.4e-2 (the larger differences at n = 60 are the truncation of the zero sum).

Delta_h is the signed imbalance, at scale h, between zeros below and zeros above gamma_n. Its mean is the gamma-side drift, about -h pi/4 (the density of zeros increases with height); its fluctuation is of the type pi (S(t + .) - S(t)) smoothed at scale h.

**Lemma 2 (weight form fails at every zero that is not exactly balanced; PROVED, elementary).** If (P) holds with shift h and rho is a zero on the line, then xi'(rho)/xi(rho + h) is real and positive, that is Delta_h(gamma_n) = 0 mod 2 pi exactly.
Proof. Near rho, xi(s)/xi(s + h) = c (s - rho) (1 + O(s - rho)) with c = xi'(rho)/xi(rho + h). Re{c delta} >= 0 for all small delta with Re delta > 0 forces arg c = 0 (Julia-Caratheodory at a boundary zero). QED.
For zeta, arg c at the first three zeros with h = 1 is -0.5782, -0.7501, -0.5880 (MEASURED, `jc.py`), and Re{xi(s)/xi(s + 1)} = -0.02334 at s = rho_1 + 0.001 - 0.05i = 0.501 + 14.0847i. So (P) fails next to the first zero; the height 282 in Conrey-Li is the first failure on the line Re s = 1, not the first failure in the half-plane. With h = 0.1 the angles are -0.0580, -0.0755, -0.0586: nonzero, so (P) with shift 0.1 fails there as well.

**Lemma 3 (converse of Theorem 2 on kernel spans; ARGUED, one line).** If xi(s)/xi(s + h) has non-negative real part on Re s > 1/2 then the kernel K(w + ih, z) + K(w, z + ih) = W(z + ih) conj W(w + ih) [P(z) + conj P(w)] / (2 pi i (conj w - z - ih)), P = W(z)/W(z + ih), is the product of a rank-one positive kernel and a Nevanlinna kernel of the half-plane Im z > -h/2, hence positive. So the weight-form condition is equivalent to: zero-free in Re s > 1/2 AND (P). Used only to state that the weight-form condition is "RH and (P)", not for any failure claim.

## 3. Stage A (ii): variants

Two-parameter family. E_a(z) = xi(1/2 + a - iz), a > 0. E_a*(z) = E_a(z - 2ai) (functional equation). Zeros at Im z = beta - 1/2 - a.

| Variant | Statement | Functional-equation step | Multiplicativity step | Status |
|---|---|---|---|---|
| V0 | (C), a = 1/2, shift 1 | E*(z) = E(z - i): used in Conrey-Li (2.3) and in "K(w, w+i) != 0 implies Im w = -1/2" | none in Theorem 1 or 2. de Branges' intended proof of (C) from an Euler product: not opened | FALSE for zeta at (N2), zero 34 (OPENED, reproduced) |
| V1a | existence of H(E_a) for 0 < a < 1/2 (E_a Hermite-Biehler) | none needed for existence | none | RESTATEMENT of the zero-free strip beta < 1/2 + a = twin-ladder T3. Closed row |
| V1b | shift condition in H(E_a), shift 2a, a >= 1/2 (space exists unconditionally): Re <F(z), F(z + 2ai)> >= 0 | E_a*(z) = E_a(z - 2ai), same two places | none | implies RH and (N2_{2a}). The proof of Theorem 1 goes through with i replaced by 2ai: K(w, .) for a zero w on Im z = -a is an element whose 2ai-shift is a multiple of E_a(z)/(z - w), in H(E_a); Re K(w, w + 2ai) = Re{xi'(rho) conj xi(rho + 2a)}/(2 pi) (PROVED for this element; kernel value checked numerically at a = 0.75, `checks.py`, agreement 8 digits). FALSE for zeta at h = 2a = 1, 2, 4 (MEASURED, section 5). Not a restatement: strictly stronger than RH |
| V1c | weight form, W = 1/E_a, shift h, any a > 0, h > 0 | not used: Theorem 2 has no symmetry hypothesis | none | by Theorem 2 implies zero-free in Re s > sigma_0 := 1/2 + a - h/2 and Re{xi(s)/xi(s + h)} >= 0 there. For sigma_0 <= 1/2 (h >= 2a): FALSE at the first zero by Lemma 2 (h = 1, 0.1 measured). For 1/2 < sigma_0 <= 1: FALSE by Sarnak's argument: pick sigma in (max(sigma_0, 1 - h), 1) or let sigma -> 1+; Im log zeta(sigma + it) is unbounded in t while Im log zeta(sigma + h + it) is bounded and the gamma phase difference is bounded (ARGUED rel. Bohr, RECALLED). For sigma_0 large enough above 1 the condition holds by absolute convergence and gives nothing (ARGUED: |arg zeta(s)| <= log zeta(sigma); not computed). So the family yields a zero-free half-plane only where one is trivially known: this is requirement R4's wall in this device |
| V2 | weights from the bridge symbol S = N/D, D = F + alpha F', F(z) = xi(1/2 + z) | evenness of F | none (holds for any even F of order one, row G6) | positivity of the bridge energy = Hermite-Biehler property of D = RH. RESTATEMENT of row G6 / node `de-branges-lagarias-hamiltonian`. The shift condition is not formulable: D has no symmetry D*(z) = eps D(z - ih) with h > 0; as h -> 0 the condition degenerates to the norm. In the weight form with W = 1/D and a shift h it is V1c with a zero of D on the boundary, and Lemma 2 applies. Closed row |
| V3a | conductor family, untied: sum over chi of Re <F_chi, F_chi(. + i)>_{H(E_chi)} >= 0 for independent F_chi | each E_chi*(z) = eps_chi E_chi(z - i) | none: the sum does not couple characters | equivalent to V0 for each chi separately (put all but one F_chi equal to 0). FALSE for chi_4 (Conrey-Li, OPENED: zero 1/2 + 67.6369...i; t = 8714.2) |
| V3b | conductor family, tied: one F, weight w(x) = sum over chi (same parity) of |xi(1 - ix, chi)|^-2; weight form with |W|^-2 = w | none | orthogonality of characters turns w into a sum over residue classes of |sum_{n = a (q)} mu(n) n^-s|^2: periodicity enters the weight, and only the weight | Theorem 2 gives: W continues without zeros or poles to Im z > -1/2. W W* = 1/w, so W has a pole where w(z) = 0. For the pair {chi, conj chi} mod 5: w(z) = 0 iff R(s) := [L(s, chi)/L(s, conj chi)] [L(2 - s, conj chi)/L(2 - s, chi)] = -1 with s = 1 - iz, 1/2 < Re s < 1. The second bracket is bounded with bounded logarithm; by joint universality of L(s, chi), L(s, conj chi) (RECALLED: Voronin, Gonek, Bagchi) log of the first bracket approximates i pi + M (s - s_0) on a disc, and Rouche gives a solution for M large. FALSE (ARGUED rel. joint universality; not computed) |

**First lemma (restatements).** V1a = T3 and V2 = G6 are restatements and are closed rows. The shift condition (V0, V1b, V1c, V3) is not equivalent to the Weil form or to T3: it is "zero-free statement AND phase balance at scale h", and the second factor is false. The norm of H(E) carries the weight 1/|xi(1 + it)|^2 (Moebius side on the line Re s = 1), not the Weil functional.

## 4. Stage A (iii): control table

Two readings: the entire-function form (needs E*(z) = eps E(z - ih), i.e. a functional equation) with conclusions (N1), (N2_h); the weight form (formulable for any Dirichlet series with a gamma factor) with conclusions "zero-free in Re s > 1/2" and (P_h).

| Control | Entire-function form | Weight form | First failing step | Different from zeta's step? |
|---|---|---|---|---|
| zeta | formulable | formulable | (N2) at zero 34 (h = 1); (P) at zero 1 | reference |
| DEL (thin prime deletion) | not formulable (no functional equation) | zero at b in (1/2, 1) | zero-free step | yes, but only through its zero; (P) fails as for zeta |
| THIN | not formulable | zero at b | zero-free step | same as DEL |
| U (unimodular twist), window translate | U: not formulable; WT: symmetry s <-> 1 - s - 2 i alpha, a real translate of z | same phase structure as zeta, translated | (N2), (P): the same step as zeta | no |
| sign twist (Liouville) | not formulable | zeta(2s)/zeta(s): zero-free in Re s > 1/2 iff RH | (P), by the same value-distribution argument (ARGUED) | no |
| DH | formulable (eps = 1) | formulable | (N1): off-line zeros (map values re-evaluated: |xi_DH(z)|/|xi_DH(z + 0.01)| = 4.8e-9 and 4.3e-9). On its on-line zeros (N2) fails at the same rate as zeta (section 5) | fails one step earlier, and also at zeta's step |
| backward heat | formulable (even, order one) | formulable | (N1): off-line zeros at the located points of the map. (N2) not run | fails earlier; (N2) NOT RUN |
| E_a control zeta(s+a) zeta(s-a) | formulable | formulable | (N1): zeros on Re s = 1/2 +- a | earlier step |
| T-NR | formulable | formulable | (N1) | earlier step |
| EIS-w | the Theorem-2 function xi(s)/xi(s + 1) is the Eisenstein scattering coefficient phi at u = 2s - 1. The true property is contractivity (|xi(u)| < |xi(u + 1)| for Re u > 0, classical and RH-neutral); (P) asks for accretivity (positive real part), which is false. No off-resonance reading changes this | same | (P) | no |
| interpolation twin | not formulable | zero at the prescribed point | zero-free step | through its zero only |
| LAT (auxiliary, this lane): E(z) = sin(L(z + i/2)), zeros x_n = n pi/L on Im z = -1/2 | all hypotheses of Theorem 1 hold (eps = 1) | Re{sin(u + iL)/sin u} = cosh L + sinh L Re(i cot u) >= cosh L > 0 for Im u > 0 | **none: passes every step** (PROVED for (P) and (N2); numeric minimum of Re over 20000 random (L, u): 1.0006) | passing control |
| GAM (auxiliary): g(s) + g(1 - s), g = s(s-1) pi^(-s/2) Gamma(s/2) | formulable; all zeros used are on the line | fails Lemma 2 (drift h pi/4 != 0) | (N2_h) holds at every zero tested for h <= 1 with margin cos(h pi/4): 0.7043 to 0.7060 at h = 1; boundary at h = 2 (MEASURED) | passes the entire-function necessary condition for h < 2 |

Reading. Every control with zeros off the line fails at (N1), which is the conclusion one wants, not a step of a proof. At the step where zeta fails, the controls that share zeta's value distribution (U, WT, Liouville, DH on its on-line zeros) fail in the same way. The functions that pass (N2) are those without arithmetic fluctuation of the zero counting function: LAT passes everything, GAM passes (N2_h) for h < 2. No Euler product is used anywhere in the device, and the property the device tests (bounded imbalance of zeros at scale h, at every zero) is the property an Euler product destroys.

By the stage-A rule the lane stops: a control (LAT) passes every step, and zeta itself does not. Device registered as closed.

## 5. Numeric screen (MEASURED; a screen, not a verdict)

Quantity: q_h(rho) = -Re{X'(rho) X(rho + h)} / (|X'(rho)| |X(rho + h)|) = cos Delta_h, at zeros on the line; (N2_h) holds iff q_h >= 0. Count of zeros failing / zeros tested, and the minimum of q_h.

| Function, window | zeros | h = 0.1 | 0.25 | 0.5 | 1 | 2 | 4 |
|---|---|---|---|---|---|---|---|
| zeta, zeros 1-100 (t 14 to 237) | 100 | 0 (min 0.976) | 0 (0.860) | 0 (0.532) | 2 (-0.178) | 50 (-0.945) | 99 |
| zeta, zeros 620-680 (t 964 to 1038) | 61 | 0 (0.951) | 0 (0.734) | 0 (0.259) | 6 (-0.477) | 33 | 57 |
| zeta, zeros 10112-10172 (t 9973 to 10024) | 61 | 0 (0.944) | 0 (0.696) | 0 (0.145) | 7 (-0.655) | 29 | 55 |
| GAM, t 10-200 | 79 | 0 (0.988) | 0 (0.974) | 0 (0.918) | 0 (0.704) | 0 (0.0096) | 79 |
| GAM, t 1000-1040 | 32 | 0 | 0 | 0 (0.922) | 0 (0.705) | 12 (-0.0007) | 32 |
| GAM, t 10000-10030 | 35 | 0 | 0 | 0 (0.923) | 0 (0.706) | 31 (-0.0014) | 35 |
| DH, on-line zeros, t 1-200 | 122 | 0 (0.967) | 0 (0.817) | 0 (0.454) | 2 (-0.189) | 54 | 122 |
| DH, on-line zeros, t 1000-1020 | 17 | 0 (0.693) | 0 (0.301) | 0 (0.016) | 3 (-0.335) | 10 | 16 |
| DH, on-line zeros, t 10000-10008 | 11 | 0 (0.900) | 0 (0.560) | 0 (0.058) | 2 (-0.629) | 5 | 10 |

- The device does not separate zeta from DH: on on-line zeros the failure counts are the same within the sample (h = 1: 2/100 against 2/122 at low height; 6/61 against 3/17 near 1000; 7/61 against 2/11 near 1e4).
- For zeta the minimum of q_{0.5} falls with height (0.532, 0.259, 0.145). No failure at h <= 0.5 was found below 1e4. A failure at fixed h < 1 at larger height is expected from the unboundedness of S(t + h) - S(t) (ARGUED; RECALLED: Selberg, Tsang), and is not established here.
- GAM follows cos(h pi/4): the gamma side alone moves the phase by h pi/4, and the condition has room pi/2 - h pi/4 for the arithmetic part.
- Backward heat: not evaluated (needs the kernel quadrature); it fails at (N1) by the located off-line zeros.

## 6. Requirement flags

- R1 (multiplicativity essential): **false.** No step of Theorems 1, 2 or of any variant uses the Euler product. The only place multiplicativity enters this lane is the failure: independence of the p^(it) (Bohr) makes arg zeta unbounded on lines in 1/2 < Re s < 1, which contradicts (P). In V3b periodicity enters the weight only, and joint universality then breaks the conclusion.
- R2 (height-uniform, every window): **false.** The condition is a statement at every zero, so it has the right shape, but it is false; the failure itself is not uniform in h below 1e4 (h <= 0.5 not seen to fail).
- R3 (controls fail structurally): **false.** LAT passes every step; GAM passes (N2_h) for h < 2; U, WT, the Liouville twist and DH on its on-line zeros fail at the same step as zeta.
- R4 (reaches the critical line): **false.** In the family V1c the condition can hold only for a conclusion half-plane sigma_0 above 1; for sigma_0 <= 1 it is false.

## 7. Verdict

Stage A does not pass; no stage B. Closed device row proposed for the map (not applied; this lane does not edit the map):

> de Branges shift positivity (entire-function form with structure function xi(1/2 + a - iz) and shift 2a; weight form with any (a, h); bridge-symbol weight; conductor family). Equals "zero-free statement AND phase balance at scale h at every zero" (Delta_h in [-pi/2, pi/2] in the entire-function form; Delta_h = 0 in the weight form). False for zeta: zero 34 at h = 1 (Conrey-Li, opened, reproduced); weight form at zero 1 (Lemma 2); two-parameter weight form false for every conclusion half-plane sigma_0 <= 1 (rel. Bohr). V1a = T3, V2 = G6 restatements. Passing control: lattice zeros (sine), gamma-only fake for h < 2. No Euler-product step. Status: PROVED (Lemmas 1, 2; LAT), OPENED (Theorems 1, 2 and the two counterexamples), ARGUED (V1c for 1/2 < sigma_0 <= 1, V3b), MEASURED (table).

No pivot taken: the adjacent idea (replace accretivity by contractivity of the shift, i.e. |xi(u)| < |xi(u + 1)|) is the classical Hermite-Biehler property of E and is RH-neutral; the other adjacent idea (Hermite-Biehler property of Xi + i Xi') is row G6.

## 8. Three weakest steps

1. V1b: the extension of Theorem 1 to shift 2a was checked only for the necessary condition (N2_{2a}) (the kernel element and its shifted image), and the kernel value numerically at one a. The implication "(C_a) implies zeros on the line" was not re-derived for general a; it is not needed for the failure claim. The hypothesis "|E_a(x + iy)| strictly increasing in y > 0" for a >= 1/2 is taken from the product formula as in Conrey-Li for a = 1/2 and was not re-proved for a > 1/2.
2. V1c for 1/2 < sigma_0 <= 1 and V3b rest on value-distribution theorems recalled and not opened (Bohr density of log zeta on vertical lines; joint universality of Dirichlet L-functions), and on a Rouche step written in one line. V3b also assumes the tied space is the weight space F(W) with |W|^-2 = w; no computation was run for it.
3. The statement that (N2_h) fails for every fixed h > 0 at some height is ARGUED from the unboundedness of S(t + h) - S(t) and the wrap of Delta_h mod 2 pi; below 1e4 the screen found failures only for h >= 1. Lemma 1's numerical check used a truncated zero sum with a tail estimate (differences up to 1.4e-2). The backward-heat evaluation of (N2) was not run. The DH windows are short (17 and 11 on-line zeros), and on-line zeros of DH were found by sign changes on a grid, so close pairs may be missed.
