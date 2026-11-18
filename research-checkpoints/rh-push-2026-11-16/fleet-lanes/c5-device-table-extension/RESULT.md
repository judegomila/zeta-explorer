# c5-device-table-extension: seven crossing devices absent from the roadmap table

Date 2026-11-18. Lane kind: explore. Nothing here is a statement about zeros of zeta. RH is open.
Labels: PROVED (derived here, elementary) / CLASSICAL (literature, cited from memory, not re-read) / MEASURED (mpmath, not interval-certified) / ARGUED / OPEN.

## Verdict

**Precise obstruction: seven map rows, no CANDIDATE.** Each of the seven devices was put to the three questions of `OBSTRUCTION_MAP.md` section 2 and to the controls. None carries a one-sided inequality from Re s > 1 or from finite stages to the critical line. Each lands in one of four classes that the map already has, at a named step:

| Class | Devices | What the device reads | Control that passes at every step |
|---|---|---|---|
| frequency-only | (a) Baker, (f) Turan power sums (finite form) | the exponents log n and the number of terms; never the coefficients | DH, TW+, TW-, THIN, U, WT |
| discrete special values | (e) p-adic interpolation, Iwasawa module | zeta at s = 0, -1, -2, ... | new control: interpolation twin zeta + c L(s, chi_-4) L(s, chi_5) |
| size of local parameters | (d) tensor-power squeeze | abs(alpha_p) at each prime | TW+, TW-, THIN, U, WT (unimodular parameters) |
| identity or criterion in the zeros | (c) Carleson / corona / interpolation for S, (g) strip Dirichlet-to-Neumann identity, (f) Turan's prime-sum equivalence | the zero set itself | DH, HEAT, E_a, NR (identity holds with their zeros) |
| additive against multiplicative | (b) sum-product | interval sums of n^{it} and the 3-4-1 step | none: it is Vinogradov-Korobov, which crosses Re s = 1 by (log t)^{-2/3} only |

Two items are new relative to the map: the control "interpolation twin" (section (e)), and the strip identity of section (g) with its measured size (the prime-side term T_b is 0.74, 0.32, 0.11, 0.10 of the mean phase derivative at T = 10^2, 10^3, 10^4, 10^5 for alpha = 1, b = 1/2; the model value is 1/(b alpha lam^2), lam = (1/2) log(T/2 pi)). Requirement flags: r1 false, r2 false, r3 false, r4 false.

## Plan

For each device: (1) the inequality it could carry across Re s = 1; (2) the three questions Q1 (controls), Q2 (height-uniform, every window), Q3 (where multiplicativity enters); (3) verdict with row text. The decisive tests were run first, one per class:

- T1 (class "discrete special values"): build a function with the p-adic data of zeta and a zero at a prescribed point of the strip.
- T2 (class "identity in the zeros"): derive the Dirichlet-to-Neumann identity for the Cayley symbol on a strip and evaluate each term for zeta and for DH.
- T3 (class "frequency-only"): gaps of S-unit frequencies against the trivial integer bound.
- T4 (devices (c), (g)): position of the zeros of S at height 10^4 against the equal-spacing model; size of T_b at T = 10^2 to 10^5.

All runs: single process, `scripts/memcap.sh 8`, mpmath 1.3.0 at 20 to 30 digits. The server was not used.

Not re-run: rows P25 (`sym-power-positivity`), `n4-kunneth-multiple-euler`, P40, G13, G17, S1, Q21, `c4-thin-twist-control-78`. They are used as stated in the map.

---

## (a) Baker-type lower bounds for linear forms in logarithms of primes

**Inequality it could carry.** For integers b_p, abs(sum b_p log p) >= exp(-C_k prod(log p) log B), B = max abs(b_p), k primes (Baker-Wustholz, Matveev; CLASSICAL). It is a statement about the frequency set {log n}. Its use for a Dirichlet series is through a spacing lemma: Montgomery-Vaughan, int_0^T abs(sum a_n n^{-it})^2 dt = sum abs(a_n)^2 (T + O(1/delta_n)), delta_n = min over m != n of abs(log m - log n) (CLASSICAL).

**Where Baker is not trivial.** For integers m != n the bound abs(log m - log n) >= 1/max(m, n) is elementary and is what Montgomery-Vaughan uses. Baker improves it only for S-units with a fixed prime set: gap >= (log n)^{-C_k} instead of 1/n. MEASURED (T3, S = {2, 3, 5, 7}, all 815700 S-units with log n <= 80): smallest gap 6.19e-7 at log n = 77.97 against the trivial bound e^{-77.97} = 1.4e-34; log(min gap)/log U = -3.38, -3.22, -2.90, -3.26 at U = 20, 40, 60, 80 (pigeonhole value -(k-1) = -3). Consequence (PROVED from Montgomery-Vaughan with the Baker gap): for a fixed finite prime set S and sigma > 0, the mean square of the Euler stage zeta_S over a window [T, T + H] equals H prod_{p in S}(1 - p^{-2 sigma})^{-1} + O_{S, sigma}(1), uniformly in T. This is an every-window statement, for a fixed stage.

