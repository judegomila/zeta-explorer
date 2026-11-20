# ap-order-two: the 7/8 architecture at row order 2 (2026-11-17)

Internal working note. Slug `ap-order-two`. Nothing committed, pushed or posted. Not refereed.
Files in this directory: `probe2.py`, `probe2.log`, `probe2.json` (numerics, 10 s, run through `scripts/memcap.sh 8`).

Labels: PROVED (complete argument here) / PROVED-sketch (argument given, error terms by standard counting, not written
line by line) / PROVED-rel X / CLASSICAL / MEASURED / MODEL (exponent bookkeeping inside the estimate system) /
ARGUED / OPEN.

**Verdict: precise obstruction.** The order-2 architecture exists, is explicit, and has model abscissa 1/2 at
effective order r/h = 2. Its single required input (the low estimate) is equivalent to the conclusion: the probe
equals the smoothed Moebius sum of the target up to Z^eps, unconditionally and for arbitrary coefficients. With the
estimates available inside the system (Cauchy-Schwarz, the quadratic large sieve, convexity, Poisson summation) the
abscissa is 1. The structural step that fails is the absorption identity: the quadratic Gauss sum is a root of
unity times a character (a Weil index), so it cannot absorb mu; Poisson summation in the row variable then maps the
probe to a probe of the same form, and the two "independent" representations of the 7/8 method coincide. Mixed and
higher-rank variants reduce to this case or to rows already closed (Z14). No abscissa is claimed. No statement
about any zero is made. 7/8 (unrefereed manuscript) stands; RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), OBSTRUCTION_MAP (all), `r3-method-limit` + REFEREE, `zf-higher-rows` + REFEREE,
`r3-higher-rows-dual` + REFEREE, `r2-zf-paired-rows` + REFEREE (sections 1-4), `bypass-78` (sections 0-3),
`formalization/paper/zf-campaign-synthesis.md`, manuscript `~/lean-deps/qrh-verify/paper.txt` (proof overview,
Prop. 2.1, section 6.1, section 7.1-7.2).

Rows touched, and what is different:

* **Z15** (`r3-method-limit`): states B >= 1 - h/r and, in one sentence, that at r = 2 "the absorbed object is the
  principal character: the reflected side is the Moebius sum itself". Here the r = 2 probe is written out, its exact
  decomposition is proved (Theorem A), the equivalence of its low estimate with the conclusion is proved (Theorem B),
  and the high side is shown to need no detector at all.
* **Z14** (`zf-higher-rows`, `r2-zf-paired-rows`, `r3-higher-rows-dual`): product rows, conjugate pairs, orders 4 and
  5. Not repeated. `r2-zf-paired-rows` Lemma B(iii) and Theorem D are used as inputs in section 6. New here: the pure
  order-2 case, the quadratic-form (Weil representation / Siegel theta) rows, and the statement that weights given by
  representation numbers are multiplicities.
* **G14, G18** (Hecke on the twin ladder; metaplectic cover): the bridge-side statements are not used. The same fact
  appears from the other side: the weight-1/2 theta object is self-dual under the Fourier transform (section 3.4).
* Map section 6 item 1 ("effective order 2: no candidate coherent set of exponent 1/2 exists"): corrected in one
  respect. Coherent sets of exponent 1/2 exist (squares); what does not exist is a second representation in which the
  reciprocal is absent.

The user's line of attack asks for a structure where positivity is automatic. This lane tests the one place in the
only height-uniform mechanism on file (S1: the 7/8 theorem) where an order-2 object could enter. The outcome is that
order-2 objects enter only as identities.

---

## 2. Definitions (from the sources)

All from the manuscript (Def. 10.1, (6.1), (6.2), (7.5), (10.3), Prop. 2.1), Liu II section 15.1 and
`r3-method-limit` section 1.

* **Probe.** I = Q^{-1/2} sum_m A_m B_m. m is the row variable of norm about Q = XY, X = Z^{lx}, Y = Z^{ly},
  M = lx + ly. A_m is an additive polynomial of length Y in Gauss sums of order r with index m. B_m is a row at scale
  Z whose coefficients are twisted by the order-r residue symbol chi_a(m).
* **Rows of order r.** After Poisson summation in m the frequencies are u a^r with u r-th-power-free. Row u carries a
  quotient of Hecke L-functions twisted by chi_.(u), a character of order r. Row u = 1 carries 1/L(s, eta) for the
  target eta. "Order r" is the order of the residue symbol in the row twist.
