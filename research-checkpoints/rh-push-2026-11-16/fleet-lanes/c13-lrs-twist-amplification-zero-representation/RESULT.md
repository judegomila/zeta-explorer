# c13-lrs-twist-amplification-zero-representation: the Luo-Rudnick-Sarnak mechanism on the Eisenstein series at a zero

Date 2026-11-19. Round 13, explore (device design; read sets RS-1 with RS-2; target R4). Stage A only (paper) plus numeric checks of the lemmas (local, `scripts/memcap.sh 8`, 45 s in total, peak memory under 200 MB). Stage B was not run. The compute server was not contacted. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED (argument written here) / CLASSICAL / ARGUED / RECALLED (from memory, source not opened) / MEASURED / OPEN.

**Verdict: precise obstruction; device closed at the decisive first test; one pivot (higher rank), closed by the same lemma.**

Answer to the decisive test. The single-exponent condition at a zero does replace cuspidality at one of the two places where Luo-Rudnick-Sarnak (LRS) use it, and not at the other.

- Replaced (Lemma 1, PROVED, checked): at s_0 = rho/2 the completed Rankin-Selberg function of E*(z, rho/2) with its conjugate has exactly one pair of simple poles, as for a cusp form. The other six poles of the generic parameter have residues that carry the factor xi(rho).
- Not replaced (Lemmas 2, 3, PROVED, checked): the surviving pole sits at P = 2 - beta (beta = Re rho), not at 1. The gamma-factor pole that the mechanism reads sits at beta_0 = 1 - beta. So P - beta_0 = 1 for every beta: the pole and the parameter move together. For a cusp form P = 1 whatever the parameter is; that independence is what square-integrability gives and it is the content of the mechanism. Here the vanishing forced at the gamma pole is the trivial zero L(0, chi) = 0 of an even character, an identity that holds for every parameter s_0, zero or not.

The one displayed inequality the device yields (section 4): `1 - beta <= w*(2 - beta)`, with `w*(P) = (4P^2 - 7P/2 + 1)/(4P - 3/2)` the LRS non-vanishing threshold for a degree-4 Rankin-Selberg function whose rightmost pole is at P. It reduces to `beta <= 7/4`. It is vacuous, and it is the same for the Eisenstein series at a generic parameter (controls E_a, EIS-w), which pass every step with the same output. Per the stage-A rule the lane stops at the passing control.

Row for the map: `MAP_ROW.md`. Record line: `lanes_line.json` (appended to `campaign/lanes.jsonl`).

Files: `checks.py`, `checks.log`, `checks.json` (41 s); `checks2.py`, `checks2.log`, `checks2.json` (2 s); `ref_check.py`, `ref_check.log`, `ref_check.json` (3 s, second pass, different code path). All run as `scripts/memcap.sh 8 .venv-arb/bin/python -I <file> <absolute output path>`.

---

## 0. Plan, and the three questions before work

Read: BRIEF.md (to the end), STRATEGY.md sections 1 and 4.0 (CROSS-1), round-12 results and lessons and the round-13 allocation in ROUND_LOG.md, map section 2 (controls, notes on EIS-w, T-NR, WT) and rows P25, P50, G12, G17, G31, G32, `sym-power-positivity`, `c6-quadratic-companion-positivity`, `c11-rs1-twist-modulus-reciprocity`, `g-torus-modular`. Not opened: Luo-Rudnick-Sarnak (GAFA 5 (1995)), Zagier (1981), Moeglin-Waldspurger. The LRS argument in section 3 is reconstructed here from its ingredients and reproduces the published exponent 1 - 2/(n^2+1); statements about those papers are marked "relative to".

New against the map: LRS appears only inside `sym-power-positivity` as a bound on prime-power terms. No row applies the mechanism to an object attached to a zero. Row G31 treats the same object E(z, rho/2) with truncated mass and horocycle periods and says "not covered: a device that reads phi(w) = 0 by another route". This lane is such a route (it reads xi(rho) = 0 through the residues of the Rankin-Selberg function).