**Q1 controls.** The spacing bound does not contain the coefficients a_n. It holds verbatim for DH (same frequencies log n), TW+, TW-, THIN, U, WT, E_a. It fails only for Beurling systems (generalised primes may have nearly dependent logarithms): Baker supplies the input INT in its frequency form and nothing else.
**Q2 height.** Uniform in T for fixed S. With S = {p <= P}, C_k grows like c^k prod(log p) (Matveev), so the window length needed is exp(exp(c P)) or longer; S cannot grow with T faster than P about log log T. Finite stages do not carry the functional equation (rows G10, Q10).
**Q3 multiplicativity.** Unique factorisation enters as injectivity of n -> log n. No step uses a(mn) = a(m)a(n).

**Verdict: CLOSED.** Row text: "Baker bounds for linear forms in log p | Coefficient-blind: the bound concerns the frequencies log n and holds for DH, every sign twist, THIN, U, WT. For integers it is weaker than abs(log m - log n) >= 1/max(m,n) (Montgomery-Vaughan input, a mean value: P27, P29). Its non-trivial content is a polylogarithmic gap for S-units with fixed S (measured exponent 2.9 to 3.4 for 4 primes), giving window-uniform mean squares of a fixed Euler stage; the constant is doubly exponential in the stage length, and no finite stage carries the functional equation (G10, Q10). | PROVED (elementary) / MEASURED | DH, TW+-, THIN, U, WT pass every step | c5-device-table-extension".

---

## (b) Sum-product and self-amplification by multiplicative invariance

**Inequality it could carry.** Bourgain-Glibichuk-Konyagin: for a multiplicative subgroup H of F_p^* with abs(H) > p^delta, sum_{x in H} e_p(ax) << abs(H) p^{-eps(delta)} (CLASSICAL). The principle: a set with multiplicative structure has no additive structure, so additive characters cancel on it.

**Translation to zeta (ARGUED).** zeta pairs the multiplicative character n^{it} with an additive set, the interval. The estimate of that pairing is Vinogradov's: sum_{N < n <= 2N} n^{it} << N^{1 - c/k^2}, k = log t/log N (CLASSICAL). At N = t^epsilon this is already a power saving N^{-c epsilon^2}, the shape of a BGK bound. It yields abs(zeta(sigma + it)) << t^{A(1-sigma)^{3/2}} log^{2/3} t and the Vinogradov-Korobov region. A size bound for zeta gives, through the 3-4-1 step, a region of width about 1/(log of the size bound); the width is bounded below by a constant only if log abs(zeta) is bounded near Re s = 1, which is false (CLASSICAL omega results). So the pairing crosses Re s = 1 by (log t)^{-2/3} (log log t)^{-1/3} and by no fixed amount.

The dual pairing (additive character on a multiplicative semigroup: sum over smooth n of e(theta n)) is, by Mellin transform, an additive twist of the Dirichlet series: Hurwitz and Estermann functions. These are the non-Euler series of DH type. A BGK-type bound there returns averages over characters, a mean value (MV-CAP).

**Multiplicative self-amplification (PROVED, elementary).** A bilinear form sum a_m b_n (mn)^{it} equals (sum a_m m^{it})(sum b_n n^{it}): rank one. Cauchy-Schwarz over one variable gains nothing. This is the reason every Vaughan-type split is closed (`fam-vaughan-split-landau`), and it is the same statement as "n^{it} is an eigenfunction of every dilation".

**Q1 controls.** Two steps. Additive step (interval sums of the coefficients times n^{it} with power-saving error): holds for DH (coefficients periodic mod 5), fails for TW+, TW-, THIN (for THIN the partial sums are c x + Omega(x^{b - eps}), `c4-thin-twist-control-78`). Multiplicative step (3-4-1 or pretentious repulsion): fails for DH, holds for TW+-, THIN, U, WT. E_a: both steps hold after renormalising the pole at 1 + a. So the device does fail for DH and for the sign twists at named steps that are not identities; it is the known hitting set {INT, GEOM} of the map, in the form of the Vinogradov-Korobov theorem.
**Q2 height.** Uniform in t, every height.
**Q3.** Multiplicativity enters in the 3-4-1 step at Re s > 1, with the weight p^{-sigma}, sigma -> 1+. A zero at beta + i gamma with beta < 1 fixed produces a bias of relative size P^{beta - 1} in sum_{p ~ P} p^{-i gamma}. Any estimate with relative slack larger than x^{b-1} is passed by THIN with a zero at b, because THIN changes signs on a prime set with counting function about x^{b}. Sum-product savings are of the form x^{-delta} with delta small and not explicit; excluding a zero at beta needs delta >= 1 - beta in an every-height statement, which for beta -> 1/2 is square-root cancellation.