* **Absorbed class.** The coefficient c_a of B_m must satisfy c_a * conj g(chi_a) / sqrt(N a) = mu(a) xi(a) with xi
  Hecke times periodic; otherwise row u = 1 does not carry the reciprocal. For r >= 3,
  mu(pi) g(chi) = -J(chi, rho) g(chi rho)/g(rho) (`zf-higher-rows` Thm 1) puts c_a in the Gauss class of order
  nu(r); nu(6) = 3 is Patterson's cubic theta.
* **h.** The dual frequencies have norm up to Z^h, h = 1 - lx + l (l = total length of the prime marks). The signal
  of row u = 1 is Z^{C(s)}/L(s, eta), C(s) = s - 1 + lx/2 + h/r: h/r is the exponent of the number of r-th powers of
  norm <= Z^h.
* **Abscissa.** Prop. 2.1 needs (2.4) |I| << Z^{C(sigma_0) + omega} (low estimate, unconditional) and
  (2.5) |I - f| << Z^{C(beta*) - sigma} (high estimate; f the signal, beta* the supremum of real parts of zeros in the
  family). If the low estimate has exponent e_low, B = e_low - (C(s) - s).
* **Effective order.** With the low estimate at the square-root level Z^{lx/2} (Cauchy-Schwarz with ||A||^2 = Q/Y,
  ||B||^2 = Q), B = 1 - h/r. r_eff := r/h. Part I: 12; manuscript: about 7.4; Liu II: about 7.5. RH needs r_eff = 2.

---

## 3. The order-2 architecture, step by step

Field Q (order-2 symbols need no roots of unity beyond +-1). s, c run over odd squarefree positive integers; (m/n) is
the Jacobi symbol; eps_n = 1 or i for n = 1 or 3 mod 4; g(n; m) = sum_{d mod n} (d/n) e(md/n) = (m/n) eps_n sqrt n for
squarefree odd n and every m. W1, w in C_c^inf(1, 2), Om in C_c^inf(1/2, 2), nonnegative.

  A_m(Y) = Y^{-1} sum_s W1(s/Y) conj(eps_s) s^{-1/2} g(s; m) = Y^{-1} sum_s W1(s/Y) (m/s),
  B_m(Z) = Z^{-1/2} sum_c x_c (m/c) w(c/Z),        x_c = mu(c) eta(c)  (target),
  I(X, Y, Z) = Q^{-1/2} sum_{m >= 1} Om(m/Q) A_m B_m.

This is the manuscript's (6.2) with 6 -> 2: A is the first moment of quadratic Gauss sums at index m, B has the
absorbed coefficient, and the normalisation is the one in which generic |A_m| is Y^{-1/2} and generic |B_m| is 1.

### 3.1 Step table

| step of the manuscript | order 6 | order 2 | status at order 2 |
|---|---|---|---|
| detector (zero => large inverse and plain polynomials) | section 8 | unchanged | CLASSICAL; not needed (Theorem A(b)) |
| rows and their twists | sextic chi_.(u), u sixth-power-free | quadratic chi_u, u squarefree | PROVED |
| row count (large sieve) | sextic, (KD)^{2/3} term | Heath-Brown, (K + D): optimal on squarefree rows | CLASSICAL |
| absorption mu g(chi) = Hecke * g(chi rho)/g(rho) | chi rho cubic: cubic theta coefficients | chi rho principal: g = -1 = mu. Not absorbed | **fails** (Lemma 0) |
| reflected side (Prop. 5.1, Lemma 5.8) | cubic theta functional equation, a = 2, then quadratic sieve | B_m is the truncated reciprocal 1/L(., eta chi_m); its "functional equation" is that of L in the denominator; a contour shift crosses the zeros | **fails**: reflected side = Moebius sums |
| Poisson side, row u = 1 | 1/L(s, eta) x count Z^{h/6} | 1/L(s, eta) x count Z^{h/2} | PROVED (same term as the square rows m = t^2 of the direct side) |
| exceptional term of the A-norm | coset e_0 t^6 a^6, P_a^{1/6}, sextic theta (TRO6, open) | rows m = t^2, P_a^{1/2}, weight-1/2 theta, tau_2(m) = 1_{m = square}: exact | PROVED; and this coset **is** the signal |
| counts for the high side | Lemmas 17.1, 18.1, Prop. 19.2 | not needed: non-square rows are O(Z^eps) for Y >= Z^{3/2} | PROVED-sketch (Theorem A(b)) |
| low estimate (2.4) | Prop. 6.3 / 15.3, unconditional | equivalent to the conclusion | PROVED-sketch (Theorem B) |

