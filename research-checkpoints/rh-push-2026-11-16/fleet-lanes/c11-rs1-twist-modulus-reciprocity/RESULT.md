# c11-rs1-twist-modulus-reciprocity: reciprocity that exchanges the Moebius twist with the modulus

Date 2026-11-19. Kind: explore (device design, read set RS-1). Stage A only (paper), plus numeric checks of the lemmas (local, memcap 8 GB, 2 s). Stage B was not run: the stage-A table has controls that pass every step. No server job was started. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED / CLASSICAL / ARGUED / RECALLED / MEASURED / OPEN. No independent referee ran in this lane (see REFEREE.md).

Verdict: **precise obstruction; device closed at the decisive test.** The T-NR twin passes every step of the device (PROVED in the s = 1 model, checked numerically; the same algebra at the centre, relative to the exact formula of Bettin, not opened). E_a with real a passes every step on its own central line (PROVED from the functional equation of Dirichlet L-functions; checked numerically). The window translate passes every step. The functional equation of the target enters in zero conditions at height T; the functional equation that the reciprocity uses is that of the twists, in the conductor aspect.

What the lane adds to the record:
1. First lemma, as assigned: under this reciprocity the ledger map is not A -> A. The Moebius variable becomes the modulus (Theorem 2, a three-term identity; PROVED at s = 1).
2. The wall of the n4 lane returns in the same words after the move: Moebius weights on the moduli, characters of conductor >= length (section 4).
3. A zero-one law (Lemma 4, PROVED): for twist length X >= p - 1 the candidate inequality with free weights is equivalent to its conclusion. The range A >= 1 that the device needs is the range in which it is a restatement.

Row for the map:

> Twist-modulus reciprocity for twisted second moments of Dirichlet L-functions (Conrey, Young, Bettin; Dedekind-Rademacher at s = 1) applied to the family-positivity mollifier device. Device: J_p(s; a) = 1 - sum_{chi mod p} abs(F(s, chi) A_chi(s) - 1)^2 > 0 implies F(s, chi) != 0 for all chi mod p. The reciprocity moves the Moebius variable l into the modulus: (modulus p; twists l1, l2) -> (modulus l1; twists l2, p mod l1) + (modulus l2; twists p mod l2, l1), exact at s = 1 with remainder (l1^2 + l2^2 + p^2)/(12 l1 l2 p) - 1/4. The dual carries Moebius signs on the moduli and characters of conductor >= length. For X >= p - 1 and free weights sup_a J_p = 1 if no F(s, chi) vanishes and <= 0 otherwise (finite Fourier inversion): no margin. T-NR passes every step (finite Hecke polynomial at q: twists h q^j); E_a, a real, passes on its central line (shifted positivity from the functional equation of the twists); window translate passes (the device is covariant in t and in sigma). The target's functional equation is not read. Closed by: periodicity plus the functional equation of the twists is the read set of the 7/8 mechanism (map item (d)); RS-1 is not reached by this device.

## 0. Plan, and answers to the three questions before work

Read: BRIEF.md (all), STRATEGY.md sections 0, 1, 3.1 item 25, 4.0 (CROSS-1), map section 2 (controls) and rows P14, P15, P26, Z28, Z29, G31, D5; `n4-spectral-window-moebius/RESULT.md`; `c10-spectral-reciprocity-signed-moduli/RESULT.md`; engine nodes `cotangent-reciprocity-period-function`, `bettin-conrey-intercept`. Not opened: Conrey (2007), Young (2011), Bettin (2016), Bettin-Conrey (2013), Rademacher (1954), Berndt's papers on Dedekind sums with characters. Statements taken from them are marked "relative to".

New against the map: item 25 closed lead 4 because every reciprocity tried there acts on the L-value variable and leaves l a parameter. This lane takes the one reciprocity on file whose statement exchanges the twist with the modulus.