**Verdict: CLOSED** (as a restatement of the one known partial crossing). Row text: "Sum-product / multiplicative amplification | The additive-against-multiplicative pairing for zeta is Vinogradov's method (power saving N^{-c eps^2} at N = t^eps); it gives the Vinogradov-Korobov region and no fixed strip, because a size bound converts to a region of width 1/log(size). The multiplicative side alone is rank one (no bilinear gain). The dual pairing gives Hurwitz/Estermann series (mean values over characters). Fails for DH at the 3-4-1 step and for sign twists and THIN at the interval-sum step; THIN passes any estimate with relative slack above x^{b-1}. | CLASSICAL / ARGUED | none passes; the conclusion is the classical region | c5-device-table-extension".

This is the only one of the seven that meets the score condition "fails for DH and for a sign twist at named non-identity steps and states a crossing inequality". It is not a CANDIDATE because the crossing inequality is the known one and its width is capped by the unboundedness of log abs(zeta(1 + it)).

---

## (c) Carleson measures, corona, interpolating sequences for the Cayley symbol S

Setting (`g-spinor-square-root`, refereed): F(z) = xi(1/2 + z), L = F'/F, S = (1 - alpha L)/(1 + alpha L), unitary on Re z = 0; S is bounded analytic in Re z > 0 iff RH.

**Inequality it could carry.** (i) Carleson: a Blaschke product is interpolating iff its zeros are separated and sum x_k delta_{z_k} is a Carleson measure. (ii) Corona: bounded analytic g, h with inf(abs g + abs h) > 0 generate the unit ideal. (iii) Fefferman: log F in BMOA iff abs(L)^2 x dx dy is a Carleson measure.

**Q1 controls.** Every theorem in this family has as hypothesis that the symbol is bounded analytic in the half-plane, or describes the zero set of a function already known to be inner. For S the hypothesis is RH. Each criterion "S inner iff ..." holds as an equivalence for DH, HEAT, E_a and NR with their own S (false on both sides). The numerator and denominator N = F - alpha F', D = F + alpha F' are entire of order one and unbounded in Re z > 0; dividing by an outer normaliser needs a zero-free denominator, again RH. Corona data: N + D = 2F, D - N = 2 alpha F', so a common zero of N and D is a multiple zero of F; a corona lower bound is a quantitative simplicity statement, not a location statement.
**The one unconditional signed statement** in this family is the Poisson-Jensen formula of the half-plane (Balazard-Saias-Yor, CLASSICAL): (1/2 pi) int log abs(zeta(1/2 + it))/(1/4 + t^2) dt = sum over Re rho > 1/2 of log abs(rho/(1 - rho)) >= 0. The sign is free and points the wrong way; RH is equality. Upper bounds for the left side by Carleson embedding or Jensen are mean values (with a mollifier this is the Nyman-Beurling distance: `fam-nb-gram-lammin`, row P27).
**Q2 height (T4, MEASURED).** Zeros of S for alpha = 1 in the window 9997.8 < y < 10003.3, 0 < x < 1/2: six zeros (winding number 6, no poles), real parts 0.0086 to 0.1363, mean 0.0650; the equal-spacing model x = arctanh(1/(alpha lam))/lam with lam = (1/2) log(T/2 pi) = 3.686 gives 0.0755 (table in "Work"). The Carleson mass per unit height is about x times density = (1/(alpha lam^2)) (lam/pi) = 1/(pi alpha lam), which tends to 0; the interpolation constants are functions of the gaps of the zeros on the line. They are outputs of RH and of gap statistics, not inputs.
**Q3.** No step uses the Euler product. The only prime-side Carleson statement is the local embedding for the Hardy space of Dirichlet series, int_T^{T+1} abs(sum a_n n^{-1/2-it})^2 dt <= C sum abs(a_n)^2 (CLASSICAL, Montgomery-Vaughan again): window-uniform, coefficient-blind, and it requires square-summable coefficients, so it reads log zeta on Re s > 1/2 only almost surely on the Bohr torus (`fam-tail-generic-selector`).

**Verdict: CLOSED.** Row text: "Carleson / corona / interpolating-sequence criteria for S = N/D | Each theorem assumes the symbol bounded analytic in Re z > 0 (this is RH) or describes the zero set of an inner function; as criteria they hold for DH, HEAT, E_a, NR. The unconditional signed member is the Balazard-Saias-Yor Poisson-Jensen identity, whose sign is free and opposite to the one needed; RH is equality (no margin: S4, Q13). Corona data (N, D) measure simplicity of zeros of F. The zeros of S at height T sit at x about 1/(alpha lam^2), lam = (1/2) log(T/2 pi): Carleson mass 1/(pi alpha lam) per unit height. The prime-side Carleson embedding is Montgomery-Vaughan (P27, P29). | PROVED (hypothesis audit) / MEASURED | DH, HEAT, EA, NR (criterion holds) | c5-device-table-extension".

---

## (d) Tensor-power squeeze with Newton-Thorne symmetric powers