**Lemma 0 (forced coefficient) [PROVED].** Let b_c be coefficients on odd squarefree c such that Poisson summation
in m gives, in the frequency-1 term, the coefficient mu(c) xi(c) with xi periodic times a Dirichlet character. Then
b_c = mu(c) xi(c) conj(eps_c) up to the reciprocity sign (-1)^{(s-1)(c-1)/4}, which is a function of s, c mod 4.
Proof: the Poisson dual of m -> (m/c) is h -> g(c; h)/sqrt c = (h/c) eps_c, and |eps_c| = 1 with eps_c periodic. QED
The general identity mu(pi) g(chi) g(rho) = -J(chi, rho) g(chi rho) requires chi rho nontrivial. At chi = rho it
reads g(rho)^2 = rho(-1) q: the product of the two Gauss sums has no mu in it, because the Gauss sum of the principal
character, -1 = mu(pi), is what the left side would need.

### 3.2 Theorem A (the probe is the Moebius sum)

Write m = m_0 t^2 with m_0 squarefree. f := the part of I with m_0 = 1 (square rows); N := I - f.

**Theorem A.** Let |x_c| <= 1 be arbitrary complex coefficients on odd squarefree c. Then for every eps > 0:

(a) [PROVED-sketch]
  f = Z^{-1/2} sum_c x_c k_Y(c) w(c/Z) + O(Z^{1/2 + eps} Q^{-1/2}),
  k_Y(c) = (1/2 pi i) int W1^(w) Y^{w-1} kappa_Om D_c(w) dw,  D_c(w) = sum_{s odd sf} phi([s,c]) [s,c]^{-1} s^{-w},
where D_c(w) = zeta(w) E(w) prod_{p | c} u_p(w), E and u_p holomorphic and bounded for Re w >= 1/2 + eps,
u_p(w) = 1 - 1/p + O(p^{-1 - Re w}). So k_Y(c) = c_0 h(c) + O(Y^{-1/2 + eps} c^eps) with h multiplicative,
h(p) = (1 - p^{-2})/(1 + p^{-1} - p^{-2}), c_0 > 0. For x_c = mu(c) eta(c):

  f(Z) = (1/2 pi i) int w^(s) Z^{s - 1/2} H_Y(s) / L^{(2)}(s, eta) ds + O(Z^{1/2 + eps} Q^{-1/2}),

H_Y holomorphic for Re s > 0, H_Y(s) = c_0 H(s) (1 + O(Y^{-1/2 + eps})) on Re s >= 1/2, H an absolutely convergent
Euler product on Re s > 0 without zeros there. This is the signal of Prop. 2.1 with C(s) = s - 1/2.

(b) [PROVED-sketch]  |N| <<_eps (QYZ)^eps (1 + X^{1/2} + Z^{1/2} Y^{-1/3}).

(c) [PROVED from (a), (b)] If Y >= Z^{3/2} and X <= 1 <= Q/Z (for example X = 1, Y = Q = Z^2: lx = 0, ly = 2, h = 1,
r/h = 2), then I = f + O(Z^eps) for every coefficient vector with |x_c| <= 1.

*Proof of (a).* (t^2/s)(t^2/c) = 1 if (t, sc) = 1 and 0 otherwise, so
f = Q^{-1/2} Y^{-1} Z^{-1/2} sum_{s,c} W1(s/Y) x_c w(c/Z) T([s,c]), T(n) = sum_{(t,n)=1} Om(t^2/Q)
= kappa_Om Q^{1/2} sum_{d | n, d <= Q^{1/2}} mu(d)/d + O_A(tau(n) Q^{-A}) = kappa_Om Q^{1/2} phi(n)/n + O(tau(n)),
by Poisson summation in t. The O(tau) term contributes O(Q^{-1/2} Z^{1/2} (YZ)^eps). The s-sum is a Mellin integral of
D_c(w); the Euler factor at p not dividing 2c is 1 + (1 - 1/p) p^{-w}, at p | c it is (1 - 1/p)(1 + p^{-w}); the pole
at w = 1 gives c_0 h(c) and the line Re w = 1/2 + eps gives the remainder. Inserting x_c = mu(c) eta(c) and summing
over c gives the Euler product prod_p (1 - eta(p) k(p) p^{-s}) = H_Y(s)/L^{(2)}(s, eta). QED (sketch: the
interchange of the w-integral and the c-sum and the uniformity in c are standard and not written out.)