- Q1 (controls): section 5. T-NR, E_a (real a), WT pass every step.
- Q2 (height-uniform, every window): the device is a pointwise implication at each s (positivity dropped to one member), so it is every-window in form. No bound is proved.
- Q3 (multiplicativity): step S3 (the weights are those of 1/F(s, chi), linear in chi(l) by complete multiplicativity of chi and the Euler product of F). It is not used by S1, S2, S4, and Lemma 4 removes it for X >= p - 1.
- R4 (crossing): the device would give F(s) != 0 at a point s with Re s < 1 if J_p(s; a) > 0 were proved there. Not obtained; section 4.

## 1. Stage A (i): the candidate inequality

Target F(s) = sum f(n) n^-s (for zeta, f = 1). Modulus: a prime p. Twists F(s, chi) = sum f(n) chi(n) n^-s, chi mod p; for zeta, F(s, chi_0) = zeta(s)(1 - p^-s). Weights a_l, l <= X, (l, p) = 1; A_chi(s) = sum_l a_l chi(l) l^-s. X = p^A.

**Candidate (C).** J_p(s; a) := 1 - sum_{chi mod p} abs(F(s, chi) A_chi(s) - 1)^2.

**Lemma 0 (PROVED, one line).** If J_p(s; a) > 0 then abs(F(s, chi) A_chi(s) - 1) < 1 for every chi mod p; in particular F(s, chi) != 0 for every chi, and zeta(s) != 0 when F = zeta. (Each term of a sum of non-negative terms is at most the sum.)

The variable moved by the reciprocity is l: expand

sum_chi abs(F A_chi - 1)^2 = sum_{l1, l2} a_{l1} conj(a_{l2}) l1^-s l2^-conj(s) M_s(l1, l2; p) - 2 Re sum_l a_l l^-s N_s(l; p) + (p - 1),

M_s(l1, l2; p) = sum_{chi mod p} abs(F(s, chi))^2 chi(l1) conj(chi(l2)),  N_s(l; p) = sum_chi F(s, chi) chi(l).

M_s is the twisted second moment mod p with twist l1 l2bar. The reciprocity (step S4 below) rewrites M_s(l1, l2; p) through second moments to the moduli l1 and l2.

Steps of the device:

| Step | Content | Status |
|---|---|---|
| S0 | twists F(s, chi) exist: F is an ordinary Dirichlet series | definition |
| S1 | positivity and isolation (Lemma 0) | PROVED |
| S2 | expansion into M_s and N_s | PROVED (algebra) |
| S3 | weights a_l = mu(l) P(log(X/l)/log X): the coefficients of 1/F(s, chi) are mu(l) chi(l) | uses the Euler product of F and complete multiplicativity of chi |
| S4 | reciprocity: M_s(l1, l2; p) = main terms - (second moments mod l1 twisted by l2, p) - (mod l2 twisted by p, l1) + remainder | PROVED at s = 1, odd characters (Theorem 2). At s = 1/2 + it: relative to Conrey, Young, Bettin (remainder = period function, analytic in h/k) |
| S5 | the bound J_p(s; a) > 0 at some s with Re s < 1 | OPEN; not obtained |

## 2. First lemma: the ledger map is not A -> A

Notation: ((x)) the sawtooth function; s(a, b; c) = sum_{m mod c} ((ma/c)) ((mb/c)) (Rademacher); s(h, k) = s(h, 1; k) the Dedekind sum; s(a, b; c) = s(a bbar, c) for (b, c) = 1 (substitute m -> m bbar).

**Lemma 1 (CLASSICAL; re-derived; checked).** For a prime p and (h, p) = 1:
sum_{chi odd mod p} chi(h) abs(L(1, chi))^2 = pi^2 (p - 1) s(h, p) / p.

Proof. For odd chi mod p, L(1, chi) = (pi/(2p)) sum_{a=1}^{p-1} chi(a) cot(pi a/p) (pair n = a and n = p - a in each class). Orthogonality on odd characters: sum_{chi odd} chi(x) conj(chi(y)) = ((p-1)/2)(1[x = y] - 1[x = -y]) mod p. Hence the left side is (pi^2 (p-1)/(4p^2)) sum_a cot(pi a/p) cot(pi a h/p) = (pi^2 (p-1)/(4p^2)) 4p s(h, p). The two inputs are the cotangent expansion (Poisson summation in one residue class, coefficients of F constant on the class) and periodicity of chi. Check: `checks.log` part B, p in {7, 11, 13, 29}, all h, L(1, chi) from the digamma function, Dedekind sums from the sawtooth definition: maximal difference 3.6e-29.