**Inequality it carries.** Rankin-Langlands-Deligne squeeze: if L(s, Sym^m pi x Sym^m pi~) has non-negative coefficients and is holomorphic in Re s > 1, Landau's lemma gives absolute convergence there, hence abs(alpha_p)^{2m} <= p for each p and each m, hence abs(alpha_p) = 1 (CLASSICAL). This is a real crossing: an inequality is carried to the boundary of convergence by positivity and continuation. Newton-Thorne supply the continuation for holomorphic newforms.

**Why it does not reach zeros.** The squeeze bounds local parameters. (1) For zeta (GL(1), trivial character) every symmetric power is zeta: the device is empty. (2) For a GL(2) form the output is Ramanujan, known by Deligne. (3) In function fields the same squeeze proves RH because the zeros of the L-function are the Frobenius eigenvalues on H^1, which are local parameters of a sheaf on the base; over number fields no object has the zeros as local parameters (map section 3.7). (4) The positivity version for zeros (non-negative combinations of log L(s, Sym^j)) is row P25: the zeta part is a non-negative cosine polynomial, and Fejer's bound a_1 <= 2 cos(pi/(K+2)) a_0 < 2 a_0 (CLASSICAL) caps the gain at the constant in c/log t. The conductor of Sym^m at height t contributes m log t to the denominator, so growing m does not change the shape.

**Q1 controls.** E_a: fails at the step "L(s, Sym^m) holomorphic in Re s > 1 apart from s = 1" (Sym^m E_a = prod_j zeta(s + (m - 2j)a) has a pole at 1 + ma). NR: fails at the same step at the prime q. DH: not formulable (no local parameters); this does not count. TW+, TW-, THIN, U, WT: local parameters are unimodular, every step holds. B: holds.
**Q2.** Not a statement in t.
**Q3.** Multiplicativity is essential (Sym^m is defined on Euler factors), and all primes are used, but the conclusion is the SIZE input of the map's hitting sets {FE, SIZE}, which zeta satisfies trivially.

**Verdict: CLOSED.** Row text: "Tensor-power squeeze (Landau lemma on Sym^m x Sym^m, Newton-Thorne) | Carries an inequality to the abscissa of convergence, for local parameters: output is abs(alpha_p) = 1 (SIZE). Empty for zeta; kills E_a and NR at the holomorphy step; sign twists, THIN, U, WT pass every step; not formulable for DH. Zeros are local parameters only in function fields (section 3.7). Positivity form is P25 with Fejer's cap a_1 < 2 a_0. | CLASSICAL | TW+-, THIN, U, WT, B | c5-device-table-extension".

---

## (e) p-adic interpolation along the cyclotomic tower; the Iwasawa module as an operator

**Inequality it could carry.** None is known. The structure: for each p the Kubota-Leopoldt function interpolates (1 - p^{k-1}) zeta(1 - k); by the main conjecture (Mazur-Wiles, CLASSICAL) it generates the characteristic ideal of an Iwasawa module X, so its p-adic zeros are eigenvalues of gamma - 1 on X. This is an operator whose spectrum is a zero set, the function-field picture. The hoped step: transfer a spectral constraint from the p-adic side, for all p together, to the complex zeros.

**Decisive test T1 (PROVED; numerical confirmation MEASURED).** The p-adic data of zeta for all p are functions of the values zeta(1 - k), k >= 1. Let chi_-4 be the odd character mod 4 and chi_5 the even quadratic character mod 5. L(s, chi_-4) vanishes at s = -1, -3, -5, ... and L(s, chi_5) at s = 0, -2, -4, ... (trivial zeros, CLASSICAL). Define

    C_c(s) = zeta(s) + c L(s, chi_-4) L(s, chi_5).

Then C_c(-k) = zeta(-k) for every integer k >= 0 and every complex c. C_c is an ordinary Dirichlet series (coefficients 1 + c (chi_-4 * chi_5)(n), integers for c = 1), meromorphic of order one with the single pole of zeta at 1 and polynomial growth on vertical lines. For any s0 with L(s0, chi_-4) L(s0, chi_5) != 0 the choice c = -zeta(s0)/(L L)(s0) gives C_c(s0) = 0.

Numbers (`twin_test.py`, `twin_rational.py`, 30 digits): s0 = 0.8 + 20i gives c = 0.114487775 + 0.470666419i and abs(C_c(s0)) = 0 to working precision; s0 = 0.75 + 1000i gives c = -0.433680220 - 0.930280802i, abs(C_c(s0)) = 4.9e-32; max abs of the added term at s = 0, ..., -15 is 2.0e-28 (rounding of values of size up to 1e3; the vanishing is exact). For c = 1 (integer coefficients) Newton iteration from a grid in 0 < Re s < 2, 0 < Im s < 70 located 16 zeros, among them 0.8640996018 + 29.9504127688i, 0.7552582155 + 15.6183212330i, 0.6740404308 + 58.5242189285i, 0.2104577811 + 6.8433107873i (residual below 1e-22; the list is not claimed complete).