*Proof of (b).* For m_0 != 1 squarefree, (m_0/.) is a nonprincipal character of conductor dividing 4 m_0, and
A_{m_0 t^2} = (1/2 pi i) int W1^(w) Y^{w-1} L(w, chi_{m_0}) G_{m_0,t}(w) dw with G bounded by t^eps on Re w = 1/2 + eps
(G contains 1/L(2w, chi^2) and the local factors at 2 and p | t). Convexity gives |A_m| << Y^{-1/2 + eps} m_0^{1/4 + eps}
t^eps [CLASSICAL]. Heath-Brown's quadratic large sieve [CLASSICAL, 1995, Theorem 1] gives, for each t,
sum*_{m_0 ~ M_0} |A_{m_0 t^2}|^2 << (M_0 + Y) Y^{-1 + eps} and sum*_{m_0 ~ M_0} |B_{m_0 t^2}|^2 << (M_0 + Z)(M_0 Z)^eps,
the second for arbitrary |x_c| <= 1. Summing over t <= (Q/M_0)^{1/2} and dyadic M_0 with Cauchy-Schwarz:
the block M_0 contributes at most M_0^{-1/2} min(M_0^{3/4} Y^{-1/2}, ((M_0 + Y)/Y)^{1/2}) (M_0 + Z)^{1/2}. This is
<= Z^{1/2} Y^{-1/3} for M_0 <= min(Y, Z), <= 1 + (Z/Y)^{1/2} in between, and <= (M_0/Y)^{1/2} <= X^{1/2} for
M_0 >= max(Y, Z). QED (sketch: even m_0 and the sign of m are finitely many characters mod 8; not written.)

**Reading.** As Y grows, A_m tends to c_0 1_{m = square} times local factors: the mean of a nonprincipal quadratic
character over squarefree s is 0. The additive polynomial is a detector of square rows and nothing else. The order-2
probe is therefore not a comparison of two sums; it is the single sum sum_c x_c h(c) w(c/Z).

### 3.3 Theorem B (the low estimate is the conclusion)

**Theorem B [PROVED-sketch, relative to Theorem A; the last equivalence CLASSICAL].** Take the geometry of
Theorem A(c). Then for the order-2 probe with C(s) = s - 1/2:

(i) hypothesis (2.5) of Prop. 2.1 holds unconditionally, for every sigma_0 >= 1/2, with no detector, no row count
and no use of the coefficients beyond |x_c| <= 1;
(ii) hypothesis (2.4) at sigma_0, |I| << Z^{sigma_0 - 1/2 + omega}, holds if and only if
sum_c mu(c) eta(c) h(c) w(c/Z) << Z^{sigma_0 + omega}, which holds for every omega > 0 if and only if
L(s, eta) has no zero in Re s > sigma_0;
(iii) for any geometry, sum_{m = t^2} Om(m/Q) |B_m|^2 >= c Q^{1/2} |f|^2 (f the exact square-row part). So the
square-root level ||B||^2 << Q^{1 + eps} at row range Q = Z^M implies |f| << Z^{M/4 + eps}, that is (for M >= 2/3,
where the error term of Theorem A(a) is below Z^{M/4}), no zero in Re s > 1/2 + M/4.

So the map "abscissa assumed for the low estimate" -> "abscissa returned" is the identity: f(theta) = theta. The
value 1/2 + M/4 in (iii) is exactly the transplanted model abscissa sigma_0(2) = (1 - 1/r) + (M - 2l)/(2r) at r = 2,
l = 0 (`zf-higher-rows` Formula 3): the model abscissa is the hypothesis needed for its own low side.

*Proof.* (i) is Theorem A(c): |I - f| << Z^eps <= Z^{beta* - 1/2 - sigma} for any sigma < beta* - 1/2. (ii): I = f +
O(Z^eps), and by Theorem A(a) f is the inverse Mellin transform of w^(s) H_Y(s)/L^{(2)}(s, eta); the bound for all
large Z continues H_Y/L^{(2)} to Re s > sigma_0 + omega as in the proof of Prop. 2.1, and conversely a zero-free
half-plane gives the bound by a contour shift (1/L << |t|^eps there, Titchmarsh section 14.2 type argument).
(iii): Cauchy-Schwarz on the square rows with sum_{m = t^2} Om |A_m|^2 << Q^{1/2}. QED