- Q1 (controls): section 5. E_a, EIS-w and WT pass every step with the same output as the target.
- Q2 (height-uniform, every window): the object exists for each zero separately and every step is uniform in gamma = Im rho; the output is vacuous, so nothing is claimed.
- Q3 (multiplicativity): step S1 (factorisation of the twisted Rankin-Selberg series into four Dirichlet L-functions) uses the Hecke relations at every prime. It is an identity and holds for every parameter.
- R4 (crossing): the device would bound Re rho away from 1 if the inequality of section 4 were non-trivial. It is not.

Sanity bound fixed before work (PROVED, one line). With nu = (rho - 1)/2 the object has archimedean parameters +-nu and local parameters p^(+-nu), so abs(Re nu) = (1 - beta)/2. Zeros with beta = 1/2 exist, so no argument can give abs(Re nu) <= theta with theta < 1/4. The LRS exponent for GL_2, theta = 1/2 - 1/5 = 3/10, would give beta >= 2/5 and by rho -> 1 - conj(rho) the strip 2/5 <= beta <= 3/5. That was the target. The Kim-Sarnak exponent 7/64 < 1/4 is excluded in advance, so whatever replaces cuspidality cannot be a formal property that also carries symmetric-power transfers.

## 1. The object and the steps of the device

Notation. xi(u) = pi^(-u/2) Gamma(u/2) zeta(u) (residue 1 at u = 1, residue -1 at u = 0, xi(u) = xi(1-u)). E*(z, s) = xi(2s) E(z, s) for PSL_2(Z).

CLASSICAL (Fourier expansion): E*(z, s) = xi(2s) y^s + xi(2s-1) y^(1-s) + 2 sqrt(y) sum_{n != 0} abs(n)^(s-1/2) sigma_{1-2s}(abs(n)) K_{s-1/2}(2 pi abs(n) y) e(nx). The non-constant coefficients are entire in s. E*(z, s) is a Hecke eigenfunction with lambda_s(n) = sum_{ab = n} (a/b)^(s-1/2), Satake parameters p^(+-(s-1/2)).

At s_0 = rho/2, rho = beta + i gamma a zero of zeta in the strip: the constant term is xi(rho - 1) y^(1 - rho/2), one exponent (relative to Zagier 1981 for the framing; the formula itself is the display above). Its real part is 1 - beta/2 > 1/2, so E*(z, rho/2) is not square-integrable. Parameter nu = s_0 - 1/2 = (rho - 1)/2.

Steps of the LRS mechanism, as reconstructed (section 3), for a Hecke eigen-object pi with b(n) = abs(lambda(n))^2:

| Step | Content | Input |
|---|---|---|
| S0 | the object exists and has a single constant-term exponent | xi(rho) = 0 (target); the group |
| S1 | twisted Rankin-Selberg series = product of L-values (first lemma, section 2) | Hecke relations at every prime (multiplicativity, R1) |
| S2 | pole structure of the untwisted completed function: one simple pole pair | cuspidality in LRS; here xi(rho) = 0 and xi(1 - conj rho) = 0 (the target's functional equation, read at one point) |
| S2' | position of that pole: P = 1 | square-integrability in LRS; here P = 2 - beta |
| S3 | completed twists by primitive chi != 1 are entire | cuspidality in LRS; here automatic (Dirichlet L-functions) |
| S4 | b(n) >= 0 and orthogonality: the average over even chi mod q of the first sum is >= the term n = 1 | positivity (a square; no multiplicativity) |
| S5 | functional equation of the twists, conductor q^4, root number tau(chi)^4/q^2; the chi-average of the root number is a hyper-Kloosterman sum, bounded by Deligne | periodicity of chi, Poisson dual uniform in q (RS-1 ingredient (iii)); functional equation of the twists, conductor aspect |
| S6 | non-vanishing on average at real w > w*(P) | S2', S4, S5 |
| S7 | the gamma factor of the even twists has a pole at beta_0 = 2 abs(Re nu) > 0; S3 forces L(beta_0, pi x conj(pi) x chi) = 0 for every even chi; with S6: beta_0 <= w*(P) | the functional equation whose gamma factor contains the parameter |

## 2. First lemma: the regularised Rankin-Selberg integral as a product of L-values

**Lemma 0 (CLASSICAL, Ramanujan; checked).** For any s_0 = (beta + i gamma)/2 and any Dirichlet character chi, in the region of absolute convergence,

    sum_n abs(lambda_{s_0}(n))^2 chi(n) n^(-w) = L(w + beta - 1, chi) L(w + 1 - beta, chi) L(w + i gamma, chi) L(w - i gamma, chi) / L(2w, chi^2).

Proof: lambda is multiplicative with lambda(p^k) = h_k(alpha, alpha^-1), alpha = p^nu; the local identity sum_k abs(h_k)^2 x^k = (1 - x^2)/prod over the four products alpha^(+-1) conj(alpha)^(+-1) of (1 - (.) x) is the Cauchy identity for GL_2 x GL_2. Checks: local identity at p in {2, 3, 5, 7, 101}, three parameters, chi(p) in {1, -1, e^(2 pi i/3)}: maximal difference 3.9e-31 (`checks.json` key B). Global identity with the even cubic character mod 7 at w = 4, n <= 2e5, coefficients built by a second method: differences 5.2e-18 (at the first zero) and 1.2e-16 (generic parameter) (`ref_check.json` key R1).

The regularised Rankin-Selberg transform of abs(E*(z, s_0))^2 in Zagier's sense (subtract the constant-term asymptotics, integrate against y^(w-2); relative to Zagier 1981 for the regularisation; the unfolding is CLASSICAL) is, with its gamma factors,

    xi(2w) R(w) = G(w) := xi(w + beta - 1) xi(w + 1 - beta) xi(w + i gamma) xi(w - i gamma).          (2.1)

The twisted completed function is the same product with xi(. ) replaced by the completed Lambda(. , chi) in each factor. G does not depend on whether rho is a zero: the non-constant Fourier coefficients of E* do not vanish at zeros. The zero enters only through residues:

**Lemma 1 (single pole pair; PROVED; checked).** G has at most simple poles at the eight points w = 2 - beta, beta - 1, beta, 1 - beta, 1 +- i gamma, +- i gamma (for beta != 1/2, gamma != 0). The residues are

| pole | residue | at xi(rho) = 0 |
|---|---|---|
| w = 2 - beta | xi(3 - 2 beta) abs(xi(2 - beta + i gamma))^2 = xi(3 - 2 beta) abs(xi(rho - 1))^2 | non-zero (all arguments have real part > 1) |
| w = beta - 1 | minus the same (functional equation w -> 1 - w) | non-zero |
| w = beta | xi(2 beta - 1) abs(xi(beta + i gamma))^2 | 0 (double zero against a simple pole: G(beta) = 0) |
| w = 1 - beta | - xi(2 - 2 beta) abs(xi(1 - beta + i gamma))^2 = - xi(2 - 2 beta) abs(xi(1 - conj rho))^2 | 0, by the functional equation of zeta at rho |
| w = 1 +- i gamma | xi(beta +- i gamma) xi(2 - beta +- i gamma) xi(1 +- 2 i gamma) | 0 |
| w = +- i gamma | - xi(beta - 1 +- i gamma) xi(1 - beta +- i gamma) xi(+- 2 i gamma) | 0 |

So at a zero G has exactly the two simple poles w = 2 - beta and w = beta - 1. For beta = 1/2 the poles at beta and 1 - beta coincide in a double pole whose leading coefficient is - abs(xi(1/2 + i gamma))^2, which vanishes at a zero; G is then regular at w = 1/2. This agrees with Zagier's rule (poles of the transform at the constant-term exponents alpha and at 1 - alpha, residues proportional to the coefficients): abs(E*)^2 has leading exponents beta, 2 - beta, 1 +- i gamma with coefficients abs(xi(rho))^2, abs(xi(rho-1))^2 and the cross terms.

Proof: each factor of G has simple poles at arguments 0 and 1 only; multiply the residue of that factor by the other three evaluated at the point. QED

MEASURED (`checks.json` key A; contour integrals on circles of radius 0.03, not the closed formula). First zero: abs residue 1.06e-10 at 2 - beta and beta - 1 (formula 1.0598540200154648e-10, contour 1.0598540200154647e-10), below 3.1e-43 at the other six points. Second zero: 3.85e-15 against below 1.1e-47. Generic parameter beta = 0.3, gamma = 14.1347: 9.6e-11, 1.4e-11 (at beta and 1 - beta), 3.0e-20 (at the four complex points), all non-zero. Critical line, t = 15 (not a zero): double-pole coefficient at w = 1/2 equal to abs(xi(1/2 + 15i))^2 = 3.93e-11; at the first two zeros below 2e-43 (`checks2.json`).

**What Lemma 1 gives and does not give.** Step S2 holds with the single-exponent condition in place of cuspidality: the completed untwisted function has one simple pole pair. This is the first place on file where xi(rho) = 0 and the functional equation of zeta at rho enter a step of a device as a hypothesis that changes a structure used downstream. Step S2' does not hold: the pole is at P = 2 - beta = 1 + 2 abs(Re nu).

## 3. The LRS mechanism reconstructed, with the pole position kept as a variable (ARGUED exponent count; its consequence for this object is PROVED independently in section 4)

Setting: a Dirichlet series D(w) = sum b(n) n^(-w), b(n) >= 0, b(1) = 1, of degree d = 4 (d = n^2 for GL_n), rightmost pole at real P >= 1, twists D(w, chi) entire with functional equation of conductor q^d and root number proportional to (tau(chi)/sqrt q)^d, q prime, chi even mod q.

For real w and Y > 0: D(w, chi) = sum_n b(n) chi(n) n^(-w) V(n/Y) + (dual), where the dual term is a contour integral on Re u = -c, 1 - w + c > P, of the functional equation applied to D(w + u, chi); V is a fixed cut-off.

- Average over the (q-1)/2 even characters: the first sum becomes ((q-1)/2) sum_{n = +-1 mod q} b(n) n^(-w) V(n/Y) >= ((q-1)/2) V(1/Y), by b >= 0 (S4).
- The principal character must be removed: its first sum is of size Y^(P - w) (S2').
- Dual term: the average of the root number against conj(chi)(n) is a hyper-Kloosterman sum of rank d divided by q^(d/2), of size q^(-1/2) by Deligne; the sum over characters gives q^(1/2). The dual sum has length q^d/Y and size (q^d/Y)^(P - 1 + w); with the conductor factor q^(d(1/2 - w)): total q^(1/2 + d/2 + d(P-1)) Y^(-(P - 1 + w)).

With Y = q^a both error terms are o(q) iff a(P - w) < 1 and 1/2 + d/2 + d(P - 1) - a(P - 1 + w) < 1. Such an a exists iff

    w > w*(P, d) = (A P - (P - 1))/(A + 1),   A = (d - 1)/2 + d(P - 1).          (3.1)

Checks of (3.1): w*(1, n^2) = 1 - 2/(n^2 + 1) for n = 2, 3, 4 (exact, `ref_check.json` key R2), the published LRS exponent. For d = 4: w*(P) = (4P^2 - 7P/2 + 1)/(4P - 3/2).

S7 then reads: if the gamma factor of the even twists has a pole at real beta_0 > 0 and the completed twists are entire, D(beta_0, chi) = 0 for all even chi, hence beta_0 <= w*(P, d).

**Where cuspidality enters (answer to the assignment's question).** Three places. (a) S3, entire twists. (b) S2, a single simple pole of the untwisted function, used for the principal-character term. (c) S2', the position P = 1 of that pole, which is the statement that sum_{n <= x} abs(lambda(n))^2 is of order x although single coefficients may be as large as n^(theta): square-integrability bounds the average, and the mechanism compares the average with the local parameter. (a) holds for every Eisenstein series; (b) holds exactly at zeros (Lemma 1); (c) fails at zeros and at every other parameter off the unitary axis.

## 4. Stage A (i): the candidate inequality, and why it is vacuous

For the object at s_0 = rho/2: d = 4, P = 2 - beta, twisted function L(w + beta - 1, chi) L(w + 1 - beta, chi) L(w + i gamma, chi) L(w - i gamma, chi). For even chi the gamma factor is Gamma_R(w + beta - 1) Gamma_R(w + 1 - beta) Gamma_R(w + i gamma) Gamma_R(w - i gamma); its only pole in Re w > 0 is w = beta_0 = 1 - beta = 2 abs(Re nu). For odd chi there is none (poles at w = -beta, beta - 2, -1 +- i gamma, and further left).

**Candidate (C-LRS).** `1 - beta <= w*(2 - beta, 4)`.

**Lemma 2 (the forced vanishing is a trivial zero; PROVED; checked).** For every primitive even chi != 1 and every parameter s_0 (zero or not), the twisted product vanishes at w = 1 - beta because its first factor is L(0, chi) = 0. For odd chi nothing is forced.
Check (`checks.json` key C): abs L(0, chi) = 4.8e-35 (quadratic character mod 5), 1.2e-31 (even cubic character mod 7), against 0.632 for the odd quartic character mod 5; the twisted product at w = 1 - beta at the first zero: 3.7e-34, 1.3e-28, against 0.034 for the odd character.

So step S7 holds, as an identity that does not involve the target. The same holds at a finite place: the local factor (1 - chi(p) p^(-(w + beta - 1)))^-1 has its pole at w = 1 - beta when chi(p) = 1, and the vanishing forced on the partial L-function is the zero of the Euler factor it was divided by.

**Lemma 3 (the inequality is vacuous; PROVED from (3.1) by algebra; independent of (3.1): PROVED from Lemma 2).** P - 1 <= w*(P, d) iff 2(P - 1) <= A iff 0 <= (d - 1)/2 + (d - 2)(P - 1), true for all d >= 2, P >= 1. For d = 4, P = 2 - beta: C-LRS is beta <= 7/4.
Independent of the exponent count: by Lemma 2 the twisted values at w = 1 - beta are zero for all even chi != 1, so "non-vanishing on average at w = 1 - beta" is false for this object for every beta in (0, 1), and no correct version of S6 can reach that point. The failing estimate is the principal-character term: sum_{n <= Y} abs(lambda(n))^2 n^(-(1 - beta)) = c Y (1 + o(1)), c = zeta(3 - 2 beta) abs(zeta(2 - beta + i gamma))^2/zeta(4 - 2 beta), which is of the size of the main term for every admissible Y.
Check (`checks.json` key D): the ratio (sum up to Y)/Y at Y = 2e3, 2e4, 2e5 is 0.405882, 0.405582, 0.405571 against c = 0.405570 at the first zero; 0.452265, 0.452085, 0.452090 against c = 0.452089 at the generic parameter beta = 0.3. Table of w*(P, 4) against P - 1 for P = 1, 5/4, 3/2, 7/4, 2: 3/5, 23/28, 19/18, 57/44, 20/13 against 0, 1/4, 1/2, 3/4, 1 (key E).

**Structural statement of the obstruction.** For this object P - beta_0 = (2 - beta) - (1 - beta) = 1. In the normalisation that puts the pole at 1 (the isobaric sum 1 + abs(.)^(1 - rho), coefficients sum_{d | n} d^(rho - 1), all of modulus at most d(n)), the gamma pole is at 0: the object is on the tempered side or better at every place, in one direction, and the parameter set {0, 1 - rho} is not closed under mu -> - conj(mu), so a one-sided bound says nothing about beta. In the symmetric normalisation {nu, -nu} the growth of the Eisenstein series displaces the pole by exactly the amount of the parameter. LRS needs P fixed while beta_0 varies; that is square-integrability. E*(z, s_0) is square-integrable only if the surviving exponent has real part below 1/2, which needs a zero with beta > 1 or beta < 0: the edge statement of row G12.

Marks required by stage A (ii): multiplicativity is used in S1 (every prime). The functional equation of the target is used in S2 (residue at w = 1 - beta) at the single point rho: one condition at height gamma, against the count sqrt(T)/log T of CROSS-1 item 1. The functional equation used in S5 and S7 is that of the twists, in the conductor aspect, as in `c11-rs1-twist-modulus-reciprocity`.

## 5. Stage A (iii): control table

"Passes" means: every step holds with the same output as for the target (the vacuous inequality). Since the target itself gets no non-trivial inequality, no control can be separated from it by this device; the table names where each control's object differs.

| Control | Object in this device | First step that differs | Verdict |
|---|---|---|---|
| E_a, a real (generic parameter, two exponents) | E*(z, s_0), xi(2 s_0) != 0 | S2: six further poles, all strictly left of 2 - beta (Lemma 1; MEASURED non-zero residues at beta = 0.3). They change lower-order terms of the principal-character sum only. S1, S3, S4, S5, S7 identical; Lemma 2 and Lemma 3 hold verbatim | **passes every step with the same output** |
| EIS-w (off-resonance Eisenstein series) | same as E_a row | same | **passes** |
| WT (height translate) | zero of zeta(s + i alpha) at rho - i alpha; its object is E*(z, rho/2) relabelled | none (the device is covariant in gamma) | **passes** |
| T-NR | no level-1 Hecke eigen-object: the constant term would need coefficients g(2s) xi(2s), g(2s-1) xi(2s-1) with g(u) = 2 cosh((u - 1/2) log q) + c, and an operator acting on E* by a scalar gives the same factor on both | S0 not formulable at level 1; a level-q realisation (non-spherical section at q) was not constructed (OPEN). If constructed, Lemma 4 below applies to its dominant exponent | not formulable; no quantitative handle |
| DH | combination of Eisenstein series for the two complex characters mod 5 | S0: the weight-0 object is identically zero (row G31: those characters are odd); not eigen at any p; S1 would lose the factorisation | not run |
| DEL, THIN, U, sign twist, Liouville | no automorphic object (no functional equation) | S0 not formulable | not formulable |
| interpolation twin, backward heat, Beurling, theta^w, phase-rotated transfer operator | no Hecke eigen-object | S0 not formulable | not formulable |
| UNIV | the device makes no pointwise claim on L-values in the open strip | out of scope | out of scope |

T-NR invariance pre-filter (round-12 lesson 2): S4 is a coefficient square, S7 is an identity in chi alone; neither reads the size of a Hecke eigenvalue against anything. The step that would (S2', P = 1) is the one that fails for the target.

First passing control: E_a / EIS-w. Stage A stops here; stage B is not opened; the device is registered as closed.

## 6. Pivot (once): higher rank, several zeros at once

Question: does a Borel Eisenstein series on GL_n at a parameter where several xi-factors vanish have fewer exponents, so that P - beta_0 < 1?

**Lemma 4 (PROVED relative to the Gindikin-Karpelevich constant-term formula, CLASSICAL, and zeta(1 + it) != 0).** Let Pi = sum over i of abs(.)^(lambda_i), i = 1..n, any complex lambda, m = min_i Re lambda_i. (i) The completed Rankin-Selberg function prod_{i,j} xi(w + lambda_i + conj(lambda_j)) has a pole at the real point P = 1 - 2m for every lambda: the factor i = j = argmin has a pole there and every other factor has argument of real part >= 1, hence is non-zero (or has a pole). (ii) The rightmost gamma pole of the even twists is at beta_0 = -2m = P - 1, and the factor with that pole is L(w + 2m, chi), which vanishes there (L(0, chi) = 0). (iii) In the normalised series E* = prod_{alpha > 0} xi(<lambda, alpha> + 1) E the constant-term coefficient of the identity Weyl element is prod_{alpha > 0} xi(<lambda, alpha> + 1); for Re lambda in the closed dominant chamber and <lambda, alpha> != 0 it is non-zero. Every lambda is Weyl-conjugate into that chamber and E*(w lambda) = E*(lambda), so the dominant exponent survives at every parameter and for every pattern of zeros in the strip.
Consequence: P - beta_0 = 1 in every rank; by Lemma 3 ((d - 1)/2 + (d - 2)(P - 1) > 0) the inequality is vacuous in every rank. A pattern of zeros can remove non-dominant exponents only.

The pivot is closed. No further pivot.

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | S1 uses the Hecke relations at every prime, but as an identity valid for every parameter; no conclusion depends on it |
| R2 (height-uniform, every window) | false | every step is uniform in gamma, and the output is the vacuous beta <= 7/4 |
| R3 (every control fails at a structural step) | false | E_a, EIS-w, WT pass every step with the same output |
| R4 (reaches the line) | false | no bound on Re rho; Lemma 3 |

Score 0. Not a statement about zeros.

## 8. What the lane adds to the record

1. Lemma 1: xi(rho) = 0 together with the functional equation at rho is equivalent to "the Rankin-Selberg function of E*(., rho/2) has one simple pole pair". A device can read the zero condition as a residue pattern; here it changes only terms that the mechanism does not use.
2. The exact form of the failure: P - beta_0 = 1 (pole position minus parameter) for every Eisenstein object in every rank (Lemma 4), against P = 1 for cusp forms. An LRS-type bound for a zero needs a Hecke eigen-object with parameter rho, entire twists and a rightmost Rankin-Selberg pole at some P with 1 - beta > w*(P, 4) for the values of beta to be excluded (P = 1 would exclude beta < 2/5; any such P is strictly left of 2 - beta). No such object is on file; square-integrable ones (P = 1) exist only for zeros outside the closed strip.
3. The forced vanishing of LRS, applied to GL_1-induced data, is the trivial zero L(0, chi) = 0 at the archimedean place and the zero of the removed Euler factor at a finite place. Any device that reads "gamma pole forces vanishing of twists" on an isobaric sum of characters reads an identity.

## 9. Three weakest steps

1. Section 3 is a reconstruction of the LRS argument (the paper was not opened): the cut-off, the contour shift and the size q^(-1/2) of the averaged root number are ARGUED. It reproduces the published exponent for n = 2, 3, 4. The verdict does not depend on it: Lemma 2 shows directly that the non-vanishing conclusion is false at w = 1 - beta for this object, and the principal-character sum was measured.
2. Zagier 1981 was not opened. The regularisation behind (2.1) and the rule "poles at alpha and 1 - alpha" are relative to it; Lemma 1 itself is a statement about the explicit product G and is proved and checked without it. No unitarity statement about the representation generated by E(., rho/2) is used; by the standard classification (RECALLED) a spherical principal series with parameter s_0 = rho/2, gamma != 0, is unitarisable only for Re s_0 = 1/2, so none is available at level 1 in this normalisation.
3. Control rows T-NR and DH are "not formulable / not run": no level-q object was built. Lemma 4 is stated for regular parameters; on walls (<lambda, alpha> = 0) the normalised series has cancelling poles and the statement was not written out. A non-Borel object (induced from a cusp form, or a residual or metaplectic object) is outside Lemma 4; for those the constant term carries L-functions other than zeta.