So every device that reads zeta through its values at non-positive integers (Kubota-Leopoldt functions for all p, Kummer congruences, Bernoulli numerators, the characteristic ideal of the Iwasawa module of Q(mu_{p^infinity}) in the branch of zeta) gives the same output for C_c, which has zeros at prescribed points of the strip.

**Q1 controls.** Interpolation twin: passes every step (new control, node `ctrl-interpolation-twin`). DH: a linear combination of two odd L-functions mod 5 with an algebraic coefficient; it has a p-adic interpolation as the same combination of Kubota-Leopoldt functions; it fails only "is the characteristic series of a module" (the coefficient is not a p-adic unit multiple in general; ARGUED, not computed). TW+-, THIN: no values at negative integers (no continuation); not formulable. E_a: values at integers shifted by +-a; not formulable for irrational a.
**Q2.** The data are discrete and lie, after the functional equation, at s = 2k, right of 1. No height enters.
**Q3.** The Euler factor at p is removed, not used; "all p together" is the one sequence zeta(1 - k). Exact uniqueness needs growth plus the functional equation (Hamburger), which is the "exact uniqueness, no inequality" device of the roadmap table.

**Verdict: CLOSED.** Row text: "p-adic interpolation / Iwasawa module as operator | The p-adic data for all p are functions of zeta(1 - k), k >= 1. The interpolation twin zeta + c L(s, chi_-4) L(s, chi_5) (ordinary Dirichlet series, same pole, finite order) has the same values at all non-positive integers and a zero at any prescribed s0 (c = 1: zero at 0.8641 + 29.9504i, measured). p-adic zeros are compared with complex zeros only in function fields (one polynomial). Device type: exact uniqueness, no inequality. | PROVED (twin); MEASURED (zeros) | interpolation twin passes every step | c5-device-table-extension".

---

## (f) Turan power sums outside the family "one zero forces many"

Two forms.

**Finite form.** Turan's first main theorem: for g(nu) = sum_{j <= n} b_j z_j^nu with min abs(z_j) = 1, max over nu in [m+1, m+n] of abs(g(nu)) >= (n/(2e(m+n)))^n abs(g(0)) (CLASSICAL). Applied to a Dirichlet polynomial with z_j = n_j^{delta} it gives a lower bound for abs(D(s_0 - nu delta)) at some point of an arithmetic progression to the left of s_0. It is a transport to the left with a sign (a lower bound). Q1: the bound contains the frequencies and the number of terms only; it holds for every coefficient vector, hence for DH, sign twists, THIN, U, WT at every step. Q2: loss e^{-cn} in the number n of terms; the point nu is not controlled. Q3: no multiplicativity. Finite stages only.

**Limit form: Turan's equivalence (CLASSICAL, cited from memory, constants not re-read).** For an Euler product, a zero-free strip Re s > 1 - eta is equivalent to a bound abs(sum_{N < p <= N'} p^{i tau}) <= c N log^{10} N / tau^{b} for tau^{a} <= N < N' <= 2N, with eta depending on a and b. The power-sum theorem replaces the Borel-Caratheodory step and converts a prime-sum inequality at all heights tau into a strip. This is a crossing device with a height-uniform, every-tau hypothesis. Q1: the equivalence holds for every Euler product, including TW+, TW-, THIN; the hypothesis is false for THIN (zero at b) and true for a random sign twist. So the device does not separate; the hypothesis must. Q3: the hypothesis is a statement about primes; for integers the corresponding bound holds with b = 1 (for N > tau, sum_{N < n <= 2N} n^{i tau} << N/tau by Euler-Maclaurin, CLASSICAL), and the passage from integers to primes is the rank-one bilinear form of section (b): closed (`fam-vaughan-split-landau`). With the known region the prime sum at N = tau^a is bounded by N exp(-c a (log tau)^{1/3}), not by a power of tau.

**Verdict: CLOSED.** Row text: "Turan power sums | Finite form: coefficient-blind lower bound with loss e^{-cn}, holds for every control. Limit form: Turan's equivalence 'zero-free strip iff power saving in tau for sum_{p ~ N} p^{i tau}, N >= tau^a' holds for every Euler product; it restates the target as a prime-sum bound whose proof from integer sums is the rank-one bilinear obstruction (fam-vaughan-split-landau). Not of type 'one zero forces many'. | CLASSICAL (not re-read) | DH, TW+-, THIN, U, WT (finite form); the equivalence holds for TW+-, THIN | c5-device-table-extension".

---

## (g) Device on the under-used geometric nodes: strip Dirichlet-to-Neumann identity for the phase of S