**Theorem 2 (three-term reciprocity for odd second moments at s = 1). PROVED from Lemma 1 and Rademacher's three-term law (CLASSICAL, relative to Rademacher 1954; checked exactly here).** For distinct odd primes a, b, c put M(a, b; c) = sum_{chi odd mod c} abs(L(1, chi))^2 chi(a) conj(chi(b)). Then

(c/(c-1)) M(a, b; c) + (a/(a-1)) M(b, c; a) + (b/(b-1)) M(c, a; b) = pi^2 [ (a^2 + b^2 + c^2)/(12 abc) - 1/4 ].

Proof. Lemma 1 gives (c/(c-1)) M(a, b; c) = pi^2 s(a bbar, c) = pi^2 s(a, b; c); Rademacher: s(a, b; c) + s(b, c; a) + s(c, a; b) = (a^2 + b^2 + c^2)/(12abc) - 1/4 for pairwise coprime a, b, c. Checks: the three-term law in exact rational arithmetic on 1515 pairwise coprime triples with a <= b <= 30, c in {7, 11, 13, 101, 211, 499}: 0 mismatches (`checks.log` part A). The statement of Theorem 2 itself on six prime triples with L(1, chi) from the cotangent formula and no Dedekind sums: agreement to 6e-29 (`ref_check.log`). For composite l the same holds with the Moebius sum over divisors of the modulus that comes from the condition (m, modulus) = 1 (not written out; weak step 2). Novelty not checked (identities of this type are in the literature on Dedekind sums and mean values of L(1, chi)).

**Consequence for the ledger (PROVED at s = 1).** With c = p, a = l1, b = l2:

(p/(p-1)) M(l1, l2; p) = pi^2 [ p/(12 l1 l2) + l1/(12 l2 p) + l2/(12 l1 p) - 1/4 ] - (l1/(l1-1)) M(l2, p; l1) - (l2/(l2-1)) M(p, l1; l2).