Unconditional value. With the estimates of the system (Cauchy-Schwarz, Heath-Brown, convexity) the square rows can
only be bounded trivially, |B_{t^2}|^2 <= Z: ||B||^2 << Q + Q^{1/2} Z and ||A||^2 << Q/Y + Q^{1/2}, so
|I| << Z^{1/2} and B = 1. [PROVED]

### 3.4 Theorem C (self-duality)

**Theorem C [PROVED for coprime (s, c); PROVED-sketch for the gcd terms].** Poisson summation in m gives

  sum_m Om(m/Q) (m/sc) = Q (sc)^{-1/2} eps_{sc} sum_h (h/s)(h/c) Om^(hQ/(sc))        ((s, c) = 1),

so I(X, Y, Z; Q) is a finite combination (over classes of s, c mod 4 and a Mellin variable separating the weight) of
probes of the same form with row range Q' = YZ/Q, the same A-type and B-type factors and the same coefficient class
x_c. The rows h = a^2 of the dual carry the same f. The direct side and the Poisson side are one representation.

For r = 6 the dual of the sextic symbol is the conjugate symbol times a sextic Gauss sum, which is not a character
times a root of unity; the product (cubic theta coefficient) x (sextic Gauss sum) is mu x Hecke, and the reciprocal
is present on the Poisson side and absent on the reflected side. That asymmetry is the whole method. At order 2 the
Gauss sum is the Weil index eps_c, the Fourier transform preserves the class of second-degree characters (it is the
action of a Weyl element of the metaplectic group on the same theta kernel; Jacobi's inversion for the sum over
squares), and the asymmetry is zero. Exact evaluation of the Gauss sum is the obstruction, not a help.

### 3.5 Theorem D (parity)

**Theorem D.**
(i) [PROVED, = Theorem A for general x] Every estimate available for the order-2 probe is invariant under
x_c -> e_c x_c with arbitrary unimodular e_c: Theorem A(b) holds for all |x_c| <= 1, and the main term is the plain
weighted sum of the x_c. Hence no bound for I below Z^{1/2} follows from these estimates: x_c = |mu(c)| gives
I = c Z^{1/2}(1 + o(1)) with the same N. The system cannot separate mu from |mu| or from mu times any sign pattern.
This is the parity obstruction in its usual form (a method that is blind to the sign of mu on the integers it
weights), located at the square rows, where the row symbol is identically 1.
(ii) [PROVED identity; interpretation ARGUED] For a binary quadratic form a x^2 + b y^2 and an odd prime p not
dividing ab, the normalised Gauss sum p^{-1} sum_{x,y} e((a x^2 + b y^2)/p) equals (-ab/p) = chi_delta(p). So
mu(p) = (normalised quadratic Gauss sum of a fixed form) holds exactly at the primes inert in Q(sqrt delta). An
order-2 absorption identity exists on integers composed of inert primes, where mu = chi_delta. It covers almost all
primes up to Z only if chi_delta(p) = -1 for almost all p <= Z, which is the Siegel-zero configuration
(L(s, chi_delta) imitating zeta(2s)/zeta(s)). The order-2 architecture with a working absorption step is the
exceptional-character scenario; without an exceptional character the absorbed product is
prod_{p inert} (1 - eta(p) p^{-s}), the same function on both sides.

So the answer to "is the failure the parity barrier in disguise": yes for (i), as a proved statement about the
estimate system; and the classical link between quadratic characters and Siegel zeros is (ii).

---

## 4. Numerics [MEASURED]

`probe2.py` evaluates I, f, N exactly (double precision) for bump weights and four coefficient vectors: mu, |mu|,
random signs, mu chi_5. Five geometries; 6001 to 96001 rows.

| (Z, Y, Q) | x = mu: f, N | x = abs(mu): f, N | random signs: f, N | mean B^2 on non-square rows (mu / abs mu / random) | mean B^2 on square rows (mu / abs mu) |
|---|---|---|---|---|---|
| (4000, 4000, 4000) | -0.0088, -0.0021 | 0.391, 0.064 | -0.0196, -0.0041 | 0.097 / 0.084 / 0.096 | 0.041 / 70.8 |
| (16000, 4000, 16000) | -0.0054, -0.0009 | 0.780, -0.010 | -0.0073, -0.0004 | 0.098 / 0.085 / 0.098 | 0.018 / 282.6 |
| (16000, 16000, 16000) | -0.0054, 0.0005 | 0.782, 0.065 | -0.0073, -0.0011 | 0.098 / 0.085 / 0.098 | 0.018 / 282.6 |
| (16000, 16000, 64000) | -0.0056, -0.0008 | 0.782, 0.150 | -0.0073, -0.0020 | 0.099 / 0.101 / 0.098 | 0.019 / 283.1 |
| (30000, 3000, 30000) | 0.0042, -0.0003 | 1.070, -0.0001 | -0.0028, -0.0014 | 0.099 / 0.085 / 0.100 | 0.014 / 533.9 |