Nodes used: `zv-annulus-dtn-operator` (two-boundary DtN matrix kappa [[coth kappa b, -csch kappa b], [-csch kappa b, coth kappa b]]), `klein-phase-transport-certificate` (needs 0 < mu <= theta' <= M in a window), `zv-elliptic-double-cover` (only its involution w -> 1/conj w, i.e. the reflection in Re z = 0).

**The device.** Take the strip 0 < x < b in z = x + iy and u = log abs S. On x = 0, u = 0 and, by Cauchy-Riemann, the normal derivative of u is the phase derivative: with S(iy) = e^{i theta(y)}, theta'(y) = d u/dx (0, y). On x = b >= 1/2 (Re s >= 1), u < 0 unconditionally, since Re xi'/xi > 0 there. The DtN matrix of the node maps the Dirichlet data (0, u_b) to the Neumann data through its off-diagonal entry; the inverse Fourier transform of kappa csch(kappa b) is (pi/(4 b^2)) sech^2(pi y/(2b)), a positive kernel.

**Identity (PROVED: Poisson-Jensen formula of the strip).** With K(x, d) = (pi/b) sin(pi x/b)/(cosh(pi d/b) - cos(pi x/b)) > 0,

    -theta'(y) = T_b(y) + sum_{zeros z_k of S, 0 < x_k < b} K(x_k, y - y_k) - sum_{poles p_j of S, 0 < x_j < b} K(x_j, y - y_j),
    T_b(y) = (pi/(4 b^2)) int sech^2(pi (y - y')/(2b)) (-log abs S(b + iy')) dy'.

On the line, L(iy) is imaginary and -theta'(y) = 2 alpha (Xi'^2 - Xi Xi'')/(Xi^2 + alpha^2 Xi'^2) with Xi(y) = xi(1/2 + iy) (real on the line; S = (1 + i alpha Xi'/Xi)/(1 - i alpha Xi'/Xi)): the Laguerre expression of Xi. So: Laguerre expression on the critical line = positive term computable from the line Re s = 1/2 + b (for b > 1/2 from the absolutely convergent prime series) + positive terms from zeros of S in the strip - positive terms from poles of S in the strip. Poles of S in Re z > 0 exist iff RH fails. The hypothesis mu <= theta' of the Klein phase-transport certificate in a window is the statement that the pole sum is smaller than the other two there.

**Crossing inequality it would give.** If the pole sum could be bounded by a fraction of T_b + zero sum, the Laguerre inequality would follow at every y with the prime-side margin T_b. Near an off-line quartet at distance x_0 from the line the pole of S sits at x about x_0^2/(2 alpha) (ARGUED from the two-term expansion) and contributes a negative Lorentzian of height about 2/x_pole = 4 alpha/x_0^2: the pole sum is unbounded as x_0 -> 0 and no fraction of T_b bounds it.

**Test T2 (MEASURED).** `dtn_identity.py`, alpha = 1/5. Tables in "Work" below: the identity holds with residual at most 6.4e-17 for zeta at heights 27 to 32 (b = 1/2, alpha = 1/5), at most 7.4e-7 for zeta at height 10^4 (b = 1/2, alpha = 1, kernel truncated at distance 2.5, expected truncation e^{-5 pi} = 1.5e-7 times the terms), and at most 4.1e-13 for DH (b = 3/4, alpha = 1/5, three heights near its off-line zero 0.8085 + 85.6993i). For DH one pole of S lies in the strip, at 0.17213 + 85.71597i (two-term prediction x = -alpha + sqrt(alpha^2 + x_0^2) = 0.1677 for x_0 = 0.3085); at y = 85.7 the pole sum is 11.012 and -theta' = -7.795 (the Laguerre expression is negative).

**Q1 controls.** DH: every step holds; the pole sum is non-zero and negative, and the identity does not determine it (measured). HEAT, E_a, NR: same (identity; ARGUED, not run). TW+-, THIN: no reflection, S not unitary on any line; not formulable.
**Q2 height.** For large T, -log abs S(b + iy) is about 2/(alpha lam), lam = (1/2) log(T/2 pi), so T_b is about 2/(b alpha lam), while the mean of -theta' is 2 lam. The prime-side term is a fraction 1/(b alpha lam^2) of the phase derivative, decaying like 1/log^2 T (ARGUED from the asymptotics of xi'/xi; MEASURED fractions T_b/(2 lam) for alpha = 1: 0.738, 0.319, 0.111, 0.104 at T = 10^2, 10^3, 10^4, 10^5 with b = 1/2, and 0.519, 0.202, 0.083, 0.064 with b = 3/4; model 1.04, 0.311, 0.147, 0.085 and 0.70, 0.207, 0.098, 0.057). At T = 10^4 and the two heights tested T_b is 1.8 and 1.3 percent of the pointwise value of -theta' (0.778 of 43.02, 0.831 of 62.06); the rest is the zero sum.
**Q3.** The Euler product enters only in evaluating T_b on Re s > 1. Its positivity uses only "no zeros in Re s >= 1".

