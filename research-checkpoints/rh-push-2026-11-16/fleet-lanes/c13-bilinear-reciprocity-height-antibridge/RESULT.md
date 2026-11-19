# c13-bilinear-reciprocity-height-antibridge: Bettin's reciprocity at height t for the bilinear pair, read as a J-form over characters

Date 2026-11-19. Kind: combine (round-12 combinable 4; pair: Bettin's exact reciprocity at height t for L(s,chi)L(s,chi-bar), the twist-modulus reciprocity of `c11-rs1-twist-modulus-reciprocity`, the bilinear square of `g-spinor-square-root` / `g-antibridge-cancel`). Stage A (paper) with numeric checks of each lemma (local, `scripts/memcap.sh 8`, under 100 MB). No server job was started. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED / CLASSICAL / RELATIVE TO (source opened) / ARGUED / MEASURED / OPEN.

Verdict: **precise obstruction; device closed at the decisive test.** The T-NR twin passes every step (the twin's entries are the zeta-family entries times a positive number at every height, PROVED and checked). E_a with real a makes every entry a Hermitian square. No one-sided statement that is not an identity follows from the J-form.

Row for the map:

> Bilinear twist-modulus reciprocity at height t (Bettin 2016, Theorem 5 with the Estermann reciprocity, case z = 0, complex s) read as a J-form over characters. Entries: R_chi(t) = rotated L(s,chi)L(s,chi-bar), s = 1/2 + it; real, R_chi = R_chi-bar, R_chi(t) = const Z_chi(t) Z_chi(-t) (two-point product of one Hardy function). J = complex conjugation on the character group, J = 1 exactly on real characters. Sign of R_chi(t) = parity of the number of odd-order critical-line zeros of L(s,chi) with ordinate in (-t, t); off-line zeros enter through positive factors. Inertia of the group matrix K_t: 2 x (number of complex pairs with odd parity) + (sign of 2 sqrt(q) cos(t log q) - 2 for the zeta entry). The reciprocity is the Voronoi formula for the coefficients of E(z, 1/2 + it) at the central point of its additive twists; the height is the spectral parameter; the target's functional equation enters only through the archimedean kernel; the two L-arguments are tied (s + j, s - j), j integer, so no kernel in two independent heights is reached. T-NR: entries multiplied by mu_chi(t) mu_chi-bar(t) in [(abs(c) - 2)^2, (abs(c) + 2)^2]: every sign, every inertia, every cone statement unchanged. E_a (real a): every entry is abs(Lambda(s+a,chi) Lambda(s-a,chi-bar))^2 >= 0. DH: entries real for q = +-1 mod 5, same sign rule. Window translate: covariant. DEL, THIN, U: no rotation, no kernel (no functional equation of twists). Closed by: the sign of a point value of a self-dual real function reads on-line zeros mod 2 and nothing off the line; positivity of the pair entries is the property of E_a, not of zeta.

## 0. Plan and the three questions

Read: BRIEF.md (to the end), STRATEGY.md sections 1 and 4.0, ROUND_LOG round-12 results, lessons and combinables, map section 2 and row Z34, `c11-rs1-twist-modulus-reciprocity/RESULT.md`, `c12-repair-sources-statement-o-v3/RESULT.md` and `REFEREE2.md` (T-1), `g-spinor-square-root/RESULT.md` and `REFEREE.md`, `g-antibridge-cancel/RESULT.md`. Source opened as text: Bettin, arXiv:1607.05595v1 (TeX; Theorem 5 = label `tff`, Lemma `rtfs`, Proposition `cfd`, with its proof). Nothing from the source was executed.

New against the record: c11 closed the Hermitian device (sum of abs(F A - 1)^2) and never used an exact identity at t != 0. This lane writes the reciprocity at height t with all terms, identifies what it is (section 2), and decides the J-form question (section 3).

- Q1 (controls): section 4. T-NR, E_a, WT pass; DH passes for q = +-1 mod 5.
- Q2 (height-uniform, every window): the identities hold at every t and at every s in the open strip. No bound is proved.
- Q3 (multiplicativity): used only to name the entries (characters are completely multiplicative, so the twisted series is L(s,chi)). The kernel step uses the functional equation of the twists, i.e. periodicity. T-NR passes, so multiplicativity with unimodular local parameters is not consumed.
- R4: the identity holds for s in 0 < Re s < 1; it is an identity, not a bound.

## 1. First lemma: the reciprocity at height t, every term explicit

Notation. D(u, w; h/k) = sum_n sigma_w(n) e(nh/k) n^-u (Estermann function, continued). For q prime and (a, q) = 1 (Bettin, Theorem 5, z = 0):

  M*(s; a, q) := q^s/phi(q) sum*_{chi mod q} chi(a) L(s,chi) L(s,chi-bar) + (q^s + q^(1-s) - 2) zeta(s)^2/phi(q),

  (T5)  D(s, 2s - 1; a/q) = (2 pi)^-s Gamma(s) ( e^{pi i s/2} M*(s; a, q) + e^{-pi i s/2} M*(s; -a, q) ).

(RELATIVE TO Bettin Theorem 5; identity of meromorphic functions in s. Checked: part A of `checks.log`, six cases, differences below 1e-33.) The sum is over primitive characters; the zeta entry carries the weight q^s + q^(1-s) - 2, not (q^(s/2) - q^(-s/2))^2: this is the weight that makes the whole object symmetric under s -> 1 - s.

Write s = 1/2 + b with abs(Re b) < 1/2, b != 0 (b = it on the critical line), x = a/q, a, q coprime positive integers, Q_2j(b) = prod_{l<j} ((l + 1/2)^2 - b^2), and D_j(y) = D(1/2 + b + j, 2b; y).

**Lemma 1 (reciprocity, truncated at any J >= 1, with explicit remainder).**

  D_0(a/q) = sum_{j=0}^{J} ((-1)^j Q_2j(b)/j!) [ (x/(2 pi i))^j D_j(-q/a)
        - sum_{l=0}^{j} ((-1)^(j-l)/(j-l)!) zeta(1/2 + l + b) zeta(1/2 + l - b) (x/(2 pi i))^l
        - Gamma(1/2 + b - j) zeta(1 + 2b) (2 pi/x)^(-1/2-b) e^{-(1/2+b) pi i/2}
        - Gamma(1/2 - b - j) zeta(1 - 2b) (2 pi/x)^(-1/2+b) e^{-(1/2-b) pi i/2} ]
        + E_J(b, x),

  E_J(b, x) = (1/2 pi i) int_{Re w = c} [ H(w, b) - sum_{j<=J} (-1)^j Q_2j(b) Gamma(w - j)/j! ] zeta(1/2 + w - b) zeta(1/2 + w + b) (2 pi i/x)^-w dw,   -1 < c < -1/2 - abs(Re b),

  H(w, b) = (2 pi)^{2w} Gamma(-w) / ( X(1/2 + w - b) X(1/2 + w + b) ),   X(u) = 2^u pi^(u-1) sin(pi u/2) Gamma(1 - u)   (zeta(u) = X(u) zeta(1 - u)).

Status: RELATIVE TO Bettin (Lemma `rtfs` and Proposition `cfd`; the infinite-J form is his (ecfd), with E_J replaced by the tail of the series plus his Z_+). The finite-J form with the single remainder integral is assembled here from his proof: the split H = sum_{j<=J} + (H - sum) on his line Re w = -1/2 - delta, his evaluation of the j-th integral, and his limit z -> a/q. The integrand of E_J is O(abs(v)^(-J-1) (1 + abs(b))^(2J+2)) on the side with no exponential decay, so the integral converges absolutely for J >= 1 at real x. Checked: part B, six cases (table below), and two further cases by a separate routine (`ref_check.log` (i)).

Moment form. By (T5) the left side is the pair (M*(s; a, q), M*(s; -a, q)). For a prime or a = 1 the dual Estermann values are, by Theorem 5 with z = j, the moments to the modulus a of the pairs L(s - j, chi-bar) L(s + j, chi), chi mod a, twist -+q. So the law is

  (modulus q; twist a; pair (s, s)) -> sum_j (a/q)^j (modulus a; twist -q; pair (s + j, s - j)) + zeta terms + polar terms + E_J(b, a/q).

Zeta-side terms, all present and not identically zero: (i) zeta(s)^2 with weight q^s + q^(1-s) - 2 inside M*(s; a, q), and the same with a inside the dual; (ii) zeta(1/2 + l + b) zeta(1/2 + l - b), l <= J; on the line this is abs(zeta(1/2 + l + it))^2; (iii) zeta(1 +- 2b): zeta on the line Re = 1 at height 2t; (iv) inside E_J, zeta(1/2 + w - b) zeta(1/2 + w + b) on a vertical line, all heights. For a = 1 the dual Estermann value is zeta(1/2 + b + j) zeta(1/2 - b + j) and the law is an exact formula for the trace (section 3, (v)).

| a/q | b | J | D_0(a/q) | abs(D_0 - main - E_J) | j = 0 dual D_0(-q/a) | -zeta(1/2+b) zeta(1/2-b) | abs(D_0 - all but dual terms) |
|---|---|---|---|---|---|---|---|
| 2/5 | 2.5i | 6 | -1.617284518 | 3.5e-13 | -0.6803594296 | -0.2769738 | 0.665 |
| 3/7 | 2.5i | 6 | -1.266303476 - 1.092202641i | 1.8e-13 | -0.7197539946 - 1.066481528i | -0.2769738 | 1.244 |
| 1/5 | 2.5i | 6 | 0.946658962 + 1.920609201i | 7.0e-13 | 0.2769738 (= abs(zeta(1/2+2.5i))^2) | -0.2769738 | 0.280 |
| 2/5 | 10i | 9 | -3.724649071 | 1.7e-7 (main and E_J are each of size 2.2e8) | 0.6110283455 | -2.400003742 | 267.8 |
| 3/7 | 10i | 9 | 0.0267537834 - 3.857834183i | 1.6e-7 (same) | -2.439291954 - 1.381556611i | -2.400003742 | 513.5 |
| 2/5 | 0.2 + 1.5i (s = 0.7 + 1.5i, off the line) | 6 | -0.8629241278 + 0.1418574394i | 1.8e-10 | -0.2053802919 + 0.0948918004i | -0.3460407 - 0.0405947i | 0.220 |

The last column shows that the dual-modulus terms are needed: dropping them leaves a defect of order 1.

**Which side carries the target's functional equation.** Neither modulus side.
1. The functional equation of zeta enters once, in the kernel H(w, b): the product X(1/2 + w - b) X(1/2 + w + b) is the functional-equation factor of E_b(u) = zeta(u + b) zeta(u - b) under u -> 1 - u. It is the archimedean factor alone; the identity is Voronoi summation for sigma_2b(n) n^-b with additive twists, at the central point u = 1/2 of the twisted series, with the Bessel kernel of index b expanded in inverse factorials ((-1)^j Q_2j(b)/(j! 2^j) are the Hankel coefficients of K_b). PROVED as a reading of the proof (the Mellin transform of H is the Voronoi kernel; CLASSICAL).
2. So the height is not a Mellin displacement on the family side. It is the spectral parameter of the Eisenstein series E(z, 1/2 + it), whose coefficients are sigma_2it(n) n^-it. The target appears as E_it(u) = zeta(u + it) zeta(u - it) read at u = 1/2 (and at u = 1/2 + l). This is the control EIS-w / E_a with imaginary parameter, as an object.
3. Why the Hermitian pair is not reached (answers T-1 of `c12-repair-sources-statement-o-v3/REFEREE2.md`): abs(L(1/2 + it, chi))^2 is the case s = 1/2, z = it of Theorem 5, the value D(1/2 + it, 0; a/q) of the twisted series of E(z, 1/2) off its central point. The limit z -> a/q of the modular relation reads only the central point plus integers (z in Z in Bettin's variable). The Estermann functional equation at 1/2 + it maps a/q to a-bar/q, same modulus. PROVED as a statement about this proof; "no other proof gives it" is not claimed.
4. The self-dual functional equation of F_chi(s) = L(s,chi) L(s,chi-bar) (root number eps(chi) eps(chi-bar) = 1) is used on the family side only to make the entries real (section 3 (i)). It is the functional equation of the twists, in the conductor aspect; it is the same input as in c11.

Count of conditions in which zeta's functional equation is read at height T: one kernel, which is the same for every function with zeta's gamma factor whose twists have functional equations. For the list in STRATEGY 4.0 (b) this is 0 conditions on the target beyond the gamma factor.

## 2. What the pairing with the c11 reciprocity gives

c11 Theorem 2 (s = 1, odd characters, Dedekind sums; proved there directly) concerns the pair (s, s) at the real point s = 1, the boundary value Re b = 1/2 of the family of Lemma 1 (ARGUED; the limit b -> 1/2 of Lemma 1 was not taken here). At real s, L(s,chi) L(s,chi-bar) = abs(L(s,chi))^2. At real s the bilinear pair and the Hermitian pair coincide; that is why c11 saw a positive form. At height t != 0 they separate: the exact law follows the bilinear pair. The c11 zero-one law (Lemma 4) used positivity of each term and has no bilinear analogue: sum_chi (F A - 1)(F-bar A-bar - 1) is not a sum of non-negative terms.

## 3. Decisive first test: the J-form and one-sided statements

Fix q prime, t real, s = 1/2 + it. For chi != chi_0 mod q with parity k:

  R_chi(t) := pi^-s Gamma((s+k)/2)^2 q^s L(s,chi) L(s,chi-bar) / abs(Gamma((s+k)/2))^2,
  R_0(t) := pi^-s Gamma(s/2)^2 zeta(s)^2 (q^s + q^(1-s) - 2) / abs(Gamma(s/2))^2.

These are the entries of M* after the Hardy rotation of each parity class (the even and odd parts of M* in the twist a rotate separately).

**Proposition 3 (PROVED; CLASSICAL inputs: functional equation of primitive Dirichlet L-functions, eps(chi) eps(chi-bar) = 1).**
(i) R_chi(t) is real and R_chi = R_chi-bar. R_0(t) = pi^(-1/2) (2 sqrt(q) cos(t log q) - 2) Z(t)^2 with Z the Hardy function of zeta.
(ii) With Z_chi(t) the Hardy function of L(s,chi) (real for real t; Z_chi-bar(t) = Z_chi(-t)): R_chi(t) = (q/pi)^(1/2) Z_chi(t) Z_chi(-t), where abs(Z_chi(t)) = abs(L(1/2 + it, chi)). For real chi, Z_chi is even and R_chi = (q/pi)^(1/2) Z_chi(t)^2 >= 0.
(iii) (J-form.) For weights c_a on twists, with c-hat(chi) = sum_a c_a chi(a): sum_a c_a M*_rot(t; a) = sum_chi c-hat(chi) R_chi(t). In the real coordinates x_chi = Z_chi(t) this is the bilinear form sum_chi c-hat(chi) x_chi x_{J chi}, J chi = chi-bar. J = 1 exactly on real characters. On a complex pair {chi, chi-bar} the form is the hyperbolic plane 2 c-hat x_chi x_chi-bar = (c-hat/2)((x_chi + x_chi-bar)^2 - (x_chi - x_chi-bar)^2). As a quadratic form in free variables its negative index is #{real chi: c-hat < 0} + #{complex pairs: c-hat != 0}: a function of the weight and of the group, not of any zero.
(iv) (Sign rule.) If L(1/2, chi) != 0: sign R_chi(t) = (-1)^{n_chi(t)}, n_chi(t) = number of zeros of L(s,chi) on the critical line with ordinate in (-abs(t), abs(t)), counted with multiplicity. Proof: R_chi(0) > 0, R_chi(t) = const Z_chi(t) Z_chi(-t), and a real-analytic function changes sign exactly at its zeros of odd order. In the Hadamard product of Lambda(s,chi) Lambda(s,chi-bar) at s = 1/2 + it an on-line zero gamma of L(s,chi) contributes (1 - t/gamma)(1 + t/gamma), an off-line zero with its reflection contributes abs(1 - t/gamma)^2 abs(1 + t/gamma)^2 > 0 (grouping; convergence factors cancel in the symmetric product).
(v) (Inertia.) The group matrix K_t[a, b] = M*_rot(t; a b^-1) is real symmetric with eigenvalues (q-1) R_chi(t). Its negative index is 2 #{complex pairs {chi, chi-bar}: n_chi(t) odd} + [cos(t log q) < q^(-1/2) and Z(t) != 0]. Its trace/(q-1) = sum_chi R_chi(t) = M*_rot(t; 1), which Lemma 1 with a = 1 gives in terms of zeta alone (dual values zeta(1/2 + j + it) zeta(1/2 + j - it)) plus E_J(it, 1/q).

Checked (part C): max abs(Im R_chi) = 7e-19 over 401 heights and all characters mod 5 and 7; real characters: min R = 4e-6 > 0, no sign change; complex pairs: 31 (q = 5) and 33, 34 (q = 7) sign changes on (0, 40]; inertia of K_t equals the count in (v) at t = 3, 9.3, 21.7 (for example q = 5, t = 9.3: (1, 3); q = 7, t = 9.3: (6, 0); q = 7, t = 21.7: (3, 3)); sign rule (iv) 8 of 8 heights against a direct count of sign changes of Z_chi on (-t, t) (`ref_check.log` (ii)).

**Theorem 4 (decisive test). No one-sided statement that is not an identity follows.**
(a) Negative index. By (iii) the index of the form in free variables is fixed by the weight. By (v) the index of K_t at the actual values is a parity count of on-line zeros in the window (-t, t), plus one explicit sign. Off-line zeros do not change it (iv). So a bound on the negative index is a statement about parities of on-line counts; it holds or fails identically whether or not there are zeros off the line. PROVED.
(b) Cone of weights, J-fixed part. For c-hat >= 0 supported on real primitive characters, sum c-hat R_chi >= 0 at every height. This is the square of a real number: the identity Z_chi(t)^2 >= 0. It holds for every function with a self-dual functional equation (DH twisted by a quadratic character with q = +-1 mod 5 included). PROVED; an identity.
(c) Cone of weights, one complex pair. R_chi(t) takes both signs: L(s,chi) has zeros of odd order on the critical line (CLASSICAL, Selberg's method for Dirichlet L-functions; MEASURED here: 31 sign changes for q = 5 below height 40). So neither R_chi >= 0 nor R_chi <= 0 holds at every height, and a sign on a cone containing a complex pair alone is false.
(d) Mixed weights. MEASURED only: real character with weight 1 plus the pair k = 1 with weight lambda in {+-0.05, +-1}: the minimum over the grid is negative in all eight cases (q = 5: -0.35, -7.59, -0.55, -11.35; q = 7: -1.00, -21.81, -0.76, -16.51). At the first 12 ordinates of zeros of zeta (where R_0 = 0) the pair entry for q = 5 takes the signs - + + - + - - + + - + -. Not proved for all weights: it would need independence of the sign patterns of different characters at a common height (ARGUED from the independence of the zero sets; OPEN as a theorem).
(e) What a sign would mean. By (iv), R_chi(t) >= 0 at every t says that L(s,chi) has no zero of odd order on the critical line. This is the property of E_a with real a (section 4), whose zeros are all off its central line. For the zeta family a one-sided bound on a pair entry is false, and the direction in which it would hold is the direction away from the target property.
(f) Two independent heights. A kernel in two variables (the object in which the bridge form of `g-spinor-square-root` has its index: H_c = sum over zeros of y_gamma conj(y_gamma-bar), J: gamma -> gamma-bar, negative index = rank Gamma_-) needs pairs L(s_1, chi) L(s_2, chi-bar) at independent s_1, s_2. Theorem 5 covers them (z = (s_1 - s_2)/2), but the reciprocity holds only for z in Z: arguments (s + j, s - j) at one common height, abscissas differing by an even integer. At most one node lies in the open strip. No Gram or Pick matrix over two or more nodes in the strip is obtained from this law. PROVED as a statement about Lemma 1; the type mismatch is: the moduli J-form has J acting on the family (chi -> chi-bar) and entries that are point values at one height; the bridge J-form has J acting on the zeros of one function and entries that are quadratic in a test function.

Outcome of the decisive test: the J-form over the moduli is indefinite by construction, its index is a parity count that is blind to off-line zeros, and the only one-sided statements are (b), an identity, and the Hermitian case t = 0 of c11. Under the stop rule the control table is written and no stage B is run.

## 4. Controls

Steps: S0 moment = Estermann (T5); S1 reality after rotation (functional equation of the twisted pair, root number 1); S2 reciprocity a/q -> -q/a (Lemma 1; functional equation of every twist plus the kernel H); S3 J-form and sign rule (Proposition 3); S4 a one-sided statement (none found; Theorem 4).

| Control | S0 | S1 | S2 | S3 | Outcome |
|---|---|---|---|---|---|
| T-NR, F = zeta(s)(1 + c q0^(1/2-s) + q0^(1-2s)), abs(c) > 2 | passes | passes | passes as a five-term combination of zeta-family laws at twists a q0^j, j = -2..2 (Proposition `cfd` holds for all coprime positive a, q) | passes: entries multiplied by mu_chi(t) mu_chi-bar(t) > 0 | **passes every step** (Lemma 5) |
| E_a, real a, E_a(s,chi) = L(s+a,chi) L(s-a,chi) | degree 4: no Estermann form on file | passes | not on file (fourth-moment type) | every entry is a Hermitian square >= 0 (Lemma 6) | passes S1, S3; satisfies the one-sided statement that fails for zeta |
| E_b, b imaginary (EIS-w reading) | it is the object of Lemma 1 | | | | the law is a statement about this control's central values |
| Window translate zeta(s + i alpha) | passes | passes with t -> t + alpha | passes with b -> b + i alpha (the law holds for all b) | passes, heights shifted; the zeta entry weight becomes non-symmetric, as an identity | passes every step |
| DH (twists by psi mod q) | passes in the form of level 5q Estermann-type sums with characters (ARGUED) | passes for q = +-1 mod 5; fails for q = +-2 mod 5 (MEASURED: abs(Im)/abs(value) 4e-20, 8e-20 at q = 11, 19; 1.0 at q = 7, 13). Reason: the ratio of the root numbers of psi chi_5 and psi chi_5-bar carries chi_5(q)^2, which is +1 for q = +-1 mod 5 and -1 otherwise; in the second case the functional equation sends the twisted combination to the one with conjugate coefficients | not derived (level 25 Eisenstein series with characters; ARGUED that Voronoi holds there) | passes on q = +-1 mod 5: same sign rule, off-line zeros of the twists invisible | passes S1, S3 on half of the moduli; S2 not derived |
| DEL, THIN | defined | fails: no functional equation of the twists, no rotation | fails: no kernel | no real form | fail at S1; nothing is lost, since there is no S4 to protect |
| U (unimodular completely multiplicative twist) | defined | fails as DEL | fails | no real form | fails at S1 |
| Backward heat, Beurling, theta^w, phase-rotated transfer operator | no family of character twists with functional equations is defined | | | | out of scope of the device |

**Lemma 5 (T-NR invariance; PROVED).** Let y = q0^(1/2-s), F(s,chi) = L(s,chi)(1 + c chi(q0) q0^(1/2-s) + chi(q0)^2 q0^(1-2s)) = chi(q0) y L(s,chi) (chi-bar(q0)/y + c + chi(q0) y), q0 != q. Then
 F(s,chi) F(s,chi-bar) = y^2 L(s,chi) L(s,chi-bar) [ (y^2 + y^-2 + c^2) + c (y + 1/y)(chi(q0) + chi-bar(q0)) + chi(q0)^2 + chi-bar(q0)^2 ],
so the twin's moment at twist a is (y^2 + y^-2 + c^2) S(a) + c (y + 1/y)(S(a q0) + S(a q0^-1)) + S(a q0^2) + S(a q0^-2) times y^2, with S the zeta-family moment. On Re s = 1/2, abs(y) = 1 and the bracket equals mu_chi(t) mu_chi-bar(t), mu_chi(t) = c + 2 Re(chi(q0) q0^-it), which has the sign of c: (abs(c) - 2)^2 <= mu_chi mu_chi-bar <= (abs(c) + 2)^2. The factor y^2 = q0^-2it is absorbed by the rotation (conductor q q0). Hence every R_chi(t), every sign, the inertia of K_t at every height and every cone statement are the same for the twin, whose zeros lie at Re s = 1/2 +- arccosh(abs(c)/2)/log q0. This is the T-NR invariance pre-filter of round-12 lesson 2 in exact form: the device is passed by multiplication with a positive Dirichlet polynomial at one prime. Checked (part D; q0 = 2, c = 2.1, twin zeros at Re s = 0.9543 and 0.0457): max abs(ratio - mu mu) = 5e-20 over 200 heights x 3 characters, mu mu in [0.0100027, 16.8097] against bounds [0.01, 16.81]; five-term identity on and off the line (`ref_check.log` (iii)).

**Lemma 6 (E_a, real a; PROVED).** On Re s = 1/2, Lambda(s - a, chi) Lambda(s + a, chi-bar) = conj(Lambda(s + a, chi) Lambda(s - a, chi-bar)) (functional equation of each factor, eps(chi) eps(chi-bar) = 1). So the pair entry of E_a is abs(Lambda(s + a, chi) Lambda(s - a, chi-bar))^2 >= 0 at every height, for every chi. Checked (part E): relative difference 8e-20, 2 x 60 x 3 cases. Consistent with (iv): under GRH E_a(., chi) has no zero on its central line.

The stop rule applies: T-NR passes every step.

## 5. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | not established | Multiplicativity enters only in naming the twisted series. Lemma 5: a non-unimodular local factor at one prime changes each entry by a positive factor. |
| R2 height-uniform, every window | not established | Lemma 1 and Proposition 3 hold at every t and for all s in the open strip, as identities. No bound is proved; Theorem 4 finds none to prove. |
| R3 fails for every control | no | T-NR passes every step (Lemma 5); the window translate passes; E_a satisfies the one-sided statement; DH passes S1 and S3 on q = +-1 mod 5. |
| R4 reaches the critical line | no | The height read by the law lies on the critical line and anywhere in the open strip (checked at b = 0.2 + 1.5i), but the statement is two-sided. The target's functional equation is read through the gamma factor only. |

## 6. Pivot (considered; not run)

The adjacent object is the trace law (Proposition 3 (v) with Lemma 1 at a = 1): sum over all chi mod q of the two-point product Z_chi(t) Z_chi(-t), with the zeta entry, equals an explicit expression in zeta(1/2 + j +- it), zeta(1 +- 2it) and E_J(it, 1/q), at every height. It is an exact family average at a fixed height (checked, row 1/5 of the table). It is signature-weighted, so it bounds no single entry, and it is a conductor-aspect mean value (MV-CAP in the family direction). T-NR and the window translate pass it by Lemma 5 and covariance. Not stronger than what is closed; no pivot run.

## 7. Numeric record

Run: `scripts/memcap.sh 8 .venv-arb/bin/python -u tmp/research-2026-11-16/push/c13-bilinear-reciprocity-height-antibridge/checks.py` (parts A to E), `checks_dh.py` (part F), `ref_check.py` (second-pass routines). Remainder integral: Gauss-Legendre, 40 nodes per unit interval, line Re w = -3/4 (or -0.85 when Re b = 0.2), from -40 - abs(t) to V; mp.dps = 34. A first build with 24 nodes per interval of length 2 left a defect of 4e-5; refinement, a second line (c = -0.6) and a second J (J = 3) gave 2e-13, 2e-13 and 2e-8 (the last equal to the tail estimate).

Second-pass routine (`ref_check.log` (i); Estermann function through periodic zeta functions, remainder by `mp.quad`): a/q = 3/11, b = 1.7i, J = 5, c = -0.7: defect 2.0e-12 (abs(E_J) = 6.65); a/q = 5/7, b = 3.2i, J = 6, c = -0.8: defect 1.4e-11 (abs(E_J) = 84.5).

At b = 10i the sum over j and the remainder are each of size 2.2e8 and cancel to a value of size 4; the defect 1.7e-7 is 8e-16 of the terms. The size comes from Q_2j(it) of order t^(2j): the inverse-factorial form is numerically usable only for t^2 x/(2 pi) of moderate size. This does not affect the identity.

Part A: abs(D - right side of (T5)) <= 7.8e-34 in six cases (a/q = 2/5, 3/7; s = 1/2 + 2.5i, 1/2 + 10i, 0.3 + 1.7i); zeta(s)^2 = 0.2099 - 0.1808i, 2.3734 - 0.3564i, -0.0255 - 0.2406i; zeta part of M* and non-principal part both of order 1 (for example a/q = 2/5, s = 1/2 + 10i: -3.6446 + 0.5472i and -0.0388 + 0.0058i).

Wall time: `checks.py` 6.5 minutes, `ref_check.py` about 4 minutes, `checks_dh.py` under 10 s; one process each; no allocation above a few thousand multiprecision numbers.

## 8. Three weakest steps

1. Lemma 1 in its finite-J form is assembled here from Bettin's proof and is not in his text in this form; it is supported by eight numeric cases to 1e-12 or better where the cancellation allows, not by a written proof of the boundary limit for E_J (absolute convergence at real x for J >= 1 is argued from Stirling's formula; his limit argument for the j = 0 polar terms is taken over). The moment form of the dual side is stated for a prime or a = 1; for composite a, Theorem 5 is "easy to generalize" in the source and not carried out. The T-NR pass at S2 uses representatives of a q0^j mod q, which are in general composite; in Estermann form the law holds for them, in moment form it is not on file.
2. Theorem 4 (d): that no weight outside the real-character cone gives a one-sided statement is measured on two moduli and eight weights, not proved. A proof needs joint sign independence of Z_chi(t) Z_chi(-t) across characters at a common height. Theorem 4 (c) quotes Selberg's theorem for Dirichlet L-functions (odd-order zeros on the line) without opening a source; the numeric sign changes are the evidence on file. The sign rule (iv) assumes L(1/2, chi) != 0.
3. The DH row: S2 is argued (existence of a Voronoi law for the level-25 Eisenstein series with characters), not derived; S0 likewise. The E_a row at S0 and S2 says "not on file", which is a statement about the sources read. Theorem 4 (f) ("no kernel in two independent heights") is a statement about this reciprocity and its proof; a different exact law for D(u, w; a/q) off the central point is not excluded. No independent referee ran (see REFEREE.md).

## 9. Files

- `RESULT.md` (this file); `REFEREE.md` (second pass with separate routines; not an independent referee).
- `checks.py`, `checks.log` (parts A to E); `checks_dh.py`, `checks_dh.log` (part F); `ref_check.py`, `ref_check.log`.
- `lanes.jsonl` (one line).
- Source text read from a temporary directory outside the repository (`/tmp/c13-bettin-src`, arXiv e-print 1607.05595v1); not copied into the lane.