* f / (Z^{-1/2} sum_c x_c w(c/Z)) for x = |mu|: 0.03979, 0.03962, 0.03970, 0.03972, 0.03966: the constant c_0 times
  the mean of h, stable to 0.4 percent (Theorem A(a)).
* A_m on square rows: mean 0.1310 to 0.1316 in all five runs; rms of A_m on non-square rows times Y^{1/2}: 0.29 to
  0.32 (pole on squares; square-root size elsewhere).
* The non-square rows have the same mean square for mu, |mu| and random signs (coefficient-blind, Theorem D(i)).
  The square rows carry the plain sum: mean B^2 grows like Z for |mu| (70.8, 282.6, 533.9 at Z = 4000, 16000, 30000).
* |N| <= 0.15 in every run against f up to 1.07 for |mu|; for mu both are small, as they must be at this height.

The numerics check the decomposition and the blindness. They contain no information about zeros.

---

## 5. Mixed architectures and double covers of higher rank: model abscissae

Model abscissa = 1 - h/r_eff with the low side at the square-root level, at the best geometry. "Input" = what the
square-root-level low estimate is, as a statement.

| design | coherent set (exponent) | Gauss factor | model abscissa | input the model needs | status |
|---|---|---|---|---|---|
| pure order 2 (section 3) | squares (1/2) | Weil index eps_c (trivial class) | **1/2** at lx = 0, h = 1 | sum mu(c) eta(c) w(c/Z) << Z^{1/2 + omega}: GRH for the target (Theorem B(ii)) | circular; unconditional value 1 |
| pure order 2 with ZF(theta) as input | same | same | theta | ZF(theta) | fixed point f(theta) = theta [Theorem B] |
| conjugate pair chi(m_1) conj chi(m_2), both Poissoned | diagonal (1/2) | g conj g = N(a) (trivial class) | none: tautology | reflected side already [mu] | PROVED-rel `r2-zf-paired-rows` Thm D(i) |
| conjugate pair, one variable Poissoned | 1/r in the Poissoned variable | order r | >= 1 - 1/(2r) + l_2/(2r) (7/8 + l_2/8 at r = 4) | open order-r input | MODEL, `r2-zf-paired-rows` section 3 (row Z14) |
| quadratic x sextic rho(m_1) chi_6(m_2), both Poissoned | y_1/2 + y_2/6 | sextic (rho contributes a periodic factor) | 11/12 at y_1 = 0; no gain from y_1 > 0 | none new | MODEL, `r2-zf-paired-rows` Prop. E ("neutral") |
| order-2 rows weighted by a quadratic form: m = T[x], x in Z^n, weights r_T(m) (Siegel theta; Siegel-Weil evaluates r_T) | T[x] = t^2: (n-1)/n in x, 1/2 in m | Weil index | 1/2, same as pure order 2 | the same GRH-equivalent input | Lemma W below: weights are multiplicities |
| second-degree characters e(d T[x]/c), n even, coefficients independent of d | isotropic vectors T[x] = 0: (n-2)/n | Weil index; the d-sum is a Ramanujan sum | none: both sides are (Moebius sum) x (count of isotropic vectors) | none; the identity is target-independent | PROVED-sketch (Lemma R below) |
| sextic rows with h = 3 (marks longer than the X-range) | sixth powers (1/6), h = 3 | cubic theta | 1/2 | reflected energy without range loss at l - lx = 2: prime sums of GRH strength on the low side | HEURISTIC in `r3-method-limit` Thm 3(b); not treated here |

No design has a model abscissa below 5/6 together with a non-circular input list. The designs with model abscissa
below 5/6 (rows 1, 6, 8) need an input that is the conclusion (rows 1, 6: proved equivalence) or was already
classified as heuristically circular (row 8).