**Verdict: CLOSED.** Row text: "Strip Dirichlet-to-Neumann identity for the phase of S (annulus DtN node with the Klein phase certificate) | -theta'(y) = T_b(y) + zero sum - pole sum, all kernels positive; -theta' is the Laguerre expression, T_b > 0 is computed on Re s = 1/2 + b >= 1. It is the Poisson-Jensen formula of the strip: residue device, exact, sign of the pole sum undetermined (S1); it holds for DH with its pole terms (measured). T_b is a fraction about 1/(b alpha lam^2) of the mean phase derivative (measured 0.74 to 0.10 for T = 10^2 to 10^5). The hypothesis of the Klein phase-transport certificate is the absence of nearby poles of S (P40, G13). | PROVED identity; MEASURED | DH (identity holds); HEAT, EA, NR argued | c5-device-table-extension".

---

## Work: numerical tables

### T2: strip identity (`dtn_identity.py`, 25 digits; T_b by the trapezoid rule with step 1/50; zeros and poles of S by grid minima of abs(1 -+ alpha L) followed by Newton iteration)

| Function | alpha | b | y | -theta'(y) | T_b(y) | zero sum | pole sum | residual |
|---|---|---|---|---|---|---|---|---|
| zeta | 1/5 | 1/2 | 27.0 | 0.178745723 | 0.178694132 | 5.159e-5 | 0 | 5.5e-17 |
| zeta | 1/5 | 1/2 | 28.3 | 0.169693145 | 0.169678315 | 1.483e-5 | 0 | 1.6e-20 |
| zeta | 1/5 | 1/2 | 31.7 | 0.544399451 | 0.534901587 | 9.498e-3 | 0 | 6.4e-17 |
| zeta | 1 | 1/2 | 10000.3 | 43.0199496 | 0.7778997 | 42.2420497 | 0 | 2.6e-7 |
| zeta | 1 | 1/2 | 10000.8 | 62.0579445 | 0.8309531 | 61.2269907 | 0 | 7.4e-7 |
| DH | 1/5 | 3/4 | 84.9 | 0.945442350 | 0.997568105 | 0.138336926 | 0.190462681 | 2.9e-13 |
| DH | 1/5 | 3/4 | 85.7 | -7.795251182 | 1.733909805 | 1.483061774 | 11.012222760 | 3.2e-14 |
| DH | 1/5 | 3/4 | 86.4 | 1.371034337 | 1.338753682 | 0.375615433 | 0.343334778 | 4.1e-13 |

Completeness check of the zero and pole lists: winding number of S around the rectangle against (zeros found) - (poles found): zeta at 27 to 32: 5 = 5 - 0 (zeros at x = 0.1948 to 0.2005, one per zeta zero, near i gamma + alpha); zeta at 10^4: 6 = 6 - 0; DH: 8 = 9 - 1. On the right edge max log abs S is -0.075, -0.373, -0.544 respectively (negative: abs S < 1 there).

Zeros of S for zeta, alpha = 1, window at 10^4 (x, y): (0.05802, 9998.3985), (0.10522, 9999.2709), (0.03015, 10000.2773), (0.00862, 10000.7856), (0.13632, 10001.5791), (0.05195, 10002.5781). Model 0.0755.

DH, zeros of S in the strip (x, y): eight with x between 0.2007 and 0.2122 at y = 78.748, 80.364, 81.972, 83.122, 87.676, 89.489, 90.757, 92.215, and one at (0.58397, 85.77068); pole at (0.17213, 85.71597).

### T4: prime-side term against the mean phase derivative (`tb_fraction.py`, alpha = 1, trapezoid step 1/20)

| T | b | T_b(T) | 2 lam | fraction | model 1/(b alpha lam^2) |
|---|---|---|---|---|---|
| 10^2 | 1/2 | 2.0410 | 2.7673 | 0.738 | 1.045 |
| 10^2 | 3/4 | 1.4367 | 2.7673 | 0.519 | 0.696 |
| 10^3 | 1/2 | 1.6192 | 5.0699 | 0.319 | 0.311 |
| 10^3 | 3/4 | 1.0262 | 5.0699 | 0.202 | 0.207 |
| 10^4 | 1/2 | 0.8199 | 7.3725 | 0.111 | 0.147 |
| 10^4 | 3/4 | 0.6122 | 7.3725 | 0.083 | 0.098 |
| 10^5 | 1/2 | 1.0070 | 9.6750 | 0.104 | 0.085 |
| 10^5 | 3/4 | 0.6144 | 9.6750 | 0.064 | 0.057 |

One height per row; T_b fluctuates with the prime sum on the line Re s = 1/2 + b, so single values scatter about the model.

### T1: interpolation twin (`twin_test.py`, `twin_rational.py`, 30 digits)

Given in section (e). The variant zeta + c/Gamma(s) (`small_tests.py`) also matches zeta at s = 0, ..., -11 and has a zero at 0.8 + 20i, but it grows like e^{pi abs(t)/2} on vertical lines (abs value 4.1e16 at 3 + 50i); the L-function twin has polynomial growth and is the control recorded.

### T3: S-unit gaps (`small_tests.py`, S = {2, 3, 5, 7})