- p/(12 l1 l2): the diagonal m l1 = n l2 of the family mod p (zeta(2)/(2 l1 l2), odd half).
- M(l2, p; l1): second moment over odd characters mod l1 twisted by chi(l2) conj(chi(p)); it depends on p only through p mod l1.
- Map: (modulus p; twists l1, l2 <= X) -> (modulus l1; twists l2, p mod l1) + (modulus l2; twists p mod l2, l1). The Moebius variable l1 has become the modulus and the old modulus a twist. This is not the map A -> A of `c10-spectral-reciprocity-signed-moduli` (there l is a parameter of Lemma R). The three roles are permuted cyclically; the identity is symmetric, and the symmetric point is p = l1 = l2 in size, A = 1.
- Term counts: left side p terms per pair (l1, l2); right side l1 + l2 terms. The dual is shorter exactly when X < p (A < 1).
- Iterating with reduction mod the new modulus is the Euclidean algorithm on (l1 l2bar mod p)/p (the engine node's O(log q) evaluator): s(h, k) is the alternating sum of partial quotients up to bounded terms (CLASSICAL, recalled).

At s = 1/2 + it (RECALLED, relative to Conrey 2007, Young 2011, Bettin 2016, not opened): for coprime h, k the normalised moments satisfy a two-term relation (modulus k twisted by h against modulus h twisted by -k) with explicit main terms, a term carrying zeta(1/2)^2, and a remainder that extends to a continuous (Bettin: analytic period-type) function of h/k; Bettin's exact form includes shifts. The structure used below (which variable becomes the modulus; meromorphy in the shifts; finite Hecke combinations) is the same; the constants are not used.

## 3. Stage A (ii): where multiplicativity and the functional equation enter

- **Multiplicativity: step S3 only.** S1, S2 hold for every sequence a_l and every F. S4 uses periodicity (chi and the coefficients of F constant on residue classes), not multiplicativity of F. Lemma 4 below shows that for X >= p - 1 step S3 is not needed for the candidate to hold with some weights.
- **Functional equation of the twists: step S4.** The cotangent expansion at s = 1 is the Hurwitz/Estermann functional equation in its elementary form; at s = 1/2 + it the reciprocity is proved from the functional equation of the Estermann function (relative to the sources), equivalently of the L(s, chi) mod p, mod l1, mod l2. This is the conductor aspect: about p + l1 + l2 conditions at the one height t, none coupling different heights.
- **Functional equation of the target (s <-> 1 - s for zeta): zero conditions.** In the form (C) at Re s = sigma > 1/2 the quantities are abs(L(sigma + it, chi))^2; S1, S2, S4 hold verbatim at every sigma (shift pair (alpha, conj(alpha))). The principal character contributes the single number zeta(s). Count at height T: 0, against the sqrt(T)/log T of CROSS-1 item 1. Two consequences, used in the table: the device is covariant under t -> t + alpha (window translate) and under sigma -> sigma + a (Lemma 3).

So the device joins periodicity with the functional equation of the twists, which is map item (d) (the read set of the 7/8 mechanism), and does not join either with the functional equation of the target. It is not an RS-1 device in the sense of CROSS-1 item 1.

## 4. The bound S5: what the moved variable costs, and the zero-one law

**Dual side after the move (PROVED identity at s = 1; size statements ARGUED).** Summing the consequence of Theorem 2 against real weights a_{l1} a_{l2}/(l1 l2) (prime l for simplicity), the dual part is

D = sum_{l1} (a_{l1}/l1) (l1/(l1-1)) sum_{chi odd mod l1} abs(L(1, chi))^2 conj(chi(p)) B_chi,  B_chi = sum_{l2} a_{l2} chi(l2)/l2,

plus the same with l1, l2 exchanged. That is: a sum over all moduli l1 <= X, with the Moebius weight a_{l1} on the modulus, of character sums in which the inner Moebius sum B_chi has length X against conductor l1 up to X. This is the n4 wall in the same words ("Moebius cancellation against characters of total conductor >= length, summed with signs over the moduli"), with the roles produced by the move rather than by Kuznetsov.

Sizes. In the s = 1 model the weights 1/l make D trivially small (abs(s(h, l)) <= l/12 gives D << X log X against a main term of order p), so the edge model has no barrier below A = 1; it tests the identities and the ledger map, not lengths. At the centre, in Conrey's normalisation (recalled, relative to the source) the dual of the moment with a single twist h < p is O(sqrt(h) log h) by the trivial bound, against a main term sqrt(p/h) log(p/h): the two are equal at h = sqrt(p). With h = l1 l2 up to X^2 the reciprocity with a trivial bound on the dual covers A < 1/4, less than the diagonal method (A < 1/2). Beyond that the signed sum over moduli is needed. No exponent for the signed sum was derived.

**Lemma 4 (zero-one law at A >= 1). PROVED (finite Fourier inversion); checked.** Let X >= p - 1 and let F(s, chi), chi mod p, be any p - 1 complex numbers (any target, any control).
(a) If F(s, chi) != 0 for all chi, the weights a_l = l^s (p-1)^-1 sum_chi conj(chi(l))/F(s, chi), 1 <= l <= p - 1, give F(s, chi) A_chi(s) = 1 for every chi, so J_p(s; a) = 1.
(b) If F(s, chi_1) = 0 for some chi_1, then J_p(s; a) <= 0 for every a.
Hence for X >= p - 1: sup_a J_p(s; a) is 1 or <= 0, and "there are weights with J_p > 0" is equivalent to "no F(s, chi) vanishes". Check: `checks.log` part G, p = 7 at s = 0.75 + 3i and p = 13 at s = 0.6 + 14.2i: sum_chi abs(F A - 1)^2 = 2.5e-60 and 3.3e-58, max abs(a_l) = 1.65 and 3.59.

Reading. With free weights and A >= 1 the candidate is a restatement of its conclusion (no margin, and no step that reads arithmetic). With the weights fixed to Moebius weights it is the statement that truncated Moebius sums in every residue class mod p, with p <= X, are small at Re s < 1: the family statement with conductor <= length. The reciprocity does not help there: for A > 1 the dual moduli l1 <= X exceed p and the dual is longer (section 2).

**Range A < 1 (ARGUED).** sum_chi abs(F A_chi - 1)^2 = sum_chi abs(F(s, chi))^2 abs(A_chi - 1/F(s, chi))^2 >= min_chi abs(F(s, chi))^2 (p - 1) dist^2, where dist is the distance in l^2((Z/p)^*) from the class vector beta_r = sum_{n = r mod p} mu(n) n^-s to vectors supported on r <= X. The classes X < r < p are not reachable, and beta_r = mu(r) r^-s + (terms n >= p + r), so dist^2 is about sum_{X < r < p} mu(r)^2 r^{-2 sigma}, of order X^{1 - 2 sigma} for sigma > 1/2. Then J_p > 0 needs p X^{1 - 2 sigma} min abs(F)^2 << 1, that is A (2 sigma - 1) > 1 up to the size of min abs(L(s, chi)): with A < 1 this forces sigma > 1. This is the abscissa 1/2 + 1/(2A) of the n4 ledger. Not proved: the tail terms of beta_r and the lower bound for abs(L(s, chi)) are assumed of the expected size.

Together: where the reciprocity gives a shorter dual (A < 1) the candidate cannot hold left of 1 (argued); where the candidate can hold left of 1 (A >= 1) it is equivalent to its conclusion for free weights (proved) and the dual is longer. The fixed point A = 1 of the three-term symmetry is the same threshold.

## 5. Stage A (iii): control table

Steps S0 to S4 as in section 1. "First failing step" means the first step that is false or not available for the control; S5 (the unproved bound) is not counted as a step that separates.

| Control | First failing step | Reason | Status |
|---|---|---|---|
| DEL (thin prime deletion) | S4 | coefficients not constant on residue classes mod p: the cotangent/Poisson evaluation of Lemma 1 is false for it; S0 to S3 hold (ordinary Dirichlet series, completely multiplicative, weights of 1/F) | PROVED for S0 to S3; S4 failure by inspection of the proof of Lemma 1 |
| THIN | S4 | same | same |
| U (unimodular completely multiplicative twist, not a Dirichlet character) | S4 | same | same |
| sign twist (TW+, TW-, Liouville) | S4 | same | same |
| DH | S3, and only if the weights are required to be Moebius weights | coefficients periodic mod 5, so S4 holds to the modulus 5p (Dedekind sums with characters; relative to Berndt, not opened; ARGUED). S1, S2 hold. 1/DH has no Euler product; by Lemma 4 the candidate with free weights does not need S3 | ARGUED |
| E_a, a real | none (on its central line) | Lemma 3 below | PROVED; checked |
| T-NR | none | Lemma 5 below | PROVED at s = 1; checked. At the centre relative to Bettin |
| EIS-w (complex parameter, Im a != 0) | S1 as a degree-two object | the form is L(1/2 + a + it, chi) conj(L(1/2 + conj(a) + it, chi)), not a square (`checks.log` part F: values 0.23 - 1.48i, 0.29 - 0.0007i, 0.46 + 1.21i at p = 7). As the degree-one function zeta(s + a) it is a translate in sigma and t and passes S0 to S4 | PROVED (FE of the twists) + MEASURED instance |
| window translate zeta(s + i alpha) | none | (C) for zeta(s + i alpha) at s is (C) for zeta at s + i alpha with weights a_l l^{-i alpha}; S0 to S4 are covariant. WT has no off-line zeros of its own; what it shows is that no step reads the functional equation of the target | PROVED (substitution) |
| interpolation twin zeta + c L(s, chi_-4) L(s, chi_5) | S3 (no Euler product); with free weights S4 | abs(F(s, chi))^2 contains abs(L(s, chi chi_-4) L(s, chi chi_5))^2, a degree-four moment with no twist-modulus identity on file | ARGUED |
| backward heat | S0 | no fixed ordinary Dirichlet series, so no twists by chi. Not formulable; by map rule Q1 this is not a quantitative handle | definition |
| Beurling, phase-rotated transfer operator, theta^w | S0 | no integers / no Dirichlet twists; not formulable | definition |

**Lemma 3 (E_a, real a, passes on its central line). PROVED (functional equation of L(s, chi), CLASSICAL); checked.** For primitive chi mod p, real a, real t: L(1/2 - a + it, chi) = eps_chi g(a, t; p, parity) conj(L(1/2 + a + it, chi)), with eps_chi the root number and g independent of chi within a parity class, g(a, 0) > 0. Hence, for the twists E_a(s, chi) = L(s + a, chi) L(s - a, chi),

conj(eps_chi) E_a(1/2 + it, chi) = g abs(L(1/2 + a + it, chi))^2.

For a = 0 this is the form abs(L(1/2 + it, chi))^2 of the device for zeta at the centre. So the device for E_a on Re s = 1/2 is, up to the factor g on each parity class, the device for zeta on Re s = 1/2 + a: S1 (positivity) holds by the functional equation of the twists alone, S2 is algebra (the two parity classes carry different factors g and are treated separately, as in Lemma 1, which is the odd class), S3 holds with the weights of 1/E_a(s, chi) (linear in chi(l)), S4 holds because the identity is the same identity at the shift a. This is statement C1 of the c10 lane in the Dirichlet family. Check (`checks.log` part D): [L(1/2 - a, chi)/conj(L(1/2 + a, chi))] / [same at a = 0] for p = 7, 13 and a = 0.2, 0.35: real to 1e-30, equal across all characters of a parity class (even 0.4805, odd 0.9430 at p = 7, a = 0.2), positive. Off its central line the form for E_a is not a square (part E: values with imaginary parts of order 1).
What this shows: no step S0 to S4 changes at sigma = 1/2. As in c10, E_a is not a refutation of a bound at a = 0; it shows that the chain cannot locate the critical line.

**Lemma 5 (T-NR passes S0 to S4). PROVED (elementary) in the s = 1 model; checked.** The twin is xi(s)(2 cosh((s - 1/2) log q) + c) = q^{s - 1/2} xi(s) (1 + c q^{1/2 - s} + q^{1 - 2s}); as a Dirichlet series X(s) = zeta(s) P_s(q^-s) with P a fixed quadratic polynomial at the prime q, and X(s, chi) = L(s, chi)(u_0 + u_1 chi(q) + u_2 chi(q)^2), u = (1, c q^{1/2 - s}, q^{1 - 2s}). For q != p:

sum_chi abs(X(s, chi))^2 chi(h) = sum_{i, j in {0,1,2}} u_i conj(u_j) M_s(h q^{i - j}; p),

a combination of nine twisted second moments of the zeta family with twists h q^j, abs(j) <= 2. So S1 and S2 hold as for every F; S3 holds (1/X(s, chi) has coefficients linear in chi(l), supported on l = d q^j, d squarefree); S4 holds term by term (Theorem 2 with a = l1 q^i, b = l2 q^j after removing common factors). The twin has zeros at Re s = 1/2 +- arccosh(abs(c)/2)/log q; at such a zero s_0 with Re s_0 in (1/2, 1), X(s_0, chi_0) = 0 and J_p(s_0; a) <= 0 for every a (Lemma 4 (b)): S5 is false for the twin there. Check (`checks.log` part C): the nine-term identity at s = 1 over odd characters for (p, q, c) = (29, 2, 3), (29, 3, -2.5), (13, 2, 3), (29, 3, 2.2), (31, 5, 2.1), all h: differences below 5e-28, values up to 180 (not identically zero). Zeros of the last two twins: Re s = 0.9038 and 0.6957, inside the strip.
At s = 1/2 + it the same nine-term algebra applies to the exact formula of Bettin (relative to; the formula is stated for general coprime h, k).

**Decisive test: outcome.** T-NR passes every step; E_a (real a) passes every step on its central line; the window translate passes every step. Under the stop rule the device row at the top is written and stage B is not run. Nothing in S0 to S4 distinguishes zeta from the T-NR twin; the difference is only in the truth of S5 (for the twin, the weights of 1/X have size q^{j sigma_q} on powers of q, where the local parameter is not unimodular).

## 6. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | not established | Multiplicativity enters only at S3 (choice of weights). By Lemma 4 the candidate with free weights at X >= p - 1 does not need it. No result about zeta is derived. |
| R2 height-uniform, every window | not established | Lemma 0 is a pointwise implication at every s, so the form is every-window; the hypothesis J_p > 0 is not proved at any point left of 1. |
| R3 fails for every control | no | T-NR (Lemma 5), E_a with real a (Lemma 3) and the window translate pass S0 to S4. DH is stopped only by S3. |
| R4 reaches the critical line | no | Section 4: for A < 1 the candidate forces sigma > 1 (argued); for A >= 1 with free weights it is equivalent to its conclusion (proved). The target's functional equation is read in 0 conditions (section 3). |

## 7. Pivot (considered; not run)

The adjacent object in which both variables of the reciprocity are Moebius variables is the Nyman-Beurling/Baez-Duarte Gram matrix: its entries are integrals of abs(zeta(1/2 + it))^2 (h/k)^{it} over all heights and equal Vasyunin cotangent sums c_0(h/k), c_0(k/h) (relative to Bettin-Conrey; engine node `cotangent-reciprocity-period-function`). There the target's values at all heights are tied to sums to the moduli h and k, and the reciprocity is the symmetry h <-> k of the matrix with the period function as remainder. It is on file and closed: map rows P14 (rate law, loop map f(theta) = theta), P15 (Route M first moment, mean values only), section 4 entries 40, 42. It is a criterion with no margin (weight 1/abs(s)^2 over all heights, not every-window), and T-NR passes it in the same way as Lemma 5 (Gram entries b(h q^i, k q^j)). Not stronger than what is closed; no pivot run.

## 8. Three weakest steps

1. Everything at s = 1/2 + it is relative to Conrey, Young and Bettin, none opened: the two-term form, the claim that the exact formula is meromorphic in the shifts, and the claim that it applies to the twists h q^j of Lemma 5. The proved statements (Lemma 1, Theorem 2, Lemma 5) are at s = 1 over odd characters, where the principal character and the target zeta do not occur at all. The transfer of the table from the s = 1 model to the centre is ARGUED from the structure of the proofs (periodicity plus the functional equation of the twists), not derived.
2. Section 4, range A < 1: the lower bound for the distance uses the expected size of the class sums beta_r and of min abs(L(s, chi)); neither is proved. The size statements for the dual side at the centre (trivial range A < 1/4) rest on Conrey's normalisation as recalled; no exponent for the signed sum was derived, and the three-term form with two twists was proved only at s = 1. Theorem 2 is stated for primes; the composite case (needed for squarefree l) is described, not written. Its novelty is not checked.
3. The DH row (S4 to the modulus 5p through Dedekind sums with characters) and the interpolation-twin row are argued, not derived or computed; "no twist-modulus identity on file for degree four" is a statement about the sources recalled, not a theorem. The EIS-w row reads the control as the Eisenstein L-function zeta(s + a) zeta(s - a) with complex a; the device has no modular surface, so the row tests less than the map's definition of EIS-w.

## 9. Files

- `RESULT.md` (this file); `REFEREE.md` (author second pass; no independent referee).
- `checks.py`, `checks.log`: parts A (three-term law, exact), B (Lemma 1), C (Lemma 5), D, E (Lemma 3), F (EIS-w instance), G (Lemma 4). Run: `scripts/memcap.sh 8 .venv-arb/bin/python -u tmp/research-2026-11-16/push/c11-rs1-twist-modulus-reciprocity/checks.py` (2 s, under 50 MB).
- `ref_check.py`, `ref_check.log`: Theorem 2 on six prime triples from the cotangent formula.
- Process note: the first launch of `checks.py` used a slow Dirichlet-series routine and was stopped by its recorded PID (86986) after 4 minutes; the routine was replaced by Hurwitz zeta/digamma evaluations. No other process was touched.