**Lemma W (representation-number weights are multiplicities) [PROVED-rel Theorem A].** For a positive definite
integral form T of rank n, I_T := sum_x Om(T[x]/Q) A_{T[x]} B_{T[x]} = sum_m r_T(m) Om(m/Q) A_m B_m. The square rows
carry sum_t r_T(t^2) A_{t^2} B_{t^2}, which by the proof of Theorem A(a) is again a smoothed sum of x_c with a
multiplicative weight (the local densities of T[x] = t^2 enter the Euler factors of the weight); the non-square rows
are bounded as in Theorem A(b) with r_T(m) << m^{n/2 - 1 + eps} as an extra weight. Signal and noise are both
multiplied by Q^{n/2 - 1}. The exponent (n-1)/n of the set {x : T[x] a square} counts preimages, not rows. Siegel-Weil
gives r_T (genus average) exactly; r_T was not the unknown.

**Lemma R (even rank: the reciprocal is a common scalar) [PROVED-sketch].** For rows
B_x = sum_c b_c sum_{d mod c}^* e(d T[x]/c) w(c/Z), n even, Poisson summation in x mod c gives the Weil index (a
character of c) times e(-conj(4d) T^*[k]/c), and the remaining d-sum is the Ramanujan sum c_c(T^*[k]). The condition
that the frequency rows carry mu(c) xi(c) forces b_c = mu(c) xi(c)/phi(c). Then on the direct side, with N = T[x] and
c squarefree, c_c(N)/phi(c) = mu(c/(c,N))/phi(c/(c,N)), so B_x = sum_c xi(c) mu((c,N)) w(c/Z)/phi(c/(c,N)): for N = 0
this is sum_c mu(c) xi(c) w(c/Z), and for N != 0 it is O(tau(N)) with no reciprocal. The same holds on the dual side
with T^*. Both sides equal (smoothed Moebius sum) x (weighted count of isotropic vectors) + O(small); the identity
between them is Poisson summation on the cone and does not involve the target. For n odd the d-sum is a quadratic
Gauss sum and the rows are quadratic characters chi_{T[x]}(c): this is the previous table row.

Common reason for all order-2 rows: the Weil representation makes the Fourier transform an automorphism of the class
of second-degree characters, with scalar an eighth root of unity times a quadratic character. A probe built from
such rows has the same form before and after Poisson summation.

---

## 6. Theorem E: effective order 2 is not reachable non-circularly in this estimate system

Estimate system. (R) Rows are residue symbols chi_a(m_1)^{e_1} ... chi_a(m_j)^{e_j} of order r in j row variables, or
second-degree characters of a quadratic form. (P) The second representation is Poisson summation in a subset S of the
row variables. (T) The principal frequency row carries mu(a) xi(a), xi Hecke times periodic. (L) The low estimate is
at or above the square-root level and uses no information on the zeros of the target family.

**Theorem E.** In such a system, effective order 2 with h <= 1 requires a coherent set of exponent 1/2 in the
Poissoned variables. Then:

(1) [PROVED-rel `r2-zf-paired-rows` Lemma B(iii)] exponent 1/2 occurs exactly when a Poissoned variable is quadratic
or two Poissoned variables form a conjugate pair (minimal solution vectors of 1-norm 2);
(2) [PROVED: Lemma 0 here; `r2-zf-paired-rows` Thm D(i),(iv)] the Gauss factor of those variables is a character
times a root of unity (g(rho) = eps sqrt q; g(psi) conj g(psi) psi(-1) = q);
(3) [PROVED for pure order 2 (Theorem A, C); PROVED-rel Thm D(i) there for pairs; PROVED-sketch for quadratic forms]
if all Poissoned variables are of this kind, (T) forces the coefficient class [mu] on the unreflected side, the
coherent rows of the unreflected side carry the same reciprocal with the same count, and (L) fails: every low
estimate at exponent e implies the zero-free statement the system would return from it;
(4) [MODEL, cited] if a variable of order >= 3 is Poissoned as well, the system is not circular, but each Poissoned
variable multiplies the family size by the modulus, and the count is never below the pure order-r value
(`r2-zf-paired-rows` Prop. C: two Poissoned variables give exponent >= 2; Prop. E: quadratic x sextic is neutral);
(5) [PROVED-rel Theorem A of `r2-zf-paired-rows`; Lemma W here] if the exponent-1/2 variables are not Poissoned, they
are fibres with multiplicity and the effective order is that of the Poissoned variables.

Hence the only designs in the system with r_eff = 2 and h <= 1 are those of (3), and they return f(theta) = theta.