| U = max log n | count | mean gap | min gap | at log n | e^{-log n} | log(min gap)/log U |
|---|---|---|---|---|---|---|
| 20 | 4583 | 4.36e-3 | 4.06e-5 | 18.17 | 1.3e-8 | -3.38 |
| 40 | 57807 | 6.92e-4 | 7.05e-6 | 38.91 | 1.3e-17 | -3.22 |
| 60 | 269286 | 2.23e-4 | 7.05e-6 | 38.91 | 1.3e-17 | -2.90 |
| 80 | 815700 | 9.81e-5 | 6.19e-7 | 77.97 | 1.4e-34 | -3.26 |

Minimum taken over the 200 smallest float64 gaps, each recomputed from the integers at 30 digits.

---

## Requirement flags

- **R1 (multiplicativity essential): false.** Established for none. Devices (a), (c), (e), (f-finite), (g) use no multiplicative step. Device (d) uses multiplicativity essentially but concludes only abs(alpha_p) = 1. Device (b) uses it in the 3-4-1 step at Re s > 1, which is the classical theorem.
- **R2 (height-uniform, every window): false.** The window-uniform statements found are for a fixed finite Euler stage (a), or are the classical region (b), or are identities (g). The prime-side term of (g) decays like 1/log^2 T relative to the quantity it should bound.
- **R3 (every control fails at a named structural step): false.** Evidence against: (a), (f-finite) are passed by every control with a Dirichlet series; (e) is passed by the interpolation twin; (c), (g) hold as identities for DH (measured for (g)); (d) is passed by every unimodular twist. Device (b) fails DH and the sign twists at named non-identity steps, and is the known theorem.
- **R4 (reaches the critical line): false.** (b) crosses Re s = 1 by (log t)^{-2/3}; (d) reaches the abscissa of convergence for local parameters only; the rest do not cross.

## Controls summary

| Device | DH | HEAT | TW+ / TW- | E_a | B | THIN | WT / U |
|---|---|---|---|---|---|---|---|
| (a) Baker | passes | n.f. | pass | passes | fails (frequencies) | passes | pass |
| (b) sum-product | fails at 3-4-1 | n.f. | fail at interval sums | passes after renormalising | fails at interval sums | fails at interval sums | U fails at interval sums; WT passes (it is zeta translated) |
| (c) Carleson for S | criterion holds | criterion holds | n.f. | criterion holds | n.f. | n.f. | n.f. for U; WT = zeta |
| (d) tensor squeeze | n.f. | n.f. | pass | fails (pole at 1 + ma) | passes | passes | pass |
| (e) p-adic | passes interpolation | n.f. | n.f. | n.f. | n.f. | n.f. | n.f. |
| (f) Turan finite / limit | passes / n.f. | n.f. | pass / equivalence holds | passes / equivalence holds | passes | passes / hypothesis false | pass |
| (g) strip DtN | identity holds (measured) | identity holds (argued) | n.f. | identity holds (argued) | n.f. | n.f. | WT = zeta |

n.f. = not formulable, which the map does not count as a failure. Cells for HEAT, E_a, NR, B are inferences except where marked measured.

## Three weakest steps

1. **Citations from memory.** Turan's equivalence (exponents a, b, the power log^{10} N), the Matveev constant's growth, Fejer's extremal value and the Balazard-Saias-Yor identity are stated as CLASSICAL without re-reading. The closures of (a), (d), (f) depend on them only in shape, but a referee should check the statement of Turan's theorem, since row (f) calls it an equivalence valid for every Euler product.
2. **Device (b) is closed by argument, not by proof.** "A sum-product estimate has slack x^{-delta} with delta too small" and "THIN passes any estimate with relative slack above x^{b-1}" are ARGUED. No theorem here excludes an additive-multiplicative inequality with square-root strength; what is shown is that the existing pairing is Vinogradov's and that the multiplicative side alone is rank one.
3. **The strip identity is checked in three windows (zeta near 30, zeta near 10^4, DH near 85.7), in multiprecision floating point, with zeros and poles found by grid search plus Newton.** The winding number of S around the rectangle is compared with (zeros - poles) found, and the residual of the identity is the completeness check; neither is interval-certified. The asymptotic fraction 1/(b alpha lam^2) and the pole position x_0^2/(2 alpha) are ARGUED. The DH interpolation statement in (e) ("fails only the characteristic-series step") is ARGUED and not computed.

## Files

- `RESULT.md` (this file), `nodes.json` (six graph nodes in the format of `engine/nodes/`).
- `small_tests.py`, `small_tests.json` (T3; Fejer values; the 1/Gamma variant of the twin).
- `twin_test.py`, `twin_test.json`, `twin_rational.py`, `twin_rational.json` (T1).
- `dtn_identity.py` (arguments `zeta`, `zeta1e4`, `dh`), `dtn_identity_zeta.json`, `dtn_identity_zeta1e4.json`, `dtn_identity_dh.json`, logs `dtn_*.log` (T2).
- `tb_fraction.py`, `tb_fraction.json` (T4).