Why. The 7/8 method needs a symbol whose Gauss sum is a new arithmetic function, so that mu can be exchanged for it
on one side only. The number of coherent frequencies is H^{1/r}; the Gauss sum is a new function only for r >= 3.
At r = 2 the count is maximal and the exchange is impossible; these are the same fact (the squares are the kernel of
a symbol that is its own inverse). Consistency check: no valid system can return less than 1/2 because zeros on the
line exist; r_eff = 2 is that boundary, and at the boundary the low estimate is tight if and only if GRH holds for
the target.

Not covered by Theorem E: option (b) of `r3-method-limit` Theorem 3 (h = r/2 with r >= 3 by long marks); a low
estimate below the square-root level; a second representation of an order-2 probe that is not Poisson summation
(for example a Kuznetsov-type formula on the double cover, where the sums over the modulus are Salie sums).

---

## 7. Controls

No zero-free statement is made, so no claim can transfer wrongly. What each control does to the order-2 system:

| control | Theorem A | consequence |
|---|---|---|
| DH | ARGUED: holds with the l^1 and l^2 norms of the coefficients of 1/F in place of Z (they are not bounded and not supported on squarefree c; not written); no step uses multiplicativity | (2.4) is false at the abscissa of its off-line zeros; the system returns its true supremum |
| HEAT | not formulable (no Dirichlet series in a fixed variable) | none |
| TW+, TW- | holds verbatim (Theorem D(i): arbitrary bounded x_c) | returns the supremum of zeros of the twisted Euler product |
| EA | ARGUED: holds in the same normed form (coefficients of size n^a); f has size Z^a | returns 1/2 + a |
| NR | holds; one local factor changed | returns 1/2 + arccosh(abs(c)/2)/log q |
| B | Jacobi symbols over Beurling integers are not defined | not formulable |

Structural reason the order-2 system does not separate zeta from the controls: its only non-trivial estimate
(Theorem A(b)) is coefficient-blind, and its main term is the coefficient sum itself. The sextic system separates at
the absorption identity (mu(pi) = -1 against a Jacobi sum, prime by prime) and at the cubic theta functional
equation; neither has an order-2 counterpart.

User's three requirements. All primes together: the order-2 probe uses all c <= 2Z, through the plain sum only.
Every height, every window: Prop. 2.1 is height-uniform, and Theorem B shows the order-2 instance is the classical
equivalence between the Moebius sum bound and the half-plane. Fails for the controls: it does not; it returns each
control's own abscissa. So the order-2 object supplies an identity (Jacobi inversion, the Weil index), not an
inequality. This is the same outcome as rows G14 and G18 of the map, reached from the zero-free side.

---

## 8. Three weakest steps

1. **Theorem A is a sketch in its error terms.** The uniformity in c of the s-sum, the treatment of even or
   negative m_0, the gcd terms (s, c) > 1 in Theorem C, and the interchange of integrals are standard and not
   written. The numerics support the decomposition at Z <= 30000 only. The exponent Y^{-1/3} in (b) is whatever
   convexity plus Heath-Brown gives and is not optimised; only "N is negligible for Y large" is used.
2. **The transplant is one design.** Section 3 fixes the order-2 probe by (6.2) with 6 -> 2 and Lemma 0. Lemma 0
   shows the coefficient class is forced once the rows are quadratic symbols and the second representation is Poisson
   summation; it does not exclude a different second representation (non-Poisson). Lemma R treats one natural
   quadratic-form design, with coefficients independent of d; other choices of the d-dependence were not enumerated
   beyond n odd (which reduces to quadratic characters).
3. **Rows 4, 5 and 8 of the table and items (4), (5) of Theorem E are cited, not re-derived.** They rest on
   `r2-zf-paired-rows` (refereed, with corrections that do not affect the cited statements) and on the heuristic part
   of `r3-method-limit` Theorem 3(b). Theorem D(ii)'s reading in terms of Siegel zeros is an interpretation of an
   exact identity, not a theorem about exceptional characters.

## 9. Verdict

Precise obstruction, as a statement about the estimate system. The order-2 architecture has model abscissa 1/2 and
its one input is equivalent to GRH for the target; unconditionally it gives Re s > 1. The failing step is the
absorption identity (quadratic Gauss sum = Weil index), which makes the Poisson representation identical to the
direct one and makes the exceptional coset of the additive norm (the square rows) equal to the signal. The failure
is the parity obstruction in the form of Theorem D(i). Mixed and higher-rank order-2 designs reduce to this case, to
multiplicities, or to row Z14. No architecture with model abscissa below 5/6 and a non-circular input list was
found. No pivot taken. Nothing is claimed about any zero. 7/8 (unrefereed) stands; RH open.
